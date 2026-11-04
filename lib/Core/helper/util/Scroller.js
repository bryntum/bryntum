import Base from '../../Base.js';
import Rectangle from './Rectangle.js';
import Delayable from '../../mixin/Delayable.js';
import Events from '../../mixin/Events.js';
import DomHelper from '../DomHelper.js';
import FunctionHelper from '../FunctionHelper.js';
import IdHelper from '../IdHelper.js';
import BrowserHelper from '../BrowserHelper.js';
import EventHelper from '../EventHelper.js';
import ResizeMonitor from '../ResizeMonitor.js';
import DomDataStore from '../../data/DomDataStore.js';
import ArrayHelper from '../ArrayHelper.js';

DomHelper.loadStylesheet('Core/helper/util/Scroller.css');

// import Stylesheet from './Scroller.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Scroller');

/**
 * @module Core/helper/util/Scroller
 */

const
    scrollLiterals       = {
        auto            : 'auto',
        true            : 'auto',
        false           : 'hidden',
        'hidden-scroll' : 'auto',
        clip            : BrowserHelper.supportsOverflowClip ? 'clip' : 'hidden'
    },
    scrollerCls          = 'b-widget-scroller',
    defaultScrollOptions = {
        block : 'nearest'
    },
    immediatePromise     = Promise.resolve(),
    scrollPromise        = element => new Promise(resolve => (element === document.documentElement ? globalThis : element).addEventListener('scroll', resolve, { once : true })),
    xAxis                = {
        x : 1
    },
    isScrollableStyle = {
        auto   : 1,
        scroll : 1
    },
    isScrollableConfig = {
        true            : 1,
        auto            : 1,
        scroll          : 1,
        'hidden-scroll' : 1
    },
    allScroll = {
        overflowX : 'auto',
        overflowY : 'auto'
    },
    normalizeEdgeOffset = edgeOffset => {
        let top, bottom, start, end;

        if (!edgeOffset) {
            top = bottom = start = end = 0;
        }
        else if (typeof edgeOffset === 'number') {
            top = bottom = start = end = edgeOffset;
        }
        else {
            top = edgeOffset.top ?? 0;
            bottom = edgeOffset.bottom ?? 0;
            start = edgeOffset.start ?? 0;
            end = edgeOffset.end ?? 0;
        }

        return {
            block  : { start : top, end : bottom },
            inline : { start, end }
        };
    };

/**
 * Animation options for scrolling.
 *
 * @typedef {Object} AnimateScrollOptions
 * @property {Number} [duration] The number of milliseconds to animate over.
 * @property {String} [easing] The name of an easing function.
 */

/**
 * Options accepted by some scroll functions. Note that not all options are valid for all functions.
 *
 * @typedef {Object} BryntumScrollOptions
 * @property {'start'|'end'|'center'|'nearest'} [block] How far to scroll the element in the block (`Y`) axis.
 * @property {'start'|'end'|'center'|'nearest'} [inline] How far to scroll the element in the inline (`X`) axis.
 * @property {Number} [edgeOffset] edgeOffset A margin around the element or rectangle to bring into view.
 * @property {AnimateScrollOptions|Boolean|Number} [animate] Set to `true` to animate the scroll by 300ms,
 * or the number of milliseconds to animate over, or an animation config object.
 * @property {Boolean|Function|String} [highlight] Set to `true` to highlight the element when it is in view.
 * May be a function, or the name of a method which is called passing the element, to provide customized highlighting.
 * @property {Boolean} [focus] Set to `true` to focus the element when it is in view.
 * @property {Boolean} [x] Pass as `false` to disable scrolling in the `X` axis.
 * @property {Boolean} [y] Pass as `false` to disable scrolling in the `Y` axis.
 * @property {Number} [maxWidth] How much of the target's width to bring into view if the target is wider.
 * @property {Number} [maxHeight] How much of the target's height to bring into view if the target is taller.
 * @property {Core.helper.util.Rectangle} [viewport] An optional definition of the scrollable viewport
 * if it has to differ from the actual client area of this Scroller's {@link #config-element}.
 */

/**
 * Encapsulates scroll functionality for a Widget. All requests for scrolling and scrolling information
 * must go through a Widget's {@link Core.widget.Widget#config-scrollable} property.
 *
 * ```javascript
 * const grid = new Grid({
 *     scrollable : {
 *         overflowY : true
 *     }
 * });
 *
 * // Scroll programmatically
 * grid.scrollable.scrollTo(0, 500);
 * grid.scrollable.scrollIntoView(targetElement);
 * ```
 *
 * ## See also
 *
 * - {@link Core.widget.Widget#config-scrollable} - How to configure scrolling on a widget
 *
 * @mixes Core/mixin/Events
 * @mixes Core/mixin/Delayable
 * @extends Core/Base
 */
export default class Scroller extends Delayable(Events(Base)) {
    static $name = 'Scroller';

    static configurable = {
        /**
         * The widget which is to scroll.
         * @config {Core.widget.Widget}
         */
        widget : null,

        /**
         * The element which is to scroll. Defaults to the {@link Core.widget.Widget#property-overflowElement} of
         * the configured {@link #config-widget}
         * @config {HTMLElement}
         */
        element : {
            $config : {
                nullify : true
            },
            value : null
        },

        /**
         * The element, or a selector which identifies a descendant element whose size
         * will affect the scroll range.
         * @config {HTMLElement|String}
         */
        contentElement : {
            $config : {
                nullify : true
            },
            value : null
        },

        /**
         * How to handle overflowing in the `X` axis.
         * May be:
         * * `'auto'`
         * * `'visible'`
         * * `'hidden'`
         * * `'scroll'`
         * * `'clip'`
         * * `'hidden-scroll'` Meaning scrollable from the UI but with no scrollbar,
         * for example a grid header. Only on platforms which support this feature.
         * * `true` - meaning `'auto'`
         * * `false` - meaning `'hidden'`
         * @config {'hidden'|'auto'|'visible'|'scroll'|'clip'|'hidden-scroll'|Boolean}
         */
        overflowX : null,

        /**
         * How to handle overflowing in the `Y` axis.
         * May be:
         * * `'auto'`
         * * `'visible'`
         * * `'hidden'`
         * * `'scroll'`
         * * `'clip'`
         * * `'hidden-scroll'` Meaning scrollable from the UI but with no scrollbar.
         * Only on platforms which support this feature.
         * * `true` - meaning `'auto'`
         * * `false` - meaning `'hidden'`
         * @config {'hidden'|'auto'|'visible'|'scroll'|'clip'|'hidden-scroll'|Boolean}
         */
        overflowY : null,

        /**
         * If configured as `true`, the {@link #config-element} is not scrolled but is translated using CSS
         * translate when controlled by this class's API. Scroll events are fired when the element is translated.
         * @default
         * @config {Boolean}
         */
        translate : null,

        /**
         * Configures the [`scroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)
         * for the scrolling element. By default, this is controlled by CSS (i.e., `'auto'`).
         * @prp {'smooth'|'instant'|'auto'}
         * @default 'auto'
         * @internal
         */
        behavior : null,

        x : 0,
        y : 0,

        rtlSource : null,

        /**
         * Configure as `true` to immediately sync partner scrollers when being synced by a controlling partner
         * instead of waiting for our own `scroll` event to pass the scroll on to partners.
         * @prp {Boolean}
         * @default false
         */
        propagateSync : null,

        /**
         * CSS selector(s) of sticky elements, or the elements themselves which should be taken into account when scrolling.
         *
         * These are used to identify elements which are sticky and docked to occlude edges of
         * the scrolling element so that the viewport size can be calculated accurately when scrolling.
         * @config {String|String[]|HTMLElement|HTMLElement[]}
         * @internal
         */
        stickies : null,

        scrollWidth : null,

        /**
         * The CSS class to add to the {@link #config-element} when it is being scrolled.
         * @config {String}
         * @default 'b-scrolling'
         */
        scrollingCls : 'b-scrolling'
    };

