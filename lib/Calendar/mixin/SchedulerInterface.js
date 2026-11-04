import Base from '../../Core/Base.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Calendar/mixin/SchedulerInterface
 */

const
    hasEventStore     = w => w.isCalendarMixin && w.eventStore,
    eventNameSplitter = /(click|touch|mouse|pointer|key|context|dbl)(.*)/,
    eventPartReplacer = (match, prefix, remainder) => `${StringHelper.capitalize(prefix)}${StringHelper.capitalize(remainder)}`,
    capitalizeEvent   = domEvent => domEvent.type.replace(eventNameSplitter, eventPartReplacer);

/**
 * Exposes an interface similar to a {@link Scheduler.view.Scheduler} so that Calendar features which
 * extend Scheduler features can treat their client in a standard manner. This mixin provides shim
 * properties such as `timeAxis` and `timeAxisViewModel`, hit-testing support via `calendarHitTest`,
 * and DOM event delegation logic that translates Calendar-specific DOM events into the event/resource
 * context expected by shared Scheduler feature code.
 * @private
 * @mixin
 */
export default Target => class SchedulerInterface extends (Target || Base) {
    static $name = 'SchedulerInterface';

    /**
     * Determines what is under the cursor of the specified event or what is described by the given element.
     * @param {Event|Element} domEvent The event or element
     * @returns {CalendarHit}
     */
    calendarHitTest(domEvent) {
        const
            { activeView } = this,
            target         = DomHelper.getEventElement(domEvent);

        return activeView?.element.contains(target) ? activeView.calendarHitTest(domEvent) : null;

        // <remove-on-release>
        // TODO: handle type=sidebar etc?
        // </remove-on-release>
    }

    // Hack to expose part of the Scheduler API that features and mixins inherited from Scheduler use.
    get timeAxis() {
        const me = this;

        if (!me._timeAxis) {
            me._timeAxis = {
                get startDate() {
                    return me.activeView.startDate;
                },

                get endDateDate() {
                    return me.activeView.endDate;
                },

                isTimeSpanInAxis(event) {
                    return DateHelper.intersectSpans(event.startDate, event.endDate, this.startDate, this.endDate);
                }
            };
        }

        return this._timeAxis;
    }

    // Hack to expose part of the Scheduler API that features use.
    get timeAxisViewModel() {
        const me = this;

        if (!me._timeAxisViewModel) {
            me._timeAxisViewModel = {
                get timeResolution() {
                    return me.activeView.timeResolution || {};
                }
            };
        }

        return this._timeAxisViewModel;
    }

    /**
     * Interface method required for navigation/selection.
     * Returns the event record for a DOM element.
     * @param {HTMLElement|Event} elementOrEvent The DOM node to lookup, or a DOM event whose target to lookup.
     * @returns {Scheduler.model.EventModel} The event record
     */
    resolveEventRecord(elementOrEvent) {
        if (DomHelper.isDOMEvent(elementOrEvent)) {
            elementOrEvent = elementOrEvent.target;
        }
        const activeClient = this.constructor.fromElement(elementOrEvent)?.closest(hasEventStore);

        return activeClient?.getEventRecord(elementOrEvent);
    }

    /**
     * Interface method required for navigation/selection
     * Assignment not supported in Calendar.
     * @private
     */
    resolveAssignmentRecord() {

    }

    /**
     * Interface method required for navigation/selection.
     * Returns the resource (calendar) record for a DOM element.
     * @param {HTMLElement|Event} elementOrEvent The DOM node to lookup, or a DOM event whose target to lookup.
     * @returns {Scheduler.model.ResourceModel} Any corresponding event record's resource if any.
     */
    resolveResourceRecord(elementOrEvent) {
        const element = elementOrEvent.nodeType === Node.ELEMENT_NODE ? elementOrEvent : elementOrEvent.target;

        // Find the closest element bearing a resource-id stamp if possible.
        // Otherwise, find the closest event record and return its resource.
        return this.resourceStore.getById(element.closest('[data-resource-id]')?.dataset.resourceId) ||
               this.resolveEventRecord(element)?.resource;
    }

    handleEvent(domEvent) {
        // Map event names, eg: contextmenu -> ContextMenu
        const eventName = capitalizeEvent(domEvent);

        // We are a Grid. Our superclass handleEvent distributes to onElementXxxx
        // This is called directly as part of the GridElementEvents mixin
        if (super.handleEvent) {
            super.handleEvent(domEvent);
        }
        // We are a regular CalendarMixin. We implement the interface of the Feature host as defined
        // in GridElementEvents.
        // We get here via Calendar's onViewCatchAll which directs allDomEvents through here
        // so ensure we only process each domEvent once.
        // For example, contextmenu in a Scheduler causes schedulecontextmenu
        // and cellcontextmenu both from the same initial DOM event.
        else  if (!domEvent.handled && !domEvent.schedulerRedirected) {
            if (this.trigger(`beforeElement${eventName}`, { event : domEvent, target : domEvent.target }) !== false) {
                this[`onElement${eventName}`]?.(domEvent);
            }
            // Sets this flag to avoid double invocation
            domEvent.schedulerRedirected = true;
        }
    }

    getCellDataFromEvent(domEvent) {
        return super.getCellDataFromEvent?.(domEvent);
    }

    getDateFromDomEvent(domEvent) {
        const activeClient = this.constructor.fromElement(domEvent)?.closest(hasEventStore);

        if (activeClient) {
            return activeClient.getDateFromDomEvent(domEvent);
        }
    }

    getDateFromXY(xy, roundingMethod, local = true, allowOutOfRange) {
        const activeClient = this.activeSubView;

        if (activeClient) {
            return activeClient.getDateFromPosition(xy[0] - globalThis.scrollX, xy[1] - globalThis.scrollY, local);
        }
    }

    // Used by shared feature code.
    // Route to view's create implementation.
    createEvent() {
        this.activeView.createEvent(...arguments);
    }

    // It's fixed to be enabled for now
    get enableRecurringEvents() {
        return true;
    }

    intersectsVisibleTimeSpan(timespan) {
        const { activeView } = this;
        return DateHelper.intersectSpans(activeView.startDate, activeView.endDate, timespan.startDate, timespan.endDate);
    }

    // Used by shared feature code. Not relevant in Calendar
    getRowFor() { }

    // Used by shared feature code. Could implement if needed.
    suspendRefresh() { }

    // Used by shared feature code. Could implement if needed.
    resumeRefresh() { }

    get widgetClass() {}
};
