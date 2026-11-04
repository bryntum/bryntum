import Panel from '../Panel.js';
import ChatPanelMixin from './ChatPanelMixin.js';
import DomHelper from '../../helper/DomHelper.js';
import '../panel/PanelCollapserOverlay.js';

DomHelper.loadStylesheet('Core/widget/chat/ChatPanel.css');

// import Stylesheet from './ChatPanel.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ChatPanel');

/**
 * @module Core/widget/chat/ChatPanel
 */

/**
 * A generic chat panel which displays chat bubbles from the local input or a remote data source such as an AI agent.
 * The example below is not connected to a backend but will give you an idea of how easy it would be to let it drive an
 * AI agent.
 *
 * {@inlineexample Core/widget/ChatPanel.js}
 *
 * ## Basic configuration
 *
 * To preload the chat panel with a chat history, use {@link #config-messages}. You can set an
 * {@link #config-intro intro message}, show an {@link #config-avatar} and set a {@link #config-title}.
 *
 * After the user adds a new message via the text input field, a {@link #event-localMessage} event is fired. You can
 * send this to your server, and once your remote chat service sends a message to the client, you can add it to the
 * log using {@link #function-addMessage}.
 *
 * ```javascript
 * const chatPanel = new ChatPanel({
 *     appendTo      : targetElement,
 *     title         : 'Acme Sales Support',
 *     async onLocalMessage({ text }){
 *          const
 *              response = await fetch('chatServer.php'),
 *              text = await response.text();
 *
 *          this.addMessage({ fromOther : true, text });
 *     }
 * });
 * ```
 *
 * On remote speech bubbles, you can show a time stamp using {@link #config-showTimestamp} and you can also define a list
 * of action icons via {@link #config-bubbleTools}
 *
 * The text input field can be configured using the `items` object:
 *
 * ```javascript
 * const chatPanel = new ChatPanel({
 *     appendTo      : targetElement,
 *     title         : 'Acme Sales Support',
 *     height        : '30em',
 *     showTimestamp : true,
 *     items : {
 *         messageField : {
 *             placeholder : 'Ask me anything'
 *         }
 *     }
 * });
 * ```
 *
 * ## Displaying selectable option chips
 *
 * A remote chat response can also present a list of actions, letting the user pick one before continuing the chat.
 *
 * {@inlineexample Core/widget/ChatPanelActions.js}
 *
 * @extends Core/widget/Panel
 * @classtype chatpanel
 * @widget
 * @mixes Core/widget/chat/ChatPanelMixin
 * @experimental
 * @tier community
 */
export default class ChatPanel extends Panel.mixin(ChatPanelMixin) {
    static $name = 'ChatPanel';
    static type = 'chatpanel';
    // <debug>
    // region Localization test
    static localization = [
        'L{feedbackToast}'
    ];
    // endregion
    // </debug>
}

ChatPanel.initClass();