    static get delayable() {
        return {
            onScrollEnd : {
                type  : 'buffer',
                delay : 100
            }
        };
    }

    /**
     * Fired when scrolling happens on this Scroller's element. The event object is a native `scroll` event
     * with the described extra properties injected.
     * @event scroll
     * @param {Core.widget.Widget} widget The owning Widget which has been scrolled.
     * @param {Core.helper.util.Scroller} source This Scroller
     */

    /**
     * Fired when scrolling finished on this Scroller's element. The event object is the last native `scroll` event
     * fires by the element with the described extra properties injected.
     * @event scrollEnd
     * @param {Core.widget.Widget} widget The owning Widget which has been scrolled.
     * @param {Core.helper.util.Scroller} source This Scroller
     */

    /**
     * The `overflow-x` setting for the widget. `true` means `'auto'`.
     * @member {Boolean|String} overflowX
     */

    /**
     * The `overflow-y` setting for the widget. `true` means `'auto'`.
     * @member {Boolean|String} overflowY
     */

    get isRTL() {
        return Boolean(this.rtlSource?.rtl);
    }

    syncOverflowState() {
        // No child nodes means no layout, so no scrollbars
        if (!this.element.childNodes.length) {
            return;
        }
        const
            me           = this,
            {
                hasOverflowX,
                hasOverflowY,
                element,
                owner
            }            = me,
            // Owners that have domain knowledge can overrule measuring to potentially avoid a forced reflow.
            // $resizing check is to avoid triggering owner width caching during a resize, because then owner won't be
            // able to detect its own size change.
            x            = me.hasOverflowX = me.$resizing ? element.scrollWidth > element.clientWidth : owner?.overflowingHorizontally ?? element.scrollWidth > element.clientWidth,
            y            = me.hasOverflowY = me.$resizing ? element.scrollHeight > element.clientHeight : owner?.overflowingVertically ?? element.scrollHeight > element.clientHeight;

        if (hasOverflowX !== x || hasOverflowY !== y) {
            element.classList.toggle('b-horizontal-overflow', x);
            element.classList.toggle('b-vertical-overflow', y);

            if (!me.isConfiguring) {
                /**
                 * Fired when either the X or the Y axis changes from not showing a space-consuming scrollbar
                 * to showing a space-consuming scrollbar or vice versa.
                 *
                 * *_Does not fire on platforms which show overlayed scrollbars_*
                 * @event overflowChange
                 * @param {Boolean} x `true` if the X axis overflow, `false` otherwise.
                 * @param {Boolean} y `true` if the Y axis overflow, `false` otherwise.
                 * @internal
                 */
                me.trigger('overflowChange', { x, y });
            }
        }

        // A partner sync that arrived while this scroller's scroll range lagged behind the partner's was clamped
        // by the DOM (see sync()). Now that the range may have caught up, re-apply the remembered position. A
        // successful assignment fires a scroll event which clears the pending position, making this one-shot
        if (me.$pendingPartnerX != null && x) {
            const pendingX = me.$pendingPartnerX;

            if (me.x !== pendingX) {
                const { controllingPartnerX } = me;

                me.x = pendingX;

                // Not an explicit move, the partner who commanded the position stays in command (see updateX())
                me.controllingPartnerX = controllingPartnerX;
            }
            else {
                me.$pendingPartnerX = null;
            }
        }
    }

    /**
     * Returns `true` if there is overflow in the specified axis.
     * @param {'x'|'y'} [axis='y'] The axis to check scrollbar for. Note that this is subtly different to asking
     * whether an axis is showing a space-consuming scrollbar, see {@link #function-hasScrollbar}.
     * @internal
     */
    hasOverflow(axis = 'y') {
        const
            me              = this,
            overflowSetting = me[`overflow${axis.toUpperCase()}`],
            otherAxis       = me[`overflow${axis === 'y' ? 'x' : 'y'}`];

        // If there are no space-consuming scrollbars, we will not be recording overflow
        // state on change of scrollbars (There will be no resize event when overflow state changes).
        // If we're not overflow:auto in that axis there will be no resize events from overflow state change.
        // If the other axis won't be changing size on scroll change we can't track this.
        if (!DomHelper.scrollBarWidth || !isScrollableConfig[overflowSetting] || otherAxis === 'hidden-scroll') {
            const dimension = axis === 'y' ? 'Height' : 'Width';

            return me[`scroll${dimension}`] > me[`client${dimension}`];
        }

        return me[`hasOverflow${axis.toUpperCase()}`];
    }

    /**
     * Returns `true` if there is a *space-consuming* scrollbar controlling scroll in the specified axis.
     * @param {'x'|'y'} [axis='y'] The axis to check scrollbar for. Note that this is subtly different to asking
     * whether an axis *has any* overflow, see {@link #function-hasOverflow}.
     * @internal
     */
    hasScrollbar(axis = 'y') {
        const { element } = this;

        if (element && DomHelper.scrollBarWidth) {
            const
                vertical   = axis === 'y',
                dimension  = vertical ? 'Width' : 'Height',
                clientSize = element[`client${dimension}`],
                borderSize = parseInt(DomHelper.getStyleValue(element, `border${vertical ? 'Left' : 'Top'}Width`)) +
                    parseInt(DomHelper.getStyleValue(element, `border${vertical ? 'Right' : 'Bottom'}Width`)),
                difference = (element[`offset${dimension}`] - borderSize) - clientSize;

            // If the difference between the content width and the client width is
            // scrollBarWidth, then we have a scrollbar
            return Math.abs(difference - DomHelper.scrollBarWidth) < 2;
        }
    }

