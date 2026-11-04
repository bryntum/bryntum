import DomHelper from '../../Core/helper/DomHelper.js';
import ColumnStore from '../data/ColumnStore.js';
import WidgetColumn from './WidgetColumn.js';
import Checkbox from '../../Core/widget/Checkbox.js';
import Config from '../../Core/Config.js';
import '../../Core/widget/SlideToggle.js';

DomHelper.loadStylesheet('Grid/column/CheckColumn.css');

// import Stylesheet from './CheckColumn.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'CheckColumn');

/**
 * @module Grid/column/CheckColumn
 */

/**
 * A column that displays a checkbox in the cell. The value of the backing field is toggled by the checkbox.
 *
 * Toggling of the checkboxes is disabled if a record is readOnly or if the CellEdit feature is not enabled.
 *
 * This column renders a {@link Core.widget.Checkbox} into each cell, and it is not intended to be changed.
 * If you want to hide certain checkboxes, you can use the {@link #config-renderer} method to access the checkbox widget
 * as it is being rendered.
 *
 * <div class="note">
 * It is <strong>mandatory</strong> to configure this column with a {@link #config-field} (except when this column
 * is used as a selection column, then no field should be provided). This is because the checked/unchecked state needs
 * to be backed up in a record since rows are recycled and the state will be lost when a row is reused.
 * </div>
 *
 * ```javascript
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *         {
 *              type: 'check',
 *              field: 'allow',
 *              // In the column renderer, we get access to the record and CheckBox widget
 *              renderer({ record, widgets }) {
 *                  // Hide checkboxes in certain rows
 *                  widgets[0].hidden = record.readOnly;
 *              }
 *         }
 *     ]
 * });
 * ```
 *
 * {@inlineexample Grid/column/CheckColumn.js}
 *
 * ## Useful configs
 *
 * | Config                                        | Description                                          |
 * |-----------------------------------------------|------------------------------------------------------|
 * | {@link #config-field}                         | Data field holding the boolean value                 |
 * | {@link #config-showCheckAll}                  | Show a select-all checkbox in the header             |
 * | {@link #config-checkCls}                      | CSS class for the checkbox                           |
 *
 * ## See also
 *
 * - {@link Grid.column.WidgetColumn} - Parent column that renders widgets
 * - {@link Core.widget.Checkbox} - The checkbox widget rendered in cells
 *
 * @extends Grid/column/WidgetColumn
 * @classtype check
 * @column
 * @tier community
 */
export default class CheckColumn extends WidgetColumn {
    //region Config
    callOnFunctions = true;

    static $name = 'CheckColumn';

    static type = 'check';

    static fields = [
        'checkCls',

        /**
         * The `aria-label` used for the default checkbox widget in this column’s cells.
         * @prp {String} checkAriaLabel
         * @category Accessibility
         */
        {
            name         : 'checkAriaLabel',
            defaultValue : 'L{Checkbox.toggleName}'
        },

        'showCheckAll',
        'onAfterWidgetSetValue',
        'onBeforeWidgetSetValue',
        'callOnFunctions',
        'onBeforeToggle',
        'onToggle',
        'onToggleAll',
        'useSlideToggle'
    ];

    static defaults = {
        align : 'center',

        /**
         * CSS class name to add to checkbox
         * @prp {String}
         * @category Rendering
         */
        checkCls : null,

        /**
         * `true` to show a checkbox in the column header to be able to select/deselect all rows
         * @prp {Boolean}
         */
        showCheckAll : false,

        sortable : true,

        filterable : true,

        /**
         * `true` to display a SlideToggle instead of a Checkbox
         * @config {Boolean}
         */
        useSlideToggle : false,

        /**
         * The minimum column width. If value is a `Number`, then the width is in pixels
         * @prp {Number|String} minWidth
         * @default 30
         * @category Layout
         */
        minWidth : 30
    };

    construct(config, store, ...args) {
        config.localizableProperties = Config.mergeMethods.distinct(config.localizableProperties, ['checkAriaLabel']);

        super.construct(config, store, ...args);

        const me = this;

        me.widgets ??= [{
            type          : me.useSlideToggle ? 'slideToggle' : 'checkbox',
            valueProperty : 'checked'
        }];

        me.widgets[0].cls = me.checkCls;

        Object.assign(me, {
            externalHeaderRenderer         : me.headerRenderer,
            externalOnBeforeWidgetSetValue : me.onBeforeWidgetSetValue,
            externalOnAfterWidgetSetValue  : me.onAfterWidgetSetValue
        });

        me.setData({
            onBeforeWidgetSetValue : me.internalOnBeforeWidgetSetValue,
            onAfterWidgetSetValue  : me.internalOnAfterWidgetSetValue,
            headerRenderer         : me.internalHeaderRenderer
        });

        if (!me.meta.isSelectionColumn) {
            const modelClass = me.grid?.store.modelClass;

            if (!me.field) {
                console.warn('CheckColumn MUST be configured with a field, otherwise the checked state will not be persistent. Widgets are recycled and reused');
            }
            else if (modelClass && typeof me[me.field] !== 'boolean' && !modelClass.fieldMap[me.field] && !me.constructor.suppressNoModelFieldWarning && !config.suppressNoModelFieldWarning) {
                // Adding the field is the documented default, only warn when the ColumnStore opts out of doing so
                if (!me.masterStore?.autoAddField) {
                    console.warn(me.$$name + ' is configured with a field, but this is not part of your Model `fields` collection.');
                }

                modelClass.addField({ name : me.field, type : 'boolean' });
            }
        }

        if (me.showCheckAll) {
            const store = me.grid?.store;

            store.ion({
                change : ({ action, isCollapse, isExpand }) => {
                    if (!(isCollapse || isExpand) && (action === 'add' || action === 'remove' || action === 'dataset')) {
                        me.updateCheckAllState?.(me.allChecked);
                    }
                },
                thisObj : me
            });
        }
    }

