
import ReactDOM from 'react-dom/client';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { AgGridReact } from '@ag-grid-community/react';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { render } from 'react-dom';

import { ModuleRegistry } from '@ag-grid-community/core';
// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule, MasterDetailModule, MenuModule, ColumnsToolPanelModule, RangeSelectionModule]);
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
  const columnDefs = useMemo(() => [
    { field: 'sport', enableRowGroup: true, hide: true, rowGroup: true},
    { field: 'country', enableRowGroup: true, rowGroup: true, hide: true },
    { field: 'athlete', enableRowGroup: true, hide: true },
    { field: 'gold', aggFunc: 'sum' },
    { field: 'silver', aggFunc: 'sum' },
    { field: 'bronze', aggFunc: 'sum' },
    { field: 'total', aggFunc: 'sum' }
], []);

// never changes, so we can use useMemo
const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true
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
   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 1300}}>
           <AgGridReact
                   className="ag-theme-alpine"
                   animateRows="true"
                   columnDefs={columnDefs}
                   defaultColDef={defaultColDef}
                   autoGroupColumnDef={autoGroupColumnDef}
                   rowGroupPanelShow="always"
                   enableRangeSelection="true"
                   rowData={rowData}
                   rowSelection="multiple"
                   groupSelectsChildren="true"
                   suppressRowClickSelection="true">
           </AgGridReact>
       </div>
   );
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App></App>);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App></App>);
