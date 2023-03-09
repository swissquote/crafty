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

  builder => builder("confusing-browser-globals").package(),
  builder =>
    builder("eslint-import-resolver-node")
      .package()
      .externals(externals),
  builder =>
    builder("eslint-import-resolver-typescript")
      .package()
      .externals({
        ...externals,

        // TODO :: is enhanced-resolve already exported somewhere ?

        // no code path leverages this library
        open: "open"
      }),

  builder => builder("eslint-config-prettier").package(),

  builder =>
    builder("eslint-plugin-import")
      .package()
      .externals({
        // TODO :: should some big, unused, rules be excluded ?

        // Provided by this package
        typescript: "typescript",
        "typescript/package.json": "typescript/package.json",
        eslint: "eslint",
        "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
        "eslint/package.json": "eslint/package.json",
        "/eslint/lib(/.*)/": "eslint/lib$1",

        ...externals,

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
        // Provided by this package
        eslint: "eslint",
        "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
        "eslint/package.json": "eslint/package.json",
        "/eslint/lib(/.*)/": "eslint/lib$1",

        ...externals,

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
          "../../src/shims/string-prototype-matchall.js"

        // TODO :: consider replacing "doctrine" with "comment-parser" or "jsdoc-parse"
        //   https://www.npmjs.com/package/comment-parser
        //   https://www.npmjs.com/package/jsdoc-parse
        //   only used here in eslint-plugin-react
        //   https://github.com/jsx-eslint/eslint-plugin-react/blob/master/lib/util/componentUtil.js#L78
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
        // Provided by this package
        typescript: "typescript",
        "typescript/package.json": "typescript/package.json",
        eslint: "eslint",
        "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
        "eslint/package.json": "eslint/package.json",
        "/eslint/lib(/.*)/": "eslint/lib$1",

        // Provided by other Crafty package
        ...externals
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
  builder => builder("fast-diff").package(),
  // For prettier 2
  builder =>
    builder("eslint-plugin-prettier")
      .package()
      .externals({
        ...externals,
        prettier: "../prettier/index.js",
        "fast-diff": "../fast-diff/index.js"
      }),
  // For prettier 1
  builder =>
    builder("eslint-plugin-prettier")
      .package()
      .destination(`dist/eslint-plugin-prettier1/index.js`)
      .externals({
        ...externals,
        prettier: "../prettier1/index.js",
        "fast-diff": "../fast-diff/index.js"
      })
];
