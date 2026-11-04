import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Widget from '../../Core/widget/Widget.js';

DomHelper.loadStylesheet('Grid/column/WidgetColumn.css');

// import Stylesheet from './WidgetColumn.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'WidgetColumn');

/**
 * @module Grid/column/WidgetColumn
 */

/**
 * A {@link Core.widget.Widget} config object used by a {@link Grid.column.WidgetColumn}, extended with the
 * `valueProperty` config which names the widget property the cell value is applied to.
 *
 * @typedef {ContainerItemConfig} WidgetColumnWidget
 * @property {String} [valueProperty] The name of the widget property which receives the cell value. When not
 * specified, the widget's own `value` property is used if it has one, falling back to its
 * {@link Core.widget.Widget#config-defaultBindProperty}.
 */

const
    onWidgetChange = ({ source, value, userAction, type }) => {
        if (type === 'input' || userAction) {
            source.cellInfo.record.setValue(source.name, value);
        }
    };

/**
 * A column that displays one or more {@link Core.widget.Widget widgets} in the grid cells.
 *
 * When rendered into a cell, all widgets will have a special {@link Core.widget.Widget#property-cellInfo} context
 * property injected into them so that event handlers can ascertain the context in which they are operating.
 *
 * {@inlineexample Grid/column/WidgetColumn.js}
 *
 * ```javascript
 * new Grid({
 *     columns : [{
 *         type    : 'widget',
 *         widgets : [{
 *             type     : 'button',
 *             menuIcon : false,
 *             icon     : 'fa fa-ellipsis-v',
 *             menu     : {
 *                 type  : 'menu',
 *                 items : {
 *                     viewResponses : {
 *                         icon : 'fa fa-fw fa-file-signature',
 *                         text : 'View Responses'
 *                     },
 *                     clearConsent : {
 *                         icon : 'fa fa-fw fa-times-circle',
 *                         text : 'Clear Consent',
 *                     },
 *                     surveyList : {
 *                         icon : 'fa fa-fw fa-file-signature',
 *                         text : 'Survey List (Read-Only)'
 *                     }
 *                 },
 *
 *                 // Method is called for all descendant levels.
 *                 // 'up.' will find it defined on the Grid.
 *                 onItem : 'up.onWidgetColumnMenuClick'
 *             }
 *         }
 *     }],
 *
 *     onWidgetColumnMenuClick({ source }) {
 *         // Find the source widget's Button ancestor. It's the cell widget.
 *         // A WidgetColumn's cell widget gets a cellInfo property injected
 *         const { cellInfo } = source.up('button');
 *
 *         console.log(`Clicked ${source.ref} on ${cellInfo.record.name}`);
 *     }
 * });
 * ```
 *
 * ## Data binding to fields
 * If you use {@link Core.widget.Field Fields} inside this column, the field widget can optionally bind its `value` to a
 * field in the data model using the {@link Core/widget/Field#config-name} (shown in the snippet below). This will
 * provide two-way data binding and update the underlying row record as you make changes in the field.
 *
 * ```javascript
 * new Grid({
 *     columns : [{
 *         type    : 'widget',
 *         widgets : [{
 *             type : 'numberfield',
 *             name : 'percentDone'
 *         }]
 *     }]
 * });
 * ```
 *
 * If you use a {@link Core.widget.Button} and want it to display the value from the cell as its text, set its
 * {@link Core/widget/Widget#config-defaultBindProperty} to `'text'`:
 *
 * ```javascript
 * new Grid({
 *     columns : [{
 *         type    : 'widget',
 *         widgets : [{
 *             type                : 'button',
 *             name                : 'age',
 *             defaultBindProperty : 'text'
 *         }]
 *     }]
 * });
 * ```
 *
 * There is no `editor` provided. It is the configured widget's responsibility to provide editing if needed.
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-widgets}                       | Array of widget configs to render in each cell       |
 *
 * ## See also
 *
 * - {@link Grid.column.CheckColumn} - Specialized checkbox widget column
 * - {@link Grid.column.Column} - Base column class
 * - {@link Core.widget.Widget#property-cellInfo} - Context injected into cell widgets
 *
 * @extends Grid/column/Column
 * @classtype widget
 * @column
 * @tier community
 */
