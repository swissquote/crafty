/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine("recommended", "node");

it("Doesn't warn on console.log", () => {
  const result = lint(engine, `console.log("Yeah");\n`);

  expect(result.messages).toEqual([], "no messages");
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});

it("Works with ES6", () => {
  const result = lint(
    engine,
    `
const something = [];

something.push("a value");

console.log(something);
`
  );

  expect(result.messages).toEqual([], "no messages");
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});
