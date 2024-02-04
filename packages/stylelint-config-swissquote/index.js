import stylelint from "./shims/stylelint.js";

import noBlockInsideBlock from "./src/rules/no-block-inside-block.js";
import noUtilityReassignment from "./src/rules/no-utility-reassignment.js";
import noHackReassignment from "./src/rules/no-hack-reassignment.js";
import noStateWithoutComponent from "./src/rules/no-state-without-component.js";
import noTypeOutsideScope from "./src/rules/no-type-outside-scope.js";
import noNegativeVar from "./src/rules/no-negative-var.js";
import noVariableInTranspiledFunction from "./src/rules/no-variable-in-transpiled-function.js";

export default [
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
