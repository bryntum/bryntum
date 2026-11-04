/**
 * @module Core/customElements/WidgetTag
 */

import BrowserHelper from '../helper/BrowserHelper.js';
import GlobalEvents from '../GlobalEvents.js';
import DomHelper from '../helper/DomHelper.js';
import StringHelper from '../helper/StringHelper.js';
import Tooltip from '../widget/Tooltip.js';

/**
 * A base class for a custom web component element wrapping one {@link Core.widget.Widget}.
 * @skip-is-property
 */
export default class WidgetTag extends (globalThis.customElements ? HTMLElement : Object) {
    static $name = 'WidgetTag';

    static observedAttributes = ['theme'];

    /**
     * The widget instance rendered in the shadow root
     * @member {Core.widget.Widget} widget
     */

    /**
     * Path to theme to use within the web component.
     *
     * ```html
     * <bryntum-grid stylesheet="resources/svalbard-light.css">
     * </bryntum-grid>
     * ```
     *
     * @config {String} theme
     */

    /**
     * Path to the Bryntum components structural CSS, to use within the web component.
     *
     * ```html
     * <bryntum-grid stylesheet="resources/grid.css">
     * </bryntum-grid>
     * ```
     *
     * @config {String} stylesheet
     */

    /**
     * Path to folder containing Font Awesome 6 Free.
     *
     * ```html
     * <bryntum-grid fa-path="resources/fontawesome/webfonts">
     * </bryntum-grid>
     * ```
     *
     * @config {String} faPath
     */

    connectedCallback() {
        this.setup();
    }

    async setup() {
        const me = this;

        // Setup just once
        if (me.shadowRoot) {
            return;
        }

        let linkResolver, font;

        const
            product        = me.tagName.substring('BRYNTUM-'.length).toLowerCase(),
            // Only load fa if not already on page, otherwise each instance will load it
            faPath         = (!BrowserHelper.isChrome || !document.fonts.check(`normal 14px "Font Awesome 6 Free"`)) && me.getAttribute('fa-path'),
            dynamics       = Array.from(document.querySelectorAll('link[data-bryntum-dynamic]')),
            pageThemeLink  = document.querySelector('link[data-bryntum-theme]'),
            theme          = me.getAttribute('theme') || pageThemeLink?.href,
            stylesheet     = me.getAttribute('stylesheet') || (dynamics.length ? '' : `${product}.css`),
            mode           = me.getAttribute('mode') || 'open',
            // Go over to the dark side
            shadowRoot     = me._rootElement = me.attachShadow({ mode }),
            promises       = [new Promise(resolve => {
                linkResolver = resolve;
            })],
            config         = {
                appendTo : shadowRoot,
                features : {}
            };

        me.linkTags = [];

        // Include dynamically loaded Bryntum CSS (when using sources)
        for (const dynamicLink of dynamics) {
            const clone = dynamicLink.cloneNode();
            shadowRoot.appendChild(clone);
            me.linkTags.push(clone);
        }

        // Include programmatically added stylesheets
        shadowRoot.adoptedStyleSheets = document.adoptedStyleSheets;

        // Include css and target div in shadow dom
        const
            link = stylesheet && DomHelper.createElement({
                tag     : 'link',
                rel     : 'stylesheet',
                href    : stylesheet,
                parent  : shadowRoot,
                dataset : {
                    loading : true
                }
            }),
            themeLink = me.themeLink = DomHelper.createElement({
                tag     : 'link',
                rel     : 'stylesheet',
                href    : theme,
                parent  : shadowRoot,
                dataset : {
                    bryntumTheme : true,
                    loading      : true
                }
            });

        link && me.linkTags.push(link);
        me.linkTags.push(themeLink);

        me.convertDatasetToConfigs(me.dataset, config);

        if (link) {
            link.onload = () => {
                delete link.dataset.loading;
                linkResolver();
            };
        }
        else {
            linkResolver();
        }

        // Theme stylesheet must also be awaited
        let themePromise;
        if (!themeLink.sheet) {
            themePromise = new Promise(resolve => {
                const settle = () => {
                    delete themeLink.dataset.loading;
                    resolve();
                };
                themeLink.addEventListener('load', settle, { once : true });
                themeLink.addEventListener('error', settle, { once : true });
            });
        }

        // Load FontAwesome if path was supplied
        if (faPath) {
            // FF cannot use the name "Font Awesome 6 Free", have if fixed in CSS to handle it also without spaces
            font = new FontFace(BrowserHelper.isFirefox ? 'FontAwesome6Free' : 'Font Awesome 6 Free', `url("${faPath}/fa-solid-900.woff2")`);
            document.fonts.add(font);
            promises.push(font.load());
        }

        // Block on both the optional stylesheet and the theme link, so that the widget
        // is created against fully-applied styling.
        await Promise.all([promises[0], themePromise]);

        /**
         * A Promise which is resolved when this component's {@link #config-stylesheet} and
         * {@link #config-faPath font} dependencies are fully ready.
         * @member {Promise} ready
         */
        me.ready = Promise.all(promises);

        // Create columns, data and configure features
        for (const tag of me.children) {
            const tagName = tag.tagName;

            if (tagName === 'FEATURE') {
                const
                    name          = tag.dataset.name,
                    featureConfig = me.convertDatasetToConfigs(tag.dataset);

                delete featureConfig.name;

                if (Object.keys(featureConfig).length) {
                    config.features[name] = featureConfig.use === 'false' || featureConfig.use === false ? false : featureConfig;
                }
                else {
                    config.features[name] = tag.textContent !== 'false';
                }
            }
            else if (tagName === 'TBAR' || tagName === 'BBAR') {
                config[tagName.toLowerCase()] = Array.from(tag.children).map(item => me.convertDatasetToConfigs(item.dataset));
            }
            else if (tagName === 'INLINESTYLE') {
                const style = document.createElement('style');
                style.innerHTML = tag.innerHTML;
                shadowRoot.appendChild(style);
            }
        }

        me.widget = me.createInstance(config);
        me.dispatchEvent(new CustomEvent('ready'));

        GlobalEvents.ion({
            theme   : me.onThemeChange,
            thisObj : me
        });
    }

