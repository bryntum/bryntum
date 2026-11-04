import Container from './Container.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import DateHelper from '../helper/DateHelper.js';
import DomHelper from '../helper/DomHelper.js';
import NumberHelper from '../helper/NumberHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import Duration from '../data/Duration.js';
import './Combo.js';
import './Checkbox.js';
import './NumberField.js';
import './TextField.js';
import './DateField.js';
import './DurationField.js';

DomHelper.loadStylesheet('Core/widget/FieldFilterPicker.css');

// import Stylesheet from './FieldFilterPicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'FieldFilterPicker');

/**
 * @module Core/widget/FieldFilterPicker
 */

export const filterableFieldDataTypes = {
    number   : true,
    boolean  : true,
    string   : true,
    date     : true,
    duration : true,
    time     : true,
    auto     : true
};

const isInferrableType = {
    number  : true,
    boolean : true,
    string  : true
};

export const isSupportedDurationField = field => field?.column?.type === 'duration';

export const isFilterableField = field => filterableFieldDataTypes[field?.type] || isSupportedDurationField(field);

const
    emptyString         = '',
    clsBase             = `b-field-filter-picker`,
    multiValueOperators = {
        between         : true,
        notBetween      : true,
        isIncludedIn    : true,
        isNotIncludedIn : true
    },
    nonEmptyValueOperators = {
        startsWith     : true,
        endsWith       : true,
        includes       : true,
        doesNotInclude : true
    },
    valueInputTypes     = {
        textfield     : true,
        datefield     : true,
        numberfield   : true,
        durationfield : true,
        combo         : true,
        timefield     : true
    },
    commonOperators = {
        empty           : { value : 'empty', text : 'L{isEmpty}', argCount : 0 },
        notEmpty        : { value : 'notEmpty', text : 'L{isNotEmpty}', argCount : 0 },
        '='             : { value : '=', text : 'L{equals}' },
        '!='            : { value : '!=', text : 'L{doesNotEqual}' },
        '>'             : { value : '>', text : 'L{isGreaterThan}' },
        '<'             : { value : '<', text : 'L{isLessThan}' },
        '>='            : { value : '>=', text : 'L{isGreaterThanOrEqualTo}' },
        '<='            : { value : '<=', text : 'L{isLessThanOrEqualTo}' },
        between         : { value : 'between', text : 'L{isBetween}', argCount : 2 },
        notBetween      : { value : 'notBetween', text : 'L{isNotBetween}', argCount : 2 },
        isIncludedIn    : { value : 'isIncludedIn', text : 'L{isOneOf}', isArrayValued : true },
        isNotIncludedIn : { value : 'isNotIncludedIn', text : 'L{isNotOneOf}', isArrayValued : true }
    },
    extractFieldValue = field => {
        const { value } = field;

        if (field.isTimeField && value) {
            return DateHelper.getTime(value);
        }
        return value;
    };

/**
 * A field that is available for selection when defining filters.
 *
 * @typedef {Object} FieldOption
 * @property {'string'|'number'|'date'|'boolean'} [type] The data type of the values in this field in the data source
 * @property {String} [title] The human-friendly display name for the field, as might be displayed in a data column header
 * @property {String} [format] (Optional) Format string for formatting values shown in value fields. Applicable only for
 *                           `number` and `date` types.
 * @property {String} [relatedDisplayField] Name of a field on the related record to display in the value picker
 * dropdown when filtering by a foreign key field. For example, when filtering on `colorId`, setting
 * `relatedDisplayField: 'name'` shows color names instead of IDs in the dropdown.
 */

/**
 * A dictionary of value field placeholder strings, keyed by data type.
 *
 * @typedef {Object} ValueFieldPlaceholders
 * @property {String} string Placeholder text for text value fields
 * @property {String} number Placeholder text for number value fields
 * @property {String} date Placeholder text for date value fields
 * @property {String} list Placeholder text for multi-select list values, e.g. for the 'is one of' operator
 */

/**
 * Widget for defining a {@link Core.util.CollectionFilter} for use in filtering a {@link Core.data.Store}.
 * Filters consist of `property` (the name of the data field whose values are checked), `operator`
 * (the type of comparison to use), and `value` (the pre-defined value against which to compare the
 * data field value during filtering).
 *
 * {@inlineexample Core/widget/FieldFilterPicker.js}
 *
 * For example:
 *
 * ```javascript
 * new FieldFilterPicker({
 *     appendTo : domElement,
 *
 *     fields: {
 *         // Allow filters to be defined against the 'age' and 'role' fields in our data
 *         age       : { title: 'Age', type: 'number' },
 *         startDate : { title: 'Start Date', type: 'date' }
 *     },
 *
 *     filter : {
 *         property : 'startDate',
 *         operator : '<',
 *         value    : new Date()
 *     }
 * });
 * ```
 *
 * @demo Grid/fieldfilters
 *
 * @extends Core/widget/Container
 * @classtype fieldfilterpicker
 * @widget
 */
