import DatePicker from '../../Core/widget/DatePicker.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';

DomHelper.loadStylesheet('Scheduler/widget/SchedulerDatePicker.css');

// import Stylesheet from './SchedulerDatePicker.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'SchedulerDatePicker');

/**
 * @module Scheduler/widget/SchedulerDatePicker
 */

/**
 * A subclass of {@link Core.widget.DatePicker} which is able to show the presence of
 * events in its cells if configured with an {@link #config-eventStore}, and
 * {@link #config-showEvents} is set to a truthy value.
 *
 * The `datepicker` Widget type is implemented by this class when this class is imported, or built
 * into a bundle, and so any {@link Core.widget.DateField} may have its
 * {@link Core.widget.PickerField#config-picker} configured to use its capabilities of showing
 * the presence of events in its date cells.
 *
 * {@note}This class implements its own `cellRenderer` to show event presence. If you add a `cellRenderer`
 * to a `SchedulerDatePicker`, {@link #config-showEvents} will not work as expected.{/@note}
 *
 * {@inlineexample Scheduler/widget/SchedulerDatePicker.js}
 *
 * ## See also
 *
 * - {@link Core.widget.DatePicker} - Base date picker
 * - {@link Scheduler.data.EventStore} - Event store for event presence
 * - {@link Core.widget.DateField} - Date field using this picker
 *
 * @extends Core/widget/DatePicker
 * @classtype datepicker
 * @tier community
 * @widget
 */
export default class SchedulerDatePicker extends DatePicker {
    static $name = 'SchedulerDatePicker';

    static type = 'datepicker';

    static configurable = {
        /**
         * How to show presence of events in the configured {@link #config-eventStore} in the
         * day cells. Values may be:
         *
         * * `false` - Do not show events in cells.
         * * `true` - Show a themeable bullet to indicate the presence of events for a date.
         * * `'count'` - Show a themeable badge containing the event count for a date.
         * * `'heatmap'` - show warmer background colors the more events are present for a date
         * @config {Boolean|'count'|'heatmap'}
         * @default false
         */
        showEvents : null,

        /**
         * The {@link Scheduler.data.EventStore event store} from which the in-cell event presence
         * indicators are drawn.
         * @config {Scheduler.data.EventStore}
         */
        eventStore : null,

        /**
         * A function, or the name of a function in the ownership hierarchy to filter which events
         * are collected into the day cell data blocks.
         *
         * Return `true` to include the passed event, or a *falsy* value to exclude the event.
         *
         * @config {Function|String}
         * @param {Scheduler.model.EventModel} event Event for filtering
         * @returns {Boolean} Return `true` to include the passed event
         */
        eventFilter : {
            $config : 'lazy',
            value   : null
        }
    };

    changeEventFilter(eventFilter) {
        if (typeof eventFilter === 'string') {
            const { handler, thisObj } = this.resolveCallback(eventFilter);
            eventFilter = handler.bind(thisObj);
        }
        return eventFilter;
    }

    doRefresh(...args) {
        // Hidden widgets must not query the EventStore for loading on demand to be able to use
        // the EventStore's dateRangeRequested event.
        if (this.isVisible || !this.showEvents) {
            this.refreshEventsMap();
            return super.doRefresh(...args);
        }
        this.whenVisible('doRefresh');
    }

    updateShowEvents(showEvents, oldShowEvents) {
        const
            me            = this,
            { classList } = me.weeksElement;

        let { eventStore } = me;

        // Begin any animations in the next AF
        me.requestAnimationFrame(() => {
            me.toggleCls('b-date-picker-with-events', Boolean(showEvents));
            me.owner?.toggleCls('b-date-picker-with-events', Boolean(showEvents));
            showEvents && classList.add(`b-show-events-${showEvents}`);
            classList.remove(`b-show-events-${oldShowEvents}`);
        });

        if (showEvents) {
            if (!eventStore) {
                const eventStoreOwner = me.up(w => w.eventStore);

                if (eventStoreOwner) {
                    me._eventStore = eventStore = eventStoreOwner.eventStore;
                }
                else {
                    throw new Error('DatePicker configured with events but no eventStore');
                }
            }
        }
        else {
            me.cellMap = null;
        }
        if (!me.isConfiguring) {
            me.updateEventStore(eventStore);
            me.doRefresh();
        }
    }

    refreshEventsMap() {
        const me = this;

        if (me.showEvents) {
            me.cellMap = me.eventStore.getEventCounts({
                startDate : me.startDate,
                endDate   : me.endDate,
                dateMap   : me.cellMap,
                filter    : me.eventFilter
            });
        }
    }

    updateEventStore(eventStore) {
        // Add a listener to refresh on any event change unless the listener is already added.
        if (eventStore.findListener('change', 'refresh', this) === -1) {
            eventStore?.[this.showEvents ? 'on' : 'un']?.({
                change  : 'refresh',
                thisObj : this
            });
        }
    }

    cellRenderer(renderData) {
        // Call the DatePicker's cellRenderer first to set up basic structure which will include
        // the cellPayload element which we will use to show event presence.
        super.cellRenderer?.(renderData);
        if (this.isConfiguring) {
            return;
        }
        const
            { showEvents } = this,
            {
                cell,
                innerCell,
                date,
                cellPayload
            }              = renderData,
            cellData       = this.cellMap?.get?.(DateHelper.makeKey(date)),
            count          = Array.isArray(cellData) ? cellData.length : cellData || 0,
            isCount        = showEvents === 'count',
            hasContent     = Boolean(isCount || showEvents === true),
            domConfig      = {
                class : {
                    'b-date-picker-cell-payload' : true,
                    'b-cell-events-badge'        : isCount && count,
                    'b-icon'                     : showEvents === true,
                    'b-icon-circle'              : showEvents === true && count
                },
                dataset : {
                    count : count
                }
            };

        cell.classList.toggle(isCount ? 'b-has-badge' : 'b-has-bullet', Boolean(count && hasContent));
        if (!isCount && this.eventCountTip) {
            cell.dataset.btip = this.L('L{ResourceInfoColumn.eventCountText}', count);
        }
        else {
            delete cell.dataset.btip;
        }
        if (showEvents === 'heatmap') {
            domConfig.html = '';
        }
        else {
            domConfig.text = isCount && count ? count : '';
        }
        (innerCell.dataset ??= {}).eventCount = count;
        innerCell.style.setProperty('--bi-event-count', count);
        DomSync.sync({
            targetElement : cellPayload,
            domConfig
        });
    }

    static setupClass(meta) {
        // We take over the type name 'datepicker' when we are in the app
        meta.replaceType = true;

        super.setupClass(meta);
    }
}

// Register this widget type with its Factory
SchedulerDatePicker.initClass();
