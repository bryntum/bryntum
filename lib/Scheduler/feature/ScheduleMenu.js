import TimeSpanMenuBase from './base/TimeSpanMenuBase.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import SchedulerFeature from './SchedulerFeature.js';

/**
 * @module Scheduler/feature/ScheduleMenu
 */

/**
 * Displays a context menu for empty parts of the schedule. Items are populated in the first place
 * by configurations of this Feature, then by other features and/or application code.
 *
 * ### Default scheduler zone menu items
 *
 * The Scheduler menu feature provides only one item:
 *
 * | Reference              | Text         | Weight | Feature                                  | Description                                                           |
 * |------------------------|--------------|--------|------------------------------------------|-----------------------------------------------------------------------|
 * | `addEvent`             | Add event    | 100    | *This feature*                           | Add new event at the target time and resource. Hidden when read-only  |
 * | `pasteEvent`           | Paste event  | 110    | {@link Scheduler/feature/EventCopyPaste} | Paste event at the target time and resource. Hidden when is read-only |
 * | `splitSchedule`        | Split        | 200    | {@link Scheduler/feature/Split}          | Shows the "Split schedule" sub-menu                                   |
 * | \> `splitHorizontally` | Horizontally | 100    | {@link Scheduler/feature/Split}          | Split horizontally                                                    |
 * | \> `splitVertically `  | Vertically   | 200    | {@link Scheduler/feature/Split}          | Split vertically                                                      |
 * | \> `splitBoth`         | Both         | 300    | {@link Scheduler/feature/Split}          | Split both ways                                                       |
 * | `unsplitSchedule`      | Split        | 210    | {@link Scheduler/feature/Split}          | Unsplit a previously split schedule                                   |
 *
 * <dl class="foot-note">
 *     <dt>></dt><dd>first level of submenu</dd>
 * </dl>
 *
 * ### Customizing the menu items
 *
 * The menu items in the Scheduler menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * Add extra item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 extraItem : {
 *                     text : 'Extra',
 *                     icon : 'fa fa-fw fa-flag',
 *                     onItem({date, resourceRecord, items}) {
 *                         // Custom date based action
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Remove existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 addEvent : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Customize existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 addEvent : {
 *                     text : 'Create new booking'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Manipulate existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             // Process items before menu is shown
 *             processItems({date, resourceRecord, items}) {
 *                  // Add an extra item for ancient times
 *                  if (date < new Date(2018, 11, 17)) {
 *                      items.modernize = {
 *                          text : 'Modernize',
 *                          onItem({ date }) {
 *                              // Custom date based action
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for Sundays
 *                  if (date.getDay() === 0) {
 *                      return false;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * <div class="note">The `processItems` implementation my be an `async` function which `awaits` a result to
 * mutate the `items` object.</div>
 *
 * ## Video guides
 * {@frameworktabs}
 * {@js}
 * [@youtube](https://www.youtube.com/embed/dEnpeZvC4Rc)
 * {@endjs}
 * {@react}
 * [@youtube](https://www.youtube.com/embed/HAq12QUBMx8)
 * {@endreact}
 * {@vue}
 * [@youtube](https://www.youtube.com/embed/nXMaClkkKdQ)
 * {@endvue}
 * {@angular}
 * [@youtube](https://www.youtube.com/embed/0seuhWrIeXc)
 * {@endangular}
 * {@endframeworktabs}
 *
 * Full information of the menu customization can be found in the
 * ["Customizing the Event menu, the Schedule menu, and the TimeAxisHeader menu"](#Scheduler/guides/customization/contextmenu.md)
 * guide.
 *
 * This feature is **enabled** by default
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-items}                        | Menu items configuration object                     |
 * | {@link #event-scheduleMenuBeforeShow}        | Fires before menu is shown                          |
 * | {@link #event-scheduleMenuItem}              | Fires when a menu item is clicked                   |
 * | {@link #event-scheduleMenuShow}              | Fires after menu is shown                           |
 *
 * ## See also
 *
 * - {@link Scheduler.feature.EventMenu} - Event context menu
 * - {@link Scheduler.feature.ResourceMenu} - Resource context menu (vertical mode)
 * - {@link Scheduler.feature.base.TimeSpanMenuBase} - Base context menu class
 *
 * @demo Scheduler/basic
 * @extends Scheduler/feature/base/TimeSpanMenuBase
 * @classtype scheduleMenu
 * @feature
 * @tier community
 */
export default class ScheduleMenu extends TimeSpanMenuBase {
    //region Config

    static $name = 'ScheduleMenu';

    static tier = 'community';

