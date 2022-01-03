function eslintWebpackPlugin() {
  return require("eslint-webpack-plugin");
}

function resolveFrom() {
  return require("resolve-from");
}

function rollupPluginEslint() {
  return require("@swissquote/rollup-plugin-eslint");
}

module.exports = {
  eslintWebpackPlugin,
  resolveFrom,
  rollupPluginEslint
};
