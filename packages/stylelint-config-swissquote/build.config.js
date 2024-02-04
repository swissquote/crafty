import { getExternals } from "../../utils/externals.js";

const commonExternals = {
  // Provided by other Crafty packages
  ...getExternals(),

  stylelint: "../../shims/stylelint.js",
  "stylelint/lib/utils/optionsMatches":
    "../stylelint-utils/stylelint-optionsMatches.js",
};

const FAKE_PRETTIER_PARSER = "../../shims/prettier-parser.js";

export default [
  (builder) =>
    builder("stylelint-prettier")
      .esm()
      .package()
      .externals({
        ...commonExternals,

        // We don't need most prettier parsers
        "./plugins/acorn.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/angular.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/babel.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/estree.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/flow.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/glimmer.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/graphql.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/html.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/markdown.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/meriyah.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/typescript.mjs": FAKE_PRETTIER_PARSER,
        "./plugins/yaml.mjs": FAKE_PRETTIER_PARSER,
      }),
  (builder) => builder("postcss-selector-parser").esm().package(),
  (builder) => builder("postcss-resolve-nested-selector").esm().package(),
  (builder) => builder("postcss-value-parser").esm().package(),
  (builder) =>
    builder("stylelint-scss")
      .esm()
      .package()
      .externals({
        ...commonExternals,

        // We use other packages created here
        "postcss-selector-parser": "../postcss-selector-parser/index.mjs",
        "postcss-value-parser": "../postcss-value-parser/index.mjs",
        "postcss-resolve-nested-selector":
          "../postcss-resolve-nested-selector/index.mjs",

        // We mock the few lodash functions really used
        lodash: "../../shims/lodash.js",
      }),
  (builder) =>
    builder("stylelint-no-unsupported-browser-features")
      .esm()
      .externals({
        ...commonExternals,

        postcss: "postcss",

        // We keep postcss-scss external so we can have it in common with preset-postcss
        "postcss-scss": "postcss-scss",

        // Used by stylelint-no-unsupported-browser-features
        "caniuse-lite": "caniuse-lite",
        "/caniuse-lite(/.*)/": "caniuse-lite$1",
      })
      .package(),
  (builder) =>
    builder("stylelint-utils")
      .esm()
      .packages((pkg) =>
        pkg
          .package(
            "stylelint/lib/utils/declarationValueIndex.mjs",
            "declarationValueIndex",
            "dist/stylelint-utils/stylelint-declarationValueIndex.js"
          )
          .package(
            "stylelint/lib/utils/isStandardSyntaxFunction.mjs",
            "isStandardSyntaxFunction",
            "dist/stylelint-utils/stylelint-isStandardSyntaxFunction.js"
          )
          .package(
            "stylelint/lib/utils/isStandardSyntaxRule.mjs",
            "isStandardSyntaxRule",
            "dist/stylelint-utils/stylelint-isStandardSyntaxRule.js"
          )
          .package(
            "stylelint/lib/utils/isStandardSyntaxSelector.mjs",
            "isStandardSyntaxSelector",
            "dist/stylelint-utils/stylelint-isStandardSyntaxSelector.js"
          )
          .package(
            "stylelint/lib/utils/isKeyframeSelector.mjs",
            "isKeyframeSelector",
            "dist/stylelint-utils/stylelint-isKeyframeSelector.js"
          )
          .package(
            "stylelint/lib/utils/optionsMatches.mjs",
            "optionMatches",
            "dist/stylelint-utils/stylelint-optionsMatches.js"
          )
      )
      .externals({
        "../reference/keywordSets": "../../shims/stylelint-keywordSets.js",
      })
      .options({
        sourceMap: false,
      }),
];
