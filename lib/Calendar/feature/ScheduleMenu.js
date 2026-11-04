import CalendarFeature from './CalendarFeature.js';
import SchedulerScheduleMenu from '../../Scheduler/feature/ScheduleMenu.js';

/**
 * @module Calendar/feature/ScheduleMenu
 */
const isCalendarMixin = w => w.isCalendarMixin;

/**
 * A feature which adds a context menu to the unoccupied parts of calendar views.
 *
 * There is one predefined {@link #config-items item} provided by default:
 *
 * - `addEvent` Adds an event at the time point indicated by the click
 *
 * If the timepoint has only date-level granularity (Such as when clicking in a MonthView or
 * AgendaView, or YearView), the start time of the event will default to the configured
 * {@link Calendar.view.Calendar#config-autoCreate}'s `startHour` property.
 *
 * If the {@link Calendar.feature.EventEdit} feature is enabled, the new event is passed for editing.
 *
 * {@inlineexample Calendar/feature/ScheduleMenu.js}
 *
 * The {@link #config-items} set can be reconfigured by providing an `items` property to this feature:
 *
 * ```javascript
 * features : {
 *     scheduleMenu : {
 *         items : {
 *             // Knocks out the predefined addEvent item
 *             addEvent : null,
 *
 *             // Add our own custom item
 *             disableDate : {
 *                  icon    : 'fa fa-calendar-times',
 *                  text    : 'Mark date unavailable',
 *
 *                  // Will look up ownership chain and find the Calendar
 *                  handler : 'up.makeDateUnavailable'
 *             }
 *         }
 *     }
 * },
 * makeDateUnavailable({ date }) {
 *     // Pass to our own app logic
 *     this.disableDate(date);
 * }
 * ```
 *
 * This feature is **enabled** by default.
 *
 * ## Useful configs
 *
 * | Config                       | Description                                                        |
 * |------------------------------|--------------------------------------------------------------------|
 * | {@link #config-items}        | Menu item definitions (add, remove, or customize)                  |
 * | {@link #config-triggerEvent} | DOM event that opens the menu (`contextmenu`, `click`, `dblclick`) |
 * | {@link #config-processItems} | Dynamically modify items before showing                            |
 *
 * ## See also
 *
 * - {@link Calendar.feature.EventMenu} — Context menu for events
 * - {@link Calendar.feature.EventEdit} — Feature for editing newly created events
 * - {@link Calendar.feature.EventCopyPaste} — Adds paste items to this menu
 *
 * @demo Calendar/custom-menus
 * @extends Scheduler/feature/ScheduleMenu
 * @classtype scheduleMenu
 * @feature
 * @tier community
 *
 * @class-alias Scheduler.feature.ScheduleMenu -> Scheduler.feature.SchedulerScheduleMenu
 */
export default class ScheduleMenu extends SchedulerScheduleMenu {

    static $name = 'ScheduleMenu';

    static tier = 'community';

    static type = 'scheduleMenu';

    static configurable = {
        // ContextMenuBase was changed to allow Menus to remain in place while target scrolls away.
        // (https://github.com/bryntum/bryntum-suite/pull/9226)
        menu : {
            scrollAction : 'realign'
        },

        /**
         * An event which is used to show schedule menu. The available values for it are
         * `contextmenu`, `click` and `dblclick`. If no value is specified, default
         * value is used from {@link Calendar/view/Calendar#config-contextMenuTriggerEvent}
         *
         * ```javascript
         * const calendar = new Calendar({
         *      features : {
         *          scheduleMenu : {
         *              triggerEvent : 'click'
         *          }
         *      }
         * });
         * ```
         *
         * @config {'contextmenu'|'click'|'dblclick'|null}
         */
        triggerEvent : null
    };

    getDataFromEvent(event) {
        const
            { client }     = this,
            { activeView } = client,
            // Calendar has a defaultCalendar property for defaulting the resource
            resourceRecord = client.resolveResourceRecord(event) || client.defaultCalendar;

        // Base class is SchedulerScheduleMenu
        if (activeView.isSchedulerBase) {
            this.client = activeView;
        }
        const result = super.getDataFromEvent(event);

        // Only inject the resourceRecord as the Calendar's detected version if the superclass didn't find one.
        // We may be hosting a Scheduler as a view which has its own opinions on this.
        if (!result.resourceRecord) {
            result.resourceRecord = resourceRecord;
        }

        this.client = client;
        return result;
    }

    shouldShowMenu({ date, targetElement }) {
        const
            { client }     = this,
            { activeView } = client;

        if (activeView.isEventList && !activeView.isAgendaView) {
            return false;
        }

        // Base class is SchedulerScheduleMenu
        if (activeView.isSchedulerBase) {
            this.client = activeView;
            const result = super.shouldShowMenu(...arguments);
            this.client = client;
            return result;
        }
        // We need a date and *not* an event element.
        return Boolean(date && !targetElement.closest(client.eventSelector));
    }

    populateScheduleMenu({ items, domEvent, date }) {
        super.populateScheduleMenu(...arguments);

        const
            { client }   = this,
            { addEvent } = items,
            view         = client.constructor.fromElement(this.menuContext.targetElement, isCalendarMixin);

        if (addEvent) {
            addEvent.disabled = this.disableAddEvent;
            addEvent.onItem = () => {
                const resourceRecord = client.activeView.getResourceRecord(domEvent);
                // We must offer the preventable beforeAutoCreate event
                if (client.activeView.trigger('beforeAutoCreate', { view, domEvent, date, resourceRecord }) !== false) {
                    // Ask the view clicked in (or the client if not inside a CalendarMixin)
                    // to create a new event. Same as the autoCreate gesture.
                    (view || client).createEvent(date, resourceRecord, true);
                }
            };
        }
        // Set the date clicked on if the view *owns* that date.
        (view && view.getDayElement?.(date, true)) && (view.date = date);
    }

    get disableAddEvent() {
        const { resourceRecord, date } = this.menuContext;
        return resourceRecord ? (resourceRecord.readOnly || (!resourceRecord.isWorkingTime(date) && this.client.project.tier === 'enterprise')) : false;
    }

    changeMenu() {
        const
            me     = this,
            result = super.changeMenu(...arguments);

        // Set the owner to be the currently active view (or its active OverflowPopup)
        // so that focus stays in that view's ownership tree.
        result?.ion({
            beforeShow({ source }) {
                const
                    { activeSubView }  = me.client,
                    { _overflowPopup } = activeSubView;

                source.owner = _overflowPopup?.containsFocus ? _overflowPopup : activeSubView;
            }
        });

        return result;
    }
}

// Register this feature type with its Factory
CalendarFeature.register(ScheduleMenu.type, ScheduleMenu, true);
