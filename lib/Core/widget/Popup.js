import Panel from './Panel.js';
import EventHelper from '../helper/EventHelper.js';
import GlobalEvents from '../GlobalEvents.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Resizable from './mixin/Resizable.js';

DomHelper.loadStylesheet('Core/widget/Popup.css');

// import Stylesheet from './Popup.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Popup');

/**
 * @module Core/widget/Popup
 */

/**
 * A floating Popup widget, which can contain child {@link Core.widget.Container#config-items widgets} or plain html. Serves as the base class
 * for Menu / Tooltip.
 *
 * {@inlineexample Core/widget/Popup.js}
 *
 * When it contains focus, the <kbd>Escape</kbd> key {@link #config-closeAction closes} the picker. When it hides,
 * focus is reverted to the element from which it entered the Popup, or, if that is no longer focusable,
 * a close relative of that element.
 *
 * ```javascript
 * const popup = new Popup({
 *   forElement : document.querySelector('button'),
 *   items      : {
 *     text : { type : 'text', placeholder: 'Text' },
 *     button : { type: 'button', text: 'Okay', style: 'width: 100%', color: 'b-orange'}
 *   }
 * });
 * ```
 *
 *
 * ## Dragging & Resizing
 *
 * Popups can be resized and dragged around the screen. To enable resizing, set the {@link #config-resizable} config to
 * `true` or an object with specific options. To enable dragging, set the {@link #config-draggable} config to `true`.
 *
 * For example:
 *
 * ```javascript
 * const popup = new Popup({
 *    draggable : true,
 *    resizable : {
 *       handles : {
 *          top  : false,
 *          minWidth : 100
 *       }
 *    }
 * });
 * ```
 * @extends Core/widget/Panel
 * @mixes Core/widget/mixin/Resizable
 * @classtype popup
 */
export default class Popup extends Panel.mixin(Resizable) {
    //region Config

    static $name = 'Popup';

    static type = 'popup';

    static configurable = {
        cssVarPrefix : 'b-popup',

        /**
         * Auto show flag for Popup.
         * If truthy then Popup is shown automatically upon hover.
         * @config {Boolean}
         * @default
         */
        autoShow : true,

        /**
         * By default, a Popup is transient, and will {@link #function-close} when the user clicks or
         * taps outside its owned widgets and when focus moves outside its owned widgets.
         *
         * **Note**: {@link #config-modal Modal} popups won't {@link #function-close} when focus moves outside even
         * if autoClose is `true`.
         *
         * Configure as `false` to make a Popup non-transient.
         * @config {Boolean}
         * @default
         */
        autoClose : true,

        /**
         * Show popup when user clicks the element that it is anchored to. Cannot be combined with showOnHover. Can
         * also be provided as the button number (0: main button, 2: right button).
         * @config {Boolean|Number}
         * @default
         */
        showOnClick : false,

        /**
         * DOM element to attach popup.
         * @config {HTMLElement}
         */
        forElement : null,

        monitorResize : true,

        floating : true,
        hidden   : true,

        axisLock : true, // Flip edges if align violates constrainTo

        /**
         * Set to `false` to prevent dragging the popup element.
         *
         * @config {Boolean|Object}
         * @property {String} handleSelector CSS selector used to determine if a drag operation can be started from
         * a mouse-downed element inside the popup
         * @default true
         * @category Float & align
         */
        draggable : true,

        // blacklist buttons and field inners, and other draggable elements
        draggableBlacklistSelector : 'button,.b-slider,.b-grid-base,.b-timeline-base,.b-task-board,.b-calendar-mixin,.b-resize-grip,.b-field,input,.b-splitter',

        hideAnimation : {
            opacity : {
                from     : 1,
                to       : 0,
                duration : '.3s',
                delay    : '0s'
            }
        },

        showAnimation : {
            opacity : {
                from     : 0,
                to       : 1,
                duration : '.4s',
                delay    : '0s'
            }
        },

        stripDefaults : {
            bbar : {
                layout : {
                    justify : 'flex-end'
                }
            }
        },

        testConfig : {
            hideAnimation : null,
            showAnimation : null
        },

        /**
         * The action to take when calling the {@link #function-close} method.
         * By default, the popup is hidden.
         *
         * This may be set to `'destroy'` to destroy the popup upon close.
         * @config {'hide'|'destroy'}
         * @default
         */
        closeAction : 'hide',

        /**
         * By default, tabbing within a Popup is circular - that is it does not exit.
         * Configure this as `false` to allow tabbing out of the Popup.
         * @config {Boolean}
         * @default
         */
        trapFocus : true,

        /**
         * By default a Popup is focused when it is shown.
         * Configure this as `false` to prevent automatic focus on show.
         * @config {Boolean}
         * @default
         */
        focusOnToFront : true,

        /**
         * Show a tool in the header to close this Popup.
         * The tool is available in the {@link Core.widget.mixin.Toolable#property-tools} object
         * under the name `close`. It uses the CSS class `b-popup-close` to apply a
         * default close icon. This may be customized with your own CSS rules.
         * @default false
         * @config {Boolean}
         */
        closable : null,

        /**
         * Show a tool in the header to maximize this popup
         * @config {Boolean}
         * @default false
         */
        maximizable : null,

        /**
         * Optionally show an opaque mask below this Popup when shown.
         * Configure this as `true` to show the mask.
         *
         * When a Popup is modal, it defaults to being {@link Core.widget.Widget#config-centered}.
         * Also, it won't {@link #function-close} when focus moves outside even if {@link #config-autoClose} is
         * `true`.
         *
         * The default action is to focus the popup.
         *
         * Usage:
         * ```javascript
         * new Popup({
         *     title  : 'I am modal',
         *     modal  : {
         *         closeOnMaskTap : true
         *     },
         *     height : 100,
         *     width  : 200
         * });
         * ```
         *
         * @default false
         * @config {Boolean|Object}
         * @property {Boolean} [closeOnMaskTap=false] Specify as `true` to close when mask is tapped.
         * @property {Boolean} [transparent=false] Specify as `true` to use a transparent mask.
         */
        modal : null,

        /**
         * Set to `true` to make this widget take all available space in the visible viewport.
         * @member {Boolean} maximized
         * @category Float & align
         */
        /**
         * Set to `true` to make this widget take all available space in the visible viewport.
         * @config {Boolean}
         * @default false
         * @category Float & align
         */
        maximized : null,

        tools : {
            close : {
                cls       : 'b-popup-close',
                handler   : 'close',
                weight    : -1000,
                ariaLabel : 'L{Popup.close}',
                hidden    : true // shown when closable set to `true`
            },
            maximize : {
                cls       : 'b-popup-expand',
                handler   : 'toggleMaximized',
                weight    : -999,
                ariaLabel : 'L{Popup.maximize}',
                hidden    : true // shown when maximizable set to `true`
            }
        },

        highlightReturnedFocus : true,

        role : 'dialog',

        /**
         * Close popup when <kbd>Escape</kbd> key is pressed.
         * @default true
         * @config {Boolean}
         */
        closeOnEscape : true
    };

