const { getExternals } = require("../../utils/externals");

module.exports = [
  builder =>
    builder("babel-packages")
      .packages(pkgBuilder => {
        pkgBuilder
          .package("babel-plugin-istanbul", "pluginIstanbul")
          .package(
            "babel-plugin-transform-react-remove-prop-types",
            "pluginTransformReactRemovePropTypes"
          )
          .package(
            "@babel/plugin-transform-modules-commonjs",
            "pluginTransformModulesCommonjs"
          )
          .package(
            "@babel/plugin-transform-property-literals",
            "pluginTransformPropertyLiterals"
          )
          .package("@babel/plugin-transform-runtime", "pluginTransformRuntime")
          .package("@babel/preset-env", "presetEnv")
          .package("@babel/preset-react", "presetReact")
          .package("babel-preset-jest", "presetJest");
      })
      .externals({
        // Provided by other Crafty packages
        ...getExternals(),

        // Provided by this package
        "caniuse-lite": "caniuse-lite",
        "/caniuse-lite(/.*)/": "caniuse-lite$1",
        "@babel/code-frame": "@babel/code-frame",
        "@babel/generator": "@babel/generator",
        "@babel/traverse": "@babel/traverse",
        "@babel/template": "@babel/template",
        "@babel/types": "@babel/types",
        "@babel/parser": "@babel/parser",
        "@babel/core": "@babel/core",
        "@babel/helper-module-transforms": "@babel/helper-module-transforms",
        "@babel/helper-compilation-targets": "@babel/helper-compilation-targets"
      })
];
