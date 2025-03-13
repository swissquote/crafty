const hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = {};

const plugins = {
  "@eslint-react": require("./packages/eslint-react-eslint-plugin.js"),
  "react-hooks": require("./packages/eslint-plugin-react-hooks.js"),
  import: require("./packages/eslint-plugin-import-x.js"),
  prettier: require("./src/eslint-plugin-prettier/index.js"),
  "@typescript-eslint": require("./packages/typescript-eslint").plugin
};

// Eslint can't load plugins transitively (from a shared config)
// So we have to include the file ourselves and include the rules as if they were ours.
// Solution proposed by @nzakas himself : https://github.com/eslint/eslint/issues/3458#issuecomment-257161846
for (const i in plugins) {
  if (!hasOwnProperty.call(plugins, i)) {
    continue;
  }
  const plugin = plugins[i];
  Object.keys(plugin.rules).forEach(ruleName => {
    module.exports[`${i}/${ruleName}`] = plugin.rules[ruleName];
  });
}
