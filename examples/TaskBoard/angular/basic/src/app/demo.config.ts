import { type BryntumTaskBoardProps, type BryntumTaskBoardProjectModelProps } from '@bryntum/taskboard-angular-community';

export const projectProps = {
    loadUrl  : 'assets/data/data.json',
    autoLoad : true
} satisfies BryntumTaskBoardProjectModelProps;

export const taskBoardProps = {
    tier              : 'community',
    resourceImagePath : 'assets/users/',

    // Experimental, transition moving cards using the editor
    useDomTransition : true,

    // Columns to display
    columns : ['todo', 'doing', 'done'],

    // Field used to pair a task to a column
    columnField : 'status'

} satisfies BryntumTaskBoardProps;
