import Widget from '../../Core/widget/Widget.js';
import DomSync from '../../Core/helper/DomSync.js';

/**
 * @module Scheduler/view/TimeAxisBase
 */

function isLastLevel(level, levels) {
    return level === levels.length - 1;
}

function isLastCell(level, cell) {
    return cell === level.cells[level.cells.length - 1];
}

/**
 * Base class for HorizontalTimeAxis and VerticalTimeAxis. Contains shared functionality to only render ticks in view,
 * should not be used directly.
 *
 * @extends Core/widget/Widget
 * @private
 * @abstract
 */
export default class TimeAxisBase extends Widget {

    static $name = 'TimeAxisBase';

    //region Config

    static configurable = {
        /**
         * The minimum width for a bottom row header cell to be considered 'compact', which adds a special CSS class
         * to the row (for special styling). Copied from Scheduler/Gantt.
         * @config {Number}
         * @default
         */
        compactCellWidthThreshold : 15,

        // TimeAxisViewModel
        model : null,

        cls : null,

        /**
         * Style property to use as cell size. Either width or height depending on orientation
         * @config {'width'|'height'}
         * @private
         */
        sizeProperty : null,

        /**
         * Style property to use as cells position. Either left or top depending on orientation
         * @config {'left'|'top'}
         * @private
         */
        positionProperty : null,

        defaultCls : {
            'b-bryntum' : 0 // Defining color on the full Grid is enough
        }
    };

    startDate = null;
    endDate   = null;
    levels    = [];
    size      = null;

    // Set visible date range
    set range({ startDate, endDate, skipRefresh = false }) {
        const me = this;

        // Only process a change
        if (me.startDate - startDate || me.endDate - endDate) {
            const { client } = me;
            me.startDate = startDate;
            me.endDate = endDate;

            // Avoid refreshing if time axis view is not visible
            if ((me.sizeProperty === 'width' && client?.hideHeaders) ||
                (me.sizeProperty === 'height' && client?.verticalTimeAxisColumn?.hidden)) {

                return;
            }

            !skipRefresh && me.refresh();
        }
    }

    //endregion

    //region Html & rendering

    // Generates element configs for all levels defined by the current ViewPreset
    buildCells(start = this.startDate, end = this.endDate) {
        const
            me                   = this,
            { sizeProperty }     = me,
            {
                stickyHeaders,
                isVertical,
                timeAxis
            }                    = me.client || {},
            featureHeaderConfigs = [],
            { length }           = me.levels;

        const cellConfigs = me.levels.map((level, i) => {
            const
                stickyHeader = stickyHeaders && (isVertical || i < length - 1),
                isLowest     = isLastLevel(i, me.levels);

            return {
                className : {
                    'b-sch-header-row'                     : 1,
                    [`b-sch-header-row-${level.position}`] : 1,
                    'b-sch-header-row-main'                : i === me.model.viewPreset.mainHeaderLevel,
                    'b-lowest'                             : isLowest,
                    'b-sticky-header'                      : stickyHeader
                },
                syncOptions : {
                    // Keep a maximum of 5 released cells. Might be fine with fewer since ticks are fixed width.
                    // Prevents an unnecessary amount of cells from sticking around when switching from narrow to
                    // wide tickSizes
                    releaseThreshold : 5,
                    syncIdField      : 'tickIndex'
                },
                dataset : {
                    headerFeature  : `headerRow${i}`,
                    headerPosition : level.position
                },
                // Only include cells in view
                children : level.cells?.filter(cell => cell.start < end && cell.end > start).map((cell, j) => {
                    const
                        // Only the lowest level maps 1:1 to ticks, so that is where a tick's own `cls` applies.
                        // `cls` is a documented TimeSpan field and Tick extends TimeSpan, so honouring it here
                        // just closes a gap; the header must be refreshed by whoever writes it.
                        tick      = isLowest && timeAxis?.records[cell.index],
                        className = {
                            'b-sch-header-time-axis-cell' : 1,
                            [cell.headerCellCls]          : cell.headerCellCls,
                            [`b-align-${cell.align}`]     : cell.align,
                            'b-last'                      : isLastCell(level, cell),
                            // `tick.cls` is a lazily built DomClassList, so it is only touched for ticks that
                            // actually carry classes. Its keys are merged one class per key.
                            ...(tick && tick.data.cls ? tick.cls : null)
                        };

                    return {
                        role    : 'presentation',
                        className,
                        dataset : {
                            tickIndex : cell.index,
                            // Used in export tests to resolve dates from tick elements
                            ...globalThis.DEBUG && { date : cell.start.getTime() }
                        },
                        style : {
                            // DomHelper appends px to numeric dimensions
                            [me.positionProperty]   : cell.coord,
                            [sizeProperty]          : cell.width,
                            [`min-${sizeProperty}`] : cell.width
                        },
                        children : [
                            {
                                tag       : 'span',
                                role      : 'presentation',
                                className : {
                                    'b-sch-header-text' : 1,
                                    'b-sticky-header'   : stickyHeader
                                },
                                html : cell.value
                            }
                        ]
                    };
                })
            };
        });

        // When tested in isolation there is no client
        me.client?.getHeaderDomConfigs(featureHeaderConfigs);

        cellConfigs.push(...featureHeaderConfigs);

        // noinspection JSSuspiciousNameCombination
        return {
            onlyChildren : true,
            syncOptions  : {
                // Do not keep entire levels no longer used, for example after switching view preset
                releaseThreshold : 0
            },
            children : cellConfigs
        };
    }

    render(targetElement) {
        super.render(targetElement);

        this.refresh(true);
    }

    /**
     * Refresh the UI
     * @param {Boolean} [rebuild] Specify `true` to force a rebuild of the underlying header level definitions
     */
    refresh(rebuild = !this.levels.length) {
        const
            me               = this,
            { columnConfig } = me.model,
            { levels }       = me,
            oldLevelsCount   = levels.length;

        if (rebuild) {
            levels.length = 0;

            columnConfig.forEach((cells, position) => levels[position] = {
                position,
                cells
            });

            me.size = levels[0].cells.reduce((sum, cell) => sum + cell.width, 0);

            const { parentElement } = me.element;

            // Don't mutate a classList unless necessary. Browsers invalidate the style.
            if (parentElement && (levels.length !== oldLevelsCount || rebuild)) {
                parentElement.classList.remove(`b-sch-time-axis-column-levels-${oldLevelsCount}`);
                parentElement.classList.add(`b-sch-time-axis-column-levels-${levels.length}`);
                parentElement.style.setProperty('--bi-header-levels', levels.length);
            }
        }

        // Fall back to full time axis extent if startDate/endDate not yet set
        // (e.g., during initial render with workingTime enabled in vertical mode)
        const
            startDate = me.startDate ?? me.model?.timeAxis?.startDate,
            endDate   = me.endDate ?? me.model?.timeAxis?.endDate;

        if (!startDate || !endDate) {
            return;
        }

        // Boil down levels to only show what is in view
        DomSync.sync({
            domConfig     : me.buildCells(startDate, endDate),
            targetElement : me.element,
            syncIdField   : 'headerFeature'
        });

        me.trigger('refresh');
    }

    //endregion

    // Our widget class doesn't include "base".
    get widgetClass() {
        return 'b-time-axis';
    }
}
