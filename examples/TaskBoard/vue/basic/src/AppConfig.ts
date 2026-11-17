import type { TaskModel } from '@bryntum/taskboard-community';
import { type BryntumTaskBoardProps } from '@bryntum/taskboard-vue-community';

export const taskBoardProps : BryntumTaskBoardProps = {
    tier              : 'community',
    resourceImagePath : 'users/',

    // Experimental, transition moving cards using the editor
    useDomTransition : true,

    // Columns to display
    columns : ['todo', 'doing', 'done'],

    // Field used to pair a task to a column
    columnField : 'status',

    // Additional content in card headers
    headerItems : {
        prio : {
            type     : 'template',
            template : ({ taskRecord }: { taskRecord: TaskModel }) => `<div class="prio-tag b-colorize ${taskRecord.prio}">${taskRecord.prio}</div>`
        }
    },

    // Project using CrudManager to load data
    project : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    }
};
