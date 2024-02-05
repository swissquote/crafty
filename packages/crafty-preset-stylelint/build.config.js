import fs from "fs";
import path from "path";
import { createRequire } from "node:module";
import { getExternals } from "../../utils/externals.js";

const require = createRequire(import.meta.url);
const stylelintLib = path.join(
  path.dirname(require.resolve("stylelint/package.json")),
  "lib"
);

const singlePackages = [
  "balanced-match",
  "color-convert",
  "gulp-postcss",
  "gulp-rename",
  "is-fullwidth-code-point",
  "is-plain-object",
  "postcss-media-query-parser",
  "resolve-from",
  "slice-ansi",
  "string-width",
  "supports-color",
  "supports-hyperlinks",
  "table",
  "css-tree",
  "@csstools/selector-specificity",
  "mathml-tag-names",
  "known-css-properties",
  "svg-tags",
  "has-flag",
  "css-functions-list",
];

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),

  ...Object.fromEntries(
    singlePackages.map((pkg) => [pkg, `../${pkg.replace("@", "").replace("/", "-")}/index.mjs`])
  ),

  "@ronilaukkarinen/gulp-stylelint":
    "../ronilaukkarinen-gulp-stylelint/index.js",

  "schema-utils": "schema-utils",
  postcss: "postcss",
  "postcss/package.json": "postcss/package.json",
  "/postcss/lib(/.*)/": "postcss/lib$1",
  "@babel/code-frame": "@babel/code-frame",

  // Provide a simplified package data normalizer
  "normalize-package-data": "../../packages/normalize-package-data.js",

  // Not used as we pass the configuration directly, can be excluded from the bundle
  "postcss-load-config": "../../src/dummy.js",
  cosmiconfig: "../../src/dummy.js",
};

const ruleExternals = {
  ...externals,
  "@csstools/media-query-list-parser": "../csstools/media-query-list-parser.js",
  "@csstools/css-tokenizer": "../csstools/css-tokenizer.js",
  "@csstools/css-parser-algorithms": "../csstools/css-parser-algorithms.js",
  "colord": "../colord/index.js",
  "colord/plugins/names": "../colord/plugin-names.js",
  "colord/plugins/hwb": "../colord/plugin-hwb.js",
  "colord/plugins/lab": "../colord/plugin-lab.js",
  "colord/plugins/lch": "../colord/plugin-lch.js"
};

const stylelintSource = [];

stylelintSource.push({
  pkg: "stylelint/lib/index.mjs",
  name: "stylelint",
  entryFile: `dist/stylelint/index.js`,
});

stylelintSource.push({
  pkg: "stylelint/bin/stylelint.mjs",
  name: "stylelintBin",
  entryFile: `dist/stylelint/bin.js`,
});

// Extract all references
// ----------------------
fs.readdirSync(path.join(stylelintLib, "reference"))
  .filter((file) => !file.startsWith("index."))
  .filter((file) => file.includes(".mjs"))
  .forEach((file) => {
    const destFile = file.replace(".mjs", ".js");
    ruleExternals[`../../reference/${file}`] = `./reference-${destFile}`;

    const functionName = file.replace(".mjs", "").replace(/-/g, "_");

    stylelintSource.push({
      pkg: `stylelint/lib/reference/${file}`,
      name: functionName,
      entryFile: `dist/stylelint/reference-${destFile}`,
    });
  });

// Extract all formatters
// ----------------------
const formatters = fs
  .readdirSync(path.join(stylelintLib, "formatters"))
  .filter((file) => !file.startsWith("index."))
  .filter((file) => file.includes(".mjs"))
  .map((file) => {
    ruleExternals[`./${file}`] = `./${file}.js`;

    return (builder) =>
      builder(`stylelint-formatters-${file.replace(".mjs", "")}`)
        .esm()
        .source(
          path.relative(
            process.cwd(),
            path.join(stylelintLib, "formatters", file)
          )
        )
        .destination(`dist/stylelint/${file}.js`)
        .options({
          sourceMap: false,
          externals: ruleExternals,
        });
  });

// Extract linting rules and utilities
// -----------------------------------

const stylelintRules = fs
  .readdirSync(path.join(stylelintLib, "rules"))
  .filter((file) => !file.startsWith("index."));

