import CSSHelper from '../helper/CSSHelper.js';
import DemoHelper from '../helper/DemoHelper.js';
import DomHelper from '../helper/DomHelper.js';
import GlobalEvents from '../GlobalEvents.js';
import Container from './Container.js';
import DemoCodeEditor from './DemoCodeEditor.js';
import Toolbar from './Toolbar.js';

/**
 * @module Core/widget/DemoHeader
 */

/**
 * This is an internal class used to create a demo header for Bryntum framework apps.
 * Not required for end-user application.
 *
 * @extends Core/widget/Container
 * @ts-class
 * @internal
 */
export default class DemoHeader extends Container {

    static $name = 'DemoHeader';

    static type = 'demoheader';

    static configurable = {
        /**
         * The ID of the owner div element, which will have a header as first child
         * @config {String}
         */
        insertFirst : 'container',

        /**
         * The path to the application folder to show code viewer
         * @config {String}
         */
        appFolder : '../',

        cls : 'demo-header',

        items : [
            {
                type    : 'widget',
                id      : 'title', // no-sanity
                cls     : 'title',
                element : {
                    tag  : 'a',
                    href : DemoHelper.getTitleLink(),
                    html : `
                        <h1>
                            <svg viewBox="0 0 354.9 144.52" xmlns="http://www.w3.org/2000/svg">
                                <g><path d="m305.63 144.52c-12.47 0-23.53-4.83-31.58-13.28v11.06h-25.54v-142.3h26.75v48.58c7.84-7.64 18.5-12.07 30.37-12.07 27.15 0 49.28 23.33 49.28 54.1s-22.12 53.9-49.28 53.9zm-3.82-83.47c-14.68 0-26.55 13.27-26.55 29.77s11.87 29.16 26.55 29.16 26.55-12.67 26.55-29.16-11.87-29.77-26.55-29.77z"></path><path d="m148.02 0h74.01v29.78h-74.01z"></path><path d="m0 56.26h222.03v29.78h-222.03z"></path><path d="m74.01 112.52h148.02v29.6h-148.02z"></path></g>
                            </svg>
                            <span class="demo-title">${DemoHelper.getDemoTitle()}</span>
                            ${DemoHelper.tierBadgeHtml}
                        </h1>
                    </a>`
                }
            },
            {
                type      : Toolbar.type,
                id        : 'tools', // no-sanity
                rendition : {
                    button : 'tonal'
                },
                items : [
                    '->',
                    {
                        ref       : 'trialButton',
                        type      : 'button',
                        text      : DemoHelper.trialButtonText,
                        rendition : 'filled',
                        href      : '#',
                        style     : {
                            'margin-inline-end' : '0.75em'
                        }
                    },
                    {
                        ref       : 'lightDarkButton',
                        type      : 'button',
                        rendition : 'text',
                        tooltip   : 'Toggle light / dark mode',
                        onClick() {
                            DomHelper.toggleLightDarkTheme();
                        }
                    },
                    {
                        ref     : 'codeButton',
                        type    : 'button',
                        tooltip : 'Click to show the code viewer',
                        icon    : 'b-icon-code',
                        onClick : 'up.toggleCodeEditor'
                    },
                    {
                        ref     : 'downloadButton',
                        type    : 'button',
                        tooltip : 'Download this demo zip archive',
                        icon    : 'b-icon-download',
                        href    : '#',
                        hidden  : true
                    }
                ]
            }
        ]
    };

    construct(...args) {
        const me = this;

        super.construct(...args);

        DemoHelper.restoreColorScheme();

        me.syncLightDarkIcon();

        GlobalEvents.ion({
            theme   : 'syncLightDarkIcon',
            thisObj : me
        });

        me.setupToolbar();

        DemoHelper.applyScreenshotMode();
    }

    syncLightDarkIcon() {
        const button = this.widgetMap.tools?.widgetMap.lightDarkButton;

        if (button) {
            button.icon   = DemoHelper.lightDarkIcon;
            button.hidden = !DemoHelper.canToggleColorScheme;
        }
    }

    async toggleCodeEditor() {
        this.codeEditor = await DemoCodeEditor.toggleCodeEditor(
            this.codeEditor,
            this.widgetMap.tools.widgetMap.codeButton,
            {
                header : {
                    style : {
                        height : '4em'
                    }
                },
                appFolder        : this.appFolder,
                preferredSources : [
                    /App\.[jt]sx?/,
                    /\w+Config\.[jt]sx?/,
                    /index\.[jt]sx?/
                ]
            }
        );
    }

    async setupToolbar() {
        const isDemoBrowser = document.location.href.match(/examples\/frameworks/);

        if (isDemoBrowser || DemoHelper.isTest) {
            const { downloadButton, trialButton } = this.widgetMap.tools.widgetMap;

            trialButton.href = DemoHelper.getTrialLink(DemoHelper.getDemoProduct());

            const zipUrl = await DemoHelper.getZipUrl(this.appFolder);

            if (zipUrl) {
                downloadButton.href   = zipUrl;
                downloadButton.hidden = false;
            }

            // Code editor styling
            CSSHelper.insertRule('body { flex-direction : row !important }');
            CSSHelper.insertRule('#container { flex: 1 !important; overflow : hidden !important }');
        }
    }
}
