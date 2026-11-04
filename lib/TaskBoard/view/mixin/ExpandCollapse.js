import Base from '../../../Core/Base.js';
import AsyncHelper from '../../../Core/helper/AsyncHelper.js';
import DomSync from '../../../Core/helper/DomSync.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';

/**
 * @module TaskBoard/view/mixin/ExpandCollapse
 */

// Measures the height a collapsed swimlane will have once expanded. Inline !important beats the !important zero
// height its collapsed cls gives the body, and auto <-> 0 is not interpolable so nothing transitions
const measureExpandedHeight = (swimlaneElement, swimlaneBody) => {
    const
        { style }  = swimlaneBody,
        { height } = style;

    style.setProperty('height', 'auto', 'important');

    const expandedHeight = swimlaneElement.getBoundingClientRect().height;

    style.height = height;

    return expandedHeight;
};

/**
 * Mixin that handles expanding and collapsing swimlanes and columns on the TaskBoard.
 *
 * {@inlineexample TaskBoard/view/mixin/ExpandCollapse.js}
 *
 * Users can expand and collapse using the UI. To do it programmatically, see:
 *
 * * {@link #function-collapse collapse()}
 * * {@link #function-expand expand()}
 * * {@link #function-toggleCollapse toggleCollapse()}
 *
 * Each of them accepts a column or a swimlane to expand/collapse. For example
 *
 * ```javascript
 * taskBoard.collapse(taskBoard.columns.todo);
 * taskBoard.expand(taskBoard.swimlanes.high);
 * ```
 *
 * For convenience, the functions are also callable directly on columns/swimlanes:
 *
 * ```javascript
 * taskBoard.columns.todo.expand();
 * taskBoard.swimlanes.high.collapse();
 * ```
 *
 * Expanding/collapsing is by default transitioned, `await` the calls to be certain that the UI is up to date:
 *
 * ```javascript
 * await taskBoard.collapse(taskBoard.columns.todo);
 * await taskBoard.columns.todo.expand();
 * ```
 *
 * @mixin
 */
