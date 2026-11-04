import Model from './Model.js';

/**
 * @module Core/data/ComboModel
 */

/**
 * Combo model class, which can be used as `record` type for {@link Core/widget/Combo#config-listItemTpl} and
 * {@link Core/widget/Combo#config-displayValueRenderer} configs in TypeScript applications.
 *
 * Use when Combo's {@link Core/widget/Combo#config-displayField} equals `text` and
 * {@link Core/widget/Combo#config-items} are configured with one of the value formats listed below:
 *
 * ```javascript
 * items : [
 *     {value : 'small', text : 'Small'},
 *     {value : 'medium', text : 'Medium'},
 *     {value : 'large', text : 'Large'},
 * ]
 * ```
 *
 * or
 *
 * ```javascript
 * items : [
 *     ['small', 'Small'],
 *     ['medium', 'Medium'],
 *     ['large', 'Large'],
 * ]
 * ```
 *
 * or
 *
 * ```javascript
 *     items : ['Small', 'Medium', 'Large']
 * ```
 *
 * Class provides the {@link #field-value} and {@link #field-text} data fields for the Combo's list record.
 *
 * @extends Core/data/Model
 * @internal
 * @ts-class
 */
export default class ComboModel extends Model {

    static $name = 'ComboModel';

    static fields = [

        /**
         * Value for the Combo's list record.
         * @field {String|Number|*} value
         */
        { name : 'value' },

        /**
         * Display text for the Combo's list record.
         * @field {String} text
         */
        { name : 'text' }

    ];

}
