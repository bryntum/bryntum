import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import Model from '../../../Core/data/Model.js';

/**
 * @module Scheduler/data/mixin/DependencyStoreMixin
 */

/**
 * This is a mixin, containing functionality related to managing dependencies.
 *
 * It is consumed by the regular {@link Scheduler.data.DependencyStore} and {@link
 * Scheduler.data.DependencyStoreEnterprise}
 *
 * @mixin
 * @tier community
 */
export default Target => class DependencyStoreMixin extends Target {
    static $name = 'DependencyStoreMixin';

    /**
     * Add dependencies to the store.
     *
     * NOTE: References (fromEvent, toEvent) on the dependencies are determined async by a calculation engine. Thus they
     * cannot be directly accessed after using this function.
     *
     * For example:
     *
     * ```javascript
     * const [dependency] = dependencyStore.add({ from, to });
     * // dependency.fromEvent is not yet available
     * ```
     *
     * To guarantee references are set up, wait for calculations for finish:
     *
     * ```javascript
     * const [dependency] = dependencyStore.add({ from, to });
     * await dependencyStore.project.commitAsync();
     * // dependency.fromEvent is available (assuming EventStore is loaded and so on)
     * ```
     *
     * Alternatively use `addAsync()` instead:
     *
     * ```javascript
     * const [dependency] = await dependencyStore.addAsync({ from, to });
     * // dependency.fromEvent is available (assuming EventStore is loaded and so on)
     * ```
     *
     * @param {Scheduler.model.DependencyModel|Scheduler.model.DependencyModel[]|DependencyModelConfig|DependencyModelConfig[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.DependencyModel[]} Added records
     * @function add
     * @category CRUD
     */

    /**
     * Add dependencies to the store and triggers calculations directly after. Await this function to have up to date
     * references on the added dependencies.
     *
     * ```javascript
     * const [dependency] = await dependencyStore.addAsync({ from, to });
     * // dependency.fromEvent is available (assuming EventStore is loaded and so on)
     * ```
     *
     * @param {Scheduler.model.DependencyModel|Scheduler.model.DependencyModel[]|DependencyModelConfig|DependencyModelConfig[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.DependencyModel[]} Added records
     * @function addAsync
     * @category CRUD
     * @async
     */

    /**
     * Applies a new dataset to the DependencyStore. Use it to plug externally fetched data into the store.
     *
     * NOTE: References (fromEvent, toEvent) on the dependencies are determined async by a calculation engine. Thus
     * they cannot be directly accessed after assigning the new dataset.
     *
     * For example:
     *
     * ```javascript
     * dependencyStore.data = [{ from, to }];
     * // dependencyStore.first.fromEvent is not yet available
     * ```
     *
     * To guarantee references are available, wait for calculations for finish:
     *
     * ```javascript
     * dependencyStore.data = [{ from, to }];
     * await dependencyStore.project.commitAsync();
     * // dependencyStore.first.fromEvent is available
     * ```
     *
     * Alternatively use `loadDataAsync()` instead:
     *
     * ```javascript
     * await dependencyStore.loadDataAsync([{ from, to }]);
     * // dependencyStore.first.fromEvent is available
     * ```
     *
     * @member {DependencyModelConfig[]} data
     * @category Records
     */

    /**
     * Applies a new dataset to the DependencyStore and triggers calculations directly after. Use it to plug externally
     * fetched data into the store.
     *
     * ```javascript
     * await dependencyStore.loadDataAsync([{ from, to }]);
     * // dependencyStore.first.fromEvent is available
     * ```
     *
     * @param {DependencyModelConfig[]} data Array of DependencyModel data objects
     * @function loadDataAsync
     * @category CRUD
     * @async
     */

    static configurable = {
        /**
         * CrudManager must load stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        loadPriority : 400,
        /**
         * CrudManager must sync stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        syncPriority : 400,

        id : 'dependencies', // no-sanity

        /**
         * An array of allowed dependency types. When set, only the specified dependency types can be created.
         * Use values from {@link Scheduler.model.DependencyBaseModel#property-Type-static DependencyModel.Type}:
         *
         * - `0` - StartToStart (SS)
         * - `1` - StartToEnd (SF)
         * - `2` - EndToStart (FS)
         * - `3` - EndToEnd (FF)
         *
         * ```javascript
         * const scheduler = new Scheduler({
         *     project : {
         *         dependencyStore : {
         *             // Only allow Finish-to-Start and Start-to-Start dependencies
         *             allowedDependencyTypes : [DependencyModel.Type.EndToStart, DependencyModel.Type.EndToEnd]
         *         }
         *     }
         * });
         * ```
         *
         * When `null` (default), all dependency types are allowed.
         *
         * This config affects:
         * - Drag-creating dependencies (invalid types will be rejected)
         * - The dependency editor type combo (only allowed types are shown)
         * - The Predecessors and Successors tabs in the Task Editor
         *
         * @config {Number[]}
         * @default
         */
        allowedDependencyTypes : null,

        /**
         * Set to `true` to indicate that at most one dependency can exist between a given pair of events, allowing
         * the store to use a more efficient lookup of existing dependencies. Overridden to `true` in Scheduler
         * Enterprise and Gantt, which do not allow multiple dependencies between the same events.
         * @config {Boolean}
         * @default
         * @internal
         */
        uniqueDependencies : false
    };

    // <remove-on-release>
    // TODO: document
    // </remove-on-release>
    reduceEventDependencies(event, reduceFn, result, flat = true, depsGetterFn) {
        depsGetterFn = depsGetterFn || (event => this.getEventDependencies(event));

        event = ArrayHelper.asArray(event);

        event.reduce((result, event) => {
            if (event.children && !flat) {
                event.traverse(evt => {
                    result = depsGetterFn(evt).reduce(reduceFn, result);
                });
            }
            else {
                result = depsGetterFn(event).reduce(reduceFn, result);
            }
        }, result);

        return result;
    }

    // <remove-on-release>
    // TODO: document
    // </remove-on-release>
    mapEventDependencies(event, fn, filterFn, flat, depsGetterFn) {
        return this.reduceEventDependencies(event, (result, dependency) => {
            filterFn(dependency) && result.push(dependency);
            return result;
        }, [], flat, depsGetterFn);
    }

    // <remove-on-release>
    // TODO: document
    // </remove-on-release>
    mapEventPredecessors(event, fn, filterFn, flat) {
        return this.reduceEventPredecessors(event, (result, dependency) => {
            filterFn(dependency) && result.push(dependency);
            return result;
        }, [], flat);
    }

    // <remove-on-release>
    // TODO: document
    // </remove-on-release>
    mapEventSuccessors(event, fn, filterFn, flat) {
        return this.reduceEventSuccessors(event, (result, dependency) => {
            filterFn(dependency) && result.push(dependency);
            return result;
        }, [], flat);
    }

    /**
     * Returns all dependencies for a certain event (both incoming and outgoing)
     *
     * @param {Scheduler.model.EventModel} event
     * @returns {Scheduler.model.DependencyModel[]}
     */
    getEventDependencies(event) {
        return [].concat(event.predecessors || [], event.successors || []);
    }

    // <remove-on-release>
    // TODO: document
    // </remove-on-release>
    removeEventDependencies(event) {
        this.remove(this.getEventDependencies(event));
    }

    // <remove-on-release>
    // TODO: document
    // </remove-on-release>
    removeEventPredecessors(event) {
        this.remove(event.predecessors);
    }

    // <remove-on-release>
    // TODO: document
    // </remove-on-release>
    removeEventSuccessors(event, flat) {
        this.remove(event.successors);
    }

    set storage(storage) {
        super.storage = storage;

        // This allows a map based, fast lookup of dependencies by the events they link.
        // Non-unique, since multiple dependencies of different types are allowed between the same pair of events
        this.storage.addIndex({
            property : 'fromToKey',
            unique   : Boolean(this.uniqueDependencies)
        });
    }

    get storage() {
        // Micro optimization to avoid expensive super call
        return this._storage || super.storage;
    }

    onModelChange(record, toSet, wasSet, ...args) {
        // A dependency's fromToKey derives from its endpoints, refresh the index (lazily rebuilt on next lookup)
        // when they change
        if ('fromEvent' in wasSet || 'toEvent' in wasSet || 'from' in wasSet || 'to' in wasSet) {
            this.storage.invalidateIndices();
        }

        super.onModelChange(record, toSet, wasSet, ...args);
    }

    getBySourceTargetId(key) {
        const
            me             = this,
            { eventStore } = me;

        // fromToKey index entries also derive from the linked events' ids, which can change without any mutation of
        // the dependency records themselves (for example when a phantom event id is replaced by the server generated
        // id on sync). Watch the event store to refresh the index when that happens
        if (me._indexedEventStore !== eventStore) {
            me._indexedEventStoreDetacher?.();

            me._indexedEventStore = eventStore;
            me._indexedEventStoreDetacher = eventStore?.ion({
                idChange : () => me.storage.invalidateIndices(),
                thisObj  : me
            });

            me.storage.invalidateIndices();
        }

        const match = me.storage.findItem('fromToKey', key);

        // A unique index holds the dependency directly, a non-unique index holds a Set of dependencies per key.
        // Return the Set's first member, matching what a linear scan would find
        if (match) {
            return match.isModel ? match : match.values().next().value;
        }
    }

    /**
     * Returns dependency model instance linking tasks with given ids. The dependency can be forward (from 1st
     * task to 2nd) or backward (from 2nd to 1st).
     *
     * @param {Scheduler.model.EventModel|String} sourceEvent 1st event
     * @param {Scheduler.model.EventModel|String} targetEvent 2nd event
     * @returns {Scheduler.model.DependencyModel}
     */
    getDependencyForSourceAndTargetEvents(sourceEvent, targetEvent) {
        sourceEvent = Model.asId(sourceEvent);
        targetEvent = Model.asId(targetEvent);

        return this.getBySourceTargetId(this.constructor.makeDependencySourceTargetCompositeKey(sourceEvent, targetEvent));
    }

    /**
     * Returns a dependency model instance linking given events if such dependency exists in the store.
     * The dependency can be forward (from 1st event to 2nd) or backward (from 2nd to 1st).
     *
     * @param {Scheduler.model.EventModel|String} sourceEvent
     * @param {Scheduler.model.EventModel|String} targetEvent
     * @returns {Scheduler.model.DependencyModel}
     */
    getEventsLinkingDependency(sourceEvent, targetEvent) {
        return this.getDependencyForSourceAndTargetEvents(sourceEvent, targetEvent) ||
            this.getDependencyForSourceAndTargetEvents(targetEvent, sourceEvent);
    }

    /**
     * Validation method used to validate a dependency. Override and return `true` to indicate that an
     * existing dependency between two tasks is valid. For a new dependency being created please see
     * {@link #function-isValidDependencyToCreate}.
     *
     * @param {Scheduler.model.DependencyModel|Scheduler.model.TimeSpan|Number|String} dependencyOrFromId The dependency
     * model, the from task/event or the id of the from task/event
     * @param {Scheduler.model.TimeSpan|Number|String} [toId] To task/event or id thereof if the first parameter is not
     * a dependency record
     * @param {Number} [type] Dependency {@link Scheduler.model.DependencyBaseModel#property-Type-static} if the first
     * parameter is not a dependency model instance.
     * @param {Scheduler.model.DependencyBaseModel[]} [ignoreDependencies] Existing
     * dependencies to disregard while validating, for example the dependency which is being reconfigured.
     * @returns {Boolean}
     */
    async isValidDependency(dependencyOrFromId, toId, type, ignoreDependencies) {
        if (dependencyOrFromId == null) {
            return false;
        }

        const { fromEvent, toEvent } = this.resolveDependencyEnds(dependencyOrFromId, toId);

        // This condition is supposed to map all model instances to be validated by project. Lowest common ancestor
        // for scheduler event, enterprise-tier event and gantt task is TimeSpan
        if (fromEvent && toEvent) {
            // Block creating dependencies to display only tasks in Gantt
            if (!fromEvent.project || !toEvent.project) {
                return false;
            }

            // Not asserting dependency type here. Default value should normally suffice.
            return this.project.isValidDependency(fromEvent, toEvent, type, ignoreDependencies);
        }

        return dependencyOrFromId !== toId;
    }

    /**
     * Validation method used to validate a dependency while creating. Override and return `true` to indicate that
     * a new dependency is valid to be created.
     *
     * A dependency linking a {@link Core.data.Model#field-readOnly} event/task is never valid to create, since
     * linking an event/task up is a form of editing it. Already existing dependencies are not affected, a link
     * listed in `ignoreDependencies` is being reconfigured rather than created and is thus exempt from that rule.
     *
     * @param {Scheduler.model.DependencyModel|Scheduler.model.TimeSpan|Number|String} dependencyOrFromId The dependency
     * model, the from event/task or the id of the from event/task
     * @param {Scheduler.model.TimeSpan|Number|String} [toId] To event/task or id thereof if the first parameter is not
     * a dependency record
     * @param {Number} [type] Dependency {@link Scheduler.model.DependencyBaseModel#property-Type-static}, defaults to
     * the type of the dependency model passed as the first parameter
     * @param {Scheduler.model.DependencyBaseModel[]} [ignoreDependencies] Existing
     * dependencies to disregard while validating, for example the dependency which is being reconfigured.
     * @returns {Boolean}
     * @async
     */
    isValidDependencyToCreate(dependencyOrFromId, toId, type, ignoreDependencies) {
        if (dependencyOrFromId && dependencyOrFromId.isDependencyModel && type == null) {
            type = dependencyOrFromId.type;
        }

        if (!this.isDependencyTypeAllowed(type)) {
            return false;
        }

        // Reconfiguring an already existing link is not a new link, so the readOnly rule does not apply
        const
            { fromEvent, toEvent } = this.resolveDependencyEnds(dependencyOrFromId, toId),
            isReconfigure          = Boolean(ArrayHelper.asArray(ignoreDependencies)?.some(
                dependency => dependency.fromEvent === fromEvent && dependency.toEvent === toEvent));

        if (!isReconfigure && this.isReadOnlyLink(dependencyOrFromId, toId)) {
            return false;
        }

        return this.isValidDependency(dependencyOrFromId, toId, type, ignoreDependencies);
    }

    /**
     * Returns `true` when either end of the described link is readOnly, in which case the link may not be created,
     * since linking an event/task up is a form of editing it.
     *
     * @param {Scheduler.model.DependencyModel|Scheduler.model.TimeSpan|Number|String} dependencyOrFromId The dependency
     * model, the from event/task or the id of the from event/task
     * @param {Scheduler.model.TimeSpan|Number|String} [toId] To event/task or id thereof if the first parameter is not
     * a dependency record
     * @returns {Boolean}
     * @internal
     */
    isReadOnlyLink(dependencyOrFromId, toId) {
        const { fromEvent, toEvent } = this.resolveDependencyEnds(dependencyOrFromId, toId);

        return Boolean(fromEvent?.readOnly || toEvent?.readOnly);
    }

    /**
     * Resolves the arguments accepted by {@link #function-isValidDependency} and
     * {@link #function-isValidDependencyToCreate} into the events/tasks the dependency links.
     *
     * Note that {@link Core.data.Store#function-getById} returns a record passed to it as is, also when that record is
     * not in the event store. Records which are not in the store, such as display only tasks in Gantt, are therefore
     * resolved rather than dropped, so that the project check in {@link #function-isValidDependency} rejects them.
     *
     * @param {Scheduler.model.DependencyBaseModel|Scheduler.model.TimeSpan|Number|String} dependencyOrFromId The
     * dependency model, the from event/task or the id of the from event/task
     * @param {Scheduler.model.TimeSpan|Number|String} [toId] To event/task or id thereof if the first parameter is not
     * a dependency record
     * @returns {Object} An object holding the resolved `fromEvent` and `toEvent`
     * @private
     */
    resolveDependencyEnds(dependencyOrFromId, toId) {
        const { eventStore } = this;

        let fromEvent = dependencyOrFromId, toEvent = toId;

        // Accept dependency model
        if (dependencyOrFromId?.isDependencyModel) {
            ({ fromEvent, toEvent } = dependencyOrFromId);
        }

        // Accept events/tasks as well as ids thereof
        return {
            fromEvent : eventStore.getById(fromEvent),
            toEvent   : eventStore.getById(toEvent)
        };
    }

    /**
     * Returns `true` if the specified dependency type is allowed according to the
     * {@link #config-allowedDependencyTypes} configuration.
     *
     * @param {Number} type Dependency {@link Scheduler.model.DependencyBaseModel#property-Type-static}
     * @returns {Boolean}
     */
    isDependencyTypeAllowed(type) {
        const { allowedDependencyTypes } = this;

        // If no restriction is set, all types are allowed
        if (!allowedDependencyTypes) {
            return true;
        }

        return allowedDependencyTypes.includes(type);
    }

    /**
     * Returns all dependencies highlighted with the given CSS class
     *
     * @param {String} cls
     * @returns {Scheduler.model.DependencyBaseModel[]}
     */
    getHighlightedDependencies(cls) {
        return this.records.reduce((result, dep) => {
            if (dep.isHighlightedWith(cls)) result.push(dep);
            return result;
        }, []);
    }

    static makeDependencySourceTargetCompositeKey(from, to) {
        return `source(${from})-target(${to})`;
    }

    //region Product neutral

    getTimeSpanDependencies(record) {
        return this.getEventDependencies(record);
    }

    //endregion
};
