import DataField from './DataField.js';
import DateHelper from '../../helper/DateHelper.js';

/**
 * @module Core/data/field/DateDataField
 */

/**
 * This field class handles field of type `Date`.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' },
 *             { name : 'age', readOnly : true }
 *         ];
 *     }
 * }
 * ```
 *
 * When a field is declared as a `'date'`, non-null values are promoted to `Date` type. This is frequently needed due
 * to how date types are serialized to JSON strings.
 *
 * Date fields can have a special `defaultValue` of `'now'` which will convert to the current date/time.
 *
 * ## See also
 *
 * - {@link Core.data.field.DataField} - Base field class with common configs
 * - {@link Core.helper.DateHelper} - Date parsing and formatting utilities
 *
 * @extends Core/data/field/DataField
 * @classtype date
 * @datafield
 */
export default class DateDataField extends DataField {
    static $name = 'DateDataField';

    static type = 'date';
    static dataConstructor = Date;

    static get prototypeProperties() {
        return {
            /**
             * The format of the date field.
             *
             * See {@link Core.helper.DateHelper} for details.
             * @config {String} format
             * @default DateHelper.defaultFormat
             */
            format : null
        };
    }

    convert(value, data, record) {
        const me = this;

        if (value == null) {
            if (!me.nullable) {
                value = me.nullValue;
            }
        }
        else if (value === 'now') {
            value = new Date();
        }
        else if (!(value instanceof Date)) {
            const
                rawValue = value,
                // We call convert() directly from tests, fall back to DateHelper if no record is provided
                dh       = record?.dateHelper || DateHelper;
            // Use configured format, if null/undefined use DateHelpers default format
            value = dh.parse(value, me.format || dh.defaultParseFormat);
            // if parsing has failed, we would like to return `undefined` to indicate the "absence" of data
            // instead of `null` (presence of "empty" data)
            if (!value || isNaN(value)) {
                value = undefined;
                if (rawValue !== '') {
                    console.warn(`Date parsing failed for "${me.name}" field, input: ${JSON.stringify(rawValue)}. ${me.format ? `Expected format: ${me.format}.` : `You should configure your Model field with a "format" to specify how dates should be parsed. See docs for DateDataField here: https://bryntum.com/docs/api/Core/data/field/DateDataField, and see https://bryntum.com/docs/api/Core/helper/DateHelper for the different formats.`}"`);
                }
            }
        }

        return value;
    }

    serialize(value, record) {
        if (value instanceof Date) {
            const dh = record.dateHelper;
            // Use configured format or DateHelpers default one
            value = dh.format(value, this.format || dh.defaultFormat);
        }

        return value;
    }

    printValue(value) {
        return DateHelper.format(value, this.format || DateHelper.defaultFormat);
    }
}

DateDataField.initClass();
