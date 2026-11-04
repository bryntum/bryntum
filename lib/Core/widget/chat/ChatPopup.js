import Popup from '../Popup.js';
import ChatPanelMixin from './ChatPanelMixin.js';

/**
 * @module Core/widget/chat/ChatPopup
 */

/**
 * Same as {@link Core.widget.chat.ChatPanel} but a Popup instead of a panel
 * @extends Core/widget/Popup
 * @mixes Core/widget/chat/ChatPanelMixin
 * @classtype chatpopup
 * @widget
 * @private
 * @experimental
 */
export default class ChatPopup extends Popup.mixin(ChatPanelMixin) {
    static $name = 'ChatPopup';
    static type = 'chatpopup';

    static configurable = {
        autoClose   : false,
        autoShow    : false,
        closeAction : 'hide',
        align       : {
            // Align to the end edge
            align   : 'b100-t100',
            // Inflate target upwards to give some space
            inflate : [10, 0, 10, 0]
        }
    };

    // We do not realign when our alignment target transitions on hover
    realignOnTransitionEnd() {}
}

ChatPopup.initClass();
