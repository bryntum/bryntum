import Popup from './Popup.js';
import Widget from './Widget.js';
import AsyncHelper from '../helper/AsyncHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import './MenuItem.js';
import EventHelper from '../helper/EventHelper.js';

DomHelper.loadStylesheet('Core/widget/Hint.css');

// import Stylesheet from './Hint.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Hint');

/**
 * @module Core/widget/Hint
 */

/**
 * An object which describes actions to take when navigating between hints.
 *
 * @typedef {Object} HintActions
 * @property {String} [click] A CSS selector to click when the 'Previous' button is clicked,
 * @property {String} [contextmenu] A CSS selector to right-click when the 'Previous' button is clicked.
 * @property {String} [dblclick] A CSS selector to right-click when the 'Previous' button is clicked.
 * @property {Object|String} [type] String to type or an object with the following properties:
 * @property {String} [type.target] A CSS selector to find the target element to type into.
 * @property {String} [type.text] The string to type. May contain special characters like `[Enter]` or `[Shift+Tab]`.
 * @property {Number} [type.initialDelay] The number of milliseconds to wait before starting to type.
 * @property {Number} [type.clear] Clear the input before typing.
 * @property {String|Number} [waitFor] A CSS selector to wait for or the number of milliseconds to wait.
 * @property {Object} [drag] An object with the following properties:
 * @property {String} [drag.target] A CSS selector to find the target element to drag.
 * @property {Number[]} [drag.by] The distance to drag the target element, as an array of `[dx, dy]`.
 * @property {Number} [drag.duration=500] The duration of the drag in milliseconds.
 * @property {Boolean} [allowInteraction=false] Allow user interaction during this action. By default
 * user interaction is blocked during navigation from hint to hint.
 * @property {Function} [fn] A function to call when the 'Previous' button is clicked.
 */

/**
 * An onboarding popup that highlights a UI element and displays instructional content to guide the user through
 * a feature. This class is not instantiated directly — instead, use {@link Core.util.HintFlow} to define a
 * sequence of hints with navigation actions. Each hint anchors to a target element (via CSS selector), shows
 * a title and content, and can trigger actions (click, type, drag) when the user navigates between steps.
 * Keyboard shortcuts are supported: `N` for next, `P` for previous, `S` or `Escape` to stop.
 *
 * ```javascript
 * new HintFlow({
 *     defaults : { modal : true },
 *     hints    : [{
 *         target     : '.b-tab-panel-tab[data-item-index="1"]',
 *         title      : 'Change tab',
 *         content    : 'Click here to move to the next tab',
 *         nextAction : {
 *             click : '.b-tab-panel-tab[data-item-index="1"]'
 *         }
 *     }, {
 *         target     : '.b-button:contains(Save)',
 *         title      : 'Save',
 *         content    : 'Click here to save the changes',
 *         nextAction : {
 *             click : '.b-button:contains(Save)'
 *         }
 *     }]
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                    | Description                                          |
 * |---------------------------|------------------------------------------------------|
 * | {@link #config-title}     | Title displayed in the hint header                   |
 * | {@link #config-content}   | Instructional text or HTML content                   |
 * | {@link #config-anchor}    | Show an anchor arrow pointing to the target element  |
 * | {@link #config-modal}     | Dim the background behind the hint                   |
 *
 * ## Hint configuration properties
 *
 * Each entry in the `hints` array of the {@link Core.util.HintFlow} class should be an object with the following properties:
 *  - target: Required. The target element to highlight, or a CSS selector to find the target element.
 *    If the target selector ends with a `?`, the hint will be skipped if the target is not found.
 *    By default, the hint will be aligned to this element.
 *  - title: The title to display in the hint.
 *  - content: Required. The content to display in the hint.
 *  - align: The alignment of the hint relative to the target element. If this is specified as an {@link AlignSpec} object,
 *    the hint will be aligned to the `target` property of this object if present.
 *     - target: The element to align to, or a CSS selector to find the element to align to.
 *  - nextAction: The action(s) to take when the 'Next' button is clicked. Properties may be:
 *     - click: A CSS selector to find the target element to click.
 *     - type: A string to type into the target element.
 *     - dblclick: A CSS selector to find the target element to double click.
 *     - contextmenu: A CSS selector to find the target element to right click.
 *     - fn: A function to call when the hint is shown.
 *     - drag: An object with the following properties:
 *         - target: The target element to drag, or a CSS selector to find the target element.
 *         - by: The distance to drag the target element, as an array of `[dx, dy]`.
 *     - waitFor: A CSS selector to wait for or the number of milliseconds to wait before continuing to the next hint.
 *
 *  - previousAction: The action(s) to take when the 'Previous' button is clicked.
 *  - autoNext: The number of milliseconds to wait before automatically moving to the next hint, or a CSS selector
 *    to find the target element to wait for.
 *  - highlightTarget: Specify as `true` to highlight the target element with a bright outline.
 *  - buttons: Overrides for buttons to show in the hint. This is an object which may contain the following properties:
 *    - next: Override config for the 'Next' button
 *    - previous: Override config for the 'Previous' button
 *    - stop: Config to add a 'Stop' button. By default the dialog close, or typing <kbd>S</kbd> button is used.
 *
 * Other properties (eg {@link Core.widget.Popup#config-modal} can be added to the object, and will be passed to the
 * {@link Core.widget.Hint} instance.
 *
 * When using a HintFlow tutorial, pressing <kbd>N</kbd> will navigate to the next hint, <kbd>P</kbd> will navigate to the previous hint.
 * Pressing <kbd>S</kbd> or <kbd>Escape</kbd> will stop the tutorial.
 *
 * {@inlineexample Core/widget/Hint.js}
 *
 * ## See also
 *
 * - {@link Core.util.HintFlow} - Orchestrates a sequence of Hint popups
 * - {@link Core.widget.Popup} - Base floating popup class
 *
 * @demo Calendar/custom-rendering
 * @extends Core/widget/Popup
 * @classtype hint
 * @widget
 */
