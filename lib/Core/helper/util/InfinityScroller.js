import Base from '../../Base.js';
import DomHelper from '../DomHelper.js';
import Events from '../../mixin/Events.js';
import GlobalEvents from '../../GlobalEvents.js';
import Axis from './InfinityAxis.js';
import Promissory from './Promissory.js';

DomHelper.loadStylesheet('Core/helper/util/InfinityScroller.css');

// import Stylesheet from './InfinityScroller.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'InfinityScroller');

/**
 * @module Core/helper/util/InfinityScroller
 */

const
    infinityCls = 'b-infinity-scroller',
    NO_SIZE = Object.freeze({ width : 0, height : 0 }),
    addVirtualPos = (widget, name) => {
        const prop = 'v' + name;

        if (!(prop in widget)) {
            Object.defineProperty(widget, prop, {
                configurable : true,

                get() {
                    return this.$vxy?.[name];
                },

                set(v) {
                    if (this.$vxy) {
                        this.$vxy[name] = v;
                    }
                }
            });
        }
    };

class Virtualizer extends Base {
    static configurable = {
        hidden : null,

        owner : null,

        widget : null
    };

    static prototypeProperties = {
        _height : 0,
        _width  : 0,
        _x      : 0,
        _y      : 0
    };

    get height() {
        return this.getDim('height');
    }

    get width() {
        return this.getDim('width');
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this.moveTo(x);
    }

    get xy() {
        return [this._x, this._y];
    }

    set xy(xy) {
        this.moveTo(...xy);
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this.moveTo(null, y);
    }

    getDim(dim) {
        const
            me          = this,
            { widget }  = me,
            cachedValue = '_' + dim;

        return widget
            // if monitorResize, sizes are cached and refreshed on resize; otherwise it is a DOM measurement
            ? widget.monitorResize ? widget[dim] : (me[cachedValue] || (me[cachedValue] = widget[dim]))
            : 0;
    }

    moveTo(x, y) {
        if (x != null) {
            this._x = x;
        }

        if (y != null) {
            this._y = y;
        }

        this.sync();
    }

    sync() {
        const
            me                = this,
            { owner, widget } = me,
            { element }       = widget,
            x                 = owner.x.toPhysical(me.x),
            y                 = owner.y.toPhysical(me.y),
            hide              = isNaN(x + y);  // NaN + anything == NaN so this is the same as isNaN(x) || isNaN(y)

        me.hidden = hide;

        if (hide) {
            me.size = NO_SIZE;
        }
        else {
            element.style.translate = `${x}px ${y}px`;
        }
    }

    updateHidden(hidden) {
        this.widget?.element?.classList.toggle('b-scroll-hidden', hidden);
    }

    updateWidget(widget, was) {
        was?.removeCls('b-infinity-scroller-item');

        if (widget) {
            widget.addCls('b-infinity-scroller-item');

            addVirtualPos(widget, 'x');
            addVirtualPos(widget, 'y');
            addVirtualPos(widget, 'xy');
        }
    }
}

//---------------------------------------------------------------------------------------------------------

/**
 * This class virtualizes a DOM {@link Core.helper.util.Scroller} to allow scroll ranges that exceed browser limits
 * and also allow negative scroll positions. These are managed by instances of {@link Core.helper.util.InfinityAxis}
 * named `x` and `y`.
 * @internal
 */
export default class InfinityScroller extends Base.mixin(Events) {
    static $name = 'InfinityScroller';

