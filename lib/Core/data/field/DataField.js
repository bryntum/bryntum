import Base from '../../Base.js';
import Factoryable from '../../mixin/Factoryable.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import FormulaProvider from '../../util/FormulaProvider.js';

/**
 * @module Core/data/field/DataField
 */

const { getOwnPropertyDescriptor } = Reflect;

/**
 * This is the base class for Model field classes. A field class defines how to handle the data for a particular type
 * of field. Many of these behaviors can be configured on individual field instances.
 *
 * While defining `fields` on {@link Core.data.Model} in TypeScript, data fields should be of type `ModelFieldConfig`
 * instead of `DataField`, because it is a union type that gives completion based on specified type.
 *
 * ```typescript
 * class Person extends Model {
 *      static name: string = 'Person'
 *
 *      static fields: ModelFieldConfig[] = [
 *          { name: 'address', type: 'string' },
 *          { name: 'contact', type: 'int' }
 *      ]
 * }
 *
 * ```
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
 *         { name : 'net', calculate : record => record.revenue * (1 - (record.tax / 100)) },
 *     ],
 *     data : [
 *         { id : 1, revenue : 100, tax : 30 }
 *     ]
 * });
 *
 * const record = store.getById(1).net; // 70
 * ```
 *
 * ## Useful configs
 *
 * | Config                                       | Description                                       |
 * |----------------------------------------------|---------------------------------------------------|
 * | {@link #config-name}                         | The name of the field                              |
 * | {@link #config-defaultValue}                 | Default value for new records                      |
 * | {@link #config-nullable}                     | Allow `null` values for this field                 |
 * | {@link #config-readOnly}                     | Prevent modification of the field value            |
 * | {@link #config-calculate}                    | Function to compute the value from other fields    |
 *
 * ## See also
 *
 * - {@link Core.data.Model} - The base model class that holds field definitions
 * - {@link Core.data.field.StringDataField} - String field type
 * - {@link Core.data.field.NumberDataField} - Number field type
 * - {@link Core.data.field.DateDataField} - Date field type
 *
 * @extends Core/Base
 * @datafield
 */
export default class DataField extends Base.mixin(Factoryable) {
    static $name = 'DataField';

    static type = 'auto';

    static factoryable = {
        defaultType : 'auto'
    };