    //endregion

    //region Init & destroy

    finalizeInit() {
        const
            me             = this,
            { forElement } = me;

        me.anchoredTo    = forElement;
        me.initialAnchor = me.anchor;
        if (forElement && me.showOnClick !== false) {
            // disable autoShow if not enabled by config
            if (!me.initialConfig.autoShow) {
                me.autoShow = false;
            }
            EventHelper.on({
                element                                          : forElement,
                [me.showOnClick === 2 ? 'contextmenu' : 'click'] : 'onElementUserAction',
                thisObj                                          : me,
                capture                                          : true
            });
        }

        super.finalizeInit();

        // We must not autoShow if there's a forElement but it's not visible
        if (me.autoShow && (!forElement || DomHelper.isVisible(forElement))) {
            if (me.autoShow === true) {
                me.show();
            }
            else {
                me.setTimeout(() => me.show(), me.autoShow);
            }
        }
    }

    onInternalPaint({ firstPaint }) {
        super.onInternalPaint?.(...arguments);

        const me = this;

        // Only add the listener the frst time we paint. If we are not maximizable, it does no harm.
        if (firstPaint && me.headerElement) {
            EventHelper.on({
                element  : me.headerElement,
                dblclick : me.onHeaderDblClick,
                thisObj  : me
            });
        }
    }

    doDestroy() {
        this.syncModalMask();
        super.doDestroy();
    }

    //endregion

    compose() {
        const { hasNoChildren, textContent, strips } = this;

        return {
            class : {
                // Popup has extra CSS responsibilities at the top level.
                // The CSS needs to know whether it should impose a max-width.
                'b-text-popup' : Boolean(textContent && hasNoChildren && !strips)
            }
        };
    }

    //region Show/hide

    /**
     * Performs the configured {@link #config-closeAction} upon this popup.
     * By default, the popup hides. The {@link #config-closeAction} may be
     * configured as `'destroy'`.
     * @fires beforeClose
     * @async
     */
    close() {
        /**
         * Fired when the {@link #function-close} method is called and the popup is not hidden.
         * May be vetoed by returning `false` from a handler.
         * @event beforeClose
         * @preventable
         * @async
         * @param {Core.widget.Popup} source - This Popup
         */
        if (!this._hidden) {
            const result = this.trigger('beforeClose');

            // Proceed with the close process if the Promise resolves to not false
            if (ObjectHelper.isPromise(result)) {
                result.then(result => {
                    if (result !== false) {
                        this.doClose();
                    }
                });
                return result;
            }

            // Allow beforeClose to veto if called when we are visible.
            // we should destroy it even if it's hidden just omit beforeclose event
            if (result === false) {
                return result;
            }
        }
        this.doClose();
    }