    /**
     * Partners this Scroller with the passed scroller in order to sync the scrolling position in the passed axes
     * @param {Core.helper.util.Scroller} otherScroller
     * @param {String|Object} [axes='x'] `'x'` or `'y'` or `{x: true/false, y: true/false}` axes to sync
     * @param {Boolean} [axes.x] Sync horizontal scroll
     * @param {Boolean} [axes.y] Sync vertical scroll
     */
    addPartner(otherScroller, axes = xAxis) {
        const me = this;

        //<debug>
        if (!(otherScroller instanceof Scroller)) {
            throw new Error('Scroller partner must be another Scroller');
        }
        //</debug>
        if (typeof axes === 'string') {
            axes = {
                [axes] : 1
            };
        }

        if (!me.partners) {
            me.partners = {};
        }

        me.partners[otherScroller.id] = {
            scroller : otherScroller,
            axes
        };

        // Initial sync of the other axis to match our current state
        if (axes.x) {
            otherScroller.x = me.x;
        }
        if (axes.y) {
            otherScroller.y = me.y;
        }

        // It's a mutual relationship - the other scroller partners with us.
        if (!otherScroller.isPartneredWith(me)) {
            otherScroller.addPartner(me, axes);
        }
    }

    eachPartner(fn) {
        const { partners } = this;

        if (partners) {
            Object.values(partners).forEach(fn);
        }
    }

    /**
     * Breaks the link between this Scroller and the passed Scroller set up by the
     * {@link #function-addPartner} method.
     * @param {Core.helper.util.Scroller} otherScroller The Scroller to unlink from.
     */
    removePartner(otherScroller) {
        if (otherScroller && this.isPartneredWith(otherScroller)) {
            delete this.partners[otherScroller.id];
            otherScroller.removePartner(this);
        }
    }

    isPartneredWith(otherScroller) {
        return Boolean(this.partners?.[otherScroller.id]);
    }

    /**
     * Breaks the link between this Scroller and all other Scrollers set up by the
     * {@link #function-addPartner} method.
     * @internal
     */
    clearPartners() {
        if (this.partners) {
            Object.values(this.partners).forEach(otherScroller => otherScroller.scroller.removePartner(this));
        }
    }

    /**
     * Scrolls the passed element or {@link Core.helper.util.Rectangle} into view according to the passed options.
     * @param {HTMLElement|Core.helper.util.Rectangle} element The element or a Rectangle in document space to scroll
     * into view.
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A promise which is resolved when the element has been scrolled into view.
     */
    async scrollIntoView(element, options = defaultScrollOptions) {
        const
            me                 = this,
            { isRectangle }    = element,
            originalRect       = isRectangle ? element : Rectangle.from(element),
            { xDelta, yDelta } = me.getDeltaTo(element, options),
            result             = me.scrollBy(xDelta, yDelta, options);

        if (options.highlight || options.focus) {
            (xDelta || yDelta) && await result;
            element = isRectangle
                ? originalRect.translate(-xDelta, -yDelta)
                : options.elementAfterScroll?.() ?? element;

            if (options.highlight) {
                if (options.highlight instanceof Element) {
                    DomHelper.highlight(options.highlight, me);
                }
                // Not coercible to a number means its a function or name of a function
                else if (isNaN(options.highlight)) {
                    const defaultScope = me.widget || me;
                    defaultScope.callback(options.highlight, defaultScope, [element]);
                }
                // Otherwise, it's truthy or falsy
                else {
                    DomHelper.highlight(element, me);
                }
            }
            if (options.focus) {
                element.focus({
                    preventScroll : true
                });
            }
        }
        return result;
    }

    /**
     * Scrolls the passed element into view according to the passed options.
     * @param {HTMLElement} element The element in document space to scroll into view.
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A promise which is resolved when the element has been scrolled into view.
     */
    static async scrollIntoView(element, options = defaultScrollOptions, rtl = false) {
        const
            target         = Rectangle.from(element),
            animate        = (typeof options === 'object') ? options.animate : options,
            globalScroller = Scroller._globalScroller || (Scroller._globalScroller = new Scroller()),
            deltas         = [];

        globalScroller.rtlSource = { rtl };

        let totalX = 0, totalY = 0, result;

        // Allow caller to minimize the dimensions of the target rectangle so that
        // scrolling can scroll just the important part of an element into view.
        if (options.maxWidth) {
            target.width = Math.min(target.width, options.maxWidth);
            options.maxWidth = null;
        }
        if (options.maxHeight) {
            target.height = Math.min(target.height, options.maxHeight);
            options.maxHeight = null;
        }

        // Build up all the scroll deltas necessary to bring the requested element into view
        for (let ancestor = element.parentNode; ancestor.nodeType === Node.ELEMENT_NODE; ancestor = ancestor.parentNode) {
            if (ancestor === document.body && ancestor !== document.scrollingElement) {
                continue;
            }
            // The <html> element, although it scrolls is overflow:visible by default.
            const
                style = ancestor === document.scrollingElement ? allScroll : ancestor.ownerDocument.defaultView.getComputedStyle(ancestor),
                s    = DomDataStore.get(ancestor, 'scroller');

            // If the ancestor overflows in a dimension we are being asked to scroll in
            // Accumulate a scroll command for the ancestor.
            if (
                (options.y !== false && (s?.hasOverflowY || isScrollableStyle[style.overflowY] && ancestor.scrollHeight > ancestor.clientHeight)) ||
                (options.x !== false && (s?.hasOverflowX || isScrollableStyle[style.overflowX] && ancestor.scrollWidth > ancestor.clientWidth))
            ) {
                let scroller = globalScroller;

                // Use the Scroller instance which is managing that scrolling element if possible
                if (s) {
                    scroller = s;
                }
                else {
                    // Global Scrollable
                    globalScroller.element = ancestor;

                    // In case same element used as last time and didn't make it to the updater.
                    globalScroller.positionDirty = true;
                }

                // See if the target is outside of this ancestor
                const { xDelta, yDelta } = scroller.getDeltaTo(target, options);

                if (xDelta || yDelta) {
                    deltas.push({
                        element : ancestor,
                        x       : ancestor.scrollLeft,
                        y       : ancestor.scrollTop,
                        xDelta,
                        yDelta
                    });
                    target.translate(-xDelta, -yDelta);
                    totalX += xDelta;
                    totalY += yDelta;
                }
            }
        }

        // If scrolling was found to be necessary
        if (deltas.length) {
            const
                absX = Math.abs(totalX),
                absY = Math.abs(totalY);

            let duration = animate && (typeof animate === 'number' ? animate : (typeof animate.duration === 'number' ? animate.duration : 300));

            // Only go through animation if there is significant scrolling to do.
            if (duration && (absX > 10 || absY > 10)) {
                // For small distances, constrain duration
                if (Math.max(absX, absY) < 50) {
                    duration = Math.min(duration, 500);
                }

                result = globalScroller.scrollAnimation = FunctionHelper.animate(duration, progress => {
                    const isEnd = progress === 1;

                    for (const { element, x, y, xDelta, yDelta } of deltas) {
                        globalScroller.element = element;

                        if (xDelta) {
                            globalScroller.x = Math[rtl ? 'min' : 'max'](x + (isEnd ? xDelta : Math.round(xDelta * progress)), 0);
                        }
                        if (yDelta) {
                            globalScroller.y = Math.max(y + (isEnd ? yDelta : Math.round(yDelta * progress)), 0);
                        }
                    }
                }, null, animate.easing);
                result.then(() => {
                    globalScroller.scrollAnimation = null;
                });
            }
            // No animation
            else if (absX >= 1 || absY >= 1) {
                for (const { element, xDelta, yDelta } of deltas) {
                    element.scrollTop += yDelta;
                    element.scrollLeft += xDelta;
                }
                result = scrollPromise(deltas[deltas.length - 1].element);
            }
        }

        // Postprocess element after scroll.
        if (options.highlight || options.focus) {
            await result;

            if (options.highlight) {
                // Not coercible to a number means it's a function or name of a function
                if (isNaN(options.highlight)) {
                    globalScroller.callback(options.highlight, null, [element]);
                }
                // Otherwise, it's truthy or falsy
                else {
                    DomHelper.highlight(element, globalScroller);
                }
            }
            if (options.focus) {
                element.focus({
                    preventScroll : true
                });
            }
        }

        return result;
    }

