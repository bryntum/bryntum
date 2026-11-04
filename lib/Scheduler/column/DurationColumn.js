import ColumnStore from '../../Grid/data/ColumnStore.js';
import NumberColumn from '../../Grid/column/NumberColumn.js';
import Duration from '../../Core/data/Duration.js';
import NumberDataField from '../../Core/data/field/NumberDataField.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import NumberHelper from '../../Core/helper/NumberHelper.js';
import '../../Core/widget/DurationField.js';

/**
 * @module Scheduler/column/DurationColumn
 */

/**
 * A column showing the task {@link Scheduler/model/TimeSpan#field-fullDuration duration}. Please note, this column
 * is preconfigured and expects its field to be of the {@link Core.data.Duration} type.
 *
 * The default editor is a {@link Core.widget.DurationField}. It parses time units, so you can enter "4d"
 * indicating 4 days duration, or "4h" indicating 4 hours, etc. The numeric magnitude can be either an integer or a
 * float value. Both "," and "." are valid decimal separators. For example, you can enter "4.5d" indicating 4.5 days
 * duration, or "4,5h" indicating 4.5 hours.
 *
 * {@inlineexample Scheduler/column/DurationColumn.js}
 *
 * ## See also
 *
 * - {@link Scheduler.model.EventModel#field-duration} - Event duration field
 * - {@link Core.widget.DurationField} - Duration editor widget
 * - {@link Grid.column.NumberColumn} - Base number column
 *
 * @extends Grid/column/NumberColumn
 * @classtype duration
 * @column
 * @tier community
 */
export default class DurationColumn extends NumberColumn {
    compositeField = true;

    //region Config

    static $name = 'DurationColumn';

    static type = 'duration';

    static isGanttColumn = true;

    static fields = [
        /**
         * Precision of displayed duration, defaults to use {@link Scheduler.view.Scheduler#config-durationDisplayPrecision}.
         * Specify an integer value to override that setting, or `false` to use raw value
         * @prp {Number|Boolean} decimalPrecision
         */
        { name : 'decimalPrecision' },
        'abbreviatedUnit',
        'durationUnitField'
    ];

    static defaults = {
        /**
         * Set to `true` to display duration in short form (5d, 2mo)
         * @prp {Boolean}
         */
        abbreviatedUnit : null,

        min           : null,
        max           : null,
        step          : 1,
        largeStep     : 0,
        /**
         * The {@link Core.data.field.DataField#config-name} of the {@link Core.data.Model data model} field to
         * read a cells value from.
         *
         * <div class="note">Setting <b>duration</b> as the <b>field</b> value for the duration column is not allowed
         * since the field needs both a duration magnitude and unit, as supplied by for example the
         * {@link Scheduler/model/TimeSpan#field-fullDuration} field. Additionally, a custom implemented field for
         * the duration column should return a duration object to work correctly.</div>
         *
         * @prp {String} field
         * @default 'fullDuration'
         * @category Common
         */
        field         : 'fullDuration',
        text          : 'L{Duration}',
        instantUpdate : true,
        // Undocumented, used by Filter feature to get type of the filter field
        filterType    : 'duration',

        sortable(durationEntity1, durationEntity2) {
            const
                ms1 = durationEntity1.getValue(this.field),
                ms2 = durationEntity2.getValue(this.field);

            return ms1 - ms2;
        }
    };

    construct(...args) {
        super.construct(...args);

        const sortFn = this.sortable;

        this.sortable = (...args) => sortFn.call(this, ...args);
    }

    get defaultEditor() {
        const { max, min, step, largeStep, decimalPrecision = this.grid.durationDisplayPrecision } = this;

        // Remove any undefined configs, to allow config system to use default values instead
        return ObjectHelper.cleanupProperties({
            type : 'duration',
            name : this.field,
            max,
            min,
            step,
            decimalPrecision,
            largeStep
        });
    }

    //endregion

    //region Internal

    // Necessary to keep the formatter in sync with the configured decimal precision
    get formatter() {
        const
            me         = this,
            { format, _formatter : formatter, decimalPrecision } = me;

        if (!formatter || me._lastFormat !== format) {
            me._formatter = NumberHelper.getLocalizedFormatter(decimalPrecision
                ? { maximumFractionDigits : decimalPrecision }
                : me._lastFormat = format
            );
        }

        return me._formatter;
    }

    roundValue(duration) {
        const
            multiplier = Math.pow(10, this.decimalPrecision ?? this.grid.durationDisplayPrecision ?? 1);

        return Math.round(duration * multiplier) / multiplier;
    }

    formatValue(duration, durationUnit) {
        if (duration instanceof Duration) {
            durationUnit = duration.unit;
            duration = duration.magnitude;
        }

        duration = this.roundValue(duration);

        const unitFn = this.abbreviatedUnit ? 'getShortNameOfUnit' : 'getLocalizedNameOfUnit';

        // super.formatValue(duration) will apply localized decimals et al
        return super.formatValue(duration) + (this.abbreviatedUnit ? '' : ' ') + DateHelper[unitFn](durationUnit, duration !== 1);
    }

    //endregion

    //region Render

    defaultRenderer({ value, record, isExport, dataField }) {
        const
            me                = this,
            type              = typeof value,
            durationValue     = type === 'number' ? value : value?.magnitude,
            durationUnitField = me.durationUnitField || `${me.field}Unit`,
            durationUnit      = type === 'number' ? record.getValue(durationUnitField) : value?.unit;

        // in case of bad input (for instance NaN, undefined or NULL value)
        if (typeof durationValue !== 'number') {
            return isExport ? '' : null;
        }

        // <remove-on-release>
        // TODO: Update this condition to strictly check for DurationDataField once we add it
        // </remove-on-release>
        if (!me.fieldWarningShown && dataField instanceof NumberDataField && me.type !== 'totalslack') {
            console.warn(
                `Warning: Setting 'duration' as the 'field' value for the '${me.type}' column is not allowed since the field needs both a duration magnitude and unit, as supplied by for example the 'fullDuration' field. Additionally, a custom implemented field for the duration column should return a duration object to work correctly.`
            );
            me.fieldWarningShown = true;
        }

        return me.formatValue(durationValue, durationUnit);
    }

    //endregion

    // Used with CellCopyPaste as fullDuration doesn't work via record.get
    toClipboardString({ record }) {
        return record.getValue(this.field)?.toString();
    }

    fromClipboardString({ string, record }) {
        const duration = DateHelper.parseDuration(string, true, this.durationUnit);

        if (duration && 'magnitude' in duration) {
            return duration;
        }

        return record.fullDuration;
    }

    calculateFillValue({ value, record }) {
        return this.fromClipboardString({ string : value, record });
    }
}

ColumnStore.registerColumnType(DurationColumn);
