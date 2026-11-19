import { type BryntumSchedulerProps } from '@bryntum/scheduler-vue-community';

export const schedulerProps : BryntumSchedulerProps = {

    startDate         : new Date(2024, 0, 1, 6),
    endDate           : new Date(2024, 0, 1, 20),
    viewPreset        : 'hourAndDay',
    rowHeight         : 50,
    barMargin         : 5,
    multiEventSelect  : true,
    resourceImagePath : 'users/',
    columns           : [
        {
            type  : 'column',
            text  : 'Name',
            field : 'name',
            width : 130
        }
    ],
    // The project arranges loading and syncing of data in JSON form from/to a web service
    project : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    }
};