    /**
     * Scrolls by the passed deltas according to the passed options.
     * @param {Number} [xDelta=0] How far to scroll along the X axis.
     * @param {Number} [yDelta=0] How far to scroll along the Y axis.
     * @param {Object|Boolean} [options] How to scroll. May be passed as `true` to animate.
     * @param {Boolean} [options.silent] Set to `true` to suspend `scroll` events during scrolling.
     * @param {AnimateScrollOptions|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @returns {Promise} A promise which is resolved when the scrolling has finished.
     */
    scrollBy(xDelta = 0, yDelta = 0, options = defaultScrollOptions) {
        const
            me               = this,
            { scrollingCls } = me,
            animate          = (typeof options === 'object') ? options.animate : options,
            absX             = Math.abs(xDelta),
            absY             = Math.abs(yDelta);

        if (me.scrollAnimation) {
            me.scrollAnimation.cancel();
            me.scrollAnimation = null;
        }

        // Only set the flag if there is going to be scrolling done.
        // It is cleared by the scrollEnd handler, so there must be scrolling.
        if (xDelta || yDelta) {
            me.silent = options.silent;
        }

        let duration = animate && (typeof animate === 'number' ? animate : (typeof animate.duration === 'number' ? animate.duration : 300));

        // Only go through animation if there is significant scrolling to do.
        if (duration && (absX > 10 || absY > 10)) {
            const { x, y } = me;
            let lastX = x,
                lastY = y;

            // For small distances, constrain duration
            if (Math.max(absX, absY) < 50) {
                duration = Math.min(duration, 500);
            }

            me.scrollAnimation = FunctionHelper.animate(duration, progress => {
                const isEnd = progress === 1;
                if (xDelta) {
                    // If the user, or another process has substantially changed the position since last time, abort.
                    // Unless called with the force option to proceed regardless.
                    if (Math.abs(me.x - lastX) > 1 && !options.force) {
                        return me.scrollAnimation?.cancel();
                    }
                    me.x = Math.max(x + (isEnd ? xDelta : Math.round(xDelta * progress)), 0);
                }
                if (yDelta) {
                    // If the user, or another process has substantially changed the position since last time, abort.
                    // Unless called with the force option to proceed regardless.
                    if (Math.abs(me.y - lastY) > DomHelper.devicePixelRatio && !options.force) {
                        return me.scrollAnimation?.cancel();
                    }
                    me.y = Math.max(y + (isEnd ? yDelta : Math.round(yDelta * progress)), 0);
                }
                // Store actual position from DOM
                lastX = me.x;
                lastY = me.y;
            }, me, animate.easing);

            me.isScrolling = true;
            scrollingCls && me.element.classList.add(scrollingCls);

            me.scrollAnimation.then(() => {

                if (!me.isDestroyed) {
                    me.element.classList.remove(scrollingCls);
                    me.isScrolling = false;
                    me.scrollAnimation = null;
                }
            });

            return me.scrollAnimation;
        }
        else {
            if (xDelta || yDelta) {
                const { x : xBefore, y : yBefore } = me;

                // Before changing x / y values, we need to check if the absolute rounded difference between previous x / y values and current values are changed,
                // otherwise it jumps in updateX function (Scroller.js), where scrollStart event is correctly triggered but, after few lines of code,
                // because of no difference between old and current rounded value, no logic will be executed and then no scrollEnd event gets triggered.
                // Instead, checking now for existing difference between previous and current values, ensures consistency between scrollStart / scrollEnd events.
                if (Math.round(absX) >= 1) {
                    me.x += xDelta;
                }
                if (Math.round(absY) >= 1) {
                    me.y += yDelta;
                }

                // Another change check for the possibility that setting me.x doesn't really scroll any significant
                // amount of pixels.
                if (me.x !== xBefore || me.y !== yBefore) {
                    return scrollPromise(me.element);
                }
            }
            return immediatePromise;
        }
    }

    /**
     * Scrolls to the passed position according to the passed options.
     * @param {Number} [toX=0] Where to scroll to in the X axis.
     * @param {Number} [toY=0] Where to scroll to in the Y axis.
     * @param {Object|Boolean} [options] How to scroll. May be passed as `true` to animate.
     * @param {AnimateScrollOptions|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @returns {Promise} A promise which is resolved when the scrolling has finished.
     */
    async scrollTo(toX, toY, options) {
        const
            { x, y } = this,
            xDelta   = toX == null ? 0 : toX - x,
            yDelta   = toY == null ? 0 : toY - y;

        this.scrollingToCenter = options?.scrollingToCenter;

        return this.scrollBy(xDelta, yDelta, options);
    }

    doDestroy() {
        const me = this;

        if (me._element) {
            me._element.removeEventListener('scroll', me.scrollHandler);
            me.wheelListenerRemover?.();
            if (me._contentElement) {
                ResizeMonitor.removeResizeListener(me.contentElement, me.resizeHandler);
            }
            ResizeMonitor.removeResizeListener(me._element, me.resizeHandler);
        }

        me.scrollAnimation?.cancel();

        Object.values(me.partners || {}).forEach(({ scroller }) => scroller.removePartner(me));

        super.doDestroy();
    }

    /**
     * Respond to style changes to monitor scroll *when this Scroller is in `translate: true` mode.*
     * @param {Object[]} mutations The ElementMutation records.
     * @private
     */
    onElMutation(mutations) {
        const
            me     = this,
            [x, y] = DomHelper.getTranslateXY(me.element);

        // If the mutation was due to a change in the translateX/Y styles, this is
        // a scroll event, so inform observers and partners
        if (me._x !== -x || me.y !== -y) {
            const scrollEvent = new CustomEvent('scroll', { bubbles : true });

            Object.defineProperty(scrollEvent, 'target', {
                get : () => me.element
            });

            me.onScroll(scrollEvent);
        }
    }

    onElResize() {
        const
            me         = this,
            { widget } = me;

        // We only care about the element's size if we are scrollable in some dimension.
        // If the overflow settings ever change, syncOverflowState will be called from the updater.
        if (isScrollableConfig[me.overflowX] || isScrollableConfig[me.overflowY]) {
            // If it's not animating its size, sync immediately
            if (!widget?.isAnimating) {
                me.$resizing = true;
                me.syncOverflowState();
                me.$resizing = false;
            }
            // If it's animating, sync chen it's finished
            else if (widget.findListener('animationend', 'onElResize', me) === -1) {
                widget.ion({
                    animationEnd : 'onElResize',
                    thisObj      : me,
                    once         : true
                });
            }
        }
    }

