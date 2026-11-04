import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import TimelineFeature from './TimelineFeature.js';
import Delayable from '../../Core/mixin/Delayable.js';
import AttachToProjectMixin from '../data/mixin/AttachToProjectMixin.js';

DomHelper.loadStylesheet('Scheduler/feature/ColumnLines.css');

// import Stylesheet from './ColumnLines.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColumnLines');

/**
 * @module Scheduler/feature/ColumnLines
 */

const emptyObject = Object.freeze({});

/**
 * Displays column lines for ticks, with a different styling for major ticks (by default they are darker). If this
 * feature is disabled, no lines are shown. If it's enabled, line are shown for the tick level which is set in current
 * ViewPreset. Please see {@link Scheduler.preset.ViewPreset#field-columnLinesFor} config for details.
 *
 * The lines are drawn as divs, with only visible lines available in DOM. The color and style of the lines are
 * determined by the CSS rules for `.b-column-line` and `.b-column-line-major`.
 *
 * For vertical mode, this features also draws vertical resource column lines if scheduler is configured with
 * `columnLines : true` (which is the default, see {@link Grid.view.GridBase#config-columnLines}).
 *
 * This feature is **enabled** by default
 *
 * {@inlineexample Scheduler/feature/ColumnLines.js}
 *
 * ## See also
 *
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 * - {@link Scheduler.feature.NonWorkingTime} - Non-working time highlighting
 *
 * @demo Scheduler/basic
 *
 * @extends Scheduler/feature/TimelineFeature
 * @mixes Core/mixin/Delayable
 * @classtype columnLines
 * @feature
 * @tier community
 */
export default class ColumnLines extends TimelineFeature.mixin(AttachToProjectMixin, Delayable) {
    //region Config

    static $name = 'ColumnLines';

    static tier = 'community';

    static type = 'columnLines';

    // Matches the pre-8.0 registration: on for Scheduler, Gantt and the histograms
    static defaultEnabled = { SchedulerBase : true, GanttBase : true, TimelineHistogram : true };
    static get delayable() {
        return {
            refresh : {
                type              : 'raf',
                cancelOutstanding : true
            }
        };
    }

