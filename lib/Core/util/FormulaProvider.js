import Base from '../Base.js';
import Factoryable from '../mixin/Factoryable.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import AjaxHelper from '../helper/AjaxHelper.js';
import Events from '../mixin/Events.js';

/**
 * @module Core/util/FormulaProvider
 */

const
    classNameRE       = /^([A-Z]+)(?:F|f)ormula/,
    allMatchRE        = /^(.*)$/,
    specialFieldNames = {
        this : 1,
        data : 1
    },
    recordToObject    = record => record.fields?.reduce((a, f) => {
        if (f.persist) {
            const v = record.get(f.name);
            if (v) {
                a[f.name] = String(record.get(f.name));
            }
        }
        return a;
    }, {});

/**
 * Base class for formula providers which are classes which may be attached to an {@link #config-inputField} and
 * configured with a {@link #config-record} from which it will pull the values of fields references by `$fieldName`
 * in any evaluated formula typed into the {@link #config-inputField}.
 *
 * A {@link #config-inputField} may be configured with an {@link Core.widget.TextField#config-dataField}. The referenced
 * {@link Core.data.field.DataField} may itself be configured with a {@link Core.data.field.DataField#config-formulaProviders}
 * object which maps formula provider prefixes to configuration objects. When the {@link #config-inputField} is mutated,
 * if it starts with `=<prefix>(` then a {@link Core.util.FormulaProvider} registered under that prefix will be instantiated
 * and used to evaluate the input value upon change (which fires on blur).
 *
 * They may also be configured with a {@link #config-store} which is used when the `$data` token is used in a formula
 * to represent the JSON string of the whole dataset.
 *
 * By default, a formula will be evaluated by passing it to the configured {@link #config-url} as
 * the {@link #config-paramName} parameter in a POST request. The response will be expected to be a JSON
 * object from which the value of the {@link #config-responseField} will be used as the result of the formula.
 *
 * An implementation may provide a {@link #config-generateContent} callback which accepts the input
 * field's formula value with referenced record field names substituted in. The `generateContent`
 * callback must return a value based on that string.
 *
 * An implementation may monitor the input field, and upon change, may use the field's value, and its
 * {@link #property-record} to calculate a new value in its {@link #config-handleFormulaChange} method.
 *
 * The value passed to {@link #config-handleFormulaChange} has the following substitutions made:
 *
 *  - `$fieldName` tokens replaced by the value of the named field from the configured {@link #property-record}
 *  - `$this` token replaced by a JSON representation of the string values of the {@link #property-record}
 *  - `$data` token replaced by a JSON representation of all records in the configured {@link #config-store}
 *
 * An implementation *may* implement a {@link #config-handleFormulaInput} method to be notified upon any mutation of its
 * {@link #config-inputField}.
 *
 * ## Data Fields and Formula Providers
 *
 * When updating a DataField that contains a formula, a special sibling {@link Core.data.field.DataField} is created
 * to store the formula.
 *
 * ```javascript
 * export default class Product extends Model {
 *     static fields = [
 *         'name',
 *         {
 *              name             : 'seoDescription',
 *              formulaProviders : {
 *                  AI   : {
 *                      url  : './myAIServerEndpoint.php',
 *                  }
 *              }
 *          }
 *     ];
 * });
 *
 * const myModel = new Product({
 *     name : 'FitPro Adjustable Dumbbells'
 * });
 *
 * // Setting a formula value of the field which has a formulaProvider will automatically trigger a call to the `url`
 * // from the formulaProvider to get the result, which is then stored in the `seoDescription` data field. The formula
 * // is then stored in the sibling field prepended with a '#'.
 * myProduct.set('seoDescription', '=AI(Generate 10 word SEO description for $name)');
 * ```
 *
 * When you persist a Model with a formula field, the formula field is stored as a sibling field to the formula field.
 * The serialized JSON of a record having a `seoDescription` formula field would look like this:
 *
 * ```json
 *  {
 *     "brand"           : "FitPro",
 *     "seoDescription"  : "Compact, versatile adjustable dumbbells for efficient home strength training workouts.",
 *     "#seoDescription" : "=AI(Generate 10 word SEO description for $name)",
 *   }
 * ```
 *
 * ## See also
 *
 * - {@link Core.data.field.DataField} - Data field class with formula provider support
 * - {@link Core.widget.TextField} - Input field that triggers formula evaluation
 *
 * @extends Core/Base
 * @mixes Core/mixin/Events
 * @classtype formula
 */
