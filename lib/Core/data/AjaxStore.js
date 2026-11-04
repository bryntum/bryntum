import Store from './Store.js';

import AjaxHelper from '../helper/AjaxHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/data/AjaxStore
 */

/**
 * Http methods used by the AjaxStore in restful mode.
 * @typedef {Object} HttpMethods
 * @property {'POST'|'PUT'} create
 * @property {'GET'|'POST'} read
 * @property {'PATCH'|'POST'|'PUT'} update
 * @property {'DELETE'|'POST'} delete
 */

const
    processParamEntry = (paramArray, entry) => {
        if (Array.isArray(entry[1])) {
            entry[1].forEach(value => paramArray.push(encodeURIComponent(entry[0]) + '=' + encodeURIComponent(value)));
        }
        else {
            paramArray.push(encodeURIComponent(entry[0]) + '=' + encodeURIComponent(entry[1]));
        }

        return paramArray;
    },
    immediatePromise  = Promise.resolve(),
    prependZeros = num => {
        return String(num).padStart(2, '0');
    },
    dateToString = date => {
        return `${ date.getFullYear() }-${ prependZeros(date.getMonth() + 1) }-${ prependZeros(date.getDate()) }T${ prependZeros(date.getHours()) }:${ prependZeros(date.getMinutes()) }:${ prependZeros(date.getSeconds()) }.${ date.getMilliseconds() }`;
    },
    extractPersistableData = r => r.persistableData,
    rejectEmpty = el => !ObjectHelper.isEmpty(el);

/**
 * Store that uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) to read data
 * from a remote server, and optionally sends synchronization requests to the server containing information about
 * locally created, modified and deleted records.
 *
 * ## Create
 * Posts array of JSON data for newly added records to {@link #config-createUrl}, expects response containing an array
 * of JSON objects in same order with id set (uses Model#idField as id).
 *
 * ## Read
 * Reads array of JSON data from the data packet returned from the {@link #config-readUrl}. Unique id for each row is
 * required.
 *
 * By default looks in field 'id' but can be configured by setting {@link Core.data.Model#property-idField-static}.
 *
 * ## Update
 * Posts array of JSON data containing modified records to {@link #config-updateUrl}. By default, only changed fields
 * and any fields configured with {@link Core.data.field.DataField#config-alwaysWrite} are sent.
 * If you want all fields to always be sent, please see {@link #config-writeAllFields}
 *
 * ## Delete
 * Posts to {@link #config-deleteUrl} with removed records ids (for example id=1,4,7).
 *
 * ```javascript
 * new AjaxStore({
 *   createUrl  : 'php/create',
 *   readUrl    : 'php/read',
 *   updateUrl  : 'php/update',
 *   deleteUrl  : 'php/delete',
 *   modelClass : Customer
 * });
 * ```
 *
 * {@region Lazy loading}
 * A store can be configured with {@link #config-lazyLoad} set to `true` (not available in the Community edition). This
 * will make the store send a fetch request to the configured {@link #config-readUrl} when a range of records is needed,
 * rather than for the complete dataset at once.
 *
 * Each request will be made up of 1 chunk before and after the requested index (which gives a total of 2 chunks). The
 * chunk size can be configured in the {@link #config-lazyLoad} config.
 *
 * There is a [guide](#Grid/guides/data/lazyloading.md) for implementing lazy loading in Grid.
 * {@endregion}
 *
 * ## Pagination
 * Configuring an `AjaxStore` with {@link #config-pageParamName} or {@link #config-pageStartParamName} means that the
 * store requests **pages** of data from the remote source, sending the configured {@link #config-pageParamName} or
 * {@link #config-pageStartParamName} to request the page along with the {@link #config-pageSizeParamName}.
 *
 * If `pageParamName` is set, that is passed with the requested page number **(one based)**, along with the
 * {@link #config-pageSizeParamName}.
 *
 * If `pageStartParamName` is set, that is passed with the requested page starting record index **(zero based)**, along
 * with the {@link #config-pageSizeParamName}.
 *
 * The JSON response packet for one page should look like this:
 *
 * ```json
 * {
 *     "success" : true,
 *     "total"   : 50000,
 *     "data"    : [{
 *         "id"    : 1,
 *         "title" : "Row 1"
 *     }, ... for the rest of the pageSize ... ]
 * }
 * ```
 *
 * The {@link #config-responseSuccessProperty `success` property} indicates whether the request
 * succeeded. If this is `false`, an {@link #event-exception} event is fired.
 *
 * The store needs to know the total dataset size in order to know how many pages it may ask for.
 * This is returned in the {@link #config-responseTotalProperty `total` property}
 *
 * ## Remote filtering
 * To specify that filtering is the responsibility of the server, configure the store with
 * `{@link #config-filterParamName}: 'nameOfFilterParameter'`
 *
 * When this is set, any {@link Core.data.mixin.StoreFilter#function-filter} operation causes the store to reload
 * itself, encoding the filters as JSON representations in the {@link #config-filterParamName} HTTP parameter.
 *
 * The filters will look like this:
 * ```javascript
 * {
 *     "field": "country",
 *     "operator": "=",
 *     "value": "sweden",
 *     "caseSensitive": false
 * }
 * ```
 *
 * If the value of the filter is a date - it is serialized as a local time, using the format: `YYYY-MM-DDThh:mm:ss.ms`
 *
 * The encoding may be overridden by configuring an implementation of {@link #config-encodeFilterParams}
 * into the store which returns the value for the {@link #config-filterParamName} when passed an _Iterable_ of filters.
 *
 * ## Remote sorting
 * To specify that sorting is the responsibility of the server, configure the store with
 * `{@link #config-sortParamName}: 'nameOfSortParameter'`
 *
 * When this is set, any {@link Core.data.mixin.StoreSort#function-sort} operation causes the store to
 * reload itself, encoding the sorters as JSON representations in the {@link #config-sortParamName} HTTP
 * parameter.
 *
 * The sorters will look like this:
 * ```javascript
 * {
 *     "field": "name",
 *     "ascending": true
 * }
 * ```
 *
 * The encoding may be overridden by configuring an implementation of {@link #config-encodeSorterParams}
 * into the store which returns the value for the {@link #config-sortParamName} when passed an _Iterable_ of sorters.
 *
 * ## Passing HTTP headers
 * As mentioned above `AjaxStore` uses the Fetch API under the hood. Specify {@link #config-fetchOptions} and/or
 * {@link #config-headers} to have control over the options passed with all fetch calls. For example to pass along an
 * authorization header:
 *
 * ```javascript
 * const store = new AjaxStore({
 *    headers : {
 *        Authorization : 'auth-contents-goes-here'
 *    }
 * });
 * ```
 *
 * Learn more about the Fetch API over at [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
 *
 * ## Getting local record count
 *
 * To get the number of "visible" records locally available in the store (records that would be shown when using the
 * Store as the data source for a Grid or similar), use the {@link #property-count} property. This will return the
 * number of records in the store after filtering and grouping has been applied, including the generated group headers
 * and footers but excluding any records inside collapsed parents or group headers:
 *
 * ```javascript
 * const visibleRecords = store.count;
 * ```
 *
 * To get other local counts, such as the total number of data records in the store including those collapsed away and
 * filtered out (when not using remote filtering), use the more flexible {@link #function-getCount} method:
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
 * ## Useful configs and properties
 *
 * | Config                       | Description                                   |
 * |------------------------------|-----------------------------------------------|
 * | {@link #config-readUrl}      | URL to load data from                         |
 * | {@link #config-createUrl}    | URL to post new records to                    |
 * | {@link #config-updateUrl}    | URL to post modified records to               |
 * | {@link #config-deleteUrl}    | URL to post removed record ids to             |
 * | {@link #config-autoLoad}     | Automatically load data on store creation     |
 * | {@link #config-pageSize}     | Number of records per page for pagination     |
 *
 * ## See also
 *
 * - {@link Core.data.Store} - Base store class for local data
 * - {@link Core.helper.AjaxHelper} - Low-level HTTP request utility
 * - {@link Core.data.Model} - Record definition class
 *
 * @extends Core/data/Store
 *
 * @plugins Core/data/plugin/AjaxStoreLazyLoadPlugin
 */
