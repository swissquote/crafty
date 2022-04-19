const stylelint = require("./shims/stylelint");

const noBlockInsideBlock = require("./src/rules/no-block-inside-block");
const noUtilityReassignment = require("./src/rules/no-utility-reassignment");
const noHackReassignment = require("./src/rules/no-hack-reassignment");
const noStateWithoutComponent = require("./src/rules/no-state-without-component");
const noTypeOutsideScope = require("./src/rules/no-type-outside-scope");
const noNegativeVar = require("./src/rules/no-negative-var");
const noVariableInTranspiledFunction = require("./src/rules/no-variable-in-transpiled-function");

module.exports = [
  stylelint.createPlugin(noBlockInsideBlock.ruleName, noBlockInsideBlock),
  stylelint.createPlugin(noUtilityReassignment.ruleName, noUtilityReassignment),
  stylelint.createPlugin(noHackReassignment.ruleName, noHackReassignment),
  stylelint.createPlugin(
    noStateWithoutComponent.ruleName,
    noStateWithoutComponent
  ),
  stylelint.createPlugin(noTypeOutsideScope.ruleName, noTypeOutsideScope),
  stylelint.createPlugin(noNegativeVar.ruleName, noNegativeVar),
  stylelint.createPlugin(
    noVariableInTranspiledFunction.ruleName,
    noVariableInTranspiledFunction
  )
];