export default class FieldFilterPicker extends Container {

    //region Config

    static $name = 'FieldFilterPicker';

    static type = 'fieldfilterpicker';

    static defaultOperators = {
        string : [
            // In display order
            commonOperators.empty,
            commonOperators.notEmpty,
            commonOperators['='],
            commonOperators['!='],
            { value : 'includes', text : 'L{contains}' },
            { value : 'doesNotInclude', text : 'L{doesNotContain}' },
            { value : 'startsWith', text : 'L{startsWith}' },
            { value : 'endsWith', text : 'L{endsWith}' },
            commonOperators.isIncludedIn,
            commonOperators.isNotIncludedIn
        ],
        number : [
            commonOperators.empty,
            commonOperators.notEmpty,
            commonOperators['='],
            commonOperators['!='],
            commonOperators['>'],
            commonOperators['<'],
            commonOperators['>='],
            commonOperators['<='],
            commonOperators.between,
            commonOperators.notBetween,
            commonOperators.isIncludedIn,
            commonOperators.isNotIncludedIn
        ],
        date : [
            commonOperators.empty,
            commonOperators.notEmpty,
            { value : 'sameDay', text : 'L{equals}' },
            { value : 'notSameDay', text : 'L{doesNotEqual}' },
            { value : 'sameTime', text : 'L{timeEquals}' },
            { value : 'notSameTime', text : 'L{timeDoesNotEqual}' },
            { value : '<', text : 'L{isBefore}' },
            { value : '>', text : 'L{isAfter}' },
            commonOperators.between,
            { value : 'isToday', text : 'L{isToday}', argCount : 0 },
            { value : 'isTomorrow', text : 'L{isTomorrow}', argCount : 0 },
            { value : 'isYesterday', text : 'L{isYesterday}', argCount : 0 },
            { value : 'isThisWeek', text : 'L{isThisWeek}', argCount : 0 },
            { value : 'isNextWeek', text : 'L{isNextWeek}', argCount : 0 },
            { value : 'isLastWeek', text : 'L{isLastWeek}', argCount : 0 },
            { value : 'isThisMonth', text : 'L{isThisMonth}', argCount : 0 },
            { value : 'isNextMonth', text : 'L{isNextMonth}', argCount : 0 },
            { value : 'isLastMonth', text : 'L{isLastMonth}', argCount : 0 },
            { value : 'isThisYear', text : 'L{isThisYear}', argCount : 0 },
            { value : 'isNextYear', text : 'L{isNextYear}', argCount : 0 },
            { value : 'isLastYear', text : 'L{isLastYear}', argCount : 0 },
            { value : 'isYearToDate', text : 'L{isYearToDate}', argCount : 0 },
            commonOperators.isIncludedIn,
            commonOperators.isNotIncludedIn
        ],
        boolean : [
            { value : 'isTrue', text : 'L{isTrue}', argCount : 0 },
            { value : 'isFalse', text : 'L{isFalse}', argCount : 0 }
        ],
        duration : [
            commonOperators.empty,
            commonOperators.notEmpty,
            commonOperators['='],
            commonOperators['!='],
            commonOperators['>'],
            commonOperators['<'],
            commonOperators['>='],
            commonOperators['<='],
            commonOperators.between,
            commonOperators.notBetween,
            commonOperators.isIncludedIn,
            commonOperators.isNotIncludedIn
        ],
        time : [
            commonOperators.empty,
            commonOperators.notEmpty,
            commonOperators['='],
            commonOperators['!='],
            commonOperators['>'],
            commonOperators['<'],
            commonOperators['>='],
            commonOperators['<='],
            commonOperators.between,
            commonOperators.notBetween,
            commonOperators.isIncludedIn,
            commonOperators.isNotIncludedIn
        ],
        relation : [
            commonOperators.empty,
            commonOperators.notEmpty,
            commonOperators['='],
            commonOperators['!='],
            commonOperators.isIncludedIn,
            commonOperators.isNotIncludedIn
        ],
        auto : [
            { value : '*', text : 'L{contains}' }
        ]
    };

    static get defaultValueFieldPlaceholders() {
        return {
            string   : 'L{enterAValue}',
            number   : 'L{enterANumber}',
            date     : 'L{selectADate}',
            relation : 'L{selectValue}',
            list     : 'L{selectOneOrMoreValues}',
            duration : 'L{enterAValue}',
            time     : 'L{selectATime}',
            auto     : 'L{enterAValue}'
        };
    }

