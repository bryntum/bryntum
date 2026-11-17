
import type { BryntumCalendarProjectModelProps, BryntumCalendarProps } from '@bryntum/calendar-react-community';

// The project arranges loading and syncing of data in JSON form from/to a web service
export const projectProps : BryntumCalendarProjectModelProps = {
    loadUrl  : 'data/data.json',
    autoLoad : true

    // Changes can be automatically sent to your server after every change
    // autoSync : true,
    // syncUrl  : './yourEndPoint'
};

export const calendarProps : BryntumCalendarProps = {

    tier : 'community',

    // Start life looking at this date
    date : new Date(2020, 9, 12),

    // 'day', 'week', 'month', etc.
    mode : 'week',

    // Features named by the properties are included.
    // An object is used to configure the feature.
    eventTooltipFeature : {
        // Configuration options are passed on to the tooltip instance
        // We want the tooltip's left edge aligned to the right edge of the event if possible.
        align : 'l-r'
    },


};
