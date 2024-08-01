import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const GanttChart = ({ rows }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      gantt: {
        barHeight: 30,
        barGap: 15,
        fontSize: 20,
        tickInterval: '1 week',
        axisFormat: '%d-%m-%Y'
      },
    });


    const renderChart = async () => {
      if (chartRef.current) {
        const ganttTasks = rows.map(row => {
          if (row.name && row.start_date && row.duration) {
            return `${row.name} :${row.idx}, ${row.start_date}, ${row.duration}d`;
          }
          return '';
        }).filter(task => task !== '').join('\n');

        const ganttChart = `
          gantt
          dateFormat  YYYY-MM-DD
          title A Gantt Diagram

          section Faza projektowania
          ${ganttTasks}
        `;

        try {
          const { svg, bindFunctions } = await mermaid.render('ganttChart', ganttChart);
          if (chartRef.current) {
            chartRef.current.innerHTML = svg;
            bindFunctions?.(chartRef.current);
          }
        } catch (error) {
          console.error('Error rendering Gantt chart:', error);
        }
      }
    };

    renderChart();
  }, [rows]);

  return <div ref={chartRef}></div>;
};

export default GanttChart;
