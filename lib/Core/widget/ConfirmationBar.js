import BrowserHelper from '../helper/BrowserHelper.js';
import DomHelper from '../helper/DomHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import Toolbar from './Toolbar.js';

DomHelper.loadStylesheet('Core/widget/ConfirmationBar.css');

// import Stylesheet from './ConfirmationBar.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ConfirmationBar');

/**
 * @module Core/widget/ConfirmationBar
 */

const
    choices = ['ok', 'cancel', 'yes', 'no'].reduce((o, v, i, a) => {
        o[v] = Object.freeze({
            ...Object.fromEntries(a.map(k => [k, false])),
            name    : v,
            approve : 'ok,yes'.includes(v),
            [v]     : true
        });
        return o;
    }, Object.create(null)),
    defaultRendition = 'filled',
    nonDefaultRendition = 'text',
    defaultClasses = ['b-default'],
    nonDefaultClasses = ['b-non-default'],
    // Windows has OK button to the left, Mac / Ubuntu to the right
    okFirst = BrowserHelper.isWindows,
    splitRe = /(?:\s+,?|,)\s*/,
    widthyConfigs = /^(icon|menu|text)$/;

/**
 * A description of the chosen button in a {@link Core.widget.ConfirmationBar}.
 * @typedef {Object} ConfirmationBarChoice
 * @property {'ok'|'cancel'|'no'|'yes'} name The name of the chosen button.
 * @property {Boolean} approve Set to `true` when `name` is either `'ok'` or `'yes'`.
 * @property {Boolean} ok Set to `true` when `name` is `'ok'`.
 * @property {Boolean} cancel Set to `true` when `name` is `'cancel'`.
 * @property {Boolean} no Set to `true` when `name` is `'no'`.
 * @property {Boolean} yes Set to `true` when `name` is `'yes'`.
 */

/**
 * This widget is a `Toolbar` with default buttons for {@link #config-items} common to system dialogs. Button order
 * is appropriate for the platform. For example, on Windows, OK/Cancel buttons are presented in that order, while on
 * Mac OS X and many flavors of Linux, these buttons are presented in Cancel/OK order.
 *
 * {@inlineexample Core/widget/ConfirmationBar.js one-column}
 *
 * @extends Core/widget/Toolbar
 * @classtype confirmationbar
 */
export default class ConfirmationBar extends Toolbar {
    static $name = 'ConfirmationBar';
    static type = 'confirmationbar';    // Factoryable type name

    static configurable = {
        /**
         * The name of the default button. Must match with the defaults in {@link #config-namedItems}.
         * @prp {'cancel'|'ok'|'no'|'yes'}
         * @default
         */
        defaultButton : 'ok',

        defaultType : 'button',

        /**
         * In addition to normal form of {@link Core.widget.Container#config-items}, this class supports a comma-delimited
         * string.
         *
         * For example:
         * ```javascript
         *  items : 'ok,cancel',
         *  // or
         *  items : 'yes,no',
         * ```
         *
         * These are equivalent to:
         * ```javascript
         *  items : {
         *      ok     : true,
         *      cancel : true
         *  },
         *  // or
         *  items : {
         *      yes : true,
         *      no  : true
         *  },
         * ```
         * Both forms use the pre-defined buttons: `'cancel'`, `'ok'`, `'no'`, `'yes'`.
         *
         * @config {String|Object<String,ContainerItemConfig|MenuItemEntry>|Array<ContainerItemConfig|MenuItemEntry|Core.widget.Widget>}
         * @default
         */
        items : 'ok,cancel',

        /**
         * Maps <kbd>Enter</kbd> and <kbd>Escape</kbd> to {@link #function-doDefault} and {@link #function-doCancel}, respectively.
         * @config {Object<String,KeyMapConfig>}
         * @default
         */
        keyMap : {
            Enter       : 'doDefault',
            NumpadEnter : 'doDefault',
            Escape      : 'doCancel'
        },

        /**
         * The default buttons available for use in the {@link Core.widget.Container#config-items} config.
         * @config {Object<string,ContainerItemConfig>}
         * @default
         */
        namedItems : {
            yes : {
                cls     : 'b-yes-button',
                text    : 'L{Object.Yes}',
                onClick : 'up.onButtonClick',
                weight  : okFirst ? 100 : 130
            },

            no : {
                cls     : 'b-no-button',
                text    : 'L{Object.No}',
                onClick : 'up.onButtonClick',
                weight  : okFirst ? 110 : 120
            },

            ok : {
                cls     : 'b-ok-button',
                text    : 'L{Object.Ok}',
                onClick : 'up.onButtonClick',
                weight  : okFirst ? 120 : 110
            },

            cancel : {
                cls     : 'b-cancel-button',
                text    : 'L{Object.Cancel}',
                onClick : 'up.onButtonClick',
                weight  : okFirst ? 130 : 100
            }
        },

        /**
         * Set to `false` to disable synchronizing button widths. By default, buttons are assigned a `minWidth` based
         * on the longest {@link Core.widget.Button#config-text}. The default OK and Cancel buttons (in the en-US locale)
         * will be assigned `minWidth = '6em'`.
         * @prp {Boolean}
         * @default true
         */
        syncWidthButtons : null
    };