export default class AjaxStore extends Store {

    static $name = 'AjaxStore';

    static type = 'ajaxstore';

    // region Events

    /**
     * Fired when a remote request fails, either at the network level, or the server returns a failure, or an invalid
     * response.
     *
     * Note that when a {@link #function-commit} fails, more than one exception event will be triggered. The individual
     * operation, `create`, `update` or `delete` will trigger their own `exception` event, but the encapsulating commit
     * operation will also trigger an `exception` event when all the operations have finished, so if exceptions are
     * going to be handled gracefully, the event's `action` property must be examined, and the constituent operations of
     * the event must be examined.
     * @event exception
     * @param {Core.data.Store} source This Store
     * @param {Boolean} exception `true`
     * @param {'create'|'read'|'update'|'delete'|'commit'} action Action that failed, `'create'`, `'read'`,
     * `'update'` or `'delete'`. May also be fired with '`commit'` to indicate the failure of an aggregated `create`,
     * `update` and `delete` operation. In this case, the event will contain a property for each operation of the commit
     * named `'create'`, `'update'` and `'delete'`, each containing the individual `exception` events.
     * @param {'network'|'failure'} exceptionType The type of failure, `'network'` or `'server'`
     * @param {Response} response the `Response` object
     * @param {Object} json The decoded response object *if the exceptionType is `'server'`*
     */

    /**
     * Fired after committing added records
     * @event commitAdded
     * @param {Core.data.Store} source This Store
     */

    /**
     * Fired after committing modified records
     * @event commitModified
     * @param {Core.data.Store} source This Store
     */

    /**
     * Fired on successful load
     * @event load
     * @param {Core.data.Store} source This Store
     * @param {Object[]} data Data loaded
     * @param {Response} response the `Response` object
     * @param {Object} json The decoded response object.
     */

    /**
     * Fired on successful load of remote child nodes for a tree node.
     * @event loadChildren
     * @param {Core.data.Store} source This Store
     * @param {Object[]} data Data loaded
     * @param {Object} json The decoded response object.
     */

    /**
     * Fired after committing removed records
     * @event commitRemoved
     * @param {Core.data.Store} source This Store
     */

    /**
     * Fired before loading starts. Allows altering parameters and is cancelable by returning `false`. For paged stores,
     * instead listen to {@link #event-beforeLoadPage}. For remote loading of tree child nodes, listen to
     * {@link #event-beforeLoadChildren}.
     * @event beforeLoad
     * @preventable
     * @param {Core.data.Store} source This Store
     * @param {String} action The read action being performed: `'read'`
     * @param {String} url The URL to which the HTTP request will be sent. This property may be mutated in
     * an event handler *without changing* the base {@link #config-readUrl} configured for this Store.
     * @param {Object} params An object containing property/name pairs which are the parameters.
     * This may be mutated to affect the parameters used in the Ajax request.
     */

    /**
     * Fired before loading of remote child nodes of a tree node starts. Allows altering parameters and is cancelable
     * @event beforeLoadChildren
     * @preventable
     * @param {Core.data.Store} source This Store
     * @param {String} action The read action being performed: `'readChildren'`
     * @param {String} url The URL to which the HTTP request will be sent. This property may be mutated in
     * an event handler *without changing* the base {@link #config-readUrl} configured for this Store.
     * @param {Object} params An object containing property/name pairs which are the parameters.
     * This may be mutated to affect the parameters used in the Ajax request.
     */

    /**
     * When the store {@link #property-isPaged is paged}, this is fired when a page load is beginning.
     * @event loadPageStart
     * @param {Core.data.Store} source This Store
     * @param {Object} params An object containing property/name pairs which are the parameters.
     * This may be mutated to affect the parameters used in the Ajax request.
     */

    /**
     * Fired when loading is beginning. This is not cancelable. Parameters in the event may still be
     * mutated at this stage.
     * @event loadStart
     * @param {Core.data.Store} source This Store
     * @param {Object} params An object containing property/name pairs which are the parameters.
     * This may be mutated to affect the parameters used in the Ajax request.
     */

    /**
     * Fired when loading of remote child nodes into a tree node is beginning. This is not cancelable. Parameters in the
     * event may still be mutated at this stage.
     * @event loadChildrenStart
     * @param {Core.data.Store} source This Store
     * @param {Object} params An object containing property/name pairs which are the parameters.
     * This may be mutated to affect the parameters used in the Ajax request.
     */

    // endregion

    //region Config

