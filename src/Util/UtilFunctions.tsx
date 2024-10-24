import { Row } from "../Model/Row.tsx";

export function incrementIndex(index: string): string {
    return handleIndexUpdate(index, true);
  }

  // Decrement the task index
export function  decrementIndex(index: string): string {
    return handleIndexUpdate(index, false);
  }

function handleIndexUpdate(index: string, increment: boolean) {
    const parts = index.split(".").map(Number);
    if (increment) {
      parts[parts.length - 1] += 1;
    } else {
      parts[parts.length - 1] -= 1;
    }
    const newIdx = parts.join(".");
    return newIdx;
  }

export function generateRow(idx: string, start_date: string, worker_id: string, parent_id: string): Row {
    return {
      idx,
      name: "",
      duration: "",
      start_date,
      end_date: "",
      hours: "",
      worker_id,
      predecessor: parent_id,
    };
  }

  export const findDepth = (idx: string): number => {
    const parts = idx.split('.');
    return parts.length - 1;
  };

  export function rowKeyGetter(row: Row) {
    return row.idx;
  }

  export const findRowIndexByIdx = (rows: Row[], idx: string): number => {
    return rows.findIndex(row => row.idx === idx);
  };

  export const getDiffTime = (row: Row): number => {
       const startDate = new Date(row.start_date);
        const endDate = new Date(row.end_date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  export const getEndDate = (row: Row): string => {
    const startDate = new Date(row.start_date);
    const duration = parseInt(row.duration, 10);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    return endDate.toISOString().split('T')[0];
  }

  export const updateTimeColumns = (rows: Row[], updatedRows: Row[], { indexes }: { indexes: number[] }) => {
    const newRows = [...rows];
    indexes.forEach((index) => {
      const row = updatedRows[index];
      if (row.start_date && row.end_date) {
        row.duration = getDiffTime(row).toString();
      } else if (row.start_date && row.duration) {
        row.end_date = getEndDate(row);
      }
      newRows[index] = row;
    });
    return newRows;
  }

  export const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };