import Widget from './Widget.js';
import Badge from './mixin/Badge.js';
import Rotatable from './mixin/Rotatable.js';
import DomClassList from '../helper/util/DomClassList.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import GlobalEvents from '../GlobalEvents.js';

DomHelper.loadStylesheet('Core/widget/Button.css');

// import Stylesheet from './Button.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Button');

// <remove-on-release>
// TODO: should togglebutton be own class implemented as input type=checkbox?
// TODO: A toggling widget's focusElement should be an opacity:0 input type=checkbox which covers the clickable area.
// </remove-on-release>

/**
 * @module Core/widget/Button
 */

const
    bIcon             = /(?:^|\s)b-icon-/,
    fa                = /(?:^|\s)fa-/,
    // Font Awesome Pro/v6 style prefixes that should NOT have the base 'fa' class added
    faStylePrefix     = /(?:^|\s)fa-(?:sharp-)?(?:solid|regular|light|thin|duotone|brands)(?:\s|$)/,
    fullConfigKeys    = ['items', 'type', 'widgets', 'html', 'listeners'],
    // Configs of a menu instance's initialConfig which must not be carried over to its overflow twin menu
    menuTwinOmitKeys  = ObjectHelper.createTruthyKeys([
        'id', 'internalListeners', 'parent', 'owner', 'forElement',
        'items', 'lazyItems', 'autoShow', 'adopt', 'appendTo', 'renderTo'
    ]),
    menuListenersName = Symbol('defaultListener'),
    autoRendition     = Symbol('autoRendition'),
    MOUSEOUT_TIME     = 300; // ms

/**
 * Button widget, wraps and styles a regular <code>&lt;button&gt;</code> element. Can display text and icon and also
 * allows specifying button {@link #config-color}. Supports different appearances, by setting {@link #config-rendition}
 * to one of:
 *
 * * 'text' - Flat appearance with text only, no background or border
 * * 'outlined' - Transparent button with border
 * * 'tonal' - Flat appearance with "soft" background color
 * * 'filled' - Flat appearance with stronger background color
 * * 'elevated' - Raised appearance
 *
 * {@inlineexample Core/widget/ButtonDefault.js three-columns}
 *
 * ```javascript
 * // Green button with text and icon
 * const button = new Button({
 *     appendTo : document.body,
 *     icon    : 'fa fa-plus-circle',
 *     text    : 'Add',
 *     color   : 'b-green',
 *     onClick : () => {}
 * });
 * ```
 *
 * ## Button with menu
 *
 * Buttons can also have a menu that is shown on click, or on click or hover of only the menu icon part of the button
 * (if {@link #config-split} is set):
 *
 * {@inlineexample Core/widget/ButtonWithMenu.js three-columns}
 *
 * ```javascript
 * const button = new Button({
 *     appendTo : document.body,
 *     icon    : 'fa fa-chart',
 *     menu    : {
 *         items : [
 *             {
 *                 text : 'Click me',
 *                 onItem : () => console.log('I was clicked')
 *             }
 *         ]
 *     }
 * });
 * ```
 *
 * ## Click handling in a complex widget
 *
 * In the case of a button which is part of a complex UI within a larger Bryntum widget, use
 * of the string form for handlers is advised. A handler which starts with `'up.'` will
 * be resolved by looking in owning widgets of the Button. For example a Calendar may
 * have handlers for its buttons configured in:
 *
 * ```javascript
 * new Calendar({
 *     appendTo : document.body,
 *     project  : myProjectConfig,
 *     sidebar  : {
 *         items : {
 *             addNew : {
 *                 weight  : 0,
 *                 text    : 'New',
 *
 *                 // The Button's ownership will be traversed to find this function name.
 *                 // It will be called on the outermost Calendar widget.
 *                 onClick : 'up.onAddNewClick'
 *             }
 *         }
 *     },
 *
 *     // Button handler found here
 *     onAddNewClick() {
 *         // Use Calendar API which creates event in the currently active date
 *         this.createEvent();
 *     }
 * });
 * ```
 *
 * This class may be operated by the keyboard. <kbd>Space</kbd> presses the button and invokes any
 * click handler, and <kbd>ArrowDown</kbd> activates any configured {@link #config-menu}.
 *
 * @extends Core/widget/Widget
 * @mixes Core/widget/mixin/Badge
 * @classtype button
 * @widget
 */
