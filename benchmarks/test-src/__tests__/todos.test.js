import {
  createTodo,
  addTodo,
  toggleTodo,
  removeTodo,
  clearCompleted,
  countActive,
  countCompleted,
} from "../utils/todos.js";

describe("createTodo", () => {
  it("creates a todo with the given id and text", () => {
    const todo = createTodo(1, "buy milk");
    expect(todo.id).toBe(1);
    expect(todo.text).toBe("buy milk");
  });

  it("creates a todo with completed set to false", () => {
    const todo = createTodo(1, "test");
    expect(todo.completed).toBe(false);
  });
});

describe("addTodo", () => {
  it("adds a new todo to an empty list", () => {
    const result = addTodo([], "first task");
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("first task");
    expect(result[0].completed).toBe(false);
  });

  it("appends the new todo at the end", () => {
    const initial = [createTodo(1, "existing")];
    const result = addTodo(initial, "new");
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe("new");
  });

  it("does not mutate the original array", () => {
    const original = [createTodo(1, "original")];
    addTodo(original, "new");
    expect(original).toHaveLength(1);
  });
});

describe("toggleTodo", () => {
  it("marks an active todo as completed", () => {
    const todos = [createTodo(1, "task")];
    const result = toggleTodo(todos, 1);
    expect(result[0].completed).toBe(true);
  });

  it("marks a completed todo as active", () => {
    const todos = [{ id: 1, text: "task", completed: true }];
    const result = toggleTodo(todos, 1);
    expect(result[0].completed).toBe(false);
  });

  it("only toggles the targeted todo", () => {
    const todos = [createTodo(1, "a"), createTodo(2, "b"), createTodo(3, "c")];
    const result = toggleTodo(todos, 2);
    expect(result[0].completed).toBe(false);
    expect(result[1].completed).toBe(true);
    expect(result[2].completed).toBe(false);
  });

  it("does not mutate the original array", () => {
    const todos = [createTodo(1, "task")];
    toggleTodo(todos, 1);
    expect(todos[0].completed).toBe(false);
  });

  it("leaves list unchanged when id is not found", () => {
    const todos = [createTodo(1, "task")];
    const result = toggleTodo(todos, 99);
    expect(result).toEqual(todos);
  });
});

describe("removeTodo", () => {
  it("removes the todo with the given id", () => {
    const todos = [createTodo(1, "a"), createTodo(2, "b")];
    const result = removeTodo(todos, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("returns an empty list when the only todo is removed", () => {
    const todos = [createTodo(1, "task")];
    expect(removeTodo(todos, 1)).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const todos = [createTodo(1, "task"), createTodo(2, "other")];
    removeTodo(todos, 1);
    expect(todos).toHaveLength(2);
  });
});

describe("clearCompleted", () => {
  it("removes all completed todos", () => {
    const todos = [
      { id: 1, text: "a", completed: true },
      { id: 2, text: "b", completed: false },
      { id: 3, text: "c", completed: true },
    ];
    const result = clearCompleted(todos);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("returns an empty list if all todos are completed", () => {
    const todos = [
      { id: 1, text: "a", completed: true },
      { id: 2, text: "b", completed: true },
    ];
    expect(clearCompleted(todos)).toEqual([]);
  });

  it("returns the same list if no todos are completed", () => {
    const todos = [createTodo(1, "a"), createTodo(2, "b")];
    expect(clearCompleted(todos)).toEqual(todos);
  });
});

describe("countActive", () => {
  it("returns 0 for an empty list", () => {
    expect(countActive([])).toBe(0);
  });

  it("counts only active todos", () => {
    const todos = [
      { id: 1, text: "a", completed: false },
      { id: 2, text: "b", completed: true },
      { id: 3, text: "c", completed: false },
    ];
    expect(countActive(todos)).toBe(2);
  });
});

describe("countCompleted", () => {
  it("returns 0 for an empty list", () => {
    expect(countCompleted([])).toBe(0);
  });

  it("counts only completed todos", () => {
    const todos = [
      { id: 1, text: "a", completed: false },
      { id: 2, text: "b", completed: true },
      { id: 3, text: "c", completed: true },
    ];
    expect(countCompleted(todos)).toBe(2);
  });
});
