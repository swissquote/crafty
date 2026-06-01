/**
 * Pure functions extracted from src/hooks/useTodos.js for testing
 * without a React dependency.
 */

export function createTodo(id, text) {
  return { id, text, completed: false };
}

export function addTodo(todos, text) {
  return [...todos, createTodo(Date.now(), text)];
}

export function toggleTodo(todos, id) {
  return todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
}

export function removeTodo(todos, id) {
  return todos.filter(t => t.id !== id);
}

export function clearCompleted(todos) {
  return todos.filter(t => !t.completed);
}

export function countActive(todos) {
  return todos.filter(t => !t.completed).length;
}

export function countCompleted(todos) {
  return todos.filter(t => t.completed).length;
}

/**
 * @param {Array} todos
 * @param {'all'|'active'|'completed'} filter
 */
export function filterTodos(todos, filter) {
  if (filter === "active") return todos.filter(t => !t.completed);
  if (filter === "completed") return todos.filter(t => t.completed);
  return todos;
}
