import { BryntumGanttProps, BryntumGanttProjectModelProps } from '@bryntum/gantt-angular-community';

export const projectProps = {
    autoLoad : true,
    loadUrl  : 'assets/data/agentic-workflow-community.json'
} satisfies BryntumGanttProjectModelProps;

export const ganttProps = {
    tickSize : 45,

    columns : [
        { type : 'name', width : 330 }
    ]
} satisfies BryntumGanttProps;
