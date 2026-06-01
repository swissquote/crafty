import React from "react";

export default function TodoCounter({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  return (
    <div className="todo-counter">
      <span className="counter-item">
        <strong>{active}</strong> remaining
      </span>
      {completed > 0 && (
        <span className="counter-item">
          <strong>{completed}</strong> completed
        </span>
      )}
    </div>
  );
}
