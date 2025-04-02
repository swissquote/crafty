import { getExternals } from "../../utils/externals.js";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const stylelintPkg = require.resolve("stylelint/package.json");

const externals = {
  // Provided by other Crafty packages
  ...getExternals(true),

  // Better to use the external version
  postcss: "commonjs postcss",
  "postcss/package.json": "postcss/package.json",
  "/postcss/lib(/.*)/": "postcss/lib$1",

  "@babel/code-frame": "commonjs @babel/code-frame",

  // Not used as we pass the configuration directly, can be excluded from the bundle
  "postcss-load-config": "../../shims/cosmiconfig.js",
  cosmiconfig: "../../shims/cosmiconfig.js",

  "postcss-selector-parser": "../postcss-selector-parser/index.js",
  "postcss-value-parser": "../postcss-value-parser/index.js",
  "postcss-resolve-nested-selector":
    "../postcss-resolve-nested-selector/index.js",
  "css-tree": "../css-tree/index.js",
  "fastest-levenshtein": "../fastest-levenshtein/index.js",
  "known-css-properties": "../known-css-properties/index.js",

  // The exports of this package act weird, so we use our own export
  stylelint: "../../packages/stylelint.js"
};

function externalsFor(pkg) {
  return Object.fromEntries(
    Object.entries(externals).filter(([key]) => {
      return !(key.startsWith(`${pkg}/`) || key === pkg);
    })
  );
}

const stylelintSource = [
  {
    pkg: "stylelint/lib/utils/nodeFieldIndices.mjs",
    name: ["declarationValueIndex"],
    entryFile: "dist/stylelint/utils-nodeFieldIndices.js"
  },
  {
    pkg: "stylelint/lib/utils/isStandardSyntaxFunction.mjs",
    name: "isStandardSyntaxFunction",
    entryFile: "dist/stylelint/utils-isStandardSyntaxFunction.js"
  },
  {
    pkg: "stylelint/lib/utils/isStandardSyntaxRule.mjs",
    name: "isStandardSyntaxRule",
    entryFile: "dist/stylelint/utils-isStandardSyntaxRule.js"
  },
  {
    pkg: "stylelint/lib/utils/isStandardSyntaxSelector.mjs",
    name: "isStandardSyntaxSelector",
    entryFile: "dist/stylelint/utils-isStandardSyntaxSelector.js"
  },
  {
    pkg: "stylelint/lib/utils/isKeyframeSelector.mjs",
    name: "isKeyframeSelector",
    entryFile: "dist/stylelint/utils-isKeyframeSelector.js"
  },
  {
    pkg: "stylelint/lib/utils/optionsMatches.mjs",
    name: "optionMatches",
    entryFile: "dist/stylelint/utils-optionsMatches.js"
  },
  {
    pkg: "stylelint/lib/index.mjs",
    name: "stylelint",
    entryFile: `dist/stylelint/index.js`
  },
  {
    pkg: "stylelint/lib/cli.mjs",
    name: "stylelintCli",
    entryFile: `dist/stylelint/cli.js`
  }
];

const FAKE_PRETTIER_PLUGIN = "../../shims/prettier-parser.js";

export default [
  builder =>
    builder("stylelint-prettier")
      .esm()
      .package()
      .externals({
        ...externalsFor("stylelint-prettier"),

        // We don't need most prettier parsers
        "./plugins/acorn.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/angular.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/babel.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/estree.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/flow.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/glimmer.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/graphql.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/html.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/markdown.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/meriyah.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/typescript.mjs": FAKE_PRETTIER_PLUGIN,
        "./plugins/yaml.mjs": FAKE_PRETTIER_PLUGIN
      }),
  builder =>
    builder("postcss-selector-parser")
      .esm()
      .package(),
  builder =>
    builder("postcss-resolve-nested-selector")
      .esm()
      .package(),
  builder =>
    builder("postcss-value-parser")
      .esm()
      .package(),
  builder =>
    builder("fastest-levenshtein")
      .esm()
      .package({ isEsmModule: true }),
  builder =>
    builder("known-css-properties")
      .esm()
      .package(),
  builder =>
    builder("css-tree")
      .esm()
      .package({ isEsmModule: true }),
  async () => {
    const cssTreePkg = path.dirname(require.resolve("css-tree/package.json"));

    console.log("Copy css-tree's data/patch.json");
    await fs.copyFile(
      path.join(cssTreePkg, "data/patch.json"),
      "dist/css-tree/patch.json"
    );

    const version = require("css-tree/package.json").version;

    console.log("Patch css-tree's index.js");
    const bundled = path.join("dist", "css-tree", "index.js");
    const content = await fs.readFile(bundled, { encoding: "utf-8" });
    await fs.writeFile(
      bundled,
      content
        .replace("('../data/patch.json')", "('./patch.json')")
        .replace(
          "const { version } = version_require('../package.json');",
          `const version = "${version}";`
        )
    );
  },
  builder =>
    builder("stylelint-scss")
      .esm()
      .package()
      .externals({
        ...externalsFor("stylelint-scss")
      }),
  async (builder, compilerUtils) => {
    await compilerUtils.patchESMForCJS(
      path.join("dist", "stylelint-scss", "index.js"),
      ["postcss_selector_parser_index", "known_css_properties_index"]
    );
  },
  async () => {
    // Patch stylelint exports
    const pkg = JSON.parse(await fs.readFile(stylelintPkg, "utf8"));
    pkg.exports["./lib/*"] = "./lib/*";

    fs.writeFile(stylelintPkg, JSON.stringify(pkg, null, 2));
  },
  builder =>
    builder("stylelint")
      .esm()
      .packages(pkgBuilder => {
        stylelintSource.forEach(entry => {
          pkgBuilder.package(entry.pkg, entry.name, entry.entryFile);
        });
      })
      .externals(externalsFor("stylelint"))
      .options({
        sourceMap: false
      }),
  async (builder, compilerUtils) => {
    await compilerUtils.patchESMForCJS(
      path.join("dist", "stylelint", "bundled.js"),
      ["known_css_properties_index"]
    );
  }
];
