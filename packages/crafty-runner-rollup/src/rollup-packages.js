function rollupPluginCommonJs() {
  return require("@rollup/plugin-commonjs");
}

function rollupPluginJson() {
  return require("@rollup/plugin-json");
}

function rollupPluginNodeResolve() {
  return require("@rollup/plugin-node-resolve");
}

function rollupPluginReplace() {
  return require("@rollup/plugin-replace");
}

function rollupPluginPNPResolve() {
  return require("rollup-plugin-pnp-resolve");
}

function rollupPluginUtils() {
  return require("@rollup/pluginutils");
}

function rollup() {
  return require("rollup");
}

module.exports = {
  rollupPluginCommonJs,
  rollupPluginJson,
  rollupPluginNodeResolve,
  rollupPluginReplace,
  rollupPluginPNPResolve,
  rollupPluginUtils,
  rollup
};
