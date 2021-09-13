/* eslint-disable import/no-extraneous-dependencies */

function pluginProposalClassProperties() {
  return require("@babel/plugin-proposal-class-properties");
}

function pluginProposalNullishCoalescingOperator() {
  return require("@babel/plugin-proposal-nullish-coalescing-operator");
}

function pluginProposalOptionalChaining() {
  return require("@babel/plugin-proposal-optional-chaining");
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

function presetReact() {
  return require("@babel/preset-react");
}

module.exports = {
  pluginProposalClassProperties,
  pluginProposalNullishCoalescingOperator,
  pluginProposalOptionalChaining,
  pluginTransformModulesCommonjs,
  pluginTransformPropertyLiterals,
  pluginTransformReactRemovePropTypes,
  pluginTransformRuntime,
  presetEnv,
  presetReact
};
