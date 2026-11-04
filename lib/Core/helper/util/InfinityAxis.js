import Base from '../../Base.js';
import Fencible from '../../mixin/Fencible.js';

/**
 * @module Core/helper/util/InfinityAxis
 */

const
    { floor, max, min } = Math,
    constrain = (v, v0, v1) => min(max(v, v0), v1);

/**
 * This class manages a single axis for the {@link Core.helper.util.InfinityScroller}.
 * @internal
 */
export default class Axis extends Base.mixin(Fencible) {
    static $name = 'Axis';

    static configurable = {
        /**
         * The owning `InfinityScroller` for this axis.
         *
         * @config {Core.helper.util.InfinityScroller}
         */
        owner : null,

        /**
         * The delta between a logical scroll position and physical scroll position. In other words, adding the drift
         * to a logical scroll position, produces the corresponding physical scroll position.
         * @config {Number}
         */
        drift : null,

        overflow : null,

        /**
         * The logical scroll position.
         * @config {Number}
         */
        pos : {
            value   : null,
            default : 0,
            $config : 'lazy'
        },

        /**
         * The logical scroll range as a two element array containing the range's lower bound and upper bound,
         * respectively.
         * @config {Number[]}
         */
        range : {
            value   : null,
            $config : 'lazy'
        },

        scrollSize : null
    };

    static fenced = {
        sync : true
    };

    get direction() {
        const
            { name } = this,
            { events, scrollStarted } = this.owner;

        let d = 0,
            i, v, xy;

        for (i = events.length; i-- > 0; /* empty */) {
            xy = events[i][name];

            if (v != null) {
                d = v - xy;  // v is more recent pos

                if (d) {
                    break;
                }
            }

            v = xy;
        }

        if (!d && v != null) {
            d = v - scrollStarted[name];
        }

        return d;
    }

    get drift() {
        return this._drift || 0;
    }

    get driftRange() {
        const { range }  = this;

        return [range[0], max(range[0], range[1] - this.scrollSize)];
    }

    get items() {
        return this.owner?.items;
    }

    get safeZone() {
        const
            { drift, scrollSize } = this,
            safetyMargin = floor(this.owner.safetyMargin * scrollSize);

        return [drift + safetyMargin, drift + scrollSize - safetyMargin];
    }

    get scroller() {
        return this.owner?.client?.scrollable;
    }

    get scrollLimit() {
        return this.owner?.scrollLimit;
    }

    get vast() {
        const { range } = this;

        return range ? (range[1] - range[0]) > this.scrollSize : false;
    }

    changePos(pos) {
        const { range } = this;

        return constrain(pos || 0, range[0], range[1]);
    }

    updatePos(pos) {
        this.sync({ pos });
    }

    updateDrift(drift) {
        const
            me = this,
            { pos, range } = me,
            scrollPos = pos - drift;

        if (me.scrollPos === scrollPos) {
            // Sometimes changing the drift won't trigger a physical scroll event because the physical position is
            // unchanged (often because we use drift to keep the virtual position in the center of the scroll range,
            // we end up with the same physical position... esp when making large virtual jumps).
            const event = new CustomEvent('scroll', { detail : 'driftChange' });

            me.owner.scroller.element.dispatchEvent(event);
        }
        else if (range[0] <= pos && pos < range[1]) {
            me.scrollPos = scrollPos;
        }
    }

    changeRange(v, was) {
        const
            [lo, hi] = Array.isArray(v) ? v : [0, v],
            ret = [lo || 0, hi == null ? Infinity : hi];

        if (!was || ret[0] !== was[0] || ret[1] !== was[1]) {
            return ret;
        }
    }

    updateRange(range) {
        this.scrollSize = range[1] - range[0];

        this.sync({ range });
    }

    changeScrollSize(value) {
        return min(value, this.scrollLimit);
    }

