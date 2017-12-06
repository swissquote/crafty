const stylelint = require("stylelint");

const noUtilityReassignment = require("./src/rules/no-utility-reassignment");
const noHackReassignment = require("./src/rules/no-hack-reassignment");
const noStateWithoutComponent = require("./src/rules/no-state-without-component");
const noTypeOutsideScope = require("./src/rules/no-type-outside-scope");

module.exports = [
  stylelint.createPlugin(noUtilityReassignment.ruleName, noUtilityReassignment),
  stylelint.createPlugin(noHackReassignment.ruleName, noHackReassignment),
  stylelint.createPlugin(
    noStateWithoutComponent.ruleName,
    noStateWithoutComponent
  ),
  stylelint.createPlugin(noTypeOutsideScope.ruleName, noTypeOutsideScope)
];
