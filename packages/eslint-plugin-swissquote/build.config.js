const fs = require("fs");
const { getExternals } = require("../../utils/externals");

const externals = getExternals();

const FAKE_PRETTIER_PARSER = "../../src/shims/prettier-parser.js";

module.exports = [
  () => {
    console.log("copy eslint-plugin-react-hooks");
    const src = require.resolve(
      "eslint-plugin-react-hooks/cjs/eslint-plugin-react-hooks.production.min.js"
    );

    fs.mkdirSync("dist/eslint-plugin-react-hooks", { recursive: true });

    fs.copyFileSync(src, "dist/eslint-plugin-react-hooks/index.js");
  },
  builder => builder("estraverse").package(),
  builder =>
    builder("is-core-module")
      .externals({
        has: "../has/index.js"
      })
      .package(),
  builder => builder("is-glob").package(),
  builder => builder("path-parse").package(),
  builder => builder("has").package(),
  builder => builder("confusing-browser-globals").package(),
  builder =>
    builder("eslint-import-resolver-node")
      .package()
      .externals({
        ...externals,

        "is-core-module": "../is-core-module/index.js",
        "path-parse": "../path-parse/index.js"
      }),
  builder =>
    builder("eslint-import-resolver-typescript")
      .package()
      .externals({
        ...externals,

        "is-core-module": "../is-core-module/index.js",
        "is-glob": "../is-glob/index.js",

        // TODO :: is enhanced-resolve already exported somewhere ?

        // no code path leverages this library
        open: "open"
      }),

  builder => builder("eslint-config-prettier").package(),
  builder =>
    builder("comment-parser")
      .package()
      .sourceFile(`module.exports = require("comment-parser/parser/index");`),

  builder =>
    builder("eslint-plugin-import")
      .package()
      .externals({
        ...externals,
        // TODO :: should some big, unused, rules be excluded ?

        // Provided by this package
        typescript: "typescript",
        "typescript/package.json": "typescript/package.json",
        eslint: "eslint",
        "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
        "eslint/package.json": "eslint/package.json",
        "/eslint/lib(/.*)/": "eslint/lib$1",

        "is-core-module": "../is-core-module/index.js",
        "is-glob": "../is-glob/index.js",
        has: "../has/index.js",

        // Replace polyfills that aren't needed
        "array-includes": "../../src/shims/array-includes.js",
        "array.prototype.flat": "../../src/shims/array-prototype-flat.js",
        "array.prototype.flatmap": "../../src/shims/array-prototype-flatmap.js",
        "object.values": "../../src/shims/object-values.js"
      }),

  builder =>
    builder("eslint-plugin-react")
      .package()
      .externals({
        ...externals,

        // Provided by this package
        eslint: "eslint",
        "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
        "eslint/package.json": "eslint/package.json",
        "/eslint/lib(/.*)/": "eslint/lib$1",

        estraverse: "../estraverse/index.js",
        "is-core-module": "../is-core-module/index.js",
        "path-parse": "../path-parse/index.js",

        // Replace functions that can be optimized
        "./report": "../../src/shims/eslint-plugin-react_report.js",
        "../util/report": "../../src/shims/eslint-plugin-react_report.js",

        // Replace polyfills that aren't needed
        "array-includes": "../../src/shims/array-includes.js",
        "array.prototype.flat": "../../src/shims/array-prototype-flat.js",
        "array.prototype.flatmap": "../../src/shims/array-prototype-flatmap.js",
        "array.prototype.tosorted":
          "../../src/shims/array-prototype-tosorted.js",
        "object.entries": "../../src/shims/object-entries.js",
        "object.fromentries": "../../src/shims/object-fromentries.js",
        "object.fromentries/polyfill":
          "../../src/shims/object-fromentries-polyfill.js",
        "object.hasown/polyfill": "../../src/shims/object-hasown-polyfill.js",
        "object.values": "../../src/shims/object-values.js",
        "string.prototype.matchall":
          "../../src/shims/string-prototype-matchall.js",
        doctrine: "../../src/shims/doctrine.js"
      }),

  builder =>
    builder("typescript-eslint")
      .packages(pkgBuilder => {
        pkgBuilder
          .package("@typescript-eslint/eslint-plugin", "typescriptEslintPlugin")
          .package("@typescript-eslint/parser", "typescriptEslintParser");
      })
      .options({
        sourceMap: false
      })
      .externals({
        // Provided by other Crafty packages
        ...externals,

        // Provided by this package
        typescript: "typescript",
        "typescript/package.json": "typescript/package.json",
        eslint: "eslint",
        "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
        "eslint/package.json": "eslint/package.json",
        "/eslint/lib(/.*)/": "eslint/lib$1",

        estraverse: "../estraverse/index.js",
        "is-glob": "../is-glob/index.js"
      }),

  // Prettier specific stuff

  builder =>
    builder("prettier")
      .package()
      .externals({
        // Provided by this package
        typescript: "typescript",

        ...externals,

        // We don't need most prettier parsers
        "./parser-angular.js": FAKE_PRETTIER_PARSER,
        "./parser-espree.js": FAKE_PRETTIER_PARSER,
        "./parser-glimmer.js": FAKE_PRETTIER_PARSER,
        "./parser-graphql.js": FAKE_PRETTIER_PARSER,
        "./parser-html.js": FAKE_PRETTIER_PARSER,
        "./parser-markdown.js": FAKE_PRETTIER_PARSER,
        "./parser-meriyah.js": FAKE_PRETTIER_PARSER,
        "./parser-postcss.js": FAKE_PRETTIER_PARSER,
        "./parser-flow.js": FAKE_PRETTIER_PARSER,
        "./parser-yaml.js": FAKE_PRETTIER_PARSER
      }),
  builder =>
    builder("prettier1")
      .package()
      .externals({
        // Provided by this package
        typescript: "typescript",

        // Don't know what we should do with this
        "@microsoft/typescript-etw": "@microsoft/typescript-etw",

        ...externals,

        // We don't need most prettier parsers
        "./parser-angular": FAKE_PRETTIER_PARSER,
        "./parser-flow": FAKE_PRETTIER_PARSER,
        "./parser-glimmer": FAKE_PRETTIER_PARSER,
        "./parser-graphql": FAKE_PRETTIER_PARSER,
        "./parser-html": FAKE_PRETTIER_PARSER,
        "./parser-markdown": FAKE_PRETTIER_PARSER,
        "./parser-postcss": FAKE_PRETTIER_PARSER,
        "./parser-yaml": FAKE_PRETTIER_PARSER
      }),
  builder => builder("prettier-linter-helpers").package()
];
