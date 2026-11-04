import DomHelper from '../../../Core/helper/DomHelper.js';
import Delayable from '../../../Core/mixin/Delayable.js';
import GridFeature from '../GridFeature.js';

/**
 * @module Grid/feature/base/GridEditBase
 */

/**
 * Base for features, which edit the grid.
 *
 * @abstract
 * @mixes Core/mixin/Delayable
 * @extends Grid/feature/GridFeature
 */
export default class GridEditBase extends Delayable(GridFeature) {
    static $name = 'GridEditBase';

    static name = 'GridEditBase';

    static get pluginConfig() {
        return {
            assign : ['startEditing', 'finishEditing', 'cancelEditing'],
            before : ['onElementKeyDown', 'onElementPointerUp'],
            after  : ['onElementClick', 'bindStore']
        };
    }

    static configurable = {
        /**
         * By default, while editing, clicking on a grid cell outside the editor will commence editing for the clicked
         * cell context.
         *
         * Set to `false` to stop editing when clicking another cell while editing.
         * @config {Boolean}
         * @default
         */
        continueEditingOnCellClick : true,

        /**
         * Set to `true` to start editing when user starts typing text on a focused cell (as in Excel)
         * @prp {Boolean}
         * @default false
         */
        autoEdit : null,

        /**
         * The name of the grid event that will trigger cell editing. Defaults to
         * {@link Grid.view.mixin.GridElementEvents#event-cellDblClick celldblclick} but can be changed to any other event,
         * such as {@link Grid.view.mixin.GridElementEvents#event-cellClick cellclick}.
         *
         * ```javascript
         * features : {
         *     cellEdit : {
         *         triggerEvent : 'cellclick'
         *     }
         * }
         * ```
         *
         * @config {String}
         * @default
         */
        triggerEvent : 'celldblclick',

        /**
         * A CSS selector for elements that when clicked, should not trigger editing. Useful if you render actionable
         * icons or buttons into a grid cell.
         * @config {String}
         * @default
         */
        ignoreCSSSelector : 'button,.b-icon,.fa,svg,input,.b-widget'
    };

    construct(config) {
        super.construct(config);

        const
            me            = this,
            { client }    = me,
            gridListeners = {
                cellClick : 'onCellClick',
                readOnly  : 'syncEditingReadOnly',
                thisObj   : me
            };

        me.grid = client;

        if (me.triggerEvent !== 'cellclick') {
            gridListeners[me.triggerEvent] = 'onTriggerEditEvent';
        }

        client.ion(gridListeners);

        me.bindStore(client.store);
    }

    doDestroy() {
        // To kill timeouts
        this.grid.columns.allRecords.forEach(column => {
            column._cellEditor?.destroy();
        });

        super.doDestroy();
    }

    doDisable(disable) {
        if (disable && !this.isConfiguring) {
            this.cancelEditing(true);
        }

        super.doDisable(disable);
    }

    set disabled(disabled) {
        super.disabled = disabled;
    }

    get disabled() {
        const { grid } = this;

        return Boolean(super.disabled || grid.disabled || grid.readOnly);
    }

    // region Editing

    /**
     * Is editing currently active?
     * @member {Boolean}
     * @readonly
     */
    get isEditing() {
        return Boolean(this.editorContext);
    }

    /**
     * Returns the record currently being edited, or `null`
     * @member {Core.data.Model}
     * @readonly
     */
    get activeRecord() {
        return this.editorContext?.record || null;
    }

