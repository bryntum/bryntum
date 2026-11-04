import Tooltip from '../../Core/widget/Tooltip.js';
import ClockTemplate from '../../Scheduler/tooltip/ClockTemplate.js';
import DH from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

import Calendar from '../view/Calendar.js';
import Widget from '../../Core/widget/Widget.js';
import { parseAlign } from '../../Core/helper/util/Rectangle.js';

DomHelper.loadStylesheet('Calendar/widget/EventTip.css');

// import Stylesheet from './EventTip.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'EventTip');

/**
 * @module Calendar/widget/EventTip
 */

const hasEventStore = w => w.eventStore;

/**
 * Displays a tooltip containing extra info and options on either event click or event hover.
 *
 * See the {@link Calendar.feature.EventTooltip} feature for more information and an example of
 * customizing the displayed event tooltip.
 *
 * The EventTip is provided with two standard {@link #config-tools}:
 *
 * * `edit` - A tool which is linked to the {@link Calendar.feature.EventEdit} feature
 * to initiate editing when clicked.
 * * `delete` - A tool which removes the current event record
 * function of the active view to enable event deletion.
 *
 * New tools may be added, or properties of existing tools may be changed by configuring the
 * {@link Calendar.feature.EventTooltip} feature.
 *
 * Content may be customized using the {@link #config-titleRenderer} and {@link #config-renderer}
 * which may create complex content by returning a {@link DomConfig}:
 *
 * ```javascript
 *     features : {
 *         eventTooltip : {
 *             tools : {
 *                 // Just override handler of existing tool - all else is OK
 *                 edit : {
 *                     handler : () => console.log(`Handle editing ${this.eventRecord.name} our way`);
 *                 },
 *                 // Add a new tool for our own operation
 *                 newTool : {
 *                     cls     : 'b-icon-add',
 *                     tooltip : 'Test',
 *                     handler() {
 *                         console.log(`Test ${this.eventRecord.name}`);
 *                     }
 *                 }
 *             },
 *             renderer({ eventRecord }) {
 *                 return {
 *                     text : `From ${DateHelper.format(eventRecord.startDate, 'l')} to ${DateHelper.format(eventRecord.endDate, 'l')}`
 *                 },
 *             },
 *             titleRenderer( eventRecord ) {
 *                 return {
 *                     text      : `${eventRecord.name} ${eventRecord.resource.name}`,
 *                     className : {
 *                         'b-urgent'    : eventRecord.isUrgent,
 *                         'b-completed' : eventRecord.isCompleted
 *                     }
 *                 };
 *             }
 *         }
 *     }
 * ```
 *
 * ## Useful configs
 *
 * | Config                                | Description                                        |
 * |---------------------------------------|----------------------------------------------------|
 * | {@link #config-renderer}              | Custom function to create tooltip body content     |
 * | {@link #config-titleRenderer}         | Custom function to create tooltip header content   |
 * | {@link #config-dateFormat}            | Date format string for displayed dates             |
 * | {@link #config-timeFormat}            | Time format string for displayed times             |
 * | {@link #config-extendAllDayEndDay}    | Show technical end date for all-day events         |
 * | {@link #config-revealEventsInCluster} | Expand clustered event to full width on activation |
 *
 * ## See also
 *
 * - {@link Calendar.feature.EventTooltip} — The feature that manages this tooltip widget
 * - {@link Calendar.widget.ResourceChipView} — Displays resource chips inside the tooltip
 * - {@link Scheduler.model.EventModel} — The event model whose data is displayed
 *
 * @extends Core/widget/Tooltip
 * @classtype eventTooltip
 * @tier community
 */
export default class EventTip extends Tooltip {

    // <debug>
    // region Localization test
    static localization = [
        'L{timeFormat}'
    ];
    // endregion
    // </debug>

    //region Config

    static $name = 'EventTip';

    static type = 'eventtip';

