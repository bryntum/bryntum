import AjaxHelper from './AjaxHelper.js';
import AsyncHelper from './AsyncHelper.js';
import BrowserHelper from './BrowserHelper.js';
import DomHelper from './DomHelper.js';
import EventHelper from './EventHelper.js';
import VersionHelper from './VersionHelper.js';
import GlobalEvents from '../GlobalEvents.js';
import Tooltip from '../widget/Tooltip.js';

/**
 * @module Core/helper/DemoHelper
 */

const
    HINT_RETRY_DELAY = 500,
    HINT_RETRIES     = 10,
    colorSchemeKey   = 'b-example-v8-color-scheme',
    // Read once, routers (Angular's hash routing) rewrite the URL after load and drop the query string
    queryString      = globalThis.location ? BrowserHelper.queryString : {},
    appConfigs       = {};

let hintKey, colorSchemeRestored = false;

/**
 * Shared logic for demo headers, used by the vanilla demo shell, {@link Core/widget/DemoHeader} and the React, Vue and
 * Angular demo header wrappers. Also shows the selector-mapped demo hints from `hints.json` in the demo's meta folder.
 *
 * @ts-class
 * @internal
 */
export default class DemoHelper {

    static hints = {};

    static toolTips = [];

    static hintRun = 0;

    static rootElement = null;

    static onDocumentMouseDown = event => {
        // Composed path, so that a click inside a shadow root is not retargeted to its host
        const target = EventHelper.getComposedPathTarget(event);

        // Allow clicking links inside hints
        if (!target.closest('a')) {
            DemoHelper.hideHints();
        }
    };

    //region Hints

    /**
     * Whether the loaded hints file holds any hints.
     * @member {Boolean} hasHints
     * @readonly
     * @static
     */
    static get hasHints() {
        return Object.keys(this.hints).length > 0;
    }

    static get autoShowHints() {
        try {
            return !localStorage.getItem(this.hintKey);
        }
        catch {
            return true;
        }
    }

    static set autoShowHints(value) {
        try {
            if (value) {
                localStorage.removeItem(this.hintKey);
            }
            else {
                localStorage.setItem(this.hintKey, true);
            }
        }
        catch {
            // Storage blocked, the choice is not persisted
        }
    }

    static get hintKey() {
        return hintKey ??= `preventhints-${location.href}`;
    }

    /**
     * Popup for the info (cog) button in a demo header, named as in the vanilla demos. Shows the demo title and
     * description from `app.config.json`, and when the demo has hints, displays them again and toggles showing them
     * automatically when the demo loads.
     * @param {String} [appFolder='../'] Path to the folder holding `app.config.json`, relative to the page
     * @returns {Object}
     * @static
     */
    static getInfoMenu(appFolder = '../') {
        const me = this;

        return {
            type                   : 'popup',
            anchor                 : true,
            align                  : 't100-b100',
            cls                    : 'info-popup',
            tools                  : null,
            draggable              : false,
            resizable              : false,
            highlightReturnedFocus : false,
            width                  : '26em',
            onBeforeShow() {
                const { description, hintButton, hintCheck } = this.widgetMap;

                // The hints row is only for demos with hints
                hintButton.hidden = hintCheck.hidden = !me.hasHints;

                // Filled just in time, the app config is loaded on demand
                me.loadAppConfig(appFolder).then(appConfig => {
                    if (appConfig?.title && !description.isDestroyed) {
                        description.hidden = false;
                        // Descriptions hold markup, as in the vanilla demos
                        description.html = `<div class="header">${appConfig.title}</div><div class="description">${appConfig.description ?? ''}</div>`;
                    }
                });
            },
            items : {
                description : {
                    type   : 'widget',
                    cls    : 'example-description',
                    // Shown once the app config has loaded
                    hidden : true
                },
                hintButton : {
                    type     : 'button',
                    text     : 'Display hints',
                    onAction : ({ source }) => {
                        source.up('popup').hide();
                        me.showHints();
                    }
                },
                hintCheck : {
                    type      : 'slidetoggle',
                    text      : 'Automatically',
                    alignSelf : 'center',
                    minWidth  : 'fit-content',
                    tooltip   : 'Check to automatically display hints when loading the example',
                    checked   : me.autoShowHints,
                    onAction  : ({ checked }) => {
                        me.autoShowHints = checked;
                    }
                }
            }
        };
    }

