import React from 'react';
import {Column, textEditor} from 'react-data-grid';
import DateRenderer from '../Components/DateRenderer.tsx';
import NumericEditor from '../Logic/NumericEditor.tsx'; // Adjust the import path as needed
import {Row} from './Row.tsx';
import {Worker} from './Worker.tsx';

const renderCellWithBold = (rows: Row[], row: Row, key: keyof Row) => {
  const hasSubtasks = rows.some(r => r.idx.startsWith(`${row.idx}.`));
  return (
    <span style={{ 
      fontWeight: hasSubtasks ? 'bold' : 'normal', 
      color: hasSubtasks ? '#0056b3' : 'inherit', 
      fontSize: hasSubtasks ? '16px' : '14px',
    }}>
      {row[key]}
    </span>
  );
};

const renderWorker = (rows: Row[], workers: Worker[], row: Row ) => {
  const worker = workers.find(w => w.worker_id === row.worker_id);
  const hasSubtasks = rows.some(r => r.idx.startsWith(`${row.idx}.`));
  return worker ? 
  <span style={{ 
    fontWeight: hasSubtasks ? 'bold' : 'normal', 
    color: hasSubtasks ? '#0056b3' : 'inherit', 
    fontSize: hasSubtasks ? '16px' : '14px',
  }}>
    {worker.name + ' ' + worker.surname}
  </span> : '';
}

const isHighlighted = (row: Row, rows: Row[]) => {
  const hasSubtasks = rows.some(r => r.idx.startsWith(`${row.idx}.`));
  return hasSubtasks;
}

export const getColumns = (rows: Row[], view: string, workers: Worker[],updateRowData: (rowIdx: number, columnKey: string, date: Date) => void): readonly Column<Row>[] => [
  { key: 'idx', name: 'Index', editable: false, resizable: true, width: `${view === 'onlyGrid' ? '100px': '55px'}`, renderEditCell: textEditor,
    renderCell: ({ row }) => renderCellWithBold(rows, row, 'idx')},
  { key: 'name', name: 'Name', editable: true, width: `${view === 'onlyGrid' ? '300px': '150px'}`, renderEditCell: textEditor, renderCell: ({ row }) => renderCellWithBold(rows, row, 'name') },
  { key: 'duration', name: `${view === 'onlyGrid' ? 'Duration (days)': 'Days'}`, editable: true, width: `${view === 'onlyGrid' ? '120px': '50px'}`, renderEditCell: NumericEditor, renderCell: ({ row }) => renderCellWithBold(rows, row, 'duration')},
  {
    key: 'start_date', name: 'Start Date', editable: false, width: `${view === 'onlyGrid' ? '150px': '120px'}`, renderEditCell: textEditor,
    renderCell: (props) => (
      <DateRenderer
        row={props.row}
        isHighlighted={isHighlighted(props.row, rows)}
        column={props.column}
        updateRowData={updateRowData}
      />
    )
  },
  {
    key: 'end_date', name: 'End date', editable: false, width: `${view === 'onlyGrid' ? '150px': '120px'}`, renderEditCell: textEditor,
    renderCell: (props) => (
      <DateRenderer
        row={props.row}
        isHighlighted={isHighlighted(props.row, rows)}
        column={props.column}
        updateRowData={updateRowData}
      />
    )
  },
  { key: 'hours', name: 'Hours', editable: true, width: `${view === 'onlyGrid' ? '100px': '60px'}`, renderEditCell: NumericEditor, renderCell: ({ row }) => renderCellWithBold(rows, row, 'hours')},
  { key: 'worker_id', name: 'Worker', editable: false, width: `${view === 'onlyGrid' ? '250px': '160px'}`, renderEditCell: textEditor, renderCell: ({ row }) => renderWorker(rows, workers, row) },
  { key: 'previous', name: 'Previous', editable: true, width: '90px', renderEditCell: textEditor, renderCell: ({ row }) => renderCellWithBold(rows, row, 'previous') },
  ...(view === 'onlyGrid' ? [{ key: 'description', name: 'Description', editable: false, width: '510px', renderEditCell: textEditor, renderCell: ({ row }) => renderCellWithBold(rows, row, 'description') }] : [])
];