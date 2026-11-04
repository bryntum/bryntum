import WidgetColumn from '../../Grid/column/WidgetColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import Events from '../../Core/mixin/Events.js';
import HorizontalTimeAxis from '../view/HorizontalTimeAxis.js';
import ResourceHeader from '../view/ResourceHeader.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import LocaleManager from '../../Core/localization/LocaleManager.js';

/**
 * @module Scheduler/column/TimeAxisColumn
 */

/**
 * A column containing the timeline "viewport", in which events, dependencies etc. are drawn.
 * Normally you do not need to interact with or create this column, it is handled by Scheduler.
 *
 * ## What this column renders
 *
 * This column occupies the timeline region of the Scheduler. Each row cell spans the full
 * time axis and is where the Scheduler paints the visual timeline content on top of
 * the time axis grid:
 *
 * - Event bars for the row's resource
 * - Dependency lines between events
 * - Time ranges and resource time ranges (shaded zones)
 * - The current time line and other indicators
 *
 * In `horizontal` mode the column header displays the timeline ticks (a `HorizontalTimeAxis`), while in `vertical`
 * mode it instead displays the resources at the top.
 *
 * ## Rendering custom cell content
 *
 * If you wish to output custom contents inside the time axis row cells (for example a per-row chart or sparkline drawn
 * across the timeline), there are two supported approaches.
 *
 * The live example below uses a {@link #config-renderer} to draw a custom utilization bar across each row's timeline
 * cell:
 *
 * {@inlineexample Scheduler/column/TimeAxisColumn.js}
 *
 * **1. Provide a {@link #config-renderer}** to control the cell contents directly. A renderer may return an HTML
 * string, a {@link Core.helper.DomHelper#typedef-DomConfig} object, a `DomConfig` array, an `HTMLElement`, or `null`:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     appendTo : document.body,
 *     columns  : [
 *         { text : 'Name', field : 'name', width : 130 },
 *         {
 *             type : 'timeAxis',
 *             // Return an HTML string
 *             renderer({ record, cellElement }) {
 *                 return '<div class="cool-chart"></div>';
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * Returning a `DomConfig` object instead of a string is preferred, since text is automatically HTML encoded which
 * avoids XSS issues with record data:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     appendTo : document.body,
 *     columns  : [
 *         { text : 'Name', field : 'name', width : 130 },
 *         {
 *             type : 'timeAxis',
 *             renderer({ record }) {
 *                 return {
 *                     class    : 'cool-chart',
 *                     children : [
 *                         { tag : 'span', class : 'chart-label', text : record.name }
 *                     ]
 *                 };
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * **2. Render {@link Grid.column.WidgetColumn#config-widgets}** into the cells (this column extends
 * {@link Grid.column.WidgetColumn}) and use `afterRenderCell` to update them from the row's record.
 * `afterRenderCell` also receives the `cellElement`, so you can append your own DOM nodes to it:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     appendTo : document.body,
 *     columns  : [
 *         { text : 'Name', field : 'name', width : 130 },
 *         {
 *             type    : 'timeAxis',
 *             widgets : [{ type : 'chart' }],
 *             afterRenderCell({ record, widgets }) {
 *                 widgets[0].refresh({ record });
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * {@note}When a renderer outputs static HTML, `htmlEncode` is automatically set to `false` if not explicitly
 * configured. You are then responsible for HTML encoding any user provided data to mitigate XSS issues (see
 * `StringHelper.encodeHtml`), or return a `DomConfig` object instead.{/@note}
 *
 * The Scheduler `embedded-chart` demo shows a complete example of rendering a live line chart per row inside this
 * column using the `widgets` + `afterRenderCell` approach.
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 * - {@link Scheduler.preset.ViewPreset} - Time axis configuration
 * - {@link Grid.column.WidgetColumn} - Base column class this column extends
 *
 * @extends Grid/column/WidgetColumn
 * @classtype timeAxis
 * @column
 * @tier community
 */
