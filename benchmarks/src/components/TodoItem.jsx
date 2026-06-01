import React, { useState } from "react";

export default function TodoItem({ todo, onToggle, onRemove }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className={`todo-item${todo.completed ? " todo-item--done" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        id={`todo-${todo.id}`}
      />
      <label className="todo-label" htmlFor={`todo-${todo.id}`}>
        {todo.text}
      </label>
      {hovered && (
        <button
          className="todo-remove"
          onClick={() => onRemove(todo.id)}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </li>
  );
}
