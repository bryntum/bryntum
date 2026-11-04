import InfinityScroller from './InfinityScroller.js';

/**
 * @module Core/helper/util/InfinityScrollable
 */

/**
 * This mixin connects an {@link Core.helper.util.InfinityScroller} to a {@link Core.widget.Container}.
 * @internal
 * @mixin
 */
export default Target => class InfinityScrollable extends Target {
    static $name = 'InfinityScrollable';

    static configurable = {
        /**
         * Set to `null` to disable smooth scroll animation.
         * @prp {'smooth'|null}
         * @default
         */
        animate : 'smooth',

        /**
         * The lazily created `InfinityScroller`. For derived classes, see {@link #property-infinityScrollerDefaults}.
         * @prp {Core.helper.util.InfinityScroller}
         * @accepts {InfinityScrollerConfig}
         * @internal
         */
        infinityScroller : {
            value   : {},
            $config : 'lazy'
        },

        monitorResize : true,

        scrollable : {},  // enable DOM scroller

        testConfig : {
            animate : false
        }
    };

    static delayable = {
        syncSoon : 'raf'
    };

    /**
     * Returns the default config object for the `infinityScroller`. It is likely that a derived class will need to
     * augment this, but be sure to include the value produced by calling `super`.
     * @member {InfinityScrollerConfig}
     * @readonly
     * @internal
     */
    get infinityScrollerDefaults() {
        return {
            animate : this.animate
        };
    }

    compose() {
        return {};  // Container is not composable, so ensure derived class is...
    }

    changeInfinityScroller(config, existing) {
        if (existing) {
            existing.setConfig(config);
        }
        else {
            existing = InfinityScroller.new({ client : this }, this.infinityScrollerDefaults, config);
        }

        return existing;
    }

    onChildAdd(item) {
        item.innerItem && this._infinityScroller?.virtualize(item);

        return super.onChildAdd(item);
    }

    onInfiniteScroll() {
        this.syncSoon();
    }

    onInfiniteScrollEnd() {
        this.syncSoon.now();
    }

    onInfiniteScrollStart() {
        // template method
    }

    onInternalResize(element, width, height, oldWidth, oldHeight) {
        super.onInternalResize(element, width, height, oldWidth, oldHeight);

        // With monitorResize=true, we get called during the initialPaint, so ignore that
        this.hasPainted && this.syncSoon();
    }

    onInternalPaint(info) {
        super.onInternalPaint?.(info);

        if (info.firstPaint) {
            this.syncSoon.now();

            this.infinityScroller.ion({
                thisObj     : this,
                scroll      : 'onInfiniteScroll',
                scrollStart : 'onInfiniteScrollStart',
                scrollEnd   : 'onInfiniteScrollEnd'
            });
        }
    }

    get scrollingTo() {
        return this.infinityScroller.scrollingTo;
    }

    scrollTo(options) {
        return this.infinityScroller.scrollTo(options);
    }

    /**
     * This method is called on animation frames to synchronize with the state of the `infinityScroller`. This method
     * is called on the first `onPaint` as well as when the widget resizes.
     *
     * This method is not called directly. It is only called by {@link #function-syncSoon} which allows calls to
     * aggregate to the next animation frame.
     * @internal
     */
    sync() {
        this.infinityScroller.sync();
    }

    /**
     * Call this method to schedule a synchronization pass for the scroller. This will call {@link #function-sync} on
     * the next animation frame.
     */
    syncSoon() {
        const me = this;

        if (me.isPainted) {
            me.recompose.flush();
            me.infinityScroller.animate = me.animate;
            me.sync();
        }
    }

    unanimated(suppressAnim, fn) {
        return this.infinityScroller.unanimated(suppressAnim, fn);
    }

    updateAnimation() {
        // don't trigger the infinityScroller creation... it will get this value when it is created so we only need
        // to update it after it exists
        this._infinityScroller && this.syncSoon();
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
