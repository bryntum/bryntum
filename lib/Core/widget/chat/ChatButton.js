import Widget from '../Widget.js';
import Button from '../Button.js';
import './ChatPanel.js';
import './ChatPopup.js';
import EventHelper from '../../helper/EventHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import DomHelper from '../../helper/DomHelper.js';
import Rectangle from '../../helper/util/Rectangle.js';

DomHelper.loadStylesheet('Core/widget/chat/ChatButton.css');

// import Stylesheet from './ChatButton.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ChatButton');

/**
 * @module Core/widget/chat/ChatButton
 */

const
    states = {
        open   : 'chat-open',
        closed : 'chat-closed',
        voice  : {
            speaking : 'voice-speaking',
            waiting  : 'voice-waiting',
            active   : 'voice-active',
            inactive : 'voice-inactive'
        }
    },
    // Maps voice state → [statusTooltip, actionTooltip]
    voiceTooltips = {
        [states.voice.speaking] : ['L{speakingTooltip}', 'L{stopRecordingTooltip}'],
        [states.voice.active]   : ['L{recordingTooltip}', 'L{stopRecordingTooltip}'],
        [states.voice.waiting]  : ['L{waitingTooltip}', 'L{stopRecordingTooltip}'],
        [states.voice.inactive] : ['L{inactiveTooltip}', 'L{startRecordingTooltip}']
    };

/**
 * A button that toggles the visibility of a linked {@link Core/widget/chat/ChatPanel}.
 *
 * {@inlineexample Core/widget/ChatButton.js}
 * @classtype chatbutton
 * @experimental
 * @tier community
 */
export default class ChatButton extends Button {

    // <debug>
    // region Localization test
    static localization = [
        'L{speakingTooltip}',
        'L{recordingTooltip}',
        'L{startRecordingTooltip}',
        'L{stopRecordingTooltip}',
        'L{waitingTooltip}',
        'L{inactiveTooltip}'
    ];
    // endregion
    // </debug>

    static $name = 'ChatButton';
    static type = 'chatbutton';

    static configurable = {
        icon : 'b-icon-message',

        /**
         * The linked ChatPanel instance whose visibility will be toggled by this button
         * @prp {ChatPanelConfig|Core.widget.chat.ChatPanel}
         */
        chatPanel : {
            $config : ['lazy'],
            value   : {}
        },

        state : states.closed
    };

    static states = states;

    constructor(...args) {
        super(...args);

        EventHelper.on({
            element      : this.element,
            thisObj      : this,
            autoDetach   : true,
            animationend : 'onAnimationEnd',
            contextmenu  : e => this.trigger('contextmenu', e)
        });
    }

    changeChatPanel(chatPanel, old) {
        return Widget.reconfigure(old, chatPanel ? ObjectHelper.merge({
            type              : 'chatpanel',
            owner             : this,
            internalListeners : {
                visibilityChange : 'up.onVisibilityChange',
                unreveal         : 'up.onVisibilityChange',
                reveal           : 'up.onVisibilityChange'
            }

        }, !chatPanel?.drawer && {
            type          : 'chatpopup',
            showAnimation : {
                height : {
                    from      : 0,
                    to        : chatPanel.height || '40em',
                    duration  : '0.3s',
                    delay     : '0s',
                    keepStyle : true
                },
                width : {
                    from      : 0,
                    to        : '28em',
                    duration  : '0.3s',
                    delay     : '0s',
                    keepStyle : true
                }
            },
            showCloseButton   : true,
            draggable         : false,
            scrollAction      : 'realign',
            internalListeners : {
                beforeAlign : 'up.beforeChatPopupAlign'
            }
        }, chatPanel, this.rootElement.offsetWidth < 600 && {
            drawer : { side : 'bottom', autoClose : false },
            width  : '100%',
            height : 300,
            // Later: Should have a better solution to this
            type   : chatPanel.type?.startsWith('ai') ? 'aichatpanel' : 'chatpanel'
        }) : null);
    }

    updateChatPanel(chatPanel) {
        this.relayEvents(chatPanel, ['localMessage', 'audioMessage', 'toolClick', 'userAborted']);
    }

    changeTooltip(tooltip, was) {
        if (tooltip != null) {
            if (typeof tooltip === 'string') {
                tooltip = { html : tooltip };
            }
            return super.changeTooltip(ChatButton.mergeConfigs({
                // We need our own private tooltip instance to support dynamic tooltip text based on state
                newInstance       : true,
                textContent       : true,
                closedHtml        : tooltip.html,
                // We need to update content depending on button state.
                internalListeners : {
                    beforeShow : 'onBeforeTooltipShow',
                    thisObj    : this
                }
            }, tooltip), was);
        }
        else {
            was?.destroy();
        }
    }

    onBeforeTooltipShow({ source }) {
        if (this.state === states.open) {
            return false;
        }
        const tooltips = voiceTooltips[this.state];

        if (tooltips) {
            source.html = [...tooltips, 'L{openChatTooltip}'].map(str => this.L(str)).join(this.L('L{tooltipPartSeparator}'));
        }
        else {
            source.html = source.closedHtml;
        }
    }

    async onInternalClick(event) {
        const
            { style } = this.chatPanel.chat.scrollable.element,
            { overflow } = style;

        switch (this.state) {
            case states.open:
                this.close();
                event.handled = true;
                break;
            case states.closed:
                style.overflow = 'hidden';
                await this.open();
                style.overflow = overflow;
                event.handled = true;
                break;
        }

        if (!this.isDestroyed) {
            super.onInternalClick(event);
        }
    }

    async open() {
        const { chatPanel } = this;

        await chatPanel.showBy({ target : this.element, monitorTargetMutation : true, monitorResize : false });

        chatPanel.element?.querySelector('.b-bottom-anchor')?.scrollIntoView();
    }

    beforeChatPopupAlign(spec) {
        if (this.style.scale !== '1') {
            spec.target = this.unscaledRect;
        }
    }

    /**
     * Returns a Rectangle representing this button's bounds ignoring any CSS scale transform.
     * This ensures consistent popup alignment regardless of hover state.
     * @member {Core.helper.util.Rectangle}
     * @readonly
     * @internal
     */
    get unscaledRect() {
        const
            rect       = this.rectangle(),
            { center } = rect,
            scale      = parseFloat(this.style.scale) || 1,
            // Calculate unscaled dimensions
            unscaledW  = rect.width / scale,
            unscaledH  = rect.height / scale;

        return new Rectangle(
            center.x - unscaledW / 2,
            center.y - unscaledH / 2,
            unscaledW,
            unscaledH
        );
    }

    close() {
        this.chatPanel.hide();
    }

    onVisibilityChange({ source }) {
        const hidden = source.isPopup ? source.hidden : !source.revealed;
        this.state = hidden ? states.closed : states.open;
    }

    onAnimationEnd(anim) {
        if (this.element && anim.animationName === 'b-anim-chat-button-icon-transition') {
            this.element.classList.toggle('b-chat-button-animating', false);
        }
    }

    compose() {
        const
            { state, _savedState, element } = this,
            config = super.compose();

        Object.assign(config.class, {
            [`b-${state}`]                : Boolean(state),
            [`b-${_savedState}-previous`] : Boolean(_savedState)
        });

        if (element && _savedState && _savedState !== state) {
            element.classList.toggle('b-chat-button-animating', true);
        }

        this._savedState = state;

        return config;
    }
}

ChatButton.initClass();
