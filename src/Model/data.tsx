import { Column, textEditor } from 'react-data-grid';
import {Row} from './Row.tsx';

// Define the columns
const columns: readonly Column<Row>[] = [
  { key: 'idx', name: 'Index', editable: true, resizable: true, width: '55px',renderEditCell: textEditor },
  { key: 'name', name: 'Name', editable: true,  width: '130px', renderEditCell: textEditor },
  { key: 'duration', name: 'Duration', editable: true,  width: '78px', renderEditCell: textEditor },
  { key: 'start_date', name: 'Start Date', editable: true,  width: '92px', renderEditCell: textEditor },
  { key: 'end_date', name: 'End date', editable: true,  width: '92px', renderEditCell: textEditor },
  { key: 'hours', name: 'Hours', editable: true,  width: '60px', renderEditCell: textEditor },
  { key: 'worker_id', name: 'Worker Id', editable: true,  width: '85px', renderEditCell: textEditor },
  { key: 'predecessor', name: 'Predecessor', editable: true,  width: '100px', renderEditCell: textEditor }
];

// Sample rows data
// const initialRows: readonly Row[] = [
//   { idx: 1, name: 'Task 1', duration: '20', start_date: '2024-08-01', hours: '15', worker_id: '1' },
//   { idx: 2, name: 'Task 2', duration: '10', start_date: '2024-08-21', hours: '20', worker_id: '1' },
//   { idx: 3, name: 'Task 3', duration: '5', start_date: '2024-09-01', hours: '10', worker_id: '2' },
//   { idx: 4, name: 'Task 4', duration: '15', start_date: '2024-09-10', hours: '25', worker_id: '3' },
//   { idx: 5, name: 'Task 5', duration: '7', start_date: '2024-09-25', hours: '12', worker_id: '2' },
//   { idx: 6, name: 'Task 6', duration: '12', start_date: '2024-10-05', hours: '18', worker_id: '4' },
//   { idx: 7, name: 'Task 7', duration: '8', start_date: '2024-10-20', hours: '14', worker_id: '3' },
//   { idx: 8, name: 'Task 8', duration: '10', start_date: '2024-11-01', hours: '20', worker_id: '1' },
//   { idx: 9, name: 'Task 9', duration: '6', start_date: '2024-11-15', hours: '10', worker_id: '2' },
//   { idx: 10, name: 'Task 10', duration: '9', start_date: '2024-11-25', hours: '16', worker_id: '4' },
//   { idx: 11, name: 'Task 11', duration: '14', start_date: '2024-12-05', hours: '22', worker_id: '3' },
//   { idx: 12, name: 'Task 12', duration: '11', start_date: '2024-12-20', hours: '19', worker_id: '1' },
//   { idx: 13, name: 'Task 13', duration: '13', start_date: '2025-01-01', hours: '21', worker_id: '2' },
//   { idx: 14, name: 'Task 14', duration: '4', start_date: '2025-01-15', hours: '8', worker_id: '4' },
//   { idx: 15, name: 'Task 15', duration: '16', start_date: '2025-01-25', hours: '24', worker_id: '3' },
//   { idx: 16, name: 'Task 16', duration: '18', start_date: '2025-02-10', hours: '28', worker_id: '1' },
//   { idx: 17, name: 'Task 17', duration: '3', start_date: '2025-02-25', hours: '6', worker_id: '2' },
//   { idx: 18, name: 'Task 18', duration: '6', start_date: '2025-02-26', hours: '9', worker_id: '3' },
//   { idx: 19, name: 'Task 19', duration: '7', start_date: '2025-02-27', hours: '34', worker_id: '2' }
// ];

const initialRows: readonly Row[] = [
  { idx: '1', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: ''},
  { idx: '2', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '3', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '4', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '5', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '6', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '7', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '8', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '9', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '10', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '11', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '12', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '13', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '14', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '15', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '16', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '17', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '18', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' },
  { idx: '19', name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' }
];

export {initialRows, columns};