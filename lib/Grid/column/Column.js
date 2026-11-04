import Model from '../../Core/data/Model.js';
import Localizable from '../../Core/localization/Localizable.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Events from '../../Core/mixin/Events.js';
import Widget from '../../Core/widget/Widget.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Config from '../../Core/Config.js';
import GridLocation from '../util/GridLocation.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';
import Factoryable from '../../Core/mixin/Factoryable.js';

/**
 * @module Grid/column/Column
 */

const
    notFalsy     = value => value,
    arrowFnRegex = /=>\s*['"]/,
    // Matches JS string and template literals, so HTML auto-detection can inspect the renderer's authored
    // text only - never the surrounding code where minified comparison operators (`value<0`) look tag-like
    stringLiteralRegex = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g,
    // Template literal `${...}` interpolations are code, not authored text, so strip them before testing
    templateExprRegex  = /\$\{[^}]*\}/g;

/**
 * The base class for all other grid column types, used if no type is specified on a column.
 *
 * Default editor is a {@link Core.widget.TextField}.
 *
 * ```javascript
 * const grid = new Grid({
 *   columns : [{
 *     field : 'name',
 *     text  : 'Name'
 *   }, {
 *     text  : 'Hobby',
 *     field : 'others.hobby', // reading nested field data
 *   }, {
 *     type  : 'number', // Will use NumberColumn
 *     field : 'age',
 *     text  : 'Age'
 *   }]
 * });
 * ```
 *
 * ## Column types
 *
 * Grid ships with multiple different column types. Which type to use for a column is specified by the `type` config.
 * The built-in types are:
 *
 * * {@link Grid.column.ActionColumn action} - displays actions (clickable icons) in the cell.
 * * {@link Grid.column.AggregateColumn aggregate} - a column, which, when used as part of a Tree, aggregates the values
 *   of this column's descendants using a configured function which defaults to `sum`.
 * * {@link Grid.column.CheckColumn check} - displays a checkbox in the cell.
 * * {@link Grid.column.DateColumn date} - displays a date in the specified format.
 * * {@link Grid.column.NumberColumn number} - a column for showing/editing numbers.
 * * {@link Grid.column.PercentColumn percent} - displays a basic progress bar.
 * * {@link Grid.column.RatingColumn rating} - displays a star rating.
 * * {@link Grid.column.RowNumberColumn rownumber} - displays the row number in each cell.
 * * {@link Grid.column.TemplateColumn template} - uses a template for cell content.
 * * {@link Grid.column.TimeColumn time} - displays a time in the specified format.
 * * {@link Grid.column.TreeColumn tree} - displays a tree structure when using the {@link Grid.feature.Tree tree}
 *   feature.
 * * {@link Grid.column.WidgetColumn widget} - displays widgets in the cells.
 *
 * ## Tree columns
 *
 * You can add tree rendering to any column type by configuring it with `tree : true`:
 *
 * ```javascript
 * const grid = new TreeGrid({
 *    columns : [
 *        // These are equivalent:
 *        { type: 'tree', field: 'name' },
 *        { field: 'name', tree: true },
 *
 *        // Any column type can be a tree column:
 *        { type: 'check', tree: true, field: 'done' }
 *    ]
 * });
 * ```
 *
 * ## Grouped columns / headers
 *
 * You can group headers by defining parent and children columns. A group can be dragged as a whole, or users can drag
 * individual columns between groups. The same applies to column visibility using the column picker in the header menu,
 * a group can be toggled as a whole or each column individually.
 *
 * ```javascript
 * const grid = new Grid({
 *     {
 *             text     : 'Parent',
 *             children : [
 *                 { text : 'Child 1', field : 'field1', flex : 1 },
 *                 { text : 'Child 2', field : 'field2', flex : 1 }
 *             ]
 *         },
 *         ...
 * }
 * ```
 *
 * {@inlineexample Grid/column/ColumnGrouped.js}
 *
 * ## Collapsible columns
 *
 * By configuring a parent column with `collapsible: true` it is made collapsible. When collapsing all child columns
 * except the first one are hidden. This behaviour is configurable using the {@link #config-collapseMode} config. To
 * make a column start collapsed, set the {@link #config-collapsed} config to `true`.
 *
 * {@inlineexample Grid/column/ColumnCollapse.js}
 *
 ## Adding widgets to the column header
 *
 * You can add custom {@link Core.widget/Widget widgets} to the column header element using the
 * {@link #config-headerWidgets} config.
 *
 * {@inlineexample Grid/column/ColumnWithHeaderWidgets.js}
 *
 * ## Cell renderers and customizing cell content
 *
 * ### Completely controlling cell contents
 *
 * To completely control what is rendered into a cell, provide a
 * {@link Grid.column.Column#config-renderer} function which returns a string or a {@link DomConfig} DOM
 * configuration object.
 *
 * ```javascript
 * const grid = new Grid({
 *   columns : [
 *   ...
 *     {
 *       field      : 'approved',
 *       text       : 'Approved',
 *       htmlEncode : false, // allow to use HTML code
 *       renderer({ value }) {
 *         return value === true ? '<b>Yes</b>' : '<i>No</i>';
 *       }
 *     }
 *     ...
 *     ]
 * });
 * ```
 *
 * ### Augmenting the default rendering
 *
 * To augment the default rendering of Column types which have their own special renderer, you can call
 * the {@link #function-defaultRenderer built-in renderer} from your custom renderer, and use the result.
 * For example, to highlight modified dates in a DateColumn:
 *
 * ```javascript
 * new Grid({
 *     columns : [
 *         ...
 *         {
 *             type  : 'date',
 *             field : 'startDate',
 *             text  : 'Start Date',
 *             renderer({ record, value }) {
 *                 const result = this.defaultRenderer({ value });
 *
 *                 return record.isFieldModified('startDate') ? `<span class="modified">${result}</span>` : result;
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * ### Mutating the cell element after the default rendering
 *
 * You can also use the {@link Grid.column.Column#config-afterRenderCell} callback to mutate the cell element after the default rendering.
 *
 * ```javascript
 * new Grid({
 *     columns : [
 *         {
 *             text     : 'Name',
 *             afterRenderCell : ({ record, row, cellElement }) => {
 *                 cellElement.classList.toggle('myClass', true);
 *                 // Add special CSS class to new rows that have not yet been saved
 *                 row.cls.newRow = record.isPhantom;
 *             }
 *         }
 *     ]
 * });
 * ```
 *
 * ### Using JSX in renderers (React)
 *
 * When using the Bryntum React wrapper, renderers can return JSX elements instead of strings or
 * {@link DomConfig} objects:
 *
 * ```javascript
 * // In your React component's column config:
 * const columns = [
 *     {
 *         text     : 'Name',
 *         field    : 'name',
 *         renderer({ record }) {
 *             return <MyCustomComponent name={record.name} />;
 *         }
 *     }
 * ];
 *
 * // Then pass to the wrapper:
 * <BryntumGrid columns={columns} />
 * ```
 *
 * {@note}Using JSX in renderers creates a React portal for each rendered cell. For grids with many rows or
 * frequently re-rendered views, this may impact scrolling performance compared to returning plain strings or
 * {@link DomConfig} objects. Consider using JSX renderers primarily for cells that require complex interactive React
 * components.{/@note}
 *
 * ## Menus
 *
 * You can add custom items to the context menu for a columns header and for its cells, using
 * {@link Grid.column.Column#config-headerMenuItems} and {@link Grid.column.Column#config-cellMenuItems}. Here is an
 * example:
 *
 * ```javascript
 * const grid = new Grid({
 *   columns : [
 *     ...
 *     {
 *       type  : 'number',
 *       field : 'age',
 *       text  : 'Age',
 *       headerMenuItems: [{
 *           text : 'My unique header item',
 *           icon : 'fa fa-paw',
 *           onItem() { console.log('item clicked'); }
 *       }],
 *       cellMenuItems: [{
 *           text : 'My unique cell item',
 *           icon : 'fa fa-plus',
 *           onItem() { console.log('item clicked'); }
 *       }]
 *     }
 *   ...
 *   ]
 * });
 * ```
 *
 * {@note}Columns without a {@link #property-width} will shrink or expand to the {@link #property-pinnedWidth} value
 * when pinned.{/@note}
 *
 * ## Useful configs and functions
 *
 * | Member                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-field}                         | Data model field to display                          |
 * | {@link #config-text}                          | Column header text                                   |
 * | {@link #config-renderer}                      | Custom cell render function                          |
 * | {@link #config-editor}                        | Cell editor config or widget type                    |
 * | {@link #config-width}                         | Fixed column width in pixels                         |
 * | {@link #config-flex}                          | Flex value for proportional sizing                   |
 * | {@link #config-hidden}                        | Hides the column                                     |
 * | {@link #config-sortable}                      | Enable/disable column sorting                        |
 * | {@link #config-filterable}                    | Enable/disable column filtering                      |
 * | {@link #config-headerMenuItems}               | Custom header context menu items                     |
 * | {@link #config-cellMenuItems}                 | Custom cell context menu items                       |
 *
 * ## Reacting to changes to column properties.
 *
 * It is important to remember that a `Column` is a record (instance of {@link Core.data.Model}) in a
 * grid's {@link Grid.view.Grid#config-columns column store}, and as such, is *not* a Widget, and is *not* observable.
 *
 * Setting properties on it is setting fields in a data record, and will not trigger any changers or updaters in the Column class.
 *
 * Changes to a Column's properties are published through its store's API. For example, to react to changes in a Column's `width`
 * property, you would listen to the {@link Grid.data.ColumnStore#event-update} event on the `ColumnStore`:
 *
 * ```javascript
 * myGrid.columns.on('update', ({ record : column, changes }) => {
 *     if (changes.width) {
 *         console.log(`Column ${column.text} width changed to ${changes.width.value}`);
 *     }
 * });
 * ```
 *
 * ## See also
 *
 * - {@link Grid.data.ColumnStore} - Store that manages column instances
 * - {@link Grid.view.Grid} - The main grid component
 * - {@link Grid.feature.ColumnReorder} - Drag to reorder columns
 * - {@link Grid.feature.ColumnResize} - Drag to resize columns
 *
 * @extends Core/data/Model
 * @classtype column
 * @mixes Core/mixin/Events
 * @mixes Core/localization/Localizable
 * @column
 */
export default class Column extends Model.mixin(Factoryable, Events, Localizable) {
    static $name = 'Column';

    /**
     * Column name alias which you can use in the `columns` array of a Grid.
     *
     * ```javascript
     * class MyColumn extends Column {
     *     static get type() {
     *        return 'mycolumn';
     *     }
     * }
     * ```
     *
     * ```javascript
     * const grid = new Grid({
     *    columns : [
     *       { type : 'mycolumn', text : 'The column', field : 'someField', flex : 1 }
     *    ]
     * });
     * ```
     *
     * @static
     * @member {String} type
     * @readonly
     */
    static type = 'column';

    static factoryable = {
        defaultType : 'column'
    };

    /**
     * Column name alias, which you can use in the `columns` array of a Grid. See {@link #property-type-static}
     * @member {String}
     * @readonly
     */
    get type() {
        return this.constructor.type;
    }
    //region Config

    /**
     * Default settings for the column, applied in constructor. None by default, override in subclass.
     * @member {Object} defaults
     * @returns {Object}
     * @readonly
     */

    /**
     * Child columns. To create grouped headers, specify an array of column configs as children of a parent column.
     * @config {GridColumnConfig[]|Grid.column.Column[]} children
     * @category Parent & children
     */

