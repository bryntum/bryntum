import Widget from './Widget.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Layout from './layout/Layout.js';
import DomHelper from '../helper/DomHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import './util/Ripple.js';
import Bag from '../util/Bag.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import GlobalEvents from '../GlobalEvents.js';

// This is technically needed by Widget but since Mask extends Widget, it cannot be imported from Widget
import './Mask.js';

DomHelper.loadStylesheet('Core/widget/Container.css');

// import Stylesheet from './Container.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Container');

/**
 * @module Core/widget/Container
 */

const
    { isArray }         = Array,
    returnWeight        = i => i.weight,
    isNotHidden         = w => w && !w.hidden,
    isFocusable         = w => w.isFocusable,
    stylesToCheck       = ['display', 'flex-direction'],
    boxLayouts          = {
        default : 1,
        box     : 1
    },
    optionsProp         = Symbol('options'),
    extractNameAndValue = (acc, [key, { value }]) => {
        acc[key] = value;
        return acc;
    },
    recordEquals = function(was, newRecord) {
        const
            isModel = newRecord?.isModel,
            // If it is a different record, *or* the record has changed, return false
            result  = newRecord === was && (!isModel || (newRecord.generation === this.lastRecordGeneration));

        this.lastRecordGeneration = isModel ? newRecord?.generation : NaN;
        return result;
    };

/**
 * A Widget that can contain other widgets. Uses a CSS Grid layout by default, either use CSS or see the
 * {@link #config-layout} config to apply another layout.
 *
 * {@inlineexample Core/widget/Container.js one-column}
 *
 * ```javascript
 * // Create a container with two widgets
 * const container = new Container({
 *     items : {
 *         name  : { type : 'textfield', label : 'Name' },
 *         score : { type : 'numberfield', label : 'Score' }
 *     }
 * });
 * ```
 *
 * ## Label position & input field alignment
 *
 * Fields support placing labels either before or above them. This can be set for all fields in a container at once by
 * specifying the {@link #config-labelPosition} config. It supports 3 settings:
 *
 * * `'above'`        - Labels are placed above the field. For text fields in the Material3 theme, this means ~ on the
 *                      fields top border.
 * * `'before'`       - Labels are placed before the field.
 * * `'align-before'` - Labels are placed before the field and the fields are arranged in a two column layout (used in
 *                      the live demo above).
 *
 * {@note}`align-before` setting cannot be used in conjunction with specifying a Container `layout`.{/@note}
 *
 * When using `'align-before'`, the container uses `display: grid` to lay out the fields. You can override this by
 * specifying a different `grid-template-columns` value in your CSS. To get two equal width columns, use:
 *
 * ```css
 * .b-container.b-columns {
 *     grid-template-columns: 1fr 1fr;
 * }
 * ```
 *
 * If you want input elements aligned to the right / end side of your container, enable
 * {@link #config-inputFieldAlign} as seen in the demo below.
 *
 * {@inlineexample Core/widget/ContainerAlignment.js one-column}
 *
 * ## Adding and removing child widgets
 *
 * Containers can have child widgets added, or removed during their lifecycle to accommodate business needs. For
 * example:
 *
 * ```javascript
 *  // Insert a child widget before another field
 *  myContainer.insert(textField, someField)
 *
 *  // Remove a child widget
 *  myContainer.remove(checkboxField);
 * ```
 *
 * {@inlineexample Core/widget/ContainerAddRemove.js vertical}
 *
 *
 * {@note}If you are looking for a more powerful container that can have toolbars, a title bar, and more see
 * {@link Core.widget.Panel}.{/@note}
 *
 * @extends Core/widget/Widget
 * @classtype container
 * @widget
 */
export default class Container extends Widget {

    static $name = 'Container';

    static type = 'container';

