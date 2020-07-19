/* global describe, it, expect */
var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-block-inside-block");

describe("no-block-inside-block", () => {
  it("Any nested Block shouldn't be OK", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 { .Component2 {} }"
    );
    expect(t).toEqual([
      {
        column: 15,
        line: 1,
        text: "A block should not depend on another block directly"
      }
    ]);
  });

  it("Block inside Element of another Block should not be allowed", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 { .Component1__element { .Component2 {}}}"
    );

    expect(t).toEqual([
      {
        column: 38,
        line: 1,
        text: "A block should not depend on another block directly"
      }
    ]);
  });

  it("Block inside Element with nesting selector of another Block should not be allowed", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 { & .Component1__element { .Component2 {} } }"
    );

    expect(t).toEqual([
      {
        column: 40,
        line: 1,
        text: "A block should not depend on another block directly"
      }
    ]);
  });

  it("Block selector in subling Element should not be allowed", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 { .Component1__element .Component2 {}}"
    );

    expect(t).toEqual([
      {
        column: 15,
        line: 1,
        text: "A block should not depend on another block directly"
      }
    ]);
  });

  it("Block selector in child Element should not be allowed", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 { .Component1__element > .Component2 {}}"
    );

    expect(t).toEqual([
      {
        column: 15,
        line: 1,
        text: "A block should not depend on another block directly"
      }
    ]);
  });

  it("Block selector with Element selector should be allowed", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component .Component__element {}"
    );
    expect(t).toEqual([]);
  });

  it("Element selector in Block should be allowed", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component { .Component__element {} }"
    );

    expect(t).toEqual([]);
  });

  it("Two independent blocks should be allowed", async () => {
    const t = await createRuleTester.test(
      rule,
      ".Component1 {} .Component2 {}"
    );
    expect(t).toEqual([]);
  });
});
