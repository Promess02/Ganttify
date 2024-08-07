import React, { useState } from 'react';
import DataGrid from 'react-data-grid';
import GanttChart from './GanttChart.tsx';
import 'react-data-grid/lib/styles.css';
import ResizableContainer from './ResizableContainer.tsx';
import {Row} from "./Row.tsx";
import {columns, initialRows} from './data.tsx';

function rowKeyGetter(row: Row) {
  return row.idx;
}

const App: React.FC = () => {
  const [rows, setRows] = useState<readonly Row[]>(initialRows);

  const gridElement = (
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={rows}
      defaultColumnOptions={{
        resizable: true
      }}
      onRowsChange={setRows}
      className="fill-grid"
    />
  );

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My App</h1>
        </header>
      </div>
      <div id="main-content">
      <ResizableContainer>
        <div id="spreadsheet-container">{gridElement}</div>
        <div id="gantt-chart-container">
          <GanttChart rows={rows} />
        </div>
      </ResizableContainer>
      </div>
    </>
  );
};

export default App;