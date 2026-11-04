import Model from '../../../Core/data/Model.js';
import Store from '../../../Core/data/Store.js';
import ProjectModelCommon from './ProjectModelCommon.js';


/**
 * @module Scheduler/model/mixin/ProjectModelMixin
 */

/**
 * Mixin that holds configuration shared between projects in all Scheduler tiers.
 *
 * @mixes Scheduler/model/mixin/ProjectModelTimeZoneMixin
 * @mixes Scheduler/model/mixin/ProjectModelCommon
 *
 * @ts-extends Core.data.Model
 *
 * @mixin
 */
export default Target => class ProjectModelMixin extends (Target || Model).mixin(
    ProjectModelCommon,

) {
    static $name = 'ProjectModelMixin';

    //region Config

    static get defaultConfig() {
        return {


            eventStore      : {},
            assignmentStore : {},
            resourceStore   : {},

        };
    }

    static configurable = {

    };

    //endregion

    //region Functions

    /**
     * Accepts a "data package" consisting of data for the projects stores, which is then loaded into the stores.
     *
     * The package can hold data for `EventStore`, `AssignmentStore`, `ResourceStore`, `DependencyStore`¹,
     * `TimeRangeStore` and `ResourceTimeRangeStore`¹. It uses the same format as when creating a project with inline
     * data:
     *
     * ```javascript
     * await project.loadInlineData({
     *     events : [
     *         { id : 1, name : 'Proof-read docs', startDate : '2017-01-02', endDate : '2017-01-09' },
     *         { id : 2, name : 'Release docs', startDate : '2017-01-09', endDate : '2017-01-10' }
     *     ],
     *     resources : [
     *         { id : 1, name : 'Arcady' },
     *         { id : 2, name : 'Don' }
     *     ],
     *     dependencies : [
     *         { fromEvent : 1, toEvent : 2 }
     *     ],
     *     assignments : [
     *          { 'event' : 1, 'resource' : 1 },
     *          { 'event' : 2, 'resource' : 2 }
     *      ],
     *     resourceTimeRanges : [
     *         { id : 1, name : 'Resource range', resourceId : 1, startDate : '2017-01-08', endDate : '2017-01-10' }
     *     ],
     *     timeRanges : [
     *          { id : 1, startDate : '2017-01-26', name : 'Cool line' }
     *     ]
     * });
     * ```
     * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For
     * example `eventsData` is deprecated, use `events` instead. For now, both naming schemes are included in
     * the data object
     * {/@note}
     *
     * After populating the stores it commits the project, starting its calculations. By awaiting `loadInlineData()` you
     * can be sure that project calculations are finished.
     *
     * ¹ Not supported in the Community tier.
     *
     * @function loadInlineData
     * @param {Object} dataPackage A data package as described above
     * @async
     * @category Inline data
     */

    /**
     * Project changes (CRUD operations to records in its stores) are automatically committed on a buffer to the
     * underlying graph based calculation engine. The engine performs it calculations async.
     *
     * By calling this function, the commit happens right away. And by awaiting it you are sure that project
     * calculations are finished and that references between records are up to date.
     *
     * The returned promise is resolved with an object. If that object has `rejectedWith` set, there has been a conflict and the calculation failed.
     *
     * ```javascript
     * // Move an event in time
     * eventStore.first.shift(1);
     *
     * // Trigger calculations directly and wait for them to finish
     * const result = await project.commitAsync();
     *
     * if (result.rejectedWith) {
     *     // there was a conflict during the scheduling
     * }
     * ```
     *
     * @async
     * @function commitAsync
     * @category Common
     */

    //endregion

    //region Init

    construct(config = {}, ...args) {
        super.construct(config, ...args);

        // These stores are not handled by engine, but still held on project


    }

    afterConstruct() {
        super.afterConstruct();

        const me = this;


    }

    //endregion

    //region Attaching stores

    // Attach to a store, relaying its change events
    attachStore(store) {
        if (store) {
            store.ion({
                name    : store.$$name,
                change  : 'relayStoreChange',
                thisObj : this
            });
        }
        super.attachStore(store);
    }

    // Detach a store, stop relaying its change events
    detachStore(store) {
        if (store) {
            this.detachListeners(store.$$name);
            super.detachStore(store);
        }
    }

    relayStoreChange(event) {
        // The time zone mixin above is not part of the community tier
        super.relayStoreChange?.(event);
        /**
         * Fired when data in any of the projects stores changes.
         *
         * Basically a relayed version of each stores own change event, decorated with which store it originates from.
         * See the {@link Core.data.Store#event-change store change event} documentation for more information.
         *
         * @event change
         * @param {Scheduler.model.ProjectModel} source This project
         * @ts-param source {Scheduler.model.ProjectModel|any}
         * @param {Core.data.Store} store Affected store
         * @param {'remove'|'removeAll'|'add'|'clearchanges'|'filter'|'update'|'dataset'|'replace'} action
         * Name of action which triggered the change. May be one of:
         * * `'remove'`
         * * `'removeAll'`
         * * `'add'`
         * * `'clearchanges'`
         * * `'filter'`
         * * `'update'`
         * * `'dataset'`
         * * `'replace'`
         * @param {Core.data.Model} record Changed record, for actions that affects exactly one record (`'update'`)
         * @param {Core.data.Model[]} records Changed records, passed for all actions except `'removeAll'`
         * @param {Object} changes Passed for the `'update'` action, info on which record fields changed
         */
        return this.trigger('change', { store : event.source, ...event, source : this });
    }



    //endregion

    //region Inline data

    // Not using configurable here, we only want to relay to stores and not keep a property on ourself

    get events() {
        return this.eventStore.allRecords;
    }

    set events(events) {
        this.eventStore.data = events;
    }



    async loadInlineData(data) {
        // Flag reset in super
        this.isLoadingInlineData = true;

        // Stores not handled by engine


        return super.loadInlineData(data);
    }

    //endregion

    afterChange(toSet, wasSet, ...args) {
        super.afterChange(toSet, wasSet, ...args);

        if (wasSet.calendar) {
            this.trigger('calendarChange');
        }
    }

    doDestroy() {


        super.doDestroy();
    }
};