export default class TimeAxisColumn extends Events(WidgetColumn) {
    //region Config
    headerHoverable = false;

    static $name = 'TimeAxisColumn';
    static type = 'timeAxis';

    static fields = [
        // Exclude some irrelevant fields from getCurrentConfig()
        { name : 'locked', persist : false },
        { name : 'flex', persist : false },
        { name : 'width', persist : false },
        { name : 'cellCls', persist : false },
        { name : 'field', persist : false },
        'mode'
    ];

    static defaults = {
        /**
         * @hideproperties editor, tooltipRenderer, draggable, groupable, filterable, sortable, exportable, htmlEncode
         */

        /**
         * Set to `false` to prevent this column header from being dragged.
         * @prp {Boolean} draggable
         * @category Interaction
         * @default false
         */
        draggable : false,

        /**
         * Set to `false` to prevent grouping by this column.
         * @prp {Boolean} groupable
         * @category Interaction
         * @default false
         */
        groupable : false,

        /**
         * Allow column visibility to be toggled through UI.
         * @prp {Boolean} hideable
         * @default false
         * @category Interaction
         */
        hideable : false,

        /**
         * Show column picker for the column.
         * @prp {Boolean} showColumnPicker
         * @default false
         * @category Menu
         */
        showColumnPicker : false,

        /**
         * Allow filtering data in the column (if Filter feature is enabled)
         * @prp {Boolean} filterable
         * @default false
         * @category Interaction
         */
        filterable : false,

        /**
         * Allow sorting of data in the column
         * @prp {Boolean} sortable
         * @category Interaction
         * @default false
         */
        sortable : false,

        /**
         * Set to `false` to prevent the column from being drag-resized when the ColumnResize plugin is enabled.
         * @prp {Boolean} resizable
         * @default false
         * @category Interaction
         */
        resizable : false,

        /**
         * Allow searching in the column (respected by QuickFind and Search features)
         * @prp {Boolean} searchable
         * @default false
         * @category Interaction
         */
        searchable : false,

        editor : false,

        /**
         * Set to `true` to show a context menu on the cell elements in this column
         * @prp {Boolean} enableCellContextMenu
         * @default false
         * @category Menu
         */
        enableCellContextMenu : false,

        tooltipRenderer : false,

        /**
         * CSS class added to the header of this column
         * @prp {String} cls
         * @category Rendering
         * @default 'b-sch-time-axis-column'
         */
        cls : 'b-sch-time-axis-column',

        // needs to have width specified, flex-basis messes measurements up
        needWidth : true,

        ariaLabel     : null,
        mode          : null,
        region        : 'normal',
        exportable    : false,
        htmlEncode    : false,
        stickyContent : false,
        id            : 'timeaxiscolumn' // no-sanity
    };

    //region Init

    construct(config, ...args) {
        const me = this;

        config.disableRendererWarning = true;

        super.construct(config, ...args);

        me.thisObj = me;

        // Inject the reference to this column as early as possible
        me.grid._timeAxisColumn = me;

        me.timeAxisViewModel = me.grid.timeAxisViewModel;
        // A bit hacky, because mode is a field and not a config
        // eslint-disable-next-line no-self-assign
        me.mode = me.mode;

        me.grid.ion({
            paint   : 'onTimelinePaint',
            thisObj : me,
            once    : true
        });

        LocaleManager.ion({ locale : me.updateHeaderAriaLabel, thisObj : me });
    }

    static get autoExposeFields() {
        return true;
    }

    // endregion

    updateHeaderAriaLabel() {
        const
            { grid } = this,
            { visibleDateRange } = grid,
            startDateStr = DateHelper.format(visibleDateRange?.startDate, grid.displayDateFormat),
            endDateStr = DateHelper.format(visibleDateRange?.endDate, grid.displayDateFormat);

        return super.updateHeaderAriaLabel(this.L(this.ariaLabel || 'L{TimeAxisColumn.ariaLabel}')(startDateStr, endDateStr));
    }

