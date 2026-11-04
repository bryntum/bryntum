import EventRenderer from './mixin/EventRenderer.js';
import SchedulerDatePicker from '../../Scheduler/widget/SchedulerDatePicker.js';
import DomSync from '../../Core/helper/DomSync.js';

/**
 * @module Calendar/widget/CalendarDatePicker
 */

const emptyString = new String(); // Need a truthy string here, so use the Object form.

/**
 * A subclass of {@link Core.widget.DatePicker} which is able to show the presence of
 * events in its cells if contained in a Calendar, and {@link #config-showEvents} is set
 * to a truthy value.
 *
 * The `datepicker` Widget type is implemented by this class when this class is imported, or built
 * into a bundle, and so any {@link Core.widget.DateField} may have its
 * {@link Core.widget.PickerField#config-picker} configured to use its capabilities of showing
 * the presence of events in its date cells.
 *
 * {@note}This class implements its own `cellRenderer` to show event presence. If you add a `cellRenderer`
 * to a `DatePicker`, {@link #config-showEvents} will not work as expected.{/@note}
 *
 * The CalendarDatePicker is typically configured through the Calendar's {@link Calendar.view.Calendar#config-sidebar}:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     sidebar : {
 *         items : {
 *             datePicker : {
 *                 showEvents : 'dots',
 *                 eventDots  : {
 *                     max : 3
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## Useful configs
 *
 * | Config                        | Description                                                               |
 * |-------------------------------|---------------------------------------------------------------------------|
 * | {@link #config-showEvents}    | How to indicate event presence (`true`, `'count'`, `'dots'`, `'heatmap'`) |
 * | {@link #config-eventDots}     | Layout options for dot indicators (max, size, gap, stripe)                |
 * | {@link #config-eventCountTip} | Show event count tooltip on hover                                         |
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar#config-sidebar} — Sidebar that contains this picker
 * - {@link Calendar.widget.Sidebar} — The sidebar widget
 * - {@link Calendar.widget.MonthAgendaView} — Subclass that extends this picker into a full view
 *
 * @extends Scheduler/widget/SchedulerDatePicker
 * @mixes Calendar/widget/mixin/EventRenderer
 * @classtype datepicker
 * @tier community
 * @widget
 */
export default class CalendarDatePicker extends SchedulerDatePicker.mixin(EventRenderer) {
    static $name = 'CalendarDatePicker';

    // Factoryable type name
    static type = 'datepicker';

    static configurable = {
        /**
         * How to show presence of events in the configured {@link #config-eventStore} in the
         * day cells. Values may be:
         *
         * * `false` - Do not show events in cells.
         * * `true` - Show a themeable bullet to indicate the presence of events for a date.
         * * `'count'` - Show a themeable badge containing the event count for a date.
         * * `'dots'` - Show small event-coloured bullets up to a maximum of `{@link #config-eventDots}.max`
         *   to indicate event presence.
         * * `'heatmap'` - show warmer background colors the more events are present for a date
         * @prp {Boolean|'count'|'dots'|'heatmap'}
         * @default false
         */
        showEvents : null,

        /**
         * When {@link #config-showEvents} is `'dots'`, this controls the layout of the dots
         * below the day number.
         *
         * If the `max` property is 1, the dots will be coloured using the default event colour,
         * *not* the colour of the event. This is to create a consistent appearance.
         *
         * @prp {Object}
         * @property {Number} marginTop The margin above the dots. Default is -5 which embeds
         * the dots into the bottom of the cell.
         * @property {Number} max The maximum number of dots to show. Default is 4.
         * @property {Number} gap The gap between dots. Default is 3.
         * @property {Number} size The size of the dots. Default is 5.
         * @property {Boolean} stripe If `true`, the dots will be striped, meaning they will be
         * joined together with _no gap_ between them and rounded at each end. Default is `false`.
         */
        eventDots : {
            marginTop : -5,
            max       : 4,
            gap       : 3,
            size      : 5
        },

        /**
         * When {@link #config-showEvents} is __not__ `'count'`, setting this to
         * `true` means that a tooltip containing the event count will be shown on hover of
         * a day cell.
         *
         * @prp {Boolean}
         * @default
         */
        eventCountTip : null,

        alwaysRefreshOnMonthChange : true
    };

