import React, { useState } from 'react';
import DataGrid, { CellClickArgs } from 'react-data-grid';
import GanttChart from './Components/GanttChart.tsx';
import 'react-data-grid/lib/styles.css';
import ResizableContainer from './Components/ResizableContainer.tsx';
import MyAppBar from './Components/MyAppBar.tsx'; 
import { Row } from "./Model/Row.tsx";
import { initialRows } from './Model/data.tsx';
import { getColumns } from './Model/ColumArray.tsx';
import { findDepth, rowKeyGetter, findRowIndexByIdx, updateTimeColumns } from './Util/UtilFunctions.tsx';
import { handleAddRow, handleDeleteRow, handleAddSubtasks, handleIndentTask, handleOutdentTask } from './Logic/rowHandlers.tsx';

type SelectedCellState = {
  rowIdx: string;
  rowNumber: number;
  depth: number
};

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<SelectedCellState | null>(null);

  const handleCellClick = (args: CellClickArgs<Row, unknown>) => {
    setSelectedCell({ rowIdx: `${args.row.idx}`,
       rowNumber: findRowIndexByIdx(rows, args.row.idx),
        depth: findDepth(`${args.row.idx}`)});
  };

  const handleRowsChange = (updatedRows: Row[], { indexes }: { indexes: number[] }) => {
    const newRows = updateTimeColumns(rows, updatedRows, { indexes });
    setRows(newRows);
  };

  const updateRowData = (rowIdx, columnKey, date) => {
    const updatedRows = rows.map((row, index) => {
      if (index === rowIdx) {
        return { ...row, [columnKey]: date };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const gridElement = (
    <DataGrid
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