export default class WidgetColumn extends Column {

    //region Config

    static $name = 'WidgetColumn';

    static type = 'widget';

    static fields = [
        /**
         * @hideconfigs renderer
         */

        /**
         * An array of {@link Core.widget.Widget} config objects
         * @prp {WidgetColumnWidget[]} widgets
         * @category Common
         */
        'widgets',

        'disableRendererWarning',

        { name : 'cacheWidgets', defaultValue : true }
    ];

    /**
     * A renderer function, which gives you access to render data like the current `record`, `cellElement` and the
     * {@link #config-widgets} of the column. See {@link #config-renderer}
     * for more information.
     *
     * ```javascript
     * new Grid({
     *     columns : [
     *         {
     *              type: 'check',
     *              field: 'allow',
     *              // In the column afterRenderCell callback, we get access to the record and column widgets
     *              afterRenderCell({ record, widgets }) {
     *                  // Hide checkboxes in certain rows
     *                  widgets[0].hidden = record.readOnly;
     *              }
     *         }
     *     ]
     * });
     * ```
     *
     * @prp {Function} afterRenderCell
     * @param {Object} renderData Object containing renderer parameters
     * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
     * @param {*} renderData.value Value to be displayed in the cell
     * @param {Core.data.Model} renderData.record Record for the row
     * @param {Grid.column.Column} renderData.column This column
     * @param {Core.widget.Widget[]} [renderData.widgets] An array of the widgets rendered into this cell
     * @param {Grid.view.Grid} renderData.grid This grid
     * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export.
     *   Use the {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
     * @param {Object} renderData.size Set `size.height` to specify the desired row height for the current row.
     *   Largest specified height is used, falling back to configured {@link Grid/view/Grid#config-rowHeight}
     *   in case none is specified. Can be null in case of export
     * @param {Number} renderData.size.height Set this to request a certain row height
     * @param {Number} renderData.size.configuredHeight Row height that will be used if none is requested
     * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format, enabling special handling during export.
     * @param {Boolean} [renderData.isTreeGroup] True if record is a generated tree group parent record
     * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
     *   In which case an advanced renderer might need to take different actions.
     * @returns {void}
     *
     * @category Rendering
     */

    static get defaults() {
        return {
            filterable      : false,
            sortable        : false,
            editor          : false,
            searchable      : false,
            fitMode         : false,
            alwaysClearCell : false,
            ariaLabel       : 'L{WidgetColumn.rowWidgets}'
        };
    }

    //endregion

    //region Init / Destroy

    construct(config, ...args) {
        super.construct(config, ...args);

        const
            me = this,
            { grid } = me;

        // Tests create gridless ColumnStores
        if (grid) {
            // Widgets created for a grid are cached on the grid.
            // Widgets are cached using the owning column id and the widget type as the key.
            // Widgets cannot be shared between columns because of various callbacks
            // and listeners being configured in by each column's widget definition.
            if (grid.widgetColumnCache) {
                me.widgetColumnCache = grid.widgetColumnCache;
            }
            else {
                me.widgetColumnCache = (grid.widgetColumnCache = new Map());

                // When Rows are freed up, release any widgets used back to the free pool for reuse by the internalRenderer
                grid.ion({
                    removeRows : 'onRemoveGridRows',
                    thisObj    : this
                });
            }
        }
    }

    onRemoveGridRows({ rows }) {
        // Free up widgets used by a row which is being recycled.
        rows.forEach(({ columnWidgets }) => {
            if (columnWidgets) {
                // Free all widgets attached to this row in one pass.
                this.freeWidgets([...columnWidgets.values()].flat());

                // clear every column's cell widgets
                columnWidgets.clear();
            }
        });
    }

    get widgets() {
        return this.get('widgets');
    }

    set widgets(widgets) {
        if (this.grid) {
            this.freeColumnWidgets();
            this.destroyWidgets();
        }

        this.set('widgets', widgets);
    }

