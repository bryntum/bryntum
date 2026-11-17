import { type Ref } from 'react';
import { StringHelper } from '@bryntum/core-community';
import { GridRowModel } from '@bryntum/grid-community';

import { BryntumNumberFieldProps } from '@bryntum/core-react-community';
import { BryntumGridProps } from '@bryntum/grid-react-community';
import DemoButton from './components/DemoButton';
import DemoEditor from './components/DemoEditor';
import { data } from './appData.tsx';

export class AppRowModel extends GridRowModel {
    declare team : string;
}

export const useGridProps = (
    handleCellButtonClick : Function
) : BryntumGridProps => {
    return {


        columns : [
            {
                type                 : 'column',
                field                : 'team',
                text                 : 'Team<div class="small-text">(inline JSX)</div>',
                htmlEncodeHeaderText : false,
                flex                 : 1,
                // Using simple inline JSX
                renderer             : ({ value }) => (
                    <b>{StringHelper.encodeHtml(value)}</b>
                )
            },
            {
                type  : 'column',
                field : 'city',
                text  : 'City',
                flex  : 1
            },
            {
                type                 : 'column',
                field                : 'original',
                text                 : 'Original<div class="small-text">(React editor)</div>',
                htmlEncodeHeaderText : false,
                align                : 'center',
                width                : 120,
                renderer             : ({ value }) => (value ? 'Yes' : 'No'),
                editor               : (ref : Ref<DemoEditor>) => <DemoEditor ref={ref}/>
            },
            {
                type   : 'column',
                field  : 'division',
                text   : 'Division',
                flex   : 1,
                hidden : true
            },
            {
                type  : 'column',
                field : 'conference',
                text  : 'Conference',
                flex  : 1
            },
            {
                type                 : 'column',
                field                : 'team',
                text                 : 'Cheer<div class="small-text">(React component)</div>',
                htmlEncodeHeaderText : false,
                width                : 200,
                editor               : false,
                // Using custom React component
                renderer             : ({ record }) => (
                    <DemoButton
                        text={StringHelper.xss`Go ${(record as AppRowModel).team}!`}
                        onClick={() => handleCellButtonClick(record)}
                    />
                )
            }
        ],

        data
    };
};

export const rowHeightProps : BryntumNumberFieldProps = {
    label      : 'Row Height:',
    labelWidth : 90,
    flex       : '0 0 180px',
    min        : 40,
    max        : 100,
    step       : 1
};
