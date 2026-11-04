import Hint from '../widget/Hint.js';
import AsyncHelper from '../helper/AsyncHelper.js';
import Delayable from '../mixin/Delayable.js';
import Events from '../mixin/Events.js';
import Base from '../Base.js';
import DH from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Localizable from '../localization/Localizable.js';
import Rectangle from '../helper/util/Rectangle.js';
import GlobalEvents from '../GlobalEvents.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import EventHelper from '../helper/EventHelper.js';

/**
 * @module Core/util/HintFlow
 */

const
    buttonSpec = (index, count) => {
        return {
            previous : {
                weight  : 100,
                text    : 'L{Object.previous}',
                cls     : 'b-previous',
                hidden  : !index,
                onClick : 'up.onHintButtonClick'
            },
            next : {
                weight    : 100,
                text      : 'L{Object.next}',
                cls       : 'b-next',
                rendition : 'filled',
                hidden    : index === count - 1,
                onClick   : 'up.onHintButtonClick'
            },
            stop : {
                weight    : 300,
                text      : 'L{Object.close}',
                cls       : 'b-stop',
                rendition : 'filled',
                hidden    : index !== count - 1,
                onClick   : 'up.onHintButtonClick'
            }
        };
    },
    keyExtractor =  /\[(?:([\w+]+)\+)?(\w+)\]|./g;

/**
 * A class which shows a user a series of educational {@link Core.widget.Hint} popups in a flow. Each hint in the flow
 * is shown in sequence attached to a target element. The user can navigate through the hints using buttons or
 * keyboard shortcuts (N for next, P for previous, S or ESCAPE to stop).
 *
 * It must be configured with an array of hint configurations. Each configuration is a config object for a
 * {@link Core.widget.Hint}. Each hint in the flow may be configured with {@link Core.widget.Hint#config-content}
 * or {@link Core.widget.Hint#config-title} to show contextual information for its `target`:
 *
 * ```javascript
 * new HintFlow({
 *     // Default configs to apply to all hints
 *     defaults : {
 *         modal : true
 *     },
 *     hints : [{
 *         // CSS selector to find the target element
 *         target  : '.b-tab-panel-tab[data-item-index="1"]',
 *
 *         // Action to take when the 'Next' button is clicked
 *         nextAction : {
 *             click : '.b-tab-panel-tab[data-item-index="1"]'
 *         }
 *
 *         // Config props for the displayed Hint popup
 *         title   : 'Change tab',
 *         content : 'Click here to move to the next tab',
 *         align   : 't-n'
 *     }, {
 *         target  : '.b-tab-panel .b-tab-panel-body :nth-child(2) input',
 *         title   : 'Change name',
 *         content : 'Enter the new name here',
 *         nextAction : {
 *               text : 'New name[Enter]'
 *         }
 *     }, {
 *         target  : '.b-button:contains(Save)',
 *         title   : 'Save',
 *         content : 'Click here to save the changes',
 *         nextAction : {
 *            click : '.b-button:contains(Save)'
 *         }
 *    }]
 * });
 * ```
 *
 * Each entry in the `hints` array of the {@link Core.util.HintFlow} class should be an object with the following properties:
 *  - target: Required The target element to highlight, or a CSS selector to find the target element.
 *    If the target selector ends with a `?`, the hint will be skipped if the target is not found.
 *    By default, the hint will be aligned to this element.
 *  - title: The title to display in the hint.
 *  - content: Required. The content to display in the hint.
 *  - align: The alignment of the hint relative to the target element. If this is specified as an {@link AlignSpec} object,
 *    the hint will be aligned to the `target` property of this object if present.
 *     - target: The element to align to, or a CSS selector to find the element to align to.
 *  - nextAction: The action(s) to take when the 'Next' button is clicked. Properties may be:
 *     - click: A CSS selector to find the target element to click.
 *     - contextmenu: A CSS selector to find the target element to right click.
 *     - dblclick: A CSS selector to find the target element to double click.
 *     - type: A string to type into the target element.
 *     - fn: A function to call when the hint is shown.
 *     - drag: An object with the following properties:
 *         - target: The target element to drag, or a CSS selector to find the target element.
 *         - by: The distance to drag the target element, as an array of `[dx, dy]`.
 *     - waitFor: A CSS selector to wait for or the number of milliseconds to wait before continuing to the next hint.
 *     - allowInteraction: Specify as `true` to allow the user to interact with the target element.
 *
 *  - previousAction: The action(s) to take when the 'Previous' button is clicked.
 *  - autoNext: The number of milliseconds to wait before automatically moving to the next hint, or a CSS selector
 *    to find the target element to wait for.
 *  - highlightTarget: Specify as `true` to highlight the target element with a bright outline.
 *  - buttons: Overrides for buttons to show in the hint. This is an object which may contain the following properties:
 *    - next: Override config for the 'Next' button
 *    - previous: Override config for the 'Previous' button
 *    - stop: Config to add a 'Stop' button. By default the dialog close, or typing <kbd>S</kbd> button is used.
 *
 * Other properties (eg {@link Core.widget.Popup#config-modal} can be added to the object, and will be passed to the
 * {@link Core.widget.Hint} instance.
 *
 * Pressing <kbd>N</kbd> will navigate to the next hint. <kbd>P</kbd> will navigate to the previous hint.
 * Pressing <kbd>S</kbd> or <kbd>Escape</kbd> will stop the tutorial. These defaults can be changed by setting the
 * `keyMap` property in the {@link #config-defaults} object.
 *
 * ## Useful configs
 *
 * | Config                              | Description                                        |
 * |-------------------------------------|----------------------------------------------------|
 * | {@link #config-hints}               | Array of hint configurations to show in sequence   |
 * | {@link #config-defaults}            | Default config applied to every hint in the flow   |
 *
 * ## See also
 *
 * - {@link Core.widget.Hint} - The popup widget used for each step
 *
 * {@inlineexample Core/widget/Hint.js}
 * @demo Calendar/custom-rendering
 *
 * @extends Core/Base
 * @noclasstype
 */
