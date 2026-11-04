import Panel from './Panel.js';
import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import Fencible from '../mixin/Fencible.js';
import InfinityScrollable from '../helper/util/InfinityScrollable.js';

DomHelper.loadStylesheet('Core/widget/Carousel.css');

// import Stylesheet from './Carousel.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Carousel');

/**
 * @module Core/widget/Carousel
 */

const
    // Math "imports"
    { abs, ceil, floor, max, min } = Math,
    // other constants
    itemCls          = 'b-carousel-item',
    EMPTY_RANGE      = [0, 0],
    INDEX_PROP       = Symbol('carouselIndex'),
    SYNC_GEN_PROP    = Symbol('carouselSyncGen'),
    reserveCls       = 'b-carousel-reserve',
    reserveBeforeCls = `${reserveCls}-before`,
    reserveAfterCls  = `${reserveCls}-after`,
    sortByIndex      = (a, b) => a[INDEX_PROP] - b[INDEX_PROP],
    visibleFirstCls  = 'b-carousel-first',
    visibleLastCls   = 'b-carousel-last',
    visibleSlotCls   = 'b-carousel-visible',
    xy               = ['x', 'y'],
    yx               = ['y', 'x'],
    namesForAxis     = {
        h : {
            minSize    : 'minWidth',
            offsetPos  : 'offsetLeft',
            offsetSize : 'offsetWidth',
            size       : 'width',
            vxy        : ['vx', 'vy'],
            xy
        },

        v : {
            minSize    : 'minHeight',
            offsetSize : 'offsetHeight',
            size       : 'height',
            vxy        : ['vy', 'vx'],
            xy         : yx
        }
    };

namesForAxis.h.other = namesForAxis.v;
namesForAxis.v.other = namesForAxis.h;

/**
 * A virtualized container of items that can be scrolled either horizontally or vertically. As scrolling occurs, a
 * configured number of visible items ({@link #config-slots}) are dynamically positioned and reconfigured to give the
 * appearance that all items in the specified {@link #config-range} are present.
 *
 * To create a carousel, a {@link #config-configureSlot} function must be provided that will return the configuration
 * object for a given slot index. Slot index 0 is special, and whenever the {@link #config-range} is not empty, 0 must
 * be included in the range. The meaning of a slot index, however, is defined by the developer and only interpreted by
 * the developer-provided {@link #config-configureSlot} function.
 *
 * Slot indexes are converted into virtual scroll positions and given to an {@link Core.helper.util.InfinityScroller}.
 * This special scroller allows for negative scroll positioning as well as unbounded scroll range.
 *
 * {@note}This widget is not intended to be used standalone, but as part of higher-level widgets such as
 * {@link Core.widget.MultiDatePicker}.{/@note}
 *
 * @extends Core/widget/Panel
 * @classtype carousel
 * @abstract
 */
export default class Carousel extends Panel.mixin(Fencible, InfinityScrollable) {
    static $name = 'Carousel';
    static type = 'carousel';

