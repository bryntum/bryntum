import Base from '../../Core/Base.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Popup from '../../Core/widget/Popup.js';
import Toast from '../../Core/widget/Toast.js';

DomHelper.loadStylesheet('Scheduler/util/EventBarLayoutDetector.css');

/**
 * @module Scheduler/util/EventBarLayoutDetector
 */

const
    warningCls = 'b-event-layout-warning',
    docsUrl    = 'https://bryntum.com/docs/guide/Scheduler/customization/styling',
    // How many bars of the initial render to measure, see the comment in `scan()`
    maxInspected = 20,
    // The popup has to be readable from a screenshot alone, so every rule is kept to three short lines. `prompt` is
    // not shown, it is what the copy button puts on the clipboard for a coding agent to act on.
    rules      = {
        doublePadding : {
            title   : 'Content is padded twice',
            problem : 'The bar already pads its content, and the element the renderer returns has padding of its own.',
            fix     : 'Remove your padding, or hand the bar gutter over to your element:',
            code    : '.b-scheduler { --b-sch-event-padding-inline : 0 }',
            prompt  : 'The event bar content is padded twice. Bryntum pads the `.b-sch-event-content` element with ' +
                'the `--b-sch-event-padding-inline` CSS variable, and the element my `eventRenderer` returns adds ' +
                'padding of its own, so the inner element cannot reach the edges of the bar. Fix it either by ' +
                'removing the padding from my own element, or by handing the built-in gutter over to it with ' +
                '`.b-scheduler { --b-sch-event-padding-inline : 0 }`. Pick whichever fits the existing code better ' +
                'and change only that.'
        },

        noStretch : {
            title   : 'Content cannot fill the bar',
            problem : 'StickyEvents makes event content shrinkwrap.',
            fix     : 'Turn the feature off, or keep it and make an inner element sticky instead:',
            code    : 'features : { stickyEvents : false }',
            prompt  : 'The event bar content is meant to fill the bar but does not. The Bryntum StickyEvents ' +
                'feature makes `.b-sch-event-content` `position : sticky` so it stays in view while scrolling the ' +
                'time axis, and a sticky element shrinkwraps instead of stretching. Fix it either by configuring ' +
                'the Scheduler with `features : { stickyEvents : false }`, or by keeping the feature and moving ' +
                'the stickiness inwards: set `position : static` and `--b-sch-event-content-width : 100%` on ' +
                '`.b-sch-event-content`, then `position : sticky; inset-inline-start : 0` on the inner element ' +
                'that should stay in view. Prefer the second if keeping content in view while scrolling matters.'
        }
    },
    // Presented like a rule's fix, so the footer reads the same way as the advice above it. Having no title marks
    // it as the footer, which keeps its snippet on the same line as its text.
    disableFix = {
        fix  : 'Turn this check off in production with',
        code : 'detectEventBarLayoutIssues : false'
    };

// The notice that detection is on is logged once per page, not once per Scheduler
let announced = false;

/**
 * Detects event bars whose layout looks broken and reports the first one found, by outlining it, logging to the
 * console and showing a popup explaining the problem and how to fix it.
 *
 * Created by {@link Scheduler.view.Scheduler#config-detectEventBarLayoutIssues}, not intended to be used directly.
 *
 * Only the initial render of event bars is measured. Bars rendered later on, when scrolling or when data changes,
 * are left alone, so the detector costs nothing once the Scheduler is up.
 *
 * @extends Core/Base
 * @internal
 * @tier community
 */
export default class EventBarLayoutDetector extends Base {
    static $name = 'EventBarLayoutDetector';

    static configurable = {
        /**
         * The Scheduler this detector inspects
         * @config {Scheduler.view.SchedulerBase}
         */
        client : null
    };

    construct(config) {
        super.construct(config);

        const
            me         = this,
            { client } = me;

        // Bars rendered during the initial sync, measured in one go when it completes
        me.candidates  = [];
        // `eventId|resourceId` of the bars currently outlined, read back during rendering so that the outline
        // survives element reuse
        me.warnedKeys  = new Set();
        me.hasWarnings = false;

        if (!announced) {
            announced = true;

            console.info(
                '[Bryntum Scheduler] Event bar layout detection is on. It is a development aid, turn it off in ' +
                'production with `detectEventBarLayoutIssues : false`'
            );
        }

        client.whenVisible('attach', me);
    }

