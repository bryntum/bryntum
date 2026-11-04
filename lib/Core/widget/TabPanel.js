import ArrayHelper from '../helper/ArrayHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Panel from './Panel.js';
import Tab from './Tab.js';

import './TabBar.js';
import './layout/Card.js';
import GlobalEvents from '../GlobalEvents.js';
import EventHelper from '../helper/EventHelper.js';

/**
 * @module Core/widget/TabPanel
 */

const
    isMaximized             = w => w.maximized,
    isFloating              = w => w.floating || w.positioned,
    runningHeightTransition = ({ transitionProperty, playState }) => transitionProperty === 'height' && playState === 'running';

/**
 * A tabbed container that displays a collection of child panels, each accessible via a
 * {@link Core.widget.TabBar tab bar} along the top. Each tab's appearance can be customized using the
 * {@link Core.widget.Tab#config-tab} config on the child panel. Switch tabs programmatically with
 * {@link #config-activeTab} and listen for changes via the {@link #event-tabChange} event. Tab selector buttons
 * are fully keyboard-navigable — <kbd>Enter</kbd> or <kbd>Space</kbd> activates a tab.
 *
 * ```javascript
 * const tabPanel = new TabPanel({
 *     items : {
 *         general : {
 *             title : 'General',
 *             items : {
 *                 name : { type : 'textfield', label : 'Name' }
 *             }
 *         },
 *         settings : {
 *             title : 'Settings',
 *             tab   : { icon : 'fa fa-cog' },
 *             items : {
 *                 theme : { type : 'combo', label : 'Theme' }
 *             }
 *         }
 *     },
 *     appendTo : document.body
 * });
 * ```
 *
 * {@inlineexample Core/widget/TabPanel.js}
 *
 * ## Useful configs and events
 *
 * | Config / Event                   | Description                                    |
 * |----------------------------------|------------------------------------------------|
 * | {@link #config-items}            | Tab child panels, keyed by tab reference name  |
 * | {@link #config-activeTab}        | Index or reference of the initially active tab |
 * | {@link #config-tabMinWidth}      | Minimum width for tab selector buttons         |
 * | {@link #config-animateTabChange} | Animate transitions between tabs               |
 * | {@link #event-tabChange}         | Fired when the active tab changes              |
 *
 * ## Adding non tab items to the tab bar
 *
 * The {@link Core.widget.TabBar} is a subclass of the Toolbar, meaning you can add additional widgets to it. You can
 * add either {@link Core.widget.Container#config-tabBarItems tab-specific items} only shown for the active tab, or you
 * can add static extra items that are shown for all tabs.
 *
 * Demo showing tab-specific extra items using {@link Core.widget.Container#config-tabBarItems}.
 * {@inlineexample Core/widget/TabPanel2.js}
 *
 * Demo showing static extra items using {@link Core.widget.TabBar#config-items}
 * {@inlineexample Core/widget/TabPanelExtraTabItems.js}
 *
 * ## Horizontal tabs on side-docked tab bar
 *
 * By default, tabs are rotated when the tab bar is docked to the left or right. Set
 * {@link Core/widget/TabBar#config-horizontalTabs} to `true` to keep tab text horizontal.
 *
 * {@inlineexample Core/widget/TabPanelHorizontalTabs.js}
 *
 * ## Tabs can be drag-dropped
 *
 * You can easily let users reorder the tabs by setting {@link Core.widget.TabBar#config-enableReordering} to `true`.
 *
 * {@inlineexample Core/widget/TabPanelDraggableTabs.js}
 *
 * ## See also
 *
 * - {@link Core.widget.TabBar} - The tab selector bar widget
 * - {@link Core.widget.Panel} - Base panel class
 *
 * @extends Core/widget/Panel
 * @classtype tabpanel
 * @classtypealias tabs
 * @widget
 */
export default class TabPanel extends Panel {
    //region Config

    static $name = 'TabPanel';

    static type = 'tabpanel';

    static alias = 'tabs';

