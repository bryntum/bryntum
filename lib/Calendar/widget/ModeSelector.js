import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Fencible from '../../Core/mixin/Fencible.js';
import Button from '../../Core/widget/Button.js';
import ButtonGroup from '../../Core/widget/ButtonGroup.js';
import MenuItem from '../../Core/widget/MenuItem.js';
import Container from '../../Core/widget/Container.js';
import Minifiable from '../../Core/widget/mixin/Minifiable.js';
import Responsive from '../../Core/widget/mixin/Responsive.js';

import '../../Core/widget/layout/Box.js';

DomHelper.loadStylesheet('Calendar/widget/ModeSelector.css');

// import Stylesheet from './ModeSelector.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ModeSelector');

/**
 * @module Calendar/widget/ModeSelector
 */
const menuItemListeners = {
    hide() {
        this.$overflowClone.hide();
    },
    show() {
        this.$overflowClone.show();
    }
};

/**
 * Displays a UI which allows selection of calendar modes. The modes can be displayed as a {@link Core.widget.ButtonGroup} or a single
 * {@link Core.widget.Button} with a {@link Core.widget.Button#config-menu}. Which presentation is used depends on
 * the {@link #config-minified} config property. By default, this is set
 * {@link Core.widget.mixin.Responsive#config-responsive responsively} in order to present the best UI for different
 * screen sizes.
 *
 * The buttons to select each mode may be accessed from the Calendar's {@link Calendar.view.Calendar#property-widgetMap}.
 * The name is created from the mode name plus `'ShowButton'`, so the button to show the week mode would be accessed by
 * `myCalendar.widgetMap.weekShowButton`
 *
 * If the mode selector is {@link #config-minified}, and the modes are offered through a menu. The menu items to select each mode
 * may be accessed from the Calendar's {@link Calendar.view.Calendar#property-widgetMap}. The name is created from the mode name
 * plus `'ShowMenuItem'`, so the menu item to show the week mode would be accessed by `myCalendar.widgetMap.weekShowMenuItem`
 *
 * The ModeSelector is part of the Calendar's default toolbar. It can be configured through the
 * {@link Calendar.view.Calendar#config-tbar tbar} config:
 *
 * ```javascript
 * const calendar = new Calendar({
 *     tbar : {
 *         items : {
 *             modeSelector : {
 *                 // Start in minified (menu) mode
 *                 minified : true
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Calendar.view.Calendar#config-tbar} — The toolbar that contains this selector
 * - {@link Calendar.view.Calendar#config-modes} — The modes available for selection
 *
 * @extends Core/widget/Container
 * @classtype calendarModeSelector
 * @tier community
 * @widget
 */
export default class ModeSelector extends Container.mixin(Fencible, Minifiable, Responsive) {
    //region Config

    static $name = 'ModeSelector';

    static type = 'calendarmodeselector';

