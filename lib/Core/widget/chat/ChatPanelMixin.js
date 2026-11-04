import AsyncHelper from '../../helper/AsyncHelper.js';
import DateHelper from '../../helper/DateHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import '../TextAreaField.js';
import './ChatBubbles.js';

/**
 * @module Core/widget/chat/ChatPanelMixin
 */

/**
 * Mixin that provides the core chat functionality for {@link Core.widget.chat.ChatPanel}. It manages chat messages,
 * user input, avatars, and option-button interactions within a scrollable bubble-style conversation UI.
 *
 * ```javascript
 * const chat = new ChatPanel({
 *     avatar    : 'bot-avatar.png',
 *     intro : 'How can I help you today?',
 *     messages  : [
 *         { text : 'Hello!', fromOther : true }
 *     ]
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Core.widget.chat.ChatPanel} - The chat panel widget
 * - {@link Core.data.ChatMessageModel} - Message data model
 *
 * @mixin
 * @experimental
 * @tier community
 */
export default Target => class ChatPanelMixin extends Target {
    static $name = 'ChatPanelMixin';

    static configurable = {
        // Configs that are relayed to the chat bubbles widget

        /**
         * The path to an avatar to display at the top of the chat bubble area
         * @prp {String}
         */
        avatar : null,

        /**
         * An introductory text (or DomConfig) shown at the top of the chat bubble area
         * @prp {String|DomConfig}
         */
        intro : null,

        /**
         * An array of example prompt strings displayed when the chat is empty. Clicking a prompt fills the
         * message field with its text.
         * @prp {String[]}
         */
        examplePrompts : null,
        promptHistory  : null,

        /**
         * The initial messages to display in the chat bubble area (e.g. a bot greeting message "Hello, how may I help
         * you?"
         * @prp {ChatMessageModelConfig}
         */
        messages : null,

        /**
         * An array of `DomConfig` items to show tool icons associated with each remote speech bubble. Each tool can
         * be clicked by the user to perform an action. Upon clicking a tool, the chat panel will trigger a
         * {#event-bubbleToolClick} event with details.
         * @prp {DomConfig}
         */
        bubbleTools : null,

        /**
         * Set to true to show a timestamp below each chat bubble
         * @prp {Boolean}
         */
        showTimestamp : null,

        /**
         * Controls where the message field trigger buttons (send, mic, etc.) are placed relative to the text area.
         * Use `'side'` to place them next to the text area (in the same row), or `'below'` to place them
         * underneath it. When placed on the side, use each trigger's `align` config (`'start'`/`'end'`) to
         * control which side they appear on.
         * @config {'side'|'below'}
         * @default
         */
        messageTriggersPlacement : 'side',

        /**
         * The delay in milliseconds between each simulated keystroke when typing out a response.
         * @prp {Number}
         * @default
         */
        typeInterval : 25,

        /**
         * Set to `true` to animate incoming messages with a character-by-character typing effect.
         * @prp {Boolean}
         * @default
         */
        animateTyping : true,

        width  : '25em',
        layout : 'vbox',

        items : {
            chatBubbles : {
                type              : 'chatbubbles',
                internalListeners : {
                    toolClick           : 'up.onToolClick',
                    examplePromptClick  : 'up.onExamplePromptClick',
                    optionClick         : 'up.onOptionClick',
                    beforeRenderMessage : 'up.onBeforeRenderMessage'
                }
            },
            messageField : {
                type        : 'textareafield',
                placeholder : 'L{ChatPanel.messageFieldPlaceholder}',
                resize      : 'none',
                autoHeight  : true,
                // Clear behavior without sacrificing space for the clear icon
                clearable   : {
                    cls : 'b-hide-display'
                },
                // Disable shrink-width clear animation, not suited for textarea
                transition     : { clear : false },
                revertOnEscape : true,
                keyMap         : {
                    Esc       : 'clear',
                    Enter     : 'up.onMessageEnter',
                    ArrowUp   : 'up.navigateHistoryBack',
                    ArrowDown : 'up.navigateHistoryForward'
                },
                internalListeners : {
                    input : 'up.onTextFieldInput'
                },
                triggers : {
                    send : {
                        weight   : 200,
                        cls      : 'b-icon b-send-chat-msg b-icon-circle-arrow-up',
                        handler  : 'up.onMessageEnter',
                        disabled : true
                    }
                }
            }
        }
    };

    afterConfigure() {
        // Trigger input to make sure send buttons have the correct state
        this.onTextFieldInput({ source : this.sendButton });
    }

    changeItems(items) {
        ObjectHelper.assign(items.chatBubbles, {
            avatar         : this.avatar,
            examplePrompts : this.examplePrompts,
            tools          : this.bubbleTools,
            intro          : this.intro
        });

        return super.changeItems(items);
    }

    compose() {
        return {
            class : {
                'b-chat-tools-below' : this.messageTriggersPlacement === 'below'
            }
        };
    }

    updateMessages(messages) {
        this.widgetMap.chatBubbles.store.data = messages;
    }

    get chat() {
        return this.widgetMap.chatBubbles;
    }

    get messageField() {
        return this.widgetMap.messageField;
    }

    get sendButton() {
        return this.widgetMap.messageField.triggers.send;
    }

    get usePromptHistory() {
        return Array.isArray(this.promptHistory);
    }

    /**
     * A reference to the {@link Core/data/Store data store} storing all the chat messages.
     *
     * @member {Core.data.Store}
     * @readonly
     */
    get store() {
        return this.chat.store;
    }

    updateBubbleTools(tools) {
        if (!this.isConfiguring) {
            this.chat.tools = tools;
        }
    }

    updateIntro(intro) {
        if (!this.isConfiguring) {
            this.chat.intro = intro;
        }
    }

    updateAvatar(avatar) {
        if (!this.isConfiguring) {
            this.chat.avatar = avatar;
        }
    }

    updateShowTimestamp() {
        if (!this.isConfiguring) {
            this.chat.recompose.now();
        }
    }

    /**
     * Add a message bubble to the chat log. Accepts data for the {@link Core/data/ChatMessageModel}, or a Promise that later
     * resolves to such data. When passed a promise, the bubble will show a loading indicator until resolved.
     * @param {Promise|ChatMessageModelConfig} message A message config object, or a Promise resolving a string with the text
     */
    async addMessage(message) {
        const me = this;

        // Async message
        if (ObjectHelper.isPromise(message)) {
            const
                bubble = me.chat.addAsyncBubble(),
                data   = await message;

            bubble.async = false;

            if (bubble.abort || !data) {
                return;
            }

            await me.processExternalMessage?.(data, bubble);

            const { text, ...rest } = data;

            bubble.set(rest);

            if (me.animateTyping) {
                bubble.writing = true;

                // Trying to make the writing faster when longer responses
                let { typeInterval } = me;
                if (text.length > 50) {
                    typeInterval /= 2;

                }
                if (text.length > 500) {
                    typeInterval /= 10;
                }

                bubble.text ??= '';

                // Type one char at a time
                let i = 0;
                while (i < text.length && !bubble.abort) {
                    let chars = text.slice(i, i + 1);

                    if (chars === '<') {
                        while (!chars.includes('>') && i < text.length) {
                            i++;
                            chars += text.slice(i, i + 1);
                        }
                    }
                    else if (chars === '&') {
                        const
                            toEvaluate = text.slice(i, i + 10),
                            match      = toEvaluate.match(/&[a-zA-Z0-9#]+;/);

                        if (match?.[0] && match.index === 0) {
                            chars += match[0].slice(1);
                            i += match[0].length - 1;
                        }
                    }

                    bubble.text += chars;

                    await AsyncHelper.sleep(typeInterval);

                    i++;
                }

                bubble.writing = false;
            }
            else {
                bubble.text = text;
            }
        }
        // Plain message
        else {
            me.chat.addBubble(message);
        }
    }

    /**
     * Adds a local message on Enter and triggers the {@link #event-localMessage} event.
     * The event should be listened for by the app to pass it to the backend.
     * @internal
     */
    onMessageEnter() {
        const
            me               = this,
            { messageField } = me,
            { value }        = messageField;

        if (value && !me.sendButton.disabled) {
            me.addLocalMessage(value);

            messageField.clear();
            me.onTextFieldInput({ source : messageField });
            me.usePromptHistory && me.pushPromptHistory(value);
        }
    }

    pushPromptHistory(value) {
        if (value?.length > 5) {
            const
                { promptHistory } = this,
                index             = promptHistory.indexOf(value);

            if (index !== 0) {
                if (index > 0) {
                    promptHistory.splice(index, 1);
                }
                promptHistory.unshift(value);

                /**
                 * Fired when the prompt history changes. Listen to this event to persist the
                 * history (e.g. to localStorage).
                 * @event promptHistoryChange
                 * @param {String[]} promptHistory The updated prompt history array
                 */
                this.trigger('promptHistoryChange', { promptHistory });
            }
        }
        this._promptHistoryIndex = null;
    }

    addLocalMessage(text, audio = false) {
        const msg = this.chat.addBubble({
            fromOther : false,
            text      : StringHelper.encodeHtml(text),
            audio
        });

        /**
         * Fired when a client side message is added via the text input field (or by picking a predefined option bubble).
         * @event localMessage
         * @param {Core.widget.chat.ChatPanel} source This panel
         * @param {String} text The text
         * @param {String} id The message id
         */
        this.trigger('localMessage', { text, id : msg.id, message : msg });
    }

    /**
     * Relays tool clicks up to the app to handle.
     * @param {Object} event The tool click event
     * @internal
     */
    onToolClick(event) {
        /**
         * Fired when the chat bubble tool icon is clicked.
         * @event bubbleToolClick
         * @param {Core.widget.chat.ChatPanel} source This panel
         * @param {String} tool The tool identifier
         * @param {ChatMessageModelConfig} message The message data for the associated chat bubble
         */
        this.trigger('bubbleToolClick', event);
    }

    /**
     * Applies the clicked example prompt text to the message field.
     * @param {Object} event The example prompt click event
     * @param {String} event.prompt The prompt text
     * @internal
     */
    onExamplePromptClick({ prompt }) {
        this.messageField.value = prompt;
        this.onTextFieldInput({ source : this.messageField });
        this.messageField.focus();
    }

    /**
     * Uses the picked option as a local message.
     * @param {Object} event The option click event
     * @param {String} event.option The selected option text
     * @internal
     */
    onOptionClick({ option }) {
        this.trigger('localMessage', { text : option, option : true });
    }

    onTextFieldInput({ source }) {
        this.toggleSendButtonState(!source.value && source.value !== 0, 'content');
    }

    onBeforeRenderMessage({ message, messageTools }) {
        const { showTimestamp } = this;

        if (showTimestamp) {
            messageTools.timestamp = {
                class : 'b-timestamp',
                text  : DateHelper.format(message.timestamp, typeof showTimestamp === 'string' ? showTimestamp : 'LT')
            };
        }
    }

    toggleSendButtonState(disabled, reason) {
        const reasons = this._sendButtonDisabledReasons ??= new Set();

        if (disabled) {
            reasons.add(reason);
        }
        else {
            reasons.delete(reason);
        }

        this.sendButton.disabled = reasons.size > 0;
    }

    navigateHistoryBack() {
        if (!this.usePromptHistory || !this.isHistoryNavigationAllowed(true)) {
            return false;
        }
        this.navigateHistory(1);
    }

    navigateHistoryForward() {
        if (!this.usePromptHistory || !this.isHistoryNavigationAllowed(false)) {
            return false;
        }
        this.navigateHistory(-1);
    }

    isHistoryNavigationAllowed(line) {
        const { value, input } = this.messageField;

        // Empty field — always allow
        if (!value || this._promptHistoryIndex == null) {
            return true;
        }

        // Block if user has edited the content since last history navigation.
        // Normalize non-breaking spaces — contentEditable uses \u00A0 internally,
        // but history stores regular spaces
        if (value.replace(/\u00A0/g, ' ').trim() !== this.promptHistory[this._promptHistoryIndex]?.replace(/\u00A0/g, ' ').trim()) {
            return false;
        }

        if (input.isContentEditable) {
            const sel = globalThis.getSelection();

            if (!sel?.rangeCount || !input.contains(sel.anchorNode)) {
                return true;
            }

            const range = document.createRange();

            if (line) {
                range.setStart(input, 0);
                range.setEnd(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset);
            }
            else {
                range.setStart(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
                range.setEnd(input, input.childNodes.length);
            }

            // eslint-disable-next-line bryntum/no-salesforce-unsupported-methods -- cloneContents unverified under LWS; chat is not used in Salesforce flows
            return !range.cloneContents().querySelector('br') && !range.toString().includes('\n');
        }

        // textarea
        return line ? input.value.lastIndexOf('\n', input.selectionStart - 1) === -1
            : input.value.indexOf('\n', input.selectionStart) === -1;
    }

    navigateHistory(direction) {
        const
            me                = this,
            { promptHistory } = me;

        if (promptHistory.length) {

            if (me._promptHistoryIndex == null) {
                me._promptHistoryIndex = direction === 1 ? 0 : promptHistory.length - 1;
            }
            else {
                me._promptHistoryIndex = (me._promptHistoryIndex + direction + promptHistory.length) % promptHistory.length;
            }

            me.messageField.value = promptHistory[me._promptHistoryIndex];
            me.onTextFieldInput({ source : me.messageField });

        }
    }
};
