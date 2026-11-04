import Toolbar from './Toolbar.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import DomHelper from '../helper/DomHelper.js';

import { canonicalDock } from './mixin/Rotatable.js';

import './Tab.js';

DomHelper.loadStylesheet('Core/widget/TabBar.css');

// import Stylesheet from './TabBar.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'TabBar');

/**
 * @module Core/widget/TabBar
 */

const isTab = t => t.isTab;

/**
 * A special toolbar used by {@link Core.widget.TabPanel} to present {@link Core.widget.Tab tabs} for the container's
 * items.
 *
 * The {@link Core.widget.Container#config-items} of a tab bar are typically managed by the tab panel, however,
 * items can be added that do not correspond to items in the tab panel. The {@link Core.widget.Widget#config-weight}
 * config of each tab defaults to 0 or the weight of its corresponding item.
 *
 * {@inlineexample Core/widget/TabBar.js}
 *
 * @extends Core/widget/Toolbar
 * @classtype tabbar
 * @internalwidget
 */
export default class TabBar extends Toolbar {

    static $name = 'TabBar';

    static type = 'tabbar';

    static configurable = {
        defaultType : 'tab',

        overflow : 'scroll',

        role : 'tablist',

        ignoreParentReadOnly : true,

        /**
         * Set to `true` to prevent tabs from being auto-rotated when the tab bar is docked to the left or right.
         * This allows having a vertical tab panel with horizontal (non-rotated) tab text.
         *
         * This config only has an effect when the tab bar is docked to `'left'` or `'right'`. It is ignored for
         * `'top'` and `'bottom'` docking where tabs are already horizontal.
         *
         * ```javascript
         * new TabPanel({
         *     tabBar : {
         *         dock           : 'left',
         *         horizontalTabs : true
         *     },
         *     items : {
         *         tab1 : { title : 'Tab 1', html : 'Content 1' },
         *         tab2 : { title : 'Tab 2', html : 'Content 2' }
         *     }
         * });
         * ```
         *
         * @prp {Boolean}
         * @default false
         */
        horizontalTabs : false
    };

    get firstTab() {
        return this.tabAt(0);
    }

    get lastTab() {
        return this.tabAt(-1);
    }

    get tabCount() {
        return this._items.countOf(isTab);
    }

    get tabs() {
        return ArrayHelper.from(this._items, isTab);
    }

    get isSideDocked() {
        return canonicalDock(this.dock)[1];
    }

    compose() {
        const { horizontalTabs, isSideDocked } = this;

        return {
            class : {
                'b-horizontal-tabs' : horizontalTabs && isSideDocked
            },
            children : {
                toolbarContent : {
                    class : {
                        'b-tab-panel-tabs' : 1
                    }
                }
            }
        };
    }

    updateDock(dock) {
        super.updateDock(dock);

        // Undo the rotation that Toolbar.updateDock applied (not needed during initial config)
        if (this.horizontalTabs && !this.isConfiguring) {
            this.clearTabRotation();
        }
    }

    updateHorizontalTabs(horizontalTabs) {
        if (!this.isConfiguring) {
            this.element?.classList.toggle('b-horizontal-tabs', horizontalTabs && this.isSideDocked);

            if (horizontalTabs) {
                this.clearTabRotation();
            }
            else {
                // Re-apply rotation from current dock
                for (const item of this.childItems) {
                    item.syncRotationToDock?.(this.dock);
                }
            }
        }
    }

    /**
     * Removes rotation from all Rotatable child items.
     * @private
     */
    clearTabRotation() {
        for (const item of this.childItems) {
            if (item.syncRotationToDock) {
                item.rotate = null;
            }
        }
    }

    indexOfTab(tab) {
        return this._items.indexOf(tab, isTab);
    }

    onChildAdd(child) {
        super.onChildAdd(child);

        // Toolbar.onChildAdd syncs rotation to dock, undo it for horizontalTabs
        if (this.horizontalTabs && child.syncRotationToDock) {
            child.rotate = null;
        }

        if (child.index == null) {
            this.syncTabs();
        }
    }

    onChildRemove(child) {
        super.onChildRemove(child);

        this.syncTabs();
    }

    onFocusIn({ _target }) {
        const { activeIndex } = this.owner;

        // If user is tabbing in (as opposed to clicking a tab), focus the active tab
        if (_target?.matches('.b-tab:focus-visible') && !isNaN(activeIndex)) {
            this.tabs[activeIndex].focus();
        }
    }

    syncTabs() {
        const { tabs } = this;

        for (let i = 0, n = tabs.length; i < n; ++i) {
            tabs[i].index = i;
            tabs[i].isFirst = !i;
            tabs[i].isLast = i === n - 1;
        }
    }

    tabAt(index) {
        return this._items.find(isTab, index) || null;
    }

    //endregion

    // region drag-drop
    onChildMove() {
        // Ensure all tabs have the correct first/last CSS classes in sync
        this.syncTabs();
    }

    /**
     * Handle drop
     * @private
     */
    onDrop({ context }) {
        const
            { item, valid, oldIndex } = context,
            { owner } = this;

        super.onDrop(...arguments);

        if (valid && owner) {
            const
                { owner } = this,
                wasActive = item.active,
                index     = Array.from(item.element.parentElement.children).indexOf(item.element);

            // Sync the item order of the owning TabPanel
            owner.insert(owner.items[oldIndex], index);

            if (wasActive) {
                owner.layout.setActiveItem(index, oldIndex, { animation : false, silent : true });
                owner.activeTab = item.item;
            }
        }
    }
    //endregion
}

// Register this widget type with its Factory
TabBar.initClass();
