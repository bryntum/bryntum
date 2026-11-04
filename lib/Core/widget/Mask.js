import ArrayHelper from '../helper/ArrayHelper.js';
import DomHelper from '../helper/DomHelper.js';
import DomDataStore from '../data/DomDataStore.js';
import Widget from './Widget.js';

DomHelper.loadStylesheet('Core/widget/Mask.css');

// import Stylesheet from './Mask.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Mask');

/**
 * @module Core/widget/Mask
 */

const
    isActive      = mask => mask.element.classList.contains('b-visible'),
    isPending     = mask => !isActive(mask) && mask.isVisible,
    // A finite number is worth showing as text. Every other non-string - `NaN`, `Infinity`, `false` - is no message
    isTextual     = value => typeof value === 'number' ? Number.isFinite(value) : Boolean(value),
    maskText      = value => isTextual(value) ? String(value) : '',
    // Prior `aria-busy` of every target Mask has taken over. `has` separates "not ours" from "ours, and the target
    // had none", which a stored `null` represents - `DomDataStore` exposes no `has`, so it cannot express that.
    ownedAriaBusy = new WeakMap();

/**
 * Masks a target element (`document.body` if none is specified). Call static methods for ease of use or make instance
 * for reusability.
 *
 * ```javascript
 *  Mask.mask('hello');
 *  Mask.unmask();
 * ```
 *
 * {@inlineexample Core/widget/Mask.js}
 *
 * Can show progress:
 *
 * ```javascript
 *  // Using progress by calling static method
 *  const mask = Mask.mask({
 *      text        :'The task is in progress',
 *      progress    : 0,
 *      maxProgress : 100
 *  });
 *
 *  let timer = setInterval(() => {
 *      mask.progress += 5;
 *      if (mask.progress >= mask.maxProgress) {
 *          Mask.unmask();
 *          clearInterval(timer);
 *      }
 *  }, 100);
 * ```
 *
 * ## Stacking Multiple Masks
 * An element can have multiple masks attached to it (for example, to handle independent asynchronous activities). When
 * an element has multiple masks attached, only the first mask created is visible to the user. This avoids unpleasant
 * transparency layering that would occur if all masks were visible at the same time. When the active mask is destroyed
 * or hidden (via {@link Core.widget.Widget#function-hide}), the next oldest mask is made visible. That is, masks are
 * displayed in FIFO order.
 *
 * When a mask is hidden, it is not a candidate in the FIFO order and is ignored when looking for the next oldest mask.
 * If the mask is shown (via {@link Core.widget.Widget#function-show}), the mask is again a candidate for being shown,
 * and will be shown immediately if there is not already a currently visible mask. This eliminates flickering effects
 * that would otherwise come from multiple masks competing for display.
 *
 * When the last mask is hidden or destroyed, the target element becomes unmasked. Showing and hiding of masks is useful
 * when the masks may be needed repeatedly over time.
 *
 * ## Accessibility
 * A mask represents an operation the user is waiting on, and is exposed to assistive technology as such:
 *
 * - The {@link #config-target} carries `aria-busy="true"` for as long as any mask is attached to it, restoring any
 *   value the application had set once the last mask detaches. A document `body` target is left untouched, since
 *   marking a whole document busy would also defer the live region masks announce through.
 * - The message is announced on mount through the one `aria-live` region shared by all widgets in the root -
 *   assertively for an error, politely otherwise. That element is shared, but each widget queues its own
 *   announcements into it, so when several stacked masks mount in the same frame only the last message is
 *   announced.
 * - When {@link #config-maxProgress} is set, the progress bar is a `progressbar` publishing `aria-valuemin`,
 *   `aria-valuemax` and `aria-valuenow`, named by the message. Otherwise the spinner is an *indeterminate*
 *   `progressbar`, publishing no `aria-valuenow` at all, which is what marks progress as unmeasurable.
 * - A mask with no message publishes no `progressbar` role. A progressbar with no accessible name fails WCAG 4.1.2,
 *   and an unnamed one would convey only what `aria-busy` already conveys. Under `htmlEncode : false` it is the
 *   *rendered* text of the message that names the bar and is announced, never the markup around it, so markup
 *   which renders no text names nothing.
 * - A mask presenting an error reports no progress: no progress bar, and the icon is hidden from the tree.
 *
 * ## Masking Bryntum Widgets
 * Shortcut to masking Bryntum components:
 *
 * ```javascript
 *  // Using progress to mask a Bryntum component
 *  scheduler.mask({
 *      text:'Loading in progress',
 *      progress: 0,
 *      maxProgress: 100
 *  });
 *
 *  let timer = setInterval(() => {
 *      scheduler.masked.progress += 5;
 *      if (scheduler.masked.progress >= scheduler.masked.maxProgress) {
 *          scheduler.unmask();
 *          clearInterval(timer);
 *      }
 *  },100);
 * ```
 *
 * @extends Core/widget/Widget
 * @noclasstype
 * @widget
 */