    doClose() {
        const
            me              = this,
            { closeAction } = me;

        if (!me._hidden || closeAction === 'destroy') {
            // Revert focus early when closing a modal popup will lead to destruction, to give listeners a shot at doing
            // their thing. Without this, focus will be reverted as part of the destruction process, and listeners won't
            // be called.
            me.modal && closeAction === 'destroy' && me.revertFocus();

            me.unmask();

            // Get any errorTip associated with any item in the popup and hide them
            const errorTip = me.items.length && me.items.find(item => item.errorTip)?.errorTip;

            if (errorTip) {
                errorTip.pointerOverOutDetacher?.();
                errorTip.hide();
            }

            return me[closeAction]();
        }
    }

    toggleMaximized() {
        this.maximized = !this.maximized;
    }

    updateMaximized(value) {
        const
            me          = this,
            constrained = Boolean(me._lastMaxWidth || me._lastMaxHeight);

        value = Boolean(value);
        me.toggleCls('b-maximized', value);
        me.toggleCls('b-maximized-constrained', value && constrained);
        me.draggable && (me.draggable.disabled = value);
    }

    //endregion

    //region Events

    onInternalKeyDown(event) {
        const me = this;

        // Close or collapse/unreveal on escape key when `closeOnEscape` is set to `true`
        if (event.key === 'Escape' && me.closeOnEscape) {
            event.stopImmediatePropagation();
            if (me.floating || me.positioned) {
                me.close(true);
            }
        }
    }

    onDocumentMouseDown({ domEvent }) {
        const
            me         = this,
            { owner }  = me,
            { target } = domEvent;

        if (!me.isVisible) {
            return;
        }
        // If mousedown was on our owning Button, it is that button's responsibility to
        // toggle its pressed state thereby hiding its menu, so prevent the focus move of the mousedown.
        if (domEvent.type !== 'touchend' && owner?.isButton && owner._menu === me && owner.element.contains(target)) {
            domEvent.preventDefault();
            return false;
        }
        if (me.modal && target === Popup.modalMask) {
            domEvent.preventDefault();
            if (me.modal.closeOnMaskTap) {
                me.close();
            }
            else if (!me.containsFocus) {
                me.focus();
            }
        }
        // in case of outside click and if popup is focused, focusout will trigger closing
        // Only hide on mousedown to prevent unwanted closing on touch events which can fire after mousedown
        // (domEvent.type condition added as a fix for https://github.com/bryntum/bryntum/issues/10300)
        else if (!me.owns(target, true) && me.autoClose && domEvent.type === 'mousedown') {
            // If we are focused, the default mousedown action *should* blur us which
            // will hide. *But*, if a handler (like a splitter drag) prevents default,
            // we have to hide if, at the top of the bubble, the default has been prevented
            // and focus has not been changed.
            if (me.containsFocus) {
                const
                    focusedEl = DomHelper.getActiveElement(me.element),
                    focusedWidget = focusedEl && Popup.fromElement(focusedEl, 'widget');

                if (focusedWidget?.owns(target, true)) {
                    return;
                }

                EventHelper.on({
                    element         : document,
                    once            : true,
                    expires         : 100,
                    [domEvent.type] : e => {
                        // If, between the capture phase and this listener, some handler has prevented the default
                        // but *not* moved focus, then we have to take action to close.
                        if (e.defaultPrevented && DomHelper.getActiveElement(me.element) === focusedEl) {
                            me.close();
                        }
                    }
                });
            }
            else {
                me.close();
            }
        }
    }

    get isTopModal() {
        return !this._isRevertingFocus && DomHelper.isVisible(Popup.modalMask) && this.element.previousElementSibling === Popup.modalMask;
    }

    onFocusIn(e) {
        const activeEl = DomHelper.getActiveElement(this);

        super.onFocusIn(e);

        // No event handler has moved focus, and target is outermost el
        // then delegate to the focusElement which for a Container
        // is found by finding the first visible, focusable descendant widget.
        if (DomHelper.getActiveElement(this) === activeEl && e.target === this.element) {
            this.focus();
        }
    }

