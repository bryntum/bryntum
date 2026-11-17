import { useRef } from 'react';
import { BryntumDemoHeader } from '@bryntum/core-react-community';
import { BryntumCalendar, BryntumCalendarProjectModel } from '@bryntum/calendar-react-community';
import { calendarProps, projectProps } from './DemoConfig';
import './App.scss';

const App = () => {
    const projectRef = useRef<BryntumCalendarProjectModel>(null);

    return (
        <>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader />
            <BryntumCalendarProjectModel
                ref={projectRef}
                {...projectProps}
            />
            <BryntumCalendar
                {...calendarProps}
                project={projectRef}
            />
        </>
    );
};

export default App;
