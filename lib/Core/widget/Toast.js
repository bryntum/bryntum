import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';
import AsyncHelper from '../helper/AsyncHelper.js';

DomHelper.loadStylesheet('Core/widget/Toast.css');

// import Stylesheet from './Toast.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Toast');
/**
 * @module Core/widget/Toast
 */

/**
 * A non-blocking notification that slides in from a screen edge and auto-dismisses after a configurable
 * {@link #config-timeout}. Multiple toasts stack automatically. Use the static {@link #function-show-static}
 * method for one-line usage, or create an instance for more control. Configure {@link #config-side} to choose
 * the screen edge (`'top'`, `'bottom'`, `'top-start'`, etc.) and {@link #config-showProgress} to display a
 * countdown bar.
 *
 * ```javascript
 * // Simplest usage
 * Toast.show('Just toasting');
 *
 * // With configuration
 * Toast.show({
 *     html         : 'Well toasted',
 *     timeout      : 5000,
 *     showProgress : false
 * });
 * ```
 *
 * {@inlineexample Core/widget/Toast.js}
 *
 * ## Useful configs and properties
 *
 * | Config                       | Description                                        |
 * |------------------------------|----------------------------------------------------|
 * | {@link #config-html}         | HTML content of the toast                          |
 * | {@link #config-timeout}      | Auto-dismiss delay in milliseconds (0 to persist)  |
 * | {@link #config-showProgress} | Show a progress bar indicating time remaining      |
 * | {@link #config-side}         | Screen edge to show at (`'top'`, `'bottom'`, etc.) |
 *
 * To show toasts from the top and have them stack downwards, specify `side` as `'top'`:
 *
 * ```javascript
 * Toast.show({
 *     html : 'Well toasted',
 *     side : 'top'
 * });
 * ```
 *
 * By default, Toasts show at the `inline-end` side of the screen, so on the right in LTR environments
 * and on the left in RTL environments.
 *
 * Append `-start` to the side to display at the required edge, or just use `side : 'start'` to show
 * at the bottom but at the `inline-start` side of the screen.
 *
 * ```javascript
 * Toast.show({
 *     html : 'Well toasted on the left',
 *     side : 'start'
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Core.widget.MessageDialog} - Modal dialog for confirmations
 * - {@link Core.widget.Popup} - General floating popup
 *
 * @extends Core/widget/Widget
 * @classtype toast
 */
export default class Toast extends Widget {

    static $name = 'Toast';

    static type = 'toast';

    static configurable = {
        testConfig : {
            destroyTimeout : 1,
            timeout        : 400
        },

        floating : true,

        /**
         * Timeout (in ms) until the toast is automatically dismissed. Set to 0 to never hide.
         * @config {Number}
         * @default
         */
        timeout : 2500,

        autoDestroy : null,

        // How long to wait after hide before destruction
        destroyTimeout : 200,

        /**
         * Show a progress bar indicating the time remaining until the toast is dismissed.
         * @config {Boolean}
         * @default
         */
        showProgress : true,

        sideMargin : 20,

        /**
         * Which side to show the toast at, `'top'` or `'bottom'`. Defaults to `'bottom'`.
         *
         * May also define the inline edge to show at, by using `'top-start'`, or `'top-end'` etc.
         *
         * By default, toasts are shown at the bottom at the inline-end edge.
         * @config {'top'|'bottom'|'start'|'end'|'top-start'|'top-end'|'bottom-start'|'bottom-end'} side
         * @default
         */
        side : 'bottom',

        role : 'alert'
    };

    static toasts = {
        'top-start'    : [],
        'top-end'      : [],
        'bottom-start' : [],
        'bottom-end'   : []
    };

    changeSide(side) {
        if (side === 'top' || side === 'bottom') {
            side += '-end';
        }
        else if (side === 'start' || side === 'end') {
            side = 'bottom-' + side;
        }
        return side;
    }

    compose() {
        const { appendTo, html, showProgress, style, timeout, side } = this;

        return {
            parent : appendTo || this.floatRoot,
            class  : {
                [`b-side-${side}`] : 1,
                'b-toast-hide'     : 1  // toasts start hidden so we can animate them into view
            },

            // Needed so that any element attribute modification doesn't restart the announcement
            'aria-atomic' : false,

            html,
            style : {
                ...DomHelper.parseStyle(style),
                '--bi-toast-side' : side.split('-')[0]
            },

            children : {
                progressElement : showProgress && {
                    style : `animation-duration:${timeout}ms;`,
                    class : {
                        'b-toast-progress' : 1
                    }
                }
            },

            // eslint-disable-next-line bryntum/no-listeners-in-lib
            listeners : {
                click : 'hide'
            }
        };
    }

    doDestroy() {
        this.untoast();

        super.doDestroy();
    }

    getNextInset(side) {
        const { sideMargin, element } = this;

        return parseInt(element.style[side], 10) + element.offsetHeight + sideMargin;
    }

    /**
     * Show the toast
     */
    async show(...args) {
        await super.show(...args);

        const
            me                = this,
            { element, side } = me,
            toasts            = Toast.toasts[side],
            s                 = side.split('-')[0],
            // If in focus-visible mode, increase the timeout to allow for reading or announcing the toast
            timeout           = me.timeout * (DomHelper.getActiveElement()?.matches(':focus-visible') ? 3 : 1);

        if (!toasts.includes(me)) {
            element.style[s] = (toasts[0]?.getNextInset(s) ?? me.sideMargin) + 'px';

            toasts.unshift(me);
            element.getBoundingClientRect();  // force layout so that removing b-toast-hide runs our transition

            me.removeCls('b-toast-hide');

            if (timeout > 0) {
                me.hideTimeout = me.setTimeout('hide', timeout);
            }
        }
    }

    /**
     * Hide the toast
     */
    async hide() {
        const me = this;

        me.untoast();
        me.addCls('b-toast-hide');

        if (me.autoDestroy && !me.destroyTimer) {
            me.destroyTimer = me.setTimeout('destroy', me.destroyTimeout);
        }
    }

    untoast() {
        const toasts = Toast.toasts[this.side];

        if (toasts.includes(this)) {
            toasts.splice(toasts.indexOf(this), 1);
        }
        DomHelper.removeAttributeValue(document.body, 'aria-describedby', this.id);
    }

    /**
     * Hide all visible toasts
     */
    static hideAll() {
        Object.keys(Toast.toasts).forEach(k => Toast.toasts[k].slice().reverse().forEach(toast => toast.hide()));
    }

    /**
     * Easiest way to show a toast
     *
     * ```javascript
     * Toast.show('Hi');
     *
     * Toast.show({
     *   html   : 'Read quickly, please',
     *   timeout: 1000
     * });
     * ```
     *
     * @param {String|ToastConfig} config Message or toast config object
     * @returns {Core.widget.Toast}
     */
    static show(config) {
        const toast = Toast.new({
            autoDestroy : true,
            rootElement : document.body,
            autoShow    : false
        }, (typeof config === 'string') ? { html : config } : config);

        // If being used in accessible mode, every Toast must show sequentially to allow them all to be announced.
        // Wait until no toasts are left and the announcement has finished.
        if (DomHelper.getActiveElement()?.matches(':focus-visible') && Object.values(this.toasts).flat().length) {
            AsyncHelper.waitFor(() => !Object.values(this.toasts).flat().length).then(() => setTimeout(() => toast.show(), 250));
        }
        else {
            toast.show();
        }

        return toast;
    }
}

// Register this widget type with its Factory
Toast.initClass();