export default class Button extends Widget.mixin(Badge, Rotatable) {
    //region Config

    static $name = 'Button';

    static type = 'button';

    static configurable = {
        cssVarPrefix : 'b-button',

        /**
         * Button icon class, a developer-defined CSS class string which results in the desired icon.
         *
         * Note that demos use [Font Awesome](https://fontawesome.com/cheatsheet) icons, but no icons are actually
         * built in.
         *
         * This may also be configured as the URL of an image (Detected by searching for a `/` in the string).
         * @prp {String}
         */
        icon : null,

        /**
         * The menu icon class to show when the button has a menu. Set to `null` to not show a menu icon.
         *
         * Note that demos use [Font Awesome](https://fontawesome.com/cheatsheet) icons, but no icons are actually
         * built in.
         *
         * @prp {String}
         * @default
         */
        menuIcon : 'b-icon-picker',

        /**
         * Icon class for the buttons pressed state, a developer-defined CSS class string which results in the
         * desired icon. Only applies to toggle buttons
         *
         * Note that demos use [Font Awesome](https://fontawesome.com/cheatsheet) icons, but no icons are actually
         * built in.
         *
         * ```
         * new Button({
         *    // Icon for unpressed button
         *    icon        : 'fa fa-wine-glass',
         *
         *    // Icon for pressed button
         *    pressedIcon : 'fa fa-wine-glass-alt',
         *
         *    // Only applies to toggle buttons
         *    toggleable  : true
         * });
         * ```
         *
         * @prp {String}
         */
        pressedIcon : null,

        /**
         * A CSS class to add to the pressed state of the button. A `b-pressed` CSS class is always added,
         * when a button is pressed.
         * @prp {String}
         * @default
         */
        pressedCls : null,

        /**
         * Button icon alignment. May be `'start'` or `'end'`. Defaults to `'start'`
         * @prp {'start'|'end'}
         * @default
         */
        iconAlign : 'start',

        /**
         * The button behavioral type, applied as a `type` attribute to the widget's element only when it renders as a
         * `<button>`. When the widget renders as an `<a>` element (i.e. when {@link #config-href} is set), this
         * attribute is not emitted.
         * @prp {'button'|'submit'|'reset'}
         * @default
         */
        behaviorType : 'button',

        /**
         * The button's text. You can also supply a {@link DomConfig} or an array of DomConfigs for complex button
         * content.
         * @prp {String|DomConfig|DomConfig[]}
         */
        text : {
            value   : null,
            $config : null,
            default : ''
        },

        /**
         * Enabled toggling of the button (stays pressed when pressed).
         * @prp {Boolean}
         * @default false
         */
        toggleable : undefined,

        /**
         * Initially pressed or not. Only applies with `toggleable = true`.
         *
         * ```javascript
         * const toggleButton = new Button({
         *    toggleable : true,
         *    text : 'Enable cool action'
         * });
         * ```
         * @prp {Boolean}
         * @default false
         */
        pressed : null,

        /**
         * Indicates that this button is part of a group where only one button can be pressed. Assigning a value
         * also sets `toggleable` to `true`.
         *
         * When part of a {@link Core.widget.ButtonGroup}, you can set {@link Core.widget.ButtonGroup#config-toggleGroup}
         * on it as an alternative to on each button. This config can then be used to override that value if needed.
         *
         * ```javascript
         * const yesButton = new Button({
         *    toggleGroup : 'yesno',
         *    text        : 'Yes'
         * });
         *
         * const noButton = new Button({
         *    toggleGroup : 'yesno',
         *    text        : 'No'
         * });
         * ```
         * @prp {String}
         */
        toggleGroup : null,

        /**
         * An arbitrary value associated with this button. For example, a {@link Core.widget.ButtonGroup} composes
         * its own {@link Core.widget.ButtonGroup#property-value} from the values of its pressed buttons.
         * @prp {String} value
         * @category Common
         */

        /**
         * Set to `true` to perform action on clicking the button if it's already pressed
         * and belongs to a {@link #config-toggleGroup}.
         * @config {Boolean}
         * @default
         */
        supportsPressedClick : false,

        supportsUnpressing : false,

        ripple : true,

        // Both a MenuItem twin and a same-type twin fire `action`, so that single pair covers every twin type
        twinForwardEvents : {
            action : 'action'
        },

        // Button has to calculate its twinSyncCOnfigs at runtime, so must not be set
        twinSyncConfigs : null,

        localizableProperties : ['text'],

        /**
         * Returns the instantiated menu widget as configured by {@link #config-menu}.
         * @member {Core.widget.Widget} menu
         */
        /**
         * A submenu configuration object, or an array of MenuItem configuration objects from which to create a
         * submenu which is shown when this button is pressed.
         *
         * Note that this does not have to be a Menu. The `type` config can be used to specify any widget as the
         * submenu.
         *
         * May also be specified as a fully instantiated {@link Core.widget.Widget#config-floating floating Widget}
         * such as a {@link Core/widget/Popup}.
         * @config {Object<String,MenuItemEntry|ContainerItemConfig>|Array<MenuItemEntry|ContainerItemConfig>|MenuConfig|PopupConfig}
         */
        menu : {
            $config : ['lazy', 'nullify'],
            value   : null
        },

        menuDefaults : {
            type         : 'menu',
            autoShow     : false,
            autoClose    : true,
            floating     : true,
            scrollAction : 'realign',
            align        : {
                align     : 't0-b0',
                allowFlip : true // Menu should flip to t100-b100 if it overflows horizontally
            }
        },

        /**
         * If provided, turns the button into a link.
         * <div class="warning">
         * Not compatible with the {@link Core.widget.Widget#config-adopt} config.
         * </div>
         * @prp {String}
         */
        href : null,

        /**
         * The `target` attribute for the {@link #config-href} config
         * @prp {String}
         */
        target : null,

        /**
         * The tab index of the button, or `null` for natural tab order (recommended). Setting to `0` is equivalent
         * to natural tab order, but is unnecessary for buttons since they are naturally tabbable (i.e., accessible
         * via the TAB key). Setting to `-1` disables tabbability but allows for focus to be set to the element
         * programmatically.
         *
         * From [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex):
         *
         * **Warning**: You are recommended to only use `0` and `-1` as tabindex values. Avoid using tabindex values
         * greater than 0 and CSS properties that can change the order of focusable HTML elements ([Ordering flex
         * items](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Ordering_flex_items)).
         * Doing so makes it difficult for people who rely on using keyboard for navigation or assistive technology
         * to navigate and operate page content. Instead, write the document with the elements in a logical sequence.
         *
         * @prp {Number} tabIndex
         */
        tabIndex : null,

        // Our own setValues/getValues system should not set/get HTML content
        defaultBindProperty : null,

        /**
         * Set to `true` to create a split button. A split button has a main action and a dropdown arrow to show a menu.
         *
         * The menu only shows when the arrow is clicked, not when the main button is clicked.
         *
         * Set to `'mouseover'` to show the menu when *hovering* the arrow part of the button
         * as well as when toggling by clicking it.
         *
         * Set to `'hover'` to show the menu only when *hovering* the arrow part of the button -
         * the menu will hide when the mouse leaves the icon to outside of the icon or menu.
         *
         * The button will only toggle its {@link #property-pressed} state and action its `click` handler when the main
         * part of the button is clicked.
         * @prp {Boolean|'mouseover'|'hover'} split
         * @default false
         */
        split : null,

        keyMap : {
            ArrowDown : 'onArrowDown'
        },

        role : '',

        /**
         * Predefined style to use for the button. Possible values are:
         * * `'elevated'` - Raised button with box-shadow
         * * `'filled'` - Filled with the primary color
         * * `'tonal'` - Filled with a faded shade of the primary color
         * * `'outlined'` - Outlined with borders and pale or transparent fill
         * * `'text'` - Transparent text-only button
         *
         * The supplied value will be part of the button's class list, as `b-button-{rendition}`.
         *
         * If no value is provided, a default rendition will be determined based on the theme.
         *
         * @prp {'elevated'|'filled'|'tonal'|'outlined'|'text'|String} rendition
         */
        rendition : autoRendition,

        defaultCls : {
            'b-visible-scrollbar' : 0,
            'b-overlay-scrollbar' : 0
        }
    };

