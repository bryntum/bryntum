import Container from './Container.js';
import Widget from './Widget.js';
import PanelCollapser from './panel/PanelCollapser.js';
import DomHelper from '../helper/DomHelper.js';
import EventHelper from '../helper/EventHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import StringHelper from '../helper/StringHelper.js';
import DomClassList from '../helper/util/DomClassList.js';
import DynamicObject from '../util/DynamicObject.js';
import State from '../mixin/State.js';
import Toolable from './mixin/Toolable.js';

import './Toolbar.js';

DomHelper.loadStylesheet('Core/widget/Panel.css');

// import Stylesheet from './Panel.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Panel');

/**
 * @module Core/widget/Panel
 */

/**
 * An object that describes a Panel's header.
 *
 * @typedef {Object} PanelHeader
 * @property {String|Object} [cls] Additional CSS class or classes to add to the header element.
 * @property {'top'|'right'|'bottom'|'left'} [dock="top"] Specify "left", "bottom", or "right" to control panel edge to which the header docks.
 * @property {String} title The panel title or raw HTML (not automatically HTML-encoded).
 * @property {String} iconCls A CSS class representing an icon to display in the header
 * @property {'start'|'center'|'end'} [titleAlign="start"] Specify "center" or "end" to align the panel's title differently.
 * @property {CSSStyleConfig} [style] A style string or object to apply to the header
 */

const
    isTabbable     = e => !e.classList.contains('b-focus-trap') && !e.classList.contains('b-hidden') &&
    e.role !== 'presentation' && DomHelper.getFocusability(e, true).focusable ? DomHelper.NodeFilter.FILTER_ACCEPT : DomHelper.NodeFilter.FILTER_SKIP,
    { emptyArray } = Widget,
    emptySplit     = [emptyArray, emptyArray],

    finishBodyWrap = (config, classes, final) => {
        const { vertical } = config;

        delete config.vertical;

        return {
            ...config,
            class : {
                ...classes,
                [`b-${vertical ? 'v' : 'h'}box`] : 1,
                'b-box-center'                   : 1,
                'b-panel-bar-wrap'               : !final
            }
        };
    },

    wrapBody       = (inner, bodyWrapTag, vertical = false) => {
        const wrap = {
            vertical,
            children : inner ? [inner] : []
        };

        if (bodyWrapTag) {
            wrap.tag = bodyWrapTag;
        }

        return wrap;
    },

    setCls         = (elOrConfig, cls) => {
        if (elOrConfig?.classList) {
            elOrConfig?.classList.add(cls);
        }
        else if (elOrConfig?.class) {
            if (typeof elOrConfig.class === 'string') {
                elOrConfig.class = { [elOrConfig.class] : 1 };
            }
            elOrConfig.class[cls] = 1;
        }
    },

    barConfigs     = {
        dock   : 1,
        hidden : 1,
        weight : 1
    },

    dockDirection  = {
        //       [vertical, before]
        top    : [true, true],
        bottom : [true, false],
        left   : [false, true],
        right  : [false, false]
    },

    headerDock     = {
        header       : 1,
        'pre-header' : 1
    },

    directionByDock = {
        top    : 'up',
        right  : 'right',
        bottom : 'down',
        left   : 'left'
    };

/**
 * Panel widget is a general purpose container which may be used to contain child {@link Core.widget.Container#config-items}
 * or {@link Core.widget.Widget#config-html}.
 *
 * {@inlineexample Core/widget/Panel.js}
 *
 * A Panel may also dock a {@link #config-header} and {@link #config-footer} either at top/bottom or left/right:
 *
 * ```javascript
 * const panel = new Panel({
 *   items : {
 *       customerName : { type : 'text', placeholder: 'Text' }
 *   },
 *   header : {
 *       title : 'Customer Details'
 *   }
 * });
 * ```
 *
 * ## Toolbars with buttons and other widgets
 *
 * The Panel has two built-in toolbars, {@link #config-tbar} and {@link #config-bbar}, which are toolbars docked to
 * the top and bottom of the panel. You can easily add any widgets to them using the code below:
 *
 * ```javascript
 * const panel = new Panel({
 *   title : 'A Test Panel',
 *   items : {
 *     customerName : {
 *         type : 'text', placeholder: 'Text'
 *     },
 *   },
 *   bbar : {
 *     items : {
 *       proceedButton : {
 *         text : 'Proceed',
 *         onClick : () => {
 *           alert('Proceeding!');
 *         }
 *       }
 *     }
 * });
 * ```
 *
 * ## Panel with a form
 *
 * You can use a Panel to create forms containing any Bryntum widgets. The Panel can load data into its field from a
 * record since it subclasses the {@link Core/widget/Container} which has a {@link Core.widget.Container#config-record}
 * config.
 *
 * {@inlineexample Core/widget/PanelForm.js}
 *
 * ## Collapsible Panel
 *
 * Panels can also be {@link #config-collapsible}. The collapsible panel can be collapsed and expanded by clicking
 * the icon on the far-right end of the header.
 *
 * {@inlineexample Core/widget/PanelCollapsible.js}
 *
 * ## Panel as a drawer
 *
 * Panels can be used as drawers which slide out from the side of the viewport, by using the {@link #config-drawer}
 * config:
 *
 * {@inlineexample Core/widget/PanelDrawer.js}
 *
 * ## Panel with strips
 *
 * Panels can have {@link #config-strips} docked to the top, right, bottom, or left. Strips are widgets that are docked
 * to the panel's sides. The higher the `weight` assigned to a widget, the closer that widget will be to the panel body.
 *
 * This is useful for adding slide-out containers to the panel. For example, a settings panel shown on the
 * right as seen below (click the hamburger icon to show the settings panel).
 *
 * {@inlineexample Core/widget/PanelStrips.js}
 *
 * @mixes Core/mixin/State
 * @mixes Core/widget/mixin/Toolable
 * @extends Core/widget/Container
 * @classtype panel
 * @widget
 */
export default class Panel extends Container.mixin(State, Toolable) {
    //region Config

    static $name = 'Panel';

    static type = 'panel';