const rules = stylelintRules
  .map((file) => {
    // Actual rules are inside folders
    ruleExternals[`./${file}/index.mjs`] = `./${file}.js`;
    return (builder) =>
      builder(`stylelint-rules-${file}`)
        .esm()
        .source(
          path.relative(
            process.cwd(),
            path.join(stylelintLib, "rules", file, "index.mjs")
          )
        )
        .destination(`dist/stylelint/${file}.js`)
        .options({
          sourceMap: false,
          externals: ruleExternals,
        });
  })
  .filter(Boolean);

const stylelintUtils = fs
  .readdirSync(path.join(stylelintLib, "utils"))
  .filter((file) => file.includes(".mjs"));

stylelintUtils.forEach((file) => {
  const destFile = file.replace(".mjs", ".js");
  // Create externals to refer to the util
  ruleExternals[`../../../utils/${file}`] = `./util-${destFile}`;
  ruleExternals[`../../utils/${file}`] = `./util-${destFile}`;
  ruleExternals[`../utils/${file}`] = `./util-${destFile}`;

  const functionName = file.replace(".mjs", "").replace(/-/g, "_");

  const element = {
    pkg: `stylelint/lib/utils/${file}`,
    name: functionName,
    entryFile: `dist/stylelint/util-${destFile}`,
  }
  console.log(element)

  stylelintSource.push(element);
});

export default [
  (builder) => {
    const newExternals = { ...externals };
    delete newExternals["@ronilaukkarinen/gulp-stylelint"];

    return builder("@ronilaukkarinen/gulp-stylelint")
      .esm()
      .package()
      .externals({ ...newExternals, stylelint: "../stylelint/index.js" });
  },
  (builder) =>
    builder("csstools")
      .esm()
      .packages((pkgBuilder) => {
        pkgBuilder
          .package(
            "@csstools/media-query-list-parser",
            "mediaQueryListParser",
            "dist/csstools/media-query-list-parser.js"
          )
          .package(
            "@csstools/css-tokenizer",
            "cssTokenizer",
            "dist/csstools/css-tokenizer.js"
          )
          .package(
            "@csstools/css-parser-algorithms",
            "cssParserAlgorithms",
            "dist/csstools/css-parser-algorithms.js"
          );
      })
      .destination(`dist/csstools/index.js`)
      .externals(externals),
  (builder) =>
    builder("colord")
      .esm()
      .packages((pkgBuilder) => {
        const colordPath = path.dirname(require.resolve("colord/package.json"));

        pkgBuilder
          .package(
            path.join(colordPath, "index.mjs"),
            "colord",
            "dist/colord/index.js"
          )
          .package(
            path.join(colordPath, "plugins", "names.mjs"),
            "pluginNames",
            "dist/colord/plugin-names.js"
          )
          .package(
            path.join(colordPath, "plugins", "hwb.mjs"),
            "pluginHwb",
            "dist/colord/plugin-hwb.js"
          )
          .package(
            path.join(colordPath, "plugins", "lab.mjs"),
            "pluginLab",
            "dist/colord/plugin-lab.js"
          )
          .package(
            path.join(colordPath, "plugins", "lch.mjs"),
            "pluginLch",
            "dist/colord/plugin-lch.js"
          );
      })
      .destination(`dist/colord/bundle.js`),
  (builder) =>
    builder("stylelint")
      .esm()
      .packages((pkgBuilder) => {
        stylelintSource.forEach((entry) => {
          pkgBuilder.package(entry.pkg, entry.name, entry.entryFile);
        });
      })
      .destination(`dist/stylelint/bundle.js`)
      .extendConfig((config) => {
        // Ignoring exports fields
        config.resolve.exportsFields = [];

        const postcssPath = path.dirname(
          require.resolve("postcss/package.json")
        );

        config.resolve.alias = {
          postcss: path.join(postcssPath, "lib", "postcss.mjs"),
          "postcss/lib/lazy-result": path.join(
            postcssPath,
            "lib",
            "lazy-result.js"
          ),
          "postcss/lib/result": path.join(postcssPath, "lib", "result.js"),
          meow: require.resolve("meow"),
        };
      })
      .externals(ruleExternals),
  ...singlePackages.map((pkg) => {
    const newExternals = { ...externals };
    delete newExternals[pkg];

    return (builder) => builder(pkg).esm().package().externals(newExternals);
  }),
  ...formatters,
  ...rules,
];