    static configurable = {
        // Since Minifiable is @internal for now
        /**
         * Set to `false` to prevent this widget from assuming is {@link #config-minified} form automatically (for
         * example, due to {@link Core.widget.Toolbar#config-overflow} handling.
         *
         * When this value is `true` (the default), the minifiable widget's {@link #config-minified} config may be
         * set to `true` to reduce toolbar overflow.
         *
         * @config {Boolean}
         * @default
         */
        minifiable : true,

        /**
         * The config property that will be used as the readable title for each mode.
         * @config {String}
         * @default
         */
        titleProperty : 'title',

        /**
         * Set to `true` to present this widget in its minimal form.
         * @config {Boolean}
         * @default false
         */
        minified : null,

        /**
         * The button or button config object that will display a popup menu to select the calendar mode.
         * @config {Core.widget.Button}
         */
        button : {
            ref               : 'modeSelectorButton',
            type              : 'button',
            icon              : 'b-icon-calendar-days',  // avoid b-icon-menu since toolbar overflow also uses that icon
            cls               : 'b-calendar-mode-button',
            menu              : [],
            internalListeners : {
                beforeShowMenu : 'up.onBeforeFirstShowModeMenu',
                once           : true
            }
        },

        /**
         * The button group or button group config object that will display the calendar modes, one per button.
         * @config {Core.widget.ButtonGroup}
         */
        buttonBar : {
            type                 : 'buttongroup',
            rendition            : 'padded',
            ignoreParentReadOnly : true
        },

        calendar : {
            value   : 'calendar',
            $config : 'lazy'
        },

        /**
         * The {@link Core.widget.Button} that will toggle the display of non-working days.
         *
         * This property will only exist if the Calendar's {@link Calendar.view.Calendar#config-includeWeekendsButton} has been
         * set to `true`
         *
         * If that property is set to `false`, this property will still yield a button instance, but it will be hidden by CSS rules.
         * @prp {Core.widget.Button}
         * @accepts {ButtonConfig}
         * @readonly
         */
        includeWeekendsButton : {
            $config : 'lazy',

            value : {
                ref         : 'weekendsButton',
                type        : 'button',
                cls         : 'b-calendar-full-week-button',
                toggleGroup : `no`,  // so ButtonGroup does not take over
                text        : 'L{ModeSelector.weekends}',
                tooltip     : 'L{ModeSelector.includeWeekends}',
                onToggle    : 'up.onToggleWorkingDaysButton',
                weight      : -1
            }
        },

        /**
         * The {@link Core.widget.MenuItem} that will toggle the display of non-working days when the Calendar UI is narrow
         * and the modes are selected using a menu.
         *
         * This property will only exist if the Calendar's {@link Calendar.view.Calendar#config-includeWeekendsButton} has been
         * set to `true` and the Calendar is in Responsive `small` mode.
         * @prp {Core.widget.Button}
         * @accepts {ButtonConfig}
         * @readonly
         */
        includeWeekendsMenuItem : {
            $config : 'lazy',

            value : {
                ref       : 'weekendsMenuItem',
                separator : true,
                text      : 'L{ModeSelector.includeWeekends}',
                checked   : false,
                onToggle  : 'up.onToggleWorkingDaysMenu',
                weight    : 10
            }
        },

        layout : {
            type : 'box',
            wrap : false
        },

        overflowable : 'none',

        responsive : {
            large : {
                // Allow toolbar overflow to kick us into minified state
                minifiable : true,
                minified   : null
            },

            '*' : {
                minified : true
            }
        },

        responsiveTarget : '@calendar',

        contentElMutationObserver : false
    };

    changeMinified(minified) {
        // Don't allow toolbar overflow to kick us out of minified state when responsive state is ensmallened
        if (minified || this.responsiveState === 'large') {
            return minified;
        }
    }

    static fenced = {
        onToggleButton   : true,
        onToggleMenuItem : true,
        syncFullWeek     : true,
        syncActiveMode   : {
            all  : 'syncActiveMode',
            lock : ['onToggleButton', 'onToggleMenuItem', 'syncActiveMode']
        }
    };

    get childItems() {
        const
            result      = super.childItems,
            { _button } = this;

        if (_button) {
            result.push(_button);
        }
        return result;
    }

    get hideNonWorkingDays() {
        return this.calendar?.hideNonWorkingDays;
    }

    set hideNonWorkingDays(value) {
        const { calendar } = this;

        // If the current value of calendar.hideNonWorkingDays is null, it is acting as false, so don't bother to
        // set it if value is also false. If we do, that would push the value down to each mode which would mask a
        // value that may be set directly on the child view.
        if (calendar && !(!value && calendar.hideNonWorkingDays == null)) {
            calendar.hideNonWorkingDays = value;
        }
    }

    configure(config = {}) {
        // If the user specified "minified" config and not "minifiable", set minifiable=false here so that both configs
        // are captured in the initialConfig of the instance and prevent responsive updates to either:
        if (this.isConstructing && ('minified' in config) && !('minifiable' in config)) {
            config = ObjectHelper.assign({
                minifiable : false
            }, config);
        }

        super.configure(config);
    }

    changeIncludeWeekendsButton(config, existing) {
        const
            me = this,
            includeWeekendsButton = config && me.calendar?.includeWeekendsButton;

        if (includeWeekendsButton) {
            // Calendar may have false/null for its config but we ignore such values. In that case, the button will be
            // hidden by CSS rules (not destroyed)
            config = Button.mergeConfigs(config, includeWeekendsButton);
        }

        if (config && !existing) {
            return me.add(config);
        }

        return Button.reconfigure(existing, config, /* owner = */me);
    }

    updateIncludeWeekendsButton(includeWeekendsButton) {
        if (includeWeekendsButton) {
            includeWeekendsButton.toggleGroup = null;
        }

        this.syncFullWeek();
    }

