import Base from '../../Base.js';
import ElementResizeHelper from '../../helper/ElementResizeHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/widget/mixin/Resizable
 */

/**
 * Mixin making popups resizable via the {@link #config-resizable} config.
 *
 * Example usage:
 *
 * ```js
 * // Resizable with default handles (all edges/corners)
 * const myPopup = new Popup({
 *   resizable : true
 * });
 * ```
 *
 * ## Useful configs
 *
 * | Config                                     | Description                                          |
 * |--------------------------------------------|------------------------------------------------------|
 * | {@link #config-resizable}                  | Enable or configure resize handles                    |
 *
 * ## See also
 *
 * - {@link Core.widget.Popup} - Common widget that uses Resizable
 *
 * @mixin
 */
export default Target => class Resizable extends (Target || Base) {
    static $name = 'Resizable';

    static configurable = {
        /**
         * Configure this property to allow the widget/component to be resized. Pressing <kbd>Shift</kbd> while resizing will
         * constrain the aspect ratio.
         *
         * - **`false`** (the default) disables resizing entirely.
         * - **`true`** enables resizing on all edges and corners.
         * - An **Object** allows fine-grained control, for example specifying which edges or corners have handles.
         *
         * Example usage:
         *
         * ```js
         * // Resizable with default handles (all edges/corners)
         * new SomePopup({
         *   resizable : true
         * });
         *
         * // Resizable with only start and bottom edges active
         * new SomePopup({
         *   resizable : {
         *     handles : {
         *       top    : false,
         *       end    : false,
         *       bottom : true,
         *       start  : true,
         *       // corners also available: topStart, topEnd, bottomStart, bottomEnd
         *       // all omitted properties default to `true` if unspecified
         *     }
         *   }
         * });
         * ```
         *
         * @prp {Boolean|Object} resizable
         * @default false
         * @property {Number} [resizable.minWidth=50]   The minimum width of the element.
         * @property {Number} [resizable.maxWidth]      The maximum width of the element.
         * @property {Number} [resizable.minHeight=50]  The minimum height of the element.
         * @property {Number} [resizable.maxHeight]     The maximum height of the element
         * @property {Object} [resizable.handles]       An object controlling which edges/corners are resizable.
         * @property {Boolean} [resizable.handles.topStart=true]     Resizable from top-start corner
         * @property {Boolean} [resizable.handles.top=true]          Resizable from top edge
         * @property {Boolean} [resizable.handles.topEnd=true]       Resizable from top-end corner
         * @property {Boolean} [resizable.handles.end=true]          Resizable from end edge
         * @property {Boolean} [resizable.handles.bottomEnd=true]    Resizable from bottom-end corner
         * @property {Boolean} [resizable.handles.bottom=true]       Resizable from bottom edge
         * @property {Boolean} [resizable.handles.bottomStart=true]  Resizable from bottom-start corner
         * @property {Boolean} [resizable.handles.start=true]        Resizable from start edge
         */
        resizable : null
    };

    updateResizable(value) {
        const me = this;

        if (value) {
            const config = typeof value === 'object' ? value : {};

            // Create an ElementResize instance for our main element
            me.resizeHelper = new ElementResizeHelper(ObjectHelper.assign({
                element           : me.element,
                internalListeners : {
                    resizeStart : me.onResizeStart,
                    thisObj     : me
                }
            }, config));
        }
        else {
            // Destroy the ElementResize instance
            me.resizeHelper?.destroy();
        }
    }

    onResizeStart() {
        // Disable all alignment
        this.alignTo(null);
    }

    doDestroy() {
        this.resizeHelper?.destroy();
        super.doDestroy();
    }

    updateRtl(rtl) {
        super.updateRtl(rtl);
        if (this.resizeHelper) {
            this.resizeHelper.rtl = rtl;
        }
    }
};