    static configurable = {
        /**
         * Dictionary of {@link #typedef-FieldOption} representing the fields against which filters can be defined,
         * keyed by field name.
         *
         * If filtering a {@link Grid.view.Grid}, consider using {@link Grid.widget.GridFieldFilterPicker}, which can be configured
         * with an existing {@link Grid.view.Grid} instead of, or in combination with, defining fields manually.
         *
         * Example:
         * ```javascript
         * fields: {
         *     // Allow filters to be defined against the 'age' and 'role' fields in our data
         *     age  : { title: 'Age', type: 'number' },
         *     role : { title: 'Role', type: 'string' }
         * }
         * ```
         *
         * @config {Object<String,FieldOption>}
         */
        fields : null,

        /**
         * Make the entire picker disabled.
         *
         * @config {Boolean}
         * @default
         */
        disabled : false,

        /**
         * Make the entire picker read-only.
         *
         * @config {Boolean}
         * @default
         */
        readOnly : false,

        /**
         * Make only the property selector readOnly.
         *
         * @config {Boolean}
         * @default
         */
        propertyLocked : false,

        /**
         * Make only the operator selector readOnly.
         *
         * @config {Boolean}
         * @default
         */
        operatorLocked : false,

        /**
         * Make only the value input(s) readOnly.
         *
         * @config {Boolean}
         * @default
         */
        valueLocked : false,

        /**
         * Configuration object for the {@link Core.util.CollectionFilter} displayed
         * and editable in this picker.
         *
         * Example:
         *
         * ```javascript
         * {
         *     property: 'age',
         *     operator: '=',
         *     value: 25
         * }
         * ```
         *
         * @config {CollectionFilterConfig}
         */
        filter : null,

        /**
         * Optional configuration for the property selector {@link Core.widget.Combo}.
         *
         * @config {ComboConfig}
         */
        propertyFieldConfig : null,

        /**
         * Optional configuration for the operator selector {@link Core.widget.Combo}.
         *
         * @config {ComboConfig}
         * @private
         */
        operatorFieldConfig : null,

        /**
         * Optional CSS class to apply to the value field(s).
         *
         * @config {String}
         * @private
         */
        valueFieldCls : null,

        /**
         * Whether to raise {@link #event-change} events as the user types into a value field. If `false`,
         * {@link #event-change} events will be raised only when the value input field's own `change` event
         * occurs, for example on field blur.
         *
         * @config {Boolean}
         * @default
         */
        triggerChangeOnInput : true,

        /**
         * @config {Object}
         * @private
         */
        items : {
            propertyPicker : {
                type                    : 'combo',
                items                   : {},
                cls                     : `${clsBase}-property`,
                placeholder             : 'L{FieldFilterPicker.selectAProperty}',
                highlightExternalChange : false
            },
            operatorPicker : {
                type                    : 'combo',
                items                   : {},
                cls                     : `${clsBase}-operator`,
                placeholder             : 'L{FieldFilterPicker.selectAnOperator}',
                highlightExternalChange : false
            },
            valueFields : {
                type  : 'container',
                cls   : `${clsBase}-values`,
                items : {}
            },
            caseSensitive : {
                type : 'checkbox',
                text : 'L{FieldFilterPicker.caseSensitive}',
                cls  : `${clsBase}-case-sensitive`
            }
        },

        /**
         * Overrides the built-in list of operators that are available for selection. Specify operators as
         * an object with data types as keys and lists of operators as values, like this:
         *
         * ```javascript
         * operators : {
         *     string : [
         *         { value : 'empty', text : 'is empty', argCount : 0 },
         *         { value : 'notEmpty', text : 'is not empty', argCount : 0 }
         *     ],
         *     number : [
         *         { value : '=', text : 'equals' },
         *         { value : '!=', text : 'does not equal' }
         *     ],
         *     date : [
         *         { value : '<', text : 'is before' }
         *     ]
         * }
         * ```
         *
         * Here `value` is what will be stored in the `operator` field in the filter when selected, `text` is the text
         * displayed in the Combo for selection, and `argCount` is the number of arguments (comparison values) the
         * operator requires. The default argCount if not specified is 1.
         *
         * **Note:** The operators config is a subset of valid operators described in
         * {@link Core.util.CollectionFilter#typedef-CollectionCompareOperator}.
         * The use of any other operator apart from these is not supported and will lead to unexpected behavior.
         *
         * @config {Object}
         */
        operators : FieldFilterPicker.defaultOperators,

        /**
         * The date format string used to display dates in value input fields. Defaults to the current locale's
         * `FieldFilterPicker.dateFormat` value.
         *
         * @config {String}
         * @default
         */
        dateFormat : 'L{FieldFilterPicker.dateFormat}',

        /**
         * Optional {Core.data.Store} against which filters are being defined. This is used to supply options to filter against
         * when using the 'is one of' and 'is not one of' operators.
         *
         * @config {Core.data.Store}
         */
        store : null,

        /**
         * Optional {@link ValueFieldPlaceholders} object specifying custom placeholder text for value input fields.
         *
         * @config {ValueFieldPlaceholders}
         */
        valueFieldPlaceholders : null,

        /**
         * Optional function that modifies the configuration of value fields shown for a filter. The default configuration
         * is received as an argument and the returned value will be used as the final configuration. For example:
         *
         * ```javascript
         * getValueFieldConfig : (filter, fieldConfig) => {
         *     return {
         *         ...fieldConfig,
         *         title : fieldName    // Override the `title` config for the field
         *     };
         * }
         * ```
         *
         * The supplied function should accept the following arguments:
         *
         * @config {Function}
         * @param {Core.util.CollectionFilter} filter The filter being displayed
         * @param {ContainerItemConfig} fieldConfig Configuration object for the value field
         * @returns {ContainerItemConfig} the resulting configuration
         */
        getValueFieldConfig : null
    };

