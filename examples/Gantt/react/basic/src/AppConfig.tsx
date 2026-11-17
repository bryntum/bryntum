import { BryntumGanttProps } from '@bryntum/gantt-react-community';
import { Gantt, TaskModel } from '@bryntum/gantt-community';
import DemoButton from './components/DemoButton';
import DemoEditor from './components/DemoEditor';

export const useGanttProps = (handleEditClick : (record : TaskModel, grid : Gantt) => void) : BryntumGanttProps => {
    return {
        tier     : 'community',
        tickSize : 45,

        project : {
            autoLoad : true,
            loadUrl  : 'data/agentic-workflow-community.json'
        },

        columns : [
            { type : 'name', width : 250 },
            {
                text                 : 'Edit<div class="small-text">(React component)</div>',
                htmlEncodeHeaderText : false,
                width                : 120,
                editor               : false,
                align                : 'center',
                type                 : 'column',
                // Using custom React component
                renderer             : ({ record, grid }) =>
                    record.isLeaf ? (
                        <DemoButton
                            text={'Edit'}
                            onClick={() => handleEditClick(record as TaskModel, grid as Gantt)}
                        />
                    ) : ''

            },
            {
                field                : 'draggable',
                text                 : 'Draggable<div class="small-text">(React editor)</div>',
                htmlEncodeHeaderText : false,
                width                : 120,
                align                : 'center',
                type                 : 'column',
                editor               : ref => <DemoEditor ref={ref} />,
                renderer             : ({ value }) => (value ? 'Yes' : 'No')
            }
        ]
    };
};