    onScroll(e) {
        const
            me                        = this,
            { element, scrollingCls } = me;

        if (!me.widget?.isDestroyed) {
            // Read scroll positions from DOM while layout is valid, before any DOM mutations occur
            // scroll event handlers will incur no layout cost when then interrogate x or y now.
            me.refreshPosition();

            // This scroller moved, any position remembered from a clamped partner sync is obsolete (see sync())
            me.$pendingPartnerX = null;

            me.isScrolling = true;

            if (scrollingCls && !element.classList.contains(scrollingCls)) {
                element.classList.add(scrollingCls);
            }

            e.widget = me.widget;

            e.scrollingToCenter = me.scrollingToCenter;

            // If we have the scroll silent flag, do not fire the event.
            if (!me.silent) {
                me.trigger('scroll', e);
            }

            // Keep partners in sync
            me.syncPartners();

            // If this scroll impulse was from a controlling partner, clear that now
            me.controllingPartnerX = me.controllingPartnerY = null;

            // Buffered method will fire in 100ms, unless another scroll event comes round.
            // In which case execution will be pushed out by another 100ms.
            me.onScrollEnd(e);
        }
    }

    /**
     * Syncs all attached scrolling partners with the scroll state of this Scroller.
     * @param {Boolean} force Allow this to sync a partner which is controlling this via a sync.
     * @param {Boolean} [propagate] Propagate any change immediately onwards through
     * further linked partners immediately rather than waiting for our own scroll event.
     * @internal
     */
    syncPartners(force, propagate = this.propagateSync) {
        const me = this;

        // Keep partners in sync
        if (me.partners) {
            me.positionDirty = true;
            Object.values(me.partners).forEach(({ axes, scroller }) => {
                // Don't feed an axis back to the one who's just told us to scroll there.
                // Unless we have assumed command. For example Scheduler timeline infinite scrolling
                // has reset the scroll position and the partner who thinks it's controlling
                // must stay in sync with that reset.
                const syncAxes = force ? axes : {
                    x : axes.x && scroller !== me.controllingPartnerX,
                    y : axes.y && scroller !== me.controllingPartnerY
                };

                // Propagate means update all linked partners immediately rather than scroller reacting
                // to its scroll events to sync its partners. Only bother if the scroller actually changed.
                if ((syncAxes.x || syncAxes.y) && scroller.sync(me, syncAxes) && propagate) {
                    scroller.syncPartners(force, propagate);
                }
            });
        }
    }

    onScrollEnd(e) {
        const me = this;

        if (me.silent) {
            me.silent = false;
        }

        me.trigger('scrollEnd', e);

        me.isScrolling = false;
        me.scrollingToCenter = false;

        // Controlling partner is required for scrollable not to change its partners on scroll. This method is buffered
        // and landing here essentially means that no scrolling has occurred during the onScrollEnd buffer
        // time. We can safely cleanup controlling partner here.
        // https://github.com/bryntum/bryntum/issues/1095
        me.controllingPartnerX = me.controllingPartnerY = null;

        me.element.classList.remove(me.scrollingCls);
    }

    /**
     * Returns the xDelta and yDelta values in an object from the current scroll position to the
     * passed element or Rectangle.
     * @param {HTMLElement|Core.helper.util.Rectangle} element The element or a Rectangle to calculate deltas for.
     * @param {Object} [options] How to scroll.
     * @param {'start'|'end'|'center'|'nearest'} [options.block] How to align the element in the block direction (y axis).
     * @param {'start'|'end'|'center'|'nearest'} [options.inline] How to align the element in the inline direction (x axis).
     * @param {Number} [options.edgeOffset] A margin around the element or rectangle to bring into view.
     * @param {Boolean} [options.x] Pass as `false` to disable scrolling in the `X` axis.
     * @param {Boolean} [options.y] Pass as `false` to disable scrolling in the `Y` axis.
     * @param {Number} [options.maxWidth] How much of the target's width to bring into view if the target is wider.
     * @param {Number} [options.maxHeight] How much of the target's height to bring into view if the target is taller.
     * @param {Boolean} [options.constrainToScrollable=true] Pass as `false` to allow offsets beyond the available scroll range.
     * @param {Boolean} [options.precise] If `true`, return a precise delta, otherwise round it.
     * @param {Core.helper.util.Rectangle} [options.viewport] The scrolling viewport rectangle if it's not the element itself.
     * @returns {Object} `{ xDelta, yDelta }`
     * @internal
     */
    getDeltaTo(element, options) {
        const
            me       = this,
            [x, y]   = me.refreshPosition(),
            {
                precise
            }        = options,
            viewport = options.viewport || me.viewport;

        // If the scroller is not visible, or the element is not in the DOM, return 0 deltas
        if (!viewport) {
            return {
                xDelta : 0,
                yDelta : 0
            };
        }

        const
            edgeOffset   = normalizeEdgeOffset(options.edgeOffset),
            targetRect   = element instanceof Rectangle ? element : Rectangle.from(element);

        let xDelta = options.x === false ? 0 : me.getDelta({
                viewport,
                targetRect,
                edgeOffset : edgeOffset.inline,
                flow       : 'inline',
                targetEdge : options.inline || options.block || 'nearest',
                maxSize    : options.maxWidth,
                precise
            }) * (me.isRTL ? -1 : 1),
            yDelta = options.y === false ? 0 : me.getDelta({
                viewport,
                targetRect,
                edgeOffset : edgeOffset.block,
                flow       : 'block',
                targetEdge : options.block || 'nearest',
                maxSize    : options.maxHeight,
                precise
            });

        // Do not allow deltas which would produce negative scrolling or scrolling past the maxX/Y
        if (options.constrainToScrollable !== false) {
            // When calculating how much delta is necessary to scroll the targetRect to the center
            // constrain that to what is *possible*. If what you are trying to scroll into the
            // center is hard against the right edge of the scroll range, then it cannot scroll
            // to the center, and the result must reflect that even though scroll is self limiting.
            // This is because highlighting the requested "element", if that element is in fact
            // a Rectangle, uses a temporary element placed at the requested region which
            // MUST match where the actual scroll has moved the requested region.
            xDelta = Math.max(Math.min(xDelta, Math.max(me.maxX - x, 0)), -x);
            yDelta = Math.max(Math.min(yDelta, Math.max(me.maxY - y, 0)), -y);
        }

        return {
            xDelta,
            yDelta
        };
    }

