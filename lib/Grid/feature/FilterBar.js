import Duration from '../../Core/data/Duration.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import GridFeature from './GridFeature.js';
import Widget from '../../Core/widget/Widget.js';
import '../../Core/widget/NumberField.js';
import '../../Core/widget/Combo.js';
import '../../Core/widget/DateField.js';
import '../../Core/widget/TimeField.js';
import CollectionFilter from '../../Core/util/CollectionFilter.js';
import { VALUE_COUNT } from '../widget/ChecklistFilterCombo.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';

DomHelper.loadStylesheet('Grid/feature/FilterBar.css');

// import Stylesheet from './FilterBar.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'FilterBar');

const
    complexOperators = {
        '*'          : null,
        isIncludedIn : null,
        startsWith   : null,
        endsWidth    : null
    },
    returnUndefined = () => undefined;

/**
 * @module Grid/feature/FilterBar
 */

/**
 * Feature that allows filtering of the grid by entering filters on column headers.
 * The actual filtering is done by the store.
 * For info on programmatically handling filters, see {@link Core.data.mixin.StoreFilter StoreFilter}.
 *
 * {@inlineexample Grid/feature/FilterBar.js}
 *
 * ```javascript
 * // filtering turned on but no initial filter
 * const grid = new Grid({
 *   features: {
 *     filterBar : true
 *   }
 * });
 *
 * // using initial filter
 * const grid = new Grid({
 *   features : {
 *     filterBar : { filter: { property : 'city', value : 'Gavle' } }
 *   }
 * });
 * ```
 *
 * ## Enabling filtering for a column
 * The individual filterability of columns is defined by a `filterable` property on the column which defaults to `true`.
 * If `false`, that column is not filterable. Note: If you have multiple columns configured with the same `field` value,
 * assign an {@link Core.data.Model#field-id} to the columns to ensure filters work correctly.
 *
 * The property value may also be a custom filter function.
 *
 * The property value may also be an object which may contain the following two properties:
 *  - **filterFn** : `Function` A custom filtering function
 *  - **filterField** : `Object` A config object for the filter value input field. See {@link Core.widget.TextField} or
 *  the other field widgets for reference.
 *
 * ```javascript
 * // Custom filtering function for a column
 * const grid = new Grid({
 *   features : {
 *     filterBar : true
 *   },
 *
 *   columns: [
 *      {
 *        field      : 'age',
 *        text       : 'Age',
 *        type       : 'number',
 *        // Custom filtering function that checks "greater than"
 *        filterable : ({ record, value }) => record.age > value
 *      },
 *      {
 *        field : 'name',
 *        // Filterable may specify a filterFn and a config for the filtering input field
 *        filterable : {
 *          filterFn : ({ record, value }) => record.name.toLowerCase().indexOf(value.toLowerCase()) !== -1,
 *          filterField : {
 *            emptyText : 'Filter name'
 *          }
 *        }
 *      },
 *      {
 *        field : 'city',
 *        text : 'Visited',
 *        flex : 1,
 *        // Filterable with multiselect combo to pick several items to filter
 *        filterable : {
 *          filterField : {
 *            type        : 'combo',
 *            multiSelect : true,
 *            items       : ['Barcelona', 'Montreal', 'Stockholm']
 *          }
 *        }
 *      }
 *   ]
 * });
 * ```
 *
 * If this feature is configured with `prioritizeColumns : true`, those functions will also be used when filtering
 * programmatically:
 *
 * ```javascript
 * const grid = new Grid({
 *    features : {
 *        filterBar : {
 *            prioritizeColumns : true
 *        }
 *    },
 *
 *    columns: [
 *        {
 *          field      : 'age',
 *          text       : 'Age',
 *          type       : 'number',
 *          // Custom filtering function that checks "greater than" no matter
 *          // which field the user filled in
 *          filterable : ({ record, value, operator }) => record.age > value
 *        }
 *    ]
 * });
 *
 * // Will be used when filtering programmatically or using the UI
 * grid.store.filter({
 *     property : 'age',
 *     value    : 41
 * });
 * ```
 *
 * ## Filtering using a multiselect combo
 *
 * To filter the grid by choosing values which should match with the store data, use a {@link Core.widget.Combo}, and configure
 * your grid like so:
 *
 * ```javascript
 * const grid = new Grid({
 *    features : {
 *        filterBar : true
 *    },
 *
 *    columns : [
 *        {
 *            id         : 'name',
 *            field      : 'name',
 *            text       : 'Name',
 *            filterable : {
 *                filterField : {
 *                    type         : 'combo',
 *                    multiSelect  : true,
 *                    valueField   : 'name',
 *                    displayField : 'name'
 *                }
 *            }
 *        }
 *    ]
 * });
 * ```
 *
 * You can also filter the {@link Core.widget.Combo} values, for example to filter out empty values. Example:
 *
 * ```javascript
 * const grid = new Grid({
 *    features : {
 *        filterBar : true
 *    },
 *
 *    columns : [
 *        {
 *            text       : 'Airline',
 *            field      : 'airline',
 *            flex       : 1,
 *            filterable : {
 *                filterField : {
 *                    type         : 'combo',
 *                    multiSelect  : true,
 *                    valueField   : 'airline',
 *                    displayField : 'airline',
 *                    store        : {
 *                        filters : {
 *                            // Filter out empty values
 *                            filterBy : record => Boolean(record.airline)
 *                        }
 *                    }
 *                }
 *            }
 *        }
 *    ]
 * });
 * ```
 *
 * ## Remote filtering
 * The FilterBar works with remote filtering, either by the use of an {@link Core.data.AjaxStore} with a configured
 * {@link Core/data/AjaxStore#config-filterParamName}, or a regular {@link Core.data.Store} with
 * {@link Core/data/Store#config-remoteFilter} activated. Please note that
 * {@link Core/util/CollectionFilter#config-filterBy} function is not supported when remote filtering.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * ## See also
 *
 * - {@link Grid.feature.Filter} - Context menu-based filtering
 * - {@link Core.data.Store#config-filters} - Programmatic store filtering
 *
 * @extends Grid/feature/GridFeature
 * @demo Grid/filterbar
 * @classtype filterBar
 * @feature
 * @tier community
 */