    static configurable = {
        /**
         * An object containing typed child widget config objects or Widgets. May also be specified
         * as an array.
         *
         * If configured as an Object, the property names are used as the child component's
         * {@link Core.widget.Widget#config-ref} name, and the value is the child component's config object.
         *
         * ```javascript
         *  class MyContainer extends Container {
         *      static configurable = {
         *          items : {
         *              details : {
         *                  type : 'panel',
         *                  ....
         *              },
         *              button : {
         *                  type : 'button',
         *                  text : 'Save'
         *              }
         *          }
         *      }
         *  }
         *
         *  new MyContainer({
         *      title    : 'Test Container',
         *      floating : true,
         *      centered : true,
         *      width    : 600,
         *      height   : 400,
         *      layout   : 'fit',
         *      items    : {
         *          button : {
         *              disabled : true
         *          },
         *          details : {
         *              title : 'More coolness',
         *              html  : 'Details content'
         *          }
         *      }
         *  }).show();
         * ```
         *
         * The order of the child widgets is determined by the order they are defined in `items`, but can also be
         * affected by configuring a {@link Core.widget.Widget#config-weight} on one or more widgets.
         *
         * To remove existing items, set corresponding keys to `null`.
         *
         * If you want to customize child items of an existing class, you can do this using the child widget
         * 'ref' identifier (useful for reconfiguring Event Editor in Scheduler / Gantt):
         *
         * ```javascript
         *  new MyCustomTabPanel({
         *      items    : {
         *          // Reconfigure tabs
         *          firstTab : {
         *              title : 'My custom title'
         *          },
         *          secretTab : null // hide this tab
         *      }
         *  }).show();
         * ```
         *
         * {@note} Note that conversion between array and object notation is not supported, if you want to override
         * items in a container that uses object notation, you must use the same notation. This applies for example
         * to when customizing items in the event and task editors in Scheduler and the task editor in
         * Gantt.{/@note}
         *
         * @config {Object<String,ContainerItemConfig|MenuItemEntry|Boolean|null>|Array<ContainerItemConfig|MenuItemEntry|Core.widget.Widget>}
         * @category Content
         */
        items : null,

        /**
         * An array of {@link #config-items child item} _config objects_ which is to be converted into
         * instances only when this Container is rendered, rather than eagerly at construct time.
         *
         * _This is mutually exclusive with the {@link #config-items} config._
         *
         * @config {Object<String,ContainerItemConfig|Boolean|null>|ContainerItemConfig[]|Core.widget.Widget[]}
         * @category Content
         */
        lazyItems : {
            $config : ['lazy'],
            value   : null
        },

        /**
         * When this container is used as a tab in a TabPanel, these items are added to the
         * {@link Core/widget/TabBar} when this container is the active tab.
         *
         * ```javascript
         * new TabPanel({
         *     appendTo : targetElement,
         *     height   : '25em',
         *     items: {
         *         firstTab : {
         *             title: 'First',
         *             items: {
         *                 name : { type: 'textfield', label: 'Name' }
         *             },
         *             tabBarItems : [{
         *                 type    : 'button',
         *                 text    : 'Add tab',
         *                 onClick : 'up.onAddTabClick'
         *             }]
         *         }
         *     },
         *
         *     onAddTabClick({ value }) {
         *         this.add({
         *             type  : 'container',
         *             title : 'New tab',
         *             items : {
         *                 button : {
         *                     type : 'button',
         *                     text : 'Click me',
         *                     onClick() {
         *                         Toast.show('Awesome!');
         *                     }
         *                 }
         *             }
         *         });
         *     }
         * });
         * ```
         *
         * @config {ToolbarItems[]|Core.widget.Widget[]} tabBarItems
         * @category Misc
         */
        tabBarItems : null,

        /**
         * A config object containing default settings to apply to all child widgets.
         * @config {ContainerItemConfig}
         * @category Content
         */
        defaults : null,

        /**
         * Convenience setting to use same label placement on all child widgets.
         *
         * Set it to 'auto' to let the theme decide on label placement.
         *
         * Specifying `'align-before'` will position labels before the field and also apply a two column layout (in
         * combination with `display: contents` on the fields) to align all labels in the first column and the
         * fields in the second.
         *
         * @prp {'before'|'above'|'align-before'|'auto'|null}
         */
        labelPosition : null,

        /**
         * Convenience setting to align input fields of child widgets. By default, the Field input element is
         * placed immediately following the `label`. If you prefer to have all input fields aligned to the
         * right, set this config to `'end'`.
         *
         * {@inlineexample Core/widget/ContainerAlignment.js}
         *
         * @prp {'start'|'end'}
         */
        inputFieldAlign : null,

        defaultType : 'widget',

        /**
         * The CSS style properties to apply to the {@link Core.widget.Widget#property-contentElement}.
         *
         * By default, a Container's {@link Core.widget.Widget#property-contentElement} uses flexbox layout, so this
         * config may contain the following properties:
         *
         * - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction">flexDirection</a> default '`row`'
         * - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap">flexWrap</a>
         * - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/flex-flow">flexFlow</a>
         * - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content">justifyContent</a>
         * - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/align-items">alignItems</a>
         * - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/align-content">alignContent</a>
         * - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/place-content">placeContent</a>
         * @prp {Object}
         * @category Layout
         */
        layoutStyle : null,

        /**
         * An optional CSS class to add to child items of this container.
         * @config {String}
         * @category CSS
         */
        itemCls : null,

        /**
         * Set `true` to add a border to this container's element.
         * @config {Boolean}
         * @category CSS
         */
        border : null,

        /**
         * The {@link #config-layout} as an instance of {@link Core.widget.layout.Layout}.
         * This is a helper class which adds and removes child widgets to this Container's
         * DOM and applies CSS classes based upon its requirements.
         *
         * The {@link Core.widget.layout.Card card} layout provides for showing one child
         * widget at a time, and provides a switching API to change which child widget is
         * currently active.
         * @member {Core.widget.layout.Layout} layout
         * @category Layout
         */
        /**
         * The short name of a helper class which manages rendering and styling of child items.
         *
         * Or a config object which includes a `type` property which specifies which type
         * of layout to use, and how to configure that layout.
         *
         * By default, the only special processing that is applied is that the Container class's
         * {@link #config-itemCls} is added to child items.
         *
         * Containers use CSS flexbox in its default configuration to arrange child items. You may either use the
         * {@link #config-layoutStyle} configuration to tune how child items are layed out, or use one of the built
         * in helper classes which include:
         *
         *  - `fit` A single child item is displayed fitting exactly into the
         *  {@link Core.widget.Widget#property-contentElement}.
         *  - `card` Child items are displayed one at a time, size to fit the
         *  {@link Core.widget.Widget#property-contentElement} and are slid in from the side when activated.
         *  - `box` Child items are layed out using flexbox.
         *
         * For example:
         *
         * ```javascript
         * {
         *     id     : 'myContainer',
         *     // Our child items flow downwards and are stretched to fill our width
         *     layout : {
         *         type       : 'box',
         *         direction  : 'column'
         *         align      : 'stretch'
         *     }
         * }
         * ```
         *
         * @config {String|ContainerLayoutConfig}
         * @category Layout
         */
        layout : {
            type : 'default'
        },

        /**
         * An object containing default config objects which may be referenced by name in the {@link #config-items}
         * config. For example, a specialized {@link Core.widget.Menu Menu} subclass may have a `namedItems` default
         * value defined like this:
         *
         * ```javascript
         *  namedItems : {
         *      removeRow : {
         *          text : 'Remove row',
         *          onItem() {
         *              this.ownerGrid.remove(this.ownerGrid.selectedRecord);
         *          }
         *      }
         *  }
         * ```
         *
         * Then whenever that subclass is instantiated and configured with an {@link #config-items} object, the
         * `items` may use the above defaults like this:
         *
         * ```javascript
         *  items : {
         *      removeRow : true,   // The referenced namedItem will be applied to this
         *      otherItemRef : {
         *          text : 'Option 2',
         *          onItem() { }
         *      }
         * }
         * ```
         * If a menu instance (or its class) does not include `removeRow` in its `items`, no menu item will be
         * created. See also {@link #config-defaults}.
         *
         * @config {Object<string,ContainerItemConfig>}
         * @category Content
         */
        namedItems : {
            $config : 'lazy',
            value   : null
        },

        /**
         * When set to `true`, this widget is considered as a whole when processing {@link Core.widget.Toolbar}
         * overflow. When `false`, this widget's child items are considered instead.
         *
         * When set to the string `'none'`, this widget is ignored by overflow processing. This option should be
         * used with caution as it prevents the overflow algorithm from moving such widgets into the overflow
         * popup which may result in not clearing enough space to avoid overflowing the toolbar.
         * @config {Boolean|String}
         * @default false
         * @category Layout
         * @internal
         */
        overflowable : {
            value   : null,
            default : false,
            $config : null
        },

        /**
         * Specify `true` for a container used to show text markup. It will apply the CSS class `b-text-content`
         * which specifies a default max-width that makes long text more readable.
         *
         * This CSS class is automatically removed if the container adds/defines child Widgets.
         * @config {Boolean}
         * @default
         * @category Content
         */
        textContent : true,

        /**
         * {@link Core.data.Model Record} whose values will be used to populate fields in the container.
         *
         * Any descendant widgets of this Container with a `name` property (or a `ref` if no name is configured)
         * will have its value set to the value of that named property of the record.
         *
         * If no record is passed, the widget has its value set to `null`.
         *
         * To strictly match by the `name` property, configure {@link #config-strictRecordMapping} as `true`.
         *
         * When fields loaded from this record are changed by user input, the {@link #property-hasChanges}
         * property will be set.
         *
         * @prp {Core.data.Model}
         * @category Record
         */
        record : {
            $config : {
                equal : recordEquals
            },
            value : null
        },

        /**
         * Specify `true` to match fields by their `name` property only when assigning a {@link #config-record},
         * without falling back to `ref`.
         *
         * @prp {Boolean}
         * @default false
         * @category Record
         */
        strictRecordMapping : null,

        /**
         * Update assigned {@link #config-record} automatically on field changes.
         *
         * @prp {Boolean}
         * @category Record
         */
        autoUpdateRecord : null,

        autoUpdateUserChangesOnly : true,

        /**
         * Reload this Container's fields when the assigned {@link #config-record} is changed elsewhere, so the
         * displayed values stay in sync with the record. This is the read-direction counterpart of
         * {@link #config-autoUpdateRecord}.
         * @config {Boolean}
         * @category Record
         */
        autoUpdateFields : null,

        /**
         * Specify `true` to make this container hide when it has no visible children (Either empty
         * or all children hidden).
         *
         * Container will show itself when there are visible children, ie: hidden children are
         * shown, or new visible children are added.
         * @config {Boolean}
         * @default
         * @category Layout
         */
        hideWhenEmpty : null,

        contentElMutationObserver : {
            $config : ['lazy', 'nullify'],
            value   : true
        },

        /**
         * Specify `true` to isolate record changes to this container and its ancestors. Prevents record updates
         * from propagating up from here and also prevents record updates from parent from propagating down to us.
         *
         * @config {Boolean}
         * @default false
         * @internal
         */
        isolateFields : false,

        /**
         * Can be set to `true` to make a focus of a focusable encapsulating element relay focus down into a
         * focusable child. This is normally `false` to allow mousedown to begin text selection in Popups.
         * @config {Boolean}
         * @internal
         */
        focusDescendant : false,

        // Our own setValues/getValues system should not set/get HTML content
        defaultBindProperty : null,

        /**
         * A {@link #function-query} selector function which can identify the descendant widget to which
         * focus should be directed by default.
         *
         * Or a CSS selector string which identifies a descendant element to focus.
         *
         * By default, the first focusable descendant widget is chosen. This may direct focus to a different
         * widget:
         *
         * ```javascript
         *     new Popup({
         *         title        : 'Details',
         *         width        : '25em',
         *         centered     : true,
         *         modal        : true,
         *
         *         // Focus goes straight to OK button in the bottom toolbar on show
         *         defaultFocus : w => w.ref === 'okButton',
         *         items        : {
         *             nameField : {
         *                 type  : 'textfield',
         *                 label : 'Name'
         *             },
         *             ageField  : {
         *                 type  : 'numberfield',
         *                 label : 'Name'
         *             }
         *         },
         *         bbar     : {
         *             items : {
         *                 okButton : {
         *                     text    : 'OK',
         *                     handler : okFunction
         *                 },
         *                 cancelButton : {
         *                     text    : 'Cancel',
         *                     handler : cancelFunction
         *                 }
         *             }
         *         }
         *     }).show();
         * ```
         *
         * @config {Function|String}
         * @param {Core.widget.Widget} widget Widget passed to method
         * @returns {Boolean} truthy value if widget is the default one
         */
        defaultFocus : null,

        /**
         * Either a default `rendition` to apply to all child widgets, or a map of renditions keyed by child widget
         * `type`.
         *
         * ```javascript
         * // Mixed types, use object form:
         * new Container({
         *   rendition : {
         *     text   : 'outlined',
         *     button : 'raised'
         *   },
         *   items : [
         *     { type : 'text', label : 'Name' },
         *     { type : 'button', text : 'Save' }
         *   ]
         * });
         *
         * // Single type, can use string form:
         * new Container({
         *   rendition : 'outlined',
         *   items : [
         *     { type : 'button', text : 'Save' },
         *     { type : 'button', text : 'Cancel' }
         *   ]
         * });
         * ```
         *
         *
         * @prp {String|Object<String,String>|null}
         */
        rendition : null,

        /**
         * Number of columns to use in a grid layout. Applied as `grid-template-columns: repeat(n, auto)`. Also
         * applies the `b-columns` CSS class to the container.
         * @prp {Number}
         * @internal
         */
        gridColumns : null,

        /**
         * Sets `labelWidth` for all children of this Container, that do not define their own `labelWidth`.
         *
         * ```javascript
         * new Container({
         *    labelWidth : 100,
         *    items : {
         *      name : { type : 'textfield', label : 'Name' },
         *      score : { type : 'numberfield', label : 'Score' }
         *    }
         * });
         * ```
         *
         * Replaces the old approach of specifying this in the `defaults` config, with the added advantage of being able
         * to set the default value to have this affect all containers:
         *
         * ```javascript
         * // Use labelWidth 100 for all containers in the app
         * Container.applyDefaults({ labelWidth : 100 });
         * ```
         *
         * {@note}If your goal is simply to have labels be same width to have fields to align nicely in a form like
         * layout, consider using the {@link #config-labelPosition} config with the value `'align-before'` instead,
         * which will use CSS Grid to align all labels in one column and all fields in another, without the need to
         * specify a fixed width.{/@note}
         *
         * @prp {Number|null}
         * @category Content
         */
        labelWidth : null
    };

