import Base from '../../Core/Base.js';
import CalendarFeature from './CalendarFeature.js';
import DH from '../../Core/helper/DateHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import DayTime from '../../Core/util/DayTime.js';
import Draggable from '../../Core/mixin/Draggable.js';
import Droppable from '../../Core/mixin/Droppable.js';
import Hoverable from '../../Core/mixin/Hoverable.js';
import Widget from '../../Core/widget/Widget.js';
import CalendarZone from './CalendarZone.js';

import '../../Core/util/drag/DragTipProxy.js';
import '../widget/EventTip.js';
import Duration from '../../Core/data/Duration.js';

DomHelper.loadStylesheet('Calendar/feature/CalendarDrag.css');

// import Stylesheet from './CalendarDrag.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'CalendarDrag');

/**
 * @module Calendar/feature/CalendarDrag
 */

/**
 * An immutable object that describes a calendar drag mode. These objects are used to simplify detecting the drag mode
 * to apply appropriate actions.
 *
 * @typedef {Object} CalendarDragMode
 * @property {'create'|'move'|'resize'} type The value `'create'`, `'move'`, or `'resize'`.
 * @property {Boolean} create The value `true` if `type === 'create'`, otherwise `false`.
 * @property {Boolean} move The value `true` if `type === 'move'`, otherwise `false`.
 * @property {Boolean} resize The value `true` if `type === 'resize'`, otherwise `false`.
 */

/**
 * Information about an ongoing calendar drag (create, move or resize) gesture, passed as the `drag` parameter to the
 * {@link Calendar.feature.CalendarDrag} events.
 *
 * @typedef {Object} CalendarDragContext
 * @property {Event} event The DOM event currently being processed.
 * @property {Event} startEvent The DOM event that started the drag operation.
 * @property {Event} endEvent The DOM event that completed the drag (a `mouseup`, `pointerup` or `touchend`).
 * @property {HTMLElement} element The element from which the drag operation started.
 * @property {Boolean} altKey `true` if the Alt key was down when the last event was processed.
 * @property {Boolean} ctrlKey `true` if the Ctrl key was down when the last event was processed.
 * @property {Boolean} metaKey `true` if the Meta key was down when the last event was processed.
 * @property {Boolean} shiftKey `true` if the Shift key was down when the last event was processed.
 */

const
    tentativeCls      = 'b-cal-tentative-event',
    SECONDS           = 1000,
    MINUTES           = 60 * SECONDS,
    HOURS             = 60 * MINUTES,
    DAY_MS            = 24 * HOURS,
    YYYY_MM_DD        = 'YYYY-MM-DD',
    edgeRe            = /^b-hover-(top|right|bottom|left)$/,
    zoneEdges         = { t : 'top', r : 'right', b : 'bottom', l : 'left' },
    eventDragSym      = Symbol('eventDragMode'),
    appendEventFooter = (domConfig, footer) => {
        let ret;
        if (domConfig.className.includes?.('b-cal-event-body')) {
            domConfig.children.push(ret = footer);
        }
        else if (Array.isArray(domConfig.children)) {
            // <remove-on-release>
            // TODO: Support children: {ref: config} form as needed
            // </remove-on-release>
            domConfig.children.forEach(c => {
                if (!ret && c) {
                    ret = appendEventFooter(c, footer);
                }
            });
        }

        return ret;
    },
    // Returns the time of `ms` into the calendar day containing `dayStart`, as a timestamp.
    //
    // `dateHelper` must be the owning view's, not the static DateHelper: it is timezone aware when the Calendar
    // configures a `timeZone`, and building the time with the static helper would use the browser's zone instead.
    //
    // Whole days advance the date and the remainder is applied as wall clock fields, because adding the
    // milliseconds would land an hour out on a DST transition day - the "Not this:" comment in DayTime#shiftDate
    // warns against exactly that. The object form of set() is used rather than a single millisecond value, which
    // Temporal's with() clamps to 999 natively while the polyfill rolls it over.
    atTimeOfDay       = (dateHelper, dayStart, ms) => {
        const
            // clearTime clones by default, so the caller's date is not mutated
            dayDate   = dateHelper.clearTime(dayStart, true),
            days      = Math.floor(ms / DAY_MS),
            remainder = ms - days * DAY_MS;

        if (days) {
            dateHelper.add(dayDate, days, 'd', false);
        }

        dateHelper.set(dayDate, {
            hour        : Math.floor(remainder / HOURS),
            minute      : Math.floor(remainder / MINUTES) % 60,
            second      : Math.floor(remainder / SECONDS) % 60,
            millisecond : remainder % SECONDS
        });

        return dayDate.getTime();
    },
    // Rewrites `date` onto the calendar day of `dayDate`, preserving its time of day.
    //
    // `dateHelper` must be the owning view's: native Date getters and setters work in the browser's zone, so with a
    // Calendar `timeZone` configured both the read and the write side would use the wrong frame.
    //
    // The day of month is parked at 1 before the month is set, because applying it first overflows a short month -
    // Feb 1 with the day set to 31 becomes Mar 3, and the following setMonth then lands in the wrong month. The
    // object form of set() cannot be used here: it deliberately sorts smallest unit first, which is that same order.
    moveToDayOf       = (dateHelper, date, dayDate) => {
        dateHelper.set(date, 'date', 1);
        dateHelper.set(date, 'year', dateHelper.getFullYear(dayDate));
        dateHelper.set(date, 'month', dateHelper.getMonth(dayDate));
        dateHelper.set(date, 'date', dateHelper.getDate(dayDate));
    },
    makeMode          = type => Object.freeze({
        type,
        create : false,
        move   : false,
        resize : false,
        [type] : true
    }),
    modeDescriptor    = {
        create : {
            finisher    : 'finishDropCreate',
            mode        : makeMode('create'),
            validatorFn : 'validateCreateFn'
        },
        move : {
            finisher    : 'finishDropMove',
            mode        : makeMode('move'),
            validatorFn : 'validateMoveFn'
        },
        resize : {
            finisher    : 'finishDropResize',
            mode        : makeMode('resize'),
            validatorFn : 'validateResizeFn'
        }
    },
    metaProp = Symbol('meta');

/*
 Base class for all zones, however, not all zones support all capabilities. DayView and WeekView are all of these
 things. Their events can be dragged between days, resized to change times of day, and an event can be dropped on
 to the calendar cells. While the YearView does not have events presented for dragging and so is not actually
 draggable, it is droppable since an event can be dropped on a day cell. MonthView is draggable and droppable,
 however, it is not hoverable since its events cannot be "resized". Finally, events in the OverflowPopup can only
 be dragged.
 */
class Zone extends CalendarZone.mixin(Draggable, Droppable, Hoverable) {
    static $name = 'Zone';
    static tier = 'community';

    static configurable = {
        // We limit dropping to all *children* of the Droppable, not the Droppable element itself.
        // So that we avoid triggering "over" or "drop" on borders which would give incorrect
        // positional calculations.
        droppableSelector : '*',

        droppable : true,
        hoverable : null,

        /**
         * Set to `false` through the view's {@link Calendar.widget.mixin.CalendarMixin#config-dragZoneConfig} to stop
         * events being drag-moved in this view only, leaving the rest of the Calendar alone.
         *
         * This can only further restrict the feature's own {@link Calendar.feature.CalendarDrag#config-draggable}:
         * where that is already `false`, `true` here does not re-enable dragging.
         * @config {Boolean}
         * @default
         */
        draggable : null,

        /**
         * Set to `false` through the view's {@link Calendar.widget.mixin.CalendarMixin#config-dragZoneConfig} to stop
         * events being drag-resized in this view only, leaving the rest of the Calendar alone.
         *
         * This can only further restrict the feature's own {@link Calendar.feature.CalendarDrag#config-resizable}:
         * where that is already `false`, `true` here does not re-enable resizing.
         * @config {Boolean}
         * @default
         */
        resizable : null,

        /**
         * Set to `false` through the view's {@link Calendar.widget.mixin.CalendarMixin#config-dragZoneConfig} to stop
         * events being drag-created in this view only, leaving the rest of the Calendar alone.
         *
         * This can only further restrict the feature's own {@link Calendar.feature.CalendarDrag#config-creatable}:
         * where that is already `false`, `true` here does not re-enable creation.
         * @config {Boolean}
         * @default
         */
        creatable : null,

        hoverAnimationCls : 'b-hover-anim',

        days : {
            $config : {
                // DayResourceView includes the resource as part of the days config.
                equal : (d1, d2) => ObjectHelper.isEqual(d1, d2) && d1?.resource === d2?.resource
            },

            value : null
        },

        dragProxy : {
            type    : 'tip',
            tooltip : null  // borrowed from the Feature instance's tooltip config
        },

        eventRecord : null,

        hit : null,

        dragItemSelector : '.b-cal-event-wrap',

        overflow : {
            $config : 'nullify',

            value : null
        },

        rootElement : null
    };

    get dayTime() {
        return this.view?.dayTime;
    }

    clearTime(date) {
        return this.dayTime.startOfDay(date);
    }

    findRootElement(view) {
        return view.contentElement;
    }

    getDateFromPosition(clientX, clientY) {
        return this.view.getDateFromPosition(clientX, clientY, false, this.view.dayTime);
    }

    // Draggable behaviors

    get dragEventer() {
        return this.owner;
    }

    beforeDrag(drag) {
        const
            me          = this,
            { owner }   = me,
            hit         = me.hitTest(drag),
            eventRecord = hit?.eventRecord,
            insetProp   = me.view.rtl ? 'right' : 'left';

        if (!hit || eventRecord?.readOnly || eventRecord?.isCreating) {
            return false;
        }

        hit.date && drag.set('date', hit.date);
        hit.resource && drag.set('resource', hit.resource);

        let mode, veto;

        switch (hit.type) {
            case 'event':
                drag.set('eventRecord', eventRecord);
                drag.set('eventSourceHit', hit);
                drag.set('eventInset', DomHelper.getStyleValue(hit.eventElement, insetProp));
                drag.set('eventWidth', hit.eventElement.offsetWidth);

                mode = 'move';
                veto = !owner.draggable || !eventRecord.isDraggable || me.draggable === false;

                if (!veto) {
                    me.captureDragOffset(eventRecord, hit, drag);
                }

                break;

            case 'resize':
                // Can get here without eventRecord when smart monkeys manages to start resizing an event after it has
                // been deleted, but before the DOM has been updated
                if (!eventRecord) {
                    return false;
                }

                drag.set('eventRecord', eventRecord);
                drag.set('eventSourceHit', hit);
                drag.set('eventInset', DomHelper.getStyleValue(hit.eventWrap, insetProp));
                drag.set('eventWidth', hit.eventWrap.offsetWidth);

                mode = 'resize';
                veto = !owner.resizable || !eventRecord.resizable || me.resizable === false;

                break;

            case 'schedule':
            case 'dayNumber':
                drag.set('eventCreate', hit);

                mode = 'create';
                veto = !owner.creatable || me.creatable === false;

                break;

            default:
                return false;
        }

        if (veto) {
            return false;
        }
        if (me.view[`allowDrag${StringHelper.capitalize(mode)}`] === false) {
            return false;
        }

        drag.set('eventDragMode', drag[eventDragSym] = modeDescriptor[mode].mode);
    }

    dragStart() {
        const
            me                               = this,
            { dragging : drag, owner, view } = me,
            { client }                       = owner,
            callback                         = () => {
                drag.lastMoveEvent && drag.move(drag.lastMoveEvent);
            },
            config                           = {
                scrollables : client.scrollManager ? [
                    {
                        element : client.viewContainer.element,
                        callback
                    }
                ] : []
            };

        // Hide any event tooltip on start of drag
        client.features.eventTooltip?.tooltip?.hide();

        // NOTE: Adding b-resizing kicks in display:none which focuses the <body>, so capture it first:
        if (me.isResizing || me.isMoving) {
            me.refocus = owner.client.captureFocus();
        }
        if (me.isResizing) {
            drag.itemElement?.classList.add('b-resizing');
        }

        if (view.scrollable) {
            config.scrollables.push({
                element : view.scrollable.element,
                callback
            });
        }

        // DayViews may have an extra scroller
        if (view.horizontalScroller) {
            config.scrollables.push({
                element : view.horizontalScroller.element,
                callback
            });
        }

        client.scrollManager?.startMonitoring(config);
    }

    captureDragOffset() {
        // empty by default
    }

    cleanupDrag() {
        const
            me                      = this,
            { dragProxy, dragging } = me,
            { tooltip }             = dragProxy,
            view                    = me.view.isOverflowPopup ? me.view.owner : me.view,
            { client }              = me.owner,
            activeElement           = DomHelper.getActiveElement(client);

        dragging?.itemElement?.classList.remove('b-resizing');

        if (dragging?.aborted) {
            me.days = null;
        }

        // Do not refocus immediately. The UI will not be in its new state.
        // Refocus after the impending refresh.
        view.afterRefresh(() => {
            me.eventRecord && (me.days = null);  // day view resize uses days/times as drag feedback
            // Try to refocus element without scrolling unless focus has moved since the drop.
            if (DomHelper.getActiveElement(client) === activeElement) {
                me.refocus?.(false, true);
            }
            me.refocus = null;
        });

        if (tooltip) {
            tooltip.hide();
            dragProxy.tooltip = null;
        }
    }

    dragEnd() {
        this.owner.client?._scrollManager?.stopMonitoring();

        this.cleanupDrag();
    }

    makeDays(startDate, endDate) {
        const
            { dayTime, firstVisibleDate, lastVisibleDate } = this.view,
            days = [];

        endDate = DH.add(endDate, -1, 'd');  // endDate is exclusive, but lastVisibleDate is inclusive

        [startDate, endDate] = [startDate, endDate].map(
            d => d < firstVisibleDate ? firstVisibleDate : (lastVisibleDate < d ? lastVisibleDate : d));

        let date = dayTime.startOfDay(startDate);

        // We do ceil(endDate) to handle events that start/end on the same day
        // Note: "!(end < date)" ==> "date <= end" but works for Date since they are never ==
        for (const end = dayTime.ceil(endDate); !(end < date); date = DH.add(date, 1, 'day')) {
            days.push(dayTime.dateKey(date));
        }

        return days;
    }

    onShowOverflowPopup({ overflowPopup }) {
        if (!this.overflow) {
            this.overflow = new OverflowZone({
                owner : this.owner,
                view  : overflowPopup
            });
        }
    }

    // Droppable behaviors

    get calendarCellSelector() {
        return this.view.visibleCellSelector;
    }

    get calendarCells() {
        const container = this.dropRootElement;

        return container && DomHelper.children(container, this.calendarCellSelector);
    }

    get isCreating() {
        return this.dropping?.[eventDragSym]?.create;
    }

    get isMoving() {
        const mode = this.dropping?.[eventDragSym] || this.dragging?.[eventDragSym];

        return mode ? mode.move : Boolean(this.dropping?.peek('eventRecord'));
    }

    /**
     * Returns true if a resize operation is active
     * @member {Boolean}
     * @readonly
     */
    get isResizing() {
        return this.dragging?.[eventDragSym]?.resize;
    }

    get recurrable() {
        return this.isDayZone || this.isMonthZone;
    }

    cleanupDrop() {
        this.eventRecord = this.eventDom = this.days = null;
        this.noTip = false;
    }

    createEvent(data, dropping = this.dropping) {
        // We can get here for an AllDay zone when the day detail zone is creating a multi-day event, but that's the
        // only time we won't be processing our own drop.
        const mode = dropping?.[eventDragSym] || modeDescriptor.create.mode;

        this.setupEvent(data, mode.create);
    }

