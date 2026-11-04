import Popup from '../../Core/widget/Popup.js';
import TimeZonable from '../../Core/mixin/TimeZonable.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';

DomHelper.loadStylesheet('Calendar/widget/OverflowPopup.css');

// import Stylesheet from './OverflowPopup.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'OverflowPopup');

/**
 * @module Calendar/widget/OverflowPopup
 */

/**
 * This class is not supposed to be used directly. It is used by Calendar views which need to show
 * more events than will fit into a day cell.
 *
 * A Popup which displays events which will not fit into their container in a View.
 *
 * By default, the popup contains a simple list of events, but this may be configured to contain a full
 * Calendar view such as a {@link Calendar.widget.DayView} or {@link Calendar.widget.DayAgendaView}
 * or {@link Calendar.widget.AgendaView} to provide a more detailed view of the overflowing day's events.
 *
 * See the {@link #config-eventList} config for details.
 *
 * The example below shows a MonthView which uses a {@link Calendar.widget.DayView}
 * as its overflow popup's event list:
 *
 * {@inlineexample Calendar/widget/OverflowPopup.js}
 *
 * ## Useful configs
 *
 * | Config                           | Description                                                     |
 * |----------------------------------|-----------------------------------------------------------------|
 * | {@link #config-eventRenderer}    | Custom function for rendering event content                     |
 * | {@link #config-eventSorter}      | Custom sort function for event ordering                         |
 * | {@link #config-eventList}        | Widget config for the inner event list (can be a Calendar view) |
 * | {@link #config-dateFormat}       | Format string for the popup title date                          |
 * | {@link #config-onlyShowOverflow} | Only show events that were hidden due to overflow               |
 *
 * ## See also
 *
 * - {@link Calendar.widget.MonthView} — The view that shows this popup for overflowing day cells
 * - {@link Calendar.widget.CalendarRow} — The all-day row that may also trigger overflow popups
 * - {@link Calendar.widget.mixin.DayCellRenderer} — Mixin that manages overflow rendering
 *
 * @extends Core/widget/Popup
 * @classtype overflowpopup
 * @tier community
 */
export default class OverflowPopup extends Popup.mixin(TimeZonable) {
    static $name = 'OverflowPopup';

    // Factoryable type name
    static type = 'overflowpopup';