export default class Hint extends Popup {

    // <debug>
    // region Localization test
    static localization = [
        'L{Object.previous}',
        'L{Object.next}'
    ];
    // endregion
    // </debug>

    //region Config
    static $name = 'Hint';
    static type = 'hint';

    static configurable = {
        /**
         * @hideconfigs defaultFocus, autoShow, autoClose, centered, allowOver, closable, closeAction
         */

        ui           : 'plain',
        defaultFocus : w => !w.hidden && (w.ref === 'next' || w.ref === 'stop'),
        align        : {
            align          : 't-b',
            allowTargetOut : true
        },
        anchor    : true,
        autoShow  : false,
        autoClose : false,
        centered  : false,
        allowOver : true,
        closable  : true,
        minWidth  : 'max-content',

        closeAction : 'stop',

        /**
         * The actions to take when the 'Previous' button is clicked.
         *
         * By default, user interaction during these actions is disabled.
         *
         * The property names are the actions to take, and the values are the configuration for that action.
         *
         * @config {HintActions|HintActions[]} previousAction
         */
        previousAction : null,

        /**
         * The actions to take when the 'Next' button is clicked.
         *
         * By default, user interaction during these actions is disabled.
         *
         * The property names are the actions to take, and the values are the configuration for that action.
         *
         * @config {HintActions|HintActions[]} nextAction
         */
        nextAction : null,

        /**
         * The mapping of key names to hint actions.
         * The actions are `previous`, `next`, and `stop`.
         * By default, the following key mappings are used:
         * - `P` for `previous`
         * - `N` for `next`
         * - `S` for `stop`
         * The key mappings can be overridden by providing a `keyMap` config object.
         * @config {Object<String,'previous'|'next'|'stop'>}
         */
        keyMap : {
            P : 'previous',
            N : 'next',
            S : 'stop'
        },

        /**
         * Overrides for buttons to show in the hint.
         *
         * By default, hints show a 'Next' button.
         *
         * The last hint will show a 'Previous' button instead of 'Next'.
         *
         * These buttons can be overridden by providing a `buttons` config object for the listed properties
         * @config {Object<String,ButtonConfig>} buttons
         * @prop {ButtonConfig} next Override the 'Next' button
         * @prop {ButtonConfig} previous Override the 'Previous' button
         */
        buttons : null,

        /**
         * How long in milliseconds to wait for a target to become available before giving up.
         * @config {Number}
         * @default
         */
        maxWait : 10000,

        /**
         * Specify as a truthy value to highlight the target element with a bright outline.
         * @config {Boolean|Object}
         * @prop {Boolean} [ping] Specify as `true` to have the outline expand repeatedly with a "ping" animation.
         * @prop {String} [center] Specify as a CSS color to use as the color of a 20 pixel diameter
         * @prop {Number|Number[]} inflate Arguments to {@link Core.helper.util.Rectangle#function-inflate}.
         * Specify as a number to inflate the target rect by that many pixels, or as an array of
         * inflate values for each edge.
         * @default false
         */
        highlightTarget : null,

        highlighter : {
            $config : ['lazy', 'nullify'],
            value   : {
                floating : true,
                cls      : 'b-hint-highlighter'
            }
        },

        /**
         * Either the number of milliseconds to wait before automatically moving to the next hint, or a CSS selector
         * to wait for before moving to the next hint.
         * @config {String|Number}
         */
        autoNext : null,

        /**
         * The target element to highlight, or a CSS selector to find the target element.
         * @config {String|HTMLElement}
         */
        target : null
    };