    validateDrag(drag) {
        const
            me            = this,
            eventRecord   = me.eventRecord || drag.peek('eventRecord'),
            { hit, view } = me;

        if (hit) {
            const event = {
                ...hit,
                domEvent       : drag.event,
                eventRecord,
                newStartDate   : eventRecord?.startDate,
                newEndDate     : eventRecord?.endDate,
                resourceRecord : hit.resourceRecord || hit.resource || view.resource,
                mode           : drag.peek('eventDragMode')?.type,
                view
            };

            // Allow applications to veto the move by returning false from the "drag" event.
            // This allows them to disable dropping on certain dates, or dynamically update the UI
            // with drag state feedback.
            return me.owner.client.trigger('drag', event);
        }
    }

    async dragDrop(drag) {
        if (this.isResizing || drag.target === this) {
            // finalizer is a Promise that the DragContext (which is a Finalizable) awaits in its finalize() method.
            return drag.finalizer = this.finishDrop(drag);
        }
    }

    dragEnter(drag) {
        const
            me   = this,
            mode = drag[eventDragSym],
            hit  = (drag.source === me && drag.peek('eventSourceHit')) || me.hitTest(drag);

        if (me.isMoving) {
            // we need to know the hit target at all times during drag, but we're not ready to process updateHit until
            // we get past setupEvent
            me._hit = hit;
            me.startMove(drag.peek('eventRecord'));
        }
        else if (!mode || drag.source !== me) {
            return false;
        }
        else if (mode.resize) {
            me._hit = hit;
            me.startResize(hit);
        }
        else if (mode.create) {
            me._hit = hit;
            me.startCreate(drag.peek('date'), drag.peek('eventCreate'));
        }
        else {
            return false;
        }
    }

    dragLeave() {
        if (!this.isResizing) {
            this.cleanupDrop();
        }
    }

    dragMove(drag) {
        this.hit = this.pickDropTarget(drag);  // see updateHit for side effects
    }

    dropHitMove(drag, hit, eventRecord) {
        const
            me                     = this,
            { endDate, startDate } = eventRecord.isScheduled ? eventRecord : me.eventRecord,
            durationSec            = DH.diff(startDate, endDate, 's');

        let { date, resource } = hit;

        date = me.clearTime(date);

        if (!eventRecord.allDay) {
            date = DH.add(date, DH.diff(me.clearTime(startDate), startDate, 's'), 's');
        }

        date = me.applyDragOffset(date, drag);

        const data = {
            startDate : date,
            endDate   : DH.add(date, durationSec, 's')
        };

        // If this is a resource-specific view, hit testing will include the resource.
        if (resource?.eventColor) {
            data.eventColor = resource.eventColor;
        }

        me.setEventData(data);
    }

    dropHitNowhere() {
        this.days = null;
    }

    dropHitResize(drag, hit, eventHit) {
        const
            me                     = this,
            { eventRecord }        = me,
            { startDate, endDate } = eventRecord,
            date                   = me.clearTime(hit.date);

        let changes, end;

        if (eventHit.atEnd) {
            end = DH.add(date, 1, 'd');

            changes = {
                startDate,
                endDate : (startDate < end) ? end : DH.add(startDate, 1, 'd')
            };
        }
        else {
            changes = {
                startDate : (date < endDate) ? date : DH.add(endDate, -1, 'd'),
                endDate
            };
        }

        changes.duration = DH.diff(changes.startDate, changes.endDate, eventRecord.durationUnit);

        me.setEventData(changes);
    }

    async finishDrop(drag) {
        const
            me             = this,
            {
                eventRecord,
                owner,
                view
            }              = me,
            { eventStore } = view,
            mode           = drag[eventDragSym],
            descriptor     = modeDescriptor[mode?.type || 'move'];

        if (descriptor && me.hit) {
            const validation = descriptor.validatorFn
                ? await owner.callback(owner[descriptor.validatorFn], owner, [{
                    drag,
                    view,
                    eventRecord,
                    domEvent : drag.event,
                    event    : drag.event
                }])
                : true;

            // Lift retainElement restriction from the tentative event element(s)
            view.eventContentElement.querySelectorAll('.b-cal-tentative-event').forEach(e => e.retainElement = false);

            if (validation !== false) {
                await me[descriptor.finisher](drag, owner, eventRecord, eventStore, validation,
                    async(eventName, callback, callbackFalse) => {
                        let info = {
                            drag,

                            // Maintainer: The actual event record being moved or resized is kept in the drag context.
                            // The local eventRecord variable is a proxy when moving or resizing because
                            // the real event is attached to a Project and Stores so must not be mutated.
                            // In the case of a drag *create* or drag *in* from an external zone, we must pass
                            // the local eventRecord because in this case there is no original dragged record.
                            eventRecord : mode?.move || mode?.resize ? drag.peek('eventRecord') : eventRecord,

                            // This is always the event actually being changed, so an app can see the tentative
                            // new information such as dates and allDay flag
                            proxyEventRecord : eventRecord,

                            // The new start and end dates are passed separately to avoid confusion.
                            // These will always be the new values regardless of whether the operation
                            // is a move, resize or create or drag from external.
                            newStartDate   : eventRecord.startDate,
                            newEndDate     : eventRecord.endDate,
                            resourceRecord : me.hit.resource || view.resource,
                            validation,
                            event          : drag.event,
                            domEvent       : drag.event,
                            feature        : owner,
                            view           : drag[me.isResizing ? 'source' : 'target'].view
                        };

                        // First trigger a preventable beforeXXX event to allow outside world to veto this operation
                        const result = await owner.client.trigger('before' + StringHelper.capitalize(eventName), info);

                        if (result === false) {
                            info = false;
                            await callbackFalse?.();
                        }
                        else {
                            // The event bar must *not* animate to its new size when reacting to the data change
                            view.allowTransitionsOnRefresh = false;
                            await callback?.();
                            delete info.newStartDate;
                            delete info.newEndDate;
                            if (mode?.type !== 'create') {
                                // The "after" event must see the final state of the event
                                // Try to access the resized/moved event, fallback to creating event
                                info.eventRecord = drag.peek('eventRecord') || eventRecord;
                            }
                            owner.client.trigger(eventName, info);
                        }

                        // return the event info object to allow event handlers to return data by poking on to that
                        // object.
                        return info;
                    });
            }
        }

        me.isFinishing = true;
        me.cleanupDrop();
    }

    async finishDropCreate(drag, owner, eventRecord, eventStore, validation, triggerFn) {
        const add = validation?.add !== false;

        /**
         * This event fires on the owning Calendar before a drag creation gesture is started. Return `false` to
         * veto the operation.
         * @event beforeDragCreate
         * @preventable
         * @on-owner
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag create context.
         * @param {Event} domEvent The browser event.
         * @param {Date} date The date at the drag DOM event position.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record if the gesture was performed
         * in a resource-type view.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {CalendarView} view The Calendar widget in which the drag is being started.
         */

        /**
         * This event fires on the owning Calendar before a drag creation gesture is completed. Return `false` to
         * immediately veto the operation or a Promise yielding `true` or `false` for async vetoing.
         * @event beforeDragCreateEnd
         * @preventable
         * @on-owner
         * @async
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag create context.
         * @param {Event} event The browser event.
         * @param {Event} domEvent The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The `EventModel` record being created that has not yet been added in the store.
         * @param {Date} newStartDate The new start date.
         * @param {Date} newEndDate The new end date.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record if the gesture was performed
         * in a resource-type view.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {Boolean|ValidateCreateResult} validation The result of the {@link #config-validateCreateFn} if one
         * was provided.
         * @param {CalendarView} view The Calendar widget in which the drag completed.
         */

        /**
         * This event fires on the owning Calendar when a drag creation gesture is completed.
         * @event dragCreateEnd
         * @on-owner
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag create context.
         * @param {Event} event The browser event.
         * @param {Event} domEvent The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The new `EventModel` record added in the store.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record if the gesture was performed
         * in a resource-type view.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {Boolean|ValidateCreateResult} validation The result of the {@link #config-validateCreateFn} if one
         * was provided.
         * @param {CalendarView} view The Calendar widget in which the drag completed.
         */

        /**
         * This event fires on the owning Calendar when the pointer is moved during a drag operation.
         *
         * This event is preventable and may be used to inhibit the default drag behavior of the feature.
         * For example, if you want to allow dragging only within or onto certain dates, you can listen to this
         * event and return `false` when the pointer is over a disallowed date.
         *
         * The start and end dates and the resource (if applicable) are the *updated* values based on the drag position. If this event is prevented,
         * the drag operation will be reverted to the last *valid* position. So a drag operation may be vetoed multiple times
         * during a single drag gesture to, for example constrain the drag within certain bounds. On mouseup, the drop will take place at the last
         * *valid* position.
         * @event drag
         * @on-owner
         * @preventable
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {Event} domEvent The browser event.
         * @param {'move'|'resize'|'create'} mode The drag mode.
         * @param {HTMLElement} cell The calendar cell element at the pointer position.
         * @param {Scheduler.model.EventModel} eventRecord The `EventModel` record being dragged.
         * This will be the tentative record being created when `mode` is `'create'`.
         * @param {Date} newStartDate The new start date based on the drag position. This will be updated on every pointer move.
         * @param {Date} newEndDate The new end date based on the drag position. This will be updated on every pointer move.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record. Present only if the view
         * supports resources and the target is associated with one.
         * @param {Date} date The date at the drag DOM event position
         * (Snapped according to the `view`'s snap settings for {@link Calendar.widget.DayView}).
         * @param {Date} preciseDate The precise date at the drag DOM event position without any snapping.
         * @param {Number[]} [week] The target week if it can be determined: `[year, weekInYear]`.
         * @param {CalendarView} view The Calendar widget in which the drag is occurring.
         */

        // If any handler was async, the promise will be returned.
        // If not presented with a Promise, await yields the immediate value.
        const result = await triggerFn('dragCreateEnd');

        if (result === false) {
            if (add) {
                eventStore.remove(eventRecord);
            }
        }
        else if (add && !eventStore.includes(eventRecord)) {
            eventStore.add(eventRecord);
        }
    }

    async finishDropMove(drag, owner, eventRecord, eventStore, validation, triggerFn) {
        let dropRec = await drag.get('eventRecord');

        const
            me           = this,
            { view }     = me,
            storeRec     = dropRec.isOccurrence ? dropRec.recurringTimeSpan : dropRec,
            { source }   = drag,
            fromResource = await drag.get('resource'),
            toResource   = me.hit.resource,
            interView    = source !== me,
            // If the sourceStore is not the same as the destination store, maybe they would like the
            // record to be removed on successful drop depending on how removeFromExternalStore is set.
            sourceStore  = interView && source.view?.eventStore && view.eventStore && source.view.eventStore !== view.eventStore ? source.view.eventStore : await drag.get('sourceStore'),
            isReassign   = toResource && toResource !== fromResource;

        // Return if we detect that it's a no-op.
        if (!isReassign && drag.source === drag.target &&
                DH.isEqual(eventRecord.startDate, dropRec.startDate) &&
                DH.isEqual(eventRecord.endDate, dropRec.endDate)) {
            if (dropRec.eventStore === eventStore) {
                return;
            }
        }

        /**
         * This event fires on the owning Calendar before a drag move gesture is started. Return `false` to
         * veto the operation.
         * @event beforeDragMove
         * @preventable
         * @on-owner
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag move context.
         * @param {Event} domEvent The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The `EventModel` record being moved.
         * @param {Date} date The date at the drag DOM event position.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record if the gesture was performed
         * in a resource-type view.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {CalendarView} view The Calendar widget in which the drag is being started.
         */

        /**
         * This event fires on the owning Calendar before a drag move gesture is completed. Return `false` to immediately veto the operation
         * or a Promise yielding `true` or `false` for async vetoing.
         * @event beforeDragMoveEnd
         * @preventable
         * @on-owner
         * @async
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag create context.
         * @param {Event} event The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The `EventModel` record that has *not yet been updated* in the store.
         * @param {Scheduler.model.EventModel} proxyEventRecord The `EventModel` record that is being used as a proxy for the
         * drag operation and being updated on every pointer move. This will contain changed values based on the drag position.
         * @param {Date} newStartDate The new start date.
         * @param {Date} newEndDate The new end date.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record if the gesture was performed
         * in a resource-type view.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {Boolean|ValidateCreateResult} validation The result of the {@link #config-validateMoveFn} if one was
         * provided.
         * @param {CalendarView} view The Calendar widget in which the drag completed.
         */

        /**
         * This event fires on the owning Calendar when a drag move gesture is completed. The `eventRecord` has already been added
         * to the `eventStore` of the owning calendar.
         * @event dragMoveEnd
         * @on-owner
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag create context.
         * @param {Event} event The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The updated `EventModel` record.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record if the gesture was performed
         * in a resource-type view.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {Boolean|ValidateCreateResult} validation The result of the {@link #config-validateMoveFn} if one was
         * provided.
         * @param {CalendarView} view The Calendar widget in which the drag completed.
         */

        await triggerFn('dragMoveEnd', async() => {
            // It's a drag from an external EventStore.
            // If a handler sets isCopy in the data, we add the
            // tentative event as a copy of the original.
            if (!eventStore.getByInternalId(storeRec.internalId)) {
                if (sourceStore) {
                    // Remove from the source store if Feature is configured to do so.
                    if (me.owner.removeFromExternalStore) {
                        sourceStore.remove(dropRec);
                    }
                    // If we are keeping the source record in the external store, then
                    // the instance in this store has to be a copy so that dragging it in
                    // multiple times will create multiple events in the Calendar.
                    else {
                        dropRec = dropRec.copy();
                    }
                }
                else {
                    // Use the tentative event which is being used as the drop indicator.
                    // As long as it has a duration, its start and end will be correct.
                    dropRec = eventRecord;
                }

                dropRec.setData('resourceId', null);

                eventStore.add(dropRec);

                // Move to the dropped at date and time
                // Must happen when it's in eventStore so that the store's date indices are synced.
                await me.moveEventTo(drag, dropRec);

                // If there's no explicit toResource read from the hit, then assign the Calendar's default
                // calendar (resource) unless the record is already assigned to a valid resource
                // in our Project
                const resource = toResource ?? (!isReassign && !view.project.resourceStore.includes(dropRec.resource) && me.owner.client.defaultCalendarId);

                if (resource != null && view.project.resourceStore.includes(resource)) {
                    dropRec.assign(resource);
                }
                // If the destination's resourceStore does not include our assigned resource, deassign
                else if (!view.project.resourceStore.includes(dropRec.resource)) {
                    dropRec.resources = [];
                }
            }
            else {
                // Await any decision on converting recurring base/occurrence
                // to an exception of a new recurring base.
                dropRec = await me.finishDropConfirm(dropRec);

                if (dropRec) {
                    await me.moveEventTo(drag, dropRec);

                    // If dragging between zones, and the zones have been configured with specific, different
                    // resources, then this drag is also a reallocation of resource.
                    if (isReassign) {
                        if (dropRec.isOccurrence) {
                            dropRec.convertToRealEvent();
                        }

                        // Assign to new resource first, so that it never drops to zero assignments
                        // because that can cause the eventRecord to exit the Project.
                        dropRec.assign(toResource);
                        dropRec.unassign(fromResource);
                    }
                }
            }

            await view.project.commitAsync();
        });
    }

