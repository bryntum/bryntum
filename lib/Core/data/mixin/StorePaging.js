import Base from '../../Base.js';

/**
 * @module Core/data/mixin/StorePaging
 */

const immediatePromise = Promise.resolve();

/**
 * Mixin for Store that handles server-side pagination. Configure the store with `remotePaging : true` and set a
 * `pageSize` to enable loading data one page at a time.
 *
 * ```javascript
 * const store = new AjaxStore({
 *     readUrl       : '/api/records',
 *     remotePaging  : true,
 *     pageSize      : 25,
 *     pageParamName : 'page'
 * });
 *
 * await store.loadPage(1); // Load first page
 * await store.nextPage();  // Load page 2
 * ```
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-remotePaging}                  | Enable remote paging on the store                     |
 * | {@link #config-pageSize}                      | Number of records per page                            |
 * | {@link #function-loadPage}                    | Load a specific page by number                        |
 * | {@link #function-nextPage}                    | Load the next page                                    |
 * | {@link #function-previousPage}                | Load the previous page                                |
 * | {@link #property-currentPage}                 | The currently loaded page number                      |
 * | {@link #property-lastPage}                    | The last available page number                        |
 *
 * ## See also
 *
 * - {@link Core.data.AjaxStore} - Store with AJAX data loading
 * - {@link Core.data.Store} - The main store class
 *
 * @mixin
 */