    static configurable = {
        localizableProperties : ['timeFormat'],

        align : {
            // Needed because we show on click meaning the tip persists and may need
            // to adjust to UI shape changes.
            monitorResize : true
        },

        /**
         * A {@link Core.helper.DateHelper} format string/function used to format dates displayed in this tooltip.
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default
         */
        dateFormat : 'll',

        /**
         * The event which the tooltip feature has been shown for.
         * @member {Scheduler.model.EventModel} eventRecord
         * @readonly
         */
        /**
         * The event record for this tip to display
         * @config {Scheduler.model.EventModel} eventRecord
         */
        eventRecord : {
            $config : 'nullify',  // ensure we remove our afterChange hook

            value : null
        },

        recurrenceHint : '',

        /**
         * A {@link Core.helper.DateHelper} format string/function used to format the time displayed in this tooltip.
         *
         * @config {String|Function}
         * @param {Date} date The date to format.
         * @returns {String} The formatted date.
         * @default 'LST'
         */
        timeFormat : {
            value   : 'LST',
            $config : {
                localeKey : 'L{timeFormat}'
            }
        },

        // Allow it to fall back from its initial alignment axis to the cross axis.
        // So if aligned l-r or r-l and shown by a long multiday event, it allows
        // itself to be fall back to being aligned t-b
        axisLock : 'flexible',

        closable     : null,
        // We must activate on embedded widgets from other product families and EventList rows.
        forSelector  : '.b-cal-event-wrap,.b-sch-event-wrap,.b-gantt-task-wrap,.b-task-board-card,.b-cal-event-list-row',
        maxWidth     : '30em',
        minWidth     : '14em',
        scrollAction : 'realign',

        cls : {
            'b-sch-event-tooltip' : 1
        },

        tools : {
            edit : {
                cls     : 'b-icon-edit',
                handler : 'up.onEditClick',
                tooltip : 'L{EventEdit.Edit event}',
                weight  : 100
            },
            delete : {
                cls     : 'b-icon-trash',
                handler : 'up.onDeleteClick',
                tooltip : 'L{SchedulerBase.Delete event}',
                weight  : 0
            },
            maximize : null
        },

        /**
         * A function, or name of a function in the ownership hierarchy which is used to create
         * the content of the tooltip's header.
         *
         * @prp {Function|String}
         * @param {Scheduler.model.EventModel} eventRecord The event record
         * @returns {String|DomConfig} The content of the header element.
         */
        titleRenderer : eventRecord => StringHelper.encodeHtml(eventRecord.name),

        /**
         * A function, or name of a function in the ownership hierarchy which is used to create
         * the content of the tooltip's body.
         *
         * @prp {Function|String}
         * @param {Object} context Contextual data about the current tooltip activation
         * @param {HTMLElement} context.activeTarget The event bar element being aligned to
         * @param {Scheduler.model.EventModel} context.eventRecord The event record
         * @param {Event} context.event The DOM event which initiated the tooltip show
         * @param {Calendar.widget.EventTip} context.tip The tooltip instance being shown
         * @returns {String|DomConfig} The content of the body element.
         */
        renderer : null,

        /**
         * By default, the end date of an all day event is displayed in the tooltip UI as
         * the last calendar date on which the event falls. For most end users, this is the
         * expected value.
         *
         * Technically, the {@link Scheduler.model.EventModel#field-endDate} is a timestamp
         * which represents the exact point in time at which an event ends. To use this instead,
         * configure `extendAllDayEndDay` as `true`.
         *
         * To be clear, this would mean that an {@link Scheduler.model.EventModel#field-allDay}
         * event starting and ending on the 7th of February 2020, would show the end date in the
         * tooltip as 8th of February 2020.
         * @prp {Boolean}
         * @default false
         */
        extendAllDayEndDay : null,

        activeClient : null,

        /**
         * By default, if the tip's target event is in a cluster of overlapping events and therefore
         * narrow, activating the tip will expand it to full width temporarily.
         *
         * Configure this as `false` to disable this.
         * @prp {Boolean}
         * @default true
         */
        revealEventsInCluster : true
    };

    static get delayable() {
        return {
            refreshContent : 20
        };
    }

    clockTemplate = new ClockTemplate({});

    //endregion

    get owner() {
        return Widget.fromElement(this.activeTarget) || this.ownerFeature.client;
    }

    onEditClick() {
        this.trigger('edit');
    }

    onDeleteClick() {
        this.trigger('delete');
    }

    // Override from Popup when this is shown on click or contextmenu.
    // We push the activating event through to Tooltip's internalOnPointerOver
    onElementUserAction(domEvent) {
        this.internalOnPointerOver(domEvent);
    }

