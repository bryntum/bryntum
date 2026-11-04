/**
 * @module Core/helper/AjaxHelper
 */

import Objects from './util/Objects.js';
import FunctionHelper from './FunctionHelper.js';

/**
 * A string defining the HTTP method. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) for details.
 *
 * @typedef {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD'|'OPTIONS'} HttpMethod
 */

/**
 * A string defining the request credentials option. See [Fetch API `credentials`](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
 *
 * - `'omit'` — never send credentials in the request or include credentials in the response.
 * - `'same-origin'` — only send and include credentials for same-origin requests.
 * - `'include'` — always include credentials, even cross-origin.
 *
 * @typedef {'omit'|'same-origin'|'include'} FetchCredentials
 */

/**
 * Options for the requests. Please see
 * [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) for details
 *
 * To set default values for the options please use {@link #property-DEFAULT_FETCH_OPTIONS-static} property:
 *
 * ```javascript
 * // enable passing parameters in request body by default
 * AjaxHelper.DEFAULT_FETCH_OPTIONS = { addQueryParamsToBody : true };
 * ```
 *
 * @typedef {Object} FetchOptions
 * @property {HttpMethod} [method] The request method, e.g., `GET`, `POST`
 * @property {Object} [queryParams] A key-value pair Object containing the params to add to the query string
 * @property {Object} [headers] Any headers you want to add to your request, contained within a `Headers` object or an
 * object literal with ByteString values
 * @property {Object} [body] Any body that you want to add to your request: this can be a `Blob`, `BufferSource`,
 * `FormData`, `URLSearchParams`, or `USVString` object. Note that a request using the `GET` or `HEAD` method cannot
 * have a body.
 * @property {Boolean} [addQueryParamsToBody=false] Indicates whether `queryParams` should be passed in the request
 * body. Adding them to the body applies for `application/x-www-form-urlencoded` and `multipart/form-data`
 * content types only, so make sure to pass corresponding `Content-Type` header to `headers`.
 *
 * When the argument is `true` and:
 * - if `application/x-www-form-urlencoded` content-type header is passed
 *   the method will make a `URLSearchParams` instance with `queryParams` and set it as the request body.
 *   And if `body` already has a `URLSearchParams` instance provided the parameters will be set there.
 * - if `multipart/form-data` content-type header is passed
 *   the method will make a `FormData` instance with `queryParams` and set it as the request body.
 *   And if `body` already has a `FormData` instance provided the parameters will be set there.
 *
 * Otherwise, `queryParams` are added to the query string.
 * @property {'cors'|'no-cors'|'same-origin'} [mode] The mode you want to use for the request, e.g., `'cors'`,
 * `'no-cors'`, or `'same-origin'`.
 * @property {FetchCredentials} [credentials] The request credentials you want to use for the request:
 * `'omit'`, `'same-origin'`, or `'include'`. To automatically send cookies for the current domain, this option must be
 * provided
 * @property {Boolean} [parseJson] Specify `true` to parses the response and attach the resulting object to the
 * `Response` object as `parsedJson`
 * @property {AbortController} [abortController] Provide abort controller to be able to cancel fetch
 */

/**
 * A `Response` type which extends the native [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * with Bryntum properties.
 *
 * @typedef {Response} AjaxResponse
 * @property {*} [parsedJson] The parsed JSON response body. Set when the `parseJson` option was passed to the request.
 * Will be `null` if the body could not be parsed as JSON.
 * @property {Error} [error] The error thrown while parsing the JSON body, set when JSON parsing failed.
 * @property {String} [responseText] The response body as text. Set on responses produced by
 * {@link #function-mockUrl-static mocked URLs}.
 */