    async finishDropResize(drag, owner, eventRecord, eventStore, validation, triggerFn) {
        if (!eventRecord) {
            return;
        }

        const
            me       = this,
            { view } = me,
            {
                eventRecord : tempEventRecord,
                edge
            }        = await drag.get('eventSourceHit'),
            prop     = edge.bottom || (view.rtl ? edge.left : edge.right) ? 'endDate' : 'startDate';

        // Return if no-op - if the dragged side did not change
        if (!(eventRecord[prop] - tempEventRecord[prop])) {
            return;
        }

        /**
         * This event fires on the owning Calendar before a drag resize gesture is started. Return `false` to
         * veto the operation.
         * @event beforeDragResize
         * @preventable
         * @on-owner
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag resize context.
         * @param {Event} domEvent The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The `EventModel` record being resized.
         * @param {Date} date The date at the drag DOM event position.
         * @param {Scheduler.model.ResourceModel} [resourceRecord] The `ResourceModel` record if the gesture was performed
         * in a resource-type view.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {CalendarView} view The Calendar widget in which the drag is being started.
         */

        /**
         * This event fires on the owning Calendar before a drag resize gesture is completed. Return `false` to immediately veto the operation
         * or a Promise yielding `true` or `false` for async vetoing.
         * @event beforeDragResizeEnd
         * @preventable
         * @on-owner
         * @async
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag create context.
         * @param {Event} event The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The `EventModel` record that has *not yet been updated* in the store.
         * @param {Scheduler.model.EventModel} proxyEventRecord The `EventModel` record that is being used as a proxy for the
         * drag operation and being updated on every pointer move. This will contain changed values based on the drag position.
         * @param {Date} newStartDate The new start date.
         * @param {Date} newEndDate The new end date.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {Boolean|ValidateCreateResult} validation The result of the {@link #config-validateResizeFn} if one
         * was provided.
         * @param {CalendarView} view The Calendar widget in which the drag completed.
         */

        /**
         * This event fires on the owning Calendar when a drag resize gesture is completed.
         * @event dragResizeEnd
         * @on-owner
         * @param {Calendar.view.Calendar} source The Calendar instance that fired the event.
         * @param {CalendarDragContext} drag The drag create context.
         * @param {Event} event The browser event.
         * @param {Scheduler.model.EventModel} eventRecord The updated `EventModel` record.
         * @param {Calendar.feature.CalendarDrag} feature The Calendar drag feature instance.
         * @param {Boolean|ValidateCreateResult} validation The result of the {@link #config-validateResizeFn} if one
         * was provided.
         * @param {CalendarView} view The Calendar widget in which the drag completed.
         */
        await triggerFn('dragResizeEnd', async() => {
            const editRec = await this.finishDropConfirm(tempEventRecord);

            editRec && editRec.set({
                startDate : eventRecord.startDate,
                endDate   : eventRecord.endDate,
                duration  : DH.diff(eventRecord.startDate, eventRecord.endDate, editRec.durationUnit)
            });

            await view.project.commitAsync();
        });
    }

    async finishDropConfirm(eventRecord) {
        if (eventRecord.isOccurrence || eventRecord.isRecurring) {
            return new Promise(resolve => {
                const dialog = this.owner.client.recurrenceConfirmationPopup;

                dialog.owner = this.owner;
                dialog.confirm({
                    actionType : 'update',

                    eventRecord,

                    cancelFn() {
                        resolve(null);
                    },

                    changerFn(eventRec) {
                        resolve(eventRec);
                    }
                });
            });
        }

        return eventRecord;
    }

    async moveEventTo(drag, eventRecord) {
        const
            me     = this,
            { dh } = me.view;

        let date = me.view.getDateFromElement(drag.targetElement);

        // If we were not dragging an unscheduled event (for example from an external source)
        // then copy in its time values.
        if (eventRecord.startDate) {
            date = dh.copyTimeValues(me.clearTime(date), eventRecord.startDate);
        }

        date = me.applyDragOffset(date, drag);

        // If it's being movedTo from another store, and it was unscheduled originally...
        if (drag.peek('sourceStore') !== me.view.eventStore && !eventRecord.startDate) {
            const autoCreate = drag.target.view.autoCreate || me.owner.client.autoCreate;
            // Move to the autoCreate time if we can find an autoCreate config to give us a hint.
            dh.set(date, 'hour', autoCreate?.startHour || 8);
        }

        await me.setStartDate(eventRecord, date);
    }

    pickDropTarget(drag) {
        let hit = this.hitTest(drag);

        if (!hit && this.isResizing) {
            hit = this.hit;
        }

        return hit?.date ? hit : null;
    }

    setStartDate(eventRecord, date) {
        // Reject non-change drags to avoid unnecessary store updates and view refreshes.
        if (date - eventRecord.startDate) {
            return eventRecord.set({
                startDate : date,
                endDate   : DH.add(date, eventRecord.fullDuration)
            });
        }
    }

    // Hoverable

    updateHoverZone(zone) {
        // Do not hover edges if the view disallows resizing
        if (!zone || this.view.allowResize !== false) {
            super.updateHoverZone(zone);
        }
    }

    getHoverHandleCls(other) {
        return other ? '' : 'b-gripper-vert';
    }

    hoverEnter() {
        const
            me          = this,
            hit         = me.hitTest(me.hoverTarget),
            { gripper } = me.owner,
            cls         = me.getHoverHandleCls(),
            otherCls    = me.getHoverHandleCls(true);

        otherCls && gripper.classList.remove(otherCls);

        if (hit?.eventRecord?.resizable !== false && !hit?.eventRecord?.readOnly) {
            cls && gripper.classList.add(cls);
            me.hoverTarget.appendChild(gripper);
        }
    }

    hoverLeave(leaving) {
        const
            me          = this,
            { gripper } = me.owner,
            cls         = me.getHoverHandleCls();

        // We may have 2 hoverable zones each grabbing our shared gripper element, so check if we are the current
        // owner and only cleanup if we are:
        if (gripper.parentNode === leaving) {
            cls && gripper.classList.remove(cls);
            leaving.removeChild(gripper);
        }
    }

    // Misc

    applyDragOffset(date, drag) {
        const eventOffset = drag.peek('eventOffset');

        if (date && eventOffset?.[0]) {
            if (drag.source.constructor === drag.target?.constructor) {
                date = DH.add(date, -eventOffset[0], eventOffset[1]);
            }
        }

        return date;
    }

    createElement(domConfig) {
        // The domConfig received here should not contain the event rendering. This allows DomSync to populate those
        // elements and avoid creating duplicate elements (any we would create here would be ignored by DomSync due to
        // syncOwner skipping over them).
        const el = DomHelper.createElement(domConfig);

        // We don't create the main drag proxy elements via DomSync but rather they are the targetElement of such
        // calls. We stamp this here as DomSync would to hide these elements from the DomSync calls used to render
        // the view. Without this, these proxy elements would be reused by these outer-level DomSync calls but would
        // later be removed during drag cleanup.
        el.$domSyncOwner = this.id;

        return el;
    }

    // Returns the edges (as in `{ top : true }`) of the event under the pointer that a press there resizes, by the rules
    // used to show the resize gripper on hover. Nothing if the press is not in an edge zone or resizing is not allowed
    getPointerResizeEdge(target, event, eventRecord, rtl) {
        const
            me      = this,
            hoverEl = me.hoverRootElement && me.hoverEdges && me.view.allowResize !== false &&
                eventRecord.resizable !== false && !eventRecord.readOnly &&
                // A touch never hovers, so it never resizes without the gripper either
                event.clientX != null && event.pointerType !== 'touch' && !event.type?.startsWith('touch') &&
                target.closest(me.hoverSelector || '.b-cal-event-wrap'),
            zone    = hoverEl && me.getHoverZone(hoverEl, event);

        if (zone) {
            const
                { classList } = hoverEl,
                // The edges the gripper is hidden at (see CalendarDrag.css), the event continues past them. Read from the
                // classes since the renderers compute these per view while rendering and do not store them elsewhere
                hidden        = {
                    top                      : classList.contains('b-starts-above'),
                    bottom                   : classList.contains('b-ends-below'),
                    [rtl ? 'right' : 'left'] : classList.contains('b-continues-past'),
                    [rtl ? 'left' : 'right'] : classList.contains('b-continues-future')
                },
                edges         = [...zone].map(z => zoneEdges[z]).filter(edge => !hidden[edge]);

            if (edges.length) {
                return Object.fromEntries(edges.map(edge => [edge, true]));
            }
        }
    }

    hitTest(at) {
        const
            me            = this,
            isDragContext = at?.isDragContext,
            event         = isDragContext ? at.event : at,
            target        = (isDragContext && at.targetElement) || DomHelper.getEventElement(event);

        let src = me.view,
            hit = null,
            edge, wrapEl;

        // Only hit test within a calendar view
        if (target?.closest('.b-calendar-mixin')) {
            if (!src.calendarHitTest) {
                src = me.owner.client;
            }
            const horizontalStartEdge = src.rtl ? 'right' : 'left';

            hit = src.calendarHitTest(target);

            if (hit) {
                hit.eventWrap = wrapEl = target.closest('.b-cal-event-wrap');

                if (target.classList.contains('b-gripper')) {
                    edge = {};

                    DomClassList.normalize(wrapEl.className, 'array').forEach(c => {
                        c = edgeRe.exec(c);
                        c && (edge[c[1]] = true);
                    });
                }
                // The gripper is shown by mouse movement. A press that starts a drag without it having been shown (the
                // event was re-rendered under a stationary pointer, for example after a resize) resizes by the pointer
                // position, the same way the gripper would have been shown
                else if (isDragContext && !at.started && wrapEl && hit.eventRecord) {
                    edge = me.getPointerResizeEdge(target, event, hit.eventRecord, src.rtl);
                }

                if (edge) {
                    hit = {
                        type        : 'resize',
                        cell        : hit.cell,
                        date        : hit.date,
                        edge,
                        eventRecord : hit.eventRecord,
                        resource    : hit.resource,
                        eventWrap   : wrapEl,
                        gripper     : target.classList.contains('b-gripper') ? target : null,
                        view        : hit.view,
                        atEnd       : !(edge.top || edge[horizontalStartEdge])
                    };
                }
                else if (!hit.eventRecord) {
                    wrapEl = null;
                }

                if (wrapEl) {
                    hit.eventTop = wrapEl.style.top;
                }

                if (target !== event) {
                    if (src.getDateFromDomEvent) {
                        hit.preciseDate = src.getDateFromDomEvent(event, true);
                    }
                    hit.date = me.getDateFromPosition(event.clientX, event.clientY) || hit.date;
                }
            }
        }

        return hit;
    }

    renderEvent(eventRecord, first, last) {
        const
            { view, owner } = this,
            renderData  = {
                eventRecord,
                // The dragged event is always selected by the mousedown
                asSelected : eventRecord.data.realEventId && owner.client.isEventSelected?.(eventRecord.data.realEventId)
            };

        // Make the DOM reflect the view's defaultCalendar.
        // We cannot assign in the normal way when the event is not part of a project
        // so we need to override the assigned property just while we create the DOM.
        Object.defineProperty(eventRecord, 'assigned', this.assignmentsProperty);

        // If we are moving into a view which only renders intra-day events
        // Set the cell info block's isAllDay flag to false so that it always renders the time.
        if (view.isDayView) {
            renderData.isAllDay = false;
        }
        const dom = view.createEventDomConfig(renderData);
        dom.className['b-cal-tentative-event'] = 1;
        dom.className['b-cal-tentative-event-first'] = first;
        dom.className['b-cal-tentative-event-last'] = last;
        dom.retainElement = true; // Do not remove this element from the DOM if the view is refreshed during drag

        // Now we can remove the temp resource property getter
        delete eventRecord.assigned;

        if (last) {
            const { footer } = owner;

            // Show the end time in the footer unless the owning view
            // already displays the end time.
            if (footer && !view.showTime.endTime) {
                appendEventFooter(dom, ObjectHelper.assign({
                    html : view.dh.format(eventRecord.endDate, view.timeFormat)
                }, footer));
            }
        }

        return dom;
    }

    setEventData(data, creating) {
        const
            me                      = this,
            { eventRecord, view }   = me,
            { duration, startDate } = data;

        if (startDate && duration != null && !data.endDate) {
            data = {
                ...data,
                endDate : DH.add(startDate, duration, eventRecord.durationUnit)
            };
        }

        eventRecord.set(data);

        // Honour the view's view on what constitutes a short event
        if (me.eventDom) {
            me.eventDom.className[view.shortEventCls] = eventRecord.rawDurationMS <= view.shortEventDuration;
        }
        else {
            if (creating) {
                let name, { newName } = me.owner;

                // The newName callback signature in CalendarDrag (this Zone's owner) accepts the new record
                // and is called using thisObj of the active view.
                if (newName) {
                    const newNameFn = me.view.resolveCallback(newName, view, false);

                    name = newNameFn?.handler.call(view, eventRecord) || newName;
                }
                // When resolved from the view's autoCreate object, it accepts view, start date and resource
                else {
                    newName = view.autoCreate.newName;
                    name = view.resolveCallback(newName, view, false) ? view.callback(newName, view, [view, eventRecord.startDate, view.resource || view.defaultCalendar]) : newName;
                }

                eventRecord.name = name;
            }

            me.eventDom = me.renderEvent(eventRecord);
        }
    }

    setupEvent(data, creating) {
        const
            me           = this,
            { owner }    = me,
            {
                defaultCalendar,
                eventStore
            }            = me.view,
            { tooltip }  = owner,
            eventRecord  = me.eventRecord = owner.eventRecord = eventStore.createRecord({
                // must pass empty object for CalendarStores hook of createRecord() to set resourceId
                // and because the data passed is field *names*, not dataSources
            }),
            assignments  = creating ? new Set([eventStore.assignmentStore.createRecord({
                event    : eventRecord,
                resource : defaultCalendar
            })]) : data.assigned;

        // The assignment Set to be used when calling renderEvent so that a fully correct rendition
        // taking into account the resource can be applied.
        me.assignmentsProperty = {
            configurable : true,
            value        : assignments
        };
        delete data.assigned;

        // When moving and resizing, the dummy record needs to inherit the meta
        // of the original record. This is embedded in the data using the metaProp symbol.
        if (data[metaProp]) {
            eventRecord.meta = data[metaProp];
        }

        me.setEventData(data, creating);

        // Assign the new event to the EventStore's default calendar
        if (me.isCreating && defaultCalendar) {
            eventStore.assignmentStore.assignEventToResource(eventRecord, defaultCalendar);
        }

        const { eventDom } = me;

        eventDom.className[tentativeCls] = 1;

        if (!me.noTip && !tooltip.disabled && me.dragging?.has('eventCreate')) {
            tooltip.eventRecord = eventRecord;
            tooltip.recurrenceHint = (creating && me.recurrable) ? owner.recurrenceTip : '';

            me.dragProxy.tooltip = tooltip;
        }

        return eventDom;
    }

    startCreate(date) {
        this.createEvent({
            allDay       : true,
            startDate    : date,
            durationUnit : this.durationUnit,
            endDate      : DH.add(date, 1, 'd')
        });
    }

    get durationUnit() {
        // Use view's dragUnit unless it's been configure away, then use the CalendarDrag class's default
        return this.view.dragUnit || Duration.from(this.view.autoCreate.duration).unit || this.owner.durationUnit;
    }