    static configurable = {
        atMax : null,

        atMin : null,

        /**
         * A callback function that must be provided by the developer to produce configuration objects for the slots
         * in the carousel.
         *
         * Derived classes may set this config to the name of the instance method to call. The `this` pointer will be
         * the carousel instance.
         *
         * @prp {String|Function}
         * @param {Number} index The slot index as defined by the {@link #config-range} of the carousel.
         * @param {Core.widget.Carousel} carousel The carousel instance.
         * @param {Core.widget.Widget} [slot] The slot being reconfigured or `null` when creating a new slot.
         * @returns {ContainerItemConfig} The slot's configuration object.
         */
        configureSlot : (index, carousel, slot) => ({}),

        /**
         * The value to set for the {@link Core.widget.Widget#config-disabled} config on reserve slots. These slots
         * are not visible to the user but can be tabbed into from visible slots.
         *
         * When set to `'inert'`, the `inert` DOM attribute is also set. This prevents tabbing from a visible slot to
         * a reserved slot.
         * @default false
         * @config {Boolean|'inert'}
         */
        disableReserveSlots : null,

        // private
        empty : null,

        /**
         * The HTML to render when the carousel's {@link #config-range} is empty. To avoid XSS attacks, it is safer to
         * use {@link #config-emptyText} instead.
         * @prp {String}
         */
        emptyHtml : null,

        /**
         * The text to render when the carousel's {@link #config-range} is empty. This text is automatically encoded
         * and is safe from XSS issues. To render markup when the carousel is empty, see {@link #config-emptyHtml}.
         * @prp {String}
         * @default
         */
        emptyText : 'No items to display',

        firstVisibleSlot : null,

        lastVisibleSlot : null,

        /**
         * The range of slot indexes to be presented in the carousel. Slot indexes greater than or equal to `range[0]`
         * and less than `range[1]` will be rendered.
         *
         * If this value is `null` or `[0, 0]`, the carousel will render no items (i.e., it will be empty). See
         * {@link #config-emptyText}.
         *
         * By default, the carousel's range is unlimited, i.e., `range = [-Infinity, Infinity]`.
         *
         * @prp {Number[]}
         */
        range : [null, null],

        /**
         * The number of slots to render beyond what is visible in the carousel. These reserve items are critical to
         * giving the appearance of continuity as the carousel is being scrolled. A minimum of 1 is required and is
         * generally sufficient for slots that are reasonably large. If slots are small (maybe less than 100px), it
         * may be helpful to provide additional reserve slots.
         * @prp {Number}
         * @default
         */
        reserveSlots : 1,

        /**
         * Set to `true` to use {@link Core.widget.Panel#config-trapFocus} to scroll the carousel when tabbing to slots
         * that are not currently visible.
         *
         * NOTE: This only works when {@link #config-configureSlot} produces {@link Core.widget.Panel} instances.
         * @prp {Boolean}
         * @default false
         */
        scrollOnTab : null,

        /**
         * Due to the `position: absolute` nature of carousel items, a carousel does not have a natural size. When the
         * carousel is being sized by its container, this is not a problem, but can be an issue if the carousel is being
         * used in a layout where its natural size would be important.
         *
         * Specify `true` for the carousel to provide a natural size based on the size of its slots. This is done by
         * setting `min-width` and/or `min-height` on the internal elements that contain the absolutely positioned
         * slots. This may have a modest performance impact due to the required measuring of the slots to provide
         * these minimums.
         *
         * By default (`shrinkWrap = 'auto'`), the carousel enables shrinkWrap support when the carousel's main
         * element is `position: absolute`. This can be disabled by setting `shrinkWrap = false`.
         * @prp {Boolean|'auto'}
         * @default
         */
        shrinkWrap : 'auto',

        /**
         * The number of slots to present in the carousel. When set to a number, each slot is given a percentage size
         * (e.g., "50%" for `slots = 2`) so they fill the carousel. This is typically required when the carousel is
         * using {@link #config-shrinkWrap} (note: shrink wrapping is enabled by default for `position: absolute`
         * carousels).
         *
         * When `null`, as many slots as needed to fill the carousel are created. This can produce partially visible
         * slots.
         *
         * Setting this value to `'auto'` will similarly fill the available space, but once the required number of slots
         * is determined, they are assigned a percentage size so that they completely fill the carousel.
         *
         * @prp {Number}
         */
        slots : null,

        /**
         * Set to `false` to disable scroll snapping and allow free scrolling through the carousel.
         * @prp {Boolean}
         * @default
         */
        snap : true,

        /**
         * Set to `true` to enable vertical mode. By default, carousels scroll horizontally.
         * @prp {Boolean}
         * @default false
         */
        vertical : null
    };

    static delayable = {
        triggerSlotVisibility : 'raf'
    };

    static fenced = {
        resync : true
    };

    compose() {
        const { carouselClasses } = this;

        return {
            class : {
                ...carouselClasses
            }
        };
    }

    // Invoked after a fullscreen reparent has moved this float to a new parent element
    afterFloatReparent() {
        this.syncSoon();
    }

    //region properties

    get allSlots() {
        return this.ensureItems().values.filter(item => item.innerItem).sort(sortByIndex);
    }

    get bodyConfig() {
        const
            { carouselClasses, emptyHtml, emptyText } = this,
            bodyConfig = super.bodyConfig;

        return ObjectHelper.merge(bodyConfig, {
            className : {
                'b-vbox' : 1,
                ...carouselClasses
            },
            children : {
                innerCt : {
                    class : {
                        'b-carousel-inner-ct' : 1,
                        'b-box-center'        : 1
                    }
                },
                emptyElement : {
                    class : {
                        'b-carousel-empty-text' : 1,
                        'b-box-center'          : 1
                    },
                    html : emptyHtml || StringHelper.xss`${emptyText}`
                }
            }
        });
    }

    get carouselClasses() {
        const { empty, vertical } = this;

        // It is helpful to have these on the carousel main element, but due to docking and nesting it is helpful to
        // also have them on the content element (to enable use of immediate child selectors).
        return {
            'b-carousel-empty'    : empty,
            'b-carousel-vertical' : vertical
        };
    }

    get contentElement() {
        return this.innerCt;
    }

    /**
     * The first visible slot index. This first visible slot can be read or written using this property. Setting
     * `currentIndex` will determine if the transition can be animated by the distance being traveled.
     *
     * See {@link #function-goto}.
     * @prp {Number}
     */
    get currentIndex() {
        return this.indexFromPos(this.scrollPos);
    }

    set currentIndex(index) {
        this.goto(index);
    }

