import Animator from '../../util/Animator.js';
import PanelCollapser from './PanelCollapser.js';
import Delayable from '../../mixin/Delayable.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import EventHelper from '../../helper/EventHelper.js';
import DomHelper from '../../helper/DomHelper.js';
import DomClassList from '../../helper/util/DomClassList.js';

/**
 * @module Core/widget/panel/PanelCollapserOverlay
 */

const
    { dockIsHorz } = PanelCollapser.maps,
    collapseExposeEdge = {
        top    : 0,
        down   : 0,
        left   : 1,
        bottom : 2,
        up     : 2,
        right  : 3
    },
    translateByDir = {
        up : {
            from : `0 0`,
            to   : '0 -100%'
        },
        down : {
            from : `0 0`,
            to   : '0 100%'
        },
        left : {
            from : `0 0`,
            to   : '-100% 0'
        },
        right : {
            from : `0 0`,
            to   : '100% 0'
        }
    };

/**
 * A panel collapse implementation that adds the ability to reveal the collapsed panel as a floating overlay.
 *
 * @extends Core/widget/panel/PanelCollapser
 * @classtype overlay
 * @classtypealias panelcollapseroverlay
 */
export default class PanelCollapserOverlay extends PanelCollapser.mixin(Delayable) {

    static $name = 'PanelCollapserOverlay';

    static type = 'overlay';

    static configurable = {
        /**
         * The number of milliseconds to wait once the mouse leaves a {@link Core.widget.Panel#config-revealed}
         * panel before returning to an unrevealed state. Clicking outside the revealed panel will immediately
         * return the panel to its collapsed state.
         *
         * This may be disabled by configuring {@link #config-autoClose autoClose.mouseout} as `false`.
         *
         * If this value is negative, the panel will not automatically recollapse due to the mouse leaving, however,
         * clicks outside the panel will still recollapse it.
         *
         * If this value is `null`, the panel will not automatically recollapse for either outside clicks or if
         * the mouse leaves the panel.
         * @config {Number}
         * @default
         */
        autoCloseDelay : 1000,

        /**
         * By default, the following three events will hide the revealed overlay:
         * - `mousedown` outside of the revealed overlay
         * - `mouseout` of the revealed overlay
         * - `focusout` of the revealed overlay
         *
         * This can be configured per event type, for example:
         * ```javascript
         * // Don't hide on mouseout, only on click out
         * autoClose : {
         *    mousedown : true,
         *    mouseout  : false,
         *    focusout  : false
         * }
         * ```
         *
         * Configure as a boolean to apply the same value for all events.
         *
         * If the `mousedown` property is a selector string, clicks on elements matching that selector
         * will also close the revealed overlay:
         *
         * ```javascript
         * // Close when clicking outside, but not when clicking grid cells - those should not close the overlay
         * autoClose : {
         *    mousedown : ':not(.b-grid-cell)',
         *    mouseout  : false,
         *    focusout  : false
         * }
         * ```
         *
         * Note that if creating a whitelist using `:not()`, the `:not()` expression must encapsulate
         * your whitelist selector.
         *
         * If the revealed overlay was shown using the {@link #property-recollapseTool}
         * then moving the mouse outside of the revealed overlay hides the revealed overlay.
         *
         * Configure this as `false` to disable auto hiding, making overlayed
         * state permanent, and changeable using the {@link #function-toggleReveal} method.
         * @config {Object|Boolean}
         * @property {Boolean|String} [mousedown] `true` to hide the revealed panel when clicking outside of it.
         * This may also be a selector string to specify elements which cause auto close when clicked.
         * @property {Boolean} [mouseout]  `true` to hide the revealed panel when the mouse leaves it.
         * @property {Boolean} [focusout]  `true` to hide the revealed panel when it loses focus.
         * @default
         */
        autoClose : {
            $config : 'lazy', // Will only be ingested when revealed.
            value   : true
        },

        revealing : {
            value   : null,
            $config : null,
            default : false
        },

        /**
         * The reveal/hide tool which slides the collapsed panel over the top of the UI.
         * @member {Core.widget.Tool} recollapseTool
         */
        /**
         * The reveal/hide tool which slides the collapsed panel over the top of the UI.
         *
         * The `type` of this instance should not be changed but the tool instance can be
         * configured in other ways via this config property.
         * @config {ToolConfig|Core.widget.Tool}
         */
        recollapseTool : {
            type       : 'collapsetool',
            cls        : 'b-recollapse',
            collapsify : 'overlay',

            handler() {
                // NOTE: As a tool, our this pointer is the Panel so we use it to access the current collapser
                this.collapsible?.toggleReveal();
            }
        }
    };

