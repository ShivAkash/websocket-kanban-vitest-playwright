import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { COLUMNS } from '../constants';

Chart.register(...registerables);

const ProgressChart = ({ tasks }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Calculate task counts for each column
      const todoCount = tasks.filter(task => task.column === COLUMNS.TODO).length;
      const inProgressCount = tasks.filter(task => task.column === COLUMNS.IN_PROGRESS).length;
      const doneCount = tasks.filter(task => task.column === COLUMNS.DONE).length;
      
      // Calculate completion percentage
      const totalTasks = tasks.length;
      const completionPercentage = totalTasks > 0 ? (doneCount / totalTasks) * 100 : 0;

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['To Do', 'In Progress', 'Done'],
          datasets: [
            {
              label: 'Number of Tasks',
              data: [todoCount, inProgressCount, doneCount],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: `Task Progress (${completionPercentage.toFixed(1)}% Complete)`,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [tasks]);

  return (
    <div className="progress-chart">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ProgressChart; 