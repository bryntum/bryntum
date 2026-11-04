import Base from '../Base.js';
import Pluggable from '../mixin/Pluggable.js';
import Events from '../mixin/Events.js';
import Factoryable from '../mixin/Factoryable.js';
import State from '../mixin/State.js';
import Identifiable from '../mixin/Identifiable.js';
import Model from './Model.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import DateHelper from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import WalkHelper from '../helper/WalkHelper.js';
import StoreBag from './StoreBag.js';
import Collection from '../util/Collection.js';

import StoreCRUD from './mixin/StoreCRUD.js';
import StoreChanges from './mixin/StoreChanges.js';
import StoreFilter from './mixin/StoreFilter.js';
import StoreGroup from './mixin/StoreGroup.js';
import StorePaging from './mixin/StorePaging.js';
import StoreProxy from './mixin/StoreProxy.js';
import StoreRelation from './mixin/StoreRelation.js';
import StoreSum from './mixin/StoreSum.js';
import StoreSearch from './mixin/StoreSearch.js';
import StoreSort from './mixin/StoreSort.js';
import StoreSparseIndex from './mixin/StoreSparseIndex.js';
import StoreChained from './mixin/StoreChained.js';
import StoreState from './mixin/StoreState.js';
import StoreTree from './mixin/StoreTree.js';
import StoreSync from './mixin/StoreSync.js';

import Delayable from '../mixin/Delayable.js';



/**
 * @module Core/data/Store
 */

// Not cut below business even though lazy loading is business and above: `requestData` exists on every tier (paging
// and remote sort/filter use it too) and its `params` is typed with this union
/**
 * An object containing details about the requested data. Not available in the Community edition.
 * @typedef {Object} LazyLoadRequestParams
 * @property {Number} startIndex The index of the first record being requested
 * @property {Number} count The number of records being requested
 * @property {Sorter[]} [sorters] If {@link #config-remoteSort} is active, this will contain a number of sorter objects
 * @property {CollectionFilterConfig[]} [filters] If {@link #config-remoteFilter} is active, this will contain a number
 * of filters objects
 * @property {Date} [startDate] The startDate of the requested date range (only if applicable)
 * @property {Date} [endDate] The endDate of the requested date range (only if applicable)
 * @property {String|Number} [parentId] The parentId for which to load children (only if tree store)
 * @property {String[]|Number[]} [resourceIds] If this store is part of a Scheduler or a Gantt, and is a store
 *  dependent on the `ResourceStore`, such as the `EventStore`, and the `ResourceStore` is configured as a tree store,
 *  this value of this property is the IDs of the Resources for which to load related data. `startIndex` and `count`
 *  will not be used in these cases.
 */

/**
 * An object containing details about the requested data
 * @typedef {Object} PagingRequestParams
 * @property {Number} page The page number being requested
 * @property {Number} pageSize The number of records being requested
 * @property {Sorter[]} sorters If {@link #config-remoteSort} is active, this will contain a number of sorter objects
 * @property {CollectionFilterConfig[]} filters If {@link #config-remoteFilter} is active, this will contain a number
 */

/**
 * An object containing details about the received data used for lazy and paged loading
 * @typedef {Object} DataLoadRequestResponse
 * @property {Object[]} data The data being received
 * @property {Number} total The total number of records available
 */



const
    dataAddRemoveActions     = {
        splice : 1,
        clear  : 1
    },
    defaultTraverseOptions   = {
        includeFilteredOutRecords    : false,
        includeCollapsedGroupRecords : false
    },
    fixTraverseOptions       = (store, options) => {
        // backward compatibility to support includeFilteredOutRecords parameter instead of options
        options = options || false;

        // <remove-on-release>
        // TODO: clean up and remove boolean option
        // </remove-on-release>
        if (typeof options === 'boolean') {
            options = {
                includeFilteredOutRecords    : options,
                includeCollapsedGroupRecords : false
            };
        }

        return options || defaultTraverseOptions;
    },
    useRawDataUnset          = Symbol('useRawDataUnset'),
    useRawDataDefaults       = {
        enabled                 : true,
        disableDuplicateIdCheck : true,
        disableDefaultValue     : false,
        disableTypeConversion   : false
    },
    useRawDataRemoteDefaults = {
        enabled                 : true,
        disableDuplicateIdCheck : false,
        disableDefaultValue     : false,
        disableTypeConversion   : false
    };

/**
 * The Store represents a data container which holds flat data or tree structures. An item in the Store is often called
 * a `record` and it is simply an instance of the {@link Core.data.Model} (or any subclass thereof).
 *
 * Typically, you load data into a store to display it in a Grid or a ComboBox. The Store is the backing data component
 * for any component that is showing data in a list style UI.
 *
 * The Store offers an API to edit, filter, group and sort the records.
 *
 * Data is stored in a JSON array
 *
 * {@region Store with flat data}
 * To create a flat store simply provide an array of JavaScript or JSON objects that describe your records
 *
 * ```javascript
 * const store = new Store({
 *     data : [
 *         { id : 1, name : 'ABBA', country : 'Sweden' },
 *         { id : 2, name : 'Beatles', country : 'UK' }
 *     ]
 * });
 *
 * // retrieve record by id
 * const beatles = store.getById(2);
 * ```
 *
 * By default, when using inline data (supplied directly to the store by the app, not loaded remotely by an `AjaxStore`
 * or `CrudManager`) the incoming data objects are cloned by the created records. This means that those objects will not
 * get "polluted" when default values are applied, or when records are manipulated later. But cloning reduces record
 * creation performance a bit, if the raw data objects are not directly used elsewhere you can opt out of cloning by
 * setting the {@link #config-useRawData} config to `true`.
 *
 * Note that if the first object in the incoming data is un-extensible (~immutable), the entire incoming dataset will be
 * cloned even if configured with `useRawData: true`.
 * {@endregion}
 *
 * {@region Store with tree data}
 * To create a tree store use `children` property for descendant records
 *
 * ```javascript
 * const store = new Store({
 *     tree: true,
 *     data : [
 *         { id : 1, name : 'ABBA', country : 'Sweden', children: [
 *             { id: 2, name: 'Agnetha' },
 *             { id: 3, name: 'Bjorn' },
 *             { id: 4, name: 'Benny' },
 *             { id: 5, name: 'Anni-Frid' }
 *         ]},
 *     ]
 * });
 *
 * // retrieve record by id
 * let benny = store.getById(4);
 * ```
 *
 * Optionally a tree store can consume a flat dataset with nodes that have a `parentId` property. By configuring the
 * store with `tree : true` and `transformFlatData : true`, the flat data is transformed into tree data:
 *
 * ```javascript
 * const store = new Store({
 *     tree              : true,
 *     transformFlatData : true,
 *     data              : [
 *         { id : 1, name : 'ABBA', country : 'Sweden' },
 *         { id : 2, name : 'Agnetha', parentId : 1 },
 *         { id : 3, name : 'Bjorn', parentId : 1 },
 *         { id : 4, name : 'Benny', parentId : 1 },
 *         { id : 5, name : 'Anni-Frid', parentId : 1 }
 *     ]
 * });
 * ```
 *
 * ### Retrieving and consuming JSON
 * For both flat stores or tree stores it is possible to retrieve the data of all records in JSON format:
 *
 * ```javascript
 * const jsonString = store.json;
 *
 * // or
 *
 * const jsonArray = store.toJSON();
 * ```
 *
 * To plug the JSON data back in later:
 *
 * ```javascript
 * store.data = JSON.parse(jsonString);
 *
 * // or
 *
 * store.data = jsonArray;
 * ```
 *
 * {@endregion}
 *
 * {@region Lazy loading}
 * A store can be configured with {@link #config-lazyLoad} set to `true`. This will make the store request records when
 * they are needed, rather than the complete dataset at once. The request is intercepted by implementing the
 * {@link #config-requestData} function. Each request will be made up of 1 chunk before and after the requested index
 * (which gives a total of 2 chunks). The chunk size can be configured in the {@link #config-lazyLoad} config.
 *
 * There is a [guide](#Grid/guides/data/lazyloading.md) for implementing lazy loading in Grid.
 *
 * Note that lazy loading is not supported in the Community edition.
 * {@endregion}
 *
 * {@region Paging}
 * A Store can be paged remotely by setting the {@link #config-remotePaging} config to `true`. For a
 * non-{@link Core.data.AjaxStore}, data will be requested by the Store by calling the implemented
 * {@link #config-requestData} function. Data can also be provided by listening to the {@link #event-requestData}
 * event, and updating the {@link #config-data} property with new data.
 *
 * ```javascript
 * const store = new Store({
 *    remotePaging : true,
 *    requestData({ page, pageSize }){
 *       const start = (page - 1) * pageSize;
 *       const data = allRecords.splice(start, start + pageSize);
 *
 *       return {
 *          data,
 *          total : allRecords.length
 *       }
 *    }
 * })
 * ```
 *
 * {@endregion}
 *
 * {@region Remote sorting}
 * A Store can be sorted remotely by setting the {@link #config-remoteSort} config to `true`. This makes it possible to
 * use the built-in sorting features of the Store and corresponding UI functionality, without using local data. For a
 * non-{@link Core.data.AjaxStore}, data will be requested by the Store by calling a by the app implemented
 * {@link #config-requestData} function. Data can also be provided by listening to the {@link #event-requestData}
 * event, and updating the {@link #config-data} property with new data.
 *
 * ```javascript
 * const store = new Store({
 *    remoteSort   : true,
 *    remotePaging : true,
 *    requestData({ sorters, page, pageSize }){
 *       const sortedRecords = [...allRecords];

 *       sorters?.forEach(sorter => sortedRecords.sort((a,b) => {
 *          const { field, ascending } = sorter;
 *
 *          if (!ascending) {
 *              ([b, a] = [a, b]);
 *          }
 *
 *          return a[field] > b[field] ? 1 : (a[field] < b[field] ? -1 : 0)
 *       });
 *
 *       const start = (page - 1) * pageSize;
 *       const data = sortedRecords.splice(start, start + pageSize);
 *
 *       return {
 *          data,
 *          total : allRecords.length
 *       }
 *    }
 * })
 * ```
 *
 * For {@link Core.data.AjaxStore}, data will be loaded via the configured
 * {@link Core.data.AjaxStore#config-readUrl}.
 * {@endregion}
 *
 * {@region Remote filtering}
 * A Store can be filtered remotely by setting the {@link #config-remoteFilter} config to `true`. This makes it possible
 * to use the built-in filtering features of the Store and corresponding UI functionality, without using local data.
 *
 * For a non-{@link Core.data.AjaxStore}, data will be requested by the Store by calling the implemented
 * {@link #config-requestData} function. Data can also be provided by listening to the {@link #event-requestData} event,
 * and updating the {@link #config-data} property with new data.
 *
 * ```javascript
 * const store = new Store({
 *    remoteFilter : true,
 *    remoteSort   : true,
 *    remotePaging : true,
 *    requestData({ filters, sorters, page, pageSize }){
 *       let filteredRecords = [...allRecords];
 *
 *       filters?.forEach(filter => {
 *          const { field, operator, value, caseSensitive } = filter;
 *
 *          if(operator === '='){
 *              filteredRecords = filteredRecords.filter(r => r[field] === value);
 *          }
 *          else {
 *              /// ... implement other filter operators
 *          }
 *       });
 *
 *       sorters?.forEach(sorter => filteredRecords.sort((a,b) => {
 *          const { field, ascending } = sorter;
 *
 *          if (!ascending) {
 *              ([b, a] = [a, b]);
 *          }
 *
 *          return a[field] > b[field] ? 1 : (a[field] < b[field] ? -1 : 0)
 *       }));
 *
 *       const start = (page - 1) * pageSize;
 *       const data = filteredRecords.splice(start, start + pageSize);
 *
 *       return {
 *          data,
 *          total : filteredRecords.length
 *       }
 *    }
 * })
 * ```
 *
 * For {@link Core.data.AjaxStore}, data will be loaded via the configured
 * {@link Core.data.AjaxStore#config-readUrl}.
 * {@endregion}
 *
 * {@region Getting record count}
 *
 * To get the number of "visible" records in the store (records that would be shown when using the Store as the data
 * source for a Grid or similar), use the {@link #property-count} property. This will return the number of records in
 * the store after filtering and grouping has been applied, including the generated group headers and footers but
 * excluding any records inside collapsed parents or group headers:
 *
 * ```javascript
 * const visibleRecords = store.count;
 * ```
 *
 * To get other counts, such as the total number of data records in the store including those collapsed away and
 * filtered out, use the more flexible {@link #function-getCount} method:
 *
 * ```javascript
 * // Include records that have been filtered out,
 * // as well as any records inside collapsed groups or tree nodes.
 * const records = store.getCount({
 *     collapsed   : true,
 *     filteredOut : true
 * });
 *
 * // Including group headers + summary records
 * const records = store.getCount({
 *     headersFooters : true
 * });
 *
 * // All records, including group headers and filtered out records
 * const allRecords = store.getCount({
 *     all : true
 * });
 * ```
 *
 * {@endregion}
 *
 * {@region Sharing stores}
 * You cannot directly share a Store between widgets, but the data in a Store can be shared. There are two different
 * approaches depending on your needs, sharing data and chaining stores:
 *
 * ### Shared data
 * To create 2 widgets that share data, you can create 2 separate stores and pass records of the first store as the
 * dataset of the second store.
 *
 * ```javascript
 * let combo1 = new Combo({
 *     appendTo : document.body,
 *     store    : new Store({
 *         data : [
 *             { id : 1, name : 'ABBA', country : 'Sweden' },
 *             { id : 2, name : 'Beatles', country : 'UK' }
 *         ]
 *     }),
 *     valueField   : 'id',
 *     displayField : 'name'
 * });
 *
 * let combo2 = new Combo({
 *     appendTo : document.body,
 *     store    : new Store({
 *         data : combo1.store.records
 *     }),
 *     valueField   : 'id',
 *     displayField : 'name'
 * });
 *
 * combo1.store.first.name = 'foo';
 * combo2.store.first.name; // "foo"
 * ```
 *
 * ### Chained stores
 * Another more powerful option to share data between widgets is to create {@link Core.data.mixin.StoreChained chained}
 * stores. The easiest way to create a chained store is to call {@link #function-chain} function.
 *
 * ```javascript
 * let combo1 = new Combo({
 *     appendTo : document.body,
 *     store    : new Store({
 *         data : [
 *             { id : 1, name : 'ABBA', country : 'Sweden' },
 *             { id : 2, name : 'Beatles', country : 'UK' }
 *         ]
 *     }),
 *     valueField   : 'id',
 *     displayField : 'name'
 * });
 *
 * let combo2 = new Combo({
 *     appendTo     : document.body,
 *     store        : combo1.store.chain(),
 *     valueField   : 'id',
 *     displayField : 'name'
 * });
 *
 * combo1.store.first.name = 'foo';
 * combo2.store.first.name; // "foo"
 * ```
 *
 * A chained store can optionally be created with a filtering function, to only contain a subset of the records from
 * the main store. In addition, the chained store will reflect record removals/additions to the master store, something
 * the shared data approach will not.
 * {@endregion}
 *
 * {@region Non-homogeneous data structures}
 *
 * You can use different Model classes to represent the records in the store by overriding the {@link #function-createRecord}
 * method:
 *
 * ```javascript
 * const store = new Store ({
 *     modelClass : Gate,
 *     readUrl    : 'data/the-airport.json',
 *     autoLoad   : true,
 *     // The default model is a Gate (see above) and in this createRecord method, we can decide at runtime based
 *     // on the data which model class to use. This is useful when your record types aren't homogenous.
 *     createRecord(data) {
 *         let modelClass = this.modelClass;
 *         if (data.type === 'terminal') {
 *             modelClass = Terminal;
 *         }
 *         return new modelClass(data, this);
 *     }
 * },
 * ```
 *
 * {@endregion}
 *
 * ## Useful configs and properties
 *
 * | Config / Property             | Description                                  |
 * |-------------------------------|----------------------------------------------|
 * | {@link #config-data}          | Array of record data objects to load          |
 * | {@link #config-modelClass}    | Model class used to create records            |
 * | {@link #config-sorters}       | Initial sort definitions                      |
 * | {@link #config-filters}       | Active filter definitions                     |
 * | {@link #config-tree}          | Enable hierarchical tree data mode            |
 * | {@link #config-groupers}      | Group records by one or more fields           |
 *
 * ## See also
 *
 * - {@link Core.data.Model} - Record definition used by the store
 * - {@link Core.data.AjaxStore} - Store subclass that loads data via HTTP
 * - {@link Core.data.mixin.StoreFilter} - Filter mixin providing filter API
 * - {@link Core.data.mixin.StoreSort} - Sort mixin providing sort API
 *
 * @mixes Core/mixin/Events
 * @mixes Core/data/mixin/StoreFilter
 * @mixes Core/data/mixin/StoreChanges
 * @mixes Core/data/mixin/StoreCRUD
 * @mixes Core/data/mixin/StoreSum
 * @mixes Core/data/mixin/StoreSearch
 * @mixes Core/data/mixin/StoreSort
 * @mixes Core/data/mixin/StoreSparseIndex
 * @mixes Core/data/mixin/StoreGroup
 * @mixes Core/data/mixin/StoreChained
 * @mixes Core/data/mixin/StoreState
 * @mixes Core/data/mixin/StoreRelation
 * @mixes Core/data/mixin/StoreTree
 * @mixes Core/data/stm/mixin/StoreStm
 * @mixes Core/data/mixin/StoreSync
 * @mixes Core/data/mixin/StorePaging
 *
 * @plugins Core/data/plugin/StoreLazyLoadPlugin
 *
 * @extends Core/Base
 */