    construct(...args) {
        super.construct(...args);

        this.ion({ hide : 'onInternalHide' });
    }

    // An overflowing button converts to a MenuItem unless overflowTwinConfig specifies another type.
    // MenuItem-specific twin wiring (onItem/checked/`item` event) only applies when the effective twin type is a
    // MenuItem class (see Widget#overflowTwinIsMenuItem). Any other twin type (the button's own type, or another
    // Button type) uses button wiring (onAction/pressed/`action` event).
    get overflowTwinBaseType() {
        return 'menuitem';
    }

    // Twin MenuItem must not have a checked property unless we are toggleable
    // Twin MenuItem must have onItem which must be whichever exists of our onAction or onClick.
    // When the twin is not a MenuItem (see overflowTwinIsMenuItem), sync our own configs instead.
    get twinSyncConfigs() {
        const
            { overflowTwinIsMenuItem } = this,
            result                     = overflowTwinIsMenuItem ? {
                onAction : 'onItem',
                onClick  : 'onItem'
            } : {
                onAction : 'onAction',
                onClick  : 'onClick'
            };

        if (this.toggleable && !this.hasConfig('menu')) {
            result.pressed = overflowTwinIsMenuItem ? 'checked' : 'pressed';
        }

        return result;
    }

    updateElement(element, oldElement) {
        const
            me                = this,
            { constructor }   = me,
            result            = super.updateElement(element, oldElement),
            menu              = me.peekConfig('menu'),
            role              = menu ? (menu.isWidget
                ? menu.role
                : (constructor.resolveType(menu.type)?.configurable?.role ||
                   constructor.configurable.menuDefaults?.type || 'menu')
            ) : false;

        me.ariaHasPopup = role;

        return result;
    }