    static configurable = {
        cssVarPrefix : 'b-panel',

        localizableProperties : ['title'],

        /**
         * Custom CSS class name suffixes to apply to the elements rendered by this widget. This may be specified
         * as a space separated string, an array of strings, or as an object in which property names with truthy
         * values are used as the class names.
         *
         * The panel supports a few special UIs, such as `plain` rendition where toolbars and header have no
         * background/borders, and `toolbar`.
         *
         * For example, consider a `Panel` with a `ui` config like so:
         *
         * ```javascript
         *  new Panel({
         *      title : 'Settings',
         *      ui    : 'light'
         *  });
         * ```
         *
         * This will apply the CSS class `'b-panel-ui-light'` to the main element of the panel as well as its many
         * child elements. This allows simpler CSS selectors to match the child elements of this particular panel
         * UI:
         *
         * ```css
         *  .b-panel-content.b-panel-ui-light {
         *      background-color : #eee;
         *  }
         * ```
         *
         * Using the {@link #config-cls cls config} would make matching the content element more complex, and in
         * the presence of {@link Core.widget.Panel#config-strips docked items} and nested panels, impossible to
         * target accurately.
         *
         * @config {'plain'|'toolbar'|String|Object} ui
         * @category CSS
         */

        /**
         * Controls whether the panel is collapsed (the body of the panel is hidden while only the header is
         * visible). Only valid if the panel is {@link #config-collapsible}.
         * @prp {Boolean}
         * @category Layout
         */
        collapsed : {
            value   : null,
            $config : null,
            default : false
        },

        /**
         * This config enables collapsibility for the panel. See {@link #config-collapsed}.
         *
         * For example:
         *
         * ```javascript
         *      {
         *          type        : 'panel',
         *          collapsible : true
         *      }
         * ```
         *
         * This is managed by an instance of {@link Core.widget.panel.PanelCollapser} which can be configured if an
         * object is passed for this config property:
         *
         * ```javascript
         *      {
         *          type        : 'panel',
         *          collapsible : {
         *              direction : 'left'
         *          }
         *      }
         * ```
         *
         * The config object form can contain a `type` property to specify the type of collapse the panel will use.
         * This property can be one of the following:
         *
         * - `'inline'` (see {@link Core.widget.panel.PanelCollapser})
         * - `'overlay'` (see {@link Core.widget.panel.PanelCollapserOverlay})
         *
         * The default `direction` property is inferred from the position of the Panel in a flexbox layout.
         *
         * If the Panel is the last child of a flexbox container, the `direction` is `'right'` for a horizontal
         * flexbox layout and `'down'` for a vertical layout.
         *
         * All other Panels in a flexbox container have the `direction` set to `'left'` for a horizontal layout and
         * `'up'` for a vertical layout.
         *
         * @config {Boolean|PanelCollapserConfig|PanelCollapserOverlayConfig}
         * @category Layout
         */
        collapsible : {
            value   : null,
            $config : 'nullify'
        },

        /**
         * Custom CSS classes to add to the panel's body element.
         *
         * May be specified as a space separated string, or as an object in which property names
         * with truthy values are used as the class names:
         *
         * ```javascript
         *  bodyCls : {
         *      'b-my-class'     : 1,
         *      [this.extraCls]  : 1,
         *      [this.activeCls] : this.isActive
         *  }
         * ```
         *
         * @config {String|Object}
         * @category CSS
         */
        bodyCls : {
            $config : {
                merge : 'classList'
            },

            value : null
        },

        bodyTag     : null,
        bodyWrapTag : null,

        /**
         * By default, tabbing within a Panel is not contained, ie you can TAB out of the Panel
         * forwards or backwards.
         * Configure this as `true` to disallow tabbing out of the Panel, and make tabbing circular within this Panel.
         * @config {Boolean}
         * @default false
         * @category Content
         */
        trapFocus : null,

        /**
         * A title to display in the header or owning TabPanel. Causes creation and docking of a header
         * to the top if no header is configured.
         *
         * If a header has been disabled by configuring the {@link #config-header}as `false`, setting it will have
         * no effect. {@note}The title is not HTML-encoded{/@note}
         *
         * {@note}The title is not HTML-encoded{/@note}
         * @default
         * @prp {String}
         * @category Misc
         */
        title : null,

        /**
         * An icon to show before the {@link #config-title}. Either pass a CSS class as a string, or pass a
         * {@link Core.helper.DomHelper#typedef-DomConfig} object describing an element to represent the icon.
         *
         * @config {String|DomConfig}
         * @category Misc
         */
        icon : null,

        /**
         * A config {@link PanelHeader object} for the panel's header or a string in place of a `title`.
         *
         * Configuring this as `false` explicitly removes the header bar, overriding any
         * {@link #config-tools} or {@link #config-title} configs.
         * @default
         * @config {String|Boolean|PanelHeader}
         * @category Content
         */
        header : null,

        stateful : ['collapsed'],

        /**
         * An object containing config defaults for corresponding {@link #config-strips} objects with a matching name.
         *
         * By default, this object contains the keys `'bbar'` and `'tbar'` to provide default config values for the
         * {@link #config-bbar} and {@link #config-tbar} configs.
         *
         * This object also contains a key named `'*'` with default config properties to apply to all strips. This
         * object provides the default `type` (`'toolbar'`) and {@link Core.widget.Widget#config-dock} (`'top'`)
         * property for strips.
         * @config {Object} stripDefaults
         * @internal
         * @category Content
         */
        stripDefaults : {
            '*' : {
                type : 'toolbar',
                dock : 'top'
            },

            bbar : {
                dock   : 'bottom',
                weight : -1000
            },

            tbar : {
                weight : -1000
            }
        },

        /**
         * An object containing widgets keyed by name. By default (when no `type` is given), strips are
         * {@link Core.widget.Toolbar toolbars}. If you want to pass an array, you can use
         * the toolbar's {@link Core.widget.Container#config-items}.
         *
         * The {@link #config-bbar} and {@link #config-tbar} configs are shortcuts for adding toolbars to the
         * panel's `strips`.
         *
         * Strips are arranged based on their {@link Core.widget.Widget#config-dock} and
         * {@link Core.widget.Widget#config-weight} configs.
         *
         * For widgets using a `dock` of `'top'`, `'bottom'`, `'left'`, `'right'`, `'start'` or `'end'`(an "edge
         * strip"), the higher the `weight` assigned to a widget, the closer that widget will be to the panel body.
         *
         * For widgets with `'header'` or `'pre-header'` for `dock` (a "header strip"), higher `weight` values
         * cause the widget to be placed closer to the panel's title.
         *
         * ```javascript
         *  new Panel({
         *      title : 'Test',
         *      html  : 'Panel strip test',
         *      strips : {
         *          left : {
         *              dock  : 'left'
         *              items : {
         *                  go : {
         *                      text : 'Go'
         *                  }
         *              }
         *          }
         *      }
         *  });
         *
         * // Pass an array to tbar
         * strips : {
         *     tbar : {
         *         items: {
         *             addButton : {
         *                 type : 'button',
         *                 text : 'Add column',
         *                 icon : 'fa fa-plus',
         *                 onAction : ({ source }) => addColumn(source.element)
         *             },
         *             // consider 'getCurrentDate()` a custom function
         *             today : `Today is ${getCurrentDate()}`
         *         }
         *     }
         * }
         * ```
         *
         * @config {Object<String,ContainerItemConfig>} strips
         * @category Content
         */
        strips : {
            value   : null,
            $config : 'nullify'
        },

        toolDefaults : {
            close : {
                weight : -1000
            },

            collapse : {
                weight : -990
            }
        },

        /**
         * Config object of a footer. May contain a `dock`, `html` and a `cls` property. A footer is not a widget,
         * but rather plain HTML that follows the last element of the panel's body and {@link #config-strips}.
         *
         * The `dock` property may be `top`, `right`, `bottom`, `left`, `start` or `end`
         *
         * @config {Object|String}
         * @property {'top'|'right'|'bottom'|'left'|'start'|'end'} dock Where to dock
         * @property {String} html Html to populate the footer with
         * @property {String} cls CSS class to add to the footer
         * @default
         * @category Content
         */
        footer : null,

        /**
         * This config is used with {@link Core.widget.panel.PanelCollapserOverlay} to programmatically control the
         * visibility of the panel's body. In this mode of collapse, the body of a collapsed panel is a floating
         * overlay. Setting this config to `true` will show this element, while `false` will hide it.
         * @config {Boolean}
         * @private
         */
        revealed : null,

        /**
         * The tool Widgets as specified by the {@link #config-tools} configuration
         * (and the {@link Core.widget.Popup#config-closable} configuration in the Popup subclass).
         * Each is a {@link Core.widget.Widget} instance which may be hidden, shown and observed and styled
         * just like any other widget.
         *
         * ```javascript
         * panel.tools.add = {
         *     cls : 'fa fa-plus',
         *     handler() {
         *         // Clicked the tool
         *     }
         * }
         * ```
         *
         * @member {Object<String,Core.widget.Tool>} tools
         * @accepts {Object<String,Core.widget.Tool|ToolConfig|ContainerItemConfig>|null}
         */
        /**
         * The {@link Core.widget.Tool tools} to add either before or after the `title` in the Panel header. Each
         * property name is the reference by which an instantiated tool may be retrieved from the live
         * `{@link Core.widget.mixin.Toolable#property-tools}` property.
         *
         * ```javascript
         * new Panel({
         *     ...
         *     tools : {
         *         add : {
         *             cls : 'fa fa-plus',
         *             handler() {
         *                 // Clicked the tool
         *             }
         *         }
         *     }
         * });
         * ```
         *
         * A tool does not have to be a {@link Core.widget.Tool}. Any widget config is accepted, so a header may for
         * example hold a plain `widget` used as a badge, or a `button`.
         *
         * @config {Object<String,ToolConfig|ContainerItemConfig>|null} tools
         * @category Content
         */

        /**
         * Get toolbar {@link Core.widget.Toolbar} docked to the top of the panel
         * @member {Core.widget.Toolbar} tbar
         * @readonly
         * @category Content
         */
        /**
         * A Config object representing the configuration of a {@link Core.widget.Toolbar},
         * or array of config objects representing the child items of a Toolbar.
         * This creates a toolbar docked to the top of the panel immediately below the header.
         *
         * To add toolbars not docked to the top, see {@link #config-bbar} and {@link #config-strips}.
         *
         * ```javascript
         * // Text only
         * tbar : ['Project Timeline Overview', '->', 'Key Milestones & Deadlines'],
         *
         * // Buttons
         * tbar : [
         *    {
         *       type     : 'button',
         *       ref      : 'addButton',
         *       text     : 'Add column',
         *       icon     : 'fa fa-plus',
         *       tooltip  : 'Add new column',
         *       onAction : ({ source }) => addColumn(source.element) // add new column
         *   },
         *   {
         *       type     : 'button',
         *       ref      : 'removeButton',
         *       text     : 'Remove last',
         *       icon     : 'fa fa-minus',
         *       tooltip  : 'Remove last column',
         *       onAction : () => grid.columns.count > 1 && grid.columns.last.remove() // remove last column
         *   }
         * ]
         *
         * // ToolbarConfig
         * tbar : {
         *     height : '4em',
         *     items  : {
         *         button1 : { text : 'A button', icon : 'fa fa-plus' },
         *         button2 : { text : 'Right button 1', icon : 'fa fa-trash', style : 'margin-inline-start:auto' },
         *         button3 : { icon : 'fa fa-gear' }
         *     }
         * }
         * ```
         *
         * @config {Array<ContainerItemConfig|String>|ToolbarConfig|null}
         * @ts-returns {Array<ContainerItemConfig|String>|ToolbarConfig|PagingToolbarConfig|null}
         * @category Content
         */
        tbar : null,

        /**
         * Get toolbar {@link Core.widget.Toolbar} docked to the bottom of the panel
         * @member {Core.widget.Toolbar} bbar
         * @readonly
         * @category Content
         */
        /**
         * A Config object representing the configuration of a {@link Core.widget.Toolbar},
         * or array of config objects representing the child items of a Toolbar. Another way to add a bbar is to use {@link #config-strips}.
         *
         * ```javascript
         * // Text only
         * bbar : [`Total number of students: ${totalStds}`, '->', `Passed Students: ${passedStds}`],
         *
         * // Buttons
         * bbar : [
         *    {
         *       type     : 'button',
         *       ref      : 'addButton',
         *       text     : 'Add column',
         *       icon     : 'fa fa-plus',
         *       tooltip  : 'Add new column',
         *       onAction : ({ source }) => addColumn(source.element) // add new column
         *   },
         *   {
         *       type     : 'button',
         *       ref      : 'removeButton',
         *       text     : 'Remove last',
         *       icon     : 'fa fa-minus',
         *       tooltip  : 'Remove last column',
         *       onAction : () => grid.columns.count > 1 && grid.columns.last.remove() // remove last column
         *   }
         * ]
         *
         * // ToolbarConfig
         * bbar : {
         *     height : '4em',
         *     items  : {
         *         button1 : { text : 'A button', icon : 'fa fa-plus' },
         *         button2 : { text : 'Right button 1', icon : 'fa fa-trash', style : 'margin-inline-start:auto' },
         *         button3 : { icon : 'fa fa-gear' }
         *     }
         * }
         * ```
         *
         * This creates a toolbar docked to the bottom of the panel immediately above the footer.
         * @config {Array<ContainerItemConfig|String>|ToolbarConfig|null}
         * @ts-returns {Array<ContainerItemConfig|String>|ToolbarConfig|PagingToolbarConfig|null}
         * @category Content
         */
        bbar : null,

        role : null,

        /**
         * Make this Panel a docked drawer which slides out from one side of the browser viewport by default.
         *
         * If this Panel is a child of another widget, the drawer will slide out from the side of the parent widget.
         *
         * By default, it floats above the content of its host. If you want the drawer to be inline within the host,
         * consuming content space in the host, set the `drawer`&nbsp;`inline` property to `true`.
         *
         * {@inlineexample Core/widget/PanelDrawer.js}
         *
         * @config {Boolean|Object}
         * @param {'start'|'left'|'end'|'right'|'top'|'bottom'} [side='end'] The side of the viewport to dock the drawer to.
         * - `'start'` means the `inline-start` side.
         * - `'end'` means the `inline-end` side.
         * @param {String|Number} [size='30em'] The size of the drawer in its collapsible axis.
         * @param {Boolean} [inline=false] If using the {@link #config-appendTo} config to place the drawer inside a host
         * widget, this may be set to `true` to make the drawer inline within that host. Note that, if using this, the
         * layout of the host element must have `flex-direction` set appropriately.
         * @param {Boolean|Object} [autoClose] Specifies what user actions should automatically close the drawer. Defaults to closing
         * when the user clicks outside of the drawer or when focus moves outside of the drawer.
         * @param {Boolean|String} [autoClose.mousedown] If the user clicks outside of the drawer, the drawer will automatically be hidden.
         * If the value is a string, it is used as a CSS selector to filter clicks which should close the drawer.
         * @param {Boolean|String} [autoClose.focusout] If focus moves outside of the drawer, the drawer will automatically be hidden.
         * @param {String} [autoClose.mouseout] Hides the drawer when the mouse leaves the drawer after the `autoCloseDelay` period.
         * @param {Number} [autoCloseDelay=1000] When using `mouseout`, this is the delay in milliseconds
         */
        drawer : {
            $config : 'lazy',
            value   : null
        }
    };