export default class Mask extends Widget {
    //region Config
    static $name = 'Mask';
    static type = 'mask';

    static configurable = {
        /**
         * @hideconfigs html
         */

        /**
         * Set this config to trigger an automatic close after the desired delay:
         *
         * ```javascript
         *  mask.autoClose = 2000;
         * ```
         *
         * If the mask has an `owner`, its `onMaskAutoClosing` method is called when the close starts and its
         * `onMaskAutoClose` method is called when the close finishes.
         * @config {Number}
         * @private
         */
        autoClose : null,

        /**
         * The portion of the {@link #config-target} element to be covered by this mask. By default, the mask fully
         * covers the `target`. In some cases, however, it may be desired to only cover the `'body'` (for example,
         * in a grid).
         *
         * This config is set in conjunction with `owner` which implements the method `syncMaskCover`.
         *
         * @config {String}
         * @private
         */
        cover : null,

        /**
         * Text announced to assistive technology when the mask is destroyed, telling a screen reader user that the
         * operation the mask covered has ended.
         *
         * Opt-in, with no default: while this is `null` nothing is announced. Nothing is announced either when the
         * mask is merely hidden, since a hidden mask can be shown again, or when it is presenting an error.
         *
         * ```javascript
         *  widget.masked = {
         *      text     : 'Loading data',
         *      doneText : 'Data loaded'
         *  };
         * ```
         * @prp {String}
         */
        doneText : null,

        /**
         * The icon to show next to the text. Defaults to showing a spinner
         * @config {String}
         * @default
         */
        icon : 'b-icon b-icon-spinner',

        errorDefaults : {
            icon      : 'b-icon b-icon-warning',
            autoClose : 3000,
            showDelay : 0
        },

        /**
         * Set to `true` when this mask presents an error instead of an operation in progress. Assigning the
         * {@link #property-error} property sets it, and re-purposing the mask clears it. This has to stay a declared
         * config rather than a plain property, because only configs recompose the widget when they change.
         * @prp {Boolean}
         * @internal
         */
        showingError : false,

        /**
         * The maximum value of the progress indicator. A value of `0` or less cannot describe a range, so it is
         * normalized to `null`, leaving the mask indeterminate with no progress bar.
         * @prp {Number}
         */
        maxProgress : null,

        /**
         * Number expressing the progress, from `0` to {@link #config-maxProgress}. Values outside that range are
         * clamped, so the drawn fill and the announced `aria-valuenow` always describe the same quantity.
         *
         * A non-finite value describes no quantity at all, so it is normalized to `null`, leaving the bar empty
         * exactly as an unset progress does. Reading this property back therefore yields `null`, not `NaN`.
         * @prp {Number}
         */
        progress : null,

        // The owner is involved in the following features:
        //
        // - The `autoClose` timer calls `onMaskAutoClose`.
        // - The `cover` config calls `syncMaskCover`.
        // - If the `target` is a string, that string names the property of the `owner` that holds the
        //   `HTMLElement` reference.

        /**
         * The element to be masked. If this config is a string, that string is the name of the property of the
         * {@link #config-owner} that holds the `HTMLElement` that is the actual target of the mask.
         *
         * NOTE: In prior releases, this used to be specified as the `element` config.
         *
         * @config {String|HTMLElement}
         */
        target : {
            $config : 'nullify',
            value   : undefined
        },

        /**
         * The text (or HTML) to show in the mask. The text is automatically HTML encoded, combine with the
         * {@link #config-htmlEncode} config for displaying raw HTML.
         *
         * @prp {String}
         */
        text : null,

        // <remove-on-release>
        // TODO: perhaps a better way to deal w/multiple reasons to mask something would be a mask FIFO behind
        //  the scenes so that only one mask is visible at a time. That would take a bit of tinkering in the
        //  hide/show mechanism but feels like a more natural way to go. In which case, this config would go away
        //  and multiple masks would simply cooperate. https://github.com/bryntum/bryntum/issues/190
        //  This property is used to block license mask removal
        // https://github.com/bryntum/bryntum/issues/2604
        // </remove-on-release>
        type : null,

        /**
         * The number of milliseconds to delay before making the mask visible. If set, the mask will have an
         * initial `opacity` of 0 but will function in all other ways as a normal mask. Setting this delay can
         * reduce flicker in cases where load operations are typically short (for example, a second or less).
         *
         * @config {Number}
         */
        showDelay : null,

        /**
         * By default, the {@link #config-text} is HTML-encoded.
         *
         * Set this flag to `false` to allow rendering HTML elements.
         *
         * {@note}Note that when setting it to `false`, you are responsible for HTML encoding user-provided data to
         * mitigate XSS issues. See `StringHelper.encodeHtml`.{/@note}
         *
         * @prp {Boolean}
         */
        htmlEncode : true,

        rendition : 'filled',

        useTransition : true
    };