    freeWidgets(widgets) {
        widgets?.forEach(widget => {
            if (this.cacheWidgets) {
                const
                    { widgetColumnCache } = this,
                    { column }            = widget.cellInfo,
                    key                   = `${column.id}-${widget.widgetColumnIndex}`;

                column.onAfterWidgetDerendered?.(widget);
                widget.cellInfo = widget.__boundRecordId = widget.owner = null;
                widget.element.remove();
                (widgetColumnCache.get(key) || widgetColumnCache.set(key, []).get(key)).push(widget);
            }
            else {
                widget.destroy();
            }
        });
        widgets.length = 0;
    }

    freeColumnWidgets() {
        const { id } = this;

        // For each row, free the widgets cached for this column
        this.grid.rowManager.forEach((row) => {
            const widgets = row.columnWidgets?.get(id);

            if (widgets?.length) {
                this.freeWidgets(widgets);
            }
        });
    }

    hide(...args) {
        this.freeColumnWidgets();
        super.hide(...args);
    }

    getWidget(widgetConfig, renderData) {
        const
            me = this,
            {
                grid,
                widgetColumnCache
            }        = me,
            key      = `${renderData.column.id}-${widgetConfig.widgetColumnIndex}`,
            widgets  = widgetColumnCache.get(key) || widgetColumnCache.set(key, []).get(key);

        let result, { length } = widgets;

        // A free widget of the right type was found in the cache
        if (length) {
            result = widgets[--length];
            delete result.onBeforeDestroy;

            widgets.length = length;
            widgetConfig.owner = grid;
            Widget.reconfigure(result, widgetConfig);
        }
        // We have to create one
        else {
            me.onBeforeWidgetCreate(widgetConfig, renderData);
            widgetConfig.recomposeAsync = false;
            widgetConfig.owner = grid;
            widgetConfig.rtl = Boolean(grid.rtl);
            result = Widget.create(widgetConfig);

            me.onAfterWidgetCreate(result, renderData);
            if (result.name) {
                result.ion({ change : onWidgetChange });

                if (me.instantUpdate) {
                    result.ion({ input : onWidgetChange });
                }
            }
        }

        me.onBeforeWidgetRender?.(result);

        return result;
    }

    doDestroy() {
        // Destroy all the grid's cached WidgetColumn widgets when it is destroyed
        if (this.grid.isDestroying) {
            this.destroyWidgets();
        }
        // Just free this column's widgets back to the Grid's free cache
        else {
            this.freeColumnWidgets();
        }
        super.doDestroy();
    }

    destroyWidgets() {
        [...this.widgetColumnCache.values()].flat().forEach(widget => widget.destroy());
        this.widgetColumnCache.clear();
    }

    // Called by grid when its read-only state is toggled
    updateReadOnly(readOnly) {
        const me = this;

        if (me.readOnly) {
            return;
        }

        // An afterRenderCell callback may have applied its own readOnly to the widgets (#13299). Writing
        // widget.readOnly directly would clobber that, so re-render the cells to let the callback re-apply it.
        if (me.afterRenderCell) {
            me.grid.refreshColumn(me, false);
        }
        else {
            me.grid.rowManager.forEach(row => {
                row.columnWidgets?.get(me.id)?.forEach(widget => {
                    if (!widget.cellInfo.record.readOnly) {
                        widget.readOnly = readOnly;
                    }
                });
            });
        }
    }

    //endregion

    //region Render