export default class FormulaProvider extends Base.mixin(Factoryable, Events) {
    static $name = 'FormulaProvider';
    static type = 'formula';

    static configurable = {
        callOnFunctions : true,

        /**
         * The Record from which this formula provider fetches field definitions and values
         * @prp {Core.data.Model}
         */
        record : null,

        /**
         * The store from which this formula provider fetches field definitions. Defaults to the {@link #config-record}'s first store.
         * @config {Core.data.Store} [store]
         */
        store : null,

        /**
         * The input field which provides the formula.
         *
         * This field becomes this object's `owner`, so that it can be used as the `thisObj` for callbacks.
         *
         * If this `FormulaProvider` was created from a known `type`, for example the input field was configured
         * with
         *
         * ```javascript
         *     formulaConfig : {
         *         type   : 'aiformula',
         *         url    : 'https://aimodule.com/',
         *         apiKey : 'XXXXXXX'
         *     }
         * ```
         *
         * then the field value is taken to *always* represent a formula, and the entire string is used
         * when passing the formula to {@link #config-handleFormulaChange}.
         *
         * If this `FormulaProvider` was inferred from the {@link #property-inputField}'s value starting with
         * a formula prefix (eg `=AI(`), then the string *between the parentheses* is used
         * and {@link #config-handleFormulaChange} is only called if the value matches eg `=AI(.*)`.
         *
         *  - `$fieldName` tokens replaced by the value of the named field from the configured {@link #property-record}
         *  - `$this` token replaced by a JSON representation of the string values of the {@link #property-record}
         *  - `$data` token replaced by a JSON representation of all records in the configured {@link #config-store}
         *
         * @prp {Core.widget.TextField}
         */
        inputField : {
            $config : 'nullify',
            value   : null
        },

        /**
         * A function or the name of a function in the ownership hierarchy to execute when the
         * {@link #property-inputField} is mutated by any means such as typing or pasting.
         * @prp {Function|String}
         * @param {Core.util.FormulaProvider} formulaProvider This FormulaProvider
         * @param {Core.widget.Field} inputField The input field being used
         * @returns {void}
         * @internal
         */
        handleFormulaInput : null,

        /**
         * A function or the name of a function in the ownership hierarchy to execute when
         * the input field fires its `change` event which is usually on blur.
         * @prp {Function|String}
         * @param {Core.util.FormulaProvider} formulaProvider This FormulaProvider
         * @param {String} formula The content of the typed formula with the following token substitutions made:
         *  - `$fieldName` tokens replaced by the value of the named field from the configured {@link #property-record}
         *  - `$this` token replaced by a JSON representation of the string values of the {@link #property-record}
         *  - `$data` token replaced by a JSON representation of all records in the configured {@link #config-store}
         * @param {Core.widget.Field} inputField The input field being used
         * @returns {void}
         * @internal
         */
        handleFormulaChange : null,

        /**
         * The URL to which the formula will be sent for evaluation in a JSON packet in
         * a property named by {@link #config-paramName}.
         *
         * The response is expected to be a JSON object from which the value of the
         * {@link #config-responseField} will be used as the result of the formula.
         *
         * ```json
         * {
         *   "content" : "Hello World!"
         * }
         * ```
         *
         * @prp {String}
         */
        url : null,

        /**
         * The HTTP method to use when sending the formula to the server.
         * @prp {String}
         * @default
         */
        method : 'POST',

        /**
         * An object containing the Fetch options to pass to the server request. Use this to control if
         * credentials are sent and other options, read more at
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
         * @config {FetchOptions}
         */
        fetchOptions : null,

        /**
         * The name of the property in the JSON object sent to the server which contains the formula.
         *
         * It may be a dot-separated path to inject a nested value.
         * @prp {String}
         * @default
         */
        paramName : 'prompt',

        /**
         * The name of the property in the JSON object received from the server which contains the result of the formula.
         *
         * It may be a dot-separated path to a nested value.
         *
         * Expected response format with the default value for this property ("content"):
         * ```json
         * {
         *   "content" : "Hello World!"
         * }
         * ```
         *
         * @prp {String}
         * @default
         */
        responseField : 'content',

        /**
         * The headers to send with the request.
         * @prp {Object}
         * @default
         */
        headers : {
            Accept         : 'application/json',
            'Content-Type' : 'application/json'
        },

        /**
         * A function or the name of a function in the ownership hierarchy which, when passed
         * a fully constructed formula, yields the result.
         *
         * Inject an implementation if the result is calculated programmatically or from a local
         * source instead of being generated by a remote server via the {@link #property-url}.
         * @prp {Function|String}
         * @param {String} formula The formula source
         * @returns {String} The result of the formula
         * @internal
         */
        generateContent : null,

        // Optional prefix if FormulaProvider instantiated.
        prefix : null
    };