    static delayable = {
        syncTargetHighlighting : 'raf'
    };

    afterShow(...args) {
        super.afterShow(...args);

        // Ensure the highlighter and modal "hole" are in the correct position
        this.syncTargetHighlighting();

        // Hints always close on click outside
        this.addDocumentMouseDownListener();
    }

    realign(...args) {
        super.realign(...args);

        // Ensure the highlighter and modal "hole" are in the correct position
        this.syncTargetHighlighting();
    }

    // The topmost modal is always focused by GlobalEvents, but hints must allow focus to be taken by
    // the application so that the actions can be executed on the target elements, so we are never the top modal.
    get isTopModal() {
        return false;
    }

    owns(...args) {
        // During navigation interaction and the reconfiguring of the hint in updateActiveIndex,
        // a hint singleton must keep focus, so we own all elements in the UI.
        return this.masked ? true : super.owns(...args);
    }

    onDocumentMouseDown({ domEvent }) {
        // Don't respond to synthetic events. We are making those gestures during action processing.
        if (!domEvent.isTrusted) {
            return;
        }
        if (!this.owns(domEvent.target)) {
            this.hintFlow.stop();
        }
        else {
            super.onDocumentMouseDown({ domEvent });
        }
    }

    changeTarget(target) {
        if (target) {
            // If the target is specified as a string, it *may* lead to the same element
            // but in a different state. So we must clear the _target and _forElement to ensure the updaters are called.
            if (typeof target === 'string') {
                this._target = this._forElement = null;
            }

            target = this.hintFlow.normalizeTarget(target);

            if (ObjectHelper.isPromise(target)) {
                target.then(target => !this.isDestroyed && (this.target = target));
                this.setTimeout('hide', this.maxWait);
                return;
            }
        }
        return target;
    }

    updateButtons(buttons) {
        this.bbar = {
            items : buttons
        };
    }

    updateHighlightTarget(highlightTarget, was) {
        const inflate = highlightTarget?.inflate;

        if (inflate) {
            this.initialInflate = this.align.inflate;
            this.align.inflate = inflate;
        }
        else {
            this.align.inflate = this.initialInflate;
        }
    }

    updateTarget(target) {
        if (target instanceof Element) {
            this.forElement = target;
        }
    }

    changeHighlighter(highlighter, was) {
        if (highlighter) {
            return Widget.reconfigure(was, Widget.mergeConfigs({
                owner : this
            }, highlighter), this);
        }
        else {
            was?.destroy();
        }
    }

    async updateForElement(el) {
        const
            me = this,
            {
                autoNext,
                owner,
                index
            }  = me;

        me.syncTargetHighlighting();

        // If a hide was scheduled while waiting for the target to appear, cancel it.
        me.clearTimeout('hide');
        me.hidden = false;

        // Allow the hint to be aligned to another element than its target.
        me.showBy({ target : me.align.target || me.forElement });
        !me.element.matches(':focus-within') && me.focus();

        if (autoNext) {
            switch (typeof autoNext) {
                case 'number':
                    me.setTimeout(() => owner.navigate(1), autoNext);
                    break;
                case 'string':

                    // Wait for any animations to have restored the target to its original state.
                    // Otherwise the hint might advance immediately if we have just stepped backwards.
                    await AsyncHelper.sleep(500);

                    // In case user rapidly clicked through hints, only navigate if this hint is still current.
                    if (me.index === index) {
                        // Wait for the target to appear.
                        const target = await (me.autoNextPromise = owner.normalizeTarget(autoNext, false));

                        me.autoNextPromise = null;

                        // If the target is visible, navigate to the next hint.
                        if (target) {
                            owner.navigate(1, false);
                        }
                    }
                    break;
                case 'function':
                    await AsyncHelper.waitFor(autoNext, 10000);
                    owner.navigate(1, false);
            }
        }
    }