    static fields = [
        /**
         * @hidefields expanded, children
         */
        /**
         * @hidefunctions ancestorsExpanded, isExpanded
         */

        'children',

        //region Common

        'type',

        /**
         * The text to show in the column header. You can display text vertically by setting the
         * {@link #property-headerWritingMode} property.
         * @prp {String} text
         * @category Common
         */
        'text',

        /**
         * The {@link Core.data.field.DataField#config-name} of the {@link Core.data.Model data model} field to
         * read a cells value from. The field should be defined by the model used by the grid's store.
         *
         * Since version `8.0`, a simple field name which the model does not define, neither as a field nor as any
         * other property on its prototype (a getter, setter or method), is added to the model, see
         * {@link Grid.data.ColumnStore#config-autoAddField}. Paths are excluded, see below.
         *
         * Also accepts dot notation to read nested or related data, for example `'address.city'`. Such a path, and a
         * bracketed path such as `'baselines[0].endDate'`, is resolved through the record graph as long as the model
         * defines no field of that exact name.
         *
         * @prp {String} field
         * @readonly
         * @category Common
         */
        'field',

        // NOTE: This is duplicated in WidgetColumn, NumberColumn, DateColumn and partly in TreeColumn so remember to change there too if
        // changing the signature of this function
        /**
         * Renderer function, used to format and style the content displayed in the cell. Return the cell text you
         * want to display. Can also affect other aspects of the cell, such as styling.
         *
         * <div class="warning">
         * You should never modify any records inside this method.
         * </div>
         *
         * {@note}If you provide a `renderer` to a built-in Column such as {@link Grid.column.DateColumn}, it will completely
         * replace the native rendering. In these cases, you may want to call that column class's
         * {@link #function-defaultRenderer built-in renderer} from your custom renderer to access the default rendered value.{/@note}
         *
         * {@note}If you mutate `cellElement`, and you want to prevent cell content from being reset during
         * rendering, please return `undefined` from the renderer (or just omit the `return` statement) and make
         * sure that the {@link #config-alwaysClearCell} config is set to `false`.{/@note}
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         { text : 'Status', renderer : ({ record }) => record.status }
         *     ]
         * });
         * ```
         *
         * You can also return a {@link Core.helper.DomHelper#typedef-DomConfig} object describing the markup:
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         {
         *              text : 'Status',
         *              renderer : ({ record }) => {
         *                  return {
         *                      class : 'myClass',
         *                      children : [
         *                          {
         *                              tag : 'i',
         *                              class : 'fa fa-pen'
         *                          },
         *                          {
         *                              tag : 'span',
         *                              text : record.name
         *                          }
         *                      ]
         *                  };
         *              }
         *         }
         *     ]
         * });
         * ```
         *
         * You can modify the row element too from inside a renderer to add custom CSS classes:
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         {
         *             text     : 'Name',
         *             renderer : ({ record, row }) => {
         *                // Add special CSS class to new rows that have not yet been saved
         *               row.cls.newRow = record.isPhantom;
         *
         *               return record.name;
         *         }
         *     ]
         * });
         * ```
         *
         * If you are adding a renderer to a column that has a built in renderer (like {@link Grid.column.DateColumn} or
         * {@link Grid.column.NumberColumn}), you may call the {@link #function-defaultRenderer built-in renderer}
         * from your custom renderer if you want to use the default content and modify it. For example, to highlight
         * modified dates in a DateColumn:
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         {
         *             type     : 'date',
         *             field    : 'startDate',
         *             text     : 'Start Date',
         *             renderer : ({ record, column }) => {
         *                 let result = this.defaultRenderer(...arguments);
         *
         *                 // Highlight modified start dates
         *                 if (record.isFieldModified('startDate')) {
         *                     result = `<span class="modified">${result}</span>`;
         *                 }
         *                 return result;
         *             }
         *         }
         *     ]
         * });
         * ```
         *
         * ### Using JSX (React)
         *
         * When using the Bryntum React wrapper, renderers can return JSX elements:
         *
         * ```javascript
         * renderer({ record, value }) {
         *     return <MyComponent value={value} record={record} />;
         * }
         * ```
         *
         * {@note}Using JSX in renderers creates a React portal for each rendered cell. For grids with many
         * rows or frequently re-rendered views, this may impact scrolling performance compared to returning plain
         * strings or {@link DomConfig} objects. Consider using JSX renderers primarily for cells that require complex
         * interactive React components.{/@note}
         *
         * {@note}When renderer includes static HTML output, `htmlEncode` will be automatically set to `false` if not
         * explicitly configured. You are responsible for HTML encoding user-provided data to mitigate XSS issues. See
         * {@link Core.helper.StringHelper#function-encodeHtml-static StringHelper.encodeHtml()}.{/@note}
         *
         * @prp {Function} renderer
         * @param {Object} renderData Object containing renderer parameters
         * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
         * @param {*} renderData.value Value to be displayed in the cell
         * @param {Core.data.Model} renderData.record Record for the row
         * @param {Grid.column.Column} renderData.column This column
         * @param {Grid.view.Grid} renderData.grid This grid
         * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export.
         *   Use the {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
         * @param {Object} renderData.size [DEPRECATED] Use {@link Grid.view.GridBase#config-getRowHeight} to control
         * row heights instead. Row sizing context for the cell. Can be null in case of export
         * @param {Number} renderData.size.height Set this to request a certain row height. Deprecated as of 8.0 and
         *   will be removed in 9.0, use {@link Grid.view.GridBase#config-getRowHeight} to control row heights instead.
         *   Until migrated, also configure the column with {@link #config-alwaysRenderCells} if the grid
         *   {@link Grid.view.GridBase#config-virtualizeColumns virtualizes columns}
         * @param {Number} renderData.size.configuredHeight Row height that will be used if none is requested
         * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format, enabling special handling during export.
         * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
         *   In which case an advanced renderer might need to take different actions.
         * @returns {String|DomConfig|DomConfig[]|HTMLElement|null}
         *
         * @category Rendering
         */
        'renderer',

        /**
         * A callback function called after every cell has been rendered, which lets you mutate the cell/row or
         * contents. This is useful when you want to mutate contents of a pre-configured column (e.g. `CheckColumn`,
         * `WidgetColumn` etc.) without overwriting the built-in `renderer`.
         *
         * In the method, you can modify the cell / row elements, e.g. to add custom CSS classes:
         *
         * ```javascript
         * new Grid({
         *     columns : [
         *         {
         *             text     : 'Name',
         *             afterRenderCell : ({ record, row, cellElement }) => {
         *                 cellElement.classList.toggle('myClass', true);
         *                 // Add special CSS class to new rows that have not yet been saved
         *                 row.cls.newRow = record.isPhantom;
         *             }
         *         }
         *     ]
         * });
         * ```
         *
         * @prp {Function} afterRenderCell
         * @param {Object} renderData Object containing rendering parameters
         * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
         * @param {*} renderData.value Value to be displayed in the cell
         * @param {Core.data.Model} renderData.record Record for the row
         * @param {Grid.column.Column} renderData.column This column
         * @param {Grid.view.Grid} renderData.grid This grid
         * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export.
         *   Use the {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
         * @param {Object} renderData.size [DEPRECATED] Use {@link Grid.view.GridBase#config-getRowHeight} to control
         * row heights instead. Row sizing context for the cell. Can be null in case of export
         * @param {Number} renderData.size.height Set this to request a certain row height
         * @param {Number} renderData.size.configuredHeight Row height that will be used if none is requested
         * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format, enabling special handling during export.
         * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
         * @returns {void|String|null} Return value is only used by the export feature, not by row rendering
         *
         * @category Rendering
         */
        'afterRenderCell',

        /**
         * Column width. If value is Number then width is in pixels
         * @prp {Number|String} width
         * @category Common
         */
        'width',

        /**
         * Column width as a flex weight. All columns with flex specified divide the available space (after
         * subtracting fixed widths) between them according to the flex value. Columns that have `flex : 2` will be
         * twice as wide as those with `flex : 1` (and so on)
         * @prp {Number|String} flex
         * @category Common
         */
        'flex',

        /**
         * This config sizes a column to fits its content. It is used instead of `width` or `flex`.
         *
         * This config requires the {@link Grid.feature.ColumnAutoWidth} feature which responds to changes in the
         * grid's store and synchronizes the widths' of all `autoWidth` columns.
         *
         * If this config is not a Boolean value, it is passed as the only argument to the `resizeToFitContent`
         * method to constrain the column's width.
         *
         * The column's {@link #config-minWidth} is applied on top of that limit, so it wins over a smaller maximum
         * width passed here.
         *
         * @prp {Boolean|Number|Number[]} autoWidth
         * @category Common
         * @non-lazy-load
         */
        'autoWidth',

        /**
         * This config enables automatic height for all cells in this column. It is achieved by measuring the height
         * a cell after rendering it to DOM, and then sizing the row using that height (if it is greater than other
         * heights used for the row).
         *
         * Heads up if you render your Grid on page load, if measurement happens before the font you are using is
         * loaded you might get slightly incorrect heights. For browsers that support it we detect that
         * and remeasure when fonts are available.
         *
         * **NOTE:** Enabling this config comes with a pretty big performance hit. To maintain good performance,
         * we recommend not using it. You can still set the height of individual rows manually, either through
         * {@link Grid.data.GridRowModel#field-rowHeight data} or by supplying a
         * {@link Grid.view.GridBase#config-getRowHeight} function.
         *
         * Also note that this setting only works fully as intended with non-flex columns.
         *
         * Rows will always be at least {@link Grid.view.Grid#config-rowHeight} pixels tall
         * even if an autoHeight cell contains no data.
         *
         * Manually setting a height from a {@link #config-renderer} in this column will take precedence over this
         * config.
         *
         * When {@link Grid.view.GridBase#config-virtualizeColumns column virtualization} is enabled, columns with
         * `autoHeight` always render their cells, even when horizontally scrolled out of view - row heights depend
         * on their measured cell content and must not change with the horizontal scroll position. Each such column
         * thus reduces the benefit of virtualizing columns.
         *
         * @prp {Boolean} autoHeight
         * @category Common
         */
        'autoHeight',

        /**
         * When {@link Grid.view.GridBase#config-virtualizeColumns column virtualization} is enabled, cells are by
         * default only rendered for columns that intersect the view. Set this config to `true` to always render
         * this column's cells, even when the column is horizontally scrolled out of view.
         *
         * Use it on columns whose cell rendering has effects beyond the cell's own content. The main example is a
         * {@link #config-renderer} that requests row height by setting `size.height` (deprecated, use
         * {@link Grid.view.GridBase#config-getRowHeight} instead) - if such a column's cells were not rendered
         * when out of view, row heights would change as the grid scrolls horizontally.
         *
         * Each column with this config set reduces the benefit of virtualizing columns.
         *
         * @prp {Boolean} alwaysRenderCells
         * @category Common
         */
        'alwaysRenderCells',

        /**
         * Mode to use when measuring the contents of this column in calls to {@link #function-resizeToFitContent}.
         * Available modes are:
         *
         * * 'exact'       - Most precise, renders and measures all cells (Default, slowest)
         * * 'textContent' - Renders all cells but only measures the one with the longest `textContent`
         * * 'value'       - Renders and measures only the cell with the longest data (Fastest)
         * * 'none'/falsy  - Resize to fit content not allowed, a call does nothing
         *
         * @prp {'exact'|'textContent'|'value'|'none'|null} fitMode
         * @default 'exact'
         * @category Common
         */
        { name : 'fitMode', defaultValue : 'exact' },

        //endregion

        //region Interaction
        /**
         * Set this to `true` to not allow any type of editing in this column.
         * @prp {Boolean} readOnly
         */
        'readOnly',

        /**
         * A config object used to create the input field which will be used for editing cells in the
         * column. Used when {@link Grid.feature.CellEdit} feature is enabled. The Editor refers to
         * {@link #config-field} for a data source.
         *
         * Configure this as `false` or `null` to prevent cell editing in this column.
         *
         * All subclasses of {@link Core.widget.Field} can be used as editors. The most popular are:
         * - {@link Core.widget.TextField}
         * - {@link Core.widget.NumberField}
         * - {@link Core.widget.DateField}
         * - {@link Core.widget.TimeField}
         * - {@link Core.widget.Combo}
         *
         * If record has method set + capitalized field, method will be called, e.g. if record has method named
         * `setFoobar` and the {@link #config-field} is `foobar`, then instead of `record.foobar = value`,
         * `record.setFoobar(value)` will be called.
         *
         * `Function` may be used for React application parameter for using JSX components as editors.
         *
         * ```javascript
         *  columns : [
         *         {
         *             type   : 'name',
         *             field  : 'name',
         *             width  : 250,
         *             editor : ref => <TextEditor ref={ref}/>
         *         },
         *         ...
         * ]
         * ```
         *
         * where passing `ref` to the React editor is essential for the editor to work.
         *
         * NOTE: React editor component must implement `setValue` method which usually internally calls `setState`.
         * React `setState` is asynchronous so we need to return Promise which will be resolved when `setState`
         * finishes. A typical example of `setValue` method implemented in a React editor is:
         *
         * ```javascript
         * setValue(value) {
         *     return new Promise(resolve => this.setState({ value }, () => resolve(value)));
         * }
         * ```
         *
         * Please consult the
         * [React Integration Guide](#Grid/guides/integration/react/guide.md#using-react-as-cell-editor)
         * for details on usage of React cell editors.
         *
         * Note that for Column subclasses which have a default editor, the editor config is merged
         * with the Column class's default editor config. This allows an application to reconfigure
         * the default editor to conform to requirements for a specific column:
         *
         * ```javascript
         * new Grid({
         *     columns : [{
         *         type  : 'date',
         *         field : 'date',
         *         // Override defaults for the date editor
         *         editor : {
         *             step : null // hide the back/forward step triggers
         *         }
         *     }]
         * });
         * ```
         *
         * Note that `step : null` only hides the triggers. The editor's <kbd>Shift</kbd>+<kbd>ArrowUp</kbd> and
         * <kbd>Shift</kbd>+<kbd>ArrowDown</kbd> gestures remain available, stepping by one day. Set
         * {@link Core.widget.DateField#config-stepTriggers} to `false` to remove both.
         *
         * @prp {Boolean|String|InputFieldConfig|Core.widget.Field|Function|null} editor
         * @param {*} ref React `RefObject` for editor JSX component.
         * @returns {*} Returns React editor JSX component template
         *
         * @category Interaction
         */
        {
            name         : 'editor',
            defaultValue : {},
            convert(value, data, column) {
                // Editors *configs* merge the default value in so that we can have a default editor
                // in a Column definition, and override it in specific column instances
                return ObjectHelper.isObject(value) ? ObjectHelper.merge({}, column.constructor.defaultValues.editor, value) : value;
            }
        },

        /**
         * A config object used to configure an {@link Core.widget.Editor} which contains this Column's
         * {@link #config-editor input field} if {@link Grid.feature.CellEdit} feature is enabled.
         * @prp {EditorConfig} cellEditor
         * @category Interaction
         */
        'cellEditor',

        /**
         * A function which is called when a cell edit is requested to finish.
         *
         * This may be an `async` function which performs complex validation. The return value should be:
         * - `false` - To indicate a generic validation error
         * - `true` - To indicate a successful validation, which will complete the editing
         * - a string - To indicate an error message of the failed validation. This error message will be cleared
         * upon any subsequent user input.
         *
         * The action for the failed validation is defined with the {@link #config-invalidAction} config.
         *
         * For example for synchronous validation:
         *
         * ```javascript
         * const grid = new Grid({
         *    columns : [
         *       {
         *          type : 'text',
         *          text : 'The column',
         *          field : 'someField',
         *          flex : 1,
         *          finalizeCellEdit : ({ value }) => {
         *              return value.length < 4 ? 'Value length should be at least 4 characters' : true;
         *          }
         *       }
         *    ]
         * });
         * ```
         * Here we've defined a validation `finalizeCellEdit` function, which marks all edits with new value
         * less than 4 characters length as invalid.
         *
         * For asynchronous validation you can make the validation function async:
         *
         * ```javascript
         * finalizeCellEdit : async ({ value }) => {
         *     return await performRemoteValidation(value);
         * }
         * ```
         *
         * @prp {Function} finalizeCellEdit
         * @param {Object} context An object describing the state of the edit at completion request time.
         * @param {Core.widget.Field} context.inputField The field configured as the column's `editor`.
         * @param {Core.data.Model} context.record The record being edited.
         * @param {*} context.oldValue The old value of the cell.
         * @param {*} context.value The new value of the cell.
         * @param {Grid.view.Grid} context.grid The host grid.
         * @param {Object} context.editorContext The {@link Grid.feature.CellEdit} context object.
         * @param {Grid.column.Column} context.editorContext.column The column being edited.
         * @param {Core.data.Model} context.editorContext.record The record being edited.
         * @param {HTMLElement} context.editorContext.cell The cell element hosting the editor.
         * @param {Core.widget.Editor} context.editorContext.editor The floating Editor widget which is hosting the input field.
         * @returns {Boolean|void}
         * @async
         *
         * @category Interaction
         */
        'finalizeCellEdit',

        /**
         * By default, cell editing is finalized when the editor is blurred or if the user taps outside the editor.
         * For complex custom editors, focus or tapping might be expected outside the Bryntum owned editor. In such
         * cases, supply `false` for this config to take manual control over when cell editing in the column should
         * be finalized.
         *
         * To accept changes, call {@link Grid.feature.CellEdit#function-finishEditing}. To reject, call
         * {@link Grid.feature.CellEdit#function-cancelEditing}.
         *
         * ```javascript
         * // Setup
         * const grid = new Grid({
         *   columns : [
         *     {
         *       text               : 'Skills',
         *       field              : 'skills',
         *       managedCellEditing : false
         *     }
         *   ]
         * });
         *
         * // From your custom editor, when you are ready to accept changes
         * grid.finishEditing();
         * ```
         *
         * @prp {Boolean} managedCellEditing
         * @default true
         * @category Interaction
         * @advanced
         */
        { name : 'managedCellEditing', defaultValue : true },

        /**
         * Setting this option means that pressing the <kbd>Escape</kbd> key after editing the field will
         * revert the field to the value it had when the edit began. If the value is _not_ changed
         * from when the edit started, the input field's {@link Core.widget.Field#config-clearable}
         * behaviour will be activated. Finally, the edit will be canceled.
         * @prp {Boolean} revertOnEscape
         * @default true
         * @category Interaction
         */
        { name : 'revertOnEscape', defaultValue : true },

        /**
         * How to handle a request to complete a cell edit in this column if the field is invalid.
         * There are three choices:
         *  - `block` The default. The edit is not exited, the field remains focused.
         *  - `allow` Allow the edit to be completed.
         *  - `revert` The field value is reverted and the edit is completed.
         * @prp {'block'|'allow'|'revert'} invalidAction
         * @default 'block'
         * @category Interaction
         */
        { name : 'invalidAction', defaultValue : 'block' },

        /**
         * Allow sorting of data in the column. You can pass true/false to enable/disable sorting, or provide a
         * custom sorting function, or a config object for a {@link Core.util.CollectionSorter}
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *          {
         *              // Disable sorting for this column
         *              sortable : false
         *          },
         *          {
         *              field : 'name',
         *              // Custom sorting for this column
         *              sortable(user1, user2) {
         *                  return user1.name < user2.name ? -1 : 1;
         *              }
         *          },
         *          {
         *              // A config object for a Core.util.CollectionSorter
         *              sortable : {
         *                  property         : 'someField',
         *                  direction        : 'DESC',
         *                  useLocaleCompare : 'sv-SE'
         *              }
         *          }
         *     ]
         * });
         * ```
         * When providing a custom sorting function, if the sort feature is configured with
         * `prioritizeColumns : true` that function will also be used for programmatic sorting of the store:
         *
         * ```javascript
         * const grid = new Grid({
         *     features : {
         *       sort : {
         *           prioritizeColumns : true
         *       }
         *     },
         *
         *     columns : [
         *          {
         *              field : 'name',
         *              // Custom sorting for this column
         *              sortable(user1, user2) {
         *                  return user1.name < user2.name ? -1 : 1;
         *              }
         *          }
         *     ]
         * });
         *
         * // Will use sortable() from the column definition above
         * grid.store.sort('name');
         * ```
         * Also, any custom sorter function is called with an additional parameter indicating the sort direction.
         * Please note that is an informative parameter, the result of the sort function is already reversed if
         * needed depending on direction.
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *          {
         *              field : 'name',
         *              // direction will be ASC or DESC
         *              sortable(user1, user2, direction) {
         *                  return user1.name < user2.name ? -1 : 1;
         *              }
         *          }
         *     ]
         * });
         * ```
         *
         * @prp {Boolean|Function|CollectionSorterConfig} sortable
         * @param {Core.data.Model} left Left side model to compare
         * @param {Core.data.Model} right Right side model to compare
         * @returns {Number}
         * @default true
         * @category Interaction
         */
        {
            name         : 'sortable',
            defaultValue : true,
            // Normalize function/object forms
            convert(value, data, column) {
                if (!value) {
                    return false;
                }

                if (value === true) {
                    return true;
                }

                const sorter = {};

                if (typeof value === 'function') {
                    sorter.originalSortFn = value;
                    // Scope for sortable() expected to be the column
                    sorter.sortFn         = value.bind(column);
                }
                else if (typeof value === 'object') {
                    Object.assign(sorter, value);

                    if (sorter.fn) {
                        sorter.sortFn = sorter.fn;
                        delete sorter.fn;
                    }
                }

                return sorter;
            }
        },

        /**
         * Allow searching in the column (respected by QuickFind and Search features)
         * @prp {Boolean} searchable
         * @default true
         * @category Interaction
         */
        { name : 'searchable', defaultValue : true },

        /**
         * If `true`, this column will show a collapse/expand icon in its header, only applicable for parent columns
         * @prp {Boolean} collapsible
         * @default false
         * @category Interaction
         */
        { name : 'collapsible', defaultValue : false },

        /**
         * The collapsed state of this column, only applicable for parent columns
         * @prp {Boolean} collapsed
         * @default false
         * @category Interaction
         */
        { name : 'collapsed', defaultValue : false },

        /**
         * The collapse behavior when collapsing a parent column. Specify `"toggleAll"` or `"showFirst"`.
         *
         * * `"showFirst"` toggles visibility of all but the first columns.
         *
         * * `"toggleAll"` toggles all children, useful if you have a special initially hidden column which gets shown
         *   in collapsed state. To specify which columns are initially hidden, configure them with
         *   {@link #config-toggleAllHidden}.
         *
         * In the snippet below, the first two child columns are initially shown, while the third is initially hidden.
         * When collapsing the parent column, the visibility of all three children will be toggled, so the third
         * column will be shown and the first two hidden.
         *
         * ```javascript
         * new Grid({
         *    columns : [{
         *          text        : 'Parent',
         *          collapsible : true,
         *          collapseMode : 'toggleAll',
         *          children    : [
         *              { text : 'Shown initially', field : 'field1', flex : 1 },
         *              { text : 'Shown initially', field : 'field2', flex : 1 },
         *              { text : 'Hidden initially', field : 'field3', flex : 1, toggleAllHidden : true }
         *          ]
         *    }]
         * });
         * ```
         *
         * {@note}Note that when using `toggleAll` mode, at least one child column must be configured with
         * `toggleAllHidden: true` and at least one must not.{/@note}
         *
         * @prp {String} collapseMode
         * @default 'showFirst'
         * @category Interaction
         */
        { name : 'collapseMode' },

        /**
         * Allow filtering data in the column (if {@link Grid.feature.Filter} or {@link Grid.feature.FilterBar}
         * feature is enabled).
         *
         * Also allows passing a custom filtering function that will be called for each record with a single
         * argument of format `{ value, record, [operator] }`. Returning `true` from the function includes the
         * record in the filtered set.
         *
         * Configuration object may be used for {@link Grid.feature.FilterBar} feature to specify `filterField`. See
         * an example in the code snippet below or check {@link Grid.feature.FilterBar} page for more details.
         *
         * ```
         * const grid = new Grid({
         *     columns : [
         *          {
         *              field : 'name',
         *              // Disable filtering for this column
         *              filterable : false
         *          },
         *          {
         *              field : 'age',
         *              // Custom filtering for this column
         *              filterable: ({ value, record }) => Math.abs(record.age - value) < 10
         *          },
         *          {
         *              field : 'start',
         *              // Changing default field type
         *              filterable: {
         *                  filterField : {
         *                      type : 'datetime'
         *                  }
         *              }
         *          },
         *          {
         *              field : 'city',
         *              // Filtering for a value out of a list of values
         *              filterable: {
         *                  filterField : {
         *                      type  : 'combo',
         *                      value : '',
         *                      items : [
         *                          'Paris',
         *                          'Dubai',
         *                          'Montreal',
         *                          'London',
         *                          'New York'
         *                      ]
         *                  }
         *              }
         *          },
         *          {
         *              field : 'score',
         *              filterable : {
         *                  // This filter fn doesn't return 0 values as matching filter 'less than'
         *                  filterFn : ({ record, value, operator, property }) => {
         *                      switch (operator) {
         *                          case '<':
         *                              return record[property] === 0 ? false : record[property] < value;
         *                          case '=':
         *                              return record[property] == value;
         *                          case '>':
         *                              return record[property] > value;
         *                      }
         *                  }
         *              }
         *          }
         *     ]
         * });
         * ```
         *
         * When providing a custom filtering function, if the filter feature is configured with
         * `prioritizeColumns : true` that function will also be used for programmatic filtering of the store:
         *
         * ```javascript
         * const grid = new Grid({
         *     features : {
         *         filter : {
         *             prioritizeColumns : true
         *         }
         *     },
         *
         *     columns : [
         *          {
         *              field : 'age',
         *              // Custom filtering for this column
         *              filterable: ({ value, record }) => Math.abs(record.age - value) < 10
         *          }
         *     ]
         * });
         *
         * // Will use filterable() from the column definition above
         * grid.store.filter({
         *     property : 'age',
         *     value    : 50
         * });
         * ```
         *
         * To use custom `FilterField` combo `store` it should contain one of these
         * {@link Core.data.Store#config-data} or {@link Core.data.AjaxStore#config-readUrl} configs.
         * Otherwise combo will get data from owner Grid store.
         *
         * When providing a custom store with fields that don't match the column field name,
         * specify `displayField` and `valueField` in the `filterField` config:
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *          {
         *              field : 'status',
         *              filterable: {
         *                  filterField : {
         *                      type         : 'combo',
         *                      displayField : 'text',
         *                      valueField   : 'value',
         *                      store : new Store({
         *                          data : [
         *                              { value : 'active', text : 'Active' },
         *                              { value : 'inactive', text : 'Inactive' }
         *                          ]
         *                      })
         *                  }
         *              }
         *          }
         *     ]
         * });
         * ```
         *
         * For simple stores matching the column field, `displayField` and `valueField` can be omitted:
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *          {
         *              field : 'name',
         *              filterable: {
         *                  filterField : {
         *                      type  : 'combo',
         *                      store : new Store({
         *                          data : [{ name : 'Adam' }, { name : 'Bob' }, { name : 'Charlie' }]
         *                      })
         *                  }
         *              }
         *          }
         *     ]
         * });
         * ```
         *
         * Remote stores also work:
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *          {
         *              field : 'name',
         *              filterable: {
         *                  filterField : {
         *                     type  : 'combo',
         *                     store : new AjaxStore({
         *                         readUrl  : 'data/names.json',
         *                         autoLoad : true
         *                     })
         *                  }
         *              }
         *          }
         *     ]
         * });
         * ```
         *
         * @prp {Boolean|Function|Object} filterable
         * @param {Object} data Data object
         * @param {*} data.value Record value
         * @param {Core.data.Model} data.record Record instance
         * @returns {Boolean} Returns `true` if value matches condition
         * @default true
         * @category Interaction
         */
        {
            name         : 'filterable',
            defaultValue : true,
            // Normalize function/object forms
            convert(value, data, column) {
                if (!value) {
                    return false;
                }

                if (value === true) {
                    return true;
                }

                const filter = {
                    columnOwned : true
                };

                if (typeof value === 'function') {
                    filter.filterFn = value;
                }
                else if (typeof value === 'object') {
                    ObjectHelper.merge(filter, column.constructor.defaultValues.filterable, value);
                }

                return filter;
            }
        },

        /**
         * Setting this flag to `true` will prevent dropping child columns into a group column
         * @prp {Boolean} sealed
         * @default false
         * @category Interaction
         */
        { name : 'sealed' },

        /**
         * Allow column visibility to be toggled through UI
         * @prp {Boolean} hideable
         * @default true
         * @category Interaction
         */
        { name : 'hideable', defaultValue : true },

        /**
         * Set to `false` to prevent this column header from being dragged
         * @prp {Boolean} draggable
         * @category Interaction
         */
        { name : 'draggable', defaultValue : true },

        /**
         * Set to `false` to prevent grouping by this column
         * @prp {Boolean} groupable
         * @category Interaction
         */
        { name : 'groupable', defaultValue : true },

        /**
         * Set to `false` to prevent the column from being drag-resized when the ColumnResize plugin is enabled.
         * @prp {Boolean} resizable
         * @default true
         * @category Interaction
         */
        { name : 'resizable', defaultValue : true },

        //endregion

        //region Rendering

        /**
         * Renderer function for group headers (when using Group feature).
         *
         * <div class="warning">
         * You should never modify any records inside this method.
         * </div>
         *
         * ```javascript
         * const grid = new Grid({
         *     columns : [
         *         {
         *             text : 'ABC',
         *             groupRenderer(renderData) {
         *                 return {
         *                      class : {
         *                          big   : true,
         *                          small : false
         *                      },
         *                      children : [
         *                          { tag : 'img', src : 'img.png' },
         *                          renderData.groupRowFor
         *                      ]
         *                 };
         *             }
         *         }
         *     ]
         * });
         * ```
         *
         * When using the Bryntum React wrapper, this renderer can also return JSX elements. See
         * {@link #config-renderer} for a JSX example and performance considerations.
         *
         * @prp {Function} groupRenderer
         * @param {Object} renderData
         * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc.
         * @param {*} renderData.groupRowFor Current group value
         * @param {Core.data.Model} renderData.record Record for the row
         * @param {Core.data.Model[]} renderData.groupRecords Records in the group. When the
         *   {@link Grid.feature.GroupSummary} feature is enabled with its default
         *   {@link Grid.feature.GroupSummary#config-target} of `'footer'`, the last entry is the group footer
         *   record, so `groupRecords.length` is one more than `count`. Filter it out using its
         *   {@link Core.data.Model#property-isGroupFooter} flag if needed
         * @param {Grid.column.Column} renderData.column Current rendering column
         * @param {Grid.column.Column} renderData.groupColumn Column that the grid is grouped by
         * @param {Number} renderData.count Number of records in the group, excluding the group footer record
         * @param {Grid.view.Grid} renderData.grid This grid
         * @returns {DomConfig|String|null} The header grouping text or DomConfig object representing the HTML markup
         *
         * @category Rendering
         */
        'groupRenderer',

        /**
         * Renderer function for the column header.
         *
         * When using the Bryntum React wrapper, this renderer can also return JSX elements. See
         * {@link #config-renderer} for a JSX example and performance considerations.
         *
         * @prp {Function} headerRenderer
         * @param {Object} renderData
         * @param {Grid.column.Column} renderData.column This column
         * @param {HTMLElement} renderData.headerElement The header element
         * @returns {String|Object|null|void} The text or markup to show in the column header
         * @category Rendering
         */
        'headerRenderer',

        /**
         * A tooltip string to show when hovering the column header, or a config object which can
         * reconfigure the shared tooltip by setting boolean, numeric and string config values.
         * @prp {String|TooltipConfig} tooltip
         * @category Rendering
         */
        'tooltip',



        /**
         * CSS class added to each cell in this column
         * @prp {String} cellCls
         * @category Rendering
         */
        'cellCls',



        /**
         * CSS class added to the header of this column
         * @prp {String} cls
         * @category Rendering
         */
        'cls',

        /**
         * Icon to display in header. Specifying an icon will render a `<i>` element with the icon as value for the
         * class attribute
         * @prp {String} icon
         * @category Rendering
         */
        'icon',

        //endregion

        //region Layout

        /**
         * Text align. Accepts `'left'`/`'center'`/`'right'` or direction neutral `'start'`/`'end'`
         * @prp {'left'|'center'|'right'|'start'|'end'} align
         * @category Layout
         */
        'align',

        /**
         * Column minimum width. If value is `Number`, then minimal width is in pixels
         * @prp {Number|String} minWidth
         * @default 60
         * @category Layout
         */
        { name : 'minWidth', defaultValue : 60 },

        /**
         * Column maximal width. If value is Number, then maximal width is in pixels
         * @prp {Number|String} maxWidth
         * @category Common
         */
        'maxWidth',

        /**
         * Columns hidden state. Specify `true` to hide the column, `false` to show it.
         * @prp {Boolean} hidden
         * @category Layout
         */
        { name : 'hidden', defaultValue : false },

        /**
         * Only applies for leaf columns in a collapsible group configured with `collapseMode : 'toggleAll'`.
         * Specify `true` to show the column when the group is collapsed, `false` to hide it.
         *
         * See {@link #config-collapseMode} for more details and an example.
         *
         * @prp {Boolean} toggleAllHidden
         * @category Interaction
         */
        { name : 'toggleAllHidden', defaultValue : false },

        /**
         * Convenient way of putting a column in the "locked" region. Same effect as specifying region: 'locked'.
         * If you have defined your own regions (using {@link Grid.view.Grid#config-subGridConfigs}) you should use
         * {@link #config-region} instead of this one.
         * @prp {Boolean} locked
         * @default false
         * @category Layout
         */
        { name : 'locked' },

        /**
         * Region (part of the grid, it can be configured with multiple) where to display the column. Defaults to
         * {@link Grid.view.Grid#config-defaultRegion}.
         *
         * A column under a grouped header automatically belongs to the same region as the grouped header.
         *
         * @prp {String} region
         * @category Layout
         */
        { name : 'region' },



        //endregion

        // region Menu

        /**
         * Show column picker for the column
         * @prp {Boolean} showColumnPicker
         * @default true
         * @category Menu
         */
        { name : 'showColumnPicker', defaultValue : true },

        /**
         * false to prevent showing a context menu on the column header element
         * @prp {Boolean} enableHeaderContextMenu
         * @default true
         * @category Menu
         */
        { name : 'enableHeaderContextMenu', defaultValue : true },

        /**
         * Set to `false` to prevent showing a context menu on the cell elements in this column
         * @prp {Boolean} enableCellContextMenu
         * @default true
         * @category Menu
         */
        { name : 'enableCellContextMenu', defaultValue : true },

        /**
         * Extra items to show in the header context menu for this column.
         *
         * ```javascript
         * // A rank column, which displays its header text vertically and offers a menu item to toggle that
         * {
         *     text              : 'Rank',
         *     field             : 'rank',
         *     width             : 30,
         *     type              : 'number',
         *     headerWritingMode : 'sideways-lr',
         *     align             : 'center',
         *     headerMenuItems   : {
         *         toggleVerticalText : {
         *             text    : 'Vertical header text',
         *             checked : true,
         *             weight  : 10,
         *             onItem  : ({ column }) => {
         *                 column.headerWritingMode = column.headerWritingMode ? null : 'sideways-lr';
         *             }
         *         }
         *     }
         * },
         * ```
         *
         * @prp {Object<String,MenuItemEntry>} headerMenuItems
         * @category Menu
         */
        'headerMenuItems',

        /**
         * Extra items to show in the cell context menu for this column, `null` or `false` to not show any menu items
         * for this column.
         *
         * ```javascript
         * cellMenuItems : {
         *     customItem : { text : 'Custom item' }
         * }
         * ```
         *
         * @prp {Object<String,MenuItemEntry>} cellMenuItems
         * @category Menu
         */
        'cellMenuItems',

        //endregion

        //region Summary



        //endregion

        //region Misc

        /**
         * Column settings at different responsive levels, see responsive demo under examples/
         * @prp {Object} responsiveLevels
         * @category Misc
         */
        'responsiveLevels',

        /**
         * Tags, may be used by ColumnPicker feature for grouping columns by tag in the menu
         * @prp {String[]} tags
         * @category Misc
         */
        'tags',

        /**
         * Column config to apply to normal config if viewed on a touch device
         * @prp {GridColumnConfig} touchConfig
         * @category Misc
         */
        'touchConfig',

        /**
         * When using the tree feature, exactly one column should specify { tree: true }
         * @prp {Boolean} tree
         * @readonly
         * @category Misc
         */
        'tree',

        /**
         * Determines which type of filtering to use for the column. Usually determined by the column type used,
         * but may be overridden by setting this field.
         * @prp {'text'|'date'|'number'|'duration'} filterType
         * @category Misc
         */
        'filterType',

        /**
         * Applies a CSS class that controls the CSS `writing-mode` property for the column header text element.
         * ```json
         * {
         *     text              : 'Rank',
         *     field             : 'rank',
         *     width             : 30,
         *     type              : 'number',
         *     headerWritingMode : 'sideways-lr'
         * }
         * ```
         * @prp {'horizontal-tb'|'vertical-rl'|'vertical-lr'|'sideways-rl'|'sideways-lr'} headerWritingMode
         * @category Misc
         */
        { name : 'headerWritingMode' },

        /**
         * By default, any rendered column cell content is HTML-encoded (`true`). Set this to `false` to allow rendering
         * HTML elements.
         *
         * {@note}When a renderer contains static HTML output, this config is automatically set to `false` if not explicitly
         * configured. You are responsible for HTML-encoding user-provided data to prevent XSS vulnerabilities. See
         * {@link Core.helper.StringHelper#function-encodeHtml-static StringHelper.encodeHtml()}.{/@note}
         *
         * @prp {Boolean} htmlEncode
         * @default true
         * @category Misc
         */
        { name : 'htmlEncode', defaultValue : true },

        /**
         * By default, the header text is HTML-encoded. Set this flag to `false` disable this and allow html
         * elements in the column header
         * @prp {Boolean} htmlEncodeHeaderText
         * @default true
         * @category Misc
         */
        { name : 'htmlEncodeHeaderText', defaultValue : true },

        /**
         * Set to `true`to automatically call DomHelper.sync for html returned from a renderer. Should in most cases
         * be more performant than replacing entire innerHTML of cell and also allows CSS transitions to work. Has
         * no effect unless {@link #config-htmlEncode} is disabled. Returned html must contain a single root element
         * (that can have multiple children). See PercentColumn for example usage.
         * @prp {Boolean} autoSyncHtml
         * @default false
         * @category Misc
         */
        { name : 'autoSyncHtml', defaultValue : false },

        /**
         * Set to `false` to not always clear cell content if the {@link #config-renderer} returns `undefined`
         * or has no `return` statement. This is useful when you mutate the cellElement, and want to prevent
         * cell content from being reset during rendering.
         *
         * Set to `true` to always clear cell content regardless of renderer return value.
         * @prp {Boolean} alwaysClearCell
         * @default true
         * @category Misc
         */
        { name : 'alwaysClearCell', defaultValue : true },

        /**
         * An array of the widgets to append to the column header. These widgets have this Column instance
         * as their `owner` which can be used to reference the column, and the owning Grid via `this.owner.grid`.
         * ```javascript
         * columns : [
         * {
         *     text          : 'Name',
         *     field         : 'name',
         *     flex          : 1,
         *     headerWidgets : [
         *         {
         *             type      : 'button',
         *             text      : 'Add row',
         *             rendition : 'filled',
         *             async onAction() {
         *                 const
         *                      grid = this.owner.grid,
         *                      [newRecord] = grid.store.add({
         *                          name : 'New user'
         *                      });
         *
         *                 await grid.scrollRowIntoView(newRecord);
         *
         *                 await grid.features.cellEdit.startEditing({
         *                     record : newRecord,
         *                     field  : 'name'
         *                 });
         *             }
         *         }
         *     ]
         * }]
         * ```
         * @prp {ContainerItemConfig[]} headerWidgets
         * @category Misc
         */
        { name : 'headerWidgets' },

        /**
         * Set to `true` to have the {@link Grid.feature.CellEdit} feature update the record being edited live upon
         * field edit instead of when editing is finished by using <kbd>Tab</kbd> or <kbd>Enter</kbd>
         * @prp {Boolean} instantUpdate
         * @category Misc
         */
        { name : 'instantUpdate', defaultValue : false },

        { name : 'repaintOnResize', defaultValue : false },

        /**
         * An optional query selector to select a sub element within the cell being
         * edited to align a cell editor's `X` position and `width` to.
         * @prp {String} editTargetSelector
         * @category Misc
         */
        'editTargetSelector',

        //endregion

        //region Export



        //endregion

        /**
         * The `aria-label` to use for this Column's header element
         * @prp {String} ariaLabel
         * @category Accessibility
         */
        {
            name         : 'ariaLabel',
            defaultValue : 'L{Column.columnLabel}'
        },

        /**
         * The `aria-label` to use for cells in this Column
         * @prp {String} cellAriaLabel
         * @category Accessibility
         */
        {
            name         : 'cellAriaLabel',
            defaultValue : 'L{Column.cellLabel}'
        },

        /**
         * Flag to enable vue component rendering
         * @prp {Boolean} vue
         * @category Integration
         */
        'vue',




    ];

