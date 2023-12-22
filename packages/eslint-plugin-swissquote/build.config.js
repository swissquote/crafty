const fs = require("fs");
const path = require("path");
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
  builder => builder("sync-threads").package(),
  builder => builder("estraverse").package(),
  builder => builder("function-bind").package(),
  builder =>
    builder("hasown")
      .externals({
        "function-bind": "../function-bind/index.js"
      })
      .package(),
  builder => builder("merge2").package(),
  builder =>
    builder("is-core-module")
      .externals({
        hasown: "../hasown/index.js"
      })
      .package(),
  builder => builder("is-extglob").package(),
  builder =>
    builder("is-glob")
      .externals({
        "is-extglob": "../is-glob/index.js"
      })
      .package(),
  builder =>
    builder("fast-glob")
      .externals({
        merge2: "../merge2/index.js",
        "is-extglob": "../is-glob/index.js",
        "is-glob": "../is-glob/index.js"
      })
      .package(),
  builder => builder("path-parse").package(),
  builder => builder("get-tsconfig").package(),
  builder =>
    builder("eslint-module-utils")
      .packages(pkgBuilder => {
        pkgBuilder
          .package(
            "eslint-module-utils/resolve",
            "resolve",
            "dist/eslint-module-utils/resolve.js"
          )
          .package(
            "eslint-module-utils/hash",
            "hash",
            "dist/eslint-module-utils/hash.js"
          )
          .package(
            "eslint-module-utils/pkgUp",
            "pkgUp",
            "dist/eslint-module-utils/pkgUp.js"
          )
          .package(
            "eslint-module-utils/readPkgUp",
            "readPkgUp",
            "dist/eslint-module-utils/readPkgUp.js"
          )
          .package(
            "eslint-module-utils/ModuleCache",
            "ModuleCache",
            "dist/eslint-module-utils/ModuleCache.js"
          );
      })
      .options({
        sourceMap: false
      }),
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

        "fast-glob": "../fast-glob/index.js",
        "is-core-module": "../is-core-module/index.js",
        "is-glob": "../is-glob/index.js",
        "eslint-module-utils/hash.js": "../eslint-module-utils/hash",
        "get-tsconfig": "../get-tsconfig/index.js",

        // TODO :: is enhanced-resolve already exported somewhere ?

        // no code path uses this library
        open: "open"
      }),

  builder => builder("eslint-config-prettier").package(),
  builder =>
    builder("comment-parser")
      .package()
      .sourceFile(`module.exports = require("comment-parser/parser/index");`),

  builder =>
    builder("eslint-plugin-i")
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
        "is-glob": "../is-glob/index.js",
        "get-tsconfig": "../get-tsconfig/index.js",
        "eslint-module-utils/readPkgUp": "../eslint-module-utils/readPkgUp.js",
        "eslint-module-utils/pkgUp": "../eslint-module-utils/pkgUp.js",
        "eslint-module-utils/resolve": "../eslint-module-utils/resolve.js",
        "eslint-module-utils/hash": "../eslint-module-utils/hash.js",
        "eslint-module-utils/ModuleCache":
          "../eslint-module-utils/ModuleCache.js"
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

        "function-bind": "../function-bind/index.js",
        hasown: "../hasown/index.js",
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
        "typescript/lib/tsserverlibrary": "typescript/lib/tsserverlibrary",
        eslint: "eslint",
        "eslint/use-at-your-own-risk": "eslint/use-at-your-own-risk",
        "eslint/package.json": "eslint/package.json",
        "/eslint/lib(/.*)/": "eslint/lib$1",

        merge2: "../merge2/index.js",
        "fast-glob": "../fast-glob/index.js",
        estraverse: "../estraverse/index.js",
        "is-glob": "../is-glob/index.js"
      }),

  // Prettier specific stuff
  () => {
    console.log("Copy prettier 3");
    const src = path.dirname(require.resolve("prettier/package.json"));

    fs.mkdirSync("dist/prettier/plugins", { recursive: true });

    // We only copy the plugins we need
    const files = [
      "index.mjs",
      "doc.mjs",
      "plugins/typescript.mjs",
      "plugins/babel.mjs",
      "plugins/estree.mjs"
    ];

    for (const file of files) {
      fs.copyFileSync(path.join(src, file), path.join("dist/prettier", file));
    }
  },
  builder =>
    builder("prettier2")
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