    // Called by grid when its read-only state is toggled
    updateReadOnly(readOnly) {
        super.updateReadOnly(readOnly);

        // Also update header checkbox if showCheckAll is enabled
        if (this.headerCheckbox) {
            this.headerCheckbox.readOnly = this.headerCheckboxReadOnly;
        }
    }

    // Header checkbox respects column.readOnly and grid.readOnly (unless it's a selection column)
    get headerCheckboxReadOnly() {
        return this.readOnly || (this.grid?.readOnly && !this.meta?.isSelectionColumn);
    }

    get allChecked() {
        return this.grid?.store.every(r => r[this.field], null, true);
    }

    // Only the selection column keeps its checkbox on group rows, and only when showCheckAllInGroupRows is set
    get groupHeaderReserved() {
        return Boolean(this.meta.isSelectionColumn && this.grid.selectionMode.showCheckAllInGroupRows);
    }

    doDestroy() {
        this.headerCheckbox?.destroy();
        super.doDestroy();
    }

    internalHeaderRenderer({ headerElement, column }) {
        let returnValue;

        headerElement.classList.add('b-check-header');

        if (column.showCheckAll) {
            headerElement.classList.add('b-check-header-with-checkbox');

            if (column.headerCheckbox) {
                headerElement.appendChild(column.headerCheckbox.element);
                // Update readOnly state in case grid.readOnly changed
                column.headerCheckbox.readOnly = column.headerCheckboxReadOnly;
            }
            else {
                column.headerCheckbox = new Checkbox({
                    appendTo          : headerElement,
                    owner             : this.grid,
                    checked           : this.subGrid?.store.count === 0 ? false : column.allChecked,
                    ariaLabel         : 'L{Checkbox.toggleSelection}',
                    readOnly          : column.headerCheckboxReadOnly,
                    internalListeners : {
                        change  : 'onCheckAllChange',
                        thisObj : column
                    }
                });
            }
        }
        else {
            returnValue = column.headerText;
        }

        returnValue = column.externalHeaderRenderer ? column.externalHeaderRenderer.call(this, ...arguments) : returnValue;

        return column.showCheckAll ? undefined : returnValue;
    }

    updateCheckAllState(value) {
        if (this.headerCheckbox) {
            this.headerCheckbox.suspendEvents();
            this.headerCheckbox.checked = value;
            this.headerCheckbox.resumeEvents();
        }
    }

    onCheckAllChange({ checked }) {
        const me = this;

        // If this column is bound to a field, update all records
        if (me.field) {
            const { store } = me.grid;

            store.beginBatch();
            store.forEach(record => me.updateRecord(record, me.field, checked));
            store.endBatch();
        }

        /**
         * Fired when the header checkbox is clicked to toggle its checked status.
         * @event toggleAll
         * @param {Grid.column.CheckColumn} source This Column
         * @param {Boolean} checked The checked status of the header checkbox.
         */
        me.trigger('toggleAll', { checked });
    }

    //endregion

    defaultRenderer(renderData) {
        const
            {
                value,
                isExport,
                record
            }        = renderData,
            { grid } = this,
            result   = super.defaultRenderer(renderData),
            checkbox = renderData.widgets?.[0];

        if (isExport) {
            return result != null ? result : value == null ? '' : value;
        }

        checkbox.readOnly = this.readOnly || ((grid.readOnly || record.readOnly) && !this.meta.isSelectionColumn);

        // In export, we're reusing widgets, therefore we need to clean the `checked` attribute by hand
        if (value) {
            checkbox.input.setAttribute('checked', true);
        }
        else {
            checkbox.input.removeAttribute('checked');
        }

        checkbox.input.setAttribute('aria-label', this.checkAriaLabel);

        return result;
    }

    //region Widget rendering

    onBeforeWidgetRender(widget, event) {
        widget.ion({
            beforeChange : 'onBeforeCheckboxChange',
            change       : 'onCheckboxChange',
            thisObj      : this
        });
    }

