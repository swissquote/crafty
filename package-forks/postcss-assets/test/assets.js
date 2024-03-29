/* eslint quotes: 0 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const test = require("ava");
const plugin = require("..");

function process(css, options, postcssOptions) {
  return postcss()
    .use(plugin(options))
    .process(css, { from: undefined, ...postcssOptions });
}

test("resolves urls", (t) =>
  process("a { b: resolve('picture.png') }", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  }).then((result) => {
    t.is(
      result.css,
      "a { b: url('http://example.com/wp-content/themes/images/picture.png') }"
    );
  }));

test("resolves urls from the current path", (t) =>
  process(
    "a { b: resolve('picture.png') }",
    {
      basePath: "test/fixtures",
      baseUrl: "http://example.com/wp-content/themes",
    },
    {
      from: path.resolve("test/fixtures/images/style.css"),
    }
  ).then((result) => {
    t.is(
      result.css,
      "a { b: url('http://example.com/wp-content/themes/images/picture.png') }"
    );
  }));

test("resolves relative urls from the current path", (t) =>
  process(
    "a { b: resolve('fonts/empty-sans.woff') }",
    {
      basePath: "test/fixtures",
      relative: true,
    },
    {
      from: path.resolve("test/fixtures/images/style.css"),
    }
  ).then((result) => {
    t.is(result.css, "a { b: url('../fonts/empty-sans.woff') }");
  }));

test("resolves relative urls from the provided path", (t) =>
  process("a { b: resolve('fonts/empty-sans.woff') }", {
    basePath: "test/fixtures",
    relative: "fonts",
  }).then((result) => {
    t.is(result.css, "a { b: url('empty-sans.woff') }");
  }));

test("busts cache when resolving urls", (t) =>
  process("a { b: resolve('picture.png') }", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    cachebuster(resolvedPath) {
      return fs.statSync(resolvedPath).size;
    },
    loadPaths: ["fonts", "images"],
  }).then((result) => {
    t.is(
      result.css,
      "a { b: url('http://example.com/wp-content/themes/images/picture.png?3061') }"
    );
  }));

test("throws when trying to resolve a non-existing file", (t) =>
  process("a { b: resolve('non-existing.gif') }").then(
    t.unreachable,
    (err) => {
      t.truthy(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
    }
  ));

test("inlines data", (t) =>
  process("a { b: inline('picture.png') }", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  }).then((result) => {
    t.is(result.css.slice(0, 32), "a { b: url('data:image/png;base6");
    t.is(result.css.slice(-32), "ufaJraBKlQAAAABJRU5ErkJggg==') }");
  }));

test("inlines svg unencoded", (t) =>
  process("a { b: inline('vector.svg') }", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  }).then((result) => {
    t.is(result.css.slice(0, 32), "a { b: url('data:image/svg+xml;c");
    t.is(result.css.slice(-32), "h80z%22%2F%3E%0A%3C%2Fsvg%3E') }");
  }));

test("throws when trying to inline a non-existing file", (t) =>
  process("a { b: inline('non-existing.gif') }").then(
    t.unreachable,
    (err) => {
      t.truthy(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
    }
  ));

test("measures images", (t) =>
  process(
    "a { " +
      "b: size('vector.svg'); " +
      "c: width('picture.png'); " +
      "d: height('picture.png'); " +
      "}",
    {
      basePath: "test/fixtures",
      loadPaths: ["fonts", "images"],
    }
  ).then((result) => {
    t.is(result.css, "a { b: 160px 120px; c: 200px; d: 57px; }");
  }));

test("measures images with set cache dimensions", (t) => {
  const options = {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
    cache: true,
  };
  return process(
    "a { " +
      "b: size('vector.svg'); " +
      "c: width('picture.png'); " +
      "d: height('picture.png'); " +
      "}",
    options
  ).then((firstResult) => {
    t.is(firstResult.css, "a { b: 160px 120px; c: 200px; d: 57px; }");

    return process(
      "a { " + "b: width('vector.svg'); " + "c: size('picture.png'); " + "}",
      options
    ).then((secondResult) => {
      t.is(secondResult.css, "a { b: 160px; c: 200px 57px; }");
    });
  });
});

test("measures images with density provided", (t) =>
  process(
    "a { " +
      "b: size('vector.svg', 2); " +
      "c: width('picture.png', 2); " +
      "d: height('picture.png', 2); " +
      "}",
    {
      basePath: "test/fixtures",
      loadPaths: ["fonts", "images"],
    }
  ).then((result) => {
    t.is(result.css, "a { b: 80px 60px; c: 100px; d: 28.5px; }");
  }));

test("throws when trying to measure a non-existing image", (t) =>
  process("a { b: size('non-existing.gif') }").then(
    t.unreachable,
    (err) => {
      t.truthy(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
    }
  ));

test("throws when trying to measure an unsupported file", (t) =>
  process("a { b: size('test/fixtures/fonts/empty-sans.woff') }").then(
    t.unreachable,
    (err) => {
      const absolutePath = path.resolve("test/fixtures/fonts/empty-sans.woff");
      t.truthy(err instanceof Error);
      t.is(err.message, `Empty file: ${absolutePath}`);
    }
  ));

test("throws when trying to measure an invalid file", (t) =>
  process("a { b: size('test/fixtures/images/invalid.jpg') }").then(
    t.unreachable,
    (err) => {
      const absolutePath = path.resolve("test/fixtures/images/invalid.jpg");
      t.truthy(err instanceof Error);
      t.is(err.message, `Invalid JPG, no size found: ${absolutePath}`);
    }
  ));

test("handles quotes and escaped characters", (t) =>
  process(
    "a {" +
      "b: resolve(picture.png);" +
      "c: resolve('picture.png');" +
      'd: resolve("picture.png");' +
      'e: resolve("\\70 icture.png");' +
      "}",
    {
      basePath: "test/fixtures/images",
    }
  ).then((result) => {
    t.is(
      result.css,
      "a {" +
        "b: url('/picture.png');" +
        "c: url('/picture.png');" +
        "d: url('/picture.png');" +
        "e: url('/picture.png');" +
        "}"
    );
  }));

test("allows usage inside media queries", (t) =>
  process(
    "@media a and (b: height('test/fixtures/images/picture.png')) { c { d: e }}"
  ).then((result) => {
    t.is(result.css, "@media a and (b: 57px) { c { d: e }}");
  }));