    //endregion

    // Make lookup of operator arity (arg count) by [fieldType][operator]
    static buildOperatorArgCountLookup = operators =>
        ArrayHelper.keyBy(Object.entries(operators),
            ([fieldType])   => fieldType,
            ([, operators]) => ArrayHelper.keyBy(operators,
                ({ value }) => value,
                ({ argCount }) => argCount === undefined ? 1 : argCount
            ));

    afterConstruct() {
        const me = this;
        if (!me._fields) {
            throw new Error(`${FieldFilterPicker.name} requires 'fields' to be configured.`);
        }
        if (!me._filter) {
            throw new Error(`${FieldFilterPicker.name} requires 'filter' to be configured.`);
        }
        super.afterConstruct();
        const { widgetMap: { propertyPicker, operatorPicker, caseSensitive } } = me;
        propertyPicker.ion({ select : 'onPropertySelect', thisObj : me });
        operatorPicker.ion({ select : 'onOperatorSelect', thisObj : me });
        caseSensitive.ion({ change : 'onCaseSensitiveChange', thisObj : me });
        me.propertyFieldConfig && propertyPicker.setConfig(me.propertyFieldConfig);
        me.operatorFieldConfig && operatorPicker.setConfig(me.operatorFieldConfig);
        propertyPicker.cls = me.allPropertyPickerClasses;
        operatorPicker.cls = me.allOperatorPickerClasses;
        me.populateUIFromFilter();
    }

    changeDateFormat(dateFormat) {
        return this.L(dateFormat);
    }

    get allChildInputs() {
        const { propertyPicker, operatorPicker, caseSensitive } = this.widgetMap;
        return [propertyPicker, operatorPicker, ...this.valueFields, caseSensitive];
    }

    updateDisabled(disabled, was) {
        super.updateDisabled(disabled, was);

        this.allChildInputs.forEach(field => field.disabled = disabled);
    }

    updateReadOnly(newReadOnly) {
        const { propertyPicker, operatorPicker } = this.widgetMap;
        this.allChildInputs.forEach(field => field.readOnly = newReadOnly);
        // Respect these individual configs when un-setting global readOnly
        propertyPicker.readOnly = propertyPicker.readOnly || newReadOnly;
        operatorPicker.readOnly = operatorPicker.readOnly || newReadOnly;
    }

    updatePropertyLocked(newPropertyLocked) {
        this.widgetMap.propertyPicker.readOnly = newPropertyLocked || this.readOnly;
        this.widgetMap.propertyPicker.cls = this.allPropertyPickerClasses;
    }

    updateOperatorLocked(newOperatorLocked) {
        this.widgetMap.operatorPicker.readOnly = newOperatorLocked || this.readOnly;
        this.widgetMap.operatorPicker.cls = this.allOperatorPickerClasses;
    }

    updateValueLocked(newValueLocked) {
        this.valueFields.forEach(field => field.readOnly = newValueLocked || this.readOnly);
    }

    changeOperators(newOperators) {
        const operators = (newOperators ?? FieldFilterPicker.defaultOperators);
        return Object.keys(operators).reduce((outOperators, dataType) => ({
            ...outOperators,
            [dataType] : operators[dataType].map(op => ({ ...op, text : this.L(op.text) }))
        }), {});
    }

