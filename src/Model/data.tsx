import {Row} from './Row.tsx';

const initialDate = new Date().toISOString().split('T')[0]

const initialRows: Row[] = [
  { idx: '1', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: ''},
  { idx: '2', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '3', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '4', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '5', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '6', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '7', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '8', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '9', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '10', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '11', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '12', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '13', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '14', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '15', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '16', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '17', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '18', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '19', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '20', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '21', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' },
  { idx: '22', name: '', duration: '', start_date: initialDate, hours: '', worker_id: '', parent_idx: '', end_date: initialDate, previous: '' }
];

export {initialRows};