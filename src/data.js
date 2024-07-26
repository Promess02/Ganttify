const columns = [
    { key: 'idx', name: 'Index', editable: true, resizable: true },
    { key: 'name', name: 'Name', editable: true },
    { key: 'duration', name: 'Duration', editable: true },
    { key: 'start_date', name: 'Start Date', editable: true },
    { key: 'end_date', name: 'End Date', editable: true },
    { key: 'worker_id', name: 'Worker Id', editable: true }
  ];
  
  // Sample rows data
  const initialRows = [
    { idx: 1, name: 'Task 1', duration: '2 days', start_date: '2024-11-12', end_date: "2024-11-14", worker_id: '1' },
    { idx: 2, name: 'Task 2', duration: '3 days', start_date: '2024-11-14', end_date: "2024-11-17", worker_id: '1' }
  ];
  