    /**
     * Renderer that displays a widget in the cell.
     * @param {Object} renderData Render data
     * @param {Grid.column.Column} renderData.column Rendered column
     * @param {Core.data.Model} renderData.record Rendered record
     * @private
     */
    defaultRenderer(renderData) {
        const
            me          = this,
            { grid }    = me,
            {
                cellElement,
                column,
                record,
                row,
                isExport
            }           = renderData,
            { widgets } = column;

        // This renderer might be called from subclasses by accident
        // This condition saves us from investigating bug reports
        if (!isExport && widgets) {
            // Do we already have widgets on this row?
            const
                columnWidgets = row.columnWidgets || (row.columnWidgets = new Map()),
                cellWidgets   = columnWidgets.get(me.id);

            // Clean reused cell content, for example when a cell is reused as part of group header
            [...cellElement.childNodes].forEach(e => {
                if (!e.classList?.contains('b-widget')) {
                    e.remove();
                }
            });

            renderData.widgets = column.widgets.map((widgetCfg, i) => {
                // Clone to avoid mutating the original config (which corrupts sub-configs like picker on re-render)
                widgetCfg = {
                    ...widgetCfg,

                    // Its position in the widgets array is part of its identity.
                    widgetColumnIndex : i
                };

                // Use the widgets that are cached on the Row for this column if any.
                const widget = cellWidgets?.[i] || me.getWidget(widgetCfg, renderData);

                // The widget in-place in its cell needs to know its context
                widget.cellInfo = renderData;

                if (!widget.element.isConnected) {
                    // Only go through the render lifecycle stage once
                    if (widget.rendered) {
                        cellElement.appendChild(widget.element);
                    }
                    else {
                        widget.render(cellElement);
                    }
                }

                if (!me.meta.isSelectionColumn) {
                    widget.readOnly = grid.readOnly || record.readOnly || me.readOnly;
                }

                if (me.onBeforeWidgetSetValue?.(widget, renderData) !== false) {
                    const valueProperty = widgetCfg.valueProperty || ('value' in widget && 'value') || widget.defaultBindProperty;

                    if (valueProperty && ((!column.noFieldSpecified && column.widgets.length === 1) || widget.name)) {
                        const value = widget.name ? record.getValue(widget.name) : renderData.value;
                        // If the value is an object, and the widget was last used by another record,
                        // then the *properties* may have changed, so force the updater to run by
                        // setting the property's value to a value to which nothing can be equal.
                        if (typeof value == 'object' && widget.__boundRecordId !== record.id) {
                            widget[`_${valueProperty}`] = NaN;
                        }
                        // The widget getting what is really its "own" value should not
                        // run the event machinery, which could in theory lead back here.
                        widget.suspendEvents();
                        widget[valueProperty] = value;
                        widget.resumeEvents();
                        widget.__boundRecordId = record.id;
                    }
                }

                me.onAfterWidgetSetValue?.(widget, renderData);

                return widget;
            });

            // This column on the row owns these widgets
            columnWidgets.set(me.id, renderData.widgets);
        }

        if (!widgets) {
            return '';
        }
    }

    //endregion

    //region Other

    /**
     * Called before widget is created on rendering
     * @param {ContainerItemConfig} widgetCfg Widget config
     * @param {Object} renderData Render data
     * @private
     */
    onBeforeWidgetCreate(widgetCfg, renderData) {}

    /**
     * Called after widget is created on rendering
     * @param {Core.widget.Widget} widget Created widget
     * @param {Object} renderData Render data
     * @private
     */
    onAfterWidgetCreate(widget, renderData) {}

    /**
     * Called before the widget gets its value on rendering. Pass `false` to skip value setting while rendering
     * @preventable
     * @function onBeforeWidgetSetValue
     * @param {Core.widget.Widget} widget Created widget
     * @param {Object} renderData Render data
     * @param {Grid.column.Column} renderData.column Rendered column
     * @param {Core.data.Model} renderData.record Rendered record
     */

    /**
     * Called after the widget gets its value on rendering.
     * @function onAfterWidgetSetValue
     * @param {Core.widget.Widget} widget Created widget
     * @param {Object} renderData Render data
     * @param {Grid.column.Column} renderData.column Rendered column
     * @param {Core.data.Model} renderData.record Rendered record
     */

    // Null implementation because there is no way of ascertaining whether the widgets get their width from
    // the column, or the column shrinkwraps the Widget.
    // Remember that the widget could have a width from a CSS rule which we cannot read.
    // It might have width: 100%, or a flex which would mean it is sized by us, but we cannot read that -
    // getComputedStyle would return the numeric width.
    resizeToFitContent() {}

    //endregion
}

ColumnStore.registerColumnType(WidgetColumn);
WidgetColumn.exposeProperties();