    static prototypeProperties = {
        /**
         * The name of the field.
         *
         * If the name contains a dot (`.`), it is assumed to be a nested field, and the `complexMapping` config is
         * automatically set to `true`. This means that the field will point to nested data (path separated by dots in
         * the field name). Configure it as `false` to allow data field names that actually contain dots. See
         * {@link #config-complexMapping} for more information.
         *
         * @config {String} name
         */

        /**
         * The label text for a form item generated for this field. This is also used to create
         * a column header for a {@link #config-column} for this field.
         *
         * If no label is specified, the value yielded by this property is a prettified version of
         * the field name created using {@link Core.helper.StringHelper#function-separate-static}.
         * @config {String} label
         */

        /**
         * A column config object for a column to display this field in a grid. For simple, atomic
         * data types, such as `date`, `string`, `boolean`, `number` and `integer`, this is optional
         * and the appropriate column type can be inferred.
         *
         * This also provides default values for column configuration if a configured column definition
         * for a grid lacks a property.
         *
         * For complex fields, such as identifiers which link to other records, a more capable
         * column type may be specified, for example a `type : 'number'` field may be configured
         * with
         *
         * ```javascript
         * column : 'percent'
         * ```
         * or
         * ```javascript
         * column : {
         *     type : 'percent',
         *     width : 100
         * }
         * ```
         * if it represents a percentage value and needs appropriate rendering and editing.
         * @config {String|GridColumnConfig} column
         */

        /**
         * A config object for a widget to edit this field in a form. For simple, atomic
         * data types, such as `date`, `string`, `boolean`, `number` and `integer`, this is optional
         * and the appropriate input widget type can be inferred.
         *
         * For complex fields, such as identifiers which link to other records, a more capable
         * widget may be specified.
         * @config {String|InputFieldConfig} editor
         * @private
         */

        /**
         * A function which transforms a data value into the desired form for storage in the record's data object.
         *
         * ```javascript
         * export default class Task extends TaskModel {
         *    static fields = [
         *        {
         *            name    : 'status',
         *            convert : (value, data) => {
         *                if (value >= 100) {
         *                    return 'done';
         *                }
         *                else if (value > 0) {
         *                    return 'started';
         *                }
         *            }
         *        }
         *    ];
         * }
         * ```
         *
         * @config {Function} convert
         * @param {*} value The value to convert for storage in a record.
         * @param {Object} data The raw record data object
         * @returns {*} The converted value.
         */

        /**
         * A function which transforms a data value into the desired form for transmitting to a server.
         *
         * ```javascript
         * export default class Task extends TaskModel {
         *    static fields = [
         *        {
         *            name      : 'status',
         *            serialize : value => value === 'done' ? 100 : 0
         *        }
         *    ];
         * }
         * ```
         *
         * @config {Function} serialize
         * @param {*} value The value to serialize
         * @param {Core.data.Model} record The record that contains the value being serialized.
         * @returns {*} The serialized value.
         */

        /**
         * A function that compares two values and returns a value < 0 if the first is less than the second, or 0
         * if the values are equal, or a value > 0 if the first is greater than the second.
         * @config {Function}
         * @param {Core.data.Model} value1
         * @param {Core.data.Model} value2
         * @returns {Number}
         * @default
         */
        compare : null,

        /**
         * A function that compares two objects or records using the `compare` function on the properties of each
         * object based on the `name` of this field.
         * @config {Function}
         * @param {Core.data.Model} value1
         * @param {Core.data.Model} value2
         * @returns {Number}
         * @default
         * @internal
         */
        compareItems : null,

        /**
         * The property in a record's data object that contains the field's value.
         * Defaults to the field's `name`.
         *
         * Besides mapping to nested data (see {@link Core.data.Model}), this is also how you consume an incoming
         * data property whose name is reserved and therefore cannot be used as a field name — such as `toString`,
         * `valueOf` or any other `Object.prototype` member. Give the field a safe name and point `dataSource` at the
         * raw property:
         *
         * ```javascript
         * class Product extends Model {
         *     static fields = [
         *         // The raw data has a "toString" property, which is reserved and cannot be used as a field name
         *         { name : 'label', dataSource : 'toString' }
         *     ];
         * }
         * ```
         *
         * The record's `data` object keeps the original property name, so the value round trips to the server
         * unchanged. See {@link Core.data.Model} for the full list of reserved names and the limitations of this
         * remap.
         *
         * @config {String}
         */
        dataSource : null,

        /**
         * The default value to assign to this field in a record if no value is provided.
         * @config {*} defaultValue
         */

        /**
         * Setting to `true` will ensure this field is included in any update/insert request payload
         * when a Store / Project / CrudManager performs a request.
         * @config {Boolean}
         * @default
         */
        alwaysWrite : false,

        /**
         * Setting to `false` indicates that `null` is not a valid value.
         * @config {Boolean}
         * @default
         */
        nullable : true,

        /**
         * The value to return from {@link #function-print} for a `null` or `undefined` value.
         * @config {String}
         * @default
         */
        nullText : null,

        /**
         * The value to replace `null` when the field is not `nullable`.
         * @config {*}
         * @default
         */
        nullValue : undefined,

        /**
         * Set to `false` to exclude this field when saving records to a server.
         * @config {Boolean}
         * @default
         */
        persist : true,

        /**
         * Set to `true` for the field's set accessor to ignore attempts to set this field.
         * @config {Boolean}
         * @default
         */
        readOnly : false,

        /**
         * By default, defined {@link Core.data.Model} fields may be used to create a grid column
         * suitable for displaying that field in a grid cell. Some fields may not be suitable for
         * features which automatically generate columns for view. These fields are created using
         * `internal : true`. Some examples are the `expanded` and `rowHeight` fields which are used
         * internally.
         * @config {Boolean}
         * @default
         */
        internal : false,

        /**
         * Set to `true` to indicate this field is calculated and cannot be edited via UI
         * @config {Boolean}
         * @internal
         * @default
         */
        calculated : false,

        /**
         * Lets you define a function to calculate the value of this field based on other record fields. The Model will
         * then try to auto-detect the dependencies used in the function. The calculate function can also return a
         * `Promise`, meaning you can fetch its value from a remote/async source.
         *
         * ```javascript
         * const store = new Store({
         *     fields : [
         *         {
         *              name : 'revenue',
         *              type : 'number'
         *         },
         *         {
         *              name : 'tax',
         *              type : 'number'
         *         },
         *         {
         *              name : 'net',
         *              calculate : record => record.revenue * (1 - (record.tax / 100)),
         *         }
         *     ],
         *     data : [
         *         { id : 1, revenue : 100, tax : 30 }
         *     ]
         * });
         *
         * const record = store.getById(1).net; // 70
         * ```
         * You can also pass an object with a `dependsOn` array of the dependent fields, along with the calculate `fn`:
         *
         * ```javascript
         * const store = new Store({
         *     fields : [
         *         {
         *              name : 'revenue',
         *              type : 'number'
         *         },
         *         {
         *              name : 'tax',
         *              type : 'number'
         *         },
         *         {
         *              name : 'net',
         *              calculate : {
         *                  fn        : record => record.revenue * (1 - (record.tax / 100)),
         *                  dependsOn : ['revenue', 'tax']
         *              }
         *         }
         *     ],
         *     data : [
         *         { id : 1, revenue : 100, tax : 30 }
         *     ]
         * });
         *
         * const record = store.getById(1).net; // 70
         * ```
         *
         * @config {Object|Function} calculate
         * @param {Function} calculate.fn The calculate function
         * @param {Core.data.Model} calculate.fn.record The record
         * @param {String[]} [calculate.dependsOn] An array of the other data fields this calculated field depends
         * on. If omitted, dependent fields are auto-detected and a `console.warn` debug messages will be issued
         * if it fails, and then you will need to declaratively add the dependent fields.
         * @returns {*|Promise} The calculated value or a Promise yielding the value
         */
        calculate : null,

        useProp : null,

        /**
         * When this flag is enabled, this field will skip the equality check when store is syncing the new
         * dataset (see {@link Core.data.Store#config-syncDataOnLoad} config). This means, that even if the
         * new value in new dataset is the same as old, it will still be applied to the model. It is useful
         * in certain edge case scenarios, when the update of the field does not preserve extra context information,
         * which should be provided by other fields.
         *
         * @config {Boolean}
         * @default
         */
        bypassEqualityOnSyncDataset : false,

        /**
         * Indicates that this field points to nested data (path separated by dots in the field name). Normally this is
         * set automatically when a field's {@link #config-name} or {@link #config-dataSource} contains a dot (`.`).
         * Configure it as `false` to allow data field names that actually contain dots.
         *
         * ```javascript
         * class MyModel extends Model {
         *    static fields = [
         *        // complexMapping automatically set to true,
         *        // `name.first` will point to { name : { first : "value" } }
         *        { name : 'name.first', type : 'string' },
         *
         *        // complexMapping automatically set to true,
         *        // `last` will point to { name : { last : "value" } }
         *        { name : 'last', type : 'string', dataSource : 'name.last' },
         *
         *        // complexMapping set to false,
         *        // `not.nested.name` will point to { "not.nested.name" : "value" }
         *        { name : 'not.nested.name', complexMapping : false }
         *    ];
         * }
         * ```
         *
         * @config {Boolean}
         */
        complexMapping : null
    };