export default class FilterBar extends GridFeature {
    //region Config

    static $name = 'FilterBar';

    static tier = 'community';

    static type = 'filterBar';
    static configurable = {
        /**
         * Use custom filtering functions defined on columns also when programmatically filtering by the columns
         * field.
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *         {
         *             field : 'age',
         *             text : 'Age',
         *             filterable({ record, value }) {
         *               // Custom filtering, return true/false
         *             }
         *         }
         *     ],
         *
         *     features : {
         *         filterBar : {
         *             prioritizeColumns : true // <--
         *         }
         *     }
         * });
         *
         * // Because of the prioritizeColumns config above, any custom
         * // filterable function on a column will be used when
         * // programmatically filtering by that columns field
         * grid.store.filter({
         *     property : 'age',
         *     value    : 30
         * });
         * ```
         *
         * @config {Boolean}
         * @default
         * @category Common
         */
        prioritizeColumns : false,

        /**
         * The delay in milliseconds to wait after the last keystroke before applying filters.
         * Set to 0 to not trigger filtering from keystrokes, requires pressing ENTER instead
         * @config {Number}
         * @default
         * @category Common
         */
        keyStrokeFilterDelay : 300,

        /**
         * Toggle compact mode. In this mode the filtering fields are styled to transparently overlay the headers,
         * occupying no additional space.
         * @member {Boolean} compactMode
         * @category Common
         */
        /**
         * Specify `true` to enable compact mode for the filter bar. In this mode the filtering fields are styled
         * to transparently overlay the headers, occupying no additional space.
         * @config {Boolean}
         * @default
         * @category Common
         */
        compactMode : false,

        /**
         * By default, column filter is removed when a column is hidden or this feature is disabled. Set this flag
         * to `false` to keep filters in these scenarios.
         * @member {Boolean}
         * @category Common
         * @default
         */
        clearStoreFiltersOnHide : true,

        /**
         * Determines `filterBar` visibility. By default it is set to `false` and to hide the `filterBar` set
         * this flag to `true`.
         * @prp {Boolean}
         * @category Common
         * @default
         */
        hidden : false,

        /**
         * Use to set initial filter.
         *
         * ```javascript
         * const grid = new Grid({
         *   features : {
         *     filterBar : { filter: { property : 'city', value : 'Gavle' } }
         *   }
         * });
         * ```
         *
         * @config {CollectionFilterConfig|Function}
         * @returns {Boolean}
         * @category Common
         */
        filter : null,

        keyMap : {
            // Private
            ArrowUp    : { handler : 'disableGridNavigation', preventDefault : false },
            ArrowRight : { handler : 'disableGridNavigation', preventDefault : false },
            ArrowDown  : { handler : 'disableGridNavigation', preventDefault : false },
            ArrowLeft  : { handler : 'disableGridNavigation', preventDefault : false },
            Enter      : { handler : 'disableGridNavigation', preventDefault : false }
        },

        /**
         * Whether the feature is enabled on all columns by default. A column's `filterable.filterBar`
         * configuration overrides this setting.
         * @prp {Boolean}
         * @category Common
         * @default
         */
        defaultEnabled : true
    };

