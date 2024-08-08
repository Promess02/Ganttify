import 'react-data-grid/lib/styles.css';
import React from 'react';
import { Row } from "../Model/Row.tsx";

type SelectedCellState = {
    rowIdx: string;
    rowNumber: number;
    depth: number
  };

  const incrementSequence = (sequence: string): string => {
    // Split the sequence by dots
    const parts = sequence.split('.');
  
    // Convert the last part to a number and increment it
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    parts[parts.length - 1] = (lastNumber + 1).toString();
  
    // Join the parts back into a string
    return parts.join('.');
  };

  const decrementSequence = (sequence: string): string => {
    // Split the sequence by dots
    const parts = sequence.split('.');
  
    // Convert the last part to a number and increment it
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    parts[parts.length - 1] = (lastNumber -1).toString();
  
    // Join the parts back into a string
    return parts.join('.');
  };

  
  const findDepth = (idx: string): number => {
    // Split the string by dots and count the number of parts
    const parts = idx.split('.');
    // The number of dots is one less than the number of parts
    return parts.length - 1;
  };

// rowHandlers.tsx
export const handleAddRow = (
    rows: readonly Row[],
    setRows: React.Dispatch<React.SetStateAction<readonly Row[]>>,
    selectedCell: SelectedCellState | null,
    setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCellState | null>>
  ) => {
    if (selectedCell) {
        const newRow = { idx: incrementSequence(selectedCell.rowIdx), name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' };
        const newRows = [...rows];
        newRows.splice(selectedCell.rowNumber+1, 0, newRow);
    
        for (let i = selectedCell.rowNumber+2; i < newRows.length; i++) {
          if(findDepth(newRows[i].idx) === findDepth(selectedCell.rowIdx))
          newRows[i] = { ...newRows[i], idx: incrementSequence(newRows[i].idx) };
        }
    
        setRows(newRows);
      }
  };
  
  export const handleDeleteRow = (
    rows: readonly Row[],
    setRows: React.Dispatch<React.SetStateAction<readonly Row[]>>,
    selectedCell: SelectedCellState | null,
    setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCellState | null>>
  ) => {
    if (selectedCell) {
        const newRows = rows.filter((_, index) => index !== selectedCell.rowNumber);
    
        for (let i = selectedCell.rowNumber; i < newRows.length; i++) {
          if(findDepth(newRows[i].idx) === findDepth(selectedCell.rowIdx))
          newRows[i] = { ...newRows[i],idx: decrementSequence(newRows[i].idx) };
        }
    
        setRows(newRows);
        setSelectedCell(null);
      }
  };
  
  export const handleAddSubtasks = (rows: readonly Row[],
  setRows: React.Dispatch<React.SetStateAction<readonly Row[]>>,
  selectedCell: SelectedCellState | null,
    numSubtasks: number) => {
    if (selectedCell) {
        const newRows = [...rows];
        let Id = selectedCell.rowIdx + ".0";
        for (let i = 1; i <= numSubtasks; i++) {
          Id = incrementSequence(Id);
          const newRow = { idx: Id, name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' };
          newRows.splice(selectedCell.rowNumber + i, 0, newRow);
        }
    
        setRows(newRows);
      }
  };