// Same component as the react-compiler fixture, but without opting into the
// React Compiler, so no `react/compiler-runtime` import should be emitted.
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
