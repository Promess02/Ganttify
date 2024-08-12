import 'react-data-grid/lib/styles.css';
import React from 'react';
import { Row } from "../Model/Row.tsx";

type SelectedCellState = {
    rowIdx: string;
    rowNumber: number;
    depth: number
  };

  const incrementSequence = (sequence: string): string => {
    const parts = sequence.split('.');
  
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    parts[parts.length - 1] = (lastNumber + 1).toString();
  
    return parts.join('.');
  };

  const decrementSequence = (sequence: string): string => {
    const parts = sequence.split('.');
  
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    parts[parts.length - 1] = (lastNumber -1).toString();
  
    return parts.join('.');
  };

  
  const findDepth = (idx: string): number => {
    const parts = idx.split('.');
    return parts.length - 1;
  };

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
    
        setSelectedCell(null);
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
      const selectedTaskIdx = rows[selectedCell.rowNumber].idx;
      const newRows = rows.filter((row) => !row.idx.startsWith(selectedTaskIdx));
  
      const updateChildIdx = (parentIdx: string, newParentIdx: string) => {
        for (let i = 0; i < newRows.length; i++) {
          if (newRows[i].idx.startsWith(parentIdx) && newRows[i].idx !== parentIdx) {
            const childIdx = newRows[i].idx.replace(parentIdx, newParentIdx);
            newRows[i] = { ...newRows[i], idx: childIdx };
          }
        }
      };
  
      for (let i = selectedCell.rowNumber; i < newRows.length; i++) {
        if (findDepth(newRows[i].idx) === findDepth(selectedCell.rowIdx)
          && getSelectedCellBase(newRows[i].idx) === getSelectedCellBase(selectedCell.rowIdx)) {
          const oldIdx = newRows[i].idx;
          newRows[i] = { ...newRows[i], idx: decrementSequence(newRows[i].idx) };
          updateChildIdx(oldIdx, newRows[i].idx);
        }
      }
  
      setRows(newRows);
      setSelectedCell(null);
    }
  };

  const getSelectedCellBase = (str: string): number => {
    const lastDotIndex = str.lastIndexOf('.');
    const secondLastDotIndex = str.lastIndexOf('.', lastDotIndex - 1);
    const selectedCellBase = str.substring(secondLastDotIndex + 1, lastDotIndex);
    return Number(selectedCellBase);
  };
  
  export const handleAddSubtasks = (rows: readonly Row[],
  setRows: React.Dispatch<React.SetStateAction<readonly Row[]>>,
  selectedCell: SelectedCellState | null,
    numSubtasks: number) => {
    if (selectedCell) {
        const newRows = [...rows];
        
        let row_idx = newRows[selectedCell.rowNumber].idx;
        let selectedCellBase = getSelectedCellBase(row_idx);
        let start = 0;

        while (true) {
          row_idx = newRows[selectedCell.rowNumber+start+1].idx;
          if(!row_idx.includes('.') || getSelectedCellBase(row_idx) === selectedCellBase)
            break;
          else start++;
        }
        let Id = `${selectedCell.rowIdx}.${start}`;
        for (let i = 1; i <= numSubtasks; i++) {
          Id = incrementSequence(Id);
          const newRow = { idx: Id, name: '', duration: '', start_date: '', hours: '', worker_id: '', predecessor: '', end_date: '' };
          newRows.splice(selectedCell.rowNumber + start + i, 0, newRow);
        }
    
        setRows(newRows);
      }
  };

  export const handleIndentTask = (
    rows: readonly Row[],
    setRows: React.Dispatch<React.SetStateAction<readonly Row[]>>,
    selectedCell: SelectedCellState | null
  ) => {
    if (selectedCell && selectedCell.rowNumber > 0) {
      const newRows = [...rows];
      const selectedRow = newRows[selectedCell.rowNumber];
      const previousRow = newRows[selectedCell.rowNumber - 1];
  
      const previousRowIdx = previousRow.idx;
      const subtaskNumbers = newRows
        .filter(row => row.idx.startsWith(`${previousRowIdx}.`))
        .map(row => parseInt(row.idx.split('.').pop() || '0', 10));
      const nextSubtaskNumber = Math.max(0, ...subtaskNumbers) + 1;
  
      const newIdx = `${previousRowIdx}.${nextSubtaskNumber}`;
      newRows[selectedCell.rowNumber] = { ...selectedRow, idx: newIdx };
      
      for (let i = selectedCell.rowNumber; i < newRows.length; i++) {
        if(findDepth(newRows[i].idx) === findDepth(selectedCell.rowIdx))
        newRows[i] = { ...newRows[i],idx: decrementSequence(newRows[i].idx) };
      }
  
      setRows(newRows);
    }
  };

  export const handleOutdentTask = (
    rows: readonly Row[],
    setRows: React.Dispatch<React.SetStateAction<readonly Row[]>>,
    selectedCell: SelectedCellState | null
  ) => {
    if (selectedCell && selectedCell.rowNumber > 0) {
      const newRows = [...rows];
      const selectedRow = newRows[selectedCell.rowNumber];
      const previousRow = newRows[selectedCell.rowNumber - 1];
  
      if (selectedRow.idx.includes('.')) {
        const previousRowIdx = previousRow.idx;
        const previousRowParts = previousRowIdx.split('.');
        const lastPart = parseInt(previousRowParts.pop() || '0', 10) + 1;
        const newIdx = [...previousRowParts, lastPart].join('.');
  
        newRows[selectedCell.rowNumber] = { ...selectedRow, idx: newIdx };
  
        for (let i = selectedCell.rowNumber + 1; i < newRows.length; i++) {
          if (newRows[i].idx.startsWith(selectedRow.idx)) {
            const updatedIdx = newRows[i].idx.replace(selectedRow.idx, newIdx);
            newRows[i] = { ...newRows[i], idx: updatedIdx };
          }
        }
  
        setRows(newRows);
      }
    }
  };