    static configurable = {
        /**
         * An object which names formula prefixes for use when editing this field.
         *
         * Each entry is keyed by a formula prefix, and each value is how to instantiate and configure a
         * {@link Core.util.FormulaProvider} when that prefix is used in the typed vale, eg: `=XXX(`
         *
         * If the configured value contains a `type` property, that is used to determine a registered
         * formula provider subclass to instantiate.
         *
         * ```javascript
         * fields : [{
         *     name             : 'review',
         *     formulaProviders : {
         *        AI : {
         *          type : 'remote',
         *          url  : 'https://my-ai-service.com'
         *        },
         *        SUM : {
         *           type : 'sum'
         *        }
         *     }
         * }]
         * ```
         *
         * Formula providers may be added to dynamically:
         *
         * ```javascript
         * // Enable registered MYFormula class to be used as a formula provider in the Grid
         * grid.store.modelClass.fieldMap.review.formulaProviders.MY = { ... };
         * ```
         * @config {Object<String,FormulaProviderConfig>} formulaProviders
         * @ts-returns {Object<String,Object>} // This is used for nodeJS bundles, which should not have any refs to UI components
         */
        formulaProviders : null,

        /**
         * A description used by the AI features to explain the field to the AI agent
         * @config {String}
         */
        description : null
    };