    static type = 'scheduleMenu';
    static defaultEnabled = true;
    static configurable = {
        type : 'schedule',

        /**
         * This is a preconfigured set of items used to create the default context menu.
         *
         * The `items` provided by this feature are listed below. These are the predefined property names which you
         * may configure:
         *
         * - `addEvent` Add an event for at the resource and time indicated by the `contextmenu` event.
         *
         * To remove existing items, set corresponding keys `null`:
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     features : {
         *         scheduleMenu : {
         *             items : {
         *                 addEvent : null
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * @config {Object<String,MenuItemEntry>} items
         */
        items : null,

        /**
         * A function called before displaying the menu that allows manipulations of its items.
         * Returning `false` from this function prevents the menu being shown.
         *
         * ```javascript
         * features         : {
         *    scheduleMenu : {
         *         processItems({ items, date, resourceRecord }) {
         *            // Add or hide existing items here as needed
         *            items.myAction = {
         *                text   : 'Cool action',
         *                icon   : 'fa fa-cat',
         *                onItem : () => console.log(`Clicked on ${resourceRecord.name} at ${date}`),
         *                weight : 1000 // Move to end
         *            };
         *
         *            if (!resourceRecord.allowAdd) {
         *                items.addEvent.hidden = true;
         *            }
         *        }
         *    }
         * },
         * ```
         *
         * @config {Function}
         * @param {Object} context An object with information about the menu being shown
         * @param {Scheduler.feature.ScheduleMenu} context.feature A reference to this feature.
         * @param {Event} context.domEvent The initiating event.
         * @param {Event} context.event DEPRECATED: The initiating event.
         * @param {Number[]} context.point The client `X` and `Y` position of the initiating event.
         * @param {HTMLElement} context.targetElement The target to which the menu is being applied.
         * @param {Scheduler.model.ResourceModel} context.resourceRecord The record representing the current resource
         * @param {Date} context.date The clicked date
         * @param {Object<String,MenuItemEntry>} context.items An object containing the
         *   {@link Core.widget.MenuItem menu item} configs keyed by their id.
         * @returns {Boolean|null} Returning `false` from this function prevents the menu being shown
         * @preventable
         */
        processItems : null
    };

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.after.push('populateScheduleMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * This event fires on the owning Scheduler or Gantt widget before the context menu is shown for the schedule.
     * Allows manipulation of the items to show in the same way as in `processItems`. Returning `false` from a listener
     * prevents the menu from being shown.
     * @event scheduleMenuBeforeShow
     * @on-owner
     * @preventable
     * @param {Scheduler.view.Scheduler} source
     * @param {Object<String,MenuItemEntry>} items Menu item configs
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {Date} date Clicked date, rounded according to viewPreset's settings
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    /**
     * This event fires on the owning Scheduler or Gantt widget when an item is selected in the context menu.
     * @event scheduleMenuItem
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.MenuItem} item
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Date} date Clicked date, rounded according to viewPreset's settings
     * @param {HTMLElement} element
     */

    /**
     * This event fires on the owning Scheduler or Gantt widget after showing the context menu for the schedule.
     * @event scheduleMenuShow
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Object<String,MenuItemEntry>} items Menu item configs
     * @param {Core.widget.Menu} menu The menu
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Date} date Clicked date, rounded according to viewPreset's settings
     * @param {HTMLElement} targetElement
     */

    //endregion

    shouldShowMenu(eventParams) {
        const
            { client } = this,
            {
                targetElement,
                resourceRecord
            } = eventParams,
            isTimeAxisColumn = client.timeAxisSubGridElement.contains(targetElement);

        return !targetElement.closest(client.eventSelector) && isTimeAxisColumn && !(resourceRecord && resourceRecord.isSpecialRow);
    }

    getDataFromEvent(event) {
        // Process event if it wasn't yet processed
        if (DomHelper.isDOMEvent(event)) {
            if (event.target.closest('.b-vertical-time-axis-cell')) {
                return;
            }
            const
                { client }     = this,
                cellData       = client.getCellDataFromEvent?.(event),
                date           = client.getDateFromDomEvent?.(event, 'floor'),
                // For vertical mode the resource must be resolved from the event
                resourceRecord = client.resolveResourceRecord(event) || client.isVertical && client.resourceStore.last;

            return ObjectHelper.assign(super.getDataFromEvent(event), cellData, { date, resourceRecord });
        }

        return event;
    }

    populateScheduleMenu({ items, resourceRecord, date }) {
        const { client } = this;

        // Menu can work for ResourceHistogram which doesn't have event store
        if (!client.readOnly && client.eventStore) {
            items.addEvent = {
                text     : 'L{SchedulerBase.Add event}',
                icon     : 'b-icon b-icon-add',
                disabled : this.disableAddEvent,
                weight   : 100,
                onItem() {
                    client.createEvent(date, resourceRecord, client.getRowFor(resourceRecord));
                }
            };
        }
    }

    get disableAddEvent() {
        const { resourceRecord, date } = this.menuContext;
        return !resourceRecord || resourceRecord.readOnly || (!resourceRecord.isWorkingTime(date) && this.client.tier === 'enterprise');
    }
}

ScheduleMenu.featureClass = '';

// Inherits from ContextMenuBase, which lives in Core and is shared with the TaskBoard feature family,
// so it cannot extend SchedulerFeature. With no Factoryable in the chain `static type` does
// not self-register, so hand the class to the factory instead. See GridFeature#function-register-static.
SchedulerFeature.register(ScheduleMenu.type, ScheduleMenu);