    /**
     * Returns the delta to scroll the target rectangle into view in the specified flow direction, "inline" or "block".
     * @param {Object} options
     * @param {Core.helper.util.Rectangle} options.viewport The viewport rectangle.
     * @param {Core.helper.util.Rectangle} options.targetRect The target rectangle.
     * @param {Object} [options.edgeOffset] A margin around the element or rectangle to bring into view.
     * @param {'block'|'inline'} [options.flow] Which dimension we are calculating.
     * @param {'start'|'end'|'center'|'nearest'} [options.targetEdge] How to align the element within the scrolling viewport.
     * @param {Number} [options.maxSize] The maximum size of the target rectangle.
     * @param {Boolean} [options.precise] If `true`, return a precise delta, otherwise round it.
     * @returns {Number}
     * @internal
     */
    getDelta({
        viewport,
        targetRect,
        edgeOffset = { start : 0, end : 0 }, // { start, end }
        flow,                                // 'block'|'inline'
        targetEdge = 'nearest',              // 'start'|'end'|'center'|'nearest',
        maxSize,
        precise
    }) {
        const
            isBlock   = flow === 'block',
            isRTL     = !isBlock && this.isRTL,
            axis      = isBlock ? 'y'      : 'x',
            axisEnd   = isBlock ? 'bottom' : 'right',
            startEdge = isBlock ? 'y'      : isRTL ? 'right' : 'x',
            endEdge   = isBlock ? 'bottom' : isRTL ? 'x' : 'right',
            dimension = isBlock ? 'height' : 'width';

        let delta = 0;

        // Center is easy.
        if (targetEdge === 'center') {
            delta = targetRect.center[axis] - viewport.center[axis];
        }

        else if (targetEdge === 'start' || targetEdge === 'end') {
            const
                isStart       = targetEdge === 'start',
                edge          = isStart ? startEdge : endEdge,
                margin        = edgeOffset[targetEdge],
                edgeIncrement = viewport[dimension] > margin ? (isStart ? -1 : 1) * (isBlock || !isRTL ? 1 : -1) : 0;

            delta = (targetRect[edge] + margin * edgeIncrement) - viewport[edge];
        }
        else {
            const
                s                = Math.max(targetRect[axis], viewport[axis]),
                e                = Math.min(targetRect[axisEnd], viewport[axisEnd]),
                intersectionSize = e > s ? e - s : 0,
                targetSize       = targetRect[dimension];

            // If any scrolling is needed to bring the requested size into view
            // The reasoning here is best thought about in just one dimension.
            // Think x, right and width.
            if ((intersectionSize <= Math.min(maxSize || Number.MAX_SAFE_INTEGER,  targetSize)) && targetSize > intersectionSize) {
                // We are changing the targetRect to conform to the maxSize, so clone it.
                targetRect = targetRect.clone();

                // Truncate the target rectangle to conform to any maxSize.
                // maxSize may be null (not just undefined), and `n > null` coerces to `n > 0`,
                // so explicitly require a maxSize before truncating.
                if (maxSize != null && targetRect[dimension] > maxSize) {
                    if (targetRect[axis] < viewport[axis]) {
                        targetRect[axis] = Math.max(targetRect[axis], targetRect[axisEnd] - maxSize);
                    }
                    else {
                        targetRect[dimension] = Math.min(targetSize, maxSize);
                    }
                    edgeOffset = undefined;
                }

                if (Math.min(targetRect[dimension], maxSize || Number.MAX_SAFE_INTEGER) > viewport[dimension]) {
                    // Can't fit element in, scroll what is possible into view so that start is visible.
                    targetEdge = 'start';
                }
                else {
                    // Scroll element to the edge it is nearest to.
                    targetEdge = Math.abs(targetRect[startEdge] - viewport[startEdge]) < Math.abs(targetRect[endEdge] - viewport[endEdge]) ? 'start' : 'end';
                }

                delta = this.getDelta({
                    viewport,
                    targetRect,
                    edgeOffset,
                    flow,
                    targetEdge,
                    maxSize,
                    precise
                });
            }
        }
        return precise ? delta : Math.round(delta);
    }

    /**
     * A {@link Core/helper/util/Rectangle} describing the bounds of the scrolling viewport.
     * @member {Core.helper.util.Rectangle}
     * @readonly
     */
    get viewport() {
        const
            stickies = this.stickies ? ArrayHelper.asArray(this.stickies).flatMap(e => typeof e === 'string' ? Array.from(this.element.querySelectorAll(e)) : e) : null,
            result   = Rectangle.client(this.element);

        return stickies ? result.exclude(stickies.map(e => Rectangle.from(e))) : result;
    }

    updateWidget(widget) {
        this.rtlSource = this.owner = widget;
    }

    updateElement(element, oldElement) {
        const me = this;

        // The global Scroller doesn't monitor its element.
        // It's only used for *commanding* scrolls.
        if (me === Scroller._globalScroller) {
            me._element = element;
            me.positionDirty = true;
            return;
        }

        const
            scrollHandler = me.scrollHandler || (me.scrollHandler = me.onScroll.bind(me)),
            resizeHandler = me.resizeHandler || (me.resizeHandler = me.onElResize.bind(me));

        if (oldElement) {
            DomDataStore.remove(oldElement, 'scroller');
            if (me.translate) {
                me.mutationObserver?.disconnect();
            }
            else {
                oldElement.removeEventListener('scroll', scrollHandler);
                oldElement.classList.remove(scrollerCls);
                oldElement.style.overflowX = oldElement.style.overflowY = '';
            }
            ResizeMonitor.removeResizeListener(oldElement, resizeHandler);
        }

        if (element) {
            DomDataStore.set(element, 'scroller', me);
            if (me.translate) {
                if (!me.mutationObserver) {
                    me.mutationObserver = new MutationObserver(me.mutationHandler || (me.mutationHandler = me.onElMutation.bind(me)));
                }
                me._x = me._y = 0;
                if (document.contains(element)) {
                    const [x, y] = DomHelper.getTranslateXY(element);
                    me._x = -x;
                    me._y = -y;
                }
                me.mutationObserver.observe(element, { attributes : true });
            }
            else {
                element.addEventListener('scroll', scrollHandler);
                element.classList.add(scrollerCls);
            }
            ResizeMonitor.addResizeListener(element, resizeHandler);

            if (!me.widget && !me.rtlSource) {
                me.rtlSource = {
                    get rtl() {
                        return DomHelper.getStyleValue(element, 'direction') === 'rtl';
                    }
                };
            }

            // Ensure the overflow configs, which are unable to process themselves
            // in the absence of the element get applied to the newly arrived element.
            if (me.positionDirty) {
                me.updateOverflowX(me.overflowX);
                me.updateOverflowY(me.overflowY);
            }

            // Keep flags synced from the start
            me.syncOverflowState();

            // Apply initially configured scroll position if we have non-zero positions
            if (me.isConfiguring) {
                me._x && me.updateX(me._x);
                me._y && me.updateY(me._y);
            }
        }

        me.positionDirty = true;
    }

    get unsynced() {
        const
            me = this,
            [x, y] = me.xy;

        return me._x !== x || me._y !== y;
    }

    get xy() {
        const { element } = this;

        let x, y;

        if (element) {
            if (this.translate) {
                [x, y] = DomHelper.getTranslateXY(element);

                x = -x;
                y = -y;
            }
            else {
                // A Scroller's conception is that X is an offset from the origin in whatever the direction is.
                x = Math.abs(element.scrollLeft);
                y = element.scrollTop;
            }
        }

        return [x, y];
    }