    /**
     * The class that first defined this field. Derived classes that override a field do not change this property.
     * @member {Core.data.Model} definedBy
     * @private
     * @readonly
     */

    /**
     * The class that most specifically defined this field. Derived classes that override a field set this property to
     * themselves.
     * @member {Core.data.Model} owner
     * @private
     * @readonly
     */

    // NOTE: Since we create lots of instances, they have no life cycle (they are not destroyed) and are readonly after
    // creation, this class only uses one configurable property.
    construct(config) {
        const me = this;

        if (config) {
            me.name = config.name;  // assign name first for diagnostic reasons

            Object.assign(me, config);
        }

        if (me.compare) {
            // We wrap in this way to allow compareItems() to be used as an array sorter fn (which gets no "this"):
            me.compareItems = (itemA, itemB) => me.compare(itemA?.[me.name], itemB?.[me.name]);
        }
    }

    changeFormulaProviders(f) {
        const me = this;

        // Allow for dynamic formula providers to be added as properties:
        // grid.store.modelClass.fieldMap.response.formulaProviders.MY = {...};
        return new Proxy({ ...f }, {
            set(target, prop, value) {
                const result = Reflect.set(target, prop, value);
                me.updateFormulaProviders(target);
                return result;
            }
        });
    }

    // DataField gets this updated dynamically when Grid has a formulaProviders config.
    // GridBase injects the formulaProviders config into the dataField of each column.
    updateFormulaProviders(f) {
        this.inputPrefixRE = f ? new RegExp(`^=(${Object.keys(f).join('|')})\\(.*`) : null;
    }

    getFormulaProvider(prefix) {
        // Find the config object for the prefix
        const provider = this.formulaProviders[prefix];

        // If we were configured to accept a formula with this prefix
        // extract the formula provider config and instantiate it if necessary.
        if (provider) {
            if (provider.isFormulaProvider) {
                return provider;
            }
            let { instance } = provider;

            if (!instance) {
                const config = { ...provider, prefix };
                instance = provider.instance = FormulaProvider.get(prefix, config) || FormulaProvider.create(config);
            }
            return instance;
        }
    }

    get label() {
        return this._label || StringHelper.separate(this.name);
    }

    set label(label) {
        this._label = label;
    }

    /**
     * This method transforms a data value into the desired form for storage in the record's data object.
     *
     * ```javascript
     * export default class Task extends TaskModel {
     *    static get fields() {
     *        return [
     *            {
     *                name    : 'status',
     *                convert : (value, data) => {
     *                    if (value >= 100) {
     *                        return 'done';
     *                    }
     *                    else if (value > 0) {
     *                        return 'started';
     *                    }
     *                }
     *            }
     *        ];
     *    }
     * }
     * ```
     *
     * @method convert
     * @param {*} value The value to convert for storage in a record.
     * @param {Object} data The raw record data object
     * @returns {*} The converted value.
     */