    static get prototypeProperties() {
        return {
            // These classes have opinions about how fields should fill the space, so allow them to be replaced by the
            // less opinionated b-hbox/b-vbox classes when that is not desired. Using ":not(.b-toolbar-content)" in
            // the CSS does not scale now that FieldSet wants similar treatment... adding more ":not()"s is not only a
            // messy approach, it increases the selector specificity and causes interference with other selectors (e.g.
            // TimePicker's number field rules).
            flexRowCls : 'b-flex-row',
            flexColCls : 'b-flex-column',

            /**
         * @member {Boolean} initialItems
         * This property is `true` until the container's initial `items` config has been processed. This property
         * is set to `false` by the `updateItems` method.
         * @readonly
         * @internal
         */
            initialItems : true
        };
    }

    startConfigure(config) {
        // Set a flag so that code can test for presence of items.
        // Widgets which render child widgets outside of the Container scheme
        // can set this flag (eg Panels with tools and tbar).
        const items = config.items || config.lazyItems;

        if (!(this.hasItems = Boolean(items && (isArray(items) ? items : Object.keys(items)).length))) {
            this.initialItems = false;   // we won't be running updateItems, so clear this flag now
        }

        super.startConfigure(config);
    }

    /**
     * Returns the first widget in this Container.
     * @member {Core.widget.Widget}
     * @readonly
     */
    get firstItem() {
        return this.getAt(0);
    }

    /**
     * Returns the last widget in this Container.
     * @member {Core.widget.Widget}
     * @readonly
     */
    get lastItem() {
        return this.getAt(-1);
    }

    getPositionableItems(which, keyed) {
        const items = this._items?.filter(it => which ? it.positionable === which : it.positionable) || [];

        return keyed ? Object.fromEntries(items.map((c, n) => [`$${c.positionable}${n}`, c.element])) : items;
    }

    /**
     * Returns a 2-element array of `[parentElement, insertBefore]` that specifies where in the DOM to insert a child
     * item based on its {@link Core.widget.Widget#config-positionable} config value.
     * @param {'before'|'after'} position The item's {@link Core.widget.Widget#config-positionable} config value.
     * @returns {HTMLElement[]}
     * @internal
     */
    getPositionableLocation(position) {
        return [this.contentElement];
    }

    /**
     * Returns the widget at the specified `index` in this Container.
     * @param {Number} index The index of the widget to return. Negative numbers index for the last item. For example,
     * `index = -1` returns the last matching item, -2 the 2nd to last matching item etc..
     * @returns {Core.widget.Widget} The requested widget.
     */
    getAt(index) {
        return this.ensureItems().at(index);
    }

    /**
     * Removes the passed child/children from this Container.
     * @param  {...Core.widget.Widget} toRemove The child or children to remove.
     * @returns {Core.widget.Widget|Core.widget.Widget[]} All the removed items. An array if multiple items
     * were removed, otherwise, just the item removed.
     */
    remove(...toRemove) {
        let returnArray = true;

        if (toRemove.length === 1) {
            if (isArray(toRemove[0])) {
                toRemove = toRemove[0];
            }
            else {
                returnArray = false;
            }
        }

        const
            me         = this,
            { _items } = me,
            result     = [];

        for (let i = 0; i < toRemove.length; i++) {
            const childToRemove = toRemove[i];

            if (_items.includes(childToRemove)) {
                _items.remove(childToRemove);
                me.layout.removeChild(childToRemove);
                result.push(childToRemove);
                me.onChildRemove(childToRemove);
            }
        }

        return returnArray ? result : result[0];
    }

    /**
     * Removes all children from this Container.
     * @returns {Core.widget.Widget[]} All the removed items.
     */
    removeAll() {
        return this.remove(this.items);
    }

    /**
     * Determines if the passed widget is an immediate child of this Container.
     * @param {Core.widget.Widget|String|Number} widgetOrId The widget or widget id to check for.
     * @returns {Boolean} `true` if the passed widget is an immediate child of this Container, `false` otherwise.
     */
    includes(widgetOrId) {
        const widget = typeof widgetOrId === 'object' ? widgetOrId : bryntum.get(widgetOrId);

        return this._items.items.has(widget);
    }