    updateRendition(rendition, oldRendition) {
        if (rendition === autoRendition && !this.themeRenditionDetacher) {
            this.themeRenditionDetacher = GlobalEvents.ion({
                theme   : 'onThemeRenditionChange',
                thisObj : this
            });
        }
    }

    // Global `theme` event handler, recomposes to apply the theme's rendition
    onThemeRenditionChange({ mode }) {
        // A light/dark switch does not change the theme's button rendition
        if (!mode) {
            this.recompose();
        }
    }

    compose() {
        const
            me               = this,
            {
                href, icon, iconAlign, pressed, pressedIcon, target, text, toggleable, toggleGroup, menuIcon,
                behaviorType, pressedCls, split
            }                = me,
            hasMenu          = me.hasConfig('menu'),
            iconCls          = (pressed && pressedIcon) ? pressedIcon : icon,
            hasCustomContent = typeof text === 'object';

        me._menuIconMouseOver = false;

        let { rendition, tabIndex } = me;

        if (rendition === autoRendition) {
            rendition = DomHelper.getThemeInfo(me.rootElementEarly)?.buttonRendition;
        }

        // Accessibility: Buttons are not part of the tabbing order in Safari unless tabIndex is set.
        if (tabIndex == null && !href && BrowserHelper.isSafari) {
            tabIndex = 0;
        }

        return {
            tag   : href ? 'a' : 'button',
            href,
            target,
            tabIndex,
            type  : href ? undefined : behaviorType,
            class : {
                [`b-button-${rendition}`]     : rendition, // Tabs use no rendition
                [`b-icon-align-${iconAlign}`] : icon,
                'b-pressed'                   : pressed && toggleable,
                'b-text'                      : Boolean(text),
                'b-has-menu'                  : hasMenu,
                'b-has-menu-icon'             : hasMenu && menuIcon,
                'b-split-button'              : split,
                ...(pressed && pressedCls ? Object.fromEntries(pressedCls.split(' ').map(cls => [cls, 1])) : {})
            },

            [toggleable && !hasMenu ? 'aria-pressed' : ''] : Boolean(pressed),

            dataset : {
                group : toggleGroup
            },

            // eslint-disable-next-line bryntum/no-listeners-in-lib
            listeners : {
                click     : 'onInternalClick',
                mousedown : 'onInternalMousedown'
            },

            children : {
                // Presence of a slash indicates an image URL
                iconElement : icon?.includes('/') ? {
                    // This element is a purely visual cue with no meaning to the A11Y tree
                    'aria-hidden' : true,
                    src           : icon,
                    tag           : 'img',
                    alt           : hasCustomContent ? null : text,
                    class         : {
                        'b-button-icon'  : 1,
                        'b-button-image' : 1
                    }
                } : (icon || pressedIcon) && {
                    // This element is a purely visual cue with no meaning to the A11Y tree
                    'aria-hidden' : true,
                    tag           : 'i',
                    class         : {
                        ...DomClassList.normalize(iconCls, 'object'),
                        'b-button-icon' : 1,
                        'b-icon'        : bIcon.test(iconCls),
                        fa              : fa.test(iconCls) && !faStylePrefix.test(iconCls)
                    }
                },
                label : text && {
                    tag                                      : 'span',
                    [hasCustomContent ? 'children' : 'text'] : hasCustomContent ? ArrayHelper.asArray(text) :  text,
                    class                                    : {
                        'b-button-label'          : 1,
                        'b-button-custom-content' : hasCustomContent
                    }
                },
                menuIconElement : (hasMenu && menuIcon) && {
                    tag   : 'i',
                    class : {
                        'b-icon'             : bIcon.test(menuIcon),
                        fa                   : fa.test(menuIcon) && !faStylePrefix.test(menuIcon),
                        'b-button-menu-icon' : 1,
                        [menuIcon]           : 1
                    },
                    // eslint-disable-next-line bryntum/no-listeners-in-lib
                    listeners : split === 'mouseover' || split === 'hover' ? {
                        mouseover : 'onMenuIconMouseOver',
                        mouseout  : 'onMenuIconMouseOut'
                    } : {}
                }
            }
        };
    }