    /**
     * This method transforms a data value into the desired form for transmitting to a server.
     * @method serialize
     * @param {*} value The value to serialize
     * @param {Core.data.Model} record The record that contains the value being serialized.
     * @returns {*} The serialized value.
     */

    /**
     * This optional method is called when setting a data value on a record.
     * @method set
     * @param {*} value The value to set
     * @param {Object} data The records future or current data object to set value to
     * @param {Core.data.Model} record The record that owns or will own the data object
     * @internal
     */

    /**
     * This optional method is called when a record using this field is created.
     * @method init
     * @param {Core.data.Model} record The record being created
     * @internal
     */

    /**
     * Create getter and setter functions for the specified field name under the specified key.
     * @internal
     */
    defineAccessor(target, force) {
        const { name, dataSource } = this;

        // Bail out if trying to override an explicitly defined accessor
        if (
            !force &&
            name in target &&
            target.$meta.hierarchy.some(current => getOwnPropertyDescriptor(current.prototype, name)?.enumerable === false)
        ) {
            return;
        }

        // Ensure that there is a meta field named #<fieldName> which is what gets edited as the prompt
        // when an input field is used to edit this field.
        // This is the field which generates the value for this field.
        if (this.formulaProviders) {
            target.$meta.class.addField(`#${name}`);
        }

        Reflect.defineProperty(target, name, {
            configurable : true, // To allow removing it later
            enumerable   : true,

            get : this.buildGetter(name, dataSource),

            // no arrow functions here, need `this` to change to instance
            set(value) {
                // Since the accessor is defined on a base class, we dip into the fields map for the actual
                // calling class to get the correct field definition
                const field = this.$meta.fields.map[name];

                // Only set if field is read/write. Privately, we use setData to set its value
                if (!(field && field.readOnly)) {
                    this.set(name, value);
                }
            }
        });
    }

    // Builds the getter `defineAccessor` installs for this field. Field types override this to add read
    // behaviour of their own - see StoreDataField, which creates a `lazy` field's store on access. Only reached
    // when `defineAccessor` actually defines the property, so an explicitly declared accessor still wins.
    buildGetter(name, dataSource) {
        // no arrow functions here, need `this` to change to instance
        return this.complexMapping
            ? function() {
                return this.complexGet(name, dataSource);
            }
            : function() {
                // Inlined copy of Model#flatGet, to save a fn call since this is hit very often

                // When changes are batched, they get stored by field name, not dataSource
                if (this.batching && name in this.meta.batchChanges) {
                    return this.meta.batchChanges[name];
                }

                return this.data[dataSource];
            };
    }

    /**
     * Compares two values for this field and returns `true` if they are equal, and `false` if not.
     * @param {*} first The first value to compare for equality.
     * @param {*} second The second value to compare for equality.
     * @returns {Boolean} `true` if `first` and `second` are equal.
     */
    isEqual(first, second) {
        return ObjectHelper.isEqual(first, second);
    }

    /**
     * Returns the given field value as a `String`. If `value` is `null` or `undefined`, the value specified by
     * {@link #config-nullText} is returned.
     * @param {*} value The value to convert to a string.
     * @returns {String}
     */
    print(value) {
        return (value == null) ? this.nullText : this.printValue(value);
    }

    /**
     * Returns the given, non-null field value as a `String`.
     * @param {*} value The value to convert to a string (will not be `null` or `undefined`).
     * @returns {String}
     * @protected
     */
    printValue(value) {
        return String(value);
    }

    getCurrentConfig() {
        const result = {};

        for (const field in this.constructor.prototypeProperties) {
            result[field] = this[field];
        }

        delete result.isConstructing;
        return result;
    }

    get calculated() {
        return Boolean(this.calculate || this._calculated);
    }

    set calculated(value) {
        this._calculated = value;
    }

    get calculate() {
        return this._calculate;
    }

    set calculate(value) {
        if (typeof value === 'function') {
            value = { fn : value };
        }
        this._calculate = value;
    }
}
