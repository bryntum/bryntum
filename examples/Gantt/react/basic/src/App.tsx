import { FunctionComponent, useState } from 'react';
import { BryntumDemoHeader } from '@bryntum/core-react-community';
import { BryntumGantt } from '@bryntum/gantt-react-community';
import { useGanttProps } from './AppConfig.tsx';
import './App.scss';
import { Gantt, TaskModel } from '@bryntum/gantt-community';

const App: FunctionComponent = () => {
    const handleEditClick = (record : TaskModel, grid : Gantt) => {
        grid.editTask(record);
    };

    const [ganttProps] = useState(useGanttProps(handleEditClick));
    return (
        <>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader />
            <BryntumGantt {...ganttProps} />
        </>
    );
};

export default App;