    static get pluginConfig() {
        return {
            before : ['renderContents'],
            after  : ['afterColumnsChange', 'renderHeader', 'populateHeaderMenu', 'bindStore']
        };
    }

    static get properties() {
        return {
            filterFieldCls           : 'b-filter-bar-field',
            filterFieldInputCls      : 'b-filter-bar-field-input',
            filterableColumnCls      : 'b-filter-bar-enabled',
            filterFieldInputSelector : '.b-filter-bar-field-input',
            filterableColumnSelector : '.b-filter-bar-enabled',
            filterParseRegExp        : /^\s*([<>=*])?(.*)$/, // NOSONAR - regex is used for filtering
            storeTrackingSuspended   : 0
        };
    }

    //endregion

    //region Init

    construct(config) {
        const me = this;

        me.onColumnFilterFieldChange = me.onColumnFilterFieldChange.bind(me);

        super.construct(config);

        me.bindStore();

        if (me.filter) {
            me.store.filter(me.filter);
        }

        me.gridDetacher = me.client.ion({ beforeElementClick : 'onBeforeElementClick', thisObj : me });
    }

    // An array shorthand is the filters to apply
    processConfig(config) {
        return Array.isArray(config) ? { filter : config } : config;
    }

    get store() {
        // TreeGroup displays a generated store of links, filtering targets the store holding the records
        return this.client.features.treeGroup?.originalStore ?? this.client.$store;
    }

    bindStore() {
        const
            me = this,
            // Resolved before detaching, resolving it can bind us by way of the feature lookup in `store`
            { store } = me;

        me.detachListeners('store');

        store.ion({
            name         : 'store',
            beforeFilter : 'onStoreBeforeFilter',
            filter       : 'onStoreFilter',
            thisObj      : me
        });
    }

    doDestroy() {
        this.destroyFilterBar();
        this.gridDetacher?.();

        super.doDestroy();
    }

    doDisable(disable) {
        const { columns } = this.client;

        // Disable the fields
        columns?.forEach(column => {
            const widget = this.getColumnFilterField(column);
            if (widget) {
                widget.disabled = disable;
            }
        });

        super.doDisable(disable);
    }

    updateHidden(hidden) {
        if (!this.isConfiguring) {
            if (hidden) {
                this.hideFilterBar();
            }
            else {
                this.showFilterBar();
            }
        }
    }

    updateCompactMode(value) {
        this.client.headerContainer.classList[value ? 'add' : 'remove']('b-filter-bar-compact');

        for (const prop in this._columnFilters) {
            const field       = this._columnFilters[prop];
            field.placeholder = value ? (field.placeholder || field.column.headerText) : null;
        }
    }

    //endregion

    //region FilterBar

    destroyFilterBar() {
        this.client.columns?.forEach(this.destroyColumnFilterField, this);
    }

    /**
     * Hides the filtering fields.
     */
    hideFilterBar() {
        const me = this;

        // We don't want to hear back store "filter" event while we're resetting store filters
        me.clearStoreFiltersOnHide && me.suspendStoreTracking();

        // Hide the fields, each silently - no updating of the store's filtered state until the end
        me.client.columns?.forEach(col => me.hideColumnFilterField(col, true));

        // Now update the filtered state
        me.store.filter();

        me.clearStoreFiltersOnHide && me.resumeStoreTracking();

        me._hidden = true;
    }

