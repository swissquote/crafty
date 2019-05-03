const importPlugin = require("eslint-plugin-import");
const reactPlugin = require("eslint-plugin-react");
const sonarPlugin = require("eslint-plugin-sonarjs");
const typeScriptPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = {};

const plugins = {
  react: reactPlugin,
  import: importPlugin,
  sonarjs: sonarPlugin,
  "@typescript-eslint": typeScriptPlugin
};

// Eslint can't load plugins transitively (from a shared config)
// So we have to include the file ourselves and include the rules as if they were ours.
// Solution proposed by @nzakas himself : https://github.com/eslint/eslint/issues/3458#issuecomment-257161846
for (const i in plugins) {
  if (!plugins.hasOwnProperty(i)) {
    continue;
  }
  const plugin = plugins[i];
  Object.keys(plugin.rules).forEach(ruleName => {
    module.exports[`${i}/${ruleName}`] = plugin.rules[ruleName];
  });
}
