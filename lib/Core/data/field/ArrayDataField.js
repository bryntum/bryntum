import DataField from './DataField.js';

/**
 * @module Core/data/field/ArrayDataField
 */

/**
 * This field class handles fields that hold an array.
 *
 * ```javascript
 * class Task extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             // Array field
 *             { name : 'todo', type : 'array' }
 *         ];
 *     }
 * }
 * ```
 *
 * A record can be constructed like this:
 *
 * ```javascript
 * const task = new Task({
 *     name : 'Task 1',
 *     todo : [
 *         { text : 'Something', done : false },
 *         { text : 'Some other thing', done : true }
 *     ]
 * };
 * ```
 *
 * Or by populating a store:
 *
 * ```javascript
 * const store = new Store({
 *     modelClass : Task,
 *     data : [
 *         {
 *             name : 'Task 1',
 *             todo : [
 *                 { text : 'Something', done : false },
 *                 { text : 'Some other thing', done : true }
 *             ]
 *         },
 *         ...
 *     ]
 * });
 * ```
 *
 * For the field to count as modified, the whole array has to be replaced:
 *
 * ```javascript
 * // This won't be detected as a modification
 * task.todo[0].done = true;
 * // task.isModified === false
 *
 * // But this will
 * const todo = task.todo.slice(); // Create a new array with same contents
 * todo[0].done = true;
 * task.todo = todo;
 * // task.isModified === true
 * ```
 *
 * ## See also
 *
 * - {@link Core.data.field.DataField} - Base field class with common configs
 * - {@link Core.data.field.ObjectDataField} - Object field type
 *
 * @extends Core/data/field/DataField
 * @classtype array
 * @datafield
 */
export default class ArrayDataField extends DataField {
    static $name = 'ArrayDataField';

    static type = 'array';
    static dataConstructor = Array;

    isEqual(a, b) {
        return a === b;
    }

    getAt(record, index) {
        return record.get(this.name)[index];
    }
}

ArrayDataField.initClass();