    /**
     * Appends the passed widget / widgets or config(s) describing widgets to this Container.
     *
     * If the widgets specify a `weight`, they are inserted at the correct index compared to the existing items weights.
     *
     * @param {ContainerItemConfig|ContainerItemConfig[]|Core.widget.Widget|Core.widget.Widget[]} toAdd The child or children instances (or config objects) to add.
     * @returns {Core.widget.Widget|Core.widget.Widget[]} All the added widgets. An array if multiple items
     * were added, otherwise just the item added.
     */
    add(...toAdd) {
        const
            me     = this,
            items = me.ensureItems(),
            result = [];

        let returnArray = true,
            childToAdd, i, index;

        if (toAdd.length === 1) {
            if (isArray(toAdd[0])) {
                toAdd = toAdd[0];
            }
            else {
                returnArray = false;
            }
        }

        for (i = 0; i < toAdd.length; i++) {
            childToAdd = toAdd[i];

            if (childToAdd.isWidget) {
                childToAdd.parent = me;
            }
            else {
                childToAdd = me.createWidget(childToAdd);
            }

            // Items with weight are inserted at correct index
            if (childToAdd?.weight != null) {
                // Cannot use cached items, weights might be unordered in set being added
                index = ArrayHelper.findInsertionIndex(childToAdd, items.values, Widget.weightSortFn);
                result.push(me.insert(childToAdd, index));
            }
            // Those without are appended
            else if (childToAdd) {
                if (!items.includes(childToAdd)) {
                    items.add(childToAdd);
                    me.onChildAdd(childToAdd);
                    me.layout.appendChild(childToAdd);
                    result.push(childToAdd);
                }
            }
        }

        return returnArray ? result : result[0];
    }

    ensureItems() {
        const me = this;

        me.getConfig('items');
        me.getConfig('lazyItems');

        // Force creation of our items Bag
        if (!me._items) {
            me.items = [];
        }

        return me._items;
    }

    /**
     * Inserts the passed widget into this Container at the specified position.
     * @param  {Core.widget.Widget} toAdd The child to insert.
     * @param {Number|Core.widget.Widget} index The index to insert at or the existing child to insert before.
     * @returns {Core.widget.Widget} The added widget.
     */
    insert(toAdd, index) {
        const
            me    = this,
            items = me.ensureItems();

        if (toAdd instanceof Widget) {
            toAdd.parent = me;
        }
        else {
            toAdd = me.createWidget(toAdd);
        }

        if (items.includes(index)) {
            index = me.indexOfChild(index) - 1;
        }

        index = Math.min(index, items.count);

        const newValues = items.values;
        // Are we moving an existing child in the collection?
        if (newValues.includes(toAdd)) {
            const oldIndex = newValues.indexOf(toAdd);
            newValues.splice(oldIndex, 1);
            newValues.splice(index, 0, toAdd);

            items.values = newValues;
            me.syncChildCount();

            me.onChildMove?.(toAdd);
            me.layout.insertChild(toAdd, index < oldIndex ? index : index + 1);
        }
        else {
            newValues.splice(index, 0, toAdd);
            items.values = newValues;

            // Register inserted item
            me.onChildAdd(toAdd);
            me.layout.insertChild(toAdd, index);
        }

        return toAdd;
    }

    indexOfChild(child) {
        return this.items.indexOf(child);
    }

    changeLazyItems(lazyItems) {
        this.items = lazyItems;
        this.layout.renderChildren();
    }

    onChildWeightChange(changedChild) {
        if (this.items.length > 1) {
            const { lastItem } = this;
            this._items.sort(Widget.weightSortFn);
            const { items } = this;
            this.contentElement.insertBefore(changedChild.element, items[items.indexOf(changedChild) + 1]?.element || lastItem.element.nextSibling);
        }
    }

    changeItems(items, oldItems) {
        const
            me       = this,
            newItems = [],
            result   = new Bag();

        if (isArray(items)) {
            me.processItemsArray(items, newItems);
        }
        else if (items) {
            me.processItemsObject(items, me.namedItems, newItems);
        }

        // Allow child items to have a weight to establish their order
        if (newItems.some(returnWeight)) {
            newItems.sort(Widget.weightSortFn);
        }

        result.add(newItems);

        // Remove previous child payload if any
        if (oldItems) {
            oldItems.forEach(w => {
                me.remove(w);

                // Destroy outgoing-only widgets which we created.
                if (!result.includes(w) && w._createdBy === me) {
                    w.destroy();
                }
            });
        }

        return result;
    }

    afterConstruct() {
        const
            { rtl }       = this,
            { classList } = this.contentElement;

        // Content element must get class.
        // Panels and Toolbars use an inner element to arrange child items.
        classList.toggle('b-rtl', rtl === true);
        classList.toggle('b-ltr', rtl === false);
    }

    updateRtl(rtl) {
        super.updateRtl(rtl);

        const { contentElement } = this;

        // contentElement may not exist at config time. The afterConstruct handles it in those cases.
        if (contentElement) {
            // Content element must get class.
            // Panels and Toolbars use an inner element to arrange child items.
            contentElement.classList.toggle('b-rtl', rtl === true);
            contentElement.classList.toggle('b-ltr', rtl === false);
        }
    }

    updateItems(items, oldItems) {
        let index = 0;

        items.forEach(item => {  // no "index" argument from Bag
            this.onChildAdd(item);

            // oldItems may be set with oldItems.temporary = true if we try to access this.items very early. see: get items()
            // So if this *change* is an actual change, and not a due to there being a temporary oldItems, then we want
            // to call insertChild()
            // If this change is coming after render() is called due to super.construct() then we should insertChild()
            if ((oldItems && !oldItems.temporary) || this.rendered) {
                this.layout.insertChild(item, index);
            }

            ++index;
        });

        this.initialItems = false;
    }

    updateHideWhenEmpty() {
        this.syncChildCount(this.rendered);
    }

    updateBorder(border) {
        this.toggleCls('b-bordered', Boolean(border));
    }

    /**
     * A property, which, when *read*, returns an array of the child items of this container in rendered order.
     *
     * This property may also be *set* to change the child items of the container. Just as in the
     * {@link #config-items initial items configuration}, the new value may either be an array of
     * Widgets/Widget configs or an object.
     *
     * If specified as an Object, the property names are used as the child Widget's
     * {@link Core.widget.Widget#config-ref} name, and the value is the child Widget/Widget config.
     *
     * When setting this, any items which are *only* in the outgoing child items which were created
     * by this container from raw config objects are destroyed.
     *
     * Usage patterns:
     *
     * ```javascript
     * myContainer.items = {
     *     name : {
     *         type  : 'textfield',
     *         label : 'User name'
     *     },
     *     age : {
     *         type  : 'numberfield',
     *         label : 'User age'
     *     }
     * };
     * ```
     *
     * or
     *
     * ```javascript
     * myContainer.items = [{
     *     ref   : 'name',
     *     type  : 'textfield',
     *     label : 'User name'
     * },
     *     ref   : 'age',
     *     type  : 'numberfield',
     *     label : 'User age'
     * }];
     * ```
     *
     * @member {Core.widget.Widget[]}
     * @accepts {Array<ContainerItemConfig|MenuItemConfig|Core.widget.Widget>|Object<String,ContainerItemConfig|MenuItemConfig>}
     */
    get items() {
        const me = this;

        // If we are being asked for items, ingest lazyItems.
        me.getConfig('lazyItems');

        // The documented API for items is an Array.
        // Internal code should access _items
        if (!me._items) {
            // Currently initializing items, flag set by the config system
            if (me.initializingItems) {
                // This is a created array. User may mutate it.
                return [];
            }
            // Accessing items very early, not set up yet. Need a placeholder
            me._items = new Bag();
            me._items.temporary = true;
        }

        // This is the Collection's array. User may not mutate it.
        return me._items.values;
    }

    processItemsArray(items, result) {
        const len = items.length;

        let i, item;

        for (i = 0; i < len; i++) {
            item = items[i];

            if (item instanceof Widget) {
                item.parent = this;
                item.removeCls(...Widget.outerCls);
            }
            else {
                item = this.createWidget(item);
            }

            // If the widget creation function returns null, nothing to add
            if (item) {
                if (item.ref || item.id) {
                    // Add early to widgetMap, to allow using 'up.widgetMap.ref' in later siblings configs
                    this.addDescendant(item);
                }

                result.push(item);
            }
        }
    }

