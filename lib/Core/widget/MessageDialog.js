import Popup from './Popup.js';
import './Button.js';
import './TextField.js';
import Widget from './Widget.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import DomHelper from '../helper/DomHelper.js';

DomHelper.loadStylesheet('Core/widget/MessageDialog.css');

// import Stylesheet from './MessageDialog.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'MessageDialog');

/**
 * @module Core/widget/MessageDialog
 */

/**
 * Result object yielded by the {@link Core.widget.MessageDialog#function-prompt} Promise.
 * @typedef {Object} MessageDialogPromptResult
 * @property {Number} button The identifier of the button that was pressed
 *   ({@link Core.widget.MessageDialog#property-okButton} or {@link Core.widget.MessageDialog#property-cancelButton}).
 * @property {String} text The text entered by the user in the text field.
 */

const items = [
    {
        ref     : 'cancelButton',
        cls     : 'b-message-dialog-cancel-button',
        text    : 'L{Object.Cancel}',
        onClick : 'up.onCancelClick'
    },
    {
        ref       : 'okButton',
        cls       : 'b-message-dialog-ok-button',
        rendition : 'filled',
        text      : 'L{Object.Ok}',
        onClick   : 'up.onOkClick'
    }
];

// Windows has OK button to the left, Mac / Ubuntu to the right
if (BrowserHelper.isWindows) {
    items.reverse();
}

class MessageDialogConstructor extends Popup {

    static $name = 'MessageDialog';

    static type = 'messagedialog';

    static configurable = {
        ui          : 'plain',
        centered    : true,
        modal       : true,
        hidden      : true,
        autoShow    : false,
        closeAction : 'hide',
        title       : '\xa0',

        lazyItems : {
            $config : ['lazy'],
            value   : [{
                cls : 'b-message-dialog-message',
                ref : 'message'
            }, {
                type : 'textfield',
                cls  : 'b-message-dialog-input',
                ref  : 'input'
            }]
        },

        showClass : null,

        bbar : {
            overflow : null,
            items
        }
    };

    construct(...args) {
        /**
         * The enum value for the OK button
         * @member {Number} okButton
         * @readonly
         */
        this.okButton = this.yesButton = 1;

        /**
         * The enum value for the Cancel button
         * @member {Number} cancelButton
         * @readonly
         */
        this.cancelButton = 3;

        super.construct(...args);
    }

    // Protect from queryAll -> destroy
    destroy() {}

    /**
     * Shows a confirm dialog with "Ok" and "Cancel" buttons. The returned promise resolves passing the button identifier
     * of the button that was pressed ({@link #property-okButton} or {@link #property-cancelButton}).
     * @function confirm
     * @param {Object} options An options object for what to show.
     * @param {Boolean} [options.modal=true] Set to `false` to not have the dialog be modal
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String} [options.rootElement] The root element of this widget, defaults to document.body. Use this
     * if you use the MessageDialog inside a web component ShadowRoot
     * @param {String|ButtonConfig} [options.cancelButton] A text or a config object to apply to the Cancel button.
     * @param {String|ButtonConfig} [options.okButton] A text or config object to apply to the OK button.
     * @param {AlignSpec|String} [options.align] Align the dialog to a target instead of centering it.
     * @returns {Promise} A promise which is resolved when the dialog is closed
     * @ts-returns {Promise<Number>}
     */
    async confirm(...args) {
        return this.showDialog('confirm', ...args);
    }

    /**
     * Shows an alert popup with a message. The returned promise resolves when the button is clicked.
     * @function alert
     * @param {Object} options An options object for what to show.
     * @param {Boolean} [options.modal=true] Set to `false` to not have the dialog be modal
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String} [options.rootElement] The root element of this widget, defaults to document.body. Use this
     * if you use the MessageDialog inside a web component ShadowRoot
     * @param {String|ButtonConfig} [options.okButton] A text or config object to apply to the OK button.
     * @param {AlignSpec|String} [options.align] Align the dialog to a target instead of centering it.
     * @returns {Promise} A promise which is resolved when the dialog is closed
     * @ts-returns {Promise<void>}
     */
    async alert(...args) {
        return this.showDialog('alert', ...args);
    }

