const importPlugin = require("eslint-plugin-import");
const reactPlugin = require("eslint-plugin-react");

module.exports = {};

// Eslint can't load plugins transitively (from a shared config)
// So we have to include the file ourselves and include the rules as if they were ours.
// Solution proposed by @nzakas himself : https://github.com/eslint/eslint/issues/3458#issuecomment-257161846
Object.keys(reactPlugin.rules).forEach(ruleName => {
  module.exports[`react/${ruleName}`] = reactPlugin.rules[ruleName];
});

Object.keys(importPlugin.rules).forEach(ruleName => {
  module.exports[`import/${ruleName}`] = importPlugin.rules[ruleName];
});