    static configurable = {
        defaultFocus : '.b-cal-event-wrap',
        textContent  : false,
        autoShow     : false,
        floating     : false,
        cls          : 'b-calendar-mixin b-cal-event-list',
        closable     : true,
        draggable    : {
            handleSelector : ':not(.b-cal-event-wrap)'
        },
        anchor : true,
        layout : 'fit',

        /**
         * An empty function by default, but provided so that you can override it.
         *
         * This function is called each time an event is rendered to allow developers to mutate
         * the cell metadata, or the CSS classes to be applied to the event element.
         *
         * It's called with the event record, and a eventData object which allows you to mutate event metadata
         * such as 'cls', 'style'.
         *
         * The cls property is an object whose property names will be added to the event element if the property
         * value is truthy.
         *
         * The style property is an object containing style properties for the event element.
         *
         * A non-null return value from the renderer is used as the event body content. A nullish
         * return value causes the default renderer to be used which just uses the event name.
         *
         * If a string is returned, it is used as the HTML content of the event body element.
         *
         * If an object is returned, it is used as a {@link Core.helper.DomHelper#typedef-DomConfig} object to
         * create complex content in the event body element.
         *
         * ```javascript
         *  eventRenderer({ eventRecord, renderData }) {
         *      if (eventRecord.name === 'Doctors appointment') {
         *          renderData.style.fontWeight = 'bold';
         *          renderData.cls['custom-cls'] = 1;
         *
         *          return 'Special doctors appointment';
         *      }
         *  }
         * ```
         * IMPORTANT: When returning content, be sure to consider how that content should be encoded to avoid XSS
         * (Cross-Site Scripting) attacks. This is especially important when including user-controlled data such as
         * the event's `name`. The function {@link Core.helper.StringHelper#function-encodeHtml-static} as well as
         * {@link Core.helper.StringHelper#function-xss-static} can be helpful in these cases.
         *
         * For example:
         * ```javascript
         *  eventRenderer({ eventRecord }) {
         *      return StringHelper.xss`Event: ${eventRecord.name}`;
         *  }
         * ```
         * @config {Function} eventRenderer
         * @param {Object} context An object that contains context about the event being rendered
         * @param {Scheduler.model.EventModel} context.eventRecord The event record
         * @param {Scheduler.model.ResourceModel} context.resourceRecord The event record
         * @param {Object} context.renderData A data object containing properties that will be used to create the event element
         * @param {Object} context.renderData.style The style property is an object containing style properties for
         *   the event element
         * @param {Object} context.renderData.cls The cls property is an object whose property names will be added to
         *   the event element if the property value is truthy
         * @param {String} context.renderData.eventColor Color to be applied to the event
         * @returns {String|DomConfig|DomConfig[]|null} A simple string, or a DomConfig object defining the actual HTML
         */
        eventRenderer : null,

        /**
         * A function which compares events to decide upon rendering order.
         *
         * By default, this class uses the sorted order of its owning view and does *not* perform
         * a sort, but this may be configured to override that behaviour.
         *
         * Note that the two objects to compare may either be {@link Scheduler.model.EventModel}s
         * or {@link EventBar}s which __contain__ an `eventRecord` property which is the {@link Scheduler.model.EventModel}.
         * @config {Function}
         * @param {Scheduler.model.EventModel|EventBar} lhs The left side value to conpare.
         * @param {Scheduler.model.EventModel|EventBar} rhs The right side value to conpare.
         * @returns {Number}
         */
        eventSorter : null,

        /**
         * A {@link Core.widget.Widget} config object used to configure the inner list of overflowing events
         * shown in this popup.
         *
         * This widget has a {@link Core.widget.Widget#config-weight} of `500`, so to insert widgets above
         * this in the {@link #config-items} collection, use `weight` less than 500, and to insert widgets
         * below it use `weight` greater than 500.
         *
         * Note that this may be used to customize the list of events shown in the popup. You can set
         * its `type` property to be a calendar view such as `'dayview'` or `'dayagenda'` or `'agendaview'` to show a
         * detailed view of the overflowing day's events:
         *
         * For example:
         *
         * ```javascript
         *    modes : {
         *        month : {
         *            overflowPopup : {
         *               eventList : {
         *                  // Use a DayView to show overflowing events
         *                  // Make hours a little smaller to fit more in
         *                  type         : 'dayview',
         *                  dayStartTime : 9,
         *                  hourHeight   : 30,
         *               }
         *           }
         *       }
         *   }
         * ```
         * @config {ContainerItemConfig}
         * @ts-returns {DayViewConfig|DayAgendaViewConfig|AgendaViewConfig|WidgetConfig}
         * @property {'dayview'|'dayagenda'|'agendaview'} [type] The type of widget to create to show as the event list.
         * If specified, may be:
         *
         *  - `'dayview'`
         *  - `'dayagenda'`
         *  - `'agendaview'`
         */
        eventList : {
            type       : 'widget',
            flex       : 1,
            weight     : 500,
            scrollable : {
                overflowY : 'auto'
            }
        },

        items : {},
        tools : {
            maximize : null
        },

        /**
         * The {@link Core.helper.DateHelper#function-format-static DateHelper} format string/function to use to
         * create the {@link #config-title} of this dialog.
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default
         */
        dateFormat : 'dddd, MMM DD',

        activeDate : {
            $config : {
                equal : 'date'
            },
            value : null
        },
        scrollAction : 'realign',
        align        : {
            axisLock         : 'flexible',
            constrainPadding : 20,
            minHeight        : 400,
            minWidth         : '15em'
        },

        /**
         * By default, an OverflowPopup aligns to the overflowing day cell.
         *
         * Configure as `false` to align to the overflow button that was clicked instead.
         * @config {Boolean}
         * @default true
         */
        alignToCell : true,

        /**
         * By default an event overflow popup shows all the events for the activated date.
         *
         * Configure this as `true` to only display the events which were hidden due to overflow.
         * @config {Boolean}
         */
        onlyShowOverflow : null,

        // Private default config used when the eventList is a Calendar view
        // We make it more compact and suitable for embedding in the popup
        eventListCalendarDefaults : {
            allDayEvents : {
                fullWeek : false
            },
            header         : false,
            height         : '40dvh',
            range          : '1 day',
            minWidth       : '20em',
            compactHeader  : true,
            settingsButton : false,
            eventLayout    : {
                gutter : false
            }
        }
    };

