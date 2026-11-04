//region Import

import Base from '../../Core/Base.js';

import AjaxStore from '../../Core/data/AjaxStore.js';
import DomDataStore from '../../Core/data/DomDataStore.js';
import Store from '../../Core/data/Store.js';

import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import ScrollManager from '../../Core/util/ScrollManager.js';

import Mask from '../../Core/widget/Mask.js';
import Panel from '../../Core/widget/Panel.js';
import GlobalEvents from '../../Core/GlobalEvents.js';

import LocaleManager from '../../Core/localization/LocaleManager.js';
import Pluggable from '../../Core/mixin/Pluggable.js';
import Transitionable from '../../Core/widget/mixin/Transitionable.js';
import State from '../../Core/mixin/State.js';
import ColumnStore, { columnResizeEvent } from '../data/ColumnStore.js';
import GridRowModel from '../data/GridRowModel.js';
import RowManager from '../row/RowManager.js';
import GridScroller from '../util/GridScroller.js';
import GridLocation from '../util/GridLocation.js';
import Header from './Header.js';
import Footer from './Footer.js';

import GridElementEvents from './mixin/GridElementEvents.js';
import Featureable from '../../Core/mixin/Featureable.js';
import GridFeature from '../feature/GridFeature.js';
import GridNavigation from './mixin/GridNavigation.js';
import GridResponsive from './mixin/GridResponsive.js';
import GridSelection from './mixin/GridSelection.js';
import GridState from './mixin/GridState.js';
import GridSubGrids from './mixin/GridSubGrids.js';
import LoadMaskable from '../../Core/mixin/LoadMaskable.js';
import Tierable from '../../Core/mixin/Tierable.js';
import TimeZonable from '../../Core/mixin/TimeZonable.js';

import Column from '../column/Column.js';

// Needed since Grid now has its own localization
import '../localization/En.js';


DomHelper.loadStylesheet('Grid/view/GridBase.css');

// import Stylesheet from './GridBase.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'GridBase');

//endregion

/**
 * @module Grid/view/GridBase
 */

/**
 * Additional options for the {@link Grid.view.GridBase#config-preserveScroll} configuration.
 *
 * @typedef {Object} PreserveScrollOptions
 * @property {Boolean} overscroll When there is not enough content remaining in the viewport to preserve the current
 * scroll position (for example, if rows below have been removed), allow the viewport to temporarily include empty
 * space beyond the available content, in order to avoid scrolling.
 */

/**
 * Config object that specifies empty text configuration.
 *
 * @typedef {DomConfig} EmptyTextDomConfig
 * @property {'locked'|'normal'|String} [region] The grid region to add the empty text to
 */

const
    resolvedPromise       = new Promise(resolve => resolve()),
    storeListenerName     = 'GridBase:store',
    defaultScrollOptions  = {
        block  : 'nearest',
        inline : 'nearest'
    },
    datasetReplaceActions = {
        dataset  : 1,
        pageLoad : 1,
        filter   : 1
    },
    fullRefreshAfterUpdateFields = {
        hidden     : 1,
        mergeCells : 1,
        region     : 1
    },
    emptyArray            = Object.freeze([]),
    ascending             = (l, r) => l - r;

/**
 * @typedef {Object} GridScrollOptions
 * @property {'start'|'end'|'center'|'nearest'} [block] How far to scroll the element.
 * @property {Number} [edgeOffset] edgeOffset A margin around the element or rectangle to bring into view.
 * @property {AnimateScrollOptions|Boolean|Number} [animate] Set to `true` to animate the scroll by 300ms,
 * or the number of milliseconds to animate over, or an animation config object.
 * @property {Boolean|Function|String} [highlight] Set to `true` to highlight the element when it is in view.
 * May be a function or the name of a method which is called passing an array of elements, to provide customized highlighting.
 * The function will be called with *an array of* row elements as an argument.
 * @property {Boolean} [focus] Set to `true` to focus the element when it is in view.
 * @property {Boolean} [x] Pass as `false` to disable scrolling in the `X` axis.
 * @property {Boolean} [y] Pass as `false` to disable scrolling in the `Y` axis.
 * @property {Number} [maxWidth] How much of the target's width to bring into view if the target is wider.
 * @property {Number} [maxHeight] How much of the target's height to bring into view if the target is taller.
 * @property {String} [column] Field name or ID of the column, or the Column instance to scroll to.
 * @property {Boolean} [extendTimeAxis=true] **Only applies when scrolling an event into view in Scheduler**. By
 * default, if the requested event is outside the time axis, the time axis is extended.
 * @property {Core.helper.util.Rectangle} [viewport] An optional definition of the scrollable viewport
 * if it has to differ from the actual client area of this Scroller's {@link #config-element}.
 */

/**
 * A thin base class for {@link Grid.view.Grid}. Does not include any features by default, allowing smaller custom-built
 * bundles if used in place of {@link Grid.view.Grid}. Use GridBase when you want to minimize bundle size and only
 * include the specific features you need.
 *
 * **NOTE:** In most scenarios you probably want to use {@link Grid.view.Grid} instead of GridBase.
 *
 * ```javascript
 * import GridBase from 'lib/Grid/view/GridBase.js';
 * import Sort from 'lib/Grid/feature/Sort.js';
 *
 * const grid = new GridBase({
 *     appendTo : document.body,
 *     features : {
 *         sort : true  // Only this feature is included in the bundle
 *     },
 *     columns : [
 *         { field : 'name', text : 'Name' }
 *     ],
 *     data : [
 *         { name : 'Dan' },
 *         { name : 'Steve' }
 *     ]
 * });
 * ```
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-columns}                       | Array of column definitions                          |
 * | {@link #config-store}                         | Data store supplying rows                            |
 * | {@link #config-data}                          | Inline data array (creates a store automatically)    |
 * | {@link #config-features}                      | Object to enable/configure grid features             |
 * | {@link #config-subGridConfigs}                | Configure the locked/normal grid sections            |
 * | {@link #config-rowHeight}                     | Height of each row in pixels                         |
 * | {@link #function-scrollRowIntoView}           | Scrolls a row into the visible area                  |
 * | {@link #function-getCell}                     | Returns cell element for a record and column         |
 *
 * ## See also
 *
 * - {@link Grid.view.Grid} - Full-featured grid with default features included
 * - {@link Grid.view.TreeGrid} - Tree variant of the grid
 * - {@link Grid.column.Column} - Base column class
 * - {@link Core.data.Store} - Data store for grid rows
 *
 * @extends Core/widget/Panel
 *
 * @mixes Core/mixin/Pluggable
 * @mixes Core/mixin/State
 * @mixes Grid/view/mixin/GridElementEvents
 * @mixes Core/mixin/Featureable
 * @mixes Grid/view/mixin/GridResponsive
 * @mixes Grid/view/mixin/GridSelection
 * @mixes Grid/view/mixin/GridState
 * @mixes Grid/view/mixin/GridSubGrids
 * @mixes Core/mixin/LoadMaskable
 * @mixes Core/mixin/Tierable
 *
 * @features Grid/feature/AI
 * @features Grid/feature/ai/AIFilter
 * @features Grid/feature/CellCopyPaste
 * @features Grid/feature/CellEdit
 * @features Grid/feature/CellMenu
 * @features Grid/feature/CellTooltip
 * @features Grid/feature/Charts
 * @features Grid/feature/ColumnAutoWidth
 * @features Grid/feature/ColumnDragToolbar
 * @features Grid/feature/ColumnPicker
 * @features Grid/feature/ColumnRename
 * @features Grid/feature/ColumnReorder
 * @features Grid/feature/ColumnResize
 * @features Grid/feature/FillHandle
 * @features Grid/feature/Filter
 * @features Grid/feature/FilterBar
 * @features Grid/feature/Group
 * @features Grid/feature/GroupSummary
 * @features Grid/feature/HeaderMenu
 * @features Grid/feature/MergeCells
 * @features Grid/feature/QuickFind
 * @features Grid/feature/PinColumns
 * @features Grid/feature/RegionResize
 * @features Grid/feature/RowCopyPaste
 * @features Grid/feature/RowEdit
 * @features Grid/feature/RowExpander
 * @features Grid/feature/RowReorder
 * @features Grid/feature/RowResize
 * @features Grid/feature/Search
 * @features Grid/feature/Sort
 * @features Grid/feature/Split
 * @features Grid/feature/StickyCells
 * @features Grid/feature/LockRows
 * @features Grid/feature/Stripe
 * @features Grid/feature/Summary
 * @features Grid/feature/Tree
 * @features Grid/feature/TreeGroup
 *
 * @features Grid/feature/experimental/ExcelExporter
 * @features Grid/feature/experimental/FileDrop
 *
 * @features Grid/feature/export/PdfExport
 * @features Grid/feature/export/Print
 *
 * @plugins Grid/row/RowManager
 * @widget
 */