    doDestroy() {
        this.resourceColumns?.destroy();
        this.timeAxisView?.destroy();
        super.doDestroy();
    }

    set mode(mode) {
        const
            me       = this,
            { grid } = me,
            oldMode  = me.get('mode');

        me.set('mode', mode);

        // In horizontal mode this column has a time axis header on top, with timeline ticks
        if (mode === 'horizontal') {
            // Create HorizontalTimeAxis if not already created
            me.timeAxisView ??= new HorizontalTimeAxis({
                model                     : me.timeAxisViewModel,
                compactCellWidthThreshold : me.compactCellWidthThreshold,
                owner                     : grid,
                client                    : grid
            });

            // Handle runtime mode switch
            if (oldMode === 'vertical' && grid.isPainted) {
                me.resourceColumns?.detachListeners('resourceStore');
                me.resourceColumns?.currentElement?.remove();

                if (me.timeAxisView.element) {
                    // Reattach existing element
                    me.element.appendChild(me.timeAxisView.element);
                }
                else {
                    // First time rendering
                    me.timeAxisView.render(me.element);
                }
            }
        }
        // In vertical mode, it instead displays resources at top
        else if (mode === 'vertical') {
            // Create ResourceHeader if not already created
            if (!me.resourceColumns) {
                grid.getConfig('resourceImages');
                // <remove-on-release>
                // TODO: Most other vertical stuff is handled in VerticalRendering, move there?
                // </remove-on-release>
                me.resourceColumns = ResourceHeader.new({
                    column           : me,
                    scheduler        : grid,
                    resourceStore    : grid.resourceStore,
                    imagePath        : grid.resourceImagePath,
                    imageExtension   : grid.resourceImageExtension,
                    defaultImageName : grid.defaultResourceImageName
                }, grid.resourceColumns);

                me.relayEvents(me.resourceColumns, [
                    'resourceHeaderClick',
                    'resourceHeaderDblClick',
                    'resourceHeaderContextMenu'
                ]);
            }

            // Handle runtime mode switch
            if (oldMode === 'horizontal' && grid.isPainted) {
                const { resourceColumns } = me;

                resourceColumns.updateResourceStore(grid.resourceStore);
                me.timeAxisView?.element?.remove();

                if (resourceColumns.currentElement) {
                    // Reattach existing element
                    me.element.appendChild(resourceColumns.currentElement);
                    resourceColumns.refresh();
                }
                else {
                    // First time rendering
                    resourceColumns.render(me.element);
                }
            }
        }
    }

    get mode() {
        return this.get('mode');
    }

    // <remove-on-release>
    // TODO: define all configs as fields and set below to false...
    // </remove-on-release>

    //region Events

    onViewModelUpdate({ source : viewModel }) {
        const
            me       = this,
            { grid } = me;

        // $skipWheelUpdate is set when changing the time span during smooth zoom, we will return here with it unset
        // afterwards when tickSize is updated
        if (grid.timeAxisSubGrid.collapsed || viewModel.totalSize === 0 || grid.$skipWheelUpdate) {
            return;
        }

        if (me.mode === 'horizontal') {
            // render the time axis view into the column header element
            !grid.hideHeaders && me.refreshHeader(true);

            me.width = viewModel.totalSize;

            // Gantt requires the refresh even when wheel zooming, its flow is different from Scheduler (and cheaper).
            // A gesture reusing the event layout likewise redraws from the layout it already has, see
            // SchedulerZoomable#liveZoom, and a refresh here would throw that layout away
            if (!grid.$wheelZooming && !grid.$reusingEventLayout) {
                grid.refresh();
            }

            // When width is set above, that ends up on a columnsResized listener, but the refreshing of the fake
            // scrollers to accommodate the new width is not done in this timeframe, so the upcoming centering related
            // to preset change cannot work. So we have to refresh the fake scrollers now
            me.subGrid.refreshFakeScroll();
        }
        else if (me.mode === 'vertical') {
            // Refresh to rerender cells, in the process updating the vertical timeaxis to reflect view model changes
            grid.refreshRows();

            // refreshRows triggers the row manager's height estimation which may overwrite the scroll
            // height needed for the time axis. Also, internalOnTimeAxisViewModelUpdate skips
            // updateCanvasSize when _viewPresetChanging is true (during preset transitions in smooth
            // zoom). Calling updateCanvasSize after refreshRows restores the correct scroll range.
            grid.updateCanvasSize();
        }
    }

