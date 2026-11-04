/**
 * @module Scheduler/util/TimelineContext
 */

/**
 * This class encapsulates a schedule timeline tick context based on a DOM event. This will include
 * the row and resource information and the tick and time information for a DOM pointer event detected
 * in the timeline.
 *
 * ```javascript
 * scheduler.on('scheduleClick', (context) => {
 *     console.log('Clicked date:', context.date);
 *     console.log('Resource:', context.resourceRecord.name);
 *     console.log('Tick index:', context.tickIndex);
 * });
 * ```
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #property-date}                       | Date at the pointer position                        |
 * | {@link #property-resourceRecord}             | Resource record at the pointer position             |
 * | {@link #property-eventRecord}                | Event record at the pointer (if any)                |
 * | {@link #property-tick}                       | Tick data object at the pointer position            |
 * | {@link #property-row}                        | Grid row at the pointer position                    |
 * | {@link #property-domEvent}                   | Original DOM event                                  |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.ScheduleContext} - Schedule cell selection feature
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 */
export default class TimelineContext {

    static isTimelineContext = true;

    get isTimelineContext() {
        return true;
    }

    constructor(config) {
        const me = this;

        if (config) {
            let {
                assignmentRecord,
                column,
                date,
                domEvent,
                event,
                index,
                record,
                resourceRecord,
                rowIndex,
                tick,
                tickIndex,
                time
            } = config;

            const
                { id, scheduler, eventRecord, taskRecord, row, eventElement, cellElement } = config,
                timeAxis = scheduler?.timeAxis;

            if (scheduler && !column) {
                column = scheduler.timeAxisColumn;
            }

            // use rowIndex or index provided
            rowIndex = index = rowIndex === undefined ? index : rowIndex;

            if (!record) {
                // rows in the Gantt are tasks
                if (scheduler?.isGantt) {
                    record = taskRecord;
                }
                // in Scheduler they are resources normally
                else if (resourceRecord) {
                    record = resourceRecord;
                }
            }

            if (record) {
                if (record.isResourceModel && !resourceRecord) {
                    resourceRecord = record;
                }

                if (record.isAssignmentModel && !assignmentRecord) {
                    assignmentRecord = record;
                }

                // if rowIndex still has no value calculate it from record
                if (rowIndex === undefined && scheduler) {
                    rowIndex = index = scheduler.store.indexOf(record);
                }
            }

            if (domEvent === undefined) {
                domEvent = event;
            }
            else {
                event = domEvent;
            }

            if (timeAxis && (time || date) && !tick) {
                if (time) {
                    date = timeAxis.floorDate(time);
                }
                else {
                    time = date;
                }

                tickIndex = timeAxis.getTickFromDate(date);
            }

            if (tick) {
                tickIndex = tick.parentIndex;
            }
            else if (tickIndex !== undefined && timeAxis) {
                tick = timeAxis.getAt(Math.floor(tickIndex));
            }

            if (tick) {
                date = date || tick.startDate;
                time = time || tick.startDate;
            }

            Object.assign(me, {
                ...config,
                id,
                scheduler,
                column,
                row,
                rowIndex,
                record,
                resourceRecord,
                assignmentRecord,
                eventRecord,
                tick,
                tickIndex,
                date,
                time,
                domEvent,
                eventElement,
                cellElement
            });

            if (!me.id) {
                me.id = record.id + ':' + tick?.id;
            }
        }
    }

    equals(other) {
        const me = this;

        return other &&
            (
                me.record === other.record ||
                ((!me.record || !other.record) && me.index === other.index)
            ) &&
            me.tickParentIndex === other.tickParentIndex &&
            // make sure ticks are not regenerated and introduce another date?
            !((me.tickStartDate || 0) - (other.tickStartDate || 0)) &&
            me.eventRecord === other.eventRecord;
    }

    /**
     * A {@link Scheduler.model.TimeSpan} record which encapsulates the contextual tick
     * @prp {Scheduler.model.TimeSpan} tick
     */

    /**
     * The contextual tick index. This may be fractional.
     * @prp {Number} tickIndex
     */

    /**
     * The integer contextual tick index.
     * @member {Number}
     * @readonly
     */
    get tickParentIndex() {
        return this.tick?.parentIndex;
    }

    /**
     * The start date of the contextual tick.
     * @prp {Date}
     * @readonly
     */
    get tickStartDate() {
        return this.tick?.startDate;
    }

    /**
     * The end date of the contextual tick.
     * @prp {Date}
     * @readonly
     */
    get tickEndDate() {
        return this.tick?.endDate;
    }

    /**
     * The contextual {@link Grid.row.Row row}
     * @prp {Grid.row.Row} row
     */

    /**
     * The contextual record
     * @prp {Core.data.Model} record
     */

    /**
     * The contextual event record (if any)
     * @prp {Scheduler.model.EventModel} eventRecord
     */

    /**
     * The contextual assignment record (if any)
     * @prp {Scheduler.model.AssignmentModel} assignmentRecord
     */

    /**
     * The contextual resource record (if any)
     * @prp {Scheduler.model.ResourceModel} resourceRecord
     */

    /**
     * The owning scheduler/gantt widget.
     * @prp {Scheduler.view.TimelineBase} scheduler
     */

    /**
     * The DOM event which triggered the context change.
     * @prp {Event} domEvent
     */

    get event() {
        return this.domEvent;
    }

    set event(event) {
        this.domEvent = event;
    }

    /**
     * If the `domEvent` was on an event bar, this will be the event bar element.
     * @prp {HTMLElement} eventElement
     */

    /**
     * The cell element under the `domEvent`
     * @prp {HTMLElement} cellElement
     */

    /**
     * The date corresponding to the `domEvent` position in the timeline floored
     * to the {@link Scheduler.data.TimeAxis} resolution and resolutionIncrement
     * @prp {Date} date
     */

    /**
     * The date corresponding as close as can be determined to the `domEvent` position in the timeline
     * @prp {Date} time
     */

    /**
     * The contextual row index
     * @prp {Number} rowIndex
     */

    /**
     * The contextual row index.
     * An alias for {@link #property-rowIndex}.
     * @prp {Number}
     */
    set index(index) {
        this.rowIndex = index;
    }

    get index() {
        return this.rowIndex;
    }

    get column() {
        return this._column;
    }

    set column(column) {
        this._column = column;
    }

}