    startMove(eventRecord) {
        const
            me      = this,
            data    = ObjectHelper.clone(eventRecord.dataByFieldName),
            drag    = me.dropping,
            { hit } = me,
            // prefer the resource color of the drop and fallback to the drag
            color   = hit?.resource?.eventColor ?? drag.peek('resource')?.eventColor;

        if (color && !data.eventColor) {
            data.eventColor = color;
        }

        // Include the Set of assignments in the data for the tentative event
        data.assigned = eventRecord.assigned;

        // If an unscheduled event is grabbed (for example from an external source),
        // we have to normalize it according to current pointer context in order
        // for the view's createEventDomConfig to be able to process it to create
        // our drop indicator.
        if (!data.startDate) {
            data.startDate = hit?.date || new Date();
            data.endDate = DH.add(data.startDate, eventRecord.duration || 1, eventRecord.durationUnit || 'h');
        }

        // Dragging must always know its resource
        if (hit?.resource) {
            data.resourceId = hit.resource.id;
        }

        if (!data.resourceId) {
            data.resourceId = drag.peek('resourceId') || me.owner.client?.defaultCalendarId;
        }

        data.realEventId = data.id;
        // So as not to have duplicate data-event-id="eventId" nodes in the DOM.
        delete data.id;

        // The dummy record needs the same meta
        data[metaProp] = ObjectHelper.clone(eventRecord.meta);

        me.setupEvent(data);
    }

    startResize(eventHit) {
        const
            { eventRecord } = eventHit,
            data            = ObjectHelper.clone(eventRecord.dataByFieldName);

        // The dummy record needs the same meta
        data[metaProp] = ObjectHelper.clone(eventRecord.meta);

        this.createEvent({
            ...data,

            // Include the Set of assignments in the data for the tentative event
            assigned       : eventRecord.assigned,
            id             : `dragResize-event-${data.id}`,
            eventColor     : data.eventColor || eventRecord.resource?.eventColor,
            recurrenceRule : null,
            realEventId    : data.id
        });
    }

    // Configs

    configureListeners(drag) {
        const listeners = super.configureListeners(drag);

        // Listen to the events on the root element
        listeners.element = this.view.rootElement;

        return listeners;
    }

    updateHit(hit) {
        const
            me   = this,
            drag = me.dropping,
            mode = hit && drag[eventDragSym];

        if (hit) {
            if (me.isMoving) {
                me.dropHitMove(drag, hit, drag.peek('eventRecord'));
            }
            else if (mode?.create) {
                me.dropHitCreate(drag, hit, drag.peek('eventCreate'));
            }
            else if (mode?.resize) {
                me.dropHitResize(drag, hit, drag.peek('eventSourceHit'));
            }
        }
        else {
            me.dropHitNowhere(drag);
        }
    }

    updateDays(days) {
        const
            me                                     = this,
            { calendarCells, eventDom, dayValues } = me,
            newDayValues                           = calendarCells && {};

        let first = true,
            cell, date, dayValue, i, lastCell;

        me.dayValues = newDayValues;

        if (calendarCells && eventDom) {
            for (i = 0; i < calendarCells.length; ++i) {
                cell = calendarCells[i];

                if (days?.includes(cell.dataset.date)) {
                    lastCell = cell;
                }
            }

            for (i = 0; i < calendarCells.length; ++i) {
                cell = calendarCells[i];
                date = cell.dataset.date;

                if (days?.includes(date)) {
                    if (!(dayValue = dayValues?.[date])) {
                        dayValue = me.includeDay(date, cell, first, cell === lastCell) || true;
                        first = false;
                    }
                    else {
                        delete dayValues[date];
                    }

                    newDayValues[date] = dayValue;
                }
            }

            if (dayValues) {
                const cleanDom = () => {
                    for (i in dayValues) {
                        me.removeDay(i, dayValues[i], me.isCreating);
                    }
                };

                // If creating, and we're not aborted, remove the drag coverage after the
                // refresh has happened so there's no apparent blink when the coverage is removed.
                if (!days && me.isCreating && !me.dragging.aborted) {
                    // Clean the dom when the refresh is done. Wait for a max of 100ms for an upcoming
                    // refresh before going ahead anyway.
                    me.view.afterRefresh(cleanDom);
                }
                else {
                    cleanDom();
                }
            }
        }
    }

    updateEventRecord(record) {
        this.owner.eventRecord = record;
    }

    updateOverflow(value, instance) {
        if (!value && instance) {
            instance.destroy();
        }

        return value;
    }

    updateOwner(owner) {
        this.hoverIgnoreElement = owner?.gripper;
    }

    updateRootElement(rootEl) {
        const me = this;

        me.dragRootElement = rootEl;
        me.dropRootElement = me.droppable ? rootEl : null;
        // No edge hover effect if feature is not resizable
        if (!me.owner.resizable) {
            me.hoverable = false;
        }
        me.hoverRootElement = me.hoverable ? rootEl : null;
    }

    updateView(view, was) {
        super.updateView(view, was);

        const me = this;

        me.rootElement = view ? me.findRootElement(view) : null;

        me._overflowDetacher?.();

        // Only listen for overflow popup being shown if the view itself offers the event.
        // We must not listen to the relayed version from the owning DayView of a CalendarRow
        // otherwise we'd end up with a DayZone owning a duplicate OverflowZone in addition
        // to the AllDayZone.
        if (view?.isDayCellRenderer) {
            me._overflowDetacher = view.ion({
                thisObj           : me,
                showOverflowPopup : 'onShowOverflowPopup'
            });
        }
    }
}

Zone.prototype._eventRecord = null;

//====================================================================================================
// DayView

class BaseDayZone extends Zone {

    static $name = 'BaseDayZone';

    static configurable = {
        hoverSelector : '.b-cal-event-wrap',

        draggingClsSelector : '.b-day-view-content'
    };

    getHoverHandleCls(other) {
        let vert = this.isAllDayZone;

        if (other) {
            vert = !vert;
        }

        return `b-gripper-${vert ? 'vert' : 'horz'}`;
    }
}

//-------------------------------------------------------------------------

class AllDayZone extends BaseDayZone {

    static $name = 'AllDayZone';

    static configurable = {
        hoverEdges : 'lr'
    };

    // Drag handling

    dragEnter(drag) {
        // If there's no space in which to display the drop indicator,
        // temporarily expand the gutter to allow for appearance of the drop indicator.
        if (!this.view.eventsPerCell) {
            this.view.expandGutter();
        }
        return super.dragEnter(drag);
    }

    dragLeave(drag) {
        this.view.collapseGutter();
        super.dragLeave(drag);
    }

    captureDragOffset(eventRecord, hit, drag) {
        drag.set('eventOffset', [
            Math.max(Math.floor(DH.diff(eventRecord.startDate, hit.date, 'd')), 0),
            'd'
        ]);
    }

    // Drop handling

    dropHitCreate(drag, hit, dragFrom) {
        let endDate   = this.clearTime(hit.date),
            startDate = this.clearTime(dragFrom.date);

        if (endDate < startDate) {
            [startDate, endDate] = [endDate, startDate];
        }

        // Update the final duration in the units the view created the record with.
        this.setEventData({
            startDate,
            duration : DH.as(this.eventRecord.durationUnit, DH.diff(startDate, endDate, 'd') + 1, 'd')
        });
    }

    async moveEventTo(drag, dropRec) {
        const
            me       = this,
            { dh }   = me.view,
            hit      = me.hitTest(drag),
            date     = me.applyDragOffset(hit?.date, drag),
            newDate  = new Date(dropRec.startDate);

        if (date) {
            // We're only changing the date component of the time.
            // Not the time of day that the event started at.
            moveToDayOf(dh, newDate, date);

            // If the event does not belong in the all day zone, i.e. it's not day-spanning
            // and does not have the allDay flag set, then set the allDay flag
            if (me.view.dayTime.startShift) {
                // Read and written through the view's helper for the same reason as the day copy above: native
                // accessors would use the browser's zone, and the resulting instant can land on the wrong day.
                // Unlike the date fields, hour/minute/second are independent, so set()'s ordering does not matter.
                dh.set(newDate, {
                    hour   : dh.getHours(date),
                    minute : dh.getMinutes(date),
                    second : dh.getSeconds(date)
                });

                dropRec.duration = 1;
            }
            else if (!me.view.isInterDayEvent(dropRec)) {
                dropRec.allDay = true;
            }

            await me.setStartDate(dropRec, newDate);
        }
    }

    // Misc

    setEventData(data, creating) {
        super.setEventData(data, creating);

        const
            me = this,
            { eventRecord } = me,
            { startDate } = eventRecord;

        let { endDate } = eventRecord;

        if (!me.view.dayTime.startShift) {
            eventRecord.allDay = true;
        }

        // A zero- or negative-duration all-day span (endDate <= startDate) still occupies its start day, so treat
        // the exclusive end as the next day to render one day of drag feedback. See #13390.
        if (endDate <= startDate) {
            endDate = DH.add(startDate, 1, 'd');
        }

        me.days = me.makeDays(startDate, endDate);
    }

    // Configs

    updateDays(days) {
        const me = this;

        let { eventEl } = me;

        if (days?.length) {
            if (!eventEl) {
                me.eventEl = eventEl = me.createElement();
            }

            const
                { dropRootElement } = me,
                { visibleCellSelector, weekLength } = me.view,
                eventTop = me.dragging?.peek('eventSourceHit')?.eventTop,
                cells = DomHelper.children(dropRootElement, visibleCellSelector),
                cell = DomHelper.down(dropRootElement, `${visibleCellSelector}[data-date='${days[days.length - 1]}']`);

            // The one event element lives in the startDate cell, or the resource sub cell
            // of the startdate cell.
            DomHelper.down(cell, '.b-cal-event-bar-container').appendChild(eventEl);

            DomSync.sync({
                callback      : me.calendar.processEventContentCallback,
                targetElement : eventEl,
                syncOwner     : me.id,
                domConfig     : ObjectHelper.merge({}, me.eventDom, {
                    style : {
                        top   : eventTop,
                        width : DomHelper.percentify(100 * days.length / weekLength),

                        [me.view.rtl ? 'right' : 'left'] :
                            DomHelper.percentify(100 * (cells.indexOf(cell) - days.length + 1) / weekLength)
                    }
                })
            });

            // Ensure element is in view in case it's scrolled, and we are dragging
            // an interday event in the main day part.
            me.view.scrollable.scrollIntoView(eventEl, true);
        }
        else if (eventEl) {
            if (eventEl.classList.contains('b-cal-tentative-event')) {
                eventEl.remove();
            }
            me.eventEl = null;
        }
    }

    updateView(view, was) {
        if (view) {
            const multiDay = DH.diff(view.startDate, view.endDate, 'd') > 1;

            this.hoverable = multiDay;
            this.draggable = multiDay || this.view.owner.isDayView;
        }

        super.updateView(view, was);
    }
}

//-------------------------------------------------------------------------

class DayZone extends BaseDayZone {

    static $name = 'DayZone';

    static configurable = {
        dragEventId : null,

        hoverable  : true,
        hoverEdges : 'tb',

        times : {
            $config : {
                equal : 'array'
            },

            value : null
        },

        allDayZoneClass : AllDayZone,

        /**
         * Constrains the **vertical**, time axis part of a move gesture, so that the dragged event stays between two
         * times of day. Set it through the view's
         * {@link Calendar.widget.mixin.CalendarMixin#config-dragZoneConfig}. The bound applies to the whole event: its
         * start may not precede the lower bound, and its end may not pass the upper one.
         *
         * Pass `true` to constrain the event to the day's own boundaries — the start of the day the pointer is over,
         * and that boundary plus 24 hours. A non-zero {@link Calendar.widget.DayView#config-dayStartShift} moves both
         * boundaries with it. This is the "never becomes an inter day event" rule, and it is *not* the visible range:
         * on a view showing 08:00 to 18:00, `true` still permits a drag to 07:30.
         *
         * Pass `'visible'` to constrain the event to the hours the view actually displays, between its
         * {@link Calendar.widget.DayView#config-dayStartTime} and {@link Calendar.widget.DayView#config-dayEndTime}.
         * These are read when the gesture runs, so the bound follows any later reconfiguration of the view.
         *
         * Pass an object to constrain the event to explicit times of day instead. Either key may be omitted, leaving
         * that end unconstrained:
         *
         * ```javascript
         * dragZoneConfig : {
         *     constrainToDayTime : {
         *         startTime : 8,        // or '08:30'
         *         endTime   : '17:30'   // or 18
         *     }
         * }
         * ```
         *
         * If the event is longer than the constrained window, no start date can satisfy both bounds. The start bound
         * is honoured and the event's end overflows past the upper bound; the move is still committed.
         *
         * The **horizontal** axis is governed separately by {@link Calendar.widget.DayView#property-interDayDrag},
         * which decides whether a gesture may leave the day column it started in.
         *
         * Applies to the views which lay events out against a time axis — {@link Calendar.widget.DayView},
         * {@link Calendar.widget.WeekView} and {@link Calendar.widget.DayResourceView} — and only to move gestures:
         * resize and drag-create do not consult it. {@link Calendar.widget.DayAgendaView} is a list rather than a
         * time axis, so a drag there has no time of day to constrain.
         * @prp {Boolean|'visible'|DayTimeConstraint}
         * @default
         */
        constrainToDayTime : false
    };

    construct(...args) {
        super.construct(...args);

        const
            me               = this,
            { allDayEvents } = me.view;

        // Do not allow drag within or into the all day CalendarRow if it is not being used to display events.
        // The CalendarRow may exist, but if showAllDayHeader is false, all day, and inter day events are
        // rendered in the DayView's day columns, so it may not receive event drops.
        if (allDayEvents && me.view.showAllDayHeader !== false) {
            me.allDayZone = new me.allDayZoneClass({
                owner    : me.owner,
                view     : allDayEvents,
                resource : me.resource
            });
        }
    }

    syncDraggingElements(eventId, active) {
        const
            { dragging : drag } = this,
            { draggingItemCls } = drag.source,
            containerEl         = drag.itemElement.closest('.b-day-view-day-container'),
            elements            = containerEl?.querySelectorAll(`[data-event-id="${CSS.escape(eventId)}"]`) ?? [];

        for (const el of elements) {
            el.classList.toggle(draggingItemCls, active);
        }
    }

    hitTest(at) {
        const
            { view }        = this,
            { dayTime, dh } = view,
            hit             = super.hitTest(at);

        // Cache the main date for the column we are over.
        // This is used later in applyDragOffset to constrain the exact datetime to within that date
        if (hit) {
            const
                {
                    date,
                    resource : newResource
                }           = hit,
                was         = new Date(date),
                overDate    = at?.isDragContext ? view.getDateFromPosition(at.event.clientX, Rectangle.fromScreen(view.dayContainerElement).y + 1, false, dayTime) : dayTime.startOfDay(hit.date),
                context     = this.dragging || this.dropping;

            // overDate is a snapped, pixel sampled time, so it cannot be used to recover the column's day.
            // The column element's own date key carries no pixel offset and is never snapped.
            let overDayStart = at?.isDragContext
                ? dayTime.startOfDay(view.getDateFromElement(view.getDayElementFromX(at.event.clientX), dayTime) || view.date)
                : dayTime.startOfDay(hit.date);

            // If we disallowed inter day drag, push the hit dates back into the start date
            if (context && ((!this.isMoving && view.interDayResize === false) || (this.isMoving && view.interDayDrag === false))) {
                const startDate = context.peek('date');

                moveToDayOf(dh, date, startDate);

                if (overDate) {
                    moveToDayOf(dh, overDate, startDate);
                }
                // The constraint anchor must follow the same rewrite, or a constrained inter day drag would be
                // bounded against the column the pointer is over rather than the one the gesture started in.
                // startOfDay applies the day shift through the view's timezone aware helper, so it needs no rewrite.
                if (overDayStart) {
                    overDayStart = dayTime.startOfDay(startDate);
                }
                // If a cross-resource drag, it is invalid to drag to a different date
                if (newResource && newResource !== context.peek('resource') && date - was) {
                    return;
                }
            }
            hit.overDate     = overDate;
            hit.overDayStart = overDayStart;
        }

        return hit;
    }

