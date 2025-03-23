const testRule = require("../../testUtils/ruleTester");
const { ruleName } = require("../no-negative-var");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: true,

  accept: [
    {
      description: "normal vars don't trigger",
      code: ".Component1 { margin: var(--test); }"
    }
  ],

  reject: [
    {
      description: "negative vars fail",
      code: ".Component1 { margin: -var(--test); }",
      column: 23,
      line: 1,
      message: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
    },
    {
      description: "negative var fails on multi vars",
      code:
        ".Component1 { margin: var(--Component-margin) -var(--Component-margin); }",
      column: 47,
      line: 1,
      message: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
    }
  ]
});
