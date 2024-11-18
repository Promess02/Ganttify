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
import ErrorMessage from './Components/ErrorMessage.tsx';
import WorkerList from './Components/WorkerList.tsx';
import { Worker } from './Model/Worker.tsx';
import LinkResourcePicker from './Components/LinkResourcePicker.tsx';

type SelectedCellState = {
  rowIdx: string;
  rowNumber: number;
  depth: number
};

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<SelectedCellState | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [error, setError] = useState<string | null>(null);
  const [showWorkerList, setShowWorkerList] = useState(false);
  const [showLinkResource, setShowLinkResource] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const handleCellClick = (args: CellClickArgs<Row, unknown>) => {
    setSelectedCell({ rowIdx: `${args.row.idx}`,
       rowNumber: findRowIndexByIdx(rows, args.row.idx),
        depth: findDepth(`${args.row.idx}`)});
    setSelectedWorkerId(args.row.worker_id);
  };

  const handleRowsChange = (updatedRows: Row[], { indexes }: { indexes: number[] }) => {
    try{
      const index = indexes[0];
      const updatedRow = updatedRows[index];
  
      if (updatedRow.hours !== rows[index].hours) {
        updatedRows = updateHours(updatedRow.idx, updatedRows);
      }
      if (updatedRow.previous !== rows[index].previous) {
        let previous = updatedRows[findRowIndexByIdx(updatedRows, updatedRow.previous)];
        updatedRows[index] = updatePredecessor(updatedRow, previous);
      }
      if (updatedRow.duration !== rows[index].duration) {
        updatedRows[index] = updateEndDate(updatedRow);
      }
      if (updatedRow.end_date !== rows[index].end_date) {
        let successors = getAllSuccessors(updatedRow.idx, updatedRows);
        successors.forEach(successor => {
          updatedRows[findRowIndexByIdx(updatedRows, successor.idx)] = updatePredecessor(successor, updatedRow);
        });
      }
      const newRows = updateTimeColumns(updatedRows, { indexes });
      setRows(newRows);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateRowData = (rowIdx, columnKey, date) => {
    try{
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
    } catch (error) {
      setError(error.message);
    }
    
  };

  const updateHours = (rowIdx, updatedRows) => {
    let parentIndex = findRowIndexByIdx(updatedRows, getParentTaskId(rowIdx));
    if (parentIndex !== -1) {
      updatedRows = sumParentHours(updatedRows, getParentTaskId(rowIdx));
    }

    return updatedRows;
  }

  const updatePredecessor = (updatedRow, previous) => {
    let previousEndDate = new Date(previous.end_date);
    let startDate = new Date(updatedRow.start_date);
    let endDate = new Date(updatedRow.end_date);
    if (previousEndDate.getTime() > startDate.getTime()) {
      updatedRow.start_date = previous.end_date;
      if (endDate.getTime() < previousEndDate.getTime()) {
        updatedRow.end_date = updatedRow.start_date;
      }
      if (updatedRow.duration!== "") {
        let newEndDate = new Date(updatedRow.start_date);
        newEndDate.setDate(newEndDate.getDate() + parseInt(updatedRow.duration, 10));
        updatedRow.end_date = newEndDate.toISOString().split('T')[0];
      }
    }
    return updatedRow;
  }

  const updateEndDate = (row) => {
    let startDate = new Date(row.start_date);
    let duration = parseInt(row.duration, 10);
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    row.end_date = endDate.toISOString().split('T')[0];
    return row;
  }

  const getAllSuccessors = (rowIdx, rows) => {
    let successors = new Array<Row>();
    rows.forEach(row => {
      if (row.previous === rowIdx) {
        successors.push(row);
      }
    });
    return successors;
  }

  const handleCloseError = () => {
    setError(null);
  };

  const handleDefineResource = () => {
    setShowWorkerList(!showWorkerList);
  };

  const handleAddWorker = (newWorker: Worker) => {
    setWorkers([...workers, { ...newWorker, worker_id: (workers.length + 1).toString() }]);
  };

  const handleDeleteWorker = (worker_id: string) => {
    setWorkers(workers.filter(worker => worker.worker_id !== worker_id));
  };

  const handleModifyWorker = (modifiedWorker: Worker) => {
    setWorkers(workers.map(worker => (worker.worker_id === modifiedWorker.worker_id ? modifiedWorker : worker)));
  };

  const handleLinkResource = () => {
    setShowLinkResource(!showLinkResource);
  };

  const handlePickWorker = (worker_id: string) => {
    if (selectedCell) {
      const updatedRows = [...rows];
      const rowIndex = selectedCell.rowNumber;
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], worker_id };
      setRows(updatedRows);
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  const handleUnlinkResource = () => {
    if (selectedCell) {
      const updatedRows = [...rows];
      const rowIndex = selectedCell.rowNumber;
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], worker_id: '' };
      setRows(updatedRows);
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

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
       onOutdentRow={()=>handleOutdentTask(rows,setRows,selectedCell, setSelectedCell)}
       onHandleResources={handleDefineResource}
       onLinkResource={handleLinkResource}
       onUnlinkResource={handleUnlinkResource}/> {}
      <div id="main-content">
        <ResizableContainer>
          <div id="spreadsheet-container" className="spreadsheet-container">{gridElement}</div>
          <div id="gantt-chart-container" className="fill-grid">
            <GanttChart rows={rows} />
          </div>
        </ResizableContainer>
        <WorkerList
          isOpen={showWorkerList}
          onRequestClose={() => {
            setShowWorkerList(false);
            setWorkers(workers);
          }}
          workers={workers}
          onAddWorker={handleAddWorker}
          onDeleteWorker={handleDeleteWorker}
          onModifyWorker={handleModifyWorker}
        />
        <LinkResourcePicker
          isOpen={showLinkResource}
          onRequestClose={() => setShowLinkResource(false)}
          workers={workers}
          onPickWorker={handlePickWorker}
          selectedWorkerId={selectedWorkerId}
        />
        <ErrorMessage message={error} onClose={handleCloseError} />
      </div>
    </>
  );
};

export default App;