    static delayable = {
        doAutoClose : 0
    };

    changeAutoClose(autoClose) {
        // Boolean converted to boolean using valueOf()
        if (typeof autoClose?.valueOf() === 'boolean') {
            autoClose = {
                mousedown : autoClose,
                mouseout  : autoClose,
                focusout  : autoClose
            };
        }
        else {
            // Allow pointer events to be specified too
            for (const propName in autoClose) {
                if (propName.startsWith('pointer')) {
                    autoClose[propName.replace('pointer', 'mouse')] = autoClose[propName];
                    delete autoClose[propName];
                }
            }
        }

        // If the selector is specifying what elements to *not* close on, we need to
        // check for matches against the selector *within* the negation to skip closing.
        // Our selector is now a whitelist rather than a blacklist. The whitelistTarget method
        // needs to know this.
        if (autoClose?.mousedown?.startsWith?.(':not(')) {
            this.negatedSelector = true;
            autoClose.mousedown = autoClose.mousedown.slice(5, -1);
        }
        return autoClose;
    }

    doAutoClose() {
        this.toggleReveal(false);
    }

    updateAutoCloseDelay(delay) {
        const { doAutoClose } = this;

        if (!(doAutoClose.suspended = delay == null || delay < 0)) {
            doAutoClose.delay = delay;
            doAutoClose.immediate = !delay;
        }
    }

    changeRecollapseTool(tool) {
        const
            me = this,
            { panel } = me;

        if (me.isConfiguring || me.isDestroying || !panel || panel.isDestroying) {
            return tool;
        }

        panel.tools = {
            recollapse : tool
        };
    }

    beforeCollapse(operation) {
        if (super.beforeCollapse(operation) === false) {
            return false;
        }

        if (this.panel.revealed) {
            operation.animation = null;
        }
    }

    applyHeaderDock(collapsed, flush = true) {
        this.panel?.recompose();

        super.applyHeaderDock(collapsed, flush);
    }

    collapseBegin(operation) {
        const
            me = this,
            { collapseDir, innerElement } = me,
            { animation } = operation,
            { collapseTool, panel } = me;

        me.configuredWidth = panel._lastWidth;
        me.configuredHeight = panel._lastHeight;

        me.applyHeaderDock(true);

        // const innerElementRect = me.lockInnerSize();
        me.lockInnerSize();

        collapseTool?.addCls('b-collapsed');

        if (animation) {
            panel.addCls('b-collapsing');

            animation.element = innerElement;
            animation.translate = translateByDir[collapseDir];
            operation.animation = Animator.run(animation);
        }
    }

    onComplete(action) {
        super.onComplete(action);

        const
            me          = this,
            { panel }   = me,
            { element } = panel;

        me.autoCloseLeaveDetacher = me.autoCloseLeaveDetacher?.();
        me.autoCloseFocusDetacher = me.autoCloseFocusDetacher?.();
        me.autoCloseClickDetacher = me.autoCloseClickDetacher?.();

        // The act of hiding the revealed panel ("unrevealing") causes a mouseleave event (once the panel slides out
        // from under the cursor) and that starts the autoClose timer. If the user then reveals the panel again within
        // the 1sec delay (by default), the autoClose timer will still fire and unreveal the panel.
        me.doAutoClose.cancel();

        if (action === 'reveal') {
            if (me.autoClose.mouseout) {
                // Only listen for mouseleave to close if we contain focus.
                // If we do not, then we have been revealed using the API from some other
                // part of the UI, so mouseleave closing would not be appropriate.
                if (panel.containsFocus) {
                    me.autoCloseLeaveDetacher = EventHelper.on({
                        element,
                        mouseenter : ev => {
                            me.doAutoClose.cancel();
                        },
                        mouseleave : ev => {
                            me.doAutoClose();
                        }
                    });
                }
            }

            if (me.autoClose.focusout) {
                // If we lose focus to outside the panel, close it
                me.autoCloseFocusDetacher = panel.ion({
                    focusout : () => {
                        // Prior handlers may have moved focus back into the panel
                        // So check the real focus state, not only the fact that focusout occurred
                        if (!panel.bodyElement.matches(':focus-within')) {
                            me.doAutoClose.now();
                        }
                    }
                });
            }

            if (me.autoClose.mousedown) {
                me.autoCloseClickDetacher = EventHelper.on({
                    element   : document.body,
                    thisObj   : panel,
                    mousedown : ev => {
                        const { target } = ev;

                        // The string selector case.
                        // Only continue to close if the target matches the selector
                        if (typeof me.autoClose.mousedown === 'string' && me.whitelistTarget(target)) {
                            ev.preventDefault();
                            return;
                        }
                        // If it's a click outside of the revealed Panel, but *not* on the element which
                        // was active when the reveal was done (because that's the toggle button)
                        // then unreveal.
                        if (!panel.owns(target) && !me.revealer?.contains(target) && me.autoCloseDelay != null) {
                            me.doAutoClose.now();
                        }
                    }
                });
            }
        }

        // Force a reflow for initial collapse, to prevent an initial transition from being mistakenly applied
        // (it never visually transitions, but it interferes with expanding directly after creation)
        if (!me.hasPainted && action === 'collapse') {
            me.innerElement.getBoundingClientRect();
        }
    }