    static configurable = {
        /**
         * A renderer function, or name of a function in the ownership hierarchy, called for each line, letting you mutate the DOM element
         * through the passed {@link DomConfig} object.
         *
         * ```javascript
         * scheduler = new Scheduler({
         *     width     : 1000,
         *     startDate : '2025-01-03',
         *     endDate   : '2025-01-09',
         *     features  : {
         *         columnLines : {
         *             renderer(date, domConfig) {
         *                 // Make Sunday line red
         *                 if (date.getDay() === 0) {
         *                     domConfig.style.borderColor = 'red';
         *                     domConfig.className.foo = 1;
         *                 }
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * {@note}When adding HTML content that includes data from user-editable records, use
         * {@link Core.helper.StringHelper#function-encodeHtml-static} to avoid XSS.{/@note}
         *
         * @prp {Function}
         * @param {Date} date The line date
         * @param {DomConfig} lineConfig The line DOM config object which you can mutate
         * @accepts {Function|String}
         * @returns {void}
         */
        renderer : null
    };

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['render', 'updateCanvasSize', 'internalOnVisibleDateRangeChange', 'onVisibleResourceRangeChange', 'onVisibleResourceColumnChange', 'internalOnModeChange']
        };
    }

    //endregion

    //region Init & destroy

    attachToResourceStore(resourceStore) {
        const { client } = this;

        super.attachToResourceStore(resourceStore);

        // Set up vertical-mode-specific listener
        this.setupVerticalResourceStoreListener();
    }

    /**
     * Sets up resourceStore group listener for vertical mode.
     * @private
     */
    setupVerticalResourceStoreListener() {
        const { client } = this;

        // Detach any existing listener first
        this.detachListeners('verticalResourceStore');

        if (client.isVertical) {
            client.resourceStore.ion({
                name : 'verticalResourceStore',
                group({ groupers }) {
                    if (groupers.length === 0) {
                        this.refresh();
                    }
                },
                thisObj : this
            });
        }
    }

    internalOnModeChange() {
        this.setupVerticalResourceStoreListener();
        this.refresh();
    }

    doDisable(disable) {
        super.doDisable(disable);

        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    updateRenderer() {
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    //endregion

    //region Draw

    /**
     * Draw lines when scheduler/gantt is rendered.
     * @private
     */
    render() {
        this.refresh();
    }

    getColumnLinesDOMConfig(startDate, endDate, firstResource, lastResource) {
        const
            me               = this,
            { client }       = me,
            {
                timeAxisViewModel,
                isHorizontal,
                resourceStore,
                variableColumnWidths
            }                = client,
            { columnConfig } = timeAxisViewModel;

        const
            linesForLevel      = timeAxisViewModel.columnLinesFor,
            majorLinesForLevel = Math.max(linesForLevel - 1, 0),
            start              = startDate.getTime(),
            end                = endDate.getTime(),
            domConfigs         = [],
            dates              = new Set(),
            dimension          = isHorizontal ? 'insetInlineStart' : 'top';

        if (!me.disabled) {
            const addLineConfig = (tick, isMajor) => {
                const tickStart = tick.start.getTime();
                // Only start of tick matters.
                // Each tick has an exact calculated start position along the time axis
                // and carries a border on its left, so column lines follow from
                // tick 1 (zero-based) onwards.
                if (tickStart > start && tickStart < end && !dates.has(tickStart)) {
                    const domConfig = {
                        role      : 'presentation',
                        className : {
                            'b-column-line-major' : isMajor,
                            'b-column-line'       : !isMajor
                        },
                        style : {
                            [dimension] : tick.coord
                        },
                        dataset : {
                            line : isMajor ? `major-${tick.index}` : `line-${tick.index}`
                        }
                    };
                    dates.add(tickStart);
                    domConfigs.push(domConfig);

                    if (me.renderer) {
                        me.callback(me.renderer, me, [tick.start, domConfig]);
                    }
                }
            };

            // Collect configs for major lines. The header level can be momentarily absent from
            // columnConfig while it is regenerated for a new orientation (mode switch)
            if (linesForLevel !== majorLinesForLevel && columnConfig[majorLinesForLevel]) {
                for (let i = 1; i <= columnConfig[majorLinesForLevel].length - 1; i++) {
                    addLineConfig(columnConfig[majorLinesForLevel][i], true);
                }
            }

            // And normal lines, skipping dates already occupied by major lines
            if (columnConfig[linesForLevel]) {
                for (let i = 1; i <= columnConfig[linesForLevel].length - 1; i++) {
                    addLineConfig(columnConfig[linesForLevel][i], false);
                }
            }

            // Add vertical resource column lines, if grid is configured to show column lines
            if (!isHorizontal && client.columnLines) {
                const { columnWidth } = client.resourceColumns;

                if (!firstResource && !lastResource) {
                    ({
                        first : firstResource,
                        last  : lastResource
                    } = client.currentOrientation.getResourceRange(true));
                }

                if (firstResource > -1) {
                    // The resource range is indices into allResourceRecords, which holds no group headers but does
                    // hold resources in collapsed groups (vertical mode ignores collapsed state)
                    const { allResourceRecords } = resourceStore;

                    for (let i = firstResource; i <= lastResource && i < allResourceRecords.length; i++) {
                        const
                            resourceRecord = allResourceRecords[i],
                            instanceMeta   = resourceRecord.instanceMeta(client),
                            left           = variableColumnWidths ? instanceMeta.insetStart + client.getResourceWidth(resourceRecord) - 1 : (i + 1) * columnWidth - 1,
                            groupParent    = resourceRecord.instanceMeta(resourceStore).groupParent,
                            isLastResource = i === lastResource;

                        domConfigs.push({
                            className : {
                                'b-column-line'            : 1,
                                'b-resource-column-line'   : 1,
                                // Skipping the group divider on last resource
                                'b-resource-group-divider' : !isLastResource && resourceStore.isGrouped && groupParent?.groupChildren[groupParent?.groupChildren.length - 1] === resourceRecord
                            },
                            style : {
                                insetInlineStart : left
                            },
                            dataset : {
                                line : `resource-${i}`
                            }
                        });
                    }
                }
            }
        }

        return domConfigs;
    }

    /**
     * Draw column lines that are in view
     * @private
     */
    refresh() {
        const
            me                     = this,
            { client }             = me,
            { timeAxis }           = client,
            { startDate, endDate } = client.visibleDateRange || emptyObject,
            axisStart              = timeAxis.startDate;

        // Early bailout for timeaxis without start date or when starting with schedule collapsed
        if (!axisStart || !startDate || me.client.timeAxisSubGrid.collapsed) {
            return;
        }

        if (!me.element) {
            me.element = DomHelper.createElement({
                parent    : client.timeAxisSubGridElement,
                className : 'b-column-lines-canvas b-sch-canvas'
            });

            client.timeAxisSubGrid.addCanvas(me.element);
        }

        const domConfigs = me.getColumnLinesDOMConfig(startDate, endDate);

        DomSync.sync({
            targetElement : me.element,
            domConfig     : {
                onlyChildren : true,
                children     : domConfigs,
                syncOptions  : {
                    // When zooming in and out we risk getting a lot of released lines if we do not limit it
                    releaseThreshold : 4
                }
            },
            syncIdField : 'line'
        });
    }

    //endregion

    //region Events

    // Called when visible date range changes, for example from zooming, scrolling, resizing
    internalOnVisibleDateRangeChange() {
        // Refresh immediately, otherwise column lines does not line up with events and header for a frame, which
        // is noticeable
        this.refresh.now();
    }

    // Called when visible resource range changes, for example on scroll and resize
    onVisibleResourceRangeChange({ firstResource, lastResource }) {
        this.refresh();
    }

    onVisibleResourceColumnChange(width, oldWidth) {
        this.refresh();
    }

    updateCanvasSize() {
        this.refresh();
    }

    //endregion
}

ColumnLines.initClass();
