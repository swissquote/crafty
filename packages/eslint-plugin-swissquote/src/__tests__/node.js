/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(
  require("../best-practices"),
  require("../node")
);

it("Doesn't warn on console.log", () => {
  const result = lint(engine, 'console.log("Yeah");');

  expect(result.messages).toEqual([], "no messages");
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});

it("Doesn't warn on valid but badly formatted code", () => {
  const result = lint(
    engine,
    `

function test() { console.log("This is spartaaa"); }

test()

`
  );

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

`
  );

  expect(result.messages).toEqual([], "no messages");
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});