    //endregion

    /**
     * A header {@link #config-tools tool} has been clicked.
     * @event toolClick
     * @param {Core.widget.Tool} source - This Panel.
     * @param {Core.widget.Tool} tool - The tool which is being clicked.
     */

    /**
     * Fires when a Panel is collapsed using the {@link Core.widget.Panel#config-collapsible} setting.
     * @event collapse
     * @param {Core.widget.Panel} source - This Panel.
     */
    /**
     * Fires when a Panel is expanded using the {@link Core.widget.Panel#config-collapsible} setting.
     * @event expand
     * @param {Core.widget.Panel} source - This Panel.
     */

    //region Composition

    extractBackgroundColor() {
        this.bodyElement.style.setProperty('--b-parent-background-color', 'var(--b-panel-background-color)');
    }

    get bodyWrapRootElement() {
        return this[this._bodyWrapRootName];
    }

    changeFooter(footer) {
        if (footer) {
            if (footer.dock === 'start') {
                footer.dock = 'left';
            }
            else if (footer.dock === 'end') {
                footer.dock = 'right';
            }
        }

        return footer;
    }

    compose() {
        const
            me = this,
            { collapsible, focusable, revealed, tools, floating } = me,
            header = me.composeHeader(),
            afters = me.getPositionableItems('after', true),
            befores = me.getPositionableItems('before', true),
            horz = header?.class['b-dock-left'] || header?.class['b-dock-right'],
            titleEl = header?.children?.[0],
            defaultRole = floating ? 'dialog' : 'region';

        let body = me.composeBody(),
            key  = 'bodyWrapElement';

        if (collapsible) {
            [key, body] = collapsible.wrapCollapser(key, body);
        }

        me._bodyWrapRootName = key;

        // Ensure the ariaElement setting is ingested so that we can test it below.
        me.getConfig('ariaElement');

        const
            resultIsAriaElement = me._ariaElement === 'element',
            result              = {
                // Floaters have to be focusable using pointer events, but *not* tabbable, so -1
                // Otherwise, focusable means tabbable so that would be 0
                tabIndex : ((floating || me.peekConfig('positioned') || me.positioned) && focusable !== false) ? -1 : focusable ? 0 : null,

                class : {
                    [`b-panel-collapsible-${collapsible?.type}`]     : collapsible,
                    [`b-panel-collapse-${collapsible?.collapseDir}`] : collapsible,
                    [`b-${horz ? 'h' : 'v'}box`]                     : 1,
                    'b-panel-collapsible'                            : collapsible,
                    'b-panel-has-header'                             : header,
                    'b-panel-has-tools'                              : tools ? 1 : 0,
                    'b-panel-overlay-revealed'                       : revealed
                },

                children : {
                    topFocusTrap : {
                        role     : 'presentation',
                        tabIndex : 0,
                        class    : {
                            'b-focus-trap'     : 1,
                            'b-top-focus-trap' : 1
                        }
                    },

                    ...befores,

                    // Note: we always put header before bodyWrap since it is likely (though untested) to be better for
                    // a11y. We use flexbox order to make the right/bottom docking appear correct but it is likely that
                    // the DOM order of the <header> element vs (optional) <footer> is important to screen readers.
                    headerElement : header,

                    [key] : body,

                    ...afters,

                    bottomFocusTrap : {
                        role     : 'presentation',
                        tabIndex : 0,
                        class    : {
                            'b-focus-trap'     : 1,
                            'b-end-focus-trap' : 1
                        }
                    }
                }
            };

        // If the ariaElement is some inner element, then the role will be set in updateRole.
        // If it is the element, then we set the role here.
        if (resultIsAriaElement) {
            result.role = me.role || defaultRole;
        }
        // role="dialog" MUST have an accessible name, so if we have a title, we will use that.
        // If we are just a Panel, then always will use the default role of "region".
        else if (titleEl || defaultRole === 'region') {
            result.role = defaultRole;
        }

        if (titleEl && !(me.ariaLabel && resultIsAriaElement)) {
            result['aria-labelledby'] = titleEl.id;
        }
        return result;
    }

