/**
 * @module Grid/util/SubGridScroller
 */

import Scroller from '../../Core/helper/util/Scroller.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import DomHelper from '../../Core/helper/DomHelper.js';

const
    immediatePromise     = Promise.resolve(),
    defaultScrollOptions = {
        block : 'nearest'
    };

/**
 * A Scroller subclass which handles scrolling in a SubGrid. Needs special treatment since the SubGrid itself only
 * allows horizontal scrolling, while the vertical scrolling is done by an outer element containing all subgrids.
 *
 * @internal
 */
export default class SubGridScroller extends Scroller {
    static $name = 'SubGridScroller';

    // SubGrids do not drive the scrollWidth of their partners (Header and Footer)
    // SubGrids scrollWidth is propagated from the Header by SubGrid.refreshFakeScroll.
    static configurable = {
        propagate : false,
        overflowX : 'hidden-scroll',
        yScroller : null
    };

    // The Grid's main Y scroller keeps a list of the X scrollers
    updateYScroller(yScroller) {
        yScroller?.addScroller(this);
    }

    scrollIntoView(element, options = defaultScrollOptions) {
        const
            me = this,
            { xDelta, yDelta } = me.getDeltaTo(element, options);

        let result = (xDelta || yDelta) ? me.scrollBy(xDelta, yDelta, options) : immediatePromise;

        if (options.highlight || options.focus) {
            const scrollPromise = result;

            result = result.then(() => {
                if (scrollPromise.cancelled) {
                    return;
                }

                element = element instanceof Rectangle
                    ? element
                    : options.elementAfterScroll?.() ?? element;

                if (options.highlight) {
                    if (options.highlight instanceof Element) {
                        DomHelper.highlight(options.highlight, me);
                    }
                    else if (element instanceof Rectangle) {
                        element.translate(-xDelta, -yDelta).highlight();
                    }
                    else if (typeof options.highlight === 'boolean') {
                        DomHelper.highlight(element);
                    }
                    else {
                        me.callback(options.highlight, me, [element]);
                    }
                }
                if (options.focus) {
                    element.focus({ preventScroll : true });
                }
            });

            result.cancel = () => scrollPromise.cancel?.();
        }

        return result;
    }

    scrollBy(xDelta, yDelta, options) {
        const
            yPromise = yDelta && this.yScroller.scrollBy(0, yDelta, options),
            xPromise = xDelta && super.scrollBy(xDelta, 0, options),
            result   = Promise.all([xPromise, yPromise]);

        // Set up cross canceling
        result.cancel = () => {
            xPromise?.cancel?.();
            yPromise?.cancel?.();
            result.cancelled = true;
        };

        if (xPromise?.cancel && yPromise?.cancel) {
            // Make sure a side effect of scrolling in one direction does not disturb the other
            options.force = true;
        }

        return result;
    }

    scrollTo(toX, toY, options) {
        const
            yPromise = (toY != null) && this.yScroller.scrollTo(null, toY, options),
            xPromise = (toX != null) && super.scrollTo(toX, null, options);

        // Keep partners in sync immediately unless we are going to animate our position.
        // There are potentially three: The header, the footer and the docked fake horizontal scroller.
        // It will be more efficient and maintain correct state doing it now.
        if (!(options && options.animate)) {
            this.syncPartners();
        }

        const result = Promise.all([xPromise, yPromise]);

        // Set up cross canceling
        result.cancel = () => {
            xPromise?.cancel?.();
            yPromise?.cancel?.();
            result.cancelled = true;
        };

        if (xPromise?.cancel && yPromise?.cancel) {
            // Make sure a side effect of scrolling in one direction does not disturb the other
            options.force = true;
        }

        return result;
    }

    refreshPosition() {
        return [super.refreshPosition()[0], this.yScroller.refreshPosition()[1]];
    }

    get viewport() {
        const
            elementBounds = Rectangle.from(this.element),
            viewport      = this.yScroller ? elementBounds.intersect(Rectangle.from(this.yScroller.element)) : elementBounds;
        // For 0 height subgrids, viewport will be `false` but we still expect a Rectangle to be returned
        return viewport || new Rectangle(elementBounds.x, elementBounds.y, elementBounds.width, 0);
    }

    set y(y) {
        if (this.yScroller) {
            this.yScroller.y = y;
        }
    }

    get y() {
        return this.yScroller ? this.yScroller.y : 0;
    }

    get maxY() {
        return this.yScroller ? this.yScroller.maxY : 0;
    }

    get scrollHeight() {
        return this.yScroller ? this.yScroller.scrollHeight : 0;
    }

    get clientHeight() {
        return this.yScroller ? this.yScroller.clientHeight : 0;
    }

    suspendEvents() {
        super.suspendEvents();
        this.yScroller?.suspendEvents();
    }

    resumeEvents() {
        super.resumeEvents();
        this.yScroller?.resumeEvents();
    }
}