    onAfterWidgetDerendered(widget, event) {
        // Remove our listeners from only our outgoing checkbox.
        // Using named listeners removes *all* listeners registered by that name.
        widget.un({
            beforeChange : 'onBeforeCheckboxChange',
            change       : 'onCheckboxChange',
            thisObj      : this
        });
    }

    internalOnBeforeWidgetSetValue(widget, { cellElement }) {
        cellElement.widget = widget;
        widget.record      = widget.cellInfo.record;
        this.externalOnBeforeWidgetSetValue?.(...arguments);
    }

    internalOnAfterWidgetSetValue(widget) {
        this.externalOnAfterWidgetSetValue?.(...arguments);
    }

    //endregion

    //region Events

    onBeforeCheckboxChange({ source, checked, userAction }) {
        const
            me         = this,
            { grid }   = me,
            { record } = source.cellInfo;

        // If we are bound to a data field, ensure we respect cellEdit setting
        if (
            (userAction && me.field && (!grid.features.cellEdit || grid.features.cellEdit.disabled)) ||
            (me.meta.isSelectionColumn && !grid.isSelectable(record) && (!grid.selectionMode.showCheckAllInGroupRows || !record.isGroupHeader) && checked)
        ) {
            return false;
        }

        /**
         * Fired when a cell is clicked to toggle its checked status. Returning `false` will prevent status change.
         * @event beforeToggle
         * @param {Grid.column.Column} source This Column
         * @param {Core.data.Model} record The record for the row containing the cell.
         * @param {Boolean} checked The new checked status of the cell.
         * @preventable
         */
        return me.trigger('beforeToggle', { record, checked });
    }

    async onCheckboxChange({ source, checked, oldValue }) {
        const
            me                      = this,
            { record, cellElement } = source.cellInfo,
            { field }               = me;

        let finalizeResult = true;

        if (field) {
            if (me.finalizeCellEdit && !source.revertingValue) {
                source.element.setAttribute('inert', true);
                finalizeResult = await me.callback(me.finalizeCellEdit, me, [{
                    value  : checked,
                    oldValue,
                    record,
                    column : me,
                    cell   : cellElement
                }]);
                source.element.removeAttribute('inert');
            }

            if (me.isDestroyed) {
                return;
            }

            if (finalizeResult !== false) {
                me.updateRecord(record, field, checked);

                // Keep the widget as a mirror of record[field]. If the value did not change (a store
                // `beforeUpdate` listener returned false), revert the Checkbox and return early (No need
                // to toggle or to checkAllState as nothing actually changed).
                if (!source.revertingValue && record[field] !== checked) {
                    source.revertingValue = true;
                    source.checked = oldValue;
                    source.revertingValue = false;
                    return;
                }

                // Keep header checkbox in sync with reality.
                if (checked) {
                    // We check whether *all* records in the store are checked including filtered out ones.
                    me.updateCheckAllState(me.allChecked);
                }
                else {
                    me.updateCheckAllState(false);
                }
            }
            else {
                source.revertingValue = true;
                source.checked = oldValue;
                source.revertingValue = false;
            }
        }

        if (finalizeResult !== false) {
            /**
             * Fired when a cell is clicked to toggle its checked status.
             * @event toggle
             * @param {Grid.column.Column} source This Column
             * @param {Core.data.Model} record The record for the row containing the cell.
             * @param {Boolean} checked The new checked status of the cell.
             */
            me.trigger('toggle', { record, checked, checkbox : source });
        }
    }

    updateRecord(record, field, checked) {
        record.setValue(field, checked);
    }

    //endregion

    onCellKeyDown({ event, cellElement, record }) {
        // SPACE key toggles the checkbox but only when focus is on the *cell*.
        // Allow the checkbox UI to process key events itself.
        if (event.key === ' ') {
            const
                { target } = event,
                checkbox   = cellElement.widget;

            // Enforce read only and disabled rules before we programatically toggle the checkbox
            if (target.matches('.b-grid-cell') && !(record?.readOnly || checkbox.disabled || checkbox.readOnly)) {
                checkbox?.toggle();

                // Prevent native browser scrolling
                event.preventDefault();

                // KeyMap and other features (like context menu) must not process this.
                event.handled = true;
            }
        }
    }

    // This function is not meant to be called by any code other than Base#getCurrentConfig().
    // It extracts the current configs (fields) for the column, with special handling for the hooks
    getCurrentConfig(options) {
        const result = super.getCurrentConfig(options);

        delete result.onBeforeWidgetSetValue;
        delete result.onAfterWidgetSetValue;

        if (this.externalOnBeforeWidgetSetValue) {
            result.onBeforeWidgetSetValue = this.externalOnBeforeWidgetSetValue;
        }

        if (this.externalOnAfterWidgetSetValue) {
            result.onAfterWidgetSetValue = this.externalOnAfterWidgetSetValue;
        }

        return result;
    }
}

ColumnStore.registerColumnType(CheckColumn, true);
