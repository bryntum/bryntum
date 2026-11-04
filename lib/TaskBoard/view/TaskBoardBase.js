import DomHelper from '../../Core/helper/DomHelper.js';

import DomSync from '../../Core/helper/DomSync.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Featureable from '../../Core/mixin/Featureable.js';
import Pluggable from '../../Core/mixin/Pluggable.js';
import State from '../../Core/mixin/State.js';
import Tierable from '../../Core/mixin/Tierable.js';
import ScrollManager from '../../Core/util/ScrollManager.js';
import Responsive from '../../Core/widget/mixin/Responsive.js';
import Styleable from '../../Core/widget/mixin/Styleable.js';
import Panel from '../../Core/widget/Panel.js';

import CrudManagerView from '../../Scheduler/crud/mixin/CrudManagerView.js';

import TaskBoardFeature from '../feature/TaskBoardFeature.js';
import ExpandCollapse from './mixin/ExpandCollapse.js';
import ResponsiveCards from './mixin/ResponsiveCards.js';
import TaskBoardColumns from './mixin/TaskBoardColumns.js';

import TaskBoardDom from './mixin/TaskBoardDom.js';
import TaskBoardDomEvents from './mixin/TaskBoardDomEvents.js';
import TaskBoardScroll from './mixin/TaskBoardScroll.js';
import TaskBoardStores from './mixin/TaskBoardStores.js';


import TaskItems from './mixin/TaskItems.js';
import TaskNavigation from './mixin/TaskNavigation.js';

import TaskHighlighting from './mixin/TaskHighlighting.js';
import TaskSelection from './mixin/TaskSelection.js';
import '../localization/En.js';
import Tooltip from '../../Core/widget/Tooltip.js';

DomHelper.loadStylesheet('TaskBoard/view/TaskBoardBase.css');

// import Stylesheet from './TaskBoardBase.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TaskBoardBase');

/**
 * @module TaskBoard/view/TaskBoardBase
 */

const weightSorter = (a, b) => a.weight - b.weight;

/**
 * A thin base class for {@link TaskBoard.view.TaskBoard}. Does not include any features by default, allowing smaller
 * custom-built bundles if used in place of {@link TaskBoard.view.TaskBoard}.
 *
 * **NOTE:** In most scenarios you probably want to use TaskBoard instead of TaskBoardBase.
 *
 * @extends Core/widget/Panel
 *
 * @mixes Core/mixin/Pluggable
 * @mixes Core/mixin/State
 * @mixes Core/mixin/Tierable
 * @mixes Core/widget/mixin/Responsive
 * @mixes Core/widget/mixin/Styleable
 * @mixes Scheduler/crud/mixin/CrudManagerView
 * @mixes TaskBoard/view/mixin/ExpandCollapse
 * @mixes TaskBoard/view/mixin/ResponsiveCards
 * @mixes TaskBoard/view/mixin/TaskBoardColumnGroups
 * @mixes TaskBoard/view/mixin/TaskBoardColumns
 * @mixes TaskBoard/view/mixin/TaskBoardDom
 * @mixes TaskBoard/view/mixin/TaskBoardDomEvents
 * @mixes TaskBoard/view/mixin/TaskBoardScroll
 * @mixes TaskBoard/view/mixin/TaskBoardStores
 * @mixes TaskBoard/view/mixin/TaskBoardSwimlanes
 * @mixes TaskBoard/view/mixin/TaskBoardVirtualization
 * @mixes TaskBoard/view/mixin/TaskItems
 * @mixes TaskBoard/view/mixin/TaskHighlighting
 * @mixes TaskBoard/view/mixin/TaskNavigation
 * @mixes TaskBoard/view/mixin/TaskSelection
 *
 * @features TaskBoard/feature/AI
 * @features TaskBoard/feature/ColumnDrag
 * @features TaskBoard/feature/ColumnFilter
 * @features TaskBoard/feature/ColumnHeaderMenu
 * @features TaskBoard/feature/ColumnLock
 * @features TaskBoard/feature/ColumnRename
 * @features TaskBoard/feature/ColumnResize
 * @features TaskBoard/feature/ColumnSort
 * @features TaskBoard/feature/ColumnToolbars
 * @features TaskBoard/feature/FilterBar
 * @features TaskBoard/feature/SimpleTaskEdit
 * @features TaskBoard/feature/SwimlaneDrag
 * @features TaskBoard/feature/TaskDrag
 * @features TaskBoard/feature/TaskDragSelect
 * @features TaskBoard/feature/TaskEdit
 * @features TaskBoard/feature/TaskMenu
 * @features TaskBoard/feature/TaskTooltip
 * @widget
 * @tier community
 */
