import * as React from "react";

export default function Counter({ increment }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + increment);
    }, 1000);
    return () => clearInterval(interval);
  }, [count, increment]);

  return (
    <div>
      <strong>Counters</strong> ({increment}): {count}
    </div>
  );
}
