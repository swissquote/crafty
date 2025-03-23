const testRule = require("../../testUtils/ruleTester");
const { ruleName, messages } = require("../no-hack-reassignment");

testRule({
  plugins: ["./index.js"],
  ruleName,
  config: true,

  accept: [
    { description: "works on non-hack", code: ".somethingElse {}" },
    { description: "works on simple hack", code: "._okayDude {}" },
    { description: "works on simple hack 2", code: "._test {}" }
  ],

  reject: [
    {
      description: "Fails on hack with ID",
      code: "#something._test {}",
      column: 11,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on scoped hack",
      code: ".s-something ._someUtility {}",
      column: 14,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on hack with type",
      code: "body ._other {}",
      column: 6,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on nested hack",
      code: "body { ._other {} }",
      column: 13,
      line: 1,
      message: messages.rejected
    },
    {
      description: "Fails on sub-assignment",
      code: "._other a {}",
      column: 1,
      line: 1,
      message: messages.rejected
    }
  ]
});
