function caseSensitivePathsWebpackPlugin() {
  return require("case-sensitive-paths-webpack-plugin");
}

function globToRegexp() {
  return require("glob-to-regexp");
}

function hashIndex() {
  return require("hash-index");
}

function inspectpack() {
  return require("inspectpack/plugin");
}

function isGlob() {
  return require("is-glob");
}

function logSymbols() {
  return require("log-symbols").default;
}

/* Isn't friends with automatic imports
function webpackChain() {
    return require("webpack-chain");
}
*/

function webpackMerge() {
  return require("webpack-merge");
}

module.exports = {
  caseSensitivePathsWebpackPlugin,
  globToRegexp,
  hashIndex,
  inspectpack,
  isGlob,
  logSymbols,
  webpackMerge
};