    refreshPosition() {
        this.positionDirty = false;
        return [this._x, this._y] = this.xy;
    }

    fixPositionSync() {
        const
            me = this,
            { element, xy, _x, _y } = me;

        if (!me.positionDirty && !(_x === xy[0] && _y === xy[1])) {
            if (me.translate) {
                DomHelper.setTranslateX(element, -_x);
                DomHelper.setTranslateY(element, -_y);
            }
            else {
                element.scrollTo({
                    behavior : 'instant',
                    left     : me.isRTL ? -_x : _x,
                    top      : _y
                });
            }
        }
    }

    /**
     * The horizontal scroll position of the widget.
     *
     * Note that this is always positive. Horizontal scrolling using the `x` property always proceeds
     * in the positive direction.
     *
     * @member {Number}
     */
    get x() {
        this.positionDirty && this.refreshPosition();

        return this._x;
    }

    /**
     * The natural DOM horizontal scroll position of the widget.
     *
     * Note that this proceeds from 0 into negative space in RTL mode.
     *
     * @member {Number}
     */
    get scrollLeft() {
        return this.x * (this.isRTL ? -1 : 1);
    }

    changeX(x) {
        // We do not accept the concept of negative X values.
        // Although scrolling in an RTL element sets scrollLeft to a negative value, a Scroller's conception
        // is that X is an offset from the origin in whatever the direction is. So all code should
        // use this concept.
        x = Math.max(x, 0);

        // Only process initial X if we were configured to start at non-zero
        if (!this.isConfiguring || x) {
            return x;
        }
        this._x = x;
    }

    updateContentElement(contentElement) {
        if (contentElement) {
            contentElement = typeof contentElement === 'string' ? this.element.querySelector(contentElement) : contentElement;

            ResizeMonitor.addResizeListener(contentElement, this.resizeHandler);
        }
    }

    updateX(x) {
        const
            me                    = this,
            { behavior, element } = me;

        // An explicit write supersedes any position remembered from a clamped partner sync (see sync()), and makes
        // this scroller the one in command of the axis. sync() marks its partner as controlling after writing.
        // Otherwise a scroll event of a partner's sync still pending when this scroller is moved (Firefox dispatches
        // them late) would coalesce with this move, and onScroll would not sync the move back to that partner
        me.$pendingPartnerX = null;
        me.controllingPartnerX = null;

        // When element is outside of DOM, this can have no effect
        if (element && !me.widget?.isConfiguring) {
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
            // On systems using display scaling, scrollLeft may give you a decimal value.
            // Round possible decimal value to integer
            x = Math.round(x);

            me.trigger('scrollStart', { x });

            if (me.translate) {
                DomHelper.setTranslateX(element, -x);
            }
            else if (behavior) {
                element.scrollTo({
                    behavior,
                    left : me.isRTL ? -x : x
                });
            }
            else {
                element.scrollLeft = me.isRTL ? -x : x;
            }
        }

        // The scroll position will need to be read before we can return it.
        // Do not read it back now, we may not have our element, or if we do,
        // that would cause a forced synchronous layout.
        me.positionDirty = true;
    }

    /**
     * Syncs this Scroller with the passed Scroller in the passed axes.
     * @param {Core.helper.util.Scroller} controllingPartner The Scroller which is dictating our new scroll position.
     * @param {Object} axes `{x : <boolean>, y : <boolean> }` which axes to sync.
     * @param {Boolean} axes.x Sync horizontal scroll.
     * @param {Boolean} axes.y Sync vertical scroll.
     * @returns {Boolean} `true` if this Scroller needed the passed axes syncing, `false`
     * if no changes were made.
     * @internal
     */
    sync(controllingPartner, axes) {
        const
            me       = this,
            { x, y } = axes;

        let result = false;

        if (x) {
            if (me.x !== controllingPartner.x) {
                me.x = controllingPartner.x;
                result = true;
            }

            // Remember the partner-commanded position (after the assignment above, which clears it via updateX).
            // If this scroller's scroll range currently lags behind the partner's (content widths can catch up
            // asynchronously, for example Grid row widths after a column resize), the assignment gets clamped by
            // the DOM and the scrollers would silently desync. syncOverflowState() re-applies the remembered
            // position once the range catches up. Any real scroll (see onScroll) or explicit write (see updateX)
            // of this scroller clears it - a clamped assignment fires no scroll event and writes nothing new, so
            // the pending position survives exactly as long as this scroller does not move
            me.$pendingPartnerX = controllingPartner.x;
        }
        if (y && me.y !== controllingPartner.y) {
            me.y = controllingPartner.y;
            result = true;
        }

        // Only set controlling partner when scroll will actually change. This helps to increase stability of
        // state restoring API. It commands all axes we share, so our resulting scroll event feeds none of them back.
        // Set after the assignments, which clear it per axis (see updateX())
        if (result) {
            if (x) {
                me.controllingPartnerX = controllingPartner;
            }
            if (y) {
                me.controllingPartnerY = controllingPartner;
            }
        }

        // Returns true if the sync was needed
        return result;
    }

    /**
     * The vertical scroll position of the widget.
     * @member {Number}
     */
    get y() {
        this.positionDirty && this.refreshPosition();

        return this._y;
    }

    changeY(y) {
        // Only process initial Y if we were configured to start at non-zero
        if (!this.isConfiguring || y) {
            return y;
        }
        this._y = y;
    }

    updateY(y) {
        const
            me                            = this,
            { behavior, element, widget } = me;

        // An explicit write makes this scroller the one in command of the axis (see updateX())
        me.controllingPartnerY = null;

        // When element is outside of DOM, this can have no effect
        if (element && !widget?.isConfiguring) {
            me.trigger('scrollStart', { y });

            if (me.translate) {
                DomHelper.setTranslateY(element, -y);
            }
            else if (behavior) {
                element.scrollTo({
                    behavior,
                    top : y
                });
            }
            else {
                element.scrollTop = y;
            }
        }

        // The scroll position will need to be read before we can return it.
        // Do not read it back now, we may not have our element, or if we do,
        // that would cause a forced synchronous layout.
        me.positionDirty = true;
    }

    /**
     * The maximum `X` scrollable position of the widget.
     * @member {Number}
     * @readonly
     */
    get maxX() {
        return this.scrollWidth - this.clientWidth;
    }

    /**
     * The maximum `Y` scrollable position of the widget.
     * @member {Number}
     * @readonly
     */
    get maxY() {
        return this.scrollHeight - this.clientHeight;
    }

    /**
     * The furthest possible `scrollLeft` position of the widget. Will be negative
     * if in writing direction is RTL.
     * @member {Number}
     * @readonly
     */
    get lastScrollLeft() {
        return (this.scrollWidth - this.clientWidth) * (this.isRTL ? -1 : 1);
    }

