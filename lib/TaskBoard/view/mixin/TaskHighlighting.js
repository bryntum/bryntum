import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import EventHelper from '../../../Core/helper/EventHelper.js';

/**
 * @module TaskBoard/view/mixin/TaskHighlighting
 */

/**
 * Mixin that handles card highlighting for the TaskBoard.
 *
 * The highlighting is done by adding the CSS class `b-highlighted` to the highlighted card elements. Also,
 * the CSS class `b-is-highlighting` is added to the main TaskBoard element, dimming non-highlighted cards.
 *
 * @mixin
 */
export default Target => class TaskHighlighting extends (Target || Base) {

    static $name = 'TaskHighlighting';

    get widgetClass() {}

    //region API

    /**
     * Highlights the elements of the passed task records (or record ids).
     *
     * The highlighting will be done by adding the css class `b-highlighted` to the highlighted card elements. Also,
     * the css class `b-is-highlighting` will be added to the main TaskBoard element.
     *
     * ```javascript
     * // Highlight single task
     * taskBoard.highlightTasks({ tasks : 22 });
     * // Highlight multiple tasks
     * taskBoard.highlightTasks({ tasks : [1, 40] });
     * // Don't un-highlight on click
     * taskBoard.highlightTasks({ tasks : 1000, unhighlightOnClick : false });
     * ```
     *
     * @param {Object} options Options config object
     * @param {TaskBoard.model.TaskModel|Number|String|TaskBoard.model.TaskModel[]|Number[]|String[]} options.tasks
     * The task records or record ids to highlight. If an empty array is passed, the `b-is-highlighting` class will be
     * applied, rendering all card elements in the style of `:not(.b-highlighted)`.
     * @param {Boolean} [options.scroll=true] If `true` (the default), the first highlighted task will be scrolled into
     * view. Set to `false` to skip scrolling.
     * @param {Boolean} [options.unhighlightOnClick=true] If `false`, a call to {@link #function-unhighlightTasks} is
     * needed to remove the highlighting. Otherwise, the highlighting will be removed when the user clicks somewhere in
     * the browser window.
     * @param {Boolean} [options.unhighlightOthers=false] If `true`, this will automatically un-highlight the tasks not
     * present in the `tasks` property.
     * @category Highlighting
     */
    highlightTasks({ tasks, scroll = true, unhighlightOnClick = true, unhighlightOthers = false }) {
        const
            me          = this,
            highlighted = me._highlightedTasks ??= [],
            taskRecords = me.project.taskStore.getByIds(tasks);

        if (unhighlightOthers && highlighted.length) {
            me.unhighlightTasks({ tasks : [...highlighted] });
        }

        for (const task of taskRecords) {
            if (!highlighted.includes(task)) {
                highlighted.push(task);

                const taskElement = me.getTaskElement(task);
                taskElement?.classList.add('b-highlighted');
            }
        }

        me.addCls('b-is-highlighting');

        if (scroll && taskRecords.length) {
            me.scrollToTask(taskRecords[0]);
        }

        if (unhighlightOnClick && !me._highlightTasksListener) {
            me._highlightTasksListener = EventHelper.on({
                element     : globalThis,
                autoDetach  : true,
                thisObj     : me,
                pointerdown : me.unhighlightTasks
            });
        }
    }

    /**
     * Removes highlighting from the elements of the passed task records (or record ids). If no tasks are passed, all
     * highlighted tasks will be un-highlighted.
     *
     * ```javascript
     * taskBoard.unhighlightTasks({ tasks : 22 }); // single task
     * taskBoard.unhighlightTasks({ tasks : [1, 40] }); // multiple tasks
     * taskBoard.unhighlightTasks(); // unhighlight all
     * ```
     *
     * @param {Object} [options] Options config object
     * @param {TaskBoard.model.TaskModel|Number|String|TaskBoard.model.TaskModel[]|Number[]|String[]} [options.tasks]
     * The task records or record ids to un-highlight. Omit this to un-highlight all.
     * @category Highlighting
     */
    unhighlightTasks(options) {
        const
            me = this,
            { _highlightedTasks } = me;
        let tasks = options?.tasks;

        // When called from click listener, options will be the browser event
        if (DomHelper.isDOMEvent(options)) {
            tasks = null;
        }

        if (_highlightedTasks?.length) {
            const taskRecords = tasks && me.project.taskStore.getByIds(tasks);

            for (let i = _highlightedTasks.length - 1; i >= 0; i--) {
                const task = _highlightedTasks[i];

                if (!taskRecords || taskRecords.includes(task)) {
                    const taskElement = me.getTaskElement(task);
                    taskElement?.classList.remove('b-highlighted');
                    _highlightedTasks.splice(i, 1);
                }
            }
        }

        if (!_highlightedTasks?.length) {
            me.removeCls('b-is-highlighting');
        }

        if (me._highlightTasksListener) {
            me._highlightTasksListener();
            me._highlightTasksListener = null;
        }
    }

    //endregion

    //region Rendering

    populateCard(args) {
        super.populateCard?.(args);

        const { taskRecord, cardConfig } = args;

        cardConfig.class['b-highlighted'] = this._highlightedTasks?.includes(taskRecord) ?? false;
    }

    //endregion

};
