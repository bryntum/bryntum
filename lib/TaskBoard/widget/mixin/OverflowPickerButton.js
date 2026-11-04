import Base from '../../../Core/Base.js';

/**
 * @module TaskBoard/widget/mixin/OverflowPickerButton
 */

const menuListenersName = Symbol('menuListeners');

/**
 * Mixin providing re-initialization of the overflow menu each time it is expanded, to reflect dynamic changes.
 *
 * @mixin
 * @internal
 */
export default Target => class OverflowPickerButton extends (Target || Base) {

    static $name = 'OverflowPickerButton';

    // https://github.com/bryntum/bryntum/issues/10476
    // When menu overflow is active on application start, the event handler `onMenuBeforeShow` was not installed.
    // We need to add it here to ensure the submenu gets populated.
    addToOverflowMenu(menu, overrides, onCreateTwin) {
        const overflowTwin = super.addToOverflowMenu(menu, overrides, onCreateTwin);

        this.detachListeners(menuListenersName);

        overflowTwin.menu.ion({
            name       : menuListenersName,
            beforeShow : this.onMenuBeforeShow,
            thisObj    : this
        });

        return overflowTwin;
    }
};