    /**
     * Shows the filtering fields.
     */
    showFilterBar() {
        this.suspendStoreTracking();
        this.renderFilterBar(this.clearStoreFiltersOnHide);
        this.resumeStoreTracking();

        this._hidden = false;
    }

    /**
     * Toggles the filtering fields visibility.
     */
    toggleFilterBar() {
        if (this.hidden) {
            this.showFilterBar();
        }
        else {
            this.hideFilterBar();
        }
    }

    /**
     * Renders the filtering fields for filterable columns.
     * @private
     */
    renderFilterBar(applyFilter) {
        if (this.client.hideHeaders) {
            return;
        }

        this.client.columns.visibleColumns.forEach(column => this.renderColumnFilterField(column, applyFilter));
        this.rendered = true;
    }

    //endregion

    //region FilterBar fields

    /**
     * Renders text field filter in the provided column header.
     * @param {Grid.column.Column} column Column to render text field filter for.
     * @private
     */
    renderColumnFilterField(column, applyFilters) {
        const
            me                = this,
            { client, store } = me,
            filterable        = me.getColumnFilterable(column);

        if (filterable && column.isVisible && column.element) {
            const
                { field } = column,
                headerEl  = column.element,
                filter    = store.filters.get(column.id) || store.filters.getBy('property', field);

            let widget = me.getColumnFilterField(column);

            // if we haven't created a field yet we build it from scratch
            if (!widget) {
                const
                    { filterField } = filterable,
                    type            = filterField?.type || `${column.filterType || 'text'}field`,
                    widgetCls       = Widget.resolveType(type),
                    { isCombo }     = widgetCls,
                    externalCls     = filterField?.cls,
                    ariaLabel       = filterField?.ariaLabel ?? (column.text ? me.L(`L{Filter.filter} ${column.text}`) : null);

                if (externalCls) {
                    delete filterable.filterField.cls;
                }

                const
                    hasFilterFieldStoreData = filterField?.store &&
                        (filterField.store.readUrl || filterField.store.data || filterField.store.isChained) || filterField?.items,
                    // Helper to get filterable values for combo. Walk allRecords (unfiltered) so the combo's
                    // distinct-value list is not narrowed by an already-applied column filter — otherwise
                    // re-opening the picker after a selection would only show the currently-filtered values.
                    getFilterableValues = () => {
                        // Read the store live, the grid's store may be replaced at runtime
                        const { store } = me;

                        if (filterable.getFilterableValues) {
                            const filterableValues = ArrayHelper.countUnique(store.allRecords.flatMap(filterable.getFilterableValues));
                            return filterableValues.map(({ value, count }) => ({
                                id            : value,
                                [field]       : value,
                                [VALUE_COUNT] : count
                            }));
                        }
                        else {
                            return store.getDistinctValues(field, true, true).map(({ value, count }) =>
                                store.createRecord({
                                    id            : value,
                                    [field]       : value,
                                    [VALUE_COUNT] : count
                                })
                            );
                        }
                    };

                // Prepare store data for combo fields before creating the widget
                let comboStoreConfig;
                if (isCombo && !hasFilterFieldStoreData) {
                    comboStoreConfig = {
                        store : {
                            data    : getFilterableValues(),
                            sorters : [{
                                field,
                                ascending : true
                            }]
                        }
                    };
                }

                widget = Widget.append(widgetCls.mergeConfigs({
                    type,
                    cls : {
                        [me.filterFieldCls] : 1,
                        [externalCls]       : externalCls
                    },
                    // Simplifies debugging / testing
                    dataset : {
                        column : field
                    },
                    column,
                    owner     : client,
                    clearable : {
                        key : 'Shift+Backspace'
                    },

                    // If the filterField is a combo, it needs to refresh the data when its picker is shown
                    [isCombo ? 'picker' : '_'] : {
                        internalListeners : {
                            beforeShow : 'up.refreshData'
                        }
                    },
                    revertOnEscape       : true,
                    // Omit display/value fields entirely for a user-supplied combo store so its own
                    // (or the Combo class default) values stay intact; `name` always stays the column
                    // field so the column filter property remains correct. See #13273
                    ...(hasFilterFieldStoreData ? null : { displayField : field, valueField : field }),
                    name                 : field,
                    value                : (filter && !filter._filterBy && !filter.internal) ? me.buildFilterValue(filter) : undefined,
                    inputCls             : me.filterFieldInputCls,
                    keyStrokeChangeDelay : me.keyStrokeFilterDelay,
                    disabled             : me.disabled,
                    placeholder          : me.compactMode ? column.headerText : null,
                    // Also copy formats, DateColumn, TimeColumn etc
                    format               : column.format,
                    ariaLabel,
                    internalListeners    : {
                        change : me.onColumnFilterFieldChange,
                        clear  : me.onColumnFilterFieldChange
                    },
                    ...(comboStoreConfig ?? {})
                }, filterField), headerEl)[0];

                client.applyRendition(widget);

                if (me.compactMode) {
                    widget.placeholder = filterField?.placeholder || column.headerText;
                }

                if (!filterField?.hasOwnProperty('min')) {
                    Object.defineProperty(widget, 'min', {
                        get : () => column.editor?.min,
                        set : returnUndefined
                    });
                }

                if (!filterField?.hasOwnProperty('max')) {
                    Object.defineProperty(widget, 'max', {
                        get : () => column.editor?.max,
                        set : returnUndefined
                    });
                }

                if (!filterField?.hasOwnProperty('strictParsing')) {
                    Object.defineProperty(widget, 'strictParsing', {
                        get : () => column.editor?.strictParsing,
                        set : returnUndefined
                    });
                }

                // Avoid DomSync cleaning up this widget as it syncs column headers
                widget.element.retainElement = true;

                me.setColumnFilterField(column, widget);

                // Set up refreshData method for dynamic combo fields
                if (isCombo) {
                    if (comboStoreConfig) {
                        widget.refreshData = () => {
                            // Might have replaced the widgets store at runtime, make sure we should still force refresh
                            if (!(widget.store.readUrl || widget.store.isChained)) {
                                widget.store.data = getFilterableValues();
                                // Re-apply any active search filter so re-opening the picker preserves the filtered
                                // view (refresh replaces the store data which clears the filter). Use store.filter()
                                // directly — doFilter accesses widget.picker and would re-trigger beforeShow recursion.
                                if (widget.searchText && widget.primaryFilter) {
                                    widget.primaryFilter.setConfig({
                                        value    : widget.searchText,
                                        disabled : false
                                    });
                                    widget.store.filter();
                                }
                            }
                        };
                    }
                    // We do not need to refresh the data before picker show if the store is already set
                    else {
                        delete widget.peekConfig('picker')?.internalListeners?.beforeShow;
                    }
                }

                // If no initial filter exists but a value was provided to the widget, filter by it
                // unless the store is configured to not autoLoad
                if (!me.filter && widget.value && store.autoLoad !== false) {
                    me.onColumnFilterFieldChange({ source : widget, value : widget.value, silent : true });
                }
            }
            // if we have one...
            else {
                if (applyFilters) {
                    // Apply widget filter on first render
                    me.onColumnFilterFieldChange({ source : widget, value : widget.value });
                }
                // re-append the widget to its parent node (in case the column header was redrawn (happens when resizing columns))
                widget.render(headerEl);
                // show widget in case it was hidden
                widget.show();
            }

            headerEl.classList.add(me.filterableColumnCls);
        }
    }

