import Gesture from './Gesture.js';

/**
 * @module Core/helper/util/LongPress
 */

/**
 * This class recognizes and fires `longPress` gesture events.
 * @internal
 */
export default class LongPress extends Gesture {
    static $name = 'LongPress';
    static gestureName = 'longPress';

    static configurable = {
        /**
         * The number of milliseconds that a user must sustain a touch to trigger the `longPress` event.
         * @config {Number}
         * @default
         */
        duration : 700,

        /**
         * Set to `false` to disable firing `longPress` based on the native timeout behavior. On many mobile platforms,
         * the native timeout is 500ms and would render the browser's native context menu.
         *
         * @config {Boolean}
         * @default true
         */
        native : null,

        targetEvents : {
            contextmenu : 'onContextMenu'
        },

        /**
         * The number of pixels of movement allowed before rejecting the gesture as a longpress. In ideal conditions
         * this would be 0, but some users may have difficulty holding perfectly still for the longpress `duration`.
         * @config {Number}
         * @default
         */
        tolerance : 5
    };

    static fires = [
        'beforeLongPress',
        'longPress'

        // Since longpress contextmenu can prevent touchend event we have to declare recognition *and* completion
        // at the same time. Therefore:
        //   - no longPressStart since there is no gap between recognition and completion
        //   - no longPressCancel because this would only occur if a touchcancel arrived after recognition but
        //      before completion
        // 'longPressStart',
        // 'longPressCancel'
    ];

    static touchPoints = 1;

    detect() {
        this.recognized = true;
        this.end();  // self-destruct
    }

    onContextMenu(ev) {
        if (ev.pointerType === 'touch') {
            ev.preventDefault();

            (this.native !== false) && this.detect();
        }
    }

    recognize(pointers) {
        let ret = super.recognize(pointers);

        if (ret !== false) {
            const [/* dx */, /* dy */, adx, ady] = pointers.current.dxy;

            if (Math.max(adx, ady) > this.tolerance) {
                // movement in x or y is not a longPress
                ret = false;
            }
            // we never set ret=true here ... the timer does that
        }

        return ret;
    }

    updateDuration(duration) {
        duration && this.setTimeout(() => this.detect(), duration);
    }
}

LongPress.initClass();