    processItemsObject(items, namedItems, result = []) {
        let item, ref;

        for (ref in items) {
            item = items[ref];

            // It might come in as itemRef : false
            if (item) {
                // If this class or instance has a "namedItems" object
                // named by this ref, then use it as the basis for the item
                if (namedItems && ref in namedItems) {
                    item = typeof item === 'object' ? ObjectHelper.merge(ObjectHelper.clone(namedItems[ref]), item) : namedItems[ref];
                }

                // Allow namedItems to be overridden with itemKey : false to indicate unavailability of an item
                if (item) {
                    if (item instanceof Widget) {
                        item.parent = this;
                    }
                    else {
                        //<debug>
                        if (item.ref && item.ref !== ref) {
                            throw new Error(`Named child item ref property ${item.ref} doesn't match the property name it was from ${ref}`);
                        }
                        //</debug>
                        if (item instanceof Object) {
                            item.ref = ref;
                        }
                        item = this.createWidget(item);
                    }

                    // If the widget creation function returns null, nothing to add
                    if (item) {
                        item.ref = ref;

                        // Add early to widgetMap, to allow later siblings to use 'up.'
                        this.addDescendant(item);

                        result.push(item);
                    }
                }
            }
        }
        return result;
    }

    get useRendition() {
        return this.closest(w => w.rendition && w.isContainer)?.rendition;
    }

    applyRendition(item) {
        const rendition = this.useRendition;

        if (rendition && !item.initialConfig.rendition) {
            // Rendition can be an object keyed by type, or a string
            if (typeof rendition === 'string') {
                item.rendition = rendition;
            }
            else {
                let itemRendition;

                for (let i = item.$meta.hierarchy.length - 1; i >= 0; i--) {
                    const parentClass = item.$meta.hierarchy[i];
                    if (rendition[parentClass.type]) {
                        itemRendition = rendition[parentClass.type];
                        break;
                    }
                }

                // Pass on rendition to containers if not specified
                if (!itemRendition && item.isContainer) {
                    itemRendition = rendition;
                }

                // itemRendition ||= rendition[this.defaultType];

                if (itemRendition) {
                    item.rendition = itemRendition;
                }
            }
        }
    }

    updateRendition(rendition) {
        !this.isConfiguring && this.eachWidget(child => {
            if (`rendition` in child) {
                this.applyRendition(child);
            }
        });
    }

    onChildAdd(item) {
        const me = this;

        // Don't just assign the property across since the default value is undefined
        // which means false. Only set to `true` if we are readOnly
        if (item.innerItem && me.readOnly && !item.ignoreParentReadOnly) {
            item.readOnly = true;
        }

        if (item.label && !item.labelPosition) {
            item.labelPosition = me.effectiveLabelPosition;
        }

        if (me.labelWidth != null && item.labelWidth == null) {
            item.labelWidth = me.labelWidth;
        }

        if (me.useRendition) {
            me.applyRendition(item);
        }

        me.onChildAddLayout(item);

        if (item.ref || item.id) {
            for (let current = me; current; current = current.parent) {
                // Silently add the descendant to the ancestor's widgetMap without kicking off
                // the ancestor's items processing by directly accessing the widgetMap property.
                current.addDescendant(item);
            }
        }

        me.syncChildCount(true);

        !me.onConfigChange.$nullFn && me.onConfigChange({
            name   : 'items',
            config : me.$meta.configs.items
        });
    }

    onChildAddLayout(item) {
        // Set innerItem=false on an item that should not be managed by the layout...
        if (item.innerItem) {
            // Keep layout informed of child item state
            this.layout.onChildAdd(item);
        }
    }

    onChildHide(hidden) {
        super.onChildHide(hidden);

        // Only sync when it's a direct child, not just the "owner" link of a floater
        if (this._items?.includes(hidden)) {
            this.syncChildCount(true);
        }
    }

    onChildShow(shown) {
        super.onChildShow(shown);

        // Only sync when it's a direct child, not just the "owner" link of a floater
        if (this._items?.includes(shown)) {
            this.syncChildCount(true);
        }
    }

    syncChildCount(enforceHideWhenEmpty) {
        // If called during configuration, the element may not be available because
        // some non-item widgets (eg, Tools) instantiate and declare themselves through
        // onChildAdd before the element is set.
        // But also there may be no items because of     lazyItems.
        // So do the initial sync at render time.
        if (!this.isConfiguring && !this.isDestroying) {
            const
                me                         = this,
                {
                    // This must be our direct child item payload, not all items owned by this Container.
                    // It's used to sync the b-first-visible-child/b-last-visible-child class presence.
                    items,
                    hasItems
                }                          = me,
                visibleItems               = items.filter(isNotHidden),
                { length : visibleLength } = visibleItems;

            /**
         * @member {Number} visibleChildCount The number of *visible* child items shown in this Container.
         * @readonly
         * @category Widget hierarchy
         */
            me.visibleChildCount = visibleLength;

            // Do not toggle visibility on render - we're just here to sync class names.
            // hiding and showing must only depend upon children being dynamically
            // hidden or shown.
            if (me.hideWhenEmpty && enforceHideWhenEmpty) {
                const shouldHide = Boolean(!visibleLength);

                if (Boolean(me._hidden) !== shouldHide) {
                    me.hidden = shouldHide;
                }
            }

            items.forEach(childItem => childItem.removeCls('b-last-visible-child', 'b-first-visible-child'));

            if (visibleLength) {
                visibleItems[0].addCls('b-first-visible-child');
                visibleItems[visibleLength - 1].addCls('b-last-visible-child');
            }

            // Keep hasItems property up to date. It's used by the isFocusable getter.
            // Note that because this is to do with focusability, this includes all
            // possible items, not just contained items.
            me.hasItems = Boolean(me.childItems.length);

            me.contentElement.classList[visibleLength ? 'remove' : 'add']('b-no-visible-children');

            // Reevaluate whether we should have the b-text-content class
            if (hasItems !== me.hasItems) {
                me.recompose();
            }
        }
    }

    syncFlexDirection() {
        const
            me        = this,
            { contentElement, flexColCls, flexRowCls } = me,
            classList = new DomClassList(contentElement.className),
            styles    = DomHelper.getStyleValue(contentElement, stylesToCheck);

        // We might not be flexing at all anymore.
        classList[flexRowCls] = classList[flexColCls] = 0;

        // If we are, add a flag class to indicate direction
        if (styles.display === 'flex') {
            classList[styles['flex-direction'] === 'row' ? flexRowCls : flexColCls] = 1;
        }

        // Will only mutate the DOM if there are changes to apply.
        // We don't want to cause an infinite loop through our MutationObserver.
        DomHelper.syncClassList(contentElement, classList);
    }

    addDescendant(item) {
        const
            ref       = item.ref || item.id,
            widgetMap = this._widgetMap || (this._widgetMap = {});
        if (!widgetMap[ref]) {
            widgetMap[ref] = item;
        }
    }

    cleanupWidgetMap(item) {
        const
            me       = this,
            toRemove = new Map(),
            ref      = item.ref || item.id;

        // collect entries to clean from this container's (and its parents) widgetMap

        // 1. the item itself
        if (ref) {
            toRemove.set(ref, item);
        }

        // 2. the item's children
        item.eachWidget(child => {
            const ref = child.ref || child.id;

            if (ref) {
                toRemove.set(ref, child);
            }
        });

        // cleanup removed item and its children from this container's (and its parents) widgetMap
        for (let current = me; current; current = current.parent) {
            for (const [ref, item] of toRemove) {
                if (current.widgetMap[ref] === item) {
                    delete current.widgetMap[ref];
                }
            }
        }
    }