    static configurable = {
        /**
         * The index of the initially active tab.
         * @member {Number} activeTab
         * @accepts {Number|Core.widget.Widget}
         */
        /**
         * The index of the initially active tab.
         * @config {Number}
         * @default
         */
        activeTab : 0,

        /**
         * Specifies whether to slide tabs in and out of visibility.
         * @config {Boolean}
         * @default
         */
        animateTabChange : true,

        /**
         * Set the height of all tabs to match the tab with the highest content.
         * @config {Boolean}
         * @default
         */
        autoHeight : false,

        defaultType : 'container',

        focusable : false,

        itemCls : 'b-tab-panel-item',

        layout : {
            type : 'card'
        },

        // Prevent child panels from displaying a header unless explicitly configured with one
        suppressChildHeaders : true,

        /**
         * Additional configuration for the tab bar.
         *
         * Use this to add more non-tab items to the bar:
         *
         * ```javascript
         * new TabPanel({
         *    tabBar : {
         *       items : {
         *          spacer : '->', // Spacer which moves next item to the right
         *          button : { type : 'button', text : 'MyButton' }
         *       }
         *    }
         * });
         * ```
         *
         * @config {TabBarConfig}
         */
        tabBar : {
            type   : 'tabbar',
            weight : -2000
        },

        /**
         * Min width of a tab title. 0 means no minimum width. This is default.
         * @config {Number}
         * @default
         */
        tabMinWidth : null,

        /**
         * Max width of a tab title. 0 means no maximum width. This is default.
         * @config {Number}
         * @default
         */
        tabMaxWidth : null
    };

    //endregion

    //region Init

    /**
     * The active tab index. Setting must be done through {@link #property-activeTab}
     * @member {Number}
     * @readonly
     */
    get activeIndex() {
        return this.layout.activeIndex;
    }

    /**
     * The active child widget. Setting must be done through {@link #property-activeTab}
     * @member {Core.widget.Widget}
     * @readonly
     */
    get activeItem() {
        return this.layout.activeItem;
    }

    get activeTabItemIndex() {
        const { activeTab, items, tabBar } = this;

        return items.indexOf(tabBar.tabs[activeTab]?.item);
    }

    get bodyConfig() {
        return ObjectHelper.merge({
            className : {
                'b-tab-panel-body' : 1
            }
        }, super.bodyConfig);
    }

    get focusElement() {
        const activeTab = this.items[this.activeTab || 0];

        return activeTab?.focusElement || activeTab?.tab?.focusElement;
    }

    get tabPanelBody() {
        return this.bodyElement;
    }

    finalizeInit() {
        super.finalizeInit();

        const
            me                    = this,
            { activeTab, layout } = me,
            { activeIndex }       = layout,
            { tabs }              = me.tabBar,
            activeTabItemIndex    = activeTab >= 0 && activeTab < tabs.length && me.items.indexOf(tabs[activeTab].item);

        if (tabs.length > 0 && (activeTabItemIndex === false || activeTabItemIndex < 0)) {
            throw new Error(`Invalid activeTab ${activeTab} (${tabs.length} tabs)`);
        }

        if (activeTabItemIndex !== activeIndex) {
            // Since we are responding to configuration, we need to sync activeIndex to activeTab as if it were the
            // initial value of activeIndex. This cannot be done (reasonably) during initialization of the card layout
            // because of the possibility of tabless items, so we wait until the dust settles on the items, the tabBar
            // and all other configs, but we must do the tab change silently (since the initial active item is set
            // without such ceremony) and without animation (to avoid the appearance of the initial tab animating in)
            layout.setActiveItem(activeTabItemIndex, activeIndex, {
                animation : false,
                silent    : true
            });
        }

        layout.animateCardChange = me.animateTabChange;
    }

    onChildAdd(child) {
        const me = this;

        // The layout will hide inactive new items.
        // And we must add our beforeHide listener *after* call super.
        super.onChildAdd(child);

        if (!me.initialItems) {
            const
                { tabBar }  = me,
                config      = me.makeTabConfig(child),
                // if child.tab === false, config will be null... no tab for this one
                firstTab    = config && tabBar?.firstTab,
                // if there are no tabs yet, this will be the first so we can skip all the indexing...
                tabBarItems = firstTab && tabBar._items,
                // not all items have tabs but the new child won't have one yet:
                tabItems    = firstTab && ArrayHelper.from(me._items, it => it.tab || it === child),
                // non-tabs could be in the tabBar, but the tabs must be contiguous:
                index       = firstTab ? tabItems.indexOf(child) + tabBarItems.indexOf(firstTab) : 0;

            if (config && tabBar) {
                if (firstTab && child.weight == null && index < tabBarItems.count - 1) {
                    tabBar.insert(config, index);
                }
                else {
                    tabBar.add(config);
                }
            }
        }
    }