    //endregion

    onInternalHide() {
        // Stop a menu from being visually orphaned if this button is hidden while its menu is visible
        this._menu?.hide();
    }

    get childItems() {
        return this._menu && [this.menu];
    }

    onFocusOut(e) {
        super.onFocusOut(e);

        // Use the _property name because menu is lazy and we do not want to call it into existence.
        this._menu?.hide();
    }

    //region Getters/Setters

    get focusElement() {
        return this.element;
    }

    changeText(text) {
        return (text == null) ? '' : text;
    }

    changeToggleable(toggleable) {
        if (toggleable === undefined) {
            toggleable = Boolean(this.toggleGroup || this.config.menu);
        }

        return toggleable;
    }

    changeMenu(menu, oldMenu) {
        const
            me = this,
            {
                element : forElement,
                ariaElement
            } = me;

        if (menu) {
            if (menu.isWidget) {
                menu.forElement = forElement;
                menu.owner = me;
                menu.constrainTo = me.floatRoot; // Not rootElement, since floatRoot in a web component can be larger
            }
            else {
                // This covers both Array and Object which are valid items config formats.
                // menu could be { itemRef : { text : 'sub item 1 } }. But if it has
                // child items or html property in it, it's the main config
                if (typeof menu === 'object' && !fullConfigKeys.some(key => key in menu)) {
                    menu = {
                        lazyItems : menu
                    };
                }

                menu = Widget.reconfigure(oldMenu, menu ? ObjectHelper.merge({
                    owner       : me,
                    constrainTo : me.floatRoot,
                    forElement
                }, me.menuDefaults, menu) : null, me);
            }

            // Menu will shrink and fit inside a 10px inset of viewport.
            // Rectangle.alignTo prioritizes alignment if the target edge is closer to
            // the constrainTo edge than this in order to produce visually correct results.
            menu.align.constrainPadding = 10;

            // Because the menu is a separate floating element, we need to set the aria-owns attribute
            // on the button's ARIA element to create the correct accessibility relationship.
            ariaElement.setAttribute('aria-owns', DomHelper.getId(menu.ariaElement));

            me.detachListeners(menuListenersName);

            // https://github.com/bryntum/bryntum/issues/6014
            // Before assigning new portions of listeners, make sure they don't exist already. Menu can be replaced by
            // another instance or a configuration object.
            menu.ion({
                name       : menuListenersName,
                beforeShow : 'onMenuBeforeShow',
                hide       : 'onMenuHide',
                show       : 'onMenuShow',
                thisObj    : this
            });
        }
        else {
            oldMenu?.destroy();
            ariaElement.removeAttribute('aria-owns');
        }

        return menu;
    }

