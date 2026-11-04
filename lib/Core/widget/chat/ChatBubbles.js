import Widget from '../Widget.js';
import ChatMessageModel from '../../data/ChatMessageModel.js';
import Store from '../../data/Store.js';
import AsyncHelper from '../../helper/AsyncHelper.js';
import ObjectHelper from '../../helper/ObjectHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import '../TextField.js';

/**
 * @module Core/widget/chat/ChatBubbles
 */

// Matches mention tokens in both raw and HTML-encoded text:
//   Raw:     {@:"Name", model:"Model", id:N}
//   Encoded: {@:&quot;Name&quot;, model:&quot;Model&quot;, id:N}
const mentionTokenRe = /\{@:(?:&quot;|")(.*?)(?:&quot;|")(?:,\s*model:(?:&quot;|")(.*?)(?:&quot;|"))?(?:,\s*id:(\d+))?\}/g;

/**
 * A widget that renders chat messages as speech bubbles inside a scrollable container. Manages a
 * {@link Core.data.Store} of message records, composes bubble DOM with optional tools, options, and an intro section,
 * and animates additions with smooth scrolling.
 *
 * Not intended for direct use.
 * Consumed internally by {@link Core.widget.chat.ChatPanelMixin}.
 *
 * @classtype chatbubbles
 * @internal
 * @tier community
 */
export default class ChatBubbles extends Widget {
    static $name = 'ChatBubbles';
    static type = 'chatbubbles';

    static configurable = {
        /**
         * The data store holding chat message records. Pass `true` to create a default store, a store config
         * object, or an existing {@link Core.data.Store} instance.
         * @config {Core.data.Store|StoreConfig|Boolean}
         * @default true
         */
        store : true,

        /**
         * A DomConfig or HTML string shown at the top of the chat bubble area (for introductory text).
         * @config {String|DomConfig}
         */
        intro : null,

        /**
         * URL of an avatar image displayed at the top of the chat area.
         * @config {String}
         */
        avatar : null,

        /**
         * An array of example prompt strings. Rendered as clickable items when the store is empty,
         * triggering an `examplePromptClick` event when clicked.
         * @config {String[]}
         */
        examplePrompts : null,

        scrollable : true,

        /**
         * Tool definitions to render alongside each remote message bubble. Each key becomes a tool
         * reference accessible via the `toolClick` event.
         * @config {Object}
         */
        tools : null,

        /**
         * Initial messages to populate the store with on construction.
         * @config {Object[]}
         */
        messages : null,

        /**
         * HTML content to display inside the bubble while an async response is pending.
         * This is separate from a message record's `asyncStatus`, which renders as status text below the bubble.
         * When `null`, a default loading spinner is shown.
         * @config {String|DomConfig}
         */
        loadingMessage : null
    };

    //region Store

    changeStore(store) {
        // Could probably simplify this, and just always return a new store.
        // Unlikely there is a need to customize

        if (store instanceof Store) {
            return store;
        }

        if (store === true) {
            store = {};
        }

        if (!store.modelClass) {
            store.modelClass = ChatMessageModel;
        }

        if (this.messages) {
            store.data = this.messages;
        }

        return Store.create(store);
    }

    updateStore(store) {
        this.detachListeners('store');

        store.ion({
            name    : 'store',
            change  : 'onStoreChange',
            refresh : 'onStoreChange',
            thisObj : this
        });
    }

    // Recompose on store changes, animating bubbles unless it is a dataset operation.
    async onStoreChange({ action }) {
        const { element } = this;

        if (action !== 'dataset') {
            this.addCls('b-animate');
        }

        // Recompose right away, and store promise that will resolve when any animations finish (actual wait is below)
        const result = this.executeAndAwaitAnimations(element, () => this.recompose.now());

        // Scroll to the bottom of the chat
        await AsyncHelper.animationFrame();

        this.scrollable.scrollIntoView(element.querySelector('.b-bottom-anchor'), true);

        await result;

        this.removeCls('b-animate');
    }

    //endregion

    //region Adding bubbles

    /**
     * Adds a local bubble to the chat.
     * @param {Object} message Message data to add
     * @returns {Core.data.ChatMessageModel} The created message record
     */
    addBubble(message) {
        return this.store.add(message)[0];
    }

    /**
     * Adds a remote bubble to the chat that displays a loading indicator until it is unflagged as async.
     * @returns {Core.data.ChatMessageModel} The created async message record
     */
    addAsyncBubble() {
        return this.store.add({ async : true, fromOther : true })[0];
    }

    //endregion

    //region Inline items

    addItem(widget) {
        (this._inlineItems ??= []).push(widget);

        widget.ion({
            name    : 'inlineItem',
            destroy : () => this.removeItem(widget),
            thisObj : this
        });

        this.recompose();
    }

    removeItem(widget) {
        const items = this._inlineItems;

        if (items) {
            const idx = items.indexOf(widget);

            if (idx > -1) {
                items.splice(idx, 1);
                widget.detachListeners('inlineItem');
                this.recompose();
            }
        }
    }

    // After DomSync inserts widget elements, trigger render for any not yet rendered
    afterRecompose() {
        super.afterRecompose?.();

        this._inlineItems?.forEach(widget => {
            if (!widget.isDestroyed && !widget.isPainted && widget.element.parentElement) {
                widget.render(widget.element.parentElement);
            }
        });
    }

    //endregion

    //region Rendering

