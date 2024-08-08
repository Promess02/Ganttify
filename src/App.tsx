import React, { useState } from 'react';
import DataGrid, { CellClickArgs } from 'react-data-grid';
import GanttChart from './Components/GanttChart.tsx';
import 'react-data-grid/lib/styles.css';
import ResizableContainer from './Components/ResizableContainer.tsx';
import MyAppBar from './Components/MyAppBar.tsx'; 
import { Row } from "./Model/Row.tsx";
import { columns, initialRows } from './Model/data.tsx';
import { handleAddRow, handleDeleteRow, handleAddSubtasks } from './Logic/rowHandlers.tsx';

function rowKeyGetter(row: Row) {
  return row.idx;
}

type SelectedCellState = {
  rowIdx: string;
  rowNumber: number;
  depth: number
};

const findRowIndexByIdx = (rows: readonly Row[], idx: string): number => {
  return rows.findIndex(row => row.idx === idx);
};

const findDepth = (idx: string): number => {
  const parts = idx.split('.');
  return parts.length - 1;
};

const App: React.FC = () => {
  const [rows, setRows] = useState<readonly Row[]>(initialRows);
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
    
    const findRowIndexByIdx = (rows: readonly Row[], idx: string): number => {
      return rows.findIndex(row => row.idx === idx);
    };
  
  return (
    <>
      <MyAppBar onAddRow={() => handleAddRow(rows,setRows,selectedCell,setSelectedCell)} 
      onDeleteRow={ () => handleDeleteRow(rows,setRows,selectedCell,setSelectedCell)}
       onAddSubtasks={(numSubtasks) => handleAddSubtasks(rows,setRows,selectedCell, numSubtasks)} /> {}
      <div id="main-content">
        <ResizableContainer>
          <div id="spreadsheet-container" className="spreadsheet-container">{gridElement}</div>
          <div id="gantt-chart-container">
            <GanttChart rows={rows} />
          </div>
        </ResizableContainer>
      </div>
    </>
  );
};

export default App;