    get isMultiSelectValueField() {
        return ['isIncludedIn', 'isNotIncludedIn'].includes(this._filter?.operator);
    }

    get allPropertyPickerClasses() {
        return new DomClassList(`${clsBase}-property`, this.propertyFieldConfig?.cls, {
            [`${clsBase}-combo-locked`] : this.propertyLocked
        });
    }

    get allOperatorPickerClasses() {
        return new DomClassList(`${clsBase}-operator`, this.operatorFieldConfig?.cls, {
            [`${clsBase}-combo-locked`] : this.operatorLocked
        });
    }

    getValueFieldConfigs() {
        const
            me = this,
            {
                valueFieldCls,
                fieldType,
                _filter: { operator },
                onValueChange,
                filterValues,
                isMultiSelectValueField,
                operatorArgCount,
                getValueFieldConfig,
                fieldIsRelation,
                triggerChangeOnInput
            } = me,
            valueFieldPlaceholders = ObjectHelper.merge(
                {},
                FieldFilterPicker.defaultValueFieldPlaceholders,
                me.valueFieldPlaceholders
            );

        if (!fieldType || !operator || operatorArgCount === 0) {
            return [];
        }

        let valueFieldCfg = {
            type              : 'textfield', // replaced as needed below
            internalListeners : {
                change  : onValueChange,
                input   : triggerChangeOnInput ? onValueChange : null,
                thisObj : me
            },
            bubbleEvents : { keydown : true },
            cls          : valueFieldCls,
            dataset      : {
                type : fieldType
            },
            placeholder             : me.L(valueFieldPlaceholders[isMultiSelectValueField ? 'list' : fieldIsRelation ? 'relation' : fieldType]),
            highlightExternalChange : false
        };

        if (isMultiSelectValueField || fieldIsRelation) {
            valueFieldCfg = {
                ...valueFieldCfg,
                type              : 'combo',
                multiSelect       : isMultiSelectValueField,
                createOnUnmatched : true,
                items             : me.getUniqueDataValues(filterValues),
                value             : filterValues ?? []
            };
        }
        else if (operator === 'sameTime' || operator === 'notSameTime') {
            valueFieldCfg.type = `timefield`;
        }
        else if (['number', 'date', 'boolean', 'duration', 'time'].includes(fieldType)) {
            valueFieldCfg.type = `${fieldType}field`;
        }

        if (fieldType === 'date' && valueFieldCfg.type !== 'timefield') {
            valueFieldCfg.format = me.selectedField?.format ?? me.dateFormat;
        }
        else if (fieldType === 'number' && me.selectedField?.format) {
            valueFieldCfg.format = me.selectedField?.format;
        }

        // Allow client to modify value field config
        if (getValueFieldConfig) {
            valueFieldCfg = me.callback(getValueFieldConfig, me, [me.filter, valueFieldCfg]);
        }

        if (isMultiSelectValueField) {
            // We only support a single multi-select Combo for now
            return [valueFieldCfg];
        }

        return ArrayHelper.populate(operatorArgCount, index => ([{
            type    : 'widget',
            tag     : 'div',
            cls     : `${clsBase}-value-separator`,
            content : me.L('L{FieldFilterPicker.and}')
        }, {
            ...valueFieldCfg,
            value : filterValues[index]
        }])).flat().slice(1);
    }

