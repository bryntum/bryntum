import { DataGenerator } from '@bryntum/core-community';
import { type BryntumGridProps } from '@bryntum/grid-vue-community';

export const gridProps : BryntumGridProps = {
    columns : [
        {
            type   : 'column',
            text   : 'Name',
            field  : 'name',
            flex   : 2,
            editor : {
                type     : 'textfield',
                required : true
            }
        }, {
            type  : 'number',
            text  : 'Age',
            field : 'age',
            width : 100
        }, {
            type  : 'column',
            text  : 'City',
            field : 'city',
            flex  : 1
        }, {
            type  : 'column',
            text  : 'Food',
            field : 'food',
            flex  : 1
        },

    ],

    data : DataGenerator.generateData(50)
};