    async handleForElementOver(event, newTarget) {
        const
            me                   = this,
            { ownerFeature }     = me,
            owningCalendarWidget = Widget.fromElement(newTarget)?.closest(hasEventStore);

        me.eventRecord = null;

        if (owningCalendarWidget) {
            const client = ownerFeature?.client || owningCalendarWidget.calendar;

            if (client.features?.eventEdit?.isEditing || client.activeView.features?.cellEdit?.isEditing) {
                return false;
            }

            // Embedded views from other products may be showing their own editors
            if (client.floatRoot.querySelector('.b-event-editor,.b-task-editor')) {
                return false;
            }

            /**
             * The event which the tooltip feature has been activated for.
             * @member {Scheduler.model.EventModel} eventRecord
             * @readonly
             */
            me.eventRecord = owningCalendarWidget.getEventRecord(newTarget);

            if (ownerFeature) {
                ownerFeature.activeClient = owningCalendarWidget;
                ownerFeature.eventRecord = me.eventRecord;
            }
        }

        if (me.eventRecord) {
            if (event.type === 'click') {
                // super.handleForElementOver sets this, so we must set it before calling that to ensure the correct behavior of focusOnToFront
                me.triggeredByEvent = event;

                // If the event is part of a cluster (overlaps others, and will expand)
                // and tooltip is aligned to the side, then delay the show to avoid a realign after expand.
                if (newTarget.classList.contains('b-cal-in-cluster') && (ownerFeature?.alignToDomEvent || parseAlign(me.align.align).edgeAligned === 2)) {
                    me.setTimeout({
                        fn    : 'showByEvent',
                        args  : [event, newTarget],
                        delay : 130
                    });
                }
                else {
                    // Handle products where the eventElement is passed as the "inner" instead of the wrap
                    me.showByEvent(event, newTarget.closest('[data-event-id],[data-task-id]'));
                }
                return;
            }

            await super.handleForElementOver(event, newTarget);
        }
    }

    getHtml(data) {
        const
            me              = this,
            { eventRecord } = me;

        if (eventRecord) {
            data.eventRecord = eventRecord;

            me.title = me.titleRenderer ? me.callback(me.titleRenderer, me, [eventRecord]) : '';

            return me.callback(me.renderer || me.internalRenderer, me, [{
                ...data,
                eventRecord
            }]);
        }
    }

    internalRenderer({ eventRecord, activeTarget }) {
        const
            me               = this,
            {
                clockTemplate,
                recurrenceHint
            }                = me,
            {
                allDay,
                recurrence
            }                = eventRecord,
            activeClient     = Widget.fromElement(activeTarget)?.closest(hasEventStore) || me.owner.activeView,
            dh               = activeClient?.dateHelper || DH,

            duration         = dh.formatDelta(dh.diff(eventRecord.startDate, eventRecord.endDate), allDay ? { precision : 'd' } : null),
            {
                multiDay, startDate, startText, endDate, endText
            }                = Calendar.getStartAndEndDates(
                activeClient,
                eventRecord,

                // If the activeClient is a Scheduler, use the activeContext date if available.
                // otherwise ask the activeView to convert the activeTarget into a date.
                activeClient.timelineContext?.date || activeClient.getDateFromElement(activeTarget),
                activeClient.tooltipDateFormat || me.dateFormat,
                activeClient.tooltipTimeFormat || me.timeFormat,
                me.extendAllDayEndDay);

        clockTemplate.mode = multiDay ? 'day' : 'hour';

        return (
            clockTemplate.template({
                date : startDate,
                text : startText,
                cls  : 'b-sch-tooltip-start-date'
            }) +
            (endText ? clockTemplate.template({
                date : endDate,
                text : endText,
                cls  : 'b-sch-tooltip-end-date'
            }) : '') +
            (eventRecord.isMilestone ? '' : `<div class="b-cal-tooltip-duration"><i class="b-icon b-icon-duration"></i>${duration}</div>`)

        );
    }

    showByEvent(event, element = event.target) {
        const
            me         = this,
            clickDelay = me.ownerFeature?.clickDelay;

        if (!me.eventRecord) {
            return;
        }
        me.activeTarget = element;
        me.pointerEvent = event;

        me.updateContent();

        // If we are aligning to the instigating DOM event, fix up the align spec
        if (me.ownerFeature?.alignToDomEvent) {
            // The alignTo element is checked that it refers to the current eventId
            event.target.dataset.eventId = element.dataset.eventId;
            element = {
                domEvent : event,
                anchor   : false,
                align    : 's0-e100',
                axisLock : true
            };
        }

        // Honour clickDelay so that clicks may be disambiguated from dblclicks
        if (event.type === 'click' && clickDelay) {
            if (me.hasTimeout('show')) {
                me.clearTimeout('show');
            }
            else {
                me.hoverDelay = clickDelay || 0;
                me.delayShow(element);
            }
            return;
        }
        return me.showBy(element);
    }

