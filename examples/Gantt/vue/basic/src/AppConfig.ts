import { type BryntumGanttProps, type BryntumGanttProjectModelProps } from '@bryntum/gantt-vue-community';

export const projectProps : BryntumGanttProjectModelProps = {
    autoLoad : true,
    loadUrl  : 'data/agentic-workflow-community.json'
};

export const ganttProps : BryntumGanttProps = {
    tier     : 'community',
    tickSize : 45,

    columns : [
        { type : 'name', width : 330 }
    ]
};
