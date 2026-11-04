import DomHelper from '../../../Core/helper/DomHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import Combo from '../../../Core/widget/Combo.js';
import TaskBoardLinked from '../mixin/TaskBoardLinked.js';

DomHelper.loadStylesheet('TaskBoard/widget/base/ColorBoxCombo.css');

// import Stylesheet from './ColorBoxCombo.css' with { type: 'css' };
// // Shares some styling with the ColorField
// import ColorFieldStylesheet from '../../../Core/widget/ColorField.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColorBoxCombo');
// DomHelper.applyStylesheet(ColorFieldStylesheet, 'ColorField');

/**
 * @module TaskBoard/widget/base/ColorBoxCombo
 */

/**
 * Abstract base class with functionality shared between {@link TaskBoard.widget.ColumnCombo} and
 * {@link TaskBoard.widget.SwimlaneCombo}.
 *
 * @extends Core/widget/Combo
 * @mixes TaskBoard/widget/mixin/TaskBoardLinked
 * @abstract
 */
export default class ColorBoxCombo extends Combo.mixin(TaskBoardLinked) {
    static $name = 'ColorBoxCombo';

    static type = 'colorboxcombo';

    static configurable = {
        displayField : 'text',
        valueField   : 'id',
        editable     : false,
        listItemTpl  : ({ text, color }) => StringHelper.xss`<div class="b-color-box" style="--b-primary: ${DomHelper.createColorStyle(color) || 'inherit'}"></div>${text}`,
        picker       : {
            cls : 'b-color-box-picker'
        }
    };

    afterConstruct() {
        if (!this.showBoxForNoColor && !this.value) {
            this.addCls('b-colorless');
        }
    }

    syncInputFieldValue(...args) {
        const
            me        = this,
            { color } = me.record || {};

        me.colorBox.style.setProperty('--b-primary', DomHelper.createColorStyle(color));

        if (!me.showBoxForNoColor) {
            me.toggleCls('b-colorless', !color);
        }

        super.syncInputFieldValue(...args);
    }

    get innerElements() {
        return [
            {
                reference : 'colorBox',
                className : 'b-color-box'
            },
            ...super.innerElements
        ];
    }
}
