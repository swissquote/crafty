const test = require("ava");

var createRuleTester = require("../../testUtils/createRuleTester");
var rule = require("../no-type-outside-scope");

test("works on class", async t => {
  const result = await createRuleTester.test(rule, ".somethingElse {}");
  t.deepEqual(result, []);
});

test("works on id", async t => {
  const result = await createRuleTester.test(rule, "#someId {}");
  t.deepEqual(result, []);
});

test("works on mixed, class-id", async t => {
  const result = await createRuleTester.test(rule, ".someClass #someId {}");
  t.deepEqual(result, []);
});

test("works on mixed, id-class", async t => {
  const result = await createRuleTester.test(rule, "#someId .someClass {}");
  t.deepEqual(result, []);
});

test("works on mixed, idclass", async t => {
  const result = await createRuleTester.test(rule, "#someId.someClass {}");
  t.deepEqual(result, []);
});

test("works on nested with parent selector", async t => {
  const result = await createRuleTester.test(rule, "section { .s-scope & {} }");
  t.deepEqual(result, []);
});

test("works on scoped class", async t => {
  const result = await createRuleTester.test(rule, ".s-something h1 {}");
  t.deepEqual(result, []);
});

test("works on nested scoped class", async t => {
  const result = await createRuleTester.test(rule, ".s-something { h1 {} }");
  t.deepEqual(result, []);
});

test("works on multiple types after scope", async t => {
  const result = await createRuleTester.test(rule, ".s-something ul li {}");
  t.deepEqual(result, []);
});

test("Fails on type", async t => {
  const result = await createRuleTester.test(rule, "header {}");
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on type with compound class", async t => {
  const result = await createRuleTester.test(rule, "header.class {}");
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on type with compund class, nested", async t => {
  const result = await createRuleTester.test(rule, "header { &.class {} }");
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on type with class", async t => {
  const result = await createRuleTester.test(rule, "header.class {}");
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on class with type", async t => {
  const result = await createRuleTester.test(rule, ".class header {}");
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on nested with parent selector", async t => {
  const result = await createRuleTester.test(
    rule,
    "section { .not-a-scope & {} }"
  );
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails once multiple selectors", async t => {
  const result = await createRuleTester.test(
    rule,
    "header.class, .s-hey header {}"
  );
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails on multiple selectors 2", async t => {
  const result = await createRuleTester.test(
    rule,
    "header.class {} .s-hey { header {} }"
  );
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});

test("Fails only once for multiple selectors", async t => {
  // This is a tricky case, here the `a:focus` is the case
  // That should trigger the rule
  // But since we check with the nested elements as well,
  // we must make sure that it reports the error only once
  const result = await createRuleTester.test(
    rule,
    `.Section--news a:focus {
        .MediaObject, .MediaObject__content {
            overflow: visible;
        }
      }`
  );
  t.deepEqual(result, [
    {
      column: 1,
      line: 1,
      text: rule.messages.rejected
    }
  ]);
});
