import DomHelper from '../helper/DomHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import Button from './Button.js';

DomHelper.loadStylesheet('Core/widget/Tab.css');

// import Stylesheet from './Tab.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Tab');

/**
 * @module Core/widget/Tab
 */

/**
 * This widget class is used to present items in a {@link Core.widget.TabPanel} on its {@link Core.widget.TabBar tabBar}.
 * A reference to this widget is stored via the {@link Core.widget.Widget#config-tab} config on the tab panel's items.
 *
 * ```javascript
 * new TabPanel({
 *     appendTo : targetElement,
 *     height   : '25em',
 *     items    : {
 *         profile : {
 *            title : 'User profile',
 * +          tab : {
 * +                icon : 'fa fa-user',
 * +          },
 *            items : {
 *                 firstname : { type : 'text', label : 'First name', style : 'margin:2em 1em' },
 *                 surname  : { type : 'text', label : 'Last name', style : 'margin:2em 1em' }
 *             }
 *         },
 *         settings : {
 *             title : 'Settings',
 * +           tab : {
 * +               icon : 'fa fa-gear',
 * +           },
 *             items : {
 *                 infoWidget : {
 *                     type  : 'widget',
 *                     style : 'padding:1em',
 *                     html  : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * {@inlineexample Core/widget/TabBar.js}
 *
 * @extends Core/widget/Button
 * @classtype tab
 * @internalwidget
 */
export default class Tab extends Button {
    //region Config

    static $name = 'Tab';

    static type = 'tab';

    static configurable = {
        /**
         * @hideconfigs rendition
         */
        rendition : null,

        /**
         * This config is set to `true` when this tab represents the `activeTab` of a {@link Core.widget.TabPanel}.
         * It is managed by the tab panel and should not be set directly.
         * @config {Boolean} active
         * @internal
         * @default false
         */
        active : null,

        /**
         * The ordinal position of this tab in the {@link Core.widget.TabPanel}.
         * @member {Number} index
         * @readonly
         */
        /**
         * This config is set to the ordinal position of this tab in the {@link Core.widget.TabPanel}.
         * It is managed by the tab panel and should not be set directly.
         * @internal
         * @config {Number} index
         */
        index : null,

        /**
         * This config is set to `true` when this tab represents the first tab of a {@link Core.widget.TabPanel}.
         * It is managed by the tab panel and should not be set directly.
         * @internal
         * @config {Boolean} isFirst
         */
        isFirst : null,

        /**
         * This config is set to `true` when this tab represents the last tab of a {@link Core.widget.TabPanel}.
         * It is managed by the tab panel and should not be set directly.
         * @internal
         * @config {Boolean} isLast
         */
        isLast : null,

        /**
         * The {@link Core.widget.Widget} in the {@link Core.widget.TabPanel} corresponding to this tab.
         * It is managed by the tab panel and should not be set directly.
         * @internal
         * @config {Core.widget.Widget} item
         */
        item : {
            value : null,

            $config : 'nullify'
        },

        itemCls : null,

        /**
         * The tab panel that owns this tab.
         * @config {Core.widget.TabPanel} tabPanel
         * @internal
         */
        tabPanel : null,

        /**
         * The config property on this tab that will be set to the value of the {@link #config-titleSource} property
         * of this tab's {@link #config-item}.
         *
         * By default, the {@link #config-text} property of the tab is set to the {@link Core.widget.Widget#config-title}
         * property of its {@link #config-item}.
         * @config {String} titleProperty
         * @default
         */
        titleProperty : 'text',

        /**
         * The config property on this tab's {@link #config-item} that is used to set the value of the
         * {@link #config-titleProperty} of this tab.
         *
         * By default, the {@link #config-text} property of the tab is set to the {@link Core.widget.Widget#config-title}
         * property of its {@link #config-item}.
         * @config {String} titleSource
         * @default
         */
        titleSource : 'title',

        /**
         * Set to `true` to show a close icon to remove the tab from the owning TabPanel
         * @prp {Boolean}
         */
        closable : null,

        role : 'tab'
    };

    compose(domConfig) {
        const
            { active, cls, index, isFirst, isLast, text, icon, closable } = this,
            setSize = this.owner.visibleChildCount;

        if (closable) {
            domConfig.children.closeIcon = {
                tag   : 'i',
                class : 'b-tab-close b-icon b-icon-close'
            };
        }
        return {
            tabindex : 0,

            'aria-selected' : active,
            'aria-setsize'  : setSize,
            'aria-posinset' : index + 1,

            class : {
                'b-tab-panel-tab' : 1,
                'b-active'        : active,
                'b-tab-first'     : isFirst,
                'b-tab-last'      : isLast,

                ...cls   // cls is a DomClassList
            },

            dataset : {
                index
            },

            children : {
                iconElement : icon && {
                    children : !text && [
                        {
                            class : 'b-tab-indicator'
                        }
                    ]
                },

                label : text && {
                    text     : null,
                    children : [
                        text,
                        {
                            class : 'b-tab-indicator'
                        }
                    ]
                }
            }

        };
    }