    static configurable = {
        /**
         * Set to `null` to disable smooth scroll animation.
         * @prp {'smooth'|null}
         * @default
         */
        animate : 'smooth',

        /**
         * The owning container. Because position virtualization is only implemented for {@link Core.widget.Widget},
         * the `client` must be a {@link Core.widget.Container}.
         * @config {Core.widget.Container}
         * @internal
         */
        client : null,

        /**
         * The proportional amount of the browser's true {@link Core.helper.DomHelper#property-scrollLimit-static} to
         * not use in order to reduce likelihood of browser anomalies. By default, 99% of the limit is used (this
         * value being 1%, by default).
         * @prp {Number}
         * @default
         */
        safetyMargin : 0.01,  // 1% of 18M = 180K (should be larger than visual range)

        scroller : null,

        /**
         * The number of consecutive animation frames with no scroll motion that must occur before the scroll is
         * declared complete. After this time, the {@link #event-scrollEnd} event is fired.
         * @prp {Number}
         * @internal
         */
        scrollIdle : 8,  // Tests fail in Firefox if this value is 5

        /**
         * This config is used to track the current scrolling state. As it changes, various side-effects ensue.
         * @prp {Boolean|'maybe'|'snap'}
         * @private
         * @default false
         */
        scrolling : null,

        /**
         * Used for unit testing. Ignores the browser scroll limit in favor of a consistent, predictable value.
         * @config {Number}
         * @internal
         */
        scrollLimit : {
            value   : 0,
            $config : 'lazy'
        },

        /**
         * If not null, this config determines which axis to use for scroll snapping.
         * @prp {'x'|'y'|null}
         */
        snap : null,
        //<remove-on-release>
        // TODO snap : true|'xy'
        //</remove-on-release>

        /**
         * The minimum number of pixels or the minimum proportion of the item that must be scrolled to initiate a
         * snap to reveal the whole item. A completed scroll of less than this amount is reversed. If this value is
         * less-than 1, then this is the decimal fraction of the item's size. By default, this value is 0.1, which
         * is 10% of the item's width. Otherwise, this value is an absolute number of pixels.
         * @prp {Number}
         */
        snapThreshold : 0.1,

        /**
         * The {@link Core.helper.util.InfinityAxis} instance managing the x-axis.
         * @prp {Core.helper.util.InfinityAxis}
         * @accepts {InfinityAxisConfig}
         */
        x : {},

        /**
         * The {@link Core.helper.util.InfinityAxis} instance managing the y-axis.
         * @prp {Core.helper.util.InfinityAxis}
         * @accepts {InfinityAxisConfig}
         */
        y : {},

        testConfig : {
            animate : null
        }
    };

    /**
     * Fired when scrolling happens on this InfinityScroller's element.
     * @event scroll
     * @param {Event} relatedEvent The DOM event.
     * @param {Core.widget.Container} widget The owning {@link #config-client} instance.
     * @param {Core.helper.util.InfinityScroller} source This InfinityScroller
     */

    /**
     * Fired when scrolling finished on this InfinityScroller's element.
     * @event scrollEnd
     * @param {Event} relatedEvent The last DOM event to fire.
     * @param {Core.widget.Container} widget The owning {@link #config-client} instance.
     * @param {Core.helper.util.InfinityScroller} source This InfinityScroller
     */

    /*
     * break - above jsdoc does not describe the next method!
     */

    get element() {
        return this.scroller?.element;
    }

    get events() {
        return this._events || (this._events = []);
    }

    get items() {
        return (this.client?.items || []).filter(it => it.$vxy);
    }

    get lastEvent() {
        return this._events?.[this._events.length - 1];
    }

    get pos() {
        return [this.x.pos, this.y.pos];
    }

    changeScrollLimit(limit) {
        return limit || DomHelper.scrollLimit;
    }

    updateAnimate(animate, was) {
        const classList = this.element?.classList;

        was && classList?.remove(`b-infinity-scroller-${was}`);
        animate && classList?.add(`b-infinity-scroller-${animate}`);
    }

    updateClient(client) {
        this.scroller = client?.scrollable || null;
    }

    updateScroller(scroller, was) {
        this.detachListeners('scroller');

        was?.element?.classList.remove(infinityCls);

        if (scroller) {
            scroller.element.classList.add(infinityCls);
            scroller.ion({
                thisObj : this,
                name    : 'scroller',
                scroll  : 'onInternalScroll'
            });
        }
    }

    changeX(axis) {
        return Axis.X.new(axis, {
            owner : this
        });
    }