    onChildRemove(item) {
        const me = this;

        // cleanup removed widgets (including nested ones) from widgetMap
        me.cleanupWidgetMap(item);

        // Keep layout informed of child item state
        me.layout.onChildRemove(item);

        me.syncChildCount(true);

        !me.onConfigChange.$nullFn && me.onConfigChange({
            name   : 'items',
            config : me.$meta.configs.items
        });
    }

    /**
     * An object which contains a map of descendant widgets keyed by their {@link Core.widget.Widget#config-ref}.
     * All descendant widgets will be available in the `widgetMap`.
     * @member {Object<String,Core.widget.Widget>}
     * @readonly
     * @category Widget hierarchy
     */
    get widgetMap() {
        if (!this._widgetMap) {
            this._widgetMap = {};
        }

        // Force evaluation of the configured items by the getter
        // so that configs are promoted to widgets and the widgetMap
        // is created, and if there are widgets, populated.
        if (!this.initializingItems) {
            this.getConfig('items');
        }

        return this._widgetMap;
    }

    //region Record & values

    updateRecord(record) {
        const me = this;

        me.recordUpdateDetacher?.();

        /**
         * Fired before this container will load record values into its child fields. This is useful if you
         * want to modify the UI before data is loaded (e.g. set some input field to be readonly)
         * @event beforeSetRecord
         * @param {Core.widget.Container} source The container
         * @param {Core.data.Model} record The record
         */
        me.trigger('beforeSetRecord', { record });

        me.setValues(record, {
            onlyName         : me.strictRecordMapping,
            highlight        : Boolean(me.$highlight),
            trackFieldValues : true
        });

        if (me.autoUpdateFields && record?.firstStore) {
            me.recordUpdateDetacher = record.firstStore.ion({
                update  : me.onRecordUpdated,
                thisObj : me
            });
        }
    }

    // If the private property is used, clear the valueSource.
    // Should only ever be used to null out the record without going through the config system.
    set _record(record) {
        this.__record = this.valueSource = record;
    }

    get _record() {
        return this.__record;
    }

    setRecord(record, highlightChanges) {
        this.$highlight = highlightChanges;
        this.record     = record;
        this.$highlight = false;
    }

    onRecordUpdated({ record, changes, wasSet }) {
        if (record === this.record) {
            // Only update fields that were changed in the record.
            // Convert changes from { fieldName : { oldValue, value } } to { fieldName : value }
            changes = Object.entries(changes || wasSet).reduce(extractNameAndValue, {});
            this.distributeValues(changes, { highlight : false  });
        }
    }

    // A method to override to affect making a decision on whether a field should be updated
    shouldUpdateRecordOnAction(record, event) {
        return record && (event.userAction || !this.autoUpdateUserChangesOnly);
    }

    /**
     * A function called by descendant widgets after they trigger their 'change' event, in reaction to field changes.
     * By default, implements the functionality for the `autoUpdateRecord` config.
     *
     * @param {Object} params Normally the event params used when triggering the 'change' event
     * @internal
     */
    onFieldChange(eventData) {
        const
            me = this,
            { source } = eventData,
            { hasChanges, isConfiguring, isSettingValues, initialValues } = me;

        // Track changes caused by any means except loading a new value set
        if (!isSettingValues && !isConfiguring) {
            const
                { valueSource } = me,
                isModel         = valueSource?.isModel;

            let changeApplied = false;

            // When configured with `autoUpdateRecord`, changes from descendant fields/widgets are applied to the loaded
            // valueSource using the field's `name` if there *is* a valueSource.
            // Only changes from valid fields will be applied
            if (me.autoUpdateRecord && me.shouldUpdateRecordOnAction(valueSource, eventData)) {
                const
                    { strictRecordMapping } = me,
                    {
                        name,
                        ref,
                        isValid = true,
                        defaultBindProperty
                    }                       = source,
                    value                   = source[defaultBindProperty || 'value'],
                    key                     = strictRecordMapping ? name : name || ref;

                if (key && isValid) {
                    if (isModel) {
                        valueSource.setValue(key, value);
                    }
                    else {
                        valueSource[key] = value;
                    }

                    changeApplied = true;
                }

                /**
                 * Fired when a descendant field change has been evaluated against the loaded record, as part of the
                 * {@link #config-autoUpdateRecord} functionality.
                 * @event autoUpdateRecord
                 * @param {Core.widget.Container} source The container
                 * @param {Core.data.Model|Object} record The record the change was evaluated for
                 * @internal
                 */
                me.trigger('autoUpdateRecord', { record : valueSource });
            }

            if (initialValues && valueSource) {
                const sourceName = source.getValueName(initialValues[optionsProp]);

                // Set the changeSet[name] field depending upon whether the field has changed from the loaded value
                if (sourceName && (!isModel || valueSource.getFieldDefinition(sourceName))) {
                    const { changeSet } = me;

                    // Store the field change if
                    // autoUpdateRecord is OFF or it's ON but the change isn't saved and
                    // the field value doesn't equal its initial value
                    if ((!me.autoUpdateRecord || !changeApplied) &&
                        !ObjectHelper.isEqual(source.value, initialValues[sourceName])
                    ) {
                        (changeSet || (me.changeSet = {}))[sourceName] = true;
                    }
                    else if (changeSet) {
                        delete changeSet[sourceName];
                    }
                    // reset hasChanges cache to revalidate it
                    me._hasChanges = undefined;
                }
            }

            if (me.hasChanges !== hasChanges) {
                /**
                 * Fires when a field is mutated and the state of the {@link #property-hasChanges} property changes
                 * @event dirtyStateChange
                 * @param {Core.widget.Container} source The container.
                 * @param {Boolean} dirty The dirty state of the Container - `true` if there are any fields which have
                 * been changed since initial load.
                 */
                me.trigger('dirtyStateChange', { dirty : me.hasChanges });
            }
        }
    }

    /**
     * Returns `true` if any of the fields in this container have been changed since the container was
     * {@link #property-record loaded with a record}.
     *
     * Note that this value does not update during typing. The field's `change` event which is triggered when the
     * field is blurred causes this to be updated.
     *
     * For example when processing a "close" button click, this value will be in its correct state.
     *
     * @member {Boolean}
     * @readonly
     */
    get hasChanges() {
        let { _hasChanges } = this;

        if (_hasChanges === undefined) {
            const { changeSet } = this;

            _hasChanges = this._hasChanges = Boolean(changeSet && Object.values(changeSet).some(v => v));
        }

        return Boolean(_hasChanges);
    }

    getValues(filterFn) {
        const values = {};

        this.eachWidget((widget, control) => {
            // Do not drill down when reaching a container that isolates its fields
            if (widget.isolateFields) {
                control.down = false;
            }
            else if (('name' in widget) && (!filterFn || filterFn(widget))) {
                values[widget.name] = widget[widget.defaultBindProperty || 'value'];
            }
        }, true);

        return values;
    }

    /**
     * Retrieves or sets all values from/to contained widgets.
     *
     * The property set or read from a contained widget is its {@link Core.widget.Widget#config-defaultBindProperty}.
     *
     * This defaults to the `value` for fields.
     *
     * You may add child widgets which may accept and yield a value to/from another property, such as a `Button` having
     * its {@link Core.widget.Button#config-href} set.
     *
     * Accepts and returns a map, using {@link Core.widget.Field#config-name}, {@link Core.widget.Widget#config-ref} or
     * {@link Core.widget.Widget#config-id} (in that order) as keys.
     *
     * ```javascript
     * const container = new Container({
     *     appendTo : document.body,
     *     items    : {
     *         firstName : {
     *             type : 'textfield'
     *         },
     *         surName : {
     *             type : 'textfield'
     *         },
     *         saveButton : {
     *             type                : 'button',
     *             text                : 'Save',
     *             defaultBindProperty : 'href',
     *             href                : '#'
     *         }
     *     }
     * });
     *
     * container.values = {
     *     firstName  : 'Clark',
     *     surName    : 'Kent',
     *     saveButton : '#save-route'
     * };
     * ```
     *
     * @member {Object<String,Object>}
     */
    get values() {
        const values = {};

        this.gatherValue(values);

        return values;
    }