    static delayable = {
        deferredClose : 0,
        delayedShow   : 0,
        syncCover     : {
            type  : 'throttle',
            delay : 100
        }
    };

    //endregion

    //region Static

    // Used to give masks unique names
    static counter = 0;

    /**
     * Returns the array of `Mask` instances for the given `element`.
     * @param {HTMLElement} element The element for which to return `Mask` instances
     * @returns {Core.widget.Mask|Core.widget.Mask[]}
     */
    static get(element) {
        return DomDataStore.get(element, 'masks') || DomDataStore.set(element, 'masks', []);
    }

    static getActive(element) {
        return Mask.get(element).find(isActive) || null;
    }

    static getPending(element) {
        return Mask.get(element).filter(isPending).sort(Widget.weightSortFn);
    }

    /**
     * Shows a mask with the specified message.
     *
     * Masks stack, call {@link #function-unmask-static} to remove the topmost mask. Or call {@link #function-close}
     * on the returned mask to close it specifically. Only one mask is displayed for a given `target` element at a time.
     * For example, if two masks are added to an element, the first mask is displayed. If the first mask is closed,
     * then the second mask will become visible.
     *
     * @param {String|MaskConfig} text Message
     * @param {HTMLElement} [target] The element to mask (default is `document.body`)
     * @returns {Core.widget.Mask}
     */
    static mask(text, target = document.body) {
        return Mask.new({ target }, text);
    }

    static mergeConfigs(...sources) {
        sources = sources.map(c => typeof c === 'string' ? { text : c } : c);

        return super.mergeConfigs(...sources);
    }

    static sync(target) {
        const
            active  = Mask.getActive(target),
            pending = !active && Mask.getPending(target)[0] || null,
            mask    = active || pending;

        let classList;

        if (pending) {
            classList = pending.element.classList;
            if (pending.showDelay && !target.classList.contains('b-masked')) {
                classList.add('b-delayed-show');
                pending.delayedShow();  // removes b-delayed-show
            }

            classList.add('b-visible');
        }

        target.classList.toggle('b-masked', Boolean(mask));

        // A masked target is one the user is waiting on, so `aria-busy` shares the `b-masked` lifetime exactly
        Mask.syncAriaBusy(target, Boolean(mask));
    }

