import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function TaskProgressChart({ tasks }) {
  const chartData = [
    { name: 'To Do', tasks: tasks.todo.length },
    { name: 'In Progress', tasks: tasks.inProgress.length },
    { name: 'Done', tasks: tasks.done.length }
  ];

  return (
    <div className="progress-chart">
      <h2>Task Progress</h2>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="tasks" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default TaskProgressChart; 