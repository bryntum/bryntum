import Base from '../../Base.js';
import ArrayHelper from '../../helper/ArrayHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import Model from '../Model.js';

/**
 * @module Core/data/mixin/StoreRelation
 */

/**
 * Mixin for Store that handles relations with other stores.
 *
 * The relation is defined in a Model subclass, see Model's {@link Core/data/Model#property-relations-static} property
 * for more information.
 *
 * ```javascript
 * class Player extends Model {
 *     static fields = [
 *         { name : 'teamId' }
 *     ];
 *
 *     static relations = {
 *         team : { foreignKey : 'teamId', foreignStore : 'teamStore' }
 *     };
 * }
 *
 * // After configuring both stores, access the relation:
 * const player = playerStore.first;
 * console.log(player.team.name); // Related Team record
 * ```
 *
 * ## See also
 *
 * - {@link Core.data.Model#property-relations-static} - How to define relations on a model
 * - {@link Core.data.Store} - The main store class
 *
 * @mixin
 */
export default Target => class StoreRelation extends (Target || Base) {
    static $name = 'StoreRelation';

    //region Init

    /**
     * Initialized relations, called from constructor
     * @private
     */
    initRelations(reset) {
        const
            me        = this,
            relations = me.modelClass.exposedRelations;

        if (reset && me.modelRelations) {
            // reset will reinit all relations, stop listening for store events on existing ones
            me.modelRelations.forEach(relation => relation.storeDetacher?.());
        }

        if ((!me.modelRelations || me.modelRelations.length === 0 || reset) &&  !me.isChained) {
            me.modelRelations = [];

            // foreignKeys is filled when model exposes its properties
            relations?.forEach(modelRelationConfig => {
                const
                    config       = { ...modelRelationConfig },
                    {
                        foreignStore,
                        relationName,
                        relatedCollectionName
                    }            = config,
                    relatedStore = typeof foreignStore === 'string' ? me[foreignStore] : foreignStore;

                config.dependentStore = me;

                me.modelRelations.push(config);

                if (relatedStore) {
                    config.foreignStoreProperty = config.foreignStore;
                    config.foreignStore = relatedStore; // repeated from initRelationStores, needed if stored is assigned late

                    const dependentStoreConfigs = relatedStore.dependentStoreConfigs;

                    // Add link to dependent store
                    if (dependentStoreConfigs.has(me)) {
                        const dependentConfigs = dependentStoreConfigs.get(me);

                        // Remove existing config on reset
                        if (reset) {
                            const existingConfig = dependentConfigs.find(c => c.relationName === relationName);
                            if (existingConfig) {
                                ArrayHelper.remove(dependentConfigs, existingConfig);
                            }
                        }

                        dependentConfigs.push(config);
                    }
                    else {
                        dependentStoreConfigs.set(me, [config]);
                    }

                    // if foreign key specifies relatedCollectionName the related store should also be configured
                    if (relatedCollectionName) {
                        relatedStore.initRelationCollection(config, me);
                    }

                    if (relatedStore.count > 0) {
                        relatedStore.updateDependentStores('dataset', relatedStore.records);
                    }
                }
            });
        }
    }

    /**
     * Called from other end of a relation when this store should hold a collection of related records.
     * @private
     * @param {Object} config Configuration object for the relation
     * @param {Object} collectionStore The store instance that manages the related records
     */
    initRelationCollection(config, collectionStore) {
        // <remove-on-release>
        // TODO: parts of this should move to model?
        // </remove-on-release>
        const
            me               = this,
            name             = config.relatedCollectionName,
            collectionStores = me.collectionStores || (me.collectionStores = {});

        collectionStores[name] = {
            store : collectionStore,
            config
        };

        if (!me[name + 'Store']) {
            me[name + 'Store'] = collectionStore;
        }

        // Setup relations for all (even filtered out) records
        if (me.allRecords.length) {
            me.initModelRelationCollection(name, me.allRecords);
        }
    }

    initModelRelationCollection(name, records) {
        const me = this;
        // add collection getter to each model
        records.forEach(record => {
            // Needs to work in trees also, if not a tree traverse just calls fn on self
            record.traverse(node => {
                // Add/replace $relatedAssignments (or similar) if assignments already exists on target
                const useName = name in node ? `$related${StringHelper.capitalize(name)}` : name;
                Object.defineProperty(node, useName, {
                    enumerable   : true,
                    configurable : true,
                    get          : function() {
                        return me.getCollection(this, name);
                    },
                    set : function(value) {
                        me.setCollection(this, name, value);
                    }
                });
            });
        });
    }

    // <remove-on-release>
    // TODO: Do diff update, this is called on filtering and will be heavy with lots of records
    // </remove-on-release>

    /**
     * Updates relationCache for all records.
     * @private
     */
    resetRelationCache() {
        this.relationCache = {};
        this.forEach(record => record.initRelations());
    }

    /**
     * Caches related records from related store on the local store.
     * @param {Core.data.Model} record Local record
     * @param {Array} relations Relations to related store
     * @returns {void}
     * @private
     */
    updateRecordRelationCache(record, relations) {
        relations?.forEach(relation => {
            const
                { config } = relation,
                // use related records id, or if called before "binding" is complete use foreign key
                foreignId = relation.related ? relation.related.id : record.getValue(config.foreignKey);
            // cache on that id, removing previously cached value if any
            foreignId !== undefined && this.cacheRelatedRecord(record, foreignId, config.relationName, foreignId);
        });
    }

    //endregion

    //region Getters

    /**
     * Returns records the relation cache. Same result as if retrieving the collection on the dependent store, but
     * without the need of accessing that store.
     * @internal
     * @param {String} name
     * @param {Core.data.Model|String|Number} recordOrId
     * @returns {Array}
     */
    getRelationCollection(name, recordOrId) {
        const id = Model.asId(recordOrId);
        return this.relationCache[name]?.[id] || [];
    }

    /**
     * Returns records from a collection of related records. Not to be called directly, called from Model getter.
     * @private
     * @param {Core.data.Model} record
     * @param {String} name
     * @returns {Array}
     */
    getCollection(record, name) {
        // <remove-on-release>
        // TODO: Move to Model?
        // </remove-on-release>
        const { config, store } = this.collectionStores[name];

        return store.relationCache[config.relationName]?.[record.id] || [];
    }

    /**
     * Sets a collection of related records. Will updated the related store and trigger events from it. Not to be called
     * directly, called from Model setter.
     * @private
     */
    setCollection(model, name, records) {
        const
            { config, store } = this.collectionStores[name],
            relationCache     = store.relationCache[config.relationName] || (store.relationCache[config.relationName] = {}),
            old               = (relationCache[model.id] || []).slice(),
            added             = [],
            removed           = [];

        store.suspendEvents();

        // Remove any related records not in the new collection
        old.forEach(record => {
            if (!records.includes(record)) {
                record[config.foreignKey] = null;
                store.remove(record);
                removed.push(record);
            }
        });

        // Add records from the new collection not already in store
        records.forEach(record => {
            if (record.isModel instanceof Model) {
                if (!record.stores.includes(store)) {
                    store.add(record);
                    added.push(record);
                }
            }
            else {
                [record] = store.add(record);
                added.push(record);
            }

            // Init relation
            record[config.foreignKey] = model.id;
        });

        store.resumeEvents();

        if (removed.length) {
            store.trigger('remove', { records : removed });
            store.trigger('change', { action : 'remove', records : removed });
        }

        if (added.length) {
            store.trigger('add', { records : added });
            store.trigger('change', { action : 'add', records : added });
        }
    }

    //endregion

    //region Caching

    /**
     * Adds a record to relation cache, optionally removing it if already there.
     * @param {Object} record The related record instance to cache
     * @param {String|Number|null} id The unique identifier of the related record
     * @param {String} name The relation name (used as the top-level cache key)
     * @param {String|Number|null} [uncacheId=null] If provided, removes the record from the relation cache entry for this ID before
     *   adding it to the new one
     * @returns {void}
     * @private
     */
    cacheRelatedRecord(record, id, name, uncacheId = null) {
        const
            me    = this,
            cache = me.relationCache[name] || (me.relationCache[name] = {});

        if (uncacheId !== null) {
            me.uncacheRelatedRecord(record, name, uncacheId);
        }

        if (id != null) {
            // Only include of not already in relation cache, which might happen when removing and re-adding the same instance
            ArrayHelper.include(cache[id] || (cache[id] = []), record);
        }
    }

    /**
     * Removes a record from relation cache, for a specific relation (specify relation name and id) or for all relations
     * @param {Object} record Record to remove from cache
     * @param {String|null} [name=null] Optional relation name
     * @param {String|Number|null} [id=null] Optional relation record ID
     * @returns {void}
     * @private
     */
    uncacheRelatedRecord(record, name = null, id = null) {
        const me = this;

        function remove(relationName, relatedId) {
            const
                cache    = me.relationCache[relationName],
                oldCache = cache?.[relatedId];

            // When unjoining a record from a filtered store the relationCache will also be filtered
            // and might give us nothing, in which case we have nothing to clean up and bail out
            if (oldCache) {
                const uncacheIndex = oldCache.indexOf(record);
                uncacheIndex >= 0 && oldCache.splice(uncacheIndex, 1);

                if (oldCache.length === 0) {
                    delete cache[relatedId];
                }
            }
        }

        if (id != null) {
            remove(name, id);
        }
        else if (record.meta.relationCache) {
            Object.entries(record.meta.relationCache).forEach(([relationName, relatedRecord]) =>
                remove(relationName, relatedRecord?.id)
            );
        }
    }

    /**
     * Updates related stores when store is cleared, a record is removed or added.
     * @private
     * @param {String} action
     * @param {Core.data.Model[]} records
     */
    updateDependentStores(action, records, silent) {
        const
            me = this,
            isDataset = action === 'dataset';

        me.dependentStoreConfigs.forEach(configs => {
            configs.forEach(config => {
                const
                    {
                        dependentStore,
                        relatedCollectionName,
                        relationName,
                        foreignKey,
                        propagateRecordChanges
                    }     = config,
                    cache = dependentStore.relationCache[relationName];

                if (isDataset) {
                    // Tree stores will traverse through children irrespective of whether the children are visible or not (i.e. parent is collapsed)
                    relatedCollectionName && me.initModelRelationCollection(relatedCollectionName, me.isTree ? records : me.allRecords);

                    dependentStore.forEach(record => {
                        const foreign = record.initRelation(config);
                        foreign && dependentStore.cacheRelatedRecord(record, foreign.id, relationName, foreign.id);
                    });

                    if (propagateRecordChanges && dependentStore.totalCount) {
                        dependentStore.trigger('refresh', { action : 'relatedstoredataset', records : dependentStore.records });
                    }
                }

                else if (action === 'removeall') {
                    dependentStore.forEach(record => record.removeRelation(config));

                    delete dependentStore.relationCache[relationName];

                    return;
                }

                else if (action === 'replace') {
                    // We care about the new record only, convert to same format as an add to allow using the same
                    // code path below
                    records = records.map(r => r[1]);
                }

                if (action === 'add' || action === 'replace') {
                    relatedCollectionName && me.initModelRelationCollection(relatedCollectionName, records);
                }

                if (!isDataset) {
                    records.forEach(record => {
                        const dependentRecords = cache?.[record.id];

                        switch (action) {
                            case 'remove':
                                // removing related record removes from cache on model and store
                                if (dependentRecords) {
                                    dependentRecords.forEach(dependentRecord => dependentRecord.removeRelation(config));
                                    // Altered to not delete on self, simplifies taking actions on related records after remove if relation still lives
                                    //delete cache[relatedRecord.id];
                                }
                                // <remove-on-release>
                                // TODO: Should removing related set foreign key to null? (removing Team sets Player.teamId to null)
                                // </remove-on-release>
                                break;
                            case 'add':
                            case 'replace':
                                // adding a new record in related store checks if any foreign keys match the new id,
                                // and if so it sets up the relation
                                dependentStore.forEach(dependentRecord => {
                                    if (dependentRecord.getValue(foreignKey) == record.id) {
                                        dependentRecord.initRelation(config);
                                        dependentStore.cacheRelatedRecord(dependentRecord, record.id, relationName);
                                    }
                                });
                                break;
                        }

                        // Notify stores "down" the relationship hierarchy that a related record has been changed
                        if (!silent && dependentRecords?.length && propagateRecordChanges) {
                            dependentRecords.forEach(dependentRecord =>
                                dependentRecord.stores.forEach(store => me.notifyRelatedStore(store, dependentRecord, config.relationName, record))
                            );
                        }

                    });
                }
            });
        });

        // Notify stores "up" the relationship hierarchy that a related record has been changed
        if (records?.length) {
            me.modelRelations?.forEach(relation => {
                if (relation.propagateRecordChanges) {
                    if (!isDataset) {
                        records.forEach(record => {
                            const relatedRecord = record[relation.relationName];

                            relatedRecord?.stores?.forEach(store => {
                                me.notifyRelatedStore(store, relatedRecord, relation.relatedCollectionName, record);
                            });
                        });
                    }
                    else if (relation.foreignStore.totalCount) {
                        // Cheaper path for dataset
                        relation.foreignStore.trigger('refresh', {
                            action  : 'relatedstoredataset',
                            records : relation.foreignStore.records
                        });
                    }
                }
            });
        }
    }

    notifyRelatedStore(store, relatedRecord, relationName, { meta }) {
        // Ignore notifying chained stores, the records will handle that themselves
        if (this.isChained) {
            return;
        }

        let { _ignoreRelationUpdate } = meta,
            isInitiator               = false;

        // No ignore meta set = this is the origin of the update
        if (!_ignoreRelationUpdate?.size) {
            // New Set instance each new update is needed
            meta._ignoreRelationUpdate = _ignoreRelationUpdate = new Set();
            isInitiator = true;
        }

        if (!_ignoreRelationUpdate.has(store)) {
            // Both this store, and the related should be ignored from here on
            _ignoreRelationUpdate.add(this).add(store);

            // The ignore set should be passed along the related records
            relatedRecord.meta._ignoreRelationUpdate = _ignoreRelationUpdate;

            // Notify the store
            store.onModelChange(relatedRecord, { [relationName] : relatedRecord[relationName] }, { [relationName] : relatedRecord[relationName] }, false, true);

            if (isInitiator) {
                // Clear the meta when done
                _ignoreRelationUpdate.clear();
            }
        }
    }

    /**
     * Updates relation cache and foreign key value when a related objects id is changed.
     * @private
     */
    updateDependentRecordIds(oldValue, value) {
        this.dependentStoreConfigs?.forEach(configs => {
            configs.forEach(config => {
                const
                    {
                        dependentStore,
                        relationName,
                        foreignKey
                    }            = config,
                    cache        = dependentStore.relationCache[relationName],
                    localRecords = cache?.[oldValue]?.slice();

                localRecords?.forEach(localRecord => {
                    // First update cache
                    dependentStore.cacheRelatedRecord(localRecord, value, relationName, oldValue);

                    // Flag this record so to not notify related stores more than the set done below
                    localRecord.meta._ignoreRelatedIdUpdate = true;

                    // Then update & announce, otherwise relations won't be up-to-date in listeners
                    localRecord.set(foreignKey, value, false, true);

                    delete localRecord.meta._ignoreRelatedIdUpdate;
                });
            });
        });
    }

    //endregion
};