    // prevent undefined fields from being exposed, to simplify spotting errors
    static autoExposeFields = false;

    /**
     * {@note}This property only exists if this column has its own specialized renderer, such as
     * {@link Grid.column.DateColumn}, {@link Grid.column.NumberColumn} etc.{/@note}
     *
     * Call this function from inside your custom {@link #config-renderer} to get the default rendered value
     * of the column. For example:
     *
     * ```javascript
     * new Grid({
     *     columns : [
     *         {
     *             type     : 'date',
     *             field    : 'startDate',
     *             text     : 'Start Date',
     *             renderer : ({ record, column }) => {
     *                 let result = this.defaultRenderer(...arguments);
     *
     *                 // Highlight modified start dates
     *                 if (record.isFieldModified('startDate')) {
     *                     result = `<span class="modified">${result}</span>`;
     *                 }
     *                 return result;
     *             }
     *         }
     *     ]
     * });
     * ```
     * @function defaultRenderer
     * @param {Object} renderData Object containing renderer parameters
     * @param {HTMLElement} renderData.cellElement Cell element, for adding CSS classes, styling etc. Can be `null` in case of export
     * @param {*} renderData.value Value to be displayed in the cell
     * @param {Core.data.Model} renderData.record The record from which the cell's value is derived.
     * @param {Grid.column.Column} renderData.column This column
     * @param {Grid.view.Grid} renderData.grid This grid
     * @param {Grid.row.Row} renderData.row Row object. Can be null in case of export. Use the
     *   {@link Grid.row.Row#function-assignCls row's API} to manipulate CSS class names.
     * @param {Boolean} renderData.isExport `true` if the record is being exported to Excel or a textual format, enabling special handling during export.
     * @param {Boolean} renderData.isMeasuring True if the column is being measured for a `resizeToFitContent` call.
     *   In which case an advanced renderer might need to take different actions.
     * @returns {DomConfig|String|null}
     */

