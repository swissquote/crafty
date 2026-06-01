import React from "react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function Filters({ current, onChange }) {
  return (
    <nav className="filters">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          className={`filter-btn${current === value ? " filter-btn--active" : ""}`}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