    calendarHitTest(domEvent) {
        const
            me      = this,
            target  = DomHelper.getEventElement(domEvent),
            closest = target.closest('.b-cal-event-wrap');

        let eventRecord;

        // It's only an event hit if the id exists in the event store.
        // May be a transient event added solely to the UI and not backed by the store.
        if (closest && (eventRecord /* assignment */ = me.owner.eventStore.getById(closest.dataset.eventId))) {
            const result = {
                eventRecord,
                type         : 'event',
                eventElement : closest,
                view         : me
            };

            // Include resource if available (needed for drag operations)
            if (me.cellData?.resource) {
                result.resource = me.cellData.resource;
            }

            return result;
        }

        return null;
    }

    onPanelHeaderClick({ event : domEvent }) {
        if (domEvent.target.closest('.b-header-title')) {
            this.owner?.trigger('dayNumberClick', {
                domEvent,
                date              : this.activeDate,
                cellData          : this.cellData,
                fromOverflowPopup : true
            });
        }
        else {
            super.onPanelHeaderClick(...arguments);
        }
    }

    get focusElement() {
        const activeElement = DomHelper.getActiveElement(this);
        return this.element.contains(activeElement)
            ? activeElement
            : (this.eventList?.element?.querySelector('.b-cal-event-wrap') || super.focusElement);
    }

    getDateFromPosition() {
        // This View only shows one date, so the answer is easy.
        return this.activeDate;
    }

    getEventElement(eventRecord) {
        return this.contentElement.querySelector(`[data-event-id="${CSS.escape(eventRecord.id)}"]`);
    }

    showOverflow(cell, cellData) {
        const
            me = this,
            /**
             * The date for which overflow is being shown.
             * @readonly
             * @member {Date} activeDate
             */
            date = me.activeDate = cellData.date;

        /**
         * A data block containing information about the day for which overflow is being shown.
         * @readonly
         * @member {DayCell} cellData
         */
        me.cellData = cellData;
        me.targetCell = cell;

        if (cellData.resource) {
            me.element.dataset.resourceId = cellData.resource.id;
        }

        me.refresh(cellData);

        me.showBy(me.alignToCell ? cell : DomHelper.getActiveElement(me.owner));

        if (me.isVisible) {
            // Fired on the owning view. Documented in DayCellRenderer
            me.owner?.trigger('showOverflowPopup', { cell, cellData, date, overflowPopup : me });
        }
    }

    // Owning view calls this from its own onCalendarStoreChange implementation
    onCalendarStoreChange() {
        const me = this;

        if (me.isVisible) {
            me.cellData = me.owner.cellMap.get(me.owner.dateHelper.makeKey(me.activeDate));
            me.refresh(me.cellData);
        }
    }

    refresh(cellData) {
        const
            me            = this,
            { eventList } = this;

        // eventList might be configured away
        if (!eventList) {
            return;
        }

        // Allow the caller to update the overflow state
        if (cellData) {
            me.cellData = cellData;
        }
        else {
            cellData = me.cellData;
        }

        const
            {
                owner,
                eventRenderer,
                eventSorter
            }           = me,
            { element } = eventList,
            // Slice using eventsPerCell - 1 because if there's one event that won't fit,
            // the last event fitting will be evicted to make room for the overflow indicator.
            // If there's no overflow indicator (like in YearView), eventsPerCell will be
            // zero, so sanitize value up to 0.
            slicePoint = me.onlyShowOverflow ? Math.max(owner.eventsPerCell - 1, 0) : 0,
            // Because of long running events overflowing, allDay events and intraday
            // events could be interleaved in the cells slots.
            // In the event list, we sort them into the required order with
            // oldest and longest at the top.
            events      = cellData?.renderedEvents.slice(slicePoint),
            children    = [];

        // We can delete events from the Popup, so when we've exhausted the events, we must hide.
        // Also, if a refresh was called from the owner's resize handling, that may have caused
        // the overflow state to have changed to not overflowing.
        // YearView can't not overflow. It's just a heat map.
        if (!events?.length || (!cellData?.hasOverflow && !owner.isYearView)) {
            return me.hide();
        }

        // If we have been configured with an overriding eventSorter, apply it now.
        // Otherwise, we are using the data as shown in our owning view.
        if (eventSorter) {
            events.sort(eventSorter);
        }

        // If the event list is a calendar widget, use its own rendering mechanism
        if (eventList.isCalendarMixin) {
            eventList.date = cellData.date;
        }
        else {
            for (let i = 0, eventRow = 0, { length } = events; i < length; i++, eventRow++) {
                const renderedEvent = events[i];

                // If the slot is occupied, add a child event element.
                // These just flow down the Popup's bodyElement
                if (renderedEvent) {
                    const eventDomConfig = owner.createEventDomConfig(renderedEvent, eventRenderer);

                    Object.assign(eventDomConfig.className, {
                        // The event started in a previous day
                        'b-continues-past' : renderedEvent.eventRecord.startDate < cellData.date,

                        // The event ends in a future day
                        'b-continues-future' : renderedEvent.eventRecord.endDate > cellData.tomorrow
                    });
                    eventDomConfig.style.marginBottom = `${owner.eventSpacing}px`;
                    children.push(eventDomConfig);
                }
            }

            DomSync.sync({
                domConfig : {
                    children
                },
                targetElement : element,
                callback({ action, domConfig, targetElement, jsx }) {
                    owner.calendar?.processEventContent?.({
                        jsx,
                        action,
                        domConfig,
                        targetElement,
                        reactComponent : owner.calendar.reactComponent
                    });
                }
            });

            // Fix up cell's time info.
            element.dataset.date = cellData.key;
            element.classList.add(`b-day-of-week-${cellData.day}`);
            element.classList.remove(`b-day-of-week-${me.lastRefreshDay}`);
        }

        me.lastRefreshDay = cellData.day;

        me.realign();
    }