    updateDragEventId(eventId, previousEventId) {
        previousEventId && this.syncDraggingElements(previousEventId, false);

        eventId && this.syncDraggingElements(eventId, true);
    }

    get eventRecord() {
        return super.eventRecord || this.allDayZone?.eventRecord;
    }

    set eventRecord(value) {
        super.eventRecord = value;
    }

    get recurring() {
        return this.isCreating && this.eventRecord?.recurrenceRule != null;
    }

    get droppingAllDay() {
        const eventRecord = this.dropping?.peek('eventRecord');

        return eventRecord?.startDate && this.view?.isInterDayEvent(eventRecord) || false;
    }

    get useAllDay() {
        // when an allDay event is being dropping on the hourly part of the day view, relay that to the allDayZone
        // if it is from an outsider (we want to retain the allDay nature of the event). If it is from _our_ allDayZone,
        // then the goal is to move it from allDay to not allDay.
        return this.droppingAllDay && this.view.showAllDayHeader && this.dropping.source !== this.allDayZone;
    }

    get wasAllDay() {
        // when an allDay event is being dropping on the hourly part of the day view, relay that to the allDayZone
        // if it is from an outsider (we want to retain the allDay nature of the event). If it is from _our_ allDayZone,
        // then the goal is to move it from allDay to not allDay.
        return this.droppingAllDay && this.dropping.source === this.allDayZone;
    }

    doDestroy() {
        this.allDayZone?.destroy();

        super.doDestroy();
    }

    dragStart() {
        super.dragStart();

        this.dragEventId = this.dragging.peek('eventRecord')?.id ?? null;
    }

    findRootElement(view) {
        return view.eventContentElement;
    }

    // Drag handling

    captureDragOffset(eventRecord, hit, drag) {
        drag.set('eventOffset', [
            Math.floor(DH.diff(eventRecord.startDate, hit.date, 'm')),
            'm'
        ]);
    }

    cleanupDrag() {
        this.dragEventId = null;

        super.cleanupDrag();

        this.allDayZone?.cleanupDrag();
    }

    // Drop handling

    cleanupDrop() {
        super.cleanupDrop();

        // Stop monitoring early. With polyfilled resize monitor scroll event
        // will fire too soon when eventRecord is nullified but monitor is not stopped
        this.owner.client?._scrollManager?.stopMonitoring();

        this.allDayZone?.cleanupDrop();
    }

    dropHitCreate(drag, hit) {
        const
            me               = this,
            { durationUnit } = me.eventRecord;

        let endTime   = hit.date,
            startTime = drag.peek('eventCreate').date,
            endDate   = endTime,
            startDate = startTime,
            duration, recurrenceCount;

        const
            sameDay   = !(me.clearTime(startTime) - me.clearTime(endTime)),
            recurring = drag.ctrlKey && !sameDay;

        if (recurring || sameDay) {
            endDate = me.clearTime(endTime);
            startDate = me.clearTime(startTime);

            // Now these are just milliseconds from midnight (note: Date - Date = millis):
            startTime = startTime - startDate;
            endTime = endTime - endDate;

            if (endDate < startDate) {
                [startDate, endDate] = [endDate, startDate];
            }

            if (endTime < startTime) {
                [startTime, endTime] = [endTime, startTime];
            }

            startDate.setTime(startDate.getTime() + startTime);

            // Convert the millisecond value of the duration to the event record
            duration = DH.as(durationUnit, Math.max(me.view.increment, Math.floor(endTime - startTime)));

            if (recurring) {
                recurrenceCount = DH.diff(me.clearTime(startDate), me.clearTime(endDate), 'd') + 1;
            }
        }
        else {
            if (endDate < startDate) {
                [startDate, endDate] = [endDate, startDate];
            }

            // Convert the millisecond value of the duration to the event record
            duration = DH.as(durationUnit, Math.floor((endDate - startDate) / MINUTES), 'm');
        }

        me.setEventData({
            startDate,
            duration,
            recurrenceRule : recurring ? `FREQ=DAILY;COUNT=${recurrenceCount}` : null
        });
    }

    dropHitMove(drag, hit, eventRecord) {
        const
            me       = this,
            { view } = me;

        if (me.useAllDay) {
            me.allDayZone.dropHitMove(drag, hit, eventRecord);
        }
        else {
            // use the internal eventRecord since it may have a different durationUnit when dragging between allDay
            // and non-allDay:
            eventRecord = me.eventRecord;

            // Must match moveEventTo, so dragging above midnight previews the day-spanning event the drop creates
            let startDate = me.applyDragOffset(hit.date, drag);

            // Snap the start to the view's increment setting unless configured not to
            if (!view.snapRelativeToEventStartDate) {
                // Snap the unconstrained date, then constrain, so a bound which is not on the increment grid wins
                // over increment alignment rather than being snapped away from.
                startDate = me.constrainStartDate(me.snapStartDate(me.offsetStartDate(hit.date, drag), drag));
            }

            me.setEventData({
                startDate,
                endDate  : DH.add(startDate, eventRecord.duration, eventRecord.durationUnit),
                duration : eventRecord.duration
            });
        }
    }

    // Clamps a start date so that the whole event stays inside the range `constrainToDayTime` describes, returning it
    // unchanged when unconstrained. Must be the last thing applied to a date, since anything which moves the date
    // afterwards (snapping, for example) can take it back outside the range.
    constrainStartDate(date) {
        const
            me                 = this,
            constrainToDayTime = me.constrainToDayTime || me.constrainToDay;

        // Allow legacy (but undocumented) constrainToDay configuration. Remove in 9.0
        if (me.constrainToDay) {
            console.warn('CalendarDrag: constrainToDay is deprecated, use constrainToDayTime instead.');
        }

        if (!constrainToDayTime) {
            return date;
        }

        const
            { view }         = me,
            // The view's own DateHelper, which is timezone aware when the Calendar configures a timeZone and the
            // static DateHelper otherwise. DayView#getDateFromPosition uses the same idiom.
            { dh }           = view,
            // The column's own day start, taken from its date key rather than from a snapped pixel sample
            { overDayStart } = me.hit;

        let lower, upper, result = date;

        if (constrainToDayTime === true) {
            lower = overDayStart.getTime();
            upper = dh.add(overDayStart, 1, 'd').getTime();
        }
        else if (constrainToDayTime === 'visible') {
            const
                { dayStartMs, dayEndMs, configuredDayStartTime, configuredDayEndTime } = view,
                // dayStartTime/dayEndTime are rounded out to whole hours because the time axis renders hour ticks.
                // Constrain to the times which were actually configured, which those round values are derived from.
                startMs = configuredDayStartTime ?? dayStartMs,
                endMs   = configuredDayEndTime ?? dayEndMs;

            lower = atTimeOfDay(dh, overDayStart, startMs);

            // A day whose displayed range wraps past midnight ends on the following date. Equal values mean the
            // whole day is shown, which wraps too, so the window is 24 hours rather than zero width.
            upper = endMs <= startMs
                ? dh.add(new Date(atTimeOfDay(dh, overDayStart, endMs)), 1, 'd').getTime()
                : atTimeOfDay(dh, overDayStart, endMs);
        }
        else {
            const { startTime, endTime } = constrainToDayTime;

            lower = startTime == null ? null : atTimeOfDay(dh, overDayStart, DayTime.parse(startTime));
            upper = endTime == null ? null : atTimeOfDay(dh, overDayStart, DayTime.parse(endTime));
        }

        // The end must not pass the upper bound, so the start ceiling is that bound less the event's duration.
        if (upper != null) {
            result = new Date(Math.min(result, upper - me.eventRecord.rawDurationMS));
        }

        if (lower != null) {
            result = new Date(Math.max(result, lower));
        }

        return result;
    }

    // The dragged start date with the grab offset applied, before any constraint. Snapping must be done on this
    // rather than on the constrained value, or it would pull the event back off a bound it had been clamped to.
    offsetStartDate(date, drag) {
        return super.applyDragOffset(date, drag);
    }

    applyDragOffset(date, drag) {
        return this.constrainStartDate(this.offsetStartDate(date, drag));
    }

    snapStartDate(date, drag) {
        const
            { increment } = this.view,
            originalStart = drag.peek('eventRecord')?.startDate,
            deltaY        = drag.event.clientY - drag.startEvent.clientY;

        // Within the first increment of movement, snap in the vertical drag direction so 10:02 dragged down
        // does not jump back to 10:00. A purely horizontal move keeps the original start.
        if (originalStart && Math.abs(date - originalStart) < increment) {
            return deltaY ? DH[deltaY > 0 ? 'ceil' : 'floor'](date, increment) : new Date(originalStart);
        }

        return DH.round(date, increment);
    }

    dropHitResize(drag, hit, eventHit) {
        const
            me              = this,
            { eventRecord } = me,
            date            = hit.date;

        if (eventHit.atEnd) {
            if (eventRecord.startDate < date) {
                me.setEventData({
                    endDate : date
                });
            }
        }
        else if (date < eventRecord.endDate) {
            me.setEventData({
                startDate : date
            });
        }
    }

    async moveEventTo(drag, dropRec) {
        const
            me   = this,
            hit  = me.hitTest(drag),
            date = hit?.date;

        if (date) {
            if (me.useAllDay) {
                await me.allDayZone.moveEventTo(drag, dropRec);
            }
            else {
                const
                    { view }     = me,
                    newDate      = me.applyDragOffset(date, drag),
                    // Snap the unconstrained date to the view's increment unless configured not to, then constrain,
                    // so that a bound off the increment grid is not snapped away from.
                    newStartDate = view.snapRelativeToEventStartDate
                        ? newDate
                        : me.constrainStartDate(me.snapStartDate(me.offsetStartDate(date, drag), drag));

                // If converting from an all day event, ensure it doesn't remain as inter-day due to the
                // endDate now overrunning the end of the destination date.
                // Constrain newEndDate to the end of the destination date.
                if (me.wasAllDay) {
                    const
                        endOfDay   = DH.add(view.dayTime.startOfDay(newStartDate), 24, 'h'),
                        newEndDate = DH.add(newStartDate, dropRec.duration, dropRec.durationUnit);

                    dropRec.allDay = false;

                    // If the new start time we dropped at will cause it to overflow the end of the dropped day
                    // then convert it to be autoCreate.duration in length (Still ensuring that does not
                    // escape the end of the day).
                    if (newEndDate > endOfDay) {
                        const
                            autoCreate      = view.autoCreate || view.changeAutoCreate(true),
                            defaultDuration = DH.parseDuration(autoCreate.duration),
                            newEndDate      = new Date(Math.min(DH.add(newStartDate, defaultDuration.magnitude, defaultDuration.unit), endOfDay)),
                            newDuration     = DH.diff(newStartDate, newEndDate, dropRec.durationUnit);

                        dropRec.setDuration(newDuration, dropRec.unit);
                    }
                }

                await me.setStartDate(dropRec, newStartDate);
            }
        }
    }

    startCreate(date) {
        this.createEvent({
            duration     : 0,
            durationUnit : this.durationUnit,
            startDate    : date,

            // It's only a provisional event until gesture is completed (possibly longer if an editor dialog is shown after)
            isCreating : true
        });
    }

    // Misc

    includeDay(date, cell /*, first, last */) {
        return this.createElement({
            parent : cell.querySelector('.b-day-view-event-container')
        });
    }

    removeDay(date, value) {
        if (value.classList.contains('b-cal-tentative-event')) {
            value.remove();
        }
    }

    setEventData(data, creating) {
        const me = this;

        if (me.useAllDay) {
            me.allDayZone.setEventData(data, creating);
            return;
        }

        super.setEventData(data, creating);

        const
            { eventRecord } = me,
            { endDate, startDate } = eventRecord,
            { dayTime } = me.view;

        let lastDate = endDate;

        if (me.recurring) {
            // odd thing here... the way "days" works is inclusive endDate (because of events that start/stop in the
            // same day), so we need the "-1":
            lastDate = DH.add(lastDate, eventRecord.recurrence.count - 1, 'd');
        }

        me.days = me.makeDays(startDate, lastDate);  // updates rendered events for these days

        me.times = [
            dayTime.delta(startDate, 's'),
            dayTime.delta(endDate, 's')
        ];
    }

    /**
     * Returns the [start, end] seconds from the visible day start of the event's part in the given day, or `null` if
     * no part of it is visible there.
     * @param {String} date Day key in `YYYY-MM-DD` format
     * @returns {Number[]|null}
     * @private
     */
    getDaySegment(date) {
        // Mirrors the clipping in DayLayout#createLayoutItem
        const
            { eventRecord, recurring } = this,
            { endDate, startDate }     = eventRecord,
            { dayTime }                = this.view,
            dayEnd                     = dayTime.duration('s'),
            startKey                   = dayTime.dateKey(startDate),
            // A recurring event occupies the same times in each day as in its first
            day                        = recurring ? startKey : date,
            start                      = (startKey < day) ? 0 : Math.max(dayTime.delta(startDate, 's'), 0),
            end                        = (dayTime.dateKey(endDate) > day)
                ? dayEnd
                : Math.min(dayTime.delta(endDate, 's'), dayEnd);

        // Deliberately keeps a zero duration event (such as at the start of a drag-create) even at the day start
        return (end > start || (end === start && !(endDate - startDate))) ? [start, end] : null;
    }

    setupEvent(data, creating) {
        const me = this;

        if (me.useAllDay) {
            me.allDayZone.setupEvent(data, creating);
        }
        else {
            if (this.wasAllDay) {
                data.allDay = false;
                data.endDate = DH.add(data.startDate, data.duration = 1, data.durationUnit = 'hour');
            }

            super.setupEvent(data, creating);
        }
    }

    // Configs

    updateDays(days, was) {
        // updateTimes() renders only the days which show part of the event
        if (days && this.times) {
            this.updateTimes(this.times);
        }
        else {
            super.updateDays(days, was);
        }
    }

    // times is only a change trigger, the segments are derived from the event record by getDaySegment()
    updateTimes(times) {
        if (!times) {
            return;
        }

        const
            me = this,
            { allDayZone, dragging, eventRecord, isResizing, recurring, view } = me,
            { dayTime, eventSpacing } = view,
            { startDate } = eventRecord,
            // drag move can come from outside our calendar, so only consider the eventWidth if we are the one doing
            // the dragging:
            eventInset  = !dragging?.aborted && dragging?.peek('eventInset'),
            eventWidth  = !dragging?.aborted && dragging?.peek('eventWidth'),
            insetProp   = view.rtl ? 'right' : 'left',
            firstDay    = dayTime.dateKey(startDate),
            heightScale = 100 / dayTime.duration('s'),  // to give us percent when we multiply by this value
            segments    = {};

        let { days } = me,
            date, dayEl, first, descBounds, footerBounds, segment, style;

        if (!days) {
            return;
        }

        // Only days which show part of the event get a feedback element
        for (date of days) {
            segments[date] = me.getDaySegment(date);
        }

        super.updateDays(days.filter(day => segments[day]));

        for (date in me.dayValues) {
            dayEl   = me.dayValues[date];
            first   = date === firstDay;
            segment = segments[date];
            style   = dayEl.style;

            dayEl.retainElement = true;

            DomSync.sync({
                targetElement : dayEl,
                syncOwner     : me.id,
                callback      : me.calendar.processEventContentCallback,
                domConfig     : me.renderEvent(me.eventRecord, first, date === days[days.length - 1])
            });

            style.top = DomHelper.percentify(segment[0] * heightScale);
            style.height = DomHelper.percentify((segment[1] - segment[0]) * heightScale);
            style.paddingBottom = DomHelper.setLength(eventSpacing);

            // https://github.com/bryntum/bryntum/issues/6261
            // To mimic Apple Cal UX, we don't preserve the original event size/position during drag move
            if (isResizing) {
                if (eventInset) {
                    style[insetProp] = eventInset;
                }
                if (eventWidth) {
                    style.width = `${eventWidth}px`;
                }
            }

            descBounds = Rectangle.from(dayEl.querySelector('.b-cal-event-desc'));

            if (descBounds) {
                footerBounds = Rectangle.from(dayEl.querySelector('.b-cal-event-footer'));

                footerBounds && dayEl.classList.toggle('b-cal-event-footer-desc-overlap', Boolean(descBounds.intersect(footerBounds)));
            }
        }

        // Now sync "days" for the allDayZone:

        if (!days || days.length < 2 || recurring) {
            allDayZone?.cleanupDrop();
            days = null;
        }
        else if (allDayZone && view.showAllDayHeader) {
            if (!allDayZone.eventRecord) {
                allDayZone.noTip = true;
                const eventData = {
                    startDate : eventRecord.startDate,
                    endDate   : eventRecord.endDate
                };

                if (isResizing) {
                    const resizeEvent = dragging.peek('eventRecord');

                    eventData.assigned = resizeEvent.assigned;
                    eventData.eventColor = resizeEvent.eventColor;
                }
                allDayZone.createEvent(eventData, me.dropping);
            }

            allDayZone.eventRecord.set({
                startDate : eventRecord.startDate,
                endDate   : DH.add(eventRecord.startDate, days.length - 1, 'd')
            });

            allDayZone.days = days;
        }
    }
}