    updateOverflowX(overflowX, oldOverflowX) {
        const
            me                     = this,
            { element, translate } = me,
            { style, classList }   = element;

        if (oldOverflowX === 'hidden-scroll') {
            classList.remove('b-hide-scroll');
        }

        // Scroll, but without showing scrollbars.
        // For example a grid header. Only works on platforms which
        // support suppression of scrollbars through CSS.
        if (overflowX === 'hidden-scroll' && !translate) {
            // note: not style.overflowX since it won't read back 'overflow-hidden'
            const otherAxisScrollable = me.overflowY !== true && isScrollableConfig[me.overflowY];

            // Can't do one axis hidden-scroll, and the other scrollable because the b-hide-scroll
            // class hides "all" scrollbars, so we have to make this axis hidden and use a wheel
            // listener to scroll the content.
            if (otherAxisScrollable) {
                overflowX = 'hidden';

                // Adds a wheel listener if we don't already have one.
                me.enableWheel();
            }
            else {
                classList.add('b-hide-scroll');
            }
        }
        if (!translate) {
            style.overflowX = scrollLiterals[overflowX] || overflowX;
        }
        if (!me.isConfiguring) {
            me.positionDirty = true;
            me.syncOverflowState();
        }
    }

    updateOverflowY(overflowY, oldOverflowY) {
        const
            me                     = this,
            { element, translate } = me,
            { style, classList }   = element;

        if (oldOverflowY === 'hidden-scroll') {
            classList.remove('b-hide-scroll');
        }

        // Scroll, but without showing scrollbars.
        // For example a grid header.
        // On platforms which show space-consuming scrollbars we hide scrollbars
        // and add a 'wheel' listener.
        if (overflowY === 'hidden-scroll' && !translate) {
            // note: not style.overflowY since it won't read back 'overflow-hidden'
            const otherAxisScrollable = me.overflowX !== true && isScrollableConfig[me.overflowX];

            // Can't do one axis hidden-scroll, and the other scrollable because the b-hide-scroll
            // class hides "all" scrollbars, so we have to make this axis hidden and use a wheel
            // listener to scroll the content.
            if (otherAxisScrollable) {
                overflowY = 'hidden';

                // Adds a wheel listener if we don't already have one.
                me.enableWheel();
            }
            else {
                classList.add('b-hide-scroll');
            }
        }
        if (!translate) {
            style.overflowY = scrollLiterals[overflowY] || overflowY;
        }
        if (!me.isConfiguring) {
            me.positionDirty = true;
            me.syncOverflowState();
        }
    }

    enableWheel() {
        if (!this.wheelListenerRemover) {
            this.wheelListenerRemover = EventHelper.on({
                element : this.element,
                wheel   : 'onWheel',
                thisObj : this
            });
        }
    }

    onWheel(e) {
        const
            me = this,
            { overflowX, overflowY } = me,
            dx = e.deltaX,
            dy = e.deltaY,
            delta = Math.abs(dx) - Math.abs(dy);

        // Once wheel is enabled, it is never disabled, so be sure to check current configs and ignore these events if
        // browser-driven scrolling is in effect.
        if (overflowX === 'hidden-scroll' && isScrollableConfig[overflowY] && delta > 0) {
            me.x += dx;
        }
        else if (overflowY === 'hidden-scroll' && isScrollableConfig[overflowX] && delta < 0) {
            me.y += dy;
        }
    }

    /**
     * The horizontal scroll range of the widget.
     * @member {Number}
     * @readonly
     */
    get scrollWidth() {
        return this.element?.scrollWidth ?? 0;
    }

    updateScrollWidth(scrollWidth) {
        const
            me                 = this,
            { element, isRTL } = me;

        let stretcher = me.widthStretcher;

        // "Unsetting" scrollWidth removes the stretcher
        if (stretcher && scrollWidth == null) {
            stretcher.remove();
            me.widthStretcher = null;
        }
        else if (scrollWidth) {
            // Although DOM has unintuitive negative scrollLeft values in RTL, we treat the scrollWidth
            // as a pure magnitude. It is then applied correctly negated if RTL. In this way
            // app code can just use element widths and not consider RTL.
            scrollWidth = Math.abs(scrollWidth);

            if (!stretcher) {
                stretcher = me.widthStretcher = DomHelper.createElement({
                    className     : 'b-scroller-stretcher b-horizontal-stretcher',
                    // Avoid the default role="presentation" which is invalid here
                    role          : null,
                    // Should survive its surroundings being DomSynced
                    retainElement : true
                });
            }

            stretcher.style.translate = `${(scrollWidth - 1) * (isRTL ? -1 : 1)}px 0`;

            if (element && !element.contains(stretcher)) {
                element.insertBefore(stretcher, element.firstElementChild);
            }
        }

        // For style calc() rules - WARNING EXPENSIVE
        // element.style.setProperty('--bi-scroll-width', DomHelper.setLength(scrollWidth));

        // Propagate call to partners so they will establish own scroller stretcher
        if (me.propagate !== false) {
            me.eachPartner(({ scroller }) => {
                // Raise a flag on partner to not propagate changes from it further
                scroller.propagate = false;
                scroller.scrollWidth = scrollWidth;
                delete scroller.propagate;
            });
        }

        me.positionDirty = true;

        me.syncOverflowState();
    }

    /**
     * Syncs the scroll stretcher position after an RTL direction change.
     * Re-applies the current scrollWidth which updates the stretcher position
     * for the new direction and propagates to partner scrollers.
     * @internal
     */
    syncRtl() {
        if (this._scrollWidth) {
            this.updateScrollWidth(this._scrollWidth);
        }
    }

    get scrollHeight() {
        return this.element?.scrollHeight ?? 0;
    }

    /**
     * The vertical scroll range of the widget. May be set to larger than the actual data
     * height to enable virtual scrolling. This is how the grid extends its scroll range
     * while only rendering a small subset of the dataset.
     * @member {Number}
     */
    set scrollHeight(scrollHeight) {
        const
            me        = this,
            stretcher = me.stretcher || (me.stretcher = DomHelper.createElement({
                className : 'b-scroller-stretcher',
                // Avoid the default role="presentation" which is invalid here
                role      : null
            }));

        stretcher.style.translate = `0 ${scrollHeight - 1}px`;
        if (me.element && me.element.lastChild !== stretcher) {
            me.element.appendChild(stretcher);
        }

        me.positionDirty = true;

        me.syncOverflowState();
    }

    /**
     * The client width of the widget.
     * @member {Number}
     * @readonly
     */
    get clientWidth() {
        return this.element?.clientWidth || 0;
    }

    /**
     * The client height of the widget.
     * @member {Number}
     * @readonly
     */
    get clientHeight() {
        return this.element?.clientHeight || 0;
    }

    /**
     * The unique ID of this Scroller
     * @member {String}
     * @readonly
     */
    get id() {
        if (!this._id) {
            this._id = IdHelper.generateId(this.widget ? `${this.widget.id}-` : '' + 'scroller-');
        }
        return this._id;
    }

    //region Extract configs

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    preProcessCurrentConfigs(configs) {
        super.preProcessCurrentConfigs();

        delete configs.widget;
        delete configs.element;
    }

    //endregion
}