    /**
     * Return an array of unique values in the data store for the currently selected field. If no store is
     * configured or no field is selected, returns an empty array.
     */
    getUniqueDataValues(extraValuesToInclude = []) {
        const
            me            = this,
            { fieldType } = me,
            format        = me.selectedField?.format;

        if (!me.store || !me._filter?.property) {
            return [];
        }

        const { relatedDisplayField } = me.selectedField;
        let values,
            sortedValues;

        if (me.fieldIsRelation) {
            const { foreignStore } = me.currentPropertyRelationConfig;
            if (relatedDisplayField) {
                // Display field specified -- sort by text label;
                // this bypasses the type-specific sorting for raw data values below
                values = foreignStore.allRecords.reduce((options, record) => {
                    if (record.id != null) {
                        options.push({
                            text  : record.getValue(relatedDisplayField),
                            value : record.id
                        });
                    }
                    return options;
                }, []);

                // Currently only support getting text from remote field and sorting as text
                sortedValues = values.sort((a, b) => me.sortStrings(a.text, b.text));
            }
            else {
                // If no display field, fall back to only data values
                values = foreignStore.allRecords.map(record => record.id);
            }
        }
        else {
            // Local data field
            values = me.store.allRecords.map(record => record.getValue(me._filter.property));
        }

        if (!sortedValues) {
            // Convert a single value to its primitive form based on field type, for deduping
            const toPrimitive = val => {
                if (fieldType === 'date') {
                    return val.valueOf();
                }
                if (fieldType === 'duration') {
                    return val.toString();
                }
                return val;
            };

            values.push(...extraValuesToInclude);

            const uniqueValues = ArrayHelper.unique(values.reduce((primitiveValues, value) => {
                if (value != null && String(value).trim() !== '') {
                    // Flatten array-valued fields, applying the same primitive conversion per item
                    if (Array.isArray(value)) {
                        for (const item of value) {
                            if (item != null && String(item).trim() !== '') {
                                primitiveValues.push(toPrimitive(item));
                            }
                        }
                    }
                    else {
                        primitiveValues.push(toPrimitive(value));
                    }
                }
                return primitiveValues;
            }, []));

            // Sort
            if (fieldType === 'string') {
                sortedValues = uniqueValues.sort(me.sortStrings);
            }
            else if (fieldType === 'duration') {
                sortedValues = uniqueValues
                    .map(durationStr => new Duration(durationStr))
                    .filter(duration => duration.isValid)
                    .sort(me.sortDurations);
            }
            else {
                sortedValues = uniqueValues.sort(me.sortNumerics);
            }

            // Provide labels for complex value types
            if (fieldType === 'date') {
                sortedValues = sortedValues.map(timestamp => {
                    const date = new Date(timestamp);
                    return {
                        text  : DateHelper.format(date, format ?? me.dateFormat),
                        value : timestamp
                    };
                });
            }
            else if (fieldType === 'number' && format) {
                const formatter = NumberHelper.getLocalizedFormatter(format);
                sortedValues = sortedValues.map(number => ({
                    text  : formatter.format(number),
                    value : number
                }));
            }
            else if (fieldType === 'duration') {
                sortedValues = sortedValues.map(duration => duration.toString());
            }
        }

        return sortedValues;
    }

    sortStrings(a, b) {
        return (a ?? emptyString).localeCompare(b ?? emptyString);
    }

    sortNumerics(a, b) {
        return a - b;
    }

    sortDurations(a, b) {
        return a.valueOf() - b.valueOf();
    }

    get fieldType() {
        return this.selectedField?.type;
    }

    get selectedField() {
        return this.fields?.[this._filter?.property];
    }

    get propertyOptions() {
        return Object.entries(this.fields ?? {})
            .filter(([, fieldDef]) =>
                filterableFieldDataTypes[fieldDef.type] ||
                isSupportedDurationField(fieldDef)
            )
            .map(([fieldName, { title }]) => ({ value : fieldName, text : title ?? fieldName }))
            .sort((a, b) => a.text.localeCompare(b.text));
    }

    get operatorOptions() {
        return this.operators[this.fieldIsRelation ? 'relation' : this.fieldType];
    }

    get fieldIsRelation() {
        return Boolean(this.currentPropertyRelationConfig);
    }

    get currentPropertyRelationConfig() {
        return this.store?.modelRelations?.find(({ foreignKey }) => foreignKey === this._filter?.property);
    }

    updateOperators() {
        delete this._operatorArgCountLookup;
    }

    get operatorArgCountLookup() {
        return this._operatorArgCountLookup ||
            (this._operatorArgCountLookup = FieldFilterPicker.buildOperatorArgCountLookup(this.operators));
    }

    updateFilter() {
        if (this._filter) {
            this.onFilterChange();
        }
    }

    updateStore(newStore) {
        this._store?.un(this);
        newStore?.ion({ refresh : 'onStoreRefresh', thisObj : this });
        this.inferFieldTypes();
    }

    onStoreRefresh({ action }) {
        if (this.isMultiSelectValueField && ['dataset', 'create', 'update', 'delete'].includes(action)) {
            this.valueFields[0].items = this.getUniqueDataValues(this.filterValues);
        }
    }

    refreshValueFields() {
        const
            me = this,
            { valueFields : valueFieldContainer } = me.widgetMap,
            {
                valueFields,
                fieldType,
                operatorArgCount,
                _filter: { property, operator }
            } = me,
            isMultiValue = multiValueOperators[operator],
            valueFieldType = (operator === 'sameTime' || operator === 'notSameTime') ? 'time' : fieldType;

        // Put value fields on own row / adjust size for data type
        valueFieldContainer.element.className = new DomClassList({
            [`${clsBase}-values`]                   : true,
            [`${clsBase}-values-multiple`]          : isMultiValue,
            [`${clsBase}-values-${valueFieldType}`] : fieldType !== undefined,
            'b-hidden'                              : property == undefined || operator == undefined || operatorArgCount === 0
        });

        const newFieldConfigs = me.getValueFieldConfigs();
        // Only recreate fields if a field type has changed, to prevent focus loss
        if (newFieldConfigs.length !== valueFields.length ||
            newFieldConfigs.some(({ type }, fieldIndex) => valueFields[fieldIndex].type !== type)
        ) {
            valueFieldContainer.removeAll();
            valueFieldContainer.add(newFieldConfigs);
        }
        else {
            let fieldIndex = 0;
            for (const newFieldConfig of newFieldConfigs) {
                delete newFieldConfig.type;
                ObjectHelper.assign(valueFields[fieldIndex++], newFieldConfig);
            }
        }

        delete me._valueFields;
        me.refreshCaseSensitive();
    }