    /**
     * Loads the hints file, and shows the hints unless configured not to.
     * @param {Object} [options]
     * @param {String} [options.metaFolder='meta/'] Path to the folder holding `hints.json`, relative to the page
     * @param {Boolean} [options.autoShow] Show the hints once loaded. Defaults to `true` unless the user opted out. In
     * test, screenshot or develop mode nothing is requested unless a value is passed
     * @param {Document|ShadowRoot} [options.rootElement=document] The root to find hint targets in, pass a shadow
     * root to find targets inside it
     * @returns {Object} The parsed hints file, or an empty object if it could not be loaded
     * @async
     * @static
     */
    static async loadHints({ metaFolder = 'meta/', autoShow, rootElement = document } = {}) {
        const me = this;

        // Modes which never show hints skip the request, unless the caller asks for the data
        if (autoShow == null && (me.isTest || me.isScreenshot || me.isDevelop || VersionHelper.isTestEnv)) {
            return {};
        }

        autoShow ??= me.autoShowHints;

        const
            run    = me.hintRun,
            result = await me.loadJson(`${metaFolder}hints.json`) ?? {};

        // Hint flow format is run by the vanilla demo shell
        me.hints = result.hints ? {} : result;

        // Hidden while loading, for example by an unmount
        if (run !== me.hintRun) {
            return result;
        }

        me.rootElement = rootElement;

        if (autoShow && me.hasHints) {
            // Delayed to allow Ajax-loaded UIs to render the hint targets
            AsyncHelper.sleep(100).then(() => run === me.hintRun && me.showHints());
        }

        return result;
    }

    static async showHints() {
        const me = this;

        if (!me.hasHints || me.toolTips.length) {
            return;
        }

        const
            run            = ++me.hintRun,
            findTarget     = selector => {
                try {
                    return selector && (me.rootElement ?? document).querySelector(selector);
                }
                catch {
                    // Invalid selector, treated as missing
                    return null;
                }
            },
            missingTargets = () => Object.keys(me.hints).filter(key => !findTarget(key)),
            isCancelled    = () => run !== me.hintRun;

        // Targets may still be moving into place (e.g. Scheduler useInitialAnimation), so wait for the UI to settle
        await me.waitForAnimationsToSettle();

        if (isCancelled()) {
            return;
        }

        for (let retry = 1; missingTargets().length && retry < HINT_RETRIES; retry++) {
            await AsyncHelper.sleep(HINT_RETRY_DELAY);

            if (isCancelled()) {
                return;
            }
        }

        // <remove-on-release>
        const missing = missingTargets();

        if (missing.length) {
            console.warn(`Hints are not ready after ${HINT_RETRY_DELAY * HINT_RETRIES / 1000} seconds.\nMissing targets:\n${missing.join('\n')}`);
        }
        // </remove-on-release>

        for (const [key, { title, content, ...hintConfig }] of Object.entries(me.hints)) {
            const target = findTarget(key);

            if (target) {
                me.toolTips.push(new Tooltip({
                    forElement   : target,
                    scrollAction : 'hide',
                    align        : 't-b',
                    tools        : null,
                    rendition    : 'rich',
                    html         : {
                        children : [title ? {
                            html      : title,
                            className : 'header'
                        } : null, {
                            html      : content,
                            className : 'description'
                        }]
                    },
                    autoShow    : true,
                    cls         : 'b-demo-hint',
                    textContent : true,
                    autoClose   : false,
                    ...hintConfig
                }));

                // Added with the first hint, so that an interaction can stop the others showing
                if (me.toolTips.length === 1) {
                    document.body.addEventListener('mousedown', me.onDocumentMouseDown, true);
                }

                // Staggered, so that an immediate click does not dismiss them all
                await AsyncHelper.sleep(me.toolTips.length * (VersionHelper.isTestEnv ? 10 : 500));

                if (isCancelled()) {
                    return;
                }
            }
        }
    }