    syncTargetHighlighting() {
        if (!this.isVisible) {
            return;
        }
        const
            me                   = this,
            {
                highlightTarget,
                highlighter,
                forElement : el
            }                    = me,
            {
                classList : myClassList
            }                    = me.element,
            highlightStyles      = {
                '--bi-hint-highlight-color' : ''
            },
            element              = highlighter?.element,
            highlighterClassList = element?.classList,
            inflate              = highlightTarget?.inflate;

        // Remove ping animation before we read DOM styles
        highlighterClassList?.remove('b-hint-highlighter-ping', 'b-hint-highlighter-center');

        // If we are realigning because of scrolling, this hint should not animate position
        myClassList[me.scrollRealigning ? 'add' : 'remove']('b-scroll-realigning');

        if (el) {
            const
                { style }   = me.floatRoot,
                targetStyle = el.ownerDocument.defaultView.getComputedStyle(el),
                elRect      = DomHelper.isInView(el, false, this),
                targetRect  = highlightTarget?.center ? elRect.center.inflate(10) : elRect;

            // Hightlighter must always be behind the hint
            element.parentElement?.insertBefore(element, me.element);

            if (inflate) {
                targetRect.inflate.apply(targetRect, Array.isArray(inflate) ? inflate : [inflate]);
            }

            // If we are targeting the center of the element, highlighter is always a circle
            // so don't copy in target border radii.
            if (highlightTarget && !highlightTarget?.center) {
                for (const t of ['top', 'bottom']) {
                    for (const l of ['left', 'right']) {
                        const r = targetStyle.getPropertyValue(`border-${t}-${l}-radius`);

                        highlightStyles[`border-${t}-${l}-radius`] = parseInt(r) ? r : '';
                    }
                }
            }

            // Allow a string color.
            if (typeof highlightTarget?.center === 'string' && highlightTarget.center.length > 0) {
                highlightStyles['--bi-hint-highlight-color'] = highlightTarget.center;
            }

            style.setProperty('--bi-hint-highlight-top', `${targetRect.top}px`);
            style.setProperty('--bi-hint-highlight-left', `${targetRect.x}px`);
            style.setProperty('--bi-hint-highlight-width', `${targetRect.width}px`);
            style.setProperty('--bi-hint-highlight-height', `${targetRect.height}px`);
        }

        // If not modal, we use a highlighter widget.
        if (highlightTarget) {
            // If we are realigning because of scrolling, the highlighter should not animate position
            highlighterClassList[me.scrollRealigning ? 'add' : 'remove']('b-realigning');

            // Sync the border radii and outline colour
            DomHelper.applyStyle(element, highlightStyles);
            highlighter.show();

            // Kick off the ping animation when it's in position
            if (highlightTarget.ping) {
                EventHelper.onTransitionEnd({
                    element,
                    property : 'inset-inline-start',
                    once     : true,
                    thisObj  : me,
                    timeout  : 500,
                    handler  : () => {
                        highlighterClassList.add('b-hint-highlighter-ping');
                    }
                });
            }
            if (highlightTarget.center) {
                highlighterClassList.add('b-hint-highlighter-center');
            }
        }
        me.requestAnimationFrame(() => {
            myClassList.remove('b-scroll-realigning');
            highlighterClassList.remove('b-realigning');
        });
    }

    next() {
        if (this.index < this.owner.hints.length - 1) {
            this.owner.navigate(1);
        }
    }

    previous() {
        if (this.index) {
            this.owner.navigate(-1);
        }
    }

    stop() {
        this.owner.stop();
    }
}

Hint.initClass();