    convertDatasetToConfigs(dataset, config = {}, ignoreObjects = false) {
        for (const key in dataset) {
            let value = dataset[key];

            if (!ignoreObjects && typeof value === 'string' && value.startsWith('{')) {
                value = this.convertDatasetToConfigs(JSON.parse(value.replace(/'/g, '"')));
            }
            else {
                value = StringHelper.safeJsonParse(value) ?? value;
                if (value === 'null') {
                    value = null;
                }
            }

            config[key] = value;
        }

        return config;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            if (name === 'theme') {
                this.themeLink.href = newValue;
            }
        }
    }

    onThemeChange() {
        const href = document.querySelector('link[data-bryntum-theme]')?.href;

        // Reassigning an unchanged href reloads the stylesheet
        if (href && href !== this.themeLink.href) {
            this.themeLink.href = href;
        }
    }

    /**
     * Destroys the inner widget instance and cleans up
     */
    destroy() {
        const
            me         = this,
            { widget } = me;

        if (!widget) {
            // Removed before anything could be created
            return;
        }

        const
            { shadowRoot } = me,
            sharedTips     = shadowRoot.bryntum,
            constructor    = widget.constructor,
            floatRoot      = shadowRoot.querySelector('.b-float-root');

        sharedTips?.tooltip?.get(Tooltip)?.destroy();
        sharedTips?.errorTooltip?.destroy();
        widget.ariaLiveEl?.remove();
        widget.destroy();
        floatRoot?.remove();
        constructor.removeFloatRoot(floatRoot);
        for (const link of me.linkTags) {
            link.remove();
        }

        // <debug>
        if (shadowRoot.children.length > 0) {
            throw new Error(`Leaked elements in shadowRoot: ${Array.from(shadowRoot.children).map(el => el)}`);
        }
        // </debug>
        me.widget = null;
    }
}
