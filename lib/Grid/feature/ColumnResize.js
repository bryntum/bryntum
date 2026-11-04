import GridFeature from './GridFeature.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ResizeHelper from '../../Core/helper/ResizeHelper.js';
import Widget from '../../Core/widget/Widget.js';

DomHelper.loadStylesheet('Grid/feature/ColumnResize.css');

// import Stylesheet from './ColumnResize.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'ColumnResize');

/**
 * @module Grid/feature/ColumnResize
 */

/**
 * Enables user to resize columns by dragging a handle on the right hand side of the header. A drag handle
 * appears when hovering near the right edge of a column header. Dragging it adjusts the column width, respecting
 * any {@link Grid.column.Column#config-minWidth} or {@link Grid.column.Column#config-maxWidth} constraints.
 *
 * For a keyboard-accessible alternative to dragging, this feature also adds a **Resize column** item to the column
 * header menu. It opens a dialog where the exact column width can be typed in, or a **Fit to data** checkbox can be
 * ticked to size the column to its content.
 *
 * To get notified about column resize, listen to the `change` event on the
 * {@link Grid.data.ColumnStore columns} store.
 *
 * This feature is <strong>enabled</strong> by default.
 *
 * {@inlineexample Grid/feature/ColumnResize.js}
 *
 * ## See also
 *
 * - {@link Grid.feature.ColumnAutoWidth} - Auto-size columns to content
 * - {@link Grid.column.Column#config-minWidth} - Minimum column width
 *
 * @demo Grid/columns
 * @extends Grid/feature/GridFeature
 * @classtype columnResize
 * @feature
 * @tier community
 */
export default class ColumnResize extends GridFeature {

    static $name =  'ColumnResize';

    static tier = 'community';

    static type = 'columnResize';

    static defaultEnabled = true;
    static configurable = {
        /**
         * Resize all cells below a resizing header during dragging.
         * `'auto'` means `true` on non-mobile platforms.
         * @config {'auto'|Boolean}
         * @default
         */
        liveResize : 'auto',

        /**
         * The {@link Core.helper.ResizeHelper} that drives header drag-resizing.
         * @prp {Core.helper.ResizeHelper}
         * @accepts {ResizeHelperConfig}
         * @private
         */
        resizer : {
            $config : 'nullify',
            value   : {
                name              : 'columnResize',
                targetSelector    : '.b-grid-header',
                handleSelector    : '.b-grid-header-resize-handle',
                constrainToParent : false
            }
        },

        /**
         * The {@link Core.widget.Popup} shown by the "Resize column" header menu item, allowing the column width to be
         * set from the keyboard. Created lazily on first use and destroyed automatically with the feature.
         *
         * The column-specific parts (title, and the width field's `value`/`min`/`max`) are applied each time the dialog
         * is shown, see {@link #function-showResizeDialog}.
         * @prp {Core.widget.Popup}
         * @accepts {PopupConfig}
         */
        resizeDialog : {
            $config : ['lazy', 'nullify'],
            value   : {
                type        : 'popup',
                cls         : 'b-column-resize-dialog',
                autoShow    : false,
                centered    : true,
                modal       : true,
                closable    : true,
                closeAction : 'hide',
                minWidth    : '20em',
                items       : {
                    widthField : {
                        type  : 'numberfield',
                        cls   : 'b-column-resize-width-field',
                        label : 'L{ColumnResize.width}'
                    },
                    fitField : {
                        type     : 'checkbox',
                        cls      : 'b-column-resize-fit-field',
                        // When checked, the column is sized to its content and the width field is ignored
                        text     : 'L{ColumnResize.fitToData}',
                        onChange : 'up.onFitToDataToggle'
                    }
                },
                bbar : [
                    {
                        ref     : 'cancelButton',
                        cls     : 'b-column-resize-cancel-button',
                        text    : 'L{Object.Cancel}',
                        onClick : 'up.onCancelResize'
                    },
                    {
                        ref       : 'okButton',
                        cls       : 'b-column-resize-ok-button',
                        rendition : 'filled',
                        text      : 'L{Object.Ok}',
                        onClick   : 'up.onConfirmResize'
                    }
                ],
                keyMap : {
                    // ENTER activates the OK button from anywhere in the dialog (including the width field)
                    Enter : 'up.onConfirmResize'
                },
                // Return focus to the column header for keyboard accessibility
                onHide : 'up.onResizeDialogHide'
            }
        }
    };

