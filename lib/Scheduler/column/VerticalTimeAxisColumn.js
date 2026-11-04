import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import VerticalTimeAxis from '../view/VerticalTimeAxis.js';
import LocaleManager from '../../Core/localization/LocaleManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/column/VerticalTimeAxisColumn
 */

/**
 * A special column containing the time axis labels when the Scheduler is used in vertical mode. You can configure,
 * it using the {@link Scheduler.view.Scheduler#config-verticalTimeAxisColumn} config object.
 *
 * **Note**: this column is sized by flexing to consume full width of its containing {@link Grid.view.SubGrid}. To
 * change width of this column, instead size the subgrid like so:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     mode           : 'vertical',
 *     subGridConfigs : {
 *         locked : {
 *             width : 300
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 * - {@link Scheduler.column.TimeAxisColumn} - Horizontal time axis column
 *
 * @extends Grid/column/Column
 * @tier community
 */
export default class VerticalTimeAxisColumn extends Column {

    static $name = 'VerticalTimeAxisColumn';

    static type = 'verticalTimeAxis';

    static get defaults() {
        return {
            /**
             * @hideconfigs autoWidth, autoHeight, draggable, groupable, hideable, showColumnPicker,
             * sortable, searchable, editor, enableCellContextMenu, tooltipRenderer
             */

            draggable             : false,
            groupable             : false,
            hideable              : false,
            showColumnPicker      : false,
            filterable            : false,
            sortable              : false,
            searchable            : false,
            editor                : false,
            enableCellContextMenu : false,
            tooltipRenderer       : false,

            /**
             * Column minimal width. If value is Number then minimal width is in pixels
             * @prp {Number|String} minWidth
             * @default 0
             * @category Layout
             */
            minWidth : 0,

            resizable : false,

            cellCls : 'b-vertical-time-axis-column',
            locked  : true,

            width : 100,

            alwaysClearCell : false,
            ariaLabel       : null
        };
    }

    updateHeaderAriaLabel() {
        const
            { grid } = this,
            { visibleDateRange } = grid,
            startDateStr = DateHelper.format(visibleDateRange?.startDate, grid.displayDateFormat),
            endDateStr = DateHelper.format(visibleDateRange?.endDate, grid.displayDateFormat);

        return super.updateHeaderAriaLabel(this.L(this.ariaLabel || 'L{TimeAxisColumn.ariaLabel}')(startDateStr, endDateStr));
    }

    get isFocusable() {
        return true;
    }

    construct(data, ...args) {
        const me = this;

        super.construct(data, ...args);

        me.view = new VerticalTimeAxis({
            model  : me.grid.timeAxisViewModel,
            client : me.grid
        });

        me.grid.ion({
            paint   : 'onTimelinePaint',
            thisObj : me,
            once    : true
        });

        LocaleManager.ion({ locale : me.updateHeaderAriaLabel, thisObj : me });
    }

    defaultRenderer({ cellElement }) {
        // The row height is resolved from the time axis size in SchedulerBase#internalGetRowHeight
        this.view.render(cellElement);
    }

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // It extracts the current configs (fields) for the column, removing irrelevant ones
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        // Remove irrelevant configs
        delete result.id;
        delete result.region;
        delete result.type;
        delete result.field;
        delete result.ariaLabel;
        delete result.cellAriaLabel;

        return result;
    }

    onTimelinePaint({ firstPaint }) {
        if (firstPaint) {
            this.updateHeaderAriaLabel();
        }
    }

}

ColumnStore.registerColumnType(VerticalTimeAxisColumn);
