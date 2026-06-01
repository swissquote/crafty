import React from "react";

export default function Header({ onFeedback }) {
  return (
    <header className="app-header">
      <h1 className="app-title">Crafty Todos</h1>
      <button className="feedback-btn" onClick={onFeedback}>
        Feedback
      </button>
    </header>
  );
}
