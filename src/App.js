import React from 'react';
import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';
import GanttChart from './GanttChart'; // Assuming GanttChart is another component
import 'react-data-grid/lib/styles.css';


// Column definitions
const columns = [
  { key: 'idx', name: 'Index', editable: true, resizable: true, renderEditCell: textEditor },
  { key: 'name', name: 'Name', editable: true, renderEditCell: textEditor },
  { key: 'duration', name: 'Duration', editable: true, renderEditCell: textEditor },
  { key: 'start_date', name: 'Start Date', editable: true, renderEditCell: textEditor },
  { key: 'end_date', name: 'End Date', editable: true, renderEditCell: textEditor },
  { key: 'worker_id', name: 'Worker Id', editable: true, renderEditCell: textEditor }
];

// Sample rows data
const initialRows = [
  { idx: 1, name: 'Task 1', duration: '2 days', start_date: '2024-11-12', end_date: "2024-11-14", worker_id: '1' },
  { idx: 2, name: 'Task 2', duration: '3 days', start_date: '2024-11-14', end_date: "2024-11-17", worker_id: '1' }
];

class App extends React.Component {
  state = { rows: initialRows };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  render() {
    return (
      <div>
        <DataGrid
          columns={columns}
          rows={this.state.rows}
          rowsCount={this.state.rows.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
        />
        <GanttChart />
      </div>
    );
  }
}

export default App;