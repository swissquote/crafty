/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(require("../best-practices"), {
  env: { browser: true }
});

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

function test() { "use strict"; fetch("This is spartaaa"); }

test()

`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});

it("Doesn't work with ES6", () => {
  const result = lint(
    engine,
    `

const something = [];

something.push("a value");

`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(1);
});

it("Uses sonar plugin", () => {
  const result = lint(
    engine,
    `
/* global openWindow, closeWindow, moveWindowToTheBackground */

function changeWindow(param) {
  "use strict";
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
  expect(result.errorCount).toBe(1);
});