    snap() {
        const
            me = this,
            { direction, items, owner, pos, range } = me;

        let item, p0, p1, snap, snapThreshold;

        for (item of items) {
            [p0, p1] = me.getItemSpan(item);

            if (p0 <= pos && pos < p1) {
                if (p0 < pos) {
                    snapThreshold = owner.snapThreshold;

                    if (snapThreshold < 1) {
                        snapThreshold = snapThreshold * (p1 - p0);
                    }

                    snapThreshold = max(1, snapThreshold);  // at least 1px for Firefox

                    /*
                        Item is partially visible at the start of the visible range... do we want to snap to its start
                        (p0) or its end (p1)?

                                                      ╔══════════════════╗
                                             ┌───────┐║┌───────┐┌───────┐║┌───────┐
                                             │ item0 │║│ item1 ││ item2 │║│ item3 │
                                             └───────┘║└───────┘└───────┘║└───────┘
                                                      ╚══════════════════╝
                                                     /      scrollEl      \
                                    direction < 0   /                      \  direction > 0
                                                   /                        \
                                                  ▼                          ▼
                               ╔══════════════════╗                                  ╔══════════════════╗
                         ┌─────║─┐┌───────┐┌──────║─┐┌───────┐           ┌───────┐┌──║─────┐┌───────┐┌──║─────┐
                         │     ║ ││       ││      ║ ││ item3 │           │ item0 ││  ║     ││       ││  ║     │
                         └─────║─┘└───────┘└──────║─┘└───────┘           └───────┘└──║─────┘└───────┘└──║─────┘
                         ▲     ╚═▲════════════════╝                               ▲  ╚═════▲════════════╝
                         |     ▲ |     >>content>>                                |  ▲     |    <<content<<
                         |     | |                                                |  |     |
                         p0  pos p1                                             p0  pos   p1
                    */
                    if (direction < 0) {  // content is moving rightward
                        // if (amount of right edge revealed is sufficient)
                        //     then snap to reveal left edge
                        //     else revert
                        snap = (p1 - pos > snapThreshold) ? p0 : p1;
                    }
                    else {  // content is moving leftward
                        // if (amount of left edge now out of view is sufficient)
                        //     then snap to entire item moved out of view to the left
                        //     else revert
                        snap = (pos - p0 > snapThreshold) ? p1 : p0;
                    }

                    snap = constrain(snap, range[0], range[1]);

                    me.pos = snap;
                    owner.watchForEnd();
                }
                else {
                    owner.scrolling = Boolean(me.scroller.scrollAnimation);
                }

                break;
            }
        }
    }

    sync(updates) {
        /*
            In the simplest case (when "range[1] - range[0]" is less than the maximum scrollSize), "drift" is the
            offset from logical coordinate range[0] to physical coordinate 0:

                      ┌───────────────────────────────────┐
                      │                                   │  (logical)
                      └───────────────────────────────────┘
                    -1000                                1000
                        \___________  drift = -1000
                                    \
                                     ▼
                                      ╔═════════════════════════════════════╗
                                      ║                                     ║  (physical)
                                      ╚═════════════════════════════════════╝
                                      0                                   2000

            What if the maximum, physical scroll range were 1000px? There are a range of "drift" values, so the ideal
            drift is chosen from the logical scroll position:

                                            0               1000 (physical)
                        ┌───────────────────╔═════════════════╗
                        │                   ║        [---]    ║     drift = 0      ("[---]" = viewport / visible area)
                        └───────────────────╚════════▲════════╝
                                                    pos=500
                        ┌──────────╔═════════════════╗────────┐
                        │          ║        [---]    ║        │     drift = -500
                        └──────────╚════════▲════════╝────────┘
                                           pos=0
                        ╔═════════════════╗───────────────────┐
                        ║        [---]    ║                   │     drift = -1000
                        ╚════════▲════════╝───────────────────┘
                                pos=-500
                      -1000                 0               1000 (logical)

            As the user scrolls (changes the scroll position), the drift must be dynamically adjusted to ensure the
            viewport remains entirely visible inside the physical scroll range. Consider the scroll position (pos)
            moving right:

                        ┌──────────╔═════════════════╗────────┐
                        │          ║            [---]║        │     drift = -500
                        └──────────╚════════════▲════╝────────┘
                                              pos=250

                        ┌───────────────╔═════════════════╗───┐
                        │               ║       [---]     ║   │     drift = -250
                        └───────────────╚═══════▲═════════╝───┘
                                              pos=250

                        ┌───────────────╔═════════════════╗───┐
                        │               ║░░░   [---]   ░░░║   │
                        └───────────────╚══▲═══▲═══════▲══╝───┘
                                          /   pos       \
                                     safety              safety
                                      zone                zone

            The minimum drift then is range[0], i.e., the lower bound of the logical scroll range. The maximum drift is
            the upper bound of the logical scroll range (i.e., range[1]) minus the maximum physical scroll size.
        */
        const
            me = Object.assign(this, updates),
            { _drift : driftWas, range, vast } = me;

        if (range && range[0] !== range[1]) {
            let { pos } = me,
                drift;

            const outOfRange = pos < range[0] || pos >= range[1];

            if (pos == null || outOfRange) {
                pos = (range[1] < 0) ? range[0] : constrain(0, range[0], range[1]);
            }

            if (!vast) {
                // logical range can be fully covered by physical scroll range... but range[0] may not be 0
                drift = range[0];
            }
            else {
                // logical range exceeds physical scroll limit
                const { driftRange, safeZone, scrollSize } = me;

                if (driftWas == null || pos < safeZone[0] || pos > safeZone[1]) {
                    drift = constrain(floor(pos - scrollSize / 2), driftRange[0], driftRange[1]);
                }
                else {
                    drift = driftWas;
                }
            }

            me.scroller.positionDirty = true;

            me.overflow = 'hidden-scroll';
            me.drift = drift;

            if (drift !== driftWas) {
                if (outOfRange) {
                    me.positionDirty = false;
                    me._pos = null;
                    me.pos = pos;
                }
                else {
                    // else sets scrollPos in updateDrift
                    me.positionDirty = true;
                }
            }
            else if (updates?.pos != null) {
                me.scrollPos = pos - drift;
                me.positionDirty = true;
            }
            else {
                if (me.positionDirty) {
                    me.positionDirty = false;
                    me._pos = null;
                }

                me.pos = me.scrollPos + drift;
            }

            if (updates?.range || drift !== driftWas) {
                me.owner.syncItems();
            }
        }
        else {
            me.overflow = 'hidden';
        }
    }