export default class GridBase extends Panel.mixin(
    Pluggable,
    Transitionable,
    State,
    GridElementEvents,
    Featureable,
    GridNavigation,
    GridResponsive,
    GridSelection,
    GridState,
    GridSubGrids,
    LoadMaskable,
    Tierable,
    TimeZonable
) {
    //region Config

    static $name = 'GridBase';

    // Factoryable type name
    static type = 'gridbase';

    static get featureable() {
        return {
            factory   : GridFeature,
            transform : GridFeature.transformConfig
        };
    }

    static delayable = {
        // These use a shorter delay for tests, see finishConfigure()
        bufferedAfterColumnsResized : 250,
        bufferedElementResize       : 250
    };

    static configurable = {
        //region Hidden configs

        /**
         * @hideconfigs autoUpdateRecord, defaults, hideWhenEmpty, itemCls, items, layout, layoutStyle, lazyItems,
         * namedItems, record, textContent, defaultAction, html, htmlCls, tag, textAlign, trapFocus, content,
         * defaultBindProperty, defaultFocus, align, anchor, centered, constrainTo, draggable, floating,
         * hideAnimation, positioned, scrollAction, showAnimation, x, y, localeClass, localizableProperties,
         * showTooltipWhenDisabled, tooltip, strictRecordMapping, maximizeOnMobile
         */

        /**
         * @hideproperties html, isSettingValues, isValid, items, record, values, content, layoutStyle, firstItem,
         * lastItem, anchorSize, x, y, layout, strictRecordMapping, visibleChildCount, maximizeOnMobile
         */

        /**
         * @hidefunctions attachTooltip, add, getWidgetById, insert, processWidgetConfig, remove, removeAll, getAt,
         * alignTo, setXY, showBy, showByPoint, toFront
         */

        //endregion

        cssVarPrefix : 'b-grid',

        /**
         * Set to `true` to make the grid read-only, by disabling any UIs for modifying data.
         *
         * __Note that checks MUST always also be applied at the server side.__
         * @prp {Boolean} readOnly
         * @default false
         * @category Misc
         */

        /**
         * Automatically set grids height to fit all rows (no scrolling in the grid). In general you should avoid
         * using `autoHeight: true`, since it will bypass Grids virtual rendering and render all rows at once, which
         * in a larger grid is terrible for performance.
         * @config {Boolean}
         * @default false
         * @category Layout
         */
        autoHeight : null,



        disableAutoHeightWarning : null,

        disableNoIDWarning : null,

        /**
         * Set to `true` to allow text selection in the grid cells. Note, this cannot be used simultaneously with the
         * `RowReorder` feature.
         * @config {Boolean}
         * @default false
         * @category Selection
         */
        enableTextSelection : null,

        /**
         * Set to `true` to stretch the last column in a grid with all fixed width columns to fill extra available space
         * if the grid's width is wider than the sum of all configured column widths.
         * @config {Boolean}
         * @default
         * @category Layout
         */
        fillLastColumn : true,

        /**
         * See {@link Grid.view.Grid#keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>} keyMap
         * @category Common
         */

        /**
         * Configure as `true` to have the grid show a red "changed" tag in cells whose field value has changed and not
         * yet been committed.
         *
         * Set `showDirty.duringEdit` to `true` to show the red tag while editing a cell:
         *
         * ```javascript
         * showDirty : {
         *     duringEdit : true
         * }
         * ```
         *
         * Set `showDirty.newRecord` to `true` to show the red tag for all the cells of the new record:
         *
         * ```javascript
         * showDirty : {
         *     newRecord : true
         * }
         * ```
         *
         * @config {Boolean|Object}
         * @property {Boolean} showDirty.duringEdit Set to `true` to show the red tag while editing a cell
         * @property {Boolean} showDirty.newRecord Set to `true` to show the red tag for all the cells of the new record
         * @default false
         * @category Misc
         */
        showDirty : null,

        showNotEditableCells : false,

        /**
         * An object containing sub grid configuration objects keyed by a `region` property.
         * By default, grid has a 'locked' region (if configured with locked columns) and a 'normal' region.
         * The 'normal' region defaults to use `flex: 1`.
         *
         * This config can be used to reconfigure the "built-in" sub grids or to define your own.
         *
         * Redefining the default regions:
         *
         * {@frameworktabs}
         * {@js}
         * ```javascript
         * new Grid({
         *   subGridConfigs : {
         *     locked : { flex : 1 },
         *     normal : { width : 100 }
         *   }
         * });
         * ```
         * {@endjs}
         * {@react}
         * ```javascript
         * const App = props => {
         *     const subGridConfigs = {
         *         locked : { flex : 1 },
         *         normal : { width : 100 }
         *     };
         *
         *     return <bryntum-grid subGridConfigs={subGridConfigs} />
         * }
         * ```
         * {@endreact}
         * {@vue}
         * ```html
         * <bryntum-grid :sub-grid-configs="subGridConfigs" />
         * ```
         * ```javascript
         * export default {
         *     setup() {
         *         return {
         *             subGridConfigs : [
         *                 locked : { flex : 1 },
         *                 normal : { width : 100 }
         *             ]
         *         };
         *     }
         * }
         * ```
         * {@endvue}
         * {@angular}
         * ```html
         * <bryntum-grid [subGridConfigs]="subGridConfigs"></bryntum-grid>
         * ```
         * ```typescript
         * export class AppComponent {
         *      subGridConfigs = [
         *          locked : { flex : 1 },
         *          normal : { width : 100 }
         *      ]
         *  }
         * ```
         * {@endangular}
         * {@endframeworktabs}
         *
         * Defining your own multi region grid:
         *
         * ```javascript
         * new Grid({
         *   subGridConfigs : {
         *     left   : { width : 100 },
         *     middle : { flex : 1 },
         *     right  : { width  : 100 }
         *   },
         *
         *   columns : [
         *     { field : 'manufacturer', text: 'Manufacturer', region : 'left' },
         *     { field : 'model', text: 'Model', region : 'middle' },
         *     { field : 'year', text: 'Year', region : 'middle' },
         *     { field : 'sales', text: 'Sales', region : 'right' }
         *   ]
         * });
         * ```
         * @config {Object<String,SubGridConfig>}
         * @category Misc
         */
        subGridConfigs : {
            normal : { flex : 1 }
        },

        /**
         * Store that holds records to display in the grid, or a store config object. If the configuration contains
         * a `readUrl`, an `AjaxStore` will be created.
         *
         * Note that a store will be created during initialization if none is specified.
         *
         * Supplying a store config object at initialization time:
         *
         * ```javascript
         * const grid = new Grid({
         *     store : {
         *         fields : ['name', 'powers'],
         *         data   : [
         *             { id : 1, name : 'Aquaman', powers : 'Decent swimmer' },
         *             { id : 2, name : 'Flash', powers : 'Pretty fast' },
         *         ]
         *     }
         * });
         * ```
         *
         * Accessing the store at runtime:
         *
         * ```javascript
         * grid.store.sort('powers');
         * ```
         *
         * @prp {Core.data.Store}
         * @accepts {Core.data.Store|StoreConfig}
         * @ts-returns {Core.data.Store|StoreConfig|Core.data.AjaxStore|AjaxStoreConfig}
         * @category Common
         */
        store : {
            value : {},

            $config : 'nullify'
        },

        rowManager : {
            value : {},

            $config : ['nullify', 'lazy']
        },

        /**
         * Configuration values for the {@link Core.util.ScrollManager} class on initialization. Returns the
         * {@link Core.util.ScrollManager} at runtime.
         *
         * @prp {Core.util.ScrollManager}
         * @accepts {ScrollManagerConfig|Core.util.ScrollManager}
         * @readonly
         * @category Scrolling
         */
        scrollManager : {
            value : {},

            $config : ['nullify', 'lazy']
        },

        /**
         * Accepts column definitions for the grid during initialization. They will be used to create
         * {@link Grid/column/Column} instances that are added to a {@link Grid/data/ColumnStore}.
         *
         * At runtime, it returns the {@link Grid/data/ColumnStore}.
         *
         * Initialization using column config objects:
         *
         * ```javascript
         * new Grid({
         *   columns : [
         *     { text : 'Alias', field : 'alias' },
         *     { text : 'Superpower', field : 'power' }
         *   ]
         * });
         * ```
         *
         * Also accepts a store config object:
         *
         * ```javascript
         * new Grid({
         *   columns : {
         *     data : [
         *       { text : 'Alias', field : 'alias' },
         *       { text : 'Superpower', field : 'power' }
         *     ],
         *     listeners : {
         *       update() {
         *         // Some update happened
         *       }
         *     }
         *   }
         * });
         * ```
         *
         * Access the {@link Grid/data/ColumnStore} at runtime to manipulate columns:
         *
         * ```javascript
         * grid.columns.add({ field : 'column', text : 'New column' });
         * ```
         *
         * Replacing the columns fully at runtime:
         *
         * ```javascript
         * grid.columns = [{ field : 'column', text : 'New column' }];
         * ```
         *
         * {@note}Columns are records (instances of {@link Core.data.Model}) in a grid's
         * {@link Grid.data.ColumnStore}, and as such, are *not* Widgets, and are *not* observable.
         *
         * Setting properties on a Column is setting fields in a data record, and will not trigger any changers or
         * updaters in the Column class.
         *
         * Changes to a Column's properties are published through its store's API. For example, to react to changes in a
         * Column's `width` property, you would listen to the {@link Grid.data.ColumnStore#event-update} event on the
         * `ColumnStore`:
         *
         * ```javascript
         * myGrid.columns.on('update', ({ record : column, changes }) => {
         *     if (changes.width) {
         *         console.log(`Column ${column.text} width changed to ${changes.width.value}`);
         *     }
         * });
         * ```
         * {/@note}
         * @prp {Grid.data.ColumnStore}
         * @accepts {Grid.data.ColumnStore|GridColumnConfig[]|ColumnStoreConfig}
         * @category Common
         */
        columns : {
            value : [],

            $config : 'nullify'
        },

        /**
         * Grid's `min-height`. Defaults to `10em` to be sure that the Grid always has a height wherever it is
         * inserted.
         *
         * Can be either a String or a Number (which will have 'px' appended).
         *
         * Note that _reading_ the value will return the numeric value in pixels.
         *
         * @config {String|Number}
         * @category Layout
         */
        minHeight : '10em',

        /**
         * Set to `true` to hide the column header elements
         * @prp {Boolean}
         * @default false
         * @category Misc
         */
        hideHeaders : null,

        /**
         * Set to `true` to hide the footer elements
         * @prp {Boolean}
         * @default
         * @category Misc
         */
        hideFooters : true,

        /**
         * Set to `false` to crop text in grid cells without ellipsis (...). When enabled, cells containing pure
         * use `display : block`, instead of `display : flex` to allow ellipsis to work.
         * **NOTE** Only supported in browsers that support `:has()` CSS selector
         * @prp {Boolean}
         * @default
         * @category Misc
         */
        cellEllipsis : true,

        /**
         * Set to `true` to hide the Grid's horizontal scrollbar(s)
         * @config {Boolean}
         * @default false
         * @category Misc
         */
        hideHorizontalScrollbar : null,

        contentElMutationObserver : false,
        trapFocus                 : false,

        ariaElement : 'bodyElement',

        cellTabIndex : -1,

        rowCls : {
            value   : 'b-grid-row',
            $config : {
                merge : this.mergeCls
            }
        },

        cellCls : {
            value   : 'b-grid-cell',
            $config : {
                merge : this.mergeCls
            }
        },

        /**
         * Text or HTML, or a {@link EmptyTextDomConfig} block to display when there is no data to display in the grid.
         * When using multiple Grid regions, provide the `region` property to decide where the text is shown.
         * By default, it is shown in the first region.
         *
         * ```javascript
         * new Grid({
         *     emptyText : {
         *         region : 'locked',
         *         text   : 'No data available'
         *     }
         * })
         * ```
         *
         * @prp {String|EmptyTextDomConfig}
         * @default
         * @category Common
         */
        emptyText : 'L{noRows}',

        sortFeatureStore : '$store',

        /**
         * Row height in pixels. This allows the default height for rows to be controlled. Note that it may be
         * overridden by specifying a {@link Grid/data/GridRowModel#field-rowHeight} on a per record basis, or from
         * a column {@link Grid/column/Column#config-renderer}.
         *
         * When initially configured as `null`, an empty row will be measured and its height will be used as default
         * row height, enabling it to be controlled using CSS
         *
         * @prp {Number}
         * @category Common
         */
        rowHeight : null,

        /**
         * Preserve the grid's vertical scroll position when changesets are applied, as in the case of remote
         * changes, or when stores are configured with {@link Core.data.Store#config-syncDataOnLoad}.
         *
         * @prp {PreserveScrollOptions|Boolean}
         * @default
         * @category Common
         */
        preserveScroll : false,

        /**
         * Set to `false` to not show column lines. End result might be overruled by/differ between themes.
         *
         * @prp {Boolean}
         * @default
         * @category Misc
         */
        columnLines : true,

        /**
         * Set to `false` to not show row lines. End result might be overruled by/differ between themes.
         *
         * @prp {Boolean}
         * @default
         * @category Misc
         */
        rowLines : true,

        /**
         * Use fixed row height. Setting this to `true` will configure the underlying RowManager to use fixed row
         * height, which sacrifices the ability to use rows with variable height to gain a fraction better
         * performance.
         *
         * Using this setting also ignores the {@link Grid.view.GridBase#config-getRowHeight} function, and thus any
         * row height set in data. Only Grids configured {@link Grid.view.GridBase#config-rowHeight} is used.
         *
         * @config {Boolean}
         * @category Layout
         */
        fixedRowHeight : null,

        /**
         * An object which names formula prefixes which will be applied to all columns configured with
         * `formula : true`.
         *
         * Each entry is keyed by a formula prefix, and each value is how to instantiate and configure a
         * {@link Core.util.FormulaProvider} when that prefix is used in the typed vale, eg: `=XXX(`
         *
         * If the configured value contains a `type` property, that is used to determine a registered
         * formula provider subclass to instantiate.
         *
         * ```javascript
         * fields : [{
         *     name             : 'review',
         *     formulaProviders : {
         *        AI : {
         *          type : 'remote',
         *          url  : 'https://my-ai-service.com'
         *        },
         *        SUM : {
         *           type : 'sum'
         *        }
         *     }
         * }]
         * ```
         *
         * Formula providers may be added to dynamically:
         *
         * ```javascript
         * // Enable registered MYFormula class to be used as a formula provider in the Grid
         * grid.store.modelClass.fieldMap.review.formulaProviders.MY = { ... };
         * ```
         * @config {Object<String,FormulaProviderConfig>} formulaProviders
         */
        formulaProviders : null,

        /**
         * Configure UI transitions for various actions in the grid.
         * @prp {Object}
         * @property {Boolean} insertRecord Transition record insertions
         * @property {Boolean} removeRecord Transition record removals
         * @property {Boolean} toggleColumn Transition column visibility changes
         * @property {Boolean} expandCollapseColumn Transition parent/group column expand/collapse
         * @property {Boolean} toggleRegion Transition region expand/collapse
         * @property {Boolean} toggleTreeNode Transition tree node expand/collapse
         * @property {Boolean} toggleGroup Transition group expand/collapse
         * @property {Boolean} filterRemoval=false Transition row removals caused by filtering
         *   (under specific conditions)
         */
        transition : {
            value : {
                insertRecord         : true,
                removeRecord         : true,
                toggleColumn         : true,
                expandCollapseColumn : true,
                toggleRegion         : true,
                toggleTreeNode       : true,
                toggleGroup          : true,
                filterRemoval        : false
            },
            $config : {
                merge : 'merge'
            }
        },

        /**
         * A function called for each row to determine its height. It is passed a {@link Core.data.Model record} and
         * expected to return the desired height of that records row. If the function returns a falsy value, Grids
         * configured {@link Grid.view.GridBase#config-rowHeight} is used.
         *
         * The default implementation of this function returns the row height from the records
         * {@link Grid.data.GridRowModel#field-rowHeight rowHeight field}.
         *
         * Override this function to take control over how row heights are determined:
         *
         * ```javascript
         * new Grid({
         *    getRowHeight(record) {
         *        if (record.low) {
         *            return 20;
         *        }
         *        else if (record.high) {
         *            return 60;
         *        }
         *
         *        // Will use grids configured rowHeight
         *        return null;
         *    }
         * });
         * ```
         *
         * NOTE: Height set in a Column renderer takes precedence over the height returned by this function.
         * Controlling row height from renderers is however deprecated as of 8.0, in favor of this function.
         *
         * @config {Function} getRowHeight
         * @param {Core.data.Model} record Record to determine row height for
         * @returns {Number|null} Desired row height, or `null` to use the configured {@link #config-rowHeight}
         * @category Layout
         */

        // used if no rowHeight specified and none found in CSS. not public since our themes have row height
        // specified and this is more of an internal failsafe
        defaultRowHeight : 45,

        /**
         * Refresh entire row when a record changes (`true`) or, if possible, only the cells affected (`false`).
         *
         * When this is set to `false`, then if a column uses a renderer, cells in that column will still
         * be updated because it is impossible to know whether the cells value will be affected.
         *
         * If a standard, provided Column class is used with no custom renderer, its cells will only be updated
         * if the column's {@link Grid.column.Column#config-field} is changed.
         * @config {Boolean}
         * @default
         * @category Misc
         */
        fullRowRefresh : true,

        /**
         * Specify `true` to preserve vertical scroll position after store actions that trigger a `refresh` event,
         * such as loading new data and filtering.
         * @config {Boolean}
         * @default false
         * @category Misc
         */
        preserveScrollOnDatasetChange : null,

        /**
         * True to preserve focused cell after loading new data
         * @config {Boolean}
         * @default
         * @category Misc
         */
        preserveFocusOnDatasetChange : true,

        /**
         * Convenient shortcut to set data in grids store both during initialization and at runtime. Can also be
         * used to retrieve data at runtime, although we do recommend interacting with Grids store instead using
         * the {@link #property-store} property.
         *
         * Setting initial data during initialization:
         *
         * ```javascript
         * const grid = new Grid({
         *     data : [
         *       { id : 1, name : 'Batman' },
         *       { id : 2, name : 'Robin' },
         *       ...
         *     ]
         * });
         * ```
         *
         * Setting data at runtime:
         *
         * ```javascript
         * grid.data = [
         *     { id : 3, name : 'Joker' },
         *     ...
         * ];
         * ```
         *
         * Getting data at runtime:
         *
         * ```javascript
         * const records = store.data;
         * ```
         *
         * Note that a Store will be created during initialization if none is specified.
         *
         * @prp {Core.data.Model[]}
         * @accepts {Object[]|Core.data.Model[]}
         * @non-lazy-load
         * @category Common
         */
        data : null,

        /**
         * Region to which columns are added when they have none specified
         * @config {String}
         * @default
         * @category Misc
         */
        defaultRegion : 'normal',

        /**
         * Set to `true` to destroy the store when the grid is destroyed.
         * @config {Boolean}
         * @default false
         * @category Misc
         */
        destroyStore : null,

        /**
         * Grids change the `maskDefaults` to cover only their `body` element.
         * @config {MaskConfig}
         * @category Misc
         */
        maskDefaults : {
            cover  : 'body',
            target : 'element'
        },

        /**
         * Set to `false` to only measure cell contents when double-clicking the edge between column headers.
         * @config {Boolean}
         * @default
         * @category Layout
         */
        resizeToFitIncludesHeader : true,

        /**
         * Set to `true` to not get a warning when using another base class than GridRowModel for your grid data. If
         * you do, and would like to use the full feature set of the grid then include the fields from GridRowModel
         * in your model definition.
         * @config {Boolean}
         * @default false
         * @category Misc
         */
        disableGridRowModelWarning : null,

        /**
         * Set to `true` to not get a warning when calling {@link #function-getState} when there is a column
         * configured without an `id`. But the recommended action is to always configure columns with an `id` when
         * using states.
         * @config {Boolean}
         * @default false
         * @category State
         */
        disableGridColumnIdWarning : null,

        headerClass : Header,
        footerClass : Footer,

        testPerformance : false,
        rowScrollMode   : 'move', // move, dom, all

        /**
         * Grid monitors window resize by default.
         * @config {Boolean}
         * @default true
         * @category Misc
         */
        monitorResize : true,

        /**
         * An object containing Feature configuration objects (or `true` if no configuration is required)
         * keyed by the Feature class name in all lowercase.
         * @config {Object}
         * @category Common
         */
        features : {},

        /**
         * Configures whether the grid is scrollable in the `Y` axis. This is used to configure a {@link Core.helper.util.Scroller}.
         * See the {@link #config-scrollerClass} config option.
         *
         * By default the grid is scrollable in the `Y` axis. If your platform shows scrollbars, they will appear when the content
         * of the grid overflows.
         *
         * To always show a scrollbar - even an empty one when there is no overflow - configure this as:
         *
         * ```javascript
         *    scrollable : {
         *        overflowY : 'scroll'
         *    }
         * ```
         * @config {Boolean|ScrollerConfig|Core.helper.util.Scroller}
         * @category Scrolling
         */
        scrollable : {
            // Just Y for now until we implement a special grid.view.Scroller subclass
            // Which handles the X scrolling of subgrids.
            overflowY : true
        },

        /**
         * The class to instantiate to use as the {@link #config-scrollable}. Defaults to {@link Core.helper.util.Scroller}.
         * @config {Core.helper.util.Scroller}
         * @ts-returns {typeof Scroller}
         * @category Scrolling
         */
        scrollerClass : GridScroller,

        refreshSuspended : 0,

        /**
         * Animation transition duration in milliseconds.
         * @prp {Number}
         * @default
         * @category Misc
         */
        transitionDuration : 500,

        /**
         * Event which is used to show context menus.
         * Available options are: 'contextmenu', 'click', 'dblclick'.
         * @config {'contextmenu'|'click'|'dblclick'}
         * @category Misc
         * @default
         */
        contextMenuTriggerEvent : 'contextmenu',

        /**
         * Controls column virtualization. When enabled (the default), cells are only rendered for columns that
         * intersect the viewport, and are added / removed as columns enter or leave view during horizontal scrolling.
         * This greatly improves performance for grids with many columns.
         *
         * Specify a number to extend the range used when determining which columns are in view, by that amount
         * of pixels on each side. Columns within that distance of the viewport get cells rendered ahead of time,
         * reducing the risk of briefly empty cells during fast horizontal scrolling:
         *
         * ```javascript
         * new Grid({
         *     // Also render cells for columns within 200px outside of the visible viewport
         *     virtualizeColumns : 200
         * });
         * ```
         *
         * Set to `false` to always render cells for all visible columns.
         *
         * Columns with {@link Grid.column.Column#config-autoHeight} are exempt from virtualization and always render
         * their cells, since row heights depend on their measured cell content. You can also configure a column with
         * {@link Grid.column.Column#config-alwaysRenderCells} to manually exclude it from virtualization.
         *
         * @prp {Boolean|Number}
         * @default true
         * @category Scrolling
         */
        virtualizeColumns : true,

        localizableProperties : ['emptyText'],

        asyncEventSuffix : '',

        fixElementHeightsBuffer : 350,

        detectCSSCompatibilityIssues : true,

        testConfig : {
            transitionDuration           : 50,
            fixElementHeightsBuffer      : 50,
            transition                   : null,
            detectCSSCompatibilityIssues : false
        }
    };

    static get properties() {
        return {
            _selectedRecords      : [],
            _verticalScrollHeight : 0,
            virtualScrollHeight   : 0,
            _scrollTop            : null
        };
    }

    static bindStoreChangeset = true;

    // Keep this commented out to have easy access to the syntax next time we need to use it
    // static get deprecatedEvents() {
    //     return {
    //         cellContextMenuBeforeShow : {
    //             product            : 'Grid',
    //             invalidAsOfVersion : '5.0.0',
    //             message            : '`cellContextMenuBeforeShow` event is deprecated, in favor of `cellMenuBeforeShow` event. Please see https://bryntum.com/docs/guide/Grid/upgrades/4.0.0+#grid-v4-0-0 for more information.'
    //         }
    //     };
    // }

    //endregion

    //region Init-destroy

    finishConfigure(config) {
        const
            me             = this,
            { initScroll } = me;

        // Make initScroll a one time only call
        me.initScroll = () => !me.scrollInitialized && initScroll.call(me);

        if (VersionHelper.isTestEnv) {
            me.bufferedAfterColumnsResized.delay = 50;
            me.bufferedElementResize.delay       = 50;
        }

        super.finishConfigure(config);

        // When locale is applied columns react and change, which triggers `change` event on columns store for each
        // changed column, and every change normally triggers rendering view. This overhead becomes noticeable with
        // larger amount of columns. So we set two listeners to locale events: prioritized listener to be executed first
        // and suspend renderContents method and unprioritized one to resume method and call it immediately.
        LocaleManager.ion({
            locale  : 'onBeforeLocaleChange',
            prio    : 1,
            thisObj : me
        });

        LocaleManager.ion({
            locale  : 'onLocaleChange',
            prio    : -1,
            thisObj : me
        });

        GlobalEvents.ion({
            theme                : 'onGridThemeChange',
            zoomChange           : 'onGlobalZoomChange',
            scrollBarWidthChange : 'onScrollBarWidthChange',
            thisObj              : me
        });

        me.ion({
            subGridCollapse : 'internalOnSubGridCollapse',
            subGridExpand   : 'internalOnSubGridExpand',
            prio            : -1,
            thisObj         : me
        });

        // Buffered for scrolling, to be called
        me.bufferedFixElementHeights = me.buffer('fixElementHeights', me.fixElementHeightsBuffer, me);

        // Add the extra grid classes to the element
        me.setGridClassList(me.element.classList);

        // We do not act as a regular Container.
        me.verticalScroller.classList.remove('b-content-element', 'b-auto-container');
        me.bodyWrapElement.classList.remove('b-auto-container-panel');

        if (CSS.supports('selector(:has(*))')) {
            me.addCls('b-supports-has');
        }
    }

    internalOnSubGridCollapse() {
        // A collapsed SubGrid is inert, so it leaves the accessibility tree and the columns which remain exposed
        // have to be renumbered. This must not repaint, cells in a collapsed SubGrid are deliberately left stale,
        // so only the aria attributes are updated.
        this.updateColumnHeadersAriaColumnIndex(true);
        this.updateRowsAriaOwns();
    }

    /**
     * Hands each rendered row's cells to the row element of the first exposed SubGrid, see
     * {@link Grid.row.Row#function-updateAriaOwns}. Called when cells are added or removed, and when a SubGrid is
     * collapsed, hidden or shown.
     * @internal
     */
    updateRowsAriaOwns() {
        // The RowManager is lazy, this must not create it
        this._rowManager?.forEach(row => row.updateAriaOwns());
    }

    internalOnSubGridExpand() {
        // Need to rerender all rows, because if the rows were rerendered (by adding a new column to another region for
        // example) while the region was collapsed, cells in the region will be empty.
        this.renderContents();
    }

    onBeforeLocaleChange() {
        this._suspendRenderContentsOnColumnsChanged = true;
    }

    onLocaleChange() {
        this._suspendRenderContentsOnColumnsChanged = false;
        if (this.isPainted) {
            // If we are editing a cell, cancel it before rerendering the grid, otherwise the cell editor's
            // DOM structure can be corrupted by stripNodeData's deep clean of the grid DOM.
            // A focusout event means that the beforeCancel event is not vetoable - the canel is happening.
            this.features.cellEdit?.cancelEditing?.(true, { type : 'focusout' });

            this.renderContents();
        }
    }

    finalizeInit() {
        super.finalizeInit();

        if (this.store.isLoading) {
            // Maybe show loadmask if store is already loading when grid is constructed
            this.onStoreBeforeRequest();
        }
    }

    changeScrollManager(scrollManager, oldScrollManager) {
        oldScrollManager?.destroy();

        if (scrollManager) {
            return ScrollManager.new({
                element : this.element,
                owner   : this
            }, scrollManager);
        }
        else {
            return null;
        }
    }

    /**
     * Cleanup
     * @private
     */
    doDestroy() {
        const me = this;

        me.detachListeners(storeListenerName);

        me.scrollManager?.destroy();

        // Destroy features before columns, so features can still access columns in their doDestroy.
        // Featureable.doDestroy also destroys features, but runs after columns.destroy() in the
        // mixin chain, so this early pass ensures correct ordering. Features guard against double-destroy.
        const features = me.features;
        for (const name in features) {
            features[name]?.destroy?.();
        }

        me._focusedCell = null;
        me.columns.destroy();

        super.doDestroy();
    }

    // Called when a feature is added at runtime. Reapplies the feature-derived CSS classes and rerenders
    // the grid contents so the new feature's rendering hooks take effect in already rendered DOM.
    afterFeatureAdd() {
        const me = this;

        if (me.isPainted) {
            me.setGridClassList(me.element.classList);

            // Same pattern as onLocaleChange: if we are editing a cell, cancel it before rerendering the
            // grid, otherwise the cell editor's DOM structure can be corrupted by the rerender.
            me.features.cellEdit?.cancelEditing?.(true, { type : 'focusout' });

            me.renderContents();
        }
    }

    /**
     * Adds extra classes to the Grid element after it's been configured.
     * Also iterates through features, thus ensuring they have been initialized.
     * @private
     */
    setGridClassList(classList) {
        Object.values(this.features).forEach(feature => {
            if (!feature || feature.disabled || feature === false || typeof feature === 'symbol') {
                return;
            }

            let featureClass;

            if (Object.prototype.hasOwnProperty.call(feature.constructor, 'featureClass')) {
                featureClass = feature.constructor.featureClass;
            }
            else {
                // ColumnReorder -> b-column-reorder
                featureClass = StringHelper.cls`b-${feature instanceof Base ? feature.$$cssName : feature.constructor.name}`;
            }

            if (featureClass) {
                classList.add(featureClass.toLowerCase());
            }
        });
    }

    //endregion

    // region Feature events

    // For documentation & typings purposes

    /**
     * Fires after a sub grid is collapsed.
     * @event subGridCollapse
     * @param {Grid.view.GridBase} source The firing Grid instance
     * @param {Grid.view.SubGrid} subGrid The sub grid instance
     */

    /**
     * Fires after a sub grid is expanded.
     * @event subGridExpand
     * @param {Grid.view.GridBase} source The firing Grid instance
     * @param {Grid.view.SubGrid} subGrid The sub grid instance
     */

    /**
     * Fires when the Grid is scrolling horizontally in one of its SubGrids.
     * @event horizontalScroll
     * @param {Grid.view.GridBase} source The firing Grid instance
     * @param {Grid.view.SubGrid} subGrid The scrolling SubGrid instance
     * @param {Number} scrollLeft The horizontal scroll position
     * @param {Number} scrollX The horizontal scroll position in the RTL-safe coordinate system
     */

    /**
     * Fires after the Grid is done scrolling horizontally in one of its SubGrids.
     * @event horizontalScrollEnd
     * @param {Grid.view.GridBase} source The firing Grid instance
     * @param {Grid.view.SubGrid} subGrid The scrolling SubGrid instance
     * @param {Number} [scrollLeft] The horizontal scroll position. Only supplied when the event follows a SubGrid
     * resize, the scroll driven path does not report a position
     */

    /**
     * This event is triggered before a parent column is collapsed or expanded.
     * @event beforeColumnCollapseToggle
     * @param {Grid.view.GridBase} source The grid instance
     * @param {Grid.column.Column} column The column
     * @param {Boolean} collapsed `true` if the column is being collapsed, `false` if expanded
     */
    /**
     * This event is triggered after a parent column has been collapsed or expanded.
     * @event columnCollapseToggle
     * @param {Grid.view.GridBase} source The Grid instance
     * @param {Grid.column.Column} column The column being toggled
     * @param {Boolean} collapsed `true` if the column is now collapsed, `false` if expanded
     */

    /**
     * Fires before a row is rendered.
     * @event beforeRenderRow
     * @param {Grid.view.GridBase} source The firing Grid instance
     * @param {Grid.row.Row} row The row about to be rendered
     * @param {Core.data.Model} record The record for the row
     * @param {Number} recordIndex The zero-based index of the record
     */
    /**
     * Fires after a row is rendered.
     * @event renderRow
     * @param {Grid.view.GridBase} source The firing Grid instance
     * @param {Grid.row.Row} row The row that has been rendered
     * @param {Core.data.Model} record The record for the row
     * @param {Number} recordIndex The zero-based index of the record
     */

    //endregion

    //region Grid template & elements

    compose() {
        const { autoHeight, enableTextSelection, fillLastColumn, showDirty } = this;

        return {
            class : {
                'b-grid-no-text-selection' : !enableTextSelection,
                'b-auto-height'            : autoHeight,
                'b-fill-last-column'       : fillLastColumn,
                'b-show-dirty'             : showDirty,
                'b-show-dirty-during-edit' : showDirty?.duringEdit
            }
        };
    }

    async recomposeInternal() {
        let scrollState;
        const { isConstructing } = this;
        if (!isConstructing) {
            scrollState = this.storeScroll();
        }
        await super.recomposeInternal();
        if (!isConstructing) {
            const oldValues = [...Object.keys(scrollState.scrollLeft).map(k => scrollState.scrollLeft[k]), scrollState.scrollTop];

            // If there were any non-zero scroll positions...
            if (Math.max(...oldValues)) {
                const newState = this.storeScroll();

                // If all scroll positions are now zero...
                if (!Math.max(...Object.keys(newState.scrollLeft).map(k => newState.scrollLeft[k]), newState.scrollTop)) {
                    this.restoreScroll?.(scrollState);
                }
            }
        }
    }

    get cellCls() {
        const { _cellCls } = this;

        // It may have been merged to create a DomClassList, but 90% of the time will be a simple string.
        return _cellCls.value || _cellCls;
    }

    get bodyConfig() {
        const { autoHeight, hideFooters, hideHeaders } = this;

        return {
            reference : 'bodyElement',
            className : {
                'b-auto-height'     : autoHeight,
                'b-grid-panel-body' : 1
            },

            // Only include aria-labelled-by if we have a header
            [this.hasHeader ? 'aria-labelledby' : ''] : `${this.id}-panel-title`,

            children : {
                headerContainer : {
                    'aria-hidden'   : hideHeaders,
                    role            : hideHeaders ? null : 'row',
                    'aria-rowindex' : 1,
                    className       : {
                        'b-grid-header-container' : 1,
                        'b-hidden'                : hideHeaders
                    }
                },
                bodyContainer : {
                    className : 'b-grid-body-container',
                    role      : 'presentation',
                    children  : {
                        verticalScroller : {
                            role      : 'presentation',
                            className : 'b-grid-vertical-scroller'
                        }
                    }
                },
                virtualScrollers : {
                    className     : 'b-virtual-scrollers b-hide-display',
                    role          : null,
                    'aria-hidden' : true
                },
                footerContainer : {
                    'aria-hidden' : hideFooters,
                    role          : hideFooters ? null : 'row',
                    className     : {
                        'b-grid-footer-container' : 1,
                        'b-hidden'                : hideFooters
                    }
                }
            }
        };
    }

    get contentElement() {
        return this.verticalScroller;
    }

    get overflowElement() {
        return this.bodyContainer;
    }

    updateCellEllipsis(value) {
        this.toggleCls('b-use-ellipsis', value);
    }

    updateHideHeaders(hide) {
        this.headerContainer?.classList.toggle('b-hidden', Boolean(hide));
        // Toggle scroll partnering when hidden
        this.eachSubGrid(subGrid => subGrid.toggleHeaders(hide));
    }

    updateHideFooters(hide) {
        hide = Boolean(hide);

        this.footerContainer?.classList.toggle('b-hidden', hide);

        this.eachSubGrid(subGrid => {
            subGrid.scrollable[hide ? 'removePartner' : 'addPartner'](subGrid.footer.scrollable, 'x');
        });
    }

    changeVirtualizeColumns(value) {
        // 0 means virtualization with no extra buffer, same as `true`. Normalize to keep truthiness checks valid
        return value === 0 ? true : value;
    }

    updateVirtualizeColumns(value) {
        const me = this;

        // Initial rendering picks the config up on its own, only runtime changes need reconciling
        if (!me.isPainted) {
            return;
        }

        me.columns._intersectingColumns = null;
        me.eachSubGrid(subGrid => subGrid.columns._intersectingColumns = null);

        if (value) {
            // When virtualization was off, all visible columns had their cells rendered. Flag them as intersecting
            // so that syncIntersections (run by cachePositions below) removes cells for columns actually out of view
            for (const column of me.columns.visibleColumns) {
                column.meta.isIntersecting = true;
            }

            me.eachSubGrid(subGrid => subGrid.header.cachePositions());
        }
        else {
            // Render the cells that virtualization had removed, all visible columns have cells from now on
            const added = me.columns.visibleColumns.filter(column => !column.meta.isIntersecting);

            for (const columnRecord of added) {
                me.rowManager.addColumnCells({ columnRecord });
            }

            if (added.length) {
                me.rowManager.alignCells();

                // Notify features that render on top of cells (for example MergeCells) that cells were added
                me.rowManager.trigger('columnCellsChanged', { added, removed : [] });
            }
        }
    }

    updateHideHorizontalScrollbar(hide) {
        hide = Boolean(hide);

        this.eachSubGrid(subGrid => {
            subGrid.virtualScrollerElement.classList.toggle('b-hide-display', hide);

            if (!this.isConfiguring) {
                subGrid.scrollable[hide ? 'removePartner' : 'addPartner'](subGrid.fakeScroller, 'x');

                if (!hide) {
                    subGrid.refreshFakeScroll();
                }
            }
        });
    }

    //endregion

    //region Columns

    changeColumns(columns, currentStore) {
        const me = this;

        // <remove-on-release>
        // TODO: @johan: reconfiguring, ie changing whole column set should work.
        // </remove-on-release>
        // Empty, clear or destroy store
        if (!columns && currentStore) {
            // Destroy when Grid is destroyed, if we created the ColumnStore
            if (me.isDestroying) {
                currentStore.owner === me && currentStore.destroy();
            }
            // Clear if set to falsy value at some other point
            else {
                currentStore.removeAll();
            }

            return currentStore;
        }

        // Keep store if configured with one
        if (columns.isStore) {
            currentStore?.owner === me && currentStore.destroy();

            columns.grid = me;

            // Its columns were created before the store had a grid, so they could not add their missing fields
            columns.addMissingModelFields();

            return columns;
        }

        // Given an array of columns
        if (Array.isArray(columns)) {
            // If we have a store, plug them in
            if (currentStore) {
                const columnsBefore = currentStore.allRecords.slice();

                currentStore.data = columns;

                // Destroy any columns that were removed
                for (const oldColumn of columnsBefore) {
                    if (!currentStore.includes(oldColumn)) {
                        oldColumn.destroy();
                    }
                }

                return currentStore;
            }

            // No store, use as data for a new store below
            columns = { data : columns };
        }

        if (currentStore) {
            throw new Error('Replacing ColumnStore is not supported');
        }

        // Assuming a store config object
        return ColumnStore.new({
            grid  : me,
            owner : me
        }, columns);
    }

    updateColumns(columns, was) {
        const
            me                   = this,
            { formulaProviders } = me;

        super.updateColumns?.(columns, was);

        // changes might be triggered when applying state, before grid is rendered
        // <remove-on-release>
        // TODO: have this run a lighter weight, non-destructive response. onColumnsChanged is a start, but lots of
        //  machinery is hooked to render.
        // </remove-on-release>
        columns.ion({
            refresh : me.onColumnsChanged,
            change  : me.onColumnsChanged,
            move    : me.onColumnsChanged,
            thisObj : me
        });
        columns.ion(columnResizeEvent(me.onColumnsResized, me));

        // Add touch class for touch devices
        if (BrowserHelper.isTouchDevice) {
            me.touch = true;

            // apply touchConfig for columns that defines it
            columns.forEach(column => {
                const { touchConfig } = column;
                if (touchConfig) {
                    column.applyState(touchConfig);
                }
            });
        }

        me.bodyElement?.setAttribute('aria-colcount', columns.visibleColumns.length);

        if (formulaProviders) {
            const { modelClass } = me.store;

            // Set up fields for columns with formula set
            columns.forEach(col => {
                if (col.data.formula && col.field && modelClass.fieldMap[col.field]) {
                    modelClass.fieldMap[col.field].formulaProviders = formulaProviders;
                }
            });
        }
    }

    onColumnsChanged({ type, action, changes, record : column, records : changedColumns, isMove }) {
        const
            me                  = this,
            {
                columns,
                checkboxSelectionColumn
            }                   = me,
            changedFields       = changes && Object.keys(changes),
            isSingleFieldChange = changedFields?.length === 1;

        isMove = isMove === true ? true : (isMove && Object.values(isMove).some(field => field));

        me.beforeColumnsChange({ type, action, changes, column, columns : changedColumns });

        if (
            isMove || (type === 'refresh' && action !== 'batch' && action !== 'sort') ||
            // Ignore the update of parentIndex following a column move (we redraw on the insert)
            (action === 'update' && isSingleFieldChange && 'parentIndex' in changes) ||
            // Ignore sort caused by sync, will refresh on the batch instead
            (action === 'sort' && columns.isSyncingDataOnLoad)) {
            return;
        }

        const addingColumnToNonExistingSubGrid = action === 'add' && changedColumns.some(col => col.region && !me.subGrids[col.region]);

        // this.onInternalPaint will handle changes caused by updateResponsive
        if (me.isConfiguring || (!addingColumnToNonExistingSubGrid && (!me.isPainted || (isMove && action === 'remove')))) {
            return;
        }

        // See if we have to create and add new SubGrids to accommodate new columns.
        if (action === 'add') {
            for (const column of changedColumns) {
                const { region } = column;

                // See if there's a home for this column, if not, add one
                if (!me.subGrids[region]) {
                    me.add(me.createSubGrid(region, me.subGridConfigs?.[region], me.regions));
                    me.subGrids[region].initScroll();
                }
            }
        }

        else if (action === 'update') {
            const changedField = changedFields[0];

            // Just updating width is already handled in a minimal way.
            if (('width' in changes || 'minWidth' in changes || 'maxWidth' in changes || 'flex' in changes) && !('region' in changes)) {
                // Update any leaf columns that want to be repainted on size change
                const { region } = column;

                // We must not capture visibleColumns from the columns var
                // at the top. It's a cached/recalculated value that we
                // are invalidating in the body of this function.
                columns.visibleColumns.forEach(col => {
                    if (col.region === region && col.repaintOnResize) {
                        me.refreshColumn(col);
                    }
                });

                me.afterColumnsChange({ type, action, changes, column });
                return;
            }

            // No repaint if only changing column text
            if ('text' in changes && isSingleFieldChange) {
                column.subGrid.refreshHeader();
                return;
            }

            // Column toggled, need to recheck if any visible column has flex
            if ('hidden' in changes) {
                const subGrid = me.getSubGridFromColumn(column.id);
                subGrid.header.fixHeaderWidths();
                subGrid.footer.fixFooterWidths();
                subGrid.updateHasFlex();
                subGrid.refreshFakeScroll();
                me.validateHighlightedCells();
            }
            else if (isSingleFieldChange && !(changedField in fullRefreshAfterUpdateFields) && column.shown && !column.subGrid.collapsed) {
                column.subGrid.refreshHeader();
                me.refreshColumn(column);
                return;
            }
        }

        else if (action === 'remove') {
            changedColumns.forEach(c => c.freeColumnWidgets?.());
            me.validateHighlightedCells();
        }

        // Might have to add or remove subgrids when assigning a new set of columns or when changing region
        if (action === 'dataset' || action === 'batch' || (action === 'update' && 'region' in changes)) {
            const
                regions             = columns.getDistinctValues('region', true),
                { toRemove, toAdd } = ArrayHelper.delta(regions, me.regions, true);

            me.remove(toRemove.map(region => me.getSubGrid(region)));
            me.add(toAdd.map(region => me.createSubGrid(region, me.subGridConfigs[region], me.regions)));
        }

        // Check if checkbox selection column was removed, if so insert it back as the first column
        if (checkboxSelectionColumn && !columns.includes(checkboxSelectionColumn)) {
            // Insert the checkbox after any rownumber column. If not there, -1 means in at 0.
            const insertIndex = columns.indexOf(columns.findRecord('type', 'rownumber')) + 1;

            columns.insert(insertIndex, checkboxSelectionColumn, true);
        }

        if (!me._suspendRenderContentsOnColumnsChanged) {
            me.renderContents();
        }

        // Columns which are flexed, but as part of a grouped column cannot just have their flex
        // value reflected in the flex value of its cells. They are flexing a different available space.
        // These have to be set to the exact width and kept synced.
        me.syncFlexedSubCols();

        // We must not capture visibleColumns from the columns var
        // at the top. It's a cached/recalculated value that we must
        // are invalidating in the body of this function.
        me.bodyElement.setAttribute('aria-colcount', columns.visibleColumns.length);

        me.afterColumnsChange({ type, action, changes, column, columns : changedColumns });
    }

    onColumnsResized({ changes, record : column }) {
        const me = this;

        if (me.isConfiguring) {
            return;
        }

        const
            domWidth    = DomHelper.setLength(column.width),
            domMinWidth = DomHelper.setLength(column.minWidth),
            domMaxWidth = DomHelper.setLength(column.maxWidth),
            subGrid     = me.getSubGridFromColumn(column.id);

        // Let header and footer fix their own widths
        subGrid.header.fixHeaderWidths();
        subGrid.footer.fixFooterWidths();
        subGrid.updateHasFlex();

        // We can't apply flex from flexed subColums - they are flexing inside a different available width.
        if (!(column.flex && column.childLevel)) {
            if (!me.cellEls || column !== me.lastColumnResized) {
                me.cellEls           = DomHelper.children(
                    me.element,
                    `.b-grid-cell[data-column-id="${column.id}"]`
                );
                me.lastColumnResized = column;
            }

            for (const cell of me.cellEls) {
                if ('width' in changes) {
                    // Although header and footer elements must be sized using flex-basis to avoid the busting out problem,
                    // grid cells MUST be sized using width since rows are absolutely positioned and will not cause the
                    // busting out problem, and rows will not stretch to shrinkwrap the cells unless they are widthed with
                    // width.
                    cell.style.width = domWidth;
                }

                if ('minWidth' in changes) {
                    cell.style.minWidth = domMinWidth;
                }
                if ('maxWidth' in changes) {
                    cell.style.maxWidth = domMaxWidth;
                }

                if ('flex' in changes) {
                    cell.style.flex = column.flex ?? null;
                }
            }

            // With `fillLastColumn`, cells are synced to the stretched last header when it resizes. If its stretched
            // width did not change, no resize fires, so sync manually to keep cells aligned with the header.
            // https://github.com/bryntum/bryntum/issues/13583
            if ('width' in changes && me.fillLastColumn && column.isLastInSubGrid && !subGrid.overflowingHorizontally) {
                subGrid.header.cachePositions();
                me.rowManager.positionCells();
            }
        }

        // If we're being driven by the ColumnResizer or other bulk column resizer (like
        // ColumnAutoWidth), they will finish up with a call to afterColumnsResized.
        if (!me.resizingColumns) {
            me.afterColumnsResized(column);
        }

        // Columns which are flexed, but as part of a grouped column cannot just have their flex
        // value reflected in the flex value of its cells. They are flexing a different available space.
        // These have to be set to the exact width and kept synced.
        me.syncFlexedSubCols();
    }

    afterColumnsResized(column) {
        const me = this;

        me.eachSubGrid(subGrid => {
            // Only needed if the changed column is owned by the SubGrid
            if (!subGrid.collapsed && (!column || column.region === subGrid.region)) {
                subGrid.fixWidths();
            }
        });

        me.lastColumnResized = me.cellEls = null;

        // Buffer some expensive operations, like updating the fake scrollers
        me.bufferedAfterColumnsResized(column);

        // Must happen immediately, not inside the bufferedAfterColumnsResized
        if (column !== me.timeAxisColumn) {
            me.onHeightChange();
        }
    }

    // Async Hook called from column before being hidden, to allow transitioning the hide
    async beforeColumnHide({ column, hidingParent }) {
        if (!hidingParent && !this.isConfiguring && this.transition?.toggleColumn && column.isLeaf && !column.isTogglingAll && !column.parent.isTogglingAll) {
            // No need to clean these classes up later, header & cells will be removed
            await this.executeAndAwaitAnimations(
                () => {
                    const { element } = column;
                    // Forcing width transition
                    element.style.width = element.offsetWidth + 'px';
                    if (element.style.flexBasis) {
                        element.style.flexBasis = 0;
                    }
                    // Using void to prevent build optimizers from removing the reflow trigger
                    void element.offsetWidth;
                    element.style.width = 0;

                    column.addCls('b-hiding', column.flex ? 'b-flex' : 'b-width');
                },
                'b-hiding-column'
            );
        }
    }

    // Async Hook called from column after being shown, to allow transitioning the show
    async afterColumnShow({ column }) {
        if (this.transition?.toggleColumn && column.isLeaf && !column.parent.skipAnimation && !column.isTogglingAll && !column.parent.isTogglingAll) {
            const
                { element } = column,
                width       = element.offsetWidth;

            // Setting the cls forces initial show state (0 width)
            column.addCls('b-showing', column.flex ? 'b-flex' : 'b-width');

            await this.executeAndAwaitAnimations(
                () => {
                    // Forcing max-width transition
                    element.style.maxWidth = 0;
                    // Using void to prevent build optimizers from removing the reflow trigger
                    void element.offsetWidth;
                    element.style.maxWidth = width + 'px';

                    // Removing the cls transitions to the actual state
                    column.removeCls('b-showing', 'b-flex', 'b-width');
                },
                'b-showing-column'
            );

            element.style.maxWidth = column.maxWidth ? `${column.maxWidth}px` : '';
        }
    }

    syncFlexedSubCols() {
        const flexedSubCols = this.columns.query(c => c.flex && c.childLevel && c.element);

        // Columns which are flexed, but as part of a grouped column cannot just have their flex
        // value reflected in the flex value of its cells. They are flexing a different available space.
        // These have to be set to the exact width and kept synced.
        if (flexedSubCols) {
            for (const column of flexedSubCols) {
                const
                    width   = column.element.getBoundingClientRect().width,
                    cellEls = DomHelper.children(
                        this.element,
                        `.b-grid-cell[data-column-id="${column.id}"]`
                    );

                for (const cell of cellEls) {
                    cell.style.flex = `0 0 ${width}px`;
                }
            }
        }
    }

    bufferedAfterColumnsResized(column) {
        // Columns that allow their cell content to drive the row height requires a rerender after resize
        if (this.columns.usesAutoHeight) {
            this.refreshRows();
        }

        this.refreshVirtualScrollbars();
        this.eachSubGrid(subGrid => {
            // Only needed if the changed column is owned by the SubGrid
            if (!subGrid.collapsed && (!column || column.region === subGrid.region)) {
                subGrid.refreshFakeScroll();
            }
        });
    }

    bufferedElementResize() {
        this.refreshRows();
    }



    onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight) {
        // If a flexed subGrid would be flexed *down* by a width reduction, allow it
        // to lay itself out before the refreshVirtualScrollbars called by GridElementEvents
        // asks them whether they are overflowingHorizontally.
        // This is to avoid an unnecessary extra layout with a horizontal
        // scrollbar which may be hidden when the subgrid adjusts itself when its ResizeMonitor
        // notification arrives - they are delivered outermost->innermost, we find out first here.
        // When the actualResizeMonitor notification arrives, it will be a no-op.
        if (DomHelper.scrollBarWidth && newWidth < oldWidth) {
            this.eachSubGrid(subGrid => {
                if (subGrid.flex) {
                    subGrid.onElementResize(subGrid.element);
                }
            });
        }

        super.onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight);

        // Columns that allow their cell content to drive the row height requires a rerender after element resize
        if (this.isPainted && newWidth !== oldWidth && this.columns.usesFlexAutoHeight) {
            this.bufferedElementResize();
        }
    }

    //endregion

    //region Rows

    /**
     * Get the topmost visible grid row
     * @member {Grid.row.Row} firstVisibleRow
     * @readonly
     * @category Rows
     */

    /**
     * Get the last visible grid row
     * @member {Grid.row.Row} lastVisibleRow
     * @readonly
     * @category Rows
     */

    /**
     * Get the Row that is currently displayed at top.
     * @member {Grid.row.Row} topRow
     * @readonly
     * @category Rows
     * @private
     */

    /**
     * Get the Row currently displayed furthest down.
     * @member {Grid.row.Row} bottomRow
     * @readonly
     * @category Rows
     * @private
     */

    /**
     * Get Row for specified record id.
     * @function getRowById
     * @param {Core.data.Model|String|Number} recordOrId Record id (or a record)
     * @returns {Grid.row.Row} Found Row or null if record not rendered
     * @category Rows
     * @private
     */

    /**
     * Returns top and bottom for rendered row or estimated coordinates for unrendered.
     * @function getRecordCoords
     * @param {Core.data.Model|String|Number} recordOrId Record or record id
     * @returns {Object} Record bounds with format { top, height, bottom }
     * @category Calculations
     * @private
     */

    /**
     * Get the Row at specified index. "Wraps" index if larger than available rows.
     * @function getRow
     * @param {Number} index
     * @returns {Grid.row.Row}
     * @category Rows
     * @private
     */

    /**
     * Get a Row for either a record, a record id or an HTMLElement
     * @function getRowFor
     * @param {HTMLElement|Core.data.Model|String|Number} recordOrId Record or record id or HTMLElement
     * @returns {Grid.row.Row} Found Row or `null` if record not rendered
     * @category Rows
     */

    /**
     * Get a Row from an HTMLElement
     * @function getRowFromElement
     * @param {HTMLElement} element
     * @returns {Grid.row.Row} Found Row or `null` if record not rendered
     * @category Rows
     * @private
     */

    changeRowManager(rowManager, oldRowManager) {
        const me = this;

        // Use row height from CSS if not specified in config. Did not want to turn this into a getter/setter for
        // rowHeight since RowManager will plug its implementation into Grid when created below, and after initial
        // configuration that is what should be used
        if (!me._isRowMeasured && !me.peekConfig('rowHeight')) {
            me.measureRowHeight();
        }
        else {
            // Don't measure later on if configured with a rowHeight
            me._isRowMeasured = true;
        }

        oldRowManager?.destroy();

        if (rowManager) {
            // RowManager is a plugin, it is configured with its grid as its "client".
            // It uses client.store as its record source.
            const result = RowManager.new({
                grid              : me,
                rowHeight         : me.rowHeight,
                rowScrollMode     : me.rowScrollMode || 'move',
                autoHeight        : me.autoHeight,
                fixedRowHeight    : me.fixedRowHeight,
                internalListeners : {
                    changeTotalHeight   : 'onRowManagerChangeTotalHeight',
                    requestScrollChange : 'onRowManagerRequestScrollChange',
                    thisObj             : me
                }
            }, rowManager);

            // The grid announces row rendering and removal to allow customization of rows
            // and creation and freeing of widgets for the rows.
            me.relayEvents(result, ['beforeRenderRow', 'renderRow', 'removeRows']);

            // RowManager injects itself as a property into the grid so that the grid
            // can reference it during RowManager's spin-up. We need to undo that now
            // otherwise updaters will not run.
            me._rowManager = null;
            return result;
        }
    }

    // Manual relay needed for Split feature to catch the config change
    updateRowHeight(rowHeight) {
        if (!this.isConfiguring && this.rowManager) {
            this.rowManager.rowHeight = rowHeight;
        }
        this.element.style.setProperty('--b-grid-row-height', DomHelper.setLength(rowHeight));
    }

    updateFixedRowHeight(fixedRowHeight) {
        if (fixedRowHeight && (this.columns || this.peekConfig('columns'))?.some?.(col => col.autoHeight)) {
            console.warn('One or more columns have `autoHeight` set, which is incompatible with `fixedRowHeight`.');
        }
    }

    // Framework-internal row height resolution, called by the render path (Row, RowManager). Subclasses that
    // compute row heights (Scheduler) override this instead of getRowHeight(), which is reserved for apps
    internalGetRowHeight(record) {
        return this.getRowHeight(record);
    }

    // True when an app has supplied its own getRowHeight(), as a config or a subclass override. Subclasses that
    // compute row heights use it to give an app-supplied function precedence over their calculation
    get hasOwnGetRowHeight() {
        return this.getRowHeight !== GridBase.prototype.getRowHeight;
    }

    // Default implementation, documented in `defaultConfig`
    getRowHeight(record) {
        return record.rowHeight;
    }

    // Hook for features that need to alter the row height
    processRowHeight(record, height) {}

    // Hook for features rendering special rows (group headers and footers) to supply their height
    getSpecialRowHeight(record) {}

    //endregion

    //region Store

    getAsyncEventSuffixForStore(store) {
        return this.asyncEventSuffix;
    }

    /**
     * Hooks up data store listeners
     * @private
     * @category Store
     */
    bindStore(store) {
        const
            suffix          = this.getAsyncEventSuffixForStore(store),
            { masterStore } = store;

        store.ion({
            name : storeListenerName,

            [`refresh${suffix}`]   : 'onStoreDataChange',
            [`add${suffix}`]       : 'onStoreAdd',
            [`remove${suffix}`]    : 'onStoreRemove',
            [`replace${suffix}`]   : 'onStoreReplace',
            [`removeAll${suffix}`] : 'onStoreRemoveAll',
            [`move${suffix}`]      : store.tree ? null : 'onFlatStoreMove',
            change                 : 'relayStoreDataChange',

            idChange            : 'onStoreRecordIdChange',
            update              : 'onStoreUpdateRecord',
            beforeRequest       : 'onStoreBeforeRequest',
            afterRequest        : 'onStoreAfterRequest',
            exception           : 'onStoreException',
            commit              : 'onStoreCommit',
            clearChanges        : 'onStoreRecordClearChanges',
            startApplyChangeset : 'internalOnStoreStartApplyChangeset',
            endApplyChangeset   : 'internalOnStoreEndApplyChangeset',
            lazyLoadStarted     : 'onStoreBeforeRequest',
            lazyLoadEnded       : 'onStoreAfterRequest',
            beginDataUpdate     : 'onStoreBeginDataUpdate',
            endDataUpdate       : 'onStoreEndDataUpdate',
            thisObj             : this
        });

        // If we are being bound to a chained store, we have to unmask when the master store loads
        masterStore?.ion({
            name : storeListenerName, // Using same name as ^ to unbind at same time

            beforeRequest : 'onStoreBeforeRequest',
            afterRequest  : 'onStoreAfterRequest',
            lazyLoadEnded : 'onStoreAfterRequest',
            thisObj       : this
        });

        super.bindStore(store);
    }

    unbindStore(oldStore) {
        this.detachListeners(storeListenerName);

        if (this.destroyStore) {
            oldStore.destroy();
        }
    }

    get $store() {
        return this.originalStore || this.store;
    }

    changeStore(store) {
        if (store == null) {
            return null;
        }

        if (typeof store === 'string') {
            store = Store.getStore(store);
        }

        if (!store.isStore) {
            store = ObjectHelper.assign({
                data : this.data,
                tree : Boolean(this.initialConfig.features?.tree)
            }, store);

            if (!store.data) {
                delete store.data;
            }

            if (!store.modelClass) {
                store.modelClass = GridRowModel;
            }

            store = Store.create(store, store.readUrl ? AjaxStore : Store);
        }
        //<debug>
        else if (store.modelClass !== GridRowModel &&
            !Object.prototype.isPrototypeOf.call(GridRowModel, store.modelClass) &&
            !this.disableGridRowModelWarning) {
            console.warn('It is recommended to use a subclass of GridRowModel for data in Grids store, for better feature support');
        }
        //</debug>

        return store;
    }

    updateStore(store, was) {
        const me = this;

        super.updateStore?.(store, was);

        if (was) {
            me.unbindStore(was);
        }

        if (store) {
            // Deselect all rows when replacing the store, otherwise selection retains old store
            if (was) {
                me.deselectAll();
            }

            me.bindStore(store);
        }

        me.trigger('bindStore', { store, oldStore : was });

        // Changing store when painted -> refresh rows to reflect new data
        if (!me.isDestroying && me.isPainted && !me.refreshSuspended) {
            me._rowManager?.reinitialize();
        }
    }

    /**
     * Rerenders a cell if a record is updated in the store
     * @private
     * @category Store
     */
    onStoreUpdateRecord({ source : store, record, changes }) {
        const me = this;

        // Flag checked by ChartColumn to determine if update should be animated or not
        // (above suspended check on purpose, to work with event updates in Scheduler too)
        me._refreshFromDataChange = true;
        me.requestAnimationFrame(() => me._refreshFromDataChange = false);

        if (me.refreshSuspended) {
            return;
        }

        if (me.forceFullRefresh) {
            // flagged to need full refresh (probably from using GroupSummary)
            me.rowManager.refresh();

            me.forceFullRefresh = false;
        }
        else {
            let row;
            // Search for old row if id was changed
            if (record.isFieldModified('id')) {
                row = me.getRowFor(record.meta.modified.id);
            }

            row = row || me.getRowFor(record);
            // not rendered, bail out
            if (!row) {
                return;
            }

            // We must refresh the full row if it's a special row which has signalled
            // an update because it has no cells.
            if (me.fullRowRefresh || record.isSpecialRow) {
                const index = store.indexOf(record);
                if (index !== -1) {
                    row.render(index, record);
                }
            }
            else {
                me.columns.visibleColumns.forEach(column => {
                    const
                        field  = column.field,
                        isSafe = column.constructor.simpleRenderer && !(Object.prototype.hasOwnProperty.call(column.data, 'renderer'));

                    // If there's a  non-safe renderer, that is a renderer which draws values from elsewhere
                    // than just its configured field, that column must be refreshed on every record update.
                    // Obviously, if the column's configured field is changed that also means it's refreshed.
                    if (!isSafe || changes[field]) {
                        const cellElement = row.getCell(field);
                        if (cellElement) {
                            row.renderCell(cellElement);
                        }
                    }
                });
            }
        }
    }

    refreshFromRowOnStoreAdd(row, context) {
        const
            me             = this,
            { rowManager } = me;

        rowManager.renderFromRow(row);

        rowManager.trigger('changeTotalHeight', { totalHeight : rowManager.totalHeight });

        // First record? Also update fake scrollers
        // <remove-on-release>
        // TODO: Consider making empty grid scrollable to not have to do this
        // </remove-on-release>
        if (me.store.count === 1) {
            me.callEachSubGrid('refreshFakeScroll');
        }
    }

    onMaskAutoClose(mask) {
        super.onMaskAutoClose(mask);

        this.toggleEmptyText();
    }

    /**
     * Refreshes rows when data is added to the store
     * @private
     * @category Store
     */
    onStoreAdd({
        source : store,
        records,
        index,
        oldIndex,
        isChild,
        oldParent,
        parent,
        isMove,
        isExpand,
        isExpandAll,
        isRefiltering
    }) {
        const
            me             = this,
            { rowManager } = me;

        // Do not react if the content has not been rendered, or refresh is suspended,
        // or we are part of a project that is having a changeset applied (a bit dirty to include that here, but
        // avoids having to add an override in TimelineBase)
        // Also not if the store is about to reapply its filters because of this add, the `filter` event which
        // follows renders the final dataset and rendering here too would be wasted work
        if (!me.isPainted || isExpandAll || me.refreshSuspended || isRefiltering) {
            return;
        }

        // Set flag to indicate expand operation is in progress
        me.$isExpanding = true;

        if (isMove && Object.values(isMove).every(v => !v)) {
            isMove = false;
        }

        // We must swerve animated row insertion if there are too many new rows
        // or if any of the records are already in the store (which means they are being moved, not added)
        if (!isMove && !isExpand) {
            isMove = records.length > rowManager.rowCount || oldIndex != null;
        }

        const
            isAnimatedExpand = isExpand && me.transition?.toggleTreeNode,
            isAnimatedInsert = !isExpand && index != null && rowManager.rowCount && me.transition?.insertRecord && !isMove && index <= rowManager.lastVisibleRow?.index;

        // If the add is an expand, the records will be visible because children collection is
        // calculated in StoreTree.internalToggleTreeSubRecords WRT filtering.
        // We can splice the incoming records into place with animation.
        if (isAnimatedExpand) {
            const parentRow = rowManager.getRowFor(parent);
            if (parentRow) {
                const result = rowManager.insert(parentRow.index + 1, records.length, 'toggle');
                // Clear the flag after the operation
                me.$isExpanding = false;
                return result;
            }
        }

        if (isAnimatedInsert) {
            return rowManager.insert(index, records.length, 'insert');
        }

        // If we move records check if some of their old parents is expanded
        const hasExpandedOldParent = isMove && records.some(record => {
            if (isMove[record.id]) {
                // When using TreeGroup there won't be an old parent
                const oldParent = store.getById(record.meta.modified.parentId);

                return oldParent?.isExpanded(store) && oldParent?.ancestorsExpanded(store);
            }
        });

        // If it's the addition of a child to a collapsed zone (and old parents are also collapsed), the UI does not change.
        if (isChild && !records[0].ancestorsExpanded(store) && !hasExpandedOldParent) {
            // BUT it might change if parent had no children (expander made invisible) and it gets children added
            if (!parent.isLeaf) {
                const parentRow = rowManager.getRowById(parent);
                if (parentRow) {
                    rowManager.renderRows([parentRow]);
                }
            }

            return;
        }

        rowManager.calculateRowCount(false, true, true);

        // When store is filtered need to update the index value
        if (store.isFiltered) {
            index = store.indexOf(records[0]);
        }

        const
            {
                topIndex,
                rows,
                rowCount
            }           = rowManager,
            bottomIndex = rowManager.topIndex + rowManager.rowCount - 1,
            dataStart   = index,
            dataEnd     = index + records.length - 1,
            atEnd       = bottomIndex >= store.count - records.length - 1;

        // When moving a node within a tree we might need the redraw to include its old parent and its children. Not
        // worth the complexity of trying to do a partial render for this, rerender all rows to be safe. Cannot solely
        // rely on presence of isMove, all keys might be false
        // Moving records within a flat store is handled elsewhere, in onFlatStoreMove
        // <remove-on-release>
        // TODO: Moving within a tree should also trigger 'move'
        // </remove-on-release>
        if (oldParent || oldIndex > -1 || (isChild && isMove && Object.values(isMove).some(v => v))) {
            rowManager.refresh();
        }
        // Added block starts in our visible block. Render from there downwards.
        else if (dataStart >= topIndex && dataStart < topIndex + rowCount) {
            me.refreshFromRowOnStoreAdd(rows[dataStart - topIndex], ...arguments);
        }
        // Added block ends in our visible block, render block
        else if (dataEnd >= topIndex && dataEnd < topIndex + rowCount) {
            rowManager.refresh();
        }
        // If added block is outside of the visible area, no visible change
        // but potentially a change in total dataset height.
        else {
            // If we are against the end of the dataset, and have appended records
            // ensure they are rendered below
            if (atEnd && index > bottomIndex) {
                rowManager.fillBelow(me._scrollTop || 0);
            }
            else if (index < topIndex) {
                rowManager.refresh();
            }

            rowManager.estimateTotalHeight(true);
        }

        me.$isExpanding = false;
    }

    /**
     * Responds to exceptions signalled by the store
     * @private
     * @category Store
     */
    onStoreException({ action, type, response, exceptionType, error }) {
        const me = this;

        let message;

        switch (type) {
            case 'server':
                message = response.message || me.L('L{unspecifiedFailure}');
                break;
            case 'exception':
                message = exceptionType === 'network' ? me.L('L{networkFailure}') : (error?.message || response?.parsedJson?.message || me.L('L{parseFailure}'));
                break;
        }

        me.applyMaskError(
            `<div class="b-grid-load-failure">
                <div class="b-grid-load-fail">${me.L(action === 'read' ? 'L{loadFailedMessage}' : 'L{syncFailedMessage}')}</div>
                ${response?.url ? `<div class="b-grid-load-fail">${response.url}</div>` : ''}
                <div class="b-grid-load-fail">${me.L('L{serverResponse}')}</div>
                <div class="b-grid-load-fail">${message}</div>
            </div>`);
    }

    /**
     * Refreshes rows when data is changed in the store
     * @private
     * @category Store
     */
    onStoreDataChange({ action, changes, source : store, removed, added }) {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreDataChange?.(...arguments);

        const
            me             = this,
            { rowManager } = me,
            { rowCount }   = rowManager,
            removedCount   = removed?.length || 0;

        if (me.refreshSuspended || !rowManager) {
            return;
        }

        // If the data change was a filter which *only* removed a *contiguous* block records,
        // which falls within the view, we can avoid a full refresh by processing the action
        // using the onStoreRemove method.
        if (action === 'filter' && removedCount && !added?.length && rowCount && removedCount < rowCount && removed.every(record => rowManager.getRowById(record.id))) {
            // We need to sort the indices being removed so we can detect whether it is a contiguous block
            const
                indicesToRemove = removed.map(record => rowManager.getRowFor(record).index).sort(ascending),
                { length }      = indicesToRemove;

            // If we are removing a contiguous block use the onStoreRemove method
            if (length && indicesToRemove[length - 1] === indicesToRemove[0] + length - 1) {
                const { removeRecord } = me.transition || {};

                // Filter removals should not animate unless explicitly requested
                // Animation cannot happen if editing is in progress
                me.transition.removeRecord = !me.features.cellEdit?.isEditing && me.transition.filterRemoval;
                const result = me.onStoreRemove({
                    action,
                    source  : store,
                    records : removed
                });
                me.transition.removeRecord = removeRecord;
                return result;
            }
        }

        // If it's new data or if grouping changed, the old calculation is invalidated.
        if (action === 'dataset' || action === 'group') {
            rowManager.clearKnownHeights();
            if (action === 'group') {
                // Ensure total height is updated early, in case we need to scroll during reinitialization
                rowManager.estimateTotalHeight();
            }
            // Initial filters on a tree store first triggers `dataset`, then `filter`.
            // Ignore `dataset`, only redraw on `filter`
            else if (action === 'dataset' && store.isTree && store.isFiltered) {
                return;
            }
        }

        const isGroupFieldChange = store.isGrouped && changes && store.groupers.some(grp => grp.rootFieldName in changes);

        // No need to rerender if it's a change of the value of the group field which
        // will be responded to by StoreGroup
        if (me.isPainted && !isGroupFieldChange) {
            // Optionally scroll to top if setting new data or filtering based on preserveScrollOnDatasetChange setting
            me.renderRows(Boolean(!(action in datasetReplaceActions) || me.preserveScrollOnDatasetChange || (store.isChained && store.isFillingFromMaster)));
        }

        me.toggleEmptyText();
    }

    /**
     * The hook is called when the id of a record has changed.
     * @private
     * @category Store
     */
    onStoreRecordIdChange(...args) {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreRecordIdChange?.(...args);

        // Delegate to RowManager to handle heightMap and idMap updates
        this.rowManager.onRecordIdChange(...args);
    }

    /**
     * Shows a load mask while the connected store is loading
     * @private
     * @category Store
     */
    onStoreBeforeRequest(params) {
        if (!this.isLockedRows && (!this.store.count || !this.store.lazyLoad || params?.isReload)) {
            this.applyLoadMask();
        }
    }

    /**
     * Hides load mask after a load request ends either in success or failure
     * @private
     * @category Store
     */
    onStoreAfterRequest(event) {
        if (this.loadMask && !event.exception) {
            this.masked = null;
            if (!event.shouldSkipToggleEmptyText) {
                this.toggleEmptyText();
            }
        }
    }

    get isGrouped() {
        return this.features?.group?.enabled && this.store.isGrouped;
    }

    needsFullRefreshOnStoreRemove({ isCollapse }) {
        const { store } = this;

        return (this.isGrouped) ||
            // Need to redraw parents when children are removed since they might be converted to leaves
            (store.tree && !isCollapse && store.modelClass.convertEmptyParentToLeaf);
    }

    /**
     * Animates removal of record.
     * @private
     * @category Store
     */
    onStoreRemove({ source : store, records, isCollapse, isChild, isMove, isCollapseAll }) {
        // Do not react if the content has not been rendered,
        // or if it is a move, which will be handled by onStoreAdd
        if (!this.isPainted || isMove || isCollapseAll) {
            return;
        }

        // GridSelection mixin does its job on records removing
        super.onStoreRemove?.(...arguments);

        const
            me             = this,
            { rowManager } = me;

        // Remove cached heights
        rowManager.invalidateKnownHeight(records);

        me.validateHighlightedCells();

        // Will be refresh once in onStoreLoadSync after sync data on load
        if (me.refreshSuspended) {
            return;
        }

        const
            animatedCollapse = isCollapse && me.transition?.toggleTreeNode,
            animatedRemove   = me.transition?.removeRecord && !isCollapse;

        // Animated node collapse or removal. Slides rows below upwards.
        if (animatedCollapse || animatedRemove) {
            // Gather all visible rows which need to be removed.
            const
                // We need to sort the indices being removed so we can detect whether it is a contiguous block
                indicesToRemove = records.flatMap(record => {
                    const row = rowManager.getRowFor(record);

                    return row ? row.index : emptyArray;
                });

            // If grouping is enabled, we also need to remove any group header row which does not exist
            // in latest grouping. e.g. when last record in a group is removed.
            if (me.isGrouped) {
                for (const row of rowManager.rows) {
                    // If the record is not in store, and it's a group header row,
                    if (row.isGroupHeader && !store.includes(row.id)) {
                        // mark it for removal
                        indicesToRemove.push(row.index);
                    }
                }
            }

            const { length } = indicesToRemove.sort(ascending);

            // If we are removing a contiguous block, the RowManager can do that, and the forthcoming refresh's
            // set of row tops will animate any out of place rows into position
            if (length && indicesToRemove[length - 1] === indicesToRemove[0] + length - 1) {
                // Set flag to indicate collapse operation is in progress
                me.$isCollapsing = true;

                const result = rowManager.insert(indicesToRemove[0], -length, animatedCollapse ? 'toggle' : 'remove');
                // Clear the flag after the operation
                me.$isCollapsing = false;

                return result;
            }
        }

        // Cannot do an update from the affected row and down here. Since group headers might be affected by
        // removing rows we need a full refresh
        if (me.needsFullRefreshOnStoreRemove(...arguments)) {
            rowManager.refresh();
            me.afterRemove(arguments[0]);
        }
        else {
            const
                { rows }    = rowManager,
                topRowIndex = records.reduce((result, record) => {
                    const row = rowManager.getRowById(record.id);
                    if (row) {
                        // Rows are repositioned in the array, it matches visual order. Need to find actual index in it
                        result = Math.min(result, rows.indexOf(row));
                    }
                    return result;
                }, rows.length);

            // If there were rows below which have moved up into place
            // then repurpose them with their new records
            if (rows[topRowIndex]) {
                me.$isCollapsing = isCollapse;
                !me.refreshSuspended && rowManager.renderFromRow(rows[topRowIndex]);
                me.$isCollapsing = false;
            }
            // If nothing to render below, just update dataset height
            else {
                rowManager.trigger('changeTotalHeight', { totalHeight : rowManager.totalHeight });
            }

            me.trigger('rowRemove', { isCollapse });
            me.afterRemove(arguments[0]);
        }
    }

    onFlatStoreMove({ from, to }) {
        const
            { rowManager, store } = this,
            {
                topIndex,
                rowCount
            }                     = rowManager,
            // from and to are indices in the unfiltered collection, we need to convert them
            // to indices in a visible collection
            [dataStart, dataEnd]  = [from, to].sort((a, b) => a - b),
            visibleStart          = store.indexOf(store.getAt(dataStart, true)),
            visibleEnd            = store.indexOf(store.getAt(dataEnd, true));

        // Changed block starts in our visible block. Render from there downwards.
        if (visibleStart >= topIndex && visibleStart < topIndex + rowCount) {
            rowManager.renderFromRow(rowManager.rows[visibleStart - topIndex]);
        }
        // Changed block ends in our visible block, render block
        else if (visibleEnd >= topIndex && visibleEnd < topIndex + rowCount) {
            rowManager.refresh();
        }
        // If the changed block is outside the visible area, this is a no-op
    }

    onStoreReplace({ records, all }) {
        const { rowManager } = this;

        if (all) {
            rowManager.clearKnownHeights();
            rowManager.refresh();
        }
        else {
            const rows = records.reduce((rows, [, record]) => {
                const row = this.getRowFor(record);
                if (row) {
                    rows.push(row);
                }
                return rows;
            }, []);

            // Heights will be stored on render, but some records might be out of view -> have to invalidate separately
            rowManager.invalidateKnownHeight(records);

            rowManager.renderRows(rows);
        }
    }

    relayStoreDataChange(event) {
        this.ariaElement?.setAttribute('aria-rowcount', this.store.count + 1);

        /**
         * Fired when data in the store changes.
         *
         * Basically a relayed version of the store's own change event, decorated with a `store` property.
         * See the {@link Core.data.Store#event-change store change event} documentation for more information.
         *
         * @event dataChange
         * @param {Grid.view.GridBase} source Owning grid
         * @param {Core.data.Store} store The originating store
         * @param {'remove'|'removeAll'|'add'|'clearchanges'|'filter'|'update'|'dataset'|'replace'} action
         * Name of action which triggered the change. May be one of:
         * * `'remove'`
         * * `'removeAll'`
         * * `'add'`
         * * `'clearchanges'`
         * * `'filter'`
         * * `'update'`
         * * `'dataset'`
         * * `'replace'`
         * @param {Core.data.Model} record Changed record, for actions that affects exactly one record (`'update'`)
         * @param {Core.data.Model[]} records Changed records, passed for all actions except `'removeAll'`
         * @param {Object} changes Passed for the `'update'` action, info on which record fields changed
         */
        if (!this.project) {
            return this.trigger('dataChange', { ...event, store : event.source, source : this });
        }
    }

    /**
     * Rerenders grid when all records have been removed
     * @private
     * @category Store
     */
    onStoreRemoveAll(...args) {
        // GridSelection mixin does its job on records removing
        super.onStoreRemoveAll?.(...args);

        if (this.isPainted) {
            this.rowManager.clearKnownHeights();
            this.renderRows(false);
            this.toggleEmptyText();
        }
    }

    // Refresh dirty cells on commit
    onStoreCommit({ changes }) {
        const
            { rowManager, showDirty } = this,
            rows                      = [],
            records                   = showDirty ? [
                ...(changes.modified || []),
                ...(showDirty.newRecord && changes.added || [])
            ] : [];

        if (records.length) {
            records.forEach(record => {
                const row = rowManager.getRowFor(record);
                row && rows.push(row);
            });

            rowManager.renderRows(rows);
        }
    }

    // Refresh dirty cells after a call to Model#clearChanges
    onStoreRecordClearChanges({ record }) {
        const row = this.rowManager.getRowFor(record);

        if (row && !this.refreshSuspended) {
            this.rowManager.renderRows([row]);
        }
    }

    internalOnStoreStartApplyChangeset() {
        this.suspendRefresh();
        if (this.constructor.bindStoreChangeset) {
            this.captureScrollTargetRow();
        }
    }

    internalOnStoreEndApplyChangeset() {
        this.resumeRefresh(true);
        if (this.constructor.bindStoreChangeset) {
            this.restoreScrollTargetRow();
        }
    }

    // Suspend refresh during batch data operations (e.g., WBS update)
    onStoreBeginDataUpdate() {
        this.suspendRefresh();
    }

    // Resume refresh after batch data operations complete
    onStoreEndDataUpdate() {
        this.resumeRefresh(true);
    }

    /**
     * Remember scroll position when store is about to apply a changeset
     * @private
     */
    captureScrollTargetRow() {
        const me = this;
        if (me.preserveScroll) {
            const { firstFullyVisibleRow : firstRow, lastVisibleRow : lastRow } = me.rowManager;
            if (firstRow) {
                me.lastVisibleRowIds = [firstRow.id];
                for (let index = firstRow.dataIndex + 1; index <= lastRow.dataIndex; index++) {
                    me.lastVisibleRowIds.push(me.rowManager.getRow(index).id);
                }
                me.lastTopRowOffset = me.scrollable.getDeltaTo(firstRow.element,
                    { block : 'start', x : false, constrainToScrollable : false });
            }
        }
    }

    /**
     * Restore scroll position. Go to the topmost row formerly in the view that is still present in the dataset.
     * @private
     */
    restoreScrollTargetRow() {
        const me = this;
        let didOverscroll = false;
        if (me.preserveScroll) {
            if (me.lastVisibleRowIds) {
                me.rowManager.refresh();
                if (me.scrollable.scrollHeight >= me.lastOverscrollHeight && me.scrollable.y === me.lastOverscrollY) {
                    // https://github.com/bryntum/bryntum/issues/8040
                    me.rowManager.fillBelow(me.scrollable.y);
                }
                else {
                    me.lastOverscrollHeight = null;
                    me.lastOverscrollY = null;
                }
                const targetId = me.lastVisibleRowIds.find(rowId => me.store.getById(rowId));
                if (targetId != undefined && targetId !== me.rowManager.firstFullyVisibleRow.id) {
                    if (me.preserveScroll.overscroll) {
                        const scrollNeeded = me.scrollable.getDeltaTo(me.getRecordCoords(targetId),
                            {
                                block                 : 'start',
                                x                     : false,
                                constrainToScrollable : false,
                                edgeOffset            : me.lastTopRowOffset.yDelta
                            }).yDelta;
                        if (scrollNeeded > (me.scrollable.maxY - me.scrollable.y)) {
                            me.scrollable.scrollHeight += scrollNeeded;
                            didOverscroll = true;
                        }
                    }
                    me.scrollRowIntoView(targetId, {
                        block      : 'start',
                        edgeOffset : me.lastTopRowOffset.yDelta,
                        x          : false
                    });
                }
            }
            me.lastVisibleRowIds = undefined;
            me.lastTopRowOffset  = undefined;
            if (didOverscroll) {
                me.lastOverscrollHeight = me.scrollable.scrollHeight;
                me.lastOverscrollY      = me.scrollable.y;
            }
        }
    }

    // Documented with config
    get data() {
        return this._store?.records ?? this._data;
    }

    updateData(data) {
        if (this._store) {
            this._store.data = data;
        }
    }

    //endregion

    //region Context menu items

    /**
     * Populates the header context menu. Chained in features to add menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items
     * @internal
     */
    populateHeaderMenu({ column, items }) {
        const
            me                    = this,
            { subGrids, regions } = me,
            { pinColumns }        = me.features,
            { parent }            = column;

        let first = true;

        // PinColumns feature already provides options to pin columns to left(locked) or right regions
        if (pinColumns?.enabled) {
            return;
        }

        Object.entries(subGrids).forEach(([region, subGrid]) => {
            // If SubGrid is configured with a sealed column set, do not allow moving into it
            if (subGrid.sealedColumns) {
                return;
            }

            if (
                column.draggable &&
                region !== column.region &&
                (!parent && subGrids[column.region].columns.count > 1 || parent && parent.children.length > 1)
            ) {
                const
                    preceding = subGrid.element.compareDocumentPosition(subGrids[column.region].element) === document.DOCUMENT_POSITION_PRECEDING,
                    moveRight = me.rtl ? !preceding : preceding,
                    // With 2 regions, use Move left, Move right. With multiple, include region name
                    text      = regions.length > 2
                        ? me.L('L{moveColumnTo}', me.optionalL(region))
                        : me.L(moveRight ? 'L{moveColumnRight}' : 'L{moveColumnLeft}');

                items[`${region}Region`] = {
                    targetSubGrid : region,
                    text,
                    icon          : 'b-fw-icon b-icon-column-move-' + (moveRight ? 'right' : 'left'),
                    separator     : first,
                    disabled      : !column.allowDrag,
                    onItem        : ({ item }) => {
                        const lastRegionIndex = me.columns.indexOf(subGrids[item.targetSubGrid].columns.last);

                        column.traverse(col => col.region = region);

                        // Changing region will move the column to the correct SubGrid, but we want it to go last
                        me.columns.insert(lastRegionIndex + 1, column);

                        me.scrollColumnIntoView(column);
                    }
                };

                first = false;
            }
        });
    }

    /**
     * Populates the cell context menu. Chained in features to add menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Core.data.Model} options.record Record for which the menu will be shown
     * @param {Object<String,MenuItemEntry>} options.items A named object to describe menu items
     * @internal
     */
    populateCellMenu({ record, items }) {}

    getColumnDragToolbarItems(column, items) {
        return items;
    }

    //endregion

    //region Getters

    normalizeCellContext(cellContext) {
        const
            grid        = this,
            { columns } = grid;

        // Already have a GridLocation
        if (cellContext.isLocation) {
            return cellContext;
        }

        // Create immutable GridLocation object encapsulating the passed object.
        if (cellContext.isModel) {
            return new GridLocation({
                grid,
                id       : cellContext.id,
                columnId : columns.visibleColumns[0].id
            });
        }
        return new GridLocation(ObjectHelper.assign({ grid }, cellContext));
    }

    // <remove-on-release>
    // TODO: move to RowManager? Or create a CellManager?
    // </remove-on-release>
    /**
     * Returns a cell if rendered or null if not found.
     * @param {GridLocationConfig} cellContext A cell location descriptor
     * @returns {HTMLElement|null}
     * @category Getters
     */
    getCell(cellContext) {
        const
            { store, columns } = this,
            { visibleColumns } = this.columns,
            rowIndex           = !isNaN(cellContext.row) ? cellContext.row : !isNaN(cellContext.rowIndex) ? cellContext.rowIndex : store.indexOf(cellContext.record || cellContext.id),
            columnIndex        = !isNaN(cellContext.column) ? cellContext.column : !isNaN(cellContext.columnIndex) ? cellContext.columnIndex : visibleColumns.indexOf(cellContext.column || columns.getById(cellContext.columnId) || columns.get(cellContext.field) || visibleColumns[0]);

        // Only return cell for valid address.
        // This code is more strict than GridLocation, which attempts to find the closest existing cell.
        // Here we MUST only return a cell if the passed context is fully valid.
        return rowIndex > -1 && rowIndex < store.count && columnIndex > -1 && columnIndex < visibleColumns.length && this.normalizeCellContext(cellContext).cell || null;
    }

    // <remove-on-release>
    // TODO: Should move to ColumnManager? Or Header?
    // </remove-on-release>
    /**
     * Returns the header element for the column
     * @param {String|Number|Grid.column.Column} columnId or Column instance
     * @returns {HTMLElement} Header element
     * @category Getters
     */
    getHeaderElement(columnId) {
        if (columnId.isModel) {
            columnId = columnId.id;
        }

        return this.fromCache(`.b-grid-header[data-column-id="${columnId}"]`);
    }

    /**
     * Returns the footer element for the column (only relevant when using the Summary feature)
     * @param {String|Number|Grid.column.Column} columnId or Column instance
     * @returns {HTMLElement} Header element
     * @category Getters
     */
    getFooterElement(columnId) {
        if (columnId.isModel) {
            columnId = columnId.id;
        }

        return this.fromCache(`.b-grid-footer[data-column-id="${columnId}"]`);
    }

    getHeaderElementByField(field) {
        const column = this.columns.get(field);

        return column ? this.getHeaderElement(column) : null;
    }

    /**
     * Body height
     * @member {Number}
     * @readonly
     * @category Layout
     */
    get bodyHeight() {
        return this._bodyHeight;
    }

    /**
     * Header height
     * @member {Number}
     * @readonly
     * @category Layout
     */
    get headerHeight() {
        const me = this;
        // measure header if rendered and not stored
        if (me.isPainted && !me._headerHeight) {
            me._headerHeight = me.headerContainer.offsetHeight;
        }

        return me._headerHeight;
    }

    /**
     * Footer height
     * @member {Number}
     * @readonly
     * @category Layout
     */
    get footerHeight() {
        const me = this;

        // measure footer if rendered and not stored
        if (me.isPainted && !me._footerHeight) {
            me._footerHeight = me.footerContainer.offsetHeight;
        }

        return me._footerHeight;
    }

    get isTreeGrouped() {
        return Boolean(this.features.treeGroup?.isGrouped);
    }

    /**
     * Searches up from the specified element for a grid row and returns the record associated with that row.
     * @param {HTMLElement} element Element somewhere within a row or the row container element
     * @returns {Core.data.Model} Record for the row
     * @category Getters
     */
    getRecordFromElement(element) {
        const el = element.closest('.b-grid-row');

        if (!el) {
            return null;
        }

        return this.$store.getById(el.dataset.id);
    }

    /**
     * Searches up from specified element for a grid cell or a header and returns the column which the cell belongs to
     * @param {HTMLElement} element Element somewhere in a cell
     * @returns {Grid.column.Column} Column to which the cell belongs
     * @category Getters
     */
    getColumnFromElement(element) {
        const cell = element.closest('.b-grid-cell, .b-grid-header');
        if (!cell) return null;

        if (cell.matches('.b-grid-header')) {
            return this.columns.getById(cell.dataset.columnId);
        }

        const cellData = DomDataStore.get(cell);
        return this.columns.getById(cellData.columnId);
    }

    // Only added for type checking, since it seems common to get it wrong in react/angular
    updateAutoHeight(autoHeight) {
        ObjectHelper.assertBoolean(autoHeight, 'autoHeight');
    }

    updateColumnLines(columnLines) {
        ObjectHelper.assertBoolean(columnLines, 'columnLines');

        DomHelper.toggleClasses(this.element, 'b-no-column-lines', !columnLines);
    }

    updateRowLines(rowLines) {
        DomHelper.toggleClasses(this.element, 'b-no-row-lines', !rowLines);
    }

    get keyMapElement() {
        return this.bodyElement;
    }

    //endregion

    //region Fix width & height

    /**
     * Sets widths and heights for headers, rows and other parts of the grid as needed
     * @private
     * @category Width & height
     */
    fixSizes() {
        // subGrid width
        this.callEachSubGrid('fixWidths');
    }

    /**
     * Numbers the leaf column headers, and the cells when asked to, with their grid wide `aria-colindex`.
     * @param {Boolean} [updateCells] Pass `true` to renumber the rendered cells in the same pass. Only needed
     * when collapsing, the other callers rerender the rows right after this.
     * @private
     */
    updateColumnHeadersAriaColumnIndex(updateCells = false) {
        let colIndex = 0;

        // A collapsed SubGrid is inert, so its headers are not exposed and must not consume column indices.
        // The SubGrids are iterated in visual order, matching the order the cells are numbered in.
        this.eachSubGrid(subGrid => {
            if (!subGrid.collapsed) {
                // Get leaf headers and update their ariaColIndex
                const
                    colHeaders = subGrid.header.element.querySelectorAll('.b-grid-header.b-depth-0'),
                    offset     = colIndex;

                for (let i = 0, { length } = colHeaders; i < length; i++) {
                    colHeaders[i].setAttribute('aria-colindex', ++colIndex);
                }

                // Hand over the offset just counted, so the SubGrid need not work it out again
                updateCells && subGrid.updateCellsAriaColumnIndex(offset);
            }
        });

        // Collapsing a SubGrid changes the exposed column count without changing the columns, so keep the count
        // with the indices it has to stay in range of
        this.bodyElement.setAttribute('aria-colcount', colIndex);
    }

    onRowManagerChangeTotalHeight({ totalHeight, immediate }) {
        return this.refreshTotalHeight(totalHeight, immediate);
    }

    /**
     * Makes height of vertical scroller match estimated total height of grid. Called when scrolling vertically and
     * when showing/hiding rows.
     * @param {Number} [height] Total height supplied by RowManager
     * @param {Boolean} [immediate] Flag indicating if buffered element sizing should be bypassed
     * @private
     * @category Width & height
     */
    refreshTotalHeight(height = this.rowManager.totalHeight, immediate = false) {
        const me = this;

        // Veto change of estimated total height while rendering rows or if triggered while in a hidden state
        if (me.renderingRows || !me.isVisible) {
            return false;
        }

        const
            scroller     = me.scrollable,
            delta        = Math.abs(me.virtualScrollHeight - height),
            clientHeight = me._bodyRectangle.height,
            newMaxY      = height - clientHeight;

        if (delta) {
            const
                // We must update immediately if we are nearing the end of the scroll range.
                isCritical = (newMaxY - me._scrollTop < clientHeight * 2) ||
                    // Or if we have scrolled pass visual height
                    (me._verticalScrollHeight && (me._verticalScrollHeight - clientHeight < me._scrollTop));

            // Update the true scroll range using the scroller. This will not cause a repaint.
            scroller.scrollHeight = me.virtualScrollHeight = height;

            // If we are scrolling, put this off because it causes
            // a full document layout and paint.
            // Do not buffer calls for not yet painted grid
            if (me.isPainted && (me.scrolling && !isCritical || delta < 100) && !immediate) {
                me.bufferedFixElementHeights();
            }
            else {
                me.virtualScrollHeightDirty && me.virtualScrollHeightDirty();
                me.bufferedFixElementHeights.cancel();
                me.fixElementHeights();
            }

            scroller.syncOverflowState();
        }
    }

    fixElementHeights() {
        const
            me         = this,
            height     = me.virtualScrollHeight,
            heightInPx = `${height}px`;

        me._verticalScrollHeight         = height;
        me.verticalScroller.style.height = heightInPx;
        me.virtualScrollHeightDirty      = false;

        if (me.autoHeight) {
            me._height                    = null;
            me.bodyContainer.style.height = heightInPx;
            me._bodyHeight                = height;
            me.refreshBodyRectangle();
        }

        me.refreshVirtualScrollbars();
    }

    refreshBodyRectangle() {
        return this._bodyRectangle = Rectangle.client(this.bodyContainer);
    }

    //endregion

    //region Scroll & virtual rendering

    set scrolling(scrolling) {
        this._scrolling = scrolling;
    }

    get scrolling() {
        return this._scrolling;
    }

    /**
     * Activates automatic scrolling of a subGrid when mouse is moved closed to the edges. Useful when dragging DOM
     * nodes from outside this grid and dropping on the grid.
     * @param {Grid.view.SubGrid|String|Grid.view.SubGrid[]|String[]} subGrid A subGrid instance or its region name or
     * an array of either
     * @category Scrolling
     */
    enableScrollingCloseToEdges(subGrids) {
        this.scrollManager.startMonitoring({
            scrollables : [
                {
                    element   : this.scrollable.element,
                    direction : 'vertical'
                },
                ...ArrayHelper.asArray(subGrids || []).map(subGrid => (
                    { element : (typeof subGrid === 'string' ? this.subGrids[subGrid] : subGrid).scrollable.element }
                ))
            ],
            direction : 'horizontal'
        });
    }

    /**
     * Deactivates automatic scrolling of a subGrid when mouse is moved closed to the edges
     * @param {Grid.view.SubGrid|String|Grid.view.SubGrid[]|String[]} subGrid A subGrid instance or its region name or
     * an array of either
     * @category Scrolling
     */
    disableScrollingCloseToEdges(subGrids) {
        this.scrollManager.stopMonitoring([
            this.scrollable.element,
            ...ArrayHelper.asArray(subGrids || []).map(subGrid => (typeof subGrid === 'string' ? this.subGrids[subGrid] : subGrid).element)
        ]);
    }

    /**
     * Responds to request from RowManager to adjust scroll position. Happens when jumping to a scroll position with
     * variable row height.
     * @param {Number} bottomMostRowY
     * @private
     * @category Scrolling
     */
    onRowManagerRequestScrollChange({ bottom }) {
        this.scrollable.y = bottom - this.bodyHeight;
    }

    /* <remove-on-release> */
    runPerformanceTest(count = 5, direction = 'vertical') {
        const
            me      = this,
            body    = me.bodyContainer,
            fpsList = me.fpsList || (me.fpsList = []);

        me.frameCount = 0;

        if (!me.testPerformance) {
            me.testPerformance = direction;
        }

        me.setTimeout(() => {
            const start = performance.now();

            let scrollSpeed = 5,
                direction   = 1;

            const scrollInterval = me.setInterval(() => {
                scrollSpeed = scrollSpeed + 5;
                //if (scrollSpeed > 30) scrollSpeed = 0;

                body.scrollTop += (10 + Math.floor(scrollSpeed)) * direction;

                if (direction === 1 && body.scrollTop > 30000) {
                    direction   = -1;
                    scrollSpeed = 5;
                }

                if (direction === -1 && body.scrollTop <= 0) {
                    const
                        done         = performance.now(),
                        elapsed      = done - start,
                        timePerFrame = elapsed / me.frameCount;

                    let fps = 1000 / timePerFrame;

                    fps = Math.round(fps * 10) / 10;

                    clearInterval(scrollInterval);

                    fpsList.push(fps);

                    if (fpsList.length < count) {
                        me.runPerformanceTest(count);
                    }
                    else {
                        console.log(fpsList, fpsList.reduce((result, fps) => result += fps / fpsList.length, 0));
                        me.fpsList.length = 0;
                    }
                }
            }, 0);
        }, fpsList.length ? 0 : 2500);
    }

    /* </remove-on-release> */

    /**
     * Scroll syncing for normal headers & grid + triggers virtual rendering for vertical scroll
     * @private
     * @fires scroll
     * @category Scrolling
     */
    initScroll() {
        const
            me             = this,
            { scrollable } = me;

        // This method may be called early, before render calls it, so ensure that it's
        // only executed once.
        if (!me.scrollInitialized) {
            me.scrollInitialized = true;

            // Allows FF to dynamically track scrollbar state change by reacting to content height changes.
            // Remove when https://bugzilla.mozilla.org/show_bug.cgi?id=1733042 is fixed
            scrollable.contentElement = me.contentElement;

            scrollable.ion({
                scroll    : 'onGridVerticalScroll',
                scrollend : 'onGridVerticalScrollEnd',
                thisObj   : me
            });

            me.callEachSubGrid('initScroll');

            //<debug>
            if (me.testPerformance === 'vertical') {
                me.runPerformanceTest();
            }
            //</debug>

            // Fixes scroll freezing bug on iPad by putting scroller in its own layer
            if (BrowserHelper.isMobileSafari) {
                scrollable.element.style.translate = '0 0 0';
            }
        }
    }

    onGridVerticalScroll({ source : scrollable }) {
        const
            me                = this,
            { y : scrollTop } = scrollable;

        // Was getting scroll events in FF where scrollTop was unchanged, ignore those
        if (scrollTop !== me._scrollTop) {
            me._scrollTop = scrollTop;

            if (!me.scrolling) {
                me.scrolling = true;
                // Vertical scroll may trigger resize if row height is variable
                me.eachSubGrid(s => s.suspendResizeMonitor = true);
            }

            /* <remove-on-release> */
            if (me.testPerformance === 'vertical') {
                me.frameCount++;
            }
            /* </remove-on-release> */

            me.rowManager.updateRenderedRows(scrollTop);

            // Hook for features that need to react to scroll
            me.afterScroll({ scrollTop });

            /**
             * Grid has scrolled vertically
             * @event scroll
             * @param {Grid.view.GridBase} source The firing Grid instance.
             * @param {Number} scrollTop The vertical scroll position.
             */
            me.trigger('scroll', { scrollTop });
        }
    }

    onGridVerticalScrollEnd(e) {
        this.scrolling = false;
        this.eachSubGrid(s => s.suspendResizeMonitor = false);
        this.trigger('verticalScrollEnd', e);
    }

    // <remove-on-release>
    // TODO: rename to scrollRecordIntoView? Or have an alias?
    // </remove-on-release>
    /**
     * Scrolls a locally available record's row into view. If row isn't rendered it tries to calculate position.
     * Accepts the {@link BryntumScrollOptions} `column` property
     * @param {Core.data.Model|String|Number} recordOrId Record or record id
     * @param {GridScrollOptions} [options] How to scroll.
     * @returns {Promise} A promise which resolves when the specified row has been scrolled into view.
     * @category Scrolling
     */
    async scrollRowIntoView(recordOrId, options = defaultScrollOptions) {
        const
            me             = this,
            blockPosition  = options.block || 'nearest',
            { rowManager } = me,
            record         = me.store.getById(recordOrId),
            highlight      = me.resolveCallback(options.highlight, me, false);

        if (record) {

            if (me.isLockedRows) {
                me.syncSplits(other => other.scrollRowIntoView(...arguments));
            }

            let scrollPromise;

            // check that record is "displayable", not filtered out or hidden by collapse
            if (me.store.indexOf(record) === -1) {
                return resolvedPromise;
            }

            // If the rowManager is not initialized yet delay this scroll attempt till it is
            if (!me.rowManager.topRow) {
                await me.await('renderRows');
            }

            // If highlight is a function, capture the row elements and call it passing them as an argument.
            if (typeof highlight?.handler === 'function') {
                options.highlight = function() {
                    const row = rowManager.getRowFor(record);
                    if (row) {
                        highlight.handler.call(highlight.thisObj, row._elementsArray);
                    }
                };
            }

            let scroller   = me.scrollable,
                recordRect = me.getRecordCoords(record);

            const scrollerRect = Rectangle.from(scroller.element);

            // If it was calculated from the index, update the rendered rowScrollMode
            // and scroll to the actual element. Note that this should only be necessary
            // for variableRowHeight.
            // Intentional workaround for a known buffered rendering defect when teleporting
            // scroll, where rows are not placed at their correct positions. Do not remove
            // without addressing the underlying defect.
            if (recordRect.virtual) {
                const
                    virtualBlock = recordRect.block,
                    innerOptions = blockPosition !== 'nearest' ? options : {
                        block : virtualBlock
                    };

                // Scroll the calculated position **synchronously** to the center of the scrollingViewport
                // and then update the rendered block while asking the RowManager to
                // display the required recordOrId.
                scrollPromise = scroller.scrollIntoView(recordRect, {
                    block : 'center'
                });

                rowManager.scrollTargetRecordId = record;
                rowManager.updateRenderedRows(scroller.y, true);
                recordRect               = me.getRecordCoords(record);
                rowManager.lastScrollTop = scroller.y;

                //<debug>
                if (recordRect.virtual) {
                    throw new Error(`Unable to scroll ${record.id} into view`);
                }
                //</debug>

                if (recordRect.virtual) {
                    // bail out to not get caught in infinite loop, since code above is cut out of bundle
                    return resolvedPromise;
                }

                // Scroll the target just less than append/prepend buffer height out of view so that the animation looks good
                if (options.animate) {
                    // Do not fire scroll events during this scroll sequence - it's a purely cosmetic operation.
                    // We are scrolling the desired row out of view merely to *animate scroll* it to the requested position.
                    scroller.suspendEvents();

                    // Scroll to its final position
                    if (blockPosition === 'end' || blockPosition === 'nearest' && virtualBlock === 'end') {
                        scroller.y -= (scrollerRect.bottom - recordRect.bottom);
                    }
                    else if (blockPosition === 'start' || blockPosition === 'nearest' && virtualBlock === 'start') {
                        scroller.y += (recordRect.y - scrollerRect.y);
                    }

                    // Ensure rendered block is correct at that position
                    rowManager.updateRenderedRows(scroller.y, false, true);

                    // Scroll away from final position to enable a cosmetic scroll to final position
                    if (virtualBlock === 'end') {
                        scroller.y -= (rowManager.appendRowBuffer * rowManager.rowHeight - 1);
                    }
                    else {
                        scroller.y += (rowManager.prependRowBuffer * rowManager.rowHeight - 1);
                    }

                    // Now we're at the required position, resume events
                    scroller.resumeEvents();

                    // The row will still be rendered, so scroll it using the scroller directly
                    await scroller.scrollIntoView(me.getRecordCoords(record), { ...options, ...innerOptions });
                }
                else {
                    if (!options.recursive) {
                        await scrollPromise;
                    }
                    // May already be destroyed at this point, hence ?.
                    await me.scrollRowIntoView?.(record, { recursive : true, ...options, ...innerOptions });
                }
            }
            else {
                let { column } = options;

                if (column) {
                    if (!column.isModel) {
                        column = me.columns.getById(column) || me.columns.get(column);
                    }

                    // If we are targeting a column, we must use the scroller of that column's SubGrid
                    if (column) {
                        scroller = me.getSubGridFromColumn(column).scrollable;

                        const row = rowManager.getRowFor(record);

                        if (row) {
                            // When virtualizing columns, the cell might not exist if the column is out of view.
                            // Measure its header instead, headers always exist and cells align with them
                            const cellRect = Rectangle.from(row.getCell(column.id) || me.getHeaderElement(column));

                            recordRect.x     = cellRect.x;
                            recordRect.width = cellRect.width;
                        }
                    }
                }
                // No column, then tell the scroller not to scroll in the X axis (without polluting the passed options)
                else {
                    options = ObjectHelper.assign({}, options, { x : false });
                }
                await scroller.scrollIntoView(recordRect, options);
            }
        }
    }

    /**
     * Scrolls a column into view (if it is not already)
     * @param {Grid.column.Column|String|Number} column Column name (data) or column index or actual column object.
     * @param {BryntumScrollOptions} [options] How to scroll.
     * @returns {Promise} A promise which is resolved when the column header element has been scrolled into view.
     * If the column is not found, returns a resolved promise immediately with no action taken.
     * @category Scrolling
     */
    scrollColumnIntoView(column, options) {
        column = (column instanceof Column) ? column : this.columns.get(column) || this.columns.getById(column) || this.columns.getAt(column);

        if (!column) {
            return resolvedPromise;
        }

        const subGrid = this.getSubGridFromColumn(column);

        if (subGrid.columns.visibleColumns.length > 1) {
            return subGrid.scrollColumnIntoView(column, options);
        }
        return resolvedPromise;
    }

    /**
     * Scrolls a locally available record's cell into view (if it is not already).
     * @param {GridLocationConfig|Grid.util.GridLocation} cellContext Cell selector { id: recordId, column: 'columnName' }
     * @returns {Promise} A promise which resolves when the specified cell has been scrolled into view.
     * @category Scrolling
     */
    scrollCellIntoView(cellContext, options) {
        const location = this.normalizeCellContext(cellContext);
        return this.scrollRowIntoView(location.id, {
            column : location.columnId,
            ...(typeof options === 'boolean' ? { animate : options } : options)
        });
    }

    /**
     * Scroll all the way down
     * @returns {Promise} A promise which resolves when the bottom is reached.
     * @category Scrolling
     * @non-lazy-load
     */
    scrollToBottom(options) {
        // triggers scroll to last record. not using current scroller height because we do not know if it is correct
        return this.scrollRowIntoView(this.isLockedRows ? this.originalStore.last : this.store.last, options);
    }

    /**
     * Scroll all the way up
     * @returns {Promise} A promise which resolves when the top is reached.
     * @category Scrolling
     */
    scrollToTop(options) {
        return this.scrollable.scrollBy(0, -this.scrollable.y, options);
    }

    //region Cell highlighting

    /**
     * Highlights the specified cells. If `scroll` is set to `true` (which it is by default), the highlighted cell
     * closest to the viewport center will be scrolled into view.
     *
     * By default, the highlighting will fade out non-highlighted cells. Use the `mode` option to change the
     * highlight style to apply a background color to the highlighted cells instead.
     *
     * ```javascript
     * // Highlight single cell (default fade mode)
     * grid.highlightCells({ cells : { id : 1, field : 'name' } });
     * // Highlight with background color
     * grid.highlightCells({ cells : { id : 1, field : 'name' }, mode : 'color' });
     * // Highlight multiple cells
     * grid.highlightCells({ cells : [{ id : 1, field : 'name' }, { id : 2, field : 'age' }] });
     * // Don't scroll to highlighted cell, and don't un-highlight on click
     * grid.highlightCells({ cells : { id : 1, field : 'name' }, scroll : false, unhighlightOnClick : false });
     * // Auto-unhighlight after 2 seconds
     * grid.highlightCells({ cells : { id : 1, field : 'name' }, unhighlightAfter : 2000 });
     * ```
     *
     * {@inlineexample Grid/view/CellHighlighting.js}
     *
     * @param {Object} options Options config object
     * @param {GridLocationConfig|GridLocationConfig[]} options.cells The cells to highlight. Each cell is specified
     * as a {@link Grid/util/GridLocation GridLocationConfig} object with `id` (or `record`) and `columnId` (or
     * `columnIndex` or `field`).
     * @param {'fade'|'color'} [options.mode='fade'] The highlight mode:
     * - `'fade'` (default): Fades out non-highlighted cells by adding an overlay
     * - `'color'`: Applies a background color to highlighted cells
     * @param {Boolean|BryntumScrollOptions} [options.scroll=true] If `false`, no scrolling will be performed. If a
     * scrollOptions object, this object will be passed to the scroll function providing details on how to scroll.
     * @param {Boolean} [options.unhighlightOnClick=true] If `false`, a call to {@link #function-unhighlightCells} is
     * needed to remove the highlighting. Otherwise, the highlighting will be removed when the user clicks somewhere in
     * the browser window.
     * @param {Boolean} [options.unhighlightOthers=false] If `true` this will automatically un-highlight the cells not
     * present in the `cells` property
     * @param {Number} [options.unhighlightAfter] If specified, the cells highlighted by this call will be automatically
     * un-highlighted after the specified number of milliseconds. Cells highlighted by subsequent calls are not
     * affected.
     * @category Misc
     * @async
     */
    async highlightCells({ cells, mode = 'fade', scroll = true, unhighlightOnClick = true, unhighlightOthers = false, unhighlightAfter }) {
        const
            me                     = this,
            { rowManager }         = me,
            highlighted            = me._highlightedCells ?? (me._highlightedCells = []),
            cellsArray             = ArrayHelper.asArray(cells),
            cellsToAutoUnhighlight = [];
        let scrollToCell, lastDistance, calcDistance;

        // Only need to create the calcDistance function if > 1 cell and scrolling
        if (scroll && cellsArray.length > 1 && rowManager.rows.length) {
            const
                { x, y }      = me._bodyRectangle.center,
                centerRowTop  = (rowManager.getRowAt(y) ?? rowManager.bottomRow)?.top ?? 0;

            calcDistance = location => {
                const
                    { record, column } = location,
                    rowTop             = rowManager.getRecordCoords(record)?.y,
                    columnRect         = column?.element?.getBoundingClientRect(),
                    columnLeft         = columnRect ? (columnRect.left + columnRect.width / 2) : 0,
                    distanceY          = Math.abs(centerRowTop - rowTop),
                    distanceX          = Math.abs(x - columnLeft);

                return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            };
        }

        if (unhighlightOthers && highlighted.length) {
            me.unhighlightCells({ cells : highlighted });
        }

        for (const cellSpec of cellsArray) {
            const location = me.normalizeCellContext(cellSpec);

            if (!location?.record || !location?.column || highlighted.some(h => h.equals(location))) {
                continue;
            }

            highlighted.push(location);

            // Add class to element if rendered
            location.cell?.classList.add('b-highlighted');

            // Track cells for auto-unhighlight
            if (unhighlightAfter > 0) {
                cellsToAutoUnhighlight.push(location);
            }

            let distance;
            // Determine which cell to scroll to (closest to center)
            if (scroll && me.store.includes(location.record)) {
                if (!calcDistance) {
                    // Single cell, no need to perform calculations
                    scrollToCell = location;
                }
                else if ((distance = calcDistance(location)) < lastDistance || lastDistance == null) {
                    lastDistance = distance;
                    scrollToCell = location;
                }
            }
        }

        // Add container class for the highlight mode
        me.toggleCls('b-highlighting-fade', mode === 'fade' && highlighted.length);

        if (scrollToCell) {
            // scroll can be a scroll config object
            await me.scrollCellIntoView(scrollToCell, scroll !== true ? scroll : undefined);
        }

        if (unhighlightOnClick && !me._highlightCellsListener) {
            me._highlightCellsListener = EventHelper.on({
                element     : globalThis,
                thisObj     : me,
                pointerdown : me.unhighlightCells
            });
        }

        // Schedule auto-unhighlight for cells from this call
        if (cellsToAutoUnhighlight.length) {
            me.setTimeout(() => {
                me.unhighlightCells({ cells : cellsToAutoUnhighlight });
            }, unhighlightAfter);
        }

        me.syncSplits?.(other => other.highlightCells({ ...arguments[0], unhighlightOnClick : false }));
    }

    /**
     * Removes highlighting from the specified cells. If no cells are passed, all highlighted cells will be
     * un-highlighted.
     *
     * ```javascript
     * grid.unhighlightCells({ cells : { id : 1, columnId : 'name' } }); // single cell
     * grid.unhighlightCells({ cells : [{ id : 1, columnId : 'name' }, { id : 2, columnId : 'age' }] }); // multiple cells
     * grid.unhighlightCells(); // all cells
     * ```
     *
     * @param {Object} [options] Options config object
     * @param {GridLocationConfig|GridLocationConfig[]} [options.cells] The cells to un-highlight. Omit this to
     * un-highlight all.
     * @category Misc
     */
    unhighlightCells(options) {
        const
            me                    = this,
            { _highlightedCells } = me;
        let cells                 = options?.cells;

        // When called from click listener, options will be the browser event
        if (DomHelper.isDOMEvent(options)) {
            const { target } = options;

            // Try to detect scrollbar clicks
            if (target.closest('.b-virtual-scroller') ||
                (me.bodyContainer === target && me.scrollable.hasOverflowY && (options.offsetX > target.clientWidth ||
                    (!DomHelper.scrollBarWidth && options.offsetX > target.clientWidth - 15)))
            ) {
                return;
            }
            cells = null;
        }

        if (_highlightedCells?.length) {
            const cellsToUnhighlight = cells ? ArrayHelper.asArray(cells).map(c => me.normalizeCellContext(c)) : null;

            for (let i = _highlightedCells.length - 1; i >= 0; i--) {
                const highlightedCell = _highlightedCells[i];

                if (!cellsToUnhighlight || cellsToUnhighlight.some(c => c.equals(highlightedCell))) {
                    highlightedCell.cell?.classList.remove('b-highlighted');
                    _highlightedCells.splice(i, 1);
                }
            }
        }

        if (!_highlightedCells?.length) {
            me.removeCls('b-highlighting-fade');
        }

        if (me._highlightCellsListener) {
            me._highlightCellsListener();
            me._highlightCellsListener = null;
        }

        me.syncSplits?.(other => other.unhighlightCells(options));
    }

    validateHighlightedCells() {
        const
            me = this,
            { _highlightedCells } = me;

        if (_highlightedCells?.length) {
            for (let i = _highlightedCells.length - 1; i >= 0; i--) {
                const {
                    id,
                    _column
                } = _highlightedCells[i];
                // Remove any highlighted cells which are no longer valid
                if (me.store.indexOf(id) === -1 || !me.columns.visibleColumns.includes(_column)) {
                    _highlightedCells.splice(i, 1);
                }
            }

            if (!_highlightedCells?.length) {
                me.removeCls('b-highlighting-fade');
            }
        }
    }

    //endregion

    /**
     * Stores the scroll state. Returns an objects with a `scrollTop` number value for the entire grid and a `scrollLeft`
     * object containing a left position scroll value per sub grid.
     * @returns {Object}
     * @category Scrolling
     */
    storeScroll() {
        const
            { y, scrollTopState }          = this.scrollable,
            state = this.storedScrollState = {
                scrollTop  : y ?? scrollTopState ?? 0,
                scrollLeft : {}
            };

        this.eachSubGrid(subGrid => {
            state.scrollLeft[subGrid.region] = subGrid.scrollable.x;
        });

        return state;
    }

    /**
     * Restore scroll state. If state is not specified, restores the last stored state.
     * @param {Object} [state] Scroll state, optional
     * @category Scrolling
     */
    restoreScroll(state = this.storedScrollState) {
        const me = this;

        // <remove-on-release>
        // TODO: Implement special multi-element Scroller subclass for Grids which
        //  encapsulates the x axis only Scrollers of all its SubGrids.
        // </remove-on-release>
        me.eachSubGrid(subGrid => {
            const x = state.scrollLeft[subGrid.region];

            // Force scrollable to set its position to the underlying element in case it was removed and added back to
            // the DOM prior to restoring state
            if (x != null) {
                subGrid.scrollable.updateX(x);
                subGrid.header.scrollable.updateX(x);
                subGrid.footer.scrollable.updateX(x);
                subGrid.fakeScroller?.updateX(x);
            }
        });

        me.restoreVerticalScroll(state);
    }

    restoreVerticalScroll(state = this.storedScrollState) {
        const { rowManager, scrollable } = this;

        // Unless the grid has been initialized with a store with inline data, then this is likely too early.
        // In that case, we'll wait for the rowManager to change the total height.
        if (rowManager.rowCount) {
            scrollable.updateY(state.scrollTop);
        }
        else {
            scrollable.scrollTopState = state.scrollTop;
            rowManager.ion({
                changeTotalHeight : () => this.restoreVerticalScroll(state),
                once              : true
            });
        }
    }

    //endregion

    //region Theme & measuring

    beginGridMeasuring() {
        const me = this;

        me.addCls('b-grid-measuring');
        if (!me.$measureCellElements) {
            me.$measureCellElements = DomHelper.createElement({
                // For row height measuring, features are not yet there. Work around that for the stripe feature,
                // which removes borders
                className : 'b-grid-sub-grid ' + (!me._isRowMeasured && me.hasFeature('stripe') ? 'b-stripe' : ''),
                reference : 'subGridElement',
                style     : {
                    position   : 'absolute',
                    top        : '-10000px',
                    left       : '-100000px',
                    visibility : 'hidden',
                    contain    : 'strict'
                },
                children : [
                    {
                        className : 'b-grid-row',
                        reference : 'rowElement',
                        children  : [
                            {
                                className : 'b-grid-cell',
                                reference : 'cellElement',
                                style     : {

                                    width                : 'auto',
                                    // The column line border must not be included when measuring content width.
                                    borderInlineEndWidth : 0,
                                    contain              : BrowserHelper.isFirefox ? 'layout paint' : 'layout style paint'
                                }
                            }
                        ]
                    }
                ]
            });
        }

        // Bring element into life if we get here early, to be able to access verticalScroller below
        me.getConfig('element');

        // Temporarily add to where subgrids live, to get have all CSS classes in play
        me.verticalScroller.appendChild(me.$measureCellElements.subGridElement);

        // Not yet on page, which prevents us from getting style values. Add it to the DOM temporarily
        if (!me.rendered) {
            const
                targetEl    = me.appendTo || me.insertBefore || document.body,
                rootElement = DomHelper.getRootElement(typeof targetEl === 'string' ? document.getElementById(targetEl) : targetEl) || document.body;

            if (!me.adopt || !rootElement.contains(me.element)) {
                rootElement.appendChild(me.element);
                me.$removeAfterMeasuring = true;
            }
        }
        return me.$measureCellElements;
    }

    endGridMeasuring() {
        const me = this;
        me.removeCls('b-grid-measuring');

        // Remove grid from DOM if it was added for measuring
        if (me.$removeAfterMeasuring) {
            me.element.remove();
            me.$removeAfterMeasuring = false;
        }

        // Remove measuring elements from grid
        me.$measureCellElements.subGridElement.remove();
    }

    /**
     * Creates a fake subgrid with one row and measures its height. Result is used as rowHeight.
     * @private
     */
    measureRowHeight() {
        // <remove-on-release>
        // TODO: investigate reading the row height from a CSS variable instead of measuring
        // </remove-on-release>
        const
            me          = this,
            // Create a fake subgrid with one row, since styling for row is specified on .b-grid-sub-grid .b-grid-row
            {
                rowElement,
                cellElement
            }           = me.beginGridMeasuring(),
            // FF 115 ESR returns empty string by default, which evaluates to NaN and breaks subsequent calculations
            bodyZoom    = parseFloat(DomHelper.getStyleValue(document.body, 'zoom')) || 1,
            // Use style height or default height from config.
            // Not using clientHeight since it will have some value even if no height specified in CSS
            styleHeight = parseInt(DomHelper.getStyleValue(rowElement, 'height')),
            borderWidth = parseFloat(DomHelper.getStyleValue(cellElement, 'border-bottom-width')) || 0,
            // FF reports border width adjusted to device pixel ration, e.g. on a 150% scaling it would tell 0.6667px width
            // for a 1px border. Dividing by the integer part to take base devicePixelRatio into account
            multiplier  = bodyZoom * (BrowserHelper.isFirefox ? DomHelper.devicePixelRatio / Math.max(Math.trunc(DomHelper.devicePixelRatio), 1) : 1);

        // Change rowHeight if specified in styling, also remember that value to replace later if theme changes and
        // user has not explicitly set some other height
        if (!me._isRowMeasured || me.rowHeight == null || me.rowHeight === me._rowHeightFromStyle) {
            me.rowHeight           = !isNaN(styleHeight) && styleHeight ? styleHeight : me.defaultRowHeight;
            me._rowHeightFromStyle = me.rowHeight;
        }

        me._rowBorderHeight = Math.round(multiplier * borderWidth);

        me._isRowBorderMeasured = me._isRowMeasured = true;

        me.endGridMeasuring();
    }

    // Separate from measureRowHeight since we want to measure border even when row height is fixed
    measureRowBorder() {
        const
            // Create a fake subgrid with one row, since styling for row is specified on .b-grid-sub-grid .b-grid-row
            { cellElement } = this.beginGridMeasuring(),
            // FF 115 ESR returns empty string by default, which evaluates to NaN and breaks subsequent calculations
            bodyZoom        = parseFloat(DomHelper.getStyleValue(document.body, 'zoom')) || 1,
            borderWidth     = parseFloat(DomHelper.getStyleValue(cellElement, 'border-bottom-width')) || 0,
            // FF reports border width adjusted to device pixel ration, e.g. on a 150% scaling it would tell 0.6667px width
            // for a 1px border. Dividing by the integer part to take base devicePixelRatio into account
            multiplier      = bodyZoom * (BrowserHelper.isFirefox ? DomHelper.devicePixelRatio / Math.max(Math.trunc(DomHelper.devicePixelRatio), 1) : 1);

        this._rowBorderHeight = Math.round(multiplier * borderWidth);

        this._isRowBorderMeasured = true;

        this.endGridMeasuring();
    }

    // Global `theme` event handler, remeasures row height on stylesheet changes
    onGridThemeChange({ theme, mode }) {
        // A light/dark switch only changes colours, so the row height is unchanged
        if (mode) {
            return;
        }

        // Can only measure when we are visible, so do it next time we are.
        this.whenVisible('measureRowHeight');

        this.trigger('theme', { theme });
    }

    // Scrollbars toggled on the platform, or measured after the document got rendered
    onScrollBarWidthChange() {
        if (this.isPainted) {
            this.refreshVirtualScrollbars();
        }
    }

    onGlobalZoomChange() {
        const me = this;

        if (!me.isPainted) {
            return;
        }

        me.refreshBodyRectangle();

        const bodyHeight = me.bodyContainer.offsetHeight;

        if (bodyHeight !== me._bodyHeight) {
            me._bodyHeight = bodyHeight;
            me.rowManager.initWithHeight(bodyHeight);
        }
    }

    get rowBorderHeight() {
        return this._rowBorderHeight ?? (this.rowLines ? 1 : 0);
    }

    //endregion

    //region Rendering of rows

    /**
     * Triggers a re-render of all currently rendered rows from the current record data, without reloading and
     * without scrolling. Equivalent to calling {@link #function-refreshRows} with no arguments.
     *
     * {@note}Manipulating records and Grid settings refreshes the Grid automatically. You should only need to call
     * this function if you have outside data/settings unknown to the Grid that has changed and requires Grid to
     * update the rows to reflect the changes{/@note}
     *
     * @category Rendering
     */
    refresh() {
        this.refreshRows();
    }

    /**
     * Triggers a render of all the cells in the row for the passed record.
     *
     * Since Grid uses virtualized rows, calling this method for a record that is not currently displayed in a row will
     * not have any effect.
     *
     * {@note}Manipulating records and Grid settings refreshes the Grid automatically. You should only need to call
     * this function if you have outside data/settings unknown to the Grid that has changed and requires Grid to update
     * the row to reflect the changes{/@note}
     *
     * @param {Core.data.Model} record The record whose row should be refreshed
     * @category Rendering
     */
    refreshRow(record) {
        this.refreshRows([record]);
    }

    /**
     * Triggers a render of all the cells in the rows for the passed records. Leave the argument out to refresh all
     * rows.
     *
     * Since Grid uses virtualized rows, calling this method for records that are not currently displayed in rows will
     * not have any effect.
     *
     * {@note}Manipulating records and Grid settings refreshes the Grid automatically. You should only need to call
     * this function if you have outside data/settings unknown to the Grid that has changed and requires Grid to update
     * rows to reflect the changes{/@note}
     *
     * @param {Core.data.Model[]} [records] The records whose rows should be refreshed
     * @category Rendering
     */
    refreshRows(records = null, returnToTop = false) {
        if (this.refreshSuspended) {
            return;
        }

        const { rowManager } = this;

        if (!records) {
            this.addCls('b-notransition');

            if (returnToTop) {
                rowManager.returnToTop();
            }
            else {
                // Force refreshing even if we had no rows previously
                rowManager.refresh(true);
            }

            this.removeCls('b-notransition');
        }
        else {
            const rows = records.flatMap(record => rowManager.getRowById(record) ?? []);

            rowManager.renderRows(rows);
        }
    }

    /**
     * Triggers a render of all the cells in a column.
     * @param {Grid.column.Column|Grid.column.Column[]} column
     * @param {Boolean} [enableTransitions=true] Set to `false` to disable transitions in cells
     * @category Rendering
     */
    refreshColumn(column, enableTransitions = true) {
        const me = this;

        // Rows may still belong to a previous store while refresh is suspended, resuming refreshes all cells anyway
        if (me.refreshSuspended) {
            return;
        }

        // Skip columns in a collapsed subgrid - they have no rendered cells. Same goes for leaf columns outside of
        // the viewport when virtualizing columns (isIntersecting is only maintained for leaves, parent columns are
        // refreshed through their children)
        const columns = ArrayHelper.asArray(column).filter(column =>
            column?.isVisible && !column.subGrid?.collapsed &&
            (!me.virtualizeColumns || !column.isLeaf || column.meta.isIntersecting));

        if (columns.length) {
            me.runWithTransition(() => {
                for (const column of columns) {
                    if (column.isLeaf) {
                        me.rowManager.forEach(row => {
                            const cell = row.getCell(column.id);

                            if (cell) {
                                row.renderCell(cell);
                            }
                        });
                    }
                    else {
                        column.children.forEach(child => me.refreshColumn(child));
                    }
                }
            }, enableTransitions);
        }
    }

    //endregion

    //region Render the grid

    /**
     * Recalculates virtual scrollbars widths and scrollWidth
     * @private
     */
    refreshVirtualScrollbars() {
        // NOTE: This was at some point changed to only run on platforms with width-occupying scrollbars, but it needs
        // to run with overlayed scrollbars also to make them show/hide as they should.

        // Callers are buffered (see bufferedAfterColumnsResized), so the call may land after the grid was destroyed
        // or before it has rendered, when there are no scrollbar elements to sync
        if (!this.virtualScrollers) {
            return;
        }

        const
            me                        = this,
            {
                headerContainer,
                footerContainer,
                virtualScrollers,
                scrollable,
                hasVerticalOverflow
            }                         = me,
            { classList }             = virtualScrollers,
            hadHorizontalOverflow     = !classList.contains('b-hide-display'),
            // We need to ask each subGrid if it has horizontal overflow.
            // If any do, we show the virtual scroller, otherwise we hide it.
            hasHorizontalOverflow     = Object.values(me.subGrids).some(subGrid => subGrid.overflowingHorizontally),
            horizontalOverflowChanged = hasHorizontalOverflow !== hadHorizontalOverflow,
            scrollBarWidth            = DomHelper.getStyleValue(scrollable.element, 'scrollbar-width') !== 'none' && DomHelper.scrollBarWidth;

        // If horizontal overflow state changed, the docked horizontal scrollbar's visibility
        //  must be synced to match, and this may cause a height change;
        if (horizontalOverflowChanged) {
            virtualScrollers.classList.toggle('b-hide-display', !hasHorizontalOverflow);
        }

        // Auto-widthed padding element at end hides or shows to create matching margin.
        if (scrollBarWidth) {
            // Header will need its extra padding if we have overflow, *OR* if we are overflowY : scroll
            const needsPadding = hasVerticalOverflow || scrollable.overflowY === 'scroll';

            headerContainer.classList.toggle('b-show-yscroll-padding', needsPadding);
            footerContainer.classList.toggle('b-show-yscroll-padding', needsPadding);
            virtualScrollers.classList.toggle('b-show-yscroll-padding', needsPadding);

            // Do any measuring necessitated by show/hide of the docked horizontal scrollbar
            /// *after* mutating DOM classnames.
            if (horizontalOverflowChanged || !me.$virtualScrollbarsRefreshed) {
                // Ask all subGrids to sync the widths of the scroll elements inside the docked horizontal scrollbar
                // so that it takes up the required scrollbar width at the bottom of our body element.
                me.callEachSubGrid('refreshFakeScroll');
                me.onHeightChange();
            }
        }
    }

    get hasVerticalOverflow() {
        return this.scrollable.hasOverflow('y');
    }

    /**
     * Returns content height calculated from row manager
     * @member {Number}
     * @readonly
     * @private
     */
    get contentHeight() {
        const { rowManager } = this;
        return Math.max(rowManager.totalHeight, rowManager.bottomRow ? rowManager.bottomRow.bottom : 0);
    }

    onContentChange() {
        const
            me             = this,
            { rowManager } = me;

        if (me.isVisible) {
            // Fix total content height immediately if it's an autoHeight grid
            rowManager.estimateTotalHeight(me.autoHeight);
            me.paintListener = null;
            me.refreshTotalHeight(me.contentHeight);
            me.callEachSubGrid('refreshFakeScroll');
            me.onHeightChange();
        }
        // If not visible, this operation MUST be done when we become visible.
        // This is announced by the paint event which is triggered when a Widget
        // really gains visibility, ie is shown or rendered, or it's not hidden,
        // and a hidden/non-rendered ancestor is shown or rendered.
        // See Widget#triggerPaint.
        else if (!me.paintListener) {
            me.paintListener = me.once('paint', 'onContentChange', me);
        }
    }

    triggerPaint() {
        if (!this.isPainted) {
            this.refreshBodyRectangle();
        }

        super.triggerPaint();
    }

    onHeightChange() {
        const me = this;

        // cache to avoid recalculations in the middle of rendering code (RowManger#getRecordCoords())
        me.refreshBodyRectangle();
        me._bodyHeight = me.autoHeight ? me.contentHeight : me.bodyContainer.offsetHeight;
    }

    /**
     * Suspends UI refreshes after updates to the underlying data.
     *
     * Multiple calls to `suspendRefresh` stack up, and will require an equal number of `resumeRefresh` calls to
     * actually resume UI refresh.
     *
     * @category Rendering
     */
    suspendRefresh() {
        this.refreshSuspended++;
    }

    /**
     * Resumes UI refreshes after updates to the underlying data.
     *
     * Multiple calls to `suspendRefresh` stack up, and will require an equal number of `resumeRefresh` calls to
     * actually resume UI refresh.
     *
     * Specify `false` as the first param to not refresh if this call unblocked the refresh suspension.
     *
     * @param {Boolean} [trigger=true] `true` to trigger a refresh, if this resume unblocks suspension
     * @category Rendering
     */
    resumeRefresh(trigger = true) {
        if (this.refreshSuspended && !--this.refreshSuspended) {
            if (trigger) {
                this.refreshRows();
            }

            this.trigger('resumeRefresh', { trigger });
        }
    }

    /**
     * Rerenders all grid rows, completely replacing all row elements with new ones
     * @category Rendering
     */
    renderRows(keepScroll = true) {
        const
            me          = this,
            scrollState = keepScroll && me.storeScroll();

        if (me.refreshSuspended) {
            return;
        }

        /**
         * Grid rows are about to be rendered
         * @event beforeRenderRows
         * @param {Grid.view.GridBase} source This grid.
         */
        me.trigger('beforeRenderRows');
        me.renderingRows = true;

        // This allows us to do things like disable animations on a refresh
        me.addCls('b-grid-refreshing');

        if (!keepScroll) {
            me.scrollable.y = me._scrollTop = 0;
        }

        const result = me.rowManager.reinitialize(!keepScroll);

        /**
         * Grid rows have been rendered
         * @event renderRows
         * @param {Grid.view.GridBase} source This grid.
         */
        me.trigger('renderRows');

        me.renderingRows = false;
        me.onContentChange();

        if ('scrollTop' in result) {
            if (keepScroll) {
                scrollState.scrollTop = result.scrollTop;
            }
            else {
                me.scrollable.y = result.scrollTop;
            }
        }

        if (keepScroll) {
            me.restoreScroll(scrollState);
        }

        if (me.autoHeight && me.store.count > 200 && !me.autoHeightWarning && !me.disableAutoHeightWarning) {
            console.warn('Warning: \'autoHeight\' is enabled for a large number of rows (200+). While \'autoHeight\' provides flexibility, it should be used cautiously as it disables virtualization, leading to significant performance degradation with large datasets. Consider alternatives to maintain optimal performance.');
            me.autoHeightWarning = true;
        }

        me.removeCls('b-grid-refreshing');
    }

    /**
     * Rerenders the grids rows, headers and footers, completely replacing all row elements with new ones
     * @category Rendering
     */
    renderContents() {
        const
            me                                                        = this,
            { element, headerContainer, footerContainer, rowManager } = me;

        me.emptyCache();

        // columns will be "drawn" on render anyway, bail out
        if (me.isPainted) {
            // reset measured header height, to make next call to get headerHeight measure it
            me._headerHeight = null;

            // Important to fix subgrid sizes before refreshing header
            me.fixSizes();

            me.callEachSubGrid('refreshHeader');
            me.callEachSubGrid('refreshFooter');

            // Note that these are hook methods for features to plug in to. They do not do anything.
            me.renderHeader(headerContainer, element);
            me.renderFooter(footerContainer, element);

            me.updateColumnHeadersAriaColumnIndex();

            // any elements currently used for rows should be released.
            // actual removal of elements is done in SubGrid#clearRows
            const refreshContext = rowManager.removeAllRows();

            rowManager.calculateRowCount(false, true, true);

            // Sets up the RowManager's position for when renderRows calls RowManager#reinitialize
            // so that it renders the correct data block at the correct position.
            rowManager.setPosition(refreshContext);

            me.renderRows();
        }
    }

    /**
     * Rerenders all grid headers
     * @category Rendering
     */
    refreshHeaders() {
        this.callEachSubGrid('refreshHeader');
    }

    /**
     * Rerender a single grid header
     * @param {Grid.column.Column} column The column to refresh
     * @category Rendering
     */
    refreshHeader(column) {
        column.subGrid.refreshHeader();
    }

    // Render rows etc. on first paint, to make sure Grid's element has been laid out
    onInternalPaint(options) {
        const
            me             = this,
            { rowManager } = me,
            { firstPaint } = options;

        me.ariaElement.setAttribute('aria-rowcount', me.store.count + 1);

        super.onInternalPaint?.(options);



        if (!firstPaint) {
            if (!rowManager.totalHeight) {
                me.rowManager.estimateTotalHeight(true);
            }
            return;
        }

        const
            {
                store,
                element,
                headerContainer,
                bodyContainer,
                footerContainer
            }         = me,
            scrollPad = DomHelper.scrollBarPadElement;

        let columnsChanged,
            maxDepth = 0;

        if (firstPaint) {
            !me._isRowBorderMeasured && me.measureRowBorder();
        }

        // ARIA. Update our ariaElement that encapsulates all rows.
        // The header is counted as a row, and column headers are cells.
        me.role = store?.isTree ? 'treegrid' : 'grid';

        // See if updateResponsive changed any columns.
        me.columns.once('change', () => columnsChanged = true);

        // Apply any responsive configs before rendering rows.
        me.updateResponsive(me.width, 0);

        // If there were any column changes, apply them
        if (columnsChanged) {
            me.callEachSubGrid('refreshHeader', headerContainer);
            me.callEachSubGrid('refreshFooter', footerContainer);
        }

        // Note that these are hook methods for features to plug in to. They do not do anything.
        // SubGrids take care of their own rendering.
        me.renderHeader(headerContainer, element);
        me.renderFooter(footerContainer, element);

        // These padding elements are only visible on scrollbar showing platforms.
        // And then, only when the owning element as the b-show-yscroll-padding class added.
        // See refreshVirtualScrollbars where this is synced on the header, footer and scroller elements.
        DomHelper.append(headerContainer, scrollPad);
        DomHelper.append(footerContainer, scrollPad);
        DomHelper.append(me.virtualScrollers, scrollPad);

        // Cached, updated on resize. Used by RowManager and by the subgrids upon their render.
        // Measure after header and footer have been rendered and taken their height share.
        me.refreshBodyRectangle();
        const bodyOffsetHeight = me.bodyContainer.offsetHeight;

        if (me.autoHeight) {
            me._bodyHeight             = rowManager.initWithHeight(element.offsetHeight - headerContainer.offsetHeight - footerContainer.offsetHeight, true);
            bodyContainer.style.height = me.bodyHeight + 'px';
        }
        else {
            me._bodyHeight = bodyOffsetHeight;
            rowManager.initWithHeight(me._bodyHeight, true);
        }

        me.eachSubGrid(subGrid => {
            if (subGrid.header.maxDepth > maxDepth) {
                maxDepth = subGrid.header.maxDepth;
            }
        });

        headerContainer.dataset.maxDepth = maxDepth;

        me.fixSizes();
        me.updateColumnHeadersAriaColumnIndex();

        if (store.count || !store.isLoading) {
            me.renderRows();
        }

        // With autoHeight cells we need to refresh rows when fonts are loaded, to get correct measurements
        if (me.columns.usesAutoHeight) {
            const { fonts } = document;
            if (fonts?.status !== 'loaded') {
                fonts.ready.then(() => !me.isDestroyed && me.refreshRows());
            }
        }

        me.initScroll();

        me.initInternalEvents();
    }

    render(...args) {
        const me = this;

        // When displayed inside one of our containers, require a size to be considered visible. Ensures it is painted
        // on display when for example in a tab
        me.requireSize = Boolean(me.owner);

        // Render as a container. This renders the child SubGrids
        super.render(...args);

        me.setupFocusListeners();

        if (!me.autoHeight) {
            // Sanity check that main element has been given some sizing styles, unless autoHeight is used in which case
            // it will be sized programmatically instead
            if (me.headerContainer.offsetHeight && !me.bodyContainer.offsetHeight) {
                console.warn('Grid element not sized correctly, please check your CSS styles and review how you size the widget');
            }

            // Warn if height equals the predefined minHeight, likely that is not what the dev intended
            if (
                !me.splitFrom && !me.features.split?.owner && // Don't warn for splits
                !('minHeight' in me.initialConfig) &&
                !('height' in me.initialConfig) &&
                !me.collapsed &&
                parseInt(globalThis.getComputedStyle(me.element).minHeight) === me.height
            ) {
                console.warn(
                    `The ${me.$$name} is sized by its predefined minHeight, likely this is not intended. ` +
                    `Please check your CSS and review how you size the widget, or assign a fixed height in the config. ` +
                    `For more information, see the "Basics/Sizing the component" guide in docs.`
                );
            }
        }
    }

    //endregion

    //region Hooks

    /**
     * Called after headers have been rendered to the headerContainer.
     * This does not do anything, it's just for Features to hook in to.
     * @param {HTMLElement} headerContainer DOM element which contains the headers.
     * @param {HTMLElement} element Grid element
     * @private
     * @category Rendering
     */
    renderHeader(headerContainer, element) {}

    /**
     * Called after footers have been rendered to the footerContainer.
     * This does not do anything, it's just for Features to hook in to.
     * @param {HTMLElement} footerContainer DOM element which contains the footers.
     * @param {HTMLElement} element Grid element
     * @private
     * @category Rendering
     */
    renderFooter(footerContainer, element) {}

    // Hook for features to affect cell rendering before renderers are run
    beforeRenderCell(renderData, cellContext) {
        // Apply highlight class if this cell is highlighted
        if (this._highlightedCells?.length) {
            renderData.cellCls['b-highlighted'] = this._highlightedCells.some(h => h.equals(cellContext, true));
        }
    }

    // Hooks for features to react to a row being rendered
    beforeRenderRow() {}

    afterRenderRow() {}

    // Hook for features to react to scroll
    afterScroll() {}

    // Hook that can be overridden to prepare custom editors, can be used by framework wrappers
    processCellEditor(editorConfig) {}

    // Hook for features to react to column changes
    afterColumnsChange(...args) {
        super.afterColumnsChange(...args);
    }

    // Hook for features to react to record removal (which might be transitioned)
    afterRemove(removeEvent) {}

    // Hook for features to react to groups being collapsed/expanded
    afterToggleGroup() {}

    // Hook for features to react to subgrid being collapsed
    afterToggleSubGrid() {}

    // Hooks for features to react to animated row removal
    beforeAnimatedRowRemoval() {}
    afterAnimatedRowRemoval() {}

    // Hook into Base, to trigger a separate hook for features to use.
    // If features hook directly into this, it will be called both for Grid's changes + feature's changes,
    // since they also extend Base.
    onConfigChange(info) {
        super.onConfigChange(info);

        if (!this.isConfiguring) {
            this.afterConfigChange(info);
        }
    }

    afterPluginConfigChange() {}

    afterConfigChange(info) {}

    afterAddListener(eventName, listener) {}

    afterRemoveListener(eventName, listener) {}

    afterPositionCells() {}

    //endregion

    //region Masking and Appearance

    syncMaskCover(mask = this.masked) {
        if (mask) {
            const
                bodyRect     = (mask.cover === 'body') && this.rectangleOf('bodyContainer'),
                scrollerRect = bodyRect && DomHelper.scrollBarWidth && this.rectangleOf('virtualScrollers'),
                { style }    = mask.element;

            // the width of the bodyCt covers the vscroll but the height does not cover the hscroll:
            style.marginTop = bodyRect ? `${bodyRect.y - 1}px` : '';
            style.height    = bodyRect ? `${bodyRect.height + (scrollerRect?.height || 0) + 1}px` : '';
        }
    }

    changeMasked(mask, maskInstance) {
        if (mask) {
            const me = this;
            if (typeof mask === 'string') {
                mask = { text : mask };
            }
            // Adjust to cover parent element fully when using LockRows feature
            if (me.isLockedRows || me.splitFrom) {
                mask.cover = null;
                mask.target = me.element.parentElement;
            }
            else {
                mask.cover = 'body';
                mask.target = me.element;
            }
        }
        return super.changeMasked(mask, maskInstance);
    }

    /**
     * Show a load mask with a spinner and the specified message. When using an AjaxStore masking and unmasking is
     * handled automatically, but if you are loading data in other ways you can call this function manually when your
     * load starts.
     * ```
     * myLoadFunction() {
     *   // Show mask before initiating loading
     *   grid.maskBody('Loading data');
     *   // Your custom loading code
     *   load.then(() => {
     *      // Hide the mask when loading is finished
     *      grid.unmaskBody();
     *   });
     * }
     * ```
     * @param {String|MaskConfig} loadMask The message to show in the load mask (next to the spinner) or a config object
     * for a {@link Core.widget.Mask}.
     * @returns {Core.widget.Mask}
     * @category Misc
     */
    maskBody(loadMask) {
        let ret;

        if (this.bodyContainer) {
            this.masked = Mask.mergeConfigs(this.loadMaskDefaults, { showDelay : 0 }, loadMask);  // smart setter
            ret         = this.masked;  // read back
        }

        return ret;
    }

    /**
     * Hide the load mask.
     * @category Misc
     */
    unmaskBody() {
        this.masked = null;
    }

    updateEmptyText(emptyText) {
        this.emptyTextEl?.remove();

        const
            isDomConfig = typeof emptyText === 'object',
            targetSubGrid = emptyText?.region ? this.getSubGrid(emptyText.region) : this.firstItem;

        if (isDomConfig) {
            emptyText = ArrayHelper.asArray(emptyText);
        }

        // Grid might be created without subgrids, will add element to first when it is added
        this.emptyTextEl = DomHelper.createElement({
            parent                                                                  : targetSubGrid?.element,
            className                                                               : 'b-empty-text',
            [isDomConfig ? 'children' : emptyText?.includes('<') ? 'html' : 'text'] : emptyText
        });
    }

    toggleEmptyText() {
        const
            me           = this,
            store        = me.isLockedRowsView ? me.store.$master : me.store,
            isEmpty      = !(store.count > 0 || store.isLoading || store.isCommitting),
            storeIsEmpty = Boolean((!store.count && !store.isFiltered) || store.isLoading || store.isCommitting);

        me.toggleCls('b-grid-empty', isEmpty);

        // A populated, unfiltered store is the unremarkable case with nothing to say. Announcing a blank message
        // instead would be a write to a region shared with every other widget in the root.
        if (storeIsEmpty) {
            me.announceAriaLive(me.emptyText);
        }
        else if (store.isFiltered) {
            me.announceAriaLive(me.L('L{filteredRecords}', store.count));
        }
    }

    // Notify columns when our read-only state is toggled
    updateReadOnly(readOnly, old) {
        super.updateReadOnly(readOnly, old);

        if (!this.isConfiguring) {
            for (const column of this.columns.bottomColumns) {
                column.updateReadOnly?.(readOnly);
            }
        }
    }

    //endregion

    //region Extract config

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // It extracts the current configs for the grid, with special handling for inline data
    getCurrentConfig(options) {
        const
            result     = super.getCurrentConfig(options),
            { store }  = this,
            // Clean up inline data to not have group records in it
            data       = store.getInlineData(options),
            // Get stores current state, in case it has filters etc. added at runtime
            storeState = store.getCurrentConfig(options) || result.store;

        if (data.length) {
            result.data = data;
        }

        // Don't include the default model class
        if (storeState && store.originalModelClass === GridRowModel) {
            delete storeState.modelClass;
        }

        if (!ObjectHelper.isEmpty(storeState)) {
            result.store = storeState;
        }

        if (result.store) {
            delete result.store.data;
        }

        return result;
    }

    //endregion

    _animationSuspendedCounter = 0;

    /**
     * Suspends CSS transitions after a row / event has been updated
     *
     * Multiple calls to `suspendAnimations` stack up, and will require an equal number of `resumeAnimations` calls to
     * actually resume animations.
     * @category Misc
     */
    suspendAnimations() {
        this._animationSuspendedCounter++;
    }

    /**
     * Resumes CSS transitions after a row / event has been updated
     * @category Misc
     */
    resumeAnimations() {
        this._animationSuspendedCounter--;
    }

    /**
     * Runs a function with transitions enabled (row height, event size etc.). Useful if you want to alter the UI
     * state with a transition.
     *
     * @param {Function} fn The function to run
     * @privateparam {Boolean} shouldAnimate boolean if it is false, animation won't run, otherwise animation runs
     * @returns {Promise} A promise which resolves when the transition duration has expired
     * @category Misc
     */
    async runWithTransition(fn, shouldAnimate = true) {
        const me = this;

        if (!shouldAnimate || !me.isVisible || me._animationSuspendedCounter !== 0 || (me.isTimelineBase && me.transition.changeEvent !== true)) {
            return fn();
        }

        me.isAnimating = true;
        await me.executeAndAwaitAnimations(me.element, fn);

        // Setting isAnimating = false actually decrements the me._isAnimatingCounter
        // it will become actually false when counter reaches zero
        me.isAnimating = false;

        // me.isAnimating will be 0 if this is the last transition, only trigger transitionEnd in that case
        if (!me.isDestroyed && !me.isAnimating) {
            me.trigger('transitionEnd');
        }
    }

    // Wait for conditions that might prevent animations from running, such as the TreeGroup asynchronously
    // reforming the tree
    async waitForReadiness() {
        await this.features.treeGroup?.waitForReadiness?.();
    }
}

// Register this widget type with its Factory
GridBase.initClass();

VersionHelper.setVersion('grid', '8.0.1');