    compose() {
        const { store, tools, avatar, intro, examplePrompts, loadingMessage } = this;

        return {
            children : [
                {
                    class    : 'b-intro',
                    children : [
                        avatar && { tag : 'img', src : avatar, class : 'b-chat-avatar' },
                        intro,
                        ...((!store.count && examplePrompts) || []).map(prompt => ({
                            class : 'b-example-prompt',
                            text  : prompt
                        }))
                    ]
                },
                ...store.map(message => {
                    const messageTools = {};
                    this.trigger('beforeRenderMessage', { message, messageTools });
                    tools && Object.assign(messageTools, tools);

                    const
                        { fromOther, async, text, options, selectedOption, asyncStatus } = message,
                        isNewest = store.last === message,
                        loadingContent = async && loadingMessage && (typeof loadingMessage === 'string'
                            ? { html : loadingMessage }
                            : ObjectHelper.clone(loadingMessage)),
                        toolConfigs = Object.entries(messageTools).map(([ref, config]) => {
                            // Tools definition is shared, have to clone to not pollute
                            const clone = ObjectHelper.clone(config);
                            clone.dataset ||= {};
                            clone.tag = clone.tag ?? 'div';
                            clone.dataset.ref = ref;
                            if (clone.field) {
                                clone.dataset.field = clone.field;
                            }
                            // If tool defines a field, put the fields value in a css variable
                            // (used for confidence display)
                            if (clone.dataset.field && message[clone.dataset.field] != null) {
                                clone.style = { '--value' : message[clone.dataset.field] };
                            }

                            // If tool defines a tooltip function, call it with the message and use result as btip
                            if (clone.tooltip)  {
                                clone.dataset.btip = typeof clone.tooltip === 'function' ? clone.tooltip({ message }) : clone.tooltip;
                                delete clone.tooltip;
                            }

                            clone.class = `${clone.class ? `${clone.class} ` : ''}b-bubble-tool`;

                            return clone;
                        });

                    if (message.undone) {
                        toolConfigs.push({
                            tag   : 'div',
                            text  : this.L('L{ChatPanel.undone}'),
                            class : 'b-undone-tag'
                        });
                    }

                    return {
                        class : {
                            'b-message'      : 1,
                            'b-them'         : fromOther,
                            'b-us'           : !fromOther,
                            'b-async'        : async,
                            'b-last-message' : isNewest,
                            'b-undone'       : message.undone
                        },
                        elementData : {
                            message
                        },
                        children : [
                            {
                                class : {
                                    'b-bubble' : 1
                                },
                                html     : ChatBubbles.renderMentionTokens(text),
                                children : [
                                    loadingContent || async && {
                                        class : 'b-bubble-loading'
                                    }
                                ]
                            },
                            // loadingMessage renders inside the bubble; asyncStatus is a separate status line below it.
                            async && asyncStatus && {
                                class : 'b-asyncstatus',
                                text  : asyncStatus
                            },
                            // Remote bubbles show tools (if any)
                            fromOther && !async && toolConfigs?.length && {
                                class : {
                                    'b-bubble-tools' : 1
                                },
                                children : toolConfigs
                            },
                            // Remote bubbles might show options, if any are passed
                            fromOther && options && {
                                class    : 'b-options',
                                children : options.flatMap(option => ({
                                    tag   : 'button',
                                    class : {
                                        'b-option'   : 1,
                                        'b-selected' : option === selectedOption,
                                        'b-outdated' : !isNewest && option !== selectedOption
                                    },
                                    text : option
                                }))
                            }
                        ]
                    };
                }),
                // Inline widgets — DomSync natively handles Node instances via insertBefore
                ...(this._inlineItems || []).map(widget => ({
                    class    : 'b-inline-item',
                    children : [widget.element]
                })),
                // Always at the bottom, to have something to scroll smoothly to
                {
                    class : 'b-bottom-anchor'
                }
            ],

            // eslint-disable-next-line bryntum/no-listeners-in-lib
            listeners : {
                click   : 'onClick',
                thisObj : this
            }
        };
    }

    //endregion

    //region Listeners

    onClick({ target }) {
        // Clicked something in a message
        const messageElement = target.closest('.b-message');
        if (messageElement) {
            const { message } = messageElement.elementData;

            // Tool?
            if (target.matches('.b-bubble-tool')) {
                return this.trigger('toolClick', { tool : target.dataset.ref, message, target });
            }

            // Option? (only allow one click)
            if (target.matches('.b-option') && !message.selectedOption) {
                const option = target.textContent.trim();

                message.selectedOption = option;

                return this.trigger('optionClick', { option, message });
            }
        }
        // Clicked an example prompt?
        if (target.matches('.b-example-prompt')) {
            return this.trigger('examplePromptClick', { prompt : target.textContent.trim() });
        }
    }

    //endregion

    /**
     * Returns the DOM element for a given message record or message id.
     * @param {Core.data.ChatMessageModel|String|Number} message The message record or its id
     * @returns {HTMLElement} The message DOM element, or `undefined` if not found
     */
    getElementFromMessage(message) {
        const id = message.id ?? message;
        return [...this.element.querySelectorAll('.b-message')].find(el => el.elementData.message.id === id);
    }

    static renderMentionTokens(text) {
        if (!text?.includes('{@:')) {
            return text;
        }

        return text.replace(mentionTokenRe, (match, name, model, id) => {
            const
                safeName  = StringHelper.encodeHtml(name),
                safeModel = model ? StringHelper.encodeHtml(model) : '',
                safeId    = id ?? '';

            return `<span class="b-bubble-mention-tag" data-mention-name="${safeName}" data-mention-model="${safeModel}" data-mention-id="${safeId}">@${safeName}</span>`;
        });
    }
}

ChatBubbles.initClass();