    /**
     * Event handler added when editing is active called when user clicks a cell in the grid during editing.
     * It finishes editing and moves editor to the selected cell instead.
     * @private
     * @category Internal event handling
     */
    async onCellClickWhileEditing({ event, cellSelector }) {
        const
            me        = this,
            // In unmanaged mode the app owns finalization - the framework must not finish on its own
            unmanaged = me.editorContext?.column?.managedCellEditing === false;

        // React cell editor is configured with `allowMouseEvents=true` to prevent editor from swallowing mouse events
        // We ignore these events from editor here to not prevent editing
        if (event.target.closest('.b-editor')) {
            return;
        }

        // Managed only - in unmanaged mode the app owns finalization, so don't finish here on touch / an ignored
        // target; fall through to the shared handling (which routes an editable-cell tap through startEditing).
        if (!unmanaged && (DomHelper.isTouchEvent || event.target.matches(me.ignoreCSSSelector))) {
            await me.finishEditing();
            return;
        }

        // Ignore clicks if async finalization is running (managed only). In unmanaged mode the click must
        // route to startEditing, which relinquishes to the app and awaits its in-flight finish.
        if (!unmanaged && me.finishEditingPromise) {
            return;
        }

        // Ignore clicks in the editor.
        if (me.editorContext && !me.editorContext.editor.owns(event.target)) {
            if (me.getEditingContext(cellSelector)) {
                if (me.isRowEdit) {
                    if (me.continueEditingOnCellClick) {
                        await me.startEditing(cellSelector);
                    }
                    else {
                        me.cancelEditing();
                    }
                }
                // Unmanaged: hand off to startEditing which relinquishes to the app and reopens the target.
                else if (unmanaged) {
                    if (me.continueEditingOnCellClick) {
                        await me.startEditing(cellSelector);
                    }
                }
                // Attempt to finish the current edit.
                // Will return false if the field is invalid.
                else if (await me.finishEditing()) {
                    if (me.continueEditingOnCellClick) {
                        await me.startEditing(cellSelector);
                    }
                }
                // Previous edit was invalid, return to it.
                else {
                    me.grid.focusCell(me.editorContext);
                    me.editor.focus();
                }
            }
            // Non-editable clicked cell: unmanaged defers to the app, managed finishes here.
            else if (!unmanaged) {
                await me.finishEditing();
            }
        }
    }

    /**
     * Starts editing if user taps selected cell again on touch device. Chained function called when user clicks a cell.
     * @private
     * @category Internal event handling
     */
    async onCellClick({ cellSelector, target, event, column }) {
        const
            me              = this,
            { focusedCell } = me.client;

        if (target.closest('.b-tree-expander')) {
            return false;
        }
        else if (DomHelper.isTouchEvent &&
            me._lastCellClicked === focusedCell?.cell &&
            event.timeStamp - me.touchEditDelay > me._lastCellClickedTime &&
            !me.isEditing
        ) {
            await me.startEditing(cellSelector);
        }
        else if (this.triggerEvent === 'cellclick') {
            await me.onTriggerEditEvent(...arguments);
        }

        me._lastCellClicked     = focusedCell?.cell;
        me._lastCellClickedTime = event.timeStamp;
    }

    // onElementPointerUp should be used to cancel editing before toggleCollapse handled
    // otherwise data collisions may be happened
    onElementPointerUp(event) {
        if (event.target.closest('.b-tree-expander')) {
            this.cancelEditing(undefined, event);
        }
    }

    /**
     * Called when the user triggers the edit action in {@link #config-triggerEvent} config. Starts editing.
     * @private
     * @category Internal event handling
     */
    async onTriggerEditEvent({ cellSelector, target, event, column }) {
        const { editorContext, client } = this;

        if (column.preventCellEditViaMouse || target.closest('.b-tree-expander') || (DomHelper.isTouchEvent && event.type === 'dblclick')) {
            return;
        }

        // Should not start editing if cellMenu configured to be shown on event
        if (event && client.features.cellMenu?.triggerEvent === event.type) {
            return;
        }

        if (editorContext) {
            // Already editing the target cell -> no-op.
            if (editorContext.equals(this.grid.normalizeCellContext(cellSelector))) {
                return;
            }
            // Managed: finish here and abort if it cannot. Unmanaged: the app owns finalization, so defer to
            // startEditing (which relinquishes to the app and awaits its finish) instead of finishing here. #13323
            if (editorContext.column?.managedCellEditing !== false && !(await this.finishEditing())) {
                return;
            }
        }

        this._editTriggeredEvent = event;

        await this.startEditing(cellSelector);
    }

    /**
     * Update the input field if underlying data changes during edit.
     * @private
     * @category Internal event handling
     */
    onStoreUpdate({ changes, record }) {
        const { editorContext } = this;

        if (editorContext?.editor.isVisible) {
            if (record === editorContext.record && (changes.readOnly || !editorContext.editor.dataField || editorContext.editor.dataField in changes)) {
                editorContext.editor.refreshEdit();
            }
        }
    }

    onStoreRemove({ changes, records }) {
        const { editorContext } = this;

        if (editorContext?.editor.isVisible && records.includes(editorContext.editor.record)) {
            this.cancelEditing();
        }
    }

    // endregion
}
