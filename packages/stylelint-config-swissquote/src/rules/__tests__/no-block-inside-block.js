var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-block-inside-block");

describe("tests for no-block-inside-block", () => {
  it("Any nested Block shouldn't be OK", () =>
    createRuleTester.test(rule, ".Component1 { .Component2 {} }").then(t =>
      expect(t).toEqual({
        warnings: 1,
        column: 15,
        line: 1,
        text: "A block should not depend on another block directly"
      })
    ));

  it("Block inside Element of another Block is not allowed", () =>
    createRuleTester.test(rule, ".Component1 { .Component1__element { .Component2 {}}}").then(t =>
      expect(t).toEqual({
        column: 38,
        line: 1,
        text: "A block should not depend on another block directly",
        warnings: 1
      })
    ));

  it("Block inside Element with nesting selector of another Block is not allowed", () =>
    createRuleTester.test(rule, ".Component1 { & .Component1__element { .Component2 {} } }").then(t =>
      expect(t).toEqual({
        column: 40,
        line: 1,
        text: "A block should not depend on another block directly",
        warnings: 1
      })
    ));

  it("Block selector in subling Element is not allowed", () =>
    createRuleTester.test(rule, ".Component1 { .Component1__element .Component2 {}}").then(t =>
      expect(t).toEqual({
        column: 15,
        line: 1,
        text: "A block should not depend on another block directly",
        warnings: 1
      })
    ));

  it("Block selector in child Element is not allowed", () =>
    createRuleTester.test(rule, ".Component1 { .Component1__element > .Component2 {}}").then(t =>
      expect(t).toEqual({
        column: 15,
        line: 1,
        text: "A block should not depend on another block directly",
        warnings: 1
      })
    ));

  it("Two independent blocks is allowed", () =>
    createRuleTester.test(rule, ".Component1 {} .Component2 {}").then(t => expect(t).toEqual({ warnings: 0 })));
});
