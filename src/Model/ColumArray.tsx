import React from 'react';
import {Column, textEditor} from 'react-data-grid';
import DateRenderer from '../Components/DateRenderer.tsx';
import NumericEditor from '../Logic/NumericEditor.tsx'; // Adjust the import path as needed
import {Row} from './Row.tsx';

export const getColumns = (updateRowData: (rowIdx: number, columnKey: string, date: Date) => void): readonly Column<Row>[] => [
  { key: 'idx', name: 'Index', editable: false, resizable: true, width: '55px', renderEditCell: textEditor },
  { key: 'name', name: 'Name', editable: true, width: '145px', renderEditCell: textEditor },
  { key: 'duration', name: 'Days', editable: true, width: '50px', renderEditCell: NumericEditor },
  {
    key: 'start_date', name: 'Start Date', editable: false, width: '110px', renderEditCell: textEditor,
    renderCell: (props) => (
      <DateRenderer
        row={props.row}
        column={props.column}
        updateRowData={updateRowData}
      />
    )
  },
  {
    key: 'end_date', name: 'End date', editable: false, width: '110px', renderEditCell: textEditor,
    renderCell: (props) => (
      <DateRenderer
        row={props.row}
        column={props.column}
        updateRowData={updateRowData}
      />
    )
  },
  { key: 'hours', name: 'Hours', editable: true, width: '60px', renderEditCell: NumericEditor},
  { key: 'worker_id', name: 'Worker', editable: false, width: '70px', renderEditCell: textEditor },
  { key: 'parent_idx', name: 'Parent', editable: false, width: '70px', renderEditCell: textEditor },
  { key: 'previous', name: 'Previous', editable: true, width: '90px', renderEditCell: textEditor }
];