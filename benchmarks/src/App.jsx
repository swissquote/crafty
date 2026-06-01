import React, { Suspense, lazy, useState } from "react";
import Header from "./components/Header";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import Filters from "./components/Filters";
import TodoCounter from "./components/TodoCounter";
import { useTodos } from "./hooks/useTodos";
import "./styles/components.css";

const FeedbackModal = lazy(() => import("./modals/FeedbackModal"));

export default function App() {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState("all");
  const [showFeedback, setShowFeedback] = useState(false);

  const filtered = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="app">
      <Header onFeedback={() => setShowFeedback(true)} />
      <main className="app-main">
        <AddTodo onAdd={addTodo} />
        <Filters current={filter} onChange={setFilter} />
        <TodoCounter todos={todos} />
        <TodoList
          todos={filtered}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />
        {todos.some(t => t.completed) && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed
          </button>
        )}
      </main>
      {showFeedback && (
        <Suspense fallback={<div className="modal-loading">Loading…</div>}>
          <FeedbackModal onClose={() => setShowFeedback(false)} />
        </Suspense>
      )}
    </div>
  );
}