const
    paramValueRegExp = /^(\w+)=(.*)$/,
    parseParams      = function(paramString) {
        const
            result = {},
            params = paramString.split('&');

        // loop through each 'filter={"field":"name","operator":"=","value":"Sweden","caseSensitive":true}' string
        // So we cannot use .split('=')
        for (const nameValuePair of params) {
            const
                [match, name, value] = paramValueRegExp.exec(nameValuePair),
                decodedName          = decodeURIComponent(name),
                decodedValue         = decodeURIComponent(value);

            if (match) {
                let paramValue = result[decodedName];

                if (paramValue) {
                    if (!Array.isArray(paramValue)) {
                        paramValue = result[decodedName] = [paramValue];
                    }
                    paramValue.push(decodedValue);
                }
                else {
                    result[decodedName] = decodedValue;
                }
            }
        }
        return result;
    };

/**
 * A static utility class that simplifies Ajax requests using the browser's
 * [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). It provides convenience
 * methods for common HTTP verbs (`GET`, `POST`) and returns standard `Response` promises. Global defaults can be
 * set via {@link #property-DEFAULT_FETCH_OPTIONS-static}.
 *
 * ```javascript
 * const response = await AjaxHelper.get('some-url');
 * const data     = await response.json();
 * ```
 *
 * Or parse the JSON body in a single step with the `parseJson` option, which exposes it as `parsedJson` on the
 * returned {@link #typedef-AjaxResponse}:
 *
 * ```javascript
 * const { parsedJson } = await AjaxHelper.get('some-url', { parseJson : true });
 * ```
 *
 * Uploading a file to the server via `FormData`:
 *
 * ```javascript
 * const formData = new FormData();
 * formData.append('file', 'fileNameToUpload');
 * AjaxHelper.post('file-upload-url', formData).then(response => {
 *     // process request response here
 * });
 * ```
 *
 * ## Useful functions
 *
 * | Function                            | Description                                   |
 * |-------------------------------------|-----------------------------------------------|
 * | {@link #function-get-static}        | Perform a `GET` request                       |
 * | {@link #function-post-static}       | Perform a `POST` request                      |
 * | {@link #function-fetch-static}      | Perform a request with any HTTP method         |
 *
 * ## See also
 *
 * - {@link Core.data.AjaxStore} - Store that uses AjaxHelper for remote data loading
 * - {@link #typedef-FetchOptions} - Options object passed to fetch methods
 *
 */
export default class AjaxHelper {

    /**
     * Sets default options for {@link #function-fetch-static AjaxHelper#fetch()} calls. Please see
     * {@link #typedef-FetchOptions} and
     * [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) for details.
     *
     * ```javascript
     * // default content-type for all requests will be "application/json"
     * AjaxHelper.DEFAULT_FETCH_OPTIONS = {
     *     headers : {
     *         'content-type' : 'application/json'
     *     }
     * };
     * ```
     * @member {FetchOptions} DEFAULT_FETCH_OPTIONS
     * @static
     */
    static DEFAULT_FETCH_OPTIONS = {};

    /**
     * Make a request (using GET) to the specified url. Resolves to a {@link AjaxResponse}; pass `parseJson : true`
     * in the {@link FetchOptions} to have the response body parsed and exposed as `parsedJson`.
     *
     * ```javascript
     * const { parsedJson } = await AjaxHelper.get('data/content.json', { parseJson : true });
     * ```
     *
     * @param {String} url URL to `GET` from
     * @param {FetchOptions} [options] The options for the `fetch` API
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     * @ts-returns {Promise<AjaxResponse>}
     * @async
     */
    static get(url, options) {
        return this.fetch(url, options);
    }

    /**
     * POST data to the specified URL. Resolves to a {@link AjaxResponse}; pass `parseJson : true` in the
     * {@link FetchOptions} to have the response body parsed and exposed as `parsedJson`.
     *
     * ```javascript
     * const { parsedJson } = await AjaxHelper.post('api/save', { id : 1, name : 'Foo' }, { parseJson : true });
     * ```
     *
     * @param {String} url URL to `POST` to
     * @param {String|Object|FormData} payload The data to post. If an object is supplied, it will be stringified
     * @param {FetchOptions} [options] The options for the `fetch` API
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     * @ts-returns {Promise<AjaxResponse>}
     * @async
     */
    static post(url, payload, options = {}) {
        options = Objects.assign({}, options);

        if (!(payload instanceof FormData) && typeof payload !== 'string') {
            payload = JSON.stringify(payload);

            options.headers = options.headers || {};

            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        }

        return this.fetch(url, {
            method : 'POST',
            body   : payload,
            ...options
        });
    }