    /**
     * Applies or restores the {@link #config-target}'s `aria-busy` as Mask takes and releases ownership of it.
     * @internal
     */
    static syncAriaBusy(target, busy) {
        // A document body is left entirely alone: marking a whole document busy also defers the live region masks
        // announce through, and removing it would discard a value only the application can own. Masks are supported
        // in secondary documents and shadow roots, so this asks the target which document it belongs to.
        if (target === target.ownerDocument.body) {
            return;
        }

        if (busy) {
            // Only the first mask takes over, so a stacked one cannot record Mask's own `true` as the prior value
            if (!ownedAriaBusy.has(target)) {
                ownedAriaBusy.set(target, target.getAttribute('aria-busy'));

                DomHelper.setAttributes(target, { 'aria-busy' : 'true' });
            }
        }
        else if (ownedAriaBusy.has(target)) {
            // The last mask detached, so hand the attribute back exactly as found - absent restores to absent
            DomHelper.setAttributes(target, { 'aria-busy' : ownedAriaBusy.get(target) });

            ownedAriaBusy.delete(target);
        }
    }

    /**
     * Close the most recently created mask for the specified element.
     * @param {HTMLElement} [element] The element to unmask (default is `document.body`)
     * @returns {Promise|null} A promise which is resolved when the mask is gone, or null if element is not masked
     */
    static unmask(element = document.body) {
        const
            masks = Mask.get(element),
            n = masks.length;

        return n ? masks[n - 1]?.close() : null;
    }

    /**
     * Close all masks for the specified element
     * @param {HTMLElement} [element] The element to unmask (default is `document.body`)
     * @returns {Promise|null} A promise which is resolved when the mask is gone, or null if element is not masked
     * @internal
     */
    static unmaskAll(element = document.body) {
        Mask.get(element).filter(mask => !isActive(mask)).forEach(m => m.destroy());

        return Mask.unmask(element);
    }

    //endregion

    //region Init

    destroy() {
        // <remove-on-release>
        // Do not destroy a license mask
        // </remove-on-release>
        if (this.type !== 'license') {
            this.announceDone();

            super.destroy();
        }
    }

    /**
     * Announces {@link #config-doneText}, if one was supplied, that the operation this mask covered has ended.
     * @internal
     */
    announceDone() {
        const
            { showingError, isDestroying, _element } = this,
            message                                 = maskText(this.doneText);

        // Not for an error: that was already announced assertively, and a failure is not a completion. A blank
        // message is nothing to announce, so the call is suppressed rather than made with an empty value.
        if (message.trim() && !showingError && !isDestroying && _element) {
            this.announceAriaLive(message, 'polite');

            // Destroy nullifies the configs and *cancels* the queued frame rather than running it, so the
            // announcement has to be both made and flushed synchronously, ahead of `super.destroy()`
            this.flushAriaLive.flush();
        }
    }

    construct(config, ...args) {
        if (config.html) {
            config.text = config.html;
            delete config.html;
        }

        super.construct(config, ...args);
    }