    onMenuBeforeShow({ source }) {
        /**
         * This event is triggered when the button's menu is about to be shown.
         * @event beforeShowMenu
         * @preventable
         * @param {Core.widget.Button} source This Button instance.
         * @param {Core.widget.Menu} menu This button's menu instance.
         * @param {Boolean} userAction `true` if the toggle was triggered by a user action (click), `false` if it was
         * triggered programmatically.
         * @param {Event} domEvent The original DOM event that triggered the action, if any.
         * Using the `pointerType` property of this event can help determine if it was a mouse, touch or pen action.
         */
        return this.trigger('beforeShowMenu', {
            userAction : Boolean(this.triggeredByEvent),
            domEvent   : this.triggeredByEvent,
            menu       : source
        });
    }

    onMenuShow() {
        this.ariaElement.setAttribute('aria-expanded', true);
        this.addCls('b-menu-visible');
    }

    onMenuHide() {
        this.ariaElement.setAttribute('aria-expanded', false);
        this.removeCls('b-menu-visible');
        // We must react to its state change to hidden by becoming unpressed.
        // If we just hid it in the toggle method, this will be a no-op.
        this.toggle(false);
    }

    updateMenu(menu) {
        // We are toggleable if there's a menu.
        // Pressed means menu visible, not pressed means menu hidden.
        this.toggleable = Boolean(menu);
    }

    updateToggleGroup(toggleGroup) {
        if (toggleGroup && this.pressed == null) {
            this.pressed = false;
        }
    }

    updatePressed(pressed) {
        const me = this;

        if (!me.toggleable) {
            me.toggleable = true;
        }

        if (me.isConfiguring) {
            return;
        }

        if (pressed) {
            DomHelper.forEachSelector(me.rootElement, `button[data-group=${me.toggleGroup}]`, btnEl => {
                if (btnEl !== me.element) {
                    Widget.getById(btnEl.id).pressed = false;
                }
            });
        }

        // If we're split, we must not activate the menu on press - it must hide if shown.
        // Split icon press is handled in onInternalClick.
        me.toggleMenu(me.split ? false : pressed);

        /**
         * Fires when the button is toggled via a UI interaction (the {@link #property-pressed} state is changed). If the button is part of a
         * {@link #config-toggleGroup} and you need to process the pressed button only, consider using
         * {@link #event-click} event or {@link #event-action} event.
         * @event toggle
         * @param {Core.widget.Button} source Toggled button
         * @param {Boolean} pressed New pressed state
         * @param {Boolean} userAction `true` if the toggle was triggered by a user action (click), `false` if it was
         * triggered programmatically.
         * @param {Event} domEvent The original DOM event that triggered the action, if any.
         * Using the `pointerType` property of this event can help determine if it was a mouse, touch or pen action.
         */
        me.trigger('toggle', { pressed, domEvent : me.triggeredByEvent, userAction : Boolean(me.triggeredByEvent) });
    }

    //endregion

    configureOverflowTwin(overrides) {
        const
            me       = this,
            config   = super.configureOverflowTwin(overrides),
            { menu } = me;

        // By default a button is cloned as a MenuItem in the overflow menu. A button may keep its own type (and
        // thus its compose() and styling) or use another type via a `type` in overflowTwinConfig. The conversion
        // and the MenuItem-specific enrichment below only apply when the twin actually is a MenuItem.
        // https://github.com/bryntum/bryntum/issues/11786
        if (me.overflowTwinIsMenuItem) {
            config.type = Widget.resolveType('menuitem');

            // A menu button gets a twin menu. Being toggleable isn't a checked state for a menu button
            if (menu) {
                me.configureOverflowTwinMenu(config);
            }
            else if (me.toggleable) {
                config.checked = me.pressed;
            }

            // Icon-only buttons are not useful in a menu.
            // Use text, or any tooltip text as the button text.
            if (!config.text) {
                config.text = me.text || me.tooltipText;
            }
        }
        // A twin of the button's own type would take over a menu *instance* held by the cloned initialConfig
        else if (config.menu?.isWidget) {
            me.configureOverflowTwinMenu(config);
        }

        return config;
    }

