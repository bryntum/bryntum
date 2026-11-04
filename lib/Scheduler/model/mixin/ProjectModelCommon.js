import Model from '../../../Core/data/Model.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import VersionHelper from '../../../Core/helper/VersionHelper.js';
// The tier aliases below are what register the plain 'eventStore', 'resourceStore', 'assignmentStore' and
// 'dependencyStore' factory types (the tier variants only register their suffixed types). Projects create stores
// from configs with those type names, so load the aliases here where every project variant passes through.
import '../../data/EventStore.js';
import '../../data/ResourceStore.js';
import '../../data/AssignmentStore.js';
import '../../data/DependencyStore.js';

/**
 * @module Scheduler/model/mixin/ProjectModelCommon
 */

/**
 * Mixin that provides helpful methods and properties for a `ProjectModel`. This mixin applies to all Bryntum products.
 * @mixin
 */
export default Target => class ProjectModelCommon extends (Target || Model) {
    static $name = 'ProjectModelCommon';

    static configurable = {
        /**
         * Project data as a JSON string, used to populate its stores.
         *
         * ```javascript
         * const project = new ProjectModel({
         *     json : '{"events":[...],"resources":[...],...}'
         * }
         * ```
         *
         * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For
         * example `eventsData` is deprecated, use `events` instead. For now, both naming schemes are included in
         * the data object
         * {/@note}
         *
         * @config {String}
         * @category Inline data
         */
        json : null,

        /**
         * Experimental hook that lets the app determine if a bound dataset needs syncing with the store or not, and
         * if it does - which records that should be processed. Only called for stores that are configured with
         * `syncDataOnLoad: true` (which is the default in the React, Angular and Vue wrappers).
         *
         * {@note}This is an experimental API that might change in any release until it has been finalized.{/@note}
         *
         * The main use case for this is for frameworks that update all state on any state change (like React), to
         * not have to reapply the full bound dataset each time (which becomes costly).
         *
         * If the app has a cheap way of determining (for example using a timestamp) that the dataset has no
         * changes, return `false` from this hook to prevent the store from syncing at all at that time.
         *
         * ```javascript
         * shouldSyncDataOnLoad({ store, data }) {
         *   if (store === myEventStore && timestamp <= lastUpdateTimestamp) {
         *     // Prevent sync when the event store has not changed since last time
         *     // (pseudocode)
         *     return false;
         *   }
         * }
         * ```
         *
         * If the app knows that something has changed, return a `Set` with ids for the records that should be
         * further processed by the sync logic.
         *
         * ```javascript
         * shouldSyncDataOnLoad({ store, data }) {
         *   if (store === myEventStore && timestamp > lastUpdateTimestamp) {
         *     // Sync only these records (pseudocode)
         *     return new Set([6, 110, 586]);
         *   }
         * }
         * ```
         *
         * @prp {Function}
         * @param {Object} options Options passed by the store to this hook
         * @param {Core.data.Store} options.store Store about to be synced
         * @param {Core.data.Model} options.records Records currently in the store
         * @param {Object[]} options.data Incoming data
         * @returns {Set|Boolean} Return `false` to prevent the store from syncing, or a set of
         * record ids that need further processing (for records that has some kind of change, eg. an update, removal
         * or addition)
         * @advanced
         * @category Advanced
         */
        shouldSyncDataOnLoad : null,

        /**
         * Specifies the output format of {@link #function-toJSON}.
         *
         * - `inlineData` - Return all crud store data, plus this project fields (under the `project` key). For example:
         * ```json
         * {
         *     "project" : {
         *         "startDate"    : "2024-03-22",
         *         "endDate"      : "2024-04-22",
         *         "hoursPerDay"  : 8,
         *         "daysPerWeek"  : 5,
         *         "daysPerMonth" : 20
         *     },
         *     "events"             : [...],
         *     "resources"          : [...],
         *     "assignments"        : [...],
         *     "dependencies"       : [...],
         *     "resourceTimeRanges" : [...],
         *     "timeRanges"         : [...]
         * }
         * ```
         * - `model` - Return only the project fields. For example:
         * ```json
         * {
         *     "startDate"    : "2024-03-22",
         *     "endDate"      : "2024-04-22",
         *     "hoursPerDay"  : 8,
         *     "daysPerWeek"  : 5,
         *     "daysPerMonth" : 20
         * }
         * ```
         *
         * @config {'inlineData'|'model'}
         * @category Inline data
         */
        toJSONResultFormat : 'inlineData',

        /**
         * By default, the stores of a project use the raw data objects passed to them as the data source for their
         * records if data is loaded remotely (using an `AjaxStore` or a `CrudManager`). For data supplied inline,
         * the data objects are instead by default cloned to avoid the original data object being modified by the
         * store.
         *
         * See {@link Core.data.Store#config-useRawData} for more information on the mechanics of this.
         *
         * This can be explicitly controlled per store by setting the `useRawData` config on the store:
         *
         * ```javascript
         * // Opt in for a single store
         * const project = new ProjectModel({
         *     eventStore : {
         *       useRawData : true
         *     },
         *     ...
         * });
         * ```
         *
         * Or you can control it for all the default stores in the project by setting this config on the project:
         *
         * ```javascript
         * // Opt in for all stores in the project
         * const project = new ProjectModel({
         *    useRawData : true,
         *    ...
         * });
         * ```
         *
         * @config {Boolean}
         * @category Common
         */
        useRawData : null,

        /**
         * Whether to include legacy data properties in the JSON / inlineData output. The legacy data properties are
         * the `xxData` (`eventsData`, `resourcesData` etc.) properties that are deprecated and will be removed in
         * the future.
         * @prp {Boolean}
         * @category Legacy inline data
         * @deprecated 6.3.0 This config will be removed when the eventsData, resourcesData etc. properties are
         * removed in a future release.
         */
        includeLegacyDataProperties : true
    };

    // Project is a Model which triggers events, therefore it can define event handlers using `onEvent` syntax. Event
    // handler can be a string (for another instance property), or a function. Therefore, it is impossible to tell them
    // apart and project model can not expose fields.
    // https://github.com/bryntum/bryntum/issues/7457
    static get autoExposeFields() {
        return false;
    }

    construct(config, ...args) {
        this.dataPropertyDeprecation(config || {});

        super.construct(config, ...args);
    }

    dataPropertyDeprecation(config) {
        if (!this.dataPropertyDeprecationShown) {
            let shown = false;

            if (config.eventsData) {
                VersionHelper.deprecate('9.0.0', '"eventsData" is deprecated, use "events" instead');
                shown = true;
            }

            if (config.tasksData) {
                VersionHelper.deprecate('9.0.0', '"tasksData" is deprecated, use "tasks" instead');
                shown = true;
            }

            if (config.dependenciesData) {
                VersionHelper.deprecate('9.0.0', '"dependenciesData" is deprecated, use "dependencies" instead');
                shown = true;
            }

            if (config.resourcesData) {
                VersionHelper.deprecate('9.0.0', '"resourcesData" is deprecated, use "resources" instead');
                shown = true;
            }

            if (config.assignmentsData) {
                VersionHelper.deprecate('9.0.0', '"assignmentsData" is deprecated, use "assignments" instead');
                shown = true;
            }

            if (config.calendarsData) {
                VersionHelper.deprecate('9.0.0', '"calendarsData" is deprecated, use "calendars" instead');
                shown = true;
            }



            this.dataPropertyDeprecationShown = shown;
        }
    }

    attachStore(store) {
        super.attachStore(store);

        if (this.useRawData != null) {
            store.useRawData = this.useRawData;
        }
    }

    //region Inline data

    /**
     * Returns the data from the records of the projects stores, in a format that can be consumed by
     * `loadInlineData()`.
     *
     * Used by JSON.stringify to correctly convert this record to json.
     *
     * The output format is determined by the value of
     * {@link #config-toJSONResultFormat}, as follows:
     *
     * - `inlineData` - Returns all crud store data, plus the project fields (under the `project` key)
     * - `model` - Returns only the project fields
     *
     * ```javascript
     * const project = new ProjectModel({
     *     // Include both store data and project model fields in toJSON() result
     *     toJSONResultFormat     : 'inlineData',
     *     events             : [...],
     *     resources          : [...],
     *     assignments        : [...],
     *     dependencies       : [...],
     *     resourceTimeRanges : [...],
     *     timeRanges         : [...]
     * });
     *
     * const json = project.toJSON();
     *
     * // json:
     * {
     *     events             : [...],
     *     resources          : [...],
     *     assignments        : [...],
     *     dependencies       : [...],
     *     ...
     *     project                : {
     *         addConstraintOnDateSet : false,
     *         daysPerMonth           : 13
     *         daysPerWeek            : 3
     *         ...
     *     },
     *     ...
     * }
     * ```
     *
     * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For
     * example `eventsData` is deprecated, use `events` instead. For now, both naming schemes are included in
     * the data object
     * {/@note}
     *
     * Output can be consumed by `loadInlineData()`:
     *
     * ```javascript
     * const json = project.toJSON();
     *
     * // Plug it back in later
     * project.loadInlineData(json);
     * ```
     *
     * @returns {Object}
     * @category Inline data
     */
    toJSON() {
        switch (this.toJSONResultFormat) {
            // Project data including its own fields and all related stores data as a
            // combination of crud manager and model APIs
            // { project : { ... }, events : [...], resources : [...], storeId1 : [...] }
            case 'inlineData':
                return this.inlineData;

            // Project fields only
            case 'model':
                return super.toJSON();
        }
    }

    /**
     * Get or set data of project stores. The returned data is identical to what {@link #function-toJSON} returns:
     *
     * ```javascript
     * const data = scheduler.project.inlineData;
     *
     * // data:
     * {
     *     project            : { ... },
     *     events             : [...],
     *     resources          : [...],
     *     dependencies       : [...],
     *     assignments        : [...],
     *     resourceTimeRanges : [...],
     *     timeRanges         : [...]
     * }
     *
     *
     * // Plug it back in later
     * scheduler.project.inlineData = data;
     * ```
     *
     * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For example
     * `eventsData` is deprecated, use `events` instead. For now, both naming schemes are included in the data object.
     * {/@note}
     *
     * To stop including the legacy data properties, set {@link #config-includeLegacyDataProperties} to `false`.
     *
     * @member {Object}
     * @category Inline data
     */
    get inlineData() {
        const me = this;

        let result;

        // If project has crud manager API mixed in - use it
        if (me.isAbstractCrudManagerMixin) {
            result = me.crudStoresJSON;
        }
        else {
            const
                events             = me.eventStore.toJSON(),
                resources          = me.resourceStore.toJSON(),
                dependencies       = me.dependencyStore.toJSON(),

                assignments        = me.assignmentStore.toJSON();

            result = {
                events,
                resources,
                dependencies,

                assignments
            };

            if (me.includeLegacyDataProperties) {
                // DEPRECATED
                Object.assign(result, {
                    eventsData             : events,
                    resourcesData          : resources,
                    dependenciesData       : dependencies,

                    assignmentsData        : assignments
                });
            }
        }

        if (me.eventStore.usesSingleAssignment && result.assignments) {
            delete result.assignmentsData;
            delete result.assignments;
        }

        // project fields
        result.project = super.toJSON();
        // project "id" is not needed really
        ObjectHelper.deletePath(result, 'project.id');
        ObjectHelper.deletePath(result, 'project.children');

        return result;
    }

    set inlineData(inlineData) {
        this.loadInlineData(inlineData);
    }

    /**
     * Get or set project data (records from its stores) as a JSON string.
     *
     * Get a JSON string:
     *
     * ```javascript
     * const project = new ProjectModel({
     *     events       : [...],
     *     resources    : [...],
     *     assignments  : [...],
     *     dependencies : [...]
     * });
     *
     * const jsonString = project.json;
     *
     * // jsonString:
     * '{"events":[...],"resources":[...],...}'
     * ```
     *
     * Set a JSON string (to populate the project stores):
     *
     * ```javascript
     * project.json = '{"events":[...],"resources":[...],...}'
     * ```
     *
     * {@note}The `xxData` properties are deprecated and will be removed in the future. Use `xx` instead. For example
     * `eventsData` is deprecated, use `events` instead. For now, both naming schemes are included in the data object
     * {/@note}
     *
     * @member {String}
     * @category Inline data
     */
    get json() {
        // remember toJSONResultFormat value
        const { toJSONResultFormat } = this;

        // we need toJSON() to use inlineData format
        this.toJSONResultFormat = 'inlineData';

        const result = super.json;

        // restore format
        this.toJSONResultFormat = toJSONResultFormat;

        return result;
    }

    changeJson(json) {
        if (typeof json === 'string') {
            json = StringHelper.safeJsonParse(json);
        }

        return json;
    }

    updateJson(json) {
        json && this.loadInlineData(json);
    }

    // Not using configurable here, we only want to relay to stores and not keep a property on ourself

    get assignments() {
        return this.assignmentStore.allRecords;
    }

    set assignments(assignments) {
        this.assignmentStore.data = assignments;
    }

    get dependencies() {
        return this.dependencyStore.allRecords;
    }

    set dependencies(dependencies) {
        this.dependencyStore.data = dependencies;
    }

    get resources() {
        return this.resourceStore.allRecords;
    }

    set resources(resources) {
        this.resourceStore.data = resources;
    }



    //endregion
};
