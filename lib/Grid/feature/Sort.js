import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import GridFeature from './GridFeature.js';
DomHelper.loadStylesheet('Grid/feature/Sort.css');

// import Stylesheet from './Sort.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Sort');

// <remove-on-release>
// TODO: Allow multisort using multitouch?
// TODO: UI sort of broken with grouped headers, take a look at groupedheaders demo
// </remove-on-release>

/**
 * @module Grid/feature/Sort
 */

const emptyArray = Object.freeze([]);

/**
 * Allows sorting of grid by clicking (or tapping) headers, also displays which columns grid is sorted by (numbered if
 * using multisort). Use modifier keys for multisorting: [Ctrl/CMD + click] to add sorter, [Ctrl/CMD + Alt + click] to remove sorter.
 * The actual sorting is done by the store, see {@link Core.data.mixin.StoreSort#function-sort Store.sort()}.
 *
 * {@inlineexample Grid/feature/Sort.js}
 *
 * ```javascript
 * // sorting feature is enabled, no default value though
 * const grid = new Grid({
 *     features : {
 *         sort : true
 *     }
 * });
 *
 * // use initial sorting
 * const grid = new Grid({
 *     features : {
 *         sort : 'name'
 *     }
 * });
 *
 * // can also be specified on the store
 * const grid = new Grid({
 *     store : {
 *         sorters : [
 *             { field : 'name', ascending : false }
 *         ]
 *     }
 * });
 *
 * // custom sorting function can also be specified on the store
 * const grid = new Grid({
 *     store : {
 *         sorters : [{
 *             fn : (recordA, recordB) => {
 *                 // apply custom logic, for example:
 *                 return recordA.name.length < recordB.name.length ? -1 : 1;
 *             }
 *         }]
 *     }
 * });
 * ```
 *
 * For info on programmatically handling sorting, see {@link Core.data.mixin.StoreSort StoreSort}:
 *
 * ```javascript
 * const grid = new Grid({ });
 * // Programmatic sorting of the store, Grids rows and UI will be updated
 * grid.store.sort('age');
 * ```
 *
 * Grid columns can define custom sorting functions (see {@link Grid.column.Column#config-sortable Column.sortable}).
 * If this feature is configured with `prioritizeColumns: true`, those functions will also be used when sorting
 * programmatically:
 *
 * ```javascript
 * const grid = new Grid({
 *     columns : [
 *         {
 *             field : 'age',
 *             text : 'Age',
 * +           sortable(lhs, rhs) {
 * +             // Custom sorting, see Array#sort
 * +           }
 *         }
 *     ],
 *
 *     features : {
 *         sort : {
 * +            prioritizeColumns : true
 *         }
 *     }
 * });
 *
 * // Sortable fn will also be used when sorting programmatically
 * grid.store.sort('age');
 * ```
 *
 * This feature is **enabled** by default.
 *
 * ## See also
 *
 * - {@link Grid.feature.Group} - Grouping feature
 * - {@link Core.data.Store#config-sorters} - Programmatic sorting
 *
 * @extends Grid/feature/GridFeature
 * @demo Grid/sorting
 * @classtype sort
 * @feature
 * @tier community
 */
export default class Sort extends GridFeature {
    //region Config

    static $name = 'Sort';

    static tier = 'community';

    static type = 'sort';

    static defaultEnabled = true;
    static configurable = {
        /**
         * Enable multi sort
         * @config {Boolean}
         * @default
         */
        multiSort : true,

        /**
         * Use custom sorting functions defined on columns also when programmatically sorting by the columns field.
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *         {
         *             field : 'age',
         *             text : 'Age',
         *             sortable(lhs, rhs) {
         *               // Custom sorting, see Array#sort
         *             }
         *         }
         *     ],
         *
         *     features : {
         *         sort : {
         *             prioritizeColumns : true
         *         }
         *     }
         * });
         *
         * grid.store.sort('age');
         * ```
         *
         * @config {Boolean}
         * @default
         */
        prioritizeColumns : false,

        /**
         * Set to `false` to not show the sort icon when hovering a Column header.
         * @prp {Boolean}
         * @default
         */
        showIconOnColumnHover : true,

        /**
         * By default, clicking anywhere on the header text toggles the sorting state of a column.
         *
         * Configure this as `false` to only toggle the sorting state of a column on click of the
         * "arrow" icon within the grid header.
         * @config {Boolean}
         * @default false
         */
        toggleOnHeaderClick : true
    };