    updateElement(...args) {
        // Ingest this only after we have an element
        this.getConfig('drawer');

        super.updateElement(...args);
    }

    updateDrawer(drawer) {
        let { side = 'end' } = drawer;

        const
            me               = this,
            { inline }       = drawer,
            { element, rtl } = me,
            appendTo         = me.getRenderContext()[0] || (inline ? document.body : null),
            // If we are a child of a Container, or being explicitly rendered to a DOM element, we are positioned
            // otherwise we are floating
            posType          = me.parent || (appendTo && !inline) ? 'positioned' : 'floating';

        side = side === 'start' ? (rtl ? 'right' : 'left') : side === 'end' ? (rtl ? 'left' : 'right') : side;

        me.updateConfiguration({
            // Clear any configs which are not valid for a drawer
            // A Popup may be configured as a drawer, and Popups have these by default.
            forElement    : null,
            closable      : false,
            align         : null,
            autoShow      : false,
            monitorResize : false,
            centered      : false,
            anchor        : false,
            hidden        : false,
            draggable     : false,

            appendTo    : appendTo || me.owner?.floatRoot || me.floatRoot,
            hideMode    : 'collapse',
            trapFocus   : true,
            [posType]   : !inline,
            collapsed   : (typeof drawer === 'object' &&  ('collapsed' in drawer)) ? drawer.collapsed : true,
            collapsible : ObjectHelper.merge({
                autoClose : {
                    mousedown : true,
                    focusout  : true,
                    mouseout  : false
                },
                type      : inline ? 'inline' : 'overlay',
                direction : directionByDock[side || 'end']
            }, drawer)
        });

        element.classList.add('b-drawer-panel');
        element.classList.remove('b-popup');
        element.style.setProperty('--b-drawer-size', DomHelper.setLength(drawer?.size));

        // When used as a drawer, reveal and unreveal are the same as show and hide for an observer
        me.ion({
            thisObj            : me,
            // We must be the last to act on beforeToggleReveal to allow vetoing of the reveal.
            // Use asap option to jump past the beginning of the reveal process so that
            // this Panel will be found to be visible when triggerShow is called.
            beforeToggleReveal : {
                fn   : ({ reveal }) => reveal && me.triggerShow(),
                asap : true,
                prio : -999999
            }
        });
    }

