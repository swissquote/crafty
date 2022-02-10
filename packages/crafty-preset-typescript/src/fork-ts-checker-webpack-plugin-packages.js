function forkTsCheckerWebpackPlugin() {
  return require("fork-ts-checker-webpack-plugin");
}

function forkTsCheckerWebpackPluginWorkerDependencies() {
  return require("fork-ts-checker-webpack-plugin/lib/typescript/worker/get-dependencies-worker.js");
}

function forkTsCheckerWebpackPluginWorkerIssues() {
  return require("fork-ts-checker-webpack-plugin/lib/typescript/worker/get-issues-worker.js");
}

module.exports = {
  forkTsCheckerWebpackPlugin,
  forkTsCheckerWebpackPluginWorkerDependencies,
  forkTsCheckerWebpackPluginWorkerIssues
};