    attach() {
        // Detach first to avoid duplicates when reattaching after a clear
        this.detachListeners('layoutDetector');

        this.client.ion({
            name        : 'layoutDetector',
            renderEvent : 'onRenderEvent',
            thisObj     : this
        });
    }

    onRenderEvent({ element, renderData }) {
        const me = this;

        me.candidates.push({ element, renderData });

        // Measuring inside the sync would interleave forced layouts with DomSync's writes. Deferring to the next
        // frame collects the whole pass into a single measuring run.
        if (!me.scanRequested) {
            me.scanRequested = true;
            me.client.requestAnimationFrame(() => me.scan());
        }
    }

    scan() {
        const
            me                     = this,
            { candidates, client } = me;

        me.scanRequested = false;

        // Bars in flight are mid transition and would measure wrong
        if (!client.isDestroyed && !client.isAnimating) {
            let inspected = 0;

            for (const { element, renderData } of candidates) {
                // Elements released or recycled since they were collected have nothing to measure
                if (!element.isConnected || element.classList.contains('b-released')) {
                    continue;
                }

                const issues = me.inspect(element, renderData);

                if (issues.length) {
                    me.report(element, renderData, issues);
                    break;
                }

                // A broken layout comes from the renderer or the app's CSS, so it shows on every bar alike. Measuring
                // a sample is enough, and keeps the cost off apps that have nothing wrong with them.
                if (++inspected === maxInspected) {
                    break;
                }
            }

            // The initial render has been measured, bars rendered by scrolling or later updates are left alone. A
            // pass with nothing measurable in it does not count, the next one is still the initial render.
            if (inspected || me.hasWarnings) {
                me.detachListeners('layoutDetector');
            }
        }

        candidates.length = 0;
    }

    /**
     * Measures a single event bar, returning the names of the rules it trips.
     * @param {HTMLElement} wrapEl The event wrapper element
     * @param {Object} renderData The render data used to render the bar
     * @returns {String[]} Names of the tripped rules
     * @private
     */
    inspect(wrapEl, renderData) {
        const
            me              = this,
            { client }      = me,
            { eventRecord } = renderData,
            contentEl       = DomSync.getChild(wrapEl, 'event.content'),
            barEl           = contentEl?.parentNode,
            issues          = [];

        // Milestones have no width to lay content out in and bars being dragged are mid transform
        if (!contentEl || !barEl || eventRecord.isMilestone || wrapEl.classList.contains('b-dragging')) {
            return issues;
        }

        let children = Array.from(contentEl.children);

        // The icon element is injected by the framework, it is not part of the renderer's own output
        if (renderData.iconCls?.length && children[0]?.tagName === 'I') {
            children = children.slice(1);
        }

        const
            contentStyle = DomHelper.getStyleValue(contentEl, ['marginInlineStart', 'position']),
            padInline    = parseFloat(contentStyle.marginInlineStart) || 0,
            // A lone element child, with no text of the content element's own next to it
            onlyChild    = children.length === 1 && !me.hasOwnText(contentEl) ? children[0] : null;

        // Both modes lay the content out with the same inline margin, so this applies to either
        if (onlyChild && padInline > 0 && me.isPanelLike(onlyChild)) {
            issues.push('doublePadding');
        }

        if (
            // Vertical mode keeps content in view by translating it, which does not stop it stretching
            client.isHorizontal &&
            // A plain text renderer produces a label, which is supposed to shrink wrap
            renderData.rendererReturnedCustomLayout &&
            client.features.stickyEvents?.enabled &&
            !wrapEl.classList.contains('b-disable-sticky') &&
            contentStyle.position === 'sticky' &&
            // Shrink wrapped rather than filling the space the bar offers
            contentEl.offsetWidth < barEl.clientWidth - 2 * padInline - 1 &&
            children.some(el => me.wantsToFill(el))
        ) {
            issues.push('noStretch');
        }

        return issues;
    }

