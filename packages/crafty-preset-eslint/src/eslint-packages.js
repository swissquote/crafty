function eslintWebpackPlugin() {
  return require("eslint-webpack-plugin");
}

function resolveFrom() {
  return require("resolve-from");
}

module.exports = {
  eslintWebpackPlugin,
  resolveFrom
};
