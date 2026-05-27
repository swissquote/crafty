const { getExternals } = require("../../utils/externals");

const commonExternals = {
  // Provided by other Crafty package
  ...getExternals(),

  postcss: "postcss",
  "/postcss(/.*)/": "postcss$1"
};

const externals = {
  ...commonExternals,

  "@swissquote/color-fns": "../swissquote-color-fns/index.mjs",
  "postcss-selector-parser": "../postcss-selector-parser/index.js",
  "postcss-values-parser": "../postcss-values-parser/index.js",
  "postcss-value-parser": "../postcss-value-parser/index.js",
  "postcss-values-parser/lib/nodes/Punctuation.js":
    "../postcss-values-parser/nodesPunctuation.js",
  "postcss-values-parser/lib/nodes/Numeric.js":
    "../postcss-values-parser/nodesNumeric.js",
  "postcss-values-parser/lib/nodes/Word.js":
    "../postcss-values-parser/nodesWord.js",
  "postcss-values-parser/lib/nodes/Operator.js":
    "../postcss-values-parser/nodesOperator.js"
};

module.exports = [
  builder =>
    builder("postcss-selector-parser")
      .externals(commonExternals)
      .package(),
  builder =>
    builder("postcss-value-parser")
      .externals(commonExternals)
      .package(),
  builder =>
    builder("color-name")
      .externals(commonExternals)
      .package(),
  builder =>
    builder("@swissquote/color-fns")
      .esm()
      .package({
        names: [
          "hsl2hwb",
          "hsl2rgb",
          "hwb2hsl",
          "hwb2rgb",
          "rgb2hsl",
          "rgb2hwb"
        ]
      }),
  builder =>
    builder("postcss-values-parser")
      .externals({
        ...commonExternals,
        "color-name": "../color-name/index.js"
      })
      .packages(pkg =>
        pkg
          .package(
            "postcss-values-parser",
            ["parse"],
            "dist/postcss-values-parser/index.js"
          )
          .package(
            "postcss-values-parser/lib/nodes/Punctuation",
            "postcssValueParserNodesPunctuation",
            "dist/postcss-values-parser/nodesPunctuation.js"
          )
          .package(
            "postcss-values-parser/lib/nodes/Numeric",
            "postcssValueParserNodesNumeric",
            "dist/postcss-values-parser/nodesNumeric.js"
          )
          .package(
            "postcss-values-parser/lib/nodes/Word",
            "postcssValueParserNodesWord",
            "dist/postcss-values-parser/nodesWord.js"
          )
          .package(
            "postcss-values-parser/lib/nodes/Operator",
            "postcssValueParserNodesOperator",
            "dist/postcss-values-parser/nodesOperator.js"
          )
      ),
  builder =>
    builder("@knagis/postcss-advanced-variables")
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-assets")
      .esm()
      .externals(externals)
      .package(),
  async (_, compilerUtils) => {
    console.log("patch @swissquote/postcss-assets");
    await compilerUtils.replaceContent(
      "./dist/swissquote-postcss-assets/index.mjs",
      content => {
        return content.replace(
          'var _postcssValueParser = _interopRequireDefault(__webpack_require__("postcss-value-parser"));',
          'var _postcssValueParser = __webpack_require__("postcss-value-parser");'
        );
      }
    );
  },
  builder =>
    builder("@swissquote/postcss-atroot")
      .esm()
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-color-mod-function")
      .esm()
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-color-gray")
      .esm()
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-color-hwb")
      .esm()
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-custom-properties")
      .esm()
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-custom-selectors")
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-font-variant")
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-image-set-polyfill")
      .esm()
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-import")
      .externals({
        ...externals,
        // An optional embedded format we don't use
        sugarss: "sugarss"
      })
      .package(),
  builder =>
    builder("postcss-initial")
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-nested")
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-lightningcss")
      .externals({
        ...externals,
        //Let's keep lightningcss external to download the right binary as dependency
        lightningcss: "lightningcss"
      })
      .package(),
  builder =>
    builder("postcss-property-lookup")
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-reporter")
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-selector-matches")
      .esm()
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-url")
      .externals(externals)
      .package()
];
