import React, { useState } from 'react';
import GanttChart from './GanttChart';
import GridComponent from './GridComponent.tsx';

const ParentComponent = () => {
  const [rows, setRows] = useState([
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
  ]);

  const handleGridChange = (updatedRows) => {
    setRows(updatedRows);
  };

  return (
    <div>
      <GridComponent rows={rows} onRowsChange={handleGridChange} />
      <GanttChart rows={rows} />
    </div>
  );
};

export default ParentComponent;