class DayAgendaZone extends DayZone {

    static get $name() {
        return 'DayAgendaZone';
    }

    static configurable = {
        hoverable : false,

        dragProxy : {
            type : 'default',

            open(drag) {
                const
                    me         = this,
                    { source } = drag,
                    sourceEl   = drag.element.closest('.b-cal-event-wrap');

                me.proxyEl = sourceEl.cloneNode(true);
                me.proxyEl.classList.add('b-cal-drag-proxy');
                me.proxyEl.style.width = `${sourceEl.offsetWidth}px`;
                me.proxyEl.style.setProperty('--b-calendar-event-color', sourceEl.style.getPropertyValue('--b-calendar-event-color'));
                me.proxyOffset = EventHelper.getClientPoint(drag.startEvent).getDelta(Rectangle.from(sourceEl));

                source.view.firstVisibleCell.appendChild(me.proxyEl);
            },

            dragMove(drag) {
                const
                    { source }            = drag,
                    { view, eventRecord } = source;

                if (source.hit && this.proxyEl) {
                    DomSync.sync({
                        targetElement : this.proxyEl,
                        domConfig     : {
                            ...source.renderEvent(eventRecord),
                            onlyChildren : true
                        }
                    });
                    // Align the proxy to [10, 10] from the pointer
                    DomHelper.alignTo(this.proxyEl, EventHelper.getClientPoint(drag.event).translate(20, 20), {
                        align       : 't0-t0',
                        constrainTo : source.dragRootElement
                    });
                    view.overHour = source.hit.date;
                }
                else {
                    view.overHour = null;
                }
            },

            close(drag) {
                drag.source.view.overHour = null;
                this.proxyEl?.remove();
            }
        }
    };

    findRootElement() {
        return this.view.eventContentElement;
    }

    // captureDragOffset(eventRecord, hit, drag) {
    //     drag.set('eventOffset', [
    //         DH.diff(eventRecord.startDate, hit.date, 'm'),
    //         'm'
    //     ]);
    // }

    hitTest(at) {
        // Skip DayZone superlcass's hitTest.
        const result = Zone.prototype.hitTest.call(this, at);

        if (result) {
            result.hourElement = ((at.event || at.domEvent)?.target || at)?.closest('[data-hour]');
        }
        return result;
    }

    setEventData() {
        // Skip DayZone superclass's setEventData.
        return Zone.prototype.setEventData.apply(this, arguments);
    }

    dropHitMove(drag, hit, eventRecord) {
        let startDate = hit.date;

        const
            me       = this,
            { view } = me,
            dayStart = view.dayTime.startOfDay(startDate);

        // use the internal eventRecord since it may have a different durationUnit when dragging between allDay
        // and non-allDay:
        eventRecord = me.eventRecord;

        // A DayAgendaView renders only one day's hour rows, so there is no element representing a time before the
        // first row - hitTest resolves the date from the hovered [data-hour] element and cannot produce an earlier
        // one. Clamping here makes that explicit rather than leaving it to hit resolution.
        // DayZone deliberately has no such clamp: a day column can render an event continuing from the previous
        // day, so an upward drag there is allowed to cross midnight.
        if (startDate < dayStart) {
            startDate = dayStart;
        }

        me.setEventData({
            startDate,
            endDate  : DH.add(startDate, eventRecord.duration, eventRecord.durationUnit),
            duration : eventRecord.duration
        });
    }

    async moveEventTo(drag, dropRec) {
        const
            me  = this,
            {
                date,
                hourElement
            }  = me.hitTest(drag);

        if (date && hourElement) {
            const { view } = me;

            // If converting from an all day event, ensure it doesn't remain as inter-day due to the
            // endDate now overrunning the end of the destination date.
            // Constrain newEndDate to the end of the destination date.
            // Even though DayAgendaView does not use allDay events, we may drag in from another view.
            if (me.wasAllDay) {
                const
                    endOfDay   = DH.add(view.dayTime.startOfDay(date), 24, 'h'),
                    newEndDate = DH.add(date, dropRec.duration, dropRec.durationUnit);

                dropRec.allDay = false;

                // If the new start time we dropped at will cause it to overflow the end of the dropped day
                // then convert it to be autoCreate.duration in length (Still ensuring that does not
                // escape the end of the day).
                if (newEndDate > endOfDay) {
                    const
                        autoCreate      = view.autoCreate || view.changeAutoCreate(true),
                        defaultDuration = DH.parseDuration(autoCreate.duration),
                        newEndDate      = new Date(Math.min(DH.add(date, defaultDuration.magnitude, defaultDuration.unit), endOfDay)),
                        newDuration     = DH.diff(date, newEndDate, dropRec.durationUnit);

                    dropRec.setDuration(newDuration, dropRec.unit);
                }
            }

            await me.setStartDate(dropRec, date);
        }
    }
}

class ResourceCalendarRowZone extends AllDayZone {
    static $name = 'ResourceCalendarRowZone';

    static configurable = {
        //droppableSelector : '.b-calendar-row-cell-container,.b-day-resource-calendar-row-cell-resources,.b-day-resource-all-day.b-cal-cell-header'
        droppableSelector : '.b-day-resource-calendar-row-resource-header,.b-day-resource-calendar-row-column'
    };

    // Disable Hoverable behaviour. Resizing is not allowed.
    // Event bars are discontiguous, so resizing an event across multiple
    // cells has ambiguous semantics. We just disallow it.
    // Events in this view may only be *moved*
    syncHoverListeners() {}

    // No resizing by pointer position either, beforeDrag would reject it and so block moving from near an edge
    getPointerResizeEdge() {}

    beforeDrag(drag) {
        const hit = this.hitTest(drag);

        // Resizing and drag-creating not valid in this view.
        // Event bars are discontiguous, so resizing an event across multiple
        // cells has ambiguous semantics. We just disallow it.
        // Events in this view may only be *moved*
        if (!hit?.resource || hit.type === 'resize' || hit.type === 'schedule') {
            return false;
        }

        return super.beforeDrag(drag);
    }

    async finishDrop(drag) {
        // This is a resource-based view. If we are not over a resource then we are not in a valid
        // drop position, even if we are over a date column.
        // This can happen when dragging into the all day part of the view above the resource
        // cells.
        if (this.hit?.resource) {
            await super.finishDrop(drag);
        }
    }

    setupEvent() {
        this.view.defaultCalendar = (this.dragging || this.dropping).peek('resource');

        return super.setupEvent(...arguments);
    }

    updateHit(hit, was) {
        if (!hit || hit.resource) {
            super.updateHit(hit, was);
        }
    }

    makeDays(startDate) {
        const
            me           = this,
            { isMoving } = me,
            drag         = me.dragging || me.dropping,
            date         = isMoving ? new Date(Math.max(startDate, me.view.firstVisibleDate)) : drag.peek('date'),
            result       = super.makeDays(date, DH.add(date, 1, 'd'));

        // Cannot create or resize across resources
        result.resource = me.hit?.resource;

        return result;
    }

    updateDays(days) {
        const me  = this;

        let { view, eventEl } = me;

        if (days?.length) {
            if (!eventEl) {
                me.eventEl = eventEl = me.createElement();
            }

            const
                eventTop = me.dragging?.peek('eventSourceHit')?.eventTop,
                resourceCell = DomHelper.down(me.dropRootElement,
                    `${view.visibleCellSelector}:is(${days.map(d => `[data-date="${d}"]`).join(',')})${days.resource ? ` [data-resource-id="${CSS.escape(days.resource.id)}"]` : ''} > .b-cal-event-bar-container`);

            // The one event element lives in the resource sub cell
            resourceCell.appendChild(eventEl);

            DomSync.sync({
                callback      : me.calendar.processEventContentCallback,
                targetElement : eventEl,
                syncOwner     : me.id,
                domConfig     : ObjectHelper.merge({}, me.eventDom, {
                    style : {
                        top   : eventTop,
                        width : '100%'
                    }
                })
            });

            // Ensure element is in view in case it's scrolled, and we are dragging
            // an interday event in the main day part.
            view.scrollable.scrollIntoView(eventEl, true);
        }
        else if (eventEl) {
            if (eventEl.classList.contains('b-cal-tentative-event')) {
                eventEl.remove();
            }
            me.eventEl = null;
        }
    }
}

class DayResourceZone extends DayZone {
    static $name = 'DayResourceZone';

    static configurable = {
        allDayZoneClass : ResourceCalendarRowZone
    };

    beforeDrag(drag) {
        const hit = this.hitTest(drag);

        if (!hit?.resource) {
            return false;
        }

        return super.beforeDrag(drag);
    }

    async finishDrop(drag) {
        // This is a resource-based view. If we are not over a resource then we are not in a valid
        // drop position, even if we are over a date column.
        // This can happen when dragging into the all day part of the view above the resource
        // cells.
        if (this.hit?.resource) {
            await super.finishDrop(drag);
        }
    }

    setupEvent() {
        this.view.defaultCalendar = (this.dragging || this.dropping).peek('resource');

        return super.setupEvent(...arguments);
    }

    hitTest(at) {
        const
            drag   = this.dragging || this.dropping,
            result = super.hitTest(at);

        // We never resize of create across resource columns or date columns
        if (result && drag && !this.isMoving) {
            const fromDate = drag.peek('date');

            result.resource = drag.peek('resource');
            moveToDayOf(this.view.dh, result.date, fromDate);
        }

        return result;
    }

    updateHit(hit, was) {
        if (!hit || hit.resource) {
            super.updateHit(hit, was);
        }
    }

    makeDays(startDate, endDate) {
        const
            me           = this,
            { isMoving } = me,
            drag         = me.dragging || me.dropping,
            // Resize and create never leave the gesture's day. Its start of day is needed because the gesture's date
            // has a time, which would extend the exclusive end into the following day
            date         = isMoving ? startDate : me.clearTime(drag.peek('date')),
            result       = super.makeDays(date, isMoving ? endDate : DH.add(date, 1, 'd'));

        // Cannot create or resize across resources
        result.resource = me.hit?.resource;

        return result;
    }

    updateDays(days) {
        const
            me           = this,
            { eventEls } = me;

        if (days?.length) {
            me.updateTimes(me.times);
        }
        else if (eventEls) {
            for (const eventEl of Object.values(eventEls)) {
                if (eventEl.classList.contains('b-cal-tentative-event')) {
                    // Remove tentative event element after the refresh has
                    // occluded it to avoid a flicker
                    me.view.setTimeout(() => eventEl.remove(), 100);
                }
            }
            me.eventEls = null;
        }
        me._times = null;
    }

    // times is only a change trigger, the segments are derived from the event record by getDaySegment()
    updateTimes(times) {
        if (!times || !this.days?.length) {
            return;
        }

        const
            me                        = this,
            { days, eventRecord }     = me,
            { dayTime, eventSpacing } = me.view,
            resourceSelector          = days.resource ? `[data-resource-id="${CSS.escape(days.resource.id)}"]` : '',
            firstDay                  = dayTime.dateKey(eventRecord.startDate),
            lastDay                   = days[days.length - 1],
            heightScale               = 100 / dayTime.duration('s'),  // to give us percent when we multiply by this value
            oldEventEls               = me.eventEls || {},
            eventEls                  = me.eventEls = {};

        // Moves never change resource part way through, so each day which shows part of the event gets a feedback
        // element in the same resource's column
        for (const date of days) {
            const
                segment = me.getDaySegment(date),
                cell    = segment && DomHelper.down(me.dropRootElement,
                    `[data-date="${date}"] ${me.view.visibleCellSelector}${resourceSelector} .b-day-view-event-container`);

            if (!cell) {
                continue;
            }

            const eventEl = eventEls[date] = oldEventEls[date] || me.createElement();

            delete oldEventEls[date];

            if (eventEl.parentNode !== cell) {
                cell.appendChild(eventEl);
            }

            DomSync.sync({
                targetElement : eventEl,
                syncOwner     : me.id,
                callback      : me.calendar.processEventContentCallback,
                domConfig     : me.renderEvent(eventRecord, date === firstDay, date === lastDay)
            });

            const { style } = eventEl;

            style.top = DomHelper.percentify(segment[0] * heightScale);
            style.height = DomHelper.percentify((segment[1] - segment[0]) * heightScale);
            style.paddingBottom = DomHelper.setLength(eventSpacing);
            style.width = '100%';
        }

        // Days which no longer show part of the event
        for (const eventEl of Object.values(oldEventEls)) {
            eventEl.remove();
        }

        // No connection into all day zone.
    }
}

//====================================================================================================
// MonthView

class MonthZone extends Zone {
    static $name = 'MonthZone';

    static configurable = {
        coverage : {
            $config : {
                equal : ObjectHelper.isEqual
            },

            value : null
        },

        hoverable     : true,
        hoverEdges    : 'lr',
        hoverSelector : '.b-cal-event-wrap.b-all-day'
    };

    findRootElement(view) {
        return view.weeksElement;
    }

    // Drag handling

    captureDragOffset(eventRecord, hit, drag) {
        drag.set('eventOffset', [
            Math.floor(DH.diff(this.clearTime(eventRecord.startDate), hit.date, 'd')),
            'd'
        ]);
    }

    cleanupDrag() {
        super.cleanupDrag();

        const cleanDom = () => this.coverage = null;

        // Delay removal of the coverage element slightly if creating so that the refresh
        // will happen first and the event element will not appear to blink.
        if (this.isCreating) {
            // Wait for a max of 100ms for a refresh to occur before cleaning the DOM
            this.view.afterRefresh(cleanDom);
        }
        else {
            cleanDom();
        }
    }

    // Drop handling

    cleanupDrop() {
        super.cleanupDrop();

        // Stop monitoring early. With polyfilled resize monitor scroll event
        // will fire too soon when eventRecord is nullified but monitor is not stopped
        this.owner.client?._scrollManager?.stopMonitoring();

        const cleanDom = () => this.coverage = null;

        // Delay removal of the coverage element slightly if creating so that the refresh
        // will happen first and the event element will not appear to blink.
        if (this.isCreating) {
            // Wait for a max of 100ms for a refresh to occur before cleaning the DOM
            this.view.afterRefresh(cleanDom);
        }
        else {
            cleanDom();
        }
    }