    /**
     * Shows a popup with a basic {@link Core.widget.TextField} along with a message. The returned promise resolves when
     * the dialog is closed and yields an Object with a `button` ({@link #property-okButton} or {@link #property-cancelButton})
     * and a `text` property with the text the user provided
     * @function prompt
     * @param {Object} options An options object for what to show.
     * @param {Boolean} [options.modal=true] Set to `false` to not have the dialog be modal
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String} [options.rootElement] The root element of this widget, defaults to document.body. Use this
     * if you use the MessageDialog inside a web component ShadowRoot
     * @param {TextFieldConfig} [options.textField] A config object to apply to the TextField.
     * @param {String|ButtonConfig} [options.cancelButton] A text or a config object to apply to the Cancel button.
     * @param {String|ButtonConfig} [options.okButton] A text or config object to apply to the OK button.
     * @param {AlignSpec|String} [options.align] Align the dialog to a target instead of centering it.
     * @returns {Promise} A promise which is resolved when the dialog is closed. The promise yields an Object with
     * a `button` ({@link #property-okButton} or {@link #property-cancelButton}) and a `text` property with the text the
     * user provided
     * @ts-returns {Promise<MessageDialogPromptResult>}
     */
    async prompt({
        textField
    }) {
        const field = this.widgetMap.input;

        Widget.reconfigure(field, textField);
        field.value = textField?.value;

        return this.showDialog('prompt', ...arguments);
    }

    showDialog(mode, {
        message = '',
        title = '',
        cancelButton,
        okButton,
        align,
        modal,
        rootElement = document.body
    }) {
        const me = this;

        me.rootElement = rootElement;

        // Ensure our child items are instanced
        me.getConfig('lazyItems');

        me.title = me.optionalL(title);
        me.widgetMap.message.html = me.optionalL(message);
        me.showClass = `b-message-dialog-${mode}`;

        me.modal = typeof modal === 'boolean' ? modal : true;
        me.centered = !align;

        // Normalize string input to config object
        if (okButton) {
            okButton = typeof okButton === 'string' ? { text : okButton } : okButton;
        }

        if (cancelButton) {
            cancelButton = typeof cancelButton === 'string' ? { text : cancelButton } : cancelButton;
        }

        // Ensure default configs are applied
        okButton = { ...me.widgetMap.okButton.initialConfig, ...okButton };
        cancelButton = { ...me.widgetMap.cancelButton.initialConfig, ...cancelButton };

        // Ensure strings are localized
        okButton.text = me.optionalL(okButton.text);
        cancelButton.text = me.optionalL(cancelButton.text);

        Widget.reconfigure(me.widgetMap.okButton, okButton);
        Widget.reconfigure(me.widgetMap.cancelButton, cancelButton);

        me.show({ align });

        return me.promise = new Promise(resolve => {
            me.resolve = resolve;
        });
    }

    show(...args) {
        const activeElement = DomHelper.getActiveElement(this.element);

        // So that when we focus, we don't close an autoClose popup, but temporarily become
        // part of its ownership tree.
        this.owner = this.element.contains(activeElement) ? null : MessageDialogConstructor.fromElement(document.activeElement);

        return super.show(...args);
    }

    updateShowClass(showClass, oldShowClass) {
        const { classList } = this.element;

        if (oldShowClass) {
            classList.remove(oldShowClass);
        }
        if (showClass) {
            classList.add(showClass);
        }
    }

    doResolve(value) {
        const
            me          = this,
            { resolve } = me;

        if (resolve) {
            const isPrompt = me.showClass === 'b-message-dialog-prompt';

            if (isPrompt && value === me.okButton && !me.widgetMap.input.isValid) {
                return;
            }

            me.resolve = me.reject = me.promise = null;
            resolve(isPrompt ? {
                button : value,
                text   : me.widgetMap.input.value
            } : value);
            me.hide();
        }
    }

    onInternalKeyDown(event) {
        // Cancel on escape key
        if (event.key === 'Escape') {
            event.stopImmediatePropagation();
            this.onCancelClick();
        }
        else if (event.key === 'Enter' && !event.target.closest('.b-button')) {
            event.stopImmediatePropagation();
            event.preventDefault(); // Needed to not spill over into next MessageDialog if closing this opens another
            this.onOkClick();
        }
        super.onInternalKeyDown(event);
    }

    onOkClick() {
        this.doResolve(MessageDialog.okButton);
    }

    onCancelClick() {
        this.doResolve(MessageDialog.cancelButton);
    }
}

// Register this widget type with its Factory
MessageDialogConstructor.initClass();

// Instantiate MessgeDialog Widget on first use.
const MessageDialog = new Proxy({}, {
    get(target, prop) {
        const
            instance = target.instance || (target.instance = new MessageDialogConstructor({
                rootElement : document.body
            })),
            result   = instance[prop];

        return typeof result === 'function' ? result.bind(instance) : result;
    }
});

/**
 * A singleton class which shows common dialogs, similar to the native browser APIs (though these methods do not block the UI thread):
 * - {@link Core.widget.MessageDialog#function-confirm} shows a confirmation dialog with Ok / Cancel buttons
 * - {@link Core.widget.MessageDialog#function-alert} shows a dialog with a message
 * - {@link Core.widget.MessageDialog#function-prompt} shows a dialog with a text input field
 *
 * {@inlineexample Core/widget/MessageDialog.js}
 *
 * @class
 * @singleton
 * @extends Core/widget/Popup
 */
export default MessageDialog;