    /**
     * Fills in column filter fields with values from the grid store filters.
     * @private
     */
    updateColumnFilterFields() {
        const
            me          = this,
            { store }   = me,
            { columns } = me.client;

        let field, filter;

        // During this phase we should not respond to field change events.
        // See onColumnFilterFieldChange.
        me._updatingFields = true;

        for (const column of columns.visibleColumns) {
            field = me.getColumnFilterField(column);
            if (field && !column.$isApplyingFilter) {
                filter = store.filters.get(column.id) || store.filters.getBy('property', column.field);
                if (filter && !filter.internal) {
                    // For filtering functions we keep what user typed into the field, we cannot construct a filter
                    // string from them
                    if (!filter._filterBy) {
                        field.value = me.buildFilterValue(filter);
                    }
                    else {
                        field.value = filter.value;
                    }
                }
                // No filter, clear field
                else if (field.isCombo && field.multiSelect) {
                    field.value = [];
                }
                else {
                    field.value = '';
                }
            }
        }

        me._updatingFields = false;
    }

    getColumnFilterable(column) {
        if (!column.isRoot && this.canFilterColumn(column) && column.field && column.isLeaf) {
            if (typeof column.filterable === 'function') {
                column.filterable = {
                    filterFn : column.filterable
                };
            }
            return column.filterable;
        }
    }

