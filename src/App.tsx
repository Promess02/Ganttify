import React, { useState } from 'react';
import DataGrid, { CellClickArgs } from 'react-data-grid';
import GanttChart from './Components/GanttChart.tsx';
import 'react-data-grid/lib/styles.css';
import ResizableContainer from './Components/ResizableContainer.tsx';
import MyAppBar from './Components/MyAppBar.tsx'; 
import { Row } from "./Model/Row.tsx";
import { initialRows } from './Model/data.tsx';
import { getColumns } from './Model/ColumArray.tsx';
import { findDepth, rowKeyGetter, findRowIndexByIdx, updateTimeColumns, getParentTaskId, sumParentHours } from './Util/UtilFunctions.tsx';
import { handleAddRow, handleDeleteRow, handleAddSubtasks, handleIndentTask, handleOutdentTask } from './Logic/rowHandlers.tsx';

type SelectedCellState = {
  rowIdx: string;
  rowNumber: number;
  depth: number
};

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<SelectedCellState | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); 

  const handleCellClick = (args: CellClickArgs<Row, unknown>) => {
    setSelectedCell({ rowIdx: `${args.row.idx}`,
       rowNumber: findRowIndexByIdx(rows, args.row.idx),
        depth: findDepth(`${args.row.idx}`)});
  };

  const handleRowsChange = (updatedRows: Row[], { indexes }: { indexes: number[] }) => {
    const index = indexes[0];
    const updatedRow = updatedRows[index];

    if (updatedRow.hours !== rows[index].hours) {
      updatedRows = updateHours(updatedRow.idx, updatedRows);
    }
    const newRows = updateTimeColumns(updatedRows, { indexes });
    setRows(newRows);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const updateRowData = (rowIdx, columnKey, date) => {
    const updatedRows = [...rows];
    let index = findRowIndexByIdx(rows, rowIdx);
    updatedRows[index] = { ...updatedRows[index], [columnKey]: date }; 
    let parentIndex = findRowIndexByIdx(updatedRows, getParentTaskId(rowIdx));
    if (parentIndex !== -1 && columnKey === 'end_date') {
      let parentDateValue = new Date(updatedRows[parentIndex].end_date).getTime();
      let dateValue = new Date(date).getTime();

      if (parentDateValue < dateValue) {
        updatedRows[parentIndex] = { ...updatedRows[parentIndex], end_date: date }; 
      } 
    }

    handleRowsChange(updatedRows, { indexes: [index] });
  };

  const updateHours = (rowIdx, updatedRows) => {
    let parentIndex = findRowIndexByIdx(updatedRows, getParentTaskId(rowIdx));
    if (parentIndex !== -1) {
      updatedRows = sumParentHours(updatedRows, getParentTaskId(rowIdx));
    }

    return updatedRows;
  }

  const gridElement = (
    <DataGrid
      key={refreshKey}
      rowKeyGetter={rowKeyGetter}
      columns={getColumns(updateRowData)}
      rows={rows}
      defaultColumnOptions={{
        resizable: true
      }}
      onRowsChange={handleRowsChange}
      className="fill-grid"
      onCellClick={handleCellClick}
    />
  );
  
  return (
    <>
      <MyAppBar onAddRow={() => handleAddRow(rows,setRows,selectedCell, setSelectedCell)} 
      onDeleteRow={ () => handleDeleteRow(rows,setRows,selectedCell, setSelectedCell)}
       onAddSubtasks={(numSubtasks) => handleAddSubtasks(rows,setRows,selectedCell, numSubtasks, setSelectedCell)} 
       onIndentRow={()=>handleIndentTask(rows,setRows,selectedCell, setSelectedCell)}
       onOutdentRow={()=>handleOutdentTask(rows,setRows,selectedCell, setSelectedCell)}/> {}
      <div id="main-content">
        <ResizableContainer>
          <div id="spreadsheet-container" className="spreadsheet-container">{gridElement}</div>
          <div id="gantt-chart-container" className="fill-grid">
            <GanttChart rows={rows} />
          </div>
        </ResizableContainer>
      </div>
    </>
  );
};

export default App;