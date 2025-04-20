const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// In-memory storage for tasks
let tasks = {
  todo: [],
  inProgress: [],
  done: []
};

// Valid column names
const validColumns = ['todo', 'inProgress', 'done'];

// Helper function to find task by ID
const findTaskById = (taskId) => {
  for (const column in tasks) {
    const task = tasks[column].find(t => t.id === taskId);
    if (task) return { task, column };
  }
  return null;
};

// Helper function to normalize column name
const normalizeColumnName = (status) => {
  if (status === 'inprogress') return 'inProgress';
  return status;
};

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send all tasks to newly connected client
  socket.emit("sync:tasks", tasks);

  // Create a new task
  socket.on("task:create", (task) => {
    console.log("Received task creation:", task);
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'todo' // Ensure status is set
    };
    tasks.todo.push(newTask);
    console.log("Updated tasks:", tasks);
    io.emit("sync:tasks", tasks);
  });

  // Update a task
  socket.on("task:update", ({ taskId, updatedTask }) => {
    console.log("Received task update:", { taskId, updatedTask });
    const found = findTaskById(taskId);
    if (found) {
      // Remove from current column
      tasks[found.column] = tasks[found.column].filter(t => t.id !== taskId);
      
      // Normalize and validate the new column name
      const newColumn = normalizeColumnName(updatedTask.status || found.column);
      
      if (!validColumns.includes(newColumn)) {
        console.error(`Invalid column name: ${newColumn}`);
        return;
      }

      // Add to new column
      tasks[newColumn].push({
        ...found.task,
        ...updatedTask,
        status: newColumn, // Ensure status matches the column name
        updatedAt: new Date().toISOString()
      });

      console.log("Updated tasks:", tasks);
      io.emit("sync:tasks", tasks);
    }
  });

  // Move a task between columns
  socket.on("task:move", ({ taskId, fromColumn, toColumn }) => {
    const found = findTaskById(taskId);
    if (found && tasks[toColumn] !== undefined) {
      const taskIndex = tasks[fromColumn].findIndex(t => t.id === taskId);
      const [task] = tasks[fromColumn].splice(taskIndex, 1);
      tasks[toColumn].push(task);
      io.emit("sync:tasks", tasks);
    }
  });

  // Delete a task
  socket.on("task:delete", (taskId) => {
    const found = findTaskById(taskId);
    if (found) {
      tasks[found.column] = tasks[found.column].filter(t => t.id !== taskId);
      io.emit("sync:tasks", tasks);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