    static factoryable = {
        defaultType : 'formula'
    };

    fieldMatchRE = /\$([a-zA-Z\-_]+)/g;
    fieldDelimiterRE = /[^a-zA-Z\-$_]/;

    changeHeaders(headers) {
        // Headers has to be shallow
        return ObjectHelper.clone(headers);
    }

    updateInputField(inputField, was) {
        this.inputListenerRemover?.();

        if (inputField) {
            this.inputListenerRemover = inputField.ion({
                thisObj : this,
                input   : 'onFieldInput',
                change  : 'onFieldChange'
            });
        }
        return this.owner = inputField;
    }

    onFieldInput() {
        const
            me             = this,
            { inputField } = me,
            modelClass     = me.store?.modelClass || (me.record || inputField.record).constructor,
            fieldNames     = me.fieldNames || (me.fieldNames = Object.keys(specialFieldNames).concat(Object.keys(modelClass.fieldMap)));

        if (inputField.formulaProvider === me) {
            // Show the field picker and call the handleFormulaInput callback.
            const
                currentToken = inputField.getCurrentToken(me.fieldDelimiterRE)?.token,
                currentField = currentToken?.startsWith('$') ? currentToken.substring(1) : null,
                nonMatches = inputField.value.matchAll(me.fieldMatchRE)?.reduce?.((v, [, m]) => {
                    // Every $xxx token must match a field name or this (meaning the whole record) or data meaning the whole store
                    // If user is in the process of typing a field name, check using startsWith
                    if (m === currentField) {
                        if (!fieldNames.some(n => n.startsWith(m))) {
                            v.push(m);
                        }
                    }
                    else if (!specialFieldNames[m] && !modelClass.fieldMap[m]) {
                        v.push(m);
                    }
                    return v;
                }, []);

            // If any $xxx tokens did not match field names, show error
            if (nonMatches?.length) {
                inputField.setError(`Undefined data field(s) ${nonMatches.join(',')}`, false, true);
            }
            else {
                inputField.clearError();
            }

            const handleFormulaInput = me.resolveCallback(me.handleFormulaInput, me, false);

            // Subclasses may implement handleFormulaInput
            handleFormulaInput?.handler.call(handleFormulaInput.thisObj, inputField, this);
        }
    }

    /**
     * Called when the {@link #config-inputField} fires its change event.
     *
     * If this `FormulaProvider` was created from an explicit `type`, or the value matches a formula format, then a
     * formula value is created from the {@link #property-inputField} value with the following substitutions made:
     *
     *  - `$fieldName` tokens replaced by the value of the named field from the configured {@link #property-record}
     *  - `$this` token replaced by a JSON representation of the string values of the {@link #property-record}
     *  - `$data` token replaced by a JSON representation of all records in the configured {@link #config-store}
     *
     * The resulting string is passed to the {@link #config-handleFormulaChange} callback.
     *
     * This may be called to trigger the change processing at any time. For instance if the record is mutated, the
     * app may wish to cause the change processing to execute.
     * @internal
     */
    onFieldChange() {
        const
            me                  = this,
            { inputField }      = me,
            { value }           = inputField,
            formulaSource       = me.formulaRE ? value.trim().match(me.formulaRE || me.constructor.formulaRE || allMatchRE)?.[1] : value,
            handleFormulaChange = me.resolveCallback(me.handleFormulaChange, me, false);

        // This is where we replace $tokens in the input string with the data from
        // our Record.
        // <remove-on-release>
        // TODO: Syntax to refer to fields or certain *records* in the Store.
        // </remove-on-release>
        if (formulaSource && handleFormulaChange) {
            const formula = me.createFormula(formulaSource, (me.record || inputField.record), me.store);

            // Subclasses may implement handleFormulaChange
            handleFormulaChange?.handler.call(handleFormulaChange.thisObj, me, formula, inputField);
        }
    }