    // Configures the menu of this button's overflow twin, which is of the same class as this button's menu, be it a
    // Menu (subclass), a Popup or any other floating widget. Its items are the overflow twins of the menu's items.
    configureOverflowTwinMenu(config) {
        const
            me       = this,
            { menu } = me;

        let menuConfig = config.menu,
            listeners;

        // The cloned initialConfig holds a menu *instance* by reference. Never merge into that live widget;
        // the twin gets its own menu built from the instance's initialConfig
        if (menuConfig?.isWidget) {
            menuConfig = ObjectHelper.copyPropertiesExcept({}, menu.initialConfig, menuTwinOmitKeys);

            // Configured listeners are stripped from initialConfig, so copy them over. Drop the default
            // thisObj (the original menu) so the twin binds them to itself
            if (menu._listeners) {
                listeners = ArrayHelper.asArray(menu._listeners).map(({ ...listenerBlock }) => {
                    if (listenerBlock.thisObj === menu) {
                        delete listenerBlock.thisObj;
                    }

                    return listenerBlock;
                });
            }
        }

        config.menu = me.constructor.mergeConfigs(menuConfig, {
            type  : menu.constructor,
            items : menu.items.map(item => {
                // A MenuItem only works in a Menu, so items of a twin which is not a Menu keep their own type
                item.overflowTwinOutsideMenu = !menu.isMenu;

                return item.ensureOverflowTwin();
            })
        });

        // Applied after merging, since mergeConfigs deep clones, which would clone a plain object thisObj
        if (listeners) {
            config.menu.listeners = listeners;
        }
    }

    //region Events

    onInternalMousedown(event) {
        // Do not allow focus to hide the menu if it's focused - the impending click must do that.
        // Use the _property name because menu is lazy and we do not want to call it into existence.
        // Also, on Safari, buttons are *not* focused on mousedown, so we have to prevent the default
        // of blurring the current active element. See https://bugs.webkit.org/show_bug.cgi?id=22261#c68
        if (BrowserHelper.isSafari || (this._menu?.containsFocus && this.pressed)) {
            event.preventDefault();
        }
    }

    changeTooltip(tooltip, oldTooltip) {
        const
            me            = this,
            stringTooltip = tooltip?.html || tooltip;

        // Automatically set `aria-label` for icon-only buttons without an own `ariaLabel` defined
        if (!me.ariaLabel && !me.text && typeof stringTooltip === 'string') {
            me.ariaLabel = me.optionalL(stringTooltip, me);
        }
        return super.changeTooltip(tooltip, oldTooltip);
    }

    onArrowDown(domEvent) {
        if (this.menu) {
            this.triggeredByEvent = domEvent;
            this.toggleMenu(true);
            this.triggeredByEvent = null;
        }
        else {
            return false;
        }
    }

    onMenuIconMouseOver() {
        this._menuIconMouseOver = true;
        this.toggleMenu(true);
    }

    onMenuIconMouseOut() {
        const me = this;

        me._menuIconMouseOver = false;

        // The value "hover" means *only* when the mouse is hovering over the icon, or
        // when the menu is open and the mouse is over it.
        if (me.split === 'hover') {
            // Delay hiding the menu to allow moving back into icon or the menu without it disappearing
            me.setTimeout(() => {
                if (!me.menu?.element.matches(':hover') && !me._menuIconMouseOver) {
                    me.toggleMenu(false);
                }
            }, MOUSEOUT_TIME);
        }
    }

