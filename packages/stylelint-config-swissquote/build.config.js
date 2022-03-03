const { getExternals } = require("../../utils/externals");

const commonExternals = {
  // Provided by other Crafty packages
  ...getExternals(),

  stylelint: "../../shims/stylelint.js",
  "stylelint/lib/utils/optionsMatches":
    "../stylelint-utils/stylelint-optionsMatches.js"
};

const FAKE_PRETTIER_PARSER = "../../shims/prettier-parser.js";

module.exports = [
  builder =>
    builder("stylelint-prettier")
      .package()
      .externals({
        ...commonExternals,

        // We don't need most prettier parsers
        "./parser-angular.js": FAKE_PRETTIER_PARSER,
        "./parser-babel.js": FAKE_PRETTIER_PARSER,
        "./parser-espree.js": FAKE_PRETTIER_PARSER,
        "./parser-flow.js": FAKE_PRETTIER_PARSER,
        "./parser-glimmer.js": FAKE_PRETTIER_PARSER,
        "./parser-graphql.js": FAKE_PRETTIER_PARSER,
        "./parser-html.js": FAKE_PRETTIER_PARSER,
        "./parser-markdown.js": FAKE_PRETTIER_PARSER,
        "./parser-meriyah.js": FAKE_PRETTIER_PARSER,
        "./parser-typescript.js": FAKE_PRETTIER_PARSER,
        "./parser-yaml.js": FAKE_PRETTIER_PARSER
      }),
  builder => builder("postcss-selector-parser").package(),
  builder => builder("postcss-resolve-nested-selector").package(),

  builder => builder("postcss-value-parser").package(),
  builder =>
    builder("stylelint-scss")
      .package()
      .externals({
        ...commonExternals,

        // We use other packages created here
        "postcss-selector-parser": "../postcss-selector-parser/index.js",
        "postcss-value-parser": "../postcss-value-parser/index.js",
        "postcss-resolve-nested-selector":
          "../postcss-resolve-nested-selector/index.js",

        // We mock the few lodash functions really used
        lodash: "../../shims/lodash.js"
      }),
  builder =>
    builder("stylelint-no-unsupported-browser-features")
      .externals({
        ...commonExternals,

        postcss: "postcss",
        "postcss/lib/result": "postcss/lib/result",
        "postcss/lib/list": "postcss/lib/list",

        // We keep postcss-scss external so we can have it in common with preset-postcss
        "postcss-scss": "postcss-scss",

        // Used by stylelint-no-unsupported-browser-features
        "caniuse-lite": "caniuse-lite",
        "/caniuse-lite(/.*)/": "caniuse-lite$1",

        // We mock the few lodash functions really used
        lodash: "../../shims/lodash.js"
      })
      .package(),
  builder =>
    builder("stylelint-utils")
      .packages(pkg =>
        pkg
          .package(
            "stylelint/lib/utils/declarationValueIndex",
            "declarationValueIndex",
            "dist/stylelint-utils/stylelint-declarationValueIndex.js"
          )
          .package(
            "stylelint/lib/utils/isStandardSyntaxFunction",
            "isStandardSyntaxFunction",
            "dist/stylelint-utils/stylelint-isStandardSyntaxFunction.js"
          )
          .package(
            "stylelint/lib/utils/isStandardSyntaxRule",
            "isStandardSyntaxRule",
            "dist/stylelint-utils/stylelint-isStandardSyntaxRule.js"
          )
          .package(
            "stylelint/lib/utils/isStandardSyntaxSelector",
            "isStandardSyntaxSelector",
            "dist/stylelint-utils/stylelint-isStandardSyntaxSelector.js"
          )
          .package(
            "stylelint/lib/utils/isKeyframeSelector",
            "isKeyframeSelector",
            "dist/stylelint-utils/stylelint-isKeyframeSelector.js"
          )
          .package(
            "stylelint/lib/utils/optionsMatches",
            "optionMatches",
            "dist/stylelint-utils/stylelint-optionsMatches.js"
          )
          .package(
            "stylelint/lib/utils/report",
            "report",
            "dist/stylelint-utils/stylelint-report.js"
          )
      )
      .externals({
        "../reference/keywordSets": "../../shims/stylelint-keywordSets.js"
      })
      .options({
        sourceMap: false
      })
];
