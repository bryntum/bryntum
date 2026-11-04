import TaskBoardBase from './TaskBoardBase.js';

import '../feature/ColumnHeaderMenu.js';
import '../feature/ColumnToolbars.js';
import '../feature/TaskDrag.js';
import '../feature/TaskDragSelect.js';
import '../feature/TaskEdit.js';
import '../feature/TaskMenu.js';


import './item/ImageItem.js';
import './item/ProgressItem.js';
import './item/RatingItem.js';
import './item/SeparatorItem.js';
import './item/TaskMenuItem.js';
import './item/TemplateItem.js';



/**
 * @module TaskBoard/view/TaskBoard
 */

/**
 * A kanban board widget that allows you to visualize and mange tasks.
 *
 * {@inlineexample TaskBoard/view/TaskBoardBasic.js}
 *
 * ## Datalayer
 *
 * TaskBoards datalayer is based on Schedulers. It consumes a {@link TaskBoard.model.ProjectModel project} that holds
 * stores that in turn holds records. The stores used by default are:
 *
 * * {@link TaskBoard.store.TaskStore} - Store holding tasks, which are instances of {@link TaskBoard.model.TaskModel}
 * * {@link Scheduler.data.ResourceStore} - Holds resources, see {@link Scheduler.model.ResourceModel}
 * * {@link Scheduler.data.AssignmentStore} - Holds assignments, links between resources and tasks, see {@link Scheduler.model.AssignmentModel}
 *
 * Data can be supplied inline or loaded using the projects {@link Scheduler.data.mixin.ProjectCrudManager CrudManager}
 * capabilities. Example using inline data:
 *
 * {@frameworktabs}
 * {@js}
 *
 * ```javascript
 * new TaskBoard({
 *     project : {
 *         tasks : [
 *             { id : 1, name : 'Try TaskBoard' }
 *         ]
 *     }
 * });
 * ```
 *
 * {@endjs}
 * {@react}
 *
 * ```javascript
 * const App = props => {
 *     const project = useRef();
 *
 *     const [tasks] = useState([
 *          { id : 1, name : 'Try TaskBoard' }
 *     ]);
 *
 *     return (
 *         <>
 *             <BryntumTaskBoardProjectModel ref={project} tasks={tasks} />
 *             <BryntumTaskBoard project={project} />
 *         </>
 *     )
 * }
 * ```
 *
 * {@endreact}
 * {@vue}
 *
 * ```html
 * <bryntum-task-board-project-model ref="project" :tasks="tasks" />
 * <bryntum-task-board :project="project" />
 * ```
 *
 * ```javascript
 * export default {
 *    setup() {
 *      return {
 *         tasks : reactive([
 *             { id : 1, name : 'Try TaskBoard' }
 *         ])
 *      };
 *    }
 * }
 * ```
 *
 * {@endvue}
 * {@angular}
 *
 * ```html
 * <bryntum-task-board-project-model #project [tasks]="tasks"></bryntum-task-board-project-model>
 * <bryntum-task-board [project]="project"></bryntum-task-board>
 * ```
 *
 * ```typescript
 * export class AppComponent {
 *     tasks = [
 *         { id : 1, name : 'Try TaskBoard' }
 *     ]
 *  }
 * ```
 *
 * {@endangular}
 * {@endframeworktabs}
 *
 * And using CrudManager to load remote data:
 *
 * {@frameworktabs}
 * {@js}
 *
 * ```javascript
 * new TaskBoard({
 *     project : {
 *         loadUrl : 'data/load.php',
 *         autoLoad : true
 *     }
 * });
 * ```
 *
 * {@endjs}
 * {@react}
 *
 * ```javascript
 * const App = props => {
 *     const project = useRef();
 *
 *     return (
 *         <>
 *             <BryntumTaskBoardProjectModel ref={project} loadUrl="data/load.php" />
 *             <BryntumTaskBoard project={project} />
 *         </>
 *     )
 * }
 * ```
 *
 * {@endreact}
 * {@vue}
 *
 * ```html
 * <bryntum-task-board-project-model ref="project" :load-url="loadUrl" />
 * <bryntum-task-board :project="project" />
 * ```
 *
 * ```javascript
 * export default {
 *    setup() {
 *      return {
 *         loadUrl : 'data/load.php'
 *      };
 *    }
 * }
 * ```
 *
 * {@endvue}
 * {@angular}
 *
 * ```html
 * <bryntum-task-board-project-model #project [loadUrl]="loadUrl"></bryntum-task-board-project-model>
 * <bryntum-task-board [project]="project"></bryntum-task-board>
 * ```
 *
 * ```typescript
 * export class AppComponent {
 *     loadUrl = 'data/load.php'
 *  }
 * ```
 *
 * {@endangular}
 * {@endframeworktabs}
 *
 * ## Columns
 *
 * The tasks are displayed in columns. Which column a task belongs to is determined by the tasks value for the
 * configured {@link #config-columnField}. Columns can be defined as strings or as {@link TaskBoard.model.ColumnModel}
 * data objects, supplied to the {@link #config-columns config}. This snippet illustrates it:
 *
 * {@frameworktabs}
 * {@js}
 *
 * ```javascript
 * new TaskBoard({
 *     // The status field of tasks will be used to link a task to a column
 *     columnField : 'status',
 *
 *     // Columns as strings or objects
 *     columns : [
 *         'todo', // Will be displayed as Todo
 *         { id : 'done', text : 'Done!' }
 *     ],
 *
 *     // TaskBoard data
 *     project : {
 *         tasks : [
 *             // Since we use the "status" field to determine column,
 *             // this task will belong to the "done" column
 *             { id : 1, name : 'Create mockup', status : 'done' },
 *             // And this one to "todo"
 *             { id : 2, name : 'Write docs', status : 'todo' }
 *         ]
 *     }
 * });
 * ```
 *
 * {@endjs}
 * {@react}
 *
 * ```javascript
 * const App = props => {
 *     const project = useRef();
 *
 *     // TaskBoard data
 *     const [tasks] = useState([
 *         // Since we use the "status" field to determine column,
 *         // this task will belong to the "done" column
 *         { id : 1, name : 'Create mockup', status : 'done' },
 *        // And this one to "todo"
 *        { id : 2, name : 'Write docs', status : 'todo' }
 *     ]);
 *
 *     // Columns as strings or objects
 *     const columns = [
 *        'todo', // Will be displayed as Todo
 *         { id : 'done', text : 'Done!' }
 *     ];
 *
 *     // The status field of tasks will be used to link a task to a column
 *     const columnField = 'status';
 *
 *     return (
 *         <>
 *             <BryntumTaskBoardProjectModel ref={project} tasks={tasks} />
 *             <BryntumTaskBoard
 *                 project={project}
 *                 columns={columns}
 *                 columnField={columnField}
 *                 />
 *         </>
 *     )
 * }
 * ```
 *
 * {@endreact}
 * {@vue}
 *
 * ```html
 * <bryntum-task-board-project-model ref="project" :tasks="tasks" />
 * <bryntum-task-board
 *     :project="project"
 *     :columns="columns"
 *     :columnField="columnField"
 *     />
 * ```
 *
 * ```javascript
 * export default {
 *     setup() {
 *         return {
 *             // TaskBoard data
 *             tasks : reactive([
 *                 // Since we use the "status" field to determine column,
 *                 // this task will belong to the "done" column
 *                 { id : 1, name : 'Create mockup', status : 'done' },
 *                 // And this one to "todo"
 *                 { id : 2, name : 'Write docs', status : 'todo' }
 *             ]),
 *
 *             // Columns as strings or objects
 *             columns : [
 *                 'todo', // Will be displayed as Todo
 *                 { id : 'done', text : 'Done!' }
 *             ],
 *
 *             // The status field of tasks will be used to link a task to a column
 *             columnField : 'status'
 *         };
 *     }
 * }
 * ```
 *
 * {@endvue}
 * {@angular}
 *
 * ```html
 * <bryntum-task-board-project-model #project [tasks]="tasks"></bryntum-task-board-project-model>
 * <bryntum-task-board
 *     [project]="project"
 *     [columns]="columns"
 *     [columnField]="columnField"
 *     >
 * </bryntum-task-board>
 * ```
 *
 * ```typescript
 * export class AppComponent {
 *     // TaskBoard data
 *     tasks = reactive([
 *         // Since we use the "status" field to determine column,
 *         // this task will belong to the "done" column
 *         { id : 1, name : 'Create mockup', status : 'done' },
 *         // And this one to "todo"
 *         { id : 2, name : 'Write docs', status : 'todo' }
 *     ])
 *
 *     // Columns as strings or objects
 *     columns = [
 *         'todo', // Will be displayed as Todo
 *         { id : 'done', text : 'Done!' }
 *     ]
 *
 *     // The status field of tasks will be used to link a task to a column
 *     columnField = 'status'
 *  }
 * ```
 *
 * {@endangular}
 * {@endframeworktabs}
 *
 * The supplied columns are loaded into an internal store, named {@link #property-columns}. You can use it at runtime
 * to access, add, remove and filter columns.
 *
 * ### Adding a catch-all column
 *
 * If you want to add a catch-all column that will contain all tasks that do not match any of the configured columns,
 * you can do so by adding a column with id `*` (asterisk) to the columns config:
 *
 * ```javascript
 * new TaskBoard({
 *     columns : [
 *         'todo',
 *         'doing',
 *         // Add a catch-all column
 *         { id : '*', text : 'All others' }
 *     ]
 * });
 * ```
 *
 * By default, the catch-all column is not shown in the task editors {@link TaskBoard/widget/ColumnCombo columns combo}.
 * Instead it will be populated with the defined columns + all distinct column values found in the tasks.
 *
 * ## Swimlanes
 *
 * The TaskBoard can optionally be divided into horizontal swimlanes.
 *
 * {@inlineexample TaskBoard/view/TaskBoardSwimlanes.js}
 *
 * They are defined and populated in a very similar manner to columns:
 *
 * {@frameworktabs}
 * {@js}
 *
 * ```javascript
 * new TaskBoard({
 *     // The prio field of tasks will be used to link a task to a swimlane
 *     swimlaneField : 'prio',
 *
 *     // Swimlanes as strings or objects
 *     swimlanes : [
 *         'low', // Will be displayed as Low
 *         { id : 'high', text : 'High!' }
 *     ],
 *
 *     // TaskBoard data
 *     project : {
 *         tasks : [
 *             // Since we use the "prio" field to determine swimlane,
 *             // this task will belong to the "high" lane
 *             { id : 1, name : 'Create mockup', status : 'done', prio : 'high' },
 *
 *             // And this one to "low"
 *             { id : 2, name : 'Write docs', status : 'todo', prio : 'low' }
 *         ]
 *     }
 * });
 * ```
 *
 * {@endjs}
 * {@react}
 *
 * ```javascript
 * const App = props => {
 *     const project = useRef();
 *
 *     // TaskBoard data
 *     const [tasks] = useState([
 *         // Since we use the "prio" field to determine swimlane,
 *         // this task will belong to the "high" lane
 *         { id : 1, name : 'Create mockup', status : 'done', prio : 'high' },
 *
 *         // And this one to "low"
 *         { id : 2, name : 'Write docs', status : 'todo', prio : 'low' }
 *     ]);
 *
 *     // Swimlanes as strings or objects
 *     const swimlanes = [
 *        'low', // Will be displayed as Low
 *         { id : 'high', text : 'High!' }
 *     ];
 *
 *     // The prio field of tasks will be used to link a task to a swimlane
 *     const swimlaneField = 'prio';
 *
 *     return (
 *         <>
 *             <BryntumTaskBoardProjectModel ref={project} tasks={tasks} />
 *             <BryntumTaskBoard
 *                 project={project}
 *                 swimlanes={swimlanes}
 *                 swimlaneField={swimlaneField}
 *                 />
 *         </>
 *     )
 * }
 * ```
 *
 * {@endreact}
 * {@vue}
 *
 * ```html
 * <bryntum-task-board-project-model ref="project" :tasks="tasks" />
 * <bryntum-task-board
 *     :project="project"
 *     :swimlanes="swimlanes"
 *     :swimlaneField="swimlaneField"
 *     />
 * ```
 *
 * ```javascript
 * export default {
 *     setup() {
 *         return {
 *             // TaskBoard data
 *             tasks : reactive([
 *                 // Since we use the "prio" field to determine swimlane,
 *                 // this task will belong to the "high" lane
 *                 { id : 1, name : 'Create mockup', status : 'done', prio : 'high' },
 *
 *                 // And this one to "low"
 *                 { id : 2, name : 'Write docs', status : 'todo', prio : 'low' }
 *             ]),
 *
 *             // Swimlanes as strings or objects
 *             swimlane : [
 *                 'low', // Will be displayed as Low
 *                 { id : 'high', text : 'High!' }
 *             ],
 *
 *             // The prio field of tasks will be used to link a task to a swimlane
 *             swimlanenField : 'prio'
 *         };
 *     }
 * }
 * ```
 *
 * {@endvue}
 * {@angular}
 *
 * ```html
 * <bryntum-task-board-project-model #project [tasks]="tasks"></bryntum-task-board-project-model>
 * <bryntum-task-board
 *     [project]="project"
 *     [swimlanes]="swimlanes"
 *     [swimlaneField]="swimlaneField"
 *     >
 * </bryntum-task-board>
 * ```
 *
 * ```typescript
 * export class AppComponent {
 *     // TaskBoard data
 *     tasks = [
 *         // Since we use the "prio" field to determine swimlane,
 *         // this task will belong to the "high" lane
 *         { id : 1, name : 'Create mockup', status : 'done', prio : 'high' },
 *
 *         // And this one to "low"
 *         { id : 2, name : 'Write docs', status : 'todo', prio : 'low' }
 *     ]
 *
 *     // Swimlanes as strings or objects
 *     swimlanes = [
 *         'low', // Will be displayed as Low
 *         { id : 'high', text : 'High!' }
 *     ]
 *
 *     // The prio field of tasks will be used to link a task to a swimlane
 *     swimlaneField = 'prio'
 *  }
 * ```
 *
 * {@endangular}
 * {@endframeworktabs}
 *
 * ## Task order
 *
 * The order of tasks in a column is determined by their order in the task store. By default the store is sorted by
 * {@link TaskBoard/model/TaskModel#field-weight}. Changing store sorting will rearrange the tasks:
 *
 * ```javascript
 * // Rearrange tasks by name
 * taskBoard.project.taskStore.sort('name');
 * ```
 *
 * When loading tasks that has no weights specified a generated weight (index * 100) will be silently assigned.
 *
 * Dragging and dropping tasks changes their weight and resorts the store. Note that if you want to sort by something
 * other than weight and still want a task to stay where it is dropped you will have to opt out of the default
 * behaviour by configuring {@link TaskBoard/feature/TaskDrag#config-reorderTaskRecords} as `true`.
 *
 * If you programmatically change a weight you have to manually sort the store for the task to move:
 *
 * ```javascript
 * // Programmatic change of weight requires resorting manually
 * taskBoard.project.taskStore.first.weight = 1000;
 * taskBoard.project.taskStore.sort();
 * ```
 *
 * ## Sharing a project
 *
 * When consuming a project from a different product (for example Gantt), you will likely want the cards on the board
 * to have a stable order no matter how data is sorted in the other product. This can be achieved by configuring a
 * {@link #config-taskSorterFn}, which is then applied on the UI layer to resort tasks before rendering their cards.
 * You can use it to enforce sorting by weight:
 *
 * ```javascript
 * // Shortcut to always enforce sorting by weight
 * const taskBoard = new TaskBoard({
 *    taskSorterFn : true
 * });
 * ```
 *
 * Or supply a custom [Array sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
 * function:
 *
 * ```javascript
 * // Custom sorting fn
 * const taskBoard = new TaskBoard({
 *    taskSorterFn(a, b) {
 *        return a.name.localeCompare(b.name);
 *    }
 * });
 * ```
 *
 * <div class="warning">
 * When consuming a non-TaskBoard project no weights will be assigned by default, make sure your data has weights if
 * you want stable task ordering.
 * </div>
 *
 * ## Customizing task content
 *
 * Task contents can be easily customized using {@link TaskBoard/view/mixin/TaskItems task items}, lightweight
 * "widgets" that can be added to a tasks header, body and footer.
 *
 * For more control over what gets rendered into a task, you can supply a {@link #config-taskRenderer} function. It is
 * called prior to updating the DOM for each task, allowing you to directly manipulate what ends up there.
 *
 * For more information see:
 *
 * * [Styling guide](#TaskBoard/guides/customization/styling.md)
 * * [Customize task contents guide](#TaskBoard/guides/customization/taskcontents.md)
 *
 * ## Large data sets
 *
 * Having a large number of cards rendered to DOM simultaneously can lead to poor performance. To address this issue,
 * TaskBoard supports partial virtualized rendering. This means that only the cards that are visible in the viewport
 * are fully rendered, cards outside the viewport are only outlined.
 *
 * When enabled, the board displays faster and is more responsive with big data sets, but it also means that scrolling
 * is more costly since cards coming into view has to be rendered. And since it is not fully virtualized, the board will
 * still be slow with very large data sets.
 *
 * {@note}A Kanban board is best suited for using with a smaller set of tasks (hundreds rather than
 * thousands). Before enabling partial virtualized rendering we strongly recommend you consider restructuring the
 * application. Could it for example filter the tasks based on user, project or similar to work on a subset?{/@note}
 *
 * To enable partial virtualized rendering, the height of all tasks must be known. To communicate this to the TaskBoard,
 * implement a {@link #config-getTaskHeight getTaskHeight()} function. See its documentation for more information and
 * snippets.
 *
 * {@note}Note that as part of the optimizations for partial virtualized rendering, the inner element in
 * columns that contain cards is absolutely positioned. This leads to column not being able to automatically shrink wrap
 * the cards, you will have to set a height on the swimlane (or task board if not using swimlanes) to size things
 * correctly.{/@note}
 *
 * {@region Keyboard shortcuts}
 * The board body is a single composite: it holds one <kbd>Tab</kbd> stop which moves with focus, and the arrow keys
 * move between the cards, the column header controls, the swimlane expanders and the column toolbar items. Tabbing into
 * the board lands on that stop, the first card, until focus has moved elsewhere in the board.
 *
 * Cards whose items render focusable content, such as {@link TaskBoard.view.item.TaskMenuItem} and
 * {@link TaskBoard.view.item.CollapseItem}, are entered with <kbd>F2</kbd>, cycled with <kbd>Tab</kbd> and left with
 * <kbd>Escape</kbd>.
 *
 * Buttons added by features to the column headers, such as those of {@link TaskBoard.feature.ColumnSort} and
 * {@link TaskBoard.feature.ColumnFilter}, are part of the composite too. The search fields of
 * {@link TaskBoard.feature.FilterBar} keep their own <kbd>Tab</kbd> stop instead, like the filter fields of the Grid
 * filter bar, since they need the arrow keys to move their caret.
 *
 * TaskBoard has the following default keyboard shortcuts:
 * <div class="compact">
 *
 * | Keys                                   | Action                 | Action description                                                         |
 * |----------------------------------------|------------------------|----------------------------------------------------------------------------|
 * | <kbd>ArrowDown</kbd>                   | *navigateDown*         | Moves focus to the control below currently focused element                 |
 * | <kbd>ArrowLeft</kbd>                   | *navigateLeft*         | Moves focus to the control to the left of currently focused element        |
 * | <kbd>ArrowUp</kbd>                     | *navigateUp*           | Moves focus to the control above currently focused element                 |
 * | <kbd>ArrowRight</kbd>                  | *navigateRight*        | Moves focus to the control to the right of currently focused element       |
 * | <kbd>Enter</kbd>                       | *activate*             | Show the Task Editor for currently focused task                            |
 * | <kbd>F2</kbd>                          | *activateCard*         | Moves focus to the first focusable item on the focused card                |
 * | <kbd>Escape</kbd>                      | *deactivateCard*       | Moves focus from an item on a card back out to the card                    |
 * | <kbd>Tab</kbd>                         | *nextCardItem*         | Moves focus to the next item, when focus is on a card item                 |
 * | <kbd>Shift</kbd>+<kbd>Tab</kbd>        | *previousCardItem*     | Moves focus to the previous item, when focus is on a card item             |
 * | <kbd>Space</kbd>                       | *keyboardSelect*       | This selects or deselects the focused card (deselecting all others)        |
 * | <kbd>Ctrl</kbd>+<kbd>Space</kbd>       | *keyboardToggleSelect* | This selects or deselects the focused card, preserving any other selection |
 * | <kbd>Shift</kbd>+<kbd>ArrowDown</kbd>  | *selectDown*           | Hold <kbd>Shift</kbd> when keyboard navigating to extend selection         |
 * | <kbd>Shift</kbd>+<kbd>ArrowLeft</kbd>  | *selectLeft*           | Hold <kbd>Shift</kbd> when keyboard navigating to extend selection         |
 * | <kbd>Shift</kbd>+<kbd>ArrowUp</kbd>    | *selectUp*             | Hold <kbd>Shift</kbd> when keyboard navigating to extend selection         |
 * | <kbd>Shift</kbd>+<kbd>ArrowRight</kbd> | *selectRight*          | Hold <kbd>Shift</kbd> when keyboard navigating to extend selection         |
 *
 * </div>
 *
 * {@note}Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd>
 * is the equivalent to <kbd>Option</kbd> for Mac users.{/@note}
 *
 * If you prefer for selection to always move with the arrow keys, see
 * {@link TaskBoard.view.mixin.TaskNavigation#config-selectOnNavigation}.
 *
 * The following TaskBoard features has their own keyboard shortcuts. Follow the links for details.
 * * {@link TaskBoard.feature.ColumnHeaderMenu#keyboard-shortcuts ColumnHeaderMenu}
 * * {@link TaskBoard.feature.SimpleTaskEdit#keyboard-shortcuts SimpleTaskEdit}
 * * {@link TaskBoard.feature.TaskMenu#keyboard-shortcuts TaskMenu}
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#TaskBoard/guides/customization/keymap.md).
 * {@endregion}
 *
 * ## Find out more
 *
 * * {@link TaskBoard.view.mixin.ExpandCollapse Expanding and collapsing columns and swimlanes}
 * * {@link TaskBoard.view.mixin.ResponsiveCards Responsive behaviour for cards}
 * * {@link TaskBoard.view.mixin.TaskBoardDom Resolving elements <-> records}
 * * {@link TaskBoard.view.mixin.TaskBoardDomEvents Handling card events}
 * * {@link TaskBoard.view.mixin.TaskBoardScroll Scrolling to tasks, columns and swimlanes}
 * * {@link TaskBoard.view.mixin.TaskItems Add content to task cards}
 * * {@link TaskBoard.view.mixin.TaskNavigation Keyboard navigation}
 * * {@link TaskBoard.view.mixin.TaskSelection Selection tasks using mouse and keyboard}
 *
 * ## Tiers
 *
 * TaskBoard is available in the Community, Business and Enterprise tiers. Features are tiered, and each one shows a
 * badge for the lowest tier that includes it. See the [Product tiers and class names](#TaskBoard/guides/data/tiers.md)
 * guide.
 *
 * See the [TaskBoard features per tier](#TaskBoard/guides/basics/feature-availability.md) guide.
 *
 * @extends TaskBoard/view/TaskBoardBase
 * @classtype taskboard
 * @tier community
 * @widget
 */
export default class TaskBoard extends TaskBoardBase {
    static $name = 'TaskBoard';
    static type = 'taskboard';

    static configurable = {
        features : {
            columnHeaderMenu : true,
            columnToolbars   : true,
            taskDrag         : true,
            taskDragSelect   : true,
            taskEdit         : true,
            taskMenu         : true
        }
    };
}

TaskBoard.initClass();