    set values(values) {
        // if the container itself has a value allow it to be grabbed as well
        this.assignValue(values);
    }

    /**
     * Returns `true` if currently setting values. Allow fields to change highlighting to distinguishing between
     * initially setting values and later on changing values.
     * @member {Boolean}
     * @readonly
     */
    get isSettingValues() {
        return Boolean(this.assigningValues);
    }

    get assigningValues() {
        // Fields query their parent, pass the question up in case containers are nested
        return this._assigningValues || this.parent?.assigningValues;
    }

    set assigningValues(v) {
        this._assigningValues = v;
    }

    assignValue(values, options) {
        // use default check for a value config from super...
        super.assignValue(values, options);

        if (!this.isolateFields) {
            this.setValues(values, options);
        }
    }

    gatherValue(values) {
        super.gatherValue(values);

        if (!this.isolateFields) {
            this.gatherValues(values);
        }
    }

    /**
     * Sets values into descendant fields/widgets.
     *
     * Accepts either a data Model instance or a plain object whose keys map to field names/refs/ids.
     * The second parameter is passed through to child widgets so they can customize how they
     * resolve and assign their value (mirrors previous internal usage).
     *
     * Change tracking (dirty state) is now managed here.
     *
     * When called, existing dirty state is cleared and a new baseline of `initialValues` is captured.
     *
     * @param {Object|Core.data.Model} values Value source (record or plain object). If omitted/`null`,
     *        all descendant fields will still receive an assignment call so they can clear themselves.
     * @param {Object} [options] Value assignment options object. Defaults to `assignValueDefaults`.
     */
    setValues(values, options = this.assignValueDefaults) {
        const me = this;

        // If autoUpdateRecord is set, it puts values back into the valueSource (record) on field changes.
        // Only the top level container should track field values.
        // When values are propagated down, trackFieldValues is set to false to prevent child containers doing so.
        if (options.trackFieldValues !== false) {
            me.valueSource = values;

            // If setValues was called with a Model, our record is that Model
            // If we're being cleared, we must clear our record.
            // Must use the private property to avoid config system processing and updateModel.
            if (!values || values.isModel) {
                me._record = values;
            }

            // Clean change tracking
            me._hasChanges = false;
            me.changeSet   = {};
        }

        me.clearError();

        // Push the values into child widgets at all levels
        // while collecting the clean set of initial values
        const initialValues = me.distributeValues(values, options);

        if (options.trackFieldValues !== false) {
            me.initialValues = initialValues;
        }
    }

    distributeValues(values, options) {
        const
            me               = this,
            trackFieldValues = options.trackFieldValues !== false || options.cleanValues,
            // initial value set for calculating the hasChanges property
            cleanValues      = options.cleanValues || {
                optionsProp : options
            };

        // Flag checked by Field to determine if it should highlight change or not
        me.assigningValues = options;

        me.eachWidget(widget => {
            const key = widget.getValueName(options);

            if (trackFieldValues !== false && key && (!values || key in values)) {
                cleanValues[key] = values?.[key] ?? null;
            }
            // Only the top level container should track field values.
            widget.assignValue(values, { ...options, trackFieldValues : false, cleanValues });
        }, false);

        me.assigningValues = false;
        return cleanValues;
    }

    /**
     * Resets field values and dirty tracking.
     *
     * - Calling with no arguments restores the values captured at the last clean `setValues` call
     *   (i.e. the baseline established when `setValues(...)` ran, typically via
     *   setting a {@link #property-record}).
     * - Calling with an object applies those values and establishes a new clean baseline.
     *
     * @param {Object} [values] Optional map of values to apply as the new clean state.
     */
    resetValues(values = this.initialValues) {
        const
            me            = this,
            { changeSet } = me,
            valuesSet     = me.distributeValues(values, me.assignValueDefaults);

        Object.keys(valuesSet).forEach(key => {
            if (changeSet && key in changeSet) {
                delete changeSet[key];
            }
            // Update initialValues to the reset values
            me.initialValues[key] = valuesSet[key];
        });
        // Re-evaluate _hasChanges after selective cleanup
        me._hasChanges = undefined;
    }

    //endregion

    get hasNoChildren() {
        // If we have *uningested* lazyItems, use them to find our items' length.
        // In that case we must not cause ingestion of the lazyItems by referencing this.items.
        // If we have items, then only those that are visible have any bearing.
        // Popup also has to consult this property to decide on its CSS classes.
        const
            me                   = this,
            { items, lazyItems } = me.initialConfig,
            itemsArray           = items && (isArray(items) ? items : ObjectHelper.values(items)),
            lazyItemsArray       = lazyItems && (isArray(lazyItems) ? lazyItems : ObjectHelper.values(lazyItems)),
            // avoid triggering items initialization
            whichItems           = me.isConfiguring ? lazyItemsArray || itemsArray : me.items;

        return !whichItems?.filter(isNotHidden).length;
    }

    compose() {
        const { effectiveLabelPosition, gridColumns, textContent, inputFieldAlign } = this;

        return {
            class : {
                [`b-label-${effectiveLabelPosition}`] : effectiveLabelPosition,
                'b-field-align-end'                   : inputFieldAlign === 'end', // start is the default
                'b-columns'                           : gridColumns,
                'b-text-content'                      : textContent
            },
            style : {
                '--bi-container-columns' : gridColumns
            }
        };
    }

    afterRecompose() {
        super.afterRecompose();
        this.realign();
    }

    // updateTextContent(textContent) {
    //     const me = this;
    //
    //     // Add the text content class if we have no visible immediate item children.
    //     if (!me.isComposable) {
    //         const
    //             needsClass    = Boolean(textContent && me.hasNoChildren),
    //             { classList } = me.contentElement,
    //             changed       = needsClass !== classList.contains('b-text-content');
    //
    //         // Depending on CSS settings around how this widget handles text content and widthing
    //         // we *may* have to realign. Realign only goes ahead if we're visible and floating.
    //         if (changed) {
    //             classList[needsClass ? 'add' : 'remove']('b-text-content');
    //             if (me.rendered) {
    //                 me.realign();
    //             }
    //         }
    //     }
    // }

    updateLayoutStyle(layoutStyle) {
        DomHelper.applyStyle(this.contentElement, layoutStyle);
    }

    updateLabelWidth(labelWidth) {
        if (!this.isConfiguring) {
            this.eachWidget(widget => {
                if (!widget.initialConfig.labelWidth) {
                    widget.labelWidth = labelWidth;
                }
            });
        }
    }

    updateLabelPosition(labelPosition) {
        if (labelPosition === 'auto' && !this.themeLabelPositionDetacher) {
            this.themeLabelPositionDetacher = GlobalEvents.ion({
                theme   : 'onThemeLabelPositionChange',
                thisObj : this
            });
        }

        this.propagateLabelPosition();
    }

    // Global `theme` event handler, propagates the theme's label position
    onThemeLabelPositionChange({ mode }) {
        // A light/dark switch does not change the theme's label position
        if (!mode) {
            this.propagateLabelPosition();
        }
    }

    get effectiveLabelPosition() {
        const { labelPosition } = this;

        if (labelPosition === 'auto') {
            return DomHelper.getThemeInfo(this.rootElementEarly)?.labelPosition;
        }

        return labelPosition;
    }

    propagateLabelPosition() {
        if (!this.isConfiguring) {
            const { effectiveLabelPosition } = this;

            this.eachWidget(widget => {
                if (widget.label && !widget.initialConfig.labelPosition) {
                    widget.labelPosition = effectiveLabelPosition;
                }
            });

            this.recompose();
        }
    }