export default class HintFlow extends Base.mixin(Localizable, Events, Delayable) {
    static $name = 'HintFlow';

    waitInterval = 100;
    maxWait = 10000;
    keyStrokeIntervalRandomness = 100;

    static configurable = {
        activeIndex : 0,

        /**
         * The array of hint configurations to show in the flow.
         * @config {HintConfig[]}
         */
        hints : null,

        /**
         * An object containing configuration properties to be applied to all hints in the flow.
         *
         * An example may be to set the `modal` property to `true` to make all hints modal,
         * or to set up keyboard shortcuts for the flow:
         *
         * ```javascript
         * new HintFlow({
         *     defaults : {
         *         modal  : true,
         *         keyMap : {
         *             'A' : 'next',
         *             'B' : 'previous',
         *             'C' : 'stop'
         *         }
         *     }
         * });
         * ```
         * @config {HintConfig} defaults
         */
        defaults : {
            type  : 'hint',
            align : {
                // Should not hide if its target goes out of view
                allowTargetOut : true
            },
            closable       : true,
            draggable      : false,
            buttons        : {},
            autoNext       : null,
            nextAction     : null,
            previousAction : null,
            minWidth       : null,
            trapFocus      : true,
            realignTimeout : 500,
            // Property needs to be the empty string, but *not* falsy
            title          : new String('')
        }
    };

    onHintButtonClick({ source }) {
        const me = this;

        switch (source.ref) {
            case 'next':
                me.navigate(1);
                break;
            case 'previous':
                me.navigate(-1);
                break;
            case 'stop':
                me.stop();
                break;
            case 'completed':
                /**
                 * Fired when the user clicks the 'Don't show again' button.
                 *
                 * This allows applications to register the fact that the user has completed the
                 * tutorial and does not want to see it again.
                 */
                me.trigger('completed');
                me.stop();
                break;
        }
    }