    // https://github.com/bryntum/bryntum/issues/10591
    // Add declared `defaults` as `defaultValue` to field definitions
    static setupFields(cls, meta) {
        Model.setupFields(cls, meta);

        const
            fieldsInfo = meta.fields,
            fieldMap = fieldsInfo.map;

        // If defaults are changed in subclass, its static $meta.fields.def and $meta.fields.map need to be overridden.
        // Only override fields for which a different default exists, keep defs for unchanged fields untouched
        fieldsInfo.defs.forEach((def, index) => {
            if (def.defaultValue &&
                fieldsInfo.defaults[def.name] !== def.defaultValue &&
                // Make sure to not overwrite string values that have been already translated
                typeof def.defaultValue === 'string' &&
                def.defaultValue.match(/^L\{/)
            ) {
                const newDef = {
                    ...def,
                    defaultValue : fieldsInfo.defaults[def.name],
                    definedBy    : this,
                    model        : this,
                    owner        : this
                };
                fieldsInfo.defs[index] = newDef;
                fieldMap[def.name] = newDef;
            }
        });
    }

    //endregion

    //region Init

    construct(data, store, meta, ...args) {
        const
            me     = this,
            isRoot = meta?.isRoot;

        if (!isRoot) {
            me.masterStore = store;

            // Store might be an array
            if (store) {
                me._grid = Array.isArray(store) ? store[0].grid : store.grid;
            }

            me.localizableProperties = Config.mergeMethods.distinct(data.localizableProperties, ['text', 'ariaLabel', 'cellAriaLabel']);

            if (data.localeClass) {
                me.localeClass = data.localeClass;
            }
        }

        super.construct(data, store, meta, ...args);

        const { grid } = me;

        if (!isRoot) {
            // Default value for region is assigned by the ColumnStore in createRecord(), same for `locked`

            // Allow field : null if the column does not rely on a record field.
            // For example the CheckColumn when used by GridSelection.
            if (me.isLeaf && !('field' in me.data)) {
                me.setData('field', '_' + (me.type || '') + (++Column.emptyCount));
                me.noFieldSpecified = true;
            }

            if (!me.width && !me.flex && !me.children) {
                // Set the width silently because we're in construction.
                me.setData({
                    width : Column.defaultWidth,
                    flex  : null
                }, null, true);
            }

            me.headerWidgets && me.initHeaderWidgets(me.headerWidgets);

            if (me.isParent) {
                me.meta.visibleChildren = new Set();
                // Trigger adding expand/collapse button
                if (me.collapsible) {
                    // Grid only knows whether it is RTL when it sees its DOM environment.
                    grid.once(grid.isPainted ? 'renderRows' : 'paint', () => {
                        me.skipAnimation = true;
                        me.collapsible = true;
                        grid.requestAnimationFrame(() => {
                            me.skipAnimation = false;
                        });
                    });
                }
            }

            if (me.renderer) {
                const rendererString = me.renderer.toString();

                me.rendererReturningContent = rendererString.includes('return ') || Boolean(rendererString.match(arrowFnRegex));

                // Auto-detect HTML only in user renderers, inspecting their authored string/template literals
                // (not the raw source) so minified comparison operators like `value<0` aren't read as tags
                if (me.renderer !== me.defaultRenderer && me.htmlEncode && !('htmlEncode' in (me.originalData || {}))) {
                    // Each literal is tested on its own, so a tag cannot be fabricated across literal boundaries
                    const hasHtmlLiteral = (rendererString.match(stringLiteralRegex) || [])
                        .some(literal => StringHelper.isHtml(literal.slice(1, -1).replace(templateExprRegex, '')));

                    if (hasHtmlLiteral) {
                        // User didn't explicitly set htmlEncode, auto-disable it
                        me.htmlEncode = false;
                        console.info(`Column "${me.text || me.field}": When renderer includes static HTML output, \`htmlEncode\` has been set to \`false\` automatically. Set \`htmlEncode : false\` explicitly to avoid this message.`);
                    }
                }
            }

            if (me.formula && (!me.field || !grid.store.modelClass.getFieldDefinition(me.field))) {
                console.warn(`No Model field found for this Column´s field: "${me.field}".`);
            }

            if (me.collapseMode === 'toggleAll') {
                if (!me.children.some(c => c.toggleAllHidden)) {
                    console.warn('When using `collapseMode : \'toggleAll\'`, at least one child column should have `toggleAllHidden : true`');
                }
                if (!me.children.some(c => !c.toggleAllHidden)) {
                    console.warn('When using `collapseMode : \'toggleAll\'`, do not use `toggleAllHidden : true` on all child columns');
                }
            }
        }
    }

    /**
     * Checks whether the other column is in the same position and configured the same as this Column.
     * @param {Grid.column.Column} other The partner column to check
     * @returns {Boolean} `true` if these two Columns should be kept in sync.
     * @private
     */
    shouldSync(other) {
        // Two columns in different grids should be kept in sync if:
        //  they have the same header text
        //  and they have the same field or same renderer
        //  and they are positioned the same; after an identical set of previous siblings
        return other.isColumn &&
            other.text === this.text &&
            (other.field === this.field || String(other.renderer) === String(this.renderer)) &&
            ((!other.previousSibling && !this.previousSibling) || other.previousSibling.shouldSync(this.previousSibling));
    }

    get hiddenByCollapse() {
        const { parent } = this;

        if (!parent) {
            return false;
        }

        if (parent.collapsed) {
            if (parent.collapseMode === 'toggleAll') {
                return !this.toggleAllHidden;
            }

            // First child is always visible in a collapsed group
            return this !== parent.children.find(c => !c.hidden);
        }
        else {
            if (parent.collapseMode === 'toggleAll') {
                return this.toggleAllHidden;
            }

            return false;
        }
    }

    get isCollapsible() {
        return this.children?.length > 1 && this.collapsible;
    }

    get collapsed() {
        return this.get('collapsed');
    }

    set collapsed(collapsed) {
        const
            me             = this,
            collapseExpand = me.headerWidgetMap?.collapseExpand;

        me.grid.trigger('beforeColumnCollapseToggle', { column : me, collapsed });

        // Avoid triggering redraw
        me.set('collapsed', collapsed, true);
        // This triggers redraw
        me.onCollapseChange(!collapsed).then(() => {
            me.skipAnimation = false;
            me.grid.trigger('columnCollapseToggle', { column : me, collapsed });
        });

        if (collapseExpand) {
            collapseExpand.suspendEvents();
            collapseExpand.pressed = collapsed;
            collapseExpand.resumeEvents();
        }
    }

    onCellFocus(location) {
        const me = this;

        me.location = location;

        // Update cell if cell is in the grid
        if (location.rowIndex !== -1) {
            me.updateCellAriaLabel(me.localizeProperty('cellAriaLabel'));
            me.updateCellAriaReadOnly(location);
        }
    }

    /**
     * Updates `aria-readonly` on the focused cell based on editability.
     * A cell is read-only if the grid is readOnly, the record is readOnly, or the column's
     * `canEdit` returns false (no editor, column readOnly, or field not editable).
     * @param {Grid.util.GridLocation} location
     * @internal
     */
    updateCellAriaReadOnly(location) {
        const { cell, record } = location;

        if (!location.isSpecialRow && cell) {
            if (!this.canEdit(record)) {
                cell.setAttribute('aria-readonly', true);
            }
            else {
                cell.removeAttribute('aria-readonly');
            }
        }
    }

    updateHeaderAriaLabel(headerAriaLabel) {
        DomHelper.setAttributes(this.element, {
            'aria-label' : headerAriaLabel
        });
    }

    updateCellAriaLabel(cellAriaLabel) {
        const { location } = this,
            cell = location?.cell;

        if (cellAriaLabel?.length && !location?.isSpecialRow && cell) {
            DomHelper.setAttributes(cell, {
                'aria-label' : cellAriaLabel
            });
        }
    }

    doDestroy() {
        this.data?.editor?.destroy?.();

        this.destroyHeaderWidgets();

        super.doDestroy();
    }

    //endregion

    //region Header widgets

    set headerWidgets(widgets) {
        this.initHeaderWidgets(widgets);

        this.set('headerWidgets', widgets);
    }

    get headerWidgets() {
        return this.get('headerWidgets');
    }

    /**
     * An object which contains a map of the widgets contained in this column header keyed by their
     * {@link Core.widget.Widget#config-ref}.
     *
     * @member {Object<String,Core.widget.Widget>} headerWidgetMap
     * @readonly
     * @internal
     */

    initHeaderWidgets(widgets) {
        this.destroyHeaderWidgets();

        const headerWidgetMap = this.headerWidgetMap = {};

        for (const config of widgets) {
            const widget = Widget.create({ owner : this, ...config });

            widget.addCls('b-grid-header-widget');
            headerWidgetMap[widget.ref || widget.id] = widget;
        }
    }

    destroyHeaderWidgets() {
        // Clean up any headerWidgets used
        for (const widget of Object.values(this.headerWidgetMap || {})) {
            widget.destroy?.();
        }
    }

    //endregion

    //region Fields

    // Yields the automatic cell tagging class, e.g. b-resource-assignment-cell for ResourceAssignmentColumn etc
    static generateAutoCls() {
        const classes = [];

        // Create the auto class for cells owned by this column class
        // For example NumberColumn cells get b-number-cell
        // DurationColumn cells get b-duration-cell b-number-cell
        for (let c = this; c !== Column; c = c.superclass) {
            const columnName = c.$$cssName.replace(/Column$/, '');

            c.type && c.type !== c.superclass.type && classes.push(StringHelper.cls`b-${columnName}-cell`);
        }

        const columnAutoCls = classes.join(' ');

        (Column.autoClsMap || (Column.autoClsMap = new Map())).set(this, columnAutoCls);
        return columnAutoCls;
    }

    /**
     * Determines if the column cell should be marked as `dirty`.
     *
     * @param {Core.data.Model} record The data record
     * @returns {Boolean} Returns `true` if the cell should be marked as dirty, `false` otherwise
     * @internal
     */
    isCellDirty(record) {
        const
            { grid, field } = this,
            { showDirty }   = grid,
            modelField      = record.fieldMap[field];

        // If we should mark dirty cells and a field is specified
        return showDirty && field &&
            // The field is not a calculated one
            !modelField?.calculated &&
            // The field is modified
            (record.isFieldModified(field) ||
                // It is a new record (and we should mark dirty cells dirty for it)
                (showDirty?.newRecord && grid.store.added?.includes(record))) &&
            // The field is composite or it is being persisted
            (this.compositeField || modelField?.persist !== false);
    }

    /**
     * Returns the full CSS class set for a cell at the passed {@link Grid.util.GridLocation}
     * as an object where property keys with truthy values denote a class to be added
     * to the cell.
     * @param {Grid.util.GridLocation} cellContext
     * @returns {Object} An object in which property keys with truthy values are used as
     * the class names on the cell element.
     * @internal
     */
    getCellClass(cellContext) {
        const
            { record, column } = cellContext,
            {
                cellCls,
                internalCellCls,
                grid,
                constructor,
                align
            }                  = column,
            autoCls            = Column.autoClsMap?.get(constructor) || constructor.generateAutoCls(),
            isEditing          = cellContext.cell.classList.contains('b-editing'),
            result             = {
                [grid.cellCls]                 : grid.cellCls,
                [autoCls]                      : autoCls,
                [cellCls]                      : cellCls,
                [internalCellCls]              : internalCellCls,
                'b-cell-dirty'                 : column.isCellDirty(record),
                [`b-grid-cell-align-${align}`] : align,
                'b-selected'                   : grid.selectionMode.cell && grid.isCellSelected(cellContext),
                'b-focused'                    : grid.isFocused(cellContext),
                'b-auto-height'                : column.autoHeight,
                'b-editing'                    : isEditing,
                'b-not-editable'               : grid.showNotEditableCells && this.field && grid.features.cellEdit?.enabled && !this.canEdit(record),
                'b-last-column'                : column.subGrid.columns.visibleColumns.at(-1) === column
            };

        // Check cell CSS should not be applied to group header rows
        if (record.isSpecialRow && result['b-checkbox-selection']) {
            result['b-checkbox-selection'] = false;
        }

        return result;
    }

    get hasVerticalHeaderText() {
        return /sideways|vertical]/i.test(this.headerWritingMode);
    }

