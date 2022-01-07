const test = require("ava");

var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-block-inside-block");

test("Any nested Block shouldn't be OK", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component1 { .Component2 {} }"
  );
  t.deepEqual(result, [
    {
      column: 15,
      line: 1,
      text: "A block should not depend on another block directly"
    }
  ]);
});

test("Block inside Element of another Block should not be allowed", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component1 { .Component1__element { .Component2 {}}}"
  );

  t.deepEqual(result, [
    {
      column: 38,
      line: 1,
      text: "A block should not depend on another block directly"
    }
  ]);
});

test("Block inside Element with nesting selector of another Block should not be allowed", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component1 { & .Component1__element { .Component2 {} } }"
  );

  t.deepEqual(result, [
    {
      column: 40,
      line: 1,
      text: "A block should not depend on another block directly"
    }
  ]);
});

test("Block selector in subling Element should not be allowed", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component1 { .Component1__element .Component2 {}}"
  );

  t.deepEqual(result, [
    {
      column: 15,
      line: 1,
      text: "A block should not depend on another block directly"
    }
  ]);
});

test("Block selector in child Element should not be allowed", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component1 { .Component1__element > .Component2 {}}"
  );

  t.deepEqual(result, [
    {
      column: 15,
      line: 1,
      text: "A block should not depend on another block directly"
    }
  ]);
});

test("Block selector with Element selector should be allowed", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component .Component__element {}"
  );
  t.deepEqual(result, []);
});

test("Element selector in Block should be allowed", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component { .Component__element {} }"
  );

  t.deepEqual(result, []);
});

test("Two independent blocks should be allowed", async t => {
  const result = await createRuleTester.test(
    rule,
    ".Component1 {} .Component2 {}"
  );
  t.deepEqual(result, []);
});