    refreshCaseSensitive() {
        const
            me = this,
            { fieldType, operatorArgCount, isMultiSelectValueField } = me,
            operator = me._filter?.operator,
            { caseSensitive } = me.widgetMap;
        caseSensitive.hidden =
            fieldType !== 'string' ||
            !operator ||
            isMultiSelectValueField ||
            operatorArgCount === 0;
        caseSensitive.checked = me._filter?.caseSensitive !== false;
    }

    onPropertySelect(event) {
        const
            me = this,
            { _filter } = me;
        _filter.property = event.record?.data.value || null;
        if (me.fieldType !== me._fieldType) {
            _filter.operator = null;
            _filter.value = null;
        }
        me._fieldType = _filter.type = me.fieldType;
        me.refreshOperatorPicker();
        me.refreshValueFields();
        me.triggerChange();
    }

    onCaseSensitiveChange({ checked }) {
        this._filter.caseSensitive = checked;
        this.triggerChange();
    }

    onOperatorSelect(event) {
        const
            me = this,
            wasMultiSelectValueField = me.isMultiSelectValueField;
        const prevArgCount = this.operatorArgCount;
        me._filter.operator = event.record?.data.value || null;
        if (me.operatorArgCount !== prevArgCount) {
            me._filter.value = null;
        }
        if (me.isMultiSelectValueField && !wasMultiSelectValueField) {
            me._filter.value = [];
        }
        me.refreshValueFields();
        me.triggerChange();
    }

    triggerChange() {
        // Value-field setters can fire change synchronously before the picker row is attached and got assigned itemIndex
        if (this.isConstructing) {
            return;
        }

        const { filter, isValid } = this;
        /**
         * Fires when the filter is modified.
         * @event change
         * @param {Core.widget.FieldFilterPicker} source The FieldFilterPicker instance that fired the event.
         * @param {Array} filter The {@link Core.util.CollectionFilter} configuration object for the filter represented by this
         *                       {@link Core.widget.FieldFilterPicker}.
         * @param {Boolean} isValid Whether the current configuration object represents a complete and valid filter
         */
        this.trigger('change', {
            filter,
            isValid
        });
    }

    onValueChange() {
        const
            me = this,
            { isMultiSelectValueField, fieldType, _filter } = me,
            values = this.valueFields.map(extractFieldValue);

        if (isMultiSelectValueField && fieldType === 'date') {
            _filter.value = values[0].map(timestamp => new Date(timestamp));
        }
        else if (isMultiSelectValueField && fieldType === 'duration') {
            _filter.value = values[0].map(durationStr => new Duration(durationStr));
        }
        else {
            // Treat end date as inclusive by setting time to end of day
            if (fieldType === 'date' && _filter.operator === 'between' && DateHelper.isValidDate(values[1])) {
                values[1].setHours(23, 59, 59, 999);
            }
            _filter.value = values.length === 1 ? values[0] : values;
        }
        me.triggerChange();
    }

    refreshOperatorPicker() {
        const
            { operatorPicker } = this.widgetMap,
            { _filter: { operator, property }, operatorOptions } = this;
        operatorPicker.items = operatorOptions;
        operatorPicker.value = operator;
        operatorPicker.hidden = property === null;
    }

