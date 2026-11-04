import Base from '../Base.js';
import StringHelper from '../helper/StringHelper.js';
import Events from './Events.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/mixin/Clipboardable
 */

/**
 * This class is used internally in Clipboardable to create a shared clipboard that can be used from multiple instances
 * of different widgets.
 *
 * Can read and write to native Clipboard API if allowed, but always holds a local `clipboard` as a fallback.
 * @extends Core/Base
 * @mixes Core/mixin/Events
 * @private
 */
class Clipboard extends Base.mixin(Events) {

    // Defaults to true, so to set this lazy on first read/write
    hasNativeAccess = true;
    _content = null;

    /**
     * Write to the native Clipboard API or a local clipboard as a fallback.
     * @param {String} text Only allows string values
     * @param {Boolean} allowNative `true` will try writing to the Clipboard API once
     * @private
     */
    async writeText(text, allowNative) {
        const
            me           = this,
            { _content } = me;

        if (allowNative && me.hasNativeAccess) {
            try {
                await navigator.clipboard.writeText(text);
            }
            catch {
                me.hasNativeAccess = false;
            }
        }
        if (_content !== text) {
            // Always writes to local clipboard
            me._content = text;
            me.triggerContentChange(_content, false, true);
        }
    }

    /**
     * Writes any data to the local shared clipboard.
     * @param {Object} data
     * @param {String} source source name
     * @private
     */
    writeData(data, source) {
        this._dataContent   = data;
        this._contentSource = source;
    }

    /**
     * Reads from the native Clipboard API or a local clipboard as a fallback.
     * @param {Boolean} allowNative `true` will try reading from the Clipboard API once
     * @private
     */
    async readText(allowNative) {
        const
            me           = this,
            { _content } = me;

        if (allowNative && me.hasNativeAccess) {
            try {
                const text = await navigator.clipboard.readText();

                // If the text don't match what we've previously written (external data)
                if (_content !== text) {
                    me._content     = text;
                    me._dataContent = me._contentSource = null;
                    me.triggerContentChange(_content, true);
                }
                return text;
            }
            catch {
                me.hasNativeAccess = false;
            }
        }
        return _content;
    }

    /**
     * Reads any data from the local shared clipboard.
     * @param {Array<String>} allowedSources Array of source names which is supported
     * @private
     */
    readData(allowedSources) {
        if (allowedSources && !ArrayHelper.asArray(allowedSources).includes(this._contentSource)) {
            return;
        }

        return this._dataContent;
    }

    /**
     * Call this to let other instances know that data has been pasted
     * @param {Object} source
     */
    triggerPaste(source) {
        this.trigger('paste', { source, text : this._content });
    }

    triggerContentChange(oldText, fromRead = false, fromWrite = false) {
        this.trigger('contentChange', { fromRead, fromWrite, oldText, newText : this._content });
    }

    async clear(allowNative) {
        await this.writeText('', allowNative);
        this.writeData(null);
    }

}

/**
 * Mixin that provides clipboard read/write capabilities to widgets. It manages a shared clipboard instance that can
 * optionally use the native Clipboard API with a local fallback, enabling copy/paste workflows across widgets.
 *
 * ```javascript
 * // Write to clipboard
 * await widget.clipboard.writeText('Hello world', true); // true = try native API
 *
 * // Read from clipboard
 * const text = await widget.clipboard.readText(true);
 * ```
 *
 * ## See also
 *
 * - {@link Core.mixin.Events} - Event handling mixin
 *
 * @mixin
 */