export default class Store extends Base.mixin(
    Delayable,
    Identifiable,
    Factoryable,
    Events,
    Pluggable,
    State,
    StoreFilter,
    StoreChanges,
    StoreCRUD,
    StoreRelation, // Private
    StoreSum,
    StoreSearch,
    StoreSort,
    StoreGroup,
    StoreChained,
    StoreState,
    StoreTree,
    StoreSparseIndex,

    StoreSync,
    StorePaging,
    StoreProxy // Private for now, thus not mentioned in @mixes block above
) {
    crudManager = undefined;

    //region Config & properties

    static $name = 'Store';

    // Base type for all stores
    static type = 'store';

    static get properties() {
        return {
            relationCache         : {},
            dependentStoreConfigs : new Map(),
            addingClean           : false
        };
    }

    static configurable = {
        /**
         * Store's unique identifier.
         *
         * @member {String|Number} id
         * @readonly
         * @category Common
         */
        /**
         * Store's unique identifier. When set the store is added to a store map accessible through
         * `Store.getStore(id)`.
         *
         * @config {String|Number}
         * @category Common
         */
        id : true,

        /**
         * Class used to represent records in the store, should be a subclass of {@link Core.data.Model}. Only
         * applies when supplying data to the store (load, add), any supplied record instances are kept as is.
         *
         * ```javascript
         * class MyModel extends Model {
         *     static get fields() {
         *         return [
         *             'name',
         *             'city',
         *             'company'
         *         ]
         *     }
         * }
         *
         * const store = new Store({
         *     modelClass : MyModel,
         *     data : [
         *         { id : 1, name : 'Mark', city : 'London', company : 'Cool inc' },
         *         ...
         *     ]
         * });
         * ```
         *
         * @config {Core.data.Model}
         * @default
         * @ts-returns {typeof Model}
         * @category Common
         */
        modelClass : Model,

        /**
         * Verify that loaded data does not contain any generated ids. If it does, a warning is logged on console.
         *
         * Set this to `false` to disable the check and give a very minor performance boost.
         *
         * @prp {Boolean}
         * @default
         */
        verifyNoGeneratedIds : true,



        /**
         * For a non-AjaxStore, the autoLoad config will only take effect if the store is configured as
         * {@link #config-lazyLoad}, {@link #config-remoteSort}, {@link #config-remoteFilter} or
         * {@link #config-remotePaging}. In these cases, it will immediately after creation, perform a request by
         * calling the {@link #config-requestData} function.
         * @config {Boolean}
         * @category Common
         */
        autoLoad : null,

        /**
         * In a non-{@link Core.data.AjaxStore}, configured with {@link #config-lazyLoad}, {@link #config-remoteSort},
         * {@link #config-remoteFilter} or {@link #config-remotePaging}, the function provided here is called when the Store
         * needs new data, which will happen:
         *
         * * for {@link #config-lazyLoad}, when a record that has not yet been loaded is requested.
         * * for {@link #config-remoteSort}, on a sort operation.
         * * for {@link #config-remoteFilter}, on a filter operation.
         * * for {@link #config-remotePaging}, when current page is changed.
         *
         * When implementing this, it is expected that what is returned is an object with a `data` property containing the
         * records requested. What is requested will be specified in the `params` object, which will differ depending on the
         * source of the request.
         *
         * For {@link #config-lazyLoad}, the params object will contain `a startIndex` and a `count` param. It is expected
         * for the implementation of this function to provide a `data` property containing the number of records specified
         * in the `count` param starting from the specified `startIndex`.
         *
         * ```javascript
         * class MyStore extends Store {
         *    async requestData({startIndex, count}){
         *       const response = await getData(startIndex, count);

         *       return {
         *          data : response.records,
         *          total : response.totalRecordCount
         *       }
         *    }
         * }
         * ```
         *
         * For {@link #config-remotePaging}, the params object will contain a `page` and a `pageSize` param. It is expected
         * for the implementation of this function to provide a `data` property containing the number of records specified
         * in the `pageSize` param starting from the specified `page`.
         *
         * ```javascript
         * class MyStore extends Store {
         *    requestData({page, pageSize}){
         *       const start = (page - 1) * pageSize;
         *       const data = allRecords.splice(start, start + pageSize);
         *
         *       return {
         *          data,
         *          total : allRecords.length
         *       }
         *    }
         * }
         * ```
         *
         * For {@link #config-lazyLoad} it is recommended, and for {@link #config-remotePaging} it is required, to include a
         * `total` property which reflects the total amount of records available to load. If the `total` property is omitted
         * (when {@link #config-lazyLoad}), certain features and functions are disabled:
         *
         * * The component (Grid for example) is not aware of the total number of records, which will make the scrollbar's
         *   thumb change size and position when new records are loaded.
         * * The store don't know when to stop requesting new records. The `total` property will be set to the index of the
         *   last record loaded after requestData returns with fewer records than requested.
         *
         * If {@link #config-remoteSort} is active, the params object will contain a `sorters` param, containing a number of
         * sorter objects.The sorter objects will look like this:
         *
         * ```javascript
         * {
         *     "field": "name",
         *     "ascending": true
         * }
         * ```
         *
         * If {@link #config-remoteFilter} is active, the params object will contain a `filters` param, containing a number
         * of filters objects. The filter objects will look like this:
         *
         * ```javascript
         * {
         *     "field": "country",
         *     "operator": "=",
         *     "value": "sweden",
         *     "caseSensitive": false
         * }
         * ```
         *
         * If {@link Core.data.mixin.StoreGroup#config-groupParamName} is set and groupers are active, the params object
         * will contain a `groupers` param (under the configured name) describing the active groupers. The response is
         * expected to include a `groups` metadata array describing every group parent in the dataset — one entry per
         * group, independent of the paged `data` window:
         *
         * ```javascript
         * {
         *     // windowed records, server-sorted by the groupers
         *     data   : [ ... ],
         *     total  : 10234,
         *     groups : [
         *         { field : 'country', value : 'Sweden', count : 523, summaries : { revenue : { sum : 12345 } } },
         *         { field : 'country', value : 'Norway', count : 412 }
         *     ]
         * }
         * ```
         *
         * The Base implementation of this function does nothing, you need to create your own subclass with an
         * implementation.
         *
         * Configuration parameter to pass a function to be used as {@link #config-requestData} in non-AjaxStore.
         *
         * @config {Function}
         * @param {LazyLoadRequestParams|PagingRequestParams} params Object containing info of which records is requested
         * @returns {DataLoadRequestResponse}
         * @async
         * @category Common
         */
        requestData : null,

        /**
         * Retools the loaded data objects instead of making shallow copies of them. This increases performance but
         * pollutes the incoming data.
         *
         * This setting is off by default, but is turned on automatically unless explicitly configured when data is
         * loaded using an `AjaxStore` (configured with a `readUrl`) or a `CrudManager` (configured to load data
         * remotely).
         *
         * ```javascript
         * // No duplicate id checking, no type conversions
         * new Store({ useRawData : true });
         * ```
         *
         * Also allows disabling certain steps in data loading, to further improved performance. Either accepts an
         * object with the params described below or `true` which enables `disableDuplicateIdCheck`.
         *
         * ```javascript
         * new Store({
         *   // No type conversions only
         *   useRawData : {
         *     disableTypeConversion : true
         *   }
         * });
         * ```
         *
         * Note that if the first object in the incoming data is determined to be un-extensible (~immutable),
         * the entire incoming dataset will be cloned.
         *
         * Also note that since incoming data objects gets polluted with this setting on, reusing the same data
         * objects elsewhere might lead to unexpected behavior.
         *
         * {@note}When binding to data in frameworks with this setting enabled, the same principles as for framework
         * state applies - an object in the incoming data must be replaced instead of mutated for a change to be
         * detected. See for example [React's explanation here](https://react.dev/learn/updating-objects-in-state)
         * {/@note}
         *
         * @config {Boolean|Object}
         * @param {Boolean} [disableDuplicateIdCheck] Data must not contain duplicate ids, check is bypassed.
         * @param {Boolean} [disableDefaultValue] Default values will not be applied to record fields.
         * @param {Boolean} [disableTypeConversion] No type conversions will be performed on record data. Incoming
         * data must be in the correct format expected by each field, for example dates must be Date objects.
         * @category Advanced
         * @non-lazy-load
         */
        useRawData : useRawDataUnset,

        /**
         * An array of field definitions used to create a {@link Core.data.Model} (modelClass) subclass. Optional.
         * If the Model already has fields defined, these fields will extend those.
         *
         * ```javascript
         * const store = new Store({
         *     fields : ['name', 'city', 'company'],
         *     data   : [
         *         { id : 1, name : 'Mark', city : 'London', company : 'Cool inc' },
         *         ...
         *     ]
         * });
         * ```
         *
         * See {@link Core.data.Model} for more info on defining fields, changing data source and mapping fields to
         * nested objects.
         *
         * Note that pre-created record instances supplied to the store are kept as is and thus these fields will
         * not apply to them.
         *
         * {@note}Field names that collide with a {@link Core.data.Model} property (`parent`, `children`, `data`,
         * `meta`) or with an `Object.prototype` member (`constructor`, `hasOwnProperty`, `isPrototypeOf`,
         * `propertyIsEnumerable`, `toLocaleString`, `toString`, `valueOf`) are reserved and not
         * supported. An `Object.prototype` member name is refused with a `"<name>" is a reserved field name` error.
         * This also applies to the fields generated for you when no `fields` or {@link #config-modelClass} is
         * supplied, so data containing such a property is enough to make store creation throw. Use a field with a safe `name` and a
         * {@link Core/data/field/DataField#config-dataSource} pointing at the raw property instead — see
         * {@link Core.data.Model} for the limitations of that remap.{/@note}
         *
         * @config {Array<String|ModelFieldConfig|Core.data.field.DataField>}
         * @category Common
         */
        fields : null,

        /**
         * Automatically detect from set data if used as tree store or flat store. If {@link #config-tree} is explicitly
         * set to `false`, then this value will be overruled and no tree detection performed.
         * @config {Boolean}
         * @default
         * @category Tree
         * @non-lazy-load
         */
        autoTree : true,

        /**
         * Raw data to load initially.
         *
         * Expects an array of JavaScript objects, with properties matching store's fields (defined on its
         * {@link #config-modelClass model} or in the {@link #config-fields} config).
         *
         * ```javascript
         * const store = new Store({
         *     data : [
         *         { id : 1, name : 'Linda', city : 'NY' },
         *         { id : 2, name : 'Olivia', city : 'Paris' },
         *         ...
         *     ]
         * });
         * ```
         *
         * @config {Object[]|Core.data.Model[]} data
         * @category Common
         * @non-lazy-load
         */
        // data is not an actual config

        /**
         * `true` to act as a tree store.
         * @config {Boolean}
         * @category Tree
         */
        tree : null,

        callOnFunctions : true,

        /**
         * A {@link Core/util/Collection}, or Collection config object
         * to use to contain this Store's constituent records.
         * @config {Core.util.Collection|CollectionConfig}
         * @category Advanced
         */
        storage : {},

        /**
         * Specify `false` to prevent loading records without ids, a good practice to enforce when syncing with a
         * backend.
         *
         * By default, Store allows loading records without ids, in which case a generated id will be assigned.
         *
         * @config {Boolean}
         * @default true
         * @category Advanced
         */
        allowNoId : true,

        /**
         * Prevent dynamically subclassing the modelClass. It does so by default to not pollute it when exposing
         * properties. Should rarely need to be used.
         * @config {Boolean}
         * @default false
         * @private
         * @category Advanced
         */
        preventSubClassingModel : null,

        /**
         * Store class to use when creating the store when it is a part of a
         * [CrudManager](https://bryntum.com/docs/api/Scheduler/data/CrudManager).
         *
         * ```javascript
         * crudManager : {
         *      eventStore {
         *          storeClass : MyEventStore
         *      }
         * }
         * ```
         *
         * @config {Class}
         * @ts-returns {typeof Store}
         * @category Advanced
         */
        storeClass : null
    };

    static factoryable = {
        defaultType : 'store'
    };

    static get identifiable() {
        return {
            registerGeneratedId : false
        };
    }

    static register(type, cls) {
        // Replace any registered Store with the same type.
        return super.register(type, cls, true);
    }

    updateAutoLoad(autoLoad) {
        if (autoLoad && !this.readUrl && !this.lazyLoad) {
            this.requestAnimationFrame(this.performDataRequest);
        }
    }

    /**
     * Class used to represent records. Defaults to class Model.
     * @member {Core.data.Model} modelClass
     * @ts-returns {typeof Model}
     * @category Records
     */

    //endregion

    //region Events

    /**
     * Fired when a formula defined on a datafield fails to evaluate.
     * @event formulaError
     * @param {Object} event
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model} record The record with the formula that failed to evaluate.
     * @param {String} field The field name of the field with the formula that failed to evaluate.
     * @param {Error} error The error thrown by the formula evaluation.
     * @param {String} formula The formula that failed to evaluate.
     * @internal
     */

    /**
     * Fired when the id of a record has changed
     * @event idChange
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model} record Modified record
     * @param {String|Number} oldValue Old id
     * @param {String|Number} value New id
     */

    /**
     * Fired before record is modified in this store.
     * Modification may be vetoed by returning `false` from a handler.
     * @event beforeUpdate
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model} record Modified record
     * @param {Object} changes Modification data
     */

    /**
     * Fired when a record is modified
     * @event update
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model} record Modified record
     * @param {Object} changes Modification data
     */

    /**
     * Fired when one of this Store's constituent records is modified while in
     * {@link Core.data.Model#function-beginBatch batched} state. This may be used to keep
     * UIs up to date while "tentative" changes are made to a record which must not be synced with a server.
     * @event batchedUpdate
     * @private
     */

    /**
     * Fired when the root node is set
     * @event rootChange
     * @param {Core.data.Store} source This Store
     * @param {Core.data.Model} oldRoot The old root node.
     * @param {Core.data.Model} rootNode The new root node.
     */

    /**
     * Data in the store was changed. This is a catch-all event which is fired for all changes
     * which take place to the store's data.
     *
     * This includes mutation of individual records, adding and removal of records, as well as
     * setting a new data payload using the {@link #property-data} property, sorting, filtering,
     * and calling {@link Core.data.mixin.StoreCRUD#function-removeAll}.
     *
     * Simple databound widgets may use to the `change` event to refresh their UI without having to add multiple
     * listeners to the {@link #event-update}, {@link Core.data.mixin.StoreCRUD#event-add},
     * {@link Core.data.mixin.StoreCRUD#event-remove}, {@link #event-refresh} and
     * {@link Core.data.mixin.StoreCRUD#event-removeAll} events.
     *
     * A more complex databound widget such as a grid may use the more granular events to perform less
     * destructive updates more appropriate to each type of change. The properties will depend upon the value of the
     * `action` property.
     *
     * @event change
     * @param {Core.data.Store} source This Store.
     * @param {'remove'|'removeAll'|'add'|'clearchanges'|'filter'|'update'|'dataset'|'replace'} action
     * Name of action which triggered the change. May be one of the options listed above
     * @param {Core.data.Model} record Changed record, for actions that affects exactly one record (`'update'`)
     * @param {Core.data.Model[]} records Changed records, passed for all actions except `'removeAll'`
     * @param {Object} changes Passed for the `'update'` action, info on which record fields changed
     */
    // NOTE: When updating params above, also update change event in ProjectModelMixin and dataChange in ProjectConsumer

    /**
     * Data in the store has completely changed, such as by a filter, or sort or load operation.
     * @event refresh
     * @param {Core.data.Store} source This Store.
     * @param {Boolean} batch Flag set to `true` when the refresh is triggered by ending a batch
     * @param {'dataset'|'sort'|'clearchanges'|'filter'|'create'|'update'|'delete'|'group'} action Name of
     * action which triggered the change. May be one of the options listed above.
     */

    /**
     * Fired when the store is about to perform an expensive batch data operation.
     *
     * This event is intended to let listeners suspend expensive processing (such as UI refreshes)
     * until the corresponding {@link #event-endDataUpdate} event is fired.
     * @event beginDataUpdate
     * @param {Core.data.Store} source This Store.
     * @internal
     */

    /**
     * Fired after a store has finished an expensive batch data operation.
     *
     * Intended to pair with {@link #event-beginDataUpdate} so listeners can resume
     * processing and perform a single refresh after the batch completes.
     * @event endDataUpdate
     * @param {Core.data.Store} source This Store.
     * @internal
     */

    /**
     * Fired before any remote request is initiated.
     * @event beforeRequest
     * @param {Core.data.Store} source This Store
     * @param {String} url The URL to which the HTTP request will be sent. This property may be mutated in
     * an event handler *without changing* the base urls configured for this Store.
     * @param {Object} params An object containing key/value pairs that are passed on the request query string
     * @param {Object} body The body of the request to be posted to the server.
     * @param {'create'|'read'|'update'|'delete'|'readPage'} action Action that is making the request, `'create'`,
     * `'read'`, `'update'`, `'delete'` or `'readPage'`
     * @preventable
     * @async
     */

    /**
     * Fired after any remote request has finished whether successfully or unsuccessfully.
     * @event afterRequest
     * @param {Boolean} exception `true`. *Only present if the request triggered an exception.*
     * @param {'create'|'read'|'update'|'delete'|'readPage'} action Action that has finished, `'create'`, `'read'`,
     * `'update'`, `'delete'` or `'readPage'`
     * @param {'network'|'failure'} exceptionType The type of failure, `'network'` or `'server'`. *Only present
     * if the request triggered an exception.*
     * @param {Response} response The `Response` object
     * @param {Object} json The decoded response object if there was no `'network'` exception.
     * @param {Object} params An object containing key/value pairs that were passed on the request query string
     */

    //endregion

    /* break doc comment from next method */

    //region Init

    constructor(...args) {
        super(...args);

        // When using a Proxy, the Proxy is returned instead of the actual Store
        if (this.objectify) {
            return this.initProxy(); // Noncompliant
        }
    }

    construct(config = {}) {
        const me = this;

        Object.assign(me, {
            added              : new StoreBag(),
            removed            : new StoreBag(),
            modified           : new StoreBag(),
            idRegister         : {},
            internalIdRegister : {},
            oldIdMap           : {}
        });

        super.construct(config);

        me.initRelations();
    }

    /**
     * Retrieves/creates a store based on the passed config.
     *
     * | Type              | Result                                                                 |
     * |-------------------|------------------------------------------------------------------------|
     * | Core.data.Store   | Returns supplied store as is                                           |
     * | String            | Retrieves an existing store by id                                      |
     * | Object            | Creates a new store using supplied config object                       |
     * | Object[]          | Creates a new store, populated with records created from supplied data |
     * | Core.data.Model[] | Creates a new store, populated with supplied records                   |
     *
     *
     * @param {Core.data.Store|StoreConfig|String|StoreConfig[]|Core.data.Model[]} config
     * @param {Object} [defaults] Config object to apply when creating a new store for passed data
     * @param {Function} [converterFn] Function called for each data object prior to creating a record from it. The
     * return value is used to create a record.
     * @private
     */
    static from(config, defaults = {}, converterFn = null) {
        // null and store instances pass through
        if (config && !config.isStore) {
            // Passed a string, get store by id
            if (typeof config === 'string') {
                config = Store.getStore(config);
            }
            // Passed something else, create a store using the input as its data
            else {
                // Array of records or data, pass to converterFn if one is supplied
                if (Array.isArray(config)) {
                    if (converterFn) {
                        config = config.map(data => data.isModel ? data : converterFn(data));
                    }

                    config = ObjectHelper.assign({}, defaults, { data : config });
                }
                else {
                    config = ObjectHelper.assign({}, defaults, config);
                }

                config = new Store(config);
            }
        }

        return config;
    }

    equals(other) {
        return other.isStore && other.$master === this.$master;
    }

    doDestroy() {
        const
            me         = this,
            allRecords = me.registeredRecords;

        // Remove from STM if added there (STM might also have gotten destroyed before us)
        me.stm?.removeStore?.(me);

        Model.unregisterSubModel(me._generatedModelClass);

        for (let i = allRecords.length - 1, rec; i >= 0; i--) {
            rec = allRecords[i];
            if (!rec?.isDestroyed) {
                rec.unjoinStore(me);
            }
        }

        me._storage?.destroy();

        if (me.isChained) {
            if (!me.masterStore.isDestroying) {
                // Remove from owner´s chainedStore array
                ArrayHelper.remove(me.masterStore.chainedStores, me);
            }
        }
        else {
            me.rootNode?.destroy();
        }

        // Events superclass fires destroy event.
        super.doDestroy();
        // <remove-on-release>
        // TODO: abort any ongoing loads
        // </remove-on-release>
    }

    /**
     * Stops this store from firing events until {@link #function-endBatch} is called. Multiple calls to `beginBatch`
     * stack up, and will require an equal number of `endBatch` calls to resume events.
     *
     * Upon call of {@link #function-endBatch}, a {@link #event-refresh} event is triggered to allow UIs to
     * update themselves based upon the new state of the store.
     *
     * This is extremely useful when making a large number of changes to a store. It is important not to trigger
     * too many UI updates for performance reasons. Batching the changes ensures that UIs attached to this
     * store are only updated once at the end of the updates.
     */
    beginBatch() {
        this.suspendEvents();
    }

    /**
     * Ends event suspension started by {@link #function-beginBatch}. Multiple calls to {@link #function-beginBatch}
     * stack up, and will require an equal number of `endBatch` calls to resume events.
     *
     * Upon call of `endBatch`, a {@link #event-refresh} event with `action: batch` is triggered to allow UIs to update
     * themselves based upon the new state of the store.
     *
     * This is extremely useful when making a large number of changes to a store. It is important not to trigger
     * too many UI updates for performance reasons. Batching the changes ensures that UIs attached to this
     * store are only updated once at the end of the updates.
     */
    endBatch() {
        if (this.resumeEvents()) {
            // Only call the "storage" getter and its "values" getter once.
            const { values : records } = this.storage;

            this.trigger('refresh', {
                action : 'batch',
                data   : records,
                records
            });
        }
    }

    changeStorage(storage) {
        if (storage?.isCollection) {
            return storage;
        }

        return new Collection(storage);
    }

    updateStorage(storage) {
        storage.autoFilter = this.reapplyFilterOnAdd;

        // Join all the constituent records to this Store
        for (const r of storage) {
            r.joinStore(this);
        }

        storage.ion({
            change  : 'onDataChange',
            thisObj : this
        });
    }

    /**
     * Returns all locally available records from the store, ignoring any filters and including grouping headers / footers.
     * @member {Core.data.Model[]}
     * @readonly
     * @category Records
     */
    get allRecords() {
        const me = this;

        if (me._allRecords?.generation !== me.storage.generation) {
            if (me.isTree) {
                const result = me.collectDescendants(me.rootNode, undefined, undefined, { unfiltered : true }).all;

                if (me.rootVisible) {
                    result.unshift(me.rootNode);
                }

                me._allRecords = result;
            }
            else {
                me._allRecords = me.isGrouped
                    ? me.collectGroupRecords(true, true)
                    : me.storage.allValues;
            }

            me._allRecords.generation = me.storage.generation;
        }

        return me._allRecords;
    }

    // All records except special rows such group headers etc
    getAllDataRecords(searchAllRecords) {
        const me = this;

        if (me.tree) {
            return searchAllRecords ? me.allRecords : me.rootNode.allChildren;
        }

        return me.isGrouped ? me.collectGroupRecords(searchAllRecords, false) : (searchAllRecords ? me.storage.allValues : me.storage.values).filter(r => r);
    }

    /**
     * Called by owned record when the record has its {@link Core.data.Model#property-isCreating}
     * property toggled.
     * @param {Core.data.Model} record The record that is being changed.
     * @param {Boolean} isCreating The new value of the {@link Core.data.Model#property-isCreating} property.
     * @internal
     */
    onIsCreatingToggle(record, isCreating) {
        const
            me               = this,
            newlyPersistable = record.isPersistable && !isCreating;

        // If it's a transient "isCreating" record, waiting to be confirmed as a new entry
        // into the store, then it should *not* be in the added Bag as a syncable record.
        // If we are upgrading it to a permanent record, it *should* be in the added Bag.
        me.added[newlyPersistable ? 'add' : 'remove'](record);

        // If the record is newly persistable...
        if (newlyPersistable) {
            /**
             * Fired when a temporary record with the {@link Core.data.Model#property-isCreating} property set
             * has been confirmed as a part of this store by having its {@link Core.data.Model#property-isCreating}
             * property cleared.
             * @event addConfirmed
             * @param {Core.data.Store} source This Store.
             * @param {Core.data.Model} record The record confirmed as added.
             */
            me.trigger('addConfirmed', { record });

            // AjaxStore to commit confirmed new record
            if (me.autoCommit) {
                me.doAutoCommit();
            }
        }
    }

    // Join added records to store, not called when loading
    joinRecordsToStore(records) {
        const { totalCount } = this;

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            // Set a parentIndex on newly added records, based on count prior to the add
            record.setData('parentIndex', totalCount + i - records.length);
            record.joinStore(this);
        }
    }

    /**
     * Responds to mutations of the underlying storage Collection
     * @param {Object} event
     * @protected
     */
    onDataChange({ source : storage, action, added, removed, replaced, oldCount, items, from, to }) {
        const
            me                = this,
            isAddRemove       = dataAddRemoveActions[action],
            // The "filter" action's removed and added are not processed as adds and removes.
            // In a filter operation the records are still members of the store.
            addedCount        = isAddRemove && added?.length,
            removedCount      = isAddRemove && removed?.length,
            { generation }    = storage,
            isLocallyFiltered = me.isFiltered && !me.remoteFilter;

        let filtersWereReapplied,
            sortersWereReapplied;

        me._idMap = null;

        if (addedCount) {
            me.joinRecordsToStore(added);
        }

        replaced?.forEach(([oldRecord, newRecord]) => {
            oldRecord.unjoinStore(me, true);
            newRecord.joinStore(me);
        });

        // Allow mixins to mutate the storage before firing events.
        // StoreGroup does this to introduce group records into the mix.
        super.onDataChange(...arguments);

        // If the data was transformed by super call, we need to completely refresh the UI
        // befire firing the add event (Unless local filtering will do it)
        if (addedCount && storage.generation !== generation && !isLocallyFiltered) {
            me.trigger('refresh', arguments[0]);
        }

        // Join/unjoin incoming/outgoing records unless it's as a result of TreeNode operations.
        // If we are a tree, joining is done when nodes are added/removed
        // as child nodes of a joined parent.
        if (!me.isTree) {
            if (addedCount) {
                for (const record of added) {
                    // If was removed, remove from `removed` list
                    if (me.removed.includes(record)) {
                        me.removed.remove(record);
                    }
                    // Else add to `added` list unless we are adding records using the { clean : true }
                    // option of the add method
                    else if (!me.addingClean && !record.isLinked) {
                        me.added.add(record);
                    }
                }

                // Re-evaluate the current *local* filter set silently so that the
                // information we are broadcasting below is up-to-date.
                filtersWereReapplied = !me.remoteFilter && me.isFiltered && me.reapplyFilterOnAdd;
                if (filtersWereReapplied) {
                    me.filter({
                        silent : true
                    });
                }

                // if sortParamName not defined, is not remote sort
                sortersWereReapplied = !me.remoteSort && me.isSorted && me.reapplySortersOnAdd;
                if (sortersWereReapplied) {
                    me.sort(null, null, false, true);
                }
            }
            if (removedCount) {
                for (const record of removed) {
                    // If app was in the middle of a batched update, cancel the update.
                    record.cancelBatch();

                    record.unjoinStore(me);

                    // If was newly added, remove from `added` list
                    if (me.added.includes(record)) {
                        me.added.remove(record);

                        // if record is being materialized and removed along that process - we need to add it to
                        // "removed" bag, so that after the sync completes, a new sync is issued
                        if (record.isBeingMaterialized) {
                            me.removed.add(record);
                        }
                    }
                    // Else add to `removed` list
                    // Unless it's StateTrackingManager reverting the record insertion.
                    // Also unless it's a record which was a transient record created by the UI
                    // and then the create was canceled at the edit stage.
                    else if (!record._undoingInsertion && !record.isCreating && !record.isLinked) {
                        me.removed.add(record);
                    }
                }
                me.modified.remove(removed);

                // Re-evaluate the current *local* filter set silently so that the
                // information we are broadcasting below is up-to-date.
                filtersWereReapplied = isLocallyFiltered;
                if (filtersWereReapplied) {
                    me.filter({
                        silent : true
                    });
                }
            }
        }

        switch (action) {
            case 'clear':
                // Clear our own relationCache, since we will be empty
                me.relationCache = {};

                // Signal to stores that depend on us
                me.updateDependentStores('removeall');

                me.trigger('removeAll');
                me.trigger('change', {
                    action : 'removeall'
                });
                break;

            case 'splice':
                if (addedCount) {
                    me.updateDependentStores('add', added);

                    const
                        // Collection does not handle moves, figure out if and where a record was moved from by checking
                        // previous index value stored in meta
                        oldIndex = added.reduce((lowest, record) => {
                            const { previousIndex } = record.meta;
                            if (previousIndex > -1 && previousIndex < lowest) lowest = previousIndex;
                            return lowest;
                        }, added[0].meta.previousIndex),

                        index    = storage.indexOf(added[0], !storage.autoFilter),

                        params   = {
                            records : added,
                            index
                        };

                    // Only include param oldIndex when used
                    if (oldIndex > -1) {
                        params.oldIndex = oldIndex;
                    }

                    me.trigger('add', params);

                    me.trigger('change', { action : 'add', ...params });

                    if (filtersWereReapplied) {
                        me.triggerFilterEvent({
                            action : 'filter', filters : me.filters, oldCount, records : me.storage.allValues
                        });
                    }

                    if (sortersWereReapplied) {
                        me.trigger('sort', { action : 'sort', sorters : me.sorters, records : me.storage.allValues });
                    }
                }

                if (removed.length) {
                    me.updateDependentStores('remove', removed);

                    me.trigger('remove', {
                        records : removed
                    });
                    me.trigger('change', {
                        action  : 'remove',
                        records : removed
                    });
                }

                if (replaced.length) {
                    me.updateDependentStores('replace', replaced);

                    me.trigger('replace', {
                        records : replaced,
                        all     : me.records.length === replaced.length
                    });
                    me.trigger('change', {
                        action : 'replace',
                        replaced,
                        all    : me.records.length === replaced.length
                    });
                }
                break;

            case 'filter':
                // Reapply grouping/sorting to make sure unfiltered records get sorted correctly
                if (me.isGrouped || me.isSorted) {
                    me.performSort(true);
                }
                break;

            case 'move': {
                // silently update parentIndex of records affected
                const
                    start = Math.min(from, to),
                    // We need to constrain maximum index in case record gets removed due to moving to the
                    // collapsed group
                    end   = Math.min(me.storage.allValues.length - 1, Math.max(from, to));

                for (let allRecords = me.storage.allValues, i = start; i <= end; i++) {
                    allRecords[i].setData('parentIndex', i);
                }

                /**
                 * Fired when a block of records has been moved within this Store
                 * @event move
                 * @param {Core.data.Store} source This Store
                 * {@link Core.data.mixin.StoreCRUD#function-move} API now accepts an array of records to move).
                 * @param {Core.data.Model[]} records The moved records.
                 * @param {Number} from The index from which the record was removed (applicable only for flat store).
                 * @param {Number} to The index at which the record was inserted (applicable only for flat store).
                 * @param {Core.data.Model} [newParent] The new parent record for the dragged records (applicable only for tree stores)
                 * @param {Core.data.Model[]} [oldParents] The old parent records for the dragged records (applicable only for move operations in tree stores)
                 */
                me.trigger('move', {
                    records : items,
                    from,
                    to
                });

                // The move was in real data. If we are filtered, the
                // filtered set has to be refreshed.
                if (me.isFiltered) {
                    me.performFilter();
                }
                me.trigger('change', {
                    action,
                    record  : items[0],
                    records : items,
                    from,
                    to
                });
                break;
            }

            case 'replaceValues':
                me.trigger('change', {
                    action
                });
                break;
        }
    }

    onDataReplaced(action, data) {
        const
            me          = this,
            { storage } = me,
            all         = storage.allValues,
            sorted      = Boolean(me.sorters.length > 0);

        for (let i = 0; i < all.length; i++) {
            all[i]?.joinStore(me);
        }

        // The three operations below, filter, store and sort, all are passed
        // the "silent" parameter meaning they do not fire their own events.
        // The 'refresh' and 'change' events after are used to update UIs.
        if (!me.remoteFilter && me.isFiltered) {
            me.filter({
                silent : true
            });
        }

        if (me.remoteSort) {
            if (me.isGrouped) {
                storage.replaceValues({
                    // Need to update group records info (headers and footers)
                    ...me.prepareGroupRecords(),
                    silent : true
                });
            }
        }
        else {
            // <remove-on-release>
            // TODO: groupers must just be promoted to be the primary sorters.
            // </remove-on-release>
            if (me.isGrouped) {
                me.group(null, null, false, !sorted, true);
            }

            // Only request sorting of arriving data if sorting is not remote.
            if (sorted) {
                me.sort(null, null, false, true);
            }
        }

        // Check for duplicate ids, unless user guarantees data validity
        if (!me.useRawData.disableDuplicateIdCheck) {
            const { idMap } = me;

            if (Object.keys(idMap).length < storage.values.length) {
                // idMap has fewer entries than expected, a duplicate id was used. pick idMap apart to find out which
                const collisions = [];

                storage.values.forEach(r => idMap[r.id] ? delete idMap[r.id] : collisions.push(r));

                throw new Error(`Id collision on ${collisions.map(r => r.id)}`);
            }
        }

        const event = { action, data, records : storage.values };

        me.updateDependentStores(action, event.records);

        // Allow subclasses to postprocess a new dataset
        me.afterLoadData?.();

        if (!me.isRemoteDataLoading) {
            me.trigger('refresh', event);
        }

        me.trigger('change', event);
    }

    /**
     * This is called from Model after mutating any fields so that Stores can take any actions necessary at that point,
     * and distribute mutation event information through events.
     * @param {Core.data.Model} record The record which has just changed
     * @param {Object} toSet A map of the field names and values that were passed to be set
     * @param {Object} wasSet A map of the fields that were set. Each property is a field name, and
     * the property value is an object containing two properties: `oldValue` and `value` eg:
     *
     * ```javascript
     *     {
     *         name {
     *             oldValue : 'Rigel',
     *             value : 'Nigel'
     *         }
     *     }
     * ```
     *
     * @param {Boolean} silent Do not trigger events
     * @param {Boolean} fromRelationUpdate Update caused by a change in related model
     * @private
     */
    onModelChange(record, toSet, wasSet, silent, fromRelationUpdate) {
        const
            me          = this,
            event       = {
                record,
                records : [record],
                changes : wasSet,
                // Cannot use isBatching, since change is triggered when batching has reached 0
                // (but before it is set to null)
                batch   : record.batching != null,
                fromRelationUpdate
            };

        // Inform underlying collection of the changes, allowing it to keep any indices up to date
        me.storage.onItemMutation(record, wasSet);

        // Always update indices, otherwise they will be left out of date (was previously skipped when silent)
        if ('id' in wasSet) {
            const { oldValue, value } = toSet.id;

            me.updateDependentRecordIds(oldValue, value);

            me.onRecordIdChange({ record, oldValue, value });
        }
        else if (!record.meta._ignoreRelatedIdUpdate) {
            me.updateDependentStores('update', [record], silent);
        }

        // Cannot be part of top const, id change must have happened before we update modified bag
        const committable = (record.ignoreBag || record.isLinked ? false : me.updateModifiedBagForRecord(record)) &&
            // The changes are *not* committable if the record has any pending formulae.
            // The resolved value of formulae will be set in the record when they resolve,
            // and the change event will be triggered again.
            !record.meta?.pendingFormulae;

        me.onUpdateRecord(record, wasSet);

        if (!silent) {
            if ('id' in wasSet) {
                const { oldValue, value } = toSet.id;

                me.trigger('idChange', {
                    store : me,
                    record,
                    oldValue,
                    value
                });
            }

            me.trigger('update', event);
            me.trigger('change', { action : 'update', ...event });
        }

        if (me.autoCommit && committable) {
            me.doAutoCommit();
        }
    }

    updateModifiedBagForRecord(record) {
        const
            me                  = this,
            { modified, added } = me;

        // Add or remove from our modified Bag
        if (record.isModified && !record.isRoot && me.idRegister[record.id]) {
            if (!modified.includes(record) && !added.includes(record)) {
                // When we add a new model first time and the model is not persistable (for example when the model is not valid),
                // it is not added to the "added" collection (StoreBag), but only joined to the store.
                // So if the record is not added neither to "modified" nor "added",
                // need to check if this record is phantom. If so, add it to the "added", otherwise to the "modified".
                if (record.isPhantom) {
                    added.add(record);
                }
                else {
                    modified.add(record);
                }
            }

            // we need to track the records, that have been modified during their materialization process
            // separately (normally they are not included in the store's "changes")
            if (record.isBeingMaterialized) {
                me.modifiedMaterialized = me.modifiedMaterialized ?? new Set();
                me.modifiedMaterialized.add(record);
            }

            // We need to return true here even if the record was in any of the "bags"
            // A sync request can be ongoing, and another autoCommit needs to be triggered in those cases
            // Multiple autoCommits will be handles by the autoCommit delay
            return true;
        }

        modified.remove(record);

        return false;
    }

    get idMap() {
        const
            me           = this,
            needsRebuild = !me._idMap,
            idMap        = me._idMap || (me._idMap = {});

        if (needsRebuild) {
            const processedRecords = me.storage.values;
            for (let record, index = 0, visibleIndex = 0; index < processedRecords.length; index++) {
                record = processedRecords[index];
                if (record) {
                    idMap[record.id] = { index, visibleIndex, record };
                }
                if (!record?.isSpecialRow) {
                    visibleIndex++;
                }
            }

            // If store is filtered and grouped, we often need to lookup record index in filtered and unfiltered
            // collections
            if (me.isFiltered) {
                for (let index = 0, l = me.storage._values.length; index < l; index++) {
                    const record = me.storage._values[index];
                    if (record) {
                        if (record.id in idMap) {
                            idMap[record.id].unfilteredIndex = index;
                        }
                        else {
                            // If record is not in the idMap, set its index as -1 which allows
                            // `store.includes` API work correctly
                            idMap[record.id] = {
                                index           : -1,
                                unfilteredIndex : index,
                                record
                            };
                        }
                    }
                }
            }
        }

        return idMap;
    }

    changeModelClass(ClassDef) {
        const
            me         = this,
            { fields } = me;

        // When modelClass is reassigned on a live store, the class generated for the outgoing one is now unused
        Model.unregisterSubModel(me._generatedModelClass);

        me.originalModelClass = ClassDef;

        let ClassDefEx = ClassDef;

        // Ensure our modelClass is exchanged for an extended of modelClass decorated with any configured fields.
        if (fields?.length) {
            // angular prod build messes up "Foo = class extends Base" (https://github.com/bryntum/bryntum/issues/6395)
            class ModelClass extends ClassDef {
                static get fields() {
                    return fields;
                }
            }

            ClassDefEx = ModelClass;
        }
        // If we expose properties on Model we will pollute all other models, use internal subclass instead
        else if (!me.preventSubClassingModel) {
            // angular prod build messes up "Foo = class extends Base" (https://github.com/bryntum/bryntum/issues/6395)
            class ModelClass extends ClassDef {
                static $name = ClassDef.$name;
            }

            ClassDefEx = ModelClass;
        }

        // Need to properly expose relations on this new subclass
        ClassDefEx.initClass();

        // Only a class generated here may be unregistered from its ancestors later. A configured class belongs to
        // the application and must stay registered
        me._generatedModelClass = ClassDefEx === ClassDef ? null : ClassDefEx;

        return ClassDefEx;
    }



    //endregion

    //region Store id & map

    changeId(id, oldId) {
        return super.changeId((id !== true) && id, oldId);
    }

    updateId(id, oldId) {
        // <remove-on-release>
        // Store code always did just evict any other instance by that ID.
        // TODO: Should we tighten this up?
        // </remove-on-release>
        const duplicate = Store.getById(id);

        duplicate && Store.unregisterInstance(duplicate);

        super.updateId(id, oldId);
    }

    generateAutoId() {
        return Store.generateId(`store-`);
    }

    updateTree(tree) {
        if (tree && !this.rootNode) {
            this.rootNode            = this.buildRootNode();
            this.rootNode.isAutoRoot = true;
        }
    }

    get autoTree() {
        return this.tree !== false && this._autoTree;
    }

    // a hook to build a customized root node
    buildRootNode() {
        return {};
    }

    /**
     * Creates a new Store instance, or retrieves an existing one.
     *
     * A Store config object may contain a `type` property to identify a specific Store subclass to create.
     * If `type` is not specified, a base Store instance will be created.
     *
     * Get a store by passing in the `id` of an existing store:
     * ```javascript
     * // Get a store by id
     * const store = Store.getStore('myStoreId');
     * ```
     *
     * Create a store from an array of data objects:
     * ```javascript
     * const store = Store.getStore([
     *     { id : 1, name : 'Linda', city : 'NY' },
     *     { id : 2, name : 'Olivia', city : 'Paris' },
     *     ...
     * ]);
     * ```
     * Create a store from a config object using a `type` property to identify a specific Store subclass to create:
     * ```javascript
     * const store = Store.getStore({
     *     type       : 'tree',
     *     modelClass : MyModel,
     *     data       : [
     *         { id : 1, name : 'Linda', city : 'NY' },
     *         { id : 2, name : 'Olivia', city : 'Paris' },
     *         ...
     *     ]
     * });
     * ```
     * @param {String|Number|StoreConfig|Object[]} id The id of the store to retrieve, or an array of objects
     * from which to create the contents of a new Store.
     * @param {Function} [storeClass] The default Store class to instantiate.
     * @returns {Core.data.Store} The newly created Store, or an existing Store if id matched an existing Store.
     */
    static getStore(id, storeClass) {
        if (id instanceof Store) {
            return id;
        }
        if (this.getById(id)) {
            return this.getById(id);
        }
        if (Array.isArray(id)) {
            // Model itself is a safe default, since the store subclasses it (see preventSubClassingModel below)
            // rather than exposing the data's properties on it
            let storeModel = Model;

            const storeData = id.map(item => {
                if (item instanceof Model) {
                    storeModel = item.constructor;
                }
                else if (typeof item === 'string') {
                    item = {
                        text : item
                    };
                }
                //<debug>
                else if (item.constructor.name !== 'Object') {
                    throw new Error('getStore must be passed an array of Objects');
                }
                //</debug>
                return item;
            });

            id = {
                autoCreated             : true,
                data                    : storeData,
                modelClass              : storeModel,
                allowNoId               : true, // String items have no id and are not guaranteed to be unique
                // The store owns the subclass it generates, and unregisters it when destroyed. Explicit, since a
                // custom storeClass may default this to `true`
                preventSubClassingModel : false
            };
            if (!storeClass) {
                storeClass = Store;
            }
        }
        // Use the Store factory if a config object with a `type` property is passed
        else if (id?.type) {
            return Store.create(id, storeClass || Store);
        }
        if (storeClass) {
            return new storeClass(id);
        }
    }

    /**
     * Get all registered stores
     * @member {Core.data.Store[]}
     * @readonly
     */
    static get stores() {
        return Store.registeredInstances;
    }

    //endregion

    //region Data

    /**
     * The invisible root node of this tree.
     * @member {Core.data.Model}
     * @readonly
     * @category Tree
     */
    get rootNode() {
        return !this.isChainedTree && this.masterStore ? this.masterStore.rootNode : this._rootNode;
    }

    set rootNode(rootNode) {
        const
            me      = this,
            oldRoot = me._rootNode;

        // No change
        if (rootNode === oldRoot) {
            return;
        }

        if (oldRoot) {
            me.clear(true);
            me.removed.clear(); //Maybe move into the clear function?
        }
        if (rootNode instanceof Model) {
            // We insist that the rootNode is expanded otherwise no children will be added
            rootNode.instanceMeta(me).collapsed = false;

            me._rootNode = rootNode;
        }
        else {
            me._rootNode = rootNode = new me.modelClass({
                expanded                : true,
                [me.modelClass.idField] : `${me.id}-rootNode`,
                ...rootNode
            }, me, { isRoot : true }, true);
        }
        me._tree        = true;
        rootNode.isRoot = true;
        rootNode.joinStore(me);

        // If there are nodes to be inserted into the flat storage
        // then onNodeAddChild knows how to do that and what events
        // to fire based upon rootNode.isLoading.
        if (rootNode.children?.length || me.rootVisible) {
            rootNode.isLoading = true;
            me.onNodeAddChild(rootNode, rootNode.children || [], 0);
            rootNode.isLoading = false;
        }

        me.trigger('rootChange', { oldRoot, rootNode });
    }

    /**
     * Sets data in the store.
     *
     * Expects an array of JavaScript objects, with properties matching store's fields (defined on its
     * {@link #config-modelClass model} or in the {@link #config-fields} config).
     *
     * Called on initialization if `data` is in the config, otherwise call it yourself after for example using fetch to
     * get remote data:
     *
     * ```javascript
     * store.data = [
     *     { id : 1, name : 'Linda', city : 'NY' },
     *     { id : 2, name : 'Olivia', city : 'Paris' },
     *     ...
     * ];
     * ```
     *
     * Can also be used to get an array of the current raw data objects from all records in the store (ignoring
     * filtering and grouping):
     *
     * ```javascript
     * console.log(store.data);
     * // [
     * //     { id : 1, name : 'Linda', city : 'NY' },
     * //     { id : 2, name : 'Olivia', city : 'Paris' },
     * //     ...
     * // ]
     * ```
     *
     * {@note}You should not modify the objects in the array, neither the store nor the record will be aware of the
     * changes.{/@note}
     *
     * @member {Object[]}
     * @fires refresh
     * @fires change
     * @category Records
     * @non-lazy-load
     */
    set data(data) {
        this.setStoreData(data);
    }

    get data() {
        return this.getAllDataRecords(true).map(record => record.data);
    }

    // For overridability in engine
    setStoreData(data) {
        const
            me                         = this,
            { idField, childrenField } = me.modelClass;

        // Allow data as a "named object", using keys as ids
        if (data && !Array.isArray(data)) {
            data = ObjectHelper.transformNamedObjectToArray(data, idField);
        }

        const isExtensible = WalkHelper.walkWhile(data ?? [], n => n[childrenField], Object.isExtensible);

        // Peek at first data row, and clone data if we are provided immutable objects (and won't be cloning later)
        if (data?.length && !isExtensible && (me.transformFlatData || me.useRawData.enabled)) {
            if (me.transformFlatData) {
                // Avoid cloning object again in Model
                me.useRawData = me.useRawData || {
                    disableDuplicateIdCheck : false,
                    disableDefaultValue     : false,
                    disableTypeConversion   : false
                };
            }
            data = ObjectHelper.clone(data);
        }

        // Make sure that if the plugins have not been processed yet, we call
        // the temporary property getter which configuration injects to
        // process plugins at this point. Some plugins are required to
        // operate on incoming data.
        me.getConfig('plugins');

        // In case data is loaded during configuration before configuredListeners have been processed
        me.processConfiguredListeners();

        // Convert to being a tree store if any of the new rows have a children property
        if (!(me.isChained && !me.isChainedTree)) {
            if (me.autoTree && data?.some(r => r[childrenField])) {
                me.tree = true;
            }
        }

        // Store received data order to preserve on sort if remote data loading enabled
        if (data && (me.remoteSort || me.remoteFilter)) {
            for (let i = 0; i < data.length; i++) {
                data[i]._remoteSortIndex = i;
            }
        }

        // Always load a new dataset initially
        if (!me.syncDataOnLoad || !me._data) {
            me._data = data;
            // This means load the root node

            if (me.tree) {
                me.loadTreeData(data);
            }
            else {
                me.loadData(data);
            }

            // loading the store discards all tracked changes
            me.added.clear();
            me.removed.clear();
            me.modified.clear();
        }
        // Sync dataset if configured to do so
        else {
            me.syncDataset(data);
        }
    }

    loadTreeData(data) {
        const
            me            = this,
            root          = me.rootNode,
            expandedState = new Map();

        if (me.transformFlatData) {
            data = me.treeifyFlatData(data);
        }

        root.isLoading = true;

        // Store expanded/collapsed state of tree nodes if configured
        if (me.records.length && me.keepExpandedOnLoad) {

            // For each non-leaf record, store its collapsed state
            me.traverse(record => {
                if (!record.isLeaf) {
                    expandedState.set(record.id, record.instanceMeta(me).collapsed);
                }
            });
        }

        // Ensure root level items are sorted by parentIndex
        data.sort((a, b) => a.parentIndex - b.parentIndex);

        // clear silently without marking as removed
        me.clear(true);
        // Append data to root node and temporarily suspend events
        me.suspendEvents(true);
        root.appendChild(data);

        // Restore expanded/collapsed state if configured
        expandedState.forEach((isCollapsed, recordId) => {
            const record = me.getById(recordId);
            if (record) {
                me.toggleCollapse(record, isCollapsed);
            }
        });

        me.resumeEvents();

        me.updateDependentStores('dataset', [root]);

        root.isLoading = false;

        if (data.length === 0) {
            const event = { action : 'dataset', data : [], records : [] };
            me.trigger('refresh', event);
            me.trigger('change', event);
        }
        // we must re-apply filters for the filtered tree store
        else if (me.isFiltered && !me.remoteFilter) {
            me.filter();
        }
    }

    loadData(data, action = 'dataset') {
        const
            me                     = this,
            { storage, allowNoId } = me,
            idField                = me.modelClass.fieldMap.id.dataSource,
            creatingRecord         = me.find(rec => rec.isCreating);

        if (creatingRecord) {
            storage.values.splice(me.records.indexOf(creatingRecord), 1);
        }

        let warnGenerated = me.verifyNoGeneratedIds;

        // Need to unregister all groups
        me.removeHeadersAndFooters(me.storage.values);

        me._idMap   = null;
        me.oldIdMap = {};

        if (data) {
            const
                isRaw   = !(data[0] instanceof Model),
                count   = data.length,
                records = new Array(count);

            if (isRaw) {
                me.modelClass.exposeProperties(data[0]);
            }

            for (let i = 0; i < count; i++) {
                let record = data[i];

                if (isRaw) {
                    const id = record[idField];

                    if (!allowNoId && id == null) {
                        throw new Error(`Id required but not found on row ${i}`);
                    }

                    if (warnGenerated && id?.startsWith?.('_generated')) {
                        console.warn(`Generated id found in data: ${id}. Generated ids are temporary and should be replaced with real ids by the backend`);
                        warnGenerated = false;
                    }

                    record = me.createRecord(record, true);
                }

                if (!me.isFillingFromMaster) {
                    record = me.processRecord(record, true);
                    record.setData('parentIndex', i);
                }

                records[i] = record;
            }

            // clear without marking as removed
            me.clear(true);

            // Allow Collection's own filters to work on the Collection by
            // passing the isNewDataset param as true.
            // The storage Collection may have been set up with its own filters
            // while we are doing remote filtering. An example is ComboBox
            // with filterSelected: true. Records which are in the selection are
            // filtered out of visibility using a filter directly in the Combobox's
            // Store's Collection.
            storage.replaceValues({
                values       : records,
                isNewDataset : true,
                silent       : true
            });

            if (creatingRecord && !storage.values.includes(creatingRecord)) {
                storage.values.push(creatingRecord);
            }
            me._data = data;
            me.onDataReplaced(action, data);
        }
        else {
            // clear without marking as removed
            me.clear(true);

            me._data = null;
            me.onDataReplaced(action, data);
        }

        me.isSyncingDataOnLoad = false;
    }

    /**
     * Creates an array of records from this store from the `start` to the `end` - 1
     * @param {Number} [start] The index of the first record to return
     * @param {Number} [end] The index *after* the last record to return `(start + length)`
     * @returns {Core.data.Model[]} The requested records.
     * @category Records
     * @non-lazy-load
     */
    getRange(start, end, all = true) {
        return (all ? this.storage.allValues : this.storage.values).slice(start, end);
    }

    /**
     * Creates a model instance, used internally when data is set/added.
     * Provide this method for your own custom conversion from data to record.
     * @config {Function} createRecord
     * @param {*} data Json data
     * @param {Boolean} [skipExpose=false] Supply true when batch setting to not expose properties multiple times
     * @returns {Core.data.Model}
     * @category Records
     */

    /**
     * Creates a model instance, used internally when data is set/added. Override this in a subclass to do your own custom
     * conversion from data to record.
     * @param {Object} data Json data
     * @param {Boolean} [skipExpose=false] Supply true when batch setting to not expose properties multiple times
     * @returns {Core.data.Model}
     * @category Records
     */
    createRecord(data, skipExpose = false, rawData = false) {
        // Not using the accessor since this is hit for each record created when loading data
        return new this._modelClass(data, this, null, skipExpose, false, rawData);
    }

    processRecord(record, isDataset = false) {
        return record;
    }

    refreshData() {
        this.filter();
        this.sort();
    }

    onRecordIdChange(options) {
        const
            me                          = this,
            idMap                       = me._idMap,
            { record, oldValue, value } = options,
            { idRegister, oldIdMap }    = me;

        me.storage._indicesInvalid = true;

        // Remember the record used to have this identifier
        // this is used by STM to understand when a foreign key
        // value update really means targeting other record or
        // it's just a reaction to the target record id change
        oldIdMap[oldValue] = record;

        // Update idMap to reflect the changed id. Some code paths (auto syncing changes with CrudManager) will lead to
        // idMap already being up-to-date when we get here
        if (idMap && !idMap[value]) {
            const entry = idMap[oldValue];
            delete idMap[oldValue];
            idMap[value] = entry;
        }

        me.added.changeId(oldValue, value);
        me.removed.changeId(oldValue, value);
        me.modified.changeId(oldValue, value);

        delete idRegister[oldValue];
        idRegister[value] = record;

        record.index = me.storage.indexOf(record);

        super.onRecordIdChange?.(options);
    }

    onUpdateRecord(record, changes) {
        const
            me = this,
            { internalId } = changes,
            { internalIdRegister, reapplyFilterOnUpdate, reapplySortersOnUpdate } = me;

        if (internalId) {
            this.storage._indicesInvalid = true;
            delete internalIdRegister[internalId.oldValue];
            internalIdRegister[internalId.value] = record;
        }

        // An expanded-only change is collapse/expand view state; the tree already maintains the flat list,
        // so reapplying the filter here would double-remove descendants from storage (#11680).
        const expandedOnlyTreeChange = me.isTree && 'expanded' in changes && Object.keys(changes).length === 1;

        // Reapply filters when records change?
        if (!expandedOnlyTreeChange &&
            (reapplyFilterOnUpdate === true || reapplyFilterOnUpdate.fields?.some(field => field in changes)) && me.isFiltered) {
            if (!me.filterBatching) {
                me.filter();
            }
            else {
                me.needsFiltering = true;
            }
        }
        // Reapply sorters when records change?
        if ((reapplySortersOnUpdate === true || reapplySortersOnUpdate.fields?.some(field => field in changes)) && me.isSorted) {
            if (!me._reapplySortersSuspended) {
                me.sort();
            }
            else {
                me._shouldReapplySorters = true;
            }
        }
    }

    get useRawData() {
        // If not explicitly set, use raw data if loaded remotely
        if (this._useRawData === useRawDataUnset) {
            if (this.readUrl || this.crudManager?.loadUrl) {
                return useRawDataRemoteDefaults;
            }

            return { enabled : false };
        }

        return this._useRawData;
    }

    changeUseRawData(options) {
        // When unset, detect at runtime if raw data should be used or not
        if (options === useRawDataUnset) {
            return useRawDataUnset;
        }

        // When set to true, use default options
        if (options === true) {
            return useRawDataDefaults;
        }

        // When passed options, flag as enabled
        return options ? Object.assign(options, { enabled : true }) : { enabled : false };
    }

    /**
     * This event only fires in a non-{@link Core.data.AjaxStore}, configured with {@link #config-remoteSort},
     * {@link #config-remoteFilter} or {@link #config-remotePaging}, when the Store requests more or new data.
     *
     * The event will contain same params as described in the {@link #config-requestData} function. This event can
     * be listened to if you want to receive notifications about the Store's data requests, but not *directly* want to
     * return the requested data. For example, when you got the Store's {@link #config-data} bound to a data source with
     * the help of an external library/framegrunt docswork.
     *
     * @event requestData
     * @property {Number} startIndex The index of the first record being requested (only lazyLoad)
     * @property {Number} count The number of records being requested (only lazyLoad)
     * @property {Number} page The page number being requested (only remotePaging)
     * @property {Number} pageSize The number of records being requested (only remotePaging)
     * @property {Sorter[]} sorters If {@link #config-remoteSort} is active, this will contain a number of sorter objects
     * @property {CollectionFilterConfig[]} filters If {@link #config-remoteFilter} is active, this will contain a number
     */

    async performDataRequest(silent, extraParams, setDataHook) {
        const
            me     = this,
            params = me.buildRemoteParams(extraParams);
        let data, total;

        if (!silent &&
            (await me.trigger('beforeRequest', { action : 'read', params }) === false || // To match AjaxStore
            await me.trigger?.('requestData', params) === false)) { // ? because Store can have been destroyed
            return false;
        }

        if (me.isDestroyed) {
            return;
        }

        if (me.requestData) {
            ({ data, total } = await me.requestData(params));

            if (me.isDestroyed) {
                return;
            }

            // Hook used for paging to set currentPage with correct timing
            setDataHook?.();

            me.data = data;
            if (total != null) {
                me.remoteTotal = total;
            }
        }
        else {
            setDataHook?.();
        }

        await me.trigger?.('afterRequest', { response : { data, total }, params, action : 'read' });
    }

    //endregion

    //region Count

    /**
     * Counts the number of records in the store. Allows passing an options object to control which records are counted.
     * For example:
     *
     * ```javascript
     * store.getCount({ filteredOut : true });
     * store.getCount({ headersFooters : true, collapsed : true });
     * ```
     *
     * Consider the following dataset loaded into a Store:
     *
     * ```javascript
     * [
     *   { id : 1, name : 'Linda', city : 'NY' },
     *   { id : 2, name : 'Olivia', city : 'NY' },
     *   { id : 3, name : 'John', city : 'Stockholm' }
     * ]
     * ```
     *
     * No grouping or filtering is applied, thus all records are accessible ("visible"). Passing the different options
     * below would yield the following results:
     *
     * | Option           | Count | Description                          |
     * |------------------|-------|--------------------------------------|
     * | `filteredOut`    | 0     | No records are filtered out          |
     * | `headersFooters` | 0     | No group headers have been generated |
     * | `collapsed`      | 0     | No groups are collapsed              |
     * | `visibleData`    | 3     | All data records are "visible"       |
     * | `all`            | 3     | All options combined                 |
     *
     * Grouping by `city` yields the following records in the Store (pseudocode):
     *
     * ```javascript
     * store.group('city');
     *
     * [
     *   { name : 'Group NY', groupHeader : true, expanded : true },
     *   { id : 1, name : 'Linda', city : 'NY' },
     *   { id : 2, name : 'Olivia', city : 'NY' },
     *   { name : 'Group Stockholm', groupHeader : true },
     *   { id : 3, name : 'John', city : 'Stockholm', expanded : true }
     * ]
     * ```
     *
     * Passing the different options below would yield the following results:
     *
     * | Option           | Count | Description                          |
     * |------------------|-------|--------------------------------------|
     * | `filteredOut`    | 0     | No records are filtered out          |
     * | `headersFooters` | 2     | Group headers have been generated    |
     * | `collapsed`      | 0     | No groups are collapsed              |
     * | `visibleData`    | 3     | All data records are "visible"       |
     * | `all`            | 5     | All options combined                 |
     *
     * Collapsing the `Stockholm` group yields the following records in the Store (pseudocode):
     *
     * ```javascript
     * store.collapse(store.getAt(3));
     *
     * [
     *   { name : 'Group NY', groupHeader : true, expanded : true },
     *   { id : 1, name : 'Linda', city : 'NY' },
     *   { id : 2, name : 'Olivia', city : 'NY' },
     *   { name : 'Group Stockholm', groupHeader : true, expanded : false }
     * ]
     * ```
     *
     * Passing the different options below would yield the following results:
     *
     * | Option           | Count | Description                          |
     * |------------------|-------|--------------------------------------|
     * | `filteredOut`    | 0     | No records are filtered out          |
     * | `headersFooters` | 2     | Group headers have been generated    |
     * | `collapsed`      | 1     | A group with one record is collapsed |
     * | `visibleData`    | 2     | Not all data records are "visible"   |
     * | `all`            | 5     | All options combined                 |
     *
     * Applying a filter further affects the counts (pseudocode):
     *
     * ```javascript
     * store.filter('name', 'Linda');
     *
     * [
     *   { name : 'Group NY', groupHeader : true, expanded : true },
     *   { id : 1, name : 'Linda', city : 'NY' }
     * ]
     * ```
     *
     * Passing the different options below would yield the following results:
     *
     * | Option           | Count | Description                          |
     * |------------------|-------|--------------------------------------|
     * | `filteredOut`    | 2     | Records are filtered out             |
     * | `headersFooters` | 2     | Group headers have been generated*   |
     * | `collapsed`      | 1     | A group with one record is collapsed |
     * | `visibleData`    | 1     | Not all data records are "visible"   |
     * | `all`            | 5     | All options combined                 |
     *
     * <sup>*</sup> Note that also passing `filteredOut` would include filtered out group headers in the count.
     *
     * @param {Object} [options] Pass an object with options to control the count
     * @param {Boolean} [options.filteredOut=false] Count records that are filtered out
     * @param {Boolean} [options.headersFooters=false] Count generated group headers and footers (not applicable for
     * tree data)
     * @param {Boolean} [options.collapsed=false] Count records that are collapsed away, either belonging to a
     * collapsed group, or by belonging to a collapsed branch in a tree
     * @param {Boolean} [options.visibleData=true] Count data records that are not filtered out or collapsed away
     * @param {Boolean} [options.all=false] Convenience option to count all records (all options as `true`)
     * @returns {Number} Record count
     * @category Records
     */
    getCount(options = {}) {
        const
            me = this,
            {
                storage,
                groupRecords,
                isFiltered,
                isGrouped,
                isTree,
                rootNode
            }  = me;

        // Cheaper way to get all records count
        if (options.all) {
            return this.allRecords.length;
        }

        // Include visible data records by default
        if (!('visibleData' in options)) {
            options.visibleData = true;
        }

        let count = 0;

        const
            {
                visibleData,
                headersFooters,
                filteredOut,
                collapsed
            }               = options,
            // Generated group headers (& footers)
            generatedCount  = isFiltered
                // Count group headers that are not filtered out
                ? groupRecords?.values.reduce((count, group) => count + (me.includes(group) ? 1 : 0), 0) ?? 0
                // All group headers
                : groupRecords?.count ?? 0,
            // "Normal" visible records
            accessibleCount = storage.count - generatedCount;

        if (visibleData) {
            count += accessibleCount;
        }

        if (headersFooters && isGrouped) {
            // When counting filtered out records, also count filtered out group headers
            if (isFiltered && filteredOut) {
                count += groupRecords?.count ?? 0;
            }
            else {
                count += generatedCount;
            }
        }

        if (filteredOut && isFiltered) {
            if (isTree) {
                count += rootNode.getDescendantCount(false, me, true) - rootNode.getDescendantCount(false, me, false);
            }
            else {
                // Storage values holds the filtered result, allValues holds all records.
                // The difference is the filtered out records
                count += storage.allValues.length - storage.values.length;
            }
        }

        if (collapsed) {
            if (isGrouped) {
                for (const grpRec of (groupRecords ?? [])) {
                    count += grpRec.meta.collapsed ? grpRec.groupChildren.length : 0;
                }
            }
            else if (isTree) {
                count += rootNode.descendantCount - accessibleCount;
            }
        }

        return count;
    }

    /**
     * Record count, including records added for group headers etc., excluding collapsed or filtered away records. That
     * is, `count` is the "visible record count", if the store is used in a Grid or other component that visualize the
     * records.
     *
     * Consider the following dataset loaded into a Store:
     *
     * ```javascript
     * [
     *   { id : 1, name : 'Linda', city : 'NY' },
     *   { id : 2, name : 'Olivia', city : 'NY' },
     *   { id : 3, name : 'John', city : 'Stockholm' }
     * ]
     *
     * // count === 3
     * ```
     *
     * Grouping by `city` yields the following records in the Store (pseudocode):
     *
     * ```javascript
     * store.group('city');
     *
     * [
     *   { name : 'Group NY', groupHeader : true, expanded : true },
     *   { id : 1, name : 'Linda', city : 'NY' },
     *   { id : 2, name : 'Olivia', city : 'NY' },
     *   { name : 'Group Stockholm', groupHeader : true },
     *   { id : 3, name : 'John', city : 'Stockholm', expanded : true }
     * ]
     *
     * // count === 5
     * ```
     *
     * Collapsing the `Stockholm` group yields the following records in the Store (pseudocode):
     *
     * ```javascript
     * store.collapse(store.getAt(3));
     *
     * [
     *   { name : 'Group NY', groupHeader : true, expanded : true },
     *   { id : 1, name : 'Linda', city : 'NY' },
     *   { id : 2, name : 'Olivia', city : 'NY' },
     *   { name : 'Group Stockholm', groupHeader : true, expanded : false }
     * ]
     *
     * // count === 4
     * ```
     *
     * Applying a filter further affects the count (pseudocode):
     *
     * ```javascript
     * store.filter('name', 'Linda');
     *
     * [
     *   { name : 'Group NY', groupHeader : true, expanded : true },
     *   { id : 1, name : 'Linda', city : 'NY' }
     * ]
     *
     * // count === 2
     * ```
     *
     * If you need a different value for `count` in your app, for example ignoring filters, or including collapsed away
     * records, please use the more flexible {@link #function-getCount} function instead.
     *
     * If the store is configured with {@link Core.data.Store#config-lazyLoad}, this number is based on the total amount
     * of records specified in the response given to the {@link Core.data.Store#config-requestData} function.
     *
     * @member {Number}
     * @readonly
     * @category Records
     */
    get count() {
        return this.storage.count;
    }

    /**
     * Returns `true` if the data in this store depends on a remote data source. That is this
     * Store is an AjaxStore, or uses {@link #config-requestData}, or is chained off an AjaxStore.
     * @member {Boolean}
     * @readonly
     * @category Advanced
     */
    get isRemoteLoad() {
        return this.isAjaxStore || Boolean(this.requestData) || this.masterStore?.isRemoteLoad;
    }

    // Returns a timezone aware DateHelper if a timezone is configured, otherwise the regular DateHelper
    get dateHelper() {
        return this.masterStore?.dateHelper ?? this.$timeZoneOwner?.dateHelper ?? DateHelper;
    }

    get dh() {
        return this.dateHelper;
    }

    /**
     * Yields the complete dataset size, ignoring filtering and grouping. If the store
     * {@link #property-isPaged is paged}, it returns the `total` value provided in the page load request response, or
     * manually set.
     * @member {Number}
     * @category Records
     */
    get totalCount() {
        if (this.isPaged && 'remoteTotal' in this) {
            return this.remoteTotal;
        }

        return this.getCount({ all : true });
    }

    set totalCount(count) {
        if (this.isPaged) {
            this.remoteTotal = count;
        }
    }

    //endregion

    //region Get record(s)

    /**
     * Returns all locally available "visible" records.
     * {@note}The returned value **may not** be mutated! It is the store's own array, so reordering or splicing it
     * leaves a stale `idMap`, and `indexOf()`, `getNext()` and `getPrev()` silently return wrong results.
     * Sort or slice a copy instead: `[...store.records]`.{/@note}
     * @member {Core.data.Model[]}
     * @readonly
     * @immutable
     * @category Records
     */
    get records() {
        return this.storage.values;
    }

    /**
     * Get the first record locally available in the store.
     * @member {Core.data.Model}
     * @readonly
     * @category Records
     */
    get first() {
        return this.storage.values[0];
    }

    /**
     * Get the last record locally available in the store.
     * @member {Core.data.Model}
     * @readonly
     * @category Records
     */
    get last() {
        return this.storage.values[this.storage.values.length - 1];
    }

    /**
     * Get the record at the specified index.
     * @param {Number} index Index for the record
     * @returns {Core.data.Model} Record at the specified index
     * @category Records
     */
    getAt(index, all = false) {
        // all means include filtered out records
        return this.storage.getAt(index, all);
    }

    // These are called by Model#join and Model#unjoin
    // register a record as a findable member keyed by id and internalId
    register(record) {
        const me = this;

        if (!me.useRawData.disableDuplicateIdCheck) {
            // Test for duplicate IDs on register only when a tree store.
            // loadData does it in the case of a non-tree
            const existingRec = me.isTree && me.idRegister[record.id];

            if (existingRec && existingRec !== record) {
                throw new Error(`Id collision on ${record.id}`);
            }
        }

        me.idRegister[record.id]                 = record;
        me.internalIdRegister[record.internalId] = record;
    }

    unregister(record) {
        delete this.idRegister[record.id];
        delete this.internalIdRegister[record.internalId];
    }

    get registeredRecords() {
        return Object.values(this.idRegister);
    }

    /**
     * For a store backing a {@link Core.data.field.StoreDataField store type field}: the persistable array
     * representation of the store's records, cached and lazily recomputed when the store's contents have
     * changed (detected using the storage generation, or refreshed by the field's change propagation).
     * `undefined` for other stores.
     * @member {Object[]} currentValue
     * @internal
     */
    get currentValue() {
        const
            me                 = this,
            { $storeDataField } = me;

        if (!$storeDataField) {
            return undefined;
        }

        if (me.$currentValue == null || me.$currentValueGeneration !== me.storage.generation) {
            me.$currentValue = $storeDataField.getValue(me, me.$storeDataFieldRecord);
            me.$currentValueGeneration = me.storage.generation;
        }

        return me.$currentValue;
    }

    set currentValue(value) {
        this.$currentValue = value;
        this.$currentValueGeneration = this.storage.generation;
    }

    /**
     * Get a locally available record by id. Find the record even if filtered out, part of collapsed group or collapsed
     * node
     * @param {Core.data.Model|String|Number} id Id of record to return.
     * @returns {Core.data.Model} A record with the specified id
     * @category Records
     */
    getById(id) {
        const me = this;

        let record;

        // In case `id` is a record, we use its ID to try to find the record in the store,
        // because if the record is removed from the store it shouldn't be found.
        if (id?.isModel) {
            record = id;

            id = record.id;
        }
        // Support providing a model as a regular non-model object
        else if (id && typeof id === 'object') {
            id = me.modelClass.asId(id);
        }

        const found = me.idRegister[id];

        if (record) {
            // When asking for a record that has links, we resolve first link if original is not found.
            // This allows `linkedStore.isAvailable(original)` to return true and `linkedStore.getById(original)` to
            // return the linked record.
            if (record?.hasLinks && !found) {
                const { allValues } = me.storage;

                return record.$links.find(r => allValues.includes(r));
            }

            return record;
        }

        return found;
    }

    /**
     * Like {@link #function-getById}, but throws if the passed id matches no record in this store.
     * @param {Core.data.Model|String|Number} recordOrId A record, or the id of one
     * @returns {Core.data.Model} The record
     * @private
     */
    getByIdOrThrow(recordOrId) {
        const record = this.getById(recordOrId);

        if (!record) {
            throw new Error(`No record with id "${recordOrId}" in the ${this.id} store`);
        }

        return record;
    }

    /**
     * Resolves an input of record(s) and/or id(s) into an array of records found in this store.
     * Accepts a single record, a single id, or an array mixing both. Entries that don't resolve to
     * a record in this store are silently skipped.
     *
     * ```javascript
     * const records = store.getByIds([1, 5, someRecord, 'abc']);
     * ```
     *
     * @param {Core.data.Model|String|Number|Core.data.Model[]|String[]|Number[]} recordsOrIds
     * A single record/id or an array of records/ids to resolve
     * @returns {Core.data.Model[]} An array of resolved records
     * @category Records
     */
    getByIds(recordsOrIds) {
        return ArrayHelper.asArray(recordsOrIds).reduce((acc, recordOrId) => {
            const record = this.getById(recordOrId);

            if (record) {
                acc.push(record);
            }

            return acc;
        }, []);
    }

    /**
     * Checks if a record is available, in the sense that it is not filtered out,
     * hidden in a collapsed group or in a collapsed parent node of a tree store.
     * @param {Core.data.Model|String|Number} recordOrId Record to check
     * @returns {Boolean}
     * @category Records
     */
    isAvailable(recordOrId) {
        const record = this.getById(recordOrId);

        return record && this.storage.includes(record) || false;
    }

    /**
     * Get a record by internalId.
     * @param {Number} internalId The internalId of the record to return
     * @returns {Core.data.Model} A record with the specified internalId
     * @category Records
     */
    getByInternalId(internalId) {
        return this.internalIdRegister[internalId];
    }

    /**
     * Checks if the specified record is contained in the store
     * @param {Core.data.Model|String|Number} recordOrId Record, or `id` of record
     * @returns {Boolean}
     * @category Records
     */
    includes(recordOrId) {
        if (this.isTree) {
            return this.idRegister[Model.asId(recordOrId)] != null;
        }
        return this.indexOf(recordOrId) > -1;
    }

    //endregion

    //region Get index

    /**
     * Returns the index of the specified record/id, or `-1` if not found.
     * @param {Core.data.Model|String|Number} recordOrId Record, or `id` of record to return the index of.
     * @param {Boolean} [visibleRecords] Pass `true` to find the visible index.
     * as opposed to the dataset index. This omits group header records.
     * @param {Boolean} [allExceptFilteredOutRecords] For trees, when true this searches all except filtered out records
     * in the flattened tree, similar to a flat store.
     * @returns {Number} Index for the record/id, or `-1` if not found.
     * @category Records
     */
    indexOf(recordOrId, visibleRecords = false, allExceptFilteredOutRecords = false) {
        // Only check records actually in the store ($store is for objectify scenario)
        if (recordOrId?.isModel && !recordOrId.stores?.includes(this.$store || this)) {
            // When asking for a record that has links, we resolve first link if original is not found.
            // This allows finding index for links using relations to original records (dep -> event for example)
            const linkedRecord = recordOrId.$links.find(r => this.storage.allValues.includes(r));
            if (linkedRecord) {
                return this.indexOf(linkedRecord, visibleRecords);
            }

            return -1;
        }

        // When a tree, indexOf is always in the visible records - filtering is different in trees.
        if (this.isTree) {
            // Cheaper than this.storage.indexOf() which takes a detour to result in the same call
            return (allExceptFilteredOutRecords ? this.rootNode.allChildren : this.storage.values).indexOf(this.getById(recordOrId));
        }

        const id = Model.asId(recordOrId);

        if (id == null) {
            return -1;
        }

        const found = this.idMap[id];

        return found ? found[visibleRecords ? 'visibleIndex' : 'index'] : -1;
    }

    allIndexOf(recordOrId) {
        if (this.isTree) {
            return this.allRecords.indexOf(this.getById(recordOrId));
        }
        else {
            return this.storage.indexOf(recordOrId, true);
        }
    }

    // Membership test against the full (unfiltered) dataset
    allIncludes(recordOrId) {
        if (this.isTree) {
            return this.allRecords.includes(this.getById(recordOrId));
        }
        else {
            return this.storage.includes(recordOrId, true);
        }
    }

    //endregion

    //region Get values

    /**
     * Returns an array of distinct values from all locally available records for the specified field.
     *
     * ```javascript
     * store.getDistinctValues('age'); // Returns an array of the unique age values
     * ```
     *
     * @param {String} field Field to extract values for
     * @param {Boolean} [includeFilteredOutRecords] True to ignore any applied filters
     * @param {Boolean} [includeCounts] When `true`, returns array of `[ value, count ]` with counts of occurrences
     * @returns {Array} Array of values
     * @category Values
     */
    getDistinctValues(field, includeFilteredOutRecords = false, includeCounts = false) {
        const
            me     = this,
            values = [],
            counts = {};
        let value;

        me.forEach(r => {
            if (!r.isSpecialRow && !r.isRoot) {
                value                = r.getValue(field);
                const primitiveValue = value instanceof Date ? value.getTime() : value;

                if (counts[primitiveValue] === undefined) {
                    values.push(value);
                    counts[primitiveValue] = { value, count : 1 };
                }
                else {
                    counts[primitiveValue].count++;
                }
            }
        }, me, { includeCollapsedGroupRecords : true, includeFilteredOutRecords });

        return includeCounts ? Object.values(counts) : values;
    }

    /**
     * Counts how many times the specified value appears locally in the store
     * @param {String} field Field to look in
     * @param {*} value Value to look for
     * @returns {Number} Found count
     * @category Values
     */
    getValueCount(field, value) {
        let count = 0;

        this.forEach(r => {
            if (ObjectHelper.isEqual(r.getValue(field), value)) count++;
        });

        return count;
    }

    //endregion

    //region JSON & console

    /**
     * Retrieve or set the data of all records as a JSON string
     *
     * ```javascript
     * const store = new Store({
     *     data : [
     *         { id : 1, name : 'Superman' },
     *         { id : 2, name : 'Batman' }
     *     ]
     * });
     *
     * const jsonString = store.json;
     *
     * //jsonString:
     * '[{"id":1,"name":"Superman"},{"id":2,"name":"Batman"}]
     * ```
     *
     * @member {String}
     * @non-lazy-load
     */
    set json(json) {
        if (typeof json === 'string') {
            json = StringHelper.safeJsonParse(json);
        }

        this.data = json;
    }

    get json() {
        return StringHelper.safeJsonStringify(this);
    }

    /**
     * Pretty printed version of {@link #property-json}
     * @member {String}
     * @readonly
     */
    get formattedJSON() {
        return StringHelper.safeJsonStringify(this, null, 4);
    }

    /**
     * Retrieve the data of all (unfiltered) records as an array of JSON objects.
     *
     * ```javascript
     * const store = new Store({
     *     data : [
     *         { id : 1, name : 'Superman' },
     *         { id : 2, name : 'Batman' }
     *     ]
     * });
     *
     * const jsonArray = store.toJSON();
     *
     * //jsonArray:
     * [{id:1,name:"Superman"},{id:2,name:"Batman"}]
     * ```
     *
     * @returns {Object[]}
     */
    toJSON() {
        const
            me                          = this,
            { persistable, dataSource } = me.modelClass.getFieldDefinition('expanded');

        // extract entire structure.
        // If we're a tree, then that consists of the payload of the rootNode.
        return (me.isTree ? me.rootNode.unfilteredOrChildren || [] : me.allRecords).map(record => {
            const json = record.toJSON();
            if (me.tree && record.isParent && persistable) {
                json[dataSource] = record.isExpanded(me);
            }
            return json;
        });
    }

    //<debug>

    showJSON() {
        globalThis.open().document.body.innerHTML = `<pre>${StringHelper.safeJsonStringify(this, null, 2)}</pre>`;
    }

    downloadJSON(filename) {
        BrowserHelper.download(`${filename || this.id || 'store'}.json`, 'data:text/csv;charset=utf-8,' + escape(this.json));
    }

    toTable() {
        console.table(this.records.map(r => r.data));
    }

    //</debug>

    //endregion

    //region Extract config

    // These functions are not meant to be called by any code other than Base#getCurrentConfig()

    preProcessCurrentConfigs(configs) {
        super.preProcessCurrentConfigs(configs);

        delete configs.project;
    }

    // Extract current data for all accessible records
    getInlineData(options) {
        const data = [];

        if (this.tree) {
            this.rootNode.children?.forEach(r => data.push(r.getCurrentConfig(options)));
        }
        else {
            this.forEach(r => data.push(r.getCurrentConfig(options)));
        }

        return data;
    }

    // Extract current configs and data
    getCurrentConfig(options) {
        const
            result    = super.getCurrentConfig(options),
            { state } = this;

        if (result) {

            // Replace initial data with values from current records
            if (result.data) {
                result.data = this.getInlineData(options);
            }

            // Never include project or stm
            delete result.project;
            delete result.stm;
            delete result.asyncEvents;
            delete result.modelClass;

            // Pollution from grid
            if (!this.tree) {
                delete result.tree;
            }

            // Include current state
            if (state) {
                Object.assign(result, state);
            }
        }

        return result;
    }

    //endregion

    //region Iteration & traversing

    /**
     * Iterates over all available records in store. Omits group header and footer records if this store is grouped.
     * Does *not* request new records when store is configured with
     * {@link Core.data.Store#config-lazyLoad}.
     * @param {Function} fn A function that is called for each record. Returning `false` from that function cancels
     * iteration. It is called with the following arguments:
     * @param {Core.data.Model} fn.record Current record
     * @param {Number} fn.index Current index
     * @param {Object} [thisObj] `this` reference for the function
     * @param {Object|Boolean} [options] A boolean for `includeFilteredOutRecords`, or detailed options for
     * exclude/include records
     * @param {Boolean} [options.includeFilteredOutRecords] `true` to also include filtered out records
     * @param {Boolean} [options.includeCollapsedGroupRecords] `true` to also include records from collapsed groups of
     * grouped stores
     * @category Iteration
     */
    forEach(fn, thisObj = this, options = {}) {
        const
            me       = this,
            callback = (r, i) => {
                if (r && !r.isRoot && !r.isSpecialRow) {
                    return fn.call(thisObj, r, i);
                }
            };

        options = fixTraverseOptions(me, options);

        if (me.isTree) {
            // forEach uses traverse() but is not perceived as a tree walk, so we want to apply our sorter
            if (me.isChained) {
                options = {
                    ...options,
                    sorterFn : me.sorterFn
                };
            }

            me.rootNode.traverseWhile(callback, false, options);
        }
        else {
            // native forEach cannot be aborted by returning false, have to loop "manually"
            const records = options.includeFilteredOutRecords ? me.storage.allValues : me.storage.values;

            // grouped store has own tree-like structure, but cannot be handled like a regular tree
            if (me.isGrouped && options.includeCollapsedGroupRecords) {
                for (let i = 0; i < records.length; i++) {
                    const
                        record        = records[i],
                        groupChildren = options.includeFilteredOutRecords ? record.unfilteredGroupChildren : record.groupChildren;

                    if (groupChildren && record.meta.collapsed === true) {
                        for (let j = 0; j < groupChildren.length; j++) {
                            const rec = groupChildren[j];

                            if (callback(rec, j) === false) {
                                return;
                            }
                        }
                    }
                    else if (callback(record, i) === false) {
                        return;
                    }
                }
            }
            else {
                for (let i = 0; i < records.length; i++) {
                    if (callback(records[i], i) === false) {
                        return;
                    }
                }
            }
        }
    }

    /**
     * Equivalent to Array.map(). Creates a new array with the results of calling a provided function on every record
     * @param {Function} fn
     * @param {Object} [thisObj] The `this` reference to call the function with. Defaults to this Store
     * @returns {Array}
     * @category Iteration
     */
    map(fn, thisObj = this) {
        return this.storage.values.map(fn, thisObj);
    }

    /**
     * Equivalent to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap Array.flatMap()}.
     * Creates a new array by spreading the results of calling a provided function on every record
     * @param {Function} fn A function returning an array of items to be spread into the new array, or a single item to include in it
     * @param {Object} [thisObj] The `this` reference to call the function with. Defaults to this Store
     * @returns {Array} The new array
     * @category Iteration
     */
    flatMap(fn, thisObj = this) {
        return this.storage.values.flatMap(fn, thisObj);
    }

    /**
     * Equivalent to Array.every(). Returns `true` if every call of the provided function
     * on each record yields a truthy value.
     * @param {Function} fn
     * @param {Function} fn.record The record to test.
     * @param {Object} [thisObj] The `this` reference to call the function with. Defaults to this Store.
     * @param {Boolean} [ignoreFilters] Pass `true` to iterate all records including filtered out ones.
     * @returns {Array}
     * @category Iteration
     */
    every(fn, thisObj = this, ignoreFilters = false) {
        return this.storage[ignoreFilters ? 'allValues' : 'values'].every(fn, thisObj);
    }

    /**
     * Equivalent to Array.reduce(). Applies a function against an accumulator and each record (from left to right) to
     * reduce it to a single value.
     * @param {Function} fn
     * @param {*} initialValue
     * @param {Object} [thisObj] The `this` reference to call the function with. Defaults to this Store
     * @returns {*}
     * @category Iteration
     */
    reduce(fn, initialValue = [], thisObj = this) {
        if (thisObj !== this) {
            fn = fn.bind(thisObj);
        }

        return this.storage.values.reduce(fn, initialValue, thisObj);
    }

    /**
     * Iterator that allows you to do for (let record of store)
     * @category Iteration
     */
    [Symbol.iterator]() {
        return this.storage.values[Symbol.iterator]();
    }

    /**
     * Traverse all tree nodes (only applicable for Tree Store)
     * Also callable as `traverse(fn, skipTopNode, options)` to start from {@link #property-rootNode}.
     * @param {Function} fn The function to call on visiting each node.
     * @param {Core.data.Model} fn.record Current record being visited
     * @param {Core.data.Model} [topNode=this.rootNode] The top node to start the traverse at.
     * @param {Boolean} [skipTopNode] Pass true to not call `fn` on the top node, but proceed directly to its children.
     * @param {Object|Boolean} [options] A boolean for includeFilteredOutRecords, or detailed options for exclude/include records
     * @param {Boolean} [options.includeFilteredOutRecords] True to also include filtered out records
     * @param {Boolean} [options.includeCollapsedGroupRecords] True to also include records from collapsed groups of grouped store
     * @param {Boolean} [options.useOrderedTree] True to traverse unsorted/unfiltered tree
     * @category Traverse
     * @non-lazy-load
     */
    traverse(fn, topNode = this.rootNode, skipTopNode = topNode === this.rootNode, options = {}) {
        const me = this;

        // Allow store.traverse(fn, true, options) to start from rootNode
        if (typeof topNode === 'boolean') {
            options     = skipTopNode;
            skipTopNode = topNode;
            topNode     = me.rootNode;
        }

        options = fixTraverseOptions(me, options);

        if (me.isTree) {
            if (me.isChained) {
                const passedFn = fn;

                fn = node => {
                    if (me.chainedFilterFn(node)) {
                        passedFn(node);
                    }
                };
            }

            topNode.traverse(fn, skipTopNode, options);
        }
        else {
            me.forEach(rec => rec.traverse(fn, false, options), me, options);
        }
    }

    /**
     * Traverse all tree nodes while the passed `fn` returns true
     * Also callable as `traverseWhile(fn, skipTopNode, options)` to start from {@link #property-rootNode}.
     * @param {Function} fn The function to call on visiting each node. Returning `false` from it stops the traverse.
     * @param {Core.data.Model} fn.record The record being visited
     * @param {Core.data.Model} [topNode=this.rootNode] The top node to start the traverse at.
     * @param {Boolean} [skipTopNode] Pass true to not call `fn` on the top node, but proceed directly to its children.
     * @param {Object} [options] An options object to exclude/include records
     * @param {Boolean} [options.includeFilteredOutRecords] True to also include filtered out records
     * @param {Boolean} [options.includeCollapsedGroupRecords] True to also include records from collapsed groups of grouped store
     * @category Traverse
     * @non-lazy-load
     */
    traverseWhile(fn, topNode = this.rootNode, skipTopNode = topNode === this.rootNode, options = {}) {
        const me = this;

        // Allow store.traverseWhile(fn, true, options) to start from rootNode
        if (typeof topNode === 'boolean') {
            options     = skipTopNode;
            skipTopNode = topNode;
            topNode     = me.rootNode;
        }

        options = fixTraverseOptions(me, options);

        if (me.isTree) {
            if (me.isChained) {
                const passedFn = fn;

                fn = node => {
                    if (me.chainedFilterFn(node)) {
                        passedFn(node);
                    }
                };
            }

            topNode.traverseWhile(fn, skipTopNode, options);
        }
        else {
            for (const record of me.storage) {
                if (record.traverse(fn, false, options) === false) {
                    break;
                }
            }
        }
    }

    /**
     * Finds the next record locally available.
     * @param {Core.data.Model|String|Number} recordOrId Current record or its id
     * @param {Boolean} [wrap=false] Wrap at start/end or stop there
     * @param {Boolean} [skipSpecialRows=false] True to not return specialRows like group headers
     * @returns {Core.data.Model|null} Next record, or `null` if the record is the last one or not in the store
     * @category Traverse
     */
    getNext(recordOrId, wrap = false, skipSpecialRows = false) {
        const
            me      = this,
            records = me.storage.values;
        let idx     = me.indexOf(recordOrId);

        // A record that is not in the store has no neighbours to wrap around
        if (idx === -1) {
            return null;
        }

        if (idx >= records.length - 1) {
            if (wrap) {
                idx = -1;
            }
            else {
                return null;
            }
        }

        const record = records[idx + 1];

        // Skip the result if it's a specialRow and we are told to skip them
        if (skipSpecialRows && record && (record.isSpecialRow || (typeof skipSpecialRows === 'function' && skipSpecialRows(record)))) {
            return me.getNext(records[idx + 1], wrap, skipSpecialRows);
        }

        return record;
    }

    /**
     * Finds the previous record locally available.
     * @param {Core.data.Model|String|Number} recordOrId Current record or its id
     * @param {Boolean} [wrap=false] Wrap at start/end or stop there
     * @param {Boolean} [skipSpecialRows=false] True to not return specialRows like group headers
     * @returns {Core.data.Model|null} Previous record, or `null` if the record is the first one or not in the store
     * @category Traverse
     */
    getPrev(recordOrId, wrap = false, skipSpecialRows = false) {
        const
            me      = this,
            records = me.storage.values;
        let idx     = me.indexOf(recordOrId);

        // A record that is not in the store has no neighbours to wrap around
        if (idx === -1) {
            return null;
        }

        if (idx === 0) {
            if (wrap) {
                idx = records.length;
            }
            else {
                return null;
            }
        }

        const record = records[idx - 1];

        // Skip the result if it's a specialRow and we are told to skip them
        if (idx > 0 && skipSpecialRows && record && (record.isSpecialRow || (typeof skipSpecialRows === 'function' && skipSpecialRows(record)))) {
            return me.getPrev(records[idx - 1], wrap, skipSpecialRows);
        }

        return record;
    }

    /**
     * Gets the next or the previous record locally available. Optionally wraps from first -> last and vice versa
     * @param {String|Core.data.Model} recordOrId Record or records id
     * @param {Boolean} next Next (true) or previous (false)
     * @param {Boolean} wrap Wrap at start/end or stop there
     * @param {Boolean} [skipSpecialRows=false] True to not return specialRows like group headers
     * @returns {Core.data.Model}
     * @category Traverse
     * @internal
     */
    getAdjacent(recordOrId, next = true, wrap = false, skipSpecialRows = false) {
        return next ? this.getNext(recordOrId, wrap, skipSpecialRows) : this.getPrev(recordOrId, wrap, skipSpecialRows);
    }

    /**
     * Finds the next record among leaves (in a tree structure)
     * @param {Core.data.Model|String|Number} recordOrId Current record or its id
     * @param {Boolean} [wrap] Wrap at start/end or stop there
     * @returns {Core.data.Model} Next record or null if current is the last one
     * @category Traverse
     * @internal
     */
    getNextLeaf(recordOrId, wrap = false) {
        const
            me      = this,
            records = me.leaves,
            record  = me.getById(recordOrId);
        let idx     = records.indexOf(record);

        if (idx >= records.length - 1) {
            if (wrap) {
                idx = -1;
            }
            else {
                return null;
            }
        }

        return records[idx + 1];
    }

    /**
     * Finds the previous record among leaves (in a tree structure)
     * @param {Core.data.Model|String|Number} recordOrId Current record or its id
     * @param {Boolean} [wrap] Wrap at start/end or stop there
     * @returns {Core.data.Model} Previous record or null if current is the last one
     * @category Traverse
     * @internal
     */
    getPrevLeaf(recordOrId, wrap = false) {
        const
            me      = this,
            records = me.leaves,
            record  = me.getById(recordOrId);
        let idx     = records.indexOf(record);

        if (idx === 0) {
            if (wrap) {
                idx = records.length;
            }
            else {
                return null;
            }
        }

        return records[idx - 1];
    }

    /**
     * Gets the next or the previous record among leaves (in a tree structure). Optionally wraps from first -> last and
     * vice versa
     * @param {String|Core.data.Model} recordOrId Record or record id
     * @param {Boolean} [next] Next (true) or previous (false)
     * @param {Boolean} [wrap] Wrap at start/end or stop there
     * @returns {Core.data.Model}
     * @category Traverse
     * @internal
     */
    getAdjacentLeaf(recordOrId, next = true, wrap = false) {
        return next ? this.getNextLeaf(recordOrId, wrap) : this.getPrevLeaf(recordOrId, wrap);
    }

    //endregion
}

// Register type with its Factory
Store.initClass();