    destroyColumnFilterField(column) {
        const widget = this.getColumnFilterField(column);

        if (widget) {
            this.hideColumnFilterField(column, true);
            // destroy filter UI field
            widget.destroy();
            // remember there is no field bound anymore
            this.setColumnFilterField(column, undefined);
        }
    }

    hideColumnFilterField(column, silent) {
        const
            me        = this,
            { store } = me,
            columnEl  = column.element,
            widget    = me.getColumnFilterField(column);

        if (widget) {
            if (!me.isDestroying) {
                // hide field
                widget.hide();
            }
            const { $filter } = column;

            if (!store.isDestroyed && me.clearStoreFiltersOnHide && $filter) {
                store.removeFilter($filter, silent);
            }

            columnEl?.classList.remove(me.filterableColumnCls);
        }
    }

    /**
     * Returns column filter field instance.
     * @param {Grid.column.Column} column Column to get filter field for.
     * @returns {Core.widget.Widget}
     */
    getColumnFilterField(column) {
        return this._columnFilters?.[column.id];
    }

    /**
     * Caches column filter field instance.
     * @param {Grid.column.Column} column Column to cache filter field for.
     * @param {Core.widget.Widget} widget The filter field widget instance to cache.
     * @internal
     */
    setColumnFilterField(column, widget) {
        this._columnFilters = this._columnFilters || {};

        this._columnFilters[column.id] = widget;
    }

    //endregion

    //region Filters

    parseFilterValue(column, value, field) {
        if (Array.isArray(value) || value instanceof Duration || typeof value === 'number') {
            return {
                value
            };
        }
        if (ObjectHelper.isDate(value)) {
            return {
                operator : field.isDateField ? 'sameDay' : (field.isTimeField ? 'sameTime' : '='),
                value
            };
        }

        const
            match           = String(value).match(this.filterParseRegExp),
            defaultOperator = typeof value === 'number' ? '=' : '*';

        return {
            operator : match[1] || column.filterable?.operator || defaultOperator,
            value    : match[2]
        };
    }

    buildFilterValue({ operator, value }) {
        return (typeof value === 'number' || value instanceof Date || Array.isArray(value) || value instanceof Duration) ? value : (operator in complexOperators ? '' : operator) + value;
    }

    //endregion

    // region Events

    // Intercept filtering by a column that has a custom filtering fn, and inject that fn
    onStoreBeforeFilter({ filters }) {
        const { columns } = this.client;

        for (let i = 0; i < filters.count; i++) {
            const
                filter = filters.getAt(i),
                column = (filter.columnOwned || this.prioritizeColumns) && columns.find(col => this.canFilterColumn(col) && col.field === filter.property);

            if (column?.filterable?.filterFn) {
                // If the filter was sourced from the store, replace it with a filter which
                // uses the column's filterFn
                if (!column.$filter) {
                    column.$filter = new CollectionFilter({
                        columnOwned : true,
                        property    : filter.property,
                        id          : column.id,
                        filterBy(record) {
                            return column.filterable.filterFn({
                                value : this.value, record, property : this.property, column
                            });
                        }
                    });
                }

                // Update value used by filters filtering fn
                column.$filter.value = filter.value;
                filters.splice(i, 1, column.$filter);
            }
        }
    }

    /**
     * Fires when store gets filtered. Refreshes field values in column headers.
     * @private
     */
    onStoreFilter() {
        if (!this.storeTrackingSuspended && this.rendered) {
            this.updateColumnFilterFields();
        }
    }

    afterColumnsChange({ action, changes, column, columns }) {
        const me = this;
        for (const col of me.client.columns.visibleColumns) {
            if (me.canFilterColumn(col) &&
                (col.filterable?.filter === true || (me.client.features.filter?.defaultEnabled &&
                    col.filterable?.filter !== false))
            ) {
                throw new Error('Columns do not currently support both `filter` and ' +
                    `\`filterBar\` features enabled on the same column. Please check column with id ${col.id}.`);
            }
        }
        // Ignore if columns change while this filter bar is hidden, or if column changeset does not include hidden
        // state
        if (!me.hidden && changes?.hidden) {
            const hidden = changes.hidden.value;

            if (hidden) {
                me.destroyColumnFilterField(column);
            }
            else {
                me.renderColumnFilterField(column);
            }
        }

        if (action === 'remove') {
            columns.forEach(col => me.destroyColumnFilterField(col));
        }
    }

