// import 'react-data-grid/lib/styles.css';
import React from 'react';
import { TaskTree } from './TaskTree.tsx'; 
import { Row } from "../Model/Row.tsx";

type SelectedCellState = {
    rowIdx: string;
    rowNumber: number;
    depth: number
  };

  export const handleDeleteRow = (
    rows: Row[],
    setRows: React.Dispatch<React.SetStateAction<Row[]>>,
    selectedCell: SelectedCellState | null
  ) => {
    const taskTree = new TaskTree(rows);
    if(selectedCell){
      taskTree.removeTask(selectedCell.rowIdx);
      setRows(taskTree.rows);
    }
  };

  export const handleAddRow = (
    rows: Row[],
    setRows: React.Dispatch<React.SetStateAction<Row[]>>,
    selectedCell: SelectedCellState | null
  ) => {
    const taskTree = new TaskTree(rows);
    if(selectedCell){
      taskTree.addTask(selectedCell.rowIdx);
      setRows(taskTree.rows);
    }
  };

  export const handleIndentTask = (
    rows: Row[],
    setRows: React.Dispatch<React.SetStateAction<Row[]>>,
    selectedCell: SelectedCellState | null
  ) => {
    const taskTree = new TaskTree(rows);
    if(selectedCell){
      taskTree.indentTask(selectedCell.rowIdx);
      setRows(taskTree.rows);
    }
  }

  export const handleOutdentTask = (
    rows: Row[],
    setRows: React.Dispatch<React.SetStateAction<Row[]>>,
    selectedCell: SelectedCellState | null
  ) => {
    const taskTree = new TaskTree(rows);
    if(selectedCell){
      taskTree.outdentTask(selectedCell.rowIdx);
      setRows(taskTree.rows);
    }
  }

  export const handleAddSubtasks = (rows: Row[],
    setRows: React.Dispatch<React.SetStateAction< Row[]>>,
    selectedCell: SelectedCellState | null,
    numSubtasks: number) => {
    const taskTree = new TaskTree(rows);
    if(selectedCell){
      taskTree.addSubtasks(selectedCell.rowIdx, numSubtasks);
      setRows(taskTree.rows);
    }
  }