export default Target => class StorePaging extends (Target || Base) {
    static $name = 'StorePaging';

    static configurable = {
        /**
         * When the Store is paged by configuring {@link #config-remotePaging}, this value will be included in the load
         * requests.
         *
         * **Note:** Setting pageSize at runtime will automatically reload the page.
         * @prp {Number}
         * @default
         * @category Paging
         * @non-lazy-load
         */
        pageSize : 50,

        /**
         * The name of the parameter to use when requesting pages of data, representing the configured
         * {@link #config-pageSize} value.
         * @config {String}
         * @default
         * @category Paging
         * @non-lazy-load
         */
        pageSizeParamName : 'pageSize',

        /**
         * The name of the parameter to use when requesting pages of data using the **zero based** index of the required
         * page's starting record.
         * @config {String}
         * @category Paging
         * @non-lazy-load
         */
        pageParamName : null,

        /**
         * The name of the parameter to use when requesting pages of data using the **one based** page number required.
         * @config {String}
         * @category Paging
         * @non-lazy-load
         */
        pageStartParamName : null,

        /**
         * Set this to `true` to activate remote paging in this Store. Makes it possible to use the
         * {@link #function-loadPage}, {@link #function-nextPage}, and {@link #function-previousPage} functions. Or
         * add the {@link Core.widget.PagingToolbar} to control what page to load.
         *
         * For a non-{@link Core.data.AjaxStore}, data will be requested by the Store by calling a by the app
         * implemented {@link Core.data.Store#config-requestData} function. Data can also be provided by listening to
         * the {@link Core.data.Store#event-requestData} event, and updating the {@link Core.data.Store#config-data}
         * property with new data.
         *
         * @config {Boolean}
         * @category Paging
         */
        remotePaging : false
    };

    /**
     * **If the store {@link #property-isPaged is paged}**, yields the current page number.
     * @member {Number} currentPage
     * @readonly
     */
    get currentPage() {
        return this._currentPage ?? 1;
    }

    set currentPage(page) {
        if (this.totalCount) {
            page = Math.min(page, this.lastPage);
        }
        this._currentPage = page;
    }

    updatePageParamName(param) {
        if (this.pageStartParamName) {
            throw new Error('Configs pageStartParamName and pageParamName are mutually exclusive');
        }
        this.remotePaging = param != null;
    }

    updatePageStartParamName(param) {
        if (this.pageParamName) {
            throw new Error('Configs pageParamName and pageStartParamName are mutually exclusive');
        }
        this.remotePaging = param != null;
    }

    get defaultPageParamName() {
        return this.pageParamName ?? this.pageStartParamName ?? 'page';
    }

    updateRemotePaging(paging) {
        if (paging && this.tree) {
            throw new Error('Paging cannot be supported for tree stores');
        }
    }

    // This function is called to automatically reload page whenever pageSize is set at runtime.
    updatePageSize(pageSize) {
        const me = this;

        if (!me.isConfiguring && pageSize) {
            me.currentPage = me.currentPage
                ? Math.min(me.currentPage, Math.floor((me.totalCount + pageSize - 1) / pageSize))
                : 1;
            me.loadPage(me.currentPage);
        }
    }

    /**
     * Yields `true` if this Store is loaded page by page. See the {@link #config-remotePaging} config.
     * @member {Boolean}
     * @readonly
     * @category Paging
     * @non-lazy-load
     */
    get isPaged() {
        return this.remotePaging;
    }

    set pagedTotal(count) {
        this.remoteTotal = count;
    }

    /**
     * **If the store {@link #property-isPaged is paged}**, yields the highest page number in the dataset as calculated
     * from the 'total' returned in the last page data block loaded.
     * @member {Number}
     * @readonly
     * @category Paging
     * @non-lazy-load
     */
    get lastPage() {
        if (this.isPaged) {
            return Math.floor((this.totalCount + this.pageSize - 1) / this.pageSize);
        }
    }

    // region Events
    /**
     * When the store {@link #property-isPaged is paged}, this is fired before loading a page and is cancelable
     * @event beforeLoadPage
     * @preventable
     * @param {Core.data.Store} source This Store
     * @param {String} action (AjaxStore only) The read action being performed: `'readPage'`
     * @param {String} url (AjaxStore only) The URL to which the HTTP request will be sent. This property may be mutated in
     * an event handler *without changing* the base {@link Core.data.AjaxStore#config-readUrl} configured for this Store.
     * @param {Object} params An object containing property/name pairs which are the parameters.
     * This may be mutated to affect the parameters used in the request.
     */

    /**
     * When the store {@link #property-isPaged is paged}, this is fired when a page is loaded.
     * @event loadPage
     * @param {Core.data.Store} source This Store
     * @param {Object} params An object containing property/name pairs which are the parameters.
     * This may be mutated to affect the parameters used in the request.
     */
    // endregion

    /**
     * Loads a page of data from the implemented {@link Core.data.Store#config-requestData} function.
     * @param {Number} page The *one based* page number to load.
     * @param {Object} params A hash of parameters to append to the request event and requestData call
     * @returns {Promise} A Promise which will be resolved when the request completes
     * @category CRUD
     * @non-lazy-load
     * @async
     */
    async loadPage(page, params = {}) {
        params = this.getPagingParams({ ...params, page });

        if (await this.trigger('beforeLoadPage', { params }) === false) {
            return false;
        }

        if (await this.performDataRequest(false, params, () => {
            this.currentPage = page;
        }) !== false) {
            this.trigger?.('loadPage', params);
        }
    }

    /**
     * If this store {@link #property-isPaged is paged}, and is not already at the {@link #property-lastPage}
     * then this will load the next page of data.
     * @category CRUD
     * @returns {Promise} A promise which is resolved when the request completes and has been processed.
     * @non-lazy-load
     */
    async nextPage(params) {
        const me = this;
        return me.isPaged && me.currentPage !== me.lastPage ? me.loadPage(me.currentPage + 1, params) : immediatePromise;
    }

    /**
     * If this store {@link #property-isPaged is paged}, and is not already at the first page
     * then this will load the previous page of data.
     * @category CRUD
     * @returns {Promise} A promise which is resolved when the request completes and has been processed.
     * @non-lazy-load
     */
    async previousPage(params) {
        return this.isPaged && this.currentPage !== 1 ? this.loadPage(this.currentPage - 1, params) : immediatePromise;
    }

    buildRemoteParams(params = {}, encode = false) {
        return this.getPagingParams(super.buildRemoteParams?.(params, encode) ?? params);
    }

    getPagingParams(params) {
        const me = this;

        if (me.isPaged) {
            let currentPage = params[me.defaultPageParamName] ?? me.currentPage;

            if (this.pageStartParamName) {
                currentPage = Math.max(0, currentPage - 1) * this.pageSize;
            }

            params[me.defaultPageParamName] = currentPage;
            params[me.pageSizeParamName] = me.pageSize;
        }

        return params;
    }

};
