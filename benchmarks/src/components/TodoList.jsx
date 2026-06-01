import React from "react";
import TodoItem from "./TodoItem";
import EmptyState from "./EmptyState";

export default function TodoList({ todos, onToggle, onRemove }) {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