    /**
     * Triggers events when user clicks button
     * @fires click
     * @fires action
     * @internal
     */
    onInternalClick(event) {
        const
            me           = this,
            bryntumEvent = { event, domEvent : event }; // 'event' is the legacy property, kept for backward compatibility; 'domEvent' is the new property.

        // Safari && FF trigger click on disabled button, Chrome does not. Handling it here
        if (me.disabled) {
            return;
        }

        if (me.split && event.target.closest('.b-button-menu-icon')) {
            me.toggleMenu(!me._menu?.isVisible);
            return;
        }

        me.triggeredByEvent = event;

        if (me.toggleable) {
            // Clicking the pressed button in a toggle group should do nothing (unles allowed w/ supportsUnpressing)
            const skipToggle = me.toggleGroup && me.pressed && !me.supportsUnpressing;

            if (skipToggle && !me.supportsPressedClick) {
                return;
            }

            if (!skipToggle) {
                me.toggle(!me.pressed);
            }

            // Edge case in dragfromgrid demo, where toggling mode destroys the Scheduler and thus destroys the toolbar
            // and the button in it
            if (me.isDestroyed) {
                return;
            }
        }

        /**
         * Fires when the button is clicked
         * @event click
         * @param {Core.widget.Button} source The button
         * @param {Event} event DEPRECATED - Use domEvent instead.
         * @param {Event} domEvent The triggering DOM event.
         * Using the `pointerType` property of this event can help determine if it was a mouse, touch or pen action.
         */
        me.trigger('click', bryntumEvent);

        /**
         * Fires when the default action is performed (the button is clicked)
         * @event action
         * @param {Core.widget.Button} source The button
         * @param {Event} event DEPRECATED - Use domEvent instead.
         * @param {Event} domEvent The triggering DOM event.
         * Using the `pointerType` property of this event can help determine if it was a mouse, touch or pen action.
         */
        // A handler may have resulted in destruction.
        if (!me.isDestroyed) {
            me.trigger('action', bryntumEvent);
        }

        // since Widget has Events mixed in configured with 'callOnFunctions' this will also call onClick and onAction

        if (!me.href) {
            // stop the event since it has been handled
            event.preventDefault();
            event.stopPropagation();
        }

        me.triggeredByEvent = null;
    }

    //endregion

    //region Misc

    /**
     * Toggle button state (only use with toggleable = true)
     * @param {Boolean} pressed Specify to force a certain toggle state
     * @fires toggle
     */
    toggle(pressed = !this.pressed) {
        /**
         * Fires before the button is toggled (the {@link #property-pressed} state is changed). If the button is part of
         * a {@link #config-toggleGroup} and you need to process the pressed button only, consider using
         * {@link #event-click} event or {@link #event-action} event.
         * Return `false` to prevent the toggle to the new pressed state.
         * @event beforeToggle
         * @param {Core.widget.Button} source Toggled button
         * @param {Boolean} pressed New pressed state
         * @param {Boolean} userAction `true` if the toggle was triggered by a user action (click), `false` if it was
         * triggered programmatically.
         * @param {Event} domEvent The original DOM event that triggered the action, if any.
         * Using the `pointerType` property of this event can help determine if it was a mouse, touch or pen action.
         * @preventable
         */
        if (this.trigger('beforeToggle', { pressed, domEvent : this.triggeredByEvent, userAction : Boolean(this.triggeredByEvent) }) !== false) {
            this.pressed = pressed;
        }
    }

    toggleMenu(visible) {
        if (visible) {
            const
                {
                    menu,
                    triggeredByEvent
                } = this;

            if (menu) {
                menu.owner = this;
                menu.forElement = this.element;

                if (!('minWidth' in menu.initialConfig)) {
                    menu.minWidth = this.width;
                }

                // The presence of a number indicates to the align constraining algorithm
                // that it is *willing* to shrink in that dimension. It will never end up this small.
                // Use the properties because the getter will return 0 if not set.
                menu.align.minHeight = menu._minHeight ?? 100;
                menu.align.minWidth  = menu._minWidth ?? 100;
                menu.show();
                if (triggeredByEvent && !triggeredByEvent.pointerType) {
                    menu.focus();
                }
            }
        }
        else {
            this._menu?.hide();
        }
    }

    //endregion
}

// Register this widget type with its Factory
Button.initClass();

export { autoRendition };
