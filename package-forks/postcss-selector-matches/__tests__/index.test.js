const { test } = require("node:test");
const { expect } = require("expect");
const postcss = require("postcss");
const plugin = require("../src");
const replaceRuleSelector = require("../src/replaceRuleSelector");

function transform(css, options = {}) {
  return postcss(plugin(options)).process(css).css;
}

test("expose 'replaceRuleSelector' function (for postcss-custom-selectors)", () => {
  expect(typeof replaceRuleSelector).toBe("function");
});

test("should do nothing if there is no :matches", () => {
  expect(transform("body {}")).toBe("body {}");
});

test("should really do nothing if there is no :matches", () => {
  expect(transform("body, matches {}")).toBe("body, matches {}");
});

test("should transform simple :matches()", () => {
  expect(transform(":matches(a, b) {}")).toBe("a, b {}");
});

test("should transform directes :matches()", () => {
  expect(transform("tag:matches(.class, .class2) {}")).toBe(
    "tag.class, tag.class2 {}"
  );
});

test("should transform :matches()", () => {
  expect(transform("tag :matches(tag2, tag3) {}")).toBe(
    "tag tag2, tag tag3 {}"
  );
});

test("should transform mutltiples :matches()", () => {
  expect(transform("tag :matches(tag2, tag3) :matches(tag4, tag5) {}")).toBe(
    "tag tag2 tag4, tag tag3 tag4, tag tag2 tag5, tag tag3 tag5 {}"
  );
});

test("should transform mutltiples :matches() with stuff after", () => {
  expect(
    transform("tag :matches(tag2, tag3) :matches(tag4, tag5), test {}")
  ).toBe("tag tag2 tag4, tag tag3 tag4, tag tag2 tag5, tag tag3 tag5, test {}");
});

test("should transform mutltiples :matches() with pseudo after", () => {
  expect(transform(":matches(tag) :matches(tag2, tag3):hover {}")).toBe(
    "tag tag2:hover, tag tag3:hover {}"
  );
});

test("should transform :matches() recursively", () => {
  expect(
    transform("tag :matches(tag2 :matches(tag4, tag5), tag3) {}")
  ).toBe("tag tag2 tag4, tag tag2 tag5, tag tag3 {}");
});

test("should transform shit if you ask for shit ?", () => {
  expect(transform("p:matches(a, span) {}")).toBe("pa, pspan {}");
});

test("should transform childs with parenthesis", () => {
  expect(transform(".foo:matches(:nth-child(-n+2), .bar) {}")).toBe(
    ".foo:nth-child(-n+2), .foo.bar {}"
  );
});

test("should works with lots of whitespace", () => {
  expect(
    transform(`a:matches(
        .b,
        .c
      ) {}`)
  ).toBe("a.b, a.c {}");
});

test("should add line break if asked too", () => {
  expect(
    transform(".foo:matches(:nth-child(-n+2), .bar) {}", { lineBreak: true })
  ).toBe(".foo:nth-child(-n+2),\n.foo.bar {}");
});

test("should add line break if asked too, and respect indentation", () => {
  expect(
    transform("  .foo:matches(:nth-child(-n+2), .bar) {}", {
      lineBreak: true,
    })
  ).toBe("  .foo:nth-child(-n+2),\n  .foo.bar {}");
});

test("should add line break if asked too, and respect indentation even with \n", () => {
  expect(
    transform("\n  .foo:matches(:nth-child(-n+2), .bar) {}", {
      lineBreak: true,
    })
  ).toBe("\n  .foo:nth-child(-n+2),\n  .foo.bar {}");
});

test("should avoid duplicates", () => {
  expect(
    transform(`
      button:matches(:hover, :active),
      .button:matches(:hover, :active) {}`)
  ).toBe(`
      button:hover, button:active, .button:hover, .button:active {}`);
});

test("should work with something after :matches()", () => {
  expect(transform(".foo:matches(:hover, :focus)::before {}")).toBe(
    ".foo:hover::before, .foo:focus::before {}"
  );
});

test("should works correctly with adjacent selectors", () => {
  expect(transform("article :matches(h1, h2, h3) + p {}")).toBe(
    "article h1 + p, article h2 + p, article h3 + p {}"
  );
});

test("should works correctly with adjacent selectors and line break", () => {
  expect(
    transform("article :matches(h1, h2, h3) + p {}", { lineBreak: true })
  ).toBe(`article h1 + p,
article h2 + p,
article h3 + p {}`);
});

test("should works correctly with a class and an element", () => {
  expect(transform(".foo:matches(p) {color: red;}")).toBe(
    "p.foo {color: red;}"
  );
});

test("regression https://github.com/postcss/postcss-selector-matches/issues/10", () => {
  expect(transform(".fo--oo > :matches(h1, h2, h3) {}")).toBe(
    ".fo--oo > h1, .fo--oo > h2, .fo--oo > h3 {}"
  );
});

test("regression https://github.com/postcss/postcss-selector-matches/issues/10 2", () => {
  expect(transform(":matches(h4, h5, h6):hover .ba--z {}")).toBe(
    "h4:hover .ba--z, h5:hover .ba--z, h6:hover .ba--z {}"
  );
});

test("regression https://github.com/postcss/postcss-selector-matches/issues/10 3", () => {
  expect(transform(":matches(a, b).foo, .bar {}")).toBe(
    "a.foo, b.foo, .bar {}"
  );
});
