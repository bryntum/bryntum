import CalendarFeature from './CalendarFeature.js';
import SchedulerEventMenu from '../../Scheduler/feature/EventMenu.js';

/**
 * @module Calendar/feature/EventMenu
 */
const hasEventStore = w => w.eventStore;

/**
 * A feature which shows a context menu when right-clicking events in the calendar.
 *
 * There are three predefined {@link #config-items} provided by default:
 *
 * - `deleteEvent` Delete the event clicked upon.
 * - `editEvent` Edit the event clicked upon __Only present if the {@link Calendar.feature.EventEdit}
 * feature is present__ (which it is by default).
 * - `duplicate` Duplicate the event clicked upon with the same time and duration, the same
 * resource(s) assigned and a slightly edited name - `"<old name> (copy)"`.
 *
 * {@inlineexample Calendar/feature/EventMenu.js}
 *
 * The {@link #config-items} set can be reconfigured by providing an `items` property to this feature:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     features : {
 *         eventMenu : {
 *             items : {
 *                 // Removes the predefined deleteEvent item
 *                 deleteEvent : null,
 *
 *                 // Add our own custom item
 *                 postpone : {
 *                     text   : 'Postpone 1h',
 *                     weight : 300,
 *                     icon   : 'fa fa-fw fa-arrow-down',
 *                         onItem({ item, eventRecord }) {
 *                         eventRecord.shift(1, 'h');
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Items may also be reconfigured dynamically at run time:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     features : {
 *         eventMenu : {
 *             // Process items before menu is shown
 *             processItems({eventRecord, items}) {
 *                  // Push an extra item for conferences
 *                  if (eventRecord.type === 'conference') {
 *                      items.showSessionItem = {
 *                          text : 'Show sessions',
 *                          onItem({eventRecord}) {
 *                              // ...
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for secret events
 *                  if (eventRecord.type === 'secret') {
 *                      return false;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@note}The `processItems` implementation may be an `async` function which `awaits` a result to mutate the `items` object.{/@note}
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
 * - {@link Calendar.feature.ScheduleMenu} — Context menu for empty calendar areas
 * - {@link Calendar.feature.EventEdit} — Feature for editing events from the menu
 * - {@link Calendar.feature.EventCopyPaste} — Adds copy/cut/paste items to this menu
 *
 * @demo Calendar/custom-menus
 * @extends Scheduler/feature/EventMenu
 * @classtype eventMenu
 * @feature
 * @tier community
 *
 * @class-alias Scheduler.feature.EventMenu -> Scheduler.feature.SchedulerEventMenu
 */
export default class EventMenu extends SchedulerEventMenu {

    // <debug>
    // region Localization test
    static localization = [
        'L{copy}',
        'L{duplicateEvent}'
    ];
    // endregion
    // </debug>

    static $name = 'EventMenu';

    static tier = 'community';

    static type = 'eventMenu';

    static configurable = {
        // ContextMenuBase was changed to allow Menus to remain in place while target scrolls away.
        // (https://github.com/bryntum/bryntum-suite/pull/9226)
        menu : {
            scrollAction : 'realign'
        },

        /**
         * This is a preconfigured set of items used to create the default context menu. The default options are
         * listed at the top of the page.
         *
         * To remove existing items, set corresponding keys `null`:
         *
         * ```javascript
         * const calendar = new Calendar({
         *     features : {
         *         eventMenu : {
         *             items : {
         *                 deleteEvent : null,
         *                 duplicate : null
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * See the feature config in the above example for more details.
         *
         * @config {Object<String,MenuItemEntry>} items
         */
        items : {
            duplicate : {
                text   : 'L{EventMenu.duplicateEvent}',
                icon   : 'b-icon b-icon-copy',
                weight : 400,
                onItem({ eventRecord }) {
                    const
                        dupe           = eventRecord.copy(null, { skipFieldIdentifiers : true }),
                        { eventStore } = this.up(hasEventStore),
                        { resources }  = eventRecord;

                    // Make a new name
                    dupe.name = `${eventRecord.name} (${this.L('L{EventMenu.copy}')})`;
                    // In case it was a recurring event, the dupe will be a one-off.
                    dupe.recurrence = null;
                    // Dupe has same assignments initially handle usesSingleAssign as well as multiassign.
                    // If an event without a resource is duplicated
                    if (resources?.length) {
                        eventStore.assignmentStore.assignEventToResource(dupe, resources);
                    }
                    eventStore.add(dupe);
                }
            }
        },

        /**
         * An event which is used to show event menu. The available values for it are
         * `contextmenu`, `click` and `dblclick`. If no value is specified,
         * default value is used from {@link Calendar/view/Calendar#config-contextMenuTriggerEvent}
         *
         * ```javascript
         * const calendar = new Calendar({
         *      features : {
         *          eventMenu : {
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

    // Superclass registers this as a chained function.
    populateEventMenu({ items, eventRecord, assignmentRecord }) {
        super.populateEventMenu(...arguments);

        const { client } = this;

        // Hide the duplicate
        items.duplicate = {
            disabled : eventRecord.readOnly || assignmentRecord?.readOnly,
            hidden   : client.isUIReadOnly
        };
    }

    getDataFromEvent(event) {
        const
            { client }       = this,
            { activeView }   = client,
            { eventTooltip } = client.features;

        // If our show gesture clashes with the EventTooltip's, it means the developer has explicitly changed
        // the EventTooltip's showOn, and so that should "win". We back out.
        if (this.triggerEvent === 'contextmenu' && eventTooltip?.showOn === 'contextmenu' && eventTooltip.enabled) {
            event.preventDefault();
        }
        else {
            // Base class is SchedulerEventMenu
            if (activeView.isSchedulerBase) {
                this.client = activeView;
            }
            else {
                // Contextual event must be focused.
                event.target.closest('.b-cal-event-wrap')?.focus();
            }
            const result = super.getDataFromEvent(event);
            this.client = client;
            return result;
        }
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

    changeItems(items) {
        items = super.changeItems(...arguments);

        // UnassignEvent is not valid where there is no contextual resource as there is in Scheduler where
        // the row denotes the contextual resource
        items.unassignEvent = null;
        return items;
    }
}

// Register this feature type with its Factory
CalendarFeature.register(EventMenu.type, EventMenu);
