import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/view/mixin/SchedulerDom
 */

/**
 * Mixin with EventModel and ResourceModel <-> HTMLElement mapping functions. Provides methods to look up
 * DOM elements from records and resolve records from DOM elements.
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.SchedulerDomEvents} - DOM event handling
 * - {@link Scheduler.view.Scheduler} - Scheduler widget
 *
 * @mixin
 */
export default Target => class SchedulerDom extends (Target || Base) {
    static $name = 'SchedulerDom';

    //region Get

    /**
     * Returns a single HTMLElement representing an event record assigned to a specific resource.
     * @param {Scheduler.model.AssignmentModel} assignmentRecord An assignment record

     * @returns {HTMLElement} The element representing the event record
     * @category DOM
     */
    getElementFromAssignmentRecord(assignmentRecord, returnWrapper = false, checkReleased = false, includeSplits = true) {
        const me = this;
        if (me.isPainted && assignmentRecord) {
            const { foregroundCanvas } = me;

            let wrapper = foregroundCanvas.syncIdMap?.[assignmentRecord.id];

            // When using links, the original might not be rendered but a link might
            if (!wrapper) {
                // If in LockRows context, check in the other split as well
                const otherSplitView = includeSplits && (me.subViews?.[0] || me.splitFrom);

                if (otherSplitView) {
                    wrapper = otherSplitView.getElementFromAssignmentRecord(assignmentRecord, true, checkReleased, false);
                }

                if (!wrapper && assignmentRecord.resource?.hasLinks) {
                    for (const link of assignmentRecord.resource.$links) {
                        wrapper = foregroundCanvas.syncIdMap?.[`${assignmentRecord.id}_${link.id}`];

                        if (!wrapper) {
                            if (checkReleased) {
                                // When event is released, it needs to retrieve it from releasedIdMap
                                wrapper = foregroundCanvas.releasedIdMap?.[`${assignmentRecord.id}_${link.id}`];

                                if (wrapper) {
                                    break;
                                }
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            }

            // When event is released, it needs to retrieve it from releasedIdMap
            if (!wrapper && checkReleased) {
                wrapper = foregroundCanvas.releasedIdMap?.[assignmentRecord.id];
            }

            // Wrapper won't have syncIdMap when saving dragcreated event from editor
            return returnWrapper ? wrapper : wrapper?.syncIdMap?.event;
        }

        return null;
    }

    /**
     * Returns a single HTMLElement representing an event record assigned to a specific resource.
     * @param {Scheduler.model.EventModel} eventRecord An event record
     * @param {Scheduler.model.ResourceModel} [resourceRecord] A resource record
     * @returns {HTMLElement} The element representing the event record
     * @category DOM
     */
    getElementFromEventRecord(eventRecord, resourceRecord = eventRecord.resources?.[0], returnWrapper = false, checkReleased = false) {
        if (eventRecord.isResourceTimeRange) {
            const wrapper = this.foregroundCanvas.syncIdMap?.[eventRecord.domId];

            return returnWrapper ? wrapper : wrapper?.syncIdMap.event;
        }

        const assignmentRecord = this.assignmentStore.getAssignmentForEventAndResource(eventRecord, resourceRecord);
        return this.getElementFromAssignmentRecord(assignmentRecord, returnWrapper, checkReleased);
    }

    /**
     * Returns all the HTMLElements representing an event record.
     *
     * @param {Scheduler.model.EventModel} eventRecord An event record
     * @param {Scheduler.model.ResourceModel} [resourceRecord] A resource record
     *
     * @returns {HTMLElement[]} The element(s) representing the event record
     * @category DOM
     */
    getElementsFromEventRecord(eventRecord, resourceRecord, returnWrapper = false, checkReleased = false) {
        // Single event instance, as array
        if (resourceRecord) {
            return [this.getElementFromEventRecord(eventRecord, resourceRecord, returnWrapper, checkReleased)];
        }
        // All instances
        else {
            return eventRecord.resources.reduce((result, resourceRecord) => {
                const el = this.getElementFromEventRecord(eventRecord, resourceRecord, returnWrapper, checkReleased);

                el && result.push(el);

                return result;
            }, []);
        }
    }

    //endregion

    //region Resolve

    /**
     * Resolves the resource based on a dom element or event. In vertical mode, if resolving from an element higher up in
     * the hierarchy than event elements, then it is required to supply coordinates since resources are virtual
     * columns.
     * @param {HTMLElement|Event} elementOrEvent The HTML element or DOM event to resolve a resource from
     * @param {Number[]} [xy] X and Y coordinates, required in some cases in vertical mode, disregarded in horizontal
     * @returns {Scheduler.model.ResourceModel} The resource corresponding to the element, or `null` if not found.
     * @category DOM
     */
    resolveResourceRecord(elementOrEvent, xy) {
        const
            element     = DomHelper.isDOMEvent(elementOrEvent) ? elementOrEvent.target : elementOrEvent,
            // An event bar represents its resource, which is not the resource of the row it is rendered on for a bar
            // rendered on behalf of another resource (GroupRollups)
            barResource = this.getLiveRecord(element.closest?.(this.eventSelector)?.elementData?.resourceRecord),
            resourceId  = element.dataset?.resourceId,
            rowRecord   = barResource || (resourceId && this.resourceStore.getById(resourceId)) ||
                this.currentOrientation.resolveRowRecord(elementOrEvent, xy);

        if (rowRecord?.isSpecialRow || !rowRecord?.isResourceModel) {
            return null;
        }

        return rowRecord;
    }

    /**
     * Product agnostic method which yields the {@link Scheduler.model.ResourceModel} record which underpins the row which
     * encapsulates the passed element. The element can be a grid cell, or an event element, and the result
     * will be a {@link Scheduler.model.ResourceModel}
     * @param {HTMLElement|Event} elementOrEvent The HTML element or DOM event to resolve a record from
     * @returns {Scheduler.model.ResourceModel} The resource corresponding to the element, or null if not found.
     * @category DOM
     */
    resolveRowRecord(elementOrEvent) {
        const element = DomHelper.isDOMEvent(elementOrEvent) ? elementOrEvent.target : elementOrEvent;

        // The row an event bar is rendered on, see resolveResourceRecord()
        return this.getLiveRecord(element?.closest?.(this.eventSelector)?.elementData?.rowRecord) ??
            this.resolveResourceRecord(elementOrEvent);
    }

    // elementData is not synced when a bar's DOM is unchanged, so after a reload it might still hold the replaced
    // records. Resolve the current record by id, records not in the store by id (group headers) are used as is
    getLiveRecord(record) {
        return record && (this.resourceStore.getById(record.id) ?? record);
    }

    /**
     * Returns the event record for a DOM element
     * @param {HTMLElement|Event} elementOrEvent The DOM node to lookup
     * @returns {Scheduler.model.EventModel} The event record
     * @category DOM
     */
    resolveEventRecord(elementOrEvent) {
        if (DomHelper.isDOMEvent(elementOrEvent)) {
            elementOrEvent = elementOrEvent.target;
        }

        const element = elementOrEvent?.closest(this.eventSelector);

        if (element) {
            if ('eventId' in element.dataset) {
                return this.eventStore.getById(element.dataset.eventId);
            }

            if ('assignmentId' in element.dataset) {
                return this.assignmentStore.getById(element.dataset.assignmentId).event;
            }
        }

        return null;
    }

    // Used by shared features to resolve an event or task
    resolveTimeSpanRecord(element) {
        return this.resolveEventRecord(element);
    }

    /**
     * Returns an assignment record for a DOM element
     * @param {HTMLElement} element The DOM node to lookup
     * @privateparam {Boolean} allowReleased Whether to allow resolving from a released event
     * @returns {Scheduler.model.AssignmentModel} The assignment record
     * @category DOM
     */
    resolveAssignmentRecord(element, allowReleased = false) {
        const
            eventElement     = element.closest(allowReleased ? '[data-assignment-id][data-event-id]' : this.eventSelector),
            assignmentRecord = eventElement && this.assignmentStore.getById(eventElement.dataset.assignmentId),
            eventRecord      = eventElement && this.eventStore.getById(eventElement.dataset.eventId);

        // When resolving a recurring event, we might be resolving an occurrence
        return this.assignmentStore.getOccurrence(assignmentRecord, eventRecord);
    }

    //endregion

    // Decide if a record is inside a collapsed tree node, or inside a collapsed group (using grouping feature)
    isRowVisible(resourceRecord) {
        // records in collapsed groups/branches etc. are removed from processedRecords
        return this.store.indexOf(resourceRecord) >= 0;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    isEventElement(domConfig) {
        const className = domConfig?.className;

        return Boolean(className?.[this.eventCls + '-wrap']);
    }
};
