import Duration from '../../Core/data/Duration.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Menu from '../../Core/widget/Menu.js';
import { parseRange } from './mixin/DateRangeOwner.js';

/**
 * @module Calendar/widget/RangeMenu
 */
const
    hasEventStore = w => w?.eventStore,
    isChecked     = i => i.checked;

/**
 * A menu for selecting a time range for a Calendar mode. It presents checkable items for day, week, month,
 * year, and decade ranges, and updates the owning view's date range when the user toggles a selection.
 * The menu automatically syncs its checked state with the current view range when shown.
 *
 * This is not intended to be used directly, but is instead used internally by Calendar views such as
 * the {@link Calendar.widget.EventList} to allow users to change the displayed time span.
 *
 * It can be configured through the {@link Calendar.widget.EventList#config-listRangeMenu} config:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     modes : {
 *         list : {
 *             // Disable the range selection menu
 *             listRangeMenu : null
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.widget.EventList#config-listRangeMenu} — Config that controls this menu
 * - {@link Calendar.widget.AgendaView} — Agenda view that also uses this menu
 *
 * @extends Core/widget/Menu
 * @classtype rangemenu
 * @widget
 * @tier community
 */
export default class RangeMenu extends Menu {
    static $name = 'RangeMenu';

    static type = 'rangemenu';

    static configurable = {
        autoShow   : false,
        view       : null,
        floating   : false,
        positioned : true,
        defaults   : {
            checked : false
        },
        items : {
            listRangeDayItem : {
                range  : 'day',
                text   : 'L{EventEdit.day}',
                _unit  : 'day',
                weight : 100
            },
            listRangeWeekItem : {
                range  : 'week',
                text   : 'L{EventEdit.week}',
                _unit  : 'week',
                weight : 200
            },
            listRangeMonthItem : {
                range  : 'month',
                text   : 'L{EventEdit.month}',
                _unit  : 'month',
                weight : 300
            },
            listRangeYearItem : {
                range  : 'year',
                text   : 'L{EventEdit.year}',
                _unit  : 'year',
                weight : 400

            },
            listRangeDecadeItem : {
                range  : 'decade',
                text   : 'L{EventEdit.decade}',
                _unit  : 'decade',
                weight : 500
            }
        }
    };

    construct() {
        super.construct(...arguments);
        this.ion({
            beforeShow : 'syncRangeOptions',
            toggle     : 'syncViewRange',
            thisObj    : this
        });
    }

    syncViewRange(e) {
        if (e.checked) {
            const
                { view } = this,
                { date } = view;

            // If our view is in startDate->endDate date mode, clear the values so that
            // reconfiguring will refresh
            if (!view.range) {
                view._date = view._endDate = null;
            }
            view.setConfig({
                range : e.item.range,
                date
            });
            e.bubbles = false;
        }
    }

    syncRangeOptions() {
        const
            { view, items } = this,
            { range }       = view;

        if (range) {
            const
                { unit, magnitude } = range,
                viewDuration        = Duration.from(range),
                oldActiveItem       = items.find(isChecked);

            let activeItem = items.find(item => {
                return Duration.from(parseRange(item.range, view.dateHelper)).isStrictlyEqual(viewDuration);
            });

            // If there is an exact match between the view's range and one of the menu items, check the matching menu item.
            // This allows for any custom range (e.g. 2 weeks) to be correctly checked in the menu.
            if (activeItem) {
                activeItem.checked = true;
            }
            // If not, find our standard menu item which matches the view's range unit.
            // If there is a match, show the magnitude in the menu item text and set the menu item's
            // range to match the view's range so that clicking it will set the correct range.
            else {
                activeItem = items.find(item => item._unit === unit);
                activeItem?.setConfig({
                    checked : true,
                    range   : { unit, magnitude },
                    text    : magnitude === 1 ? StringHelper.capitalize(DateHelper.getLocalizedNameOfUnit(unit)) : DateHelper.formatDelta({ unit, magnitude })
                });
            }
            if (oldActiveItem && oldActiveItem !== activeItem) {
                oldActiveItem.checked = false;
                // If it is one of our standard items, reset the text and range to match the unit
                if (oldActiveItem._unit) {
                    oldActiveItem.setConfig({
                        range : oldActiveItem._unit,
                        text  : StringHelper.capitalize(DateHelper.getLocalizedNameOfUnit(oldActiveItem._unit))
                    });
                }
            }
        }
    }

    setupWidgetConfig(widgetConfig, type) {
        const
            view        = this.view ??= this.up(hasEventStore),
            toggleGroup = `${view.id}-range-items`;

        widgetConfig.toggleGroup = toggleGroup;
        return super.setupWidgetConfig(widgetConfig, type);
    }

    updateView(view) {
        view?.scrollable.ion({
            overflowChange : () => this.realign?.()
        });
    }
}

// Register this widget type with its Factory
RangeMenu.initClass();