    static configurable = {
        /**
         * The optional property name in JSON responses from the server that contains a boolean
         * success/fail status.
         * ```json
         * {
         *   "responseMeta" : {
         *   {
         *     "success" : true,
         *     "count" : 100
         *   },
         *   // The property name used here should match that of 'responseDataProperty'
         *   "data" : [
         *     ...
         *   ]
         * }
         * ```
         *
         * The store would be configured with:
         * ```javascript
         *  {
         *      ...
         *      successDataProperty : 'responseMeta.success',
         *      responseTotalProperty : 'responseMeta.count'
         *      ...
         *  }
         *
         * ```
         * @config {String}
         * @default
         * @category Remote
         */
        responseSuccessProperty : 'success',

        /**
         * The property name in JSON responses from the server that contains the data for the records
         * ```json
         * {
         *   "success" : true,
         *   // The property name used here should match that of 'responseDataProperty'
         *   "data" : [
         *     ...
         *   ]
         * }
         * ```
         * @config {String}
         * @default
         * @category Remote
         */
        responseDataProperty : 'data',

        /**
         * The property name in JSON responses from the server that contains the dataset total size
         * **when this store {@link #property-isPaged is paged} or {@link #config-lazyLoad lazy loaded}**
         * ```json
         * {
         *   "success" : true,
         *   // The property name used here should match that of 'responseDataProperty'
         *   "data" : [
         *     ...
         *   ],
         *   // The property name used here should match that of 'responseTotalProperty'
         *   "total" : 65535
         * }
         * ```
         * @config {String}
         * @default
         * @category Remote
         */
        responseTotalProperty : 'total',

        /**
         * The property name in JSON responses from the server that contains an array of group descriptors **when this
         * store is {@link #config-lazyLoad lazy loaded} and grouped using
         * {@link Core/data/mixin/StoreGroup#config-groupParamName remote grouping}**.
         *
         * Each entry describes one group and should contain:
         *
         * ```json
         * {
         *    "field"     : "country",
         *    "value"     : "Sweden",
         *    "count"     : 523,
         *    "summaries" : { "revenue": 12345 }
         * }
         * ```
         *
         * The array must contain every group in the dataset, in the order their records appear in the
         * {@link #config-responseDataProperty data} stream — the client derives the total group count from its length.
         * @config {String}
         * @default
         * @category Remote
         */
        responseGroupsProperty : 'groups',

        /**
         * An object containing key/value pairs that are passed on the request query string, or in the request body
         * if HTTP method allows. See {@link #config-paramsInBody} config.
         * @prp {Object}
         * @category Remote
         */
        params : null,



        /**
         * The timeout in milliseconds to wait before persisting changes to the server.
         * Used when {@link #config-autoCommit} is set to `true`.
         * @config {Number}
         * @default
         * @category Common
         */
        autoCommitTimeout : 10,

        /**
         * Set to `false` to only include the id of a removed parent node in the request to the backend, and not the ids
         * of its children. Applies when configured with a {@link #config-deleteUrl}.
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
         * With `includeChildrenInRemoveRequest : true` (the default), the backend will receive the removal of id 1, 11
         * and 12.
         *
         * @config {Boolean}
         * @default true
         * @category Tree
         */
        includeChildrenInRemoveRequest : true,

        /**
         * Pass a function to transform data loaded from the backend before it is turned into records and added to the
         * store
         * ```javascript
         * new AjaxStore({
         *      transformLoadedData : response => {
         *          // Transform the loaded data and return the response object
         *      }
         * });
         * ```
         * @config {Function}
         * @param {Object} response
         * @param {Array} response.data The data that is going to be loaded into the store
         * @returns {Object} Returns the modified response object
         */
        transformLoadedData : null,

        /**
         * Pass a function to transform record creation data before it is sent to the backend
         * ```javascript
         * new AjaxStore({
         *      transformCreationData : payload => {
         *          // Transform the data and return the payload
         *          for (const creationData of payload.data) {
         *              creationData.timestamp = Date.now();
         *          }
         *
         *          return payload;
         *      }
         * });
         * ```
         * @config {Function}
         * @param {Object} payload
         * @param {Array} payload.data The data that is going to be sent to the backend
         * @returns {Object} Return the modified payload
         */
        transformCreationData : null,

        /**
         * Pass a function to transform records modification data before it is sent to the backend
         * ```javascript
         * new AjaxStore({
         *      transformModificationData : payload => {
         *          // Transform the data and return the payload
         *          for (const recordData of payload.data) {
         *              // Some kind of transformation here...
         *              if (recordData.ignore) {
         *                  ArrayHelper.remove(payload.data, recordData);
         *              }
         *          }
         *
         *          return payload;
         *      }
         * });
         * ```
         * @config {Function}
         * @param {Object} payload
         * @param {Array} payload.data The data that is going to be sent to the backend
         * @returns {Object} Return the modified payload
         */
        transformModificationData : null,

        /**
         * Pass a function to transform record removal data before it is sent to the backend
         * ```javascript
         * new AjaxStore({
         *      transformRemovalData : payload => {
         *          // Transform the data and return the payload
         *          const transformedData = {};
         *          for (const id of payload.ids) {
         *              transformedData[id] = true;
         *          }
         *          payload.ids = transformedData;
         *
         *          return payload;
         *      }
         * });
         * ```
         * @config {Function}
         * @param {Object} payload
         * @param {Array} payload.ids Ids for records being removed
         * @returns {Object} Return the modified payload
         */
        transformRemovalData : null,

        /**
         * This config is taken into account only when store is part of a scheduling project.
         *
         * If such store loads data via {@link Core.data.AjaxStore#config-readUrl}, automatic calculation
         * of the schedule after the load might lead to some data modifications (for example if {@link #config-syncDataOnLoad}
         * is enabled). Such modifications will then be submitted back to the server, which might not be needed,
         * since the data is already coming from the server.
         *
         * Enabling this config will ignore data modifications during the propagation stage and nothing
         * will be submitted to server.
         *
         * @config {Boolean} ignoreLoadPropagationChanges
         * @default
         */
        ignoreLoadPropagationChanges : false,

        /**
         * Set this flag to true if you are filtering remote using restful URLs (e.g.
         * https://nominatim.openstreetmap.org/search/paris?format=json)
         *
         * **Note:** When this is set, the filter string is appended to the readUrl.
         * @config {Boolean}
         * @category Remote
         */
        restfulFilter : false,

        /**
         * A string keyed object containing the HTTP headers to add to each server request issued by this store.
         *
         * `AjaxStore` uses the Fetch API under the hood, read more about headers on
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#headers)
         *
         * Example usage:
         *
         * ```javascript
         * const store = new AjaxStore({
         *    headers : {
         *        Authorization : 'auth-contents-goes-here'
         *    }
         * });
         * ```
         *
         * @config {Object<String,String>}
         * @category Remote
         */
        headers : null,

        /**
         * An object containing the Fetch options to pass to each server request issued by this store. Use this to
         * control if credentials are sent and other options, read more at
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options).
         *
         * Example usage:
         *
         * ```javascript
         * const store = new AjaxStore({
         *    fetchOptions : {
         *        credentials : 'omit',
         *        redirect    : 'error'
         *    }
         * });
         * ```
         *
         * @config {Object}
         * @category Remote
         */
        fetchOptions : null,

        /**
         * Specify `true` to send payloads as form data, `false` to send as regular JSON.
         * @config {Boolean}
         * @default false
         * @category Remote
         */
        sendAsFormData : null,

        /**
         * Specify `true` to send all model fields when committing modified records (as opposed to just the
         * modified fields)
         * @config {Boolean}
         * @default false
         * @category Remote
         */
        writeAllFields : null,

        /**
         * The name of the HTTP parameter passed to this Store's {@link #config-readUrl} to indicate the node `id`
         * to load when loading child nodes on demand if the node being expanded was created with data containing
         * `children: true`.
         * @config {String}
         * @default
         * @category Remote
         */
        parentIdParamName : 'id',

        /**
         * Set to `true` to use restful {@link #config-httpMethods}
         * @config {Boolean}
         * @default false
         * @category Remote
         */
        useRestfulMethods : null,

        /**
         * The HTTP methods to use for CRUD requests when {@link #config-useRestfulMethods} is enabled.
         *
         * ```javascript
         * new AjaxStore({
         *    useRestfulMethods : true,
         *    httpMethods : {
         *        create : 'POST',
         *        read   : 'POST',
         *        update : 'PATCH',
         *        delete : 'DELETE'
         *    }
         * });
         *
         * ```
         * @config {HttpMethods}
         * @default
         * @category Remote
         */
        httpMethods : {
            create : 'POST',
            read   : 'GET',
            update : 'PUT',
            delete : 'DELETE'
        },

        /**
         * When this config is enabled, the {@link #property-params} of "read" request are placed in the
         * request body instead of the query string, if the HTTP method allows.
         *
         * @config {Boolean}
         * @default
         * @category Remote
         */
        paramsInBody : true
    };

    /**
     * Url to post newly created records to.
     *
     * The response must be in the form:
     *
     *     {
     *         "success": true,
     *         "data": [{
     *             "id": 0, "name": "General Motors"
     *         }, {
     *             "id": 1, "name": "Apple"
     *         }]
     *     }
     *
     * Just the array of data may be returned, however that precludes the orderly handling of errors encountered at the
     * server.
     *
     * If the server encountered an error, the packet would look like this:
     *
     *     {
     *         "success": false,
     *         "message": "Some kind of database error"
     *     }
     *
     * And that packet would be available in the {@link #event-exception} handler in the `response` property of the
     * event.
     *
     * The `success` property may be omitted, it defaults to `true`.
     *
     * @prp {String} createUrl
     * @category CRUD
     */

    /**
     * Url to read data from.
     *
     * The response must be in the form:
     *
     *     {
     *         "success": true,
     *         "data": [{
     *             "id": 0, "name": "General Motors"
     *         }, {
     *             "id": 1, "name": "Apple"
     *         }]
     *     }
     *
     * If the store {@link #property-isPaged is paged}, the total dataset size must be returned in the
     * {@link #config-responseTotalProperty} property:
     *
     *     {
     *         "success": true,
     *         "data": [{
     *             "id": 0, "name": "General Motors"
     *         }, {
     *             "id": 1, "name": "Apple"
     *         }],
     *         "total": 65535
     *     }
     *
     * Just the array of data may be returned, however that precludes the orderly handling of errors encountered at the
     * server.
     *
     * If the server encountered an error, the packet would look like this:
     *
     *     {
     *         "success": false,
     *         "message": "Some kind of database error"
     *     }
     *
     * And that packet would be available in the {@link #event-exception} handler in the `response` property of the
     * event.
     *
     * The `success` property may be omitted, it defaults to `true`.
     *
     * @prp {String} readUrl
     * @category CRUD
     */

