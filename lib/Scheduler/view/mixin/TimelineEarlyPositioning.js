import Base from '../../../Core/Base.js';
import DateHelper from '../../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/view/mixin/TimelineEarlyPositioning
 */

const
    MIN_DATE = new Date(-8640000000000000),
    MAX_DATE = new Date(8640000000000000);

/**
 * Provides functionality for early positioning of the timeline.
 *
 * @mixin
 * @internal
 */
export default Target => class TimelineEarlyPositioning extends (Target || Base) {
    static $name = 'TimelineEarlyPositioning';

    //region Row store

    applyViewStartEndDates(startDate, endDate) {
        const
            me = this,
            { visibleDate = {} }  = me,
            requestedVisibleDate   = visibleDate?.date,
            min                    = requestedVisibleDate ? DateHelper.min(startDate, requestedVisibleDate) : startDate ?? new Date(),
            max                    = requestedVisibleDate
                ? (endDate
                    ? DateHelper.max(endDate, requestedVisibleDate)
                    : DateHelper.add(min, me.visibleDateRange.endDate - me.visibleDateRange.startDate))
                : endDate;

        // if managed to calculated start/end dates
        if (min && max) {
            me.setTimeSpan(min, max, { ...visibleDate, visibleDate : requestedVisibleDate });
            return true;
        }
        else if (min) {
            me.startDate = min;
            return true;
        }
        return false;
    }

    onEventStoreDataRefresh(event) {
        if (this._initialStartDateFilled === 'pending') {
            this.tryToApplyPreCommitStartEndDates(event.source);
        }
    }

    tryToApplyPreCommitStartEndDates(eventStore) {
        const
            me = this,
            project = me.project,
            projectStartDate =
                // the start date was set as part of the model config
                project.get('startDate') ??
                // or, it was assigned from the crudmanager response,
                // in the latter case - it goes to engine first, bypassing the model's storage
                // so we need to use accessor
                (!project.replica ? project.startDate : null);

        if (projectStartDate) {
            me.applyViewStartEndDates(
                projectStartDate,
                project.get('endDate') ?? (!project.replica ? project.endDate : null)
            );

            me._initialStartDateFilled = 'applied';
        }
        else if (eventStore.count > 0) {
            let
                min     = MAX_DATE,
                max     = MIN_DATE;

            eventStore.forEach(event => {
                const
                    // bypassing the engine, for early positioning we pick the data from model
                    startDate = event.get('startDate'),
                    endDate = event.get('endDate');

                if (startDate && startDate < min) {
                    min = startDate;
                }
                if (endDate && endDate > max) {
                    max = endDate;
                }
            });

            me.applyViewStartEndDates(
                min.getTime() !== MAX_DATE.getTime() ? min : null,
                max.getTime() !== MIN_DATE.getTime() ? max : null
            );

            me._initialStartDateFilled = 'applied';
        }
    }

    bindEventStoreForEarlyPositioning(store) {
        const
            me = this,
            initialConfig = me.initialConfig;

        // start date initialization should happen prior the following line
        // me.timeAxisViewModel.store = store;
        // where the default "now" date is set
        if (
            me._initialStartDateFilled === undefined &&
            !initialConfig.startDate &&
            // `date` config is used by calendar
            !initialConfig.date &&
            !initialConfig.timeAxis?.startDate &&
            !initialConfig.visibleDate &&
            // if this timeline was given a partner, it should not "disturb" the visible daterange -
            // the partner will decide on it
            !initialConfig.partner
        ) {
            me._initialStartDateFilled = 'pending';

            me.tryToApplyPreCommitStartEndDates(store);
        }

        // Occasionally we need to track batched changes.
        // TaskResize requires this as it changes the endDate with task batched.
        me.detachListeners('eventStoreDataRefresh');

        store.ion({
            name             : 'eventStoreDataRefresh',
            // we also have `onEventStoreRefresh` in some other places - picked the different name
            // the `PreCommit` suffix is needed because PartOfProjectStore buffers all events
            // when engine is not ready, except the ones with suffix
            refreshPreCommit : 'onEventStoreDataRefresh',
            // Making sure that we should only react to the first refreshPreCommit event
            once             : true,
            thisObj          : me
        });
    }
    //endregion

    //region WidgetClass

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement this.
    get widgetClass() {}

    //endregion
};