    compose() {
        // Properties here are read for side-effect and flagged for sonar to ignore
        const
            {
                icon, id, maxProgress, progress, showDelay, showingError, text, htmlEncode, rendition, useTransition
            }             = this, // NOSONAR
            message       = maskText(text),
            messageId     = `${id}-message`,
            // The accessible name is the *rendered* text, which is not the message itself when it is markup
            messageText   = this.accessibleText(text),
            // Exactly one element may claim the progressbar role: the bar when progress is measurable, else the
            // spinner. An error is not an operation in progress, so neither of them claims it.
            determinate   = Boolean(maxProgress) && !showingError,
            indeterminate = !maxProgress && !showingError,
            // Only the message can name a progressbar, and an unnamed one fails WCAG 4.1.2, so no message means
            // no role. Nothing is lost: it would convey only what `aria-busy` on the target already conveys.
            named         = Boolean(messageText.trim()),
            barRole       = determinate && named,
            spinnerRole   = indeterminate && named,
            // `aria-valuenow` must describe the same quantity the fill width describes, so both derive from this
            progressValue = maxProgress ? Math.min(Math.max(progress ?? 0, 0), maxProgress) : null;

        return {
            class : {
                'b-mask'                          : 1,
                'b-delayed-show'                  : showDelay,
                'b-progress'                      : determinate,
                'b-prevent-transitions'           : !useTransition,
                [`b-mask-rendition-${rendition}`] : rendition
            },
            children : {
                maskContent : {
                    class    : 'b-mask-content',
                    children : {
                        progressElement : determinate ? {
                            class : 'b-mask-progress-bar',
                            style : {
                                width : `${Math.round(progressValue / maxProgress * 100)}%`
                            },
                            role              : barRole ? 'progressbar' : null,
                            'aria-labelledby' : barRole ? messageId : null,
                            'aria-valuemin'   : barRole ? 0 : null,
                            'aria-valuemax'   : barRole ? maxProgress : null,
                            'aria-valuenow'   : barRole ? progressValue : null
                        } : null,
                        maskText : {
                            class    : 'b-mask-text',
                            children : {
                                maskIcon : icon ? {
                                    tag               : 'i',
                                    class             : `b-mask-icon ${icon}`,
                                    role              : spinnerRole ? 'progressbar' : null,
                                    'aria-labelledby' : spinnerRole ? messageId : null,
                                    // Purely decorative whenever it is not the progress indicator
                                    'aria-hidden'     : spinnerRole ? null : true
                                } : null,
                                maskMessage : {
                                    tag   : 'span',
                                    class : 'b-mask-message',
                                    id    : messageId,
                                    // Names the progressbar, but is not itself a live region - see announceMessage.
                                    // Declared so DomSync leaves the message out of its `role="presentation"` sweep.
                                    role  : null,
                                    // `text` is documented as accepting HTML unless `htmlEncode` is set
                                    ...(htmlEncode ? { text : message } : { html : message })
                                }
                            }
                        }
                    }
                }
            },

            // eslint-disable-next-line bryntum/no-listeners-in-lib
            listeners : {
                mousedown : 'onMaskMouseDown',
                capture   : true
            }
        };
    }

    onMaskMouseDown(e) {
        e.preventDefault();
    }

    //endregion

    //region Config

    generateAutoId() {
        const { type } = this;

        return `mask${typeof type === 'string' ? type.trim() : ''}-${Mask.counter++}`;
    }

    updateAutoClose(delay) {
        this.deferredClose.cancel();

        if (delay) {
            this.deferredClose.delay = delay;
            this.deferredClose();
        }
    }

    updateCover() {
        this.syncCover();
    }

    syncCover() {
        this.owner?.syncMaskCover?.(this);  // pass "this" since owner may not yet have assigned us to "masked"
    }

    changeMaxProgress(maxProgress) {
        // A maximum that cannot describe a range - `Infinity` included - leaves the mask indeterminate
        return Number.isFinite(maxProgress) && maxProgress > 0 ? maxProgress : null;
    }

    changeProgress(progress) {
        // Normalized here rather than at the point of use so the drawn fill and the announced `aria-valuenow`
        // cannot disagree. A non-finite progress would otherwise draw `width: NaN%`, which is no style at all,
        // and publish `aria-valuenow="NaN"`, which is not a number AT can parse.
        return Number.isFinite(progress) ? progress : null;
    }

    /**
     * The error message this mask is presenting, or `null` when it is presenting an operation in progress. Assigning
     * it applies the mask's `errorDefaults` and switches the mask to its error semantics.
     * @prp {String|null}
     */
    get error() {
        return this.showingError ? this.text : null;
    }

    set error(value) {
        const me = this;

        // Every other reconfigure re-purposes the mask and clears the error state. This one is the reconfigure that
        // raises it, so it flags itself out of that.
        me.settingError = true;
        me.setConfig({
            ...me.errorDefaults,
            text : value
        });
        me.settingError = false;

        // Assigned after the batch, and not from within it: `setConfig` does not guarantee config order
        me.showingError = true;
        me.announceMessage();
    }

