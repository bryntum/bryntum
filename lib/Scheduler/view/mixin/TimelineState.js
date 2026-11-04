import Base from '../../../Core/Base.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/view/mixin/TimelineState
 */

/**
 * An object which encapsulates a {@link Scheduler.view.Scheduler}'s saved state.
 * @typedef {GridStateInfo} TimelineStateInfo
 * @property {Number} state.barMargin
 * @property {Number} state.zoomLevel
 * @property {Object} state.zoomLevelOptions
 * @property {Date} state.zoomLevelOptions.startDate
 * @property {Date} state.zoomLevelOptions.endDate
 * @property {Date} state.zoomLevelOptions.centerDate
 * @property {Number} state.zoomLevelOptions.width
 * @category State
 */

const copyProperties = [
    'barMargin'
];

/**
 * Mixin for Timeline base that handles state. It serializes the following timeline properties:
 *
 * * barMargin
 * * zoomLevel
 *
 * See {@link Grid.view.mixin.GridState} and {@link Core.mixin.State} for more information on state.
 *
 * ## See also
 *
 * - {@link Scheduler.view.mixin.SchedulerState} - Scheduler state mixin
 * - {@link Grid.view.mixin.GridState} - Grid state mixin
 *
 * @mixin
 */
export default Target => class TimelineState extends (Target || Base) {
    static $name = 'TimelineState';

    /**
     * Gets or sets timeline's state. Check out {@link Scheduler.view.mixin.TimelineState} mixin for details.
     * @member {TimelineStateInfo} state
     */

    /**
     * Get timeline's current state for serialization. See {@link #property-state} for a list of the state variables.
     * @returns {Object} State object to be serialized
     * @private
     */
    getState() {
        const
            me    = this,
            state = ObjectHelper.copyProperties(super.getState(), me, copyProperties);

        // Not `me.zoomLevel`, which under smoothZoom returns an index into the smooth zoom chain. `zoomToLevel`,
        // which restores the state below, reads a number as a preset index. The exact tick size within the preset is
        // carried by `zoomLevelOptions.width`
        state.zoomLevel = me.presets.indexOf(me.viewPreset);

        state.zoomLevelOptions = {
            startDate  : me.startDate,
            endDate    : me.endDate,
            // With infinite scroll reading viewportCenterDate too early will lead to exception
            centerDate : !me.infiniteScroll || me.timeAxisViewModel.availableSpace ? me.viewportCenterDate : undefined,
            width      : me.tickSize
        };

        return state;
    }

    /**
     * Apply previously stored state.
     * @param {Object} state
     * @private
     */
    applyState(state) {
        const me = this;

        state = Object.assign({}, state);

        me.suspendRefresh();

        if (state.zoomLevel != null) {
            delete state.startDate;
            delete state.endDate;
            me.timeAxis.suspendEvents();
        }

        // Zoom is restored separately below
        const { zoomLevel, zoomLevelOptions } = state;
        delete state.zoomLevel;
        delete state.zoomLevelOptions;

        super.applyState(state);

        if (zoomLevel != null) {
            me.timeAxis.resumeEvents();

            me.whenVisible(() => {
                if (state?.scroll?.scrollLeft?.normal != null) {
                    zoomLevelOptions.scroll = state.scroll.scrollLeft.normal;
                }

                me.zoomToLevel(zoomLevel, zoomLevelOptions);
            });
        }

        me.resumeRefresh(true, false);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}
};
