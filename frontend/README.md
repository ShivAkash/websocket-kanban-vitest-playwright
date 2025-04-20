# Websocket Kanban Board

A real-time Kanban board application built with React, Socket.io, and modern web technologies. This project implements a responsive task management system featuring drag-and-drop functionality via React DnD, data visualization with Recharts, and form handling with validation.

## Features

- Real-time task updates using WebSockets
- Drag-and-drop task management
- Create, edit, and delete tasks
- Task categorization and prioritization
- Responsive design

## Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run unit and integration tests
- `npm run test:e2e` - Run end-to-end tests with Playwright

## Testing

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- frontend/src/tests/KanbanBoard.test.jsx

# Run tests in watch mode
npm test -- --watch
```

### End-to-End Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test src/tests/e2e/functional.spec.js

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with UI
npx playwright test --ui
```

Key test cases include:
- Verifying that the kanban board loads with all columns
- Checking that task creation form elements are accessible
- Testing task movement between columns (when implemented)

### CSS Selectors for Testing

When writing new tests, use these selectors to target elements:

| Element          | CSS Selector              | Notes                            |
|------------------|---------------------------|----------------------------------|
| Kanban Board     | `.kanban-board`           | Main container for the board     |
| Column           | `.column`                 | Individual columns (Todo, etc.)  |
| Tasks Container  | `.column .tasks`          | Container for tasks in a column  |
| Task             | `.tasks h4`               | Individual task elements         |
| Task Form        | `.task-form`              | Form for creating/editing tasks  |
| Task Title Input | `input[placeholder="Task Title"]` | Title field in the form  |
| Create Button    | `button:has-text("Create Task")` | Button to create a task   |

## Project Structure

```
frontend/
  ├── src/
  │   ├── components/  # React components
  │   ├── hooks/       # Custom hooks
  │   ├── utils/       # Utility functions
  │   ├── tests/       # Tests for the application
  │   │   ├── unit/    # Unit tests
  │   │   ├── integration/ # Integration tests
  │   │   └── e2e/     # End-to-end tests with Playwright
  │   │       ├── basic.spec.js      # Basic tests that always pass
  │   │       ├── functional.spec.js # Core functionality tests
  │   │       └── kanban.spec.js     # Full WebSocket-enabled tests
  │   └── App.jsx      # Main application component
  ├── package.json     # Dependencies and scripts
  └── playwright.config.js # Playwright configuration
```

## WebSocket Testing

The application uses WebSockets for real-time updates. When testing:

1. **Unit/Integration Tests**: WebSocket connections are mocked
2. **E2E Tests**: A MockWebSocket class is used to simulate server responses

### Mock WebSocket Implementation

The mock WebSocket implementation in `src/tests/e2e/kanban.spec.js` provides:
- Static WebSocket connection states (CONNECTING, OPEN, CLOSING, CLOSED)
- Event listeners for 'open', 'message', and 'close' events
- Methods to simulate message reception

## Troubleshooting

If you encounter issues with the E2E tests:

1. Make sure your development server is running (`npm run dev`)
2. Check that the port in playwright.config.js matches your dev server port
3. Try running with UI mode for visual debugging: `npx playwright test --ui`
4. Check the DOM structure using `page.evaluate()` if selectors aren't matching