export default class TaskBoardBase extends Panel.mixin(
    Pluggable,
    State,
    Featureable,
    Styleable,
    CrudManagerView,
    ExpandCollapse,
    Responsive,
    ResponsiveCards,
    TaskBoardColumns,

    TaskBoardDom,
    TaskBoardDomEvents,
    TaskBoardScroll,
    TaskBoardStores,


    TaskHighlighting,
    TaskItems,
    TaskNavigation,
    TaskSelection,
    Tierable
) {

    // <debug>
    // region Localization test
    static localization = [
        'L{TaskBoard.task}',
        'L{TaskBoard.tasks}',
        'L{TaskBoard.column}',
        'L{TaskBoard.columns}',
        'L{TaskBoard.swimlane}',
        'L{TaskBoard.swimlanes}'
    ];
    // endregion
    // </debug>

    //region Config

    static $name = 'TaskBoardBase';
    static type = 'taskboardbase';

    static featureable = {
        factory : TaskBoardFeature
    };

    static configurable = {
        //region Hidden members

        /**
         * @hideconfigs crudManager, crudManagerClass, contentElementCls, htmlCls, defaults, hideWhenEmpty, itemCls,
         * items, layout, layoutStyle, lazyItems, namedItems, textContent, content, html, defaultBindProperty,
         * monitorResize, ripple, tooltip, tag, textAlign, preventTooltipOnTouch, autoUpdateRecord, defaultFocus,
         * trapFocus, showTooltipWhenDisabled
         */

        /**
         * @hideproperties $name, isSettingValues, isValid, items, layout, record, values, content, contentElement,
         * focusElement, html, overflowElement, layoutStyle, tooltip, scrollable, firstItem, lastItem, cellInfo,
         * visibleChildCount
         */

        /**
         * @hidefunctions attachTooltip, isOfTypeName, mixin, optionalL, callback, resolveCallback, add, getWidgetById,
         * insert, processWidgetConfig, remove, removeAll, construct, doDestroy, updateLocalization, compose,
         * eachAncestor, eachWidget, query, queryAll, L, getAt
         */

        /**
         * @hideevents beforeSetRecord
         */

        //endregion

        layout : 'vbox',

        /**
         * An object containing Feature configuration objects (or `true` if no configuration is required)
         * keyed by the Feature class name in all lowercase.
         *
         * {@note}
         * Setting this property has no effect when using framework wrappers.
         *
         * When using framework wrappers, features must be configured via `featureNameFeature` properties.
         * See [Framework Integration Guide](#TaskBoard/guides/integration/react/guide.md#configuring-features) for details.
         * {/@note}
         * @config {Object}
         * @category Common
         */
        features : true,

        /**
         * An empty function by default, but provided so that you can override it. This function is called each time
         * a task is rendered into the task board. It allows you to manipulate the DOM config object used for the card
         * before it is synced to DOM, thus giving you control over styling and contents.
         *
         * <div class="warning">
         * You should never modify any records inside this method.
         * </div>
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *    taskRenderer({ taskRecord, cardConfig }) {
         *        // Add an icon to all tasks header
         *        cardConfig.children.header.children.icon = {
         *            tag   : 'i',
         *            class : 'fa fa-beer'
         *        }
         *    }
         * });
         * ```
         *
         * For more information, see the [Customize task contents guide](#TaskBoard/guides/customization/taskcontents.md).
         *
         * @config {Function}
         * @param {Object} context An object containing the information needed to render a task
         * @param {TaskBoard.model.TaskModel} context.taskRecord The task record
         * @param {TaskBoard.model.ColumnModel} context.columnRecord The column the task will be displayed in
         * @param {TaskBoard.model.SwimlaneModel} context.swimlaneRecord The swimlane the task will be displayed in
         * @param {DomConfig} context.cardConfig DOM config object for the cards element
         * @returns {void}
         * @category Task content
         */
        taskRenderer : null,

        /**
         * An empty function by default, but provided so that you can override it. This function is called each time
         * a swimlane is rendered into the task board. It allows you to manipulate the DOM config object used for the
         * swimlane before it is synced to DOM, thus giving you control over styling and contents.
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *    swimlaneRenderer({ swimlaneRecord, swimlaneConfig }) {
         *        // Add an icon to all swimlane headers
         *        swimlaneConfig.children.header.children.icon = {
         *            tag   : 'i',
         *            class : 'fa fa-dog'
         *        }
         *    }
         * });
         * ```
         *
         * @config {Function}
         * @param {Object} context An object containing the information needed to render a swimlane.
         * @param {TaskBoard.model.SwimlaneModel} context.swimlaneRecord The swimlane.
         * @param {DomConfig} context.swimlaneConfig DOM config object for the swimlane
         * @returns {void}
         * @category Advanced
         */
        swimlaneRenderer : null,

        /**
         * A function which renders the text, HTML, or `DomConfig` object to show as the column title. If you provide a
         * `DomConfig` object, it will replace the title element and you are responsible for styling it + laying it out.
         *
         * ```javascript
         * new TaskBoard({
         *     columnTitleRenderer({ columnRecord }) {
         *         const highPrioCount = columnRecord.taskStore.query(task => task.status === columnRecord.id && task.prio === 'high').length;
         *
         *         return `${columnRecord.text} <span class="highprio-count">(${highPrioCount} high prio)</span>`;
         *     }
         * })
         * ```
         *
         * @config {Function}
         * @param {Object} context Renderer context data
         * @param {TaskBoard.model.ColumnModel} context.columnRecord The column instance
         * @returns {String|DomConfig}
         */
        columnTitleRenderer : null,

        /**
         * Controls how many cards are rendered to a row in each column. Can be controlled on a per column basis by
         * setting {@link TaskBoard.model.ColumnModel#field-tasksPerRow}
         *
         * ```javascript
         * new TaskBoard({
         *   tasksPerRow : 3
         * });
         * ```
         *
         * @config {Number}
         * @category Common
         */
        tasksPerRow : 1,

        /**
         * Setting this will cause cards to expand to share the available width if there are fewer than
         * {@link #config-tasksPerRow}.
         *
         * By default, the {@link #config-tasksPerRow} always applies, and if it is 3, then a single
         * card in a column will be 33% of the available width.
         *
         * To have fewer cards than the {@link #config-tasksPerRow} evenly share available column width,
         * configure this as `true`;
         * @prp {Boolean}
         * @category Common
         */
        stretchCards : null,

        /**
         * Show task count for a column in its header, appended after the title
         *
         * ```javascript
         * new TaskBoard({
         *   showCountInHeader : false
         * });
         * ```
         *
         * @config {Boolean}
         * @default
         * @category Common
         */
        showCountInHeader : true,

        /**
         * By default, the header text is HTML-encoded. Set this flag to `false` disable this and allow html
         * elements in the column headers. Can also be specified on a single
         * {@link TaskBoard.model.ColumnModel#field-htmlEncodeHeaderText column}.
         * @config {Boolean} htmlEncodeHeaderText
         * @default true
         * @category Misc
         */
        htmlEncodeHeaderText : null,

        /**
         * Makes column and swimlane headers sticky
         *
         * ```javascript
         * new TaskBoard({
         *   stickyHeaders : true
         * });
         * ```
         *
         * @config {Boolean}
         * @default
         * @category Common
         */
        stickyHeaders : false,

        /**
         * Experimental, animate actions that cannot be animated using CSS transitions. Currently includes:
         * * Programmatically moving tasks
         * * Moving tasks using the task editor
         * * Adding tasks
         * * Removing tasks
         * * Sorting tasks
         * * Hiding/showing/filtering columns
         * * Hiding/showing/filtering swimlanes
         *
         * ```javascript
         * new TaskBoard({
         *   useDomTransition : true
         * });
         * ```
         * **NOTE**: This flag is not supported for Lightning Web Components
         * @config {Boolean}
         * @category Experimental
         */
        useDomTransition : false,

        /**
         * Path to load resource images from. Used by the for example the resource picker in the task editor and by the
         * ResourceAvatars task item. Set this to display miniature images for each resource using their `image` field.
         *
         * **NOTE**: The path should end with a `/`:
         *
         * ```javascript
         * new TaskBoard({
         *   resourceImagePath : 'images/resources/'
         * });
         * ```
         *
         * @config {String}
         * @category Common
         */
        resourceImagePath : null,

        /**
         * CSS variable prefix, appended to the keys used in {@link #config-css}.
         *
         * Normally you do not need to change this value.
         *
         * @default
         * @config {String}
         * @category CSS
         */
        cssVarPrefix : 'b-task-board',

        /**
         * Configuration values for the {@link Core.util.ScrollManager} class. It is used to manage column/body
         * scrolling during task, column or swimlane drag.
         * ```javascript
         * new TaskBoard({
         *     scrollManager : {
         *         zoneWidth   : 100, // increase zone size
         *         scrollSpeed : 3    // and scroll speed
         *     }
         * })
         * ```
         * @config {ScrollManagerConfig}
         * @category Scrolling
         */
        scrollManager : {
            value : {},

            $config : ['nullify', 'lazy']
        },

        /**
         * Allows sorting tasks in the UI independent of how they are sorted in the task store.
         *
         * Specify `true` to force sorting tasks by {@link TaskBoard/model/TaskModel#field-weight}.
         *
         * Supply a [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
         * function to force a custom sort order.
         *
         * This is likely something you will want to use if combining TaskBoard with other products, sharing the
         * project. Without this, sorting tasks in for example Gantt will also rearrange the cards on the board.
         *
         * As described above it accepts either a boolean or a Function, but it always returns a sorter function.
         *
         * @prp {Function} taskSorterFn
         * @accepts {Boolean|Function}
         * @config {Function}
         * @param {TaskBoard.model.TaskModel} first The first task to compare
         * @param {TaskBoard.model.TaskModel} second The second task to compare
         * @returns {Number} Return `1` if first task is greater than second task, `-1` if the opposite is true or `0`
         * if they are equal
         * @category Advanced
         */
        taskSorterFn : null,

        /**
         * See {@link TaskBoard.view.TaskBoard#keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>} keyMap
         * @category Common
         */

        contentElMutationObserver : false,

        textContent : false,

        // We can scroll in both axes.
        // Scrollable also syncs the b-horizontal-overflow and b-vertical-overflow classes
        // to allow styles to depend upon overflow state.
        scrollable : true,

        detectCSSCompatibilityIssues : true,

        testConfig : {
            detectCSSCompatibilityIssues : false
        }
    };

    isInitiallyComposed    = false;
    domTransitionSuspended = 0;
    columnRecomposeQueue   = new Map();

    static delayable = {
        recomposeColumns : 'raf'
    };

    //endregion

    //region Overrides

    onInternalPaint(...args) {
        super.onInternalPaint(...args);


    }

    //endregion

    //region Type assertions and changers/updaters

    changeResourceImagePath(resourceImagePath) {
        ObjectHelper.assertString(resourceImagePath, 'resourceImagePath');

        return resourceImagePath;
    }

    changeUseDomTransition(useDomTransition) {
        ObjectHelper.assertBoolean(useDomTransition, 'useDomTransition');

        return useDomTransition;
    }

    changeStickyHeaders(stickyHeaders) {
        ObjectHelper.assertBoolean(stickyHeaders, 'stickyHeaders');

        return stickyHeaders;
    }

    changeScrollManager(scrollManager, oldScrollManager) {
        oldScrollManager?.destroy();

        if (scrollManager) {
            return ScrollManager.new({
                element : this.element,
                owner   : this
            }, scrollManager);
        }

        return null;
    }

    changeShowCountInHeader(showCountInHeader) {
        ObjectHelper.assertBoolean(showCountInHeader, 'showCountInHeader');

        return showCountInHeader;
    }

    changeTasksPerRow(tasksPerRow) {
        ObjectHelper.assertNumber(tasksPerRow, 'tasksPerRow', true);

        return tasksPerRow;
    }

    changeSwimlaneRenderer(swimlaneRenderer) {
        ObjectHelper.assertFunction(swimlaneRenderer, 'swimlaneRenderer');

        return swimlaneRenderer;
    }

    changeTaskRenderer(taskRenderer) {
        ObjectHelper.assertFunction(taskRenderer, 'taskRenderer');

        return taskRenderer;
    }

    changeTaskSorterFn(fn) {
        if (fn === true) {
            return weightSorter;
        }

        fn && ObjectHelper.assertFunction(fn, 'taskSorterFn');

        return fn;
    }

    //endregion

    //region Recompose columns

    // Queue a column for recomposition on next frame
    queueColumnRecompose(columnRecord, swimlaneRecord) {
        this.columnRecomposeQueue.set(`${columnRecord.id}.-.${swimlaneRecord?.id}`, { columnRecord, swimlaneRecord });
        this.recomposeColumns();
    }

    // RAF function to recompose all queued columns
    recomposeColumns() {
        for (const [, { columnRecord, swimlaneRecord }] of this.columnRecomposeQueue) {
            this.recomposeColumn(columnRecord, swimlaneRecord);
        }
        this.columnRecomposeQueue.clear();
    }

    // Recompose a single column / swimlane intersection
    recomposeColumn(columnRecord, swimlaneRecord) {
        const
            element   = this.getSwimlaneColumnElement(swimlaneRecord, columnRecord),
            domConfig = DomHelper.normalizeChildren(this.renderColumn(swimlaneRecord, columnRecord, this.columns.records));

        domConfig.onlyChildren = true;

        DomSync.sync({
            targetElement : element,
            domConfig,
            callback      : this.domSyncCallback,
            syncOptions   : {
                syncIdField      : 'column',
                releaseThreshold : 0
            }
        });
    }

    //endregion

    //region Render

    /**
     * Whether `columnRecord` can be moved to the slot next to `targetColumn`. Features that render the columns in an
     * order of their own ({@link TaskBoard.feature.ColumnLock}) refuse the moves that order would undo.
     * @param {TaskBoard.model.ColumnModel} columnRecord Column being moved
     * @param {TaskBoard.model.ColumnModel} targetColumn Column the move is measured against - the neighbor a menu
     * item would step past, or the column under the drag proxy
     * @returns {Boolean} `true` if the move can be rendered as intended
     * @internal
     */
    isValidColumnMove(columnRecord, targetColumn) {
        return true;
    }

    // Creates a DOM config for a single card, calling any configured taskRenderer() in the process
    renderCard(taskRecord, columnRecord, swimlaneRecord) {


        const
            me                                = this,
            { id, domId, eventColor, weight } = taskRecord,
            color                             = eventColor || swimlaneRecord?.color || columnRecord.color,
            cardSize                          = me.getCardSize(columnRecord, swimlaneRecord),
            cardConfig                        = {
                id    : `${me.id}-card-${domId}`,
                class : {
                    'b-task-board-card' : true,
                    'b-collapsed'       : taskRecord.collapsed,
                    'b-read-only'       : taskRecord.readOnly,
                    'b-colorize'        : true,
                    ...taskRecord.cls
                },
                // The board body is one roving tabIndex composite, see TaskNavigation
                tabIndex     : -1,
                role         : me.cardRole,
                // `article` is not named from its content, and `button` would otherwise be named by the concatenated
                // text of every item on the card
                'aria-label' : taskRecord.name || null,
                dataset      : {
                    task          : domId,
                    column        : columnRecord.id,
                    lane          : swimlaneRecord?.id,
                    domTransition : true,
                    weight
                },
                style : {
                    '--b-primary' : DomHelper.createColorStyle(color),
                    height        : me.getTaskHeight?.(taskRecord) ?? null
                },
                elementData : {
                    elementType : 'task',
                    taskId      : id,
                    taskRecord,
                    columnRecord,
                    swimlaneRecord
                },
                children : {
                    header : {
                        tag   : 'header',
                        class : {
                            'b-task-board-card-header' : 1
                        },
                        children    : {},
                        syncOptions : {
                            syncIdField : 'role'
                        }
                    },
                    body : {
                        tag   : 'section',
                        class : {
                            'b-task-board-card-body' : 1
                        },
                        children    : {},
                        syncOptions : {
                            syncIdField : 'role'
                        }
                    },
                    footer : {
                        tag   : 'footer',
                        class : {
                            'b-task-board-card-footer' : 1
                        },
                        children    : {},
                        syncOptions : {
                            syncIdField : 'role'
                        }
                    }
                }
            },
            { children }             = cardConfig,
            { header, body, footer } = children;

        // Chained by features
        me.populateCard({
            taskRecord,
            columnRecord,
            swimlaneRecord,
            cardConfig,
            cardSize
        });

        // Supplied by app
        me.taskRenderer?.({
            taskRecord,
            columnRecord,
            swimlaneRecord,
            cardConfig,
            cardSize
        });

        // <remove-on-release>
        // TODO: headerRenderer, bodyRenderer, footerRenderer?
        // </remove-on-release>

        // Remove unused parts of the card
        if (header.html == null && header.text == null && (!header.children || Object.keys(header.children).length === 0)) {
            children.header = null;
        }

        if (body.html == null && body.text == null && (!body.children || Object.keys(body.children).length === 0)) {
            children.body = null;
        }

        if (footer.html == null && footer.text == null && (!footer.children || Object.keys(footer.children).length === 0)) {
            children.footer = null;
        }

        return cardConfig;
    }

    renderColumnTitle(columnRecord) {
        const
            me                = this,
            { text, tooltip } = columnRecord,
            title = me.columnTitleRenderer?.({
                columnRecord
            }) || text,
            htmlEncode        = (typeof columnRecord.htmlEncodeHeaderText === 'boolean' ? columnRecord.htmlEncodeHeaderText : me.htmlEncodeHeaderText !== false);

        return {
            class : {
                'b-task-board-column-title' : 1
            },
            dataset : {
                btip : tooltip
            },
            children : [
                typeof title === 'object' ? title : {
                    tag                            : 'span',
                    class                          : 'b-column-title-text',
                    [htmlEncode ? 'text' : 'html'] : title
                },
                me.showCountInHeader && {
                    tag   : 'span',
                    class : {
                        'b-task-board-column-count' : 1
                    },
                    text : me.getColumnTaskCount(columnRecord)
                }
            ]
        };
    }

    renderColumnHeader(columnRecord, columns) {
        const
            me                    = this,
            { id, domId, width, flex, minWidth, color } = columnRecord,
            columnHeaderConfig    = {
                id    : `${me.id}-column-header-${domId}`,
                class : {
                    'b-task-board-column-header' : 1,
                    'b-colorize'                 : 1,
                    'b-fixed-width'              : width && !flex,
                    'b-last'                     : columnRecord === columns[columns.length - 1]
                },
                style : {
                    '--b-primary' : DomHelper.createColorStyle(color),
                    width,
                    // In vertical column-group mode the header sits inside a flex-column unit, where a flex weight
                    // would stretch it vertically. The column element carries the flex weight instead (see renderColumn).
                    flex          : me.isVerticalColumnGroups ? null : flex,
                    minWidth
                },
                children : {
                    padder : {
                        class : {
                            'b-task-board-column-header-padder' : 1
                        },
                        children : {
                            title : me.renderColumnTitle(columnRecord)
                        }
                    }
                },
                dataset : {
                    column        : domId,
                    domTransition : true
                },
                elementData : {
                    elementType : 'columnHeader',
                    columnId    : id
                }
            };

        Tooltip.showOverflow = true;

        // Chained by features
        me.populateColumnHeader({
            columnRecord,
            columnHeaderConfig,
            columns
        });

        // Not currently used
        // me.columnHeaderRenderer?.({
        //     columnRecord,
        //     columnHeaderConfig
        // });

        return columnHeaderConfig;
    }

    renderColumn(swimlaneRecord, columnRecord, columns) {
        const
            me                = this,
            {
                taskSorterFn,
                stretchCards,
                columnField,
                swimlaneField
            }                 = me,
            {
                width,
                flex,
                id,
                domId,
                minWidth,
                color,
                taskStore
            }                 = columnRecord,
            // Tasks in this column / swimlane intersection. Fetched using an index for better performance, except when
            // using a tree store, since only the expanded tasks are indexed then (only those are in storage)
            tasks             = taskStore.isTree || swimlaneRecord
                ? taskStore.query(r =>
                    r[columnField] === id &&
                    (!swimlaneField || !swimlaneRecord || r[swimlaneField] === swimlaneRecord.id) // Might have no lanes
                )
                : taskStore.records,
            perRow            = me.getTasksPerRow(columnRecord, swimlaneRecord),
            elementId         = `${me.id}-column-${swimlaneRecord?.domId ?? 'default'}-${domId}`,
            columnConfig      = {
                id    : elementId,
                class : {
                    'b-task-board-column'                                : 1,
                    'b-fixed-width'                                      : width && !flex,
                    [`b-${perRow}-task${perRow > 1 ? 's' : ''}-per-row`] : 1,
                    'b-inline'                                           : perRow > 1,
                    'b-last'                                             : columnRecord === columns[columns.length - 1]
                },
                style : {
                    '--b-primary' : DomHelper.createColorStyle(color),
                    width,
                    flex,
                    minWidth
                },
                dataset : {
                    column        : domId,
                    lane          : swimlaneRecord?.id,
                    domTransition : true
                },
                elementData : {
                    elementType : 'column',
                    columnId    : id,
                    laneId      : swimlaneRecord?.id
                },
                // Cards
                children : {
                    body : {
                        id    : `${elementId}-body`,
                        class : {
                            'b-task-board-column-body' : 1
                        },
                        // Chrome puts a scroller whose children are all tabIndex -1 into the tab order, which would
                        // add a Tab stop per column. Silenced as Grid silences its subgrids, see SubGrid#changeElement
                        tabIndex : -1,
                        dataset  : {
                            role          : 'body',
                            domTransition : true
                        },
                        children : [
                            {
                                class : {
                                    'b-task-board-column-body-inner' : 1
                                },
                                style : {
                                    'grid-template-columns' : `repeat(${stretchCards ? Math.min(perRow, tasks.length) : perRow}, 1fr)`
                                },
                                dataset : {
                                    role          : 'inner',
                                    domTransition : true
                                },
                                children : (() => {
                                    // Optionally force sort order
                                    if (taskSorterFn) {
                                        tasks.sort(taskSorterFn);
                                    }
                                    // Otherwise match store order, Set is unordered
                                    else {
                                        tasks.sort((a, b) => taskStore.indexOf(a) - taskStore.indexOf(b));
                                    }



                                    return tasks.map(taskRecord => me.renderCard(taskRecord, columnRecord, swimlaneRecord));
                                })(),
                                syncOptions : {
                                    syncIdField      : 'task',
                                    releaseThreshold : me.isVirtualized ? 1000 : 0
                                }
                            }
                        ],
                        syncOptions : {
                            syncIdField : 'role'
                        }
                    }
                },
                syncOptions : {
                    syncIdField : 'role'
                }
            };

        // In vertical column group mode there is no shared top header row, so each column carries its own header,
        // rendered directly above its body inside the column element.
        if (me.isVerticalColumnGroups) {
            const header = me.renderColumnHeader(columnRecord, columns);

            // Tag the in-column header with the `role` syncId the column matches its children by, so DomSync links it
            // to the header slot instead of reusing the card body element for it when recomposing / switching direction
            header.dataset.role = 'header';

            columnConfig.children = {
                header,
                body : columnConfig.children.body
            };
        }

        // Chained by features
        me.populateColumn({
            columnRecord,
            swimlaneRecord,
            columnConfig,
            columns
        });

        // Supplied by app
        me.columnRenderer?.({
            columnRecord,
            swimlaneRecord,
            columnConfig
        });

        return columnConfig;
    }

    renderSwimlane(swimlaneRecord, columns) {
        const
            me                             = this,
            { showCountInHeader }          = me,
            {
                id = 'default',
                domId = 'default',
                text,
                height,
                flex,
                color
            }                              = swimlaneRecord || {},
            elementId                      = `${me.id}-swimlane-${domId}`,
            swimlaneConfig                 = {
                id    : elementId,
                class : {
                    'b-task-board-swimlane' : 1,
                    'b-fixed-height'        : height && !flex,
                    'b-last'                : !swimlaneRecord || swimlaneRecord === me.swimlanes.last,
                    'b-colorize'            : 1
                },
                style : {
                    '--b-primary' : DomHelper.createColorStyle(color),
                    height,
                    flex
                },
                dataset : {
                    lane          : domId,
                    domTransition : true
                },
                elementData : {
                    elementType : 'swimlane',
                    laneId      : id
                },
                children : {
                    // If a lane is defined, it has a header
                    header : swimlaneRecord && {
                        id    : `${elementId}-header`,
                        tag   : 'header',
                        class : {
                            'b-task-board-swimlane-header' : 1
                        },
                        dataset : {
                            role          : 'header',
                            domTransition : 'preserve-padding-inline'
                        },
                        children : {
                            title : {
                                class : {
                                    'b-task-board-swimlane-title' : 1
                                },
                                children : {
                                    text,
                                    count : showCountInHeader && {
                                        tag   : 'span',
                                        class : {
                                            'b-task-board-swimlane-count' : 1
                                        },
                                        text : `(${me.getSwimlaneTasks(swimlaneRecord)?.size ?? 0})`
                                    }
                                }
                            }
                        }
                    },
                    // Lane or no lane, there is always a body to contain columns
                    body : {
                        id    : `${elementId}-body`,
                        class : {
                            'b-task-board-swimlane-body' : 1
                        },
                        dataset : {
                            role          : 'body',
                            domTransition : true
                        },
                        // Columns within the lane, grouped columns wrapped in a group container
                        children    : me.mapColumnGroupItems(columns, column => me.renderColumn(swimlaneRecord, column, columns), `${me.id}-column-${swimlaneRecord?.domId ?? 'default'}`),
                        syncOptions : {
                            syncIdField      : 'column',
                            releaseThreshold : 0
                        }
                    }
                },
                syncOptions : {
                    syncIdField : 'role'
                }
            };

        me.populateSwimlane({
            swimlaneRecord,
            swimlaneConfig
        });

        // Supplied by app
        me.swimlaneRenderer?.({
            swimlaneRecord,
            swimlaneConfig
        });

        return swimlaneConfig;
    }

    // Called when a feature is added at runtime. Recompose so features that inject contents into the
    // composed DOM (task items, column contents) apply to already rendered UI.
    afterFeatureAdd() {
        this.isPainted && this.recompose();
    }

    // Creates a DOM config for the entire TaskBoard, rendered to panels body
    get bodyConfig() {
        const
            me             = this,
            columns        = me.columns.records,
            // In vertical column group mode the shared top header row is not used, each column carries its own header
            verticalGroups = me.isVerticalColumnGroups,
            // <remove-on-release>
            // TODO: Ask Don about a better way
            // </remove-on-release>
            // Pull in configs that affect rendering, even if not used here to prime them
            {
                swimlanes,
                /* eslint-disable no-unused-vars */
                stickyHeaders,
                showCountInHeader,
                columnField,
                swimlaneField,
                tasksPerRow,
                headerItems,
                bodyItems,
                footerItems,
                showCollapseInHeader,
                showCollapseTooltip,
                taskSorterFn,
                stretchCards
                /* eslint-enable no-unused-vars */
            }  = me;

        // On first compose, supply a minimal body to have element ready when features inject their contents on next
        // compose. Allows us to avoid using hacks to pull features in early
        if (!me.rendered) {
            // Queue up another recompose after the minimal bootstrap, to render columns while loading
            me.setTimeout(() => me.recompose(), 0);

            return {
                // Required by panel, it expects a bodyElement reference
                reference : 'bodyElement',
                // Listeners are only set up on first sync, has to go here (not internalListeners no purpose, these are
                // EventHelper listeners)
                // eslint-disable-next-line bryntum/no-listeners-in-lib
                listeners : ObjectHelper.assign({ thisObj : me }, me.domListeners)
            };
        }

        // We get here on second compose, features are now pulled in and we have an outer element ready
        const bodyConfig = {
            // Save some processing by not cloning the config, it is regenerated on every compose anyway
            skipClone : true,
            reference : 'bodyElement',
            class     : {
                'b-task-board-body'        : 1,
                'b-sticky-headers'         : stickyHeaders,
                'b-column-groups'          : me.hasColumnGroups,
                'b-vertical-column-groups' : verticalGroups
            },
            children    : [],
            syncOptions : {
                syncIdField      : 'lane',
                releaseThreshold : 0,
                ignoreRefs       : 'children' // References in "children" should not be hoisted to the panel
            }
        };

        // Column headers (grouped columns wrapped in a group container). In vertical group mode the per-column headers
        // live inside each column, so the shared row is kept present but empty - a zero-height spacer that preserves the
        // header's top spacing (and the `bodyElement.syncIdMap.header` reference other code relies on).
        bodyConfig.children.push({
            tag   : 'header',
            id    : `${me.id}-column-headers`,
            class : {
                'b-task-board-column-headers' : 1
            },
            children : verticalGroups ? [] : me.mapColumnGroupItems(columns, column => me.renderColumnHeader(column, columns), `${me.id}-column-header`),
            dataset  : {
                lane          : 'header',
                domTransition : true
            },
            syncOptions : {
                syncIdField : 'column'
            }
        });

        // Vertical column groups are mutually exclusive with swimlanes, warn and ignore the swimlanes
        if (verticalGroups && me.swimlaneField) {
            me.warnColumnGroupsSwimlanes();
        }

        // There is always a swimlane, an implicit headerless one when not using swimlanes, and vertical groups always
        // render into that single default lane
        const lanes = me.hasSwimlanes && !verticalGroups ? swimlanes : [null];

        // Swimlanes
        for (const lane of lanes) {
            if (!lane?.hidden) {
                bodyConfig.children.push(me.renderSwimlane(lane, columns));
            }
        }

        me.populateBody({
            bodyConfig
        });

        me.isComposed = true;

        return bodyConfig;
    }

    // For chaining, to decorate dom config
    populateCard(args) {
        super.populateCard?.(args);
    }

    populateColumn(args) {
        super.populateColumn?.(args);
    }

    populateColumnHeader(args) {
        super.populateColumnHeader?.(args);
    }

    populateSwimlane(args) {
        super.populateSwimlane?.(args);
    }

    populateBody(args) {
        super.populateBody?.(args);
    }

    async recomposeInternal() {
        await super.recomposeInternal();

        // ChartItem needs to be updated even if there are no changes to the DOM
        !this.isDestroyed && this.updateItemsAfterRecompose();
    }

    afterRecompose() {
        super.afterRecompose();

        const me = this;

        if (!me.isInitiallyComposed && me.isComposed) {
            me.isInitiallyComposed = true;
            me.initialCompose();
        }

        if (me.project.taskStore.count > 0) {
            me.trigger('renderTasks', { taskRecords : me.project.taskStore.allRecords });
        }

        me.transitionRecompose = null;
    }

    // For chaining, replaces render() since we don't do full compose on render
    initialCompose() {
        this.trigger('initialCompose');
    }

    // For chaining, to react to element changes
    onRemoveColumnElement() {}

    onRenderSwimlane() {}

    onRemoveSwimlaneElement() {}

    //endregion

    //region Transition - experimental

    // Prevent dom transitions until resumed
    suspendDomTransition() {
        this.addCls('b-no-transitions');
        this.domTransitionSuspended++;
    }

    // Resume dom transitions
    resumeDomTransition() {
        this.domTransitionSuspended--;
        this.toggleCls('b-no-transitions', this.domTransitionSuspended > 0);
    }

    // Recompose transitioning dom
    recomposeWithDomTransition(options) {
        const me = this;

        if (me.useDomTransition && !me.domTransitionSuspended) {
            me.transitionRecompose = {
                selector : '[data-dom-transition]',
                duration : 300,
                element  : me._bodyElement, // _ needed to not flush recompose if we are dirty
                ...options
            };
        }

        // Transitioned recompose takes a bit of time, if we are requested to recompose again while it is ongoing,
        // we queue up another recompose to run after the transition is done
        if (me.recompose.suspended) {
            me._recomposeQueued = true;
        }
        else {
            me.recompose();
        }
    }

    resumeRecompose() {
        super.resumeRecompose();

        // Kick of another recompose if needed, see comment in recomposeWithDomTransition() above
        if (this._recomposeQueued) {
            this._recomposeQueued = null;
            this.recompose();
        }
    }

    //endregion

    //region Extract configs

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // It extracts the current configs for the task board, with special handling for columns
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        if (result.columns) {
            delete result.columns.modelClass;
        }

        return result;
    }

    //endregion

    // Also expected by CrudManagerView
    /**
     * Triggers a re-render of the task board from the current record data, without reloading.
     *
     * The re-render happens through {@link Core.widget.Widget#function-recompose}, which is scheduled for the next
     * animation frame.
     *
     * @category Rendering
     */
    refresh() {
        this.recompose();
    }
}

TaskBoardBase.initClass();
VersionHelper.setVersion('taskboard', '8.0.1');