    construct(config) {
        const calendar = this.calendar = (config.owner || config.parent)?.up('calendar', true);

        if (calendar && !config.eventStore) {
            config.eventStore = calendar.eventStore;
        }

        super.construct(...arguments);
    }

    changeEventDots(eventDots) {
        const me = this;
        return new Proxy(eventDots, {
            set(target) {
                const result = Reflect.set(...arguments);
                me.updateEventDots(target);
                return result;
            }
        });
    }

    updateEventDots({ marginTop, gap, size, stripe }) {
        const { style, classList } = this.weeksElement;

        style.setProperty('--bi-event-count-margin-top', marginTop ? `${marginTop}px` : '');
        style.setProperty('--bi-event-count-dot-size', size ? `${size}px` : '');
        style.setProperty('--bi-event-count-dot-gap', gap ? `${gap}px` : '');
        classList[stripe ? 'add' : 'remove']('b-event-count-dots-striped');
        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    refreshEventsMap() {
        const
            me          = this,

            // Event order should match that seen in active view unless configured otherwise.
            // Colours of dots should match those seen in active view by default.
            eventSorter = me.eventSorter || me.calendar?.activeView?.eventSorter;

        if (me.showEvents) {
            me.cellMap = me.eventStore[me.showEvents === 'dots' ? 'getEvents' : 'getEventCounts']({
                startDate : me.startDate,
                endDate   : me.endDate,
                dateMap   : me.cellMap || (me.cellMap = new Map()),
                filter    : me.eventFilter
            });
            // Sort the events in the cells
            if (me.showEvents === 'dots' && eventSorter) {
                for (const eventInfo of me.cellMap.values()) {
                    eventInfo.sort(eventSorter);
                }
            }
        }
    }

    cellRenderer(renderData) {
        // Call the SchedulerDatePicker cellRenderer first to set up basic structure
        // That handles 'count' and 'heatmap' modes.
        // We will add to that for 'dots' mode.
        super.cellRenderer(renderData);
        if (this.isConfiguring) {
            return;
        }

        const
            me        = this,
            {
                // The day cells live in `cellDateHelper`'s frame (machine-local for the standalone picker), and the
                // event cellMap is keyed by the same day labels. `me.dh` would re-interpret a cell's instant in the
                // view timezone and mis-key the lookup/label by a day near a tz boundary.
                cellDateHelper : dh,
                showEvents
            }         = me,
            {
                cell,
                date,
                cellPayload
            }         = renderData,
            eventInfo = me.cellMap?.get?.(dh.makeKey(date)),
            count     = eventInfo?.length;

        cell.classList.toggle('b-has-events', Boolean(count && showEvents === 'dots'));
        cell.setAttribute('aria-label', `${dh.format(date, 'dddd MMMM Do YYYY')}${showEvents ? `, ${me.L('L{ResourceInfoColumn.eventCountText}', count || 0)}` : ''}.`);
        cellPayload.classList.toggle('b-cal-minimal-event-container', showEvents === 'dots');

        if (me.showEvents === 'dots') {
            const
                { max }  = me.eventDots,
                children = [];

            for (let i = 0; i < Math.min(count || 0, max); i++) {
                // If there's only one dot, make it use the default colour
                // By passing an empty string as the color, the EventRenderer will use the default colour
                const eventDomConfig = me.createEventDomConfig({
                    date,
                    eventRecord : eventInfo[i],

                    // If we only show one dot, we don't want to show whatever
                    // the event colour is, we want to show the default dot colour.
                    eventColor : max > 1 ? null : emptyString,

                    // renders without content with just background colour
                    minimal : true
                });
                children.push(eventDomConfig);
            }

            DomSync.sync({
                domConfig : {
                    children,
                    onlyChildren : true
                },
                targetElement : cellPayload
            });
        }
    }

    static setupClass(meta) {
        // We take over the type name 'datepicker' when we are in the app
        meta.replaceType = true;

        super.setupClass(meta);
    }
}

CalendarDatePicker.initClass();