    /**
     * Url to post record modifications to.
     *
     * The response must be in the form:
     *
     *     {
     *         "success": true,
     *         "data": [{
     *             "id": 0, "name": "General Motors"
     *         }, {
     *             "id": 1, "name": "Apple"
     *         }]
     *     }
     *
     * Just the array of data may be returned, however that precludes the orderly handling of errors encountered at the
     * server.
     *
     * If the server encountered an error, the packet would look like this:
     *
     *     {
     *         "success": false,
     *         "message": "Some kind of database error"
     *     }
     *
     * And that packet would be available in the {@link #event-exception} handler in the `response` property of the
     * event.
     *
     * The `success` property may be omitted, it defaults to `true`.
     *
     * @prp {String} updateUrl
     * @category CRUD
     */

    /**
     * Url for deleting records.
     *
     * The response must be in the form:
     *
     *     {
     *         "success": true
     *     }
     *
     * If the server encountered an error, the packet would look like this:
     *
     *     {
     *         "success": false,
     *         "message": "Some kind of database error"
     *     }
     *
     * And that packet would be available in the {@link #event-exception} handler in the `response` property of the
     * event.
     *
     * The `success` property may be omitted, it defaults to `true`.
     *
     * @prp {String} deleteUrl
     * @category CRUD
     */

    /**
     * True to initiate a load when the store is instantiated
     * @config {Boolean} autoLoad
     * @category Common
     */

    //endregion

    doDestroy() {
        try {
            this.loadingPromise?.abort();
        }
        // Aborting a load during destruction is fine. Any other error should be thrown.
        catch (e) {
            if (e.name !== 'AbortError') {
                throw e;
            }
        }
        super.doDestroy();
    }

    modificationsTracking = 0;

    suspendModificationsTracking() {
        this.modificationsTracking++;
    }

    resumeModificationsTracking() {
        this.modificationsTracking--;
    }

    afterConstruct(config) {
        super.afterConstruct(config);

        if (this.autoLoad && this.readUrl) {
            this.load().catch(() => {});
        }
    }



    /**
     * Returns a truthy value if the Store is currently loading.
     *
     * A load operation is initiated by a load call, but the network request is not sent until
     * after a delay until the next event loop because of allowing all operations which may
     * request a load to coalesce into one call.
     *
     * If the loading request is in this waiting state, the value will be `1`,
     *
     * If the network request is in flight, the value will be `2`
     * @member {Boolean|Number}
     * @readonly
     * @category CRUD
     */
    get isLoading() {
        return (super.isLoading || this._isLoading) ? 2 : this.loadTriggerPromise ? 1 : false;
    }

    /**
     * Returns true if the Store is currently committing
     * @member {Boolean}
     * @readonly
     * @category CRUD
     */
    get isCommitting() {
        return Boolean(this.commitPromise ?? this.autoCommitTimeoutPromise);
    }

    updateFilterParamName(param) {
        super.updateFilterParamName(param);
        this.remoteFilter = this.remoteFilter || this.restfulFilter;
    }

    updateRestfulFilter(restfulFilter, old) {
        this.remoteFilter = restfulFilter || Boolean(this.filterParamName) || (this.remoteFilter && !old);
    }

    buildQueryString(url, ...paramObjects) {
        const
            hasParamsInUrl = url.includes('?'),
            queryString    = Object.entries(Object.assign({}, ...paramObjects)).reduce(processParamEntry, []).join('&');

        return queryString ? (hasParamsInUrl ? '&' : '?') + queryString : '';
    }

    /**
     * Internal sort method.
     * Should not be used in application code directly.
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteSort} is enabled on the store, this method returns
     * a `Promise` which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @internal
     */
    async performRemoteSort(silent) {
        const me = this;

        if (me.readUrl && !me.isRemoteDataLoading) {
            me.isRemoteDataLoading = true;

            if (await me.beforePerformSort?.() === false) {
                return;
            }

            const result = await me.load();

            me.afterPerformSort(silent);
            me.isRemoteDataLoading = false;
            return result;
        }
        else {
            super.performSort(silent);
        }
    }

    /**
     * Internal filter method.
     * Should not be used in application code directly.
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Promise|null} If {@link Core/data/Store#config-remoteFilter} is enabled on the store, this method returns `Promise`
     * which is resolved after data is loaded from remote server, otherwise it returns `null`
     * @async
     * @internal
     */
    async performRemoteFilter(silent) {
        const me = this;

        if (me.filterBatching > 0) {
            me.needsFiltering = true;
            return;
        }

        // For remote filtering, the dataset cannot be preserved. The size may be completely different.
        // This is a reload operation.
        if (me.readUrl) {
            me.loadingPromise?.abort?.();
            // Flag store data loading state to not get into loop when data is sorted internally after request

            const
                oldCount    = me.count,
                {
                    filters,
                    currentPage
                }           = me;

            if (await me.beforePerformFilter?.({ filters, oldCount }) === false) {
                return;
            }

            me.isRemoteDataLoading = true;
            await me.load();

            // After any async operations, we need to check if "this" is destroyed.
            if (!me.isDestroyed) {
                me.isRemoteDataLoading = false;
                const event  = silent ? null : {
                    action  : 'filter',
                    filters,
                    oldCount,
                    records : me.storage.values
                };

                me.afterPerformFilter(event);
                // If that filter result caused the current page to be out of range, load the last page
                if (me.isPaged && me.currentPage < currentPage) {
                    me.isRemoteDataLoading = true;
                    await me.loadPage(me.currentPage);
                    me.isRemoteDataLoading = false;
                }
                me.trigger('refresh', event);
            }
        }
        else {
            super.performRemoteFilter(silent);
        }
    }

    /**
     * A provided function which creates an array of values for the {@link #config-filterParamName} to pass
     * any filters to the server upon load.
     *
     * By default, this creates a JSON string containing the following properties:
     *
     * ```javascript
     *    [{
     *        field         : <theFieldName>
     *        operator      : May be: `'='`, `'!='`, `'>'`, `'>='`, `'<'`, `'<='`, `'*'`, `'startsWith'`, `'endsWith'`
     *        value         : The value to compare
     *        caseSensitive : true for case sensitive comparisons
     *    }]
     * ```
     * @config {Function} encodeFilterParams
     * @param {Core.util.CollectionFilter[]} filters The filters to encode.
     * @returns {String} The encoded value for the filter parameter.
     */
    encodeFilterParams(filters) {
        const result = this.getFilterParams(filters);

        return JSON.stringify(result, function(key, value) {
            return key === ''
                ? value
                : this[key] instanceof Date ? dateToString(this[key]) : value;
        });
    }

    /**
     * A provided function which creates an array of values for the {#config-sortParamName} to pass
     * any sorters to the server upon load.
     *
     * By default, this creates a JSON string containing the following properties:
     *
     * ```javascript
     *    [{
     *        field     : <theFieldName>
     *        ascending : true/false
     *    }]
     * ```
     *
     * @config {Function}
     * @param {Sorter[]} sorters The sorters to encode.
     * @returns {String} The encoded value for the sort parameter.
     */
    encodeSorterParams(sorters) {
        return JSON.stringify(this.getSorterParams(sorters));
    }