    whitelistTarget(element) {
        const result = element.closest(this.autoClose.mousedown);

        return this.negatedSelector ? Boolean(result) : !result;
    }

    expandBegin(operation) {
        const
            me = this,
            { animation } = operation,
            { collapseDir, collapseTool, innerElement, panel } = me;

        panel.removeCls('b-collapsed', 'b-collapsing');
        me.restoreConfiguredSize();
        me.lockInnerSize(false);
        me.lockInnerSize();

        collapseTool?.removeCls('b-collapsed');

        if (animation) {
            panel.addCls('b-collapsed', 'b-expanding');

            animation.element = innerElement;
            animation.translate = {
                from : translateByDir[collapseDir].to,
                to   : translateByDir[collapseDir].from
            };

            operation.animation = Animator.run(animation);
        }
    }

    expandEnd(operation) {
        super.expandEnd(operation);

        const { panel } = this;

        if (operation.completed) {
            panel.revealed = false;
        }

        panel.removeCls('b-expanding');
    }

    expandRevert(operation) {
        super.expandRevert(operation);

        this.panel.addCls('b-expanding');
    }

    get innerElement() {
        return this.panel.overlayElement;
    }

    get innerSizeElement() {
        return this.panel.element;
    }

    get toolsConfig() {
        const
            me = this,
            { direction } = me,
            config = super.toolsConfig,
            tool = me.recollapseTool;

        if (tool) {
            return {
                ...config,

                recollapse : ObjectHelper.assign({
                    direction : direction.toLowerCase()
                }, tool)
            };
        }

        return config;
    }

    lockInnerSize(lock = true) {
        const
            me = this,
            { panel } = me,
            panelRect = lock && panel.rectangle(),  // must read this before we call super
            inset = lock ? [0, 0, 0, 0] : '',
            // now we can call super:
            innerRect = super.lockInnerSize(lock);

        // The panel overlay is visible because we switch to "overflow:visible" in collapsed state. By doing this,
        // however, the header animation undesirably escapes as well. Fortunately, we can use the clip-path to hide
        // this by only allowing the desired side to escape while all other sides remain clipped. Even more fortunate
        // for us is that clip-path is expressed as an inset from the normal rectangle of the element (so we don't
        // need to adjust it if the collapsed panel is resized), and further, unlike CSS path style, clip-path works
        // for all elements not only absolutely positioned ones.
        if (lock) {
            // <remove-on-release>
            // TODO: see if there's a way to read the box-shadow style to pick up the right value (10 is the default)
            // </remove-on-release>
            inset[collapseExposeEdge[me.collapseDir]] = `-${panelRect[me.collapseDim] + 10}px`;
        }

        panel.element.style.clipPath = lock ? `inset(${inset.join(' ')})` : '';

        return innerRect;
    }

    onOverlayTransitionDone(ev) {
        const
            me = this,
            { panel } = me;

        if (ev.srcElement === panel.overlayElement && me.revealing) {
            // Clear the fallback timeout since transition completed normally
            me.clearTimeout(me.revealTimeout);

            me.revealing = false;

            me.onComplete(panel.revealed ? 'reveal' : 'unreveal');
        }
    }

