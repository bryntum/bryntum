import { BryntumCalendarProps } from '@bryntum/calendar-angular-community';

/**
 * Application config file
 */

export const calendarProps = {
    // Start life looking at this date
    date : new Date(2020, 9, 12),

    // The project arranges loading and syncing of data in JSON form from/to a web service
    project : {
        loadUrl  : 'assets/data/data.json',
        autoLoad : true
    },

    eventTooltipFeature : {
        // Configuration options are passed on to the tooltip instance
        // We want the tooltip's left edge aligned to the right edge of the event if possible.
        align : 'l-r'
    }
} satisfies BryntumCalendarProps;