    setConfig(config, isConstructing = false) {
        // Reconfiguring re-purposes a mask, which clears its error state. This catches the configs carrying no
        // `text` key, which never reach `updateText` - the `masked = { progress, maxProgress }` idiom.
        if (!isConstructing && !this.settingError) {
            this.showingError = false;
        }

        return super.setConfig(config, isConstructing);
    }

    updateText() {
        // A new message describes a new situation, which clears the error state
        if (!this.settingError) {
            this.showingError = false;
            this.announceMessage();
        }
    }

    /**
     * The message as assistive technology sees it. {@link #config-text} is documented as accepting HTML unless
     * {@link #config-htmlEncode} is set, and the tags in that markup are neither part of the accessible name it
     * supplies nor fit to read out, so an accessible name and an announcement are both taken from the rendered
     * text. Markup that renders no text - `<span></span>` - therefore names nothing, as it should.
     * @param {String|Number} value The message to resolve
     * @returns {String} The rendered text of the message, or `''` if it has none
     * @internal
     */
    accessibleText(value) {
        const message = maskText(value);

        // stripTags() parses, so it is worth skipping for the encoded case and for text that carries no markup
        return this.htmlEncode || !message.includes('<') ? message : DomHelper.stripTags(message);
    }

    /**
     * Announces the current message, assertively for an error and politely otherwise.
     * @internal
     */
    announceMessage() {
        const
            { _element } = this,
            message      = this.accessibleText(this.text);

        // Assistive technology reads one region at a time, so this goes through the shared one. A blank message
        // is nothing to announce, so the call is suppressed rather than made with an empty value.
        if (_element && message.trim()) {
            this.announceAriaLive(message, this.showingError ? 'assertive' : 'polite');
        }
    }

    onOwnerResize() {
        this.syncCover();
    }

    updateOwner(owner) {
        this.detachListeners('cover');

        owner?.ion({
            name      : 'cover',
            recompose : 'onOwnerResize',
            resize    : 'onOwnerResize',
            thisObj   : this
        });
    }

    updateShowDelay(delay) {
        const { delayedShow } = this;

        delayedShow.delay = delay;

        if (!delay) {
            delayedShow.flush();
        }
    }

    changeTarget(target) {
        if (target === undefined) {
            target = document.body;
        }
        else if (typeof target === 'string') {
            target = this.owner[target];  // must supply "owner" in this case
        }

        return target;
    }

    updateTarget(target, was) {
        const
            me              = this,
            { id, element } = me,  // mask-1, masktrial-2, ...
            masks           = was && Mask.get(was);

        if (was) {
            if (was[id] === me) {
                delete was[id];
            }

            ArrayHelper.remove(masks, me);

            Mask.sync(was);
        }

        if (target) {
            if (!target[id]) {
                target[id] = me;
            }

            if (element.parentNode !== target) {
                target.appendChild(element);
            }

            ArrayHelper.include(Mask.get(target), me);

            Mask.sync(target);

            // The message cannot be announced until the mask is in the document, which is only true now
            me.announceMessage();
        }
        else {
            element.remove();
        }
    }

    //endregion

    //region Show & hide

    deferredClose() {
        const
            me        = this,
            { owner } = me;

        me.close().then(() => owner?.onMaskAutoClose?.(me));

        owner?.onMaskAutoClosing?.(me);
    }

    delayedShow() {
        this.removeCls('b-delayed-show');
    }

    updateHidden(hidden, was) {
        super.updateHidden?.(hidden, was);

        // Let sync() decide which Mask will get b-visible but if this Mask has it, remove it so that it doesn't look
        // like the active Mask. "In the end, there can be only one!"
        hidden && this.removeCls('b-visible');

        Mask.sync(this.target);
    }

    afterShow(...args) {
        super.afterShow?.(...args);

        Mask.sync(this.target);
    }

    afterHide(...args) {
        super.afterHide?.(...args);

        this.removeCls('b-visible');   // see updateHidden
        Mask.sync(this.target);
    }

    /**
     * Close mask (removes it)
     * @returns {Promise} A promise which is resolved after the mask is closed and destroyed.
     */
    async close() {
        await this.hide();

        this.destroy();
    }

    //endregion
}

Mask.initClass();