    onChildRemove(child) {
        const
            me = this,
            { tab }           = child,
            { items, tabBar } = me,
            removeAt          = Math.max(tabBar.indexOfTab(tab), 0);

        if (tab) {
            tabBar.remove(tab);
            tab.destroy();
        }

        // Removing the active item, then show a sibling if any are left
        if (child === me.activeItem) {
            me._activeTab = null;
            if (items.length) {
                const { tabs } = tabBar;

                me.activeTab = tabs[Math.min(removeAt, tabs.length - 1)]?.item ?? items[0];
            }
        }

        super.onChildRemove(child);

        if (child.tabBarItems) {
            me.tabBar.remove(child.tabBarItems);
        }
    }

    //endregion

    //region Tabs

    isDisabledOrHiddenTab(tabIndex) {
        const
            { tabs } = this.tabBar,
            tab      = tabs?.[tabIndex];
        return tab && (tab.disabled || tab.hidden);
    }

    findAvailableTab(item, delta = 1) {
        const
            { tabs }  = this.tabBar,
            tabCount  = tabs.length,
            itemIndex = Math.max(0, tabs.indexOf(item.tab));

        if (itemIndex) {
            delta = -delta;
        }

        let activeTab;

        for (let n = 1; n <= tabCount; ++n) {
            //  itemIndex=2, tabCount=5:
            //               n : 1, 2, 3, 4, 5
            //      delta =  1 : 3, 4, 0, 1, 2
            //      delta = -1 : 1, 0, 4, 3, 2
            activeTab = (itemIndex + ((delta < 0) ? tabCount : 0) + n * delta) % tabCount;
            if (!this.isDisabledOrHiddenTab(activeTab)) {
                break;
            }
        }
        return activeTab;
    }

    activateAvailableTab(item, delta = 1) {
        this.activeTab = this.findAvailableTab(item, delta);
    }

    changeActiveTab(activeTab, oldActiveTab) {
        const
            me           = this,
            {
                tabBar,
                layout
            }            = me,
            { tabCount } = tabBar;

        if (activeTab.isWidget || ObjectHelper.isObject(activeTab)) {
            // Must be a child widget, so add if it's not already in our items.
            if (me.items.indexOf(activeTab) === -1) {
                activeTab = me.add(activeTab);
            }

            activeTab = tabBar.indexOfTab(activeTab.tab);
        }
        else {
            activeTab = parseInt(activeTab, 10);
        }

        if (!me.initialItems && tabCount > 0 && (activeTab < -1 || activeTab >= tabCount)) {
            throw new Error(`Invalid activeTab ${activeTab} (${tabCount} tabs)`);
        }

        if (me.isDisabledOrHiddenTab(activeTab)) {
            activeTab = me.findAvailableTab(activeTab);
        }

        // If we are animating, we must wait until any animation is finished
        // before we can go ahead and apply the change.
        if (layout.animateCardChange && layout.cardChangeAnimation) {
            layout.cardChangeAnimation.then(cardChange => {
                // If the animation resulted in not where we want, update the activeTab
                if (cardChange?.activeIndex !== activeTab) {
                    me._activeTab = activeTab;
                    me.updateActiveTab(activeTab, oldActiveTab);
                }
            });
        }
        else {
            return activeTab;
        }
    }

    async updateActiveTab(activeTab, was) {
        const me = this;

        if (!me.initialItems) {
            const { activeTabItemIndex, layout } = me;

            if (activeTabItemIndex > -1) {
                const newActiveItem = me.items[activeTabItemIndex];

                // Avoid no-change
                if (layout.activeItem !== newActiveItem) {
                    if (layout.animateCardChange) {
                        await me.tabSelectionPromise;
                    }
                    me.tabSelectionPromise = layout.setActiveItem(newActiveItem)?.promise;
                }
            }

            me.tabBar.remove(me.tabBar.items.filter(item => !item.isTab && item.trueOwner));
        }

        const activeItem = me.items[activeTab];

        if (activeItem?.tabBarItems) {
            activeItem.tabBarItems = me.tabBar.add(activeItem.tabBarItems);
            activeItem.tabBarItems.forEach(item => item.trueOwner = activeItem);
        }
    }

    changeTabBar(bar) {
        this.getConfig('strips');

        this.strips = {
            tabBar : bar
        };

        return this.strips.tabBar;
    }

