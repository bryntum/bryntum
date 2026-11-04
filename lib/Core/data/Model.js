import Base from '../Base.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import DateHelper from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';

import TreeNode from './mixin/TreeNode.js';
import ModelLink from './mixin/ModelLink.js';
import DataField from './field/DataField.js';

// The built-in model field types:
import './field/ArrayDataField.js';
import './field/BooleanDataField.js';
import './field/DateDataField.js';
import './field/DurationUnitDataField.js';
import './field/IntegerDataField.js';
import './field/ModelDataField.js';
import './field/NumberDataField.js';
import './field/ObjectDataField.js';
import './field/StoreDataField.js';
import './field/StringDataField.js';

/**
 * @module Core/data/Model
 */

const
    nestedRe = /^(.*?)\.(.*)/,
    arrayRe  = /(.*)\[(.*)]\.?(.*)/, // NOSONAR
    warnings = new Set(),
    warnOnce = warning => {
        if (!warnings.has(warning)) {
            console.warn(warning);
            warnings.add(warning);
        }
    };

/**
 * Defines the properties of a relation between two stores.
 *
 * Used as the values of a Model's {@link Core.data.Model#property-relations-static} definition.
 *
 * This snippet will define a relation called `team`, allowing access to the foreign record via `player.team`. It will
 * point to a record in the `teamStore` (must be available as `record.firstStore.teamStore)` with an id matching the
 * players `teamId` field. The team record in turn, will have a field called `players` which is a collection of all
 * players in the team.
 *
 * ```javascript
 * class Player extends Model {
 *     static relations = {
 *         team : {
 *             foreignKey            : 'teamId',
 *             foreignStore          : 'teamStore',
 *             relatedCollectionName : 'players'
 *         }
 *     }
 * }
 * ```
 *
 * See {@link Core.data.Model#property-relations-static} for a more extensive example.
 *
 * @typedef {Object} RelationConfig
 * @property {String} foreignKey Name of a field on this model which holds the foreign key value.
 * @property {String|Core.data.Store} foreignStore Name of a property on the model's first store, which holds the
 * foreign store. Or the actual store instance
 * @property {String} [relatedCollectionName] Optionally, name of a property that will be added to the records of the
 * foreign store, which will hold all records from the model's store related to it.
 * @property {Boolean} [propagateRecordChanges] Set to `true` to propagate record changes (add, remove, update) to the
 * related records stores. The related stores will in turn trigger an update event which makes it possible for the UI
 * to react.
 */

const
    { defineProperty } = Reflect,
    { hasOwn }         = ObjectHelper,
    _undefined         = undefined,
    internalProps      = {
        children : 1,
        data     : 1,
        meta     : 1
    },
    abbreviationFields = [
        'name',
        'title',
        'text',
        'label',
        'description'
    ],
    fieldDataTypes = {
        boolean : 1,
        number  : 1,
        date    : 1,
        object  : 1,
        array   : 1
    },
    fieldsOrder = {
        parentId   : 1,
        $PhantomId : 2,
        id         : 3
    };

/**
 * A Model is the definition of a record which can be added to (or loaded into) a {@link Core.data.Store}. It defines
 * which fields the data contains and exposes an interface to access and manipulate that data. The Model data is
 * populated through simple a JSON object.
 *
 * By default, a Model stores a shallow copy of its raw json, but for records in stores configured with
 * `useRawData: true` it stores the supplied json object as is.
 *
 * ## Defining fields
 *
 * A Model can either define its fields explicitly (see {@link #property-fields-static}) or have them created from its
 * data (see {@link #property-autoExposeFields-static}). This snippet shows a model with 4 fields defined explicitly:
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         'name',
 *         { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' },
 *         { name : 'shoeSize', type : 'number', defaultValue : 11 },
 *         { name : 'age', readOnly : true }
 *     ]
 * }
 * ```
 *
 * The first field (name) has an unspecified type, which means the field's value is held as received with no conversion
 * applied. The second field (birthday) is defined to be a date, which will make the model parse any supplied value into
 * an actual date. The parsing is handled by {@link Core/helper/DateHelper#function-parse-static DateHelper.parse()}
 * using the specified `format`, or if no format is specified using
 * {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat}.
 *
 * While defining `fields` on {@link Core.data.Model} in TypeScript, data fields should be of type `ModelFieldConfig`
 * instead of `DataField`, because it is a union type that gives completion based on specified type.
 *
 * ```typescript
 * class Person extends Model {
 *     static fields: ModelFieldConfig[] = [
 *         'name',
 *         { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' },
 *         { name : 'shoeSize', type : 'number', defaultValue : 11 },
 *         { name : 'age', readOnly : true }
 *     ]
 * }
 * ```
 *
 * The set of standard field types is as follows:
 *
 *  - {@link Core.data.field.ArrayDataField `array`}
 *  - {@link Core.data.field.BooleanDataField `boolean`}
 *  - {@link Core.data.field.DateDataField `date`}
 *  - {@link Core.data.field.IntegerDataField `integer`}
 *  - {@link Core.data.field.ObjectDataField `object`}
 *  - {@link Core.data.field.NumberDataField `number`}
 *  - {@link Core.data.field.StoreDataField `store`}
 *  - {@link Core.data.field.StringDataField `string`}
 *
 * You can also set a `defaultValue` that will be used if the data does not contain a value for the field:
 *
 * ```javascript
 * { name : 'shoeSize', type : 'number', defaultValue : 11 }
 * ```
 *
 * Defining a field with a `name` containing a `.` will by default point to a nested object in the data. If you have a
 * data property that actually contains a `.` in the name, also configure `complexMapping : false` on the field:
 *
 * ```javascript
 * class Organization extends Model {
 *     static fields = [
 *         // Points to { "org" : { "name" : "..." } } in the data
 *         { name : 'org.name' },
 *         // Points to { "org.address" : "..." } in the data
 *         { name : 'org.address', complexMapping : false }
 *     ]
 * }
 * ```
 *
 * ## Creating a record
 *
 * To create a record from a Model, supply data to its constructor:
 *
 * ```javascript
 * const guy = new Person({
 *     id       : 1,
 *     name     : 'Dude',
 *     birthday : '2014-09-01'
 * });
 * ```
 *
 * If no id is specified, a temporary id based on a UUID will be generated. This id is not meant to be serialized, it
 * should instead be replaced by the backend with a proper id from the underlying database (or similar).
 *
 * Please avoid using reserved names for your fields (such as `parent`, `children` and others that are used as Model
 * properties) to avoid possible data collisions and bugs. See the **Reserved field names** section below.
 *
 * {@note}When adding data to a Store, you do normally not need to create records manually. The store does that for you
 * when you add a data object to it{/@note}
 *
 * ## Reserved field names
 *
 * A field name must not collide with a name that Model itself uses. Two groups of names are reserved:
 *
 * - Model's own properties, such as `parent`, `children`, `data` and `meta`.
 * - The members of JavaScript's `Object.prototype`, which every object inherits:
 *   `constructor`, `hasOwnProperty`, `isPrototypeOf`, `propertyIsEnumerable`, `toLocaleString`, `toString` and
 *   `valueOf`.
 *
 * A field with one of these names is not supported, because the field lookup resolves such a name to the inherited
 * `Object.prototype` member rather than to a field definition. A field named after an `Object.prototype` member is
 * refused with:
 *
 * ```
 * "toString" is a reserved field name (a member of Object.prototype). Use a different field name and read the raw
 * data property with dataSource : 'toString'.
 * ```
 *
 * This is raised when the class is first used, and also when a store auto-generates fields from data that happens to
 * contain such a property — so data carrying a `toString` property is enough to make store creation throw.
 *
 * ### Reserved names passed to Model's by-name functions
 *
 * The error above covers field *definitions*. A reserved name can still reach Model's by-name functions at runtime,
 * from a column `field`, a sorter, a filter or application code. Those names are not supported there either, and are
 * not refused — the lookup resolves them to the inherited `Object.prototype` member. On a record with no such field:
 *
 * ```javascript
 * record.get('toString');              // The Object.prototype.toString function, not undefined
 * record.getValue('toString');         // The record's own toString method
 * record.isFieldModified('toString');  // true, for any record that has changes
 * record.getUnmodified('toString');    // The Object.prototype.toString function
 * record.hasBatchedChange('toString'); // Truthy while a batch is open
 *
 * record.set('toString', 'a value');   // Throws "cmp.isEqual is not a function"
 * record.setValue('toString', 'a value'); // Replaces the record's own toString method with the string
 * ```
 *
 * Use a field with a safe `name` and a `dataSource` pointing at the raw property instead, as described below.
 *
 * ### Remapping a reserved name with `dataSource`
 *
 * The restriction applies to the *field name*, not to the incoming data. If your backend sends a property with a
 * reserved name, give the field a safe name and point it at the raw property using
 * {@link Core/data/field/DataField#config-dataSource}:
 *
 * ```javascript
 * class Product extends Model {
 *     static fields = [
 *         'name',
 *         // The raw data has a "toString" property, which cannot be used as a field name.
 *         // Expose it as "label" instead:
 *         { name : 'label', dataSource : 'toString' }
 *     ];
 * }
 *
 * const product = new Product({
 *     id       : 1,
 *     name     : 'Widget',
 *     toString : 'A nice widget'
 * });
 *
 * product.label;         // > 'A nice widget'
 * product.label = 'Nicer widget'; // Updates the "toString" property of the raw data
 * ```
 *
 * The record's `data` object keeps the original property name, so the value is read and written back to the server
 * unchanged — only the name you use in your application code differs.
 *
 * {@note}The remap assumes the raw property is present in the data of every record. If it may be absent, the field
 * currently reads back the inherited `Object.prototype` member (a function) instead of `undefined`, and
 * {@link Core/data/field/DataField#config-defaultValue} does not work around that. `constructor` is not supported
 * even via `dataSource`, since its value is dropped when the record's data is cloned on construction.{/@note}
 *
 * ## Calculated fields
 *
 * A field value can also be calculated using the other data fields, using the
 * {@link Core/data/field/DataField#config-calculate} config.
 *
 * ```javascript
 * const store = new Store({
 *     fields : [
 *         { name : 'revenue', type : 'number' },
 *         { name : 'tax', type : 'number' },
 *         { name : 'net', calculate : record => record.revenue * (1 - (record.tax / 100)) }
 *     ],
 *     data : [
 *         { id : 1, revenue : 100, tax : 30 }
 *     ]
 * });
 *
 * const record = store.getById(1).net; // 70
 * ```
 *
 * ## Nested fields
 *
 * Model supports mapping fields to nested data structures using dot `.` separated paths as the `dataSource`. For
 * example given this JSON object:
 *
 * ```json
 * {
 *     name : 'Borje Salming',
 *     team : {
 *         name   : 'Toronto Maple Leafs',
 *         league : 'NHL'
 *     }
 * }
 * ```
 *
 * A field can be mapped to the nested team name by using `dataSource : 'team.name'`:
 *
 * ```javascript
 * class Player extends Model {
 *     static fields = [
 *         'name',
 *         // Field mapped to a property on a nested object
 *         { name : 'teamName', dataSource : 'team.name' }
 *     ];
 * }
 * ```
 *
 * Usage:
 *
 * ```javascript
 * const player = new Player(json);
 *
 * console.log(player.teamName); // > Toronto Maple Leafs
 * player.teamName = 'Minnesota Wild'; // Updates name property of the team object
 * ```
 *
 * Alternatively, you can define the top level of the nested object as a field of type `object`:
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         'name',
 *         // Nested object
 *         { name : 'address', type : 'object' }
 *     ];
 * }
 * ```
 *
 * You can then access properties of the nested object using dot notation with the {@link #function-get} function:
 *
 * ```javascript
 * const person = new Person({
 *    name    : 'Borje Salming',
 *    address : {
 *        city : 'Toronto'
 *    }
 * });
 *
 * person.get('address.city'); // > Toronto
 * ```
 *
 * ### Updating a nested object
 *
 * Note that directly altering a property of the nested object won't register as an update of the record, record does
 * not track changes deeply. If nested fields (as described above) is not enough for your usecase you can map a field
 * directly to the nested object and then assign a shallow copy of it to the record on changes:
 *
 * ```javascript
 * class Player extends Model {
 *     static get fields() {
 *         return [
 *             ...,
 *             // Field mapped directly to the nested object
 *             { name : 'team', type : 'object' }
 *         ]
 *     }
 * }
 *
 * // "External object" to nest
 * const team = {
 *     name   : 'Brynas',
 *     league : 'SHL'
 * }
 *
 * const player = new Player({
 *     name : 'Borje Salming',
 *     team
 * });
 *
 * // This will not flag player as dirty
 * team.league = 'CHL';
 *
 * // Instead you have to reassign the mapped field
 * player.team = { ...player.team };
 * ```
 *
 * You can also use the {@link #function-set} function to update a property of the nested object:
 *
 * ```javascript
 * // This will flag player as dirty
 * player.set('team.name', 'BIF');
 * ```
 *
 * ## Arrays of atomic types
 *
 * When a field holds an array of atomic types (strings, numbers etc.) we recommend using the
 * {@link Core/data/field/ArrayDataField `array`} type for the field:
 *
 * ```javascript
 * class GroceryList extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'items', type : 'array' }
 *         ];
 *     }
 * }
 *
 * const list = new GroceryList({
 *    name  : 'My list',
 *    items : ['Milk', 'Bread', 'Eggs']
 * });
 * ```
 *
 * {@note}Modifying items in the array will not flag the field as updated, since the array itself does not
 * change. For it to register a change, you must assign it a new array (could be a copy of the old one). For more info,
 * see {@link Core/data/field/ArrayDataField}{/@note}
 *
 * ## Arrays of objects
 *
 * When a field holds an array of objects, we recommend using the {@link Core/data/field/StoreDataField `store`} type
 * for the field:
 *
 * ```javascript
 * class GroceryList extends Model {
 *     static fields = [
 *         'name',
 *         { name : 'items', type : 'store', storeClass : Store }
 *     ]
 * }
 *
 * const list = new GroceryList({
 *    name  : 'My list',
 *    items : [
 *        { name : 'Milk', quantity : 1 },
 *        { name : 'Bread', quantity : 2 },
 *        { name : 'Eggs', quantity : 12 }
 *    ]
 * });
 * ```
 *
 * The `items` field on the `list` above will be a {@link Core.data.Store} instance (because we passed that as
 * `storeClass`), which can be used to manipulate the items in the list. Doing so will flag the `list` as modified. For
 * more info, see {@link Core.data.field.StoreDataField} and the [Store type fields](#Core/guides/data/storefields.md)
 * guide. For cheaper undo/redo and change tracking of large nested stores, see
 * {@link Core.data.stm.StateTrackingManager#config-trackStoreDataFields}.
 *
 * ## Persisting fields
 *
 * By default, all fields are persisted. If you don't want particular field to get saved to the server, configure it
 * with `persist: false`. In this case field will not be among changes which are sent by
 * {@link Core/data/AjaxStore#function-commit store.commit()}, otherwise its behavior doesn't change.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'age', persist : false }
 *         ];
 *     }
 * }
 * ```
 *
 * ## The `id` field
 * By default Model expects its id field to be stored in a data source named "id". The data source for the id field can
 * be customized by setting {@link Core/data/field/DataField#config-dataSource} on the id field object configuration.
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         { name : 'id', dataSource: 'personId'},
 *         'name',
 *         { name : 'age', persist : false },
 *         { name : 'birthday', type : 'date' }
 *      ];
 * }
 *
 * let girl = new Person({
 *     personId : 2,
 *     name     : 'Lady',
 *     birthday : '2011-11-05'
 * });
 * ```
 *
 * Also, it is possible to change the id field data source by setting {@link #property-idField-static}:
 *
 * ```javascript
 * class Person extends Model {
 *     // Id drawn from 'id' property by default; use custom field here
 *     static idField = 'personId';
 *
 *     static fields = [
 *         'name',
 *         { name : 'age', persist : false },
 *         { name : 'birthday', type : 'date' }
 *     ];
 * }
 * ```
 *
 * ## Getting and setting values
 *
 * Fields are used to generate getters and setters on the records. Use them to access or modify values (they are
 * reactive):
 *
 * ```javascript
 * console.log(guy.name);
 * girl.birthday = new Date(2011,10,6);
 * ```
 *
 * NOTE: In an application with multiple different models you should subclass Model, since the prototype is decorated
 * with getters and setters. Otherwise, you might get unforeseen collisions.
 *
 * ## Field data mapping
 *
 * By default, fields are mapped to data using their name. If you for example have a "name" field it expects data to be
 * `{ name: 'Some name' }`. If you need to map it to some other property, specify `dataSource` in your field definition:
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         { name : 'name', dataSource : 'TheName' }
 *     ];
 * }
 *
 * // This is now OK:
 * let dude = new Person({ TheName : 'Manfred' });
 * console.log(dude.name); // --> Manfred
 * ```
 *
 * NOTE: Do not modify fields using `dataSource`, as it is intended only for reading and writing from the raw data object.
 * Fields should be modified using `name` as it is the public interface.
 *
 * ## Field inheritance
 *
 * Fields declared in a derived model class are added to those from its superclass. If a field declared by a derived
 * class has also been declared by its super class, the field properties of the super class are merged with those of
 * the derived class.
 *
 * For example:
 * ```javascript
 *  class Person extends Model {
 *      static fields = [
 *          'name',
 *          { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' }
 *      ];
 *  }
 *
 *  class User extends Person {
 *      static fields = [
 *          { name : 'birthday', dataSource : 'dob' },
 *          { name : 'lastLogin', type : 'date' }
 *      ];
 *  }
 * ```
 *
 * In the above, the `Person` model declares the `birthday` field as a `date` with a specified `format`. The `User`
 * model extends `Person` and also declares the `birthday` field. This redeclared field only specifies `dataSource`, so
 * all the other fields are preserved from `Person`. The `User` model also adds a `lastLogin` field.
 *
 * Note that later accessing `Person.fields` will refer to the block of two fields defined above (birthday & lastLogin),
 * not to all fields available (name, birthday, lastLogin). To access all fields, use {@link #property-allFields-static}
 * on the Model class instead, or the {@link #property-fields} property on a record (instance).
 *
 * The `User` from above could have been declared like so to achieve the same `fields`:
 *
 * ```javascript
 *  class User extends Model {
 *      static fields = [
 *          'name',
 *          { name : 'birthday', type : 'date', format : 'YYYY-MM-DD', dataSource : 'dob' },
 *          { name : 'lastLogin', type : 'date' }
 *      ];
 *  }
 * ```
 *
 * ## Override default values
 *
 * In case you need to define default value for a specific field, or override an existing default value, you can
 * define a new or re-define an existing field definition in {@link #property-fields-static} static getter:
 *
 * ```javascript
 * class Person extends Model {
 *     static fields = [
 *         { name : 'username', defaultValue : 'New person' },
 *         { name : 'birthdate', type : 'date' }
 *     ];
 * }
 *
 * class Bot extends Person {
 *     static fields = [
 *         { name : 'username', defaultValue : 'Bot' } // default value of 'username' field is overridden
 *     ];
 * }
 * ```
 *
 * ## Changing default field values
 *
 * Default values for fields can also be changed using {@link #function-applyDefaults-static}. This should be
 * called before data is loaded into stores, to ensure new instances pick up the updated defaults:
 *
 * ```javascript
 * // Change the default value of the 'name' field for all new UserModel instances
 * UserModel.applyDefaults({ name : 'New user' });
 *
 * const user = new UserModel();
 * console.log(user.name); // 'New user'
 * ```
 *
 * This works alongside config defaults — both field and config defaults can be set in a single call.
 *
 * ## Read-only records
 *
 * Model has a default field called {@link #field-readOnly}, which is used to make the record read-only in the UI while
 * still allowing programmatic changes to it. Setting it to `true` will prevent it from being edited by the built-in
 * editing features (cell editing in Grid, event dragging in Scheduler, task editor in Gantt etc.). Please note that it
 * is not made read-only on the data level, the record can still be manipulated by application code.
 *
 * ```javascript
 * // Prevent record from being manipulated by the user
 * record.readOnly = true;
 *
 * // Programmatic manipulation is still allowed
 * record.remove();
 * ```
 *
 * ## Tree API
 *
 * This class mixes in the {@link Core/data/mixin/TreeNode} mixin which provides an API for tree related
 * functionality (only relevant if your store is configured to be a {@link Core/data/Store#config-tree}).
 *
 * ## Useful configs and properties
 *
 * | Config / Property                  | Description                                   |
 * |------------------------------------|-----------------------------------------------|
 * | {@link #property-fields-static}    | Field definitions for the model               |
 * | {@link #property-idField-static}   | Name of the id field, default `'id'`          |
 * | {@link #function-get}              | Read a field value, supports dot paths         |
 * | {@link #function-set}              | Update one or more field values                |
 * | {@link #property-isModified}       | `true` when record has uncommitted changes     |
 * | {@link #property-relations-static} | Define foreign-key relations between stores    |
 *
 * ## See also
 *
 * - {@link Core.data.Store} - Data container that holds a collection of records
 * - {@link Core.data.field.DataField} - Base class for field type definitions
 * - {@link Core.data.mixin.TreeNode} - Tree node API mixed into Model
 *
 * @extends Core/Base
 *
 * @mixes Core/data/mixin/ModelLink
 * @mixes Core/data/mixin/TreeNode
 * @mixes Core/data/stm/mixin/ModelStm
 */