    suspendStoreTracking() {
        this.storeTrackingSuspended++;
    }

    resumeStoreTracking() {
        this.storeTrackingSuspended--;
    }

    /**
     * Called after headers are rendered, make headers match stores initial sorters
     * @private
     */
    renderHeader() {
        if (!this.hidden) {
            this.renderFilterBar();
        }
    }

    renderContents() {
        // Grid suspends events when restoring state, thus we are not informed about toggled columns and might end up
        // with wrong fields in headers. To prevent that, we remove all field elements here since they are restored in
        // renderColumnFilterField() later anyway
        if (this._columnFilters) {
            for (const field of Object.values(this._columnFilters)) {
                field?.element.remove();
            }
        }
    }

    disableGridNavigation(event) {
        /* If we have navigated (ArrowUp, ArrowLeft, ArrowDown, ArrowRight, Enter) in a filter field, "catch" the key
         * call.
         */
        return event.target.matches(this.filterFieldInputSelector);
    }

    onBeforeElementClick({ event }) {
        // prevent other features reacting when clicking a filter field (or any element inside it)
        if (event.target.closest(`.${this.filterFieldCls}`)) {
            return false;
        }
    }

    /**
     * Called when a column text filter field value is changed by user.
     * @param  {Core.widget.TextField} field Filter text field.
     * @param  {String} value New filtering value.
     * @private
     */
    onColumnFilterFieldChange({ source : field, value, silent }) {
        const
            me           = this,
            { column }   = field,
            { filterFn } = column.filterable,
            { store }    = me,
            filter       = column.$filter || store.filters.find(f => (f.id === column.id || f.property === column.field) && !f.internal);

        // Don't respond if we set the value in response to a filter
        if (me._updatingFields) {
            return;
        }

        const isClearingFilter = value == null || value === '' || Array.isArray(value) && value.length === 0;

        // Remove previous iteration of the column's filter
        store.removeFilter(filter, true);
        column.$filter           = null;
        column.$isApplyingFilter = true;

        if (isClearingFilter) {
            // This is a no-op if there was no matching filter anyway
            if (!filter) {
                column.$isApplyingFilter = false;
                return;
            }
        }
        else {
            // Must add the filter silently, so that the column gets a reference to its $filter
            // before events are broadcast
            column.$filter = store.addFilter({
                property                                                                              : field.name,
                ...me.parseFilterValue(column, value, field),
                [typeof column.filterable?.caseSensitive === 'boolean' ? 'caseSensitive' : undefined] : column.filterable?.caseSensitive,

                // Only inject a filterBy configuration if the column has a custom filterBy
                [filterFn ? 'filterBy' : '_'] : function(record) {
                    return filterFn({
                        value    : this.value,
                        record,
                        operator : this.operator,
                        property : this.property,
                        column
                    });
                }
            }, true);
        }

        // Apply the new set of store filters.
        store.filter({ silent });
        column.$isApplyingFilter = false;

        // Columns may have changed width due to autoWidth setting
        if (field.picker?.isVisible) {
            field.picker?.realign?.();
        }
    }

    //endregion

    //region Menu items

    /**
     * Adds a menu item to toggle filter bar visibility.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items
     * @internal
     */
    populateHeaderMenu({ items }) {
        items.toggleFilterBar = {
            text        : this.hidden ? 'L{enableFilterBar}' : 'L{disableFilterBar}',
            localeClass : this,
            weight      : 120,
            icon        : 'b-fw-icon b-icon-filter',
            separator   : true,
            onItem      : () => this.toggleFilterBar()
        };
    }

    //endregion

    canFilterColumn(column) {
        return (column.filterable !== false &&
            (column.filterable?.filterBar === true ||
                (column.filterable?.filterBar !== false && this.defaultEnabled !== false)));
    }
}

FilterBar.initClass();
