import React, { useEffect } from "react";
import FeedbackForm from "./FeedbackForm";
import "./feedback.css";

export default function FeedbackModal({ onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Feedback"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="modal-title">Send feedback</h2>
        <FeedbackForm onSubmit={onClose} />
      </div>
    </div>
  );
}