    get locked() {
        return this.data.region === 'locked';
    }

    set locked(locked) {
        this.region = locked ? 'locked' : 'normal';
    }

    // Children of grouped header always uses same region as the group
    get region() {
        // Guard for parent being undefined during column construction
        if (this.parent && !this.parent.isRoot) {
            return this.parent.region;
        }

        return this.get('region');
    }

    set region(region) {
        this.set('region', region);
    }

    // column can only be sorted if a `field` is provided, or a custom sort function is provided as `sortable`
    get sortable() {
        const { sortable } = this.data;

        if (!sortable || ((this.noFieldSpecified || !this.field) && !sortable.sortFn)) {
            return false;
        }
        return sortable;
    }

    set sortable(sortable) {
        this.set('sortable', sortable);
    }

    /**
     * Returns `true` if this column can currently be sorted by the user.
     * Checks both the column's own {@link #config-sortable} config and whether the
     * {@link Grid.feature.Sort} feature is enabled on the grid.
     * @member {Boolean}
     * @readonly
     */
    get canSort() {
        return Boolean(this.sortable && this.grid?.hasActiveFeature?.('sort'));
    }

    // column can only be grouped if a `field` is provided
    get groupable() {
        return Boolean(!(this.noFieldSpecified || !this.field) && this.data.groupable);
    }