    populateUIFromFilter(forceRefreshValueFields = false) {
        const
            me = this,
            {
                filterValues,
                widgetMap: { propertyPicker, operatorPicker },
                _filter: { property, operator, disabled },
                propertyOptions,
                operatorOptions,
                isMultiSelectValueField
            } = me;
        propertyPicker.items = propertyOptions;
        operatorPicker.items = operatorOptions;
        operatorPicker.hidden = property === null;
        let refreshValueFields = forceRefreshValueFields;
        if (propertyPicker.value !== property) {
            propertyPicker.value = property;
            me.refreshOperatorPicker();
            refreshValueFields = true;
        }
        if (me.fieldType === 'date') {
            if (operator === '=') {
                me._filter.operator = 'sameDay';
            }
            else if (operator === '!=') {
                me._filter.operator = 'notSameDay';
            }
        }
        if (operatorPicker.value !== operator) {
            if (operator === null || !operatorPicker.items.find(({ value }) => value === operator)) {
                operatorPicker.clear();
            }
            else {
                operatorPicker.value = operator;
            }
            refreshValueFields = true;
        }
        if (!operator && operatorPicker.items.length === 1) {
            operatorPicker.value = me._filter.operator = operatorPicker.items[0].value;
        }
        if (refreshValueFields) {
            me.refreshValueFields();
        }
        me.refreshCaseSensitive();
        me.valueFields.forEach((valueField, fieldIndex) => {
            if (isMultiSelectValueField && (valueField.value.length > 0 || filterValues.length > 0)) {
                if (me.fieldType === 'date') {
                    valueField.value = filterValues.map(date => date?.valueOf());
                }
                else if (me.fieldType === 'duration') {
                    valueField.value = filterValues.map(duration => duration?.toString());
                }
                else {
                    valueField.value = filterValues;
                }
            }
            else if (fieldIndex >= filterValues.length) {
                valueField.clear();
            }
            else {
                valueField.value = filterValues[fieldIndex];
            }
        });
        // Grey out all inputs if filter is disabled
        me.allChildInputs.forEach(widget => widget.disabled = me.disabled || disabled);
    }

    get valueFields() {
        return this._valueFields ||
            (this._valueFields = this.widgetMap.valueFields.queryAll(
                w => w.owner === this.widgetMap.valueFields && valueInputTypes[w.type]));
    }

    get filterValues() {
        if (this._filter?.value == null) {
            return [];
        }
        return ArrayHelper.asArray(this._filter.value);
    }

    // Must be called manually when filter modified externally
    onFilterChange() {
        const
            me = this,
            newFieldType = me.fieldType,
            forceRefreshValueFields = newFieldType !== me._fieldType;
        me._fieldType = me._filter.type = newFieldType;
        me.populateUIFromFilter(forceRefreshValueFields);
    }

    get operatorArgCount() {
        const { fieldType, filter: { operator }, operatorArgCountLookup } = this;
        return (fieldType && operator) ? operatorArgCountLookup[fieldType][operator] : 1;
    }

    get isValid() {
        const
            me = this,
            { filter, fieldType, filterValues, isMultiSelectValueField, operatorArgCount } = me,
            { operator, value } = filter,
            missingValue = operatorArgCount > 0 && value == null;
        return Boolean(
            // fieldType here validates that we have a matching field
            fieldType &&
            operator &&
            !missingValue &&
            (nonEmptyValueOperators[operator] ? Boolean(value) : true) &&
            (
                (isMultiSelectValueField && filterValues.length > 0) ||
                (filterValues.length === operatorArgCount)
            ) &&
            filterValues.every(value => value != null &&
                (fieldType !== 'duration' || value.isValid))
        );
    }

    get focusElement() {
        return (this.valueFields.find(f => f.isEmptyInput) ?? this.operatorPicker ?? this.propertyPicker)?.input ??
            super.focusElement;
    }

    inferFieldTypes() {
        if (this.store?.totalCount > 0 && this.fields) {
            for (const [fieldName, fieldDef] of Object.entries(this.fields)) {
                if (fieldDef.type === 'auto') {
                    fieldDef.type = FieldFilterPicker.inferFieldType(this.store, fieldName);
                }
            }
        }
    }

    static inferFieldType(store, fieldName) {
        const
            // For array-valued fields (e.g. chip lists), inference is driven by the first non-null array item
            itemOrValue = value => Array.isArray(value) ? value.find(item => item != null) : value,
            firstValue  = itemOrValue(store.find(record => itemOrValue(record.getValue(fieldName)) != null, true)?.getValue(fieldName));

        if (firstValue !== undefined) {
            const valueType = typeof firstValue;
            if (valueType === 'object' && firstValue instanceof Date) {
                return 'date';
            }
            else if (isInferrableType[valueType]) {
                return valueType;
            }
        }
        return 'auto';
    }

    static localizeOperator(operator, dataType) {
        const
            { defaultOperators } = FieldFilterPicker,
            typeSearchOrder = Object.keys(defaultOperators).sort(
                (typeA, typeB) => (typeA === dataType) ? -1 : (typeB === dataType ? 1 : 0));
        for (const operatorDataType of typeSearchOrder) {
            for (const option of defaultOperators[operatorDataType]) {
                if (option.value === operator) {
                    return FieldFilterPicker.L(option.text);
                }
            }
        }
        return operator;
    }
}

FieldFilterPicker.initClass();