    toLogical(physical) {
        return physical + this.drift;
    }

    /**
     * Returns the physical scroll position for the given logical scroll position. Valid physical scroll positions are
     * not negative. This method returns NaN for logical scroll positions that cannot be converted to a valid, physical
     * scroll position.
     * @param {Number} logical
     * @returns {Number}
     */
    toPhysical(logical) {
        const physical = logical - this.drift;

        return (physical >= 0 && physical < this.scrollLimit) ? physical : NaN;
    }
}

//--------------------------------------------

class XAxis extends Axis {
    get name() {
        return 'x';
    }

    get other() {
        return this.owner?.y;
    }

    get scrollPos() {
        // In FF, we sometimes end up at 5000.25 when asked to scroll to 5000
        return Math.round(this.scroller.x);
    }

    set scrollPos(v) {
        this.scroller.x = v;
    }

    get scrollSize() {
        return this.scroller.scrollWidth;
    }

    set scrollSize(v) {
        super.scrollSize = v;
    }

    getItemSpan(item) {
        const
            vxy = item.$vxy,
            { x } = vxy;

        return [x, x + vxy.width];
    }

    updateScrollSize(v) {
        this.scroller.scrollWidth = v;
    }

    updateOverflow(overflow) {
        this.scroller.overflowX = overflow;
    }
}

//--------------------------------------------

class YAxis extends Axis {
    get name() {
        return 'y';
    }

    get other() {
        return this.owner?.x;
    }

    get scrollPos() {
        // In FF, we sometimes end up at 5000.25 when asked to scroll to 5000
        return Math.round(this.scroller.y);
    }

    set scrollPos(v) {
        this.scroller.y = v;
    }

    get scrollSize() {
        return this.scroller.scrollHeight;
    }

    set scrollSize(v) {
        super.scrollSize = v;
    }

    getItemSpan(item) {
        const
            vxy = item.$vxy,
            { y } = vxy;

        return [y, y + vxy.height];
    }

    updateScrollSize(v) {
        this.scroller.scrollHeight = v;
    }

    updateOverflow(overflow) {
        this.scroller.overflowY = overflow;
    }
}

Axis.X = XAxis;
Axis.Y = YAxis;