    get isVisible() {
        // If a drawer, only visible if not collapsed or revealed
        return (!this.drawer || (!this.collapsible.collapsed || this.revealed)) && super.isVisible;
    }

    // Override for when this Panel is a drawer. Hide collapses/unreveals the drawer.
    hide(...args) {
        const me = this;

        if (me.drawer) {
            if (me.trigger('beforeHide') !== false) {
                const result = me.collapsible.type === 'inline' ? me.collapse() : me.collapsible.toggleReveal(false);

                me.triggerHide();

                return result;
            }
        }
        else {
            return super.hide(...args);
        }
    }

    // Override for when this Panel is a drawer. Show expands/reveals the drawer.
    show(...args) {
        const me = this;

        if (me.drawer) {
            if (me.trigger('beforeShow') !== false) {
                const result = me.collapsible.type === 'inline' ? me.expand() : me.collapsible.toggleReveal(true);

                me.afterShow();
                me.focus();

                return result;
            }
        }
        else {
            return super.show(...args);
        }
    }

    showBy(...args) {
        if (this.drawer) {
            return this.show();
        }
        return super.showBy(...args);
    }

    composeBody() {
        const
            me                                                        = this,
            { bodyCls, bodyConfig, bodyWrapTag, footer, uiClassList } = me,
            strips                                                    = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn),
            innermostStrips                                           = {
                top    : null,
                right  : null,
                bottom : null,
                left   : null
            };

        let bar, before, dock, i, name, vertical, wrap;

        if (footer) {
            dock = footer.dock || 'bottom';

            strips.unshift({
                dock,
                element : {
                    tag       : 'footer',
                    reference : 'footerElement',
                    html      : (typeof footer === 'string') ? footer : footer.html,
                    class     : {
                        ...uiClassList,
                        [`b-dock-${dock}`]      : 1,
                        [`${footer.cls || ''}`] : 1
                    }
                }
            });
        }

        if (bodyCls) {
            if (!bodyConfig[name = 'className']) {
                name = 'class';
            }

            bodyConfig[name] = new DomClassList(bodyConfig[name]).assign(bodyCls);
        }

        /*
         The higher the weight, the closer to the center we place the toolbar. Consider:

         {
            tbar : ...,
            bbar : ...,
            strips : {
               lbar1 : { weight : 10, ... },
               tbar2 : { weight : 20, ... },
               lbar2 : { weight : 30, ... },
               rbar  : { weight : 40, ... }
            }
         }

         +---------------------------------------------------+
         | tbar                                              |
         +---------+-----------------------------------------+
         |         | tbar2                                   |
         |         +---------+----------------------+--------+
         |         |         |                      |        |
         |  lbar1  |         |                      |        |
         |         |  lbar2  |                      |  rbar  |
         |         |         |                      |        |
         |         |         |                      |        |
         +---------+---------+----------------------+--------+
         | bbar                                              |
         +---------------------------------------------------+
         */
        for (i = strips.length; i-- > 0; /* empty */) {
            bar = strips[i];
            [vertical, before] = dockDirection[bar.dock];

            if (!wrap) {
                wrap = wrapBody(bodyConfig, bodyWrapTag, vertical);
            }
            else if (wrap.vertical !== vertical) {
                wrap = wrapBody(finishBodyWrap(wrap, uiClassList), '', vertical);
            }

            wrap.children[before ? 'unshift' : 'push'](bar.element);
            innermostStrips[bar.dock] = bar;
        }

