import Base from '../../Base.js';

/**
 * @module Core/helper/util/Pointers
 */

const
    now = () => performance.now();

/**
 * Readonly object describing an active pointer's current state.
 * @typedef {Object} Pointer
 * @property {Number} id The `pointerId` of the [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent).
 * @property {PointerEvent} event Initially a [`pointerdown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event)
 * event, but becomes a [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event)
 * event once the first move occurs.
 * @property {PointerEvent} downEvent The initial [`pointerdown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event)
 * event.
 * @property {Number[]} dxy Six-element array starting:
 *   - `event.pageX - downEvent.pageX`
 *   - `event.pageY - downEvent.pageY`
 *   - `Math.abs(event.pageX - downEvent.pageX)`
 *   - `Math.abs(event.pageY - downEvent.pageY)`
 *   - `event.pageX`
 *   - `event.pageY`
 * @property {Number[]} xy The two-element array `[event.pageX, event.pageY]`.
 * @property {Number[]} xy0 The two-element array `[downEvent.pageX, downEvent.pageY]`.
 * @property {Number} dt The elapsed (or "delta") time in milliseconds since the `downEvent`.
 * @internal
 */

class Pointer {
    constructor(pointerDown) {
        const me = this;

        me.id = pointerDown.pointerId;
        me.downEvent = me.event = pointerDown;
        me.t0 = now();

        // capture these as they can be lost once the pointerDown is no longer the current event:
        me.xy = me.xy0 = [pointerDown.pageX, pointerDown.pageY];
    }

    get distance() {
        const [dx, dy] = this.dxy;

        return Math.sqrt(dx * dx + dy * dy);
    }

    get dt() {
        return now() - this.t0;
    }

    get dxy() {
        const
            { xy, xy0 } = this,
            dx = xy[0] - xy0[0],
            dy = xy[1] - xy0[1];

        return [dx, dy, Math.abs(dx), Math.abs(dy), ...xy];
    }

    clone() {
        const
            me = this,
            ret = new Pointer(me.downEvent);

        ret.t0 = me.t0;
        ret.xy = me.xy.slice();
        ret.xy0 = me.xy0.slice();

        return ret;
    }

    track(pointerEvent) {
        this.event = pointerEvent;
        this.xy = [pointerEvent.pageX, pointerEvent.pageY];
    }
}

/**
 * This class tracks active {@link #typedef-Pointer pointers} involved in the
 * [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) API.
 * @internal
 */
export default class Pointers extends Base {
    static $name = 'Pointers';

    static configurable = {
        currentEvent : null
    };

    /**
     * An array of {@link #typedef-Pointer} objects, in order of first-started to last-started.
     * @member {Pointer[]} active
     * @readonly
     */

    /**
     * The most recently active {@link #typedef-Pointer} object.
     * @member {Pointer|null} current
     * @readonly
     */

    construct(...args) {
        this.active = [];
        this.current = null;

        super.construct(...args);
    }

    get empty() {
        return !this.length;
    }

    get length() {
        return this.active.length;
    }

    /**
     * The primary {@link #typedef-Pointer}.
     * @member {Pointer|null}
     * @readonly
     */
    get primary() {
        return this.active[0] ?? null;
    }

    /**
     * The secondary {@link #typedef-Pointer}.
     * @member {Pointer|null}
     * @readonly
     */
    get secondary() {
        return this.active[1] ?? null;
    }

    get single() {
        return this.length === 1;
    }

    clone() {
        const
            ret = new Pointers(),
            { current, currentEvent } = this;

        let c, p;

        for (p of this.active) {
            ret.active.push(c = p.clone());

            if (p === current) {
                ret.current = c;
            }
        }

        if (!ret.current) {
            ret.current = current?.clone();
        }

        ret._currentEvent = currentEvent;

        return ret;
    }

    get(pointerId) {
        let ret = null,
            p;

        for (p of this.active) {
            if (p.id === pointerId) {
                ret = p;
                break;
            }
        }

        return ret;
    }

    track(ev) {
        this.currentEvent = ev;
        return this;
    }

    updateCurrentEvent(ev) {
        const
            me = this,
            type = ev.type.slice(7);  // strip 'pointer' prefix (length = 7)

        let current = me.get(ev.pointerId);

        if (type !== 'move') {
            // up/down/cancel... in any case, remove old Pointer
            me.active = me.active.filter(p => p !== current);
        }

        if (type === 'down') {
            me.active.push(current = new Pointer(ev));
        }
        else {
            current?.track(ev);  // cancel/move/up ... update (possibly orphaned) Pointer object
        }

        me.current = current;
    }
}

Pointers.initClass();
