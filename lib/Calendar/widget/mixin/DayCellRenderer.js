import Base from '../../../Core/Base.js';
import DayTime from '../../../Core/util/DayTime.js';
import DomClassList from '../../../Core/helper/util/DomClassList.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DomSync from '../../../Core/helper/DomSync.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import OverflowPopup from '../OverflowPopup.js';

/**
 * @module Calendar/widget/mixin/DayCellRenderer
 */

const
    emptyFn           = () => Base.emptyObject,
    { eventNameMap }  = EventHelper,
    emptyMap          = { value : new Map(), configurable : true };

/**
 * Mixin that provides the ability to render calendar day cells, including event bars, overflow indicators,
 * and day-number headers. It handles the layout of event bars within each cell, managing slot allocation
 * for multi-day events that span across cells, and rendering the "+N more" overflow button when events
 * exceed the cell's visible capacity.
 *
 * This is used by the {@link Calendar.widget.MonthView} and also {@link Calendar.widget.CalendarRow}. It
 * expects its host class to include the {@link Calendar.widget.mixin.CalendarMixin} mixin.
 *
 * Views that use this mixin support customizing day cell content and overflow behavior:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         month : {
 *             // Customize the day cell content
 *             dayCellRenderer(cellData, domConfig) {
 *                 if (cellData.day === 0 || cellData.day === 6) {
 *                     domConfig.className['is-weekend'] = true;
 *                 }
 *             },
 *             // Configure overflow popup behavior
 *             overflowClickAction : 'popup',
 *             overflowPopup : {
 *                 eventList : {
 *                     type : 'dayview'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * @mixin
 */
