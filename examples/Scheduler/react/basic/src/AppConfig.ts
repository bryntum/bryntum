import { AppEventModel } from './AppEventModel';
import { BryntumSchedulerProps } from '@bryntum/scheduler-react-community';

export const schedulerProps: BryntumSchedulerProps = {
    resourceImages : {
        path      : 'users/',
        extension : '.png'
    },

    startDate : new Date(2018, 1, 7, 8),
    endDate   : new Date(2018, 1, 7, 22),

    viewPreset : 'hourAndDay',



    eventEditFeature : true,

    project : {
        eventStore : {
            modelClass : AppEventModel
        },
        loadUrl  : 'data/data.json',
        autoLoad : true
    },

    columns : [
        {
            type      : 'resourceInfo',
            text      : 'Staff',
            showImage : true,
            width     : 150
        },
        {
            text  : 'Type',
            field : 'role',
            width : 130
        }
    ]
};
