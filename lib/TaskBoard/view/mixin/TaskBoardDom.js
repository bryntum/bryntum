import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DomSync from '../../../Core/helper/DomSync.js';

/**
 * @module TaskBoard/view/mixin/TaskBoardDom
 */

/**
 * Mixin that handles resolving elements from records and vice versa.
 *
 * ```javascript
 * // Resolve task record from an element
 * const task = taskBoard.resolveTaskRecord(someElement);
 *
 * // Get tasks element
 * const element = taskBoard.getTaskElement(taskBoard.taskStore.first);
 * ```
 *
 * @mixin
 */
export default Target => class TaskBoardDom extends (Target || Base) {

    //region Config

    static $name = 'TaskBoardDom';

    get widgetClass() {}

    //endregion

    //region Resolve record from element

    /**
     * Retrieves a task record corresponding to the supplied element. Has to be a `.b-task-board-card` element or
     * descendant thereof.
     *
     * ```javascript
     * const taskRecord = taskBoard.resolveTaskRecord(taskElement);
     * ```
     *
     * @param {HTMLElement} element
     * @returns {TaskBoard.model.TaskModel}
     * @category DOM
     */
    resolveTaskRecord(element) {
        element = element.closest('.b-task-board-card');
        // If element is a drop indicator, it wont have elementData
        return element && this.project.taskStore.getById(element.elementData?.taskId);
    }

    /**
     * Retrieves a column record resolved from the supplied element. Has to be a `.b-task-board-column` element or
     * descendant thereof (such as a card).
     *
     * ```javascript
     * const columnRecord = taskBoard.resolveColumnRecord(taskElement);
     * ```
     *
     * @param {HTMLElement} element
     * @returns {TaskBoard.model.ColumnModel}
     * @category DOM
     */
    resolveColumnRecord(element) {
        element = element.closest('.b-task-board-column, .b-task-board-column-header');
        // Headers are b-task-board-column but without elementData, for now
        return element && this.columns.getById(element.elementData?.columnId);
    }

    /**
     * Retrieves a swimlane record resolved from the supplied element (or `null` if it cannot be resolved). Has to be a
     * `.b-task-board-swimlane` element or descendant thereof.
     *
     * ```javascript
     * const swimlaneRecord = taskBoard.resolveSwimlaneRecord(taskElement);
     * ```
     *
     * @param {HTMLElement} element
     * @returns {TaskBoard.model.SwimlaneModel|null}
     * @category DOM
     */
    resolveSwimlaneRecord(element) {
        // When using a tier without swimlanes, app might still try to pass them. Avoid crashing in that case.
        if (!this.hasSwimlanes) {
            return null;
        }

        element = element.closest('.b-task-board-swimlane');
        return element && this.swimlanes?.getById(element.elementData.laneId);
    }

    //endregion

    //region Get element from record

    /**
     * Retrieves the task element (card) corresponding to the supplied task record.
     *
     * ```javascript
     * const cardElement = taskBoard.getTaskElement(taskRecord);
     * ```
     *
     * @param {TaskBoard.model.TaskModel} taskRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getTaskElement(taskRecord) {
        const taskColumnElement = this.getTaskColumnElement(taskRecord);
        return taskColumnElement && DomSync.getChild(taskColumnElement, `body.inner.${taskRecord.domId}`);
    }

    /**
     * Retrieves the element for the column that holds the supplied task record.
     *
     * ```javascript
     * const columnElement = taskBoard.getColumnElement(taskRecord);
     * ```
     *
     * @param {TaskBoard.model.TaskModel} taskRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getTaskColumnElement(taskRecord) {
        const
            me           = this,
            columnRecord = me.getTaskColumn(taskRecord);

        if (!columnRecord) {
            return null;
        }

        // Grouped columns are nested one level deeper, inside their group container
        const containerId = me.getColumnGroupContainerId(columnRecord);

        return DomSync.getChild(
            me.getTaskSwimlaneElement(taskRecord),
            containerId != null ? `body.${containerId}.${columnRecord.domId}` : `body.${columnRecord.domId}`
        );
    }

    /**
     * Retrieves the element for the swimlane that holds the supplied task record.
     *
     * ```javascript
     * const swimlaneElement = taskBoard.getTaskSwimlaneElement(taskRecord);
     * ```
     *
     * @param {TaskBoard.model.TaskModel} taskRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getTaskSwimlaneElement(taskRecord) {
        const me = this;

        // When not using swimlanes (or ignoring them due to vertical column groups), we still create one called 'default'
        const laneId = me.hasSwimlanes && !me.isIgnoringSwimlanes
            ? me.swimlanes.getById(taskRecord.getValue(me.swimlaneField))?.domId
            : 'default';

        return DomSync.getChild(me.bodyElement, laneId);
    }

    /**
     * Retrieves the element for the supplied swimlane.
     *
     * ```javascript
     * const swimlaneElement = taskBoard.getSwimlaneElement(taskBoard.swimlanes.first);
     * ```
     *
     * @param {TaskBoard.model.SwimlaneModel} swimlaneRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getSwimlaneElement(swimlaneRecord) {
        // Get a swimlane element, does not query DOM and is thus cheap
        return DomSync.getChild(this.bodyElement, swimlaneRecord.domId);
    }

    /**
     * Retrieves the element for the supplied swimlane / column intersection.
     *
     * ```javascript
     * const element = taskBoard.getSwimlaneColumnElement(taskBoard.swimlanes.first, taskBoard.columns.last);
     * ```
     *
     * @param {TaskBoard.model.SwimlaneModel} swimlaneRecord
     * @param {TaskBoard.model.ColumnModel} columnRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getSwimlaneColumnElement(swimlaneRecord, columnRecord) {
        // Called with a swimlaneRecord (public API)
        if (swimlaneRecord) {
            // Get the column element for specified column / swimlane intersection, does not query DOM and is thus cheap.
            // Grouped columns are nested one level deeper, inside their group container.
            const containerId = this.getColumnGroupContainerId(columnRecord);

            return DomSync.getChild(
                this.getSwimlaneElement(swimlaneRecord),
                containerId != null ? `body.${containerId}.${columnRecord.domId}` : `body.${columnRecord.domId}`
            );
        }
        // Called without, happens internally when not using swimlanes - to have simpler code paths
        else {
            return this.getColumnElement(columnRecord);
        }
    }

    /**
     * Retrieves the element for the supplied column.
     *
     * Only applicable when not using swimlanes. If you are using swimlanes, see {@link #function-getColumnElements}.
     *
     * @param {TaskBoard.model.ColumnModel} columnRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getColumnElement(columnRecord) {
        return this.getColumnElements(columnRecord)?.[0];
    }

    /**
     * Retrieves the elements for the supplied column. When using swimlanes, a column has one element per swimlane.
     *
     * @param {TaskBoard.model.ColumnModel} columnRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getColumnElements(columnRecord) {
        const me = this;

        // A column can span multiple swimlanes, it will have one element per swimlane.
        // If we have multiple swimlanes, iterate them and retrieve column elements.
        // This approach avoids querying DOM and is thus cheap
        if (me.hasSwimlanes && !me.isIgnoringSwimlanes) {
            return me.swimlanes.reduce((result, lane) => {
                if (!lane.hidden) {
                    result.push(me.getSwimlaneColumnElement(lane, columnRecord));
                }
                return result;
            }, []);
        }

        // No swimlanes, still return as array for consistency
        return [me.getSwimlaneColumnElement({ domId : 'default' }, columnRecord)];
    }

    /**
     * Retrieves the header element for the supplied column.
     *
     * @param {TaskBoard.model.ColumnModel} columnRecord
     * @returns {HTMLElement}
     * @category DOM
     */
    getColumnHeaderElement(columnRecord) {
        const me = this;

        // In vertical group mode there is no shared header row, the header lives inside the column element
        if (me.isVerticalColumnGroups) {
            const columnElement = me.getColumnElement(columnRecord);

            return columnElement && DomSync.getChild(columnElement, 'header');
        }

        // Grouped columns' headers are nested inside their group container in the header row
        const containerId = me.getColumnGroupContainerId(columnRecord);

        return DomSync.getChild(
            me.bodyElement,
            containerId != null ? `header.${containerId}.${columnRecord.domId}` : `header.${columnRecord.domId}`
        );
    }

    getColumnTitleElement(columnRecord) {
        return this.getColumnHeaderElement(columnRecord).querySelector('.b-column-title-text');
    }

    //endregion

    //region Position based

    /**
     * Get the card element at (x, y)
     * @param {Number} x
     * @param {Number} y
     * @param {String} cardSelector
     * @returns {HTMLElement}
     * @internal
     */
    getCardAt(x, y, cardSelector = '.b-task-board-card') {
        return DomHelper.elementFromPoint(x, y, this.documentRoot)?.closest(cardSelector);
    }

    //endregion

    //region Cached measurements

    // <remove-on-release>
    // TODO: Reset on CSS var change somehow? Or perhaps not likely to be needed
    // </remove-on-release>

    cacheCSSVar(name, defaultValue) {
        const me = this;

        let size = me[`_${name}`];

        if (size == null) {
            const value = me.css[name];

            size  = DomHelper.measureSize(value || defaultValue, me.element);

            // Don't cache if it's not visible
            if (value && me.isVisible) {
                me[`_${name}`] = size;
            }
        }

        return size;
    }

    // Cached card gap
    get cardGap() {
        return this.cacheCSSVar('cardGap', '1em');
    }

    //endregion

};