    static delayable = {
        syncButtons : {
            type      : 'raf',
            suspended : true  // suspended until initial paint
        }
    };

    get buttons() {
        return this.items.filter(it => it.isButton);
    }

    /**
     * Returns the `cancel` button if present in the {@link #config-items} config or `null` if not present.
     * @member {Core.widget.Button}
     * @readonly
     */
    get cancelButton() {
        return this.widgetMap.cancel || null;
    }

    /**
     * Returns the `no` button if present in the {@link #config-items} config or `null` if not present.
     * @member {Core.widget.Button}
     * @readonly
     */
    get noButton() {
        return this.widgetMap.no || null;
    }

    /**
     * Returns the `ok` button if present in the {@link #config-items} config or `null` if not present.
     * @member {Core.widget.Button}
     * @readonly
     */
    get okButton() {
        return this.widgetMap.ok || null;
    }

    /**
     * Returns the `yes` button if present in the {@link #config-items} config or `null` if not present.
     * @member {Core.widget.Button}
     * @readonly
     */
    get yesButton() {
        return this.widgetMap.yes || null;
    }

    changeItems(items, was) {
        if (typeof items === 'string') {
            items = Object.fromEntries(items.split(splitRe).map(k => [k, true]));
        }

        return super.changeItems(items, was);
    }

    clickButton(event, cancel) {
        const
            me = this,
            { widgetMap, defaultButton } = me;

        let button = cancel ? widgetMap.cancel || widgetMap.no : widgetMap[defaultButton],
            btn, key;

        if (!button) {
            for ([key, btn] of Object.entries(widgetMap)) {
                if (key !== defaultButton) {
                    button = btn;
                    break;
                }
            }
        }

        button?.onInternalClick(event);
    }

    /**
     * Called by the {@link #config-keyMap} to process <kbd>Escape</kbd>. This triggers a click from the first button in the
     * {@link #config-items} config that is present:
     *  - {@link #property-cancelButton}
     *  - {@link #property-noButton}
     *  - the first button that is not the {@link #config-defaultButton}
     * @param {Event} event The keyboard event
     * @internal
     */
    doCancel(event) {
        this.clickButton(event, true);
    }

    /**
     * Called by the {@link #config-keyMap} to process <kbd>Enter</kbd> or <kbd>NumpadEnter</kbd>. This triggers a click from the
     * {@link #config-defaultButton}.
     * @param {Event} event The keyboard event
     * @internal
     */
    doDefault(event) {
        this.clickButton(event);
    }

    onButtonClick(info) {
        /**
         * This event is fired when the user clicks one of the {@link Core.widget.ConfirmationBar#config-items buttons}.
         * @event choice
         * @param {ConfirmationBarChoice} choice The description of the chosen button.
         * @param {Event} relatedEvent The DOM event.
         * @param {Core.widget.ConfirmationBar} source The `ConfirmationBar` instance.
         * @param {Boolean} userAction `true` since the user clicked the button.
         */
        this.trigger('choice', {
            ...info,
            choice     : choices[info.source.ref],
            source     : this,
            userAction : true
        });
    }

    onChildAdd(child) {
        super.onChildAdd(child);

        FunctionHelper.before(child, 'onConfigChange', 'onChildConfigChange', this);

        this.syncButtons();
    }

    onChildConfigChange({ name }) {
        widthyConfigs.test(name) && this.syncButtons();
    }

    onChildRemove(child) {
        super.onChildRemove(child);

        this.syncButtons();
    }

    onInternalPaint(info) {
        super.onInternalPaint(info);

        info.firstPaint && this.syncButtons.resume();

        this.syncButtons.now();
    }

    syncButtons() {
        const
            me                = this,
            buttons           = me.isDestroying ? [] : me.buttons,
            { defaultButton } = me;

        let minWidth, text;

        (me.syncWidthButtons !== false) && buttons.forEach(button => {
            if ((text = button.text)) {
                minWidth = Math.max(minWidth || 0, text.length + Boolean(button.icon) + Boolean(button.menu));
            }
        });

        buttons.forEach(button => {
            const
                { classList } = button.element,
                isDefault     = button.ref === defaultButton;

            button.rendition = isDefault ? defaultRendition : nonDefaultRendition;
            classList.add(...(isDefault ? defaultClasses : nonDefaultClasses));
            classList.remove(...(isDefault ? nonDefaultClasses : defaultClasses));
            classList.toggle('b-default-button', isDefault);

            button.minWidth = (minWidth && button.text) ? `${minWidth}em` : null;
        });
    }

    updateAutoWidthButtons() {
        this.syncButtons();
    }

    updateDefaultButton() {
        this.syncButtons();
    }
}

// Register this widget type with its Factory
ConfirmationBar.initClass();