export default class Model extends Base.mixin(

    TreeNode,
    ModelLink
) {

    /**
     * Class name getter.
     * Used when original ES6 class name is minified or mangled during production build.
     * Should be overridden in each class which extends Model or it descendants.
     *
     * ```javascript
     * class MyNewClass extends Model {
     *     static $name = 'MyNewClass';
     * }
     * ```
     *
     * @static
     * @member {String} $name
     * @advanced
     */
    static $name = 'Model';

    static get declarable() {
        return [
            /**
             * Array of defined fields for this model class. Subclasses add new fields by implementing this static
             * getter:
             *
             * ```javascript
             * // Model defining two fields
             * class Person extends Model {
             *     static get fields() {
             *         return [
             *             { name : 'username', defaultValue : 'New person' },
             *             { name : 'birthdate', type : 'date' }
             *         ];
             *     }
             * }
             *
             * // Subclass overriding one of the fields
             * class Bot extends Person {
             *     static get fields() {
             *         return [
             *             // Default value of 'username' field is overridden, any other setting from the parents
             *             // definition is preserved
             *             { name : 'username', defaultValue : 'Bot' }
             *         ];
             *     }
             * }
             * ```
             *
             * Fields in a subclass are merged with those from the parent class, making it easy to override mappings,
             * formats etc.
             *
             * Note that later accessing `Bot.fields` will refer to the block with the redefinition of the `username`
             * field seen above, not to all fields available (username, birthdate). To access all fields, use either
             * {@link #property-allFields-static} on the Model class, or the {@link #property-fields} property on a
             * record.
             *
             * @member {Array<String|ModelFieldConfig|Core.data.field.DataField>} fields
             * @readonly
             * @static
             * @category Fields
             */
            'fields'
        ];
    }

    static get fields() {
        return [
            // The index of this item in its parent (respects filtering)
            {
                name     : 'parentIndex',
                type     : 'number',
                persist  : false,
                internal : true
            },

            // The index of this item in its parent ghost (non-sortable) children array
            {
                name     : 'orderedParentIndex',
                type     : 'number',
                persist  : false,
                internal : true
            },

            /**
             * Flag the record as read-only on the UI level, preventing the end user from manipulating it using editing
             * features such as cell editing and event dragging.
             *
             * Does not prevent altering the record programmatically, it can still be manipulated by application code.
             *
             * For more info, see the "Read-only records" section above.
             *
             * @field {Boolean} readOnly
             * @category Common
             */
            {
                name : 'readOnly',
                type : 'boolean'
            },

            /**
             * Start expanded or not (only valid for tree data)
             * @readonly
             * @field {Boolean} expanded
             * @category Tree
             */
            {
                name     : 'expanded',
                internal : true,
                persist  : false
            },

            // For AI
            {
                name        : 'id',
                description : 'The unique identifier'
            }
        ];
    }

    /**
     * Override in a subclass of Model to define relations to records in other stores.
     *
     * Always defined on the "one" side, not the "many" side.
     *
     * Expects an object where keys are relation names and values are {@link #typedef-RelationConfig relation configs}.
     *
     * This snippet will define a relation called `team`, allowing access to the foreign record via `player.team`. It
     * will point to a record in the `teamStore` (must be available as `record.firstStore.teamStore)` with an id
     * matching the players `teamId` field. The team record in turn, will have a field called `players` which is a
     * collection of all players in the team.
     *
     * ```javascript
     * class Player extends Model {
     *     static relations = {
     *         // Define a relation between a player and a team
     *         team : {
     *             foreignKey            : 'teamId',
     *             foreignStore          : 'teamStore',
     *             relatedCollectionName : 'players'
     *         }
     *     }
     * }
     *
     * const teamStore = new Store({
     *     data : [
     *         { id : 1, name : 'Brynas' },
     *         { id : 2, name : 'Leksand' }
     *     ]
     * });
     *
     * const playerStore = new Store({
     *     modelClass : Player,
     *     // Matches foreignStore, allowing records of playerStore to find the related store
     *     teamStore,
     *     data       : [
     *         // teamId is specified as foreignKey, will be used to match the team
     *         { id : 1, name : 'Nicklas Backstrom', teamId : 1  },
     *         { id : 2, name : 'Elias Lindholm',   teamId : 1  },
     *         { id : 3, name : 'Filip Forsberg',  teamId : 2  }
     *     ],
     * }
     *
     * playerStore.first.team.name // > Brynas
     * playerStore.last.team.name // > Leksand
     * teamStore.first.players // > [nick, elias]
     * teamStore.last.players // > [filip]
     * ```
     *
     * To access the related record from the many side, use dot notation for the field name. For example in a Grid
     * column:
     *
     * ```javascript
     * const grid = new Grid({
     *    store : playerStore,
     *    columns : [
     *        { field : 'name', text : 'Name' },
     *        { field : 'team.name', text : 'Team' }
     *    ]
     * });
     * ```
     *
     * @member {Object<String,RelationConfig>} relations
     * @static
     */
    static relations = null;

    /**
     * Template static getter which is supposed to be overridden to define default field values for the Model class.
     * Overrides `defaultValue` config specified by the {@link #property-fields-static} getter.
     * Returns a named object where key is a field name and value is a default value for the field.
     *
     * NOTE: This is a legacy way of defining default values, we recommend using {@link #property-fields-static} moving
     * forward.
     *
     * ```javascript
     * class Person extends Model {
     *     static get fields() {
     *         return [
     *             { name : 'username', defaultValue : 'New person' }
     *         ];
     *     }
     * }
     *
     * class Bot extends Person {
     *     static get defaults() {
     *         return {
     *             username : 'Bot' // default value of 'username' field is overridden
     *         };
     *     }
     * }
     * ```
     *
     * @member {Object} defaults
     * @static
     * @category Fields
     */
    // <remove-on-release>
    // TODO: deprecate in 7.0 in favor of static fields getter
    // static get defaults() {
    //     return {};
    // }
    // </remove-on-release>

    /**
     * The data source for the id field which provides the ID of instances of this Model.
     * @member {String}
     * @category Fields
     */
    static set idField(idField) {
        this._assignedIdField = true;
        this._idField = idField;
    }

    static get idField() {
        return this._idField;
    }

    get id() {
        // Id is cached for faster access, since it is used a lot especially during record creation
        return this._id ?? this.getData('id');
    }

    set id(id) {
        this.set('id', id);
    }

    /**
     * The name of the data field which holds children of this Model when used in a tree structure
     * ```javascript
     * MyModel.childrenField = 'kids';
     * const parent = new MyModel({
     *     name : 'Dad',
     *     kids : [
     *         { name : 'Daughter' },
     *         { name : 'Son' }
     *     ]
     * });
     * ```
     * @member {String}
     * @category Fields
     */
    static set childrenField(childrenField) {
        this._childrenField = childrenField;
    }

    static get childrenField() {
        if (!this._childrenField) {
            const dataField = this.fieldMap.children;
            this._childrenField = dataField?.dataSource || 'children';
        }
        return this._childrenField;
    }

    /**
     * Returns index path to this node. This is the index of each node in the node path
     * starting from the topmost parent. (only relevant when its part of a tree store).
     * @member {Number[]} indexPath
     * @readonly
     * @returns {Number[]} The index of each node in the path from the topmost parent to this node.
     * @category Parent & children
     * @private
     */
    get indexPath() {
        const indices = [];

        let node = this,
            depth = node.childLevel;

        for (node = this; node && !node.isRoot; node = node.parent) {
            indices[depth--] = node.parentIndex + 1;
        }

        return indices;
    }

    /**
     * Unique identifier for the record. Might be mapped to another dataSource using idField, but always exposed as
     * record.id. Will get a generated value if none is specified in records data.
     *
     * {@note}Note that generated ids are meant to be temporary (phantom ids), they should not be serialized
     * but instead replaced by the backend on commit{/@note}
     *
     * @field {String|Number} id
     * @category Common
     */

    /**
     * Reports `true` when the record is a parent record generated by the TreeGroup feature.
     *
     * {@note}Only valid for stores used with {@link Grid.feature.TreeGroup} feature enabled.{/@note}
     * @member {Boolean} generatedParent Truthy flag for a generated parent record
     * @readonly
     * @category Identification
     */

    /**
     * Holds the value that a generated group parent represents when using the TreeGroup feature.
     *
     * {@note}Only valid for stores used with {@link Grid.feature.TreeGroup} feature.{/@note}
     * @member {*} key Gouping key identifier for a record
     * @readonly
     * @category Identification
     */

    //region Init

    /**
     * Constructs a new record from the supplied data config.
     * @param {Object} [config] Raw model config
     * @param {Core.data.Store} [store] Data store
     * @param {Object} [meta] Meta data
     * @privateparam {Boolean} [skipExpose] Skip exposing properties from data
     * @privateparam {Boolean} [forceUseRaw] Force using raw data, used by copy to not clone data twice
     * @function constructor
     * @category Lifecycle
     */
    construct(config = {}, store = null, meta = null, skipExpose = false, forceUseRaw = false, rawData = false) {
        const
            me                        = this,
            { constructor, fieldMap } = me;

        me.meta = {
            modified : {},
            ...constructor.metaConfig,
            ...meta
        };

        // Should apply configs?
        if (constructor.applyConfigs) {
            const configs = {};

            if (!me.useRawData || !me.useRawData.enabled) {
                // Shallow copy of data to not mutate incoming object
                config = { ...config };
            }

            const defaultConfig = me.getDefaultConfiguration();

            // Here we split provided object into two: configs and fields. If we're auto-exposing fields, then we should
            // make everything which is specifically not a config into a field, so we read default configuration and
            // remove all defined configs from the passed object.
            // If we're not auto-exposing fields, then we take predefined set of fields and remove those from the passed
            // object, making everything else a config.
            // This is mostly required for ProjectModel, because it also triggers events and allows providing listeners
            // using `on...` config. And probably even more. At the same time it does not make sense for Project to have
            // autoExposed fields.
            // https://github.com/bryntum/bryntum/issues/7457
            if (constructor.autoExposeFields) {
                // Extract from data and combine with defaultConfigs
                for (const key in defaultConfig) {
                    // Loop through configs excluding fields
                    if (key in config) {
                        // Let defaults override any config supplied with an `undefined` value
                        if (config[key] !== undefined) {
                            // Use as config
                            configs[key] = config[key];
                        }

                        // Always remove config from data
                        delete config[key];
                    }
                }
            }
            else {
                for (const key in config) {
                    if (!(key in constructor.fieldMap)) {
                        if (config[key] === undefined) {
                            // In GanttBase class we generate a default config for project model which includes
                            // `undefined` values for most configs, like `eventStore`. Previous logic replaced `undefined`
                            // with default value. If we do not do that, providing `tasks` config to a project will
                            // throw, because `eventStore` will be undefined
                            configs[key] = defaultConfig[key];
                        }
                        else {
                            configs[key] = config[key];
                        }
                        delete config[key];
                    }
                }
            }

            super.construct(configs);
        }

        // No super call here on purpose, does not use the config system

        // make getters/setters for fields, needs to be done before processing data to make sure defaults are available
        if (!skipExpose) {
            constructor.exposeProperties(config, rawData);
        }

        // It's only valid to do this once, on construction of the first instance
        if (!hasOwn(constructor, 'idFieldProcessed')) {
            // idField can be overridden from meta, or from the store if we have not had an idField set programmatically
            // and if we have not had an id field defined above the base Model class level.

            let overriddenIdField = me.meta.idField;

            if (!overriddenIdField) {
                // Might have been set to Model after construction but before load
                if (constructor._assignedIdField) {
                    overriddenIdField = constructor.idField;
                }
            }

            // If it's overridden to something different than we already have, replace the 'id' field in the fieldMap
            if (overriddenIdField && overriddenIdField !== fieldMap.id.dataSource) {
                constructor.addField({
                    name       : 'id',
                    dataSource : overriddenIdField,
                    internal   : true
                });
            }
            // Model.idField should always reflect the idField mapping
            constructor._idField = fieldMap.id.dataSource;
            constructor.idFieldProcessed = true;
        }

        // assign internalId, unique among all records
        me._internalId = Model._internalIdCounter++;

        // Superclass constructors may set this in their own way before this is called.
        if (!me.originalData) {
            me.originalData = config;
        }

        const data = constructor.processData(config, false, store, me, forceUseRaw);

        // Cache id for faster access
        me._id = fieldMap.id.complexMapping ? ObjectHelper.getPath(data, constructor._idField) : data[constructor._idField];

        // Assign any intiable value last, so that it can reference this record if needed
        me.meta.initableValues?.size && me.assignInitables();

        // Consider undefined and null as missing id and generate one
        if (me._id == null && !(constructor.allowNullId && me._id === null)) {
            // Assign a generated id silently, record should not be considered modified
            me.setData('id', me.generateId(store));
        }

        if (data[constructor.childrenField]) {
            me.processChildren(ArrayHelper.asArray(store) ?? []);
        }
        me.generation = 0;
    }

    /**
     * Set this property to `true` when adding a record on a conditional basis, that is, it is yet
     * to be confirmed as an addition.
     *
     * When this is set, the {@link #property-isPersistable} value of the record is **false**, and upon being
     * added to a Store it will *not* be eligible to be synced with the server as an added record.
     *
     * Subsequently, *clearing* this property means this record will become persistable and eligible
     * for syncing as an added record.
     * @member {Boolean}
     * @category Editing
     */
    set isCreating(isCreating) {
        const me = this;

        // A no-change must not have any effect.
        if (Boolean(me.meta.isCreating) !== isCreating) {
            // This flag contributes to the evaluation of isPersistable.
            // A record is not persistable if it isCreating.
            me.meta.isCreating = isCreating;

            // Owning Stores may have things to do at this lifecycle point
            me.stores?.forEach(s => s.onIsCreatingToggle(me, isCreating));
        }
    }

    get isCreating() {
        return Boolean(this.meta.isCreating);
    }

    /**
     * Compares this Model instance to the passed instance. If they are of the same type, and all fields
     * (except, obviously, `id`) are equal, this returns `true`.
     * @param {Core.data.Model} other The record to compare this record with.
     * @returns {Boolean} `true` if the other is of the same class and has all fields equal.
     * @category Misc
     */
    equals(other) {
        if (other instanceof this.constructor) {
            for (let fields = this.$meta.fields.defs, i = 0, { length } = fields; i < length; i++) {
                const
                    field    = fields[i],
                    { name } = field;

                if (name !== 'id' && !field.isEqual(this.getValue(name), other.getValue(name))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    // get subclass() {
    //     return new this.constructor(Object.setPrototypeOf({
    //         id : _undefined
    //     }, this.data), this.stores[0], null, true);
    // }

    /**
     * Processes raw data, converting values and setting defaults.
     * @private
     * @param {Object} data Raw data
     * @param {Boolean} [updating] Ignore setting default values, used when updating
     * @returns {Object} Processed data
     * @category Fields
     */
    static processData(data, updating = false, store = null, record = null, forceUseRaw = null) {
        const
            me           = this,
            {
                defaults,
                chronoProps
            }            = me.$meta.fields,
            { useRawData = { enabled : false } } = store || { },
            // Store configured with useRawData uses the supplied data object, polluting it. When not configured with
            // useRawData it instead makes a copy (intentionally deep, in case data has a prototype chain or contains
            // arrays or objects)
            processed    = (forceUseRaw || useRawData.enabled) ? data : ObjectHelper.clone(data),
            isChrono     = Boolean(record.$entity);

        if (record.isConstructing) {
            record.data = processed;
        }

        let generate$;

        // If we have engine fields, we need to set up the $ object
        if (isChrono && !updating) {
            generate$ = {};

            // Non-field entity identifiers (field identifiers are created below in the fieldMap loop)
            for (const prop of chronoProps) {
                generate$[prop.name] = record.createFieldIdentifier(prop);
            }

            // Override the $ object with ours
            Object.defineProperty(record, '$', { value : generate$, enumerable : true, configurable : true });
        }

        // Ignore defaults if told to do so directly (when updating data), or if store is configured to not apply
        // defaults, or we are forcing raw data (on copy for example)
        const ignoreDefaults = updating || useRawData.disableDefaultValue || forceUseRaw;

        // Iterate all fields only if we want to apply defaults or convert values
        if (!ignoreDefaults || (!useRawData.disableTypeConversion && !forceUseRaw) || isChrono) {
            const { processFields } = me;

            for (let i = 0; i < processFields.length; i++) {
                const
                    field                = processFields[i],
                    { name, dataSource } = field,
                    // Value might have been supplied either using mapped dataSource (when loading JSON etc. for example
                    // event.myStartDate) or as field name (from internal code, for example event.startDate). If [name]
                    // exists but not [dataSource], use it.
                    hasSource            = dataSource !== name,
                    complex              = field.complexMapping,
                    // First we try with dataSource
                    sourceValue          = (complex
                        ? ObjectHelper.getPath(processed, dataSource)
                        : processed[dataSource]),
                    // If that got us no value we try with name
                    nameValue            = sourceValue === undefined ? (complex
                        ? ObjectHelper.getPath(processed, name)
                        : processed[name]) : undefined,
                    // Flags used below to take action depending on if dataSource or name is to be used
                    useSourceForValue    = sourceValue !== undefined,
                    hasNameValue         = nameValue !== undefined,
                    useNameForValue      = !useSourceForValue && hasNameValue,
                    hasValue             = useSourceForValue || hasNameValue,
                    convert              = !useRawData.disableTypeConversion && field.convert;

                // Current value, might change if a default is applied
                let value = useNameForValue ? nameValue : sourceValue;

                // Apply default value first if needed
                if (!ignoreDefaults && (dataSource in defaults) && !hasValue && !field.fromData) {
                    let defaultValue = defaults[dataSource];
                    // Avoid sharing arrays across instances
                    if (Array.isArray(defaultValue)) {
                        defaultValue = defaultValue.slice();
                    }
                    else if (defaultValue instanceof Date) {
                        defaultValue = new Date(defaultValue);
                    }
                    else if (defaultValue && typeof defaultValue === 'object') {
                        defaultValue = ObjectHelper.clone(defaultValue);
                    }

                    if (complex) {
                        ObjectHelper.setPath(processed, dataSource, defaultValue);
                    }
                    else {
                        processed[dataSource] = defaultValue;
                    }

                    value = defaultValue;
                }

                // Only action field definitions which have a convert function or remap data
                // When ignoringDefaults, do not convert unspecified values
                if ((useNameForValue || convert) && (!ignoreDefaults || hasValue) && !forceUseRaw && !field.calculate) {
                    let converted = convert ? field.convert(value, data, record) : value;

                    if (me.processFieldData) {
                        converted = me.processFieldData(field, converted, value, data, record);
                    }

                    // We do not want to put undefined fields not already present in data into the processed object
                    if (!(converted === undefined && value === undefined && !useSourceForValue)) {
                        if (complex) {
                            ObjectHelper.setPath(processed, dataSource, converted);
                        }
                        else {
                            processed[dataSource] = converted;
                        }

                        // Remove [startDate] from internal data holder, only keeping [myStartDate]
                        if (hasSource) {
                            delete processed[name];
                        }

                        value = converted;
                    }
                }

                // For fields used by engine, set up identifiers here to avoid having to iterate all fields again
                // in the engine
                if (!updating && field.$chrono) {
                    // Also construct the $ object for engine records
                    const identifier = generate$[name] = record.createFieldIdentifier(field.$chrono);
                    identifier.DATA = value;
                }
            }
        }

        // Convert field types which need converting
        me.$meta.fields.calculated.forEach(field => {
            const { calculate } = field;
            if (!field._cachedDependencies && !calculate.dependsOn) {
                field._cachedDependencies = true;
                const
                    names = new Set(),
                    proxy = new Proxy(processed, {
                        get(obj, name) {
                            names.add(name);
                            return processed[name];
                        }
                    });

                let autoDetectFailed;
                try {
                    calculate.fn(proxy, record);
                    calculate.dependsOn = Array.from(names);
                    me.setupDependentCalcFields(field);
                    autoDetectFailed = names.size === 0;
                }
                catch {
                    autoDetectFailed = true;
                }

                if (autoDetectFailed) {
                    console.warn(`Failed to auto-detect dependent fields for "${field.name}" field. Add "dependsOn" in your calculate config.`);
                }
            }

            processed[field.name] = record.refreshCalculatedField(field);
        });

        // Fields that needs initializing
        me.$meta.fields.initable.length && me.initInitables(record, processed, (field, value) => {
            // Also construct the $ object for engine records
            const identifier = generate$[field.name] = record.createFieldIdentifier(field.$chrono);
            identifier.DATA = value;
        });

        return processed;
    }

    /**
     * The fields that {@link #function-processData-static} has to act on: those with a default value, a convert
     * function, a mapped or complex dataSource, an engine identifier or a calculation. Other fields have nothing to
     * process, their value is used as is. Cached, cleared by {@link #function-clearProcessFields-static}.
     * @member {Core.data.field.DataField[]} processFields
     * @private
     * @static
     * @category Fields
     */
    static get processFields() {
        const fieldsInfo = this.$meta.fields;

        if (!fieldsInfo.processFields) {
            fieldsInfo.processFields = Object.values(fieldsInfo.map).filter(field =>
                (field.dataSource in fieldsInfo.defaults) || field.convert || field.dataSource !== field.name ||
                field.complexMapping || field.$chrono || field.calculate
            );
        }

        return fieldsInfo.processFields;
    }

    /**
     * Clears the cached {@link #property-processFields-static} of this model and its subclasses. Called when fields
     * or default values change.
     * @private
     * @category Fields
     */
    static clearProcessFields() {
        const fieldsInfo = this.$meta.fields;

        fieldsInfo.processFields = null;

        for (const subModel of fieldsInfo.subModels) {
            subModel.$meta.fields.processFields = null;
        }
    }

    static setupClass(meta) {
        super.setupClass(meta);

        if (!meta.fields) {
            // Normally setupFields will only run when a Model defines a fields getter, but we want to always run it:
            this.setupFields(this, meta);
        }
    }

    /**
     * Overrides {@link Core.Base#function-applyDefaults-static} to also handle Model field defaults.
     *
     * When a key in the provided object matches a defined field name, the field's default value
     * is updated so that new instances will use the new default. Non-field keys are passed through
     * to the superclass implementation to handle config defaults.
     *
     * ```javascript
     * EventModel.applyDefaults({ durationUnit : 'week' });
     * ```
     *
     * @param {Object<String, *>} defaults An object with the default values to set.
     * @category Fields
     * @advanced
     */
    static applyDefaults(defaults) {
        const
            fieldsInfo     = this.$meta.fields,
            fieldMap       = fieldsInfo?.map,
            configDefaults = {};

        let hasConfigDefaults = false;

        for (const key in defaults) {
            const
                value = defaults[key],
                field = fieldMap?.[key];

            if (field) {
                const { dataSource } = field;

                // Update the defaults object used by processData
                fieldsInfo.defaults[dataSource] = value;

                // Also update the field's own defaultValue for consistency
                field.defaultValue = value;

                // Propagate to already-initialized subclasses
                for (const subModel of fieldsInfo.subModels) {
                    const subFields = subModel.$meta.fields;

                    if (subFields) {
                        subFields.defaults[dataSource] = value;

                        // Also update the sub field's own defaultValue if it's a different object
                        const subField = subFields.map[field.name];

                        if (subField && subField !== field) {
                            subField.defaultValue = value;
                        }
                    }
                }
            }
            else {
                configDefaults[key] = value;
                hasConfigDefaults = true;
            }
        }

        this.clearProcessFields();

        // Pass non-field defaults to super for config handling
        if (hasConfigDefaults) {
            super.applyDefaults(configDefaults);
        }
    }

    static setupFields(cls, meta) {
        const
            classFields = hasOwn(cls, 'fields') && cls.fields,
            base        = meta.super.fields,
            fieldsInfo  = meta.fields = {
                defs       : base?.defs.slice() ?? [],
                calculated : base?.calculated.slice() ?? [],

                // Set to `true` when an instance's data object is run through exposeProperties
                exposedData : false,

                // These objects are all keyed by field name:
                defaults    : base ? { ...base.defaults } : {},   // value=field.defaultValue
                exposed     : Object.create(base?.exposed  ?? null),   // value=true if we've done defineProperty
                ordinals    : Object.create(base?.ordinals ?? null),   // value=index in the defs array
                map         : base ? { ...base.map } : {},   // value=definition object
                sources     : base ? { ...base.sources } : {},    // value=source definition object
                chronoProps : [],   // engine props that are not fields
                subModels   : []
            };

        // Since the field map is flattened, we are going to need to let any fields added at a higher level later on
        // trickle down to sub models
        if (cls !== Model) {
            let parent = meta;
            do {
                parent = parent.super;
                parent.fields.subModels.push(cls);
            } while (parent.class !== Model);
        }

        // NOTE: instead of chaining the defaults, we copy them so the defaults object can be used with Object.assign
        // in other contexts (since it does not copy inherited properties from the prototype chain)

        // Clone the superclass's defaults, and override that with our own defaults.
        // As we find fields with a defaultValue, more defaults may be added
        if (hasOwn(cls, 'defaults')) {
            Object.assign(fieldsInfo.defaults, cls.defaults);
        }

        // Hook up our field maps with the class hierarchy's fieldMaps.
        // We need to be able to look up field definitions by the name, or by the dataSource property name

        // If the idField is overridden at this level, create a new field
        if (hasOwn(cls, 'idField')) {
            cls.addField({
                name       : 'id',
                dataSource : cls.idField,
                internal   : true
            });
            fieldsInfo.exposed[cls.idField] = true;
        }

        // Process fields defined in the class definition
        if (classFields?.length) {
            classFields.map(cls.addField, cls);
        }

        // Collect fields that need to be initialized (StoreDataField for example)
        fieldsInfo.initable = fieldsInfo.defs.filter(field => field.init);

        // Belong to engine, figure out which properties aren't fields. Those need identifiers set up in the $ object in
        // processData
        if (cls.$entity?.allFields.size) {
            for (const chronoField of cls.$entity.allFields.values()) {
                if (!fieldsInfo.map[chronoField.name]) {
                    fieldsInfo.chronoProps.push(chronoField);
                }
            }
        }

        cls.exposeRelations();
    }

    /**
     * Removes `cls` from the `subModels` array of each ancestor up to and including `Model`, reversing the
     * registration done by `setupFields`. Meant for classes generated per owner instance, which their ancestors would
     * otherwise retain forever. Instances keep working, but no longer receive fields added later using `addField`.
     * @param {Core.data.Model} cls The class to unregister. Ignored when nullish, since not all owners generate one
     * @internal
     * @category Fields
     */
    static unregisterSubModel(cls) {
        // $meta is a lazy getter which sets the class up on first access, probe the prototype to not trigger that
        if (!cls || !ObjectHelper.hasOwn(cls.prototype, '$meta')) {
            return;
        }

        for (let meta = cls.$meta.super; meta?.fields; meta = meta.super) {
            ArrayHelper.remove(meta.fields.subModels, cls);

            if (meta.class === Model) {
                break;
            }
        }
    }

    static get defaultValues() {
        return this.$meta.fields.defaults;
    }

    /**
     * An array containing all the _defined_ fields for this Model class. This will include all superclass's
     * defined fields.
     * @member {Core.data.field.DataField[]}
     * @readonly
     * @category Fields
     */
    static get allFields() {
        return this.$meta.fields.defs;
    }

    /**
     * Same as {@link #property-allFields-static}.
     * @member {Core.data.field.DataField[]}
     * @readonly
     * @category Fields
     */
    get allFields() {
        return this.$meta.fields.defs;
    }

    /**
     * An object containing all the _defined_ fields for this Model class. This will include all superclass's
     * defined fields through its prototype chain. So be aware that `Object.keys` and `Object.entries` will only
     * access this class's defined fields.
     * @member {Object<String,Core.data.field.DataField>}
     * @static
     * @readonly
     * @category Fields
     */
    static get fieldMap() {
        return this.$meta.fields.map;
    }

    /**
     * Same as {@link #property-fieldMap-static}.
     * @member {Object<String,Core.data.field.DataField>}
     * @readonly
     * @category Fields
     */
    get fieldMap() {
        return this.$meta.fields.map;
    }

    static get fieldDataSourceMap() {
        return this.$meta.fields.sources;
    }

    /**
     * Makes getters and setters for fields (from definitions and data). Called once when class is defined and once when
     * data is loaded first time.
     * @internal
     * @param {Object} [data] Raw data
     * @param {Boolean} [raw=true] True if data is raw (contains data sources), False if data contains field names
     * @category Fields
     */
    static exposeProperties(data, raw = true) {
        const
            me               = this,
            fieldsInfo       = me.$meta.fields,
            // exposeProperties method is called from two different places: from the model constructor which receives
            // field names, and from store loadData method, which handles raw data. When loading data to store we need
            // to use names as specified in the dataSource. And when calling a model constructor we need to use field
            // names
            fieldMapProperty = raw ? 'exposed' : 'map';

        // Process the raw data properties and expose them as fields unless the property name
        // has already been used by the "dataSource" of a defined field.
        if (data && me.autoExposeFields && !fieldsInfo.exposedData) {
            let dataProperty, fieldDef, type;

            for (dataProperty in data) {
                // We need to skip children field because it can be `true` and that would create boolean field.
                // See https://github.com/bryntum/bryntum/issues/2705
                if (!fieldsInfo[fieldMapProperty][dataProperty] && dataProperty !== me.childrenField) {
                    type = ObjectHelper.typeOf(data[dataProperty]);

                    // Create a field definition in our fieldMap with the flag that it's from data
                    fieldDef = {
                        name       : dataProperty,
                        dataSource : dataProperty,
                        fromData   : true
                    };

                    if (fieldDataTypes[type]) {
                        fieldDef.type = type;
                    }

                    me.addField(fieldDef);
                }
            }

            fieldsInfo.exposedData = true;
        }

        me.exposeRelations();
    }

    /**
     * Add a field definition in addition to those predefined in `fields`.
     * @param {String|ModelFieldConfig} fieldDef A field name or definition
     * @returns {Core.data.field.DataField}
     * @category Fields
     */
    static addField(fieldDef) {
        if (fieldDef == null) {
            return;
        }

        if (typeof fieldDef === 'string') {
            fieldDef = {
                name : fieldDef
            };
        }

        // The name-keyed field maps below are plain objects, so a name inherited from Object.prototype resolves to
        // that member instead of to a field definition. Refuse it here, where both the declared and the
        // auto-generated-from-data paths pass through, rather than letting it surface later as an opaque internal
        // error. See the "Reserved field names" section of this class' docs.
        if (hasOwn(Object.prototype, fieldDef.name)) {
            throw new Error(
                `"${fieldDef.name}" is a reserved field name (a member of Object.prototype). Use a different field ` +
                `name and read the raw data property with dataSource : '${fieldDef.name}'.`
            );
        }

        const
            me                = this.initClass(),
            fieldsInfo        = me.$meta.fields,
            {
                ordinals,
                calculated,
                subModels
            }                 = fieldsInfo,
            propertiesExposed = fieldsInfo.exposed,
            { name }          = fieldDef,
            existing          = fieldsInfo.map[name],
            dataSource        = fieldDef.dataSource || (fieldDef.dataSource = name);

        let field, key;

        // if the field doesn't exist yet or exists but has a different type
        if (!existing || (fieldDef.type && DataField.resolveType(fieldDef.type, true) !== existing.constructor)) {
            fieldDef.model = me;
            field = DataField.create(fieldDef);
            fieldDef.model = null;
            field.definedBy = existing ? existing.definedBy : me;
            field.ordinal = existing ? existing.ordinal : (ordinals[name] = fieldsInfo.defs.length);

            if (field.calculate?.dependsOn) {
                me.setupDependentCalcFields(field);
            }

            // When recreating an Engine field, preserve the $chrono property to maintain
            // ChronoGraph integration. Without this, field identifiers won't be created.
            if (existing?.$chrono && !field.$chrono) {
                field.$chrono = existing.$chrono;
            }
        }
        else {
            field = Object.create(existing);

            for (key in fieldDef) {
                if (key !== 'type') {
                    field[key] = fieldDef[key];
                }
            }
        }

        field.owner = me;
        fieldsInfo.defs[field.ordinal] = field;
        fieldsInfo.map[name] = field;
        fieldsInfo.sources[dataSource] = field;

        // Since the field map is flattened, we have to propagate the field to all subModels
        for (const subModel of subModels) {
            subModel.$meta.fields.map[name] = field;
        }

        // With complex mapping avoid exposing object as model field
        if (field.complexMapping !== false && dataSource.includes('.')) {
            field.complexMapping = true;

        }
        if (field.complexMapping) {  // model fields have this set on their prototype...
            propertiesExposed[dataSource.split('.')[0]] = true;
        }
        else {
            // When iterating through the raw data, if autoExposeFields is set
            // We do not need to create properties for raw property names we've processed here
            propertiesExposed[dataSource] = true;
        }

        // Maintain an object of defaultValues for fields.
        if ('defaultValue' in field) {
            fieldsInfo.defaults[dataSource] = field.defaultValue;
        }

        // Create a property on this Model's prototype, named for the defined field name
        // which reads the correct property out of the raw data object.
        if (!internalProps[name]) {
            // Either creates a new accessor or redefines an existing
            field.defineAccessor(me.prototype);
        }
        if (field.calculate) {
            calculated.push(field);
        }

        me._nonPersistableFields = null;
        me._alwaysWriteFields = null;
        me.clearProcessFields();

        return field;
    }

    static setupDependentCalcFields(field) {
        const fieldsInfo = this.$meta.fields;

        field.calculate.dependsOn.forEach((depName) => {
            if (!fieldsInfo.map[depName]) {
                throw new Error(`No "${depName}" field defined in ${this.$name} class`);
            }
            fieldsInfo.map[depName].dependentFields = fieldsInfo.map[depName].dependentFields || [];
            fieldsInfo.map[depName].dependentFields.push(field.name);
        });
    }

    /**
     * Remove a field definition by name.
     * @param {String} fieldName Field name
     * @category Fields
     */
    static removeField(fieldName) {
        const
            me = this.initClass(),
            fieldsInfo = me.$meta.fields,
            definition = fieldsInfo.map[fieldName],
            { ordinals } = fieldsInfo,
            index = ordinals[fieldName];

        if (definition) {
            fieldsInfo.defs.splice(index, 1);

            delete ordinals[fieldName];
            delete fieldsInfo.defaults[fieldName];
            delete fieldsInfo.exposed[fieldName];
            delete fieldsInfo.map[fieldName];
            delete fieldsInfo.sources[definition.dataSource];

            for (const name in ordinals) {
                if (ordinals[name] > index) {
                    --ordinals[name];
                }
            }

            // Note: if field was exposed by superclass, this won't do anything...
            delete me.prototype[fieldName];

            me.clearProcessFields();
        }
    }

    /**
     * Makes getters and setters for related records. Populates a Model#relation array with the relations, to allow it
     * to be modified later when assigning stores.
     * @internal
     * @category Relations
     */
    static exposeRelations() {
        const me = this;

        if (hasOwn(me, 'exposedRelations')) {
            return;
        }

        if (me.relations) {
            me.exposedRelations = [];

            for (const relationName in me.relations) {
                const relation = me.relations[relationName];
                relation.relationName = relationName;
                me.exposedRelations.push(relation);

                // getter and setter for related object
                if (!Reflect.ownKeys(me.prototype).includes(relationName)) {
                    defineProperty(me.prototype, relationName, {
                        enumerable : true,
                        get        : function() {
                            // noinspection JSPotentiallyInvalidUsageOfClassThis
                            return this.getForeign(relationName);
                        },
                        set : function(value) {
                            // noinspection JSPotentiallyInvalidUsageOfClassThis
                            this.setForeign(relationName, value, relation);
                        }
                    });
                }
            }
        }
    }

    //endregion

    //region Initable fields

    // Initializes any fields using a data type that has an init method, and caches the value to assign to that field to
    // be able to assign it after all others. That allows the initter to reference the records other data if needed
    // (baselines use that to reference the task to get default values)
    static initInitables(record, processedData, chronoCallback) {
        const laterValues = record.meta.initableValues = new Map();
        // Initialize any initializable fields (only StoreDataField currently)
        for (const field of this.$meta.fields.initable) {
            // Set data (if any) later, in case it needs to reference this record
            const value = ObjectHelper.getPath(processedData, field.dataSource);
            value !== undefined && laterValues.set(field, value);

            // Init field if not lazy, if lazy app is responsible for doing it
            !field.lazy && field.init(processedData, record, chronoCallback);
        }
    }

    // Assigns values to the fields that were initialized earlier (see initInitables above)
    assignInitables() {
        const { initableValues } = this.meta;

        for (const [field, value] of initableValues) {
            if (field.set(value, this.data, this) !== false) {
                initableValues.delete(field);
            }
        }
    }

    //endregion

    //region Fields

    /**
     * Flag checked from Store when loading data that determines if fields found in first records should be exposed in
     * same way as predefined fields.
     *
     * {@note}Note that we for all but the most basic use cases recommend explicitly defining the fields.
     * Having them auto exposed can lead to unexpected behavior, if the first record is not complete (fields missing,
     * null etc).
     * {/@note}
     *
     * @member {Boolean}
     * @category Fields
     */
    static get autoExposeFields() {
        return true;
    }

    /**
     * This function forces correct field order. Correct order is parentId before id. If we process id field before
     * parentId, idMap won't be updated and changing parent node will lead to duplicated records in storage
     * @param {String} a
     * @param {String} b
     * @returns {number}
     * @private
     */
    static fieldSorter(a, b) {
        return (fieldsOrder[a] || 100) - (fieldsOrder[b] || 100);
    }

    /**
     * Convenience getter to get field definitions from class.
     * @member {Core.data.field.DataField[]}
     * @readonly
     * @category Fields
     */
    get fields() {
        return this.$meta.fields.defs;
    }

    /**
     * Convenience function to get the definition for a field from class.
     * @param {String} fieldName Field name
     * @returns {Core.data.field.DataField}
     * @category Fields
     */
    getFieldDefinition(fieldName) {
        return this.constructor.getFieldDefinition(fieldName);
    }

    getFieldDefinitionFromDataSource(dataSource) {
        return this.$meta.fields.sources[dataSource];
    }

    /**
     * Get the names of all properties in the data object.
     *
     * Note that this is not the same as the fields defined for the model, in most cases you probably want to use
     * {@link #property-fields} instead.
     *
     * @member {String[]}
     * @readonly
     * @category Fields
     */
    get fieldNames() {
        return Object.keys(this.data);
    }

    /**
     * Get the definition for a field by name.
     * @param {String} fieldName Field name
     * @returns {Core.data.field.DataField} Field definition or null if none found
     * @category Fields
     */
    static getFieldDefinition(fieldName) {
        const field = this.fieldMap[fieldName];
        if (!field) {
            if (fieldName.includes('[')) {
                const
                    // e.g. players[0].name
                    [, arrayFieldName, , path] = fieldName.match(arrayRe),
                    arrayField = arrayFieldName.includes('.')
                        ? this.getFieldDefinition(arrayFieldName)
                        : this.fieldMap[arrayFieldName];
                if (arrayField?.isStoreDataField) {
                    return arrayField.modelClass?.getFieldDefinition(path);
                }
            }
            else if (fieldName.includes('.')) {
                const
                    // e.g. coach.name
                    [localFieldName, path] = fieldName.split('.', 2),
                    modelField = this.fieldMap[localFieldName];
                if (modelField?.isModelDataField && modelField.modelClass) {
                    return modelField.modelClass.getFieldDefinition(path);
                }
            }
        }
        return field;
    }

    /**
     * Returns dataSource configuration for a given field name
     * @param {String} fieldName
     * @returns {String} Field `dataSource` mapping
     * @internal
     */
    static getFieldDataSource(fieldName) {
        return this.getFieldDefinition(fieldName)?.dataSource || fieldName;
    }

    /**
     * Get the data source used by specified field. Returns the fieldName if no data source specified.
     * @param {String} fieldName Field name
     * @returns {String}
     * @category Fields
     */
    getDataSource(fieldName) {
        const def = this.constructor.getFieldDefinition(fieldName);

        return def?.dataSource || def?.name;
    }

    /**
     * Processes input to a field, converting to expected type.
     * @param {String} fieldName Field name
     * @param {*} value Value to process
     * @returns {*} Converted value
     * @category Fields
     */
    static processField(fieldName, value, record) {
        const field = this.fieldMap[fieldName];
        return field?.convert ? field.convert(value, this.data, record) : value;
    }

    /**
     * Returns the string value for display purposes of an instance of this Model class. Needs to be overridden in
     * subclasses.
     * @member {String}
     * @readonly
     * @category Fields
     * @abstract
     */
    get classDisplayName() {
        warnOnce('Model.classDisplayName needs to be overridden in subclasses');
        return '';
    }

    //endregion

    //region Relations

    /**
     * Initializes model relations. Called from store when adding a record.
     * @private
     * @category Relations
     */
    initRelations() {
        const
            me        = this,
            relations = me.constructor.exposedRelations;

        if (!relations) {
            return;
        }

        // <remove-on-release>
        // TODO: feels strange to have to look at the store for relation config but didn't figure out anything better.
        // TODO: because other option would be to store it on each model instance, not better...
        // </remove-on-release>

        me.stores.forEach(store => {
            if (!store.modelRelations) {
                store.initRelations();
            }

            // <remove-on-release>
            // TODO: not at all tested for multiple stores, can't imagine it works as is
            // </remove-on-release>
            const relatedRecords = [];

            store.modelRelations?.forEach(config => {
                relatedRecords.push({ related : me.initRelation(config), config });
            });
            store.updateRecordRelationCache(me, relatedRecords);
        });
    }

    /**
     * Initializes/updates a single relation.
     * @param {Object} config Relation config
     * @returns {Core.data.Model} Related record
     * @private
     * @category Relations
     */
    initRelation(config) {
        const
            me            = this,
            foreignId     = me.get(config.foreignKey),
            foreign       = foreignId !== _undefined && typeof config.foreignStore !== 'string' && config.foreignStore.getById(foreignId),
            relationCache = me.meta.relationCache || (me.meta.relationCache = {});

        // The cache must work without a matched related record, hence the placeholder
        relationCache[config.relationName] = foreign || (foreignId != null ? { id : foreignId, placeHolder : true } : null);

        return foreign;
    }

    removeRelation(config) {
        const { relationName, foreignKey, nullFieldOnRemove } = config;
        // (have to check for existence before deleting to work in Safari)
        if (this.meta.relationCache[relationName]) {
            delete this.meta.relationCache[relationName];
            if (nullFieldOnRemove) {
                // Setting to null silently, to not trigger additional relation behaviour
                this.setData(foreignKey, null);
            }
        }
    }

    getForeign(name) {
        return this.meta.relationCache?.[name];
    }

    setForeign(name, value, config) {
        const id = Model.asId(value);
        return this.set(config.foreignKey, id);
    }

    /**
     * Get a relation config by name, from the first store.
     * @param {String} name
     * @returns {Object}
     * @private
     * @category Relations
     */
    getRelationConfig(name) {
        //?
        // Using first store for relations, might have to revise later...
        return this.firstStore?.modelRelations?.find(r => r.foreignKey === name);
    }

    //endregion

    //region Get/set values, data handling

    flatGet(fieldName, dataSource) {
        // NOTE: There is an inlined copy of this fn in DataField, when changing here make sure it is updated too

        // When changes are batched, they get stored by field name, not dataSource
        if (this.batching && fieldName in this.meta.batchChanges) {
            return this.meta.batchChanges[fieldName];
        }

        return this.data[dataSource];
    }

    complexGet(fieldName, dataSource) {
        // When changes are batched, they get stored by field name, not dataSource
        if (this.batching && fieldName in this.meta.batchChanges) {
            return this.meta.batchChanges[fieldName];
        }

        return ObjectHelper.getPath(this.data, dataSource);
    }

    /**
     * Get value for specified field name. You can also use the generated getters if loading through a Store.
     * If model is currently in batch operation this will return updated batch values which are not applied to Model
     * until endBatch() is called.
     * @param {String} fieldName Field name to get value from
     * @returns {*} Fields value
     * @category Fields
     */
    get(fieldName) {
        if (!fieldName) {
            return;
        }

        const
            me           = this,
            { fieldMap } = me,
            field        = fieldMap[fieldName];

        if (!field) {
            // team.players[0], team.players[0].name
            if (fieldName.includes('[')) {
                const [, arrayFieldName, index, path] = fieldName.match(arrayRe);
                // team
                const arrayField = fieldMap[arrayFieldName];
                if (arrayField?.getAt) {
                    // Access the field to make sure it is initialized if lazy
                    me._thisIsAUsedExpression(me[arrayFieldName]);

                    // 0
                    const subRecord = arrayField.getAt(me, index);

                    // name
                    if (subRecord && path) {
                        if (subRecord.isModel) {
                            return subRecord.getValue(path);
                        }

                        return subRecord[path];
                    }

                    return subRecord;
                }

                return null;
            }

            if (fieldName.includes('.')) {
                const
                    [localFieldName, nestedFieldName] = fieldName.split('.', 2),
                    localField                        = fieldMap[localFieldName];

                // Aggregate a value from a StoreDataField?
                if (localField?.isStoreDataField) {
                    const
                        store           = me[localFieldName],
                        storeModelClass = store.modelClass;

                    if (nestedFieldName in storeModelClass.fieldMap || !(nestedFieldName in store)) {
                        return store?.getDistinctValues(nestedFieldName);
                    }
                    // Support for reading Store properties like "count"
                    return store[nestedFieldName];
                }
                // Related record?
                else if (!ObjectHelper.hasPath(me.data, fieldName)) {
                    return ObjectHelper.getPath(me, fieldName);
                }
                // Nested data object
                return me.complexGet(fieldName, fieldName);
            }

        }

        if (field?.complexMapping) {
            return me.complexGet(fieldName, field.dataSource);
        }

        return me.flatGet(fieldName, field?.dataSource || fieldName);
    }

    // Used to get field values, replaces `record[fieldName]` in internal code to allow relations etc.
    getValue(fieldName) {
        if (!fieldName) {
            return;
        }

        // Try matching "user defined" getters
        if (fieldName in this && !fieldName.includes('.')) {
            return this[fieldName];
        }

        // Fall back to normal get
        return this.get(fieldName);
    }

    // Used to set field values, replacing `record[fieldName] = value` to handle dot notation
    setValue(fieldName, value) {
        if (fieldName in this) {
            this[fieldName] = value;
        }
        else {
            this.set(fieldName, value);
        }
    }

    /**
     * Internal function used to update a records underlying data block (record.data) while still respecting field
     * mappings. Needed in cases where a field needs setting without triggering any associated behaviour and it has a
     * dataSource with a different name.
     *
     * For example:
     * ```javascript
     * // startDate mapped to data.beginDate
     * { name : 'startDate', dataSource : 'beginDate' }
     *
     * // Some parts of our code needs to update the data block without triggering any of the behaviour associated with
     * // calling set. This would then not update "beginDate":
     * record.data.startDate = xx;
     *
     * // But this would
     * record.setData('startDate', xx);
     * ```
     * @internal
     * @category Editing
     */
    setData(toSet, value) {
        const
            me                 = this,
            { data, fieldMap } = me;

        // Two separate paths for performance reasons

        // setData('name', 'Quicksilver');
        if (typeof toSet === 'string') {
            const
                field      = fieldMap[toSet],
                dataSource = field?.dataSource ?? toSet;

            if (field?.set) {
                field.set(value, me.data, me);
            }
            else if (field?.complexMapping) {
                ObjectHelper.setPath(data, dataSource, value);
            }
            else {
                data[dataSource] = value;
            }

            // A couple of places in the code set id silently this way
            if (field === 'id') {
                me._id = value;
            }
            else if (toSet === 'parentId') {
                data[me.constructor.parentIdField] = value;
            }
        }
        // setData({ name : 'Magneto', power : 'Magnetism' });
        else {
            const keys = Object.keys(toSet);

            for (let i = 0; i < keys.length; i++) {
                const
                    fieldName  = keys[i],
                    field      = fieldMap[fieldName],
                    dataSource = field?.dataSource ?? fieldName;

                if (field?.set) {
                    field.set(value, me.data, me);
                }
                else if (dataSource) {
                    if (field?.complexMapping) {
                        ObjectHelper.setPath(data, dataSource, toSet[fieldName]);
                    }
                    else {
                        data[dataSource] = toSet[fieldName];
                    }

                    // A couple of places in the code set id silently this way
                    if (fieldName === 'id') {
                        me._id = value;
                    }
                    else if (fieldName === 'parentId') {
                        data[me.constructor.parentIdField] = value;
                    }
                }
            }
        }

    }

    /**
     * Returns raw data from the encapsulated data object for the passed field name
     * @param {String} fieldName The field to get data for.
     * @returns {*} The raw data value for the field.
     * @category Editing
     */
    getData(fieldName) {
        const
            field      = this.fieldMap[fieldName],
            dataSource = field?.dataSource ?? fieldName;

        if (dataSource) {
            if (field?.complexMapping) {
                return ObjectHelper.getPath(this.data, dataSource);
            }

            return this.data[dataSource];
        }
    }

    /**
     * Silently updates record's id with no flagging the property as modified.
     * Triggers onModelChange event for changed id.
     * @param {String|Number} value id value
     * @private
     */
    syncId(value) {
        const oldValue = this.id;
        if (oldValue !== value) {
            this._id = value;
            this.setData('id', value);
            const data = { id : { value, oldValue } };
            this.afterChange(data, data);
        }
    }

    /**
     * Set value for the specified field. You can also use the generated setters if loading through a Store.
     *
     * Setting a single field, supplying name and value:
     *
     * ```javascript
     * record.set('name', 'Clark');
     * ```
     *
     * Setting multiple fields, supplying an object:
     *
     * ```javascript
     * record.set({
     *     name : 'Clark',
     *     city : 'Metropolis'
     * });
     * ```
     *
     * NOTE: Do not modify fields using `dataSource`, as it is intended only for reading and writing from the raw data object.
     * Fields should be modified using `name` as it is the public interface.
     *
     * @param {String|Object} field The field to set value for, or an object with multiple values to set in one call
     * @param {*} [value] Value to set
     * @param {Boolean} [silent] Set to `true` to not trigger events. If event is recurring, occurrences won't be updated automatically.
     * @privateparam {Boolean} [validOnly] If set to `true` it will ignore setting a `undefined` value, allowing conversion functions to invalidate a data input
     * @privateparam {Boolean} [triggerBeforeUpdate]
     * @fires Core.data.Store#event-idChange
     * @fires Core.data.Store#event-update
     * @fires Core.data.Store#event-change
     * @category Editing
     */
    set(field, value, silent = false, fromRelationUpdate = false, skipAccessors = false, validOnly = false, triggerBeforeUpdate = true) {
        const me = this;

        if (me.isBatchUpdating) {
            me.inBatchSet(field, value, silent || me.$silenceBatch);
        }
        else {
            // We use inSet/afterSet approach here because mixin interested in overriding set() method like STM, for
            // example, might be mixed before Model class or after. In general, we have no control over this.
            // STM mixed before, so the only option to wrap set() method body is actually to call afterSet().

            const wasSet = me.inSet(field, value, silent, fromRelationUpdate, skipAccessors, validOnly, triggerBeforeUpdate);
            me.afterSet?.(field, value, silent, fromRelationUpdate, wasSet);
            return wasSet;
        }
    }

    updateDependentFieldValues(field) {
        if (typeof field === 'object') {
            Object.keys(field).forEach(key => this.updateDependentFieldValues(key));
        }
        else {
            if (field.startsWith('#')) {
                field = field.substring(0);
            }

            // Force formula re-evaluation using the meta field of all dependent fields
            for (const [key, value] of Object.entries(this.constructor.dependentFields || {})) {
                if (field in value) {
                    this.set(key, this.get(`#${key}`));
                }
            }
        }
    }

    fieldToKeys(field, value) {
        if (typeof field !== 'string') {
            // will get in trouble when setting same field on multiple models without this
            return ObjectHelper.assign({}, field);
        }

        return {
            [field] : value
        };
    }

    inBatchSet(field, value, silent) {
        const
            me     = this,
            {
                meta,
                constructor,
                fieldMap
            }      = me,
            {
                batchChanges
            }      = meta,
            wasSet = {};

        let cmp, changed = false;

        if (typeof field !== 'string') {
            Object.keys(me.fieldToKeys(field, value)).forEach(key => {
                cmp = fieldMap[key] || ObjectHelper;
                value = constructor.processField(key, field[key], me);

                // Store batch changes
                // (for undefined value we have to check key existence or isEqual() won't work correctly)
                if ((value !== undefined || key in batchChanges) && !cmp.isEqual(batchChanges[key], value)) {
                    wasSet[key] = {
                        value,
                        oldValue : me.get(key)
                    };
                    batchChanges[key] = value;
                    changed = true;
                }
            });
        }
        else {
            cmp = fieldMap[field] || ObjectHelper;

            // Minor optimization for engine writing back a lot of changes
            // (for undefined value we have to check field in the batch or isEqual() won't work correctly)
            if ((value !== undefined || field in batchChanges) && !cmp.isEqual(batchChanges[field], value)) {
                wasSet[field] = {
                    value,
                    oldValue : me.get(field)
                };
                batchChanges[field] = value;
                changed = true;
            }
        }

        // Callers need to be able to detect changes
        if (changed) {
            me.generation++;

            if (!silent) {
                // Fire batched events for UIs which need to update themselves during batched updates.
                // An example is evenResize feature which batches the changes to the endDate
                // or startDate, but the UI must update during the drag.
                const event = {
                    action  : 'update',
                    record  : me,
                    records : [me],
                    changes : wasSet
                };
                me.stores?.forEach(store =>
                    store.trigger('batchedUpdate', { ...event })
                );

                // Propagate to linked records
                me.forEachLinked((store, record) =>
                    store.trigger('batchedUpdate', { ...event, record, records : [record] })
                );
            }
        }
    }

    inSet(fieldNameOrObject, value, silent, fromRelationUpdate, skipAccessors = false, validOnly = false, triggerBeforeUpdate = true) {
        const
            me       = this,
            {
                data,
                meta,
                fieldMap,
                constructor
            }        = me,
            {
                prototype : myProto,
                childrenField,
                relations
            }        = constructor,
            wasSet   = {},
            toSet    = me.fieldToKeys(fieldNameOrObject, value),
            // Sort fields to make sure parentId is processed before id
            // https://github.com/bryntum/bryntum/issues/6851
            keys     = Object.keys(toSet).sort(constructor.fieldSorter),
            isSyncingDataOnLoad = me.stores?.some(store => store.isSyncingDataOnLoad),
            suspendedModificationsTracking = me.stores?.some(store => store.modificationsTracking > 0);

        // Give a chance to cancel action before records are updated.
        if (!silent && triggerBeforeUpdate && !me.triggerBeforeUpdate(toSet)) {
            return null;
        }

        let changed = false, fieldDefinition, formulaProvider, formulaFieldName;

        if (typeof fieldNameOrObject === 'object' && Object.keys(fieldNameOrObject).length === 1) {
            value = Object.values(fieldNameOrObject)[0];
            fieldNameOrObject = Object.keys(fieldNameOrObject)[0];
        }

        // See if the field being set has a FormulaProvider.
        // If it does, we need to calculate the value which goes into the field.
        // The raw values goes into a sibling field with the same name but with a # prefix.

        if (typeof fieldNameOrObject === 'string' && (fieldDefinition /* assignment */ = me.getFieldDefinition(fieldNameOrObject))) {
            // It's a formula bearing field
            if (fieldDefinition.formulaProviders) {
                const prefix = value?.match(fieldDefinition.inputPrefixRE)?.[1];
                formulaFieldName = `#${fieldNameOrObject}`;
                formulaProvider = fieldDefinition.formulaProviders[prefix]?.instance;

                if (!formulaProvider) {
                    formulaProvider = fieldDefinition.getFormulaProvider?.(prefix);
                }

                keys.push(formulaFieldName);
                toSet[formulaFieldName] = value;
            }
        }

        if (formulaProvider) {
            const
                { formulaRE }   = formulaProvider,
                formulaSource   = formulaRE ? value.trim().match?.(formulaRE)?.[1] : value;

            // We have extracted the source code of a formula.
            // The raw value goes into the field with a # prefix.
            // The calculated result goes into the field without the prefix.
            if (formulaSource) {
                const
                    modelClass      = me.constructor,
                    dependentFields = modelClass.dependentFields || (modelClass.dependentFields = {}),
                    prompt          = formulaProvider.createFormula(formulaSource, me, me.firstStore),
                    responseValue   = formulaProvider.calculate(prompt);

                // Gather the field names the formula references
                formulaSource?.matchAll(formulaProvider.fieldMatchRE)?.forEach?.(([, fieldName]) => {
                    // Maintain the list of referenced fields which our field now depends on.
                    // Break out all $xxx tokens and add them to the list of dependent fields.
                    // A field cannot depend on itself.
                    if (fieldName !== fieldNameOrObject) {
                        (dependentFields[fieldNameOrObject] || (dependentFields[fieldNameOrObject] = {}))[fieldName] = 1;
                    }
                });

                // Using a Promise value puts the cell into the b-loading-cell state
                toSet[fieldNameOrObject] = responseValue;

                // Record must know that it has a pending formula.
                // It is not committable until the formula is resolved.
                // This is used by the Store to determine if it should commit the record.
                meta.pendingFormulae = (meta.pendingFormulae || 0) + 1;

                // Set the value when the response arrives if the value is a Promise
                try {
                    responseValue.then?.(v => {
                        meta.pendingFormulae = Math.max(0, meta.pendingFormulae - 1);
                        me.set({
                            [fieldNameOrObject] : v,
                            [formulaFieldName]  : value
                        });
                    });
                }
                catch (err) {
                    meta.pendingFormulae = Math.max(0, meta.pendingFormulae - 1);
                    // Documented in the Store class
                    me.firstStore.trigger('formulaError', {
                        record  : me,
                        field   : fieldNameOrObject,
                        error   : err,
                        formula : value
                    });
                    me.set(fieldNameOrObject, '');
                }
            }
        }

        me.inSetting = true;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            // Currently not allowed to set children in a TreeNode this way, will be ignored
            if (key === childrenField) {
                continue;
            }

            // Setting a field on a record in a store data field (players[0].name = 'foo')
            if (key.includes('[')) {
                const
                    [, arrayFieldName, index, path] = key.match(arrayRe),
                    field                           = me.fieldMap[arrayFieldName];

                if (field?.getAt) {
                    const subRecord = field.getAt(me, index) ?? field.onSubRecordMissingInSet?.(me, index);

                    if (subRecord == null) {
                        throw new Error(`The store field '${arrayFieldName}' does not contain a record at index ${index} - can not set the data`);
                    }

                    if (subRecord.isModel) {
                        subRecord.set(path, toSet[key]);
                    }
                    else {
                        ObjectHelper.setPath(subRecord, path, toSet[key]);
                    }

                    continue;
                }
            }

            const complexKey = key.includes('.');

            // Handle updating related record
            if (relations && complexKey) {
                const [, relationName, prop] = key.match(nestedRe);
                if (relations[relationName]) {
                    // If key still is complex, use set
                    if (prop.includes('.')) {
                        me[relationName].set(prop, toSet[key]);
                    }
                    // Simple key, use the generated/configured setter
                    else {
                        me[relationName][prop] = toSet[key];
                    }
                    continue;
                }
            }

            const
                field     = fieldMap[key],
                cmp       = field || ObjectHelper,
                readOnly  = field?.readOnly,
                mapping   = field?.dataSource ?? key,
                useProp   = (!skipAccessors && !field && key in myProto) || field?.useProp,
                oldValue  = useProp ? me[mapping] : field?.complexMapping || complexKey ? ObjectHelper.getPath(data, mapping) : data[mapping],
                value     = constructor.processField(key, toSet[key], me),
                val       = toSet[key] = { value },
                isPromise = ObjectHelper.isPromise(value),
                relation  = me.getRelationConfig(key),
                isEqual   = cmp.isEqual(oldValue, value);

            if (
                !readOnly &&
                // when syncDataOnLoad in action certain fields can bypass equality check
                (isSyncingDataOnLoad && field?.bypassEqualityOnSyncDataset || !isEqual) &&
                (!validOnly || value !== undefined)
            ) {
                // Indicate to observers that data has changed.
                me.generation++;
                // Give fields a shot at affecting the old value (used by StoreDataField)
                val.oldValue = field?.getOldValue?.(me) ?? oldValue;

                // boolean flag telling that there were some real changes
                changed = changed || !isEqual;

                // Update `modified` state which is used in sync request
                // For change tracking, nullish is equal
                if (key in meta.modified && cmp.isEqual(meta.modified[key], value, false, true)) {
                    // Remove changes if values are the same
                    Reflect.deleteProperty(meta.modified, key);

                    // Sync `data` to the restored original (nested for complexMapping/complexKey, flat otherwise),
                    // else engine accessor fields re-dirty via the later engine write-back. See #13372.
                    // Not for store fields - their `data` slot holds the backing store itself, writing the
                    // raw array over it would sever the field/store link and break all subsequent change
                    // detection for the field (the store applies restored data through its own set() path)
                    if ((me.isReverting || field?.$chrono) && !field?.isStoreDataField) {
                        if (field?.complexMapping || complexKey) {
                            ObjectHelper.setPath(me.data, mapping, value);
                        }
                        else {
                            me.data[mapping] = value;
                        }
                    }
                }
                else if (!me.ignoreBag && !suspendedModificationsTracking) { // Private flag in engine, speeds initial commit up by not recording changes
                    // Cache its original value
                    // For change tracking, nullish are equal
                    if (!(key in meta.modified) && !(oldValue == null && value == null) && !isPromise) {
                        // val.oldValue is the field-provided old value (a StoreDataField provides its pre-change
                        // data snapshot - storing the live store here would make the "original" mutate along)
                        me.storeFieldChange(key, val.oldValue);
                    }

                    if (val.oldValue === _undefined) {
                        Reflect.deleteProperty(val, 'oldValue');
                    }
                }
                // possibly need to include `|| me.ignoreBag` into this condition
                else if (suspendedModificationsTracking) {
                    Reflect.deleteProperty(meta.modified, key);
                }

                // track only real changes in wasSet
                if (!isEqual) {
                    // The wasSet object keys must be the field *name*, not its dataSource.
                    wasSet[key] = val;
                }

                me.applyValue(useProp, mapping, value, skipAccessors, field);

                // changing foreign key
                if (relation && !fromRelationUpdate) {
                    me.initRelation(relation);
                    me.stores.forEach(store => store.cacheRelatedRecord(me, value, relation.relationName, val.oldValue));
                }
            }
        }

        if (changed) {
            me.afterChange(toSet, wasSet, silent, fromRelationUpdate, skipAccessors);
        }

        me.updateDependentFieldValues(fieldNameOrObject);
        me.inSetting = false;

        return changed ? wasSet : null;
    }

    // Provided as a hook for Engine to do what needs to be done which ever way a field value is changed
    applyValue(useProp, key, value, skipAccessors, field) {
        const me = this;

        // any id assignment clears the `$isPhantom` flag, which
        // is supposed to be set only for records, deleted by undo
        if ((field?.dataSource || key) === me.constructor.idField) {
            me.$isPhantom = false;
            // Update cached id
            me._id = value;
        }

        // Setting parentId moves the node, always route through setter
        if ((field?.dataSource || key) === me.constructor.parentIdField) {
            // do nothing if `value=null/undefined` (or unresolvable id) - supposed to move the node
            // to the children of root _and_ node is already a child of root
            if (me.firstStore?.tree && !(me.parent?.isRoot && (value == null || !me.firstStore.getById(value)))) {
                // key is the dataSource, if we use property we need to use field name
                (me.firstStore.getById(value) || me.firstStore.rootNode).insertChild(me, null, false, {
                    orderedParentIndex : { skip : true }
                });
            }
        }
        // If we don't have a field, but we have a property define eg, the fullDuration property defined in TaskModel,
        // then use the property.
        else if (useProp) {
            // key is the dataSource, if we use property we need to use field name
            me[field?.name || key] = value;
        }
        else if (field?.set) {
            field.set(value, me.data, me);
        }
        else {
            let complexMapping = field?.complexMapping;

            // Might be setting value of nested object
            if (!field && key.includes('.')) {
                const nestedName = key.split('.')[0];

                field = me.constructor.fieldMap[nestedName];

                // We use complex mapping if the field's dataSource was defined as such,
                // OR if we are being asked to set using dot notation and field is of Object type.
                complexMapping = field?.complexMapping || field?.type === 'object';
            }

            // Use complex mapping?
            if (complexMapping) {
                ObjectHelper.setPath(me.data, key, value);
            }
            // Otherwise, push the value through into the data.
            else {
                me.data[key] = value;
            }
        }
    }

    // skipAccessors argument is used in the engine override
    afterChange(toSet, wasSet, silent, fromRelationUpdate, skipAccessors) {
        const
            me           = this,
            extraChanges = me.updateDependentFields(Object.keys(wasSet));

        if (extraChanges) {
            Object.assign(wasSet, extraChanges);
        }

        if (me.stores) {
            for (const store of me.stores) {
                store.onModelChange(me, toSet, wasSet, silent, fromRelationUpdate, skipAccessors);
            }
        }

        // Propagate to linked records
        me.forEachLinked((store, record) =>
            store.onModelChange(record, toSet, wasSet, silent, fromRelationUpdate, skipAccessors)
        );
    }

    updateDependentFields(fields) {
        const changes = {};

        fields.forEach(fieldName => {
            this.getFieldDefinition(fieldName)?.dependentFields?.forEach(name => {
                const
                    field = this.fieldMap[name],
                    value = this.refreshCalculatedField(field);

                changes[name] = value;
            });
        });
        if (Object.keys(changes).length > 0) {
            return this.set(changes, undefined, true);
        }
        return changes;
    }

    /**
     * Recalculates the value of a calculated field
     * @param {Core.data.field.DataField|String} field The field instance or its name
     * @returns {*} The updated value of the field, or a Promise
     * @internal
     */
    refreshCalculatedField(field) {
        const me = this;

        if (typeof field === 'string') {
            field = me.getFieldDefinition(field);
        }

        const value = field.calculate?.fn.call(field, me);

        if (ObjectHelper.isPromise(value)) {
            if (me.isConstructing) {
                me.data[field.name] = value;
            }
            else {
                me[field.name] = value;
            }
            value.then(result => me[field.name] = result);
        }

        return value;
    }

    // Run fn for each store on each linked record
    forEachLinked(fn) {
        for (const linked of this.$links) {
            for (const store of linked.stores) {
                fn(store, linked);
            }
        }
    }

    /**
     * This yields `true` if this record is eligible for syncing with the server.
     * It can yield `false` if the record is in the middle of a {@link #property-isBatchUpdating batched update},
     * or if it is a {@link #property-isCreating tentative record} yet to be confirmed as a new addition.
     * @member {Boolean}
     * @readonly
     */
    get isPersistable() {
        // Record is not persistable if the owning app is in the middle of a batch update
        // and the record is not flagged as being in the middle of a creation sequence.
        // This means that a "new" record can be added on a conditional basis with its
        // `isCreating` property set which means it is excluded from being synced until
        // the `isCreating` flag is cleared.
        return !this.isBatchUpdating && !this.isCreating;
    }

    /**
     * True if this model has any uncommitted changes.
     * @member {Boolean}
     * @readonly
     * @category Editing
     */
    get isModified() {
        return Boolean(this.meta.modified && Object.keys(this.meta.modified).length > 0);
    }

    // <remove-on-release>
    // TODO: Make this the behaviour of isModified?
    // </remove-on-release>
    get hasPersistableChanges() {
        return this.isPersistable && !ObjectHelper.isEmpty(this.rawModificationData);
    }

    /**
     * Returns `true` if this model has uncommitted changes for the provided field.
     * @param {String} fieldName Field name
     * @returns {Boolean} `true` if the field has an uncommitted change
     * @category Editing
     */
    isFieldModified(fieldName) {
        return this.isModified && fieldName in this.meta.modified;
    }

    /**
     * Returns the unmodified value of the field, as in the value it had after the last commit. If the field has not
     * been modified, the current value is returned.
     * @param {String} fieldName Field name
     * @returns {*} The unmodified value of the field, or its current value if not modified
     * @category Editing
     */
    getUnmodified(fieldName) {
        const
            me    = this,
            field = me.getFieldDefinition(fieldName);

        // Store fields in granular mode (STM trackStoreDataFields) do not snapshot their original
        // value - meta.modified holds a marker instead
        if (field?.isStoreDataField && me.meta.modified[fieldName] === field.constructor.granularModifiedMarker) {
            return undefined;
        }

        return me.isModified ? me.meta.modified[fieldName] : me.get(fieldName);
    }

    /**
     * Returns field value that should be persisted, or `undefined` if field is configured with `persist: false`.
     * @param {String|Core.data.field.DataField} nameOrField Name of the field to get value for, or its field definition
     * @private
     * @category Fields
     */
    getFieldPersistentValue(nameOrField) {
        const
            field = typeof nameOrField === 'string' ? this.getFieldDefinition(nameOrField) : nameOrField,
            name  = field?.name || nameOrField;

        let result;

        if (!field || field.persist) {
            result = this.getValue(name);
            // if serialize function is provided we use it to prepare the persistent value
            if (field?.serialize) {
                result = field.serialize(result, this);
            }
        }

        return result;
    }

    /**
     * Get a map of the modified fields in form of an object. The field *names* are used as the property names
     * in the returned object, and the property values are the latest field values.
     *
     * The `id` field is included unless its {@link Core.data.field.DataField#config-persist} config is `false`.
     * @member {Object}
     * @readonly
     * @category Editing
     */
    get modifications() {
        const data = this.rawModifications;

        if (data && Object.keys(data).length && this.fieldMap.id.persist) {
            data[this.constructor.idField] = this.id;
        }

        return data;
    }

    get rawModifications() {
        const
            me = this,
            data = {};

        if (!me.isModified) {
            return null;
        }

        let keySet = false;

        Object.keys(me.meta.modified).forEach(key => {
            // <remove-on-release>
            // TODO: isModified will report record as modified even if a modification won't be persisted here. Should it?
            // </remove-on-release>
            const value = me.getFieldPersistentValue(key);
            if (value !== _undefined) {
                data[key] = value;
                keySet = true;
            }
        });

        return keySet ? data : null;
    }

    /**
     * Get a map of the modified fields in form of an object. The field´s {@link Core.data.field.DataField#config-dataSource}
     * is used as the property name in the returned object. The record's id is included unless its
     * {@link Core.data.field.DataField#config-persist} config is `false`.
     * @member {Object}
     * @readonly
     * @category Editing
     */
    get modificationData() {
        const data = this.rawModificationData;

        // If there are some persistable field changes, append record id
        if (data && Object.keys(data).length && this.fieldMap.id.persist) {
            ObjectHelper.setPath(data, this.constructor.idField, this.id);
        }

        return data;
    }

    /**
     * Returns a map of the modified persistable fields
     * @internal
     * @member {Object}
     * @readonly
     * @category Editing
     */
    get rawModificationData() {
        const
            me = this,
            { fieldMap } = me.constructor,
            data = {};

        if (!me.isModified) {
            return null;
        }

        let keySet = false;

        Object.keys(me.meta.modified).forEach(fieldName => {
            // <remove-on-release>
            // TODO: isModified will report record as modified even if a modification won't be persisted here. Should it?
            // </remove-on-release>
            let
                field      = fieldMap[fieldName],
                dataSource = field?.dataSource;

            // Nested field, get top level field definition, but set the dataSource to the full path
            if (fieldName.includes('.')) {
                const topLevelFieldName = fieldName.match(nestedRe)[1];
                field = fieldMap[topLevelFieldName];
                dataSource = fieldName;
            }

            // No field definition means there's no original dataSource to update
            if (field?.persist) {
                const value = me.getFieldPersistentValue(fieldName);

                if (value !== _undefined) {
                    ObjectHelper.setPath(data, dataSource, value);
                    keySet = true;
                }
            }
        });

        return keySet ? data : null;
    }

    /**
     * Get a map of the modified data fields along with any {@link Core/data/field/DataField#config-alwaysWrite} fields,
     * in form of an object. The field´s *dataSource* is used as the property name in the returned object.
     * Used internally by AjaxStore / CrudManager when sending updates.
     * @member {Object}
     * @readonly
     * @category Editing
     */
    get modificationDataToWrite() {
        const
            me = this,
            { modificationData, constructor : ctor } = me,
            recordData = modificationData ?? {},
            fields = ctor.alwaysWriteFields;

        let hasData = Boolean(modificationData);

        // add data of fields having alwaysWrite:true
        fields.forEach(field => {
            ObjectHelper.setPath(recordData, field.dataSource, me.getFieldPersistentValue(field));
            hasData = true;
        });

        // if there is no modificationData and we added alwaysWrite-fields we also need to include id value
        if (hasData && !modificationData && me.fieldMap.id.persist) {
            ObjectHelper.setPath(recordData, ctor.idField, me.id);
        }

        return hasData ? recordData : null;
    }

    /**
     * Returns data for **all** {@link Core.data.field.DataField#config-persist persistable} fields in form of an
     * object, using dataSource if present.
     * @member {Object}
     * @readonly
     * @internal
     * @category Editing
     */
    get persistableData() {
        const
            me   = this,
            data = {};

        me.fields.forEach(field => {
            const value = me.getFieldPersistentValue(field);

            if (value !== _undefined) {
                if (field?.complexMapping) {
                    ObjectHelper.setPath(data, field.dataSource, value);
                }
                else {
                    data[field.dataSource] = value;
                }
            }
        });

        return data;
    }

    get dataByFieldName() {
        const { data } = this;

        return this.fields.reduce((result, field) => {
            if (ObjectHelper.hasPath(data, field.dataSource)) {
                result[field.name] = data[field.dataSource];
            }
            return result;
        }, {});
    }

    /**
     * True if this models changes are currently being committed.
     * @member {Boolean}
     * @readonly
     * @category Editing
     */
    get isCommitting() {
        return Boolean(this.meta.committing);
    }

    /**
     * Clears tracked changes, used on commit. Does not revert changes.
     * @param {Boolean} [includeDescendants] Supply `false` to not clear node descendants
     * @category Editing
     */
    clearChanges(includeDescendants = true, ...args) {
        this.internalClearChanges(includeDescendants, ...args);

        this.stores?.forEach(store => store.trigger('clearChanges', { record : this }));
    }

    internalClearChanges(includeDescendants = true, removeFromStoreChanges = true, changes = null, clearNonPersistable = false) {
        const
            me = this,
            { meta } = me;

        // If we've received an object with changes, we only need to clean that one up
        if (changes) {
            const { modified } = meta;

            for (const key in changes) {
                delete modified[key];
            }

            for (const key in modified) {
                const field = me.getFieldDefinition(key);

                if (
                    // If there's a store field modified, we won't receive those changes here. So instead we need to go
                    // over modified fields, find their backing stores and remove those keys if stores' changes are null
                    // (meta.modified holds the field's original value, so the store is resolved via the field)
                    field?.isStoreDataField && me.meta[`${key}Store`] && !me.meta[`${key}Store`].changes ||
                    // Remove non-persistable fields
                    clearNonPersistable && !field?.persist
                ) {
                    delete modified[key];
                }
            }
        }
        else {
            // for remote changes, we clear the old changes and apply only the changes made
            // during the record's materialization
            meta.modified = { ...meta.modifiedMaterialized };
            meta.modifiedMaterialized = null;

            // Accepting all changes on the record includes the stores backing its store type fields -
            // their own change bags are the field's dirty state (the source of truth in granular mode,
            // where a stale bag would resurrect the field's modified marker on the store's next change)
            for (const field of me.constructor.$meta.fields.initable ?? []) {
                if (field.isStoreDataField) {
                    meta[`${field.name}Store`]?.acceptChanges();
                }
            }
        }

        // We can only remove the record from the store´s "modified" bag if there are no modified fields in meta
        const noChanges = ObjectHelper.isEmpty(meta.modified);

        meta.committing = false;

        if (removeFromStoreChanges) {
            me.stores?.forEach(store => {
                noChanges && store.modified.remove(me);
                store.added.remove(me);
                if (includeDescendants) {
                    const descendants = store.collectDescendants(me).all;
                    store.added.remove(descendants);
                    noChanges && store.modified.remove(descendants);
                }
            });
        }
    }

    storeFieldChange(key, oldValue) {
        const { meta } = this;

        meta.modified[key] = oldValue;

        // we need to track the changes that were applied during the record's materialization process
        // (during the sync request) separately, since we'll need to issue a second sync request
        // with these changes only
        if (this.isBeingMaterialized) {
            meta.modifiedMaterialized = meta.modifiedMaterialized ?? {};
            meta.modifiedMaterialized[key] = oldValue;
        }
    }

    /**
     * Reverts changes in this back to their original values.
     * @privateparam {Boolean} [silent] Specify `true` to not trigger events.
     * @category Editing
     */
    revertChanges(silent = false) {
        const
            me           = this,
            { modified } = me.meta;

        let toSet = modified;

        // Store fields in granular mode (STM trackStoreDataFields) do not snapshot their original value
        // (meta.modified holds a marker) - revert is delegated to the backing store, which tracks its
        // own changes exactly
        for (const key of Object.keys(modified)) {
            const field = me.getFieldDefinition(key);

            if (field?.isStoreDataField && modified[key] === field.constructor.granularModifiedMarker) {
                if (toSet === modified) {
                    toSet = { ...modified };
                }

                delete toSet[key];

                const store = me.meta[`${key}Store`];

                if (store) {
                    // Match the snapshot path's silent semantics: a silent revert must not fire the
                    // owning record's update/change events (the backing store's own events fire as
                    // usual in both modes). The flag is read by StoreDataField#onGranularChange
                    store.$isRevertingSilently = silent;
                    store.revertChanges();
                    store.$isRevertingSilently = false;
                }
            }
        }

        // Flag checked by engine to not set startDate constraint on revert
        me.isReverting = true;

        me.set(toSet, _undefined, silent);

        me.isReverting = false;
    }

    setByDataSource(rawChanges) {
        const
            me                     = this,
            { fieldDataSourceMap } = me.constructor,
            rawChangesSimplePaths  = ObjectHelper.pathifyKeys(rawChanges, fieldDataSourceMap),
            changes                = {};

        // Collect the changes into a change set for field names.
        for (const dataSource in rawChangesSimplePaths) {
            const
                field    = fieldDataSourceMap[dataSource],
                propName = field?.name ?? dataSource;

            changes[propName] = rawChangesSimplePaths[dataSource];
        }

        return me.set(changes);
    }

    applyChangeset(rawChanges, phantomIdField = '$PhantomId', clearChanges = true) {
        const
            me                     = this,
            modelClass             = me.constructor,
            {
                idField,
                fieldDataSourceMap
            } = modelClass,
            // rawChanges object contains dataSources for keys
            // rawChangesSimplePaths is a one-level object with dataSources (too) for keys
            rawChangesSimplePaths  = ObjectHelper.pathifyKeys(rawChanges, fieldDataSourceMap),
            changes                = {},
            // Value of id field cannot be changed, it can only be set. In which case phantom id field will be in the
            // rawChanges objects
            idChanged              = phantomIdField in rawChanges && !(idField in rawChanges);

        if (!idChanged && phantomIdField in rawChangesSimplePaths) {
            delete rawChangesSimplePaths[phantomIdField];
        }

        // Collect the changes into a change set for field names.
        for (const dataSource in rawChangesSimplePaths) {
            const
                field    = fieldDataSourceMap[dataSource],
                propName = field?.name ?? dataSource;

            changes[propName] = rawChangesSimplePaths[dataSource];
        }

        // Server response carrying `$PhantomId` must clear the phantom flag even if the assigned id
        // equals the previous phantom id (the `set()` equality gate would otherwise skip it). (#13159)
        const phantomResolved = me.$isPhantom && phantomIdField in rawChanges;

        // Apply all changes in one go, making sure record is considered unmodified after
        const wasSet = me.set(changes);

        if (phantomResolved) {
            me.$isPhantom = false;
        }

        clearChanges && me.clearChanges(false, true, changes);

        // wasSet has format { field : { oldValue, value }}, convert to { field : value }
        const result = wasSet ? Object.entries(wasSet).reduce((result, [field, change]) => {
            result[field] = change.value;
            return result;
        }, {}) : {};

        super.applyChangeset(rawChanges, phantomIdField, clearChanges);

        return result;
    }

    //endregion

    //region Id

    /**
     * Gets the records internalId. It is assigned during creation, guaranteed to be globally unique among models.
     * @member {Number}
     * @readonly
     * @category Identification
     */
    get internalId() {
        return this._internalId;
    }

    /**
     * Returns true if the record is new and has not been persisted (and received a proper id).
     *
     * A newly created record is assigned a temporary (phantom) id and is treated as "added" until it receives a real
     * id from the backend. `CrudManager` and {@link Core/data/AjaxStore} perform this id replacement automatically when
     * committing. If you save records with your own logic, you must assign the real id returned by the backend
     * yourself, otherwise the record keeps its phantom id and stays flagged as added:
     *
     * ```javascript
     * const [task] = taskStore.add({});
     *
     * const result = await save(task);
     *
     * task.id = result.id; // replace the phantom id with the real one from the backend
     *
     * taskStore.commit(); // or project.acceptChanges()
     * ```
     *
     * @member {Boolean}
     * @readonly
     * @category Identification
     */
    get isPhantom() {
        return this.id === '' || this.id == null || this.hasGeneratedId || Boolean(this.$isPhantom);
    }

    get isModel() {
        return true;
    }

    /**
     * Checks if record has a generated id.
     *
     * New records are assigned a generated id based on a UUID (starting with `_generated`), which is intended to be
     * temporary and should be replaced by the backend on commit.
     *
     * @member {Boolean}
     * @readonly
     * @category Identification
     */
    get hasGeneratedId() {
        return typeof this.id === 'string' && this.id.startsWith('_generated');
    }

    /**
     * Generates an id for a new record (a phantom id), based on a UUID by default.
     *
     * This function can be overridden to provide custom id generation logic.
     *
     * ```javascript
     * let idCounter = 0;
     * // Override the default logic with app specific
     * Model.generateId = () => `id${new Date().getTime()}${idCounter++}`;
     * ```
     *
     * @param {String} text Text used as optional prefix for the id, defaults to the name of the class
     * @returns {String|Number} A generated id
     * @category Identification
     */
    static generateId(text = this.$$name) {
        return `_generated${text}_${StringHelper.generateUUID()}`;
    }

    /**
     * Generates an id for a new record (a phantom id), based on a UUID (starting with `_generated`).
     *
     * Generated ids are intended to be temporary and should be replaced by the backend on commit.
     *
     * @category Identification
     * @returns {String}
     */
    generateId() {
        return this.constructor.generateId();
    }

    /**
     * Gets the id of specified model or model data object, or the value if passed string/number.
     * @param {Core.data.Model|String|Number} model
     * @returns {String|Number} id
     * @category Identification
     */
    static asId(model) {
        return model?.isModel ? model.id : ObjectHelper.isObject(model) ? model[this.fieldMap.id.dataSource] : model;
    }

    //endregion

    //region JSON

    /**
     * Get the records data as a json string.
     *
     * ```javascript
     * const record = new Model({
     *     title    : 'Hello',
     *     children : [
     *         ...
     *     ]
     * });
     *
     * const jsonString = record.json;
     *
     * //jsonString:
     * '{"title":"Hello","children":[...]}'
     * ```
     *
     * @member {String}
     * @category JSON
     */
    get json() {
        return StringHelper.safeJsonStringify(this);  // calls our toJSON() method
    }

    /**
     * Used by `JSON.stringify()` to correctly convert this record to json.
     *
     * In most cases no point in calling it directly.
     *
     * ```
     * // This will call `toJSON()`
     * const json = JSON.stringify(record);
     * ```
     *
     * If called manually, the resulting object is a clone of `record.data` + the data of any children:
     *
     * ```
     * const record = new Model({
     *     title    : 'Hello',
     *     children : [
     *         ...
     *     ]
     * });
     *
     * const jsonObject = record.toJSON();
     *
     * // jsonObject:
     * {
     *     title : 'Hello',
     *     children : [
     *         ...
     *     ]
     * }
     * ```
     *
     * @returns {Object}
     * @category JSON
     */
    toJSON() {
        const
            { unfilteredOrChildren } = this,
            jsonData                 = this.persistableData;

        if (unfilteredOrChildren) {
            jsonData[this.constructor.childrenField] = unfilteredOrChildren.map(c => c.toJSON());
        }

        return jsonData;
    }

    /**
     * Represent the record as a string, by default as a JSON string. Tries to use an abbreviated version of the
     * object's data, using id + name/title/text/label/description. If no such field exists, the full data is used.
     *
     * ```javascript
     * const record = new Model({ id : 1, name : 'Steve Rogers', alias : 'Captain America' });
     * console.log(record.toString()); // logs { "id" : 1, "name" : "Steve Rogers" }
     * ```
     *
     * @returns {String}
     * @category JSON
     */
    toString() {
        const
            me        = this,
            nameField = abbreviationFields.find(field => field in me.constructor.fieldMap),
            data      = nameField ? { [me.constructor.idField] : me.id, [nameField] : me[nameField] } : me.data;

        return StringHelper.safeJsonStringify(data);
    }

    //endregion

    //region Batch

    /**
     * True if this Model is currently batching its changes.
     * @member {Boolean}
     * @readonly
     * @category Editing
     */
    get isBatchUpdating() {
        return Boolean(this.batching);
    }

    /**
     * Returns `true` if this Model currently has outstanding batched changes for the specified field name.
     * @param {String} fieldName The field name to check for batched updates on.
     * @returns {Boolean}
     * @category Editing
     */
    hasBatchedChange(fieldName) {
        return this.meta?.batchChanges?.[fieldName];
    }

    /**
     * Begin a batch, which stores changes and commits them when the batch ends.
     * Prevents events from being fired during batch.
     *
     * ```javascript
     * record.beginBatch();
     * record.name = 'Mr Smith';
     * record.team = 'Golden Knights';
     * record.endBatch();
     * ```
     *
     * Please note that you can also set multiple fields in a single call using {@link #function-set}, which in many
     * cases can replace using a batch:
     *
     * ```javascript
     * record.set({
     *   name : 'Mr Smith',
     *   team : 'Golden Knights'
     * });
     * ```
     * @category Editing
     * @privateparam {Boolean} silentUpdates Suppress firing the `batchUpdatedEvent`
     */
    beginBatch(silentUpdates = false) {
        const me = this;

        if (!me.batching) {
            me.batching = 0;
            me.meta.batchChanges = {};
        }

        if (silentUpdates) {
            me.$silenceBatch = (me.$silenceBatch || 0) + 1;
        }

        me.batching++;
    }

    /**
     * End a batch, triggering events if data has changed.
     * @param {Boolean} [silent] Specify `true` to not trigger events. If event is recurring, occurrences won't be updated automatically.
     * @privateparam {Boolean} [silent=false] Specify `true` to not trigger events. If event is recurring, occurrences won't be updated automatically.
     * @privateparam {Boolean} [triggerBeforeUpdate=true]
     * @category Editing
    */
    endBatch(silent = false, skipAccessors = false, triggerBeforeUpdate = true) {
        const
            me                = this,
            { parentIdField } = me.constructor;

        if (!me.batching) {
            return;
        }

        me.batching--;

        // Ideally we should track which batch was silenced, but that will complicate code more than what avoiding a few
        // triggered events is worth (this is private and we do not start batches while batches are ongoing in the
        // critical code path in engine)
        me.$silenceBatch && me.$silenceBatch--;

        if (me.batching > 0) {
            return;
        }

        // Set pending batch changes
        if (!ObjectHelper.isEmpty(me.meta.batchChanges)) {
            let { batchChanges } = me.meta;
            me.meta.batchChanges = null;

            // Move to its new parent before applying the other changes.
            if (batchChanges[parentIdField]) {
                batchChanges = { ...batchChanges };
                me.parentId = batchChanges[parentIdField];
                delete batchChanges[parentIdField];
            }

            me.set(batchChanges, _undefined, silent, false, skipAccessors, undefined, triggerBeforeUpdate);
        }
    }

    /**
     * Cancels current batch operation. Any changes during the batch are discarded.
     * @category Editing
     */
    cancelBatch() {
        if (this.batching) {
            const
                me               = this,
                { batchChanges } = me.meta,
                wasSet           = {};

            me.batching = null;
            me.meta.batchChanges = null;

            me.generation++;

            if (!me.$silenceBatch) {
                // Create a wasSet describing the revert back from the batched values to the real values.
                Object.entries(batchChanges).forEach(([key, oldValue]) => {
                    wasSet[key] = {
                        oldValue,
                        value : me[key]
                    };
                });

                // Fire batched events for UIs which need to update themselves during batched updates.
                // An example is evenResize feature which batches the changes to the endDate
                // or startDate, but the UI must update during the drag.
                const event = {
                    action  : 'update',
                    record  : me,
                    records : [me],
                    changes : wasSet
                };
                me.stores?.forEach(store =>
                    // Cant use event directly, it will get polluted with `source` and then have that incorrect for
                    // following calls
                    store.trigger('batchedUpdate', { ...event })
                );

                // Propagate to linked records
                me.forEachLinked((store, record) =>
                    store.trigger('batchedUpdate', { ...event, record, records : [record] })
                );
            }

            me.$silenceBatch && me.$silenceBatch--;
        }
    }

    //endregion

    //region Events

    /**
     * Triggers beforeUpdate event for each store and checks if changes can be made from event return value.
     * @param {Object} changes Data changes
     * @returns {Boolean} returns true if data changes are accepted
     * @private
     */
    triggerBeforeUpdate(changes) {
        return !this.stores?.some(s => s.trigger('beforeUpdate', { record : this, changes }) === false);
    }

    //endregion

    //region Additional functionality
    /**
     * For copied records, this property links to the original model instance from which it was copied.
     * @member {Core.data.Model} copyOf
     * @readonly
     * @category Editing
     */

    /**
     * Makes a copy of this model, assigning the specified id or a generated id and also allowing you to pass field
     * values to the created copy. A {@link #property-copyOf} property is set on the copy to reference the original
     * record.
     *
     * ```
     * const record = new Model({ name : 'Super model', hairColor : 'Brown' });
     * const clone = record.copy({ name : 'Super model clone' });
     * ```
     * @param {Number|String|Object} [newIdOrData] The id for the copied instance, or any field values to apply
     * (overriding the values from the source record). If no id provided, one will be auto-generated
     * @param {Boolean} [deep] True to also clone children
     * @returns {Core.data.Model} Copy of this model
     * @category Editing
     */
    copy(newIdOrData = null, deep = null) {
        const
            me      = this,
            data    = ObjectHelper.clone(me.data),
            idField = me.constructor.idField,
            // Chrono model is adding more logic to copy and that logic should be manageable from arguments. So there is
            // option to pass object as a last argument to switch method behavior. Used internally only, shouldn't be public.
            useDeep = ObjectHelper.isObject(deep) ? deep.deep : deep;

        let id;

        if (newIdOrData && typeof newIdOrData === 'object') {
            id = newIdOrData[idField];

            Object.assign(data, newIdOrData);
        }
        else {
            id = newIdOrData;
        }

        // Iterate over instance children, because data may not reflect actual children state.
        // Copy's initial expanded state will be from the "expanded" property of the data object
        // which is cloned from the source.
        if (useDeep && me.children) {
            // newIdOrData is false means we want to preserve existing id value - let's pass it to nested calls too then
            data.children = me.children.map(child => child.copy(newIdOrData === false ? false : undefined, deep));
        }
        else {
            delete data.children;
            delete data.expanded;
        }

        if (me.$meta.fields.initable.length > 0) {
            const json    = me.toJSON();
            for (const field of me.$meta.fields.initable) {
                data[field.name] = json[field.name];
            }
        }

        if (newIdOrData !== false) {
            // We can use the value from the 'id' property, but as a fallback, generate the id.
            data[idField] = id || me.generateId(me.firstStore);
        }

        // Force using raw data when creating a copy, since data was cloned above anyway
        const copy = new me.constructor(data, null, null, false, true);

        // Store original record internal id to lookup from copy later
        copy.originalInternalId = me.internalId;
        // Store original record
        copy.copyOf = me;

        return copy;
    }

    // Copies data using the real field names to trigger setters
    copyData(fromRecord, raw, silent) {
        const
            propertiesAndValues = {},
            skipFields          = this.skipCopyFields || {};

        fromRecord.allFields.forEach(({ name: fieldName }) => {
            if (fieldName !== fromRecord.constructor.idField && !(fieldName in skipFields)) {
                propertiesAndValues[fieldName] = raw ? fromRecord.get(fieldName) : fromRecord.getValue(fieldName);
            }
        });

        this.set(propertiesAndValues, null, silent);
    }

    /**
     * Removes this record from all stores (and in a tree structure, also from its parent if it has one).
     * @param {Boolean} [silent] Specify `true` to not trigger events. If the event is recurring, occurrences won't be
     * updated automatically.
     * @category Editing
     */
    remove(silent = false) {
        const
            me                 = this,
            { parent, stores } = me;

        // Remove from parent if we're in a tree structure.
        // This informs the owning store(s)
        if (parent) {
            parent.removeChild(me, false, silent, { unfiltered : true });
        }
        // Store handles remove
        // Not sure what should happen if you try to remove a special row (group row for example), bailing out
        else if (stores?.length && !me.isSpecialRow) {
            // Create a shallow copy of the stores array, since the original may get modified when store is removed
            const storesCopy = stores.slice();
            storesCopy.forEach(s => s.remove(me, silent, false, true));
        }
    }

    // Called by stores before removing the record from the store. Returning false prevents the removal (overridden in
    // ModelLink.js)
    beforeRemove(stores, records) {
        return super.beforeRemove(stores, records);
    }

    //endregion

    //region Validation

    /**
     * Check if record has valid data. Default implementation returns true, override in your model to do actual validation.
     * @member {Boolean}
     * @readonly
     * @category Editing
     */
    get isValid() {
        return true;
    }

    //endregion

    //region Store

    /**
     * Get the first store that this model is assigned to.
     * @member {Core.data.Store}
     * @readonly
     * @category Misc
     */
    get firstStore() {
        return this.stores?.[0];
    }

    // Returns a timezone aware DateHelper if a timezone is configured, otherwise the regular DateHelper
    get dateHelper() {
        return this.firstStore?.dateHelper ?? DateHelper;
    }

    get dh() {
        return this.dateHelper;
    }

    /**
     * Joins this record and any children to specified store, if not already joined.
     * @internal
     * @param {Core.data.Store} store Store to join
     * @category Misc
     */
    joinStore(store) {
        const me = this;

        if (!me.stores || !me.stores.includes(store)) {
            super.joinStore?.(store);

            store.register(me);

            if (!me.stores) {
                me.stores = [store];
            }
            else {
                me.stores.push(store);
                // If record was a part of the tree store, then store was chained and record removed from the
                // original store, `stores` would still have chained store. When adding record back to the original
                // store we need to make sure real store (not a chained one) becomes first. Some checks rely on the
                // `record.firstStore` to be a tree store. Therefore we sort stores to keed chained stores at the end
                me.stores.sort((a, b) => (a.isChained ? 1 : 0) - (b.isChained ? 1 : 0));
            }

            if (me.unjoinedStores && me.unjoinedStores.includes(store)) {
                me.unjoinedStores.splice(me.unjoinedStores.indexOf(store), 1);
            }
            me.children?.length && me.children.forEach(child => child.joinStore(store));
            me.constructor.exposedRelations && me.initRelations();

            // do not change the collapsed state during stm restoring
            if (store.tree && !me.isRoot && !store.stm?.isRestoring) {
                me.instanceMeta(store.id).collapsed = !me.expanded;
            }
        }
    }

    /**
     * Unjoins this record and any children from specified store, if already joined.
     * @internal
     * @param {Core.data.Store} store Store to join
     * @param {Boolean} [isReplacing] `true` if this record is being replaced
     * @category Misc
     */
    unjoinStore(store, isReplacing = false) {
        const
            me = this,
            { stores } = me;

        if (stores?.includes(store)) {
            if (!store.isDestroying) {
                store.unregister(me);

                // unjoinedStores is created here when used instead of in construct for performance reasons
                if (!me.unjoinedStores) {
                    me.unjoinedStores = [store];
                }
                else {
                    me.unjoinedStores.push(store);
                }
            }

            // me.children may === true...
            // If filtered, *all* children must be unjoined when we are.
            me.unfilteredOrChildren?.forEach?.(child => child.unjoinStore(store, isReplacing));

            stores.splice(stores.indexOf(store), 1);
            // keep the cord to allow removed records to reach the store when needed

            super.unjoinStore?.(store, isReplacing);

            // remove from relation cache
            store.uncacheRelatedRecord(me);

            // If STM is being used, we need to keep expanded/collapsed state
            if (me.meta.map && !store.stm) {
                delete me.meta.map[store.id];
            }
        }
    }

    /**
     * Returns `true` if this record is contained in the specified store, or in any store if store param is omitted.
     * @internal
     * @param {Core.data.Store} store Store to check
     * @returns {Boolean}
     * @category Misc
     */
    isPartOfStore(store) {
        if (store) {
            return store.includes(this);
        }

        return this.stores?.length > 0;
    }

    /**
     * Returns true if this record is not part of any store.
     * @member {Boolean}
     * @readonly
     * @internal
     */
    get isRemoved() {
        return !this.isPartOfStore();
    }

    //endregion

    /**
     * Defines if the given event field should be manually editable in UI.
     * You can override this method to provide your own logic.
     *
     * @param {String} fieldName Name of the field
     * @returns {Boolean|undefined} Returns `true` if the field is editable, `false` if it is not and `undefined` if the model has no such field.
     */
    isEditable(fieldName) {
        const fieldDef = this.getFieldDefinition(fieldName);
        // return undefined for unknown fields

        if (fieldDef?.calculated) {
            return false;
        }

        if (this.readOnly) {
            // Always allow toggling readOnly flag from UI
            return fieldName === 'readOnly';
        }

        return fieldDef ? true : undefined;
    }

    //region Per instance meta

    /**
     * Used to set per external instance meta data. For example useful when using a record in multiple grids to store some state
     * per grid.
     * @param {String|Object} instanceOrId External instance id or the instance itself, if it has id property
     * @private
     * @category Misc
     */
    instanceMeta(instanceOrId) {
        const
            { meta } = this,
            id       = instanceOrId.id || instanceOrId;

        return meta.map?.[id] || this.setInstanceMeta(id, {});
    }

    setInstanceMeta(instanceOrId, value) {
        const
            { meta } = this,
            id       = instanceOrId.id || instanceOrId;

        if (!meta.map) {
            meta.map = {};
        }

        return meta.map[id] = value;
    }

    /**
     * When called on a group header row returns list of records in that group. Returns `undefined` otherwise.
     * @member {Core.data.Model[]|undefined} groupChildren
     * @category Grouping
     * @readonly
     */

    /**
     * Returns `true` for a group header record
     * @member {Boolean}
     * @category Grouping
     * @readonly
     */
    get isGroupHeader() {
        return 'groupRowFor' in this.meta;
    }

    /**
     * Returns `true` for a group footer record
     * @member {Boolean}
     * @category Grouping
     * @readonly
     */
    get isGroupFooter() {
        return 'groupFooterFor' in this.meta;
    }

    get isSpecialRow() {
        return Boolean(this.meta?.specialRow);
    }

    get $original() {
        return this.isLinked ? this.proxyMeta.originalRecord : this;
    }

    //endregion

    static get nonPersistableFields() {
        const me = this;

        if (!me._nonPersistableFields) {
            me._nonPersistableFields = {};

            me.allFields.forEach(field => {
                if (!field.persist || field.calculated) {
                    me._nonPersistableFields[field.name] = 1;
                }
            });
        }

        return me._nonPersistableFields;
    }

    static get alwaysWriteFields() {
        const me = this;

        if (!me._alwaysWriteFields) {
            me._alwaysWriteFields = me.allFields.filter(field => field.alwaysWrite);
        }

        return me._alwaysWriteFields;
    }

    // Id with spaces and dots replaced by -, for safe usage as an id in DOM
    get domId() {
        return typeof this.id === 'string' ? this.id.replace(/[ .]/g, '-') : this.id;
    }

    //region Extract config

    // These functions are not meant to be called by any code other than Base#getCurrentConfig()

    // Convert custom modelClass to string, keeping custom fields
    static toJavaScriptValue(options) {
        // Get name, skipping the automatically extended name that goes last (MyModel, not MyModelEx)
        const
            { names } = this.$meta,
            className = names[names.length - 2],
            superName =  names[names.length - 3];

        return `class ${className} extends ${superName} { static fields = ${StringHelper.toJavaScriptValue(this.fields, options)}; }`;
    }

    // Get fields current values
    getCurrentConfig(options) {
        const
            { data, children }              = this,
            { defaultValues, applyConfigs } = this.constructor,
            result                          = applyConfigs ? super.getCurrentConfig(options) : {};

        if (result) {
            for (const field of this.fields) {
                if (field.persist) {
                    const value = ObjectHelper.getPath(data, field.dataSource);
                    if (value != null && !field.isEqual(value, defaultValues[field.name])) {
                        ObjectHelper.setPath(result, field.dataSource, Base.processConfigValue(value, options));
                    }
                }
            }

            // Always include children
            if (children) {
                // Inline available children
                if (Array.isArray(children)) {
                    result.children = [];
                    for (const child of children) {
                        result.children.push(child.getCurrentConfig(options));
                    }
                }
                // Load on demand
                else {
                    result.children = children;
                }
            }

            if (this.hasGeneratedId) {
                delete result.id;
            }

            delete result.parentId;
            delete result.parentIndex;
        }

        return result;
    }

    //endregion
}

Model._idField = 'id';
Model._internalIdCounter = 1;
Model._assignedIdField = false;

Model.exposeProperties();