    dropHitCreate(drag, hit) {
        const
            me        = this,
            recurring = drag.ctrlKey,
            dragFrom  = drag.peek('eventCreate');

        let recurrenceRule = null,
            count, day1, day2, endDate, startDate, week1, week2;

        endDate = me.clearTime(hit.date);
        startDate = me.clearTime(dragFrom.date);
        day1 = dragFrom.dayNumber;
        day2 = hit.dayNumber;
        week1 = dragFrom.weekOffset;
        week2 = hit.weekOffset;

        if (week2 < week1) {
            [week1, week2] = [week2, week1];
        }

        /*
         +-----+-----+-----+-----+-----+-----+-----+
         |  S  |  M  |  Tu |  W  |  Th |  F  |  S  |
         +-----+-----+-----+-----+-----+-----+-----+
         |     |  B  |     |  A  |     |  C  |     |
         +-----+-----+-----+-----+-----+-----+-----+
         |     |     |     |     |     |     |     |
         +-----+-----+-----+-----+-----+-----+-----+
         |     |  D  |     |  x  |     |  E  |     |
         +-----+-----+-----+-----+-----+-----+-----+
         |     |     |     |     |     |     |     |
         +-----+-----+-----+-----+-----+-----+-----+
         |     |  F  |     |  G  |     |  H  |     |
         +-----+-----+-----+-----+-----+-----+-----+

         startDate   day1
         A   > endDate   = day2
         B   > endDate   > day2
         C   > endDate   < day2
         D   > endDate   > day2

         E   < endDate   < day2
         F   < endDate   > day2
         G   < endDate   = day2
         H   < endDate   < day2
         */
        if (recurring) {
            // In this mode, the interval [day1, day2] is used to draw the days of the week for each week, so it
            // must be that day1 <= day2.
            count = week2 - week1 + 1;
            recurrenceRule = (count > 1) ? `FREQ=WEEKLY;COUNT=${count}` : null;

            if (endDate < startDate) {  // if (A, B, C or D)
                startDate = endDate;  // only startDate matters for recurrence...

                if (day1 < day2) {  // if (C)
                    startDate = DH.add(startDate, day1 - day2, 'd');
                }
            }
            else if (day2 < day1) {  // if (F)
                startDate = DH.add(startDate, day2 - day1, 'd');
            }

            if (day2 < day1) {  // if (B, D or F)
                [day1, day2] = [day2, day1];
            }
        }
        // In this mode, day1 is the day of week the event starts and day2 is the day of week for the end of the
        // event, so they must adhere to startDate/endDate.
        else if (endDate < startDate) {
            [startDate, endDate] = [endDate, startDate];
            [day1, day2] = [day2, day1];
        }

        me.setEventData({
            startDate,
            duration : DH.as(me.eventRecord.durationUnit, (recurring ? day2 - day1 : DH.diff(startDate, endDate, 'd')) + 1, 'd'),
            recurrenceRule
        });
    }

    dropHitNowhere(drag) {
        super.dropHitNowhere(drag);

        this.coverage = null;
    }

    // Misc

    setEventData(data, creating) {
        super.setEventData(data, creating);

        const
            { dropping, eventRecord, view } = this,
            { visibleCellSelector }         = view,
            weekEls                         = DomHelper.children(view.weeksElement, '> .b-calendar-week'),
            coverage                        = {
                // weekNumber : String[] describing the days for a weekEl (in order of weekEls)
            },
            add                             = event => {
                const { startDate, endDate } = event;

                for (let cells, cover, k, n, i = 0; i < weekEls.length; ++i) {
                    cells = DomHelper.children(weekEls[i], visibleCellSelector);  // not immediate descendants
                    n = cells.length;

                    // cover is a string w/day numbers for every day that intersects the event 0 to N-1 where N is
                    // the number of days in the week. Day number 0 is preceded by '<' if the event started before
                    // the week. Day number N-1 is followed by '>' if the event extends beyond the end of the week.
                    // Ex: '0123' means the event occurs on the first 4 days of the week.
                    // Ex: '<012' means the event started in the prior week and occurs on the first 3 days.
                    cover = '';

                    for (k = 0; k < n; ++k) {
                        const
                            dayStart = view.getDateFromElement(cells[k]),
                            dayEnd   = DH.add(dayStart, 1, 'd');

                        if (startDate < dayEnd && dayStart < endDate) {  // if (day intersects event)
                            if (!k && startDate < dayStart) {
                                cover = '<';
                            }

                            cover += k;  // k is converted to a string since cov is a string

                            if (k === n - 1 && dayEnd < endDate) {
                                cover += '>';
                            }
                        }
                    }

                    if (cover) {
                        (coverage[i] || (coverage[i] = [])).push(cover);
                    }
                }
            };

        if (dropping?.has('eventRecord') || !eventRecord.recurrence) {
            add(eventRecord);
        }
        else {
            eventRecord.recurrence.forEachOccurrence(view.startDate, view.endDate, add);
        }

        this.coverage = coverage;
    }

    // Configs

    updateCoverage(coverage) {
        const
            me               = this,
            {
                dragging,
                id,
                weekValues,
                view
            }                = me,
            { rtl }          = view,
            {
                visibleCellSelector
            }                = view,
            eventSourceHit   = coverage && dragging?.peek('eventSourceHit'),
            eventTop         = eventSourceHit?.eventTop,
            newWeekValues    = {},
            eventRow         = view.getWeekElementFor(eventSourceHit?.eventElement),
            { weekElements } = view,
            { processEventContentCallback } = me.calendar;

        let cell, cells, cov, cover, el, eventEl, extL, extR, i, k, weekEl;

        me.weekValues = newWeekValues;

        for (i = 0; i < weekElements.length; ++i) {
            if (!(cover = coverage?.[i])) {
                continue;
            }

            weekEl = weekElements[i];
            cells = DomHelper.children(weekEl, visibleCellSelector);  // not immediate descendants

            for (k = 0; k < cover.length; ++k) {
                // we keep an array of elements for each week in case we need to render some sort of recurrence
                if (!(eventEl = weekValues?.[i]?.shift())) {
                    eventEl = me.createElement();
                }

                (newWeekValues[i] || (newWeekValues[i] = [])).push(eventEl);

                cov = cover[k];
                extL = cov.includes('<') ? 1 : 0;
                extR = cov.includes('>') ? 1 : 0;
                cov = cov.slice(extL, cov.length - extR);  // remove the < > chars if any

                // We put the el in the last cell so that it is on top of events for that day and all events on prior
                // days as well
                cell = cells[Number(cov[cov.length - 1])];
                el = DomHelper.down(cell, '.b-cal-event-bar-container');

                if (el !== eventEl.parentNode) {
                    el.appendChild(eventEl);
                }

                DomSync.sync({
                    targetElement : eventEl,
                    syncOwner     : id,
                    callback      : processEventContentCallback,
                    // Use DomHelper.merge not ObjectHelper.merge so that me.eventDom.className (a DomClassList) is
                    // treated like plain key/value pairs that merge with those here (instead of getting one or the
                    // other)
                    domConfig     : DomHelper.merge({
                        className : {
                            'b-continues-past'   : extL,
                            'b-continues-future' : extR
                        },
                        style : {
                            [rtl ? 'right' : 'left'] : DomHelper.percentify(100 * Number(cov[0]) / cells.length),
                            width                    : DomHelper.percentify(100 * cov.length / cells.length),
                            top                      : weekEl === eventRow && eventTop
                        }
                        // technically the above properties are more specific than me.eventDom and you'd like these
                        // should be swapped, but this order a) works since there are no collisions; b) does not
                        // pollute me.eventDom or its sub-objects
                    }, me.eventDom)
                });
            }
        }

        if (weekValues) {
            for (i in weekValues) {
                weekValues[i].forEach(el => {
                    if (el.classList.contains('b-cal-tentative-event')) {
                        el.remove();
                    }
                });
            }
        }
    }
}

//====================================================================================================
// OverflowZone

class OverflowZone extends Zone {

    static $name = 'OverflowZone';

    static configurable = {
        droppable : false,

        dragProxy : {
            type : 'default',

            open(drag) {
                const
                    me        = this,
                    { owner } = drag.source.view,
                    sourceEl  = drag.element.closest('.b-cal-event-wrap');

                if (owner.isYearView) {
                    me.proxyEl = sourceEl.cloneNode(true);
                    me.proxyEl.classList.add('b-cal-drag-proxy');
                    me.proxyEl.style.width = `${sourceEl.offsetWidth}px`;
                    me.proxyOffset = EventHelper.getClientPoint(drag.startEvent).getDelta(Rectangle.from(sourceEl));

                    owner.contentElement.appendChild(me.proxyEl);
                }
            },

            dragMove(drag) {
                if (this.proxyEl) {
                    // Align the proxy to [15, 15] from the pointer
                    DomHelper.alignTo(this.proxyEl, EventHelper.getClientPoint(drag.event).translate(15, 15), {
                        align : 't0-t0'
                    });
                }
            },

            close() {
                this.proxyEl?.remove();
            }
        }
    };

    findRootElement(view) {
        return view.contentElement;
    }

    beforeDrag(drag) {
        const hit = this.hitTest(drag);

        if (hit?.type !== 'event' || !this.owner.draggable || !hit.eventRecord.isDraggable) {
            return false;
        }

        drag.set('eventRecord', hit.eventRecord);
        drag.set('eventDragMode', drag[eventDragSym] = modeDescriptor.move.mode);

        // Set resource if available, needed to make dropping events work correctly
        drag.set('resource', hit.resource);
    }

    dragStart() {
        this.view.hide();
    }
}

//====================================================================================================
// YearView

class YearZone extends Zone {

    static $name = 'YearZone';

    startCreate() {
        // Overflow popup must hide during YearView drag create.
        this.view._overflowPopup?.hide();
        super.startCreate(...arguments);
    }

    // Drop handling

    dragEnter(drag) {
        const result = super.dragEnter(drag);

        if (result !== false) {
            this.view.contentElement.classList.add(this.draggingCls);
        }

        return result;
    }

    dragLeave(drag) {
        super.dragLeave(drag);

        this.view.contentElement.classList.remove(this.draggingCls);
    }

    dropHitCreate(drag, hit, dragFrom) {
        const me = this;

        let endDate   = me.clearTime(hit.date),
            startDate = me.clearTime(dragFrom.date);

        if (endDate < startDate) {
            [startDate, endDate] = [endDate, startDate];
        }

        // Helpful to use the dates because of changing DST across large date ranges
        me.setEventData({
            startDate,
            endDate : DH.add(endDate, 1, 'd')
        });

        me.days = me.makeDayRange(startDate, endDate);  // updates cell styles for these days
    }

    dropHitMove(drag, hit, eventRecord) {
        super.dropHitMove(drag, hit, eventRecord);

        const
            me      = this,
            tempRec = me.eventRecord;

        let { endDate } = tempRec;

        if (tempRec.allDay) {
            endDate = DH.add(endDate, -1, 'd');  // switch to inclusive
        }

        me.days = me.makeDayRange(tempRec.startDate, endDate);
    }

    // Misc

    includeDay(date) {
        const els = DomHelper.children(this.view.bodyElement, `[data-date='${date}']`);

        els.forEach(e => e.classList.add(`b-cal-tentative-event${this.view.hideNonWorkingDays ? ':not(.b-non-working-day)' : ''}`));

        return els;
    }

    makeDayRange(startDate, endDate) {
        const days = [];

        for (let date = startDate; date <= endDate; date = DH.add(date, 1, 'd')) {
            days.push(DH.format(date, YYYY_MM_DD));
        }

        return days;
    }

    removeDay(date, els) {
        els.forEach(e => e.classList.remove('b-cal-tentative-event'));
    }
}

//====================================================================================================
// ResourceViewZone

class ResourceViewZone extends Base {
    static configurable = {
        view : null,

        zones : {
            $config : ['nullify'],
            value   : []
        }
    };

    updateView(view) {
        // Create sub zones for any already existent views.
        // If project had static data, they will be generated at config time.
        view.eachView(view => {
            this.onResourceViewViewCreate({ view });
        });

        // If data is loaded async, they will be created when Resources arrive.
        view.ion({
            viewCreate : 'onResourceViewViewCreate',
            thisObj    : this
        });
    }

    onResourceViewViewCreate({ view }) {
        const
            me    = this,
            {
                zones,
                owner
            }     = me,
            modes = owner.client.constructor.Modes,
            type  = owner.getViewZoneType(modes.resolveType(view.type));

        type && zones.push(owner.createZone(type, {
            view,
            resource : view.defaultCalendar
        }));
    }

    changeZones(zones, oldZones) {
        if (oldZones?.length && !zones) {
            for (let i = 0, { length } = oldZones; i < length; i++) {
                oldZones[i].destroy();
            }
        }
        return zones;
    }
}

//----------------------------------------------------------------------------------------------------

/**
 * Format expected to be returned in a `validateCreateFn`
 *
 * @typedef {Object} ValidateCreateResult
 * @property {Boolean} add Allow adding to store
 * @property {Boolean} edit Allow editor to open
 */