export default Target => class ExpandCollapse extends (Target || Base) {

    //region Config

    static $name = 'ExpandCollapse';

    static configurable = {
        /**
         * Show an icon to expand/collapse columns and swimlanes in their headers.
         *
         * Programmatic expand/collapse works independently of this setting, it only affects the UI.
         *
         * @config {Boolean}
         * @default
         * @category Common
         */
        showCollapseInHeader : true,

        /**
         * Specify `true` to hide the column title instead of rotating it on collapse.
         *
         * Used by default with swimlanes, since the title will overlap the swimlane header otherwise.
         *
         * @config {Boolean}
         * @default
         * @category Misc
         */
        collapseTitle : false,

        /**
         * By default, a tooltip showing `Expand XX`/`Collapse XX` is shown when hovering the expand/collapse icon for
         * a column or swimlane. To disable the tooltip, set this to `false`.
         * @prp {Boolean}
         * @default
         * @category Misc
         */
        showCollapseTooltip : true
    };

    get widgetClass() {}

    //endregion

    //region Type assertions

    changeShowCollapseInHeader(showCollapseInHeader) {
        ObjectHelper.assertBoolean(showCollapseInHeader, 'showCollapseInHeader');

        return showCollapseInHeader;
    }

    //endregion

    //region Events
    /**
     * Triggered when a column is expanded.
     *
     * @event columnExpand
     * @param {TaskBoard.view.TaskBoard} source This TaskBoard
     * @param {TaskBoard.model.ColumnModel} columnRecord Column record
     */
    /**
     * Triggered when a column is collapsed.
     *
     * @event columnCollapse
     * @param {TaskBoard.view.TaskBoard} source This TaskBoard
     * @param {TaskBoard.model.ColumnModel} columnRecord Column record
     */
    /**
     * Triggered when the column collapsed state is toggled.
     *
     * @event columnToggle
     * @param {TaskBoard.view.TaskBoard} source This TaskBoard
     * @param {TaskBoard.model.ColumnModel} columnRecord Column record
     * @param {Boolean} collapse `true` if the column is being collapsed.
     */
    /**
     * Triggered when a swimlane is expanded.
     *
     * @event swimlaneExpand
     * @param {TaskBoard.view.TaskBoard} source This TaskBoard
     * @param {TaskBoard.model.SwimlaneModel} swimlaneRecord Swimlane record
     */
    /**
     * Triggered when a swimlane is collapsed.
     *
     * @event swimlaneCollapse
     * @param {TaskBoard.view.TaskBoard} source This TaskBoard
     * @param {TaskBoard.model.SwimlaneModel} swimlaneRecord Swimlane record
     */
    /**
     * Triggered when the swimlane collapsed state is toggled.
     *
     * @event swimlaneToggle
     * @param {TaskBoard.view.TaskBoard} source This TaskBoard
     * @param {TaskBoard.model.SwimlaneModel} swimlaneRecord Swimlane record
     * @param {Boolean} collapse `true` if the column is being collapsed.
     */
    //endregion

    //region Toggling

    /**
     * Collapse a swimlane or column.
     *
     * Await the call to be certain that the collapse transition has ended.
     *
     * ```javascript
     * await taskBoard.collapse(taskBoard.columns.first);
     * ```
     *
     * @param {TaskBoard.model.SwimlaneModel|TaskBoard.model.ColumnModel} record Swimlane or column
     * @category Expand & collapse
     */
    async collapse(record) {
        return this.toggleCollapse(record, true);
    }

    /**
     * Expand a swimlane or column.
     *
     * Await the call to be certain that the expand transition has ended.
     *
     * ```javascript
     * await taskBoard.expand(taskBoard.columns.first);
     * ```
     *
     * @param {TaskBoard.model.SwimlaneModel|TaskBoard.model.ColumnModel} record Swimlane or column
     * @category Expand & collapse
     */
    async expand(record) {
        return this.toggleCollapse(record, false);
    }

    /**
     * Expand or collapse a swimlane or column.
     *
     * Await the call to be certain that the expand/collapse transition has ended.
     *
     * ```javascript
     * // Toggle
     * await taskBoard.toggleCollapse(taskBoard.columns.first);
     * // Force collapse
     * await taskBoard.toggleCollapse(taskBoard.columns.first, true);
     * // Force expand
     * await taskBoard.toggleCollapse(taskBoard.columns.first, false);
     * ```
     *
     * @param {TaskBoard.model.SwimlaneModel|TaskBoard.model.ColumnModel} record Swimlane or column
     * @param {Boolean} [collapse] Specify to force a certain state, leave out to toggle
     * @category Expand & collapse
     * @fires columnCollapse
     * @fires columnExpand
     * @fires columnToggle
     * @fires swimlaneCollapse
     * @fires swimlaneExpand
     * @fires swimlaneToggle
     */
    async toggleCollapse(record, collapse = !record.collapsed) {
        if (record.isSwimlaneModel) {
            await this.toggleSwimlaneCollapse(record, collapse);
        }
        else {
            await this.toggleColumnCollapse(record, collapse);
        }
    }

    async toggleSwimlaneCollapse(swimlaneRecord, collapse = !swimlaneRecord.collapsed) {
        return new Promise(resolve => {
            const
                me                 = this,
                swimlaneElement    = me.getSwimlaneElement(swimlaneRecord),
                swimlaneBody       = DomSync.getChild(swimlaneElement, 'body'),
                headerHeight       = DomSync.getChild(swimlaneElement, 'header')?.getBoundingClientRect().height,
                // Measured unless configured, the swimlane might have been collapsed by other means or changed content
                // while collapsed. Measuring during a dom transition yields nothing, then only the body transitions
                swimlaneHeight     = collapse ? headerHeight : swimlaneRecord.height ?? measureExpandedHeight(swimlaneElement, swimlaneBody),
                transitionSwimlane = headerHeight != null && (collapse || swimlaneHeight > headerHeight);

            // Set a height on collapse, to transition down from -> 0
            if (collapse) {
                swimlaneBody.style.height = `${swimlaneBody.getBoundingClientRect().height}px`;
            }

            // The swimlane is sized by its content, which does not follow the body's transition, so transition its
            // height too or it snaps to the new height in one frame when the body's transition ends
            if (transitionSwimlane) {
                swimlaneElement.style.height = `${swimlaneElement.getBoundingClientRect().height}px`;
            }

            EventHelper.onTransitionEnd({
                element  : swimlaneBody,
                property : 'height',
                duration : DomHelper.getPropertyTransitionDuration(swimlaneBody, 'height') ?? me.css.asMilliseconds('--b-default-transition-duration'),
                async handler() {
                    // The fallback timer can fire before a late or slowed down transition ends, wait for it to finish
                    await Promise.all([swimlaneBody, swimlaneElement].map(element => AsyncHelper.waitForAnimations(element, false)));

                    if (me.isDestroyed) {
                        return;
                    }

                    if (collapse) {
                        // Removing static height on swimlane element on collapse
                        swimlaneElement.style.height = '';
                    }
                    else {
                        // Remove that height on expand, after it has transitioned from 0 to it
                        swimlaneBody.style.height = '';

                        // Static height on swimlane element on expand, cleared otherwise so it can grow with its content
                        swimlaneElement.style.height = swimlaneRecord.height != null ? `${swimlaneRecord.height}px` : '';
                    }

                    swimlaneElement.classList.remove(collapse ? 'b-collapsing' : 'b-expanding');

                    // Make sure UI is up to date when promise is resolved
                    me.recompose.flush();

                    resolve();
                },
                thisObj : me
            });

            swimlaneElement.classList.add(collapse ? 'b-collapsing' : 'b-expanding');

            me.suspendDomTransition();

            // This will trigger the recompose
            swimlaneRecord.collapsed = collapse;

            me.trigger(`swimlane${collapse ? 'Collapse' : 'Expand'}`, { swimlaneRecord });
            me.trigger('swimlaneToggle', { swimlaneRecord, collapse });
            me.resumeDomTransition();

            if (transitionSwimlane) {
                // Expanding, the body also gets a px target, left at 100% it would resolve against the transitioning
                // swimlane instead of following it
                if (!collapse) {
                    swimlaneBody.style.height = `${swimlaneHeight - headerHeight}px`;
                }

                swimlaneElement.style.height = `${swimlaneHeight}px`;
            }
        });
    }

    async toggleColumnCollapse(columnRecord, collapse = !columnRecord.collapsed) {
        return new Promise(resolve => {
            const
                me               = this,
                { documentRoot } = me,
                verticalGroups   = me.isVerticalColumnGroups,
                // A vertical group collapses / expands as a unit, so all its members toggle in sync. In every other mode
                // only the target column is affected. Only visible members have a rendered element (matching
                // renderColumnGroup's visibleColumns), so hidden members are excluded from every path below.
                groupColumns     = verticalGroups && columnRecord.group != null &&
                    me.getColumnGroupColumns(columnRecord, true),
                columnRecords    = groupColumns || [columnRecord],
                // The group container itself collapses to / expands from a narrow strip in vertical group mode
                groupElement     = groupColumns ? me.getColumnGroupElement(columnRecord) : null,
                // Element whose width transition marks completion: the group container for a vertical group, the column
                // element for other vertical columns, otherwise the (possibly group-nested) column header
                transitionElement = groupElement
                    ?? (verticalGroups ? me.getColumnElement(columnRecord) : me.getColumnHeaderElement(columnRecord)),
                perColumn        = [];

            // Re-entry guard: a rapid re-toggle finalizes the in-flight transition on this element first, so no stale
            // `b-collapsing`/`b-expanding` class or inline width lingers on the shared group container before we restart.
            transitionElement._collapseTransitionFinalize?.();

            for (const record of columnRecords) {
                const
                    columnElements = me.getColumnElements(record),
                    headerElement  = me.getColumnHeaderElement(record),
                    // For columns that already has a width specified we won't need to measure and apply current width
                    hasFixedWidth  = record.width && !record.flex,
                    cardElements   = documentRoot.querySelectorAll(`.b-task-board-card[data-column="${record.domId}"]`),
                    cardWidth      = `${cardElements[0]?.getBoundingClientRect().width}px`,
                    columnWidth    = `${columnElements[0]?.getBoundingClientRect().width}px`;

                record.meta.isCollapsing = collapse;

                // Fix card widths on collapse, to not have their contents reflow during the collapse
                if (collapse) {
                    cardElements.forEach(card => card.style.width = cardWidth);
                }

                if (headerElement) {
                    columnElements.unshift(headerElement);
                }

                columnElements.forEach(element => {
                    // Set a width on collapse, to transition down from -> 0. When collapsing a whole vertical group the
                    // container drives the width transition, so members are left to follow it (stretch) instead.
                    if (collapse) {
                        if (!hasFixedWidth && !groupElement) {
                            element.style.width = columnWidth;
                        }

                        element.classList.add('b-collapsing');
                    }
                    // Add cls to keep flex away a bit longer on expand
                    else {
                        element.classList.add('b-expanding');
                    }
                });

                perColumn.push({ record, columnElements, cardElements, hasFixedWidth });
            }

            // Drive the group container's width transition (start value on collapse, cls to keep flex off on expand)
            if (groupElement) {
                if (collapse) {
                    groupElement.style.width = `${groupElement.getBoundingClientRect().width}px`;
                    groupElement.classList.add('b-collapsing');
                }
                else {
                    groupElement.classList.add('b-expanding');
                }
            }

            let detacher,
                finalized = false;

            // Applies the end state (removes transient classes / inline widths, recomposes) and resolves. Runs once,
            // whether triggered by the transition ending, its fallback timer, or a re-toggle finalizing it early.
            const finalize = () => {
                if (finalized) {
                    return;
                }

                finalized = true;
                detacher?.();

                if (transitionElement._collapseTransitionFinalize === finalize) {
                    delete transitionElement._collapseTransitionFinalize;
                }

                for (const { record, columnElements, cardElements, hasFixedWidth } of perColumn) {
                    // Unfix card widths when fully expanded again
                    if (!collapse) {
                        cardElements.forEach(card => card.style.width = '');
                    }

                    // Remove that width on expand, after it has transitioned from 0 to it
                    columnElements.forEach(element => {
                        if (!collapse) {
                            // Restore width and flex from css
                            if (!hasFixedWidth) {
                                element.style.width = '';
                            }
                            element.classList.remove('b-expanding');
                        }
                        else {
                            element.classList.remove('b-collapsing');
                        }
                    });

                    record.meta.isCollapsing = false;
                }

                if (groupElement) {
                    if (!collapse) {
                        // The inline width is kept while collapsed (masked by the collapsed-strip width) so it is the
                        // target the expand transition animates back to; only clear it once fully expanded again.
                        groupElement.style.width = '';
                        groupElement.classList.remove('b-expanding');
                    }
                    else {
                        groupElement.classList.remove('b-collapsing');
                    }
                }

                // Make sure UI is up to date when promise is resolved
                me.recompose.flush();
                // Update again UI when width is calculated for locked columns position calculation.
                me.recompose();

                // Scroller is not aware of that expanding/collapsing might change overflow state, inform it...
                me.scrollable.syncOverflowState();

                resolve();
            };

            transitionElement._collapseTransitionFinalize = finalize;

            detacher = EventHelper.onTransitionEnd({
                element  : transitionElement,
                property : 'width',
                duration : DomHelper.getPropertyTransitionDuration(transitionElement, 'width') ?? me.css.asMilliseconds('--b-task-board-column-collapse-duration'),
                handler  : finalize,
                thisObj  : me
            });

            // Force browser to reevaluate, for transition to trigger.
            // Using void to prevent build optimizers from removing this as dead code
            void transitionElement.offsetWidth;

            me.suspendDomTransition();

            // This will trigger the recompose
            for (const record of columnRecords) {
                record.collapsed = collapse;
            }

            for (const record of columnRecords) {
                me.trigger(`column${collapse ? 'Collapse' : 'Expand'}`, { columnRecord : record });
                me.trigger('columnToggle', { columnRecord : record, collapse });
            }

            me.resumeDomTransition();
        });
    }

    //endregion

    //region Rendering

    // Inject expander icon + expand/collapsed state cls in column headers
    populateColumnHeader(args) {
        super.populateColumnHeader?.(args);

        const
            {
                showCollapseInHeader,
                collapseTitle,
                hasSwimlanes,
                showCollapseTooltip,
                isVerticalColumnGroups
            }       = this,
            {
                columnRecord,
                columnHeaderConfig
            }       = args,
            {
                text,
                collapsed,
                collapsible
            }       = columnRecord,
            tooltip = StringHelper.xss`${this.L(collapsed ? 'L{TaskBoard.expand}' : 'L{TaskBoard.collapse}', text)}`;

        DomHelper.merge(columnHeaderConfig, {
            class : {
                'b-collapsed'    : collapsed,
                // The rotated title renders in the body (not the header) in vertical group mode, so exclude it here -
                // otherwise the header keeps reserving space for a hidden rotated title and misaligns collapsed columns.
                'b-rotate-title' : collapsed && !collapseTitle && !hasSwimlanes && !isVerticalColumnGroups
            },
            style : {
                minWidth : collapsed ? null : columnRecord.minWidth
            },
            children : {
                padder : {
                    children : {
                        expander : showCollapseInHeader && collapsible && {
                            tag   : 'button',
                            class : {
                                'b-button'                     : 1,
                                'b-button-text'                : 1,
                                'b-task-board-column-expander' : 1,
                                'b-fw-icon'                    : 1,
                                'b-icon-expand-column'         : 1
                            },
                            tabIndex        : -1,
                            'aria-expanded' : String(!collapsed),
                            'aria-label'    : tooltip,
                            dataset         : {
                                btip : showCollapseTooltip
                                    ? tooltip
                                    : null
                            }
                        }
                    }
                }
            }
        });
    }

    // Inject expand/collapsed state cls in columns
    populateColumn(args) {
        super.populateColumn?.(args);

        const
            { collapseTitle, hasSwimlanes, isVerticalColumnGroups } = this,
            { columnRecord, columnConfig }                           = args,
            { collapsed }                                            = columnRecord;

        columnConfig.class['b-collapsed'] = collapsed;

        if (collapsed) {
            // Dropped as soon as the record reads collapsed, exactly as in populateColumnHeader: while the two sides of
            // the same record disagree on the floor, their group containers derive different `min-content` widths.
            columnConfig.style.minWidth = null;

            // Display title (with count) in the column body when collapsed, unless configured off. Swimlanes normally
            // render the title elsewhere, but vertical column groups ignore swimlanes and carry no header title, so the
            // body title is still needed there even when a swimlaneField is set.
            if (!columnRecord.meta.isCollapsing && !collapseTitle && (!hasSwimlanes || isVerticalColumnGroups)) {
                columnConfig.children.body.children.unshift(this.renderColumnTitle(columnRecord));
            }
        }
    }

    // Inject expander icon + expand/collapsed state cls in swimlanes
    populateSwimlane(args) {
        super.populateColumn?.(args);

        const { swimlaneRecord, swimlaneConfig } = args;

        if (swimlaneRecord) {
            const
                {
                    showCollapseInHeader,
                    showCollapseTooltip
                }       = this,
                {
                    text,
                    collapsed,
                    collapsible
                }       = swimlaneRecord,
                tooltip = StringHelper.xss`${this.L(collapsed ? 'L{TaskBoard.expand}' : 'L{TaskBoard.collapse}', text)}`;

            DomHelper.merge(swimlaneConfig, {
                class : {
                    'b-collapsed'   : collapsed,
                    'b-collapsible' : collapsible
                },
                children : {
                    header : {
                        children : {
                            title : {
                                children : {
                                    // Before text
                                    'expander > text' : showCollapseInHeader && collapsible && {
                                        tag   : 'button',
                                        class : {
                                            'b-button'                       : 1,
                                            'b-button-text'                  : 1,
                                            'b-colorize'                     : 1,
                                            'b-task-board-swimlane-expander' : 1,
                                            'b-icon'                         : 1,
                                            'b-icon-expand-row'              : 1
                                        },
                                        tabIndex        : -1,
                                        'aria-expanded' : String(!collapsed),
                                        'aria-label'    : tooltip,
                                        dataset         : {
                                            btip : showCollapseTooltip
                                                ? tooltip
                                                : null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    body : {
                        [collapsed ? 'inert' : null] : true
                    }
                }
            });
        }
    }

    //endregion

    //region Listeners

    onColumnHeaderClick({ event, columnRecord }) {
        if (event.target.matches('.b-task-board-column-expander') || columnRecord.collapsed) {
            this.toggleCollapse(columnRecord);
        }
    }

    onColumnClick({ columnRecord }) {
        if (columnRecord.collapsed) {
            this.toggleCollapse(columnRecord);
        }
    }

    onSwimlaneHeaderClick({ swimlaneRecord }) {
        this.toggleCollapse(swimlaneRecord);
    }

    //endregion

};
