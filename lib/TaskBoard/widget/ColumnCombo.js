import ColorBoxCombo from './base/ColorBoxCombo.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Store from '../../Core/data/Store.js';

/**
 * @module TaskBoard/widget/ColumnCombo
 */

const excludeCatchAllFn = column => column.id !== '*';

/**
 * A combo populated with the {@link TaskBoard.view.TaskBoard#property-columns} of a {@link TaskBoard.view.TaskBoard}.
 *
 * If a column has a {@link TaskBoard.model.ColumnModel#field-color} defined, that color will be displayed in the combo
 * and its picker.
 *
 * If your app uses a {@link TaskBoard.view.TaskBoard#adding-a-catch-all-column "catch-all" column} (a
 * column with its id set to `*`), it can be excluded from the combo by setting the {@link #config-excludeCatchAll}
 * config to `true`. By using the {@link #config-includeAllColumnValues}, you can make the combo include all column
 * values from the tasks, even those that are not defined in the TaskBoard.
 *
 * Used in {@link TaskBoard.widget.TaskEditor} to pick which column a task belongs to ("Status" below):
 *
 * {@inlineexample TaskBoard/widget/ColumnCombo.js}
 *
 * @extends TaskBoard/widget/base/ColorBoxCombo
 * @classtype columncombo
 * @tier community
 * @inputfield
 */
export default class ColumnCombo extends ColorBoxCombo {
    static $name = 'ColumnCombo';

    static type = 'columncombo';

    static configurable = {
        /**
         * @hideconfigs store, items
         */

        /**
         * The store used by the combo to populate its items, automatically chained of the TaskBoard
         * {@link TaskBoard.view.TaskBoard#property-columns} store.
         *
         * @member {Core.data.Store} store
         * @readonly
         */

        /**
         * By default, the combo will show a configured "catch-all" column (a column with its id set to `*`). In
         * some cases, e.g. when used in a task editor, you may want to exclude that column from the combo.
         * @prp {Boolean}
         * @default false
         */
        excludeCatchAll : null,

        /**
         * Only applies when using a "catch-all" column (a column with its id set to `*`). By default, the combo will
         * include only the columns defined in the TaskBoard. With this config you can opt to include all column values
         * from the tasks, even those that are not defined in the TaskBoard.
         * @prp {Boolean}
         * @default false
         */
        includeAllColumnValues : null
    };

    updateExcludeCatchAll(excludeCatchAll) {
        if (!this.isConfiguring) {
            this.store = {};
        }
    }

    updateIncludeAllColumnValues(includeAllColumnValues) {
        if (!this.isConfiguring) {
            this.store = {};
        }
    }

    changeStore() {
        const
            me            = this,
            { taskBoard } = me;

        me.detachListeners('taskStore');

        // When configured to include all column values, we need to track changes to the task store and re-populate
        // the combo store
        if (me.includeAllColumnValues) {
            taskBoard.project.taskStore.ion({
                name    : 'taskStore',
                change  : () => me.populateDistinctValues(me.store),
                thisObj : me
            });

            const store = new Store();

            me.populateDistinctValues(store);

            return store;
        }

        return taskBoard.columns.chain(me.excludeCatchAll ? excludeCatchAllFn : null);
    }

    populateDistinctValues(store) {
        const
            { project, columnField, columns } = this.taskBoard,
            { modelClass }                    = columns,
            definedColumns                    = this.excludeCatchAll
                ? columns.query(excludeCatchAllFn) : columns.records,
            dataColumns                       = [];

        let unassignedColumn;

        for (const columnValue of project.taskStore.getDistinctValues(columnField)) {
            if (columnValue) {
                // the column is already in the store
                if (!columns.getById(columnValue)) {
                    dataColumns.push(new modelClass({
                        id   : columnValue,
                        text : StringHelper.capitalize(columnValue)
                    }));
                }
            }
            // for empty value add "Unassigned" record (if not added already)
            else if (!unassignedColumn) {
                unassignedColumn = new modelClass({
                    id   : '',
                    text : this.L('L{TaskBoard.unassigned}')
                });

                dataColumns.push(unassignedColumn);
            }
        }

        // sort collected records
        store.data = [...definedColumns, ...dataColumns].sort((a, b) => a.text?.localeCompare(b.text));
    }
}

ColumnCombo.initClass();
