import type { BryntumTaskBoardProjectModelProps, BryntumTaskBoardProps } from '@bryntum/taskboard-react-community';

// Project using CrudManager to load data
export const projectProps : BryntumTaskBoardProjectModelProps = {
    // Project is loaded in app code
    // autoLoad : true,
    loadUrl : 'data/data.json'
};

export const taskBoardProps : BryntumTaskBoardProps = {
    // Url for resource avatar images
    resourceImagePath : 'users/',

    // Experimental, transition moving cards using the editor
    useDomTransition : true,

    // Columns to display
    columns : [
        'todo',
        'doing',
        'done'
    ],

    // Field used to pair a task to a column
    columnField : 'status'
};
