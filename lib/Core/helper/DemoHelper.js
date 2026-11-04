/**
 * @module Core/helper/DemoHelper
 */

import BrowserHelper from './BrowserHelper.js';
import DomHelper from './DomHelper.js';
import GlobalEvents from '../GlobalEvents.js';

const colorSchemeKey = 'b-example-v8-color-scheme';

let colorSchemeRestored = false;

/**
 * Shared logic for demo headers, used by the vanilla demo shell, {@link Core.widget.DemoHeader} and the React, Vue and
 * Angular demo header wrappers.
 *
 * @ts-class
 * @internal
 */
export default class DemoHelper {

    /**
     * The tier of the demo, `community`, `business` or `enterprise`, read from the `bryntum-demo-tier` meta tag of
     * the page. `null` when the page does not declare a tier.
     * @member {'community'|'business'|'enterprise'|null} tier
     * @readonly
     * @static
     */
    static get tier() {
        const tier = document.querySelector('meta[name="bryntum-demo-tier"]')?.content;

        return ['community', 'business', 'enterprise'].includes(tier) ? tier : null;
    }

    /**
     * The tier of the `dist/tiers/<tier>` build the demo runs from. `null` outside of the tier builds.
     * @member {'community'|'business'|'enterprise'|null} buildTier
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
     * @member {'community'|'business'|'enterprise'|null} badgeTier
     * @readonly
     * @static
     */
    static get badgeTier() {
        return this.buildTier ?? this.tier;
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
}