    onFocusOut(e) {
        // For mobile browsers with virtual keyboard, when pressing Done key, focus should move back to the popup
        // https://github.com/bryntum/bryntum/issues/2903
        // window.visualViewport.height could be a decimal value. Using 1px threshold for correct comparing
        const usingVirtualKeyboard = globalThis.visualViewport && globalThis.visualViewport.height < document.documentElement.clientHeight - 1;

        if (!usingVirtualKeyboard && !this.modal && this.autoClose) {
            this.close();
        }

        super.onFocusOut(e);
    }

    afterShow(...args) {
        const me = this;

        if (me.autoClose || me.modal) {
            me.addDocumentMouseDownListener();
        }

        super.afterShow(...args);

        // Showing a Popup means show at the top of the stack.
        me.toFront();
    }

    toFront(focusTarget) {
        // Allow for configuration against the default, e.g. floating : false which can
        // be done with Menus to create static menu UIs.
        if (this.floating) {
            super.toFront(focusTarget);

            // Insert the modal mask below this Popup if needed
            this.syncModalMask();
        }

        if (this.focusOnToFront && !this.containsFocus) {
            this.focus();
        }
    }

    addDocumentMouseDownListener() {
        if (!this.mouseDownRemover) {
            this.mouseDownRemover = GlobalEvents.ion({
                globaltap : 'onDocumentMouseDown',
                thisObj   : this
            });
        }
    }

    updateModal(modal) {
        const me = this;

        // Modal implies that this is floating. There's no ability for positioned widgets
        // to acquire a modal mask.
        if (modal) {
            me.element.setAttribute('aria-modal', true);
            me.floating = true;
            // If we have not been explicitly positioned, a modal is centered.
            // And if it's centered, it cannot show an anchor arrow.
            if (typeof me._x !== 'number' && typeof me._y !== 'number' && !me.hasConfig('centered')) {
                me.centered = true;
                me.anchor = false;
            }
        }
        else {
            me.element.removeAttribute('aria-modal');
        }
        me.syncModalMask();
    }

    syncModalMask() {
        const
            me        = this,
            { modal } = me;

        // Note the difference between Popup.modalMask and this.modalMask.
        // this.modalMask syncs the position of the element in the DOM
        // to be below this element. Popup.modalMask just returns the element.
        if (modal && me.isVisible) {
            me.modalMask.classList.remove('b-hide-display');
            me.modalMask.classList.toggle('b-modal-transparent', Boolean(modal.transparent));
            me.addCls('b-modal');
            me.modalMask.setAttribute('owned-by', me.id);
        }
        else if (me.isPainted) {
            me.removeCls('b-modal');

            const
                remainingModals = me.floatRoot.querySelectorAll('.b-modal'),
                topModal        = remainingModals.length ? Popup.fromElement(remainingModals[remainingModals.length - 1], 'popup') : null;

            // If there are any other visible modals, drop the mask to just below the new topmost
            if (topModal) {
                topModal.syncModalMask();
            }
            else {
                Popup.modalMask.classList.add('b-hide-display');
            }
        }
    }

    afterHide(...args) {
        const me = this;

        super.afterHide(...args);

        me.mouseDownRemover?.();
        me.mouseDownRemover = null;

        // Insert the modal mask below the topmost Popup if needed, else hide it
        me.syncModalMask();
    }

    onElementUserAction(event) {
        const { showOnClick } = this;

        if (typeof showOnClick !== 'number' || showOnClick === event.button) {
            if (event.button === 2) {
                event.preventDefault();
            }
            this.show();
        }
    }

    onHeaderDblClick() {
        if (this.maximizable) {
            this.toggleMaximized();
        }
    }

    //endregion

    updateClosable(closable) {
        this.tools.close.hidden = !closable;
    }

    updateMaximizable(maximizable) {
        this.tools.maximize.hidden = !maximizable;
    }

    /**
     * Returns the modal mask element for this Popup correctly positioned just below this Popup.
     * @member {HTMLElement} modalMask
     * @readonly
     * @internal
     */
    get modalMask() {
        const { modalMask } = Popup;

        if (modalMask.nextElementSibling !== this.element) {
            this.floatRoot.insertBefore(modalMask, this.element);
        }

        return modalMask;
    }

    /**
     * Returns the modal mask element. It does NOT guarantee its placement in the DOM relative
     * to any Popup. To get the modal mask for a particular Popup, use the instance property.
     * @member {HTMLElement} modalMask
     * @readonly
     * @static
     * @internal
     */
    static get modalMask() {
        if (!this._modalMask) {
            this._modalMask = DomHelper.createElement({
                className : 'b-modal-mask b-hide-display'
            });
            // Mousewheel should not scroll the body "through" a modal mask.
            EventHelper.on({
                element : this._modalMask,
                wheel   : e => e.preventDefault()
            });
        }
        return this._modalMask;
    }
}

// Register this widget type with its Factory
Popup.initClass();