    //endregion

    updateIndex(index) {
        this.isFirst = !index;
    }

    updateItem(item, was) {
        const me = this;

        if (was?.tab === me) {
            was.tab = null;
            was.ariaElement?.removeAttribute('aria-labelledby');
        }

        if (item) {
            item.tab = me;

            me[me.titleProperty] = item[me.titleSource];
            me.itemCls = item.cls;
            me.ariaElement.setAttribute('aria-controls', item.id);
            item.role = 'tabpanel';
            item.ariaElement.setAttribute('aria-labelledby', me.ariaElement.id);
        }

        me.itemChangeDetacher?.();
        me.itemChangeDetacher = item && FunctionHelper.after(item, 'onConfigChange', 'onItemConfigChange', me, {
            return : false
        });

        me.itemHideDetacher?.();
        me.itemHideDetacher = item?.ion({
            beforeChangeHidden   : 'onItemBeforeChangeHidden',
            beforeHide           : 'onItemBeforeHide',
            beforeUpdateDisabled : 'onItemBeforeUpdateDisabled',
            thisObj              : me,
            prio                 : 1000 // We must know before the layout intercepts and activates a sibling
        });

        me.syncMinMax();
    }

    updateItemCls(cls, was) {
        const
            { element } = this,
            classList = element && DomClassList.from(element?.classList, /* returnEmpty= */true);

        if (element) {
            classList.remove(was).add(cls);
            element.className = classList.value;
        }
    }

    updateRotate(rotate, was) {
        if (!rotate !== !was) {
            this.syncMinMax();
        }
    }

    syncMinMax() {
        const
            me = this,
            { rotate, tabPanel } = me;

        // We have to read the configs directly since there are getters that read the DOM styles:
        let { _minWidth : minWidth, _minHeight : minHeight, _maxWidth : maxWidth, _maxHeight : maxHeight } = me;

        // When a tab rotation changes, we need to pivot the min/max width values with the height values
        if (tabPanel) {
            const { tabMinWidth, tabMaxWidth } = tabPanel;

            if (tabMinWidth != null) {
                if (rotate) {
                    // if we were previously not rotated, the tabMinWidth may be effecting our minWidth:
                    if (minWidth === tabMinWidth) {
                        minWidth = null;
                    }

                    // noinspection JSSuspiciousNameCombination
                    minHeight = tabMinWidth;
                }
                else {
                    // if we were previously rotated, the tabMinWidth may be effecting our minHeight:
                    if (minHeight === tabMinWidth) {
                        minHeight = null;
                    }

                    minWidth = tabMinWidth;
                }
            }

            if (tabMaxWidth != null) {
                if (rotate) {
                    if (maxWidth === tabMaxWidth) {
                        maxWidth = null;
                    }

                    // noinspection JSSuspiciousNameCombination
                    maxHeight = tabMaxWidth;
                }
                else {
                    if (maxHeight === tabMaxWidth) {
                        maxHeight = null;
                    }

                    maxWidth = tabMaxWidth;
                }
            }

            me.minWidth = minWidth;
            me.minHeight = minHeight;
            me.maxWidth = maxWidth;
            me.maxHeight = maxHeight;
        }
    }

    onItemBeforeChangeHidden({ source : hidingChild, hidden }) {
        // If it's a hide/show that is not part of the layout's deactivating/activating, we must hide/show the tab
        if (!hidingChild.$isDeactivating && !hidingChild.$isActivating) {
            const { tabPanel } = this;

            this.hidden = hidden;

            // if tab to hide is active, let's active previous visible and enabled tab
            if (hidden && hidingChild === tabPanel.activeItem) {
                tabPanel.activateAvailableTab(hidingChild);
            }
        }
    }

    onItemBeforeHide() {
        // If it's a hide that is not part of the layout's deactivating, we hide the tab
        if (!this.item.$isDeactivating) {
            this.hide();
        }
    }

    onItemBeforeUpdateDisabled({ source : disablingChild, disabled }) {
        const { tabPanel } = this;

        this.disabled = disabled;

        // if tab to disable is active, let's active previous visible and enabled tab
        if (disablingChild === tabPanel.activeItem) {
            tabPanel.activateAvailableTab(disablingChild);
        }
    }

    onItemConfigChange({ name, value }) {
        if (name === this.titleSource) {
            this[this.titleProperty] = value;
        }
    }

    // Prevent only tab being removed
    get closable() {
        return this._closable && !(this.isFirst && this.isLast);
    }
}

// Register this widget type with its Factory
Tab.initClass();