/**
 * This feature provides drag-based event creation and modification for Calendars. When enabled (which is the default
 * for calendars), the user can do the following via the mouse or touch screen:
 *
 *  - Create events by touching (or pressing the mouse button in) an the empty space and dragging. As the drag
 *    progresses, a tentative event is rendered. On release, the {@link Calendar.feature.EventEdit} feature displays
 *    the event edit dialog to complete the process. This can be disabled via the {@link #config-creatable} config.
 *  - Adjust the start or end times of an event in the day or week views by dragging the top or bottom of an event.
 *    This can be disabled via the {@link #config-resizable} config or the {@link Scheduler.model.mixin.EventModelMixin#field-resizable}
 *    field on a per-event basis.
 *  - Adjust the start or end date of an all-day event in the month view by dragging the left-most or right-most end
 *    of an event. This can be disabled via the {@link #config-resizable} config or the
 *    {@link Scheduler.model.mixin.EventModelMixin#field-resizable} field on a per-event basis.
 *  - Move an event from its current time (in day or week views) or date (in all views except agenda) by dragging the
 *    body of an event. This can be disabled via the {@link #config-draggable} config or via the
 *    {@link Scheduler.model.mixin.EventModelMixin#field-draggable} field on a per-event basis.
 *
 * ```javascript
 *  // change name for events created by drag to "Event":
 *  let calendar = new Calendar({
 *      features : {
 *          drag : {
 *              newName : 'Event'
 *          }
 *      }
 *  });
 * ```
 *
 * {@note}The events triggered by this feature are triggered through the client Calendar instance.{/@note}
 *
 * ## Asynchronous validation of resize, move and create operations
 *
 * You can easily add a confirmation step after an operation to show a dialog to the end user. This is done using the
 * {@link #event-beforeDragMoveEnd}, {@link #event-beforeDragCreateEnd} and {@link #event-beforeDragResizeEnd} events.
 *
 * ```javascript
 *  let calendar = new Calendar({
 *      listeners : {
 *          // Async event listeners allowing you to veto drag operations
 *          beforeDragMoveEnd : async({ eventRecord }) => {
 *               const result = await MessageDialog.confirm({
 *                   title   : 'Please confirm',
 *                   message : 'Is this the start time you wanted?'
 *               });
 *
 *               // Return true to accept the drop or false to reject it
 *               return result === MessageDialog.yesButton;
 *           },
 *           beforeDragResizeEnd : async({ eventRecord }) => {
 *               const result = await MessageDialog.confirm({
 *                   title   : 'Please confirm',
 *                   message : 'Is this the duration you wanted?'
 *               });
 *
 *               // Return true to accept the drop or false to reject it
 *               return result === MessageDialog.yesButton;
 *           },
 *           beforeDragCreateEnd : async({ eventRecord }) => {
 *               const result = await MessageDialog.confirm({
 *                   title   : 'Please confirm',
 *                   message : 'Want to create this event?'
 *               });
 *
 *               // Return true to accept the drop or false to reject it
 *               return result === MessageDialog.yesButton;
 *           }
 *       }
 *  });
 * ```
 *
 * ## Converting "All day" events to intra day events
 * You may drag an "All day" event out of the {@link Calendar.widget.DayView#property-allDayEvents top row}
 * of a {@link Calendar.widget.DayView} and into the body of the view.
 *
 * The event's {@link Scheduler.model.EventModel#field-duration} will be preserved if possible.
 *
 * If the newly calculated end time (based on the dropped-at time and the {@link Scheduler.model.EventModel#field-duration}
 * of the event) will overflow the end of that date then the event is converted to the duration configured
 * in the `DayView`'s {@link Calendar.widget.DayView#config-autoCreate}.
 *
 * This feature is **enabled** by default.
 *
 * The example below demonstrates validation of drag gestures so that no event intersects with any
 * {@link Calendar.feature.TimeRanges TimeRange} which have its `disabled` field set.
 *
 * {@inlineexample Calendar/feature/CalendarDrag.js}
 *
 * ## Disabling interaction with events in the past
 *
 * The drag-related events fired through the Calendar by this feature can be combined with an
 * {@link Calendar.widget.mixin.CalendarMixin#config-eventRenderer} to make events that occur in
 * the past read-only while still allowing future events to be freely created, moved and resized.
 *
 * The {@link #event-drag} events are vetoed for any pointer position which puts the start date of the event
 * before the current time. An `eventRenderer` flips
 * fully-past events to {@link Scheduler.model.EventModel#field-readOnly}.
 *
 * {@inlineexample Calendar/feature/CalendarDragNoPast.js}
 *
 * ## Styling the UI during a drag
 *
 * The drag gestures of this feature are implemented by internal zone objects, one per view, which mix in the
 * {@link Core.mixin.Draggable} mixin. As soon as the pointer goes down on a draggable element, the Draggable adds its
 * {@link Core.mixin.Draggable#property-draggingCls} (`'b-draggable-active'` by default) to the dragged view's *content*
 * element, and removes it when the gesture finishes.
 *
 * The class is added to the view's content element, not to the Calendar's element. Exactly which element that
 * is depends on the view: in day and week views it is the `.b-day-view-content` element, in month views the weeks
 * element, and in the agenda, overflow popup and year views the view's own content element.
 *
 * The pointer going down does not necessarily mean a drag will follow. Once the drag threshold has been passed and an
 * actual drag is under way, {@link Core.mixin.Draggable#property-draggingStartedCls} (`'b-draggable-started'` by
 * default) is added to the same element.
 *
 * Both classes may be used to restyle the UI for the duration of a drag gesture:
 *
 * ```css
 * .b-draggable-active .b-calendar-cell {
 *     background-color : #f5f5f5;
 * }
 * ```
 *
 * ## Useful configs
 *
 * | Config                           | Description                          |
 * |----------------------------------|--------------------------------------|
 * | {@link #config-creatable}        | Allow drag-creating new events       |
 * | {@link #config-draggable}        | Allow dragging events to new times   |
 * | {@link #config-resizable}        | Allow drag-resizing event edges      |
 * | {@link #config-tooltip}          | Tooltip shown during drag operations |
 * | {@link #config-validateCreateFn} | Custom validation for drag-create    |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar} — The Calendar that this feature operates on
 * - {@link Calendar.feature.ExternalEventSource} — Feature for dragging events in from external sources
 *
 * @extends Calendar/feature/CalendarFeature
 * @classtype drag
 * @feature
 * @tier community
 */
export default class CalendarDrag extends CalendarFeature {

    static $name = 'CalendarDrag';

    static type = 'drag';

    static configurable = {
        disableOnReadOnly : true,

        localizableProperties : [
            'newName',
            'recurrenceTip'
        ],

        /**
         * Specify `false` to disallow creating events by drag gestures.
         * @config {Boolean}
         */
        creatable : true,

        /**
         * Specify `false` to disallow dragging events to new times or days.
         * @config {Boolean}
         */
        draggable : true,

        /**
         * The {@link Scheduler.model.EventModel#field-durationUnit} to use when drag-creating events.
         *
         * If not specified, the `dragUnit` property of the active view's
         * {@link Calendar.widget.mixin.CalendarMixin#property-autoCreate} is used.
         *
         * For {@link Calendar.widget.DayView}s, this is normally `'hour'`, for views with a granularity
         * level of one day, the default is `'day'`.
         * @config {String}
         */
        durationUnit : null,

        /**
         * A {@link Core.helper.DomHelper#typedef-DomConfig DOM config} object used to create an extra element
         * during event drag to contain the end time of the tentative event. This element contains the CSS class
         * `'b-cal-event-footer'` which can be used for styling.
         *
         * Set this to `null` to remove the end time rendering during drag operations.
         * @config {DomConfig}
         * @default
         */
        footer : {
            className : 'b-cal-event-footer'
        },

        /**
         * This is configured as a {@link Core.helper.DomHelper#function-createElement-static DomHelper}
         * specification and is promoted to an `HTMLElement` during initialization. This element is moved between
         * calendar event elements on hover in order to show drag handles on the event under the mouse.
         * @config {HTMLElement|DomConfig}
         * @private
         */
        gripper : {
            class : 'b-gripper'
        },

        /**
         * The name of new events or a function to call with the event record that will return the event name.
         *
         * If a function is supplied, it is called in the scope of (the `this` reference is set to) the
         * view being dragged within.
         *
         * Cpnfigure as `null` to use the dragged-in view's {@link Calendar.widget.mixin.CalendarMixin#config-autoCreate}
         * `newName` property.
         * @config {String|Function}
         * @param {Scheduler.model.EventModel} eventRecord The record being drag-created.
         * @returns {String} Name of new event
         */
        newName : 'L{newEvent}',

        /**
         * The text to display as a hint for creating recurring events during drag. This tip is displayed in the
         * {@link #config-tooltip} in the same place as the recurrence summary (when there is no recurrence to
         * display).
         * @config {String}
         */
        recurrenceTip : '(L{holdCtrlForRecurrence})',

        /**
         * Specify `false` to disallow dragging the edges of events to change their start or end.
         * @config {Boolean}
         */
        resizable : true,

        /**
         * The tooltip to display during a drag create process. Disabled by
         * default, set to `true`, or provide a tooltip / config object, to enable it.
         * @config {Boolean|EventTipConfig|Calendar.widget.EventTip}
         */
        tooltip : {
            $config : ['lazy', 'nullify'],

            value : {
                type        : 'eventTip',
                disabled    : true,
                forSelector : null,
                tools       : null
            }
        },

        /**
         * An empty function by default that allows you to perform custom validation on an event being created by
         * a drag gesture.
         *
         * The `drag` context contains the following data items (see {@link Core.util.drag.DragContext#function-get}):
         *
         *  - `eventDragMode` : The {@link #typedef-CalendarDragMode} object describing the drag operation.
         *  - `eventCreate` : The {@link Calendar.view.Calendar#typedef-CalendarHit} object that describes the target of the drag operation.
         *
         * Return `false` to cancel the create operation.
         *
         * Note that the Calendar also offers the {@link Calendar.view.Calendar#event-beforeAutoCreate} event which
         * is triggered on drag *start*. Returning `false` from that event listener will also prevent the starting of
         * the drag-create gesture.
         *
         * This function can return a `Promise` (i.e., it can be `async`).
         *
         * Example:
         * ```javascript
         *  let calendar = new Calendar({
         *      features : {
         *          drag : {
         *              async validateCreateFn({ eventRecord, drag }) {
         *                  // This method can be async so it can make ajax requests or interact
         *                  // with the user...
         *
         *                  // if we return false, the event will be discarded
         *
         *                  // The following is equivalent to returning false:
         *                  //
         *                  // return {
         *                  //     // Do not add the event to the store
         *                  //     add  : false,
         *                  //     // Do not display the edit dialog (in the eventEdit feature):
         *                  //     edit : false
         *                  // };
         *                  //
         *                  // This simply adds the event and does not display the editor:
         *                  //
         *                  return {
         *                      edit : false
         *                  };
         *
         *                  // To do delay adding the event until the editor is done (and
         *                  // not via Cancel):
         *                  // return {
         *                  //     add : false
         *                  // };
         *              }
         *          }
         *      }
         *  });
         * ```
         * or:
         * ```javascript
         *  let calendar = new Calendar({
         *      features : {
         *          drag : {
         *              // Will resolve on the Calendar
         *              validateCreateFn : 'up.validateCreate'
         *          }
         *      },
         *      validateCreate{ eventRecord, drag } {
         *          ...
         *      }
         *  });
         * ```
         *
         * Return `true` if the event should be added to the event store and to inform the
         * {@link Calendar.feature.EventEdit eventEdit} feature to display the edit dialog.
         *
         * If this function returns an object, the `add` property can be set to `false`
         * to prevent adding to the event store, and the `edit` property can be set to `false` to inform the
         * `eventEdit` feature not to display the edit dialog.
         *
         * @config {Function|String}
         * @param {Object} info
         * @param {Core.util.drag.DragContext} info.drag The drag create context.
         * @param {Event} info.event The browser event object.
         * @param {CalendarView} info.view The Calendar widget in which the drag is taking place.
         * @param {Scheduler.model.EventModel} info.eventRecord The Event record.
         * @returns {Boolean|ValidateCreateResult} Return `false` if this event should be rejected.
         */
        validateCreateFn : () => {},

        /**
         * An empty function by default that allows you to perform custom validation on the event being moved to a
         * new date or time via a drag gesture.
         *
         * The `drag` context contains the following data items (see {@link Core.util.drag.DragContext#function-get}):
         *
         *  - `eventDragMode` : The {@link #typedef-CalendarDragMode} object describing the drag operation.
         *  - `eventRecord` : The {@link Scheduler.model.EventModel event record} being moved.
         *  - `eventSourceHit` : The {@link Calendar.view.Calendar#typedef-CalendarHit} object that describes the source of the drag operation.
         *
         * Return `false` to cancel the operation.
         *
         * This function can return a `Promise` (i.e., it can be `async`).
         *
         * Example:
         * ```javascript
         *  let calendar = new Calendar({
         *      features : {
         *          drag : {
         *              async validateMoveFn({ eventRecord, drag }) {
         *                  // This method can be async so it can make ajax requests or interact
         *                  // with the user...
         *
         *                  // if we return false, the event move will be discarded
         *              }
         *          }
         *      }
         *  });
         * ```
         * or:
         * ```javascript
         *  let calendar = new Calendar({
         *      features : {
         *          drag : {
         *              // Will resolve on the Calendar
         *              validateMoveFn : 'up.validateMove'
         *          }
         *      },
         *      validateMove{ eventRecord, drag } {
         *          ...
         *      }
         *  });
         * ```
         *
         * @config {Function|String}
         * @param {Object} info
         * @param {Core.util.drag.DragContext} info.drag The drag create context.
         * @param {Event} info.event The browser event object.
         * @param {CalendarView} info.view The Calendar widget in which the drag is taking place.
         * @param {Scheduler.model.EventModel} info.eventRecord A proxy event record which is updated during the drag operation
         * to create the UI. This record is *not the original event record*. The original event record is unchanged until
         * the drag operation is complete.
         * @returns {Boolean} Return `false` if this event change should be rejected.
         */
        validateMoveFn : () => {},

        /**
         * An empty function by default that allows you to perform custom validation on the event whose `startDate`
         * or `endDate` is being modified via drag gesture.
         *
         * The `drag` context contains the following data items (see {@link Core.util.drag.DragContext#function-get}):
         *
         *  - `eventDragMode` : The {@link #typedef-CalendarDragMode} object describing the drag operation.
         *  - `eventSourceHit` : The {@link Calendar.view.Calendar#typedef-CalendarHit} object that describes the source of the drag operation.
         *
         * Return `false` to cancel the operation.
         *
         * This function can return a `Promise` (i.e., it can be `async`).
         *
         * Example:
         * ```javascript
         *  let calendar = new Calendar({
         *      features : {
         *          drag : {
         *              async validateResizeFn({ eventRecord, drag }) {
         *                  // This method can be async so it can make ajax requests or interact
         *                  // with the user...
         *
         *                  // if we return false, the event change will be discarded
         *              }
         *          }
         *      }
         *  });
         * ```
         * or:
         * ```javascript
         *  let calendar = new Calendar({
         *      features : {
         *          drag : {
         *              // Will resolve on the Calendar
         *              validateResizeFn : 'up.validateResize'
         *          }
         *      },
         *      validateResize{ eventRecord, drag } {
         *          ...
         *      }
         *  });
         * ```
         *
         * @config {Function|String}
         * @param {Object} info
         * @param {Core.util.drag.DragContext} info.drag The drag create context.
         * @param {Event} info.event The browser event object.
         * @param {CalendarView} info.view The Calendar widget in which the drag is taking place.
         * @param {Scheduler.model.EventModel} info.eventRecord A proxy event record which is updated during the drag operation
         * to create the UI. This record is *not the original event record*. The original event record is unchanged until
         * the drag operation is complete.
         * @returns {Boolean|Promise} Return `false` if this event change should be rejected.
         */
        validateResizeFn : () => {},

        zoneTypes : {
            dayview         : DayZone,
            weekview        : DayZone,
            dayagendaview   : DayAgendaZone,
            monthview       : MonthZone,
            yearview        : YearZone,
            resourceview    : ResourceViewZone,
            dayresourceview : DayResourceZone

            // AgendaView is not supported (though it could be a Draggable just not a Droppable)
        },

        /**
         * By default, when an event is dragged from an external source, the event is removed from the
         * source EventStore. Configure this as `false` to leave the event in place to allow for the dragging
         * in of the same event repeatedly.
         * @prp {Boolean}
         * @default
         */
        removeFromExternalStore : true
    };

    callOnFunctions = true;

    // Called as a callOnFunctions function by the firing of the beforeDragStart event.
    // The beforeAutoCreate event is also triggered by CalendarMixin's detection of its own
    // autoCreate gesture. This event gives a common point for validation of UI-initiated
    // event creation.
    onBeforeDragStart(props) {
        const
            { client }     = this,
            {
                drag,
                event : domEvent
            }              = props,
            { view }       = drag.source,
            operation      = drag[eventDragSym].type,
            resourceRecord = view.getResourceRecord?.(drag.element),
            date           = drag.peek('date'),
            event          = {
                drag,
                domEvent,
                view,
                date,
                resourceRecord,
                eventRecord : drag.peek('eventRecord'),
                feature     : this.owner
            };

        if (client.trigger(`beforeDrag${StringHelper.capitalize(operation)}`, event) === false) {
            return false;
        }
        if (drag.peek('eventDragMode').type === 'create') {
            return client.trigger('beforeAutoCreate', {
                view,
                domEvent,
                date,
                startDate : date,
                endDate   : date,
                resourceRecord
            });
        }
    }

    changeGripper(gripper, was) {
        was?.remove();

        return gripper && DomHelper.createElement(gripper);
    }

    changeTooltip(config, existing) {
        if (config) {
            config = config === true ? this.constructor.configurable.tooltip.value : config;

            if (this.initialConfig.tooltip) {
                config.disabled = false;
            }
            config.ownerFeature = this;
        }

        return Widget.reconfigure(existing, config, /* owner = */ this);
    }
}

CalendarDrag.initClass();
