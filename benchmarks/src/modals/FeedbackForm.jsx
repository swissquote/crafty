import React, { useState } from "react";

const CATEGORIES = ["Bug report", "Feature request", "General feedback"];
const RATINGS = [1, 2, 3, 4, 5];

export default function FeedbackForm({ onSubmit }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onSubmit, 1500);
  }

  if (submitted) {
    return (
      <div className="feedback-success">
        <p>Thanks for your feedback!</p>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <label className="form-label">
        Category
        <select
          className="form-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="form-group">
        <span className="form-label">Rating</span>
        <div className="rating-group">
          {RATINGS.map(r => (
            <button
              key={r}
              type="button"
              className={`rating-btn${rating === r ? " rating-btn--active" : ""}`}
              onClick={() => setRating(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <label className="form-label">
        Message
        <textarea
          className="form-textarea"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tell us what you think…"
          required
        />
      </label>

      <label className="form-label">
        Email (optional)
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <button className="form-submit" type="submit" disabled={!message.trim()}>
        Send feedback
      </button>
    </form>
  );
}
