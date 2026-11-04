import List from './List.js';
import DomHelper from '../helper/DomHelper.js';
import TemplateHelper from '../helper/TemplateHelper.js';

DomHelper.loadStylesheet('Core/widget/ChipView.css');

// import Stylesheet from './ChipView.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ChipView');

/**
 * @module Core/widget/ChipView
 */

/**
 * Displays an inline series of chips (compact labeled elements) that can be navigated, selected, and closed using
 * mouse or keyboard. Each chip represents a record in the underlying {@link #config-store}.
 * Configure {@link #config-closable} to show a close icon, and provide a {@link #config-closeHandler} to control
 * what happens when a chip is dismissed — by default the corresponding record is removed from the store.
 * Chips can also be removed by selecting them with arrow keys and pressing `Delete` or `Backspace`.
 *
 * {@inlineexample Core/widget/ChipView.js vertical}
 *
 * ```javascript
 * const chipView = new ChipView({
 *     store    : myStore,
 *     closable : true,
 *     appendTo : document.body
 * });
 * ```
 *
 * ## Useful configs and properties
 *
 * | Config                       | Description                                          |
 * |------------------------------|------------------------------------------------------|
 * | {@link #config-closable}     | Show a close icon on each chip                       |
 * | {@link #config-closeHandler} | Callback invoked when a chip is closed               |
 * | {@link #config-iconTpl}      | Template function returning chip icon markup         |
 * | {@link #config-multiSelect}  | Allow selecting multiple chips via click or keyboard |
 * | {@link #config-store}        | The data store providing chip records                |
 * | {@link #config-itemTpl}      | Template function for chip content                   |
 *
 * ## See also
 *
 * - {@link Core.widget.List} - Base list class for rendering store records
 * - {@link Core.widget.Combo} - Combo box that uses ChipView for multiselect display
 *
 * @extends Core/widget/List
 * @classtype chipview
 * @widget
 */
export default class ChipView extends List {
    //region Config

    static $name = 'ChipView';

    static type = 'chipview';

    static configurable = {
        cssVarPrefix : 'b-chip-view',

        itemCls : 'b-chip',

        /**
         * Configure as `true` to allow multi select and allow clicking and key navigation to select multiple chips.
         * @config {Boolean}
         * @default
         */
        multiSelect : false,

        /**
         * Configure as `true` to display a clickable close icon after the {@link #config-itemTpl}.
         * When tapped, the configured {@link #config-closeHandler} is called passing the associated record.
         *
         * Chips may also be selected using the <kbd>ArrowLeft</kbd> and <kbd>ArrowRight</kbd> arrows (And the <kbd>Shift</kbd> key to do multiple,
         * contiguous selection). Pressing the <kbd>Delete</kbd> or <kbd>Backspace</kbd> key passes the selected records to the
         * {@link #config-closeHandler} (if not provided, the record representing the chip is removed from the store).
         *
         * @config {Boolean}
         * @default
         */
        closable : true,

        /**
         * A template function, which, when passed a record, returns the markup which encapsulates a chip's icon to be
         * placed before the {@link #config-itemTpl}.
         * @config {Function}
         * @param {Core.data.Model} record The record to provide an icon for
         * @returns {DomConfig|String|null}
         */
        iconTpl : null,

        /**
         * If {@link #config-closable} is `true`, this is the name of a callback function to handle what the "close"
         * action means. If not provided, the record representing the chip is removed from the store.
         *
         * @config {String|Function}
         * @param {Core.data.Model[]} records Records to be closed
         * @param {Object} options Close options
         * @returns {void}
         */
        closeHandler : null,

        // ripple : {
        //     delegate : '.b-chip'
        // },

        transition : {
            add    : 'expand',
            remove : 'collapse'
        },

        testConfig : {
            transition : {
                add    : false,
                remove : false
            }
        }
    };

    itemContentTpl(record, i) {
        const me = this;

        return TemplateHelper.tpl`
            ${me.iconTpl ? me.iconTpl(record) : ''}
            <div class="${me.itemCls}-label">${me.callback(me.itemTpl, me, [record, i])}</div>
            ${me.closable ? '<div class="b-icon b-close-icon b-icon-clear" data-noselect></div>' : ''}
        `;
    }

    onInternalKeyDown(event) {
        const
            me             = this,
            { selected }   = me,
            { generation } = selected;

        if (me.closable && selected.count && (event.key === 'Delete' || event.key === 'Backspace')) {
            if (me.closeHandler) {
                me.callback(me.closeHandler, me.owner, [selected.values, { isKeyEvent : true }]);
            }
            else {
                me.store.remove(selected.values);
            }

            // If this keystroke caused a chip deletion, prevent other keydown handlers from firing.
            // Eg: An owning Combo should not now attempt to select the last chip in its ChipView.
            if (selected.generation !== generation) {
                event.stopImmediatePropagation();
            }
        }
        else {
            super.onInternalKeyDown(event);
        }
    }

    updateClosable(closable) {
        this.toggleCls('b-chips-closable', closable);

        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    onClick(event) {
        const
            me   = this,
            item = event.target.closest(`.${me.itemCls}`);

        if (me.closable && event.target.classList.contains('b-close-icon')) {
            const record = me.store.getAt(parseInt(item.dataset.index));

            if (me.closeHandler) {
                me.callback(me.closeHandler, me.owner, [[record]]);
            }
            else {
                me.store.remove(record);
            }
        }
        else {
            super.onClick(event);
        }
    }
}

// Register this widget type with its Factory
ChipView.initClass();