    changeItems(items) {
        const me = this;

        let { eventList } = me;

        if (eventList) {
            const type = OverflowPopup.resolveType(eventList.type);

            // If the event list has been reconfigured to be a Calendar view
            // Sanitize the configuration a bit to make it more consistent.
            if (type.isCalendarMixin) {
                eventList = type.mergeConfigs({
                    project          : me.owner?.project,
                    responsiveTarget : me
                }, me.eventListCalendarDefaults, eventList);
                if (type.isDayAgendaView) {
                    delete eventList.height;
                }
                if (type.isGrid) {
                    delete eventList.height;
                    eventList.autoHeight = true;
                }
            }
            // If the event list is not a Calendar view, ensure it has the right class
            // to act as an event list.
            else {
                eventList.cls = 'b-cal-event-bar-container';
            }

            items.eventList = eventList;
        }

        const result = super.changeItems(items);

        if (eventList) {
            me.eventList = me.widgetMap.eventList;
        }

        return result;
    }

    onFocusIn(e) {
        super.onFocusIn(e);

        this.owningOverflowButton = this.focusInEvent?.relatedTarget;
        this.owningOverflowButton?.setAttribute('aria-owns', DomHelper.getId(this.ariaElement));
    }

    onHide() {
        this.owningOverflowButton?.removeAttribute('aria-owns');
        this.owningOverflowButton = null;
    }

    changeActiveDate(activeDate, oldActiveDate) {
        const { dateHelper : dh } = this;
        activeDate = typeof activeDate === 'string' ? dh.parse(activeDate) : new Date(activeDate);

        if (isNaN(activeDate)) {
            throw new Error('OverflowPopup date ingestion must be passed a Date, or a YYYY-MM-DD date string');
        }

        return activeDate;
    }

    updateActiveDate(activeDate) {
        const
            me                  = this,
            { dateHelper : dh } = me;

        me.element.dataset.date = dh.makeKey(activeDate);
        me.title = `<span tabIndex="0" role="link" aria-label="${dh.format(activeDate, 'dddd, D MMMM')}">${dh.format(activeDate, me.dateFormat)}</span>`;
    }

    onDocumentMouseDown({ domEvent }) {
        const
            alignedTo  = this.lastAlignSpec?.target,
            { target } = domEvent;

        // On mousedown of our own activating element, do not focusout
        if (alignedTo?.contains(target)) {
            const cellOverflowButton = target.closest('.b-cal-cell-overflow');

            // If it's a click inside the overflowing cell, or inside the overflow button
            // then ignore it, we're clicking on our own data or overflow button.
            if (target.closest('.b-cal-event-bar-container') || target.matches('.b-cal-cell-overflow') || (cellOverflowButton?.children.length === 1)) {
                return domEvent.preventDefault();
            }
        }
        super.onDocumentMouseDown({ domEvent });
    }
}

OverflowPopup.initClass();
