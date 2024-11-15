import React from 'react';
import {Column, textEditor} from 'react-data-grid';
import DateRenderer from '../Components/DateRenderer.tsx';
import {Row} from './Row.tsx';

export const getColumns = (updateRowData: (rowIdx: number, columnKey: string, date: Date) => void): readonly Column<Row>[] => [
  { key: 'idx', name: 'Index', editable: true, resizable: true, width: '55px', renderEditCell: textEditor },
  { key: 'name', name: 'Name', editable: true, width: '160px', renderEditCell: textEditor },
  { key: 'duration', name: 'Duration (days)', editable: true, width: '120px', renderEditCell: textEditor },
  {
    key: 'start_date', name: 'Start Date', editable: true, width: '110px', renderEditCell: textEditor,
    renderCell: (props) => (
      <DateRenderer
        row={props.row}
        column={props.column}
        updateRowData={updateRowData}
      />
    )
  },
  {
    key: 'end_date', name: 'End date', editable: true, width: '110px', renderEditCell: textEditor,
    renderCell: (props) => (
      <DateRenderer
        row={props.row}
        column={props.column}
        updateRowData={updateRowData}
      />
    )
  },
  { key: 'hours', name: 'Hours', editable: true, width: '60px', renderEditCell: textEditor},
  { key: 'worker_id', name: 'Worker Id', editable: true, width: '85px', renderEditCell: textEditor },
  { key: 'parent_idx', name: 'Parent task', editable: true, width: '100px', renderEditCell: textEditor }
];