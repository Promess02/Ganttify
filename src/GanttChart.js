import React, { useEffect } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: true });

const GanttChart = () => {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  const ganttChart = `
    gantt
    dateFormat  YYYY-MM-DD
    title A Gantt Diagram

    section Section
    A task           :a1, 2024-07-22, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2024-08-12  , 12d
    another task     : 24d
  `;

  return (
    <div className="mermaid">
      {ganttChart}
    </div>
  );
};

export default GanttChart;