    onRevealerClick() {
        this.toggleReveal();
    }

    /**
     * Toggles the revealed state of the Panel to match the passed boolean flag.
     * @param {Boolean} [state]  If not specified, this method toggles current state. Otherwise, pass `true` to reveal
     * the overlay, or `false` to hide it.
     */
    toggleReveal(state) {
        const
            me          = this,
            { panel }   = me,
            { element } = panel;

        if (panel.collapsed) {
            if (state == null) {
                state = !panel.revealed;
            }

            if (panel.revealed !== state && panel.trigger('beforeToggleReveal', { reveal : state }) !== false) {
                // Focus on reveal
                if (state) {
                    const activeElement = DomHelper.getActiveElement(element);
                    if (activeElement === document.body) {
                        me.revealer = null;
                        panel.focus();
                    }
                    else {
                        me.revealer = activeElement;
                    }

                    // Clear any inline collapsed size that was set during non-animated collapse
                    // This allows CSS (e.g. --b-drawer-size) to control the revealed size
                    element.style[this.collapseDim] = '';
                }

                // This is essentially a hide, so move focus back to whence it came
                if (!state && element.matches(':focus-within')) {
                    panel.revertFocus(true);
                }
                me.revealing = true;
                panel.revealed = state;
                // Flush pending recompose to apply the class change immediately before forcing reflow
                panel.recompose.flush();
                element.getBoundingClientRect(); // force reflow so that animation works

                // Fallback timeout in case transitionend doesn't fire (reduced motion, headless browser, etc.)
                // CSS transition is typically ~300ms, so 500ms provides a safe buffer
                me.revealTimeout = me.setTimeout(() => {
                    if (me.revealing) {
                        me.onOverlayTransitionDone({ srcElement : panel.overlayElement });
                    }
                }, 500);
            }
        }
    }

    updateRevealing(value) {
        const
            me        = this,
            horzDirRe = /left|right/i,
            { panel } = me,
            dim       = horzDirRe.test(me.collapseDir) ? 'height' : 'width';

        if (panel) {
            me.innerElement.style[dim] = '0px';
            me.innerElement.style[`min-${dim}`] = '100%';

            panel.toggleCls('b-panel-overlay-revealing', value);
        }
    }

    wrapCollapser(key, body) {
        const
            me = this,
            { collapseDir, panel } = me,
            { expandedHeaderDock, header, uiClassList } = panel,
            recollapse = panel.tools?.recollapse,
            [before, after] = me.splitHeaderItems({ as : 'element', dock : me.collapseDock }),
            horz = dockIsHorz[expandedHeaderDock],
            title = panel.hasHeader ? (panel.title || header?.title || '\xA0') : null;

        if (recollapse) {
            recollapse.direction = collapseDir;
        }

        return [
            'overlayElement',
            {
                class : {
                    ...uiClassList,
                    [`b-panel-overlay-header-${expandedHeaderDock}`] : 1,
                    [`b-panel-overlay-${collapseDir}`]               : 1,
                    [`b-${horz ? 'h' : 'v'}box`]                     : 1,
                    'b-panel-overlay'                                : 1,
                    'b-box-center'                                   : 1
                },

                // internalListeners is not correct for element listeners in domConfigs
                listeners : {  // eslint-disable-line bryntum/no-listeners-in-lib
                    transitionend    : ev => me.onOverlayTransitionDone(ev),
                    transitioncancel : ev => me.onOverlayTransitionDone(ev)
                },

                children : {
                    overlayHeaderElement : title && {
                        tag   : 'header',
                        class : new DomClassList({
                            ...uiClassList,
                            [`b-dock-${expandedHeaderDock}`] : 1,
                            'b-panel-header'                 : 1,
                            'b-panel-overlay-header'         : 1
                        }, header?.cls),

                        children : [
                            ...before,
                            {
                                reference : 'overlayTitleElement',
                                html      : title,
                                class     : {
                                    ...uiClassList,
                                    [`b-align-${header?.titleAlign || 'start'}`] : 1,
                                    'b-header-title'                             : 1
                                }
                            },
                            ...after
                        ]
                    },

                    [key] : body
                }
            }
        ];
    }
}

// Register this widget type with its Factory
PanelCollapserOverlay.initClass();