    buildReadUrl() {
        const { readUrl } = this;
        if (this.restfulFilter && this.filters.count) {
            return `${readUrl.replace(/\/$/, '')}/${this.filters.first.value}`;
        }
        return readUrl;
    }

    /**
     * Internal data loading method.
     * @returns {Promise}
     * @internal
     */
    internalLoad(params, eventName, successFn, delay = 0) {
        // Accumulate all configured parameters
        params = ObjectHelper.assign({}, this.params, params);

        const
            me    = this,
            event = { action : 'read' + eventName, params, url : me.buildReadUrl() };

        me.buildRemoteParams(params, true);

        if (me.trigger('beforeLoad' + eventName, event) === false) {
            throw false;  // eslint-disable-line no-throw-literal
        }

        me.loadArgs = [event, params, eventName, successFn];

        if (delay === false) {
            return new Promise((resolve, reject) => me.sendLoadRequest(resolve, reject));
        }

        return me.loadTriggerPromise || (me.loadTriggerPromise = new Promise((resolve, reject) => {
            me.setTimeout({
                delay,
                fn                : 'sendLoadRequest',
                args              : [resolve, reject],
                cancelOutstanding : true
            });
        }));
    }

    // Send the request for the internalLoad.
    // This is called on a timeout 1ms after the internalLoad call.
    async sendLoadRequest(resolve, reject) {
        const
            me = this,
            [
                event,
                params,
                eventName,
                successFn
            ]  = me.loadArgs;

        // As soon as it kicks off, new load requests can be made which will result in another load
        me.loadTriggerPromise = null;
        if (event.url) {
            me._isLoading = true;

            // This may look redundant, but it allows for two levels of event listening.
            // Granular, where the observer observes only the events of interest, and
            // catch-all, where the observer is interested in all requests.
            me.trigger(`load${eventName}Start`, event);

            // beforeRequest may need to perform asynchronous operations, so we need to await it.
            if ((await me.trigger('beforeRequest', event)) === false) {
                me._isLoading = false;
                resolve(event);
            }

            const options = { parseJson : true };

            if (me.headers) {
                options.headers = ObjectHelper.clone(me.headers);
            }

            if (me.useRestfulMethods) {
                options.method = me.httpMethods.read;
                // user might define body in case of using custom restful method
                if (event.body) {
                    options.body = JSON.stringify(event.body);
                }
            }

            try {
                const
                    { currentPage : currentPageBeforeLoading }       = me,
                    placeParametersInBody = me.paramsInBody && (options.method?.toUpperCase() === 'POST' || options.method?.toUpperCase() === 'PUT') && options.body == null,
                    url                   = event.url + (placeParametersInBody ? '' : me.buildQueryString(event.url, params)),
                    promise               = me.loadingPromise = AjaxHelper.get(
                        url,
                        ObjectHelper.assign(options, me.fetchOptions, placeParametersInBody ? { body : JSON.stringify(params) } : null)),
                    response              = await promise;

                if (me.isDestroyed) {
                    return;
                }

                const
                    data        = me.transformLoadedData ? me.transformLoadedData(response.parsedJson) : response.parsedJson,
                    isArray     = Array.isArray(data),
                    success     = isArray || (data && (ObjectHelper.getPath(data, me.responseSuccessProperty) !== false)),
                    remoteTotal = isArray ? null : ObjectHelper.getPath(data, me.responseTotalProperty);

                me.loadingPromise = null;
                me._isLoading     = false;
                event.response    = response;
                event.json        = data;

                if (success) {
                    if (remoteTotal != null) {
                        me.remoteTotal = parseInt(remoteTotal, 10);
                    }

                    // If we are issuing paged requests, work out what page we are on based
                    // on the requested page and the size of the dataset declared.
                    if (me.isPaged && !me.lazyLoad) {
                        if (me.remoteTotal >= 0) {
                            me.currentPage = me.pageStartParamName ? params[me.pageStartParamName] / me.pageSize + 1 : params[me.defaultPageParamName];
                            // At this point the currentPage can be less than what it was before (filtered data)
                            // If so, skip toggling empty text because we will be loading the updated current page again.
                            // See performRemoteFilter.
                            if (me.currentPage < currentPageBeforeLoading) {
                                event.shouldSkipToggleEmptyText = true;
                            }
                        }
                        else {
                            throw new Error('A paged store must receive its responseTotalProperty in each data packet');
                        }
                    }
                    event.data = isArray ? data : ObjectHelper.getPath(data, me.responseDataProperty);

                    me.suspendModificationsTracking();
                    await successFn?.(event);
                    me.resumeModificationsTracking();

                    if (me.isPartOfProjectRaw) {
                        if (me.ignoreLoadPropagationChanges) {
                            me.suspendModificationsTracking();
                        }
                        await me.getProject()?.commitAsync();
                        if (me.ignoreLoadPropagationChanges) {
                            me.resumeModificationsTracking();
                        }
                    }

                    !me.isDestroyed && me.trigger('load' + eventName, event);
                    resolve(event);
                }
                else {
                    Object.assign(event, {
                        exception     : true,
                        exceptionType : 'server',
                        error         : data?.error
                    });
                    !me.isDestroyed && me.trigger('exception', event);
                    reject(event);
                }
            }
            catch (responseOrError) {
                me._isLoading = false;

                // Superseded by a newer request — expected, not an exception (mirrors doDestroy()).
                if (responseOrError?.name === 'AbortError') {
                    return;
                }

                event.exception = true;

                if (responseOrError instanceof Response) {
                    event.exceptionType = responseOrError.ok ? 'server' : 'network';
                    event.response      = responseOrError;
                    event.error         = responseOrError.error;
                }
                else {
                    event.exceptionType = 'server';
                    event.error         = responseOrError;
                }

                !me.isDestroyed && me.trigger('exception', event);
                reject(event);
            }
            finally {
                !me.isDestroyed && me.trigger('afterRequest', event);
            }
        }
    }

    /**
     * Load data from the {@link #config-readUrl}. If configured as {@link #config-lazyLoad}, this will load 1 chunk of
     * records starting from index 0. If the store has previously been loaded, it will first be cleared of all records
     * and all lazy load cache.
     * @param {Object} [params] A hash of parameters to append to querystring (will also append Store#params)
     * @returns {Promise} A Promise which will be resolved if the load succeeds, and rejected if the load is
     * vetoed by a {@link #event-beforeLoad} handler, or if an {@link #event-exception} is detected.
     * The resolved function is passed the event object passed to any event handlers.
     * The rejected function is passed the {@link #event-exception} event if an exception occurred,
     * or `false` if the load was vetoed by a {@link #event-beforeLoad} handler.
     * @ts-returns {Promise<Object>}
     * @fires beforeLoad
     * @fires loadStart
     * @fires beforeRequest
     * @fires load
     * @fires exception
     * @fires afterRequest
     * @category CRUD
     */
    async load(params) {
        const
            me = this;

        if (me.isPaged) {
            return me.loadPage(me.currentPage || 1, params);
        }
        else {
            return me.internalLoad(params, '', (event) => {
                // The set Data setter will trigger the refresh event with { action: 'dataset' }
                me.data = event.data;
            });
        }
    }