    changeIncludeWeekendsMenuItem(config, existing) {
        const menu = this?.button?.menu;

        if (config && !existing) {
            return menu?.add(config);
        }

        return MenuItem.reconfigure(existing, config, /* owner = */menu);
    }

    updateIncludeWeekendsMenuItem() {
        this.syncFullWeek();
    }

    onBeforeFirstShowModeMenu({ menu }) {
        const
            me             = this,
            { calendar }   = me,
            { activeView } = calendar,
            modes          = Object.values(calendar.modes);

        let menuItem, mode;

        for (mode of modes) {
            menuItem = mode.$modeMenuItem;
            menuItem.hidden = mode.$modeSelectorItem.hidden;

            menu.add(menuItem);

            // We cannot set the check state until after adding to the menu or else we will fail to find the correct
            // rootElement and toggle group
            menuItem.checked = mode === activeView;

            // Wire up handler after setting "checked" (we don't want to be called as we set things up)
            menuItem.onToggle = 'up.onToggleMenuItem';
        }

        me.getConfig('includeWeekendsMenuItem');

        me.syncFullWeek();
        me.menuReady = true;
    }

    addMode(name, view, options) {
        const
            me       = this,
            {
                buttonBar,
                calendar
            }        = me,
            text     = (view[me.titleProperty] || view.displayName || view.type).replaceAll(' ', '\xa0'),
            keyChar  = view.activationKey || text.charAt(0),
            key      = keyChar.toLowerCase(),
            keyIndex = text.indexOf(keyChar) >= 0 ? text.indexOf(keyChar) : text.toLowerCase().indexOf(key),
            // We cannot add items to the menu at this time because the menu will not be assigned to a rootElement
            // as yet which is problematic for floated widgets. So, instead we create the MenuItem widgets and attach
            // them to their view and add them to the button's menu just before it is shown.
            //  NOPE - menuItem = me.button.menu.add(MenuItem.mergeConfigs({
            menuItem = view.$modeMenuItem = MenuItem.reconfigure(view.$modeMenuItem, MenuItem.mergeConfigs({
                type        : MenuItem,
                view, // Button carries a reference to the view it shows
                ref         : `${name}ShowMenuItem`,
                checked     : false,
                closeParent : true,
                toggleGroup : `${me.id}-modeSelectorMenuItem`,
                localizable : false,
                text        : [
                    { text },
                    { text : key.toUpperCase(), class : 'b-menu-item-key' }
                ],
                weight : 0
            }, options, view.selectorMenuItem)),
            button = view.$modeSelectorItem = menuItem.$overflowClone = buttonBar.add(Button.mergeConfigs({
                view, // Button carries a reference to the view it shows
                ref         : `${name}ShowButton`,
                toggleGroup : `${me.id}-modeSelectorButton`,
                text        : keyIndex < 0 ? [
                    text,
                    { text : key.toUpperCase(), class : 'b-button-key b-align-end' }
                ] : [
                    keyIndex ? text.substring(0, keyIndex) : null,
                    { text : keyChar, class : 'b-button-key' },
                    text.substring(keyIndex + 1)
                ],
                // Needs ariaLabel because the text is chopped up into multiple elements and this reads wrong
                ariaLabel      : text,
                localizable    : false,
                onBeforeToggle : 'up.onBeforeToggleButton',
                onToggle       : 'up.onToggleButton',
                weight         : 0
            }, options, view.selectorButton));

        view.$activateMode = e => calendar.setConfig({
            date : e.target.closest('[data-date]')?.dataset.date || calendar.date,
            mode : view
        });

        // The two have to keep the same visibility state in case apps change them.
        menuItem.ion(menuItemListeners);

        // In case they never get used (because the UI never becomes narrow)
        // Ensure we own them so they get destroyed.
        (me.ownedWidgets || (me.ownedWidgets = {}))[menuItem.id] = menuItem;

        // Add key binding to activate the view at the active date
        calendar.addKeyBinding(key, view.$activateMode);

        // Ensure apps are able to access the item from the Calendar's widgetMap
        calendar.addDescendant(menuItem);

        me.getConfig('includeWeekendsButton');

        view.ion({
            thisObj : me,

            localized() {
                const
                    text     = (view[me.titleProperty] || view.displayName || view.type).replaceAll(' ', '\xa0'),
                    keyChar  = (view.activationKey || text.charAt(0)),
                    keyIndex = text.indexOf(keyChar) !== -1 ? text.indexOf(keyChar) : text.toLowerCase().indexOf(keyChar.toLowerCase()),
                    newKey   = keyChar.toLowerCase();

                if (newKey !== key) {
                    calendar.removeKeyBinding(key, view.$activateMode);
                    calendar.addKeyBinding(newKey, view.$activateMode);
                }

                button.text = keyIndex < 0 ? [
                    { text },
                    { text : newKey.toUpperCase(), class : 'b-button-key' }
                ] : [
                    keyIndex ? { text : text.substring(0, keyIndex) } : null,
                    { text : keyChar, class : 'b-button-key' },
                    { text : text.substring(keyIndex + 1) }
                ];
                menuItem.text = [
                    { text },
                    { text : newKey.toUpperCase(), class : 'b-menu-item-key' }
                ];
            }
        });
    }

