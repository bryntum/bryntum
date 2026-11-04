import Base from '../../Base.js';
import DomHelper from '../../helper/DomHelper.js';
import EventHelper from '../../helper/EventHelper.js';
import Tooltip from '../Tooltip.js';
import StringHelper from '../../helper/StringHelper.js';

DomHelper.loadStylesheet('Core/widget/util/AvatarRendering.css');

// import Stylesheet from './AvatarRendering.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'AvatarRendering');

/**
 * @module Core/widget/util/AvatarRendering
 */

/**
 * An object that describes properties of an avatar.
 *
 * @typedef {Object} AvatarConfig
 * @property {String} [initials] Resource initials
 * @property {String} [color] Background color for initials
 * @property {String} [iconCls] Icon cls
 * @property {String} [imageUrl] Image url
 * @property {String} [defaultImageUrl] Default image url, fallback if image fails to load or there is none
 *   specified. Leave out to show initials instead.
 * @property {Object} [dataset] Dataset to apply to the resulting element
 * @property {String} [alt] Image description
 */

/**
 * A utility class providing rendering of avatars / resource initials.
 *
 * {@inlineexample Core/widget/AvatarRendering.js}
 *
 * @extends Core/Base
 */
export default class AvatarRendering extends Base {

    static $name = 'AvatarRendering';

    static configurable = {
        /**
         * Element used to listen for load errors. Normally the owning widgets own element.
         * @config {HTMLElement}
         */
        element : null,

        /**
         * Prefix prepended to a supplied color to create a CSS class applied when showing initials.
         * @config {String}
         * @default
         */
        colorPrefix : 'b-sch-',

        /**
         * A tooltip config object to enable using a custom tooltip for the avatars. Listen for `beforeShow` and set
         * your html there.
         * @config {TooltipConfig}
         */
        tooltip : null,

        /**
         * The requested size of the avatars. If not null then the size is added as width and height to the avatar
         * element whether it is image or initials container
         * @config {String|Number|null}
         */
        size : null
    };

    doDestroy() {
        this.tooltip?.destroy();

        super.doDestroy();
    }

    updateElement(element) {
        // Error listener
        EventHelper.on({
            element,
            delegate : '.b-resource-image',
            error    : 'onImageErrorEvent',
            thisObj  : this,
            capture  : true
        });
    }

    changeTooltip(config) {
        return Tooltip.new({
            forElement  : this.element,
            forSelector : '.b-resource-avatar',
            cls         : 'b-resource-avatar-tooltip'
        }, config);
    }

    static get failedUrls() {
        return this._failedUrls || (this._failedUrls = new Set());
    }

    /**
     * Returns a DOM config object containing a resource avatar, icon or resource initials. Display priority in that
     * order.
     * @param {AvatarConfig|AvatarConfig[]} options A single avatar config object or an array of the same.
     * @returns {DomConfig}
     */
    getResourceAvatar(options) {
        const me = this;
        if (Array.isArray(options)) {
            return options.map(item => me.getResourceAvatar(item));
        }

        const
            { initials, color, iconCls, imageUrl, defaultImageUrl, dataset = {}, resourceRecord, alt = StringHelper.encodeHtml(resourceRecord?.name) } = options,
            config = me.getImageConfig(initials, color, imageUrl, defaultImageUrl, dataset, alt) ||
                me.getIconConfig(iconCls, dataset, alt) ||
                me.getResourceInitialsConfig(initials, color, dataset, alt),
            { size } = me;
        // if (globalThis.brk) debugger;
        Object.assign(config.style, {
            ...(size ? { height : size, width : size } : undefined)
        });

        return config;
    }

    getImageConfig(initials, color, imageUrl, defaultImageUrl, dataset, alt) {
        // Fall back to defaultImageUrl if imageUrl is known to fail
        imageUrl = AvatarRendering.failedUrls.has(imageUrl) ? defaultImageUrl : (imageUrl  || defaultImageUrl);

        if (imageUrl) {
            return {
                tag       : 'img',
                draggable : 'false',
                loading   : 'lazy',
                class     : {
                    'b-resource-avatar' : 1,
                    'b-resource-image'  : 1,
                    'b-colorize'        : 1
                },
                style : {
                    '--b-primary' : DomHelper.createColorStyle(color)
                },
                alt,
                'aria-label' : alt,
                elementData  : {
                    defaultImageUrl,
                    imageUrl,
                    initials,
                    color,
                    dataset
                },
                src : imageUrl,
                dataset
            };
        }
    }

    getIconConfig(iconCls, dataset, name) {
        if (iconCls) {
            return iconCls && {
                tag          : 'i',
                style        : {},
                'aria-label' : name,
                class        : {
                    'b-resource-avatar' : 1,
                    'b-resource-icon'   : 1,
                    'b-colorize'        : 1,
                    [iconCls]           : 1
                },
                dataset
            };
        }
    }

    getResourceInitialsConfig(initials, color, dataset, name) {
        const { size } = this;

        return {
            tag          : 'div',
            'aria-label' : name,
            class        : {
                'b-resource-avatar'   : 1,
                'b-resource-initials' : 1,
                'b-colorize'          : 1
            },
            style : {
                '--b-primary' : DomHelper.createColorStyle(color),
                ...(size ? { height : size, width : size } : undefined)
            },
            text : initials,
            dataset
        };
    }

    onImageErrorEvent({ target }) {
        if (!target.matches('.b-resource-avatar') || !target.isConnected) {
            return;
        }

        const { defaultImageUrl, initials, color, imageUrl, dataset } = target.elementData;

        if (defaultImageUrl && !target.src.endsWith(defaultImageUrl.replace(/^[./]*/gm, ''))) {
            target.src = defaultImageUrl;
        }
        else {
            const
                { parentElement } = target,
                oldConfig         = target.lastDomConfig,
                domConfig         = this.getResourceInitialsConfig(initials, color, dataset, target.alt);

            // Preserve the replaced config's reference so strict-mode re-syncs keep matching this element by syncId.
            // ignoreRefs makes createElement return the element itself instead of a { reference : element } refs map.
            if (oldConfig?.reference != null) {
                domConfig.reference = oldConfig.reference;
            }

            const initialsEl = DomHelper.createElement(domConfig, { ignoreRefs : true });

            // If this part of the DOM has a refOwner, the new element must use the same
            if (target.$refOwnerId) {
                initialsEl.$refOwnerId = target.$refOwnerId;
            }

            initialsEl.elementData = target.elementData;
            // Ensure DomSync data matches what we have just rendered
            initialsEl.lastDomConfig = domConfig;

            // Patch the parent's cached child config by identity (target.lastDomConfig is the exact object DomSync
            // stored in the children array) so the next re-sync renders the initials and not the failed image (#13345).
            const
                parentChildren = parentElement.lastDomConfig?.children,
                configIdx      = oldConfig ? parentChildren?.indexOf(oldConfig) : -1;

            if (configIdx > -1) {
                parentChildren[configIdx] = domConfig;
            }

            parentElement.replaceChild(initialsEl, target);
        }

        // Remember failed urls, to avoid trying to load them again next time
        AvatarRendering.failedUrls.add(imageUrl);
    }
}