export default Target => class DayCellRenderer extends (Target || Base) {
    static $name = 'DayCellRenderer';

    static configurable = {
        monitorResize : true, // we need to adjust the "+ 2 more" overflow indicator

        /**
         * This may be specified to create the content for the date and day name section of calendar cells.
         *
         * This function is called for each cell rendered. It can return an HTML string which will become the
         * content of the header section of the cell above any events.
         *
         * It can also return a {@link Core.helper.DomHelper#typedef-DomConfig} element creation object (or array of
         * same) to specify content to create in the header section of the cell.
         *
         * It also allows developers to mutate the cell metadata, or the CSS classes to be applied to the cell.
         *
         * The {@link Core.helper.DomHelper#typedef-DomConfig} definition passed as the second parameter may be
         * mutated to create a different cell header.
         *
         * ```javascript
         * dayCellRenderer : function(cellData, dayCellDomConfig) {
         *     // I don't like Mondays!
         *     if (cellData.day === 1) {
         *         dayCellDomConfig.className['hackathon-dayoff'] = true;
         *         dayCellDomConfig.style.fontWeight = 'bold';
         *
         *         cellData.isNonWorking = true;
         *
         *         return `${cellData.date.getDate()} Day off yay!`;
         *     }
         * }
         * ```
         *
         * A non-null return value from the renderer is used as the content of the day number element.
         *
         * When using the Bryntum React wrapper, this renderer can also return JSX elements. See
         * {@link Calendar.widget.mixin.EventRenderer#config-eventRenderer} for a JSX example and performance
         * considerations.
         *
         * {@note}When working with text content from user data or events, ensure any HTML is encoded using
         * {@link Core.helper.StringHelper#function-encodeHtml-static StringHelper.encodeHtml()} to prevent
         * XSS vulnerabilities.{/@note}
         *
         * @config {Function} dayCellRenderer
         * @param {DayCell} cellData A `DayCell` object that contains data about the cell.
         * @param {DomConfig|Object} dayCellDomConfig An object to sync the day cell element.
         * @param {Object} dayCellDomConfig.className An object who's truthy property names will be applied as class
         *   names.
         * @param {Object} dayCellDomConfig.style A CSS style definition object.
         * @param {Object} dayCellDomConfig.dataset The DOM data properties to set.
         * @param {DomConfig[]} dayCellDomConfig.children The {@link DomConfig} definitions for the content of the
         * cell.
         * @returns {String|Object|Object[]} The definition of the cell header content.
         */
        dayCellRenderer : null,

        // Must still be visible if dynamically set to non-working to keep
        // column arrangement correct.
        dynamicHideNonWorkingdayCls : 'b-dynamic-non-working-day',

        /**
         * The {@link Calendar.widget.OverflowPopup} instance that this view may show when events
         * for one day overflow the available space.
         * @member {Calendar.widget.OverflowPopup} overflowPopup
         * @readonly
         */
        /**
         * A config object used to create the {@link Calendar.widget.OverflowPopup} that this view
         * may show when events for one day overflow the available space.
         *
         * For example
         *
         * ```javascript
         *     modes : {
         *         month : {
         *             overflowPopup : {
         *                 closable   : false,
         *                 dateFormat : 'dddd, MMM M',
         *                 eventRenderer({ eventRecord, renderData }) {
         *                     if (calendarUtils.isImportantEvent(eventRecord)) {
         *                         // Add CSS class to important events
         *                         renderData.cls['b-important'] = 1;
         *                     }
         *                 }
         *             }
         *         }
         *     }
         * ```
         *
         * Note that the {@link Calendar.widget.OverflowPopup#config-eventList} config may be used
         * to customize the list of events shown in the popup. You can set its `type` property
         * to be a calendar view such as `'dayview'` or `'dayagenda'` or `'agendaview'` to show a
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
         *
         * @config {OverflowPopupConfig}
         */
        overflowPopup : {
            $config : ['lazy', 'nullify'],

            value : {
                type : 'overflowpopup'
            }
        },

        /**
         * The pointer gesture which shows the popup containing any overflowing events
         * in the current view.
         *
         * This means events which will not fit into a `MonthView` day cell, or *all* events
         * for a `YearView` cell.
         *
         * Useful values are `'click'` (the default), and `'mouseover'`
         * @config {'click'|'mouseover'|'hover'}
         * @default
         */
        overflowPopupTrigger : 'click',

        eventBarContainerCls : 'b-cal-event-bar-container',

        /**
         * A function, or name of a function which is passed the {@link DomConfig} object which
         * will be used to create the "+n more" button which indicates that a day cell has
         * overflowing events.
         *
         * ```javascript
         * overflowButtonRenderer : function(domConfig) {
         *     domConfig.className['fa'] = domConfig.className['fa-list'] = 1;
         *     return domConfig;
         * }
         * ```
         *
         * The result is used to create the overflow button element.
         *
         * To target the element using custom CSS, use the class name `b-cal-cell-overflow`.
         *
         * @config {Function} overflowButtonRenderer
         * @param {DomConfig|Object} domConfig A {@link DomConfig} config object which is used to create the
         *   overflow button.
         * @param {String} domConfig.tag=button The tag name of the element to create.
         * @param {Object} domConfig.className An object who's truthy property names will be applied as class names.
         * @param {String} domConfig.text The inner content of the element. **Note that this
         *   will be HTML encoded for XSS safety**
         * @param {Object} domConfig.style A CSS style definition object.
         * @param {Object} domConfig.dataset The DOM data properties to set.
         * @param {Number} overflowCount The number of overflowing events.
         * @returns {DomConfig|String|null}
         */
        overflowButtonRenderer : null,

        // <remove-on-release>
        /*
         * Not yet implemented.
         * The height in pixels of the overflow button shown in day cells when events overflow.
         *
         * This defaults to being the same height as event bars.
         *
         * If `eventHeight` is configured to a pixel value, and this is configured, then
         * the vertical space available for event bars in a cell is changed accordingly.
         *
         * The overflow button height may be reduced on small UIs to allow more event bars to be shown.
         * @prp {Number} overflowButtonHeight
         */
        overflowButtonHeight : null,
        // </remove-on-release>

        /**
         * The {@link Core.helper.DateHelper} format string/function to format the day names
         * in the header part of each calendar cell.
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         */
        dayCellNameFormat : null,

        /**
         * How much vertical space in pixels to leave between event bars in a cell.
         * @prp {Number}
         * @default
         */
        eventSpacing : 2,

        emptyCellCls : 'b-cal-empty-cell',

        /**
         * A {@link DomConfig} object which will be used to create the content of a clickable
         * element which is present when no events are in a cell.
         *
         * Or a function, or name of a function which returns a {@link DomConfig} object.
         *
         * See the {@link Calendar.view.Calendar#event-emptyCellClick} event.
         *
         * @config {Function|Object|String} emptyCellRenderer
         * @param {DayCell} dayCellRenderer A `DayCell` object that contains data about the cell.
         * @returns {DomConfig|null} DomConfig object representing the HTML markup
         */
        emptyCellRenderer : null,

        /**
         * When we create the aria-label for a cell, we want to include the number of events in the cell.
         * This is the localization key which will be used to format that string.
         * By default, we announce "n events", but this can be overridden to announce "n all-day events"
         * or whatever is appropriate for the view - see DayView#changeAllDayEvents.
         * @config {String}
         * @private
         */
        eventCountKey : 'eventCount'
    };

    doEmptyRefresh() {
        // Create the empty cell structure before the first refresh with data
        // so that boilerplate elements may be measured.
        // For this operation we must have an empty cell map so that we make no data requests
        Object.defineProperty(this, 'cellMap', emptyMap);
        this.doRefresh();
        emptyMap.value.clear();
        delete this.cellMap;
    }

    onCalendarStoreChange() {
        super.onCalendarStoreChange(...arguments);

        // Ensure any overflow popup is informed immediately after its owning View has been informed.
        if (this._overflowPopup?.isVisible) {
            this._overflowPopup.onCalendarStoreChange(...arguments);
        }
    }

    // Called automatically on the CellOverflow${overflowPopupTrigger} event because of callOnFunctions
    onCellOverflowGesture({ domEvent, date }) {
        const
            me       = this,
            cellData = me.cellMap.get(me.dateHelper.makeKey(date));

        if (cellData) {
            const
                {
                    overflowPopup,
                    owner
                }    = me,
                cell = me.getCellFromEvent(domEvent);

            /**
             * Fired after an {@link Calendar.widget.OverflowPopup} has been shown when an a
             * "+ n more" overflow button is activated by an {@link #config-overflowPopupTrigger} event.
             * @event showOverflowPopup
             * @param {HTMLElement} cell The day cell for which the overflow popup is going to be shown.
             * @param {DayCell} cellData A `DayCell` object that contains data about the cell.
             * @param {Date} date The date which has overflowing events
             * @param {Calendar.widget.OverflowPopup} overflowPopup The overflow `Popup`.
             */
            /**
             * Fired before an {@link Calendar.widget.OverflowPopup} is shown when an a
             * "+ n more" overflow button is activated by an {@link #config-overflowPopupTrigger} event.
             * @event beforeShowOverflowPopup
             * @param {HTMLElement} cell The day cell for which the overflow popup is going to be shown.
             * @param {DayCell} cellData A `DayCell` object that contains data about the cell.
             * @param {Date} date The date which has overflowing events
             * @param {Calendar.widget.OverflowPopup} overflowPopup The overflow `Popup`.
             * @preventable
             */
            if (overflowPopup && me.trigger('beforeShowOverflowPopup', { cell, cellData, date, overflowPopup })) {
                // If we are in a DayView, there may not be space either side of its overflow button
                // to display the overflow popup if it will not fit in its preferred position below the button.
                // In this case, we want the overflow popup's min constrainment height to be at least the height of the
                // day content area (minus some slack), Otherwise leave it as configured
                overflowPopup.align.minHeight = owner?.isDayView ? owner.dayContentElement.offsetHeight - 10 - (overflowPopup.align.constrainPadding || 0) : OverflowPopup.configurable.align.minHeight;
                overflowPopup.showOverflow(cell, cellData);
            }
        }
    }

    getCellFromEvent(domEvent) {
        return domEvent.target.closest('.b-calendar-cell[data-date]');
    }

    changeOverflowPopupTrigger(overflowPopupTrigger) {
        // Must be correctly camel cased so the we can create the `onCellOverflow${gesture}` method name.
        // So mouseover => mouseOver so that we inject an onCellOverflowMouseOver method.
        overflowPopupTrigger = overflowPopupTrigger.toLowerCase();
        if (overflowPopupTrigger === 'mouseover' || overflowPopupTrigger === 'hover') {
            overflowPopupTrigger = 'mouseOver';
        }
        return overflowPopupTrigger;
    }

    updateOverflowPopupTrigger(overflowPopupTrigger, was) {
        if (was) {
            this[`onCellOverflow${StringHelper.capitalize(was)}`] = emptyFn;
        }
        this[`onCellOverflow${StringHelper.capitalize(overflowPopupTrigger)}`] = this.onCellOverflowGesture;
    }

    // <remove-on-release>
    // This feature is not implemented yet.
    updateOverflowButtonHeight(overflowButtonHeight) {
        const me = this;

        // By default, the CSS var is inherited from .b-day-cell-renderer in CalendarEventRendering.css.
        // We override it in our own event content element when set.
        if (overflowButtonHeight) {
            me.eventContentElement.style.setProperty('--b-overflow-button-height', `${overflowButtonHeight}px`);
        }
        else {
            me.eventContentElement.style.removeProperty('--b-overflow-button-height');
        }
        me._eventContainerHeight = me._eventsPerCell = null;
        me.refreshSoon();
    }
    // </remove-on-release>

    onEventMouseOverOut({ target, relatedTarget, type }) {
        if (this.overflowPopupTrigger === 'mouseOver' && target.closest('.b-cal-cell-overflow') && !relatedTarget.closest('.b-cal-cell-overflow')) {
            if (type === 'mouseover') {
                // CalendarMixin's implementation triggers for overflow button gestures
                return this.onCalendarPointerInteraction(...arguments);
            }
            else {
                this._overflowPopup?.hide();
            }
        }
        return this.onCalendarPointerInteraction(...arguments);
    }

    changeOverflowPopup(config, instance) {
        const
            me         = this,
            popupOwner = me.up('calendar', true) || me.owner || me,
            // We use OverflowPopup instead of Widget since that will have any additional configs and will use the
            // correct merge procedure for them (if any were customized). The actual type can be derived and if so,
            // those config merge fns will not be consulted but that's very unlikely and not worth solving for in
            // general (though it could be).
            ret = OverflowPopup.reconfigure(instance, config, {
                owner    : me,  // so that we'll destroy our instances on reconfigure to null
                defaults : {
                    positioned  : !config?.floating,
                    owner       : me,
                    // Must be a widget-level config, not inside align, so that the
                    // get constrainTo() getter converts it to offsetParent coordinates
                    // for positioned widgets. Placing it in align.constrainTo bypasses
                    // that conversion, causing a coordinate space mismatch whenever the
                    // Calendar's offsetParent origin differs from the viewport origin
                    // (e.g. Calendar inside a modal, or a container with margin/padding).
                    // It cannot be tested outside of Salesforce environments.
                    constrainTo : popupOwner.element
                }
            });

        if (ret) {
            const
                { element }         = ret,
                // OverflowPopup uses configured event height.
                // It is less constrained than its associated cell.
                eventHeightInPixels = me.configuredEventHeight || me.eventHeightInPixels;

            // Make popup selectable
            ret.addCls(StringHelper.cls`b-${me.constructor.$$name}-overflow-popup`);

            // OverflowPopup is not a global floater by default. It's rendered inside of the Calendar
            // element so that focus stays within, and the Navigator can follow focus.
            // If that has not been overridden by configuration, render inside calendar content.
            if (ret.positioned) {
                ret.render(popupOwner.isCalendar ? popupOwner.element : popupOwner.contentElement);
            }

            // Some views, like DayView don't have a pixel event height.
            if (eventHeightInPixels) {
                element.style.setProperty('--bi-event-height', `${eventHeightInPixels}px`);
                element.style.setProperty('--bi-arrow-width', `${eventHeightInPixels / 3}px`);
            }

            // We have to relay interaction events upwards from the overflow popup if it's
            // not rendered into this view. If it is, then the events will bubble.
            if (ret !== instance && popupOwner !== me) {
                EventHelper.on({
                    thisObj     : me,
                    element     : ret.bodyElement,
                    delegate    : '.b-cal-event-wrap',
                    mouseover   : 'onEventMouseOverOut',
                    mouseout    : 'onEventMouseOverOut',
                    mousedown   : 'onCalendarPointerInteraction',
                    mouseup     : 'onCalendarPointerInteraction',
                    click       : 'onCalendarPointerInteraction',
                    dblclick    : 'onCalendarPointerInteraction',
                    contextmenu : 'onCalendarPointerInteraction'
                });

                // Header may have been configured away.
                if (ret.headerElement) {
                    EventHelper.on({
                        thisObj     : me,
                        element     : ret.headerElement,
                        mousedown   : 'onCalendarPointerInteraction',
                        mouseup     : 'onCalendarPointerInteraction',
                        click       : 'onCalendarPointerInteraction',
                        dblclick    : 'onCalendarPointerInteraction',
                        contextmenu : 'onCalendarPointerInteraction'
                    });
                }
            }
        }

        return ret;
    }

    onInternalResize(element, width, height, oldWidth, oldHeight) {
        const
            {
                _eventsPerCell,
                _eventContainerTop
            }  = this;

        super.onInternalResize(element, width, height, oldWidth, oldHeight);

        if (this.rendered && height !== oldHeight && !this.isAnimating) {
            // Calculates new values for eventsPerCell and eventContainerTop
            // and handles changes to either.
            this.performResizeRefresh(_eventsPerCell, _eventContainerTop);
        }
    }

    performResizeRefresh(prevEventsPerCell, prevEventContainerTop, now) {
        // Invalidate the values so that they are recalculated
        this._eventsPerCell = this._eventContainerTop = this._eventContainerHeight = null;

        const
            me = this,
            {
                eventsPerCell,
                _overflowPopup
            } = me;

        if (eventsPerCell !== prevEventsPerCell) {
            /**
             * Fires when number of events which could be placed in one cell is changed.
             * Has place when the height of the Month view is changed.
             * @event eventsPerCellChange
             * @param {Calendar.widget.MonthView} source This `MonthView` instance.
             * @param {Number} value New number of events per cell.
             * @param {Number} oldValue Previous number of events per cell.
             * @private
             */
            me.trigger('eventsPerCellChange', {
                value    : eventsPerCell,
                oldValue : prevEventsPerCell
            });
        }

        // If the component height change caused the event start position to change
        // or the eventsPerCell to change, refresh.
        if (me.eventContainerTop !== prevEventContainerTop || eventsPerCell !== prevEventsPerCell) {
            me.refreshSoon.cancel();

            // If now passed as true, use doRefresh rather than refresh which waits until visible.
            now ? me.doRefresh() : me.refresh();

            // The overflow state may have changed. If we are visible, refresh will have happened.
            // OverflowPopup will hide itself if the ext cellData block has no overflow
            if (_overflowPopup?.isVisible) {
                _overflowPopup.refresh(me._cellMap.get(me.dateHelper.makeKey(_overflowPopup.activeDate)));
            }
        }
    }

    updateEventHeight(eventHeight, was) {
        // CalendarMixin class needs to know
        super.updateEventHeight(eventHeight, was);

        // Force a recalculate on next access
        this._eventsPerCell = null;

        this.element.style.setProperty('--bi-event-height-px', `${this.eventHeightInPixels}px`);
    }

    updateEventSpacing(eventSpacing) {
        // Force a recalculate on next access
        this._eventsPerCell = null;

        // Schedule a refresh
        if (!this.isConfiguring) {
            this.refreshSoon();
        }

        this.element.style.setProperty('--bi-event-spacing', `${eventSpacing}px`);
    }

    get weeksElement() {
        return this.contentElement;
    }

    get eventContainerHeight() {
        // Must not bake the property in as zero if called during configuration.
        if (this._eventContainerHeight == null && this.isVisible && !this.isConfiguring) {
            const { firstVisibleCell } = this;

            this._eventContainerHeight = firstVisibleCell ? firstVisibleCell.offsetHeight - this.eventContainerTop : NaN;
        }
        return this._eventContainerHeight;
    }

    get eventContainerTop() {
        const me = this;
        // Must not bake the property in as zero if called during configuration.
        if (me._eventContainerTop == null && me.isVisible && !me.isConfiguring) {
            const
                { firstVisibleCell } = me,
                c = firstVisibleCell && firstVisibleCell.querySelector('.b-cal-cell-header'),
                top = c ? c.getBoundingClientRect().height : 0;

            // <remove-on-release>
            // We must use accurate rectangles to calculate the layout.
            // TODO: Nige should check, it still becomes 0 without this change
            // </remove-on-release>
            me._eventContainerTop = top === 0 ? null : top;
            me.element.style.setProperty('--bi-event-top', `${me._eventContainerTop || 0}px`);
        }
        return me._eventContainerTop || 0;
    }

    /**
     * Returns the number of complete event bars which will fit inside the referenced cell.
     *
     * The base implementation assumes all cells are the same height. In most views, most of the time,
     * this is true.
     *
     * It's only in MonthView when some rows are shrinkwrapped round their event content (meaning
     * either expanded or contracted away from the 1/6 height default) that there may be a customized
     * eventsPerCell for a certain date. So only MonthView has an overriding implementation.
     * @internal
     */
    getEventsPerCell(date) {
        return this.eventsPerCell;
    }

    get eventsPerCell() {
        const me = this;

        if (me._eventsPerCell == null) {
            me._eventsPerCell = Math.floor((me.eventContainerHeight + me.eventSpacing) / (me.eventHeightInPixels + me.eventSpacing));
        }

        return me._eventsPerCell;
    }

    /**
     * Yields a `Map` which contains the cell data for each date in the current view.
     * This is a `Map` where the keys are the date strings in the format
     * `YYYY-MM-DD` and the values are {@link DayCell} objects which contain the data for that cell.
     * @member {Map}
     * @readonly
     */
    get cellMap() {
        // If the cellMap has not been populated, create it.
        return this._cellMap?.populated ? this._cellMap : this.createCellMap();
    }

    cellRenderer({ cell }) {
        const me = this,
            domConfig = me.getCellDomConfig(...arguments),
            calendar = me.owner?.parent;

        if (calendar && !calendar.fwComponent) {
            calendar.fwComponent = calendar.processEventContent ? calendar : calendar.up(cmp => Boolean(cmp.processEventContent)) || {};
        }

        DomSync.sync({
            domConfig,
            targetElement : cell,
            callback({ jsx, action, targetElement, domConfig }) {
                calendar?.fwComponent?.processEventContent?.({
                    jsx,
                    action,
                    targetElement,
                    domConfig,
                    reactComponent : calendar.fwComponent.reactComponent
                });
            }
        });
    }

    getCellDomConfig({ cell, columnIndex, row, date, tomorrow, day, dayTime = this.dayTime ?? DayTime.MIDNIGHT, visibleColumnIndex, key }) {
        // Some views may create a day name element into which a dayCellRenderer may add content.
        // MonthView does this. CalendarRow does not. It has a separate concept of dayHeaderRenderer
        let dayName,
            dayEvents = !this.isConfiguring && this.cellMap.get(key);

        const
            me              = this,
            {
                dh,
                isMonthView,
                isYearPlannerRow,
                todayCls,
                emptyCellRenderer,
                dayCellNameFormat,
                resource,
                project
            }               = me,
            // No resource time ranges in Gantt projects
            hasTimeRanges   = project.timeRangeStore?.count || project.resourceTimeRangeStore?.count,
            isToday         = me.isToday(date),
            todayText       = isToday ? me.L('L{Object.today}, ') : '',
            dayNumber       = dh.getDate(date),
            eventContainer  = {
                className : me.eventBarContainerCls,
                role      : 'presentation',
                children  : [],

                // Match existing data-event-id elements first and ensure DOM order matches
                // children order.
                syncOptions : {
                    syncIdField      : 'eventId',
                    releaseThreshold : 0,
                    strict           : true
                }
            },
            cellHeader = {
                style     : {},
                className : new DomClassList({
                    'b-cal-cell-header' : true,
                    [todayCls]          : isToday
                })
            },
            dataset   = dayNumber === 1 ? {
                startOf : dh.format(date, 'MMM')
            } : {},
            domConfig = {
                tabIndex     : -1,
                role         : 'gridcell',
                'aria-label' : `${todayText}${dh.format(date, 'dddd Do MMMM')}${resource ? ` ${resource.name}` : ''}, ${me.L(me.eventCountKey, (dayEvents?.renderedEvents || dayEvents?.events)?.length || 0)}.`,
                dataset      : {},
                style        : {},
                className    : new DomClassList(cell?.className),
                children     : [cellHeader, eventContainer]
            },
            isFirstVisibleCell = !(date - (me.firstVisibleDate || -1));

        if (tomorrow && dh.getDate(tomorrow) === 1) {
            dataset.endOf = dh.format(date, 'MMM');
            domConfig.dataset.endOf = dataset.endOf;
        }

        domConfig.className[todayCls] = isToday;

        // Spin up an empty day cell information block only if we really need one.
        // If the project has time ranges, there may be a need to know about them
        // even if there are no events for the day, so we create and cache the cell
        if (!dayEvents && (me.addCellHeaderContent || (!me.isConfiguring && (me.dayCellRenderer || hasTimeRanges)))) {
            dayEvents = me.createCellData(date);
            if (hasTimeRanges) {
                me.cellMap.set(key, dayEvents);
            }
        }

        if (me.addCellHeaderContent) {
            // addCellHeaderContent mutates the cellHeader DomConfig block.
            // And if we are to have a day name element, returns the DomConfig for it.
            dayName = me.addCellHeaderContent(cellHeader, dayEvents);
        }
        else {
            cellHeader.children = [dayName = {
                className : {
                    'b-day-name' : true
                }
            }];
        }

        // Assign accessibility and interaction props to the correct element
        const header = Object.assign(isMonthView ? dayName : cellHeader, {
            role    : isMonthView ? 'link' : 'columnheader',
            dataset : {
                headerDate : key,
                ...dataset
            }
        });

        // In yearPlannerRow, the header is inert and must have no interaction or accessibility props.
        if (!isYearPlannerRow) {
            header.tabIndex = isMonthView ? 0 : -1;
            header['aria-label'] = `${todayText}${dh.format(date, 'dddd Do MMMM')}${resource ? ` ${resource.name}` : ''}.`;
        }

        let dynamicallySetToNonWorking;

        // Give the dayCellRenderer access to the configuration object for the cell header
        if (me.dayCellRenderer && !me.isConfiguring) {
            // Allow dayCellRenderer to access cell style and classes
            dayEvents.style = domConfig.style;
            dayEvents.cls = domConfig.className;

            // Allow dayCellRenderer to access cell header style and classes
            dayEvents.headerStyle = cellHeader.style;
            dayEvents.headerCls = cellHeader.className;

            const
                wasNonWorking = dayEvents && dayEvents.isNonWorking,
                dayNameContent = me.callback(me.dayCellRenderer, me, [dayEvents, domConfig]);

            // If renderer changed the cls or style properties, propagate the values back into place
            if (typeof dayEvents.cls == 'string') {
                domConfig.className = new DomClassList(dayEvents.cls);
            }
            if (typeof dayEvents.style === 'string') {
                domConfig.style = DomHelper.parseStyle(dayEvents.style);
            }
            if (typeof dayEvents.headerCls == 'string') {
                cellHeader.className = new DomClassList(dayEvents.headerCls);
            }
            if (typeof dayEvents.headerStyle === 'string') {
                cellHeader.style = DomHelper.parseStyle(dayEvents.headerStyle);
            }

            if (dayNameContent != null) {
                if (typeof dayNameContent === 'string') {
                    dayName.html = dayNameContent;
                }
                // Assuming Object or Object Array.
                else {
                    dayName.text = null;
                    dayName.children = ArrayHelper.asArray(dayNameContent);
                }
            }
            dynamicallySetToNonWorking = !wasNonWorking && dayEvents.isNonWorking;
        }

        if (dayName) {
            // If there was no renderer, use the date as the textContent
            if (!(dayName.text || dayName.html)) {
                if (dayCellNameFormat) {
                    dayName.html = dh.format(date, me.dayCellNameFormat);
                }
                else {
                    dayName.text = dayNumber;
                }
            }
            if (dayNumber === 1) {
                dayName.dataset = {
                    startOf : dh.format(date, 'MMM')
                };
            }

            // If the day number is there, give it the day number CSS rendition
            // This makes it a right-justified, hoverable element.
            if (String(dayName.text || dayName.html).endsWith(dayNumber)) {
                dayName.className['b-day-num'] = true;
            }
        }

        // If there's a cell entry which is visible (within this month and not a hidden nonworking day)
        if (dayEvents.visible) {
            const
                {
                    hasOverflow,
                    renderedEvents,
                    maxRow
                }          = dayEvents,
                {
                    weekLength,
                    eventSpacing,
                    eventHeightInPixels,

                    // This property means that long running events will not flow in the same row from cell to cell.
                    // Instead, on subsequent days, they will render as a separate event bar sorted to the top of the cell.
                    // this property is defined in DayCellCollecter
                    stackMultiDayEvents
                }          = maxRow ? me : Base.emptyObject,
                events     = renderedEvents,
                { length } = events,
                children   = eventContainer.children;

            // Sync the non working day CSS class.
            // But if a dayCellRenderer changed isNonWorking to true, the cell must remain
            // visible in certain views, to maintain cell arrangement, so add extra CSS class
            // to enable views to override the rule from Core/calendarpanel.scss.
            domConfig.className[me.nonWorkingDayCls] = dayEvents.isNonWorking;
            domConfig.className[me.dynamicHideNonWorkingdayCls] = dynamicallySetToNonWorking;
            domConfig.className[me.weekendCls] = dh.weekends[day];

            // How many events we find below the eventsPerCell point
            let i = 0, eventRow = 0, overflowCount = 0;

            for (; i < maxRow; i++, eventRow++) {
                const renderedEvent = events[i];

                // If the slot is occupied, add a child event element.
                // The event's .b-cal-event-wrap is position:absolute, so its offsetParent is the closest
                // position:relative element which is the .b-calendar-days row.
                // This is so that the events can use %age widths and need no intervention
                // for width changes. The left position is the .b-cal-event-bar-container's left.
                // Only height changes which result in a change to this.eventsPerCell require
                // a refresh.
                if (renderedEvent) {
                    const
                        {
                            eventRecord,
                            isOverflow,
                            propagateEndDate
                        }                = renderedEvent,
                        eventEndDate     = renderedEvent.eventEndDate || eventRecord.endingDate,
                        renderedDaySpan  = Math.max(1, me.getDaySpan(date, propagateEndDate || eventEndDate, dayTime)),
                        daySpan          = me.getDaySpan(date, eventEndDate, dayTime, true),
                        remainingColumns = weekLength - visibleColumnIndex,
                        isHiddenOverflow = !stackMultiDayEvents && visibleColumnIndex && isOverflow,
                        width            = DomHelper.percentify(ObjectHelper.round((
                            isHiddenOverflow || stackMultiDayEvents ? 1 : Math.min(renderedDaySpan, remainingColumns)) / weekLength * 100, 4)),
                        eventDomConfig   = me.createEventDomConfig(renderedEvent);

                    Object.assign(eventDomConfig.style, {
                        width,
                        top : `${eventRow * eventHeightInPixels + (eventRow * eventSpacing) + me.eventContainerTop}px`
                    });
                    Object.assign(eventDomConfig.className, {
                        // If flowing in from a previous cell
                        'b-overflow' : isHiddenOverflow,

                        // We're in the first cell or using stackMultiDayEvents, and the event started on an earlier date
                        'b-continues-past' : !isHiddenOverflow && (!visibleColumnIndex || stackMultiDayEvents || isFirstVisibleCell) && eventRecord.startDate < date,

                        // The event ends in a future week (or a future cell if stackMultiDayEvents)
                        'b-continues-future' : !isHiddenOverflow && (daySpan > remainingColumns || daySpan > renderedDaySpan || (stackMultiDayEvents && daySpan > 1))
                    });
                    children.push(eventDomConfig);
                }
            }
            // Continue after the maxRow has been reached
            // keeping track of how many events are below the fold
            while (i < length) {
                if (events[i++]) {
                    overflowCount++;
                }
            }

            // The cell was found to need an overflow link by propagateCellEvents.
            // This could be because it has more renderedEvents than me.eventsPerCell
            // Or it could be because its last visible event flowed forwards into a cell
            // whose own events only *filled*
            if (hasOverflow) {
                row.classList.add('b-has-overflow');
                domConfig.children.push(me.getOverflowButtonDomConfig(overflowCount));
            }
            else if (!columnIndex) {
                row.classList.remove('b-has-overflow');
            }

            // Flag the event container element as empty if necessary
            const emptyCell = domConfig.className[me.emptyCellCls] = !events.length;

            if (emptyCell && emptyCellRenderer) {
                const
                    rType     = typeof emptyCellRenderer,
                    rCallback = rType === 'function' || rType === 'string' ? me.resolveCallback(emptyCellRenderer, me, false) : null,
                    noEvents  = rCallback?.handler ? rCallback.handler.call(rCallback.thisObj, dayEvents) : emptyCellRenderer;

                // By default, a single line no events button will appear similar to
                // a "+n more" overflow button. It will be the size and shape of an event pill.
                if (noEvents) {
                    eventContainer.children[0] = {
                        tag      : 'button',
                        class    : 'b-cal-cell-no-content',
                        children : [
                            rCallback?.handler ? rCallback.handler.call(rCallback.thisObj, dayEvents) : emptyCellRenderer
                        ]
                    };
                }
            }
        }

        return domConfig;
    }

    onCalendarPointerInteraction(domEvent) {
        const
            me         = this,
            { target } = domEvent;

        // Broadcast a click on content in an empty cell.
        if (target.closest(`.${me.emptyCellCls} .${me.eventBarContainerCls}`)) {
            // If they have an emptyCellRenderer, then that must be the click target
            if (!me.emptyCellRenderer || target.closest('.b-cal-cell-no-content')) {
                /**
                 * Fired when an empty cell content area is clicked on. If the handler returns
                 * `false` the current pointer event is not processed further.
                 * @event emptyCellClick
                 * @param {Event} domEvent The triggering DOM event.
                 * @param {Date} date The date which has no visible events
                 */
                if (me.trigger(`emptyCell${eventNameMap[domEvent.type]}`, {
                    date : me.getDateFromDomEvent(domEvent),
                    domEvent
                }) === false) {
                    return false;
                }
            }
        }

        return super.onCalendarPointerInteraction(domEvent);
    }

    getDaySpan(startDate, endDate, dayTime, ignoreNonWorkingDays) {
        const { dh } = this;

        if (this.hideNonWorkingDays && !ignoreNonWorkingDays) {
            let result = 0;

            for (const date = new Date(startDate), spanEnd = dayTime.ceil(endDate, '1 day'); date < spanEnd; dh.add(date, 1, 'd', false)) { // NOSONAR
                if (!this.nonWorkingDays[dh.getDay(date)]) {
                    result++;
                }
            }
            return result;
        }
        else {
            return Math.max(dh.diff(startDate, dayTime.ceil(endDate, '1 day'), 'day'), 1);
        }
    }

    getOverflowButtonDomConfig(overflowCount) {
        const
            { overflowButtonRenderer } = this,
            domConfig                  = {
                tag             : 'button',
                'aria-label'    : `${this.L('L{Calendar.moreEvents}', overflowCount)}.`,
                'aria-haspopup' : 'menu',
                'aria-expanded' : 'false',
                className       : {
                    'b-cal-cell-overflow' : 1
                },
                text    : this.L('L{Calendar.plusMore}', overflowCount),
                style   : {},
                dataset : {
                    eventId : 'overflow'
                }
            };

        return overflowButtonRenderer ? this.callback(overflowButtonRenderer, this, [domConfig, overflowCount]) : domConfig;
    }

    getCell(date) {
        if (typeof date !== 'string') {
            date = this.dayTime.dateKey(date);
        }
        return this.contentElement.querySelector(`[data-date="${date}"]`);
    }

    getCellOverflowButton(date) {
        return this.getCell(date)?.querySelector('.b-cal-cell-overflow');
    }
};
