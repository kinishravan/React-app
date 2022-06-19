import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { AgGridReact } from '@ag-grid-community/react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { render } from 'react-dom';
import ReactDOM from 'react-dom/client';

import { ModuleRegistry } from '@ag-grid-community/core';
// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const SortingHeader = memo((props) => {

    const [sortState, setSortState] = useState();

    const onClick = useCallback(() => {
        props.progressSort();
    });

    useEffect(() => {
        const listener = () => {
            if (props.column.isSortAscending()) {
                setSortState('ASC');
            } else if (props.column.isSortDescending()) {
                setSortState('DESC');
            } else {
                setSortState(undefined);
            }
        };

        props.column.addEventListener('sortChanged', listener);

        return () => props.column.removeEventListener('sortChanged', listener);;
    }, []);

    return (
        <span className="my-header" onClick={onClick}>
            <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" className="my-spinner" />
            {props.displayName} {sortState}
        </span>
    );
});

const MyGroupHeader = memo((props) => {

    const [expanded, setExpanded] = useState();
    const { columnGroup } = props;
    const expandable = columnGroup.isExpandable();
    const providedColumnGroup = columnGroup.getProvidedColumnGroup();

    const onExpandClicked = useCallback(() => props.setExpanded(!columnGroup.isExpanded()), []);

    useEffect(() => {
        const listener = () => {
            setExpanded(columnGroup.isExpanded());
        };
        listener();
        providedColumnGroup.addEventListener('expandedChanged', listener);
        return () => providedColumnGroup.removeEventListener('expandedChanged', listener);
    }, []);

    const showExpandJsx = () => (
        <button onClick={onExpandClicked} className="my-expand">
            {expanded ? '<' : '>'}
        </button>
    );

    return (
        <span className="my-group-header">
            <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" className="my-spinner" />
            {props.displayName}
            {expandable && showExpandJsx()}
        </span>
    );
});


const App = () => {
    const [rowData, setRowData] = useState();

    const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true
    }), []);
    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(resp => resp.json())
            .then(data => setRowData(data));
    }, []);
    const columnDefs = useMemo(() => [
        {
            headerName: 'Group A',
            children: [
                { field: 'athlete',headerComponent: SortingHeader },
                { field: 'age' },
            ]
        },
        {
            headerName: 'Group B',
            children: [
                { field: 'country' },
                { field: 'year' },
                { field: 'date'},
                { field: 'sport'}
            ]
        },
    ], []);
   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 1360}}>
           <AgGridReact
                className="ag-theme-alpine"
                animateRows="true"
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={rowData}>
           </AgGridReact>
       </div>
   );
};

// render(<App />, document.getElementById('root'));
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App></App>);
// const container = document.getElementById('root');
// const root = ReactDOM.createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(<GridExample/>);