    /**
     * Loads children into specified parent record. Parent records id is sent as a param (param name configured with
     * {@link #config-parentIdParamName}.
     * @param {Core.data.Model} parentRecord Parent record
     * @returns {Promise} A Promise which will be resolved if the load succeeds, and rejected if the load is
     * vetoed by a {@link #event-beforeLoadChildren} handler, or if an {@link #event-exception} is detected.
     * The resolved function is passed the event object passed to any event handlers.
     * The rejected function is passed the {@link #event-exception} event if an exception occurred,
     * or `false` if the load was vetoed by a {@link #event-beforeLoadChildren} handler.
     * @fires beforeLoadChildren
     * @fires loadChildrenStart
     * @fires beforeRequest
     * @fires loadChildren
     * @fires exception
     * @fires afterRequest
     * @category CRUD
     * @non-lazy-load
     */
    async loadChildren(parentRecord) {
        // Immediate call to sendLoadRequest because we can make multiple, concurrent requests
        // to load many tree nodes at once, so pass delay parameter as false.
        return this.readUrl ? this.internalLoad({ [this.parentIdParamName] : parentRecord.id }, 'Children', event => {
            event.parentRecord = parentRecord;

            if (parentRecord.children.length) {
                parentRecord.clearChildren(true);
            }
            // Append received children
            parentRecord.data[parentRecord.constructor.childrenField] = event.data;
            parentRecord.processChildren(parentRecord.stores);
        }, false) : this.immediatePromise;
    }

    //region Paging

    /**
     * Loads a page of data from the {@link #config-readUrl}.
     * @param {Number} page The *one based* page number to load.
     * @param {Object} params A hash of parameters to append to querystring (will also append Store#params)
     * @returns {Promise} A Promise which will be resolved if the load succeeds, and rejected if the load is
     * vetoed by a {@link #event-beforeLoadPage} handler, or if an {@link #event-exception} is detected.
     * The resolved function is passed the event object passed to any event handlers.
     * The rejected function is passed the {@link #event-exception} event if an exception occurred,
     * or `false` if the load was vetoed by a {@link #event-beforeLoadPage} handler.
     * @fires beforeLoadPage
     * @fires loadPageStart
     * @fires beforeRequest
     * @fires loadPage
     * @fires exception
     * @fires afterRequest
     * @category CRUD
     * @non-lazy-load
     */
    async loadPage(page, params = {}) {
        if (!this.readUrl) {
            // If not really an AjaxStore, we need to use regular Stores loadPage
            return super.loadPage(page);
        }

        params[this.defaultPageParamName] = page ?? 1;

        return this.internalLoad(params, 'Page', (event) => {
            // We go directly to loadPage because paging a tree store is unsupportable.
            // loadPage will trigger the refresh event with { action: 'pageLoad' }
            this.loadData(event.data, 'pageLoad');
        });
    }

    /**
     * If this store {@link #property-isPaged is paged}, and is not already at the {@link #property-lastPage}
     * then this will load the next page of data.
     * @fires beforeLoadPage
     * @fires loadPageStart
     * @fires beforeRequest
     * @fires loadPage
     * @fires exception
     * @fires afterRequest
     * @category CRUD
     * @returns {Promise} A promise which is resolved when the Ajax request completes and has been processed.
     * @non-lazy-load
     */

    /**
     * If this store {@link #property-isPaged is paged}, and is not already at the first page
     * then this will load the previous page of data.
     * @fires beforeLoadPage
     * @fires loadPageStart
     * @fires beforeRequest
     * @fires loadPage
     * @fires exception
     * @fires afterRequest
     * @category CRUD
     * @returns {Promise} A promise which is resolved when the Ajax request completes and has been processed.
     * @non-lazy-load
     */

    //endregion

    //region Commit

    /**
     * Commits all changes (added, modified and removed) using corresponding urls ({@link #config-createUrl},
     * {@link #config-updateUrl} and {@link #config-deleteUrl})
     * @fires beforeCommit
     * @returns {Promise} A Promise which is resolved only if all pending changes (Create, Update and Delete)
     * successfully resolve. Both the resolve and reject functions are passed a `commitState` object which is stored the
     * {@link #event-afterRequest} event for each request. Each event contains the `exception`, `request` and `response`
     * properties eg:
     *
     * ```javascript
     * {
     *      // If *all* commits succeeded
     *      success: true,
     *      changes: {
     *          added: [records...],
     *          modified: [records...],
     *          removed: [records...],
     *      },
     *      added: {
     *          source: theStore,
     *
     *          // Only if the add request triggered an exception
     *          exception: true,
     *
     *          // Only if the add request triggered an exception
     *          exceptionType: 'server', // Or 'network'
     *
     *          response: Response,
     *          json: parsedResponseObject
     *      },
     *      // Same format as added
     *      modified: {},
     *      removed: {}
     * }
     * ```
     *
     * If there were no pending changes, the resolve and reject functions are passed no parameters.
     *
     * If a commit operation already is in progress, a new one will be queued to execute after.
     * The resolved function is passed the event object passed to any event handlers.
     * The rejected function is passed the {@link #event-exception} event if an exception occurred.
     * @category CRUD
     */
    async commit() {
        // A direct call to commit cancels any outstanding autoCommit
        this.clearTimeout('autoCommit');
        this.autoCommitTimeoutPromise = null;

        return this.queueCommit();
    }

    /**
     * Internally used to handle the commit queue
     * @returns {Promise}
     * @internal
     */
    // Makes sure there is only one commit in progress
    // Queues the commits that happens while committing
    queueCommit() {
        const me = this;
        let queuePromise;

        // If we have an ongoing commit, we want to return a promise that chains the ongoing commit
        if (me.commitPromise) {
            queuePromise = me.commitPromise.then(() => me.performCommit());
        }
        else {
            me._commitPromiseQueueLength = 0;
            queuePromise = me.performCommit();
        }

        // Keep track of the queue length
        me._commitPromiseQueueLength += 1;

        // Store.commitPromise needs to always be the last commit in the queue
        return me.commitPromise = queuePromise?.finally(() => {
            // When each commit call is finished,
            // decrease the queue
            me._commitPromiseQueueLength -= 1;
            // And if the queue is 0, we are not committing anymore
            if (me._commitPromiseQueueLength === 0) {
                me.commitPromise = null;
            }
        });
    }

    /**
     * Internally used to perform the actual commit without any queue handling or timeout
     * @returns {Promise}
     * @internal
     */
    performCommit() {
        const
            me          = this,
            { changes } = me,
            allPromises = [];

        // No outstanding changes, return a Promise that resolves immediately.
        if (!changes) {
            // Special handling of modified. If only non-persistable fields have been modified, it won't count among
            // `changes`, but still needs to be cleared
            if (me.modified.count) {
                me.modified.forEach(record => record.internalClearChanges(true, false));
                me.modified.clear();
            }

            return immediatePromise;
        }

        if (me.trigger('beforeCommit', { changes }) !== false) {
            // Flag all affected records as being committed
            [...changes.added, ...changes.modified, ...changes.removed].forEach(record => record.meta.committing = true);

            // Commit was not prevented in beforeCommit listener, so we begin the commit
            me.trigger('commitStart', { changes });

            const
                commitState = {
                    action    : 'commit',
                    exception : false,
                    changes
                };

            let p = me.commitRemoved(commitState);

            if (p) {
                allPromises.push(p);
            }
            p = me.commitAdded(commitState);
            if (p) {
                allPromises.push(p);
            }
            p = me.commitModified(commitState);
            if (p) {
                allPromises.push(p);
            }

            // If there were no urls configured, behave as a local store
            if (!allPromises.length) {
                me.modified.forEach(r => r.internalClearChanges(true, false));
                me.modified.clear();

                me.added.forEach(r => r.internalClearChanges(true, false));
                me.added.clear();

                me.removed.clear();
                me.trigger('commit', { changes });
                return immediatePromise;
            }

            // The Promises from the commit methods all resolve whether the request
            // succeeded or not. They each contribute their afterrequest event to the
            // commitState which can be used to detect overall success or failure
            // and granular inspection of which operations succeeded or failed.
            // If there's only one operation, wait for it.
            // If there's more than one operation, we have to wait for allPromises to resolve.
            p = allPromises.length === 1 ? allPromises[0] : Promise.all(allPromises);

            return new Promise((resolve, reject) => {
                p.then(() => {
                    if (commitState.exception) {
                        me.trigger('exception', commitState);
                        reject(commitState);
                    }
                    else {
                        me.trigger('commit', { changes });
                        resolve(commitState);
                    }
                }).catch(() => {
                    reject(commitState);
                });
            });
        }
        // Prevented in beforeCommit listener
        else {
            // Return promise that resolves immediately
            return immediatePromise;
        }
    }

