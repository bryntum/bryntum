import TaskItem from './TaskItem.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';

DomHelper.loadStylesheet('TaskBoard/view/item/TaskMenuItem.css');

// import Stylesheet from './TaskMenuItem.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TaskMenuItem');

/**
 * @module TaskBoard/view/item/TaskMenuItem
 */

/**
 * Item that adds a `···` button hooked up to display the {@link TaskBoard/feature/TaskMenu} on click.
 *
 * Requires the {@link TaskBoard/feature/TaskMenu} to work as intended.
 *
 * {@inlineexample TaskBoard/view/item/TaskMenuItem.js}
 *
 * @extends TaskBoard/view/item/TaskItem
 * @classtype taskMenu
 * @tier community
 */
export default class TaskMenuItem extends TaskItem {
    static $name = 'TaskMenuItem';

    static type = 'taskMenu';

    /**
     * @hideconfigs editor
     */

    static defaultEditor = null;

    // Renders a real <button>, it must not be pruned by a children-presentational card role
    static focusableContent = true;

    static render({ taskBoard, domConfig }) {
        if (!taskBoard.features.taskMenu || taskBoard.features.taskMenu.disabled) {
            return false;
        }

        domConfig.tag = 'button';
        domConfig['aria-label'] = StringHelper.xss`${taskBoard.L('L{TaskMenuItem.showTaskMenu}')}`;
        domConfig.class['b-icon b-icon-menu-horizontal'] = 1;
    }

    static onClick(eventObject) {
        const { source : taskBoard, event } = eventObject;

        taskBoard.features.taskMenu?.showContextMenu(eventObject, { target : event.target });
    }
}

TaskMenuItem.initClass();
