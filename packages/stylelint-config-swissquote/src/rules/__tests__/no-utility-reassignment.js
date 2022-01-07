const test = require("ava");

var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-utility-reassignment");

test("works on non-utility", async t => {
  const result = await createRuleTester.test(rule, ".somethingElse {}");
  t.deepEqual(result, []);
});

test("works on simple utility", async t => {
  const result = await createRuleTester.test(rule, ".u-okayDude {}");
  t.deepEqual(result, []);
});

test("works on simple utility 2", async t => {
  const result = await createRuleTester.test(rule, ".u-test {}");
  t.deepEqual(result, []);
});

test("Fails on utility with ID", async t => {
  const result = await createRuleTester.test(rule, "#something.u-test {}");
  t.deepEqual(result, [
    {
      column: 11,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on scoped utility", async t => {
  const result = await createRuleTester.test(
    rule,
    ".s-something .u-someUtility {}"
  );
  t.deepEqual(result, [
    {
      column: 14,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on utility with type", async t => {
  const result = await createRuleTester.test(rule, "body .u-other {}");
  t.deepEqual(result, [
    {
      column: 6,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on nested utility", async t => {
  const result = await createRuleTester.test(rule, "body { .u-other {} }");
  t.deepEqual(result, [
    {
      column: 13,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on sub-assignment", async t => {
  const result = await createRuleTester.test(rule, ".u-other a {}");
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});