    get focusedSlot() {
        const { innerCt } = this;

        let ret = null,
            el, parentEl;

        for (el = DomHelper.getActiveElement(); el; el = parentEl) {
            parentEl = el.parentElement;

            if (parentEl === innerCt) {
                ret = Widget.fromElement(el);
                break;
            }
        }

        return ret;
    }

    get infinityScrollerDefaults() {
        const
            me            = this,
            [axis, other] = me.vertical ? yx : xy;

        return ObjectHelper.merge(super.infinityScrollerDefaults, {
            snap   : me.snap && axis,
            [axis] : {
                overflow : 'hidden-scroll',
                range    : me.scrollRange,
                pos      : 0
            },
            [other] : {
                overflow : 'hidden'
            }
        });
    }

    get propNames() {
        return namesForAxis[this.vertical ? 'v' : 'h'];
    }

    get scrollAxis() {
        return this.infinityScroller[this.vertical ? 'y' : 'x'];
    }

    /**
     * This will yield `true` when the carousel is currently scrolling.
     * @member {Boolean}
     * @readonly
     */
    get scrolling() {
        return this.infinityScroller.scrolling;
    }

    get scrollPos() {
        return this.scrollAxis.pos;
    }

    set scrollPos(v) {
        this.scrollAxis.pos = v;
    }

    get scrollRange() {
        const { range, slotSize } = this;

        return slotSize ? [range[0] * slotSize, range[1] * slotSize] : [0, Infinity];
    }

    get shrinkWrap() {
        const shrinkWrap = this._shrinkWrap;

        return (shrinkWrap === 'auto') ? DomHelper.getStyleValue(this.element, 'position') === 'absolute' : shrinkWrap;
    }

    get lastVisibleIndex() {
        return this.lastVisibleSlot?.[INDEX_PROP];
    }

    get visibleSlots() {
        return this.allSlots.filter(it => it.element.classList.contains(visibleSlotCls));
    }

    //endregion
    //region configs

    // atMax

    updateAtMax(atMax) {
        this.toggleCls('b-carousel-at-max', atMax);
    }

    // atMin

    updateAtMin(atMin) {
        this.toggleCls('b-carousel-at-min', atMin);
    }

    // configureSlot

    changeConfigureSlot(configureSlot) {
        if (typeof configureSlot === 'string') {
            const key = `_${configureSlot}Fn`;

            return this[key] || (this[key] = (...a) => this[configureSlot](...a));
        }

        return configureSlot;
    }

    // firstVisibleSlot

    triggerSlotVisibility() {
        const { firstVisibleSlot, lastVisibleSlot } = this;

        this.trigger('slotVisibility', { firstVisibleSlot, lastVisibleSlot });
    }

    updateFirstVisibleSlot(firstVisibleSlot) {
        this.triggerSlotVisibility();
    }

    // lastVisibleSlot

    updateLastVisibleSlot() {
        this.triggerSlotVisibility();
    }

    // range

    changeRange(range) {
        range = range ? [range[0] ?? -Infinity, range[1] ?? Infinity] : [0, 0];

        if (range[0] !== range[1]) {  // empty range is OK
            let error;

            if (range[1] < range[0]) {
                error = 'denormalized';
            }

            if (error) {
                throw new Error(`Invalid carousel range [${range[0]}, ${range[1]}): ${error}`);
            }
        }

        return range;
    }

    updateRange(range) {
        this.empty = range[0] >= range[1];
        this.syncSoon();
    }

    // shrinkWrap

    updateShrinkWrap() {
        this.isPainted && this.syncSoon();
    }

    // vertical

    updateVertical() {
        this.isPainted && this.syncSoon();
    }

    //endregion
    //region misc

