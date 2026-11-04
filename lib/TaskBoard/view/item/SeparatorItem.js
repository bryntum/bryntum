import TaskItem from './TaskItem.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

DomHelper.loadStylesheet('TaskBoard/view/item/SeparatorItem.css');

// import Stylesheet from './SeparatorItem.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'SeparatorItem');

/**
 * @module TaskBoard/view/item/SeparatorItem
 */

/**
 * Item displaying a horizontal divider.
 *
 * {@inlineexample TaskBoard/view/item/SeparatorItem.js}
 *
 * @extends TaskBoard/view/item/TaskItem
 * @classtype separator
 * @tier community
 */
export default class SeparatorItem extends TaskItem {
    static $name = 'SeparatorItem';

    static type = 'separator';

    /**
     * @hideconfigs editor
     */

    static defaultEditor = null;

    static render({ domConfig }) {
        domConfig.tag = 'hr';
    }
}

SeparatorItem.initClass();
