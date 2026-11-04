import Base from '../../Core/Base.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Calendar/feature/CalendarZone
 */

/**
 * Base class for calendar feature helper classes that track per-mode state. Each Calendar feature that needs to
 * interact differently with various view types (day, week, month, year) creates `CalendarZone` subclass instances
 * to manage the feature's behavior and DOM rendering within each specific view. A zone is bound to its owning
 * feature and to the view it manages, attaching event listeners to the view for lifecycle coordination.
 * @internal
 */
export default class CalendarZone extends Base {
    static $name = 'CalendarZone';

    static configurable = {
        /**
         * The owning feature of this zone instance.
         * @config {Calendar.feature.CalendarFeature}
         * @readonly
         */
        owner : null,

        /**
         * The associated view of this zone instance.
         * @config {CalendarView}
         * @readonly
         */
        view : {
            $config : 'nullify',

            value : null
        },

        /**
         * A listener config object to attach to this object's {@link #config-view}
         * @config {Object}
         */
        viewListeners : null
    };

    get calendar() {
        return this.owner.client;
    }

    get id() {
        const id = this.view?.id;

        return id && `${id}-${this.$$name}`;
    }

    updateView(view) {
        const
            me        = this,
            listeners = view && me.viewListeners;

        me.detachListeners('viewListeners');

        // Not all views have an overflowPopup, but if they don't then they simply will never fire the event...
        listeners && view?.ion(ObjectHelper.merge({
            thisObj : me,
            name    : 'viewListeners'
        }, listeners));
    }
}

CalendarZone.initClass();
