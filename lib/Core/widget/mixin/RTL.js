import Base from '../../Base.js';

/**
 * @module Core/widget/mixin/RTL
 */

/**
 * Mixin that adds right-to-left (RTL) layout support to widgets. When a widget is rendered inside an element with
 * `direction: rtl` style, the {@link #config-rtl} property is automatically set to `true`. It can also be configured
 * explicitly to force RTL mode regardless of the document direction.
 *
 * ```javascript
 * const panel = new Panel({
 *     rtl   : true,
 *     items : [{ type : 'textfield', label : 'Name' }]
 * });
 * ```
 *
 * ## Useful configs
 *
 * | Config                | Description                                          |
 * |-----------------------|------------------------------------------------------|
 * | {@link #config-rtl}   | Set `true` to force right-to-left layout             |
 *
 * ## See also
 *
 * - {@link Core.widget.Widget} - Base widget class
 *
 * @mixin
 */
export default Target => class RTL extends (Target || Base) {

    static $name = 'RTL';

    get widgetClass() {}

    static configurable = {
        /**
         * If a widget is rendered into an element which has computed style `direction:rtl`, this property will be
         * set to `true`
         *
         * Rendering a widget into an element which, either by a CSS rule, or by its inline `style` has an
         * explicit direction will cause the widget to use that direction regardless of the owning document's
         * direction.
         *
         * In this way, an RTL widget may operate normally inside an LTR page and vice versa.
         *
         * @member {Boolean} rtl
         */

        /**
         * This may be configured as `true` to make the widget's element use the `direction:rtl` style.
         *
         * All descendant widgets, including any {@link Core.widget.Widget#config-floating} widgets will
         * inherit this setting.
         * @config {Boolean}
         * @default false
         */
        rtl : null
    };

    // Replace generated is-property, to reduce risk of confusion
    get isRTL() {
        return this.rtl;
    }

    updateRtl(rtl) {
        if (this.element) {
            this.toggleCls('b-rtl', rtl === true);
            this.toggleCls('b-ltr', rtl === false);
        }
    }

    startConfigure(config) {
        const
            me        = this,
            { owner } = me;

        super.startConfigure?.(arguments);

        // If we are not configured with an RTL setting, infer it from our owner, or render context
        if (config.rtl == null) {
            // Acquire our rtl setting from our owner if possible
            if (owner) {
                // Peek at configuration to avoid triggering config system.
                // If not there, fall back to actual property (which may have been set directly)
                config.rtl = owner.peekConfig?.('rtl') || owner._rtl;
            }
            // Acquire our rtl setting from our encapsulating (renderTo or adopt etc) element.
            // Floating widgets will do this at render time.
            else if (!config.floating) {
                const el = config.rootElement || config.forElement || (me.changeElementRef(me.getRenderContext(config)[0] || config.adopt));

                if (el) {
                    config.rtl = el.nodeType === 1 && getComputedStyle(el).getPropertyValue('direction') === 'rtl';
                }
                else {
                    config.rtl = getComputedStyle(document.body).getPropertyValue('direction') === 'rtl';
                }
            }

            // Clear the rtl config's configDone property to ensure it is read in the ingestion phase.
            // Also, create an initial getter so that referencing this.rtl during configuration ingests the newly set value
            if (config.rtl) {
                me.configDone.rtl = false;
                me.$meta.configs.rtl.defineInitter(me, true);
            }
        }
    }

    // Render is only called on outer widgets, children read their setting from their owner unless explicitly set
    render(...args) {
        super.render?.(...args);

        const me = this;

        if (me.rtl === false || me.owner?.rtl === false) {
            return;
        }

        // Detect if rtl (catches both attribute `dir="rtl"` and CSS `direction: rtl`, as well as if owner uses rtl)
        // If we have an owner, it dictates our direction (avoid checking element, which is expensive)
        if (me.rtl || me.owner?.rtl || (!me.owner && getComputedStyle(me.element).direction === 'rtl')) {
            me.rtl = true;
            me.childItems?.forEach(i => i.rtl = true);
        }
    }
};
