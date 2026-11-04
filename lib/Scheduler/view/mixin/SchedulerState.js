import Base from '../../../Core/Base.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/view/mixin/SchedulerState
 */

/**
 * An object which encapsulates a {@link Scheduler.view.Scheduler}'s saved state.
 * @typedef {GridStateInfo} SchedulerStateInfo
 * @property {Date} state.startDate
 * @property {Date} state.endDate
 * @property {String} state.eventLayout
 * @property {String} state.eventStyle
 * @property {String} state.eventColor
 * @property {Number} state.barMargin
 * @property {Number} state.tickSize
 * @property {Boolean} state.fillTicks
 * @property {Number} state.zoomLevel
 * @property {SchedulerModeValue} state.mode
 * @property {Boolean} state.readOnly
 * @property {String} state.style
 */

const copyProperties = [
    'startDate',
    'endDate',
    'eventLayout',
    'barMargin',
    'mode',
    'tickSize',
    'eventColor',
    'eventStyle',
    'fillTicks'
];

/**
 * A Mixin for Scheduler that handles state. It serializes the following scheduler properties, in addition to what
 * is already stored by its superclass {@link Grid/view/mixin/GridState}:
 *
 * * startDate
 * * endDate
 * * eventLayout
 * * barMargin
 * * mode
 * * tickSize
 * * zoomLevel
 * * eventColor
 * * eventStyle
 * * fillTicks
 *
 * See {@link Grid.view.mixin.GridState} and {@link Core.mixin.State} for more information on state.
 *
 * ```javascript
 * // Save state
 * const state = scheduler.state;
 * localStorage.setItem('schedulerState', JSON.stringify(state));
 *
 * // Restore state
 * scheduler.state = JSON.parse(localStorage.getItem('schedulerState'));
 * ```
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.TimelineState} - Timeline state mixin
 * - {@link Grid.view.mixin.GridState} - Grid state mixin
 * - {@link Core.mixin.State} - Base state mixin
 *
 * @mixin
 */
export default Target => class SchedulerState extends (Target || Base) {
    static $name = 'SchedulerState';

    // region events

    /**
     * Fired before state is saved by the StateProvider. Allows editing the state object or preventing the operation.
     * @event beforeStateSave
     * @preventable
     * @param {SchedulerStateInfo} state State object config
     */

    /**
     * Fired before state is applied to the source. Allows editing the state object or preventing the operation.
     * @event beforeStateApply
     * @preventable
     * @param {SchedulerStateInfo} state State object config
     */

    // endregion

    static configurable = {
        statefulEvents : ['dateRangeChange']
    };

    /**
     * Gets or sets scheduler's state. Check out {@link Scheduler.view.mixin.SchedulerState} mixin
     * and {@link Grid.view.mixin.GridState} for more details.
     * @member {Object} state
     * @category State
     * @ts-returns {SchedulerStateInfo}
     */

    updateEventStore(store, was) {
        super.updateEventStore?.(store, was);

        this.detachListeners('stateEventStoreListeners');

        store?.ion({
            name    : 'stateEventStoreListeners',
            filter  : 'triggerUpdate',
            thisObj : this
        });
    }

    /**
     * Get scheduler's current state for serialization. State includes rowHeight, headerHeight, readOnly, selectedCell,
     * selectedRecordId, column states and store state etc. It also collects state from all features.
     * @returns {Object} State object to be serialized
     * @private
     */
    getState() {
        const
            me    = this,
            state = ObjectHelper.copyProperties(super.getState(), me, copyProperties);

        state.eventStore = me.eventStore.state;

        // Merge columns detached by vertical-mode toggle back into state so it round-trips across modes.
        // These are Column instances when toggled at runtime, but raw config objects when the scheduler started in
        // vertical mode
        if (me.isVertical && me._horizontalLockedColumns?.length > 0 && state.columns) {
            state.columns = [
                ...me._horizontalLockedColumns.map(column => column.getState?.() ?? column),
                ...state.columns
            ];
        }

        return state;
    }

    /**
     * Apply previously stored state.
     * @param {Object} state
     * @private
     */
    applyState(state) {
        state = { ...state };

        this.suspendRefresh();

        if (state?.eventLayout === 'layoutFn') {
            delete state.eventLayout;
        }

        // Zoom level will set tick size, no need to update model additionally
        if (state?.zoomLevelOptions?.width) {
            delete state.tickSize;
        }

        if ('eventStore' in state) {
            this.eventStore.state = state.eventStore;
            delete state.eventStore;
        }

        super.applyState(state);

        this.resumeRefresh(true, false);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