    makeTabConfig(item) {
        const
            { tab } = item,
            config  = {
                item,

                type              : 'tab',
                active            : !item.hidden,
                tabPanel          : this,
                disabled          : Boolean(item.disabled),
                hidden            : item.initialConfig.hidden,
                weight            : item.weight || 0,
                internalListeners : {
                    click   : 'onTabClick',
                    thisObj : this
                },
                localizableProperties : {
                    // our tabs copy their text from the item's title and so are not directly localized
                    text : false
                }
            };

        if (tab === false) {
            return null;
        }

        return ObjectHelper.isObject(tab) ? Tab.mergeConfigs(config, tab) : config;
    }

    updateAnimateTabChange(animateTabChange) {
        if (!this.isConfiguring) {
            this.layout.animateCardChange = animateTabChange;
        }
    }

    updateItems(items, was) {
        const
            me                          = this,
            { activeTab, initialItems } = me;

        let index = 0,
            tabs;

        super.updateItems(items, was);

        if (initialItems) {
            tabs = Array.from(items, it => me.makeTabConfig(it)).filter(it => {
                if (it) {
                    it.index = index++;
                    return true;
                }
            });

            if (index) {
                // makeTabConfig derives `active` from item visibility, but the card layout hides items based on its
                // default index 0 - so mark active state authoritatively from activeTab, deactivating any other tab.
                tabs.forEach((tab, i) => tab.active = i === activeTab);

                me.tabBar.add(tabs);
                me.activeTab = activeTab;  // now we can validate the activeTab value
            }
        }
    }

    updateTabMinWidth(tabMinWidth) {
        this.tabBar?.items.forEach(tab => {
            if (tab.isTab) {
                tab.minWidth = tabMinWidth;
            }
        });
    }

    updateTabMaxWidth(tabMaxWidth) {
        this.tabBar?.items.forEach(tab => {
            if (tab.isTab) {
                tab.maxWidth = tabMaxWidth;
            }
        });
    }

    //endregion

    //region Auto height

    onFieldChange(e) {
        const
            me            = this,
            { _chipView } = e.source;

        super.onFieldChange(e);

        // If the changed field is a Combo with a ChipView, a change may mean the height of the ChipView
        // may have changed, so if we are autoHeight, we must remeasure.
        if (e.userAction && me.autoHeight && _chipView && me.isVisible && !me.up(isMaximized)) {
            // Jump past the refresh of the ChipView which happens after this listener fires
            // and also wait for any animations to start in the next AF.
            me.requestAnimationFrame(async() => {
                // If there are height transitions running on us, onContentElementTransitionEnd will
                // call applyAutoHeight when done, so bug out here.
                if (!me.isDestroyed && !DomHelper.getAnimations(me.element, { subtree : true }).some(runningHeightTransition)) {
                    await me.animationsFinished();
                    // Might be destroyed after the wait, so check presence of method.
                    me.applyAutoHeight?.();
                }
            });
        }
    }

    updateAutoHeight(autoHeight) {
        const me = this;

        me.detachListeners('themeAutoHeight');
        me.contentTransitionListener?.();
        me.toggleCls('b-auto-height', autoHeight);

        if (autoHeight) {
            GlobalEvents.ion({
                name    : 'themeAutoHeight',
                theme   : 'internalOnThemeChange',
                thisObj : me
            });
            me.contentTransitionListener = EventHelper.on({
                element       : me.contentElement,
                transitionend : 'onContentElementTransitionEnd',
                thisObj       : me
            });
        }
    }

    onContentElementTransitionEnd({ target, propertyName }) {
        // We only care about height transitions
        if (this.contentElement.contains(target) && propertyName === 'height' && !this.up(isMaximized)) {
            this.applyAutoHeight();
        }
    }

