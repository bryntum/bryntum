import DomHelper from '../../Core/helper/DomHelper.js';
import GridEditBase from './base/GridEditBase.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Editor from '../../Core/widget/Editor.js';
import GlobalEvents from '../../Core/GlobalEvents.js';
import MessageDialog from '../../Core/widget/MessageDialog.js';
import GridLocation from '../util/GridLocation.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import '../../Core/widget/NumberField.js';
import '../../Core/widget/Combo.js';
import '../../Core/widget/DateField.js';
import '../../Core/widget/TimeField.js';

DomHelper.loadStylesheet('Grid/feature/CellEdit.css');

// import Stylesheet from './CellEdit.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'CellEdit');

// <remove-on-release>
// TODO: Maybe some more way to stop editing in touch mode (in case grid fills entire page...)
// </remove-on-release>

const
    editingActions = {
        finishAndEditNextRow  : 1,
        finishAndEditPrevRow  : 1,
        finishEditing         : 1,
        cancelEditing         : 1,
        finishAndEditNextCell : 1,
        finishAndEditPrevCell : 1
    },
    allActions = {
        ...editingActions,
        startEditing      : 1,
        finishAllSelected : 1
    },
    scrollActionMethods = {
        cancel   : 'cancelEditing',
        complete : 'finishEditing'
    };

/**
 * @module Grid/feature/CellEdit
 */

/**
 * Cell editing context
 * @typedef {Object} CellEditorContext
 * @param {Core.widget.Field} editor The input field that the column is configured with
 *  (see {@link Grid.column.Column#config-field}). This property may be replaced
 *  to be a different {@link Core.widget.Field field} in the handler, to take effect just for the impending edit
 * @property {Grid.column.Column} column Target column
 * @property {Core.data.Model} record Target record
 * @property {HTMLElement} cell Target cell
 * @property {Function} [finalize] An async function may be injected into this property, which performs asynchronous
 *   finalization tasks such as complex validation of confirmation. The value `true` or `false` must be returned
 * @property {Object} [finalize.context] An object describing the editing context upon requested completion of the edit
 * @property {*} value Cell value
 * @property {*} [oldValue] The old value
 */

/**
 * Adding this feature to the grid and other Bryntum products which are based on the Grid (i.e. Scheduler and Gantt)
 * enables cell editing. Any subclass of {@link Core.widget.Field Field} can be used
 * as editor for the {@link Grid.column.Column Column}. The most popular are:
 *
 * - {@link Core.widget.TextField TextField}
 * - {@link Core.widget.NumberField NumberField}
 * - {@link Core.widget.DateField DateField}
 * - {@link Core.widget.TimeField TimeField}
 * - {@link Core.widget.Combo Combo}
 *
 * Usage instructions:
 * ## Start editing
 * * Double click on a cell
 * * Press <kbd>Enter</kbd> or <kbd>F2</kbd> with a cell selected (see {@link #keyboard-shortcuts Keyboard shortcuts} below)
 * * It is also possible to change double click to single click to start editing, using the {@link #config-triggerEvent} config
 *
 * ```javascript
 * new Grid({
 *    features : {
 *        cellEdit : {
 *            triggerEvent : 'cellclick'
 *        }
 *    }
 * });
 * ```
 *
 * ## Instant update
 * If {@link Grid.column.Column#config-instantUpdate} on the column is set to `true`, record will be updated instantly
 * as value in the editor is changed. In combination with {@link Core.data.Store#config-autoCommit} it could result in
 * excessive requests to the backend. By default instantUpdate is false, but it is enabled for some special columns,
 * such as Duration column in Scheduler Enterprise and all date columns in Gantt.
 *
 * ## Keyboard shortcuts
 * ### While not editing
 * | Keys             | Action         | Action description                    |
 * |------------------|----------------|---------------------------------------|
 * | <kbd>Enter</kbd> | *startEditing* | Starts editing currently focused cell |
 * | <kbd>F2</kbd>    | *startEditing* | Starts editing currently focused cell |
 *
 * ### While editing
 * | Keys                              | Action                  | Weight | Action description                                                                         |
 * |-----------------------------------|-------------------------|--------|--------------------------------------------------------------------------------------------|
 * | <kbd>Enter</kbd>                  | *finishAndEditNextRow*  |        | Finish editing and start editing the same cell in next row                                 |
 * | <kbd>Shift</kbd>+<kbd>Enter</kbd> | *finishAndEditPrevRow*  |        | Finish editing and start editing the same cell in previous row                             |
 * | <kbd>F2</kbd>                     | *finishEditing*         |        | Finish editing                                                                             |
 * | <kbd>Ctrl</kbd>+<kbd>Enter</kbd>  | *finishAllSelected*     |        | If {@link #config-multiEdit} is active, this applies new value on all selected rows/cells  |
 * | <kbd>Ctrl</kbd>+<kbd>Enter</kbd>  | *finishEditing*         |        | Finish editing                                                                             |
 * | <kbd>Escape</kbd>                 | *cancelEditing*         |        | By default, first reverts the value back to its original value, next press cancels editing |
 * | <kbd>Tab</kbd>                    | *finishAndEditNextCell* | 100    | Finish editing and start editing the next cell with a configured editor                    |
 * | <kbd>Shift</kbd>+<kbd>Tab</kbd>   | *finishAndEditPrevCell* | 100    | Finish editing and start editing the previous cell with a configured editor                |
 *
 * <div class="note">Please note that <kbd>Ctrl</kbd> is the equivalent to <kbd>Command</kbd> and <kbd>Alt</kbd>
 * is the equivalent to <kbd>Option</kbd> for Mac users</div>
 *
 * {@note}When using the <kbd>Tab</kbd> key to navigate between cells, the editor will skip over cells which contain
 * naturally focusable elements, such as buttons or input fields. To have these included in the tabbing, configure the
 * {@link #config-tabToFocusables} setting as `true`.{/@note}
 *
 * For more information on how to customize keyboard shortcuts, please see
 * [our guide](#Grid/guides/customization/keymap.md).
 *
 * ## Editor configuration
 * Columns specify editor in their configuration. Editor can also by set by using a column type. Columns
 * may also contain these three configurations which affect how their cells are edited:
 * * {@link Grid.column.Column#config-invalidAction}
 * * {@link Grid.column.Column#config-revertOnEscape}
 * * {@link Grid.column.Column#config-finalizeCellEdit}
 *
 * ## Preventing editing of certain cells
 * You can prevent editing on a column by setting `editor` to false:
 *
 * ```javascript
 * new Grid({
 *    columns : [
 *       {
 *          type   : 'number',
 *          text   : 'Age',
 *          field  : 'age',
 *          editor : false
 *       }
 *    ]
 * });
 * ```
 *
 * To prevent editing in a specific cell, listen to the {@link #event-beforeCellEditStart} and return false:
 *
 * ```javascript
 * grid.on('beforeCellEditStart', ({ editorContext }) => {
 *     return editorContext.column.field !== 'id';
 * });
 * ```
 *
 * ## Choosing field on the fly
 * To use an alternative input field to edit a cell, listen to the {@link #event-beforeCellEditStart} and
 * set the `editor` property of the context to the input field you want to use:
 *
 * ```javascript
 * grid.on('beforeCellEditStart', ({ editorContext }) => {
 *     return editorContext.editor = myDateField;
 * });
 * ```
 *
 * ## Loading remote data into a combo box cell editor
 * If you need to prepare or modify the data shown by the cell editor, e.g. load remote data into the store used by a
 * combo, listen to the {@link #event-startCellEdit} event:
 * ```javascript
 * // A server endpoint returning data like:
 * // [{ id : 123, name : 'Bob Mc Bob' }, { id : 345, name : 'Lind Mc Foo' }]
 * const employeeStore = new AjaxStore({ readUrl : '/cities' });
 *
 * new Grid({
 *     // Example data including a city field which is an id used to look up entries in the cityStore above
 *     data : [
 *         { id : 1, name : 'Task 1', employeeId : 123 },
 *         { id : 2, name : 'Task 2', employeeId : 345 }
 *     ],
 *     columns : [
 *       {
 *          text   : 'Task',
 *          field  : 'name'
 *       },
 *       {
 *          text   : 'Assigned to',
 *          field  : 'employeeId',
 *          editor : {
 *               type : 'combo',
 *               store : employeeStore,
 *               // specify valueField'/'displayField' to match the data format in the employeeStore store
 *               valueField : 'id',
 *               displayField : 'name'
 *           },
 *           renderer : ({ value }) {
 *                // Use a renderer to show the employee name, which we find by querying employeeStore by the id of the grid record
 *                return employeeStore.getById(value)?.name;
 *           }
 *       }
 *    ],
 *    listeners : {
 *        // When editing, you might want to fetch data for the combo store from a remote resource
 *        startCellEdit({ editorContext }) {
 *            const { record, editor, column } = editorContext;
 *            if (column.field === 'employeeId') {
 *                // Load possible employees to assign to this particular task
 *                editor.inputField.store.load({ task : record.id });
 *            }
 *       }
 *    }
 * });
 * ```
 *
 * ## Editing on touch devices
 *
 * On touch devices, a single tap navigates and tapping an already selected cell after a short delay starts the editing.
 *
 * This feature is **enabled** by default.
 *
 * ## Validation
 *
 * To validate the cell editing process you can use the {@link Grid.column.Column#config-finalizeCellEdit} config.
 * Please refer to its documentation for details.
 *
 * The following example requires a name of a minimum of 5 characters and a score of less than 1,000 for Paris city.
 *
 * {@inlineexample Grid/feature/CellEdit.js}
 *
 * You can use the `value` parameter to add validation to accept a value of minimum 5 characters:
 * ```javascript
 * // Column
 * {
 *  field: 'name',
 *  text: 'Name',
 *  flex: 1,
 *  finalizeCellEdit: ({ value }) => {
 *      // Implement your validation logic here
 *      if (value.trim().length < 5) {
 *          return "Name should be at least 5 characters";
 *      }
 *
 *      // Return true to allow the edit to be finalized
 *      return true;
 *  }
 * }
 * ```
 *
 * Along with the value, it also contains other parameters, such as `data.record` property, which provides a way to
 * access and validate other columns based on their values.
 *
 * In the following example, validation is performed based on the 'Score' column's value and the value of its sibling
 * column ('City'):
 *
 * ```javascript
 *       {
 *           type             : 'number',
 *           field            : 'score',
 *           text             : 'Score',
 *           flex             : 1,
 *           finalizeCellEdit : ({ value, record }) => {
 *
 *               // record contains sibling column's data e.g. city
 *               const { city } = record;
 *
 *               // Perform validation based on a sibling column
 *               if (city == 'Paris' && value > 999) {
 *                   return "Score can't be higher than 999 for Paris";
 *               }
 *               return true;
 *           }
 *       },
 * ```
 *
 * ## See also
 *
 * - {@link Grid.feature.RowEdit} - Edit an entire row in a popup form
 * - {@link Grid.column.Column#config-editor} - Per-column editor config
 *
 * @demo Grid/celledit
 * @extends Grid/feature/base/GridEditBase
 * @classtype cellEdit
 * @feature
 * @tier community
 */