    convertIndexPos(value, posToIndex) {
        const
            me                      = this,
            { allSlots, propNames } = me,
            [indexMin, indexMax]    = me.range,
            midRange                = Math.floor((indexMin + indexMax) / 2),
            slotCount               = allSlots.length,
            lastSlot                = allSlots[slotCount - 1],
            vxy                     = propNames.vxy[0],
            zeroInRange             = indexMin <= 0 && 0 < indexMax;

        if (!posToIndex && !(indexMin <= value && value < indexMax)) {
            return null;
        }

        let nominalSize = me.slotSize || 100,
            begin, end, index, indexLo, indexHi, posHi, posLo, slot;

        if (!slotCount) {
            if (posToIndex && 0 <= value && value < nominalSize) {
                return zeroInRange ? 0 : midRange;
            }

            // Pretend we have 1 nominal item (these are "incorrect" but allow us to work when we are bootstrapping
            // our slots into existence and have no information regarding their size)
            posLo   = 0;
            posHi   = nominalSize;
            indexLo = zeroInRange ? 0 : midRange;
            indexHi = indexLo + 1;
        }
        else {
            nominalSize = 0;

            for (slot of allSlots) {
                index = slot[INDEX_PROP];
                begin = slot[vxy];
                nominalSize = nominalSize || slot.$vxy[propNames.size];  // the virtualizer caches the dimensions

                if (slot === allSlots[0]) {
                    indexLo = index;
                    posLo = begin;

                    if (value < (posToIndex ? begin : index)) {
                        // If pos is less than slot[0] pos (or index is less than slot[0] index), we need to interpolate
                        // backwards:
                        break;
                    }
                }

                if (posToIndex) {
                    if (value === begin) {
                        return index;
                    }

                    if (value < begin) {
                        // when pos is less than slot[1+], the previous slot is the match
                        return index - 1;
                    }
                }
                else if (value === index) {
                    return begin;
                }

                if (slot === lastSlot) {
                    end = begin + slot.$vxy[propNames.size];

                    if (posToIndex && value < end) {
                        return index;
                    }

                    // last slot is not a match, so we need to interpolate forwards:
                    indexHi = index + 1;
                    posHi = end;
                }
            }

            nominalSize = nominalSize || me.slotSize || 100;
        }

        // Mapping into non-rendered territory is always an interpolation using nominal size

        if (posToIndex) {
            return (value < posLo)
                ? max(indexLo - ceil((posLo - value) / nominalSize), indexMin)
                : min(indexHi + floor((value - posHi) / nominalSize), indexMax);
        }

        return (value < indexLo)
            ? (posLo - (indexLo - value) * nominalSize)
            : (posHi + (value - indexHi) * nominalSize);
    }

    /**
     * Decodes any `options` specified to a derived class that may be passed to {@link #function-ensureVisible}. This
     * method ensures the `options` object has the properties needed by {@link #function-ensureVisible}.
     * @param {Object} options Options to configure which slot should be visible and how to scroll if necessary.
     * @param {Number} options.index The index of the slot.
     * @param {Boolean} [options.animate] Pass `false` to disable scroll animation.
     * @returns {Object}
     * @internal
     */
    ensurePlan(options) {
        return options;
    }

    /**
     * Ensures that the given slot `index` is visible, scrolling if necessary to make it so.
     * @param {Object} options Options to configure which slot should be visible and how to scroll if necessary.
     * @param {Number} options.index The index of the slot.
     * @param {Boolean} [options.animate] Pass `false` to disable scroll animation.
     */
    ensureVisible(options) {
        const me = this;

        // See notes in goto() about _afterSync and _afterScroll
        if (me.lastScrollPos == null) {
            me._afterSync = () => me.ensureVisible({ ...options, animate : false });
        }
        else if (me.scrolling && me.hasPainted) {
            me._afterScroll = () => me.ensureVisible(options);
        }
        else {
            const
                { index, animate } = me.ensurePlan(options),
                { currentIndex, lastVisibleIndex } = me;

            let go;

            if (index < currentIndex) {
                go = index - currentIndex;  // negative amount
            }
            else if (lastVisibleIndex < index) {
                go = index - lastVisibleIndex;
            }

            return go && me.go(go, animate);
        }
    }

    getSlotIndex(item) {
        return item?.[INDEX_PROP];
    }

    /**
     * Returns the carousel slot index given a logical scroll position (see {@link Core.helper.util.InfinityScroller}).
     * @param {Number} pos The logical scroll position from the main {@link Core.helper.util.InfinityAxis}.
     * @returns {Number}
     */
    indexFromPos(pos) {
        return this.convertIndexPos(pos, true);
    }

    /**
     * Returns the logical scroll position (see {@link Core.helper.util.InfinityScroller}) given a carousel slot index.
     * @param {Number} index The carousel slot index.
     * @returns {Number}
     */
    posFromIndex(index) {
        return this.convertIndexPos(index, false);
    }

    slotFromIndex(index) {
        for (const slot of this.allSlots) {
            if (slot[INDEX_PROP] === index) {
                return slot;
            }
        }

        return null;
    }

    //endregion
    //region navigation

    /**
     * Step the carousel back one slot index.
     * @param {Boolean} [animate] Pass `false` to disable smooth scrolling animation. Animations can only be disabled
     * with this parameter, not enabled. For more details, see {@link #function-go}
     */
    backward(animate) {
        return this.go(-1, animate);
    }

    /**
     * Step the carousel forward one slot index. See {@link #function-go}.
     * @param {Boolean} [animate] Pass `false` to disable smooth scrolling animation. Animations can only be disabled
     * with this parameter, not enabled. For more details, see {@link #function-go}
     */
    forward(animate) {
        return this.go(1, animate);
    }

    /**
     * Steps the slot index of the carousel forward or backward by the given `increment`.
     * @param {Number} increment The number of slot indexes to advance forward (`> 0`) or backward (`< 0`).
     * @param {Boolean} [animate] Pass `false` to disable smooth scrolling animation. Animations can only be disabled
     * with this parameter, not enabled. For more details, see {@link #function-goto}
     */
    go(increment, animate) {
        return this.goto(this.currentIndex + increment, animate);
    }

