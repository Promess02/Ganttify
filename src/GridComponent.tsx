import React from 'react';

interface GridComponentProps {
  rows: {
    idx: number;
    name: string;
    duration: string;
    start_date: string;
    end_date: string;
    worker_id: string;
  }[];
  onRowsChange: (rows: any) => void;
}

const GridComponent: React.FC<GridComponentProps> = ({ rows, onRowsChange }) => {
  // Implement the grid logic here
  return (
    <div>
      {/* Render the grid and handle changes */}
    </div>
  );
};

export default GridComponent;