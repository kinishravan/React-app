
import ReactDOM from 'react-dom/client';

import React, { useMemo, useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from '@ag-grid-community/react';
import YearFilter from './yearFilter.jsx';
import YearFloatingFilter from './yearFloatingFilter.jsx';
import MyToolPanel from './myToolPanel.jsx';
import MyStatusPanel from './myStatusPanel.jsx';
import MyLoadingOverlay from './myLoadingOverlay.jsx';
import MyNoRowsOverlay from './myNoRowsOverlay.jsx';
import MyTooltip from './myTooltip.jsx';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

import { ModuleRegistry } from '@ag-grid-community/core';
// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnsToolPanelModule, FiltersToolPanelModule, StatusBarModule, MenuModule]);
function MyRenderer(params) {
  return (
      <span className="my-renderer">
          {params.value != null &&
              <React.Fragment>
                  <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" className="my-spinner" />
                  <span class="my-renderer-value">
                      {params.value}
                  </span>
              </React.Fragment>
          }
      </span>
  );
}
const App = () => {
    const gridRef = useRef(null);

    const columnDefs = useMemo(() => [
        { field: 'athlete', tooltipField: 'athlete' },
        { field: 'age', tooltipField: 'athlete' },
        { field: 'country', tooltipField: 'athlete' },
        { field: 'year', filter: YearFilter, floatingFilter: true, floatingFilterComponent: YearFloatingFilter, tooltipField: 'athlete' },
    ], []);

// never changes, so we can use useMemo
const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    tooltipComponent: MyTooltip
}), []);


// never changes, so we can use useMemo
const autoGroupColumnDef = useMemo(() => ({
    cellRendererParams: {
        suppressCount: true,
        checkbox: true
    },
    field: 'athlete',
    width: 300
}), []);

// changes, needs to be state
const [rowData, setRowData] = useState();

// gets called once, no dependencies, loads the grid data
useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then(resp => resp.json())
        .then(data => setRowData(data));
}, []);

const sideBar = useMemo(() => ({
    toolPanels: [
        'columns',
        'filters',
        {
            id: "myToolPanel",
            labelDefault: "My Tool Panel",
            labelKey: "myToolPanel",
            iconKey: "filter",
            toolPanel: MyToolPanel
        }
    ],
    defaultToolPanel: "myToolPanel"
}), []);

const statusBar = useMemo(() => ({
    statusPanels: [
        { key: 'myStatusPanel', statusPanel: MyStatusPanel }
    ]
}), []);

const onCallFilter = useCallback(() => {
    // because Filter could be created Async, we use the callback mechanism in the method
    gridRef.current.api.getFilterInstance('year', filterRef => filterRef.sampleToggleMethod());
});

const onCallToolPanel = useCallback(() => {
    // tool panels are created up front, so no need for async
    const toolPanelRef = gridRef.current.api.getToolPanelInstance('myToolPanel');
    toolPanelRef.sampleToolPanelMethod();
});

const onCallStatusPanel = useCallback(() => {
    // status panels are created up front, so no need for async
    const statusPanelRef = gridRef.current.api.getStatusPanel('myStatusPanel');
    statusPanelRef.sampleStatusPanelMethod();
});

const onBtShowLoading = useCallback(() => gridRef.current.api.showLoadingOverlay());
const onBtShowNoRows = useCallback(() => gridRef.current.api.showNoRowsOverlay());
const onBtHide = useCallback(() => gridRef.current.api.hideOverlay());

   return (
    <div className='top-level'>
    <div className='buttons-bar'>
                <div>
                    <button onClick={onCallFilter}>Toggle Filter</button>
                    <button onClick={onCallToolPanel}>Increment Tool Panel</button>
                    <button onClick={onCallStatusPanel}>Increment Status Panel</button>
                </div>
                <div>
                    <button onClick={onBtShowLoading}>Show Loading Overlay</button>
                    <button onClick={onBtShowNoRows}>Show No Rows Overlay</button>
                    <button onClick={onBtHide}>Hide Overlay</button>
                </div>
            </div>
       <div className="ag-theme-alpine" style={{height: 400, width: 1300}}>
           <AgGridReact
              ref={gridRef}
              sideBar={sideBar}
              statusBar={statusBar}
              className="ag-theme-alpine my-grid"
              animateRows="true"
              loadingOverlayComponent={MyLoadingOverlay}
              noRowsOverlayComponent={MyNoRowsOverlay}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowData={rowData}>
           </AgGridReact>
       </div>
       </div>
   );
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App></App>);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App></App>);
