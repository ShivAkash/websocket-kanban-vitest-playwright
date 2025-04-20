import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import './components/styles.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>WebSocket Kanban Board</h1>
      </header>
      <main>
        <KanbanBoard />
      </main>
    </div>
  );
}

export default App;
