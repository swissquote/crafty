function declarationValueIndex() {
  return require("stylelint/lib/utils/declarationValueIndex");
}
function isStandardSyntaxFunction() {
  return require("stylelint/lib/utils/isStandardSyntaxFunction");
}
function isStandardSyntaxRule() {
  return require("stylelint/lib/utils/isStandardSyntaxRule");
}
function isStandardSyntaxSelector() {
  return require("stylelint/lib/utils/isStandardSyntaxSelector");
}
function isKeyframeSelector() {
  return require("stylelint/lib/utils/isKeyframeSelector");
}
function optionMatches() {
  return require("stylelint/lib/utils/optionsMatches");
}
function report() {
  return require("stylelint/lib/utils/report");
}

module.exports = {
  declarationValueIndex,
  isStandardSyntaxFunction,
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  isKeyframeSelector,
  optionMatches,
  report
};
