import TimelineBase from '../../Scheduler/view/TimelineBase.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Toast from '../../Core/widget/Toast.js';

import NewTaskRendering from './orientation/NewTaskRendering.js';

import CrudManagerView from '../../Scheduler/crud/mixin/CrudManagerView.js';
import CurrentConfig from '../../Scheduler/view/mixin/CurrentConfig.js';
import TransactionalFeatureMixin from '../../Scheduler/view/mixin/TransactionalFeatureMixin.js';
import ProjectProgressMixin from '../../Scheduler/view/mixin/ProjectProgressMixin.js';
import GanttDom from './mixin/GanttDom.js';
import GanttRegions from './mixin/GanttRegions.js';
import GanttScroll from './mixin/GanttScroll.js';
import GanttState from './mixin/GanttState.js';
import GanttStores from './mixin/GanttStores.js';
import GanttTimelineDateMapper from './mixin/GanttTimelineDateMapper.js';
import TaskNavigation from './mixin/TaskNavigation.js';

import EventNavigation from '../../Scheduler/view/mixin/EventNavigation.js';

import '../localization/En.js';
import '../column/TimeAxisColumn.js';
// For Gantt's configuration of GridSelection
import '../column/SequenceColumn.js';
import NameColumn from '../column/NameColumn.js';

// Always required features
import '../../Grid/feature/Tree.js';
import '../feature/Dependencies.js';


import { DependencyType } from '../../Engine/scheduling/Types.js';
import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttFeature from '../feature/GanttFeature.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';

DomHelper.loadStylesheet('Gantt/view/GanttBase.css');
DomHelper.loadStylesheet('Scheduler/view/EventStyles.css');
DomHelper.loadStylesheet('Gantt/view/TaskStyles.css');
DomHelper.loadStylesheet('Scheduler/view/Milestones.css');

// import Stylesheet from './GanttBase.css' with { type: 'css' };
// import EventStyles from '../../Scheduler/view/EventStyles.css' with { type: 'css' };
// import TaskStyles from './TaskStyles.css' with { type: 'css' };
// import Milestones from '../../Scheduler/view/Milestones.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'GanttBase');
// DomHelper.applyStylesheet(EventStyles, 'EventStyles');
// DomHelper.applyStylesheet(TaskStyles, 'TaskStyles');
// DomHelper.applyStylesheet(Milestones, 'Milestones');

/**
 * @module Gantt/view/GanttBase
 */

/**
 * The object form of {@link #config-scrollTaskIntoViewOnCellClick}. Accepts all
 * {@link Core.helper.util.Scroller#typedef-BryntumScrollOptions}, which are used to scroll the task bar into view, plus
 * a `minVisibleWidth` property. Options not passed default to `{ animate : true, block : 'center', y : false }`.
 * @typedef {BryntumScrollOptions} ScrollTaskIntoViewOnCellClickOptions
 * @property {Number} [minVisibleWidth=20] How many pixels of a task bar, counted from its start, that have to be
 * visible for the view to be left as is. A task bar narrower than this has to be fully visible.
 */

const
    emptyObject                   = Object.freeze({}),
    defaultCellClickScrollOptions = Object.freeze({
        animate         : true,
        block           : 'center',
        y               : false,
        minVisibleWidth : 20
    });

/**
 * A thin base class for {@link Gantt/view/Gantt}. Does not include any features by default, allowing smaller
 * custom-built bundles if used in place of {@link Gantt/view/Gantt}.
 *
 * @mixes Gantt/view/mixin/GanttDom
 * @mixes Gantt/view/mixin/GanttRegions
 * @mixes Gantt/view/mixin/GanttScroll
 * @mixes Gantt/view/mixin/GanttState
 * @mixes Gantt/view/mixin/GanttStores
 * @mixes Scheduler/crud/mixin/CrudManagerView
 * @mixes Scheduler/view/mixin/EventNavigation
 * @mixes Scheduler/view/mixin/TransactionalFeatureMixin
 * @mixes Gantt/view/mixin/TaskNavigation
 * @mixes Scheduler/view/mixin/ProjectProgressMixin
 * @mixes Scheduler/view/mixin/SchedulingIssueResolution
 *
 * @features Scheduler/feature/ColumnLines
 * @features Scheduler/feature/EventFilter
 * @features Scheduler/feature/HeaderZoom
 * @features Scheduler/feature/Labels
 * @features Scheduler/feature/NonWorkingTime
 * @features Scheduler/feature/Pan
 * @features Scheduler/feature/RowReorder
 * @features Scheduler/feature/ScheduleMenu
 * @features Scheduler/feature/ScheduleTooltip
 * @features Scheduler/feature/Summary
 * @features Scheduler/feature/TimeAxisHeaderMenu
 * @features Scheduler/feature/TimeRanges
 *
 * @features Scheduler/feature/PercentBar
 * @features Scheduler/feature/DependencyEdit
 * @features Scheduler/feature/DependencyMenu
 * @features Scheduler/feature/EventSegments
 * @features Scheduler/feature/TimeSpanHighlight
 *
 * @features Gantt/feature/AI
 * @features Gantt/feature/Baselines
 * @features Gantt/feature/CellEdit
 * @features Gantt/feature/CriticalPaths
 * @features Gantt/feature/Dependencies
 * @features Gantt/feature/Indicators
 * @features Gantt/feature/Labels
 * @features Gantt/feature/ParentArea
 * @features Gantt/feature/ProgressLine
 * @features Gantt/feature/ProjectEdit
 * @features Gantt/feature/ProjectLines
 * @features Gantt/feature/Rollups
 * @features Gantt/feature/ScrollButtons
 * @features Gantt/feature/BasicTaskEdit
 * @features Gantt/feature/Summary
 * @features Gantt/feature/TaskCopyPaste
 * @features Gantt/feature/TaskDrag
 * @features Gantt/feature/TaskDragCreate
 * @features Gantt/feature/TaskEdit
 * @features Gantt/feature/TaskMenu
 * @features Gantt/feature/TaskNonWorkingTime
 * @features Gantt/feature/TaskResize
 * @features Gantt/feature/TaskSegmentDrag
 * @features Gantt/feature/TaskSegmentResize
 * @features Gantt/feature/TaskTooltip
 * @features Gantt/feature/TimelineChart
 * @features Gantt/feature/TreeGroup
 * @features Gantt/feature/Versions
 *
 * @features Gantt/feature/export/MspExport
 * @features Gantt/feature/export/PdfExport
 * @features Gantt/feature/export/Print
 *
 * @hidefeatures Grid/feature/Group
 * @hidefeatures Grid/feature/GroupSummary
 * @hidefeatures Scheduler/feature/EventEdit
 *
 * @extends Scheduler/view/TimelineBase
 * @widget
 * @tier community
 */