    // Called on paint. SubGrid has its width so this is the earliest time to configure the TimeAxisViewModel with
    // correct width
    onTimelinePaint({ firstPaint }) {
        const me = this;

        if (!me.subGrid.insertRowsBefore) {
            return;
        }

        if (firstPaint) {
            me.updateHeaderAriaLabel();
            me.subGridElement.classList.add('b-timeline-sub-grid');

            if (me.mode === 'vertical') {
                me.refreshHeader();

                // The above operation can cause height change.
                me.grid.onHeightChange();
            }
        }
    }

    onCellFocus() {
        this.updateHeaderAriaLabel(this.localizeProperty('ariaLabel'));
    }
    //endregion

    //region Rendering

    /**
     * Refreshes the columns header contents (which is either a HorizontalTimeAxis or a ResourceHeader). Useful if you
     * have rendered some extra meta data that depends on external data such as the EventStore or ResourceStore.
     */
    refreshHeader(internal) {
        const
            me          = this,
            { element } = me;

        if (element) {

            if (me.mode === 'horizontal') {
                // Force timeAxisViewModel to regenerate its column config, which calls header renderers etc.
                !internal && me.timeAxisViewModel.update(undefined, undefined, true);

                if (!me.timeAxisView.rendered) {
                    // Do not need the normal header markup
                    element.querySelector('.b-grid-header-text')?.remove();

                    me.timeAxisView.render(element);
                }
                else {
                    // Force rebuild of cells in case external data has changed (cheap since it still syncs to DOM)
                    me.timeAxisView.refresh(true);
                }
            }
            else if (me.mode === 'vertical') {
                if (!me.resourceColumns.currentElement) {
                    // Do not need the normal header markup
                    element.innerHTML = '';
                    me.resourceColumns.render(element);
                }
                else {
                    me.resourceColumns.refresh();
                }

                // Vertical's resourceColumns is redrawn with the events, no need here
            }
        }
    }

    defaultRenderer(renderData) {
        const { grid } = this;

        // TimelineHistogram handles its SVG rendering in its own way
        if (grid.isTimelineHistogramBase) {
            return;
        }

        // No drawing of events before engines initial commit
        if (grid.project.isInitialCommitPerformed || grid.project.isDelayingCalculation || grid.eventStore?.lazyLoad) {
            grid.currentOrientation.renderer(renderData);

            return super.defaultRenderer(renderData);
        }

        return '';
    }

    isCellDirty(record) {
        // TimeAxisColumn is never dirty
        return false;
    }

    //endregion

    get timeAxisViewModel() {
        return this._timeAxisViewModel;
    }

    set timeAxisViewModel(timeAxisViewModel) {
        const me = this;

        me.detachListeners('tavm');

        timeAxisViewModel?.ion({
            name    : 'tavm',
            update  : 'onViewModelUpdate',
            prio    : -10000,
            thisObj : me
        });

        me._timeAxisViewModel = timeAxisViewModel;

        if (me.timeAxisView) {
            me.timeAxisView.model = timeAxisViewModel;
        }
    }

    // Width of the time axis column is solely determined by the zoom level. We should not keep it part of the state
    // otherwise restoring the state might break the normal zooming process.
    // Covered by SchedulerState.t
    // https://github.com/bryntum/bryntum/issues/5545
    getState() {
        const state = super.getState();

        delete state.width;
        delete state.flex;

        return state;
    }
}

ColumnStore.registerColumnType(TimeAxisColumn);
