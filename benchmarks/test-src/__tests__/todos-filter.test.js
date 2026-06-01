import { createTodo, filterTodos, toggleTodo, clearCompleted } from "../utils/todos.js";

const MIXED_LIST = [
  { id: 1, text: "active one", completed: false },
  { id: 2, text: "done one", completed: true },
  { id: 3, text: "active two", completed: false },
  { id: 4, text: "done two", completed: true },
  { id: 5, text: "active three", completed: false },
];

describe("filterTodos – all", () => {
  it("returns all todos with 'all' filter", () => {
    expect(filterTodos(MIXED_LIST, "all")).toHaveLength(5);
  });

  it("returns the same reference for 'all'", () => {
    expect(filterTodos(MIXED_LIST, "all")).toBe(MIXED_LIST);
  });
});

describe("filterTodos – active", () => {
  it("returns only active (non-completed) todos", () => {
    const result = filterTodos(MIXED_LIST, "active");
    expect(result).toHaveLength(3);
    expect(result.every(t => !t.completed)).toBe(true);
  });

  it("returns an empty list when all todos are completed", () => {
    const all = MIXED_LIST.map(t => ({ ...t, completed: true }));
    expect(filterTodos(all, "active")).toHaveLength(0);
  });
});

describe("filterTodos – completed", () => {
  it("returns only completed todos", () => {
    const result = filterTodos(MIXED_LIST, "completed");
    expect(result).toHaveLength(2);
    expect(result.every(t => t.completed)).toBe(true);
  });

  it("returns an empty list when no todos are completed", () => {
    const all = MIXED_LIST.map(t => ({ ...t, completed: false }));
    expect(filterTodos(all, "completed")).toHaveLength(0);
  });
});

describe("filterTodos – edge cases", () => {
  it("returns an empty list for an empty input", () => {
    expect(filterTodos([], "active")).toEqual([]);
    expect(filterTodos([], "completed")).toEqual([]);
    expect(filterTodos([], "all")).toEqual([]);
  });

  it("reflects toggle operations correctly", () => {
    let todos = [createTodo(1, "a"), createTodo(2, "b"), createTodo(3, "c")];
    todos = toggleTodo(todos, 2);

    expect(filterTodos(todos, "active")).toHaveLength(2);
    expect(filterTodos(todos, "completed")).toHaveLength(1);
    expect(filterTodos(todos, "all")).toHaveLength(3);
  });

  it("reflects clearCompleted correctly under 'all' filter", () => {
    const result = clearCompleted(MIXED_LIST);
    expect(filterTodos(result, "all")).toHaveLength(3);
    expect(filterTodos(result, "completed")).toHaveLength(0);
  });
});
