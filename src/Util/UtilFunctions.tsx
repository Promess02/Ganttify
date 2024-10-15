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