    async fakeType(options) {
        let { target, text, initialDelay = 0, focus } = options;

        if (typeof options === 'string') {
            target = document.activeElement;
            text = options;
        }

        if (focus !== false) {
            // By default push focus back to where it was before the hint was shown
            this.activeHint.revertFocus();
        }

        if (target) {
            target = await this.normalizeTarget(target);
            if (focus !== false) {
                target.focus();
            }
        }
        else {
            target = DH.getActiveElement(this.activeHint.element);
        }

        if (options.clear) {
            target.value = '';
        }

        await AsyncHelper.sleep(initialDelay);
        for (let matches = keyExtractor.exec(text); matches; matches = keyExtractor.exec(text)) {
            // It's a key name
            if (matches[2]) {
                const
                    modifiers = (matches[1]?.split('+') || []).reduce((r, e) => {
                        r[`${e.toLowerCase()}Key`] = true; return r;
                    }, {}),
                    keyEvent  = { key : matches[2], bubbles : true, ...modifiers };

                target.dispatchEvent(new KeyboardEvent('keydown', keyEvent));
                target.dispatchEvent(new KeyboardEvent('keyup', keyEvent));
            }
            // It's a character
            else {
                target.value += matches[0];
                target.dispatchEvent(new Event('input', { data : matches[0] }));
            }
            await AsyncHelper.sleep(Math.random() * this.keyStrokeIntervalRandomness + 30);
        }

        target.dispatchEvent(new Event('change'));
    }

    normalizeTarget(target, maxWait = this.maxWait) {
        return DH.waitForSelector(target, maxWait, this.waitInterval);
    }

    navigate(direction, performAction = true) {
        // In case last navigation is ongoing reject the navigation attempt
        if (this.navigationOngoing) {
            return;
        }
        this.navigationOngoing = new Promise(async resolve => { // eslint-disable-line no-async-promise-executor
            const
                me                   = this,
                { activeHint }       = me,
                nextIndex            = me.activeIndex + direction,
                // We monitor all real events during navigation and action processing.
                // Normally, only synthetic events from our actions are allowed.
                l1                   = GlobalEvents.ion({ mouseup : ({ event }) => me.squashDocumentEvents(event) }),
                l2                   = EventHelper.on({
                    element   : document,
                    mousedown : 'squashDocumentEvents',
                    keydown   : 'squashDocumentEvents',
                    thisObj   : me,
                    capture   : true
                });

            try {
                // Reject interaction while navigation is ongoing
                activeHint.masked = true;
                me.allowInteraction = false;

                if (performAction) {
                    const promise = me.processActions(me.activeHint[direction === 1 ? 'nextAction' : 'previousAction']);

                    // Allow the navigation to start
                    await AsyncHelper.animationFrame();

                    // If the start of the navgation made the current target unavailable...
                    if (me.normalizeTarget(activeHint.target, -1).nodeType !== 1) {
                        const nextTarget = me.normalizeTarget(me.hints[nextIndex].target, -1);

                        // If the next target is available, update the hint target immediately so that the hint
                        // and its highlighter can start moving immediately.
                        if (nextTarget?.nodeType === 1) {
                            activeHint.target = nextTarget;
                        }
                        // Otherwise, hide the modal mask hole or the highlighter
                        else {
                            DH.applyStyle(activeHint.floatRoot, { '--b-highlight-width' : '0px', '--b-highlight-height' : '0px' });
                        }
                    }

                    await promise;
                }

                me.activeIndex  = nextIndex;

                // If the target had to be waited for in updateActiveIndex this will wait for updateActiveIndex to finish
                // It also waits for the hint and any highlighter to finish their animations
                await me.activeIndexUpdated;

                me.navigationOngoing = null;
                activeHint.masked = false;
            }
            finally {
                l1?.();
                l2?.();

                // If the navigation was not completed show an exit hint
                if (me.navigationOngoing) {
                    me.navigationOngoing = null;
                    activeHint.element.classList.remove('b-no-title');
                    activeHint.hide(false);
                    Hint.reconfigure(activeHint, {
                        hidden     : false,
                        masked     : false,
                        centered   : true,
                        title      : 'Navigation timed out',
                        content    : 'Navigation could not be completed.',
                        nextAction : null,
                        bbar       : {
                            items : buttonSpec(0, 1)
                        }
                    });
                }
                resolve();
            }
        });
    }

    squashDocumentEvents(event) {
        // If it's a real event from the app user arriving during navigation...
        if (event.isTrusted) {
            // Always reject events targeted on the hint.
            // If the action does not allow interaction, reject all events.
            if (this.activeHint.element.contains(event.target) || !this.allowInteraction) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }
    }

    async processActions(actions) {
        const me = this;

        if (actions) {
            if (Array.isArray(actions)) {
                for (const action of actions) {
                    await me.processActions(action);
                }
            }
            else {
                for (const [key, options] of Object.entries(actions)) {
                    switch (key) {
                        case 'type':
                            await me.fakeType(options);
                            break;
                        case 'dblclick':
                        case 'click':
                        case 'contextmenu':
                            {
                                const
                                    isString    = typeof options === 'string',
                                    target      = await (me.normalizeTarget(isString ? options : options.target)),
                                    doMousedown = !isString && options.focus;

                                // If the target is to receive focus, feed a mousedown event to it before focusing it.
                                if (doMousedown) {
                                    const
                                        activeElement = DH.getActiveElement(target),
                                        mousedown     = DH.triggerMouseEvent(target, 'mousedown');

                                    // If the mousedown has not been prevented and not been used to swerve focus, focus the target
                                    if (!mousedown.defaultPrevented && DH.getActiveElement(target) === activeElement) {
                                        DH.closest(target, DH.isFocusable)?.focus();
                                    }
                                }
                                DH.triggerMouseEvent(target, key);
                                if (doMousedown) {
                                    DH.triggerMouseEvent(target, 'mouseup');
                                }
                            }
                            break;
                        case 'fn':
                            await me.activeHint.callback(options, me.activeHint);
                            break;
                        case 'drag':
                            await me.drag(options);
                            break;
                        case 'waitFor':
                            if (isNaN(options)) {
                                await me.normalizeTarget(options);
                            }
                            else {
                                await AsyncHelper.sleep(options);
                            }
                            break;
                        case 'allowInteraction':
                            me.allowInteraction = options;
                            break;
                    }
                }
            }
        }
    }

    async drag({ target = this.activeHint.target, by : [dx, dy], duration = 500 }) {
        const
            targetEl       = await this.normalizeTarget(target),
            {
                ownerDocument : doc
            }              = targetEl,
            { activeHint } = this,
            { modalMask }  = activeHint,
            { x, y }       = Rectangle.from(targetEl).center.roundPx(1),
            pointer        = DH.createElement({
                parent    : doc.body,
                className : 'b-mouse-pointer b-icon b-icon-mouse-pointer',
                style     : {
                    left : `${x}px`,
                    top  : `${y}px`
                }
            }),
            event          = { clientX : x, clientY : y, bubbles : true },
            { style }      = activeHint.floatRoot;

        // Modal mask must not have a "hole" during the drag
        if (modalMask) {
            modalMask.style.pointerEvents = 'none';
            style.setProperty('--b-highlight-width', '0px');
            style.setProperty('--b-highlight-height', '0px');
        }

        let overEl, lastOverEl;

        targetEl.dispatchEvent(new PointerEvent('pointerover', event));
        targetEl.dispatchEvent(new MouseEvent('mouseover', event));
        targetEl.dispatchEvent(new PointerEvent('pointerdown', event));
        targetEl.dispatchEvent(new MouseEvent('mousedown', event));
        await AsyncHelper.animationFrame();

        await FunctionHelper.animate(duration, async progress => {
            event.clientX = x + dx * progress;
            event.clientY = y + dy * progress;

            // document.elementFromPoint must pierce through the modal mask during the drag
            modalMask.style.pointerEvents = 'none';
            overEl = doc.elementFromPoint(event.clientX, event.clientY);

            pointer.style.cssText = `left:${event.clientX}px;top:${event.clientY}px`;
            overEl.dispatchEvent(new PointerEvent('pointermove', event));
            overEl.dispatchEvent(new MouseEvent('mousemove', event));

            if (overEl !== lastOverEl) {
                overEl.dispatchEvent(new PointerEvent('pointerenter', event));
                overEl.dispatchEvent(new MouseEvent('mouseenter', event));
                overEl.dispatchEvent(new PointerEvent('pointerover', event));
                overEl.dispatchEvent(new MouseEvent('mouseover', event));
                lastOverEl = overEl;
            }
            modalMask.style.pointerEvents = '';
        });

        // Modal mask hole grows from the drag end position
        style.setProperty('--b-highlight-top', `${event.clientY}px`);
        style.setProperty('--b-highlight-left', `${event.clientX}px`);
        overEl.dispatchEvent(new PointerEvent('pointerup', event));
        overEl.dispatchEvent(new MouseEvent('mouseup', event));
        pointer.remove();
    }

