/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(
  require("../best-practices"),
  require("../typescript-best-practices"),
  {
    parser: require.resolve("@typescript-eslint/parser"),
    env: { browser: true }
  }
);

it("Warns on console.log", () => {
  const result = lint(engine, 'console.log("Yeah");');

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(1);
  expect(result.errorCount).toBe(0);
});

it("Doesn't warn on valid but badly formatted code", () => {
  const result = lint(
    engine,
    `

function test() { fetch("This is spartaaa"); }

test()

`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});

it("Uses sonar plugin", () => {
  const result = lint(
    engine,
`
/* global openWindow, closeWindow, moveWindowToTheBackground */

function changeWindow(param: number) {
  if (param === 1) {
    openWindow();
  } else if (param === 2) {
    closeWindow();
  } else if (param === 1) { // Noncompliant
    moveWindowToTheBackground();
  }
}

`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(2);
});