export default class CellEdit extends GridEditBase {
    //region Config

    static $name = 'CellEdit';

    static type = 'cellEdit';
    static defaultEnabled = true;
    static tier = 'community';

    // Default configuration
    static configurable = {
        /**
         * Set to `true` to select the field text when editing starts
         * @config {Boolean}
         * @default
         */
        autoSelect : true,

        /**
         * What action should be taken when focus moves leaves the cell editor, for example when clicking outside.
         * May be `'complete'` or `'cancel`'.
         * @config {'complete'|'cancel'}
         * @default
         */
        blurAction : 'complete',

        /**
         * What action should be taken when the editor is scrolled out of view, for example when using a mousewheel
         * to scroll the grid.
         * May be `'complete'` or `'cancel`' or `null`.
         * @prp {'complete'|'cancel'|null}
         */
        scrollAction : null,

        /**
         * Set to `true` to have TAB key on the last cell (and ENTER anywhere in the last row) in the data set create
         * a new record and begin editing it at its first editable cell.
         *
         * If a customized {@link #config-keyMap} is used, this setting will affect the customized keys instead of
         * ENTER and TAB.
         *
         * If this is configured as an object, it is used as the default data value set for each new record.
         * @config {Boolean|Object}
         */
        addNewAtEnd : null,

        /**
         * Set to `true` to add record to the parent of the last record, when configured with {@link #config-addNewAtEnd}.
         * Only applicable when using a tree view and store.
         *
         * By default, it adds records to the root.
         * @prp {Boolean}
         * @default false
         */
        addToCurrentParent : false,

        /**
         * Set to `false` to not start editing next record when user presses enter inside a cell editor (or previous
         * record if SHIFT key is pressed). This is set to `false` when {@link #config-autoEdit} is `true`. Please
         * note that these key combinations could be different if a customized {@link #config-keyMap} is used.
         * @config {Boolean}
         * @default
         */
        editNextOnEnterPress : true,

        /**
         * Class to use as an editor. Default value: {@link Core.widget.Editor}
         * @config {Core.widget.Widget}
         * @ts-returns {typeof Widget}
         * @internal
         */
        editorClass : Editor,

        // To edit a cell using a touch gesture, at least 300ms should have passed since last cell tap
        touchEditDelay : 300,

        focusCellAnimationDuration : false,

        /**
         * If set to `true` (which is default) this will make it possible to edit current column in multiple rows
         * simultaneously.
         *
         * This is achieved by:
         * 1. Select multiple rows or row's cells
         * 2. Start editing simultaneously as selecting the last row or cell
         * 3. When finished editing, press Ctrl+Enter to apply the new value to all selected rows.
         *
         * If a customized {@link #config-keyMap} is used, the Ctrl+Enter combination could map to something else.
         *
         * @config {Boolean}
         * @default
         */
        multiEdit : true,

        /**
         * See {@link #keyboard-shortcuts Keyboard shortcuts} for details
         * @config {Object<String,KeyMapConfig>}
         */
        keyMap : {
            Enter         : ['startEditing', 'finishAndEditNextRow'],
            'Ctrl+Enter'  : ['finishAllSelected', 'finishEditing'],
            'Shift+Enter' : 'finishAndEditPrevRow',
            'Alt+Enter'   : 'finishEditing',
            F2            : ['startEditing', 'finishEditing'],
            Escape        : 'cancelEditing',
            Tab           : { handler : 'finishAndEditNextCell', weight : 100 },
            'Shift+Tab'   : { handler : 'finishAndEditPrevCell', weight : 100 }
        },

        /**
         * A callback which returns a `blurAction` value depending on the tap out event and the editing context.
         *
         * If specified, it is passed the mousedown event and the editing context object.
         * @config {Function}
         * @internal
         */
        validateTapOut : null,

        /**
         * By default, when cell editing is active, the TAB key will move focus to edit the next cell with a configured editor.
         *
         * This will skip over cells which contain naturally focusable elements, such as buttons or input fields.
         *
         * To have these included in the tabbing, configure this as `true`.
         * @prp {Boolean}
         */
        tabToFocusables : null
    };

