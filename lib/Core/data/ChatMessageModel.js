import Model from './Model.js';

/**
 * @module Core/data/ChatMessageModel
 */

/**
 * A model representing a single message in the {@link Core.widget.chat.ChatPanel} widget. Each message has a text body,
 * a direction indicator (`fromOther`), and optional interactive elements like user-selectable option buttons.
 *
 * ```javascript
 * const message = new ChatMessageModel({
 *     text      : 'Hello, how can I help?',
 *     fromOther : true,
 *     options   : ['Option A', 'Option B']
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Core.widget.chat.ChatPanel} - The chat UI widget
 * - {@link Core.data.Model} - Base model class
 *
 * @extends Core/data/Model
 */
// eslint-disable-next-line bryntum/require-static-name -- inherited $name is used for generated ids and AI tool names
export default class ChatMessageModel extends Model {
    static fields = [
        /**
         * A boolean indicating the source of the message. `true` if it's a remote message, `false` for a local message
         * @field {Boolean} fromOther
         */
        {
            name : 'fromOther',
            type : 'boolean'
        },
        /**
         * The message text
         * @field {String} text
         */
        {
            name : 'text',
            type : 'string'
        },
        // true = waiting for remote response, show load indicator
        {
            name : 'async',
            type : 'boolean'
        },
        {
            name : 'asyncStatus',
            type : 'string'
        },
        // true = writing
        {
            name : 'writing',
            type : 'boolean'
        },
        // true = will abort if async or writing
        {
            name : 'abort',
            type : 'boolean'
        },
        {
            name : 'failed',
            type : 'boolean'
        },
        /**
         * An array of strings to present to the user in the UI. After user picks a value, the conversation can continue.
         * @field {String[]} options
         */
        {
            name : 'options',
            type : 'array'
        },
        // Selected option, will be marked in the UI
        {
            name : 'selectedOption',
            type : 'string'
        },
        /**
         * The timestamp of this message
         * @field {Date} timestamp
         */
        {
            name         : 'timestamp',
            type         : 'date',
            defaultValue : 'now'
        }
    ];
}
