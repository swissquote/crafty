import { loadTodos, saveTodos } from "../../src/utils/storage.js";

describe("loadTodos", () => {
  it("returns an empty array when localStorage is empty", () => {
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns parsed todos when they exist in localStorage", () => {
    const todos = [{ id: 1, text: "buy milk", completed: false }];
    localStorage.setItem("crafty-benchmark-todos", JSON.stringify(todos));

    expect(loadTodos()).toEqual(todos);
  });

  it("returns an empty array when localStorage contains invalid JSON", () => {
    localStorage.setItem("crafty-benchmark-todos", "{not valid json}");
    expect(loadTodos()).toEqual([]);
  });

  it("handles multiple todos", () => {
    const todos = [
      { id: 1, text: "first", completed: false },
      { id: 2, text: "second", completed: true },
      { id: 3, text: "third", completed: false },
    ];
    localStorage.setItem("crafty-benchmark-todos", JSON.stringify(todos));
    expect(loadTodos()).toHaveLength(3);
  });

  it("preserves all todo fields", () => {
    const todo = { id: 42, text: "test todo", completed: true };
    localStorage.setItem("crafty-benchmark-todos", JSON.stringify([todo]));
    const [loaded] = loadTodos();
    expect(loaded.id).toBe(42);
    expect(loaded.text).toBe("test todo");
    expect(loaded.completed).toBe(true);
  });
});

describe("saveTodos", () => {
  it("persists todos to localStorage", () => {
    const todos = [{ id: 1, text: "saved todo", completed: false }];
    saveTodos(todos);

    const raw = localStorage.getItem("crafty-benchmark-todos");
    expect(JSON.parse(raw)).toEqual(todos);
  });

  it("overwrites existing todos", () => {
    saveTodos([{ id: 1, text: "old", completed: false }]);
    saveTodos([{ id: 2, text: "new", completed: true }]);

    const loaded = loadTodos();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].text).toBe("new");
  });

  it("saves an empty array", () => {
    saveTodos([{ id: 1, text: "existing", completed: false }]);
    saveTodos([]);
    expect(loadTodos()).toEqual([]);
  });

  it("round-trips correctly via loadTodos", () => {
    const original = [
      { id: 10, text: "alpha", completed: false },
      { id: 20, text: "beta", completed: true },
    ];
    saveTodos(original);
    expect(loadTodos()).toEqual(original);
  });

  it("handles todos with special characters", () => {
    const todos = [{ id: 1, text: 'Buy "milk" & bread', completed: false }];
    saveTodos(todos);
    expect(loadTodos()[0].text).toBe('Buy "milk" & bread');
  });

  it("handles a large list of todos", () => {
    const todos = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      text: `todo ${i}`,
      completed: i % 2 === 0,
    }));
    saveTodos(todos);
    expect(loadTodos()).toHaveLength(100);
  });
});