    /**
     * Sets the slot index of the carousel to the given `index`.
     * @param {Number} index The new slot index for the carousel.
     * @param {Boolean} [animate] Pass `false` to disable smooth scrolling animation. Animations can only be disabled
     * with this parameter, not enabled. Animations are always disabled if
     * {@link Core.helper.util.InfinityScrollable#property-animate} is set to `false`. Further, if the slot index is
     * changing by a large enough amount, animations will be also disabled. In other words, smooth scroll animation will
     * be used as long as none of these conditions occur.
     */
    goto(index, animate) {
        const me = this;

        if (me.lastScrollPos == null) {
            // We cannot scroll around in the carousel until we've done a sync, which requires our DOM to be in the
            // document so that we can allocate the correct number of slots. Also, if we're currently scrolling to
            // some position, we need to delay taking a next step. We check "lastScrollPos" not "syncCount" since we
            // can sync w/an empty range but we don't set lastScrollPos until we have synced some slots.
            me._afterSync = () => {
                const { scrollPos } = me;

                me.goto(index, false);

                // Prior to hasPainted scroll listeners have not been registered so if the goto() calls adjusts the
                // scrollPos, we need to sync() again:
                if (!me.hasPainted && scrollPos !== me.scrollPos) {
                    me.sync();
                }
            };
        }
        else if (me.scrolling && me.hasPainted) {
            // Once a call to DOM scroll() is made (at least when smooth scrolling is in play), you cannot change your
            // mind about where to scroll. If you try, you will still experience effects from prior scroll() calls.
            //
            // For example, you request scroll({ left : 1000, behavior : 'smooth' }), or maybe smooth is the default due
            // to CSS, and then decide the scrollLeft should be 1500. To take over the scroll, there are two possible
            // approaches:
            //
            //  - Call scroll({ left : 1500, ... }) and hope the DOM changes its mind about the final scrollLeft
            //  - Call scroll({ left : 1000, behavior : 'instant' }) to "force" the prior scroll to complete and then call
            //    scroll({ left : 1500, ... })
            //
            // Both create race conditions in the sync() method with respect to scroll events and scroll positions. Based
            // on many test runs, there are times the initial smooth scroll() seems to have lingering effects that
            // conflict with the second scroll() call. [22-Dec-2023 dwgriffin; Chromium 120.0.6099.109]
            //
            // The solution is to declare the last caller the winner of a request to scroll during scroll. The winner
            // must capture its scroll request as a fn closure to be called once the current scroll is complete.
            // "In the end, there can be only one."
            me._afterScroll = () => me.goto(index, animate);
        }
        else {
            const
                { range, slots } = me,
                indexMax         = range[1] - ((typeof slots === 'number') ? slots - 1 : 0),
                indexClip        = min(indexMax - 1, max(range[0], index)),  // "indexMax - 1" because it is exclusive
                delta            = abs(me.currentIndex - indexClip),
                pos              = me.posFromIndex(indexClip);

            if (delta >= me.allSlots.length) {
                animate = false;
            }

            return me.scrollTo({ animate, [me.scrollAxis.name] : pos });
        }
    }

    //endregion

    onChildAdd(item) {
        item.innerItem && item.element.classList.add(itemCls);

        return super.onChildAdd(item);
    }

    onChildRemove(item) {
        item.innerItem && item.element.classList.remove(itemCls);

        return super.onChildRemove(item);
    }

    onInfiniteScrollEnd(ev) {
        super.onInfiniteScrollEnd(ev);

        const { _afterScroll } = this;

        this._afterScroll = null;

        _afterScroll?.();
    }

    onSlotFocusTrap({ source, top }) {
        const
            me    = this,
            delta = top ? -1 : 1,
            index = source[INDEX_PROP],
            slot  = me.slotFromIndex(index + delta);

        // Since slots are not in DOM order, we use the focus traps to navigate between them.
        if (!slot.element.classList.contains(reserveCls)) {
            slot.element.focus();
        }
        else if (me.scrollOnTab) {
            me.go(delta).then(success => {
                if (success) {
                    slot.element?.focus();
                }
            });
        }

        // we don't really want to trap the focus in the child datepicker...
        return false;
    }

    //region sync

    resync() {
        this.sync();
    }