    // Performs background autocommit with reject checking
    doAutoCommit() {
        const me = this;

        // add deferred call if it's not scheduled yet
        if (me.suspendCount <= 0 && !me.hasTimeout('autoCommit')) {
            me.autoCommitTimeoutPromise = new Promise(resolve => {
                me.setTimeout({
                    name : 'autoCommit',
                    fn   : () => {
                        me.autoCommitTimeoutPromise = null;
                        me.commit().then().catch(commitState => {
                            const { response } = commitState;
                            // Skip throw if response is `ok` or `status` is 500 or 404 and request is successfully parsed
                            // These errors are notified by API events
                            if (!(response && (response.ok && response.parsedJson || [500, 404].includes(response.status)))) {
                                throw commitState;
                            }
                        });
                        resolve();
                    },
                    delay : me.autoCommitTimeout
                });
            });
        }
    }

    // <remove-on-release>
    // TODO: need a way to abort commits
    // </remove-on-release>

    buildCommitUrl(baseUrl) {
        return baseUrl + this.buildQueryString(baseUrl, this.params);
    }

    /**
     * Commits added records by posting to {@link #config-createUrl}.
     * Server should return a JSON object with a 'success' property indicating whether the operation was successful.
     * @param {Object} commitState An object into which is added a `delete` property being the
     * {@link #event-afterRequest} event.
     * @returns {Promise|null} If there are added records, a Promise which will be resolved whether the commit
     * succeeds or fails. The resulting event is placed into the `add` property of the passed `commitState`
     * parameter. If there are no added records, `null` is returned.
     * The resolved function is passed the event object passed to any event handlers.
     * @async
     * @private
     * @fires beforeRequest
     * @fires commitAdded
     * @fires refresh
     * @fires exception
     * @fires afterRequest
     */
    commitAdded(commitState) {
        // If we have added records and a createUrl, we can commit the added records
        return this.added.count && this.createUrl ? this.commitAddedAsync(commitState) : null;
    }

    async commitAddedAsync(commitState) {
        const
            me    = this,
            added = Array.from(me.added), // The added array can change while committing
            toAdd = added.map(extractPersistableData),
            event = { action : 'create', params : me.params, url : me.buildCommitUrl(me.createUrl) };

        commitState.create = event;

        event.body = { data : toAdd };

        // beforeRequest may need to perform asynchronous operations, so we need to await it.
        if ((await me.trigger('beforeRequest', event)) === false) {
            // Clear committing flag
            added.forEach(r => r.meta.committing = false);
            return commitState;
        }

        let dataToSend = me.transformCreationData ? me.transformCreationData(event.body) : event.body;

        if (me.sendAsFormData) {
            const formData = new FormData();

            formData.append('data', JSON.stringify(dataToSend.data));
            dataToSend = formData;
        }

        const options = { parseJson : true };

        if (me.headers) {
            options.headers = ObjectHelper.clone(me.headers);
        }

        if (me.useRestfulMethods) {
            options.method = me.httpMethods.create;
        }

        try {
            const response = await AjaxHelper.post(event.url, dataToSend, ObjectHelper.assign(options, me.fetchOptions));

            if (me.isDestroyed) {
                return;
            }
            const
                data    = response.parsedJson,
                success = Array.isArray(data) || (data && (data.success !== false));

            commitState.response = response;
            event.json           = data;
            event.response       = response;

            if (success) {
                // The accepted records are those which are included in the returned data array, mapped
                // on array index only. Or all records if only success : true
                const acceptedRecords = me.processReturnedData(data, added, toAdd);

                // Remove added cache for those record added by this commit
                me.added.remove(acceptedRecords);

                // Need to check if any of the added records has been modified during this commit. If so, add them
                // to modified (the record modification was ignored)
                me.modified.add(acceptedRecords.filter(a => a.meta.modified && !ObjectHelper.isEmpty(a.meta.modified)));

                me.trigger('commitAdded');

                // We must signal a full refresh because any number of records could have received any number of field updates
                // back from the server, so a refresh is more efficient than picking through the received updates.
                me.trigger('refresh', event);
            }
            else {
                // Clear committing flag
                added.forEach(r => r.meta.committing = false);

                commitState.exception = event.exception = true;

                commitState.exceptionType = event.exceptionType = 'server';

                me.trigger('exception', event);
            }
        }
        catch (responseOrError)  {
            // Clear committing flag
            added.forEach(r => r.meta.committing = false);

            commitState.exception = event.exception = true;

            if (responseOrError instanceof Response) {
                commitState.response = responseOrError;
                event.exceptionType  = responseOrError.ok ? 'server' : 'network';
                event.response       = responseOrError;
                event.error          = responseOrError.error;
            }
            else {
                event.exceptionType = 'server';
                event.error         = responseOrError;
            }

            !me.isDestroyed && me.trigger('exception', event);
        }
        finally {
            !me.isDestroyed && me.trigger('afterRequest', event);
        }

        return commitState;
    }

    /**
     * Commits modified records by posting to {@link #config-updateUrl}.
     * Server should return a JSON object with a 'success' property indicating whether the operation was successful.
     * @param {Object} commitState An object into which is added a `delete` property being the
     * {@link #event-afterRequest} event.
     * @returns {Promise|null} If there are added records, a Promise which will be resolved whether the commit
     * succeeds or fails. The resulting event is placed into the `update` property of the passed `commitState`
     * parameter. If there are no added records, `null` is returned.
     * The resolved function is passed the event object passed to any event handlers.
     * @async
     * @private
     * @fires beforeRequest
     * @fires commitModified
     * @fires refresh
     * @fires exception
     * @fires afterRequest
     */
    commitModified(commitState) {
        // If we have modified records and an updateUrl, we can commit the changed records
        return this.modified.count && this.updateUrl ? this.commitModifiedAsync(commitState) : null;
    }

