import Store from '../../Core/data/Store.js';
import Delayable from '../../Core/mixin/Delayable.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import Objects from '../../Core/helper/util/Objects.js';
import Base from '../../Core/Base.js';
import Events from '../../Core/mixin/Events.js';
import AbstractCrudManagerValidation from './mixin/AbstractCrudManagerValidation.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Scheduler/crud/AbstractCrudManagerMixin
 */

/**
 * State object passed to the resolve/reject handlers of the {@link Scheduler.crud.AbstractCrudManagerMixin#function-load}
 * Promise.
 * @typedef {Object} CrudManagerLoadResult
 * @property {Object} response Processed response in form of object.
 * @property {Response} rawResponse The native `Response` object returned by the [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 * @property {String} responseText Raw response text as String from the request.
 * @property {Object} request The request descriptor object.
 * @property {Boolean} [cancelled] Present (and `true`) when the promise was rejected because the request was cancelled.
 */

/**
 * State object passed to the resolve/reject handlers of the {@link Scheduler.crud.AbstractCrudManagerMixin#function-sync}
 * Promise.
 * @typedef {Object} CrudManagerSyncResult
 * @property {Object} response Processed response in form of object.
 * @property {Response} rawResponse The native `Response` object returned by the [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 * @property {String} responseText Raw response text as String from the request.
 * @property {Object} request The request descriptor object.
 * @property {Boolean} [cancelled] Present (and `true`) when the promise was rejected because the request was cancelled.
 */

export class AbstractCrudManagerError extends Error {}

export class CrudManagerRequestError extends AbstractCrudManagerError {
    constructor(cfg = {}) {
        super(cfg.message || cfg.request && StringHelper.capitalize(cfg.request?.type) + ' failed' || 'Crud Manager request failed');
        Object.assign(this, cfg);
        this.action = this.request?.type;
    }
}

const
    storeSortFn     = function(lhs, rhs, sortProperty) {
        // <remove-on-release>
        // TODO: get rid of these StoreDescriptors. Just use Stores.
        // </remove-on-release>
        if (lhs.store) {
            lhs = lhs.store;
        }
        if (rhs.store) {
            rhs = rhs.store;
        }

        lhs = lhs[sortProperty] || 0;
        rhs = rhs[sortProperty] || 0;
        return (lhs < rhs) ? -1 : ((lhs > rhs) ? 1 : 0);
    },

    // Sorter function to keep stores in loadPriority order
    storeLoadSortFn = function(lhs, rhs) {
        return storeSortFn(lhs, rhs, 'loadPriority');
    },

    // Sorter function to keep stores in syncPriority order
    storeSyncSortFn = function(lhs, rhs) {
        return storeSortFn(lhs, rhs, 'syncPriority');
    },

    cloneObject = function(obj) {
        return StringHelper.safeJsonParse(StringHelper.safeJsonStringify(obj));
    };

/**
 * An abstract mixin that supplies most of the CrudManager functionality.
 * It implements basic mechanisms of collecting stores to organize batch communication with a server.
 * It does not contain methods related to _data transfer_ nor _encoding_.
 * These methods are to be provided in sub-classes.
 * Out of the box there are mixins implementing {@link Scheduler/crud/transport/AjaxTransport support of AJAX for data transferring}
 * and {@link Scheduler/crud/encoder/JsonEncoder JSON for data encoding system}.
 * For example this is how we make a model that will implement CrudManager protocol and use AJAX/JSON to pass the data
 * to the server:
 *
 * ```javascript
 * class SystemSettings extends JsonEncode(AjaxTransport(AbstractCrudManagerMixin(Model))) {
 *     ...
 * }
 * ```
 *
 * ## Data transfer and encoding methods
 *
 * These are methods that must be provided by subclasses of this class:
 *
 * - {@link #function-sendRequest}
 * - {@link #function-cancelRequest}
 * - {@link #function-encode}
 * - {@link #function-decode}
 *
 * @mixin
 * @mixes Core/mixin/Delayable
 * @mixes Core/mixin/Events
 * @mixes Scheduler/crud/mixin/AbstractCrudManagerValidation
 * @abstract
 */
