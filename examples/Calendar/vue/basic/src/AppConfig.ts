import { type BryntumCalendarProps } from '@bryntum/calendar-vue-community';

export const calendarProps : BryntumCalendarProps = {
    // Start life looking at this date
    date : new Date(2024, 7, 11),

    // The project arranges loading and syncing of data in JSON form from/to a web service
    project : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },

    // Features named by the properties are included.
    // An object is used to configure the feature.
    eventTooltipFeature : {
        // Configuration options are passed on to the tooltip instance
        // We want the tooltip's left edge aligned to the right edge of the event if possible.
        align : 'l-r'
    }
};