    /**
     * Synchronizes the scroll range and child items based on the current configuration and scroll position. This is
     * called in response to scroll events and when the carousel is reconfigured.
     * @internal
     */
    sync() {
        // We don't sync the whole scroller, but instead only the main axis:
        // super.sync();
        this.syncCount = (this.syncCount || 0) + 1;

        /*
            Consider a 2 slot carousel:

                                       reserve[0]=1    slot 1          slot 2         reserve[1]=1
                                    ┌───────────────╔═══════════════╦══════════════╗───────────────┐
                                    │  -1           ║  0            ║  1           ║  2            │
                                    └───────────────╚═══════════════╩══════════════╝───────────────┘
                                                    ▲                              ▲
                                                    scrollPos                      end of client area

            Once scrolling takes place, there are 2 scenarios:

                1. Increasing scrollPos (content is sliding left):

                                    ┌───────────────╔═══════════════╦══════════════╗───────────────┐
                                    │  -1           ║  0            ║  1           ║  2            │
                                    └───────────────╚═══════════════╩══════════════╝───────────────┘
                                                        ▲                              ▲
                                                        scrollPos                      end client area
                                                        (indexOfPos=0)

                    Since we only have 2 slots and indexOfPos is a Math.floor operation, our main slots are 0 and 1.
                    So, we need to move one reserve item from before to after.

                                       reserve[0]=0    slot 1          slot 2         reserve[1]=2
                                                    ╔═══════════════╦══════════════╗───────────────┐───────────────┐
                                                    ║  0            ║  1           ║  2            │  3            │
                                                    ╚═══════════════╩══════════════╝───────────────┘───────────────┘
                                                        ▲                              ▲
                                                        scrollPos                      end client area

                2. Decreasing scrollPos (content is sliding right):

                                    ┌───────────────╔═══════════════╦══════════════╗───────────────┐
                                    │  -1           ║  0            ║  1           ║  2            │
                                    └───────────────╚═══════════════╩══════════════╝───────────────┘
                                                ▲                              ▲
                                                scrollPos                      end of client area
                                                (indexOfPos=-1)

                    In this case, indexOfPos has jumped to -1, even though almost none of it is visible. That is now
                    the base index for rendering slots. Since slot 1 is still visible, we must retain the reserve slot
                    on the end for it. In this case, we do not adjust the reserve allocation.

                       reserve[0]=1    slot 1          slot 2         reserve[1]=1
                    ┌───────────────╔═══════════════╦══════════════╗───────────────┐
                    │  -2           ║  -1           ║  0           ║  1            │
                    └───────────────╚═══════════════╩══════════════╝───────────────┘
                                                ▲                              ▲
                                                scrollPos                      end client area
         */
        if (!this.empty) {
            const
                me          = this,
                { allSlots, disableReserveSlots, innerCt, scrollAxis, propNames, reserveSlots, scrolling, slots } = me,
                [indexMin, indexMax] = me.range,
                scrollPos   = scrollAxis.pos,
                defaultType = Widget.resolveType(me.defaults?.type || me.defaultType),
                indexOfPos  = me.indexFromPos(scrollPos),
                posOfIndex  = me.posFromIndex(indexOfPos),
                offSnap     = scrollPos - posOfIndex,
                reserve     = [reserveSlots, reserveSlots],
                syncGen     = me.syncGen = (me.syncGen || 0) + 1;

            // increase scrollPos since last time (see diagrams above)
            if (scrolling && scrollPos > (me.lastScrollPos || 0) && offSnap) {
                --reserve[0];
                ++reserve[1];
            }

            me.lastScrollPos = scrollPos;

            innerCt.style.setProperty('--bi-carousel-item-offset', `${Math.abs(offSnap)}px`);

            if (!me.shrinkWrapped) {
                innerCt.style[propNames.minSize] = '';  // clear stale shrinkWrap sizer
            }

            let space = innerCt[propNames.offsetSize],
                atMax = false,
                atMin = false,
                firstSlot = null,
                lastSlot = null,
                classList, cls, classes, slot;

            // nix smooth scrolling so we can move items into place w/o animation
            me.unanimated(() => {
                const
                    { _afterSync } = me,
                    item = (slots && slots !== 'auto')
                        ? me.syncFixed(indexOfPos, propNames, allSlots, defaultType, reserve, slots, indexMin, indexMax)
                        : me.syncDynamic(indexOfPos, propNames, allSlots, defaultType, reserve, slots, space, indexMin, indexMax),
                    classSync = [],
                    cleanup = allSlots.filter(slot => slot[SYNC_GEN_PROP] !== syncGen);

                if (cleanup.length) {
                    cleanup.forEach(slot => me.detachListeners(`${slot.id}-listeners`));
                    me.remove(cleanup);
                }

                // Prop up the size of the cross-axis (since items are position:absolute they won't do it for us)
                innerCt.style[propNames.other.minSize] = `${item[propNames.other.size]}px`;
                space = innerCt[propNames.offsetSize];  // remeasure after syncing the slots (shrinkWrap needs this)

                for (slot of allSlots) {
                    if (!cleanup.includes(slot)) {
                        const
                            span    = scrollAxis.getItemSpan(slot),
                            end     = scrollPos + space,
                            before  = span[1] <= scrollPos,
                            after   = end <= span[0],
                            visible = !before && !after,
                            first   = visible && (span[0] <= scrollPos),
                            last    = visible && (span[1] >= end);

                        if (visible) {
                            if (slot[INDEX_PROP] === indexMin) {
                                atMin = true;
                            }

                            if (slot[INDEX_PROP] === indexMax - 1) {
                                atMax = true;
                            }
                        }

                        if (first) {
                            firstSlot = slot;
                        }

                        if (last) {
                            lastSlot = slot;
                        }

                        classSync.push([  // gather class updates to avoid reflow due to write/read cycles
                            slot,
                            slot.element.classList,
                            {
                                [reserveCls]       : before || after,
                                [reserveBeforeCls] : before,
                                [visibleFirstCls]  : first,
                                [visibleSlotCls]   : visible,
                                [visibleLastCls]   : last,
                                [reserveAfterCls]  : after
                            }
                        ]);
                    }
                }

                for ([slot, classList, classes] of classSync) {
                    if (disableReserveSlots) {
                        slot.disabled = classes[visibleSlotCls] ? false : disableReserveSlots;
                    }

                    for (cls in classes) {
                        classList.toggle(cls, classes[cls]);
                    }
                }

                me.atMax = atMax;
                me.atMin = atMin;
                me.firstVisibleSlot = firstSlot;
                me.lastVisibleSlot = lastSlot;

                scrollAxis.other.range = EMPTY_RANGE;  // disable scrolling in the cross-axis (for now)

                me.syncDomOrder(cleanup.length ? me.allSlots : allSlots);

                !scrolling && me.scrollable.fixPositionSync();
                scrollAxis.sync({
                    range : me.scrollRange
                });

                if (scrollAxis.pos !== scrollPos) {
                    // Changing scrollRange can cause scrollPos to adjust to conform to the range, so if that happens
                    // we need to re-sync our slots. We use a fenced method so that we don't repeat this process more
                    // than once.
                    me.resync();
                }
                else if (_afterSync) {
                    me._afterSync = null;
                    _afterSync();
                }
            });
        }
    }