    set groupable(groupable) {
        this.set('groupable', groupable);
    }

    get filterable() {
        // No filtering for group parent columns
        return this.isLeaf && this.data.filterable;
    }

    /**
     * The Field to use as editor for this column
     * @member {Core.widget.Field}
     * @readonly
     * @private
     */
    get editor() {
        const
            me              = this,
            { grid, field } = me;

        let { editor } = me.data;

        // Happens when splitting grid & using a ColorColumn
        if (editor?.isDestroyed) {
            editor = {};
        }

        if (editor && !editor.isWidget) {
            // Give frameworks a shot at injecting their own editor, wrapped as a widget
            const result = grid.processCellEditor({ editor, field : me.field });

            if (result) {
                // Use framework editor
                editor = result.editor;
            }
            else {
                if (typeof editor === 'string') {
                    editor = {
                        type : editor
                    };
                }

                // The two configs, default and configured must be deep merged.
                editor = Widget.create(ObjectHelper.merge(me.defaultEditor, {
                    owner     : grid,
                    dataField : grid.store.modelClass.getFieldDefinition(field),

                    // Field labels must be present for A11Y purposes, but are clipped out of visibility.
                    // Screen readers will be able to access them and announce them.
                    label : StringHelper.encodeHtml(me.text)
                }, editor));
                editor.formulaStore = grid.store;

                // We control the label - it's the column header text
                ArrayHelper.remove(editor.localizableProperties, 'label');
            }

            !editor.dontCache && (me.data.editor = editor);
        }

        return editor;
    }

    set editor(editor) {
        this.data.editor = editor;
    }

    afterChange(value, key, oldValue, ...args) {

        const
            me         = this,
            pinColumns = me.grid?.features?.pinColumns;

        // If pinned is changed, and we are not constructing, pin or unpin the column
        if (!me.isConstructing && pinColumns?.enabled && key.pinned && oldValue !== value) {
            if (!value) {
                pinColumns.unpinColumn(me);
            }
            else {
                pinColumns.pinColumn(me, value.pinned.value);
            }
        }

        super.afterChange(value, key, oldValue, ...args);

        // If we have insantiated an editor, update its label
        if (me.data.editor?.isWidget) {
            const
                { editor } = me,
                newLabel   = StringHelper.encodeHtml(me.text);

            if (editor.label !== newLabel) {
                editor.label = newLabel;
            }
        }
    }

    /**
     * A config object specifying the editor to use to edit this column.
     * @member {Object}
     * @private
     * @readonly
     */
    get defaultEditor() {
        return {
            type : 'textfield',
            name : this.field
        };
    }

    //endregion

    //region Grid, SubGrid & Element

    /**
     * Extracts the value from the record specified by this Column's {@link #config-field} specification
     * in a format that can be used as a value to match by a {@link Grid.feature.Filter filtering} operation.
     *
     * The default implementation returns the {@link #function-getRawValue} value, but this may be
     * overridden in subclasses.
     * @param {Core.data.Model} record The record from which to extract the field value.
     * @returns {*} The value of the referenced field if any.
     */
    getFilterableValue(record) {
        return this.getRawValue(record);
    }

    // Create an ownership hierarchy which links columns up to their SubGrid if no owner injected.
    get owner() {
        return this._owner || this.subGrid;
    }

    set owner(owner) {
        this._owner = owner;
    }

    get rootElement() {
        return this.grid?.rootElement;
    }

    /**
     * Get the Grid instance to which this column belongs
     * @member {Grid.view.Grid}
     * @readonly
     */
    get grid() {
        // A column created before its store was assigned to a grid has no cached grid, the store gets one later
        return this._grid || this.parent?.grid || this.masterStore?.grid;
    }

    get dateHelper() {
        return this.grid?.dateHelper || super.dateHelper;
    }

    // Private, only used in tests where standalone Headers are created with no grid
    // from which to lookup the associate SubGrid.
    set subGrid(subGrid) {
        this._subGrid = subGrid;
    }

    /**
     * Get the SubGrid to which this column belongs
     * @member {Grid.view.SubGrid}
     * @readonly
     */
    get subGrid() {
        return this._subGrid || this.grid?.getSubGridFromColumn(this);
    }

    /**
     * Get the element for the SubGrid to which this column belongs
     * @member {HTMLElement}
     * @readonly
     * @private
     */
    get subGridElement() {
        return this.subGrid.element;
    }

    /**
     * The header element for this Column. *Only available after the grid has been rendered*.
     *
     * **Note that column headers are rerendered upon mutation of Column values, so this
     * value is volatile and should not be cached, but should be read whenever needed.**
     * @member {HTMLElement}
     * @readonly
     */
    get element() {
        return this.grid.getHeaderElement(this);
    }

    get previousVisibleSibling() {
        // During move from one region to another, nextSibling might not be wired up to the new next sibling in region.
        // (Because the order in master store did not change)
        const region = this.region;

        let prev = this.previousSibling;
        while (prev && (!prev.shown || prev.region !== region)) {
            prev = prev.previousSibling;
        }
        return prev;
    }

    get nextVisibleSibling() {
        // During move from one region to another, nextSibling might not be wired up to the new next sibling in region.
        // (Because the order in master store did not change)
        const region = this.region;

        let next = this.nextSibling;
        while (next && (!next.shown || next.region !== region)) {
            next = next.nextSibling;
        }
        return next;
    }

    get isLastInSubGrid() {
        return !this.nextVisibleSibling && (this.parent.isRoot || this.parent.isLastInSubGrid);
    }

    get allowDrag() {
        return !this.parent.isRoot || Boolean(this.nextVisibleSibling || this.previousVisibleSibling);
    }

    /**
     * The text wrapping element for this Column. *Only available after the grid has been rendered*.
     *
     * This is the full-width element which *contains* the text-bearing element and any icons.
     *
     * **Note that column headers are rerendered upon mutation of Column values, so this
     * value is volatile and should not be cached, but should be read whenever needed.**
     * @member {HTMLElement}
     * @readonly
     */
    get textWrapper() {
        return DomHelper.getChild(this.element, '.b-grid-header-text');
    }

    /**
     * The text containing element for this Column. *Only available after the grid has been rendered*.
     *
     * **Note that column headers are rerendered upon mutation of Column values, so this
     * value is volatile and should not be cached, but should be read whenever needed.**
     * @member {HTMLElement}
     * @readonly
     */
    get textElement() {
        return DomHelper.down(this.element, '.b-grid-header-text-content');
    }

    /**
     * The child element into which content should be placed. This means where any
     * contained widgets such as filter input fields should be rendered. *Only available after the grid has been
     * rendered*.
     *
     * **Note that column headers are rerendered upon mutation of Column values, so this
     * value is volatile and should not be cached, but should be read whenever needed.**
     * @member {HTMLElement}
     * @readonly
     */
    get contentElement() {
        return DomHelper.down(this.element, '.b-grid-header-children');
    }

    //endregion

    //region Misc properties

    get isSorted() {
        return this.grid.store.sorters.some(s => s.field === this.field) ||
            this.grid.store.groupers?.some(g => g.field === this.field);
    }

    get isFocusable() {
        return this.isLeaf && !this.grid?.hideHeaders;
    }

    static get text() {
        return this.$meta.fields.defaults.text;
    }

    /**
     * Returns header text based on {@link #config-htmlEncodeHeaderText} config value.
     * @member {String}
     * @readonly
     * @internal
     */
    get headerText() {
        return this.htmlEncodeHeaderText ? StringHelper.encodeHtml(this.text) : this.text;
    }

    /**
     * An object which contains a map of the header widgets keyed by their {@link Core.widget.Widget#config-ref ref}.
     * @member {Object<String,Core.widget.Widget>} headerWidgetMap
     * @readonly
     * @private
     */

    //endregion

    //region Show/hide

    get isVisible() {
        return this.shown && (!this.parent || this.parent.isVisible);
    }

    /**
     * Hides this column.
     * @async
     */
    async hide(silent = false, hidingParent = false, animate = true, collapsing = false) {
        const
            me         = this,
            { parent } = me,
            prop       = collapsing ? 'hiddenByCollapse' : 'hidden';

        // Reject non-change
        if (!me[prop]) {
            if (!me.parent?.skipAnimation && animate) {
                await me.grid.beforeColumnHide({ column : me, hidingParent, collapsing });

                if (me.isDestroyed) {
                    return;
                }
            }

            if (!collapsing) {
                me.hidden = true;
            }

            if (parent && !parent.isRoot && !parent.isTogglingAll) {
                // check if all sub columns are hidden, if so hide parent
                const anyVisible = parent.children.some(child => child.shown);
                if (!anyVisible && parent.shown) {
                    silent = true; // hiding parent will trigger event
                    parent.hide(undefined, undefined, undefined, collapsing);
                }
            }

            if (me.isParent) {
                await Promise.all(me.children.map(child => child.hide(true, true, undefined, collapsing)));

                if (me.isDestroyed) {
                    return;
                }
            }
            // Keep state when hiding parent, to be able to restore when showing
            if (parent && !parent.isRoot) {
                parent.meta.visibleChildren[hidingParent ? 'add' : 'delete'](me);
            }

            if (!silent) {
                me.stores?.forEach(store => store.trigger('columnHide', { column : me, collapsing }));
            }
        }
    }

    /**
     * Shows this column.
     * @async
     */
    async show(silent = false, animate = true, collapsing = false) {
        const
            me         = this,
            { parent } = me,
            prop       = collapsing ? 'hiddenByCollapse' : 'hidden';

        // Reject non-change
        if (me[prop]) {

            if (!collapsing) {
                me.hidden = false;
            }

            if (parent?.[prop]) {
                await parent.show(undefined, animate, collapsing);

                if (me.isDestroyed) {
                    return;
                }
            }

            if (me.isParent) {
                // Only show children
                me.meta.visibleChildren?.forEach(child => child.show(true, animate, collapsing));
            }

            // event is triggered on chained stores
            if (!silent) {
                if (animate) {
                    await me.grid.afterColumnShow({ column : me, collapsing });

                    if (me.isDestroyed) {
                        return;
                    }
                }
                me.stores?.forEach(store => store.trigger('columnShow', { column : me, collapsing }));
            }
        }
    }

    /**
     * Toggles the column visibility.
     * @param {Boolean} [force] Set to `true` (visible) or `false` (hidden) to force a certain state
     * @async
     */
    async toggle(force, skipAnim = false, collapsing = false) {
        const prop = collapsing ? 'hiddenByCollapse' : 'hidden';

        if ((this[prop] && force === undefined) || force === true) {
            return this.show(false, !skipAnim, collapsing);
        }

        if ((!this[prop] && force === undefined) || force === false) {
            return this.hide(false, false, !skipAnim, collapsing);
        }
    }

    /**
     * Toggles the column visibility of all children of a parent column.
     * @param {Grid.column.Column[]} [columns] The set of child columns to toggle, defaults to all children
     * @param {Boolean} [force] Set to `true` (visible) or `false` (hidden) to force a certain state
     */
    async toggleChildren(columns = this.children, force = undefined, collapsing = false) {
        const me = this;

        me.grid.columns?.beginBatch();
        me.isTogglingAll = true;
        await Promise.all(columns.map(childColumn => childColumn.toggle(force, undefined, collapsing)));

        if (me.isDestroyed) {
            return;
        }

        me.isTogglingAll = false;
        me.grid.columns?.endBatch();
    }

    get shown() {
        return !this.hidden && !this.hiddenByCollapse;
    }

