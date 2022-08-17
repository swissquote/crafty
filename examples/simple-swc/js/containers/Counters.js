import * as React from "react";
import Counter from "../components/Counter";

export default function Counters() {
  return (
    <div>
      <Counter increment={6} />
      <Counter increment={1} />
    </div>
  );
}
