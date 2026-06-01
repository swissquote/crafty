import React, { useState } from "react";

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        className="add-todo-input"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What needs to be done?"
        autoFocus
      />
      <button className="add-todo-btn" type="submit" disabled={!text.trim()}>
        Add
      </button>
    </form>
  );
}
