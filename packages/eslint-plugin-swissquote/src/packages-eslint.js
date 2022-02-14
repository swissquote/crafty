function typescriptEslintPlugin() {
  return require("@typescript-eslint/eslint-plugin");
}

function typescriptEslintParser() {
  return require("@typescript-eslint/parser");
}

function confusingBrowserGlobals() {
  return require("confusing-browser-globals");
}

function eslintConfigPrettier() {
  return require("eslint-config-prettier");
}

function eslintImportResolverNode() {
  return require("eslint-import-resolver-node");
}

function eslintImportResolverTypescript() {
  return require("eslint-import-resolver-typescript");
}

function eslintPluginImport() {
  return require("eslint-plugin-import");
}

function eslintPluginPrettier() {
  return require("eslint-plugin-prettier");
}

function eslintPluginReact() {
  return require("eslint-plugin-react");
}

function eslintPluginReactHooks() {
  return require("eslint-plugin-react-hooks");
}

function eslintPluginSonarjs() {
  return require("eslint-plugin-sonarjs");
}

module.exports = {
  typescriptEslintPlugin,
  typescriptEslintParser,
  confusingBrowserGlobals,
  eslintConfigPrettier,
  eslintImportResolverNode,
  eslintImportResolverTypescript,
  eslintPluginImport,
  eslintPluginPrettier,
  eslintPluginReact,
  eslintPluginReactHooks,
  eslintPluginSonarjs
};
