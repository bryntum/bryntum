import { FunctionComponent, useCallback, useRef, useState } from 'react';
import { BryntumButton, BryntumDemoHeader, BryntumNumberField } from '@bryntum/core-react-community';
import { BryntumGrid } from '@bryntum/grid-react-community';
import { Model, Store, StringHelper, Toast } from '@bryntum/core-community';
import { Grid, GridListenersTypes } from '@bryntum/grid-community';
import { AppRowModel, rowHeightProps, useGridProps } from './appConfig';
import './App.scss';

const App : FunctionComponent = () => {
    const gridRef = useRef<BryntumGrid>(null);

    const [rowHeight, setRowHeight] = useState(50);

    const [selectedRow, setSelectedRow] = useState<AppRowModel | null>(null);

    const handleAddRow = useCallback(() => {
        const grid  = gridRef.current?.instance as Grid;
        const store = grid.store as Store;
        store.add({
            team     : 'New team',
            division : '?'
        });
    }, []);

    const handleRemoveRow = useCallback(() => selectedRow?.remove?.(), [selectedRow]);

    const handleSelectionChange = useCallback<GridListenersTypes['selectionChange']>(({ selected, mode }) => {
        if (mode === 'row') {
            setSelectedRow(selected.length ? selected[0] as AppRowModel : null);
        }
    }, []);

    const getTeam = useCallback(() => selectedRow?.team ?? 'None', [selectedRow]);

    const handleCellButtonClick = useCallback((record : Model) => {
        Toast.show(StringHelper.xss`Go ${(record as AppRowModel).team}!`);
    }, []);

    const [gridProps] = useState(useGridProps(handleCellButtonClick));

    return (
        <>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader/>
            <div className="demo-app">
                <div className="demo-toolbar align-right">
                    <BryntumNumberField
                        {...rowHeightProps}
                        value={rowHeight}
                        onChange={({ value }) => setRowHeight(value)}
                    />
                    <div className="spacer"></div>
                    <label className="selected-row">
                    Selected team: <span>{StringHelper.encodeHtml(getTeam())}</span>
                    </label>
                    <BryntumButton
                        icon="fa fa-plus"
                        tooltip="Add Team"
                        onClick={handleAddRow}
                    />
                    <BryntumButton
                    // b-custom-xx is used for testing purposes only. You may remove it.
                        cls={`${selectedRow ? 'b-custom-enabled' : 'b-custom-disabled'}`}
                        icon="fa fa-trash"
                        tooltip="Remove Team"
                        disabled={!selectedRow}
                        onClick={handleRemoveRow}
                    />
                </div>
                <BryntumGrid
                    ref={gridRef}
                    {...gridProps}
                    rowHeight={rowHeight}
                    onSelectionChange={handleSelectionChange}
                />
            </div>
        </>
    );
};

export default App;
