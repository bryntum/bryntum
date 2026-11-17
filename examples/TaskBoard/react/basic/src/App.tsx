import { useEffect, useRef } from 'react';
import { BryntumDemoHeader } from '@bryntum/core-react-community';
import { BryntumTaskBoard, BryntumTaskBoardProjectModel } from '@bryntum/taskboard-react-community';
import { projectProps, taskBoardProps } from './DemoConfig';

import './App.scss';

const App = () => {
    const projectRef = useRef<BryntumTaskBoardProjectModel>(null);

    useEffect(() => {
        // This shows loading data
        // To load data automatically configure the project with `autoLoad : true`
        projectRef.current?.instance.load();
    }, []);

    return (
        <>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader />
            <BryntumTaskBoardProjectModel
                ref={projectRef}
                {...projectProps}
            />
            <BryntumTaskBoard
                {...taskBoardProps}
                project={projectRef}
            />
        </>
    );
};

export default App;