    syncDomOrder(allSlots) {
        const activeElement = DomHelper.getActiveElement();
        let el, el2, i;

        for (i = allSlots.length; i-- > 1; /* empty */) {
            el2 = allSlots[i].element;

            if (!el) {
                el2.classList.add('b-last-visible-child');
            }

            el = allSlots[i - 1].element;

            el.classList.remove('b-last-visible-child');
            el2.classList.remove('b-first-visible-child');
            (el.nextSibling !== el2) && el.parentElement.insertBefore(el, el2);
        }

        el?.classList.add('b-first-visible-child');

        if (this.element.contains(activeElement) && activeElement !== DomHelper.getActiveElement()) {
            activeElement.focus();
        }
    }

    syncDynamic(indexOfPos, propNames, allSlots, defaultType, reserve, slots, space, indexMin, indexMax) {
        const
            me             = this,
            { offsetSize } = propNames,
            auto           = slots === 'auto',
            clearSize      = auto ? '' : null;

        let [extraBefore, extra] = reserve,
            advance = 1,
            filled = 0,
            firstItem, item, slotIndex;

        for (slotIndex = indexOfPos; indexMin <= slotIndex && slotIndex < indexMax; slotIndex += advance) {
            item = me.syncSlot(allSlots, defaultType, slotIndex, clearSize);
            firstItem = firstItem || item;

            if (filled < space) {
                // since filled starts at 0, we will always come here for at least all[0] (unless the carousel has
                // size 0)
                filled += item.element[offsetSize];

                if (auto) {
                    // Once we've measured all[0] we can compute the number of slots. We use floor() since we stretch
                    // each slot to fill the carousel.
                    return me.syncFixed(indexOfPos, propNames, allSlots, defaultType, reserve, ceil(space / filled));
                }

                if (advance > 0) {
                    if (slotIndex + 1 < indexMax) {  // if we can render the next slot
                        if (filled < space || extra) {  // if we should render the next slot
                            continue;
                        }
                    }

                    // we've filled the space or hit indexMax, so flip into reverse mode
                    extraBefore += extra;
                    extra = 0;
                }
            }

            if (--extra < 1) {
                if (advance < 0 || !extraBefore) {
                    break;
                }

                // backup = space - filled;
                advance = -1;
                slotIndex = indexOfPos;
                extra = extraBefore;
            }
        }

        return firstItem;
    }

