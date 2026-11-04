import Base from '../../Base.js';
import GlobalEvents from '../../GlobalEvents.js';
import Widget from '../Widget.js';
import DomHelper from '../../helper/DomHelper.js';
import EventHelper from '../../helper/EventHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import FunctionHelper from '../../helper/FunctionHelper.js';

DomHelper.loadStylesheet('Core/widget/util/Ripple.css');

// import Stylesheet from './Ripple.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Ripple');

// No touch yet. Not 0, performance.now() is measured from page load, so a mousedown in the first 200ms would be
// taken for one following a touch
let lastTouchTime = -Infinity;

const hasRipple = w => w.ripple;

export default class Ripple extends Base {

    static $name = 'Ripple';

    static type = 'ripple';

    afterConstruct() {
        super.afterConstruct();

        this.setupRippleListenerOnce();
    }

    setupRippleListenerOnce() {
        if (!this.rippleControlEventDetacher) {
            this.rippleControlEventDetacher = EventHelper.on({
                element   : this.rootElement,
                mousedown : 'onRippleControllingEvent',
                thisObj   : this,
                capture   : true,
                once      : true
            });
        }
    }

    cleanUpRippleListeners() {
        this.rippleControlEventDetacher?.();
        this.listenerDetacher?.();

        this.rippleControlEventDetacher = null;
        this.listenerDetacher = null;
    }

    onRippleControllingEvent(event) {
        const
            me = this,
            { ripple } = DomHelper.getThemeInfo(me.rootElementEarly);

        me.listenerDetacher?.();

        if (ripple) {
            me.listenerDetacher = EventHelper.on({
                // Trap all mousedowns and see if the encapsulating Component is configured to ripple
                mousedown : {
                    element : me.rootElement,
                    capture : true,
                    handler : 'onMousedown'
                },
                touchstart : {
                    element : me.rootElement,
                    capture : true,
                    handler : 'onTouchStart'
                },
                thisObj : me
            });

            // If this is the first mousedown, start listening to theme changes and trigger ripple manually
            if (event.type === 'mousedown') {
                me.onMousedown(event);

                me.listenerDetacher = FunctionHelper.createSequence(
                    me.listenerDetacher,
                    GlobalEvents.ion({
                        theme   : 'onRippleControllingEvent',
                        thisObj : me
                    }),
                    me,
                    me
                );
            }
        }
    }

    onTouchStart(event) {
        lastTouchTime = performance.now();
        this.handleTriggerEvent(event);
    }

    onMousedown(event) {
        // We need to prevent a touchend->mousedown simulated mousedown from triggering a ripple.
        // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
        if (performance.now() - lastTouchTime > 200) {
            this.handleTriggerEvent(event);
        }
    }

    handleTriggerEvent(event) {
        const targetWidget = Widget.fromElement(event.target, hasRipple);

        if (targetWidget) {
            const
                rippleCfg = targetWidget.ripple,
                target    = rippleCfg.delegate
                    ? event.target.closest(rippleCfg.delegate)
                    : (targetWidget.focusElement || targetWidget.element);

            if (target) {
                const ripple = ObjectHelper.assign({
                    event,
                    target
                }, rippleCfg);

                // The clip option is specified as a string property name or delegate
                if (typeof ripple.clip === 'string') {
                    ripple.clip = targetWidget[ripple.clip] || event.target.closest(ripple.clip);

                    // Not inside an instance of the clip delegate, then no ripple
                    if (!ripple.clip) {
                        return;
                    }
                }
                this.ripple(ripple);
            }
        }
    }

    async ripple({ event, target }) {
        const
            box        = target.getBoundingClientRect(),
            rippleClip = DomHelper.createElement({
                parent    : target,
                className : 'b-ripple-clip',
                style     : {
                    '--b-click-x' : `${Math.round(event.clientX - box.x)}px`,
                    '--b-click-y' : `${Math.round(event.clientY - box.y)}px`
                }
            });

        // Using void to prevent build optimizers from removing the reflow trigger
        void rippleClip.offsetWidth;

        rippleClip.classList.add('b-animate');

        const animations = DomHelper.getAnimations(target, { subtree : true });

        await Promise.allSettled(animations.map(anim => anim.finished));

        rippleClip.remove();
    }
}

Widget.RippleClass = Ripple;