    // `true` if the element has text of its own alongside its element children
    hasOwnText(element) {
        return Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.data.trim());
    }

    // `true` if the element is styled as a surface of its own, i.e. something the built-in gutter pushes inwards
    isPanelLike(element) {
        const style = DomHelper.getStyleValue(element, [
            'paddingInlineStart', 'paddingInlineEnd', 'backgroundColor', 'borderInlineStartWidth'
        ]);

        return parseFloat(style.paddingInlineStart) > 0 ||
            parseFloat(style.paddingInlineEnd) > 0 ||
            parseFloat(style.borderInlineStartWidth) > 0 ||
            !this.isTransparent(style.backgroundColor);
    }

    // `true` if the element looks like it was meant to span the full width of the bar
    wantsToFill(element) {
        const style = DomHelper.getStyleValue(element, ['backgroundColor', 'borderTopWidth', 'flexGrow']);

        return element.style.width === '100%' ||
            parseFloat(style.flexGrow) > 0 ||
            parseFloat(style.borderTopWidth) > 0 ||
            !this.isTransparent(style.backgroundColor);
    }

    isTransparent(color) {
        return !color || color === 'transparent' || /^rgba\(.*,\s*0\)$/.test(color);
    }

    report(wrapEl, renderData, issues) {
        const
            me                              = this,
            { eventRecord, resourceRecord } = renderData,
            messages                        = issues.map(name => rules[name]);

        me.warnedKeys.add(`${eventRecord.id}|${resourceRecord.id}`);
        me.hasWarnings = true;

        wrapEl.classList.add(warningCls);

        console.warn(
            `[Bryntum Scheduler] Suspicious event bar layout detected for event "${eventRecord.name ?? eventRecord.id}"\n\n` +
            [...messages, disableFix].map(({ title, problem, fix, code }) => title
                ? `${title}\n  ${problem}\n  ${fix}\n      ${code}`
                // The footer has no title to indent under, and keeps its snippet inline
                : `${fix} ${code}`
            ).join('\n\n') +
            (VersionHelper.isTestEnv ? '' : `\n\n${docsUrl}`),
            wrapEl
        );

        me.showPopup(wrapEl, issues);
    }

    /**
     * Applies the suggestions the popup makes, or takes them back again. They are applied to this Scheduler only,
     * so the effect can be compared both ways before the app commits to a change of its own.
     *
     * The popup stays open throughout, so its prompt is still there to be copied.
     * @param {String[]} issues Names of the rules to apply the fix for
     * @param {Boolean} apply `true` to apply the fixes, `false` to undo them
     * @private
     */
    applyFixes(issues, apply) {
        const
            me           = this,
            { client }   = me,
            { element }  = client;

        if (issues.includes('doublePadding')) {
            apply
                ? element.style.setProperty('--b-sch-event-padding-inline', '0')
                : element.style.removeProperty('--b-sch-event-padding-inline');
        }

        if (issues.includes('noStretch')) {
            // Toggling the feature refreshes on its own, which is what reapplies the outline decision below
            client.features.stickyEvents.disabled = apply;
        }

        // Nothing is wrong to point at while the fixes are on, but the bar stays the popup's anchor
        me.outlineHidden = apply;
        me.syncWarningEls();
    }

    // Reflects `outlineHidden` on the bars which are already rendered, for the cases where nothing else refreshes
    syncWarningEls() {
        const { outlineHidden } = this;

        for (const el of this.client.element.querySelectorAll(`.${warningCls}`)) {
            el.classList.toggle(warningCls, !outlineHidden);
        }

        if (!outlineHidden) {
            this.client.refresh();
        }
    }

    /**
     * Builds the prompt the copy button puts on the clipboard, written to be pasted straight into a coding agent.
     * @param {String[]} issues Names of the reported rules
     * @returns {String} The prompt
     * @private
     */
    buildPrompt(issues) {
        return 'My Bryntum Scheduler renders custom event bar content, and its layout has the following problems. ' +
            'Please fix them in my application code.\n\n' +
            issues.map((name, i) => `${i + 1}. ${rules[name].prompt}`).join('\n\n') +
            `\n\nBackground: ${docsUrl}`;
    }

    async copyPrompt(issues) {
        const prompt = this.buildPrompt(issues);

        if (await this.writeToClipboard(prompt)) {
            Toast.show('Prompt copied to the clipboard');
        }
        else {
            // Leave it somewhere it can still be copied from by hand
            console.warn(`[Bryntum Scheduler] Could not reach the clipboard, here is the prompt:\n\n${prompt}`);
            Toast.show('Could not reach the clipboard, the prompt was logged to the console');
        }
    }

    async writeToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);

            return true;
        }
        catch {
            // The async clipboard needs a secure context, focus and permission. The legacy path below covers the
            // cases it refuses, such as a non secure origin or an iframe without clipboard-write.
        }

        const
            activeElement = DomHelper.getActiveElement(this.client.element),
            textArea      = document.createElement('textarea');

        textArea.value = text;
        textArea.style = 'position:fixed;inset-block-start:-100em;opacity:0';
        document.body.appendChild(textArea);

        let copied = false;

        try {
            textArea.select();
            copied = document.execCommand('copy');
        }
        catch {
            copied = false;
        }

        textArea.remove();
        activeElement?.focus?.();

        return copied;
    }

    showPopup(wrapEl, issues) {
        const me = this;

        me.popup?.destroy();

        me.popup = new Popup({
            cls            : 'b-event-layout-warning-popup',
            title          : 'Potential event bar layout issue detected',
            forElement     : wrapEl,
            owner          : me.client,
            anchor         : true,
            autoShow       : true,
            autoClose      : false,
            closable       : true,
            // A diagnostic must not disturb what the app is doing, so it neither takes focus nor keeps it
            trapFocus      : false,
            focusOnToFront : false,
            // Dragging swallows the mousedown, which would stop the snippets below being selected and copied
            draggable      : false,
            scrollAction   : 'realign',
            // Labelled buttons rather than header tools, these actions are the point of the popup and have to be
            // impossible to miss
            bbar           : {
                items : {
                    applyFixButton : {
                        weight     : 100,
                        cls        : 'b-apply-layout-fix',
                        icon       : 'b-icon b-icon-check',
                        text       : 'Apply fixes',
                        // Toggling lets the result be compared against the problem, without reloading
                        toggleable : true,
                        tooltip    : 'Apply these suggestions to this Scheduler, toggle off to undo them',
                        onToggle   : ({ pressed }) => me.applyFixes(issues, pressed)
                    },
                    copyPromptButton : {
                        weight    : 200,
                        cls       : 'b-copy-layout-prompt',
                        rendition : 'filled',
                        icon      : 'b-icon b-icon-copy',
                        text      : 'Copy prompt',
                        tooltip   : 'Copy a prompt describing these fixes, to paste into a coding agent',
                        onClick   : () => me.copyPrompt(issues)
                    }
                }
            },
            // Width comes from the stylesheet, which has to widen past the default cap on a text only popup
            html : issues.map(name => rules[name]).map(({ title, problem, fix, code }) => StringHelper.xss`
                    <div class="b-event-layout-warning-issue">
                        <h4><i class="b-icon b-icon-warning"></i>${title}</h4>
                        <p>${problem}</p>
                        <p>${fix}</p>
                        <code>${code}</code>
                    </div>`).join('') +
                StringHelper.xss`
                    <p class="b-event-layout-warning-off">${disableFix.fix} <code>${disableFix.code}</code></p>`
        });
    }

    /**
     * Called while rendering, to reapply the outline to a bar which was reported earlier. Element reuse would
     * otherwise drop the class the next time the bar is synced.
     * @param {Object} renderData The render data of the bar being rendered
     * @internal
     */
    syncWarningCls(renderData) {
        const key = `${renderData.eventRecord.id}|${renderData.resourceRecord.id}`;

        renderData.wrapperCls[warningCls] = !this.outlineHidden && this.warnedKeys.has(key);
    }

    /**
     * Removes the outlines, hides the popup and measures the bars again, as if they were rendered initially.
     * @internal
     */
    clear() {
        const me = this;

        me.popup?.destroy();
        me.popup = null;
        me.warnedKeys.clear();
        me.hasWarnings   = false;
        me.outlineHidden = false;

        if (!me.client.isDestroying) {
            me.attach();
            me.client.refresh();
        }
    }

    doDestroy() {
        this.popup?.destroy();

        super.doDestroy();
    }
}