export default Target => {

    // Trigger $meta calculation to get up-to-date is "isXXX" flags
    // (kinky construction to avoid production minification faced in Angular https://github.com/bryntum/bryntum/issues/2889)
    Target.$$meta = Target.$meta;

    const mixins = [];

    // These two mixins are mixed in the Scheduling Engine code ..but in its own way
    // so that Base.mixin() cannot understand that they are already there and applies them 2nd time
    if (!Target.isEvents) {
        mixins.push(Events);
    }
    if (!Target.isDelayable) {
        mixins.push(Delayable);
    }

    mixins.push(AbstractCrudManagerValidation);

    return class AbstractCrudManagerMixin extends (Target || Base).mixin(...mixins) {

        /**
         * Fires before server response gets applied to the stores. Return `false` to prevent data applying.
         * This event can be used for server data preprocessing. To achieve it user can modify the `response` object.
         * @event beforeResponseApply
         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
         * @param {'sync'|'load'} requestType The request type (`sync` or `load`).
         * @param {Object} response The decoded server response object.
         * @preventable
         */

        /**
         * Fires before loaded data get applied to the stores. Return `false` to prevent data applying.
         * This event can be used for server data preprocessing. To achieve it user can modify the `response` object.
         * @event beforeLoadApply
         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
         * @param {Object} response The decoded server response object.
         * @param {Object} options Options provided to the {@link #function-load} method.
         * @preventable
         */
        /**
         * Fires before sync response data get applied to the stores. Return `false` to prevent data applying.
         * This event can be used for server data preprocessing. To achieve it user can modify the `response` object.
         * @event beforeSyncApply
         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
         * @param {Object} response The decoded server response object.
         * @preventable
         */

        static $name = 'AbstractCrudManagerMixin';

        //region Default config

        static configurable = {
            /**
             * The server revision stamp.
             * The _revision stamp_ is a number which should be incremented after each server-side change.
             * This property reflects the current version of the data retrieved from the server and gets updated
             * after each {@link #function-load} and {@link #function-sync} call.
             * @member {Number}
             * @readonly
             * @category CRUD
             */
            crudRevision : null,

            /**
             * A list of registered stores whose server communication will be collected into a single batch.
             * Each store is represented by a _store descriptor_.
             * @member {CrudManagerStoreDescriptor[]} crudStores
             * @category CRUD
             */

            /**
             * Sets the list of stores controlled by the CRUD manager.
             *
             * When adding a store to the CrudManager, make sure the server response format is correct for `load`
             * and `sync` requests. Learn more in the
             * [Working with data](#Scheduler/guides/data/crud_manager_in_depth.md#loading-data) guide.
             *
             * Store can be provided by itself, its id or as a _store descriptor_.
             * @config {Core.data.Store[]|String[]|CrudManagerStoreDescriptor[]|StoreConfig[]}
             * @category CRUD
             */
            crudStores : [],

            /**
             * Name of a store property to retrieve store identifiers from. Make sure you have an instance of a
             * store to use it by id. Store identifier is used as a container name holding corresponding store data
             * while transferring them to/from the server. By default, `id` property is used. And in case a
             * container identifier has to differ this config can be used:
             *
             * ```javascript
             * class CatStore extends Store {
             *     static configurable = {
             *         // store id is "meow" but for sending/receiving store data
             *         // we want to have "cats" container in JSON, so we create a new property "storeIdForCrud"
             *         id             : 'meow',
             *         storeIdForCrud : 'cats'
             *     }
             * });
             *
             * // create an instance to use a store by id
             * new CatStore();
             *
             * class MyCrudManager extends CrudManager {
             *     ...
             *     crudStores           : ['meow'],
             *     // crud manager will get store identifier from "storeIdForCrud" property
             *     storeIdProperty  : 'storeIdForCrud'
             * });
             * ```
             * The `storeIdProperty` property can also be specified directly on a store:
             *
             * ```javascript
             * class CatStore extends Store {
             *     static configurable = {
             *         // storeId is "meow" but for sending/receiving store data
             *         // we want to have "cats" container in JSON
             *         id              : 'meow',
             *         // so we create a new property "storeIdForCrud"..
             *         storeIdForCrud  : 'cats',
             *         // and point CrudManager to use it as the store identifier source
             *         storeIdProperty  : 'storeIdForCrud'
             *     }
             * });
             *
             * class DogStore extends Store {
             *     static configurable = {
             *         // storeId is "dogs" and it will be used as a container name for the store data
             *         storeId : 'dogs',
             *         // id is set to get a store by identifier
             *         id      : 'dogs'
             *     }
             * });
             *
             * // create an instance to use a store by id
             * new CatStore();
             * new DogStore();
             *
             * class MyCrudManager extends CrudManager {
             *     ...
             *     crudStores : ['meow', 'dogs']
             * });
             * ```
             * @config {String}
             * @category CRUD
             */
            storeIdProperty : 'id',

            // <remove-on-release>
            // TODO: no support for remote filtering yet
            // /**
            //  * The name of the 'filter' parameter to send in a load request.
            //  * @config {String}
            //  * @default
            //  */
            // </remove-on-release>
            crudFilterParam : 'filter',

            /**
             * Sends request to the server.
             * @function sendRequest
             * @param {Object} request The request to send. An object having following properties:
             * @param {'load'|'sync'} request.type Request type, can be either `load` or `sync`
             * @param {String} request.data The request encoded with {@link #function-encode}.
             * @param {Function} request.success Callback to be started on successful request transferring
             * @param {string} request.success.rawResponse `Response` object returned by the [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
             * @param {Function} request.failure Callback to be started on request transfer failure
             * @param {string} request.failure.rawResponse `Response` object returned by the [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
             * @param {Object} request.thisObj `this` reference for the above `success` and `failure` callbacks
             * @returns {Promise} The request promise.
             * @abstract
             */

            /**
             * Cancels request to the server.
             * @function cancelRequest
             * @param {Promise} promise The request promise to cancel (a value returned by corresponding
             * {@link #function-sendRequest} call).
             * @param {Function} reject Reject handle of the corresponding promise
             * @abstract
             */

            /**
             * Encodes request to the server.
             * @function encode
             * @param {Object} request The request to encode.
             * @returns {String} The encoded request.
             * @abstract
             */

            /**
             * Decodes response from the server.
             * @function decode
             * @param {String} response The response to decode.
             * @returns {Object} The decoded response.
             * @abstract
             */

            transport : {},

            /**
             * When `true` forces the CRUD manager to process responses depending on their `type` attribute.
             * So `load` request may be responded with `sync` response for example.
             * Can be used for smart server logic allowing the server to decide when it's better to respond with a
             * complete data set (`load` response) or it's enough to return just a delta (`sync` response).
             * @config {Boolean}
             * @default
             * @category CRUD
             */
            trackResponseType : false,

            /**
             * When `true` the Crud Manager does not require all updated and removed records to be mentioned in the
             * *sync* response. In this case response should include only server side changes.
             *
             * **Please note that added records should still be mentioned in response to provide real identifier
             * instead of the phantom one.**
             * @config {Boolean}
             * @default
             * @category CRUD
             */
            supportShortSyncResponse : true,

            /**
             * Field name to be used to transfer a phantom record identifier.
             * @config {String}
             * @default
             * @category CRUD
             */
            phantomIdField : '$PhantomId',

            /**
             * Field name to be used to transfer a phantom parent record identifier.
             * @config {String}
             * @default
             * @category CRUD
             */
            // <remove-on-release>
            // TODO review phantomParentId field usage
            // </remove-on-release>
            phantomParentIdField : '$PhantomParentId',

            /**
             * Specify `true` to automatically call {@link #function-load} method on the next frame after creation.
             *
             * Called on the next frame to allow a Scheduler (or similar) linked to a standalone CrudManager to
             * register its stores before loading starts.
             *
             * @config {Boolean}
             * @default
             * @category CRUD
             */
            autoLoad : false,

            /**
             * The timeout in milliseconds to wait before persisting changes to the server.
             * Used when {@link #config-autoSync} is set to `true`.
             * @config {Number}
             * @default
             * @category CRUD
             */
            autoSyncTimeout : 100,

            /**
             * `true` to automatically persist store changes after edits are made in any of the stores monitored.
             * Please note that sync request will not be invoked immediately but only after
             * {@link #config-autoSyncTimeout} interval.
             * @config {Boolean}
             * @default
             * @category CRUD
             */
            autoSync : false,

            /**
             * `True` to reset identifiers (defined by `idField` config) of phantom records before submitting them
             * to the server.
             * @config {Boolean}
             * @default
             * @category CRUD
             */
            resetIdsBeforeSync : true,

            /**
             * @member {CrudManagerStoreDescriptor[]} syncApplySequence
             * An array of stores presenting an alternative sync responses apply order.
             * Each store is represented by a _store descriptor_.
             * @ts-returns {String[]|CrudManagerStoreDescriptor[]}
             * @category CRUD
             */

            /**
             * An array of store identifiers sets an alternative sync responses apply order.
             * By default, the order in which sync responses are applied to the stores is the same as they
             * registered in. But in case of some tricky dependencies between stores this order can be changed:
             *
             * ```javascript
             * class MyCrudManager extends CrudManager {
             *     // register stores (will be loaded in this order: 'store1' then 'store2' and finally 'store3')
             *     crudStores : ['store1', 'store2', 'store3'],
             *     // but we apply changes from server to them in an opposite order
             *     syncApplySequence : ['store3', 'store2', 'store1']
             * });
             * ```
             *
             * @config {String[]}
             * @ts-returns {String[]|CrudManagerStoreDescriptor[]}
             * @category CRUD
             */
            syncApplySequence : [],

            orderedCrudStores : [],

            /**
             * `true` to write all fields from the record to the server.
             * If set to `false` it will only send the fields that were modified.
             * Note that any fields that have {@link Core/data/field/DataField#config-persist} set to `false` will
             * still be ignored and fields having {@link Core/data/field/DataField#config-alwaysWrite} set to `true`
             * will always be included.
             * @config {Boolean}
             * @default
             * @category CRUD
             */
            writeAllFields : false,

            crudIgnoreUpdates : 0,

            autoSyncSuspendCounter : 0,

            // Flag that shows if crud manager performed successful load request
            crudLoaded : false,

            applyingLoadResponse : false,
            applyingSyncResponse : false,

            callOnFunctions : true,

            /**
             * Convenience shortcut to set only the url to load from, when you do not need to supply any other config
             * options in the `load` section of the `transport` config.
             *
             * Using `loadUrl`:
             * ```javascript
             * {
             *     loadUrl : 'read.php
             * }
             * ```
             *
             * Equals the following `transport` config:
             * ```javascript
             * {
             *     transport : {
             *         load : {
             *             url : 'read.php'
             *         }
             *     }
             * }
             * ```
             *
             * When read at runtime, it will return the value from `transport.load.url`.
             *
             * @prp {String}
             * @category Common
             */
            loadUrl : null,

            /**
             * Convenience shortcut to set only the url to sync to, when you do not need to supply any other config
             * options in the `sync` section of the `transport` config.
             *
             * Using `loadUrl`:
             * ```javascript
             * {
             *     syncUrl : 'sync.php
             * }
             * ```
             *
             * Equals the following `transport` config:
             * ```javascript
             * {
             *     transport : {
             *         load : {
             *             url : 'sync.php'
             *         }
             *     }
             * }
             * ```
             *
             * When read at runtime, it will return the value from `transport.sync.url`.
             *
             * @prp {String}
             * @category Common
             */
            syncUrl : null,

            /**
             * Specify as `true` to force sync requests to be sent when calling `sync()`, even if there are no local
             * changes. Useful in a polling scenario, to keep client up to date with the backend.
             * @prp {Boolean}
             * @category CRUD
             */
            forceSync : null,

            /**
             * Set to `true` to make STM ignore changes coming from the backend. This will allow user to only undo redo
             * local changes.
             * @prp {Boolean}
             * @category CRUD
             */
            ignoreRemoteChangesInSTM : false,

            /** Set to `false` to only include the id of a removed parent node in the request to the backend (also
             * affects programmatic calls to get {@link #property-changes} etc.), and not the ids of its children.
             *
             * Consider the following scenario, removing parent 1:
             *
             * ```javascript
             * {
             *   id : 1,
             *   children : [
             *     { id : 11 },
             *     { id : 12 }
             *   ]
             * }
             * ```
             *
             * With `includeChildrenInRemoveRequest : false`, the backend will only receive the removal of id 1.
             *
             * With `includeChildrenInRemoveRequest : true` (the default), the backend will receive the removal of id 1,
             * 11 and 12.
             *
             * @config {Boolean}
             * @default true
             * @category CRUD
             */
            includeChildrenInRemoveRequest : true,

            /**
             * Specifies the way to handle conflicts happening when applying `sync` responses to served stores,
             * The conflicts could happen when remote coming changes interfere with local changes made after sending
             * the request.
             *
             * Supported values are:
             *
             * - `local` local modifications are preserved and corresponding remote changes get rejected
             * - `remote` remote changes gets applied overriding the local modifications.
             *
             * @config {'local' | 'remote'}
             * @default
             * @internal
             */
            syncConflictResolution : 'local'
        };

        static delayable = {
            // Postponed to next frame, to allow Scheduler created after CrudManager to inject its stores
            // (timeRanges, resourceTimeRanges)
            doAutoLoad : 'raf'
        };

        get isCrudManager() {
            return true;
        }

        //endregion

        //region Init

        construct(config = {}) {
            const me = this;

            me._requestId = 0;
            me.activeRequests = {};
            me.crudStoresIndex = {};

            // "monkey-store" tests need loaded data to analyze
            if (VersionHelper.isTestEnv && globalThis.location.href.includes('keep-loaded-data')) {
                me.ion({
                    beforeLoadCrudManagerData({ response }) {
                        // make a detached copy
                        me._lastLoadResponse = cloneObject(response);
                    },
                    load() {
                        // make a detached copy of final data
                        me._lastLoadedData = cloneObject(me.toJSON());
                    },
                    once : true
                });
            }

            super.construct(config);
        }

        afterConstruct() {
            super.afterConstruct();

            if (this.autoLoad) {
                this._autoLoadPromise = this.doAutoLoad();
            }
        }

        //endregion

        //region Configs

        get loadUrl() {
            return this.transport?.load?.url;
        }

        updateLoadUrl(url) {
            ObjectHelper.setPath(this, 'transport.load.url', url);
        }

        get syncUrl() {
            return this.transport?.sync?.url;
        }

        updateSyncUrl(url) {
            ObjectHelper.setPath(this, 'transport.sync.url', url);
        }

        get shouldIgnoreRemoteChangesInSTM() {
            return this.ignoreRemoteChangesInSTM;
        }

        /**
         * Whether this crud manager handles persistence of its stores' changes, writing all records in one batch
         * and linking new records using phantom identifiers. When `true`, new records referencing phantom parent
         * records are considered persistable right away, since the batch keeps the references intact.
         * @member {Boolean}
         * @internal
         */
        get handlesStorePersistence() {
            return true;
        }

        //endregion

        //region Store descriptors & index

        /**
         * Returns a registered store descriptor.
         * @param {String|Core.data.Store} storeId The store identifier or registered store instance.
         * @returns {CrudManagerStoreDescriptor} The descriptor of the store.
         * @category CRUD
         */
        getStoreDescriptor(storeId) {
            if (!storeId) {
                return null;
            }

            let store = null;

            // if a Store instance
            if (storeId instanceof Store) {
                store = storeId;
                storeId = storeId._crudManagerId || storeId.id;
            }
            // a descriptor
            else if (typeof storeId === 'object') {
                storeId = storeId.storeId;
            }

            // A store may be registered with multiple crud managers (for example with its project, which has
            // CrudManager functionality built in, and a standalone CrudManager). Each registration overwrites the
            // store's `_crudManagerId`, so when the id lookup misses, fall back to searching by store instance
            return this.crudStoresIndex[storeId] ?? (store && this.crudStores?.find(s => s.store === store));
        }

        fillStoreDescriptor(descriptor) {
            const
                { store } = descriptor,
                {
                    storeIdProperty = this.storeIdProperty,
                    modelClass
                }         = store;

            if (!descriptor.storeId) {
                descriptor.storeId = store[storeIdProperty] || store.id;
            }
            if (!descriptor.idField) {
                descriptor.idField = modelClass.idField;
            }
            if (!descriptor.phantomIdField) {
                descriptor.phantomIdField = modelClass.phantomIdField;
            }
            if (!descriptor.phantomParentIdField) {
                descriptor.phantomParentIdField = modelClass.phantomParentIdField;
            }
            if (!('writeAllFields' in descriptor)) {
                descriptor.writeAllFields = store.writeAllFields;
            }

            return descriptor;
        }

        updateCrudStoreIndex() {
            const
                crudStoresIndex = this.crudStoresIndex = {};

            this.crudStores.forEach(store => store.storeId && (crudStoresIndex[store.storeId] = store));
        }

        //endregion

        //region Store collection (add, remove, get & iterate)

        /**
         * Returns a registered store.
         * @param {String} storeId Store identifier.
         * @returns {Core.data.Store} Found store instance.
         * @category CRUD
         */
        getCrudStore(storeId) {
            const storeDescriptor = this.getStoreDescriptor(storeId);
            return storeDescriptor?.store;
        }

        forEachCrudStore(fn, thisObj = this) {
            if (!fn) {
                throw new Error('Iterator function must be provided');
            }

            this.crudStores.every(store =>
                fn.call(thisObj, store.store, store.storeId, store) !== false
            );
        }

        updateCrudStores(stores) {
            this._crudStores = [];

            this.addCrudStore(stores);

            // Ensure preconfigured stores stay stable at the start of the array when
            // addPrioritizedStore attempts to insert in order. Only featured gantt/scheduler stores
            // must participate in the ordering. If they were configured in, they must not move.
            for (const store of this._crudStores) {
                store.loadPriority = store.syncPriority = 0;
            }
        }

        updateSyncApplySequence(stores) {
            this._syncApplySequence = [];
            this.addStoreToApplySequence(stores);
        }

        internalAddCrudStore(store) {
            const
                me = this;

            let storeDescriptor;

            // if store instance provided
            if (store instanceof Store) {
                storeDescriptor = { store };
            }
            else if (typeof store === 'object') {
                // if not a store descriptor, assume it is a store config
                storeDescriptor = store.store ? store : { store : Store.create(store) };
            }
            // if it's a store identifier
            else {
                storeDescriptor = { store : Store.getStore(store) };
            }

            me.fillStoreDescriptor(storeDescriptor);

            // store instance
            store = storeDescriptor.store;

            // if the store has "setCrudManager" hook - use it
            if (store.setCrudManager) {
                store.setCrudManager(me, storeDescriptor);
            }

            // decorate the store w/ "crudManager" property
            store.crudManager = me;
            // remember store identifier used by the crud manager (could differ from store.id)
            store._crudManagerId = storeDescriptor.storeId;

            // Stores have a defaultConfig for pageSize. CrudManager does not support that.
            // The project always has the CrudManager functionality built in, but when it has no transport
            // configured its stores may load & commit individually through their own AjaxStore urls, using
            // their own paging - only clear pageSize when this crud manager loads the data itself
            // <remove-on-release>
            // TODO: PORT currently no support for paging.
            // </remove-on-release>
            if (store.isAjaxStore && (me.loadUrl || me.syncUrl || !me.isProjectModel)) {
                store.pageSize = null;
            }

            // Prevent AjaxStores from performing their own CRUD operations if CrudManager is configured with an URL
            if (me.loadUrl || me.syncUrl) {
                store.autoCommit = false;
                store.autoLoad = false;
                if (store.createUrl || store.updateUrl || store.deleteUrl || store.readUrl) {
                    console.warn('You have configured an URL on a Store that is handled by a CrudManager that is also configured with an URL. The Store URL\'s should be removed.');
                }
            }

            // listen to store changes
            me.bindCrudStoreListeners(store);

            return storeDescriptor;
        }

        /**
         * Adds a store to the collection.
         *
         * ```javascript
         * // append stores to the end of collection
         * crudManager.addCrudStore([
         *     store1,
         *     // storeId
         *     'bar',
         *     // store descriptor
         *     {
         *         storeId : 'foo',
         *         store   : store3
         *     },
         *     {
         *         storeId         : 'bar',
         *         store           : store4,
         *         // to write all fields of modified records
         *         writeAllFields  : true
         *     }
         * ]);
         * ```
         *
         * **Note:** Order in which stores are kept in the collection is very essential sometimes.
         * Exactly in this order the loaded data will be put into each store.
         *
         * When adding a store to the CrudManager, make sure the server response format is correct for `load` and `sync`
         * requests. Learn more in the [Working with data](#Scheduler/guides/data/crud_manager_in_depth.md#loading-data) guide.
         *
         * @param {Core.data.Store|String|CrudManagerStoreDescriptor|Core.data.Store[]|String[]|CrudManagerStoreDescriptor[]} store
         * A store or list of stores. Each store might be specified by its instance, `storeId` or _descriptor_.
         * @param {Number} [position] The relative position of the store. If `fromStore` is specified the position
         * will be taken relative to it. If not specified then store(s) will be appended to the end of collection.
         * Otherwise, it will be just a position in stores collection.
         *
         * ```javascript
         * // insert stores store4, store5 to the start of collection
         * crudManager.addCrudStore([ store4, store5 ], 0);
         * ```
         *
         * @param {String|Core.data.Store|CrudManagerStoreDescriptor} [fromStore] The store relative to which position
         * should be calculated. Can be defined as a store identifier, instance or descriptor (the result of
         * {@link #function-getStoreDescriptor} call).
         *
         * ```javascript
         * // insert store6 just before a store having storeId equal to 'foo'
         * crudManager.addCrudStore(store6, 0, 'foo');
         *
         * // insert store7 just after store3 store
         * crudManager.addCrudStore(store7, 1, store3);
         * ```
         * @category CRUD
         */
        addCrudStore(store, position, fromStore) {
            store = ArrayHelper.asArray(store);

            if (!store?.length) {
                return;
            }

            const
                me     = this,
                stores = store.map(me.internalAddCrudStore, me);

            // if no position specified then append stores to the end
            if (typeof position === 'undefined') {
                me.crudStores.push(...stores);
            }
            // if position specified
            else {
                // if specified the store relative to which we should insert new one(-s)
                if (fromStore) {
                    if (fromStore instanceof Store || typeof fromStore !== 'object') fromStore = me.getStoreDescriptor(fromStore);
                    // get its position
                    position += me.crudStores.indexOf(fromStore);
                }
                // insert new store(-s)
                me.crudStores.splice(position, 0, ...stores);
            }

            me.orderedCrudStores.push(...stores);

            me.updateCrudStoreIndex();

            me.afterAddStore?.(stores);
        }

        // Adds configured scheduler stores to the store collection ensuring correct order
        // unless they're already registered.
        addPrioritizedStore(store) {
            const me = this;

            if (!me.hasCrudStore(store)) {
                me.addCrudStore(store, ArrayHelper.findInsertionIndex(store, me.crudStores, storeLoadSortFn));
            }
            if (!me.hasApplySequenceStore(store)) {
                me.addStoreToApplySequence(store, ArrayHelper.findInsertionIndex(store, me.syncApplySequence, storeSyncSortFn));
            }
        }

        hasCrudStore(store) {
            return this.crudStores?.some(s => s === store || s.store === store || s.storeId === store);
        }

        /**
         * Removes a store from collection. If the store was registered in alternative sync sequence list
         * it will be removed from there as well.
         *
         * ```javascript
         * // remove store having storeId equal to "foo"
         * crudManager.removeCrudStore("foo");
         *
         * // remove store3
         * crudManager.removeCrudStore(store3);
         * ```
         *
         * @param {CrudManagerStoreDescriptor|String|Core.data.Store} store The store to remove. Either the store
         * descriptor, store identifier or store itself.
         * @category CRUD
         */
        removeCrudStore(store) {
            const
                me         = this,
                {
                    crudStores,
                    orderedCrudStores
                }          = me,
                foundStore = me.getStoreDescriptor(store);

            if (foundStore) {
                // unbind store listeners
                me.unbindCrudStoreListeners(foundStore.store);

                ArrayHelper.remove(crudStores, foundStore);
                ArrayHelper.remove(orderedCrudStores, foundStore);

                me.removeStoreFromApplySequence(foundStore);

                // remove from "crudStoresIndex" last to let getStoreDescriptor() work
                // till this line is called
                delete me.crudStoresIndex[foundStore.storeId];
            }
            else {
                throw new Error('Store not found in stores collection');
            }
        }

        //endregion

        //region Store listeners

        bindCrudStoreListeners(store) {
            store.ion({
                name : store.id,

                // When a tentatively added record gets confirmed as permanent, this signals a change
                addConfirmed : 'onCrudStoreChange',
                change       : 'onCrudStoreChange',
                destroy      : 'onCrudStoreDestroy',
                thisObj      : this
            });
        }

        unbindCrudStoreListeners(store) {
            this.detachListeners(store.id);
        }

        //endregion

        //region Apply sequence

        /**
         * Adds a store to the alternative sync responses apply sequence.
         * By default, the order in which sync responses are applied to the stores is the same as they registered in.
         * But this order can be changes either on construction step using {@link #config-syncApplySequence} option
         * or by calling this method.
         *
         * **Please note**, that if the sequence was not initialized before this method call then
         * you will have to do it yourself like this for example:
         *
         * ```javascript
         * // alternative sequence was not set for this crud manager
         * // so let's fill it with existing stores keeping the same order
         * crudManager.addStoreToApplySequence(crudManager.crudStores);
         *
         * // and now we can add our new store
         *
         * // we will load its data last
         * crudManager.addCrudStore(someNewStore);
         * // but changes to it will be applied first
         * crudManager.addStoreToApplySequence(someNewStore, 0);
         * ```
         * add registered stores to the sequence along with the store(s) you want to add
         *
         * @param {Core.data.Store|CrudManagerStoreDescriptor|Core.data.Store[]|CrudManagerStoreDescriptor[]} store The
         * store to add or its _descriptor_ (or array of stores or descriptors).
         * @param {Number} [position] The relative position of the store. If `fromStore` is specified the position
         * will be taken relative to it. If not specified then store(s) will be appended to the end of collection.
         * Otherwise, it will be just a position in stores collection.
         *
         * ```javascript
         * // insert stores store4, store5 to the start of sequence
         * crudManager.addStoreToApplySequence([ store4, store5 ], 0);
         * ```
         * @param {String|Core.data.Store|CrudManagerStoreDescriptor} [fromStore] The store relative to which position
         * should be calculated. Can be defined as a store identifier, instance or its descriptor (the result of
         * {@link #function-getStoreDescriptor} call).
         *
         * ```javascript
         * // insert store6 just before a store having storeId equal to 'foo'
         * crudManager.addStoreToApplySequence(store6, 0, 'foo');
         *
         * // insert store7 just after store3 store
         * crudManager.addStoreToApplySequence(store7, 1, store3);
         * ```
         * @category CRUD
         */
        addStoreToApplySequence(store, position, fromStore) {
            if (!store) {
                return;
            }

            store = ArrayHelper.asArray(store);

            const
                me   = this,
                // loop over list of stores to add
                data = store.reduce((collection, store) => {
                    const s = me.getStoreDescriptor(store);
                    s && collection.push(s);
                    return collection;
                }, []);

            // if no position specified then append stores to the end
            if (typeof position === 'undefined') {
                me.syncApplySequence.push(...data);

                // if position specified
            }
            else {
                let pos = position;
                // if specified the store relative to which we should insert new one(-s)
                if (fromStore) {
                    if (fromStore instanceof Store || typeof fromStore !== 'object') fromStore = me.getStoreDescriptor(fromStore);
                    // get its position
                    pos += me.syncApplySequence.indexOf(fromStore);
                }
                // insert new store(-s)
                //me.syncApplySequence.splice.apply(me.syncApplySequence, [].concat([pos, 0], data));
                me.syncApplySequence.splice(pos, 0, ...data);
            }

            const sequenceKeys = me.syncApplySequence.map(({ storeId }) => storeId);

            me.orderedCrudStores = [...me.syncApplySequence];
            me.crudStores.forEach(storeDesc => {
                if (!sequenceKeys.includes(storeDesc.storeId)) {
                    me.orderedCrudStores.push(storeDesc);
                }
            });
        }

        /**
         * Removes a store from the alternative sync sequence.
         *
         * ```javascript
         * // remove store having storeId equal to "foo"
         * crudManager.removeStoreFromApplySequence("foo");
         * ```
         *
         * @param {CrudManagerStoreDescriptor|String|Core.data.Store} store The store to remove. Either the store
         * descriptor, store identifier or store itself.
         * @category CRUD
         */
        removeStoreFromApplySequence(store) {
            const
                { syncApplySequence } = this,
                foundStore            = this.getStoreDescriptor(store);

            if (syncApplySequence && foundStore) {
                ArrayHelper.remove(syncApplySequence, foundStore);
            }
        }

        hasApplySequenceStore(store) {
            return this.syncApplySequence.some(s => s === store || s.store === store || s.storeId === store);
        }

        //endregion

        //region Events

        // Remove stores that are destroyed, to not try and apply response changes etc. to them
        onCrudStoreDestroy({ source : store }) {
            this.removeCrudStore(store);
        }

        onCrudStoreChange(event) {
            const
                me    = this,
                store = event?.source;

            if (store) {
                const storeDescriptor = me.getStoreDescriptor(store);

                // Check if the store model has finished with id field specifying
                // (it's delayed till the 1st record appearance)
                if (storeDescriptor && !storeDescriptor.idFieldProcessed && store.modelClass.idFieldProcessed) {
                    storeDescriptor.idField = store.modelClass.idField;
                    // mark that id-field is ready
                    storeDescriptor.idFieldProcessed = true;
                }
            }

            if (me.crudIgnoreUpdates) {
                return;
            }

            /**
             * Fires when data in any of the registered data stores is changed.
             * ```javascript
             *     crudManager.on('hasChanges', function (crud) {
             *         // enable persist changes button when some store gets changed
             *         saveButton.enable();
             *     });
             * ```
             *
             * You can suspend this event with {@link #function-suspendChangeTracking} API call.
             *
             * @event hasChanges
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
             */

            if (me.crudStoreHasChanges(event?.source)) {
                me.trigger('hasChanges');

                if (me.autoSync) {
                    me.scheduleAutoSync();
                }
            }
            // Only fire noChanges if no stores have pending changes.
            // The triggering store may not have changes, but other stores might (e.g., filtering
            // resourceStore when eventStore has pending changes should not fire noChanges)
            else if (!me.crudStoreHasChanges()) {
                me.trigger('noChanges');
            }
        }

        /**
         * Suspends automatic sync upon store changes. Can be called multiple times (it uses an internal counter).
         * @category CRUD
         */
        suspendAutoSync() {
            this.autoSyncSuspendCounter++;
            this.forEachCrudStore(store => store.suspendAutoCommit());
        }

        /**
         * Resumes automatic sync upon store changes. Will schedule a sync if the internal counter is 0.
         * @param {Boolean} [doSync=true] Pass `true` to schedule a sync after resuming (if there are pending
         * changes) and `false` to not persist the changes.
         * @category CRUD
         */
        resumeAutoSync(doSync = true) {
            const me = this;

            me.autoSyncSuspendCounter--;

            me.forEachCrudStore(store => store.resumeAutoCommit(doSync));

            if (me.autoSyncSuspendCounter <= 0) {
                me.autoSyncSuspendCounter = 0;

                // if configured to trigger persisting and there are changes
                if (doSync && me.autoSync && me.crudStoreHasChanges()) {
                    me.scheduleAutoSync();
                }
            }
        }

        get isAutoSyncSuspended() {
            return this.autoSyncSuspendCounter > 0;
        }

        scheduleAutoSync() {
            const me = this;

            // add deferred call if it's not scheduled yet
            if (!me.hasTimeout('autoSync') && !me.isAutoSyncSuspended) {
                me.setTimeout({
                    name : 'autoSync',
                    fn   : () => {
                        me.sync().catch(error => {
                            // <debug>
                            if (!me.hasListener('syncFail') && !me.hasListener('requestFail') && !me.onSyncFail && !me.onRequestFail) {
                                console.warn('CrudManager error while auto-syncing the data (please setup "syncFail" or "requestFail" event listeners to handle such cases)\n', error);
                            }
                            // </debug>
                        });
                    },
                    delay : me.autoSyncTimeout
                });
            }
        }

        async triggerFailedRequestEvents(request, response, responseText, fetchOptions, rawResponse) {
            const { options, type : requestType } = request;

            /**
             * Fires when a request fails.
             * @event requestFail
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager instance.
             * @param {'sync'|'load'} requestType The request type (`sync` or `load`).
             * @param {Object} response The decoded server response object.
             * @param {String} responseText The raw server response text
             * @param {Object} responseOptions [DEPRECATED] see `requestOptions`
             * @param {Object} requestOptions The request options passed to the request.
             * @param {Response} rawResponse The native Response object
             */
            this.trigger('requestFail', { requestType, response, responseText, requestOptions : fetchOptions, rawResponse, responseOptions : fetchOptions });
            /**
             * Fires when a {@link #function-load load request} fails.
             * @event loadFail
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager instance.
             * @param {Object} response The decoded server response object.
             * @param {String} responseText The raw server response text
             * @param {Object} responseOptions [DEPRECATED] see `requestOptions`
             * @param {Object} requestOptions The request options passed to the request.
             * @param {Object} options The options provided to the {@link #function-load} method.
             * @param {Response} rawResponse The native Response object
             */
            /**
             * Fires when a {@link #function-sync sync request} fails.
             * @event syncFail
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager instance.
             * @param {Object} response The decoded server response object.
             * @param {String} responseText The raw server response text
             * @param {Object} responseOptions [DEPRECATED] see `requestOptions`
             * @param {Object} requestOptions The request options passed to the request.
             * @param {Response} rawResponse The native Response object
             */
            this.trigger(requestType + 'Fail', { response, requestOptions : fetchOptions, responseText, options, rawResponse, responseOptions : fetchOptions });
        }

        async internalOnResponse(request, responseText, fetchOptions, rawResponse) {
            const
                me                              = this,
                response                        = responseText ? me.decode(responseText) : null,
                { options, type : requestType } = request;

            if (responseText && !response) {
                console.error('Failed to parse response: ' + responseText);
            }

            if (!response || (me.skipSuccessProperty ? response.success === false : !response.success)) {
                me.triggerFailedRequestEvents(request, response, responseText, fetchOptions);
            }
            else if (
                me.trigger('beforeResponseApply', { requestType, response }) !== false &&
                me.trigger(`before${StringHelper.capitalize(requestType)}Apply`, { response, options }) !== false
            ) {
                me.crudRevision = response.revision;

                me.afterSyncAttempt(request);
                await me.applyResponse(request, response, options);

                // Might have been destroyed while applying response
                if (me.isDestroyed) {
                    return;
                }

                /**
                 * Fires on successful request completion after data gets applied to the stores.
                 * @event requestDone
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {'sync'|'load'} requestType The request type (`sync` or `load`).
                 * @param {Object} response The decoded server response object.
                 * @param {Object} responseOptions [DEPRECATED] see `requestOptions`
                 * @param {Object} requestOptions The request options passed to the request.
                 * @param {Response} rawResponse The native Response object
                 */
                me.trigger('requestDone', { requestType, response, requestOptions : fetchOptions, rawResponse, responseOptions : fetchOptions });
                /**
                 * Fires on successful {@link #function-load load request} completion after data gets loaded to the stores.
                 * @event load
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {Object} response The decoded server response object.
                 * @param {Object} responseOptions [DEPRECATED] see `requestOptions`
                 * @param {Object} requestOptions The request options passed to the request.
                 * @param {Object} options The options provided to the {@link #function-load} method.
                 * @param {Response} rawResponse The native Response object
                 */
                /**
                 * Fires on successful {@link #function-sync sync request} completion.
                 * @event sync
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {Object} response The decoded server response object.
                 * @param {Object} responseOptions [DEPRECATED] see `requestOptions`
                 * @param {Object} requestOptions The request options passed to the request.
                 * @param {Response} rawResponse The native Response object
                 */
                me.trigger(requestType, { response, requestOptions : fetchOptions, options, rawResponse, responseOptions : fetchOptions });

                if (requestType === 'load' || !me.crudStoreHasChanges()) {
                    /**
                     * Fires when registered stores get into state when they don't have any
                     * not persisted change. This happens after {@link #function-load} or {@link #function-sync} request
                     * completion. Or this may happen after a record update which turns its fields back to their original state.
                     *
                     * ```javascript
                     * crudManager.on('nochanges', function (crud) {
                     *     // disable persist changes button when there is no changes
                     *     saveButton.disable();
                     * });
                     * ```
                     *
                     * You can suspend this event with {@link #function-suspendChangeTracking} API call.
                     *
                     * @event noChanges
                     * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                     */
                    me.trigger('noChanges');

                    if (requestType === 'load') {
                        me.emitCrudStoreEvents(request.pack.stores, 'afterRequest');
                    }
                }
            }

            return response;
        }

        afterSyncAttempt(request) {
            for (const value of Object.values(request.pack)) {
                // remove the `isBeingMaterialized` flag before applying sync response
                value?.added?.forEach(recordData => recordData.__record__.isBeingMaterialized = false);
            }
        }
        //endregion

        //region Changes tracking

        /**
         * Suspends {@link #event-hasChanges} and {@link #event-noChanges} events.
         *
         * While change tracking is suspended, store filtering and sorting that would normally happen on data changes
         * are deferred too: filter, sort and data operations performed in the meantime are not applied to the stores
         * immediately. They are applied once change tracking is resumed with {@link #function-resumeChangeTracking}.
         * @category CRUD
         */
        suspendChangeTracking() {
            this.crudIgnoreUpdates++;

            this.crudStores.forEach(({ store }) => {
                store.suspendFilterOnUpdate();
                store.suspendSortOnUpdate();
            });
        }

        /**
         * Resumes {@link #event-hasChanges} and {@link #event-noChanges} events. By default, it will check for changes
         * and if there are any, `hasChanges` or `noChanges` event will be triggered.
         * @param {Boolean} [skipChangeCheck]
         * @category CRUD
         */
        resumeChangeTracking(skipChangeCheck) {
            this.crudStores.forEach(({ store }) => {
                store.resumeFilterOnUpdate();
                store.resumeSortOnUpdate();
            });

            if (this.crudIgnoreUpdates && !--this.crudIgnoreUpdates && !skipChangeCheck) {
                this.onCrudStoreChange();
            }
        }

        /**
         * Returns `true` if changes tracking is suspended
         * @member {Boolean}
         * @readonly
         * @category CRUD
         */
        get isChangeTrackingSuspended() {
            return this.crudIgnoreUpdates > 0;
        }

        /**
         * Returns `true` if any of registered stores (or some particular store) has non persisted changes.
         *
         * ```javascript
         * // if we have any unsaved changes
         * if (crudManager.crudStoreHasChanges()) {
         *     // persist them
         *     crudManager.sync();
         * // otherwise
         * } else {
         *     alert("There are no unsaved changes...");
         * }
         * ```
         *
         * @param {String|Core.data.Store} [storeId] The store identifier or store instance to check changes for.
         * If not specified then will check changes for all of the registered stores.
         * @returns {Boolean} `true` if there are not persisted changes.
         * @category CRUD
         */
        crudStoreHasChanges(storeId) {
            return storeId
                ? this.isCrudStoreDirty(this.getCrudStore(storeId))
                : this.crudStores.some(config => this.isCrudStoreDirty(config.store));
        }

        isCrudStoreDirty(store) {
            return store.hasChanges;
        }

        //endregion

        //region Load

        doAutoLoad() {
            return this.load().catch(error => {
                // <debug>
                if (!this.isDestroyed && !this.hasListener('loadFail') && !this.hasListener('requestFail')) {
                    console.warn('CrudManager error while auto-loading the data (please setup "loadFail" or "requestFail" event listeners to handle such cases)\n', error);
                }
                // </debug>
            });
        }

        emitCrudStoreEvents(stores, eventName, eventParams) {
            const event = { action : 'read' + eventName, ...eventParams };

            for (const store of this.crudStores) {
                if (stores.includes(store.storeId)) {
                    store.store.trigger(eventName, event);
                }
            }
        }

        getLoadPackage(options) {
            const
                pack        = {
                    type      : 'load',
                    requestId : this.requestId
                },
                stores      = this.crudStores,
                optionsCopy = { ...options };

            // This is a special option which does not apply to a store.
            // It's used as options to the AjaxTransport#sendRequest method
            delete optionsCopy.request;

            pack.stores = stores.map(store => {
                const
                    opts    = optionsCopy?.[store.storeId],
                    isPaged = store.isPaged || store.store?.isPaged;

                // <remove-on-release>
                // TODO: PORT currently no support for remote filters
                // if the store uses remote filtering
                // if (store.store.remoteFilter && filterParam) {
                //
                //     opts = opts || {};
                //
                //     var filters = [];
                //
                //     store.store.getFilters().each(function(f) {
                //         filters.push(f.serialize());
                //     });
                //
                //     // put filters info into the package
                //     opts[filterParam] = filters;
                // }
                // TODO: PORT currently no support for paging
                // </remove-on-release>
                if (opts || isPaged) {
                    const
                        pageSize = store.pageSize ?? store.store?.pageSize,
                        params   = {
                            storeId : store.storeId,
                            page    : 1,
                            ...opts
                        };

                    if (pageSize) {
                        params.pageSize = pageSize;
                    }

                    store.currentPage = params.page;

                    // Remove from common request options
                    if (opts) {
                        delete optionsCopy[store.storeId];
                    }

                    return params;
                }

                return store.storeId;
            });

            // Apply common request options
            Object.assign(pack, optionsCopy);

            return pack;
        }

        loadCrudStore(store, data, options) {
            const rows = data?.rows;

            if (options?.append || data?.append) {
                // Add records clean - that is they are not treated as new, syncable records
                // which need syncing with the server. They are *from* the server.
                store.add(rows, false, { clean : true });
            }
            else {
                store.data = rows;
            }

            store.trigger('load', { data : rows });
        }

        loadDataToCrudStore(storeDesc, data, options) {
            const
                store = storeDesc.store,
                rows  = data?.rows;

            store.__loading = true;

            if (rows) {
                this.loadCrudStore(store, data, options, storeDesc);
            }

            store.__loading = false;
        }

        /**
         * Loads data to the Crud Manager
         * @param {Object} response A simple object representing the data.
         * The object structure matches the decoded `load` response structure:
         *
         * ```javascript
         * // load static data into crudManager
         * crudManager.loadCrudManagerData({
         *     success   : true,
         *     resources : {
         *         rows : [
         *             { id : 1, name : 'John' },
         *             { id : 2, name : 'Abby' }
         *         ]
         *     }
         * });
         * ```
         * @param {Object} [options] Extra data loading options.
         * @category CRUD
         */
        async loadCrudManagerData(response, options = {}, ...args) {
            this.doBeforeLoadCrudManagerData(response, options, ...args);

            // "internalLoadCrudManagerData" in this class is sync
            // but subclasses can and make it async
            await this.internalLoadCrudManagerData(response, options, ...args);

            this.doAfterLoadCrudManagerData?.(response, options, ...args);
        }

        doBeforeLoadCrudManagerData(response, options) {
            this.trigger('beforeLoadCrudManagerData', { response, options });

            // we don't want to react to store changes during loading of them
            this.suspendChangeTracking();
        }

        internalLoadCrudManagerData(response, options = {}) {
            // we load data to the stores in the order they're kept in this.stores array
            this.crudStores.forEach(storeDesc => {
                const
                    { storeId } = storeDesc,
                    data        = response[storeId];

                if (data) {
                    this.loadDataToCrudStore(storeDesc, data, options[storeId]);
                }
            });
        }

        doAfterLoadCrudManagerData(response, options) {
            this.resumeChangeTracking(true);

            this.trigger('loadCrudManagerData', { response, options });
        }

        /**
         * Returns true if the crud manager is currently loading data
         * @member {Boolean}
         * @readonly
         * @category CRUD
         */
        get isCrudManagerLoading() {
            return Boolean(this.activeRequests.load || this.applyingLoadResponse);
        }

        /**
         * Returns true if the crud manager is currently syncing data
         * @member {Boolean}
         * @readonly
         * @category CRUD
         */
        get isCrudManagerSyncing() {
            return Boolean(this.activeRequests.sync || this.applyingSyncResponse);
        }

        get isLoadingOrSyncing() {
            return Boolean(this.isCrudManagerLoading || this.isCrudManagerSyncing);
        }

        /**
         * Loads data to the stores registered in the crud manager. For example:
         *
         * ```javascript
         * crudManager.load(
         *     // here are request parameters
         *     {
         *         store1 : { append : true, page : 3, smth : 'foo' },
         *         store2 : { page : 2, bar : '!!!' }
         *     }
         * ).then(
         *     () => alert('OMG! It works!'),
         *     ({ response, cancelled }) => console.log(`Error: ${cancelled ? 'Cancelled' : response.message}`)
         * );
         * ```
         *
         * ** Note: ** If there is an incomplete load request in progress then system will try to cancel it by calling {@link #function-cancelRequest}.
         * @param {Object|String} [options] The request parameters or a URL.
         * @param {Object} [options.request] An object which contains options to merge
         * into the options which are passed to {@link Scheduler/crud/transport/AjaxTransport#function-sendRequest}.
         * ```javascript
         * {
         *     store1 : { page : 3, append : true, smth : 'foo' },
         *     store2 : { page : 2, bar : '!!!' },
         *     request : {
         *         params : {
         *             startDate : '2021-01-01'
         *         }
         *     }
         * },
         * ```
         *
         * Omitting request arg:
         * ```javascript
         * crudManager.load().then(
         *     () => alert('OMG! It works!'),
         *     ({ response, cancelled }) => console.log(`Error: ${cancelled ? 'Cancelled' : response.message}`)
         * );
         * ```
         *
         * When presented it should be an object where keys are store Ids and values are, in turn, objects
         * of parameters related to the corresponding store. These parameters will be transferred in each
         * store's entry in the `stores` property of the POST data.
         *
         * Additionally, for flat stores `append: true` can be specified to add loaded records to the existing records,
         * default is to remove corresponding store's existing records first.
         * **Please note** that for delta loading you can also use an {@link #config-trackResponseType alternative approach}.
         * @param {'sync'|'load'} [options.request.type] The request type. Either `load` or `sync`.
         * @param {String} [options.request.url] The URL for the request. Overrides the URL defined in the `transport`
         * object
         * @param {HttpMethod} [options.request.method] The HTTP method to use for this request. Overrides the method
         * defined in the `transport` config for the request type
         * @param {String} [options.request.data] The encoded _Crud Manager_ request data.
         * @param {Object} [options.request.params] An object specifying extra HTTP params to send with the request.
         * @param {Function} [options.request.success] A function to be started on successful request transferring.
         * @param {String} [options.request.success.rawResponse] `Response` object returned by the
         * [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
         * @param {Function} [options.request.failure] A function to be started on request transfer failure.
         * @param {String} [options.request.failure.rawResponse] `Response` object returned by the
         * [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
         * @param {Object} [options.request.thisObj] `this` reference for the above `success` and `failure` functions.
         * @returns {Promise} Promise, which is resolved if request was successful.
         * Both the resolve and reject functions are passed a `state` object. State object has following structure:
         *
         * ```
         * {
         *     response    : Object,   // processed response in form of object
         *     rawResponse : Response, // the native Response object returned by the fetch api
         *     responseText : String,  // raw response text as String from the request
         *     request     : Object    // the request descriptor object
         * }
         * ```
         *
         * If promise was rejected by {@link #event-beforeLoad} event, `state` object will have the following structure:
         *
         * ```
         * {
         *     cancelled : true
         * }
         * ```
         * @ts-returns {Promise<CrudManagerLoadResult>}
         * @category CRUD
         * @async
         */
        load(options) {
            if (typeof options === 'string') {
                options = {
                    request : {
                        url : options
                    }
                };
            }

            const
                me   = this,
                pack = me.getLoadPackage(options);

            me._autoLoadPromise = null;

            return new Promise((resolve, reject) => {
                /**
                 * Fires before {@link #function-load load request} is sent. Return `false` to cancel load request.
                 * @event beforeLoad
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {Object} pack The data package which contains data for all stores managed by the crud manager.
                 * @preventable
                 */
                if (me.trigger('beforeLoad', { pack }) !== false) {
                    // if another load request is in progress let's cancel it
                    const { load } = me.activeRequests;

                    if (load) {
                        me.cancelRequest(load.desc, load.reject);

                        me.trigger('loadCanceled', { pack });
                    }

                    // <remove-on-release>
                    // TODO: refactor this
                    // </remove-on-release>
                    const request = Objects.assign({
                        id      : pack.requestId,
                        data    : me.encode(pack),
                        type    : 'load',
                        success : me.onCrudRequestSuccess,
                        failure : me.onCrudRequestFailure,
                        thisObj : me
                    }, options?.request);

                    me.activeRequests.load = {
                        type : 'load',
                        options,
                        pack,
                        resolve,
                        reject(...args) {
                            // sendRequest will start a fetch promise, which we cannot reject from here. In fact what we
                            // need to do, is to make fetch.then() to not call any real handlers. Which is what we do here.
                            request.success = request.failure = null;
                            if (!args[0]?.cancelled) {
                                reject(...args);
                            }
                        },
                        id   : pack.requestId,
                        desc : me.sendRequest(request)
                    };

                    me.emitCrudStoreEvents(pack.stores, 'loadStart');

                    me.trigger('loadStart', { pack });
                }
                else {
                    /**
                     * Fired after {@link #function-load load request} was canceled by some {@link #event-beforeLoad}
                     * listener or due to incomplete prior load request.
                     * @event loadCanceled
                     * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                     * @param {Object} pack The data package which contains data for all stores managed by the crud
                     * manager.
                     */
                    me.trigger('loadCanceled', { pack });
                    reject({ cancelled : true });
                }
            });
        }

        getActiveCrudManagerRequest(requestType) {
            let request = this.activeRequests[requestType];

            if (!request && this.trackResponseType) {
                request = Object.values(this.activeRequests)[0];
            }

            return request;
        }

        //endregion

        //region Changes (prepare, process, get)

        prepareAddedRecordData(record, storeInfo) {
            const
                me                   = this,
                { store }            = storeInfo,
                { isTree }           = store,
                phantomIdField       = storeInfo.phantomIdField || me.phantomIdField,
                phantomParentIdField = storeInfo.phantomParentIdField || me.phantomParentIdField,
                subStoreFields       = store.modelClass.allFields.filter(field => field.subStore),
                cls                  = record.constructor,
                data                 = Object.assign(record.persistableData, {
                    [phantomIdField] : record.id
                });

            // We return record fields with embedded phantomId field. Clearly the record is phantom, so we need to
            // raise a flag to make `isPhantom` accessor work on the parent node to fill phantomParentId field.
            // Covered by TaskRemove.t
            record.$isPhantom = true;

            if (isTree) {
                const { parent } = record;

                // <remove-on-release>
                // TODO review phantomParentId field usage
                // </remove-on-release>
                if (parent && !parent.isRoot && parent.isPhantom) {
                    data[phantomParentIdField] = parent.id;
                }
            }

            if (me.resetIdsBeforeSync) {
                ObjectHelper.deletePath(data, cls.idField);
            }

            // If we have store fields that should be persisted w/ Crud Manager protocol
            subStoreFields.forEach(field => {
                // A `lazy` sub-store may not be created yet - then there is nothing to serialize
                const subStore = record.get(field.name);

                if (subStore?.totalCount) {
                    data[field.dataSource] = {
                        added : subStore.getRange()
                            .map(record => me.prepareAddedRecordData(record, { store : subStore }))
                    };
                }
            });

            Object.defineProperty(data, '__record__', { value : record, enumerable : false });

            return data;
        }

        prepareAdded(list, storeInfo) {
            return list.filter(record => record.isValid).map(record => this.prepareAddedRecordData(record, storeInfo));
        }

        prepareUpdated(list, storeInfo) {
            const
                { store }            = storeInfo,
                { isTree }           = store,
                writeAllFields       = storeInfo.writeAllFields || (storeInfo.writeAllFields !== false && this.writeAllFields),
                phantomParentIdField = storeInfo.phantomParentIdField || this.phantomParentIdField,
                subStoreFields       = store.modelClass.allFields.filter(field => field.subStore);

            // <remove-on-release>
            // TODO: root node included into store.modified need to get rid of it since we don't persist it
            // </remove-on-release>
            if (isTree) {
                const rootNode = storeInfo.store.rootNode;
                list = list.filter(record => record !== rootNode);
            }

            return list.filter(record => record.isValid).reduce((data, record) => {
                let recordData;

                // write all fields
                if (writeAllFields) {
                    recordData = record.persistableData;
                }
                else {
                    recordData = record.modificationDataToWrite;
                }

                if (isTree) {
                    const { parent } = record;

                    // <remove-on-release>
                    // TODO review phantomParentId field usage
                    // </remove-on-release>
                    if (parent && !parent.isRoot && parent.isPhantom) {
                        recordData[phantomParentIdField] = parent.id;
                    }
                }

                // If we have store fields that should be persisted w/ Crud Manager protocal
                subStoreFields.forEach(field => {
                    // A `lazy` sub-store may not be created yet - then it has no changes to serialize
                    const subStore = record.get(field.name);

                    if (subStore) {
                        recordData[field.dataSource] = this.getCrudStoreChanges({ store : subStore });
                    }
                });

                // recordData can be null
                if (!ObjectHelper.isEmpty(recordData)) {
                    data.push(recordData);
                }

                return data;
            }, []);
        }

        prepareRemoved(list, { store }) {
            let removedRecords;

            if (!this.includeChildrenInRemoveRequest) {
                removedRecords = [];

                for (const record of list) {
                    // parentId gets set to null on direct removal (not on parent removal)
                    const parentId = record.parentId ?? record.meta.modified?.parentId;

                    // If the parent is also removed, don't send the child
                    if (parentId != null && (parentId === store.rootNode.id || !list.some(r => r.id === parentId))) {
                        removedRecords.push(record);
                    }
                }
            }
            else {
                removedRecords = list;
            }

            return removedRecords.map(record => ObjectHelper.setPath({}, record.constructor.idField, record.id));
        }

        getCrudStoreChanges(storeDescriptor) {
            const { store } = storeDescriptor;

            let { added = [], modified : updated = [], removed = [] } = (store.changes || {}),
                result;

            if (added.length) {
                added = this.prepareAdded(added, storeDescriptor);
            }
            // if we have any records, that have been modified during their materialization process -
            // add them to the `updated` list, this will ensure, that we issue a second sync
            // request after the initial syncing is complete
            if (updated.length || store.modifiedMaterialized?.size) {
                updated = this.prepareUpdated(
                    [...updated, ...(store.modifiedMaterialized ?? [])],
                    storeDescriptor
                );
            }
            if (removed.length) {
                removed = this.prepareRemoved(removed, storeDescriptor);
            }

            // if this store has changes
            if (added.length || updated.length || removed.length) {
                result = {};

                if (added.length) result.added = added;
                if (updated.length) result.updated = updated;
                if (removed.length) result.removed = removed;
            }

            return result;
        }

        getChangesetPackage() {
            const { changes } = this;

            return changes || this.forceSync
                ? {
                    type      : 'sync',
                    requestId : this.requestId,
                    revision  : this.crudRevision,
                    ...changes
                } : null;
        }

        //endregion

        //region Apply

        /**
         * Returns current changes as an object consisting of added/modified/removed arrays of records for every
         * managed store, keyed by each store's `id`. Returns `null` if no changes exist. Format:
         *
         * ```javascript
         * {
         *     resources : {
         *         added    : [{ name : 'New guy' }],
         *         modified : [{ id : 2, name : 'Mike' }],
         *         removed  : [{ id : 3 }]
         *     },
         *     events : {
         *         modified : [{  id : 12, name : 'Cool task' }]
         *     },
         *     ...
         * }
         * ```
         *
         * @member {Object}
         * @readonly
         * @category CRUD
         */
        get changes() {
            const data = {};

            this.crudStores.forEach(store => {
                const changes = this.getCrudStoreChanges(store);

                if (changes) {
                    data[store.storeId] = changes;
                }
            });

            return Object.keys(data).length > 0 ? data : null;
        }

        /**
         * Compares two field values using the field's own isEqual method when available.
         *
         * @param {Core.data.field.DataField} field The field definition
         * @param {*} value The first value to compare
         * @param {*} assertedValue The second value to compare
         * @param {Core.data.Model} [record] The record the field belongs to, forwarded to the field's `isEqual`
         * @returns {Boolean} True if values are equal
         * @private
         */
        isFieldValueEqual(field, value, assertedValue, record) {
            return field?.isEqual ? field.isEqual(value, assertedValue, record) : ObjectHelper.isEqual(value, assertedValue);
        }

        processRecordResponse(
            storeDescriptor,
            record,
            recordResponse,
            recordRequestPathified,
            recordResponsePathified,
            localChanges
        ) {
            const
                syncConflictResolution = storeDescriptor.syncConflictResolution || this.syncConflictResolution,
                { fieldDataSourceMap } = storeDescriptor.store.modelClass,
                {
                    idField,
                    phantomIdField = this.phantomIdField
                }                      = storeDescriptor;

            let result = {};

            // If we respect existing local changes
            if (syncConflictResolution === 'local') {
                // ..process records one by one
                for (const [key, incomingValue] of Object.entries(recordResponsePathified)) {
                    let skipField = false;
                    const field = fieldDataSourceMap[key];

                    // - process real field response
                    // - always include PhantomId value (applyChangeset needs it to address phantom records)
                    if (field && key !== phantomIdField && (record || localChanges)) {
                        const localValue = record ? record.getFieldPersistentValue(field) : localChanges[key];

                        let
                            isValueSent = key in recordRequestPathified,
                            sentValue   = recordRequestPathified[key];

                        // For "id" field we could use phantomIdField name (when sending a phantom record)
                        if (key === idField && recordRequestPathified[phantomIdField]) {
                            isValueSent = isValueSent || (phantomIdField in recordRequestPathified);
                            sentValue = recordRequestPathified[phantomIdField];
                        }

                        // Check if sentValue equals localValue, accounting for phantom-to-real ID mapping.
                        // When a phantom ID (e.g., _generatedXYZ) was sent and the referenced record
                        // received its real ID (e.g., 100) during this sync, the localValue will already
                        // be the real ID. We need to treat them as equal.
                        // See https://github.com/bryntum/bryntum/issues/12150
                        let sentEqualsLocal = this.isFieldValueEqual(field, sentValue, localValue, record);

                        if (!sentEqualsLocal) {
                            const mappedRealId = this.resolvePhantomId(sentValue);

                            if (mappedRealId != null && this.isFieldValueEqual(field, mappedRealId, localValue, record)) {
                                sentEqualsLocal = true;
                            }
                        }

                        // Skip the remote field response if:
                        skipField =
                            // - local value has changed during the request (its current value !== value sent in the request)
                            (isValueSent && !sentEqualsLocal) ||
                            // - remote value === current value (ignore meaningless noise)
                            (key !== idField && this.isFieldValueEqual(field, incomingValue, localValue, record));
                    }

                    // use value if we haven't decided to skip it
                    if (!skipField) {
                        ObjectHelper.setPath(result, key, incomingValue);
                    }
                }
            }
            // use response as is if don't respect local changes
            else {
                result = recordResponse;
            }

            return result;
        }

        getRecordChangesToClear(storeDescriptor, recordRequestPathified, recordResponse, localChanges, record = null) {
            const
                { store }              = storeDescriptor,
                { fieldDataSourceMap } = store.modelClass,
                parentIdField          = store.isTree && store.modelClass.parentIdField;

            let
                hasChanges = false,
                result;

            // if got local changes
            if (localChanges) {
                result = {};

                // collect changes sent w/ request to clear them
                for (const [key, requestValue] of Object.entries(recordRequestPathified)) {
                    let field = fieldDataSourceMap[key];

                    // parentId is not a real field but we should commit it too
                    // so handling this case manually
                    if (!field && key === parentIdField) {
                        field = { name : 'parentId' };
                    }

                    // We clear dirty state of real fields that are dirty
                    if (field && key in localChanges) {
                        const localValue = localChanges[key];

                        // Check if request value equals local value, accounting for phantom-to-real ID mapping.
                        // See https://github.com/bryntum/bryntum/issues/12150
                        let requestEqualsLocal = this.isFieldValueEqual(field, requestValue, localValue, record);

                        if (!requestEqualsLocal) {
                            const mappedRealId = this.resolvePhantomId(requestValue);

                            if (mappedRealId != null && this.isFieldValueEqual(field, mappedRealId, localValue, record)) {
                                requestEqualsLocal = true;
                            }
                        }

                        // If the request value still equals the current value
                        // (the value hasn't changed during the request)
                        // or it was changed by the server
                        if (
                            requestEqualsLocal ||
                            recordResponse && this.isFieldValueEqual(field, localValue, recordResponse[key], record)
                        ) {
                            result[field.name] = record ? record[field.name] : true;
                            hasChanges = true;
                        }
                    }
                }
            }

            return hasChanges ? result : null;
        }

        processStoreResponse(storeDescriptor, storeResponse, storeRequest) {
            const
                me                                                     = this,
                { supportShortSyncResponse }                           = me,
                { idField, store, phantomIdField = me.phantomIdField } = storeDescriptor,
                // request data
                {
                    addedMap   : requestAddedMap,
                    updatedMap : requestUpdatedMap,
                    removedMap : requestRemovedMap
                }                                                      = me.buildStoreSyncRequestMaps(storeDescriptor, storeRequest, storeResponse),
                responseRowsMap                                        = new Map(),
                clearChanges                                           = new Map(),
                added                                                  = [],
                updated                                                = [],
                recordIdsToRemove                                      = new Set();

            // for each responded record data (if any)
            for (const recordResponse of storeResponse?.rows || []) {
                const
                    id                      = ObjectHelper.getPath(recordResponse, idField),
                    phantomId               = ObjectHelper.getPath(recordResponse, phantomIdField),
                    recordRequest           = requestAddedMap.get(phantomId) || requestUpdatedMap.get(id),
                    record                  = store.getById(phantomId || id) || store.removed.get(phantomId || id),
                    localChanges            = record?.modificationDataToWrite,
                    recordRequestPathified  = ObjectHelper.pathifyKeys(recordRequest),
                    recordResponsePathified = ObjectHelper.pathifyKeys(recordResponse),
                    processedRecordResponse = me.processRecordResponse(
                        storeDescriptor,
                        record,
                        recordResponse,
                        recordRequestPathified,
                        recordResponsePathified,
                        localChanges
                    );

                if (processedRecordResponse) {
                    // both phantom & real id could miss - that should result adding a phantom record
                    if (id) {
                        responseRowsMap.set(id, processedRecordResponse);
                    }
                    if (phantomId) {
                        responseRowsMap.set(phantomId, processedRecordResponse);
                    }

                    // Prepare changes for call: store.applyChangeset({ removed, added, updated })
                    // existing records are passed to updated
                    if (record) {
                        updated.push(processedRecordResponse);
                    }
                    // no record - means we should add it
                    else {
                        added.push(processedRecordResponse);
                    }
                }
            }

            // Collect fields we should commit from the request
            for (const recordRequest of [...requestAddedMap.values(), ...requestUpdatedMap.values()]) {
                const
                    phantomId = ObjectHelper.getPath(recordRequest, phantomIdField),
                    id        = ObjectHelper.getPath(recordRequest, idField),
                    record    = store.getById(phantomId || id) || store.removed.get(phantomId || id),
                    recordResponse = responseRowsMap.get(id) || responseRowsMap.get(phantomId);

                // record exists
                if (record &&
                    // short requests enabled or the record is responded
                    (supportShortSyncResponse || responseRowsMap.has(id) || responseRowsMap.has(phantomId))
                ) {
                    clearChanges.set(record,
                        me.getRecordChangesToClear(
                            storeDescriptor,
                            ObjectHelper.pathifyKeys(recordRequest),
                            recordResponse,
                            record.modificationDataToWrite,
                            record
                        )
                    );
                }
            }

            // Check record removals
            for (const recordData of [
                ...(storeResponse?.removed || []),
                // w/ short sync responses enabled we commit requested removals on any successful response
                ...(me.supportShortSyncResponse ? requestRemovedMap.values() : [])
            ]) {
                const id = ObjectHelper.getPath(recordData, idField);

                // We accept a record removal if the record is in the store or in its "removed" stash
                // and the record is not responded as added/updated by the server
                if ((store.getById(id) || store.removed.includes(id)) && !responseRowsMap.has(id)) {
                    recordIdsToRemove.add(id);
                }
            }

            return {
                added,
                updated,
                removed : [...recordIdsToRemove].map(id => ({ [idField] : id })),
                clearChanges
            };
        }

        buildStoreSyncRequestMaps(
            { idField, phantomIdField = this.phantomIdField },
            storeRequest
        ) {
            const
                addedMap   = new Map(),
                updatedMap = new Map(),
                removedMap = new Map();

            if (storeRequest) {
                for (const requestRecord of storeRequest.added || []) {
                    const phantomId = ObjectHelper.getPath(requestRecord, phantomIdField);

                    addedMap.set(phantomId, requestRecord);
                }

                for (const requestRecord of storeRequest.updated || []) {
                    const id = ObjectHelper.getPath(requestRecord, idField);

                    updatedMap.set(id, requestRecord);
                }

                for (const requestRecord of storeRequest.removed || []) {
                    const id = ObjectHelper.getPath(requestRecord, idField);

                    removedMap.set(id, requestRecord);
                }
            }

            return {
                addedMap,
                updatedMap,
                removedMap
            };
        }

        applyChangesToStore(storeDescriptor, storeResponse, storeRequest) {
            const
                me             = this,
                phantomIdField = storeDescriptor.phantomIdField || me.phantomIdField,
                { store }      = storeDescriptor,
                { modelClass } = store,
                idField        = modelClass.getFieldDataSource('id'),
                subStoreFields = modelClass.allFields.filter(field => field.subStore),
                // collect records we need to process
                {
                    added,
                    updated,
                    removed,
                    clearChanges
                }              = me.processStoreResponse(storeDescriptor, storeResponse, storeRequest);

            const extraLogEntries = [];

            // Handle sub-stores (if any)
            if (updated.length && subStoreFields.length) {

                for (const updateData of updated) {
                    const
                        record        = store.getById(updateData[phantomIdField] ?? updateData[idField]),
                        // find the request portion related to the record
                        recordRequest = storeRequest && (storeRequest.added?.find(t => t[phantomIdField] == updateData[phantomIdField]) ||
                            storeRequest.updated?.find(t => t[idField] == updateData[idField])),
                        extraLogInfo  = {};

                    for (const field of subStoreFields) {
                        const { dataSource } = field;

                        // Nothing for this sub-store in the response - skip, so a `lazy` store with no data
                        // is not force-created just to apply an empty changeset. Still drop the key, or an
                        // explicit `null` reaches `applyChangeset` below as a plain field and wipes the sub-store
                        if (updateData[dataSource] == null) {
                            delete updateData[dataSource];
                            continue;
                        }

                        // There IS data to apply, so the record genuinely uses this sub-store - create it on
                        // demand for `lazy` fields, otherwise read the existing one. Deliberately not the public
                        // accessor: a chrono sub-store field's accessor reads the graph, not `meta[fieldStore]`
                        const
                            subStore     = field.getOrCreateStore(record),
                            // build store descriptor as it happens for all registered crud stores
                            subStoreDesc = me.fillStoreDescriptor({ store : subStore });

                        me.applyChangesToStore(subStoreDesc, updateData[dataSource],
                            recordRequest?.[dataSource]
                        );

                        // We're putting the store field entry to the log
                        // just to indicate the fact it was actually changed.
                        // The value will not be used for comparison so we can use any.
                        extraLogInfo[dataSource] = 'foo';

                        delete updateData[dataSource];
                    }

                    extraLogEntries.push([record, extraLogInfo]);
                }
            }

            let log;

            if (removed.length || added.length || updated.length) {
                // process added/updated records
                log = store.applyChangeset({ removed, added, updated }, null, phantomIdField, true, true);
            }

            extraLogEntries.forEach(([record, logEntry]) => Object.assign(log.get(record.id), logEntry));

            // Clear record modified bags
            for (const [id, changesToClear] of clearChanges) {
                if (changesToClear) {
                    const record = id.isModel ? id : store.getById(id);

                    record.internalClearChanges(false, true, changesToClear);
                }
            }

            store.trigger('appliedCrudChangesToStore', { crudManager : me });

            return log;
        }

        /**
         * Builds phantom-to-real ID maps from the sync response for each store descriptor.
         * Each store descriptor gets its own `phantomToRealIdMap` property mapping phantom IDs
         * to real IDs assigned by the server.
         *
         * This is needed to correctly compare sent values (which may contain phantom IDs)
         * with local values (which may have been updated to real IDs by earlier store processing).
         * See https://github.com/bryntum/bryntum/issues/12150
         *
         * @param {Object} response The sync response
         * @private
         */
        fillPhantomIdMaps(response) {
            const { orderedCrudStores, phantomIdField } = this;

            for (const storeDescriptor of orderedCrudStores) {
                const
                    storeResponse     = response[storeDescriptor.storeId],
                    storePhantomField = storeDescriptor.phantomIdField || phantomIdField,
                    { idField }       = storeDescriptor,
                    map               = new Map();

                for (const row of storeResponse?.rows || []) {
                    const
                        phantomId = ObjectHelper.getPath(row, storePhantomField),
                        realId    = ObjectHelper.getPath(row, idField);

                    if (phantomId != null && realId != null && phantomId !== realId) {
                        map.set(phantomId, realId);
                    }
                }

                storeDescriptor.phantomToRealIdMap = map;
            }
        }

        /**
         * Looks up a phantom ID across all store descriptors' phantom-to-real ID maps.
         * Returns the real ID if found, or `undefined` if not.
         *
         * @param {String|Number} phantomId The phantom ID to resolve
         * @returns {String|Number|undefined} The real ID, or `undefined` if not found
         * @private
         */
        resolvePhantomId(phantomId) {
            for (const storeDescriptor of this.orderedCrudStores) {
                const realId = storeDescriptor.phantomToRealIdMap?.get(phantomId);

                if (realId != null) {
                    return realId;
                }
            }
        }

        doBeforeApplySyncResponse(response, options) {
            this.trigger('beforeSyncCrudManagerData', { response, options });

            this.suspendAutoSync();
            this.suspendChangeTracking();

            this.fillPhantomIdMaps(response);
        }

        internalApplySyncResponse(response, request) {
            const
                {
                    orderedCrudStores,
                    supportShortSyncResponse
                } = this;

            for (const storeDescriptor of orderedCrudStores) {
                const storeResponse = response[storeDescriptor.storeId];

                // if got response for the store
                if (storeResponse || supportShortSyncResponse) {
                    this.applyChangesToStore(storeDescriptor, storeResponse, request?.pack?.[storeDescriptor.storeId]);
                }
            }
        }

        doAfterApplySyncResponse(response, options) {
            this.resumeAutoSync(false);
            this.resumeChangeTracking(true);

            // Clean up phantom-to-real ID maps populated by `fillPhantomIdMaps`.
            // See https://github.com/bryntum/bryntum/issues/12150
            for (const storeDescriptor of this.orderedCrudStores) {
                storeDescriptor.phantomToRealIdMap = null;
            }

            this.trigger('syncCrudManagerData', { response, options });
        }

        async applySyncResponse(response, request, ...args) {
            const me = this;

            me.applyingChangeset = me.applyingSyncResponse = true;

            me.doBeforeApplySyncResponse(response, request, ...args);

            // "internalApplySyncResponse" in this class is sync
            // but subclasses can and make it async
            await me.internalApplySyncResponse(response, request, ...args);

            me.doAfterApplySyncResponse?.(response, request, ...args);

            me.applyingChangeset = me.applyingSyncResponse = false;
        }

        async applyLoadResponse(response, options) {
            this.applyingLoadResponse = true;

            await this.loadCrudManagerData(response, options);

            this.applyingLoadResponse = false;
        }

        async applyResponse(request, response, options) {
            const
                me = this,
                // in trackResponseType mode we check response type before deciding how to react on the response
                responseType = me.trackResponseType && response.type || request.type,
                { applyingResponse } = me;

            me.applyingResponse = true;

            me.trigger('beforeApplyResponse', { request, response, options });

            switch (responseType) {
                case 'load' :
                    if (me.validateResponse) {
                        me.validateLoadResponse(response, options);
                    }

                    await me.applyLoadResponse(response, options);
                    break;
                case 'sync' :
                    if (me.validateResponse) {
                        me.validateSyncResponse(response, request);
                    }

                    await me.applySyncResponse(response, request);
                    break;
            }

            // Trigger if we did not get destroyed while waiting above
            me.trigger?.('applyResponse', { request, response, options });

            me.applyingResponse = applyingResponse;
        }

        /**
         * Applies a set of changes, as an object keyed by store id, to the affected stores. This function is intended
         * to use in apps that handle their own data syncing, it is not needed when using the CrudManager approach.
         *
         * Example of a changeset:
         * ```javascript
         * project.applyChangeset({
         *     events : {
         *         added : [
         *             { id : 10, name : 'Event 10', startDate : '2022-06-07' }
         *         ],
         *         updated : [
         *             { id : 5, name : 'Changed' }
         *         ],
         *         removed : [
         *             { id : 1 }
         *         ]
         *     },
         *     resources : { ... },
         *     ...
         * });
         * ```
         *
         * Optionally accepts a `transformFn` to convert an incoming changeset to the expected format.
         * See {@link Core/data/Store#function-applyChangeset} for more details.
         *
         * Setting `clearChanges` param to `false` will result in restoring the changes on the store applied
         * using the `applyChangeset` method. By default, it has been set to `true` to clear all the applied
         * changes on the store.
         *
         * For example, following will restore the changes on the store:
         *
         * ```javascript
         * // Apply these changes using the applyChangeset method
         * project.applyChangeset({
         *     events : {
         *         added : [
         *             { id : 10, name : 'Event 10', startDate : '2022-06-07' }
         *         ],
         *         updated : [
         *             { id : 5, name : 'Changed' }
         *         ],
         *         removed : [
         *             { id : 1 }
         *         ]
         *     },
         *     resources : { ... },
         *     ...
         * }, null, '$PhantomId', false);
         * ```
         *
         * <div class="note">
         * On the Enterprise tier of Scheduler, and in Gantt, when
         * {@link Scheduler/crud/AbstractCrudManagerMixin#config-autoSync} is enabled, and client wants to apply changes
         * without triggering a sync request, <b>applyProjectChanges</b> method should be used instead of this. It helps
         * maintain current behavior while providing flexibility for scenarios where syncing is not required.
         * </div>
         *
         * @param {Object} changes Changeset to apply, an object keyed by store id where each value follows the
         * format described in {@link Core/data/Store#function-applyChangeset}
         * @param {Function} [transformFn] Optional function used to preprocess a changeset per store in a different
         * format, should return an object with the format expected by {@link Core/data/Store#function-applyChangeset}
         * @param {String} [phantomIdField] Field used by the backend when communicating a record being assigned a
         * proper id instead of a phantom id
         * @param {Boolean} [clearChanges] Set to `false` to not preserve the applied changes on the record
         * @category CRUD
         */
        applyChangeset(changes, transformFn = null, phantomIdField = '$PhantomId', clearChanges = true, logChanges = false) {
            const
                me  = this,
                log = logChanges ? new Map() : undefined;

            me.applyingChangeset = true;
            me.suspendAutoSync();
            me.suspendChangeTracking();

            for (const { store, phantomIdField } of me.orderedCrudStores) {
                if (changes[store.id]) {
                    const storeLog = store.applyChangeset(
                        changes[store.id],
                        transformFn,
                        phantomIdField || me.phantomIdField,
                        clearChanges,
                        logChanges
                    );

                    if (storeLog) {
                        log.set(store.id, storeLog);
                    }
                }
            }

            me.applyingChangeset = false;
            me.resumeChangeTracking(true);
            me.resumeAutoSync(false);

            return log;
        }

        //endregion

        /**
         * Generates unique request identifier.
         * @internal
         * @template
         * @member {Number}
         * @readonly
         * @category CRUD
         */
        get requestId() {
            return Number.parseInt(`${Date.now()}${(this._requestId++)}`);
        }

        /**
         * Persists changes made on the registered stores to the server and/or receives changes made on the backend.
         * Usage:
         *
         * ```javascript
         * // persist and run a callback on request completion
         * crud.sync().then(
         *     () => console.log("Changes saved..."),
         *     ({ response, cancelled }) => console.log(`Error: ${cancelled ? 'Cancelled' : response.message}`)
         * );
         * ```
         *
         * ** Note: ** If there is an incomplete sync request in progress then system will queue the call and delay it
         * until previous request completion.
         * In this case {@link #event-syncDelayed} event will be fired.
         *
         * ** Note: ** Please take a look at {@link #config-autoSync} config. This option allows persisting changes
         * automatically after any data modification.
         *
         * ** Note: ** By default a sync request is only sent if there are any local {@link #property-changes}. To
         * always send a request when calling this function, configure {@link #config-forceSync} as `true`.
         *
         * @returns {Promise} Promise, which is resolved if request was successful.
         * Both the resolve and reject functions are passed a `state` object. State object has the following structure:
         * ```
         * {
         *     cancelled       : Boolean, // **optional** flag, which is present when promise was rejected
         *     rawResponse     : String,  // raw response from ajax request, either response xml or text
         *     rawResponseText : String,  // raw response text as String from ajax request
         *     response        : Object,  // processed response in form of object
         * }
         * ```
         * If promise was rejected by the {@link #event-beforeSync} event, `state` object will have this structure:
         * ```
         * {
         *     cancelled : true
         * }
         * ```
         * @ts-returns {Promise<CrudManagerSyncResult>}
         * @category CRUD
         * @async
         */
        sync() {
            const me = this;

            // A direct call to sync cancels any outstanding autoSync
            me.clearTimeout('autoSync');

            if (me.activeRequests.sync) {
                // let's delay this call and start it only after server response
                /**
                 * Fires after {@link #function-sync sync request} was delayed due to incomplete previous one.
                 * @event syncDelayed
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {Object} arguments The arguments of {@link #function-sync} call.
                 */
                me.trigger('syncDelayed');

                // Queue sync request after current one
                return me.activeSyncPromise = me.activeSyncPromise.finally(() => me.sync());
            }

            // Store current request promise. While this one is pending, all following sync requests will create chain
            // of sequential promises
            return me.activeSyncPromise = new Promise((resolve, reject) => {
                // get current change set package
                const pack = me.getChangesetPackage();

                // if no data to persist, we resolve immediately
                if (!pack) {
                    resolve(null);
                    return;
                }

                // once syncing starts - clear the `modifiedMaterialized` collections - they have already been
                // reflected in the `pack`
                this.forEachCrudStore(store => store.modifiedMaterialized?.clear());

                for (const value of Object.values(pack)) {
                    // mark all added "phantom" records with `isBeingMaterialized` flag
                    // this flag is added on sync process start and removed right before applying the sync response
                    value?.added?.forEach(recordData => recordData.__record__.isBeingMaterialized = true);
                }

                // Pre-create the activeRequests.sync object so tests/code see it immediately
                me.activeRequests.sync = {
                    type : 'sync',
                    pack,
                    resolve,
                    reject,
                    // We'll set .desc (the result of me.sendRequest()) only once we know it's not canceled
                    desc : null,
                    id   : pack.requestId
                };

                /**
                 * Fires before {@link #function-sync sync request} is sent. Return `false` to cancel sync request.
                 *
                 * ```javascript
                 * crudManager.on('beforesync', function() {
                 *     // cannot persist changes before at least one record is added
                 *     // to the `someStore` store
                 *     if (!someStore.getCount()) return false;
                 * });
                 * ```
                 * @event beforeSync
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {Object} pack The data package which contains data for all stores managed by the crud manager.
                 * @preventable
                 * @async
                 */
                const beforeSyncResult = me.trigger('beforeSync', { pack });

                // Convert to promise in case it's async
                Promise.resolve(beforeSyncResult).then(result => {
                    if (me.isDestroyed) {
                        return;
                    }
                    if (result !== false) {
                        // Fire syncStart after we confirm it's not canceled
                        me.trigger('syncStart', { pack });

                        if (me.eventStore?.usesSingleAssignment) {
                            me.assignmentStore?.acceptChanges();
                        }

                        // Now we can send the request
                        me.activeRequests.sync.desc = me.sendRequest({
                            id      : pack.requestId,
                            data    : me.encode(pack),
                            type    : 'sync',
                            success : me.onCrudRequestSuccess,
                            failure : me.onCrudRequestFailure,
                            thisObj : me
                        });
                    }
                    else {
                        /**
                         * Fires after {@link #function-sync sync request} was canceled by some {@link #event-beforeSync} listener.
                         * @event syncCanceled
                         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                         * @param {Object} pack The data package which contains data for all stores managed by the crud manager.
                         */
                        me.trigger('syncCanceled', { pack });
                        // Remove the activeRequests.sync object since it's canceled
                        me.activeRequests.sync = null;
                        reject({ cancelled : true });
                    }
                }).catch(error => {
                    // If the event's promise rejects, remove the active sync reference
                    me.activeRequests.sync = null;
                    reject(error);
                });
            }).catch(error => {
                // If the request was not cancelled in beforeSync, rethrow for user code's `catch`
                if (error && !error.cancelled) {
                    throw error;
                }
                // Pass the error object as a param to the next `then` chain
                return error;
            });
        }

        async onCrudRequestSuccess(rawResponse, fetchOptions, request) {
            const
                me = this,
                {
                    type : requestType,
                    id   : requestId
                }  = request;

            if (me.isDestroyed) return;

            let responseText = '';

            request = me.activeRequests[requestType];

            // we throw exception below to let events trigger first in internalOnResponse() call
            try {
                responseText = await rawResponse.text();
            }
            catch {
            }

            // since we break the method w/ promises chain ..need to check if the instance is not destroyed in the meantime
            if (me.isDestroyed) return;

            // This situation should never occur.
            // In the load() method, if a load is called while there is a load
            // ongoing, the ongoing Transport request is cancelled and loadCanceled triggered.
            // But having got here, it's too late to cancel a Transport request, so
            // the operation is unregistered below.
            // In the sync() method, if a sync is called while there is a sync
            // ongoing, it waits until completion, before syncing.
            // The activeRequest for any operation should NEVER be able to be
            // replaced while this operation is ongoing, so this must be fatal.
            if (request?.id !== requestId) {
                throw new Error(`Interleaved ${requestType} operation detected`);
            }

            // Reset the active request info before we enter async code which could allow
            // application code to run which could potentially call another request.
            // It is too late for this request to be canceled - the activeRequest represented
            // the Transport object and that has completed now.
            me.activeRequests[requestType] = null;

            const response = await me.internalOnResponse(request, responseText, fetchOptions, rawResponse);

            // since we break the method w/ promises chain ..need to check if the instance is not destroyed in the meantime
            if (me.isDestroyed) return;

            if (!response || (me.skipSuccessProperty ? response?.success === false : !response?.success)) {
                const error = {
                    rawResponse,
                    response,
                    request
                };
                if (response?.message) {
                    error.message = response.message;
                }
                request.reject(new CrudManagerRequestError(error));
            }

            // Successful request type done flag (this.crudLoaded or this.crudSynced)..
            me[`crud${StringHelper.capitalize(requestType)}ed`] = true;

            request.resolve({ response, rawResponse, responseText, request });
        }

        async onCrudRequestFailure(rawResponse, fetchOptions, request) {
            const me = this;

            if (me.isDestroyed) return;

            request = me.activeRequests[request.type];

            const
                signal     = fetchOptions?.abortController?.signal,
                wasAborted = Boolean(signal?.aborted);

            me.afterSyncAttempt(request);

            if (!wasAborted) {
                let response,
                    responseText = '';

                try {
                    responseText = await rawResponse.text();
                    response = me.decode(responseText);
                }
                catch {
                }

                // since we break the method w/ promises chain ..need to check if the instance is not destroyed in the meantime
                if (me.isDestroyed) return;

                me.triggerFailedRequestEvents(request, response, responseText, fetchOptions, rawResponse);

                // since we break the method w/ promises chain ..need to check if the instance is not destroyed in the meantime
                if (me.isDestroyed) return;

                request.reject(new CrudManagerRequestError({
                    rawResponse,
                    request
                }));
            }

            // reset the active request info
            me.activeRequests[request.type] = null;
        }

        /**
         * Accepts all changes in all stores, resets the modification tracking:
         * * Clears change tracking for all records
         * * Clears added
         * * Clears modified
         * * Clears removed
         * Leaves the store in an "unmodified" state.
         * @category CRUD
         */
        acceptChanges() {
            this.crudStores.forEach(({ store }) => store.acceptChanges());

            this.trigger('acceptChanges');
        }

        /**
         * Reverts all changes in all stores and re-inserts any records that were removed locally. Any new uncommitted
         * records will be removed.
         * @category CRUD
         */
        revertChanges() {
            // the method aliases revertCrudStoreChanges
            this.revertCrudStoreChanges();

            this.trigger('revertChanges');
        }

        revertCrudStoreChanges() {
            const { usesSingleAssignment } = this.eventStore;

            // Ignore assignment store if using single assignment, otherwise reverting changes will undo changes from
            // reverting the event store after reassignment
            this.orderedCrudStores.forEach(({ store }) => (!store.isAssignmentStore || !usesSingleAssignment) && store.revertChanges());
        }

        /**
         * Removes all stores and cancels active requests.
         * @category CRUD
         * @internal
         */
        doDestroy() {
            const
                me             = this,
                { load, sync } = me.activeRequests;

            load && me.cancelRequest(load.desc, load.reject);

            if (sync) {
                if (sync.desc) {
                    me.cancelRequest(sync.desc, sync.reject);
                }
                else {
                    sync.reject({ cancelled : true });
                    me.activeRequests.sync = null;
                }
            }

            while (me.crudStores.length > 0) {
                me.removeCrudStore(me.crudStores[0]);
            }

            super.doDestroy?.();
        }

        /**
         * Returns the data from all CrudManager `crudStores` in a format that can be consumed by `inlineData`.
         * @member {Object}
         * @internal
         */
        get crudStoresJSON() {
            const result = {};
            this.forEachCrudStore((store, storeId) => {
                result[storeId] = store.toJSON();
                if (this.includeLegacyDataProperties) {
                    result[`${storeId}Data`] = result[storeId];
                }
            });
            if (this.assignmentStore?.usesSingleAssignment) {
                delete result.assignmentsData;
                delete result.assignments;
            }
            return result;
        }

        set crudStoresJSON(data) {
            this.forEachCrudStore((store, storeId) => {
                const dataName = `${storeId}Data`;
                if (data[storeId]) {
                    store.data = data[storeId];
                }
                else if (data[dataName]) {
                    store.data = data[dataName];
                }
            });
        }
    };
};
