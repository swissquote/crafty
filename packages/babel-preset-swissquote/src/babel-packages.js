/* eslint-disable import/no-extraneous-dependencies */

function pluginIstanbul() {
  return require("babel-plugin-istanbul");
}

function pluginTransformModulesCommonjs() {
  return require("@babel/plugin-transform-modules-commonjs");
}

function pluginTransformPropertyLiterals() {
  return require("@babel/plugin-transform-property-literals");
}

function pluginTransformReactRemovePropTypes() {
  return require("babel-plugin-transform-react-remove-prop-types");
}

function pluginTransformRuntime() {
  return require("@babel/plugin-transform-runtime");
}

function presetEnv() {
  return require("@babel/preset-env");
}

function presetJest() {
  return require("babel-preset-jest");
}

function presetReact() {
  return require("@babel/preset-react");
}

module.exports = {
  pluginIstanbul,
  pluginTransformModulesCommonjs,
  pluginTransformPropertyLiterals,
  pluginTransformReactRemovePropTypes,
  pluginTransformRuntime,
  presetEnv,
  presetJest,
  presetReact
};