    // Resolves when no finite animations are running and no widget is flagged as animating, or after maxWait ms
    static async waitForAnimationsToSettle(maxWait = 5000) {
        const
            endTime      = performance.now() + maxWait,
            getRunning   = () => DomHelper.getAnimations(document).filter(({ playState, effect }) =>
                playState === 'running' && effect?.getTiming().iterations !== Infinity
            ),
            isWidgetBusy = () => Boolean((this.rootElement ?? document).querySelector('.b-animating'));

        let running = getRunning();

        while ((running.length || isWidgetBusy()) && performance.now() < endTime) {
            await Promise.race([
                running.length ? Promise.allSettled(running.map(a => a.finished)) : AsyncHelper.sleep(100),
                AsyncHelper.sleep(endTime - performance.now())
            ]);

            // Let animationend listeners (e.g. stopInitialAnimation) run before re-checking
            await AsyncHelper.sleep(0);
            running = getRunning();
        }
    }

    /**
     * Hides and destroys the shown hints, and stops hints which are waiting to be shown.
     * @param {Object} [options]
     * @param {Boolean} [options.animate=true] Pass `false` to destroy the hints at once, for example on unmount
     * @static
     */
    static hideHints({ animate = true } = {}) {
        const me = this;

        me.hintRun++;

        me.toolTips.forEach(tip => animate ? tip.hide?.().then(() => tip.destroy()) : tip.destroy());
        me.toolTips.length = 0;

        document.body.removeEventListener('mousedown', me.onDocumentMouseDown, true);
    }

    //endregion

    //region Header

    static get isTest() {
        return queryString.test != null;
    }

    static get isScreenshot() {
        return queryString.screenshot != null;
    }

    static get isDevelop() {
        return queryString.develop != null;
    }

    /**
     * Whether the active theme has a light and a dark rendition to toggle between.
     * @member {Boolean} canToggleColorScheme
     * @readonly
     * @static
     */
    static get canToggleColorScheme() {
        return DomHelper.canToggleColorScheme;
    }

    /**
     * The icon for the light / dark toggle button. It offers the mode a click switches to, not the rendered one.
     * @member {String} lightDarkIcon
     * @readonly
     * @static
     */
    static get lightDarkIcon() {
        return DomHelper.isDarkTheme ? 'fa fa-sun' : 'fa fa-moon';
    }

