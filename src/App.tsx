import React, { useState } from 'react';
import DataGrid, { CellClickArgs } from 'react-data-grid';
import GanttChart from './Components/GanttChart.tsx';
import 'react-data-grid/lib/styles.css';
import ResizableContainer from './Components/ResizableContainer.tsx';
import MyAppBar from './Components/MyAppBar.tsx'; 
import { Row } from "./Model/Row.tsx";
import { columns, initialRows } from './Model/data.tsx';
import { handleAddRow, handleDeleteRow, handleAddSubtasks, handleIndentTask, handleOutdentTask } from './Logic/rowHandlers.tsx';

function rowKeyGetter(row: Row) {
  return row.idx;
}

type SelectedCellState = {
  rowIdx: string;
  rowNumber: number;
  depth: number
};

const findDepth = (idx: string): number => {
  const parts = idx.split('.');
  return parts.length - 1;
};

const findRowIndexByIdx = (rows: Row[], idx: string): number => {
  return rows.findIndex(row => row.idx === idx);
};

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<SelectedCellState | null>(null);

  const handleCellClick = (args: CellClickArgs<Row, unknown>) => {
    setSelectedCell({ rowIdx: `${args.row.idx}`,
       rowNumber: findRowIndexByIdx(rows, args.row.idx),
        depth: findDepth(`${args.row.idx}`)});
  };

  const gridElement = (
    <DataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={rows}
      defaultColumnOptions={{
        resizable: true
      }}
      onRowsChange={setRows}
      className="fill-grid"
      onCellClick={handleCellClick}
    />
  );
  
  return (
    <>
      <MyAppBar onAddRow={() => handleAddRow(rows,setRows,selectedCell)} 
      onDeleteRow={ () => handleDeleteRow(rows,setRows,selectedCell)}
       onAddSubtasks={(numSubtasks) => handleAddSubtasks(rows,setRows,selectedCell, numSubtasks)} 
       onIndentRow={()=>handleIndentTask(rows,setRows,selectedCell)}
       onOutdentRow={()=>handleOutdentTask(rows,setRows,selectedCell)}/> {}
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