    changeY(axis) {
        return Axis.Y.new(axis, {
            owner : this
        });
    }

    onInternalScroll(ev) {
        const
            me = this,
            { lastPos, scrolling } = me;

        if (!scrolling) {
            me.scrolling = 'maybe';
        }

        me.sync();

        const curPos = [me.x.pos, me.y.pos];

        if (lastPos && lastPos[0] === curPos[0] && lastPos[1] === curPos[1]) {
            me.scrolling = scrolling;
        }
        else {
            me.lastPos = curPos;

            me.pushEvent(ev);

            if (!scrolling) {
                me.scrolling = true;
            }

            me.triggerScroll('scroll', ev);
        }
    }

    onInternalScrollEnd() {
        const
            me = this,
            { scrolling } = me;

        if (scrolling) {
            if (scrolling === 'snap') {
                // The end of scrolling does not mean we have achieved a snap. For example, if the user scrolls during
                // the smooth scroll animation that we launched to snap to the desired item, the browser will discard
                // our snappy scroll position and stop at some random location. The way around this is to keep calling
                // the axis.snap() method until it decides we are on an item edge.
                me.updateScrolling(scrolling);
            }
            else {
                me.scrolling = me.snap ? 'snap' : false;
            }
        }
    }

    /**
     * Tracks the given `event` and a small number of prior events. These are used to determine direction of scroll in
     * the scroll axis, as well as to always have access to the `lastEvent` responsible for scrolling.
     * @param {Event} event
     * @private
     */
    pushEvent(event) {
        const
            me         = this,
            { events } = me,
            wrapper    = { event, x : me.x.pos, y : me.y.pos },
            last       = events[events.length - 1];

        if (event.type === last?.event.type && last.x === wrapper.x && last.y === wrapper.y) {
            last.event = event;
        }
        else {
            if (!last) {
                me.scrollStarted = wrapper;
            }

            events.push(wrapper);

            while (events.length > 3) {
                events.shift();
            }
        }
    }

    /**
     * Scrolls to the specified `x` and `y` positions, or by the specified `dx` and `dy`. Only one of these values is
     * required. It is invalid to pass `x` and `dx`, or `y` and `dy` at the same time, however, it is valid to pass
     * `x` and `dy`, or `y` and `dx`.
     *
     * This method returns a Promise that resolves to a boolean value. This value indicates that the desired scroll
     * adjustment was made. It is `false` if the scroll ends at a different position. This can happen if the user
     * interferes with the scroll, or another call to this method is made before the first call completes.
     *
     * @param {Object} options
     * @param {Boolean} [options.animate] Specify `false` to scroll without animation.
     * @param {Number} [options.dx] The amount by which the `x` scroll position should be adjusted.
     * @param {Number} [options.dy] The amount by which the `y` scroll position should be adjusted.
     * @param {Number} [options.x] The new value for the `x` scroll position.
     * @param {Number} [options.y] The new value for the `y` scroll position.
     * @returns {Boolean}
     * @async
     */
    scrollTo(options) {
        const
            me = this,
            { scrollingTo } = me,
            cx = me.x.pos,
            cy = me.y.pos,
            x = options?.x ?? (cx + options?.dx || 0),
            y = options?.y ?? (cy + options?.dy || 0),
            dx = x - cx,
            dy = y - cy,
            delta = dx || dy,
            animate = options?.animate !== false && options?.animate !== null;

        if (scrollingTo) {
            if (scrollingTo.scroll.x === x && scrollingTo.scroll.y === y && scrollingTo.scroll.animate === animate) {
                return scrollingTo.promise;
            }

            scrollingTo.finish();
        }

        const scrollTo = me.scrollingTo = Promissory.new();

        scrollTo.scroll = { x, y, animate };

        delta && me.unanimated(!animate, () => {
            if (dx) {
                me.x.pos = x;
            }

            if (dy) {
                me.y.pos = y;
            }
        });

        if (delta && animate) {
            scrollTo.cancel = me.ion({
                once : true,
                scrollEnd() {
                    scrollTo.resolve(me.x.pos === x && me.y.pos === y);
                }
            });

            scrollTo.finish = () => {
                if (scrollTo.cancel) {
                    scrollTo.cancel();
                    scrollTo.cancel = null;
                    scrollTo.resolve(false);
                    me.scrollStarted = null;
                }
            };
        }
        else {
            scrollTo.resolve(true);
        }

        scrollTo.finally(() => {
            if (me.scrollingTo === scrollTo) {
                me.scrollingTo = null;
            }
        });

        return scrollTo.promise;
    }

