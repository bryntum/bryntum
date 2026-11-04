import Gesture from './Gesture.js';

/**
 * @module Core/helper/util/Swipe
 */

const
    makeAxis = (ax, delta, threshold) => Math.abs(delta) < threshold ? '' : `${delta < 0 ? '-' : '+'}${ax}`;

/**
 * This class recognizes and fires `swipe` gesture events.
 * @internal
 */
export default class Swipe extends Gesture {
    static $name = 'Swipe';
    static gestureName = 'swipe';

    static configurable = {
        axis : null,

        /**
         * The maximum amount of time (in milliseconds) for the swipe gesture to complete. If the touch gesture lasts
         * longer than this limit, the gesture will not be recognized as a `swipe`.
         * @config {Number}
         * @default
         */
        durationLimit : 700,

        /**
         * The time limit (in milliseconds) for a gesture to receive no events. If no touch movement occurs for this
         * amount of time, the gesture will not be recognized as a `swipe`.
         * @config {Number}
         * @default
         */
        idleLimit : 250,

        targetEvents : {
            contextmenu : 'onContextMenu',
            scroll      : {
                capture : true,  // scroll events do not bubble so we catch them on the descent
                handler : 'onTargetScroll'
            }
        },

        /**
         * The minimum amount of movement (in pixels) that must occur for the touch gesture to be recognized as a `swipe`.
         * @config {Number}
         * @default
         */
        threshold : 80,

        /**
         * The maximum amount of movement (in pixels) that is allowed on the opposite axis to still be recognized as
         * a `swipe`. By default, up to 30px of movement is allowed in the Y-axis of an X-axis swipe, and vice versa.
         * @config {Number}
         * @default
         */
        tolerance : 100
    };

    static fires = [
        'beforeSwipe',
        'swipe',
        'swipeStart',
        'swipeCancel'
    ];

    static touchPoints = 1;

    getDetails(details) {
        const
            me = this,
            pointer = me.pointers.current;

        if (pointer) {
            const [dx, dy, adx, ady, x, y] = pointer.dxy;

            details = {
                ...details,
                swipe : me.axis,
                dx,
                dy,
                adx,
                ady,
                x,
                y
            };
        }
        else {
            details = {
                ...details,
                swipe : me.axis
            };
        }

        return super.getDetails(details);
    }

    onContextMenu(ev) {
        if (ev.pointerType === 'touch') {
            this.recognized = false;
        }
    }

    onTargetScroll() {
        // scroll events are observed w/capture:true so that we see not only scroll on the target element but also
        // on any interior element... touch sequences that cause scroll events are not swipe gestures.
        this.recognized = false;
    }

    recognize(pointers) {
        let ret = super.recognize(pointers);

        if (ret !== false) {
            const
                me = this,
                { axis : axisNow, threshold, tolerance } = me,
                [dx, dy, adx, ady] = pointers.current.dxy,

                //
                //                            touchstart
                //                                 │
                //       \ ------------+-----------│-----------+------------ /  ◀───┐
                //       /             |           ▼           |             \      │ tolerance
                //       \             |           x           |             /  ◀───┘
                //       /             |                       |             \
                //       \ -------▲----+-----------------------+----▲------- /
                //                │    ▲           ▲           ▲    │
                //           active    │           │           │    active
                //                     └───────────┴───────────┘
                //                     -threshold     +threshold
                //
                axis = makeAxis('x', dx, threshold) + makeAxis('y', dy, threshold);

            if (
                // no movement (odd touchmove)
                (!dx && !dy) ||
                // significant movement in x & y axis is not a swipe (diagonal swipe maybe)
                (adx > tolerance && ady > tolerance) ||
                // change in direction or axis is no longer a swipe
                (axisNow && axisNow !== axis)
            ) {
                ret = false;
            }
            else if (axis) {
                // if we reach the tolerance, then swipe has started
                me.axis = axis;
                ret = true;
            }
        }

        return ret;
    }
}

Swipe.initClass();