    static get properties() {
        return {
            ignoreRe : new RegExp([
                // Stop this feature from having to know the internals of two other optional features.
                'b-grid-header-resize-handle',
                'b-filter-icon',
                'b-widget'
            ].join('|')),

            sortableCls   : 'b-sortable',
            sortedCls     : 'b-sort',
            sortedAscCls  : 'b-asc',
            sortedDescCls : 'b-desc'
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        this.bindStore(this.store);
    }

    // Sort feature handles special config cases, where user can supply a string or an array of sorters
    // instead of a normal config object
    processConfig(config) {
        if (typeof config === 'string' || Array.isArray(config)) {
            return {
                field     : config,
                ascending : null
            };
        }

        return config;
    }

    // override setConfig to process config before applying it
    setConfig(config) {
        super.setConfig(this.processConfig(config));
    }

    bindStore(store) {
        this.detachListeners('store');

        store.ion({
            name       : 'store',
            beforeSort : 'onStoreBeforeSort',
            sort       : 'syncHeaderSortState',
            thisObj    : this
        });

        if (this.client.isPainted) {
            this.syncHeaderSortState();
        }
    }

    set field(field) {
        // Use columns sortable config for initial sorting if it is specified
        const column = this.client.columns.get(field);

        if (column && typeof column.sortable === 'object') {
            // Normalization of Store & CollectionSorter differences
            column.sortable.field = column.sortable.property || field;
            field = column.sortable;
        }

        // Do not reapply sorting if already sorted by the field. This will prevent sort direction from flipping
        // when splitting grids using sort feature configured with field (store is shared)
        if (!this.store.sorters?.some(g => g.field === field)) {
            this.store.sort(field, this.ascending);
        }
    }

    // Avoid caching store, it might change
    get store() {
        return this.client[this.client.sortFeatureStore];
    }

    //endregion

    //region Plugin config

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['onElementClick', 'populateHeaderMenu', 'getColumnDragToolbarItems', 'renderHeader', 'onInternalPaint', 'bindStore']
        };
    }

    //endregion

    //region Headers

    /**
     * Update headers to match stores sorters (displays sort icon in correct direction on them)
     * @private
     */
    syncHeaderSortState() {
        const
            me         = this,
            { client } = me;

        if (!client.hideHeaders && client.isPainted) {
            const
                sorters     = me.store.sorters ?? emptyArray,
                sorterCount = sorters.length,
                classList   = new DomClassList();
            let sorter;

            // Sync the sortable, sorted, and sortIndex state of each leaf header element
            for (const leafColumn of client.columns.visibleColumns) {
                if (!leafColumn.sortable || !leafColumn.element) {
                    continue;
                }

                const
                    leafHeader = leafColumn.element,
                    textEl     = leafColumn.textWrapper,
                    // TimeAxisColumn in Scheduler has no textWrapper, since it has custom rendering,
                    // but since it cannot be sorted by anyway lets just ignore it
                    dataset    = textEl?.dataset;

                let sortDirection = 'none';

                // data-sortIndex is 1-based, and only set if there is > 1 sorter.
                // iOS Safari throws a JS error if the requested delete property is not present.
                dataset?.sortIndex && delete dataset.sortIndex;

                classList.value = leafHeader.classList;

                if (leafColumn.sortable === false) {
                    classList.remove(me.sortableCls);
                    textEl?.querySelector('.b-sort-icon')?.remove();
                }
                else {
                    if (!textEl?.querySelector('.b-sort-icon')) {
                        DomHelper.createElement({
                            tag       : 'i',
                            parent    : textEl,
                            className : 'b-icon b-sort-icon'
                        });
                    }
                    classList.add(me.sortableCls);

                    sorter = sorters
                        .find(sort =>
                            sort.field === leafColumn.field ||
                            (sort.sortFn && sort.sortFn === leafColumn.sortable.sortFn)
                        );

                    if (sorter) {
                        if (sorterCount > 1 && dataset) {
                            dataset.sortIndex = sorters.indexOf(sorter) + 1;
                        }
                        classList.add(me.sortedCls);
                        if (sorter.ascending) {
                            classList.add(me.sortedAscCls);
                            classList.remove(me.sortedDescCls);
                            sortDirection = 'ascending';
                        }
                        else {
                            classList.add(me.sortedDescCls);
                            classList.remove(me.sortedAscCls);
                            sortDirection = 'descending';
                        }
                    }
                    else {
                        classList.remove(me.sortedCls);
                        // Not optimal, but easiest way to make sure sort feature does not remove needed classes.
                        // Better solution would be to use different names for sorting and grouping
                        if (!classList['b-group']) {
                            classList.remove(me.sortedAscCls);
                            classList.remove(me.sortedDescCls);
                        }
                    }
                }

                // Update the element's classList
                DomHelper.syncClassList(leafHeader, classList);
                DomHelper.setAttributes(leafHeader, {
                    'aria-sort' : sortDirection
                });
            }
        }
    }

    updateShowIconOnColumnHover(showIconOnColumnHover) {
        this.client.element.classList.toggle('b-sort-hover-icon', Boolean(showIconOnColumnHover));
    }

    //endregion

    //region Context menu

    /**
     * Adds sort menu items to header context menu.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items
     * @internal
     */
    populateHeaderMenu({ column, items }) {
        const
            me        = this,
            { store } = me,
            sortBy    = {  ...column.sortable, field : column.field, columnOwned : true },
            grouper   = store.groupers?.find(g => g.field === column.field);

        if (column.sortable !== false) {
            items.sortAsc = {
                text        : 'L{sortAscending}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-sort-asc',
                separator   : true,
                weight      : 300,
                disabled    : grouper || me.disabled,
                onItem      : () => store.sort(sortBy, true)
            };

            items.sortDesc = {
                text        : 'L{sortDescending}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-sort-desc',
                weight      : 310,
                disabled    : grouper || me.disabled,
                onItem      : () => store.sort(sortBy, false)
            };

            if (me.multiSort && me.client.columns.records.some(col => col.sortable)) {
                const sorter = store.sorters.find(s => s.field === column.field || (column.sortable.sortFn && column.sortable.sortFn === s.sortFn));

                items.multiSort = {
                    text        : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-fw-icon b-icon-sort',
                    weight      : 320,
                    disabled    : grouper || me.disabled,
                    menu        : {
                        addSortAsc : {
                            text        : sorter ? 'L{toggleSortAscending}' : 'L{addSortAscending}',
                            localeClass : me,
                            icon        : 'b-fw-icon b-icon-sort-asc',
                            disabled    : sorter && sorter?.ascending,
                            weight      : 330,
                            onItem      : () => store.addSorter(sortBy, true)
                        },
                        addSortDesc : {
                            text        : sorter ? 'L{toggleSortDescending}' : 'L{addSortDescending}',
                            localeClass : me,
                            icon        : 'b-fw-icon b-icon-sort-desc',
                            disabled    : sorter && !sorter.ascending,
                            weight      : 340,
                            onItem      : () => store.addSorter(sortBy, false)
                        },
                        removeSorter : {
                            text        : 'L{removeSorter}',
                            localeClass : me,
                            icon        : 'b-fw-icon b-icon-remove',
                            weight      : 350,
                            disabled    : !sorter,
                            onItem      : () => {
                                store.removeSorter(sortBy.field);
                            }
                        }
                    }
                };
            }
        }
    }

    /**
     * Supply items to ColumnDragToolbar
     * @private
     */
    getColumnDragToolbarItems(column, items) {
        const
            me                  = this,
            { store, disabled } = me;

        if (column.sortable !== false) {
            const sorter = store.sorters.find(s => s.field === column.field);

            items.push(
                {
                    text        : 'L{sortAscendingShort}',
                    group       : 'L{sort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-asc',
                    ref         : 'sortAsc',
                    cls         : 'b-separator',
                    weight      : 105,
                    disabled,
                    onDrop      : ({ column }) => store.sort(column.field, true)
                },
                {
                    text        : 'L{sortDescendingShort}',
                    group       : 'L{sort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-desc',
                    ref         : 'sortDesc',
                    weight      : 105,
                    disabled,
                    onDrop      : ({ column }) => store.sort(column.field, false)
                },
                {
                    text        : 'L{addSortAscendingShort}',
                    group       : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-asc',
                    ref         : 'multisortAddAsc',
                    disabled    : disabled || (sorter && sorter.ascending),
                    weight      : 105,
                    onDrop      : ({ column }) => store.addSorter(column.field, true)
                }, {
                    text        : 'L{addSortDescendingShort}',
                    group       : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-desc',
                    ref         : 'multisortAddDesc',
                    disabled    : disabled || (sorter && !sorter.ascending),
                    weight      : 105,
                    onDrop      : ({ column }) => store.addSorter(column.field, false)
                }, {
                    text        : 'L{removeSorterShort}',
                    group       : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-remove',
                    ref         : 'multisortRemove',
                    weight      : 105,
                    disabled    : disabled || !sorter,
                    onDrop      : ({ column }) => store.removeSorter(column.field)
                }
            );
        }
        return items;
    }

    //endregion

    //region Events

    // Intercept sorting by a column that has a custom sorting fn, and inject that fn
    onStoreBeforeSort({ sorters }) {
        const { columns } = this.client;

        for (let i = 0; i < sorters.length; i++) {
            const
                sorter = sorters[i],
                column = (sorter.columnOwned || this.prioritizeColumns) && columns.get(sorter.field);

            if (column?.sortable?.sortFn) {
                sorters[i] = { ...sorter, ...column.sortable, columnOwned : true };
            }
        }
    }

    /**
     * Clicked on header, sort Store.
     * @private
     */
    onElementClick(event) {
        const
            me         = this,
            { store }  = me,
            { target } = event,
            header     = target.closest('.b-grid-header.b-sortable'),
            field      = header?.dataset.column;

        if (me.ignoreRe.test(target.className) || target.closest('.b-grid-header-widget') || me.disabled || event.handled) {
            return;
        }

        //Header
        if (header && field && (me.toggleOnHeaderClick || target.closest('.b-sort-icon'))) {
            const
                column        = me.client.columns.getById(header.dataset.columnId),
                columnGrouper = store.isGrouped && store.groupers.find(g => g.field === field);

            // The Group feature will handle the change of the grouper's direction
            if (columnGrouper && !event.shiftKey) {
                return;
            }

            if (column.sortable && !event.shiftKey) {
                if (event.ctrlKey && event.altKey) {
                    store.removeSorter(column.field);
                }
                else {
                    const sortBy = {
                        columnOwned : true,
                        field       : column.field
                    };

                    // sortable as a function is handled by onStoreBeforeSort() above

                    if (typeof column.sortable === 'object') {
                        ObjectHelper.assign(sortBy, column.sortable);
                    }

                    store.sort(sortBy, null, event.ctrlKey && me.multiSort);
                }
            }
        }
    }

    /**
     * Called when grid headers are rendered, make headers match current sorters.
     * @private
     */
    renderHeader() {
        this.syncHeaderSortState();
    }

    onInternalPaint() {
        this.syncHeaderSortState();
    }

    //endregion
}

Sort.initClass();