    suppressAnim(suppress) {
        const
            me = this,
            suppressedWas = me._suppressAnim || 0,
            suppressed = me._suppressAnim = Math.max(0, suppressedWas + (suppress ? 1 : -1));  // no negatives

        me.scroller.behavior = suppressed ? 'instant' : null;
    }

    sync() {
        this.unanimated(() =>  {
            this.x.sync();
            this.y.sync();
        });
    }

    syncItems() {
        for (const item of this.items) {
            item.$vxy.sync();
        }
    }

    triggerScroll(eventName, relatedEvent, x = this.x.pos, y = this.y.pos) {
        this.trigger(eventName, { widget : this.client, relatedEvent, x, y });
    }

    updateScrolling(scrolling, was) {
        const
            me = this,
            maybe = was === 'maybe',
            { lastEvent } = me;

        if (!scrolling) {
            // A driftChange alone is all we'll get if a programmatic change of scrollPos is performed and that causes
            // the virtual scroll to jump so far we reset the drift to deal with the limited physical scroll range.
            // Since that is merely a change of translation of physical to virtual scroll position, the DOM does not
            // actually change scrollPos. This results in a CustomEvent('scroll') event with detail='driftChanged'.
            if (was && (lastEvent?.event.detail === 'driftChange' || !maybe)) {
                me.scrollEnded = lastEvent;
                me.events.length = 0;

                me.triggerScroll('scrollEnd', lastEvent.event, lastEvent.x, lastEvent.y);
                me.element.classList.remove('b-scrolling');
            }
        }
        else if (maybe) {
            me.watchForEnd();
            me.scrollEnded = null;

            me.triggerScroll('scrollStart', lastEvent.event, lastEvent.x, lastEvent.y);
            me.element.classList.add('b-scrolling');
        }
        else if (scrolling === 'snap') {
            me[me.snap].snap();
        }
    }

    unanimated(suppressAnim, fn) {
        if (typeof suppressAnim === 'function') {
            fn = suppressAnim;
            suppressAnim = true;
        }

        if (!suppressAnim) {
            fn();
        }
        else {
            this.suppressAnim(true);

            try {
                fn();
            }
            finally {
                this.suppressAnim(false);
                //
            }
        }
    }

    virtualize(item) {
        if (typeof item === 'string') {
            item = this.client.widgetMap[item];
        }

        let ret = item.$vxy;

        if (!ret || ret.owner !== this) {
            ret?.destroy();

            item.$vxy = ret = new Virtualizer({
                owner  : this,
                widget : item
            });
        }

        return ret;
    }

    watchForEnd() {
        const
            me = this,
            { client, scrollIdle, scrollStarted } = me;

        let sinceChange = 0,
            prev, xy;

        // The DOM scroller's scrollEnd event is too lazy in detecting the end of scroll.
        (function check() {
            if (!me.isDestroyed && !client.isDestroyed && scrollStarted === me.scrollStarted) {
                xy = me.pos;

                if (!prev || prev[0] !== xy[0] || prev[1] !== xy[1]) {
                    prev = xy;
                    sinceChange = 0;
                }
                else if (++sinceChange >= scrollIdle && !GlobalEvents.hasActiveTouches) {
                    me.onInternalScrollEnd();
                    return;
                }

                client.requestAnimationFrame(check);
            }
        })();
    }
}