    /**
     * Fetch the specified resource using the `fetch` API. Resolves to a {@link AjaxResponse} — the native
     * `Response` extended with `parsedJson` when `parseJson : true` is set in the {@link FetchOptions}.
     *
     * ```javascript
     * const response = await AjaxHelper.fetch('data/items.json', { parseJson : true });
     *
     * if (response.ok) {
     *     console.log(response.parsedJson);
     * }
     * ```
     *
     * @param {String} url URL to fetch from
     * @param {FetchOptions} [options] The options for the `fetch` API
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     * @ts-returns {Promise<AjaxResponse>}
     * @async
     */
    static fetch(url, options) {
        let controller;

        // inherit global options
        options = Objects.merge({}, AjaxHelper.DEFAULT_FETCH_OPTIONS, options);

        // AbortController is not supported by LockerService
        // https://github.com/bryntum/bryntum/issues/3689
        if (typeof AbortController !== 'undefined') {
            const externalSignal = options.signal;

            controller = options.abortController || (options.abortController = new (FunctionHelper.getAbortController())());
            options.signal = controller.signal;

            // Forward a bare `signal` passed without `abortController` (e.g. AIAudioController.speak())
            if (externalSignal && externalSignal !== controller.signal) {
                if (externalSignal.aborted) {
                    controller.abort(externalSignal.reason);
                }
                else {
                    externalSignal.addEventListener('abort', () => controller.abort(externalSignal.reason));
                }
            }
        }

        if (options.queryParams) {
            const params = Object.entries(options.queryParams);
            if (params.length) {
                let paramsAdded = false;

                // for some content types we are going to add parameters to body (if that's not disabled)
                if (options.headers && options.addQueryParamsToBody === true) {
                    let contentType;

                    try {
                        contentType = new Headers(options.headers).get('Content-Type');
                    }
                    catch {
                        // Headers constructor may be blocked (e.g. Salesforce Locker Service)
                        contentType = options.headers['Content-Type'] || options.headers['content-type'];
                    }

                    let bodyClass;

                    switch (contentType) {
                        case 'application/x-www-form-urlencoded':
                            bodyClass = URLSearchParams;
                            break;

                        case 'multipart/form-data':
                            bodyClass = FormData;
                            break;
                    }

                    // if that's one of supported content types
                    if (bodyClass) {
                        const body = options.body || (options.body = new bodyClass());

                        // put parameters to body if it's of supported type
                        if (body instanceof bodyClass) {
                            params.forEach(([key, value]) => body.set(key, value));
                            // remember parameters are already added
                            paramsAdded = true;
                        }
                    }
                }

                // if parameters are not added yet append them to the query string
                if (!paramsAdded) {
                    url += (url.includes('?') ? '&' : '?') + params.map(([param, value]) =>
                        `${param}=${encodeURIComponent(value)}`
                    ).join('&');
                }
            }
        }
        //<debug>
        if (url.match(/\W(undefined|null)\W|\W(undefined|null)$|\[object/)) {
            throw new Error('Incorrect URL: ' + url);
        }
        //</debug>

        // Promise that will be resolved either when network request is finished or when json is parsed
        const { promise } = FunctionHelper.abortablePromise((resolve, reject) => {
            fetch(url, options).then(
                response => {
                    if (options.parseJson) {
                        response.json().then(json => {
                            response.parsedJson = json;
                            resolve(response);
                        }).catch(error => {
                            response.parsedJson = null;
                            response.error = error;

                            reject(response);
                        });
                    }
                    else {
                        resolve(response);
                    }
                }
            ).catch(error => {
                error.stack = promise.stack;

                reject(error);
            });
        }, controller);

        promise.stack = new Error().stack;

        promise.abort = function() {
            controller?.abort(new DOMException('User aborted request', 'AbortError'));
            this.aborted = true;
        };

        return promise;
    }

    /**
     * Registers the passed URL to return the passed mocked up Fetch Response object to the
     * AjaxHelper's promise resolve function.
     *
     * Register a mock endpoint that returns a text body, then read it back from the {@link #typedef-AjaxResponse}
     * via `responseText`:
     *
     * ```javascript
     * AjaxHelper.mockUrl('api/greeting', (url, params) => ({
     *     responseText : `Hello ${params.name}!`
     * }));
     *
     * const response = await AjaxHelper.get('api/greeting?name=Linda');
     * console.log(response.responseText); // 'Hello Linda!'
     * ```
     *
     * @param {String} url The url to return mock data for
     * @param {Object|Function} response A mocked up Fetch Response object which must contain at least a `responseText` property,
     *   or a function to which the `url` and a `params` object, and the `Fetch` `options` object is passed which returns that
     * @param {String} [response.url] Fetch url
     * @param {String} [response.responseText] The data to return
     * @param {Object} [response.params] Params data
     * @param {Boolean} [response.synchronous] resolve the Promise immediately
     * @param {Number} [response.delay=100] resolve the Promise after this number of milliseconds.
     * @param {Object} [response.returns] Response data object
     */
    static mockUrl(url, response) {
        const me = this;

        (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response;

        // Inject the override into the AjaxHelper instance
        if (!AjaxHelper.originalFetch) {
            AjaxHelper.originalFetch = AjaxHelper.fetch;
            AjaxHelper.fetch = me.mockAjaxFetch.bind(me);
        }
    }

    static mockAjaxFetch(url, options) {
        const
            urlAndParams = url.split('?'),
            result       = this.mockAjaxMap[urlAndParams[0]];

        if (!result) {
            return AjaxHelper.originalFetch(url, options);
        }

        // Uses FunctionHelper.abortablePromise instead of attaching `abort` to a plain Promise, which gets
        // stripped if the Promise is ever rewrapped (e.g. by an `async` function or `.then()` chain).
        const { promise, controller } = FunctionHelper.abortablePromise((resolve, reject, signal) => {
            let delayTimer;

            signal.addEventListener('abort', () => clearTimeout(delayTimer));

            const settle = response => {
                let parsedJson = null;

                try {
                    parsedJson = options?.parseJson && JSON.parse(response.responseText);
                }
                catch (error) {
                    parsedJson     = null;
                    response.error = error;
                }

                response = {
                    status     : 200,
                    ok         : true,
                    headers    : new Headers(),
                    statusText : 'OK',
                    url,
                    parsedJson,
                    text       : () => Promise.resolve(response.responseText),
                    json       : () => Promise.resolve(parsedJson),
                    ...response
                };

                if (response.synchronous) {
                    resolve(response);
                }
                else {
                    delayTimer = setTimeout(() => resolve(response), ('delay' in response ? response.delay : 100));
                }
            };

            if (typeof result === 'function') {
                Promise.resolve(result(urlAndParams[0], urlAndParams[1] && parseParams(urlAndParams[1]), options))
                    .then(settle, reject);
            }
            else {
                settle(result);
            }
        }, options?.abortController);

        // Forward a bare `signal` passed without `abortController` (e.g. AIAudioController.speak())
        const externalSignal = options?.signal;

        if (externalSignal && externalSignal !== controller.signal) {
            if (externalSignal.aborted) {
                controller.abort(externalSignal.reason);
            }
            else {
                externalSignal.addEventListener('abort', () => controller.abort(externalSignal.reason));
            }
        }

        // Keep API in parallel with real AjaxHelper.fetch
        promise.abort = function() {
            controller.abort(new DOMException('User aborted request', 'AbortError'));
            this.aborted = true;
        };

        return promise;
    }
}