    /**
     * Returns the examples browser link of a framework demo, e.g. `…/examples/frameworks/react-vite/basic/dist/` →
     * `…/examples/#example-frameworks-react-vite-basic`. Returns `#` for a page which is not a built framework demo.
     * @param {String} [href=location.href] The demo page URL
     * @returns {String}
     * @static
     */
    static getTitleLink(href = location.href) {
        const match = /(.*?\/)(examples.*?\/frameworks\/.*?)\/(build|out|dist)(?=[/?#]|$)/.exec(href);

        return match ? `${match[1]}examples/#example-${match[2].replace(/\//gm, '-').replace('examples-frameworks', 'frameworks')}` : '#';
    }

    /**
     * Returns the demo title from a `Product - Demo title` style document title.
     * @param {String} [title=document.title] The document title
     * @returns {String}
     * @static
     */
    static getDemoTitle(title = document.title) {
        return title.split(' - ')[1] || title;
    }

    /**
     * Returns the product name from a demo page URL, a trial product maps onto its product.
     * @param {String} [fallback='grid'] Product name used when the URL does not contain one
     * @param {String} [href=location.href] The demo page URL
     * @returns {String}
     * @static
     */
    static getDemoProduct(fallback = 'grid', href = location.href) {
        return href.match(/\/(\w+)(-trial)?\/(?:dist\/tiers\/\w+\/)?[-\w]*examples\//)?.[1].toLowerCase() || fallback;
    }

    /**
     * Returns the trial download link for a product.
     * @param {String} product The product name
     * @returns {String}
     * @static
     */
    static getTrialLink(product) {
        return `https://bryntum.com/download/?product=${product}`;
    }

    /**
     * Returns the download url of the demo zip archive declared in the demo's `app.config.json`.
     * @param {String} appFolder Path to the folder holding `app.config.json`, relative to the page
     * @returns {String|null} The url, or `null` when the demo has no zip archive. Always a url in test mode
     * @async
     * @static
     */
    static async getZipUrl(appFolder) {
        const zip = (await this.loadAppConfig(appFolder))?.zip;

        return (zip || this.isTest) ? `${appFolder}${zip ?? ''}` : null;
    }

    /**
     * Enables the screenshot styling and disables animations when the page is opened with a `screenshot` query
     * parameter.
     * @static
     */
    static applyScreenshotMode() {
        if (this.isScreenshot) {
            document.body.classList.add('b-screenshot');
            globalThis.bryntum.noAnimations = true;
        }
    }

    //endregion

    //region Tier and color scheme

    /**
     * The tier of the demo, `community`, `core` or `enterprise`, read from the `bryntum-demo-tier` meta tag of
     * the page. `null` when the page does not declare a tier.
     * @member {'community'|'core'|'enterprise'|null} tier
     * @readonly
     * @static
     */
    static get tier() {
        const tier = document.querySelector('meta[name="bryntum-demo-tier"]')?.content;

        return ['community', 'core', 'enterprise'].includes(tier) ? tier : null;
    }

    /**
     * The tier of the `dist/tiers/<tier>` build the demo runs from. `null` outside of the tier builds.
     * @member {'community'|'core'|'enterprise'|null} buildTier
     * @readonly
     * @static
     */
    static get buildTier() {
        let tier = 'community';





        return tier;
    }

    /**
     * The tier shown in the demo title badge. In the tier builds the {@link #property-buildTier-static build tier},
     * the same for all demos of the build, else the {@link #property-tier-static tier} of the demo.
     * @member {'community'|'core'|'enterprise'|null} badgeTier
     * @readonly
     * @static
     */
    static get badgeTier() {
        return this.buildTier ?? this.tier;
    }

    /**
     * The text of the trial download button in the demo headers. The Community tier is free, its demos invite to try
     * the Enterprise tier instead of downloading a trial.
     * @member {String} trialButtonText
     * @readonly
     * @static
     */
    static get trialButtonText() {
        return this.buildTier === 'community' ? 'Try Enterprise' : 'Download Trial';
    }

    /**
     * The badge for the demo title, showing the {@link #property-badgeTier-static badge tier}. An empty string when
     * there is no tier to show.
     * @member {String} tierBadgeHtml
     * @readonly
     * @static
     */
    static get tierBadgeHtml() {
        const { badgeTier } = this;

        return badgeTier ? `<span class="tier-badge">${badgeTier}</span>` : '';
    }

    /**
     * Restores the light / dark mode pinned in the demo browser or in another demo, which the demo headers keep in
     * local storage, and stores later toggles the same way. A `reset` query parameter drops the stored pin instead, so
     * screenshots and tests render the mode the page declares. Only the first call has an effect.
     * @static
     */
    static restoreColorScheme() {
        if (colorSchemeRestored) {
            return;
        }

        colorSchemeRestored = true;

        const { documentElement } = document;

        if (new URLSearchParams(document.location.search).has('reset')) {
            BrowserHelper.removeLocalStorageItem(colorSchemeKey);
        }
        else {
            const
                pinnedScheme = BrowserHelper.getLocalStorageItem(colorSchemeKey),
                { filename } = DomHelper.themeInfo;

            // A variant theme renders a single mode and cannot take a pin. An unresolved theme is assumed to render
            // both modes, as DomHelper does
            if (pinnedScheme && (!filename || DomHelper.familyThemes[filename])) {
                // The vanilla pre-load in browser/helper.js wrote the stored pin inline before first paint, which
                // DomHelper cannot know it owns. Re-assigning it through the API adopts it; both writes land in the
                // same frame, so nothing flashes
                if (documentElement.style.getPropertyValue('color-scheme') === pinnedScheme) {
                    documentElement.style.removeProperty('color-scheme');
                }

                DomHelper.colorScheme = pinnedScheme;
            }
        }

        // Stores the pin, not the event's detected scheme, which also reports a scheme the page declares itself. A
        // variant theme drops the pin with a stylesheet change, so every `theme` event is checked
        GlobalEvents.ion({
            theme() {
                const { colorScheme } = DomHelper;

                if (colorScheme) {
                    BrowserHelper.setLocalStorageItem(colorSchemeKey, colorScheme);
                }
                else {
                    BrowserHelper.removeLocalStorageItem(colorSchemeKey);
                }
            }
        });
    }

    //endregion

    // Loaded once per folder, resolves to null when the file is missing or invalid
    static loadAppConfig(appFolder) {
        return appConfigs[appFolder] ??= this.loadJson(`${appFolder}app.config.json`);
    }

    // Resolves to null when the file is missing or invalid
    static async loadJson(url) {
        try {
            return (await AjaxHelper.get(url, { parseJson : true })).parsedJson;
        }
        catch {
            return null;
        }
    }
}