    onBeforeToggleButton({ pressed }) {
        // Effectively disable button toggling during animated card change
        if (pressed && this.calendar.viewContainer.layout.isChangingCard) {
            return false;
        }
    }

    onToggleButton({ source, pressed }) {
        if (pressed) {
            this.calendar.mode = source.view;
        }
    }

    updateDisabled(disabled, was) {
        super.updateDisabled(disabled, was);

        // When disabling, disable all buttons except the one that just got pressed - the focused one.
        this.buttonBar.items.forEach(button => {
            if (!disabled || !button.containsFocus) {
                button.disabled = disabled;
            }
        });
    }

    onToggleMenuItem({ source, checked }) {
        if (checked) {
            this.calendar.mode = source.view;
        }
    }

    onToggleWorkingDaysButton({ pressed }) {
        this.hideNonWorkingDays = !pressed;
    }

    onToggleWorkingDaysMenu({ checked }) {
        this.hideNonWorkingDays = !checked;
    }

    syncActiveMode(activeView) {
        const
            me = this,
            buttons = me.buttonBar.items;

        let item;

        // Only CalendarMixin has displayName, so fallback to configured title property or type if not present.
        // We may be hosting a Scheduler or other non-calendar view that does not have displayName.
        me.button.text = activeView[me.titleProperty] || activeView.displayName || activeView.type;
        me.includeWeekendsButton.hidden = !activeView.hasNonWorkingDays;
        me.syncFullWeek();

        // These loops would call onToggleButton/MenuItem if it weren't for Fencible
        for (item of buttons) {
            if (item.view) {
                item.pressed = item.view === activeView;
            }
        }

        if (me.menuReady) {
            for (item of me.button.menu.items) {
                if (item.view?.$modeMenuItem === item) { // if (a calendar mode item)
                    item.checked = item.view === activeView;
                }
            }
        }

        // Don't show the mode selector if there's only one view
        me[buttons.length > 1 ? 'show' : 'hide']();
    }

    syncFullWeek() {
        const
            {
                calendar,
                hideNonWorkingDays,
                _includeWeekendsButton   : includeWeekendsButton,
                _includeWeekendsMenuItem : includeWeekendsMenuItem
            } = this,
            fullWeek = !hideNonWorkingDays;

        if (!calendar.isConfiguring) {
            if (includeWeekendsButton) {
                includeWeekendsButton.pressed = fullWeek;
            }

            if (includeWeekendsMenuItem) {
                includeWeekendsMenuItem.checked = fullWeek;
            }
        }
    }

    changeButton(config, existing) {
        const button = Button.reconfigure(existing, ObjectHelper.assign({
            ariaDescription : this.L('switcherMenu')
        }, config), this);
        if (button && button !== config && button !== existing) {
            button._createdBy = this;
        }
        return button;
    }

    updateButton(button) {
        button && this.add(button);
    }

    changeButtonBar(config, existing) {
        const buttonBar = ButtonGroup.reconfigure(existing, config, this);
        if (buttonBar && buttonBar !== config && buttonBar !== existing) {
            buttonBar._createdBy = this;
        }
        return buttonBar;
    }

    updateButtonBar(buttonBar) {
        buttonBar && this.add(buttonBar);
    }

    changeCalendar(calendar) {
        if (calendar && !calendar.isWidget) {
            calendar = this.up(calendar);
        }

        return calendar;
    }

    updateCalendar(calendar) {
        this.detachListeners('cal');
        this.syncFullWeek();

        calendar?.ion({
            name                     : 'cal',
            changeHideNonWorkingDays : 'syncFullWeek',
            thisObj                  : this
        });
    }
}

// Register this feature type with its Factory
ModeSelector.initClass();
