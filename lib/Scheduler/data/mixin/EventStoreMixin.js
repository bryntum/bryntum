import Base from '../../../Core/Base.js';
import Model from '../../../Core/data/Model.js';
import DateHelper from '../../../Core/helper/DateHelper.js';


/**
 * @module Scheduler/data/mixin/EventStoreMixin
 */

/**
 * This is a mixin, containing functionality related to managing events.
 *
 * It is consumed by all tier variants of {@link Scheduler.data.EventStore}.
 *
 * @mixin
 *
 * @plugins Scheduler/data/plugin/DateStoreLazyLoadPlugin
 */
export default Target => class EventStoreMixin extends (Target || Base) {
    static $name = 'EventStoreMixin';

    get isEventStore() {
        return true;
    }



    /**
     * Add events to the store.
     *
     * NOTE: Dates, durations and references (assignments, resources) on the events are determined async by a calculation
     * engine. Thus they cannot be directly accessed after using this function.
     *
     * For example:
     *
     * ```javascript
     * eventStore.add({ startDate, duration });
     * // endDate is not yet calculated
     * ```
     *
     * To guarantee data is in a calculated state, wait for calculations for finish:
     *
     * ```javascript
     * eventStore.add({ startDate, duration });
     * await eventStore.project.commitAsync();
     * // endDate is calculated
     * ```
     *
     * Alternatively use `addAsync()` instead:
     *
     * ```javascript
     * await eventStore.addAsync({ startDate, duration });
     * // endDate is calculated
     * ```
     *
     * @param {Scheduler.model.EventModel|Scheduler.model.EventModel[]|EventModelConfig|EventModelConfig[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.EventModel[]} Added records
     * @function add
     * @category CRUD
     */

    /**
     * Add events to the store and triggers calculations directly after. Await this function to have up to date data on
     * the added events.
     *
     * ```javascript
     * await eventStore.addAsync({ startDate, duration });
     * // endDate is calculated
     * ```
     *
     * @param {Scheduler.model.EventModel|Scheduler.model.EventModel[]|EventModelConfig|EventModelConfig[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.EventModel[]} Added records
     * @function addAsync
     * @category CRUD
     * @async
     */

    /**
     * Applies a new dataset to the EventStore. Use it to plug externally fetched data into the store.
     *
     * NOTE: Dates, durations and relations (assignments, resources) on the events are determined async by a calculation
     * engine. Thus they cannot be directly accessed after assigning the new dataset.
     *
     * For example:
     *
     * ```javascript
     * eventStore.data = [{ startDate, duration }];
     * // eventStore.first.endDate is not yet calculated
     * ```
     *
     * To guarantee data is in a calculated state, wait for calculations for finish:
     *
     * ```javascript
     * eventStore.data = [{ startDate, duration }];
     * await eventStore.project.commitAsync();
     * // eventStore.first.endDate is calculated
     * ```
     *
     * Alternatively use `loadDataAsync()` instead:
     *
     * ```javascript
     * await eventStore.loadDataAsync([{ startDate, duration }]);
     * // eventStore.first.endDate is calculated
     * ```
     *
     * @member {EventModelConfig[]} data
     * @category Records
     */

    /**
     * Applies a new dataset to the EventStore and triggers calculations directly after. Use it to plug externally
     * fetched data into the store.
     *
     * ```javascript
     * await eventStore.loadDataAsync([{ startDate, duration }]);
     * // eventStore.first.endDate is calculated
     * ```
     *
     * @param {EventModelConfig[]} data Array of EventModel data objects
     * @function loadDataAsync
     * @category CRUD
     * @async
     */

    /**
     * Class used to represent records. Defaults to class EventModel.
     * @member {Scheduler.model.EventModel} modelClass
     * @ts-returns {typeof EventModel}
     * @category Records
     */

    static configurable = {
        /**
         * CrudManager must load stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        loadPriority : 100,
        /**
         * CrudManager must sync stores in the correct order. Lowest first.
         * @config {Number}
         * @private
         */
        syncPriority : 200,

        id : 'events', // no-sanity

        /**
         * Configure with `true` to also remove the event when removing the last assignment from the linked
         * AssignmentStore. This config has no effect when using EventStore in legacy `resourceId`-mode.
         * @config {Boolean}
         * @default
         * @category Common
         */
        removeUnassignedEvent : true,

        /**
         * Configure with `true` to force single-resource mode, an event can only be assigned to a single resource.
         * If not provided, the mode will be inferred from
         *
         * 1. presence of an assignment store (i.e. multi-assignment)
         * 2. presence of `resourceId` in the event store data (i.e. single assignment mode)
         * @config {Boolean}
         * @category Common
         */
        singleAssignment : null
    };

    //region Init & destroy

    construct(config) {
        super.construct(config);

        this.autoTree = true;

        if (this.singleAssignment) {
            this.usesSingleAssignment = true;
        }

        if (!this.modelClass.isEventModel) {
            throw new Error('The model for the EventStore must subclass EventModel');
        }
    }

    //endregion

    //region Events records, iteration etc.

    get filtersFunction() {
        const storeFilterFn = super.filtersFunction;

        // The record being created should never be filtered out.
        return record => record.isCreating || storeFilterFn(record);
    }

    set filtersFunction(filtersFunction) {
        super.filtersFunction = filtersFunction;
    }

    /**
     * Calls the supplied iterator function once for every scheduled event, providing these arguments
     * - event : the event record
     * - startDate : the event start date
     * - endDate : the event end date
     *
     * Returning false cancels the iteration.
     *
     * @param {Function} fn iterator function
     * @param {Object} [thisObj] `this` reference for the function
     * @category Events
     */
    forEachScheduledEvent(fn, thisObj = this) {
        this.forEach(event => {
            const { startDate, endDate } = event;

            if (startDate && endDate) {
                return fn.call(thisObj, event, startDate, endDate);
            }
        });
    }

    /**
     * Returns an object defining the earliest start date and the latest end date of all the events in the store.
     *
     * @returns {Object} An object with 'startDate' and 'endDate' properties (or null values if data is missing).
     * @category Events
     */
    getTotalTimeSpan() {
        let earliest = new Date(9999, 0, 1),
            latest   = new Date(0);

        this.forEach(event => {
            if (event.startDate) {
                earliest = DateHelper.min(event.startDate, earliest);
            }
            if (event.endDate) {
                latest = DateHelper.max(event.endDate, latest);
            }
        });

        // <remove-on-release>
        // TODO: this will fail in programs designed to work with events in the past (after Jan 1, 1970)
        // </remove-on-release>
        earliest = earliest < new Date(9999, 0, 1) ? earliest : null;
        latest   = latest > new Date(0) ? latest : null;

        // keep last calculated value to be able to track total timespan changes
        return (this.lastTotalTimeSpan = {
            startDate : earliest || null,
            endDate   : latest || earliest || null
        });
    }

    /**
     * Checks if given event record is persistable. By default it always is, override EventModels `isPersistable` if you
     * need custom logic.
     *
     * @param {Scheduler.model.EventModel} event
     * @returns {Boolean}
     * @category Events
     */
    isEventPersistable(event) {
        return event.isPersistable;
    }

    //endregion

    //region Resource

    /**
     * Filters the events associated with a resource, based on the function provided. An array will be returned for those
     * events where the passed function returns true.
     * @param {Scheduler.model.ResourceModel} resource
     * @param {Function} fn The function
     * @param {Object} [thisObj] `this` reference for the function
     * @returns {Scheduler.model.EventModel[]} the events in the time span
     * @private
     * @category Resource
     */
    filterEventsForResource(resource, fn, thisObj = this) {
        return resource.getEvents(this).filter(fn.bind(thisObj));
    }

    /**
     * Returns all resources assigned to an event.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @returns {Scheduler.model.ResourceModel[]}
     * @category Resource
     */
    getResourcesForEvent(event) {
        // If we are sent an occurrence, use its parent
        if (event.isOccurrence) {
            event = event.recurringTimeSpan;
        }

        return this.assignmentStore.getResourcesForEvent(event);
    }

    /**
     * Returns all events assigned to a resource.
     * *NOTE:* this does not include occurrences of recurring events. Use the
     * {@link Scheduler/data/mixin/GetEventsMixin#function-getEvents} API to include occurrences of recurring events.
     * @param {Scheduler.model.ResourceModel|String|Number} resource Resource or resource id.
     * @returns {Scheduler.model.EventModel[]}
     * @category Resource
     */
    getEventsForResource(resource) {
        return this.assignmentStore.getEventsForResource(resource);
    }

    //endregion

    //region Assignment

    /**
     * Returns all assignments for a given event.
     *
     * @param {Scheduler.model.EventModel} event The event to get assignments for
     * @returns {Scheduler.model.AssignmentModel[]} Array of assignments for the event
     * @category Assignment
     */
    getAssignmentsForEvent(event) {
        return this.assignmentStore.getAssignmentsForEvent(event) || [];
    }

    /**
     * Returns all assignments for a given resource.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @returns {Scheduler.model.AssignmentModel[]}
     * @category Assignment
     */
    getAssignmentsForResource(resource) {
        return this.assignmentStore.getAssignmentsForResource(resource) || [];
    }

    /**
     * Creates and adds assignment record for a given event and a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number|Scheduler.model.ResourceModel[]|String[]|Number[]} resource The resource(s) to assign to the event
     * @param {Boolean} [removeExistingAssignments] `true` to first remove existing assignments
     * @returns {Scheduler.model.AssignmentModel[]} An array with the created assignment(s)
     * @category Assignment
     */
    assignEventToResource(event, resource, removeExistingAssignments = false) {
        return this.assignmentStore.assignEventToResource(event, resource, undefined, removeExistingAssignments);
    }

    /**
     * Removes assignment record for a given event and a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @category Assignment
     */
    unassignEventFromResource(event, resource) {
        this.assignmentStore.unassignEventFromResource(event, resource);
    }

    /**
     * Reassigns an event from an old resource to a new resource
     *
     * @param {Scheduler.model.EventModel}    event    An event or id of the event to reassign
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} oldResource A resource or id to unassign from
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} newResource A resource or id to assign to
     * @category Assignment
     */
    reassignEventFromResourceToResource(event, oldResource, newResource) {
        const
            me            = this,
            newResourceId = Model.asId(newResource),
            assignment    = me.assignmentStore.getAssignmentForEventAndResource(event, oldResource);

        if (assignment) {
            assignment.resourceId = newResourceId;
        }
        else {
            me.assignmentStore.assignEventToResource(event, newResource);
        }

    }

    /**
     * Checks whether an event is assigned to a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @returns {Boolean}
     * @category Assignment
     */
    isEventAssignedToResource(event, resource) {
        return this.assignmentStore.isEventAssignedToResource(event, resource);
    }

    /**
     * Removes all assignments for given event
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @category Assignment
     */
    removeAssignmentsForEvent(event) {
        this.assignmentStore.removeAssignmentsForEvent(event);
    }

    /**
     * Removes all assignments for given resource
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @category Assignment
     */
    removeAssignmentsForResource(resource) {
        this.assignmentStore.removeAssignmentsForResource(resource);
    }

    //endregion

    /**
     * Appends a new record to the store
     * @param {Scheduler.model.EventModel} record The record to append to the store
     * @category CRUD
     */
    append(record) {
        return this.add(record);
    }

    //region Project

    get project() {
        return super.project;
    }

    set project(project) {
        super.project = project;

        this.updateProject?.(project);

        this.detachListeners('project');

        if (project) {
            // Project already has AssignmentStore instance? Attach to it.
            if (project.assignmentStore?.isAssignmentStore) {
                this.attachToAssignmentStore(project.assignmentStore);
            }

            // Accessing assignmentStore would trigger `assignmentStoreChange` event on the project, so we set up
            // the listener after
            project.ion({
                name                  : 'project',
                assignmentStoreChange : 'onProjectAssignmentStoreChange',
                thisObj               : this,
                prio                  : 200 // Before UI updates
            });
        }
    }

    //endregion

    //region resource ids

    get usesResourceIds() {
        return this.modelClass.fieldMap?.resourceIds?.persist ?? false;
    }

    //endregion

    //region Single assignment

    get usesSingleAssignment() {
        if (this.isChained) {
            return this.masterStore.usesSingleAssignment;
        }
        return this._usesSingleAssignment;
    }

    set usesSingleAssignment(value) {
        this._usesSingleAssignment = value;

        this.setupCheapAssignmentIdGeneration();
    }

    setupCheapAssignmentIdGeneration() {
        const { assignmentStore } = this;
        // Use cheaper id generation for single assignment mode (no UUID needed)
        if (assignmentStore?.isStore && !assignmentStore.hasGenerateIdOverride) {
            // Normal fn on purpose, scope is AssignmentModel
            assignmentStore.modelClass.generateId = function() {
                if (this.singleAssignmentIdCounter == null) {
                    this.singleAssignmentIdCounter = 0;
                }
                return `a-${++this.singleAssignmentIdCounter}`;
            };
            assignmentStore.hasGenerateIdOverride = true;
        }
    }

    processRecords(eventRecords, recordProcessor, silent) {
        const
            { assignmentStore } = this,
            assignmentsToAdd    = [];

        // Same as on `joinRecordsToStore`, when adding a number of event records CoreEventMixin#joinProject method
        // will clear/rebuild cache in a loop. We raise this flag to skip invalidating assignment store indices for the time
        // we are joining records to the store. When they're added and indices are read, we will invalidate them.
        if (assignmentStore) {
            assignmentStore.skipInvalidateIndices = true;
        }

        eventRecords = super.processRecords(eventRecords, assignmentStore && !this.stm?.isRestoring && (eventRecord => {
            // Call the passed record processor first
            recordProcessor?.call(this, eventRecord);

            // AssignmentStore found, add an assignment to it if this is not a dataset operation
            // (a test expects being able to combine `resourceIds` with `resourceId` in the same dataset)
            const resourceIds = this.usesResourceIds && eventRecord.resourceIds?.length ? eventRecord.resourceIds : [eventRecord.resourceId];

            if (!eventRecord.reassignedFromReplace && resourceIds?.[0] != null) {
                for (const resourceId of resourceIds) {
                    // Check if the event is already assigned to the resource, though it's not in the event store.
                    // It could happen when you remove an event, so both event and assignment records are removed,
                    // then you "undo" the action and the assignment is restored before the event is restored.
                    if (!assignmentStore.includesAssignment(eventRecord.id, resourceId)) {
                        // Cannot use `event.assign(resourceId)` since event is not part of store yet
                        // Using a bit shorter generated id to not look so ugly in DOM
                        assignmentsToAdd.push({
                            id      : assignmentStore.modelClass.generateId(''),
                            resourceId,
                            eventId : eventRecord.id
                        });
                    }
                }
            }

            // clear flag
            eventRecord.reassignedFromReplace = false;
        }) || recordProcessor);

        if (assignmentStore) {
            assignmentStore.storage.invalidateIndices();
            assignmentStore.skipInvalidateIndices = false;

            assignmentStore.add(assignmentsToAdd, silent);
        }

        return eventRecords;
    }

    joinRecordsToStore(records) {
        const { assignmentStore } = this;

        if (assignmentStore) {
            // When adding a number of event records CoreEventMixin#joinProject method will clear/rebuild cache in a loop.
            // We raise this flag to skip invalidating assignment store indices for the time we are joining records to
            // the store. When they're added and indices are read, we will invalidate them.
            assignmentStore.skipInvalidateIndices = true;

            super.joinRecordsToStore(records);

            assignmentStore.storage.invalidateIndices();

            assignmentStore.skipInvalidateIndices = false;
        }
        else {
            super.joinRecordsToStore(records);
        }
    }

    processRecord(eventRecord, isDataset = false) {
        eventRecord = super.processRecord(eventRecord, isDataset);

        const
            me              = this,
            resourceId      = eventRecord.get('resourceId'),
            { resourceIds } = eventRecord;

        if (resourceIds?.length && me.usesResourceIds) {
            me.$processResourceIds = true;
            me.setupCheapAssignmentIdGeneration();
        }
        else if (resourceId != null && !eventRecord.meta.skipEnforcingSingleAssignment) {
            const
                existingRecord = me.getById(eventRecord.id),
                isReplacing    = existingRecord && existingRecord !== eventRecord && !isDataset;

            // Replacing an existing event, repoint the resource of its assignment
            // (already repointed to the new event by engine in EventStoreMixin)
            if (isReplacing) {
                // Have to look assignment up on store, removed by engine in super call above
                const
                    assignmentStore = me.assignmentStore ?? me.crudManager?.assignmentStore,
                    assignmentSet   = assignmentStore.storage.findItem('eventId', eventRecord.id);
                if (assignmentSet?.size) {
                    const assignment                  = assignmentSet.values().next().value;
                    assignment.resource               = resourceId;
                    eventRecord.reassignedFromReplace = true;
                }
            }
            // No AssignmentStore assigned yet, need to process when that happens. Or if it is a dataset operation,
            // processing will happen at the end of it to not add individual assignment (bad for performance)
            else {
                me.$processResourceIds = true;
            }

            // Flag that we have been loaded using resourceId, checked by CrudManager to exclude the internal
            // AssignmentStore from sync
            me.usesSingleAssignment = true;
        }

        return eventRecord;
    }

    processResourceIds() {
        const
            me              = this,
            // When used in a standalone CrudManager, there is no direct link to the assignment store
            assignmentStore = me.assignmentStore ?? me.crudManager?.assignmentStore;

        if (me.$processResourceIds && assignmentStore?.isAssignmentStore && !(me.project?.isSharingAssignmentStore && me.isChained)) {
            const assignments = [];

            // resourceIds used during initialization, convert into assignments (ignoring any filter)
            me.forEach(eventRecord => {
                const { resourceId, resourceIds, id : eventId } = eventRecord;
                if (resourceId != null) {
                    // Using a bit shorter generated id to not look so ugly in DOM
                    assignments.push({
                        id : assignmentStore.modelClass.generateId(''),
                        resourceId,
                        eventId
                    });
                }
                else if (resourceIds?.length) {
                    resourceIds.forEach(rId => {
                        assignments.push({
                            id         : assignmentStore.modelClass.generateId(''),
                            resourceId : rId,
                            eventId
                        });
                    });
                }
            }, me, { includeFilteredOutRecords : true });

            // Disable as much as possible, since we are in full control of this store when using single assignment mode
            assignmentStore.useRawData           = {
                // for the Enterprise tier assignment model is more complex than just event & resource
                // so we don't disable default values there
                disableDefaultValue     : !me.modelClass.isProEventModel,
                disableDuplicateIdCheck : true,
                disableTypeConversion   : true
            };
            // Flag that throws in AssignmentStore if data is loaded some other way when using single assignment
            assignmentStore.usesSingleAssignment = false;
            // These assignments all use generated ids, and are not meant to be serialized anyway so bypass check
            assignmentStore.verifyNoGeneratedIds = false;



            assignmentStore.data = assignments;

            assignmentStore.usesSingleAssignment = true;

            me.$processResourceIds = false;
        }
    }

    loadTreeData(...args) {
        super.loadTreeData(...args);

        this.processResourceIds();
    }

    loadData(...args) {
        super.loadData(...args);

        this.processResourceIds();
    }

    // Optionally remove unassigned events
    onBeforeRemoveAssignment({ records }) {
        const me = this;

        if (
            me.removeUnassignedEvent && !me.isRemoving && !me.isSettingData &&
            !me.stm?.isRestoring && !me.usesSingleAssignment &&
            // Do not remove unassigned events when syncing data, new assignments etc. might be synced afterwards
            !me.assignmentStore.isSyncingDataOnLoad && !me.resourceStore.isSyncingDataOnLoad
        ) {
            const toRemove = new Set();
            // Collect all events that are unassigned after the remove
            records.forEach(assignmentRecord => {
                const { event } = assignmentRecord;
                // Assignment might not have an event or the event might already be removed
                if (event && !event.isRemoved && event.assignments.every(a => records.includes(a))) {
                    toRemove.add(event);
                }
            });

            // And remove them
            if (toRemove.size) {
                me.remove([...toRemove]);
            }
        }
    }

    onProjectAssignmentStoreChange({ store }) {
        this.attachToAssignmentStore(store);
    }

    attachToAssignmentStore(assignmentStore) {
        const me = this;

        me.detachListeners('assignmentStore');

        if (assignmentStore) {
            me.processResourceIds();

            assignmentStore.ion({
                name : 'assignmentStore',

                // Adding an assignment in single assignment mode should set events resourceId if needed,
                // otherwise it should set events resourceIds (if persistable)

                addPreCommit({ records }) {
                    if (!me.isSettingData && !me.isAssigning) {
                        if (me.usesSingleAssignment) {
                            records.forEach(assignment => {
                                const { event } = assignment;
                                if (event?.isEvent && event.resourceId !== assignment.resourceId) {
                                    event.meta.isAssigning = true;
                                    event.set('resourceId', assignment.resourceId);
                                    event.meta.isAssigning = false;
                                }
                            });
                        }
                        else if (me.usesResourceIds) {
                            records.forEach(assignment => {
                                const { event } = assignment;

                                if (event?.isEvent) {
                                    event.meta.isAssigning = true;
                                    const resourceIds = event.resourceIds ?? [];
                                    if (!resourceIds.includes(assignment.resourceId)) {
                                        event.resourceIds = [...resourceIds, assignment.resourceId];
                                    }

                                    event.meta.isAssigning = false;
                                }
                            });
                        }
                        // Chained stores might rely on assignments (unless we are using single assignment / resourceIds)
                        else {
                            me.updateChainedStores();
                        }
                    }
                },

                // Called both for remove and removeAll
                beforeRemove : 'onBeforeRemoveAssignment',

                // Removing an assignment in single assignment mode should set events resourceId to null,
                // otherwise it should set events resourceIds to an empty array
                removePreCommit({ records }) {
                    if (!me.isSettingData && !me.isAssigning) {
                        if (me.usesSingleAssignment) {
                            records.forEach(assignment => {
                                // With engine link to event is already broken when we get here, hence the lookup
                                me.getById(assignment.eventId)?.set('resourceId', null);
                            });
                        }
                        else if (me.usesResourceIds) {
                            records.forEach(({ event, resourceId }) => {
                                const
                                    resourceIds   = event.resourceIds?.slice(),
                                    indexToRemove = resourceIds?.indexOf(resourceId);

                                if (indexToRemove >= 0) {
                                    resourceIds.splice(indexToRemove, 1);
                                    event.resourceIds = resourceIds;
                                }
                            });
                        }
                        else {
                            me.updateChainedStores();
                        }
                    }
                },

                removeAllPreCommit() {
                    if (!me.isSettingData && !me.isAssigning) {
                        if (me.usesSingleAssignment) {
                            me.allRecords.forEach(eventRecord => eventRecord.set('resourceId', null));
                        }
                        else if (me.usesResourceIds) {
                            me.allRecords.forEach(eventRecord => {
                                eventRecord.resourceIds = [];
                            });
                        }
                        // Chained stores might rely on assignments (unless we are using single assignment / resourceIds)
                        else {
                            me.updateChainedStores();
                        }
                    }
                },

                // Keep events resourceId and resourceIds in sync with assignment on changes
                update({ record, changes }) {
                    if ('resourceId' in changes) {
                        const { event } = record;

                        if (me.usesSingleAssignment) {
                            event.meta.isAssigning = true;
                            event.set('resourceId', changes.resourceId.value);
                            event.meta.isAssigning = false;
                        }
                        else if (me.usesResourceIds) {
                            event.meta.isAssigning = true;
                            const
                                resourceIds        = event.resourceIds.slice(),
                                indexToRemove      = resourceIds?.indexOf(changes.resourceId.oldValue);

                            if (indexToRemove >= 0) {
                                resourceIds.splice(indexToRemove, 1);
                            }

                            if (!resourceIds?.includes(changes.resourceId.value)) {
                                resourceIds.push(changes.resourceId.value);
                                event.resourceIds = resourceIds;
                            }
                            event.meta.isAssigning = false;
                        }
                        // Chained stores might rely on assignments (unless we are using single assignment / resourceIds)
                        else {
                            me.updateChainedStores();
                        }
                    }
                },

                // Keep events resourceIds in sync with assignment on dataset loading
                change({ action, records }) {
                    if (action === 'dataset') {
                        if (me.usesResourceIds) {
                            records.forEach(({ event, resourceId }) => {
                                const resourceIds = event.resourceIds ?? [];

                                if (!resourceIds.includes(resourceId)) {
                                    resourceIds.push(resourceId);
                                    event.meta.isAssigning = true;
                                    event.setData('resourceIds', resourceIds);
                                    event.meta.isAssigning = false;
                                }
                            });
                        }

                        // Chained stores might rely on assignments (unless we are using single assignment / resourceIds)
                        if (!me.usesSingleAssignment && !me.usesResourceIds) {
                            me.updateChainedStores();
                        }
                    }
                },

                thisObj : me
            });
        }
    }

    set data(data) {
        const me = this;

        me.isSettingData = true;

        // When using single assignment, remove all assignments when loading a new set of events.
        // Don't do it when filling a chained store, assignments are for the master store
        if (me.usesSingleAssignment && !me.syncDataOnLoad && !me.isChained) {
            me.assignmentStore.removeAll(true);
        }

        super.data = data;

        me.isSettingData = false;
    }

    // Override trigger to decorate update/change events with a flag if resourceId was the only thing changed, in which
    // case the change most likely can be ignored since the assignment will also change
    trigger(eventName, params, ...args) {
        const { changes } = params || {};

        // https://github.com/bryntum/bryntum/issues/6610
        // test: Scheduler/tests/data/UndoRedo.t.js, "Should refresh the view after undoing the event copy paste"
        // can not ignore this event when stm is restoring, because of the edge case in that ticket
        if (changes && 'resourceId' in changes && Object.keys(changes).length === 1 && !this.stm?.isRestoring) {
            params.isAssign = true;
        }

        return super.trigger(eventName, params, ...args);
    }

    remove(records, ...args) {
        const result = super.remove(records, ...args);

        // Make sure assignment is removed with event when using single assignment
        if (result.length && this.usesSingleAssignment) {
            for (const eventRecord of result) {
                if (!eventRecord.isOccurrence) {
                    (this.assignmentStore || this.crudManager?.assignmentStore)?.remove(eventRecord.assignments, true);
                }
            }
        }

        return result;
    }

    //endregion
};