        // Flag strips which touch the bodyElement
        setCls(innermostStrips.top, 'b-innermost');
        setCls(innermostStrips.right, 'b-innermost');
        setCls(innermostStrips.bottom, 'b-innermost');
        setCls(innermostStrips.left, 'b-innermost');

        const body = finishBodyWrap(wrap || wrapBody(bodyConfig, bodyWrapTag), uiClassList, true);

        body.class[`${me.layout?.containerCls}-panel`] = Boolean(me.layout?.containerCls);
        body.class['b-panel-body-wrap'] = 1;
        body.class[StringHelper.cls`b-${me.$$cssName}-body-wrap`] = 1;

        return body;
    }

    get hasHeader() {
        // Shortcut to avoid instantiating tools if header has been configured away
        if (this.header === false) {
            return false;
        }
        const
            { header, title, tools, parent } = this,
            hasVisibleTools                  = this.maximizable || Object.values(tools || {}).some(tool => !tool.hidden);

        // Explicitly declared header should always be shown.
        // Implicitly created from title or tools can be suppressed by parent.
        // Explicitly disabled header using false should mean no header at all.
        return header || (!parent?.suppressChildHeaders && (title || hasVisibleTools));
    }

    get rootUiClass() {
        return Panel;
    }

    changeHeader(header) {
        return (typeof header === 'string') ? { title : header } : header;
    }

    composeHeader(force) {
        const me = this;

        // Don't add a header unless we have one configured, have a title or have visible tools (or are forced to)
        if (!me.hasHeader && !force) {
            return;
        }

        const
            header          = me.header || {},
            dock            = header.dock || 'top',
            [before, after] = me.splitHeaderItems({ as : 'element', dock }),
            classes         = me.$meta.hierarchy,
            cls             = new DomClassList({
                [`b-dock-${dock}`] : 1,
                ...me.uiClassList
            }, header.cls);
        let title = me.composeTitle(header),
            i, name;

        for (i = classes.indexOf(Panel); i < classes.length; ++i) {
            name = classes[i].$$cssName;

            if (name !== 'Grid') {
                cls[StringHelper.cls`b-${name}-header`] = 1;
            }
        }

        title = Array.isArray(title) ? title : [title];

        const headerConfig = {
            ...header,
            tag      : 'header',
            class    : cls,
            children : [
                ...before,
                ...title,
                ...after
            ]
        };

        return me.collapsible?.composeHeader(headerConfig) || headerConfig;
    }

    composeTitle(header) {
        const
            me          = this,
            title       = (typeof header === 'string') ? header : (me.title || header.title),
            { iconCls } = header,
            isHTML      = StringHelper.isHtml(title),
            titleConfig = {
                role        : null,
                reference   : 'titleElement',
                id          : `${me.id}-panel-title`,
                'aria-live' : 'polite',
                class       : {
                    [`b-align-${header.titleAlign || 'start'}`] : 1,
                    'b-header-title'                            : 1,
                    'b-header-html-title'                       : isHTML || iconCls,
                    'b-header-empty-title'                      : title == null || title === '',
                    ...me.uiClassList
                }
            };

        let { icon } = me;

        if (title) {
            if (ObjectHelper.isObject(title)) {
                ObjectHelper.merge(titleConfig, title);
            }
            else if (iconCls) {
                titleConfig.children = [{ tag : 'i', class : 'b-panel-title-icon ' + iconCls }, title];
            }
            else {
                titleConfig[isHTML ? 'html' : 'text'] = title;
            }
        }

        const config = [me.collapsible?.composeTitle(titleConfig) || titleConfig];

        if (icon) {
            if (typeof icon === 'string') {
                const cls = new DomClassList(icon);
                icon = { tag : 'i', class : cls };
            }
            else {
                icon.class = new DomClassList(icon.class);
            }

            icon.class.add('b-panel-title-icon');

            config.unshift(icon);
        }

        return config;
    }

    // Needed to make title go through recompose
    updateTitle() {}

    afterRecompose() {
        super.afterRecompose();

        this.syncHeaderClickListener();
    }

    syncHeaderClickListener() {
        const
            me                = this,
            { headerElement } = me;

        me._headerClickDetacher?.();
        me._headerClickDetacher = headerElement && EventHelper.on({
            element : headerElement,
            // Click might have lead to panel being destroyed (clicking close tool with `closeAction : 'destroy'`)
            click   : ev => me.trigger?.('panelHeaderClick', { event : ev })
        });
    }

    onPanelHeaderClick(info) {
        this.collapsible?.onPanelHeaderClick(info);
    }

    onInternalPaint(...args) {
        super.onInternalPaint(...args);

        this.collapsible?.onPanelPaint(this);
    }

    splitHeaderItems({ as, dock, alt } = Widget.emptyObject) {
        const
            me            = this,
            asElement     = as === 'element',
            { collapsed } = me,
            endTools      = me.getEndTools({ alt }),
            startTools    = me.getStartTools({ alt }),
            strips        = ObjectHelper.values(me.strips,
                (k, v) => !headerDock[v?.dock] && v.isCollapsified({ collapsed, alt }));

        let ret = emptySplit,
            after, before, i;

        if (strips.length + endTools.length + startTools.length) {
            // The "natural" order of equal weight tools/strips is: tool -> strip -> header <- strip <- tool
            ret = [
                // the problem w/mixing tools and strips is the strip weight needs to do two jobs (one when docked
                // in the body and one when docked in the header)
                before = [
                    ...startTools,
                    ...strips.filter(e => e.dock === 'pre-header').sort(me.byWeightSortFn)
                ],
                after = [
                    ...strips.filter(e => e.dock === 'header').sort(me.byWeightReverseSortFn),
                    ...endTools
                ]
            ];

            for (i = 0; i < before.length; ++i) {
                dock && before[i].syncRotationToDock?.(dock);

                if (asElement) {
                    before[i] = before[i].element;
                }
            }

            for (i = 0; i < after.length; ++i) {
                dock && after[i].syncRotationToDock?.(dock);

                if (asElement) {
                    after[i] = after[i].element;
                }
            }
        }

        return ret;
    }

    set bodyConfig(bodyConfig) {
        this._bodyConfig = bodyConfig;
    }

    get bodyConfig() {
        const
            me          = this,
            { bodyTag } = me,
            result      = ObjectHelper.merge({
                reference : 'bodyElement',
                className : {
                    ...me.getStaticWidgetClasses(Panel, '-content'),
                    'b-box-center'   : 1,
                    'b-text-content' : me.textContent && me.hasNoChildren
                }
            }, me._bodyConfig);

        if (bodyTag) {
            result.tag = bodyTag;
        }

        return result;
    }

    //endregion
    //region Configs

    changeBodyCls(cls) {
        return DomClassList.from(cls);
    }

    changeTbar(bar) {
        this.getConfig('strips');

        this.strips = {
            tbar : bar
        };

        return this.strips.tbar;
    }

    changeBbar(bar) {
        this.getConfig('strips');

        this.strips = {
            bbar : bar
        };

        return this.strips.bbar;
    }

    // Override to iterate docked Toolbars in the correct order around contained widgets.
    get childItems() {
        const
            me                = this,
            strips            = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn),
            [before, after]   = me.splitHeaderItems(),  // tools and header strips
            [before2, after2] = me.collapsible?.splitHeaderItems() || emptySplit;

        return [
            ...before,
            ...before2,
            ...after,
            ...after2,
            ...strips.filter(b => dockDirection[b.dock][1]),  // the "before" strips come before the items
            ...me.items,
            ...strips.filter(b => !dockDirection[b.dock][1]).reverse()
        ];
    }

    get childItemsOrderedByRelevance() {
        const
            me                = this,
            strips            = ObjectHelper.values(me.strips, (k, v) => !dockDirection[v?.dock]).sort(me.byWeightSortFn),
            [before, after]   = me.splitHeaderItems(),  // tools and header strips
            [before2, after2] = me.collapsible?.splitHeaderItems() || emptySplit;

        return [
            ...me.items,
            ...strips.filter(b => !dockDirection[b.dock][1]).reverse(),
            ...before,
            ...before2,
            ...after,
            ...after2,
            ...strips.filter(b => dockDirection[b.dock][1])
        ];
    }

    changeStrips(strips, oldStrips) {
        const
            me      = this,
            manager = me.$strips || (me.$strips = new DynamicObject({
                configName : 'strips',
                factory    : Widget,
                inferType  : false,  // the name of a bar in the strips object is not its type
                owner      : me,

                created(instance) {
                    const { dock } = instance;

                    if (!headerDock[dock] && !dockDirection[dock]) {
                        throw new Error(
                            `Invalid dock value "${dock}"; must be: top, left, right, bottom, header, or pre-header`);
                    }

                    FunctionHelper.after(instance, 'onConfigChange', (ret, { name }) => {
                        if (barConfigs[name]) {
                            me.onConfigChange({
                                name  : 'strips',
                                value : manager.target
                            });
                        }
                    });

                    instance.innerItem = false;
                    me.onChildAdd(instance);

                    instance.parent = me;  // in case we are given an instanced widget
                    instance.layout?.renderChildren();

                    if (instance.hasItems) {
                        me.hasItems = true;
                    }
                },

                setup(config, name) {
                    config = ObjectHelper.merge(ObjectHelper.clone(me.stripDefaults['*']), me.stripDefaults[name], config);

                    config.parent = me;  // so parent can be accessed during construction
                    config.ref = name;

                    return config;
                },

                transform(config) {
                    if (Array.isArray(config)) {
                        config = {
                            items : config
                        };
                    }

                    return config || null;
                }
            }));

        manager.update(strips);

        if (!oldStrips) {
            // Only return the target once. Further calls are processed above so we need to return undefined to ensure
            // onConfigChange is called. By returning the same target on 2nd+ call, it passes the === test and won't
            // trigger onConfigChange.
            return manager.target;
        }
    }

    //endregion
    //region Collapse/Expand

    /**
     * This property is `true` if the panel is currently collapsing.
     * @member {Boolean}
     * @readonly
     * @category Layout
     */
    get collapsing() {
        return this.collapsible?.collapsing;
    }

    /**
     * This property is `true` if the panel is currently either collapsing or expanding.
     * @member {Boolean}
     * @readonly
     * @internal
     * @category Layout
     */
    get collapsingExpanding() {
        return this.collapsible?.collapsingExpanding;
    }

    /**
     * This property is `true` if the panel is currently expanding.
     * @member {Boolean}
     * @readonly
     * @category Layout
     */
    get expanding() {
        return this.collapsible?.expanding;
    }

    changeCollapsed(value) {
        const
            me              = this,
            { collapsible } = me;

        me.recompose.flush();

        value = Boolean(value);

        if (!collapsible || me.changingCollapse || !me.isPainted) {  // if (the collapser is asking...)
            return value;
        }

        collapsible?.collapse({
            animation : null,
            collapsed : value
        });
    }

    changeCollapsible(collapsible, was) {
        const me = this;

        me.getConfig('tools');

        if (collapsible) {
            if (collapsible === true) {
                collapsible = {};
            }
            else if (typeof collapsible === 'string') {
                collapsible = {
                    [dockDirection[collapsible] ? 'direction' : 'type'] : collapsible
                };
            }
        }

        return PanelCollapser.reconfigure(was, collapsible, {
            owner    : me,
            defaults : {
                panel : me
            },
            cleanup() {
                // If collapsibility is being removed, then on destroy
                // of the existing collapser, expand the panel
                if (me.collapsed && !collapsible) {
                    was.collapse({
                        animation : null,
                        collapsed : false
                    });
                    me._collapsed = 1;
                }
            }
        });
    }

    updateCollapsible(collapsible) {
        const
            me    = this,
            tools = collapsible?.toolsConfig;

        me.tools = {
            collapse   : tools?.collapse || null,
            recollapse : tools?.recollapse || null
        };

        if (collapsible && me.isPainted && me.collapsed) {
            me._collapsed = 1;
        }

        if (me.collapsed === 1) {
            me.collapsed = true;
        }
    }

    _collapse(collapsed, options) {
        if (options !== true && options !== undefined) {
            // allow expand(false) to be equivalent to collapse(true)
            // or collapse(false) to be equivalent to expand(true)
            if (options === false) {
                collapsed.collapsed = !collapsed.collapsed;
            }
            else if (typeof options === 'number') {
                collapsed.animation = {
                    duration : options
                };
            }
            else if (options === null) {
                collapsed.animation = options;
            }
            else if (options === true) {
                // ignore
            }
            // Must be an options object...
            else if ('animation' in options) {
                ObjectHelper.merge(collapsed, options);
            }
            else {
                collapsed.animation = options;
            }
        }

        return this.collapsible?.collapse(collapsed);
    }

    collapse(options) {
        return this.collapsePanel(options);
    }

    expand(options) {
        return this.expandPanel(options);
    }

    /**
     * Collapse the panel.
     * @async
     */
    collapsePanel(options) {
        return this._collapse({ collapsed : true }, options);
    }

    /**
     * Expand the panel.
     * @async
     */
    expandPanel(options) {
        return this._collapse({ collapsed : false }, options);
    }

    /**
     * Toggles collapsed state of the panel.
     * @param {Boolean} [collapse] Pass `true` to collapse or `false` to expand the panel, or omit to toggle.
     * @privateparam [options] options object with animation config (for internal use)
     * @returns {Promise<Boolean>} A `Promise` yielding `true` if the panel reached the requested collapsed/expanded
     * state, or `false` if the change was superseded (e.g. reverted by an opposing call) before completing
     * @category Misc
     */
    toggleCollapsed(collapse, options) {
        const me = this;
        if (typeof collapse === 'boolean') {
            return collapse ? me.collapsePanel(options) : me.expandPanel(options);
        }
        return me.collapsed ? me.expandPanel(options) : me.collapsePanel(options);
    }

    //endregion
    //region Misc

    get expandedHeaderDock() {
        return this._expandedHeaderDock ?? this.initialConfig.header?.dock ?? 'top';
    }

    set expandedHeaderDock(v) {
        this._expandedHeaderDock = v?.toLowerCase();
    }

    updateHeader(header) {
        if (!this.changingCollapse) {
            this.expandedHeaderDock = header?.dock;
        }
    }

    updateTrapFocus(trapFocus) {
        const
            me            = this,
            { element }   = me,
            { classList } = element,
            before        = trapFocus === 'before',
            after         = trapFocus === 'after';

        // partial focus traps can be used to detect tabbing into a panel that may not be visible (as in a Carousel)
        classList.toggle('b-focus-trapped', trapFocus && !before && !after);
        classList.toggle('b-focus-trapped-before', before);
        classList.toggle('b-focus-trapped-after', after);

        me.focusTrapListener = me.focusTrapListener?.();
        me[trapFocus ? 'addKeyBinding' : 'removeKeyBinding']('shift+Tab', 'trapTabOut');

        if (trapFocus) {
            me.focusTrapListener = EventHelper.on({
                element,
                focusin  : 'onFocusTrapped',
                delegate : '.b-focus-trap',
                thisObj  : me
            });

            if (!me.treeWalker) {
                me.treeWalker = me.setupTreeWalker(element, DomHelper.NodeFilter.SHOW_ELEMENT, isTabbable);
            }
        }
    }

    setupTreeWalker(root, whatToShow, filter) {
        return document.createTreeWalker(root, whatToShow, filter);
    }

    trapTabOut(event) {
        if (event.target === this.element) {
            event.preventDefault();
            this.bottomFocusTrap.focus();
        }
        else {
            return false;
        }
    }

    onFocusTrapped(event) {
        const
            me         = this,
            { target } = event,
            treeWalker = me.treeWalker,
            // The only way of focusing these invisible elements is by TAB-ing to them, but
            // it may be the focus trap of a child widget...
            bottom     = target === me.bottomFocusTrap,
            top        = target === me.topFocusTrap;

        if (me.trigger('focusTrap', { target, bottom, top }) !== false) {
            // The focusTrap event allows the focusTrap elements to serve as entry/exit detectors. If used in this manner,
            // the event listener will return false to prevent further processing.
            if (top || bottom) {
                if (bottom || (event.relatedTarget === me.element && event.shiftKey)) {
                    // If we hit the bottom one, wrap to the top.
                    treeWalker.currentNode = me.topFocusTrap;
                    treeWalker.nextNode();
                }
                else {
                    // If we hit the top one, wrap to the bottom.
                    treeWalker.currentNode = me.bottomFocusTrap;
                    treeWalker.previousNode();
                }

                me.requestAnimationFrame(() => treeWalker.currentNode.focus());
            }
        }
    }

    get focusElement() {
        // Either use our Containerness to yield the focus element of
        // a descendant or fall back to the encapsulating element.
        return this.hasItems && (super.focusElement || this.element);
    }

    /**
     * This Panel's header element. This is the element which contains the {@link #config-title}, the
     * {@link #config-tools} and any header-docked widgets. It is `undefined` when the header is configured away.
     * @member {HTMLElement} headerElement
     * @readonly
     * @category DOM
     * @advanced
     */

    get contentElement() {
        return this.element && this.bodyElement;
    }

    getPositionableLocation(position) {
        let parentElement, insertBefore;

        if (position === 'before') {
            insertBefore = this.headerElement || this.bodyWrapRootElement;
        }
        else if (position === 'after') {
            insertBefore = this.bottomFocusTrap;
        }
        else {
            parentElement = this.contentElement;
        }

        return [parentElement, insertBefore];
    }

    get widgetClassList() {
        const
            me     = this,
            result = super.widgetClassList;

        if (me.hasHeader) {
            result.push('b-panel-has-header', `b-header-dock-${me.header?.dock || 'top'}`);
        }

        if (me.tbar) {
            result.push('b-panel-has-top-toolbar');
        }

        if (me.bbar) {
            result.push('b-panel-has-bottom-toolbar');
        }

        return result;
    }
}

// Register this widget type with its Factory
Panel.initClass();