    async updateActiveIndex(index, was) {
        const
            me        = this,
            {
                hints,
                activeHint
            } = me,
            count     = hints.length,
            cfg       = hints[index];

        // If the outgoung hint is waiting for an autoNext promise, resolve it with undefined
        // so that it does not immediately move on.
        activeHint?.autoNextPromise?.resolve();

        // Clear stale ownership before reassigning, so steps with no target leave no orphaned owner
        me.owner = null;

        if (cfg) {
            const target = await me.normalizeTarget(cfg.target);
            let { align } = cfg;

            // If we re aligning to a selector, we need to wait for the target to be available
            if (typeof align?.target === 'string') {
                align = {
                    ...align,
                    target : await me.normalizeTarget(align.target)
                };
            }

            // An optional target (String ands with ?) returns false if not found
            // this means we should skip this hint.
            if (target === false) {
                me.activeIndex = ++index;
                return;
            }

            // If the target is specified as a string, it *may* lead to the same element
            // but in a different state. So we must clear the _target and _forElement to ensure the updaters are called.
            if (activeHint) {
                if (typeof cfg.target === 'string') {
                    activeHint._target = activeHint._forElement = null;
                }
                // Preserve focus inside the hint because the bbar gets rerendered with the new button set
                // and the focus would be lost.
                if (activeHint.bbar.element.matches(':focus-within')) {
                    activeHint.element.focus();
                }
            }
            // On first hint, remember the element that had focus before the hint was shown
            else {
                me.returnFocusTo = DH.getActiveElement();
            }

            const
                buttons = {
                    steps : {
                        type    : 'widget',
                        content : `${index + 1}/${count}`,
                        weight  : -1000
                    },
                    completed : {
                        text      : me.L('L{Hint.dontShowAgain}'),
                        rendition : 'text',
                        weight    : 10,
                        onClick   : 'up.onHintButtonClick'
                    },
                    ...ObjectHelper.merge(buttonSpec(index, count), Array.isArray(cfg.buttons) ? ObjectHelper.transformArrayToNamedObject(cfg.buttons) : cfg.buttons)
                },
                changedHint = me.activeHint = Hint.reconfigure(activeHint, Hint.mergeConfigs(me.defaults, {
                    index,
                    hintFlow    : me,
                    owner       : me,
                    maxWait     : me.maxWait,
                    rootElement : document.body
                }, cfg, {
                    target,
                    buttons,
                    [typeof align?.target === 'string' ? 'align' : '_'] : align,
                    cls                                                 : {
                        'b-no-title' : Boolean(!cfg.title)
                    }
                })),
                focusBeforeWait = DH.getActiveElement();

            me.owner = Hint.fromElement(target);

            // Wait for a maximum of 1s for all animations to finish. Both the hint and the highlighter
            await Promise.all([
                changedHint.highlighter.element.isConnected && DH.waitForSelector(changedHint.highlighter.element, -1000),
                DH.waitForSelector(changedHint.element, -1000)
            ]);

            // During the animation, the hint may have been destroyed. And if the user moved focus meanwhile, for
            // example into the hinted target, it must not be taken away from there
            if (changedHint.isVisible && DH.getActiveElement() === focusBeforeWait) {
                changedHint.bbar.widgetMap[index === count - 1 ? 'stop' : (index && index < was ? 'previous' : 'next')]?.focus();
            }
        }
        // If we walked off either end, stop
        else {
            me.stop();
        }
    }

    async stop() {
        const me = this;

        // If we are at the end, allow that last hint to have a nextAction to clean up
        if (me.activeIndex === me.hints.length - 1) {
            await me.processActions(me.activeHint.nextAction);
        }
        me.activeHint.owner = null;
        bryntum.queryAll('hint').forEach(hint => hint.hintFlow === me && hint.destroy());
        me.activeHint = null;
        me.returnFocusTo?.focus();
    }
}