    applyAutoHeight(force = false) {
        const
            me            = this,
            {
                height,
                element,
                items
            }             = me,
            floatingOwner = me.closest(isFloating);

        let newHeight = height;

        // Only actually apply a measured height if we are not inside a maximized widget
        if (!floatingOwner?.maximized && me.isVisible) {
            // override any previously applied height when measuring
            me.flex = '0 0 0%';
            me.height = null;

            // Make all tabs visible. They will lay out horizontally and this widget and any
            // ancestor floating widget will attain its natural height when measured.
            items.forEach(i => i.removeCls('b-hidden'));
            // Add 1px to clientHeight to account for potential subpixel rounding errors or border rendering,
            // ensuring the content fits without overflow in all browsers.
            newHeight = element.clientHeight + 1;

            // This TabPanel and any ancestor will be at the maximum height now.
            items.forEach(i => {
                if (i !== me.activeTab) {
                    i.addCls('b-hidden');
                }
            });

            // If this is not a forced autoHeight and we are in a floating widget...
            if (!force && floatingOwner?.lastAlignSpec) {
                // Calculate what the new rectangle would be if we realigned at the new height
                // The result will include the zone, 0,1,2 or 3 meaning top, right, bottom, left.
                const newRect = floatingOwner.rectangle().alignTo(floatingOwner.lastAlignSpec);

                // If this height change would cause the floating owner to change zone, don't do it.
                if (newRect.zone !== floatingOwner.lastAlignSpec.zone) {
                    newHeight = height;
                }
            }

            me.height = newHeight;
            me.flex = `1 1 ${newHeight}px`;
        }
    }

    internalOnThemeChange({ mode }) {
        // A light/dark switch only changes colours, so the height is unchanged
        if (this.isVisible && !mode) {
            this.applyAutoHeight();
        }
    }

    //endregion

    //region Events

    // Called after beforeActiveItemChange has fired and not been vetoed before animation and activeItemChange
    onBeginActiveItemChange(activeItemChangeEvent) {
        const
            tabs                           = this.tabBar.tabs,
            { activeItem, prevActiveItem } = activeItemChangeEvent;

        // Our UI changes immediately, our state must be accurate
        this.activeTab = tabs.indexOf(activeItem?.tab);

        // Deactivate previous active tab
        if (prevActiveItem?.tab) {
            prevActiveItem.tab.active = false;
        }

        if (activeItem?.tab) {
            activeItem.tab.active = true;
            activeItem.tab.show();
        }
    }

    // Auto called because Card layout triggers the beforeActiveItemChange on its owner
    onBeforeActiveItemChange(activeItemChangeEvent) {
        /**
         * The active tab is about to be changed. Return `false` to prevent this.
         * @event beforeTabChange
         * @preventable
         * @param {Number} activeIndex - The new active index.
         * @param {Core.widget.Widget} activeItem - The new active child widget.
         * @param {Number} prevActiveIndex - The previous active index.
         * @param {Core.widget.Widget} prevActiveItem - The previous active child widget.
         */
        return this.trigger('beforeTabChange', activeItemChangeEvent);
    }

    // Auto called because Card layout triggers the activeItemChange on its owner
    onActiveItemChange(activeItemChangeEvent) {
        /**
         * The active tab has changed.
         * @event tabChange
         * @param {Number} activeIndex - The new active index.
         * @param {Core.widget.Widget} activeItem - The new active child widget.
         * @param {Number} prevActiveIndex - The previous active index.
         * @param {Core.widget.Widget} prevActiveItem - The previous active child widget.
         */
        this.trigger('tabChange', activeItemChangeEvent);
    }

    onTabClick(event) {
        const { item } = event.source;

        if (item.tab.closable && event.event.target.classList.contains('b-tab-close')) {
            this.remove(item);

            // Only destroy items this TabPanel created from config objects
            if (item._createdBy === this) {
                item.destroy();
            }
        }
        else {
            this.activeTab = item;
        }
    }

    onInternalPaint(...args) {
        super.onInternalPaint(...args);

        // Measure tabs on every paint if configured to do so
        if (this.autoHeight) {
            this.applyAutoHeight(true);
        }
    }

    onValidityChange({ source, valid }) {
        const me = this;
        // Acessing owningTab.isValid recursively checks the validity of the widgets, which can
        // trigger their own validityChange which bubbles to here. So, in order to prevent
        // infinite recursion, we set a flag while processing a validity change.
        if (me._alreadyInValidityChange) {
            return;
        }
        me._alreadyInValidityChange = true;

        const owningTab = source.closest(widget => widget.tab && widget.parent === me);
        if (owningTab) {
            const
                tabNotValid = owningTab.isValid === false,
                { tab }     = owningTab,
                desc        = tabNotValid ? me.L('L{TabPanel.containsInvalidFields}') : '';
            tab.toggleCls('b-invalid', tabNotValid);
            tab.ariaLabel = tab.tooltip = desc;
        }
        me._alreadyInValidityChange = false;
    }

    //endregion
}

// Register this widget type with its Factory
TabPanel.initClass();