    // Plugin configuration. This plugin chains some functions in Grid.
    static get pluginConfig() {
        return {
            assign : ['startEditing', 'finishEditing', 'cancelEditing'],
            before : ['onElementKeyDown', 'onElementPointerDown', 'onElementPointerUp'],
            after  : ['onElementClick', 'bindStore']
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        const
            me            = this,
            { client }    = me,
            gridListeners = {
                renderRows : 'onGridRefreshed',
                thisObj    : me
            };

        if (me.autoEdit && !('editNextOnEnterPress' in config)) {
            me.editNextOnEnterPress = false;
        }

        client.ion(gridListeners);

        client.rowManager.ion({
            changeTotalHeight : 'onGridRefreshed',
            thisObj           : me
        });

        // Monotonic sequence used to coalesce overlapping unmanaged edit requests (last-wins)
        me._editRequestSeq = 0;

        me.onValueChangeWhileEditing = me.onValueChangeWhileEditing.bind(me);
    }

    doDestroy() {
        // Release any navigation waiting on an app finish so it abandons cleanly
        this.resolveEditFinish(false);
        super.doDestroy();
    }

    bindStore(store) {
        this.detachListeners('store');

        store.ion({
            name       : 'store',
            update     : 'onStoreUpdate',
            remove     : 'onStoreRemove',
            beforeSort : 'onStoreBeforeSort',
            thisObj    : this
        });
    }

    /**
     * Displays an OK / Cancel confirmation dialog box owned by the current Editor. This is intended to be
     * used by {@link Grid.column.Column#config-finalizeCellEdit} implementations. The returned promise resolves passing
     * `true` if the "OK" button is pressed, and `false` if the "Cancel" button is pressed. Typing <kbd>Escape</kbd> rejects.
     *
     * @param {Object} options An options object for what to show.
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String|Object} [options.cancelButton] A text or a config object to apply to the Cancel button.
     * @param {String|Object} [options.okButton] A text or config object to apply to the OK button.
     * @returns {Boolean}
     */
    async confirm(options) {
        let result = true;

        if (this.editorContext) {
            // The input field must not lose containment of focus during this confirmation
            // so temporarily make the MessageDialog a descendant widget.
            MessageDialog.owner = this.editorContext.editor.inputField;
            options.rootElement = this.grid.rootElement;
            result = await MessageDialog.confirm(options);
            MessageDialog.owner = null;
        }

        return result === MessageDialog.yesButton;
    }

    //endregion

    //region Editing

    /**
     * Internal function to create or get existing editor for specified cell.
     * @private
     * @param {Object} cellContext An object which encapsulates a cell.
     * @returns {Core.widget.Editor} An Editor container which displays the input field.
     * @category Internal
     */
    getEditorForCell({ id, cell, column, columnId, editor }) {
        const
            me = this,
            {
                grid,
                editorClass
            }  = me;

        // Reuse the Editor by caching it on the column.
        let cellEditor = column.cellEditor,
            leftOffset = 0; // Only applicable for tree cells to show editor right of the icons etc

        // Help Editor match size and position
        if (column.editTargetSelector) {
            const editorTarget = cell.querySelector(column.editTargetSelector);

            leftOffset = editorTarget.offsetLeft;
        }

        editor.preventLabelCls = true;
        editor.autoSelect = me.autoSelect;

        // Still a config
        if (!cellEditor?.isEditor) {
            cellEditor = column.data.cellEditor = editorClass.create(editorClass.mergeConfigs({
                type          : editorClass.type,
                cls           : 'b-cell-editor',
                inputField    : editor,
                blurAction    : 'none',
                invalidAction : column.invalidAction,
                completeKey   : false,
                cancelKey     : false,
                owner         : grid,
                align         : {
                    align  : 't0-t0',
                    offset : [leftOffset, 0]
                },
                internalListeners : me.getEditorListeners(column.managedCellEditing),
                // Listen for cell edit control keys from the Editor
                onInternalKeyDown : me.onEditorKeydown.bind(me),
                // React editor wrapper code uses this flag to enable mouse events pass through to editor
                allowMouseEvents  : editor.allowMouseEvents,
                instantUpdate     : column.instantUpdate
            }, cellEditor?.floating ? {
                // Apply other default values if floating
                align : {
                    align          : 't0-b0',
                    allowTargetOut : false,
                    minHeight      : 100 // arbitrary default main height
                },
                matchSize    : false,
                scrollAction : 'realign'
            } : {
                // Specifically not floating
                constrainTo : null
            }, cellEditor));
        }

        // If matchSize auto heights it, ensure it at least covers the cell.
        cellEditor.minHeight = grid.rowHeight - 1;

        // If the input field needs changing, change it.
        if (cellEditor.inputField !== editor) {
            cellEditor.remove(cellEditor.items[0]);
            cellEditor.add(editor);
        }

        const { instantUpdate } = column;

        cellEditor.instantUpdate = instantUpdate;

        // Ensure the X offset is set to clear TreeCell furniture
        cellEditor.align.offset[0] = leftOffset;

        // Keep the record synced with the value. The field is reused per edit, so install the hook only once
        if (instantUpdate && !editor.cellEditValueSetter) {
            if (editor.isCombo) {
                editor.ion({
                    select  : me.onValueChangeWhileEditing,
                    thisObj : me
                });
            }
            else {
                ObjectHelper.wrapProperty(editor, 'value', null, me.onValueChangeWhileEditing);
            }
            editor.cellEditValueSetter = true;
        }

        Object.assign(cellEditor.element.dataset, {
            rowId : id,
            columnId,
            field : column.editorField
        });

        // First ESC press reverts
        cellEditor.inputField.revertOnEscape = column.revertOnEscape;

        return me.editor = cellEditor;
    }

    onValueChangeWhileEditing() {
        const { editorContext } = this;

        if (editorContext) {
            const
                { record }      = editorContext,
                { editorField } = editorContext.column,
                { inputField }  = editorContext.editor,
                { value }       = inputField;

            // Only tickle the record if the value has changed.
            if (
                editorContext.editor.isValid &&
                !ObjectHelper.isEqual(record.getValue(editorField), value, true)
            ) {
                // If editor is a dateField, only allow picker input as not to trigger change on each keystroke.
                if (!inputField?.isDateField || inputField?._isPickerInput) {
                    record.setValue(editorField, value);
                    inputField._outstandingUpdate = false;
                }
                else {
                    // mark that instant update hasn't been actually applied
                    inputField._outstandingUpdate = true;
                }
            }
        }
    }

    // Turned into function to allow overriding in Gantt, and make more configurable in general
    getEditorListeners(managedCellEditing) {
        return {
            focusOut       : managedCellEditing ? 'onEditorFocusOut' : null,
            focusIn        : 'onEditorFocusIn',
            start          : 'onEditorStart',
            beforeComplete : 'onEditorBeforeComplete',
            complete       : 'onEditorComplete',
            beforeCancel   : 'onEditorBeforeCancel',
            cancel         : 'onEditorCancel',
            beforeHide     : 'onBeforeEditorHide',
            afterEdit      : 'onEditorAfterEdit',
            thisObj        : this
        };
    }

    syncEditingReadOnly({ readOnly }) {
        if (this.isEditing && readOnly) {
            this.cancelEditing();
        }
    }

    onEditorStart({ source : editor }) {
        const
            me            = this,
            editorContext = me.editorContext = editor.cellEditorContext;

        if (editorContext) {
            const { grid } = me;

            // Should move editing to new cell on click, unless click is configured to start editing - in which case it
            // will move anyway
            if (me.triggerEvent !== 'cellclick') {
                me.detachListeners('cellClickWhileEditing');
                grid.ion({
                    name      : 'cellClickWhileEditing',
                    cellClick : 'onCellClickWhileEditing',
                    thisObj   : me
                });
            }

            me.removeEditingListeners?.();
            me.removeScrollListener?.();

            if (editorContext.column.managedCellEditing) {
                // Handle tapping outside the grid element. Use GlobalEvents
                // because it uses a capture:true listener before any other handlers
                // might stop propagation.
                // Cannot use delegate here. A tapped cell will match :not(#body-container)
                me.removeEditingListeners = GlobalEvents.addListener({
                    globalTap : 'onTapOut',
                    thisObj   : me
                });
            }

            // Handle checking whether the editor goes out of view
            if (me.scrollAction) {
                me.removeScrollListener = EventHelper.on({
                    element : document,
                    scroll  : 'onScroll',
                    thisObj : me,
                    capture : true
                });
            }

            /**
             * Fires on the owning Grid when editing starts
             * @event startCellEdit
             * @on-owner
             * @param {Grid.view.Grid} source Owner grid
             * @param {CellEditorContext} editorContext Editing context
             */
            grid.trigger('startCellEdit', { grid, editorContext });
        }
    }

    onScroll() {
        if (!DomHelper.isInView(this.editor.element)) {
            this[scrollActionMethods[this.scrollAction]]();
        }
    }

    onEditorBeforeComplete(context) {
        const
            { grid }      = this,
            editor        = context.source,
            editorContext = editor.cellEditorContext;

        context.grid = grid;
        context.editorContext = editorContext;

        editorContext.oldValue = editorContext.value;
        editorContext.value = editorContext.editor.inputField.value;
        /**
         * Fires on the owning Grid before the cell editing is finished, return false to signal that the value is invalid and editing should not be finalized.
         * @on-owner
         * @event beforeFinishCellEdit
         * @param {Grid.view.Grid} grid Target grid
         * @param {CellEditorContext} editorContext Editing context
         */
        return grid.trigger('beforeFinishCellEdit', context);
    }

    onEditorComplete({ source : editor }) {
        const
            { grid }      = this,
            editorContext = editor.cellEditorContext;

        // Something might have aborted the editing before we got here
        if (!editorContext) {
            return;
        }
        // Ensure the docs below are accurate!
        editorContext.value = editor.inputField.value;

        // Refresh grid if a related field was edited
        if (editor.dataField.includes('.')) {
            const relationName  = editor.dataField.split('.')[0];
            if (editor.record.constructor.relations?.[relationName]) {
                grid.rowManager.refresh();
            }
        }

        /**
         * Fires on the owning Grid when cell editing is finished
         * @event finishCellEdit
         * @on-owner
         * @param {Grid.view.Grid} grid Target grid
         * @param {CellEditorContext} editorContext Editing context
         */
        grid.trigger('finishCellEdit', { grid, editorContext });
    }

    onEditorBeforeCancel() {
        const { editorContext } = this;

        /**
         * Fires on the owning Grid before the cell editing is canceled, return `false` to prevent cancellation.
         * @event beforeCancelCellEdit
         * @preventable
         * @on-owner
         * @param {Grid.view.Grid} source Owner grid
         * @param {Grid.util.GridLocation} editorContext Editing context
         */
        return this.grid.trigger('beforeCancelCellEdit', { editorContext });
    }

    onEditorCancel({ event }) {
        const { editorContext, muteEvents, grid } = this;

        if (!muteEvents) {
            /**
             * Fires on the owning Grid when editing is cancelled
             * @event cancelCellEdit
             * @on-owner
             * @param {Grid.view.Grid} source Owner grid
             * @param {Grid.util.GridLocation} editorContext Editing context
             * @param {Event} event Included if the cancellation was triggered by a DOM event
             */
            grid.trigger('cancelCellEdit', { grid, editorContext, event });
        }
    }

    onBeforeEditorHide({ source }) {
        const
            me = this,
            {
                row,
                cell
            }  = source.cellEditorContext;

        // Clean up and restore cell to full visibility
        // before we hide and attempt to revert focus to the cell.
        me.removeEditingCls(cell, row);
        me.detachListeners('cellClickWhileEditing');
        me.removeEditingListeners?.();
        me.removeScrollListener?.();
    }

    removeEditingCls(cell, row) {
        cell && DomHelper.addTemporaryClass(cell, 'b-after-edit', 50, this);
        cell?.classList.remove('b-editing');
        row?.removeCls('b-editing');
    }

    onEditorAfterEdit({ source }) {
        const { editorContext } = this;

        // Clean up context objects so we know we are not editing
        source.cellEditorContext = this.editorContext = null;

        // Inform column that its field has been updated
        editorContext?.column?.onCellEditComplete?.(editorContext);
    }

    /**
     * Find the next succeeding or preceding cell which is editable (column.editor != false)
     * @param {Grid.util.GridLocation} cellInfo
     * @param {Boolean} isForward
     * @returns {Object}
     * @private
     * @category Internal
     */
    getAdjacentEditableCell(cellInfo, isForward) {
        const
            { grid }           = this,
            { store, columns } = grid,
            { visibleColumns } = columns;

        let
            rowId      = cellInfo.id,
            { record } = cellInfo,
            column     = columns.getAdjacentVisibleLeafColumn(cellInfo.columnId, isForward);

        while (rowId) {
            if (column) {
                if (this.tabToFocusables) {
                    // We need to check if the cell contains focusables.
                    // If it does, cell editing continues with a fake Editor wrapping that content.
                    // See finishAndEditNextCell for the other half of this.
                    const cellContext = grid.normalizeCellContext({ record, column });

                    // If the cell contains focusables and is not the cell editable, we need to wrap the first
                    // focusable in a fake Editor, so as to appear to continue editing.
                    if (cellContext.target !== cellContext.cell && !this.getEditingContext(cellContext)) {
                        return cellContext;
                    }
                }

                if (column.canEdit(record)) {
                    return { id : rowId, columnId : column.id };
                }
                return this.getAdjacentEditableCell(grid.normalizeCellContext({ id : rowId, columnId : column.id }), isForward);
            }
            else {
                record = store.getAdjacent(cellInfo.id, isForward, false, true);
                rowId = record?.id;

                if (record) {
                    column = isForward ? visibleColumns[0] : visibleColumns[visibleColumns.length - 1];
                }
            }
        }

        return null;
    }

    /**
     * Adds a new, empty record at the end of the TaskStore with the initial
     * data specified by the {@link Grid.feature.CellEdit#config-addNewAtEnd} setting.
     *
     * @private
     * @async
     * @returns {Core.data.Model} Newly added record
     */
    async doAddNewAtEnd() {
        const
            newRecordConfig              = typeof this.addNewAtEnd === 'object' ? ObjectHelper.clone(this.addNewAtEnd) : {},
            { grid : { store }, addToCurrentParent } = this;

        let record;
        if (store.tree && addToCurrentParent) {
            record = store.last.parent.appendChild(newRecordConfig);
        }
        else {
            record = store.add(newRecordConfig)[0];
        }

        // Now ensure we can see the new row
        await this.client.scrollRowIntoView(record, { animate : false, block : 'nearest' });

        return record;
    }

    /**
     * Creates an editing context object for the passed cell context (target cell must be in the DOM).
     *
     * If the referenced cell is editable, a {@link Grid.util.GridLocation} will
     * be returned containing the following extra properties:
     *
     *     - editor
     *     - value
     *
     * If the referenced cell is _not_ editable, `false` will be returned.
     * @param {Object} cellContext an object which encapsulates a cell.
     * @param {String} cellContext.id The record id of the row to edit
     * @param {String} cellContext.columnId The column id of the column to edit
     * @returns {Grid.util.GridLocation|Boolean}
     * @private
     */
    getEditingContext(cellContext) {
        cellContext = this.grid.normalizeCellContext(cellContext);

        const
            { column, record } = cellContext,
            { editor } = column;

        // Cell must be in the DOM to edit.
        // Cannot edit hidden columns and columns without an editor.
        // Cannot edit special rows (groups etc).
        if (column?.isVisible && editor && record && !record.isSpecialRow && column.canEdit(record)) {
            // If the field name is a complex mapping (instead of using a field name with a dataSource)
            // set it correctly. Row#renderCell gets its contentValue in this way.
            const value = record ? column.getRawValue(record, true) : record;

            Object.assign(cellContext, {
                value : value === undefined ? null : value,
                editor
            });
            return cellContext;
        }

        return false;
    }

    startEditingFromKeyMap() {
        const
            { focusedCell } = this.grid,
            column          = focusedCell?.column;

        // If disabled no can do.
        if (!this.disabled && column?.get('editor') !== false) {
            return this.startEditing(focusedCell);
        }
        return false;
    }

    /**
     * Start editing specified cell. If no cellContext is given it starts with the first cell of the first visible row.
     * This function is exposed on Grid and can thus be called as `grid.startEditing(...)`
     * @param {GridLocationConfig} cellContext Cell specified in format { id: 'x', columnId/column/field: 'xxx' }. See
     * {@link Grid.view.Grid#function-getCell} for details.
     * @fires startCellEdit
     * @returns {Promise} Resolved promise returns`true` if editing has been started, `false` if an {@link Core.widget.Editor#event-beforeStart} listener
     * has vetoed the edit.
     * @category Editing
     * @on-owner
     */
    async startEditing(cellContext = {}) {
        const me = this;

        // If disabled no can do.
        if (me.disabled) {
            return false;
        }

        const { grid } = me;

        // If we got here from keyMap, start editing currently focused cell instead
        if (cellContext?.fromKeyMap) {
            cellContext = grid.focusedCell;
        }

        // When cell context is not available add the first cell context
        if (ObjectHelper.isEmpty(cellContext)) {
            cellContext.id = grid.firstVisibleRow.id;
        }

        // Has to expand before normalizing to a GridLocation, since GridLocation only maps to visible rows
        if (grid.store.isTree && grid.features.tree) {
            const record = cellContext.id ? grid.store.getById(cellContext.id) : cellContext.record ?? grid.store.getAt(cellContext.row);

            if (record) {
                await grid.expandTo(record);
            }
            else {
                return false;
            }
        }

        const editorContext = me.getEditingContext(cellContext);

        // Cannot edit hidden columns and columns without an editor
        // Cannot edit special rows (groups etc.).
        if (!editorContext) {
            return false;
        }

        if (me.editorContext) {
            // Trying to edit same row/cell? no-op
            if (editorContext.id === me.editorContext.id && editorContext.columnId === me.editorContext.columnId) {
                return;
            }

            // Unmanaged: the app owns finalization. Relinquish to it and wait for its finish rather than
            // cancelling/finalizing ourselves. Only one editor is open at a time.
            if (me.editorContext.column.managedCellEditing === false) {
                const
                    token     = ++me._editRequestSeq,
                    committed = await me.releaseToApp(me.editorContext);

                // Vetoed, aborted, superseded by a newer request, or destroyed -> abandon this move
                if (me.isDestroyed || !committed || me._editRequestSeq !== token) {
                    return false;
                }
                // editorContext is now null (app finished) -> fall through to open the target
            }
            // Managed: finalize by cancelling the prior edit.
            // If the cancel was vetoed by a handler, we cannot start the new edit
            else if (me.cancelEditing() === false) {
                return false;
            }
        }

        // The cell *must* be focused before editing can start so that focus reversion from the editor
        // goes back to the right place.
        if (!editorContext.cell?.matches(':focus')) {
            // Clear the private property so that a change is forced below.
            grid._focusedCell = null;
            grid.focusCell(editorContext);
        }

        /**
         * Fires on the owning Grid before editing starts, return `false` to prevent editing
         * @event beforeCellEditStart
         * @on-owner
         * @preventable
         * @param {Grid.view.Grid} source Owner grid
         * @param {CellEditorContext} editorContext Editing context
         */
        if (grid.trigger('beforeCellEditStart', { grid, editorContext }) === false) {
            return false;
        }

        const
            editor = editorContext.editor = me.getEditorForCell(editorContext),
            {
                row,
                cell,
                record
            }      = editorContext;

        // Prevent highlight when setting the value in the editor
        editor.inputField.highlightExternalChange = false;

        editor.cellEditorContext = editorContext;
        editor.render(cell);

        // CSS state must be set before the startEdit causes the Editor to align itself
        // because if its target is overflow:hidden, it automatically constrains its size.
        cell.classList.add('b-editing');
        row.addCls('b-editing');

        // Attempt to start edit.
        // We will set up our context in onEditorStart *if* the start was successful.
        if (!(await editor.startEdit({
            target : cell,
            field  : editor.inputField.name || editorContext.column.editorField,
            value  : editorContext.value,
            record
        }))) {
            // If the editor was vetoed, undo the CSS state.
            me.removeEditingCls(cell, row);
        }

        // Inform column that its field has begun to be edited
        editorContext.column.onCellEditStart?.(editorContext);
        me.onCellEditStart?.();

        return true;
    }

    /**
     * Cancel editing, hides the editor.
     * This function is exposed on Grid and can thus be called as `grid.cancelEditing(...)`
     * @param {Boolean} [silent] Pass true to prevent method from firing event
     * @fires cancelCellEdit
     * @returns {Boolean} `false` if the edit could not be canceled due to the editor's
     * {@link Core.widget.Editor#event-beforeCancel} event being prevented.
     * @category Editing
     * @on-owner
     */
    cancelEditing(silent, triggeredByEvent) {
        const
            me         = this,
            { editor } = me;

        if (!me.isEditing) {
            return;
        }

        // If called from keyMap, first argument is an event, ignore that
        if (silent?.fromKeyMap) {
            triggeredByEvent = silent;
            silent = false;
        }

        me.muteEvents = Boolean(silent);
        const cancelResult = editor.cancelEdit(triggeredByEvent);
        me.muteEvents = false;

        // Cancel was prevented
        if (cancelResult === false) {
            // Cancel request may have been the result of focus loss
            editor.inputField.focus();
        }
        else {
            // In case editing is canceled while waiting for finishing promise
            me.finishEditingPromise = null;

            // A cancel is a non-committed finish - release any navigation awaiting the outcome
            me.resolveEditFinish(false);

            me.afterCellEdit?.();
        }
        return cancelResult;
    }

    /**
     * Finish editing, update the underlying record and hide the editor.
     * This function is exposed on Grid and can thus be called as `grid.finishEditing(...)`
     * @fires finishCellEdit
     * @category Editing
     * @returns {Promise} Resolved promise returns `false` if the edit could not be finished due to the value being invalid or the
     * Editor's `complete` event was vetoed.
     * @on-owner
     */
    async finishEditing(event) {
        const
            me                      = this,
            { editorContext, grid } = me;

        let result = false;

        // If already waiting for finishing promise, return that
        if (me.finishEditingPromise) {
            return me.finishEditingPromise;
        }

        if (editorContext) {
            const { column } = editorContext;

            // If it's a fake Editor (fabbed up solely to encapsulate naturally focusable cell content),
            // we do not process an Enter key. See usages of getFakeEditor in this file.
            // The focused element inside the cell must process the Enter key
            if (event?.key === 'Enter') {
                if (!editorContext.editor.isEditor) {
                    return false;
                }
                // Prevent the Enter key from doing anything more when focus is reverted to the cell.
                // No further processing must ensue from the key event.
                event.stopImmediatePropagation();
            }

            // completeEdit *awaits* any finalize method before completing the edit, so we await it too.
            // We can override that finalize method by passing the column's own finalizeCellEdit.
            // (column might have `internalFinalizeCellEdit` method implementing custom finalization)
            // The try/finally guarantees the finishEditingPromise flag is cleared and any navigation
            // awaiting the outcome is released even if the app's finalize throws (which propagates).
            try {
                me.finishEditingPromise = editorContext.editor.completeEdit(column.internalFinalizeCellEdit?.bind(column) || column.bindCallback(column.finalizeCellEdit), event);
                result = await me.finishEditingPromise;

                if (grid.isDestroyed) {
                    return;
                }

                // If grid is animating, wait for it to finish to not start a follow-up edit when things are moving
                // (only applies to Scheduler for now, tested in Scheduler´s CellEdit.t.js)
                // Should ideally only check for rowHeight being animated
                if (grid.isSchedulerBase) {
                    await grid.waitForAnimations();
                }

                // Clear the finishing flag once the edit itself has committed, BEFORE the post-edit hook. On Gantt
                // afterCellEdit() is resumeAutoSync() (a server round-trip): keeping finishEditingPromise set across
                // it would drop navigation issued during the sync, and a hung/failed sync would brick all future
                // editing (finishEditing short-circuits on the stale promise). The finally is an idempotent safety
                // net for a throwing completeEdit.
                me.finishEditingPromise = null;

                if (result) {
                    await me.afterCellEdit?.();
                }
            }
            finally {
                me.finishEditingPromise = null;
                me.resolveEditFinish(Boolean(result));
            }
        }

        return result;
    }

    /**
     * Returns a promise that resolves with the committed outcome (`true`/`false`) of the next edit finish,
     * whether that finish is performed by the framework or by the app in unmanaged mode. Reuses an already
     * armed await so overlapping navigation requests share a single finish signal.
     * @private
     * @returns {Promise<Boolean>}
     */
    awaitEditFinish() {
        const me = this;

        if (!me._editFinishResolve) {
            me._editFinishPromise = new Promise(resolve => {
                me._editFinishResolve = resolve;
            });
        }

        return me._editFinishPromise;
    }

    // Resolves a pending awaitEditFinish (if armed) with the committed outcome, then disarms it
    resolveEditFinish(committed) {
        const
            me      = this,
            resolve = me._editFinishResolve;

        if (resolve) {
            me._editFinishResolve = me._editFinishPromise = null;
            resolve(committed);
        }
    }

    /**
     * Unmanaged-mode navigation helper. Arms the finish await *before* relinquishing focus so a synchronous
     * app finish is captured, then moves focus off the editor to provoke the app's own `finishEditing`, and
     * resolves once that finish has settled.
     * @private
     * @param {CellEditorContext} context The active editor context being relinquished
     * @returns {Promise<Boolean>} `true` if the app committed the edit, `false` if it was vetoed/aborted
     */
    releaseToApp(context) {
        const
            me      = this,
            promise = me.awaitEditFinish();

        if (context.editor?.containsFocus) {
            context.cell?.focus();
        }

        return promise;
    }

    //endregion

    //region Events

    onStoreBeforeSort() {
        const editor = this.editorContext?.editor;

        if (this.isEditing && !editor?.isFinishing && !editor.isValid) {
            return this.cancelEditing();
        }
    }

    /**
     * Realign editor if grid renders rows while editing is ongoing (as a result to autoCommit or WebSocket data received).
     * @private
     * @category Internal event handling
     */
    onGridRefreshed() {
        const
            me = this,
            {
                grid,
                editorContext
            }  = me;

        if (editorContext && grid.isVisible && grid.focusedCell) {
            const
                { editor, cell } = editorContext;

            // If refresh was triggered by the data change in onEditComplete
            // do not re-show the editor.
            if (cell && DomHelper.isInView(cell) && !editor.isFinishing) {
                editorContext._cell = cell;

                // Editor is inside the cell for A11Y reasons.
                // So any refresh will remove its DOM.
                // We need to silently restore and refocus it.
                GlobalEvents.suspendFocusEvents();
                editor.render(cell);
                editor.showBy(cell);
                editor.focus();
                GlobalEvents.resumeFocusEvents();
            }
            else if (!me.finishEditingPromise) {
                me.cancelEditing();
            }
        }
    }

    // Gets selected records or selected cells records
    get gridSelection() {
        // _ to avoid additional shallow clones
        return [...this.grid._selectedRows, ...this.grid._selectedCells];
    }

    // Tells keyMap what actions are available in certain conditions
    isActionAvailable({ actionName, event }) {
        const me = this;

        // Non-default actions should always be let through
        if (!allActions[actionName]) {
            return;
        }

        if (!me.disabled && !event.target.closest('.b-grid-header')) {
            if (me.isEditing) {
                if (actionName === 'finishAllSelected') {
                    return me.multiEdit && me.gridSelection.length > 1;
                }
                else if (editingActions[actionName]) {
                    return true;
                }
            }
            else if (actionName === 'startEditing') {
                return Boolean(me.grid.focusedCell && !DomHelper.isEditable(event.target));
            }
        }
        return false;
    }

    // Will copy edited field value to all selected records
    async finishAllSelected() {
        const
            me                                       = this,
            { dataField, record : editedRecord, cellEditorContext } = me.editor;
        let { column }                               = cellEditorContext;

        if (await me.finishEditing() && !me.isDestroyed) {
            // Micro-optimization here - accessors could execute additional logic, so we only read it once
            const value = editedRecord.getValue(dataField);

            for (const selected of me.gridSelection) {
                let record = selected;

                if (!selected.isModel) {
                    column = selected.column;
                    record = selected.record;
                }

                if ((record !== editedRecord || column.field !== dataField) && column.canEdit(record) !== false &&
                    /**
                     * Fires for each selected record on the owning Grid before editing a range of selected cell values
                     * @event beforeCellRangeEdit
                     * @on-owner
                     * @preventable
                     * @param {Core.data.Model} record Current selected record from the range
                     * @param {String} field The field being changed
                     * @param {*} value The value being set
                     * @returns {Boolean} `false` to prevent changing the current record
                     */
                    me.grid.trigger('beforeCellRangeEdit', {
                        record,
                        field : column.editorField,
                        value
                    }) !== false) {

                    record.set(column.editorField, value);
                }
            }
        }
    }

    // Will finish editing and start editing next row (unless it's a touch device)
    // If addNewAtEnd, it will create a new row and edit that one if currently editing last row
    // NOTE: this method is overridden in the Scheduler CellEdit feature to support revisions.
    // When revisions support comes to Grid, we can merge them together. Changes made in this method
    // should likely be applied to the overridden method too
    async finishAndEditNextRow(event, previous = false) {
        const
            me                 = this,
            { grid }           = me,
            { record, column } = me.editorContext,
            // In unmanaged mode the app owns finalization; relinquish to it instead of finalizing ourselves
            unmanaged          = column.managedCellEditing === false;

        // Guard against re-entrance while awaiting the app's own finish in unmanaged mode
        if (me._awaitingUnmanaged) {
            return;
        }

        let nextCell, result;

        if (unmanaged) {
            me._awaitingUnmanaged = true;
            result                = await me.releaseToApp(me.editorContext);
            me._awaitingUnmanaged = false;
        }
        else {
            result = await me.finishEditing(event);
        }

        if (result) {
            // Might be destroyed during the async operation
            if (me.isDestroyed) {
                return;
            }

            // Finalizing might have been blocked by an invalid value
            if (!me.isEditing) {
                // Move to previous
                if (previous) {
                    nextCell = grid.internalNextPrevRow(false, true, false);
                    if (!nextCell && grid.splitFrom) {
                        const otherGrid = grid.splitFrom;

                        await otherGrid.startEditing({
                            id       : otherGrid.store.last.id,
                            columnId : column.id
                        });
                    }
                }
                // Move to next
                else {
                    // If we are at the last editable cell, optionally add a new row
                    if (record === grid.store.last) {
                        if (grid.features.lockRows?.enabled) {
                            const otherGrid = grid.features.lockRows.subViews[0];

                            if (otherGrid.store.count > 0) {
                                await otherGrid.startEditing({
                                    id       : otherGrid.store.first.id,
                                    columnId : column.id
                                });
                            }
                        }
                        else if (me.addNewAtEnd) {
                            await me.doAddNewAtEnd();
                        }
                    }

                    if (!me.isDestroyed) {
                        nextCell = grid.internalNextPrevRow(true, true);
                    }
                }

                // If we have moved, and we are configure to edit the next cell on Enter key...
                if (nextCell && me.editNextOnEnterPress) {
                    await me.startEditing(nextCell);
                }
            }
        }
        return result;
    }

    // Will finish editing and start editing previous row
    finishAndEditPrevRow(event) {
        return this.finishAndEditNextRow(event, true);
    }

    // After the last editable cell has been finalized, optionally create a new row (addNewAtEnd) or move editing
    // to the lockRows partner grid. Shared by the managed and unmanaged (managedCellEditing:false) TAB paths so
    // both honor addNewAtEnd/lockRows identically at the last cell.
    async handleLastEditableCell() {
        const
            me       = this,
            { grid } = me;

        if (grid.features.lockRows?.enabled) {
            const [otherGrid] = grid.subViews;

            if (otherGrid.store.count > 0) {
                const
                    record   = otherGrid.store.first,
                    cellInfo = {
                        record,
                        id       : record.id,
                        columnId : otherGrid.columns.visibleColumns[0].id
                    };

                if (otherGrid.features.cellEdit.getEditingContext(cellInfo)) {
                    await otherGrid.startEditing(cellInfo);
                }
                else {
                    await otherGrid.startEditing(me.getAdjacentEditableCell(cellInfo));
                }
            }
        }
        else if (me.addNewAtEnd) {
            await me.doAddNewAtEnd();
        }
    }

    // Will finish editing and start editing next cell
    // If addNewAtEnd, it will create a new row and edit that one if currently editing last row
    async finishAndEditNextCell(event, previous = false) {
        const
            me              = this,
            { grid }        = me,
            { focusedCell } = grid;

        if (focusedCell && !me.finishEditingPromise && !me._awaitingUnmanaged) {
            const {
                columnIndex, record, actionTargets
            } = focusedCell;

            // We always prevent default tab key action
            // This is async, so the KeyMap might not know that we handled it.
            event.preventDefault();

            // We are focused inside an actionable cell (there's an editor but no input field)
            // We may need to handle this tab key press differently.
            if (me.tabToFocusables && me.editorContext && !me.editorContext.editor.inputField) {
                // If not at the navigating-towards end of the actionable cell, we allow the tab to
                // move to the next focusable in the actionable cell by returning false.
                // With this the keyMap will not preventDefault the tab key press and navigation will be natural.
                if (DomHelper.getActiveElement(focusedCell.cell) !== (previous ? actionTargets[0] : actionTargets.at(-1))) {
                    return false;
                }
            }

            // In unmanaged mode the app owns finalization; we must not finalize on our own during navigation
            const unmanaged = me.editorContext?.column.managedCellEditing === false;

            let cellInfo           = me.getAdjacentEditableCell(focusedCell, !previous),
                finalizationResult = true;

            if (unmanaged) {
                // Relinquish to the app's finish authority and wait for it. Runs before the next-cell
                // re-grab so the target is resolved against post-finalize state.
                me._awaitingUnmanaged = true;
                finalizationResult    = await me.releaseToApp(me.editorContext);
                me._awaitingUnmanaged = false;

                // Vetoed/aborted app finish, or destroyed -> abandon the navigation
                if (me.isDestroyed || !finalizationResult) {
                    return;
                }

                // At the last editable cell, mirror managed navigation: add a new row / hop to the lockRows
                // partner. The current cell was already finalized by the app via releaseToApp above.
                if (!cellInfo && !previous) {
                    await me.handleLastEditableCell();

                    if (me.isDestroyed) {
                        return;
                    }
                }
            }
            else {
                // If we are at the last editable cell, optionally add a new row / hop to the lockRows partner
                if (!cellInfo && !previous) {
                    const currentEditableFinalizationResult = await me.finishEditing(event);

                    if (currentEditableFinalizationResult === true) {
                        await me.handleLastEditableCell();
                    }
                }

                if (me.isEditing) {
                    finalizationResult = await me.finishEditing(event);
                }

                // Editing can have side effects.
                if (me.isDestroyed) {
                    return;
                }
            }

            // Re-grab the next editable cell because finishEditing may have changed the content under here
            cellInfo = me.getAdjacentEditableCell(new GridLocation({
                grid,
                record,
                columnIndex
            }), !previous);

            if (!cellInfo && previous && grid.splitFrom?.features.lockRows && record === grid.store.first) {
                const
                    otherGrid = grid.splitFrom,
                    record    = otherGrid.store.last,
                    column    = otherGrid.columns.visibleColumns[otherGrid.columns.visibleColumns.length - 1],
                    cellInfo  = {
                        record,
                        id       : record.id,
                        columnId : column.id
                    };

                if (otherGrid.features.cellEdit.getEditingContext(cellInfo)) {
                    await otherGrid.startEditing(cellInfo);
                }
                else {
                    await otherGrid.startEditing(me.getAdjacentEditableCell(cellInfo, false));
                }
            }

            if (cellInfo) {
                if (finalizationResult) {
                    // If it is a fake edit, that is we are navigating to a focusable inside a cell...
                    if (cellInfo.target !== cellInfo.cell && me.tabToFocusables) {
                        const actionTargets = grid.findFocusables(cellInfo.cell);

                        // For an actionable cell, we create an editor context with a fake editor.
                        // We maintain our isEditing state, but we don't actually start editing.
                        cellInfo.editor = me.editor = me.getFakeEditor(cellInfo.target);

                        // Focus into the cell at the correct end
                        actionTargets[previous ? actionTargets.length - 1 : 0].focus();
                        me.editorContext = cellInfo;
                    }
                    else {
                        grid.focusCell(cellInfo, {
                            animate : me.focusCellAnimationDuration
                        });
                        if (!(await me.startEditing(cellInfo))) {
                            // if editing a cell was vetoed, move on and try again
                            return me.finishAndEditNextCell(event, previous);
                        }
                    }
                }
                else {
                    // finishing cell editing was not allowed, current editor value is invalid
                }
            }
            // Finished editing last cell of last row, let grid handle
            else if (grid.isNested && grid.owner &&
                !grid.owner.catchFocus?.({ source : grid, navigationDirection : previous ? 'up' : 'down', editing : true })
            ) {
                grid.onTab(event);
            }
        }
    }

    // Used when beginning fake editing of an actionable cell.
    // The Editor is a disposable object. All it needs is the cancelEdit and completeEdit methods.
    getFakeEditor(target) {
        const
            me               = this,
            cancelOrComplete = () => {
                me.editorContext = me.editor = null; return true;
            };

        return {
            element      : target,
            completeEdit : cancelOrComplete,
            cancelEdit   : cancelOrComplete,
            isFinishing  : true
        };
    }

    // Will finish editing and start editing next cell
    finishAndEditPrevCell(event) {
        return this.finishAndEditNextCell(event, true);
    }

    // Runs at pointerdown, before focus leaves the editor and the app's blur handler runs. Remembers whether a
    // click gesture is starting while an unmanaged (managedCellEditing:false) edit is active. If the app's async
    // finishEditing then completes before the click event is processed, onCellClickWhileEditing is already
    // detached (editor hidden), so onCellClick uses this flag to still move editing to the clicked cell. See #13323.
    onElementPointerDown() {
        this._unmanagedPointerNav = this.editorContext?.column.managedCellEditing === false;
    }

    async onCellClick(info) {
        const
            me                     = this,
            wasUnmanagedPointerNav = me._unmanagedPointerNav;

        me._unmanagedPointerNav = false;

        await super.onCellClick(info);

        // A click that began during an unmanaged edit whose app-driven finish has already completed: the
        // in-editing click handler never ran, so honor the click here and move editing to the clicked cell.
        if (wasUnmanagedPointerNav && !me.isEditing && !me.isDestroyed && me.getEditingContext(info.cellSelector)) {
            await me.startEditing(info.cellSelector);
        }
    }

    // Handles autoedit
    async onElementKeyDown(event) {
        const
            me              = this,
            { grid }        = me,
            { focusedCell } = grid;

        // flagging event with handled = true used to signal that other features should probably not care about it
        if (event.handled || !me.autoEdit || me.isEditing || !focusedCell || (focusedCell.isActionable && DomHelper.isEditable(event.target)) || event.ctrlKey) {
            return;
        }

        const
            { key }           = event,
            isDelete          = key === 'Delete' || key === 'Backspace',
            { gridSelection } = isDelete ? me : {},
            isMultiDelete     = me.multiEdit && gridSelection?.length > 1;

        // Any character or space starts editing while autoedit is true
        if ((key.length <= 1 || (isDelete && !isMultiDelete)) && await me.startEditing(focusedCell)) {
            const
                { inputField } = me.editor,
                { input }      = inputField;

            // if editing started with a keypress and the editor has an input field, set its value
            if (input) {
                // Simulate a keydown in an input field by setting input value
                // plus running our internal processing of that event
                inputField.internalOnKeyEvent(event);

                if (!event.defaultPrevented) {
                    input.value = isDelete ? '' : key;
                    inputField.internalOnInput(event);
                }
            }
            event.preventDefault();
        }
        // If deleting while selected multiple rows or cells, the records are changed directly
        else if (isMultiDelete) {
            /**
             * Fires on the owning Grid before deleting a range of selected cell values by pressing <kbd>Backspace</kbd> or <kbd>Delete</kbd>
             * buttons while {@link #config-autoEdit} is set to `true`. Return `false` to prevent editing.
             * @event beforeCellRangeDelete
             * @on-owner
             * @preventable
             * @param {Grid.view.Grid} source Owner grid
             * @param {Array<Grid.util.GridLocation|Core.data.Model>} gridSelection An array of cell selectors or records
             * that will have their values deleted (the records themselves will not get deleted, only visible column
             * values).
             */
            if (grid.trigger('beforeCellRangeDelete', { grid, gridSelection }) !== false) {
                for (const selected of gridSelection) {
                    if (selected.isModel) {
                        grid.columns.visibleColumns.forEach(col => {
                            if (col.canEdit(selected)) {
                                selected.set(col.editorField, null);
                            }
                        });
                    }
                    else if (selected.column.canEdit(selected.record)) {
                        selected.record.set(selected.column.editorField, null);
                    }
                }
            }
        }
    }

    // Prevents keys which the Grid handles from bubbling to the grid while editing
    onEditorKeydown(event) {
        const { key } = event;
        // Safari could trigger a keydown event when using its native autocomplete. https://github.com/bryntum/bryntum/issues/9111
        if (key && key.length !== 1 && this.grid.matchKeyMapEntry(event) && !this.grid.matchKeyMapEntry(event, this.keyMap)) {
            // Don't allow browser key commands such as PAGE-UP, PAGE-DOWN to continue.
            if (!key.startsWith('Arrow') && key !== 'Backspace' && key !== 'End' && key !== 'Home') {
                event.preventDefault();
            }
            event.handled = true;
            event.stopPropagation();
            return false;
        }
        // Enter key inside a rich text editor should mean a new line
        if (key === 'Enter' && event.target.isContentEditable) {
            event.handled = true;
            event.stopPropagation();
        }
    }

    /**
     * Cancel editing on widget focusout
     * @private
     */
    async onEditorFocusOut(event) {
        const
            me                  = this,
            {
                grid,
                editor,
                editorContext
            }                   = me,
            toCell              = new GridLocation(event.relatedTarget),
            isEditableCellClick = (toCell.grid === grid) && me.getEditingContext(toCell);

        // If the editor is not losing focus as a result of its tidying up process
        // And focus is moving to outside of the editor, then explicitly terminate.
        if (editorContext && !editor.isFinishing && editor.owns(event._target)) {
            // If configured to cancel on blur, or the context no longer owns a record, cancel the edit
            if (me.blurAction === 'cancel' || !grid.store.includes(editorContext.record)) {
                me.cancelEditing(undefined, event);
            }
            // If not already in the middle of editing finalization (that could be async)
            // and it's not a onCellClickWhileEditing situation, finish the edit.
            else if (!me.finishEditingPromise && (me.triggerEvent === 'cellclick' || (me.triggerEvent !== 'cellclick' && !isEditableCellClick))) {
                await me.finishEditing(event);
            }
        }
    }

    onEditorFocusIn(event) {
        const widget = event.toWidget;

        if (widget === this.editor.inputField) {
            if (this.autoSelect && widget.selectAll && !widget.readOnly && !widget.disabled) {
                widget.selectAll();
            }
        }
    }

    /**
     * Cancel edit on touch outside of grid for mobile Safari (focusout not triggering unless you touch something focusable)
     * @private
     */
    async onTapOut({ domEvent }) {
        const
            me         = this,
            { target } = domEvent;

        // Only "tap out" if were not clicking an element with a _shadowRoot
        if (!target._shadowRoot && !me.editor.owns(target) &&
            (!me.grid.bodyContainer.contains(target) || domEvent.button)) {
            const
                validateTapOut = me.resolveCallback(me.validateTapOut, me, false),
                blurAction     = validateTapOut?.handler.call(validateTapOut.thisObj, domEvent, me.editorContext) || me.blurAction;

            me.editingStoppedByTapOutside = true;
            if (blurAction === 'cancel') {
                me.cancelEditing(undefined, domEvent);
            }
            else {
                await me.finishEditing(domEvent);
            }
            delete me.editingStoppedByTapOutside;
        }
    }

    /**
     * Finish editing if clicking below rows (only applies when grid is higher than rows).
     * Also finish if event target is the subgrid which can happen if the pointer is moved during mouse down.
     * @private
     * @category Internal event handling
     */
    async onElementClick(event) {
        // Clicking below the rows / into a subgrid (e.g. the Gantt timeline) finalizes the edit - but in
        // unmanaged mode the app owns finalization, so defer to it (leave the editor open) rather than
        // finishing here. See #13323 (clicking the right-side view must not close an unmanaged editor).
        if (event.target.matches('.b-grid-body-container, .b-grid-sub-grid') && this.editorContext &&
            this.editorContext.column.managedCellEditing !== false) {
            await this.finishEditing(event);
        }
    }

    //endregion
}

CellEdit.initClass();