    afterShowByTarget() {
        const
            { delete : deleteTool } = this.tools,
            calendar                = this.ownerFeature.client;

        // Capture the active client only when we are visible.
        this.activeClient = Tooltip.fromElement(this.activeTarget)?.closest(hasEventStore);

        super.afterShowByTarget();

        // The delete tool is disabled if the Calendar or the current view is readOnly
        deleteTool && (deleteTool.disabled = calendar.isUIReadOnly);
    }

    afterHide() {
        super.afterHide(...arguments);
        this.activeClient = null;
    }

    updateActiveTarget(element, was) {
        super.updateActiveTarget?.(...arguments);
        was?.classList.remove('b-cal-event-reveal');

        if (element) {
            // The activating event element is lifted to the top of the z-index stack while
            // it is the target of the tooltip.
            if (element.classList.contains('b-cal-in-cluster') && this.revealEventsInCluster) {
                element.classList.add('b-cal-event-reveal');
            }
        }
        else {
            this.eventRecord = null;
        }
    }

    refreshContent() {
        // This method is just a buffered wrapper of updateContent.
        // We might be hidden by the time it's called.
        this.eventRecord && this.updateContent();
    }

    updateEventRecord(eventRecord) {
        const me = this;

        me._changeHook?.();
        me._changeHook = eventRecord && FunctionHelper.after(eventRecord, 'afterChange', me.refreshContent, me);
    }

    async updateContent() {
        const
            me                                      = this,
            { clockTemplate, element, eventRecord } = me,
            result                                  = super.updateContent(),
            startElement                            = element.querySelector('.b-sch-tooltip-start-date'),
            endElement                              = element.querySelector('.b-sch-tooltip-end-date'),
            { edit, delete : del }                  = me.tools,
            client                                  = me.ownerFeature?.client || me.owner.closest('calendar');

        if (eventRecord == null) {
            return;
        }

        const readOnly = client?.readOnly || client?.activeView?.readOnly || eventRecord.readOnly;

        startElement && clockTemplate.updateDateIndicator(startElement, eventRecord.startDate);
        endElement && clockTemplate.updateDateIndicator(endElement, eventRecord.endDate);

        // Hide the edit tool if the Calendar or event is readOnly or there is no editFeature or it's disabled
        edit && (edit.hidden = !client?.features.eventEdit?.enabled);

        // Hide delete tool if the Calendar or event is readOnly
        del && (del.hidden = readOnly);



        return result;
    }

    realign() {
        const { lastAlignSpec } = this;

        // If the event bar to which we were attached is recycled by another event
        // Our tenure in the current guise is over.
        if (this.isVisible && lastAlignSpec?.aligningToElement && lastAlignSpec.target.dataset.eventId !== String(this.eventRecord?.id)) {
            this.hide();
        }
        super.realign(...arguments);
    }

    updateActiveClient(activeClient) {
        this.detachListeners('clientOverflowChange');

        // We may have to hide when the active client changes its possible overflow threshold
        if (activeClient) {
            activeClient.ion({
                name                : 'clientOverflowChange',
                eventsPerCellChange : 'onClientOverflowChange',
                thisObj             : this
            });
        }
    }

    onClientOverflowChange() {
        // If that caused the target to no longer be visible, we must hide.
        // For example aligned to an event which is now in overflow.
        // Or aligned to an event in the overflow popup which has now hidden.
        if (!DomHelper.isVisible(this.lastAlignSpec.target)) {
            this.hide();
        }
    }

    onDocumentMouseDown({ domEvent }) {
        const { showOn } = this.ownerFeature;

        if ((showOn === 'click' && !domEvent.button) || (showOn === 'contextmenu' && domEvent.button === 2)) {
            // Ignore mousedown on current active target if we show on a click.
            if (this.activeTarget.contains(domEvent.target)) {
                return;
            }

            // See if gesture is on another event element
            const
                newTarget            = this.filterTarget(domEvent),
                owningCalendarWidget = newTarget && Widget.fromElement(newTarget)?.closest(hasEventStore);

            // If so, handle as a pointer over, and if we are still visible, do not hide
            // This avoids a flicker when clicking from one event to another
            if (newTarget && owningCalendarWidget?.getEventRecord(domEvent)) {
                this.handleForElementOver(domEvent, newTarget);
                if (this.isVisible) {
                    return;
                }
            }
        }
        return super.onDocumentMouseDown(...arguments);
    }


}

// Register this feature type with its Factory
EventTip.initClass();