    syncFixed(indexOfPos, propNames, allSlots, defaultType, reserve, slots, indexMin, indexMax) {
        const
            me         = this,
            { shrinkWrap, shrinkWrapped } = me,
            itemSize   = `${100 / slots}%`,
            indexOfEnd = indexOfPos + slots;

        let beginIndex = indexOfPos - reserve[0],
            endIndex = indexOfEnd + reserve[1],
            size = 0,
            firstItem, item, items, lastVisibleIndex, slotIndex;

        while (endIndex > indexMax) {
            --beginIndex;
            --endIndex;
        }

        while (beginIndex < indexMin) {
            ++beginIndex;
            ++endIndex;
        }

        for (slotIndex = beginIndex; slotIndex < endIndex; ++slotIndex) {
            item = me.syncSlot(allSlots, defaultType, slotIndex, shrinkWrap && !shrinkWrapped ? '' : itemSize);

            if (slotIndex === indexOfPos) {
                firstItem = item;
            }

            if (shrinkWrap) {
                (items || (items = [])).push(item);
            }
            else {
                item[propNames.size] = itemSize;
            }
        }

        if (shrinkWrap) {
            lastVisibleIndex = min(indexOfEnd, endIndex - reserve[1]);

            for (slotIndex = lastVisibleIndex - slots; slotIndex < lastVisibleIndex; ++slotIndex) {
                size += items[slotIndex - beginIndex][propNames.size];
            }

            for (item of items) {
                item[propNames.size] = itemSize;
            }

            if (size) {
                me.innerCt.style[propNames.minSize] = `${size}px`;
                me.shrinkWrapped = true;
            }
        }

        return firstItem;
    }

    syncSlot(allSlots, defaultType, slotIndex, itemSize) {
        const
            me                     = this,
            { propNames, syncGen } = me,
            changeSize             = itemSize !== null;

        let reuse = null,
            config, index, slot, it, type;

        /*
            In terms of slot reuse, we always prefer the slot already configured for the desired slotIndex.

            Failing that, select the slot with the greatest delta in slotIndex. Since sync is a forward sweep (at
            least initially), there are two possibilities where item stability can be maximized:

            1. Sync is starting w/greater initial slotIndex:

                  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
                  │  0  ││  1  ││  2  ││  3  ││  4  ││  5  ││  6  │     (allSlots from last sync)
                  └─────┘└──▲──┘└─────┘└─────┘└─────┘└─────┘└─────┘
                            │
                            initial slotIndex for this sweep

                  On the last pass, the slot previously assigned to slotIndex 0 will be the only slot not used in
                  the current syncGen. It will be selected as the slot to reuse for slotIndex 7.

                  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
                  │  7  ││  1  ││  2  ││  3  ││  4  ││  5  ││  6  │     (allSlots after this sync)
                  └─────┘└─────┘└─────┘└─────┘└─────┘└─────┘└─────┘

            2. Sync is starting w/lesser initial slotIndex:

                         ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
                     0   │  1  ││  2  ││  3  ││  4  ││  5  ││  6  ││  7  │     (allSlots from last sync)
                     ▲   └─────┘└─────┘└─────┘└─────┘└─────┘└─────┘└─────┘
                     │
                     initial slotIndex for this sweep

                 The least desirable slot to reuse for the initial item is 1. Obviously, the right answer in this
                 case is the slot previously assigned to slotIndex 7.

                         ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
                         │  1  ││  2  ││  3  ││  4  ││  5  ││  6  ││  0  │     (allSlots after this sync)
                         └─────┘└─────┘└─────┘└─────┘└─────┘└─────┘└─────┘
         */
        for (it of allSlots) {
            if (it[SYNC_GEN_PROP] !== syncGen) {  // if (item has not yet been claimed by this syncGen)
                index = it[INDEX_PROP];

                if (index === slotIndex) {
                    slot = it;

                    if (changeSize) {
                        slot[propNames.size] = itemSize;
                    }

                    break;
                }

                if (!reuse || index > reuse[INDEX_PROP]) {
                    reuse = it;
                }
            }
        }

        if (!slot) {
            config = me.configureSlot(slotIndex, me, reuse);

            if (reuse) {
                slot = reuse;

                if (changeSize) {
                    slot[propNames.size] = itemSize;
                }

                delete config.type;  // reconfigure?
                slot.setConfig(config);
            }
            else {
                type = config.type ? Widget.resolveType(config.type) : defaultType;
                config = type.mergeConfigs(me.defaults, config);

                if (changeSize) {
                    config[propNames.size] = itemSize;
                }

                slot = me.add(config);
                allSlots.push(slot);

                slot.ion({
                    thisObj   : me,
                    name      : `${slot.id}-listeners`,
                    focusTrap : 'onSlotFocusTrap'
                });
            }

            slot[INDEX_PROP] = slotIndex;

            if (!me.slotSize) {
                me.slotSize = slot[propNames.size];  // measure the item here
            }

            slot[propNames.vxy[0]] = slotIndex * me.slotSize;
        }

        slot[SYNC_GEN_PROP] = syncGen;

        return slot;
    }

    //endregion
}

// Register this widget type with its Factory
Carousel.initClass();
