const fs = require("fs");
const path = require("path");

const { getExternals } = require("../../utils/externals");

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
  "style-search",
  "supports-color",
  "supports-hyperlinks",
  "table",
];

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),

  ...Object.fromEntries(
    singlePackages.map((pkg) => [pkg, `../${pkg}/index.js`])
  ),

  "@ronilaukkarinen/gulp-stylelint": "../ronilaukkarinen-gulp-stylelint/index.js",

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

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

const formatters = fs
  .readdirSync(
    path.dirname(require.resolve("stylelint/lib/formatters/index.js"))
  )
  .filter((file) => file != "index.js")
  .map((file) => (builder) =>
    builder(`stylelint-formatters-${file.replace(".js", "")}`)
      .source(
        path.relative(
          process.cwd(),
          require.resolve(`stylelint/lib/formatters/${file}`)
        )
      )
      .destination(`dist/stylelint/${file}`)
      .options({
        sourceMap: false,
        externals,
      })
  );

const ruleExternals = {
  ...externals,
};

const stylelintSource = [];

stylelintSource.push({
  pkg: "stylelint",
  name: "stylelint",
  entryFile: `dist/stylelint/index.js`,
});

stylelintSource.push({
  pkg: "stylelint/bin/stylelint",
  name: "stylelintBin",
  entryFile: `dist/stylelint/bin.js`,
});

stylelintSource.push({
  pkg: "stylelint/lib/reference/atKeywords.js",
  name: "libReferenceAtKeywords",
  entryFile: `dist/stylelint/reference-atKeywords.js`,
});
ruleExternals["../../reference/atKeywords"] = "./reference-atKeywords.js";

stylelintSource.push({
  pkg: "stylelint/lib/reference/functions.js",
  name: "libReferenceFunctions",
  entryFile: `dist/stylelint/reference-functions.js`,
});
ruleExternals["../../reference/functions"] = "./reference-functions.js";

stylelintSource.push({
  pkg: "stylelint/lib/reference/keywords.js",
  name: "libReferenceKeywords",
  entryFile: `dist/stylelint/reference-keywords.js`,
});
ruleExternals["../../reference/keywords"] = "./reference-keywords.js";

stylelintSource.push({
  pkg: "stylelint/lib/reference/mediaFeatures.js",
  name: "libReferenceMediaFeatures",
  entryFile: `dist/stylelint/reference-mediaFeatures.js`,
});
ruleExternals["../../reference/mediaFeatures"] = "./reference-mediaFeatures.js";

stylelintSource.push({
  pkg: "stylelint/lib/reference/properties.js",
  name: "libReferenceProperties",
  entryFile: `dist/stylelint/reference-properties.js`,
});
ruleExternals["../../reference/properties"] = "./reference-properties.js";

stylelintSource.push({
  pkg: "stylelint/lib/reference/selectors.js",
  name: "libReferenceSelectors",
  entryFile: `dist/stylelint/reference-selectors.js`,
});
ruleExternals["../../reference/selectors"] = "./reference-selectors.js";

stylelintSource.push({
  pkg: "stylelint/lib/reference/units.js",
  name: "libReferenceUnits",
  entryFile: `dist/stylelint/reference-units.js`,
});
ruleExternals["../../reference/units"] = "./reference-units.js";

const stylelintRules = fs
  .readdirSync(path.dirname(require.resolve("stylelint/lib/rules/index.js")))
  .filter((file) => file != "index.js");

const rules = stylelintRules
  .map((file) => {
    if (file.includes(".js")) {
      ruleExternals[`../${file.replace(".js", "")}`] = `./rule-util-${file}`;
      //ruleExternals[`stylelint/lib/rules/${file}`] = `./${file}`;

      const functionName = file.replace(".js", "").replace(/-/g, "_");
      stylelintSource.push({
        pkg: `stylelint/lib/rules/${file}`,
        name: functionName,
        entryFile: `dist/stylelint/rule-util-${file}`,
      });

      return false;
    }

    return (builder) =>
      builder(`stylelint-rules-${file.replace(".js", "")}`)
        .source(
          path.relative(
            process.cwd(),
            require.resolve(`stylelint/lib/rules/${file}`)
          )
        )
        .destination(
          file.includes(".js")
            ? `dist/stylelint/${file}`
            : `dist/stylelint/${file}.js`
        )
        .options({
          sourceMap: false,
          externals: ruleExternals,
        });
  })
  .filter(Boolean);

const stylelintUtils = fs
  .readdirSync(
    path.dirname(require.resolve("stylelint/lib/utils/arrayEqual.js"))
  )
  .filter((file) => file.includes(".js"));

stylelintUtils.forEach((file) => {
  // Create externals to refer to the util
  ruleExternals[`../../utils/${file.replace(".js", "")}`] = `./util-${file}`;

  const functionName = file.replace(".js", "").replace(/-/g, "_");

  stylelintSource.push({
    pkg: `stylelint/lib/utils/${file}`,
    name: functionName,
    entryFile: `dist/stylelint/util-${file}`,
  });
});

module.exports = [
  (builder) =>
    builder("stylelint")
      .packages((pkgBuilder) => {
        stylelintSource.forEach((entry) => {
          pkgBuilder.package(entry.pkg, entry.name, entry.entryFile);
        });
      })
      .destination(`dist/stylelint/stylelint.js`)
      .externals(externals),
  (builder) => {
    const newExternals = { ...externals };
    delete newExternals["@ronilaukkarinen/gulp-stylelint"];

    return builder("@ronilaukkarinen/gulp-stylelint")
      .package()
      .externals({ ...newExternals, stylelint: "../stylelint/index.js" });
  },

  ...singlePackages.map((pkg) => {
    const newExternals = { ...externals };
    delete newExternals[pkg];

    return (builder) =>
      builder(pkg)
        .package()
        .externals(newExternals);
  }),
  ...formatters,
  ...rules
];