export default class GanttBase extends TimelineBase.mixin(
    CrudManagerView,
    GanttDom,
    GanttRegions,
    GanttScroll,
    GanttStores,
    GanttState,
    GanttTimelineDateMapper,
    EventNavigation,
    TaskNavigation,
    ProjectProgressMixin,

    TransactionalFeatureMixin,
    CurrentConfig
) {

    /**
     * @hidefunctions highlightEvents, unhighlightEvents
     */

    //region Task interaction events

    /**
     * Triggered after a mousedown on a task bar.
     * @event taskMouseDown
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a mouseup on a task bar.
     * @event taskMouseUp
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a click on a task bar. When the click originated on a rollup element (see
     * {@link Gantt/feature/Rollups} feature), `taskRecord` is the rolled-up child task and
     * `isRollup` is `true`.
     * @event taskClick
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     * @param {Boolean} [isRollup] `true` when the interaction originated on a rollup element.
     * Only present when the {@link Gantt/feature/Rollups} feature is enabled.
     */

    /**
     * Triggered after a doubleclick on a task. When the doubleclick originated on a rollup
     * element (see {@link Gantt/feature/Rollups} feature), `taskRecord` is the rolled-up child
     * task and `isRollup` is `true`.
     * @event taskDblClick
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     * @param {Boolean} [isRollup] `true` when the interaction originated on a rollup element.
     * Only present when the {@link Gantt/feature/Rollups} feature is enabled.
     */

    /**
     * Triggered after a rightclick (or long press on a touch device) on a task. When the
     * interaction originated on a rollup element (see {@link Gantt/feature/Rollups} feature),
     * `taskRecord` is the rolled-up child task and `isRollup` is `true`.
     * @event taskContextMenu
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     * @param {Boolean} [isRollup] `true` when the interaction originated on a rollup element.
     * Only present when the {@link Gantt/feature/Rollups} feature is enabled.
     */

    /**
     * Triggered after a mouseover on a task.
     * @event taskMouseOver
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered for mouseout from a task.
     * @event taskMouseOut
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered when a keydown event is observed if there are selected tasks.
     * @event taskKeyDown
     * @param {Gantt.view.Gantt} source This Gantt
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {KeyboardEvent} event Browser event
     */

    /**
     * Triggered when a keyup event is observed if there are selected tasks.
     * @event taskKeyUp
     * @param {Gantt.view.Gantt} source This Gantt
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {KeyboardEvent} event Browser event
     */

    /**
     * Triggered when user clicks an empty area in the schedule.
     * @event scheduleClick
     * @param {Gantt.view.Gantt} source This Gantt
     * @param {Date} date Date at mouse position
     * @param {Scheduler.model.TimeSpan} tick A record which encapsulates the time axis tick clicked on.
     * @param {Number} tickIndex The index of the time axis tick clicked on.
     * @param {Date} tickStartDate The start date of the current time axis tick
     * @param {Date} tickEndDate The end date of the current time axis tick
     * @param {Grid.row.Row} row Row under the mouse
     * @param {Number} index Task index
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {MouseEvent} event Browser event
     */

    //endregion

    //region Other events

    /**
     * Task is rendered, its element is available in DOM.
     * @event renderTask
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Object} renderData Task render data
     * @param {Gantt.model.TaskModel} taskRecord Rendered task
     * @param {HTMLElement} element Task element
     */

    /**
     * Task is released, no longer in view/removed. A good spot for cleaning custom things added in a `renderTask`
     * listener up, if needed.
     * @event releaseTask
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Object} renderData Task render data
     * @param {Gantt.model.TaskModel} taskRecord Rendered task
     * @param {HTMLElement} element Task element
     */

    /**
     * Triggered when clicking a resource avatar or chip in the cells of the {@link Gantt.column.ResourceAssignmentColumn}.
     * @event resourceAssignmentClick
     * @param {Gantt.view.Gantt} source This Gantt
     * @param {Gantt.model.TaskModel} taskRecord Task record
     * @param {Gantt.model.ResourceModel} resourceRecord Resource record
     * @param {Event} event Browser event
     */
    //endregion

    // For documentation & typings purposes

    /**
     * Returns the dependency record for a DOM element
     *
     * *NOTE: Only available when the {@link Gantt/feature/Dependencies Dependencies} feature is enabled.*
     *
     * @function resolveDependencyRecord
     * @param {HTMLElement} element The dependency line element
     * @returns {Gantt.model.DependencyModel} The dependency record
     * @category Feature shortcuts
     */

    //endregion

    //region Config

    static $name = 'GanttBase';

    // Factoryable type name
    static type = 'ganttbase';

    // GanttFeature factory extends SchedulerFeature -> GridFeature,
    // enabling Gantt-specific feature overrides (e.g. Dependencies, AI) to be resolved first,
    // with fallback to parent product features.
    static get featureable() {
        return {
            factory   : GanttFeature,
            transform : GanttFeature.transformConfig
        };
    }

    static defaultConfig = {
        // data for the stores, in topological order
        calendars    : null,
        resources    : null,
        tasks        : null,
        dependencies : null,
        assignments  : null
    };

    static configurable = {
        /**
         * Configure as `true` to make the Gantt read-only, by disabling any UIs for modifying data.
         *
         * __Note that checks MUST always also be applied at the server side.__
         * @prp {Boolean} readOnly
         * @default false
         * @category Common
         */

        /**
         * The {@link Gantt.model.ProjectModel} instance containing the data visualized by the Gantt chart.
         * @member {Gantt.model.ProjectModel} project
         * @category Data
         */

        /**
         * A {@link Gantt.model.ProjectModel} instance or a config object. The project holds all Gantt data.
         * @config {Gantt.model.ProjectModel|ProjectModelConfig}
         * @category Data
         */
        project : null,

        /**
         * The file name of an image file to use when a resource has no image, or its image cannot be loaded.
         * @config {String}
         * @category Common
         */
        defaultResourceImageName : null,

        /**
         * The path for resource images, used by various widgets such as the resource assignment column.
         * @prp {String}
         * @category Common
         */
        resourceImagePath : null,

        /**
         * True to toggle the collapsed/expanded state when clicking a parent task bar.
         *
         * {@note} When enabling this config, collapse/expand operations triggered by taskbar click are delayed to check
         * if a double click has occurred, while clicking the row expander icon in the tree view will trigger the
         * operation immediately.{/@note}
         * @prp {Boolean}
         * @category Common
         * @default
         */
        toggleParentTasksOnClick : false,

        /**
         * True to scroll the task bar into view when clicking a cell, you can also pass a
         * {@link #function-scrollTaskIntoView scroll config} object. Options not passed default to an animated scroll
         * which centers the task bar horizontally, without scrolling vertically. No scrolling happens if the start of
         * the task bar and at least `minVisibleWidth` pixels of it (20 by default) are already visible.
         * @prp {Boolean|ScrollTaskIntoViewOnCellClickOptions}
         * @category Common
         * @default false
         */
        scrollTaskIntoViewOnCellClick : null,

        eventCls              : 'b-gantt-task',
        eventBarTextField     : null,
        eventLayout           : 'none',
        eventSelectionDisable : true,

        /**
         * Task color used by default. Tasks can specify their own {@link Gantt.model.TaskModel#field-eventColor},
         * which will override this config.
         *
         * For available standard colors, see
         * {@link Core/Base#typedef-Color}.
         *
         * @prp {Color} eventColor
         * @category Scheduled events
         */
        eventColor              : null,
        eventStyle              : 'gantt',
        rowHeight               : 45,
        scheduledEventName      : 'task',
        eventScrollMode         : 'move',
        overScheduledEventClass : 'b-gantt-task-hover',
        mode                    : 'horizontal',
        fixedRowHeight          : true,

        timeCellCls : 'b-sch-time-axis-cell',

        // <remove-on-release>
        // TODO: This will be brought in by the TaskNavigation mixin when it is implemented
        // </remove-on-release>
        focusCls : 'b-active',

        /**
         * An empty function by default, but provided so that you can override it. This function is called each time
         * a task is rendered into the gantt to render the contents of the task.
         *
         * Returning a string will display it in the task bar, it accepts both plain text or HTML. It is also possible
         * to return a DOM config object which will be synced to the task bars content.
         *
         * {@note}You should never modify any records inside this method.{/@note}
         *
         * ```javascript
         * // using plain string
         * new Gantt({
         *    taskRenderer : ({ taskRecord }) => StringHelper.encodeHtml(taskRecord.name)
         * });
         *
         * // using html string
         * new Gantt({
         *    taskRenderer : ({ taskRecord }) => StringHelper.xss`${taskRecord.id} <b>${taskRecord.name}</b>`
         * });
         *
         * // using DOM config
         * new Gantt({
         *    taskRenderer({ taskRecord }) {
         *       return {
         *           tag  : 'b',
         *           html : StringHelper.encodeHtml(taskRecord.name)
         *       }
         *    }
         * });
         * ```
         *
         * ## Task bar DOM ids and `aria-owns`
         *
         * Each task bar wrap element gets a DOM id combining the gantt's id and the task id, `myGanttId_task_11`
         * for the task `11`.
         *
         * The row's time axis cell names the id of the bar rendered in it in its `aria-owns` attribute, which is how
         * assistive technology links the bar to the task, since it is rendered in a canvas outside the cell. A row
         * whose task has no bar, for example one scheduled outside the time axis, has no `aria-owns`.
         *
         * {@note}Characters which are invalid in a DOM id are removed, so task ids differing only in those get
         * colliding bar ids.{/@note}
         *
         * @param {Object} context An object containing the information needed to render a Task
         * @param {Gantt.model.TaskModel} context.taskRecord The task record
         * @param {Object} context.renderData An object containing details about the task rendering
         * @param {Core.helper.util.DomClassList|String} context.renderData.cls An object whose property names represent
         *   the CSS class names to be added to the tasks's element. Set a property's value to truthy or falsy to add or
         *   remove the class name based on the property name. Using this technique, you do not have to know whether the
         *   class is already there, or deal with concatenation
         * @param {String|Object<String,String>} context.renderData.style Inline styles for the task bar DOM element.
         *   Use either `'border: 1px solid black' or { border: '1px solid black' }`
         * @param {Core.helper.util.DomClassList|String} context.renderData.wrapperCls An object whose property names
         *   represent the CSS class names to be added to the event wrapper element. Set a property's value to truthy or
         *   falsy to add or remove the class name based on the property name. Using this technique, you do not have to
         *   know whether the class is already there, or deal with concatenation
         * @param {Core.helper.util.DomClassList|String} context.renderData.iconCls An object whose property names
         *   represent the CSS class names to be added to a task icon element
         * @param {Scheduler.model.TimeSpan[]|TimeSpanConfig[]} indicators An array that can be populated with
         *   `TimeSpan` records or their config objects to have them rendered in the task row
         *
         * ### Using JSX (React)
         *
         * When using the Bryntum React wrapper, the task renderer can return JSX elements:
         *
         * ```javascript
         * taskRenderer({ taskRecord, renderData }) {
         *     return <MyTaskComponent task={taskRecord} />;
         * }
         * ```
         *
         * {@note}Using JSX in the task renderer creates a React portal for each rendered task. For
         * Gantt charts with many visible tasks or frequently re-rendered views, this may impact scrolling performance
         * compared to returning plain strings or {@link DomConfig} objects. Consider using JSX primarily for tasks
         * that require complex interactive React components.{/@note}
         *
         * @returns {String|DomConfig|DomConfig[]} A simple string, or a `DomConfig` object defining the actual HTML
         * @config {Function}
         * @category Scheduled events
         */
        taskRenderer : null,

        /**
         * A callback function or a set of `name: value` properties to apply on tasks created using the task context menu.
         * Be aware that `name` value will be ignored since it's auto generated and may be configured with localization.
         *
         * Example:
         * ```javascript
         * // Object form:
         * newTaskDefaults : {
         *    duration          : 3,
         *    manuallyScheduled : true,
         *    percentDone       : 15
         * }
         * ```
         *
         * ```javascript
         * // Function form:
         * newTaskDefaults : (targetRecord) => {
         *    return {
         *        duration          : targetRecord.duration,
         *        manuallyScheduled : targetRecord.manuallyScheduled
         *    }
         * }
         * ```
         * @config {Gantt.model.TaskModelConfig|Object|Function}
         * @param {Gantt.model.TaskModel} task Reference task
         * @returns {Gantt.model.TaskModelConfig|Object} Set of properties to apply on tasks created using the task context menu
         */
        newTaskDefaults : {},

        /**
         * Auto-increment counter used to generate names for new tasks created via the UI (e.g. "New task 1",
         * "New task 2"). Incremented each time a new task is added using the context menu. You can set or reset
         * this value, for example when switching projects.
         * @prp {Number}
         * @default 0
         */
        newTaskCounter : 0,

        /**
         * A task field (id, wbsCode, sequenceNumber etc) that will be used when displaying and editing linked tasks.
         * @config {String} dependencyIdField
         * @default 'id'
         * @category Common
         */
        dependencyIdField : 'id',

        /**
         * Returns dates that will constrain resize and drag operations. The method will be called with the
         * task being dragged.
         * @config {Function}
         * @param {Gantt.model.TaskModel} taskRecord The task record being moved or resized.
         * @returns {DateConstraint} Constraining object containing `start` and `end` constraints. Omitting either
         *   will mean that end is not constrained. So you can prevent a resize or move from moving *before*
         *   a certain time while not constraining the end date.
         * @category Scheduled events
         */
        getDateConstraints : null,

        /**
         * If set to `true` this will show a color field in the {@link Gantt.feature.TaskEdit} editor and also a
         * picker in the {@link Gantt.feature.TaskMenu}. Both enables the user to choose a color which will be
         * applied to the task bar's background. See TaskModel's {@link Gantt.model.TaskModel#field-eventColor}
         * config.
         * @config {Boolean}
         * @default false
         * @category Misc
         */
        showTaskColorPickers : null,

        /**
         * If set to `true` this will:
         *
         * - show cost, quantity and rate table columns on the task editor "Resources" tab
         * - show "Rate table" columns in the assignment column editor picker
         * - include "Cost" column in the "Add new..." column dropdown list
         *
         * @config {Boolean}
         * @default false
         * @category Misc
         */
        showCostControls : false,

        /**
         * See {@link Gantt.view.Gantt#keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>}
         * @category Common
         */
        keyMap : {
            'Alt+Shift+ArrowLeft'  : 'outdent',
            'Alt+Shift+ArrowRight' : 'indent'
        },

        /**
         * Specify as `false` to not show unscheduled tasks on the Gantt chart. Unscheduled tasks will be rendered as
         * an icon
         * @prp {Boolean}
         * @category Common
         * @default true
         */
        showUnscheduledTasks : true,

        /**
         * Configure UI transitions for various actions in the grid.
         * @prp {Object}
         * @property {Boolean} insertRecord Transition record insertions
         * @property {Boolean} removeRecord Transition record removals
         * @property {Boolean} toggleColumn Transition column visibility changes
         * @property {Boolean} expandCollapseColumn Transition parent/group column expand/collapse
         * @property {Boolean} toggleRegion Transition region expand/collapse
         * @property {Boolean} toggleTreeNode Transition tree node expand/collapse
         * @property {Boolean} toggleGroup Transition group expand/collapse
         * @property {Boolean} filterRemoval Transition row removals caused by filtering (under specific conditions)
         * @property {Boolean} removeEvent Transition task removals
         * @property {Boolean} changeEvent Transition task changes
         */
        transition : {
            removeEvent : true,
            changeEvent : true
        },

        /**
         * Set to `true` for sub tasks to inherit their parent´s `eventColor`
         * @prp {Boolean}
         */
        inheritEventColor : null
    };

    static bindStoreChangeset = false;

    get isGantt() {
        return true;
    }

    //endregion

    //region Init

    construct(config = {}) {
        const
            me              = this,
            hasInlineStores = Boolean(config.calendars || config.taskStore || config.dependencyStore || config.resourceStore || config.assignmentStore),
            hasInlineData   = Boolean(config.calendars || config.tasks || config.dependencies || config.resources || config.assignments);

        // <remove-on-release>
        // TODO: Config system to be enhanced to merge object properties from the hierarchy's
        // defaultConfig set so that each class level could just declare the features it requires.
        // </remove-on-release>
        if (!config.features) {
            const defaults = me.getDefaultConfiguration().features;
            config.features = defaults && typeof defaults === 'object' ? defaults : {};
        }

        // gantt is always a tree
        if (!('tree' in config.features)) {
            config.features.tree = true;
        }

        // disable group feature by default
        if (!('group' in config.features)) {
            config.features.group = false;
        }

        const { project } = config;

        if (project && (hasInlineStores || hasInlineData)) {
            throw new Error('Providing both project and inline data is not supported');
        }

        // gather all data in the ProjectModel instance
        if (!project?.isModel) {
            config.project = ObjectHelper.assign({
                calendars    : config.calendars,
                events       : config.tasks,
                dependencies : config.dependencies,
                resources    : config.resources,
                assignments  : config.assignments,

                resourceStore   : config.resourceStore,
                eventStore      : config.taskStore,
                assignmentStore : config.assignmentStore,
                dependencyStore : config.dependencyStore,
                timeRangeStore  : config.timeRangeStore
            }, project);

            delete config.resourceStore;
            delete config.taskStore;
            delete config.assignmentStore;
            delete config.dependencyStore;
            delete config.timeRangeStore;

            delete config.calendars;
            delete config.resources;
            delete config.tasks;
            delete config.assignments;
            delete config.dependencies;
        }
        // EOF data gathering

        super.construct(config);

        me.ion({
            taskclick    : 'onTaskBarClick',
            taskdblclick : 'onTaskDblClick',
            cellClick    : 'onNonTimeAxisCellClick',
            toggleNode   : 'onToggleParentNode'
        });
    }

    doDestroy() {
        // Drop the dangling indent/outdent serialization chain
        this.indentOutdentChain = null;

        super.doDestroy();
    }

    changeColumns(columns, currentStore) {
        if (!this.isDestroying) {
            columns = columns || [];
        }

        if (columns?.length > 0 || (this.isConstructing && !this.initialConfig.columns)) {
            let cols = columns;

            if (!Array.isArray(columns)) {
                cols = columns.data;

                // Need to pull the taskstore in, to make sure any fields added by columns are added to it
                this._thisIsAUsedExpression(this.taskStore);
            }

            // Always include the name column
            if (!cols.some(column => {
                const constructor = column instanceof Column ? column.constructor : ColumnStore.getColumnClass(column.type) || Column;

                return constructor === NameColumn || constructor.prototype instanceof NameColumn;
            })) {
                cols.unshift({
                    type : 'name'
                });
            }
        }

        return super.changeColumns(columns, currentStore);
    }

    updateTaskRenderer() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    updateShowUnscheduledTasks(value) {
        if (!this.isConfiguring) {
            this.refreshRows();
        }

        // Setting this flag on project as we need to add duration to unscheduled tasks which
        // have incoming dependencies at Engine level only when showUnscheduledTasks is true
        this.project._showUnscheduledTasks = value;
    }

    // Overrides TimelineBase to supply taskStore as its store (which is only used in passed events)
    set timeAxisViewModel(timeAxisViewModel) {
        super.timeAxisViewModel = timeAxisViewModel;

        if (this.store && timeAxisViewModel) {
            timeAxisViewModel.store = this.store;
        }
    }

    get timeAxisViewModel() {
        return super.timeAxisViewModel;
    }

    updateInheritEventColor() {
        if (!this.isConfiguring) {
            this.refreshWithTransition();
        }
    }

    //endregion

    //region Events

    resumeRefresh(trigger = true, useTransitions = true) {

        super.resumeRefresh(false);

        if (!this.refreshSuspended && trigger && this.isPainted) {
            if (!this.rowManager.topRow) {
                // <remove-on-release>
                // TODO: investigate why we need this
                // </remove-on-release>
                this.rowManager.reinitialize();
            }
            else {
                this.refreshWithTransition(undefined, useTransitions);
            }
        }
    }

    // <remove-on-release>
    // TODO: scheduler doesn't need that code and it shouldn't be needed in gantt too
    // </remove-on-release>
    // Overriding grids behaviour to ignore individual updates caused by propagation
    onStoreUpdateRecord(params) {
        if (!this.project.isChangeTrackingSuspended) {
            let result;

            this.runWithTransition(() => {
                result = super.onStoreUpdateRecord(params);
            }, !this.refreshSuspended);

            return result;
        }
    }

    // Transition batch changes
    onStoreDataChange(params) {
        this.runWithTransition(() => {
            super.onStoreDataChange(params);
        }, params.action === 'batch');
    }

    // Features can hook into this to add to generated task data
    onTaskDataGenerated() {}

    // Features can hook into this to manipulate visible task configs before they are DomSynced
    onBeforeTaskSync() {}

    onTaskBarClick({ taskRecord }) {
        if (this.toggleParentTasksOnClick && !taskRecord.isLeaf) {
            // Delay the collapse/expand to allow double-click detection
            // cancelOutstanding automatically clears any pending timeout with the same name
            this.setTimeout({
                fn                : () => this.toggleCollapse(taskRecord),
                delay             : EventHelper.dblClickTime,
                name              : 'collapseTask',
                cancelOutstanding : true
            });
        }
    }

    // Add a handler for taskDblClick to cancel pending collapse
    onTaskDblClick() {
        // Cancel any pending collapse/expand action
        this.clearTimeout('collapseTask');
    }

    changeScrollTaskIntoViewOnCellClick(scrollTaskIntoViewOnCellClick) {
        if (scrollTaskIntoViewOnCellClick === true) {
            return defaultCellClickScrollOptions;
        }

        return scrollTaskIntoViewOnCellClick && { ...defaultCellClickScrollOptions, ...scrollTaskIntoViewOnCellClick };
    }

    onNonTimeAxisCellClick({ record, column }) {
        const { scrollTaskIntoViewOnCellClick } = this;

        if (column.type !== 'timeAxis' && scrollTaskIntoViewOnCellClick && record.isScheduled) {
            const { minVisibleWidth, ...scrollOptions } = scrollTaskIntoViewOnCellClick;

            if (!this.isTaskBarInView(record, minVisibleWidth)) {
                this.scrollTaskIntoView(record, scrollOptions);
            }
        }
    }

    // A task bar is in view when its start and minVisibleWidth of it (all of it, if narrower) are visible. Measures
    // the rendered bar, a milestone's box has no width. A bar outside of the rendered range is not in view
    isTaskBarInView(taskRecord, minVisibleWidth) {
        const
            me          = this,
            taskElement = me.getElementFromTaskRecord(taskRecord);

        if (!taskElement) {
            return false;
        }

        const
            { left, right, width }                 = Rectangle.from(taskElement),
            { left : viewLeft, right : viewRight } = me.timeAxisSubGrid.scrollable.viewport,
            startVisible                           = me.rtl ? right <= viewRight : left >= viewLeft,
            visibleWidth                           = Math.min(right, viewRight) - Math.max(left, viewLeft);

        return startVisible && visibleWidth >= Math.min(width, minVisibleWidth);
    }

    onToggleParentNode({ record }) {
        // Repaint parent node on collapse / expand (unless in a collapsed parent, happens on collapse all)
        record.parent?.isExpanded(this.taskStore) && this.taskRendering.redraw(record);
    }

    // Keeps task bars in sync with the grid selection, also during drag select
    refreshGridSelectionUI(selectionChange) {
        const
            me                                     = this,
            { selectedRecords, deselectedRecords } = selectionChange;

        super.refreshGridSelectionUI(selectionChange);

        function setTaskSelection(record, selected) {
            const taskElement = me.getElementFromTaskRecord(record);
            if (taskElement) {
                DomSync[selected ? 'addCls' : 'removeCls']('b-selected', taskElement.parentElement);
                DomSync[selected ? 'addCls' : 'removeCls']('b-task-selected', taskElement);
            }
        }

        selectedRecords?.forEach(record => setTaskSelection(record, true));
        deselectedRecords?.forEach(record => setTaskSelection(record, false));
    }

    beforeAnimatedRowRemoval(ids) {
        if (ids) {
            for (const id of ids) {
                // Querying DOM here, since task might be gone from store already
                const taskElements = this.foregroundCanvas.querySelectorAll(`.b-gantt-task-wrap[data-task-id="${id}"]`);
                for (const element of taskElements) {
                    element.retainElement = 'remove';
                    element.transitionRemove = true;
                }
            }
        }
    }

    // Called from RowManager when animating removal / toggling of rows.
    // We need to refresh events to match (and transition to) rows new positions
    afterAnimatedRowRemoval() {
        this.currentOrientation.refreshEvents();
    }

    //endregion

    //region TimelineBase implementations

    // Overrides grid to take project loading into account
    toggleEmptyText() {
        const me = this;

        if (me.rowManager) {
            DomHelper.toggleClasses(me.element, 'b-grid-empty', !(me.rowManager.rowCount || me.project.isLoadingOrSyncing));
        }
    }

    // Gantt only has one orientation, but TimelineBase expects this to work to call correct rendering code
    get currentOrientation() {
        const me = this;

        if (!me._currentOrientation) {
            me.taskRendering = me._currentOrientation = new NewTaskRendering(me);
        }

        return me._currentOrientation;
    }

    getTimeSpanMouseEventParams(taskElement, event) {
        const taskRecord = this.resolveTaskRecord(taskElement);

        return !taskRecord ? null : {
            taskRecord,
            taskElement,
            event
        };
    }

    getScheduleMouseEventParams(cellData) {
        return {
            taskRecord : this.store.getById(cellData.id)
        };
    }

    // Used by shared features to resolve an event or task
    resolveTimeSpanRecord(element) {
        return this.resolveTaskRecord(element);
    }

    repaintEventsForResource(taskRecord) {
        this.taskRendering.redraw(taskRecord);
    }

    // Used by the dependencies feature to keep it orientation (vertical, horizontal) independent
    get visibleResources() {
        return {
            first : this.store.getById(this.firstVisibleRow?.id),
            last  : this.store.getById(this.lastVisibleRow?.id)
        };
    }

    /**
     * Returns a start date for rendering/caching the given task. Falls back through
     * the task's parent chain, then the project, then the Gantt itself so unscheduled tasks
     * still have a finite position for cell-cache indexing and placeholder rendering.
     *
     * @param {Gantt.model.TaskModel} task
     * @param {Boolean} [inMilliseconds] If `true`, returns the millisecond timestamp instead of a `Date`.
     * @returns {Date|Number}
     * @category Scheduling
     * @internal
     */
    getTaskStartDate(task, inMilliseconds) {
        const me = this;

        if (inMilliseconds) {
            // `project.startDate` may be a raw, non-Date value during engine calculations — use `getTime?.()`.
            return task.startDateMS ?? (task.parent && me.getTaskStartDate(task.parent, true)) ?? me.project.startDate?.getTime?.() ?? me.startDate?.getTime?.();
        }

        // Date branch — return existing `Date` instances directly to avoid a `Date` → ms → `Date` round-trip.
        return task.startDate ?? (task.parent && me.getTaskStartDate(task.parent)) ?? me.project.startDate ?? me.startDate;
    }

    /**
     * Returns an end date for rendering/caching the given task. Falls back to
     * `getTaskStartDate(task) + 1` so unscheduled tasks still have a finite, ordered
     * range for cell-cache indexing and placeholder rendering.
     *
     * @param {Gantt.model.TaskModel} task
     * @param {Boolean} [inMilliseconds] If `true`, returns the millisecond timestamp instead of a `Date`.
     * @returns {Date|Number}
     * @category Scheduling
     * @internal
     */
    getTaskEndDate(task, inMilliseconds) {
        if (inMilliseconds) {
            return task.endDateMS ?? (this.getTaskStartDate(task, true) + 1);
        }

        // Date branch — return the existing `endDate` directly, else a `Date` 1ms after the resolved start.
        if (task.endDate) {
            return task.endDate;
        }

        const startMS = this.getTaskStartDate(task, true);

        return startMS != null ? new Date(startMS + 1) : undefined;
    }

    render(...args) {
        super.render(...args);

        this._foregroundCanvas.style.setProperty('--b-event-size', this.rowHeight - this.resourceMarginObject.total);
    }

    //endregion

    //region Feature hooks

    /**
     * Populates the task context menu. Chained in features to add menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown.
     * @param {Gantt.model.TaskModel} options.taskRecord The reference task record
     * @param {Scheduler.model.ResourceModel} options.resourceRecord The context resource.
     * @param {Scheduler.model.AssignmentModel} options.assignmentRecord The context assignment if any.
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items.
     * @internal
     */
    populateTaskMenu() {}

    //endregion

    // region ContextMenu API

    async addTask(referenceTask, options = emptyObject) {
        const
            me          = this,
            {
                milestone,
                asPredecessor,
                asSuccessor
            } = options,
            { project } = me,
            parent      = referenceTask.parent,
            defaults    = typeof me.newTaskDefaults == 'function' ? me.newTaskDefaults(referenceTask) : me.newTaskDefaults,
            newRecord   = me.taskStore.createRecord(ObjectHelper.assign({
                // use reference task values only if not provided in newTaskDefaults
                startDate    : referenceTask.startDate,
                duration     : referenceTask.duration,
                durationUnit : referenceTask.durationUnit,
                name         : null
            }, defaults, options.data));

        /**
         * Fires when adding a task from the UI to allow data mutation.
         * @event beforeTaskAdd
         * @param {Gantt.view.Gantt} source The Gantt instance
         * @param {Gantt.model.TaskModel} taskRecord The task
         */
        me.trigger('beforeTaskAdd', { taskRecord : newRecord });

        if (newRecord.name == null) {
            newRecord.name = `${me.L(milestone ? 'L{Gantt.New milestone}' : 'L{Gantt.New task}')} ${++me.newTaskCounter}`;
        }

        project.suspendChangeTracking();

        if (options.asChild) {
            referenceTask.insertChild(newRecord, options.at === 'end' ? null : referenceTask.firstChild);
        }
        else if (options.above) {
            // https://github.com/bryntum/bryntum/issues/11423 - use orderedBeforeNode
            // to ensure correct position in ordered tree (unaffected by filtering)
            parent.insertChild(newRecord, referenceTask, false, { orderedBeforeNode : referenceTask });
        }
        else {
            // https://github.com/bryntum/bryntum/issues/7220
            // https://github.com/bryntum/bryntum/issues/11423 - use orderedBeforeNode
            // to ensure correct position in ordered tree (unaffected by filtering).
            // nextOrderedSibling places the new task immediately after referenceTask.
            parent.insertChild(
                newRecord,
                referenceTask.nextSibling,
                false,
                { orderedBeforeNode : referenceTask.nextOrderedSibling });
        }

        // Do not trigger change check, we've added a new record so project will trigger event anyway
        project.resumeChangeTracking(true);

        if (milestone) {
            // This would schedule a commit, but we don't need for it to finish before adding new dependency
            newRecord.convertToMilestone();
        }

        // run propagation to handle the new task record
        // and then add a dependency if needed
        if (asSuccessor) {
            me.dependencyStore.add({
                fromEvent : referenceTask.$original,
                toEvent   : newRecord,
                type      : DependencyType.EndToStart,
                fromSide  : 'right',
                toSide    : 'left'
            });
        }
        else if (asPredecessor) {
            me.dependencyStore.add({
                fromEvent : newRecord,
                toEvent   : referenceTask.$original,
                type      : DependencyType.EndToStart,
                fromSide  : 'right',
                toSide    : 'left'
            });
        }

        await project.commitAsync();

        return newRecord;
    }

    /**
     * Adds a new task above the passed reference task. If no options are provided, the new task will inherit
     * the data from the reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @on-queue
     * @async
     */
    addTaskAbove(taskRecord, options) {
        if (this.transactionalFeaturesEnabled) {
            return this.project.queue(() => this.addTask(taskRecord, { ...options, above : true }));
        }

        return this.addTask(taskRecord, { ...options, above : true });
    }

    /**
     * Adds a new task below the passed reference task. If no options are provided, the new task will inherit
     * the data from the reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @on-queue
     * @async
     */
    addTaskBelow(taskRecord, options) {
        if (this.transactionalFeaturesEnabled) {
            return this.project.queue(() => this.addTask(taskRecord, options));
        }

        return this.addTask(taskRecord, options);
    }

    /**
     * Adds a new milestone task below the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new milestone
     * @param {TaskModelConfig} [options.data] Data for the new milestone
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @on-queue
     * @async
     */
    addMilestoneBelow(taskRecord, options) {
        if (this.transactionalFeaturesEnabled) {
            return this.project.queue(() => this.addTask(taskRecord, { ...options, milestone : true }));
        }

        return this.addTask(taskRecord, { ...options, milestone : true });
    }

    doAddSubtask(taskRecord, options) {
        const promise = this.addTask(taskRecord, { ...options, asChild : true });

        this.toggleCollapse(taskRecord, false);

        return promise;
    }

    /**
     * Adds a new subtask to the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new subtask
     * @param {'start'|'end'} [options.at='start'] Where to insert the new subtask in the parent's children.
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @on-queue
     * @async
     */
    addSubtask(taskRecord, options) {
        if (this.transactionalFeaturesEnabled) {
            return this.project.queue(async() => {
                await this.doAddSubtask(taskRecord, options);
                this.project.stm.stopTransaction();
            });
        }
        else {
            return this.doAddSubtask(taskRecord, options);
        }
    }

    /**
     * Adds a successor task to the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @on-queue
     * @async
     */
    addSuccessor(taskRecord, options) {
        if (this.transactionalFeaturesEnabled) {
            this.project.queue(() => this.addTask(taskRecord, { ...options, asSuccessor : true }));
        }
        else {
            return this.addTask(taskRecord, { ...options, asSuccessor : true });
        }
    }

    /**
     * Adds a predecessor task to the passed reference task
     * @param {Gantt.model.TaskModel} taskRecord The reference task record
     * @param {Object} [options] Options for creating the new task
     * @param {TaskModelConfig} [options.data] Data for the new task
     * @returns {Gantt.model.TaskModel} A promise which yields the added task
     * @on-queue
     * @async
     */
    addPredecessor(taskRecord, options) {
        if (this.transactionalFeaturesEnabled) {
            return this.project.queue(() => this.addTask(taskRecord, { ...options, above : true, asPredecessor : true }));
        }
        else {
            return this.addTask(taskRecord, { ...options, above : true, asPredecessor : true });
        }
    }

    /**
     * Shared body for {@link #function-indent}/{@link #function-outdent}. The await ordering is
     * load-bearing and must not be reordered.
     * @param {'indent'|'outdent'} operation The taskStore method to invoke
     * @param {Number[]|String[]} taskIds Ids of the tasks to indent/outdent
     * @private
     */
    async doIndentOutdent(operation, taskIds) {
        const me = this;

        if (me.isTreeGrouped) {
            return;
        }

        // Might be indenting or outdenting already
        await me.project.commitAsync();

        if (me.isDestroyed) {
            return;
        }

        // Re-fetch live records by id after the commit boundary, skipping any removed by earlier queued operations
        const tasks = me.taskStore.getByIds(taskIds);

        if (!tasks.length) {
            return;
        }

        const result = await me.taskStore[operation](tasks.map(task => task.$original));

        // Fully drain the engine commit so the next serialized indent/outdent does not re-enter
        // propagation while this one's writes are still committing
        while (!me.isDestroyed && me.project.replica?.isCommitting) {
            await me.project.commitAsync();
        }

        if (me.isDestroyed) {
            return result;
        }

        // If `false`, the scheduling engine has found a reason that the operation could not happen.
        if (!result) {
            Toast.show({
                rootElement : me.rootElement,
                html        : me.L('L{Gantt.changeRejected}')
            });
        }

        return result;
    }

    /**
     * Resolves the passed task(s) to ids and runs the indent/outdent operation, queued on the project when
     * transactional features are enabled and otherwise serialized through a promise chain, so that rapid successive
     * calls never re-enter the engine's non-reentrant propagation.
     * @param {'indent'|'outdent'} operation The taskStore method to invoke
     * @param {Gantt.model.TaskModel[]|Gantt.model.TaskModel|Event} [tasks] The task(s) to indent/outdent
     * @returns {Promise} A promise which resolves if operation is successful
     * @private
     */
    indentOutdent(operation, tasks) {
        const me = this;

        // Evaluate the tree-grouped guard synchronously, at call time (see indent() for the rationale) (#13296)
        if (me.isTreeGrouped) {
            return;
        }

        // Resolve to ids at enqueue time; the queued callback re-fetches live records
        const taskIds = me.resolveTaskIds(tasks);

        if (me.transactionalFeaturesEnabled) {
            return me.project.queue(() => me.doIndentOutdent(operation, taskIds));
        }

        // Non-transactional path: serialize through a promise chain shared by indent and outdent, so that an indent
        // and an outdent fired back-to-back also serialize relative to each other
        const result = (me.indentOutdentChain || Promise.resolve())
            .then(() => me.isDestroyed ? undefined : me.doIndentOutdent(operation, taskIds));

        // `result` is what the caller receives, so a rejection from this operation is still delivered to it. The
        // chain itself continues from a caught copy so that one failed operation does not make every subsequent
        // indent/outdent reject without running (same pattern as Engine's Queue, backing `project.queue()` above)
        me.indentOutdentChain = result.catch(() => {});

        return result;
    }

    /**
     * Increase the indentation level of one or more tasks in the tree. Has no effect if {@link Gantt.feature.TreeGroup}
     * has regrouped the tree.
     * @param {Gantt.model.TaskModel[]|Gantt.model.TaskModel} tasks The task(s) to indent.
     * @returns {Promise} A promise which resolves if operation is successful
     * @on-queue
     */
    async indent(tasks) {
        return this.indentOutdent('indent', tasks);
    }

    /**
     * Decrease the indentation level of one or more tasks in the tree. Has no effect if {@link Gantt.feature.TreeGroup}
     * has regrouped the tree.
     *
     * @param {Gantt.model.TaskModel[]|Gantt.model.TaskModel} tasks The task(s) to outdent.
     * @returns {Promise} A promise which resolves if operation is successful
     * @on-queue
     */
    async outdent(tasks) {
        return this.indentOutdent('outdent', tasks);
    }

    /**
     * Resolves the indent/outdent argument to a stable array of task ids, avoiding record references that
     * earlier queued operations may invalidate.
     * @param {Gantt.model.TaskModel|Gantt.model.TaskModel[]|Event} [tasks] A single task record, an array of
     * task records, or a DOM event / no argument (falls back to {@link #property-selectedRecords}).
     * @returns {Number[]|String[]} An array of task ids
     * @private
     * @internal
     */
    resolveTaskIds(tasks) {
        // If called by keyboard shortcut
        if (!tasks || DomHelper.isDOMEvent(tasks)) {
            tasks = this.selectedRecords;
        }

        // Use the *original* id ($originalId), not the record's own id. When indenting/outdenting from a chained
        // display store the passed records are links whose `id` is a generated `<id>_link_<n>` value that does not
        // exist in `taskStore`; `getByIds` would then resolve nothing and the operation would silently no-op
        return ArrayHelper.asArray(tasks).map(task => task.$originalId);
    }

    // endregion

    // the 4 methods below are required since super cannot be called from GanttDom mixin

    onElementKeyDown(event) {
        super.onElementKeyDown(event);
    }

    onElementKeyUp(event) {
        super.onElementKeyUp(event);
    }

    onElementMouseOver(event) {
        super.onElementMouseOver(event);
    }

    onElementMouseOut(event) {
        super.onElementMouseOut(event);
    }

    onStoreAdd(event) {
        !event.isExpand && DomHelper.addTemporaryClass(this.element, 'b-no-transitions', 200, this);

        super.onStoreAdd(event);
    }

    beforeRenderRow(data) {
        super.beforeRenderRow(data);

        data.cls['b-inactive'] = data.record.inactive;
    }

    /**
     * Highlights the elements of the passed task records (or ids). If `scrollToClosest` is set to `true` (which it is
     * by default), the highlighted task element closest to the viewport center will be scrolled into view.
     *
     * The highlighting will be done by adding the css class `b-highlighted` to the highlighted task elements. Also,
     * the css class `b-is-highlighting` will be added to the `TimeAxisSubGrid` element.
     *
     * ```javascript
     * // Highlight a single task
     * gantt.highlightTasks({ tasks : 22 });
     * // Highlight multiple tasks
     * gantt.highlightTasks({ tasks : [1, 40] });
     * // Don't scroll to highlighted task and don't un-highlight on click
     * gantt.highlightTasks({ tasks : 1000, scroll : false, unhighlightOnClick : false });
     * ```
     *
     * @param {Object} options Options config object
     * @param {Gantt.model.TaskModel|Number|String|Gantt.model.TaskModel[]|Number[]|String[]} options.tasks
     * The task records or ids to highlight. If an empty array is passed, the `b-is-highlighting` class will be applied,
     * rendering all event elements in the style of `:not(.b-highlighted)`.
     * @param {Boolean|BryntumScrollOptions} [options.scroll] If `false`, no scrolling will be performed. If a
     * scrollOptions object, this object will be passed to the scroll function providing details on how to scroll.
     * @param {Boolean} [options.unhighlightOnClick] If `false`, a call to {@link #function-unhighlightTasks} is needed
     * to remove the highlighting. Otherwise, the highlighting will be removed when the user clicks somewhere in the
     * browser window.
     * @param {Boolean} [options.unhighlightOthers] If `true` this will automatically un-highlight the tasks not
     * present in the `tasks` property
     * @category Misc
     */
    highlightTasks(...args) {
        if (args?.[0]?.tasks) {
            args[0].events = args[0].tasks;
        }
        this.highlightEvents(...args);
    }

    /**
     * Removes highlighting from the elements of the passed task records (or ids). If no tasks are passed all
     * highlighted tasks will be un-highlighted.
     *
     * ```javascript
     * gantt.unhighlightTasks({ tasks : 22 }); // single task
     * gantt.unhighlightTasks({ tasks : [1, 40] }); // multiple events
     * ```
     *
     * @param {Object} [options] Options config object
     * @param {Gantt.model.TaskModel|Number|String|Gantt.model.TaskModel[]|Number[]|String[]} [options.tasks]
     * The task records or ids to un-highlight. Omit this to un-highlight all.
     * @category Misc
     */
    unhighlightTasks(...args) {
        if (args?.[0]?.tasks) {
            args[0].events = args[0].tasks;
        }
        this.unhighlightEvents(...args);
    }

    // Overrides TimelineBase.js
    internalGetAssignmentsToHighlight(tasks) {
        return ArrayHelper.asArray(tasks).flatMap(task => this.taskStore.getById(task) || []);
    }
}

// Register this widget type with its Factory
GanttBase.initClass();

VersionHelper.setVersion('gantt', '8.0.1');