    async commitModifiedAsync(commitState) {
        const
            me            = this,
            // Only include persistable changes
            modified      = Array.from(me.changes.modified), // Modifications can change while committing
            // Use the record's modificationData, not modifications.
            // modifications returns a map using *field names*
            // The server will expect a map using the original dataSource properties.
            event         = { action : 'update', params : me.params, url : me.buildCommitUrl(me.updateUrl) },
            modifications = modified.map(record => {
                if (me.writeAllFields) {
                    return record.persistableData;
                }
                else {
                    return record.modificationDataToWrite;
                }
            }).filter(rejectEmpty);

        // Check if modifications are empty and don't make request
        if (modifications.length === 0) {
            me.modified.clear();
            modified.forEach(r => r.meta.committing = false);
            return;
        }

        commitState.update = event;

        event.body = { data : modifications };

        // beforeRequest may need to perform asynchronous operations, so we need to await it.
        if ((await me.trigger('beforeRequest', event)) === false) {
            return commitState;
        }

        let dataToSend = me.transformModificationData ? me.transformModificationData(event.body) : event.body;

        if (me.sendAsFormData) {
            const formData = new FormData();

            formData.append('data', JSON.stringify(dataToSend.data));
            dataToSend = formData;
        }

        const options = { parseJson : true };

        if (me.headers) {
            options.headers = ObjectHelper.clone(me.headers);
        }

        if (me.useRestfulMethods) {
            options.method = me.httpMethods.update;
        }

        try {
            const response = await AjaxHelper.post(
                event.url,
                dataToSend,
                ObjectHelper.assign(options, me.fetchOptions)
            );
            if (me.isDestroyed) {
                return;
            }

            const
                data    = response.parsedJson,
                success = Array.isArray(data) || (data && (data.success !== false));

            commitState.response = response;
            event.json           = data;
            event.response       = response;

            if (success) {
                me.processReturnedData(data, modified, modifications, true, true);

                me.trigger('commitModified');

                // We must signal a full refresh because any number of records could have received any number of
                // field updates back from the server, so a refresh is more efficient than picking through the
                // received updates.
                me.trigger('refresh', event);
            }
            else {
                // Clear committing flag
                modified.forEach(r => r.meta.committing = false);

                commitState.exception = event.exception = true;
                event.exceptionType   = 'server';
                me.trigger('exception', event);
            }
        }
        catch (responseOrError) {
            // Clear committing flag
            modified.forEach(r => r.meta.committing = false);

            commitState.exception = event.exception = true;

            if (responseOrError instanceof Response) {
                commitState.response = responseOrError;
                event.exceptionType  = responseOrError.ok ? 'server' : 'network';
                event.response       = responseOrError;
                event.error          = responseOrError.error;
            }
            else {
                event.exceptionType = 'server';
                event.error         = responseOrError;
            }

            !me.isDestroyed && me.trigger('exception', event);
        }
        finally {
            !me.isDestroyed && me.trigger('afterRequest', event);
        }

        // Also clear non-persistable changes
        if (!modified.length && me.modified.count) {
            me.modified.clear();
        }

        return commitState;
    }

    // Used by commitAdded and commitModified to apply data changeset and clearing changes
    processReturnedData(returnedData, localRecords, changes, isUpdating = false) {
        if (!Array.isArray(returnedData)) {
            returnedData = ObjectHelper.getPath(returnedData, this.responseDataProperty);
        }

        const
            { idField }     = localRecords[0].constructor,
            acceptAll       = !returnedData || returnedData.length === localRecords.length,
            acceptedRecords = [];

        localRecords.forEach((record, i) => {
            const recData = isUpdating ? returnedData?.find(d => d[idField] === record.id) : returnedData?.[i];

            if (acceptAll || recData) {
                const
                    currentChanges = record.modificationDataToWrite,
                    committedData  = isUpdating ? changes.find(m => m[idField] === record.id) : changes[i], // Changes included in this specific commit.
                    remapped       = {};

                record.meta.committing = false;

                if (recData) {
                    // Using syncId to update record's id with no flagging the property as modified.
                    record.syncId(recData[idField]);

                    // When updating, only want to apply the actual changes and not reapply defaults. When adding, also
                    // apply the defaults
                    Object.assign(record.data, this.modelClass.processData(recData, isUpdating, this, record));
                }

                if (currentChanges) {
                    // We only clear changes included in this specific commit
                    // ModificationData is dataSource-based. Model's clearChanges expects field names
                    for (const key in committedData) {
                        const
                            field          = record.getFieldDefinitionFromDataSource(key),
                            localValue     = currentChanges[key],
                            committedValue = committedData[key];

                        // Exclude any key where the value have changed while committing
                        if (field?.persist && field.isEqual(localValue, committedValue)) {
                            remapped[field.name] = 1; // value is irrelevant
                        }
                    }
                }

                record.internalClearChanges(true, true, remapped, true);
                acceptedRecords.push(record);
            }
        });

        return acceptedRecords;
    }

    /**
     * Commits removed records by posting to {@link #config-deleteUrl}.
     * Server should return a JSON object with a 'success' property indicating whether the operation was successful.
     * @param {Object} commitState An object into which is added a `delete` property being the
     * {@link #event-afterRequest} event.
     * @returns {Promise|null} If there are added records, a Promise which will be resolved whether the commit
     * succeeds or fails. The resulting event is placed into the `delete` property of the passed `commitState`
     * parameter. If there are no added records, `null` is returned.
     * The resolved function is passed the event object passed to any event handlers.
     * @async
     * @private
     * @fires beforeRequest
     * @fires commitRemoved
     * @fires refresh
     * @fires exception
     * @fires afterRequest
     */
    commitRemoved(commitState) {
        // If we have removed records and a deleteUrl, we can commit the removed records
        return this.removed.count && this.deleteUrl ? this.commitRemovedAsync(commitState) : null;
    }

    async commitRemovedAsync(commitState) {
        const
            me = this,
            {
                removed,
                includeChildrenInRemoveRequest
            }  = me;

        let removedRecords;

        // Get rid of any descendant of removed parents
        if (!includeChildrenInRemoveRequest) {
            removedRecords = [];

            for (const record of removed.values) {
                // parentId gets set to null on direct removal (not on parent removal)
                const parentId = record.parentId ?? record.meta.modified?.parentId;

                // If the parent is also removed, don't send the child
                if (parentId != null && (parentId === me.rootNode.id || !removed.includes(parentId))) {
                    removedRecords.push(record);
                }
            }
        }
        else {
            removedRecords = removed.values;
        }

        const event = {
            action : 'delete',
            params : me.params,
            url    : me.buildCommitUrl(me.deleteUrl),
            body   : { ids : removedRecords.map(r => r.id) }
        };
        commitState.delete = event;

        // beforeRequest may need to perform asynchronous operations, so we need to await it.
        if ((await me.trigger('beforeRequest', event)) === false) {
            return commitState;
        }

        let dataToSend = me.transformRemovalData ? me.transformRemovalData(event.body) : event.body;

        if (me.sendAsFormData) {
            const formData = new FormData();

            formData.append('id', JSON.stringify(dataToSend.ids));
            dataToSend = formData;
        }

        const options = { parseJson : true };

        if (me.headers) {
            options.headers = ObjectHelper.clone(me.headers);
        }

        if (me.useRestfulMethods) {
            options.method = me.httpMethods.delete;
        }

        try {
            const response = await AjaxHelper.post(
                event.url,
                dataToSend,
                ObjectHelper.assign(options, me.fetchOptions)
            );
            const
                data    = response.parsedJson,
                isArray = Array.isArray(data),
                success = isArray || (data && (data.success !== false));

            commitState.response = response;
            event.json           = data;
            event.response       = response;

            if (success) {
                removed.forEach(record => record.meta.committing = false); // In case used by other store etc.
                removed.clear();

                me.trigger('commitRemoved');
                me.trigger('refresh', event);
            }
            else {
                // Clear committing flag
                removed.forEach(r => r.meta.committing = false);

                commitState.exception = event.exception = true;

                event.exceptionType = 'server';
                me.trigger('exception', event);
            }
        }
        catch (responseOrError) {
            // Clear committing flag
            removed.forEach(r => r.meta.committing = false);

            commitState.exception = event.exception = true;

            if (responseOrError instanceof Response) {
                commitState.response = responseOrError;
                event.exceptionType  = responseOrError.ok ? 'server' : 'network';
                event.response       = responseOrError;
                event.error          = responseOrError.error;
            }
            else {
                event.exceptionType = 'server';
                event.error         = responseOrError;
            }

            !me.isDestroyed && me.trigger('exception', event);
        }
        finally {
            !me.isDestroyed && me.trigger('afterRequest', event);
        }

        return commitState;
    }

    //endregion
}

// Register type with its Factory
AjaxStore.initClass();