    /**
     * Toggles the collapsed state of the column. Based on the {@link #config-collapseMode}, this either hides all
     * but the first child column, or toggles the visibility state of all children (if you want to have a special
     * column shown in collapsed mode).
     *
     * Only applicable for columns with child columns.
     * @private
     * @param {Boolean} [force] Set to `true` (expanded) or `false` (collapsed) to force a certain state
     */
    async onCollapseChange(force = undefined) {
        const
            me                          = this,
            { element, grid, children } = me,
            { classList }               = element || {},
            initialWidth                = element?.offsetWidth;

        grid.columns.clearCaches();
        me.subGrid.columns.clearCaches();

        if (me.collapseMode === 'toggleAll') {
            await me.toggleChildren(undefined, undefined, true);

            if (me.isDestroyed) {
                return;
            }

            if (!me.skipAnimation) {
                // toggleAll toggles all children, we might end up with more than we had before and vice versa. By
                // measuring the width before and after the operation we decide if we should animate a collapse or
                // expand
                const
                    shownChildren = children.filter(c => c.shown),
                    toggledWidth  = element.offsetWidth,
                    isExpand      = toggledWidth > initialWidth;

                // Bail out if app does not want to transition
                if ((isExpand && !grid.transition?.expandCollapseColumn) || (!isExpand && !grid.transition?.expandCollapseColumn)) {
                    return;
                }

                // Expanding
                if (isExpand) {
                    classList.add('b-toggling-all-expand');

                    let accWidth = 0;
                    // Transition columns exceeding the initial width
                    for (const childColumn of shownChildren) {
                        if (childColumn.shown) {
                            if (accWidth >= initialWidth) {
                                // Cls to bring width down to 0
                                childColumn.addCls('b-toggling-all-expand');
                            }
                            accWidth += childColumn.width;
                        }
                    }

                    await grid.executeAndAwaitAnimations(
                        () => {
                            // Remove the cls added above to transition to actual width
                            shownChildren.forEach(childColumn => childColumn.removeCls('b-toggling-all-expand'));
                            classList.remove('b-toggling-all-expand');
                        },
                        'b-toggling-columns'
                    );
                }
                // Collapsing
                else {
                    // Reducing width, need to fill the space with something, using the last visible child column
                    const lastChildColumn = shownChildren.at(-1);

                    // With no shown children left there is nothing to resize/fill, so skip the fill animation
                    if (lastChildColumn) {
                        const fillWidth = initialWidth - toggledWidth + lastChildColumn.width;

                        element.style.width = `${initialWidth}px`;
                        lastChildColumn.element.style.width = `${fillWidth}px`;
                        lastChildColumn.cells.forEach(cell => cell.style.width = `${fillWidth}px`);
                        element.getBoundingClientRect(); // Force reflow

                        await grid.executeAndAwaitAnimations(
                            () => {
                                element.style.width = `${toggledWidth}px`;
                                lastChildColumn.cells.forEach(cell => cell.style.width = `${lastChildColumn.width}px`);
                                lastChildColumn.element.style.width = `${lastChildColumn.width}px`;
                            },
                            'b-toggling-columns'
                        );

                        element.style.width = '';
                    }
                }
            }
        }
        else {
            const
                notHiddenChildren = children.filter(c => !c.hidden),
                [firstChild]      = notHiddenChildren;

            // Nothing to lay out when every child column is hidden
            if (!firstChild) {
                return;
            }

            // For flexed child column, stamp a width on it in collapsed state
            if (firstChild.flex != null && me.collapsed) {
                firstChild.oldFlex = firstChild.flex;
                firstChild.width   = firstChild.element.offsetWidth;
            }
            else if (!me.collapsed && firstChild.oldFlex) {
                // For previously flexed child column, restore the flex value;
                firstChild.flex    = firstChild.oldFlex;
                firstChild.oldFlex = null;
            }

            let animate = !me.skipAnimation;

            if ((me.collapsed && !grid.transition?.expandCollapseColumn) || (!me.collapsed && !grid.transition?.expandCollapseColumn)) {
                animate = false;
            }

            // Transition collapse
            if (force === false && animate) {
                // Prep, stamp current width in and add transition cls to grid & us
                element.style.width = `${initialWidth}px`;
                classList.add('b-collapsing');

                // Add transition cls to all cells except for first column
                notHiddenChildren.forEach((childColumn, i) => i > 0 && childColumn.addCls('b-collapsing'));

                // Suspend intersection syncing during the transition. The collapsing columns are no longer part
                // of visibleColumns, syncing (triggered by the animating header widths) would remove their cells
                // mid transition when virtualizing columns
                grid.$suspendColumnCellSync = true;

                await grid.executeAndAwaitAnimations(
                    () => element.style.width = `${firstChild.width}px`,
                    'b-collapsing-column'
                );

                grid.$suspendColumnCellSync = false;

                classList.remove('b-collapsing');
                notHiddenChildren.forEach((childColumn, i) => i > 0 && childColumn.removeCls('b-collapsing'));

                element.style.width = '';
            }

            grid.columns?.beginBatch();
            me.isTogglingAll = true;
            notHiddenChildren.slice(1).forEach(childColumn => childColumn.toggle(force, true, true));
            me.isTogglingAll = false;
            grid.columns?.endBatch();

            // As we are updating multiple columns and for performance reasons we have suspended the UI updates on each
            // column update by using the beginBatch/endBatch methods, no `change` event is triggered and hence saveState
            // method is never called, so collapsed state of the columns is not saved. So we are calling saveState here
            // to make sure collapsed state is always saved.
            if (!grid.isConstructing) {
                grid.saveState();
            }

            // Transition expand
            if (force === true && animate) {
                const width = me.elementWidth;

                element.style.width = `${initialWidth}px`;

                notHiddenChildren.forEach((childColumn, i) => childColumn.addCls('b-expanding', i > 0 ? 'b-expanding-start' : null));
                classList.add('b-expanding-start', 'b-expanding');

                // Suspend intersection syncing during the transition, the animating header widths would
                // otherwise remove cells of the expanding columns mid transition when virtualizing columns
                grid.$suspendColumnCellSync = true;

                await grid.executeAndAwaitAnimations(
                    () => {
                        classList.remove('b-expanding-start');
                        notHiddenChildren.forEach((childColumn, i) => i > 0 && childColumn.removeCls('b-expanding-start'));
                        element.style.width = `${width}px`;
                    },
                    'b-expanding-column'
                );

                grid.$suspendColumnCellSync = false;

                classList.remove('b-expanding');
                notHiddenChildren.forEach(childColumn => childColumn.removeCls('b-expanding'));
                element.style.width = '';
            }
        }

        // Without this, scrollers might think they are still overflowing after collapse, when they are not
        // <remove-on-release>
        // TODO: Need to sync during animation, for fill last column to look nice during collapse
        // </remove-on-release>
        grid.requestAnimationFrame(() => {
            grid.eachSubGrid(subGrid => {
                subGrid.scrollable.syncOverflowState();
                subGrid.header.scrollable.syncOverflowState();
                // Catch up on intersection syncing suspended during the collapse / expand transition, in case
                // something changed while it was suspended (for example scrolling)
                subGrid.header.syncIntersections();
            });
        });
    }

    get cells() {
        if (this.grid.rowManager.rows[0]?.getCell(this.id)) {
            return this.grid.rowManager.rows.map(r => r.getCell(this.id));
        }

        return [];
    }

    addCls(...classes) {
        classes = classes.filter(notFalsy);
        this.element.classList.add(...classes); // Might not have a header
        this.toggleCls(classes, true);
    }

    removeCls(...classes) {
        classes = classes.filter(notFalsy);
        this.element.classList.remove(...classes);
        this.toggleCls(classes, false);
    }

    toggleCls(classes, force) {
        this.cells.forEach(cell => classes.forEach(cls => cell.classList.toggle(cls, Boolean(force))));
    }

    set collapsible(collapsible) {
        const me = this;

        me.set('collapsible', collapsible);

        if (me.isParent) {
            const { headerWidgets = [] } = me;

            if (collapsible) {
                headerWidgets.push({
                    type        : 'button',
                    ref         : 'collapseExpand',
                    toggleable  : true,
                    pressed     : me.collapsed,
                    icon        : `b-icon-collapse-${me.grid.rtl ? 'right' : 'left'}`,
                    pressedIcon : `b-icon-collapse-${me.grid.rtl ? 'left' : 'right'}`,
                    cls         : 'b-grid-header-collapse-button',
                    rendition   : 'text',
                    onToggle    : ({ pressed }) => me.collapsed = pressed
                });
            }
            else {
                const index = headerWidgets.findIndex(w => w.ref === 'collapseExpand');
                index > -1 && headerWidgets.splice(index, 1);
            }

            me.headerWidgets = headerWidgets;

            if (me.collapsed) {
                me.onCollapseChange(false);
            }
        }
    }

    get collapsible() {
        return this.get('collapsible');
    }

    //endregion

    //region Index & id

    /**
     * Generates an id for the column when none is set. Generated ids are 'col1', 'col2' and so on. If a field is
     * specified (as it should be in most cases) the field name is used instead: 'name1', 'age2' ...
     * @private
     * @returns {String}
     */
    generateId() {
        const
            { grid } = this,
            parts    = [this.field?.replace(/\./g, '-') ?? 'col'];

        // If the column is attached to a grid when created
        if (grid) {
            // Prepend the generated id with the grids stateId or id
            parts.unshift(grid.stateId ?? grid.id);

            if (!grid.generatedIdIndex) {
                grid.generatedIdIndex = 0;
            }
            // Keep the id counter on the grid instance
            // This ensures that each re-creation of the same configuration has identical generated ids
            parts.push(grid.generatedIdIndex += 1);
        }
        // Column created without a grid
        else {
            // Keep the id counter on the static Column class
            // This will give the column different id each time the configuration is re-created
            if (!Column.generatedIdIndex) {
                Column.generatedIdIndex = 0;
            }
            parts.push(Column.generatedIdIndex += 1);
        }

        return this.meta.generatedId = parts.join('-');
    }

    /**
     * Index among all flattened columns
     * @member {Number}
     * @readonly
     * @internal
     */
    get allIndex() {
        return this.masterStore.indexOf(this);
    }

    //endregion

    //region Width

    // Returns size in pixels for measured value
    measureSize(value) {
        return DomHelper.measureSize(value, this.subGrid?.element);
    }

    /**
     * Get/set columns width in px. If column uses flex, width will be undefined.
     * Setting a width on a flex column cancels out flex.
     *
     * **NOTE:** Grid might be configured to always stretch the last column, in which case the columns actual width
     * might deviate from the configured width.
     *
     * ```javascript
     * let grid = new Grid({
     *     appendTo : 'container',
     *     height   : 200,
     *     width    : 400,
     *     columns  : [{
     *         text  : 'First column',
     *         width : 100
     *     }, {
     *         text  : 'Last column',
     *         width : 100 // last column in the grid is always stretched to fill the free space
     *     }]
     * });
     *
     * grid.columns.last.element.offsetWidth; // 300 -> this points to the real element width
     * ```
     * @member {Number|String}
     */
    get width() {
        return this.data.width;
    }

    set width(width) {
        const data = { width };
        if (width && ('flex' in this.data)) {
            data.flex = null; // remove flex when setting width to enable resizing flex columns
        }
        this.set(data);
    }

    set flex(flex) {
        const data = { flex };
        if (flex && ('width' in this.data)) {
            data.width = null; // remove width when setting flex
        }
        this.set(data);
    }

    get flex() {
        return this.data.flex;
    }

    // Column has a fixed width if configured with a width or a flex-basis (0 0 xx)
    get fixedWidth() {
        const
            me                                            = this,
            { flex, minWidth, grid, pinned, pinnedWidth } = me,
            pinColumns                                    = grid?.features?.pinColumns;

        let { width } = me;

        if (typeof flex === 'string' && flex.startsWith('0 0 ')) {
            width = flex.match(/0 0 (.*)/)[1];
        }

        if (width != null) {
            return Math.max(me.measureSize(width), me.measureSize(minWidth));
        }

        if (pinColumns?.enabled && (pinned === 'start' || pinned === 'end') && pinnedWidth != null) {
            return pinnedWidth;
        }

        return null;
    }

    // Width of the columns header & cells, measured if the column is flexing
    get elementWidth() {
        const
            me = this,
            { fixedWidth } = me;

        if (me.isParent) {
            return me.children.reduce((t, child) => t + (child.hidden ? 0 : child.elementWidth), 0);
        }

        // Horizontal scroll, flexed columns will be at their minWidth
        if (me.subGrid.overflowingHorizontally) {
            return fixedWidth ?? me.measureSize(me.minWidth);
        }

        if (fixedWidth == null || (me.grid.fillLastColumn && me.isLastInSubGrid)) {
            return (me.element || me.grid.rowManager.rows[0].getCell(me.id, true)).getBoundingClientRect().width;
        }

        return fixedWidth;
    }

