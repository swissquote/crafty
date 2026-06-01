import { useState, useEffect } from "react";
import { loadTodos, saveTodos } from "../utils/storage";

export function useTodos() {
  const [todos, setTodos] = useState(() => loadTodos());

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function addTodo(text) {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  }

  function toggleTodo(id) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function removeTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  return { todos, addTodo, toggleTodo, removeTodo, clearCompleted };
}
