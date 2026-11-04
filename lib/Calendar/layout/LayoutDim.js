import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Calendar/layout/LayoutDim
 */
const
    noCalcRe = /^[+-]?\d+(?:\.\d+)?(?:%|px)?$/;

/**
 * Helper class for layout size pairs used by the Calendar's day event layout system. A `LayoutDim` encapsulates
 * a two-part size value consisting of a ratio (proportional part) and a delta (fixed pixel or CSS offset), which
 * together can express complex CSS `calc()` expressions such as `calc(50% + 10px)`. This is used to position
 * and size event blocks within DayView columns where both proportional and absolute offsets are needed.
 * @internal
 */
export default class LayoutDim {
    static from(value) {
        if (value == null) {
            return null;
        }

        if (value instanceof LayoutDim) {
            return value;
        }

        // isNaN('4')=false, isNaN('4%')=true (preserve strings like "5% + 10px")
        if (!(Array.isArray(value) || (typeof value === 'string' && isNaN(value)))) {
            value = Number(value);
            // 0 must go through as a size, not a proportion.
            // Must not be a falsy value, so upgrade 0 to a Number object.
            value = value === 0 ? [0, new Number(0)] : (value < 1) ? [value, 0] : [0, value];
        }

        return new LayoutDim(...value);
    }

    static get(value) {
        return LayoutDim.from(value) || LayoutDim.ZERO;
    }

    constructor(ratio, delta) {
        this.r = ratio;
        this.d = delta;
    }

    add(v) {
        v = LayoutDim.from(v);

        return v ? new LayoutDim(this.r + v.r, this.d + v.d) : this;
    }

    adjust(r, d) {
        this.r += r || 0;
        this.d += d || 0;

        return this;
    }

    freeze() {
        return Object.freeze(this);
    }

    px(range) {
        return this.r * (range || 100) + this.d;
    }

    sub(v) {
        v = LayoutDim.from(v);

        return v ? new LayoutDim(this.r - v.r, this.d - v.d) : this;
    }

    * [Symbol.iterator]() {
        yield 'r';
        yield 'd';
    }

    stringify() {
        const str = this.toString();

        return noCalcRe.test(str) ? str : `calc(${str})`;
    }

    toString() {
        const { r, d } = this;

        let str;

        if (r) {
            str = DomHelper.percentify(r * 100);

            if (d) {
                str = `${str} + ${d}px`.replace('+ -', '- ');
            }
        }
        else {
            str = d ? `${d}px` : '0';
        }

        return str;
    }
}

LayoutDim.ZERO = new LayoutDim(0, 0).freeze();