export default Target => class Clipboardable extends (Target || Base) {

    static $name = 'Clipboardable';

    static configurable = {

        /**
         * Set this to `true` to use native Clipboard API if it is available
         * @config {Boolean}
         * @default
         * @private
         */
        useNativeClipboard : false,

        /**
         * Configure which sources $$name this class allows pasting model data from. Accepts string or array.
         * Unspecified accepts all. If source is not accepted, it will try to use the string value instead.
         * @config {String|Array<String>}
         * @private
         */
        allowedDataSources : null
    };

    construct(...args) {
        super.construct(...args);

        if (!globalThis.bryntum.clipboard) {
            globalThis.bryntum.clipboard = new Clipboard();
        }

        globalThis.bryntum.clipboard.ion({
            paste         : 'onClipboardPaste',
            contentChange : 'onClipboardContentChange',
            thisObj       : this
        });
    }

    /**
     * Gets the current shared Clipboard instance
     * @member {Object}
     * @readonly
     * @private
     */
    get clipboard() {
        return globalThis.bryntum.clipboard;
    }

    // Called when someone triggers a paste event on the shared Clipboard
    onClipboardPaste({ text, source }) {
        const
            me                       = this,
            { clipboardText, isCut } = me,
            isOwn                    = me.compareClipboardText(clipboardText, text);

        // If "my" data has been pasted somewhere
        if (isOwn && isCut) {
            // Hook to be able to handle data that has been cut out. Remove for example.
            me.handleCutData?.({ text, source });
            me.isCut   = false;
            me.cutData = null;
        }
        // If any data other data has been pasted, clear "my" clipboard
        else if (!isOwn) {
            me.clearClipboard(false);
        }
    }

    // Calls when the shared clipboard writes or reads a new string value
    onClipboardContentChange({ newText }) {
        // If clipboard has new data, clear "my" clipboard
        if (!this.compareClipboardText(this.clipboardText, newText)) {
            this.clearClipboard(false);
        }
    }

    // When a cut is done, or a cut is deactivated
    set cutData(data) {
        const me = this;

        // Call hook for each current item in data
        me._cutData?.forEach(r => me.setIsCut(r, false));
        // Set and call again for new data
        me._cutData = ArrayHelper.asArray(data);
        me._cutData?.forEach(r => me.setIsCut(r, true));
    }

    get cutData() {
        return this._cutData;
    }

    /**
     * Writes string data to the shared/native clipboard. Also saves a local copy of the string and the unconverted
     * data.
     *
     * But firstly, it will call beforeCopy function and wait for a response. If false, the copy will be prevented.
     *
     * @param {Object} data
     * @param {Boolean} isCut
     * @param {Object} [params] Will be passed to beforeCopy function
     * @returns {Object} Object containing the original data, cloned data and the string that was written to the
     * clipboard
     * @private
     */
    async writeToClipboard(data, isCut, params = {}) {
        // Hook to be able to send event for example
        if (await this.beforeCopy({ data, isCut, ...params }) === false) {
            return;
        }

        const
            me         = this,
            isString   = typeof data === 'string',
            stringData = isString
                // If data is string, use that
                ? data
                // If not, and there is a stringConverter, use that. Otherwise, just encode it as JSON
                : (me.stringConverter ? await me.stringConverter(data) : StringHelper.safeJsonStringify(data)),
            clonedData = isString
                // If data is string, use that
                ? stringData
                // If not, and there is cloneData function, use that. Otherwise, use ObjectHelper.
                : (me.cloneData ? me.cloneData({ data, stringData, isPaste : false, isCut }) : ObjectHelper.clone(data));

        // This must be before calling the clipboard, as to be able to ignore this change in onClipboardContentChange
        me.clipboardText = stringData;

        // Writes the cloned data to the internal shared clipboard
        me.clipboard.writeData(clonedData, me.$$name);

        // Writes the string data to the native (or internal) clipboard.
        await me.clipboard.writeText(stringData, me.useNativeClipboard);

        // Saves a "local" reference to the cloned data
        me.clipboardData = clonedData;
        // And a reference to the original data
        me.originalData  = data;
        me.isCut         = isCut;
        // Saves a local reference to cut out original data
        me.cutData       = isCut && !isString ? data : null;

        return {
            data         : isCut ? data : clonedData,
            clonedData,
            originalData : data,
            stringData
        };
    }

    /**
     * Reads string data from the shared/native clipboard. If string matches current instance local clipboard data, a
     * non-modified version will be return. Otherwise, a stringParser function will be called.
     *
     * But firstly, it will call beforePaste function and wait for a response. If false, the paste will be prevented.
     *
     * This function will also trigger a paste event on the clipboard instance.
     *
     * @param {Object} [params] Will be passed to beforePaste function
     * @param {Boolean} [skipPasteTrigger] Set to `true` not trigger a paste when paste completes
     * @returns {Object}
     * @private
     */
    async readFromClipboard(params = {}, skipPasteTrigger = false) {
        const
            me            = this,
            { clipboard } = me,
            text          = await clipboard.readText(me.useNativeClipboard),
            isOwn         = me.compareClipboardText(me.clipboardText, text),
            originalData  = isOwn ? me.originalData : [];
        // Reads data from the shared internal clipboard (if it's from an allowed source)
        let data          = clipboard.readData(me.allowedDataSources);

        if (!isOwn) {
            // If we got something from outside, clear our internal data as it is no longer valid
            me.clearClipboard(false);
        }

        // need to be here, because clearClipboard will set isCut = false if data don't match what we originally cut out
        const { isCut } = me;

        // if isCut, or no data, or data is text, transform text into data
        if (isCut || !data || data === text) {
            data = me.transformClipboardText(text);
        }

        // if the implemented class has a cloneData function, and we need to clone, call it
        if (data && !isCut && typeof data !== 'string' && me.cloneData) {
            data = me.cloneData({ data, isPaste : true });
        }

        if (data == null || (Array.isArray(data) && data.length === 0) ||
            // Hook to trigger event or something like that
            await me.beforePaste?.({ data, text, originalData, ...params, isCut, isOwn }) === false
        ) {
            return;
        }

        // Trigger a paste event on the shared clipboard, for other instances to listen to
        skipPasteTrigger || clipboard.triggerPaste(me);

        return { data, text, isOwn, isCut, originalData };
    }

    /**
     * Clears the clipboard data
     * @privateparam {Boolean} [clearShared] Set to `false` not to clear the internally shared and native clipboard
     * @category Common
     */
    async clearClipboard(clearShared = true) {
        const me = this;

        me.clipboardData = me.originalData = me.clipboardText = me.cutData = null;
        me.isCut = false;

        if (clearShared) {
            await me.clipboard.clear(me.useNativeClipboard);
        }
    }

    compareClipboardText(a, b) {
        const regex = /\r\n|(?!\r\n)[\n-\r\x85\u2028\u2029]/g;
        return a?.replace(regex, '\n') === b?.replace(regex, '\n');
    }

    /**
     * Takes a clipboard text and returns the parsed `data`
     * @param {String} text The text string that was read from the clipboard
     * @returns {Object}
     * @private
     */
    transformClipboardText(text) {
        const me = this;

        return me.compareClipboardText(me.clipboardText, text)
            // If internal copy-paste, use internal data
            ? (me.isCut ? me.originalData : me.clipboardData)
            // Otherwise, parse text data
            : (me.stringParser && text ? me.stringParser(text) : text);
    }

    /**
     * Checks local clipboard if there is clipboard data present. If native clipboard API is available, this function
     * will return `undefined`
     * @returns {Object}
     * @private
     */
    hasClipboardData() {
        const
            { clipboard } = this,
            { _content }  = clipboard;

        if (this.useNativeClipboard && clipboard.hasNativeAccess) {
            // The native clipboard contents cannot be inspected here
            return;
        }

        return Boolean(_content && this.transformClipboardText(_content));
    }

};
