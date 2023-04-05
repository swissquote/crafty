const { getExternals } = require("../../utils/externals");

const commonExternals = {
  // Provided by other Crafty package
  ...getExternals(),

  postcss: "postcss",
  "/postcss(/.*)/": "postcss$1"
};

const externals = {
  ...commonExternals,

  "postcss-selector-parser": "../postcss-selector-parser/index.js",
  "postcss-values-parser": "../postcss-values-parser/index.js",
  "postcss-value-parser": "../postcss-value-parser/index.js",
  "postcss-values-parser/lib/nodes/Punctuation":
    "../postcss-values-parser/nodesPunctuation.js",
  "postcss-values-parser/lib/nodes/Numeric":
    "../postcss-values-parser/nodesNumeric.js",
  "postcss-values-parser/lib/nodes/Word":
    "../postcss-values-parser/nodesWord.js",
  "postcss-values-parser/lib/nodes/Operator":
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
    builder("postcss-values-parser")
      .externals({
        ...commonExternals,
        "color-name": "../color-name/index.js"
      })
      .packages(pkg =>
        pkg
          .package(
            "postcss-values-parser",
            "postcssValuesParser",
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
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-atroot")
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-color-mod-function")
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-color-gray")
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-color-hwb")
      .externals(externals)
      .package(),
  builder =>
    builder("@swissquote/postcss-custom-properties")
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
      .externals(externals)
      .package(),
  builder =>
    builder("postcss-url")
      .externals(externals)
      .package()
];