    /**
     * Processes the passed prompt using the configured {@link #config-generateContent} or the configured
     * {@link #config-url} and returns the string result.
     *
     * Note that this is an `async` function and the return value will need to be `await`ed.
     * @param {String} prompt
     * @returns {String}
     * @async
     */
    async calculate(prompt) {
        return this.callback(this.generateContent, this, [prompt]);
    }

    updatePrefix(prefix) {
        this.formulaRE = new RegExp(`^=${prefix}\\((.+)\\)$`);
    }

    updateUrl(url) {
        this.generateContent = url ? this.getRemoteContent : null;
    }

    async getRemoteContent(prompt) {
        let result;

        // Extract formula text, =AI(Hello) -> Hello
        // Note, backend seems to accept the formula as is, so no need to extract it currently
        // prompt = forumlaTextRE.exec(prompt)?.[1] ?? prompt;

        try {
            const
                me                  = this,
                { method, headers } = me,
                body                = {
                    ...me.body
                };

            ObjectHelper.setPath(body, me.paramName, prompt);

            const response = await AjaxHelper.fetch(me.url, ObjectHelper.assign({
                credentials : undefined,
                method,
                headers,
                body        : JSON.stringify(body)
            }, me.fetchOptions));

            if (!response.ok) {
                /**
                 * Fires when the network request to the server fails.
                 *
                 * This event bubbles, so can be caught on the FormulaProvider instance, its owning inputField
                 * or any parent widget.
                 *
                 * When this error occurs, the formula result will be an empty string.
                 * @param {Response} response The response object from the failed request.
                 * @event formulaNetworkError
                 */
                me.trigger('formulaNetworkError', {
                    response,
                    bubbles : true
                });
                return '';
            }

            result = await response.json();
        }
        catch (error) {
            console.error('Error:', error);
        }
        return ObjectHelper.getPath(result, this.responseField);
    }

    createFormula(formulaSource, record, store) {
        const event = {
            formula : formulaSource.replaceAll(this.fieldMatchRE, (_, fieldName) => {
                switch (fieldName) {
                    case 'this':
                        return JSON.stringify(recordToObject(record));
                    case 'data':
                        return JSON.stringify(store.allRecords.map(r => recordToObject(r)));
                    default:
                        return record.get(fieldName) ?? '';
                }
            })
        };

        /**
         * Fires when the formula source has been processed and is about to be used.
         *
         * Referenced cell values have been substituted in.
         *
         * A handler may change the `formula` property of the event object to modify the
         * formula before it is used.
         * @event formulaChange
         * @param {String} formula The formula to be used. Replace this to change the formula.
         */
        this.trigger('formulaChange', event);

        return event.formula;
    }

    get store() {
        return this._store || this.record?.firstStore;
    }

    static get(prefix, config) {
        let result = this.map?.get(prefix);

        if (result && config) {
            result = new result(config);
        }
        return result;
    }

    static initClass() {
        const
            fp = FormulaProvider,
            me = this,

            // Cut out "AI" from "AIFormula", "PLAN" from "PLANFormula" etc, or use declared prefix.
            formulaPrefix = me === fp ? 'FORMULA' : me.$name?.match(classNameRE)?.[1] || me.formulaPrefix;

        if (formulaPrefix) {
            if (!me.formulaPrefix) {
                me.formulaPrefix = formulaPrefix;
            }
            // eg /^=AI\(/
            me.inputPrefixRE = new RegExp(`^=${formulaPrefix}\\(.*`);

            // eg: /^=AI(Respond to $review)/
            me.formulaRE = new RegExp(`^=${formulaPrefix}\\((.+)\\)`);

            (fp.map || (fp.map = new Map())).set(formulaPrefix, me);

            const allKeys = [...fp.map.keys()].map(k => k).join('|');

            // Create a RegExp which will match =<anyPrefix>(
            fp.inputPrefixRE = new RegExp(`^=(${allKeys})\\(.*`);
        }

        return super.initClass();
    }
}

FormulaProvider.initClass();