    //region Init

    // Both resizer and resizeDialog are `nullify` configs, created in their changers and destroyed automatically with
    // the feature - so no `construct` or `doDestroy` override is needed.
    changeResizer(resizer, oldResizer) {
        const
            me         = this,
            { client } = me;

        oldResizer?.destroy();

        // Merge instance-specific settings with the config value via the factory (mergeConfigs handles a
        // prototype-chained config value, which the spread operator would not)
        return resizer && ResizeHelper.new({
            outerElement      : client.element,
            rtlSource         : client,
            internalListeners : {
                beforeResizeStart : me.onBeforeResizeStart,
                resizeStart       : me.onResizeStart,
                resizing          : me.onResizing,
                resize            : me.onResize,
                cancel            : me.onCancel,
                thisObj           : me
            }
        }, resizer);
    }

    static get pluginConfig() {
        return {
            after : ['populateHeaderMenu']
        };
    }

    //endregion

    //region Menu & dialog

    changeResizeDialog(config, oldDialog) {
        // The config value holds the popup shell (type : 'popup'), so Popup itself need not be imported.
        // Owning the dialog with the feature puts the feature in the `up.` handler resolution chain and lets
        // focus reversion delegate to the grid (see InstancePlugin#getFocusRevertTarget).
        return Widget.reconfigure(oldDialog, config, {
            owner    : this,
            defaults : {
                owner       : this,
                rootElement : this.client.rootElement
            }
        });
    }

    populateHeaderMenu({ items, column }) {
        // Provides a keyboard-accessible alternative to dragging the resize handle
        if (!this.disabled && column.resizable !== false && column.isLeaf) {
            items.resizeColumn = {
                weight : 240,
                icon   : 'b-fw-icon b-icon-resize-horizontal',
                text   : this.L('L{ColumnResize.resizeColumn}'),
                onItem : () => this.showResizeDialog(column)
            };
        }
    }

    /**
     * Shows the {@link #config-resizeDialog resize dialog} for the passed column, allowing its width to be set from
     * the keyboard.
     * @param {Grid.column.Column} column The column to resize
     * @returns {Core.widget.Popup} The resize dialog, or `false` if the column cannot be resized
     */
    showResizeDialog(column) {
        const me = this;

        if (!column || column.resizable === false || me.disabled) {
            // return false to let keyMap know that we didn't handle this event
            return false;
        }

        me._resizingColumn = column;

        const
            dialog                   = me.resizeDialog,
            { widthField, fitField } = dialog.widgetMap,
            columnText               = column.htmlEncodeHeaderText ? column.text : DomHelper.stripTags(column.text);

        dialog.title = columnText ? `${me.L('L{ColumnResize.resizeColumn}')} — ${columnText}` : me.L('L{ColumnResize.resizeColumn}');

        // Reset the reused dialog to width-entry mode
        fitField.checked = false;
        fitField.hidden = !column.fitMode || column.fitMode === 'none';
        widthField.disabled = false;

        // Constrain the input to the column's own min/max when those are present. These may be any CSS size value,
        // so measure them to pixels. `undefined` (not `null`) means "no constraint" to a Field.
        widthField.min = column.minWidth == null ? undefined : column.measureSize(column.minWidth);
        widthField.max = column.maxWidth == null ? undefined : column.measureSize(column.maxWidth);
        widthField.value = Math.round(column.element.offsetWidth);

        dialog.show();
        widthField.focus();

        return dialog;
    }

    // Checking "Fit to data" makes the explicit width irrelevant, so disable the width field
    onFitToDataToggle({ value }) {
        this.resizeDialog.widgetMap.widthField.disabled = value;
    }

    onConfirmResize() {
        const
            me                       = this,
            column                   = me._resizingColumn,
            { widthField, fitField } = me.resizeDialog.widgetMap;

        if (!column) {
            return;
        }

        // "Fit to data" checked: size the column to its content instead of a fixed width
        if (fitField.checked) {
            me.resizeDialog.hide();
            column.resizeToFitContent();
            return;
        }

        const { value : width } = widthField;

        // Only apply a finite value that satisfies the configured min/max constraints
        if (Number.isFinite(width) && widthField.isValid) {
            column.width = width;
            me.resizeDialog.hide();
        }
        else {
            // Keep the dialog open so an empty/invalid entry can be corrected
            widthField.focus();
        }
    }

