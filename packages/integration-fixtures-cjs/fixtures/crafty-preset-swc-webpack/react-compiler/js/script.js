// A function component using props so the React Compiler emits memoization
// (a `react/compiler-runtime` import and `_c(...)` memo-cache calls).
function Greeting({ name, items }) {
  return (
    <div>
      <h1>Hello {name}</h1>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// Export the component so it is kept (and its compiled output emitted).
export default Greeting;