    updateElement(element, oldElement) {
        super.updateElement(element, oldElement);

        if (element) {
            const
                { classList }    = this.contentElement,
                { containerCls } = this.layout;

            // Ensure contentElement gets its full complement of class names upon element creation
            classList.add('b-content-element');

            if (containerCls) {
                classList.add(containerCls);
            }
        }
    }

    onInternalPaint(...args) {
        super.onInternalPaint?.(...args);

        // Don't start observing until we have a layout
        if (DomHelper.stylesheetLoadPromise) {
            DomHelper.stylesheetLoadPromise.then(() => this.getConfig?.('contentElMutationObserver'));
        }
        else {
            // Bring the lazy config into existence now that we have a layout.
            this.getConfig('contentElMutationObserver');
        }
    }

    changeContentElMutationObserver(contentElMutationObserver, oldContentElMutationObserver) {
        if (oldContentElMutationObserver) {
            // Clear the queue. Any remaining notifications will be undeliverable.
            oldContentElMutationObserver.takeRecords();
            oldContentElMutationObserver.disconnect();
        }

        // We need to monitor our contentElement for attribute changes.
        // Changes to the inline style, or the classList/className will trigger this.
        // At that point we can sync our layout flag classes.
        if (contentElMutationObserver) {
            // NOTE: Do not hoist the vars, that will pull things in during destruction
            const
                me = this,
                {
                    element,
                    contentElement
                }  = me;

            contentElMutationObserver = new MutationObserver(mutations => me.onContentElMutation(mutations));
            contentElMutationObserver.observe(contentElement, { attributes : true });

            // If our contentElement is an inner element (eg Panel, Toolbar)
            // then styling might apply from classes on the outer element
            // so monitor that too.
            if (contentElement !== element) {
                contentElMutationObserver.observe(element, { attributes : true });
            }

            me.syncFlexDirection();
        }

        return contentElMutationObserver;
    }

    onContentElMutation(mutations) {
        // We can only do it if we are visible, otherwise the computed style won't work
        // and the classes will be removed. Doesn't need doing for card and fit layouts.
        // Only do it if we're not only showing textual content and the mutation is in our contentElement.
        // Note: isVisible test must be last because it's the most expensive by demanding layout information.
        if (boxLayouts[this.layout.type] && !this.textContent && mutations.some(m => this.contentElement.contains(m.target)) && this.isVisible) {
            this.syncFlexDirection();
        }
    }

    changeLayout(config, existingLayout) {
        return Layout.reconfigure(existingLayout, config, {
            owner    : this,
            defaults : {
                owner : this
            }
        });
    }

    // Items to iterate over
    get childItems() {
        return this.items;
    }

    get childItemsOrderedByRelevance() {
        return this.items;
    }

    /**
     * Returns a directly contained widget by id
     * @param {String} id The widget id
     * @returns {Core.widget.Widget}
     */
    getWidgetById(id) {
        return this.widgetMap[id];
    }

    /**
     * This function is called prior to creating widgets, override it in subclasses to allow containers to modify the
     * configuration of each widget.
     *
     * When adding a widget to a container hierarchy, each parent containers' `processWidgetConfig` will be called.
     *
     * Returning `false` from the function prevents the widget from being added at all.
     * @param {ContainerItemConfig} widgetConfig The widget configuration about to be created
     * @param {Core.widget.Container} addingTo The container the widget is being added to
     * @returns {void|Boolean} Return `false` to prevent the widget from being added
     */
    processWidgetConfig(widgetConfig, addingTo) {}

    /**
     * This method combines container {@link #config-defaults}
     * @param {String|ContainerItemConfig} widgetConfig
     * @param {String|Function} [type] The type of widget described by `widgetConfig`.
     * @returns {ContainerItemConfig}
     * @internal
     */
    setupWidgetConfig(widgetConfig, type) {
        const me = this;

        // A string becomes the defaultType (see below) with the html set to the string.
        if (typeof widgetConfig === 'string') {
            widgetConfig = {
                html : widgetConfig
            };
        }
        // An element is encapsulated by a Widget
        else if (widgetConfig.nodeType === Element.ELEMENT_NODE) {
            widgetConfig = {
                element : widgetConfig,
                id      : widgetConfig.id
            };
        }

        if (typeof type === 'string' || !type && (type /* assignment */= widgetConfig.type)) {
            // True/false values are selected using a SlideToggle on mobile if app has imported SlideToggle
            if (type === 'checkbox' && BrowserHelper.isMobile && Widget.resolveType('slidetoggle', true)) {
                type = widgetConfig.type = 'slidetoggle';
            }
            type = Widget.resolveType(type, true);
        }

        // widgetConfig = ObjectHelper.assign({}, me.defaults, widgetConfig, { parent : me });
        widgetConfig = (type || Widget).mergeConfigs(me.defaults, widgetConfig, { parent : me });

        for (let ancestor = widgetConfig.parent; ancestor; ancestor = ancestor.owner) {
            if (ancestor.processWidgetConfig?.(widgetConfig, me) === false) {
                return null;
            }
        }

        if (me.trigger('beforeWidgetCreate', { widgetConfig }) === false) {
            return null;
        }

        return widgetConfig;
    }

    /**
     * This function converts a Widget config object into a Widget.
     * @param {ContainerItemConfig} widget A Widget config object.
     * @internal
     */
    createWidget(widget) {
        const result = Widget.create(this.setupWidgetConfig(widget), this.defaultType);

        // If we created a widget from a config object, then upon items replacement
        // we must destroy outgoing widgets.
        result && (result._createdBy = this);
        return result;
    }

    // Reapply defaults, not used during config
    updateDefaults(defaults, oldDefaults) {
        if (!this.isConfiguring && defaults) {
            const entries = Object.entries(defaults);

            this.eachWidget(widget => {
                entries.forEach(([prop, value]) => {
                    // Apply defaults only if current value matches the old default
                    if (!oldDefaults || widget[prop] === oldDefaults[prop]) {
                        widget[prop] = value;
                    }
                });
            }, false);
        }
    }

    render(...args) {
        // Pull in lazyItems at last second
        this.getConfig('lazyItems');

        this.layout.renderChildren();

        // If called during configuration, the element may not have been available because
        // some non-item widgets (eg, Tools) instantiate and declare themselves through
        // onChildAdd before the element is set.
        // But also there may have been no items because of lazyItems.
        // So do the initial sync at render time.
        this.syncChildCount();

        super.render(...args);
    }

    get focusElement() {
        const { defaultFocus } = this;

        if (typeof defaultFocus === 'string') {
            return this.element.querySelector(defaultFocus);
        }

        // Find first focusable descendant widget that is not our close or collapse tool.
        let firstFocusable = defaultFocus && this.query(defaultFocus);

        if (!defaultFocus || !firstFocusable) {
            firstFocusable = this.query(isFocusable, true, true);
        }

        if (firstFocusable) {
            return firstFocusable.focusElement;
        }
        return super.focusElement;
    }

    doDestroy() {
        this._items?.forEach(widget => {
            if (widget._createdBy && (widget._createdBy === this || widget._createdBy.isDestroyed)) {
                widget.destroy?.();
            }
            else {
                widget.parent = null;
            }
        });
        this.layout.destroy();
        super.doDestroy();
    }

    /**
     * Returns `true` if all contained fields are valid, otherwise `false`
     * @member {Boolean}
     * @readonly
     */
    get isValid() {
        let valid = true;

        this.eachWidget(widget => {
            // Touch each widget so that they all update their invalid state. This is important for required fields
            // since they don't initially complain if they start as empty.
            if ('isValid' in widget && widget.isVisibleForValidation && !widget.isValid) {
                valid = false;
            }
        }, true);

        return valid;
    }

    clearError() {
        this.eachWidget(widget => widget.clearError?.());
    }
}

// Register this widget type with its Factory
Container.initClass();
