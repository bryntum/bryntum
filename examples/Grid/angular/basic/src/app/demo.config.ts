import { DataGenerator } from '@bryntum/core-community';
import { BryntumGridProps } from '@bryntum/grid-angular-community';

export const gridProps = {

    columns : [
        {
            text   : 'Name',
            field  : 'name',
            flex   : 2,
            editor : {
                type     : 'textfield',
                required : true
            }
        }, {
            text  : 'Age',
            field : 'age',
            width : 100,
            type  : 'number'
        }, {
            text  : 'City',
            field : 'city',
            flex  : 1
        }, {
            text  : 'Food',
            field : 'food',
            flex  : 1
        },

    ],

    data : DataGenerator.generateData(50)
} satisfies BryntumGridProps;