    onCancelResize() {
        this.resizeDialog.hide();
    }

    onResizeDialogHide() {
        const
            me       = this,
            column   = me._resizingColumn;

        // Return focus to the column header
        if (column?.element && !me.client.isDestroying) {
            me.client.focusCell({ rowIndex : -1, columnId : column.id });
        }
    }

    //endregion

    changeLiveResize(liveResize) {
        if (liveResize === 'auto') {
            return !BrowserHelper.isMobileSafari;
        }
        return liveResize;
    }

    //region Events

    onBeforeResizeStart({ event, element }) {
        const { client } = this;

        /**
         * This event is fired prior to starting a column resize gesture. The resize is canceled if a listener returns
         * `false`.
         * @on-owner
         * @event beforeColumnResize
         * @param {Grid.view.Grid} source The grid instance
         * @param {Grid.column.Column} column The column
         * @param {Event} domEvent The browser event
         * @preventable
         */
        return !this.disabled && client.trigger('beforeColumnResize', {
            column   : client.columns.getById(element.dataset.columnId),
            domEvent : event
        });
    }

    onResizeStart({ context }) {
        const
            { client, resizer }       = this,
            column                    = context.column = client.columns.getById(context.element.dataset.columnId),
            { allRecords : siblings } = column.subGrid.columns;

        resizer.minWidth = column.minWidth;
        context.subGridBoundary = column.element.getBoundingClientRect()[client.rtl ? 'left' : 'right'];

        client.addCls('b-column-resizing');

        // Unflex all preceding flexed siblings so that they do not change size
        // in response to target column size changes
        siblings.slice(0, siblings.indexOf(column)).forEach(c => {
            c.flex && c.element && c !== column.parent && c.set({
                width : c.element.offsetWidth,
                flex  : ''
            });
        });

        /**
         * This event is fired when a column resize gesture starts.
         * @on-owner
         * @event columnResizeStart
         * @param {Grid.view.Grid} source The grid instance
         * @param {Grid.column.Column} column The column
         * @param {Event} domEvent The browser event
         */
        client.trigger('columnResizeStart', {
            column,
            domEvent : context.event
        });
    }

    /**
     * Handle drag event - resize the column live unless it's a touch gesture
     * @private
     */
    onResizing({ context }) {
        if (context.valid && this.liveResize) {
            const
                { client }         = this,
                { column }         = context,
                { subGrid }        = column,
                { scrollable }     = subGrid,
                { visibleColumns } = subGrid.columns,
                { rtl }            = client;

            let { newWidth } = context;

            // Cells are absolutely positioned and cannot flex to fill width, instead when configured to do so we
            // rely on the headers flexing correctly
            if (client.fillLastColumn && column === visibleColumns.at(-1)) {
                newWidth = column.element.offsetWidth;
            }

            client.resizingColumns = true;
            column.width = newWidth;

            // The horizontal scrollbar must provide instant visual feedback that the content width is changing
            subGrid.refreshFakeScroll();

            // Ensure we scroll with the mouse as it goes outside visible viewport
            if (column === visibleColumns.at(-1) && (rtl ? context.currentX < context.subGridBoundary : context.currentX > context.subGridBoundary)) {
                scrollable.x = scrollable.maxX;
            }
        }
    }

    /**
     * Handle drop event (only used for touch)
     * @fires columnResize
     * @private
     */
    onResize({ context }) {
        const
            { client } = this,
            { column, event } = context;

        client.removeCls('b-column-resizing');

        if (context.valid) {
            if (this.liveResize) {
                client.resizingColumns = false;
                client.afterColumnsResized(column);
            }
            else {
                column.width = context.newWidth;
            }
            /**
             * This event is fired after a resize gesture is completed.
             * @on-owner
             * @event columnResize
             * @param {Grid.view.Grid} source The grid instance
             * @param {Grid.column.Column} column The resized column
             * @param {Event} domEvent The browser event
             */
            client.trigger('columnResize', { column, domEvent : event });
        }
    }

    /**
     * Restore column width on cancel (ESC)
     * @private
     */
    onCancel({ context }) {
        const { client } = this;

        client.removeCls('b-column-resizing');

        context.column.width = context.elementWidth;
        client.resizingColumns = false;
    }

    //endregion
}

ColumnResize.initClass();