    /**
     * Resizes the column to match the widest string in it. By default it also measures the column header, this
     * behaviour can be configured by setting {@link Grid.view.Grid#config-resizeToFitIncludesHeader}.
     *
     * Called internally when you double-click the edge between column headers, but can also be called programmatically.
     * For performance reasons it is limited to checking 1000 rows surrounding the current viewport.
     *
     * The column's own {@link #config-minWidth} and {@link #config-maxWidth} are applied to the measured result, on top
     * of the passed limits. As with CSS, `minWidth` wins over `maxWidth`, so the resulting width is never below
     * `minWidth`.
     *
     * @param {Number|Number[]} widthMin Minimum allowed width. If content width is less than this, this width is used
     * instead. If this parameter is an array, the first element is `widthMin` and the seconds is `widthMax`.
     * @param {Number} widthMax Maximum allowed width. If the content width is greater than this number, this width
     * is used instead, unless the column's own {@link #config-minWidth} is larger.
     */
    async resizeToFitContent(widthMin, widthMax, batch = false) {
        const
            me             = this,
            {
                grid,
                element,
                fitMode
            }              = me,
            { rowManager } = grid,
            { records }    = grid.$store,
            count          = records.length;

        // Testing for vue fixes https://github.com/bryntum/bryntum/issues/8229
        if (count <= 0 || me.fitMode === 'none' || !me.fitMode || DomHelper.isVueConfig(me.data)) {
            return;
        }

        const
            [row]       = rowManager.rows,
            {
                rowElement,
                cellElement
            }           = grid.beginGridMeasuring(),
            cellContext = new GridLocation({
                grid,
                column : me,
                id     : null
            });

        let maxWidth                                      = 0,
            start, end, i, record, value, length, longest = { length : 0, record : null };

        // Fake element data to be able to use Row#renderCell()
        cellElement._domData = {
            columnId : me.id,
            row,
            rowElement
        };

        cellContext._cell             = cellElement;
        cellContext.updatingSingleRow = true;
        cellContext.isMeasuring       = true;

        // Clear cellElement, since it is being reused between columns
        cellElement.innerHTML = '';

        // Measure header unless configured not to
        if (grid.resizeToFitIncludesHeader && !grid.hideHeaders && !me.hasVerticalHeaderText) {
            // Cache the padding
            if (!grid.$headerPadding) {
                const style         = globalThis.getComputedStyle(element);
                grid.$headerPadding = parseInt(style.paddingLeft);
            }
            // Grab the header text content element
            const
                headerText = element.querySelector('.b-grid-header-text-content'),
                oldStyle   = headerText.style.cssText;

            // Restyle it to shrinkwrap its text, measure and then restore
            headerText.style.cssText = 'flex: none; width: auto';
            maxWidth                 = headerText.offsetWidth + (grid.cellEllipsis ? 1 : 0) + grid.$headerPadding * 2 + 1; // +1 to avoid overflow ellipsis

            headerText.style.cssText = oldStyle;
        }

        // If it's a very large dataset, measure the maxWidth of the field in the 1000 rows
        // surrounding the rendered block.
        if (count > 1000) {
            start = Math.max(Math.min(rowManager.topIndex + Math.round(rowManager.rowCount / 2) - 500, count - 1000), 0);
            end   = start + 1000;
        }
        else {
            start = 0;
            end   = count;
        }

        for (i = start; i < end; i++) {
            record = records[i];
            value  = me.getRawValue(record);

            // In value mode we determine the record with the longest value, no rendering involved
            if (fitMode === 'value') {
                length = String(value).length;
            }
            // In exact and textContent modes we have to render the records
            else {
                cellContext._record   = record;
                cellContext._id       = record.id;
                cellContext._rowIndex = i;

                row.renderCell(cellContext);

                // Reading textContent is "cheap", it does not require a layout
                if (fitMode === 'textContent') {
                    length = cellElement.textContent.length;
                }
                // Using exact mode, measure the cell = expensive
                else {
                    const width = cellElement.offsetWidth + (grid.cellEllipsis ? 1 : 0);
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                }
            }

            if (length > longest.length) {
                longest = { record, length, rowIndex : i };
            }
        }

        // Also measure the summary row if it is enabled
        if (grid.features.summary?.enabled) {
            const footerValueEl = grid.getFooterElement(me)?.querySelector('.b-grid-summary-value');

            if (footerValueEl) {
                const width = footerValueEl.scrollWidth + grid.$headerPadding * 2 + 2;

                if (width > maxWidth) {
                    maxWidth = width;
                }
            }
        }

        // value mode and textContent mode both required us to render and measure the record determined to be the
        // longest above
        if (longest.length > 0 && (fitMode === 'value' || fitMode === 'textContent')) {
            cellContext._record   = longest.record;
            cellContext._id       = longest.record.id;
            cellContext._rowIndex = longest.rowIndex;
            row.renderCell(cellContext);
            maxWidth = Math.max(maxWidth, cellElement.offsetWidth);
        }

        if (Array.isArray(widthMin)) {
            [widthMin, widthMax] = widthMin;
        }

        maxWidth = Math.max(maxWidth, widthMin || 0);
        maxWidth = Math.min(maxWidth, widthMax || 1e6);  // 1 million px default max

        if (me.maxWidth != null) {
            maxWidth = Math.min(maxWidth, me.measureSize(me.maxWidth));
        }

        // `minWidth` is clamped last because, as with CSS `min-width`, it wins over `maxWidth`. The header cell is
        // already floored at it, so the cells must be too, or the two end up misaligned.
        if (me.minWidth != null) {
            maxWidth = Math.max(maxWidth, me.measureSize(me.minWidth));
        }

        // Batch mode saves a little time by not removing the measuring elements between columns
        if (!batch) {
            grid.endGridMeasuring();
        }

        me.width = maxWidth;

        return maxWidth;
    }

    //endregion

    //region State

    /**
     * Get column state, used by State mixin
     * @private
     */
    getState() {
        const
            me           = this,
            { parentId } = me,
            state        = {
                id                : me.id,
                type              : me.type,
                // State should only store column attributes which user can modify via UI (except column index).
                // User can hide column, resize or move it to neighbor region
                hidden            : me.hidden,
                region            : me.region,
                locked            : me.locked,
                text              : me.text,
                isSelectionColumn : me.meta.isSelectionColumn ?? false
            };

        // Save field, as a fallback when matching on id fails
        if (!me.noFieldSpecified) {
            state.field = me.field;
        }

        if (parentId != null) {
            state.parentId = parentId;
        }

        if (!me.children) {
            state[me.flex ? 'flex' : 'width'] = me.flex || me.width;
        }

        if (me.isCollapsible) {
            state.collapsed = me.collapsed;
        }

        return state;
    }

    /**
     * Apply state to column, used by State mixin
     * @private
     */
    applyState(state) {
        const me = this;

        me.beginBatch();

        if ('locked' in state) {
            me.locked = state.locked;
        }

        if ('width' in state) {
            me.width = state.width;
        }

        if ('flex' in state) {
            me.flex = state.flex;
        }

        if ('width' in state && me.flex) {
            me.flex = undefined;
        }
        else if ('flex' in state && me.width) {
            me.width = undefined;
        }

        if ('region' in state) {
            me.region = state.region;
        }

        if ('text' in state) {
            me.text = state.text;
        }

        me.endBatch();

        if ('hidden' in state) {
            me.toggle(state.hidden !== true, true); // Skip animation when applying state
        }
        if ('collapsed' in state) {
            me.skipAnimation = true;
            me.collapsed = state.collapsed;
        }
    }

    //endregion

    //region Other

    remove() {
        const
            { subGrid, grid } = this,
            focusedCell       = subGrid && grid?.focusedCell;

        // Prevent errors when removing the column that the owning grid has registered as focused.
        if (focusedCell?.columnId === this.id) {

            // Focus is in the grid, navigate before column is removed
            if (grid.owns(DomHelper.getActiveElement(grid))) {
                grid.navigateRight();
            }
            // Focus not in the grid, bump the focused cell pointer to the next visible column
            // for when focus returns so it can go as close as possible.
            else {
                grid._focusedCell = new GridLocation({
                    grid,
                    rowIndex : focusedCell.rowIndex,
                    column   : subGrid.columns.getAdjacentVisibleLeafColumn(this.id, true, true)
                });
            }
        }
        super.remove();
    }

    /**
     * Extracts the value from the record specified by this Column's {@link #config-field} specification.
     *
     * This will work if the field is a dot-separated path to access fields in associated records, eg
     *
     * ```javascript
     *  field : 'resource.calendar.name'
     * ```
     *
     * **Note:** This is the raw field value, not the value returned by the {@link #config-renderer}.
     * @param {Core.data.Model} record The record from which to extract the field value.
     * @returns {*} The value of the referenced field if any.
     */
    getRawValue(record, editing) {
        // Engine can change field value to null, in which case cell will render previous record value,
        // before project commit
        return record.getValue(editing ? this.editorField : this.field);
    }

    /**
     * Refresh the cell for supplied record in this column, if that cell is rendered.
     * @param {Core.data.Model} record Record used to get row to update the cell in
     */
    refreshCell(record) {
        this.grid.rowManager.refreshCell(record, this.id);
    }

    /**
     * Refreshes all the cells for this column
     */
    refreshCells() {
        this.grid.refreshColumn(this);
    }

    /**
     * Rerender the header for this column
     */
    refreshHeader() {
        this.grid.refreshHeader(this);
    }

    /**
     * Clear cell contents. Base implementation which just sets innerHTML to blank string.
     * Should be overridden in subclasses to clean up for examples widgets.
     * @param {HTMLElement} cellElement
     * @internal
     */
    clearCell(cellElement) {
        cellElement.innerHTML = '';

        delete cellElement._content;
    }

    /**
     * Override in subclasses to allow/prevent editing of certain rows.
     * @param {Core.data.Model} record
     * @internal
     */
    canEdit(record) {
        // Use data.editor (raw config) instead of this.editor (getter) to avoid instantiating
        // the editor widget just to check if editing is possible. The getter lazily creates
        // the editor instance, which is wasteful for a simple editability check.
        return !this.readOnly && !this.grid.readOnly && this.data.editor && record?.isEditable(this.editorField) !== false;
    }

    /**
     * Insert a child column(s) before an existing child column. Returns `null` if the parent column is
     * {@link #config-sealed}
     * @param {Core.data.Model|Core.data.Model[]} childColumn Column or array of columns to insert
     * @param {Core.data.Model} [before] Optional column to insert before, leave out to append to the end
     * @param {Boolean} [silent] Pass `true` to not trigger events during insert
     * @returns {Core.data.Model|Core.data.Model[]|null}
     * @category Parent & children
     */
    insertChild(childColumn, before = null, silent = false, ...args) {
        childColumn = Array.isArray(childColumn) ? childColumn : [childColumn];

        // If user dragged out only visible child of collapsed parent, make next sibling visible
        childColumn.forEach(col => {
            const { parent } = col;

            if (parent?.collapsed && col === parent.firstChild && parent.children.length > 1 && parent.children.filter(child => child.shown).length === 1) {
                col.nextSibling.hidden = false;
            }
        });

        return (this.sealed && !this.inProcessChildren) ? null : super.insertChild(childColumn, before, silent, ...args);
    }

    /**
     * Override in subclasses to prevent this column from being filled with the {@link Grid.feature.FillHandle} feature
     * @param {Object} data Object containing information about current cell and fill value
     * @param {Grid.util.GridLocation} data.cell Current cell data
     * @param {Grid.util.GridLocation[]} data.range Range from where to calculate values
     * @param {Core.data.Model} data.record Current cell record
     * @param {Boolean} data.enforceType Pass true to verify type of the value can be accepted by this column
     * @param {*} data.value value to be applied
     * @returns {Boolean}
     * @internal
     */
    canFillValue({ range, record, cell, value, enforceType }) {

        let result = !this.readOnly && record.isEditable(this.field) !== false;
        if (result && enforceType) {
            const
                dataField = record.getFieldDefinition(this.field),
                dataConstructor = dataField?.constructor?.dataConstructor,

                matchingTypes = value == null || !dataField || dataField?.type === 'auto' || (dataConstructor && (value instanceof dataConstructor || (typeof value === dataConstructor.name.toLowerCase())));

            result = matchingTypes;
        }

        return result;
    }

    calculateFillValue({ value, record, fromCell, range, horizontal }) {
        const dataField = record.getFieldDefinition(this.field);

        // For basic columns, when we are filling a single value horizontally and there is no known field for the value
        // - we copy the raw rendered cell text
        if ((horizontal && range.length === 1) && (!dataField || dataField?.type === 'auto' || dataField?.type === 'string')) {
            value = range[0].cell.innerText.trim();
        }

        return value;
    }

    //endregion

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // It extracts the current configs (fields) for the column, with special handling for sortable, editor, renderer and
    // headerRenderer
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        // Use unbound sort fn
        if (this.sortable?.originalSortFn) {
            result.sortable = this.sortable.originalSortFn;
        }

        // Same for headerRenderer
        if (result.headerRenderer === this.internalHeaderRenderer) {
            delete result.headerRenderer;
        }

        delete result.ariaLabel;
        delete result.cellAriaLabel;
        delete result.disableRendererWarning;

        return result;
    }

    get visible() {
        return this.isVisible;
    }

    /**
     * Set this column to be visible or not
     * @member {Boolean} visible
     */
    set visible(value) {
        this.hidden = !value;
    }

    get readOnly() {
        const
            { field, grid } = this,
            readOnly = Boolean(this.get('readOnly'));

        if (field && grid) {
            return grid.store.modelClass.getFieldDefinition(field)?.calculated || readOnly;
        }

        return readOnly;
    }

    set readOnly(value) {
        this.set('readOnly', value);
    }

    get renderer() {
        return this.data?.renderer || this.defaultRenderer;
    }

    set renderer(renderer) {
        this.set('renderer', renderer);
    }

    get hasSummary() {
        return this.sum || this.summaries;
    }

    /**
     * Yields the name of the record field which the {@link Grid.feature.CellEdit} feature edits when invoked on
     * this column. This is usually this Column's {@link #config-field}, but Column subclasses may implement
     * this property.
     * @member {String}
     * @readonly
     * @internal
     */
    get editorField() {
        const
            { field } = this,
            dataField = field && this.grid.store.modelClass.getFieldDefinition(field);

        // Our dataField has a formula config, so in fact we edit a field
        // called #<the-field-name> which contains the forumla used to calculate the field value.
        if (dataField?.formulaProviders) {
            return `#${field}`;
        }
        return field;
    }

    // Batch updates to columns, there will be a lot with many columns if locale changes
    updateLocalization() {
        const
            { grid } = this,
            { columns } = grid || {};

        if (columns && this.applyingLocale) {
            const { isBatching } = columns;

            if (!isBatching) {
                columns.beginBatch();
            }

            super.updateLocalization();

            if (!isBatching) {
                grid.requestAnimationFrame(() => !grid.isDestroyed && columns.endBatch());
            }
        }
        else {
            super.updateLocalization();
        }
    }

    static setupClass(meta) {
        // Duplicate Column type names have always replaced previous definitions.
        // Keep this behavior intentionally:
        //  - Columns are often contributed from multiple products/extensions and may register
        //    the same type name (for example to customize or theme a built-in Column).
        //  - Allowing the later registration to silently override the earlier one makes it
        //    possible for applications and frameworks to replace default Column implementations
        //    without errors or warnings, and existing apps rely on this flexibility.
        //  - This differs from the more strict factory pattern (where duplicate type names
        //    might be treated as an error), but is preserved here for backwards compatibility
        //    and configuration override support specifically for Column types.
        meta.replaceType = true;
        return super.setupClass(meta);
    }
}

// Register type with its Factory
Column.initClass();

// Registered in ColumnStore as we can't have this in Column due to circular dependencies

Column.emptyCount   = 0;
Column.defaultWidth = 100;
Column.exposeProperties();
