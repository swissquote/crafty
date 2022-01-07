const test = require("ava");
const postcss = require("postcss");
const plugin = require("../src");
const replaceRuleSelector = require("../src/replaceRuleSelector");

function transform(css, options = {}) {
  return postcss(plugin(options)).process(css).css;
}

test("expose 'replaceRuleSelector' function (for postcss-custom-selectors)", (t) => {
  t.truthy(typeof replaceRuleSelector === "function");
});

test("should do nothing if there is no :matches", (t) => {
  t.deepEqual(transform("body {}"), "body {}");
});

test("should really do nothing if there is no :matches", (t) => {
  t.deepEqual(transform("body, matches {}"), "body, matches {}");
});

test("should transform simple :matches()", (t) => {
  t.deepEqual(transform(":matches(a, b) {}"), "a, b {}");
});

test("should transform directes :matches()", (t) => {
  t.deepEqual(
    transform("tag:matches(.class, .class2) {}"),
    "tag.class, tag.class2 {}"
  );
});

test("should transform :matches()", (t) => {
  t.deepEqual(
    transform("tag :matches(tag2, tag3) {}"),
    "tag tag2, tag tag3 {}"
  );
});

test("should transform mutltiples :matches()", (t) => {
  t.deepEqual(
    transform("tag :matches(tag2, tag3) :matches(tag4, tag5) {}"),
    "tag tag2 tag4, tag tag3 tag4, tag tag2 tag5, tag tag3 tag5 {}"
  );
});

test("should transform mutltiples :matches() with stuff after", (t) => {
  t.deepEqual(
    transform("tag :matches(tag2, tag3) :matches(tag4, tag5), test {}"),
    "tag tag2 tag4, tag tag3 tag4, tag tag2 tag5, tag tag3 tag5, test {}"
  );
});

test("should transform mutltiples :matches() with pseudo after", (t) => {
  t.deepEqual(
    transform(":matches(tag) :matches(tag2, tag3):hover {}"),
    "tag tag2:hover, tag tag3:hover {}"
  );
});

test("should transform :matches() recursively", (t) => {
  t.deepEqual(
    transform("tag :matches(tag2 :matches(tag4, tag5), tag3) {}"),
    "tag tag2 tag4, tag tag2 tag5, tag tag3 {}"
  );
});

test("should transform shit if you ask for shit ?", (t) => {
  t.deepEqual(transform("p:matches(a, span) {}"), "pa, pspan {}");
});

test("should transform childs with parenthesis", (t) => {
  t.deepEqual(
    transform(".foo:matches(:nth-child(-n+2), .bar) {}"),
    ".foo:nth-child(-n+2), .foo.bar {}"
  );
});

test("should works with lots of whitespace", (t) => {
  t.deepEqual(
    transform(`a:matches(
        .b,
        .c
      ) {}`),
    "a.b, a.c {}"
  );
});

test("should add line break if asked too", (t) => {
  t.deepEqual(
    transform(".foo:matches(:nth-child(-n+2), .bar) {}", { lineBreak: true }),
    ".foo:nth-child(-n+2),\n.foo.bar {}"
  );
});

test("should add line break if asked too, and respect indentation", (t) => {
  t.deepEqual(
    transform("  .foo:matches(:nth-child(-n+2), .bar) {}", {
      lineBreak: true,
    }),
    "  .foo:nth-child(-n+2),\n  .foo.bar {}"
  );
});

test("should add line break if asked too, and respect indentation even with \n", (t) => {
  t.deepEqual(
    transform("\n  .foo:matches(:nth-child(-n+2), .bar) {}", {
      lineBreak: true,
    }),
    "\n  .foo:nth-child(-n+2),\n  .foo.bar {}"
  );
});

test("should avoid duplicates", (t) => {
  t.deepEqual(
    transform(`
      button:matches(:hover, :active),
      .button:matches(:hover, :active) {}`),
    `
      button:hover, button:active, .button:hover, .button:active {}`
  );
});

test("should work with something after :matches()", (t) => {
  t.deepEqual(
    transform(".foo:matches(:hover, :focus)::before {}"),
    ".foo:hover::before, .foo:focus::before {}"
  );
});

test("should works correctly with adjacent selectors", (t) => {
  t.deepEqual(
    transform("article :matches(h1, h2, h3) + p {}"),
    "article h1 + p, article h2 + p, article h3 + p {}"
  );
});

test("should works correctly with adjacent selectors and line break", (t) => {
  t.deepEqual(
    transform("article :matches(h1, h2, h3) + p {}", { lineBreak: true }),
    `article h1 + p,
article h2 + p,
article h3 + p {}`
  );
});

test("should works correctly with a class and an element", (t) => {
  t.deepEqual(
    transform(".foo:matches(p) {color: red;}"),
    "p.foo {color: red;}"
  );
});

test("regression https://github.com/postcss/postcss-selector-matches/issues/10", (t) => {
  t.deepEqual(
    transform(".fo--oo > :matches(h1, h2, h3) {}"),
    ".fo--oo > h1, .fo--oo > h2, .fo--oo > h3 {}"
  );
});

test("regression https://github.com/postcss/postcss-selector-matches/issues/10 2", (t) => {
  t.deepEqual(
    transform(":matches(h4, h5, h6):hover .ba--z {}"),
    "h4:hover .ba--z, h5:hover .ba--z, h6:hover .ba--z {}"
  );
});

test("regression https://github.com/postcss/postcss-selector-matches/issues/10 3", (t) => {
  t.deepEqual(
    transform(":matches(a, b).foo, .bar {}"),
    "a.foo, b.foo, .bar {}"
  );
});
