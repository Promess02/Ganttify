import React, { useState } from 'react';
import DataGrid, { Column, textEditor } from 'react-data-grid';
import GanttChart from './GanttChart.tsx'; // Assuming GanttChart is another component
import 'react-data-grid/lib/styles.css';

// Define the Row interface
interface Row {
  idx: number;
  name: string;
  duration: string;
  start_date: string;
  end_date: string;
  worker_id: string;
}

// Define the columns
const columns: readonly Column<Row>[] = [
  { key: 'idx', name: 'Index', editable: true, resizable: true, renderEditCell: textEditor },
  { key: 'name', name: 'Name', editable: true, renderEditCell: textEditor },
  { key: 'duration', name: 'Duration', editable: true, renderEditCell: textEditor },
  { key: 'start_date', name: 'Start Date', editable: true, renderEditCell: textEditor },
  { key: 'end_date', name: 'End Date', editable: true, renderEditCell: textEditor },
  { key: 'worker_id', name: 'Worker Id', editable: true, renderEditCell: textEditor }
];

// Sample rows data
const initialRows: readonly Row[] = [
  { idx: 1, name: 'Task 1', duration: '20', start_date: '2024-08-01', end_date: '2024-08-21', worker_id: '1' },
  { idx: 2, name: 'Task 2', duration: '10', start_date: '2024-08-21', end_date: '2024-08-31', worker_id: '1' },
  ...Array.from({ length: 15 }, (_, idx) => ({
    idx: idx + 3,
    name: '',
    duration: '',
    start_date: '',
    end_date: '',
    worker_id: ''
  }))
];

// Function to get the row key
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
        <div id="spreadsheet-container">{gridElement}</div>
        <div id="gantt-chart-container">
          <GanttChart rows={rows} />
        </div>
      </div>
    </>
  );
};

export default App;
