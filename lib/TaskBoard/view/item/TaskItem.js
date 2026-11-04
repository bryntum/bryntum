import Base from '../../../Core/Base.js';
import Factoryable from '../../../Core/mixin/Factoryable.js';

/**
 * @module TaskBoard/view/item/TaskItem
 */

/**
 * Config options for all TaskItems combined. See respective item classes for more information.
 * @typedef {Object} TaskItemOptions
 * @property {String} [type] Type of the item
 * @property {String} [field] Field to display in the item. Usually inferred from the key when supplying items
 * @property {CSSStyleConfig} [style] Style definition in string or object form
 * @property {String} [cls] CSS class to add
 * @property {Number} [order] Flex order, can be used to re-order task items
 * @property {Boolean} [hidden] Specify `true` to hide the task item
 * @property {String|Object|null} [editor] Widget type or config to use as the editor for this item. Used in the inline
 * task editor. Set to `null` to not use an editor for this item
 * @property {String} [baseUrl] For `type : 'image'` - Url prepended to this items value
 * @property {Function} [template] For `type : 'template'` - Template function used to generate task content
 * @property {Object} template.context An object containing the information needed to render the item
 * @property {TaskBoard.model.TaskModel} template.context.taskRecord Task record passed for `template` function
 * @property {TaskItemOptions} template.context.config Item config passed for `template` function
 * @property {*} template.context.value Data value passed for `template` function
 * @property {String|DomConfig|DomConfig[]} template.returns Return value for `template` function
 * @property {Number} [max] For `type : 'progress'` and `type : 'rating'` - Max value
 * @property {String} [textField] For `type : 'todoList'` - Name of a property on a todo item to display as its text
 * @property {String} [checkedField] For `type : 'todoList'` - Name of a property on a todo item to use for the checkbox
 * @property {String} [clsField] For `type : 'todoList'` - Name of a property on a todo item whose value will be added
 * as a CSS class to the todo item
 * @property {Number} [maxAvatars] For `type : 'resourceAvatars'` - Maximum avatars to display by default.
 * @property {Boolean} [overlap] For `type : 'resourceAvatars'` - Specify `true` to slightly overlap avatars for tasks
 * @property {String} [textProperty] For `type : 'tags'` - Property used to display the tag text
 * @property {String} [clsProperty] For `type : 'tags'` - Property used to add a CSS class to each tag
 * @property {String} [separator] For `type : 'tags'` - Property used to split a value string into tags
 * @property {*} [jsx] React Element (JSX)
 */

/**
 * Abstract base class for task items, lightweight "widgets" that can be added to tasks using the
 * {@link TaskBoard/view/TaskBoard#config-headerItems}, {@link TaskBoard/view/TaskBoard#config-bodyItems} and
 * {@link TaskBoard/view/TaskBoard#config-footerItems} configs.
 *
 * @abstract
 */
export default class TaskItem extends Base.mixin(Factoryable) {
    static $name = 'TaskItem';

    static factoryable = {};

    static configurable = {
        /**
         * Task field whose value item will act on (usually display it). Defaults to use the key in the items object.
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *    features : {
         *        taskItems : {
         *            items : {
         *                // Will use "prio" as its field
         *                prio  : { type : 'textitem' },
         *                // Will use "status" as its field
         *                state : { type : 'textitem', field : 'status' }
         *            }
         *        }
         *    }
         * });
         * ```
         *
         * @config {String} field
         * @category Common
         */

        /**
         * Style definition in string or object form. See
         * {@link Core.helper.CSSHelper#typedef-CSSStyleConfig CSSStyleConfig} for all accepted forms.
         *
         * ```javascript
         * const taskBoard = new TaskBoard({
         *    features : {
         *        taskItems : {
         *            items : {
         *                // object form, keys are camelCase
         *                prio  : { type : 'textitem', style : { color : 'red' } },
         *                // cssText string form
         *                state : { type : 'textitem', style : 'color: red' }
         *            }
         *        }
         *    }
         * });
         * ```
         *
         * @config {CSSStyleConfig} style
         * @category Common
         */

        /**
         * Specify `true` to hide the task item.
         *
         * @config {Boolean} hidden
         * @category Common
         */

        /**
         * Flex order, can be used to re-order task items.
         *
         * @config {Number} order
         * @default 1
         * @category Common
         */

        /**
         * CSS class to add.
         *
         * @config {String} cls
         * @category Common
         */

        /**
         * Widget type or config to use as the editor for this item. Used in the inline task editor.
         * Set to `null` to not use an editor for this item.
         *
         * @config {String|Object|null} editor
         * @default text
         * @category Common
         */
    };

    static defaultEditor = { type : 'text' };

    /**
     * Specify `true` on a task item type which renders content that must remain in the accessibility tree.
     *
     * A card holding such an item is given `role="article"` instead of `role="button"`, since `button` is
     * children-presentational: assistive technologies prune the objects inside it and compute its name from the
     * flattened text content, which would hide the item's own content. See
     * {@link TaskBoard/view/TaskBoard#config-cardRole}.
     *
     * That covers both content which is focusable, such as the `<button>` rendered by
     * {@link TaskBoard/view/item/TaskMenuItem}, and content which is interactive without being focusable, such as the
     * click toggled todos of {@link TaskBoard/view/item/TodoListItem}.
     *
     * It also opts the item's root element into the board's roving tabIndex composite: the element is rendered with
     * `tabIndex -1`, which keeps it out of the tab order while making it reachable from the card with <kbd>F2</kbd>.
     * See {@link TaskBoard/view/TaskBoard#keyboard-shortcuts}.
     *
     * {@note}
     * Only the item's own root element is silenced. An item which renders further focusable elements inside itself,
     * such as a {@link TaskBoard/view/item/TemplateItem} rendering a `<button>`, is responsible for giving those
     * `tabIndex -1` too, otherwise they become additional tab stops inside the board.
     * {/@note}
     *
     * @member {Boolean} focusableContent
     * @static
     * @default false
     * @category Accessibility
     */
    static focusableContent = false;

    static getEditorConfig({ config, item }) {
        const editor = config.editor !== null && (config.editor || item.defaultEditor);

        if (typeof editor === 'string') {
            return {
                type : editor
            };
        }

        return editor;
    }
}
