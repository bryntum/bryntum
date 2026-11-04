import Base from '../../../Core/Base.js';
import DomDataStore from '../../../Core/data/DomDataStore.js';
import StringHelper from '../../../Core/helper/StringHelper.js';

/**
 * @module Gantt/view/mixin/GanttDom
 */

/**
 * Mixin with TaskModel <-> HTMLElement mapping functions
 *
 * @mixin
 * @tier community
 */
export default Target => class GanttDom extends (Target || Base) {
    static $name = 'GanttDom';

    // Alias for resolveTaskRecord method to satisfy the scheduler naming requirements.
    resolveEventRecord(element) {
        return this.resolveTaskRecord(element);
    }

    /**
     * Returns the task record for a DOM element
     * @param {HTMLElement} element The DOM node to lookup
     * @returns {Gantt.model.TaskModel} The task record
     */
    resolveTaskRecord(element) {
        const eventElement = element.closest(this.eventSelector);

        return eventElement ? this.store.getById(eventElement.dataset.taskId) : this.getRecordFromElement(element);
    }

    /**
     * Product agnostic method which yields the {@link Gantt.model.TaskModel} record which underpins the row which
     * encapsulates the passed element. The element can be a grid cell, or an event element, and the result
     * will be a {@link Gantt.model.TaskModel}
     * @param {HTMLElement|Event} elementOrEvent The HTML element or DOM event to resolve a record from
     * @returns {Gantt.model.TaskModel} The resource corresponding to the element, or null if not found.
     */
    resolveRowRecord(elementOrEvent) {
        return this.resolveTaskRecord(elementOrEvent);
    }

    /**
     * Relays keydown events as taskKeyDown if we have a selected task(s).
     * @private
     */
    onElementKeyDown(event) {
        const taskRecord = this.resolveTaskRecord(event.target);

        super.onElementKeyDown(event);

        if (taskRecord) {
            this.trigger('taskKeyDown', {
                taskRecord,
                event
            });
        }
    }

    /**
     * Relays keyup events as taskKeyUp if we have a selected task(s).
     * @private
     */
    onElementKeyUp(event) {
        const taskRecord = this.resolveTaskRecord(event.target);

        super.onElementKeyUp(event);

        if (taskRecord) {
            this.trigger('taskKeyUp', {
                taskRecord,
                event
            });
        }
    }

    /**
     * Returns the HTMLElement representing a task record.
     *
     * @param {Gantt.model.TaskModel} taskRecord A task record
     * @param {Boolean} [inner] Specify `false` to return the task wrapper element
     *
     * @returns {HTMLElement} The element representing the task record
     */
    getElementFromTaskRecord(taskRecord, inner = true) {
        return this.taskRendering.getElementFromTaskRecord(taskRecord, inner);
    }

    // <remove-on-release>
    // TODO: since we have decided to call tasks events then the method being aliased should be renamed
    // </remove-on-release>
    // Alias to make scheduler features applied to Gantt happy
    getElementFromEventRecord(eventRecord, resource, returnWrapper = false) {
        return this.getElementFromTaskRecord(eventRecord, !returnWrapper);
    }

    /**
     * Generates the DOM `id` for a task bar element, referenced by the `aria-owns` attribute of the task's time
     * axis cell.
     * @param {String|Number} taskId The task record id
     * @private
     */
    getEventRenderId(taskId) {
        return StringHelper.makeValidDomId(`${this.id}_task_${taskId}`);
    }

    /**
     * In Gantt, the task is the row, so it's valid to resolve a mouse event on a task to the TimeAxisColumn's cell.
     *
     * This method find the cell location of the passed event. It returns an object describing the cell.
     * @param {Event} event A Mouse, Pointer or Touch event targeted at part of the grid.
     * @returns {Object} An object containing the following properties:
     * - `cellElement` - The cell element clicked on.
     * - `columnId` - The `id` of the column clicked under.
     * - `record` - The {@link Core.data.Model record} clicked on.
     * - `id` - The `id` of the {@link Core.data.Model record} clicked on.
     * @private
     * @category Events
     */
    getEventData(event) {
        const
            me     = this,
            record = me.resolveTimeSpanRecord(event.target);

        // If the event was on a task, then we're in one of the TimeAxisColumn's cells.
        if (record) {
            const
                cellElement = me.getCell({
                    record,
                    column : me.timeAxisColumn
                }),
                cellData = DomDataStore.get(cellElement),
                id       = cellData.id,
                columnId = cellData.columnId;

            return {
                cellElement,
                cellData,
                columnId,
                id,
                record,
                cellSelector : { id, columnId }
            };
        }
        else {
            return super.getEventData(event);
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
