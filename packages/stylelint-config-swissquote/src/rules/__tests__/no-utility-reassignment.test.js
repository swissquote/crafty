const testRule = require("../../testUtils/ruleTester");
const { ruleName, messages } = require("../no-utility-reassignment");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: true,

  accept: [
    { description: "works on non-utility", code: ".somethingElse {}" },
    { description: "works on simple utility", code: ".u-okayDude {}" },
    { description: "works on simple utility 2", code: ".u-test {}" }
  ],

  reject: [
    {
      description: "Fails on utility with ID",
      code: "#something.u-test {}",
      column: 11,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on scoped utility",
      code: ".s-something .u-someUtility {}",
      column: 14,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on utility with type",
      code: "body .u-other {}",
      column: 6,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on nested utility",
      code: "body { .u-other {} }",
      column: 13,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on sub-assignment",
      code: ".u-other a {}",
      column: 1,
      line: 1,
      message: messages.rejected
    }
  ]
});
