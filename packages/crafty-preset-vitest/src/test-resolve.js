function getCraftyTestResolveOptions({
  browser = false,
  conditions,
  extensions,
  moduleDirectories
} = {}) {
  const options = {
    symlinks: true,
    extensions: [...new Set(extensions || [])],
    modules: [...new Set(moduleDirectories || ["node_modules"])],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
    }
  };

  if (conditions) {
    options.conditionNames = [...new Set(conditions)];
  }

  if (browser) {
    options.aliasFields = ["browser"];
    options.mainFields = ["browser", "main"];
  }

  return options;
}

module.exports = {
  getCraftyTestResolveOptions
};
