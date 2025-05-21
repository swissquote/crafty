const path = require("path");
const { existsSync } = require("fs")
const fs = require("fs/promises");
const debugFn = require("@swissquote/crafty-commons/packages/debug");
const resolveFrom = require("../packages/resolve-from");

const debug = debugFn("crafty:preset-eslint");

/**
 * Plugins can be present only once
 * Since we want to load the plugins only when needed we still want to declare them the closest to where they're needed.
 * This step makes sure that plugins appear only once in the final configuration
 */
function deduplicatePlugins(configs) {
  const seenPlugin = new Set();

  configs.forEach((config, index) => {
    if (!config.plugins) {
      return;
    }

    const pluginNames = Object.keys(config.plugins);

    let hasDuplicates = false;
    const newPluginMap = {};
    for (const pluginName of pluginNames) {
      if (seenPlugin.has(pluginName)) {
        hasDuplicates = true;
      } else {
        seenPlugin.add(pluginName);
        newPluginMap[pluginName] = config.plugins[pluginName];
      }
    }

    if (hasDuplicates) {
      // Clone the original config in case it's used more than once
      const cloned = { ...config };
      cloned.plugins = newPluginMap;
      configs[index] = cloned;
    }
  });
}

async function readEslintIgnore(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/gu).filter(line => line.trim() !== "" && !line.startsWith("#"));

  // We might need to have some conversion logic from the ignore file to the glob config
  return lines
}

async function toESLintConfig(crafty, config = {}, source = "plugin") {
  const configs = [];

  const eslintPlugin = require(`@swissquote/eslint-plugin-swissquote`);

  // Load configuration presets
  let presets = [];
  if (config.presets?.length > 0) {
    presets = config.presets;
  } else {
    presets = ["recommended"];
  }

  for (const preset of presets) {
    const subConfigs = eslintPlugin.configs[preset];
    configs.push(...subConfigs);
  }

  // Restore the .eslintignore behavior that was removed in eslint 9.0.0
  const filePath = path.join(process.cwd(), ".eslintignore");
  if (existsSync(filePath)) {
    const ignores = await readEslintIgnore(filePath);
    configs.push({ ignores });
  }

  // Override from default config if it exists
  if (crafty) {
    // Apply overrides to clean up configuration
    crafty.loadedPresets
      .filter(preset => preset.implements("eslint"))
      .forEach(preset => {
        debug(`${preset.presetName}.eslint(configArray)`);

        const value = preset.get("eslint");
        if (typeof value === "function") {
          value(configs);
        } else {
          configs.push(value);
        }
      });
  }

  // Load other configuration files
  if (config.configFile) {
    const resolvedConfig = resolveFrom.silent(process.cwd(), config.configFile);
    const configFile =
      resolvedConfig ?? path.join(process.cwd(), config.configFile);

    let subConfigs;
    if (configFile.endsWith(".json")) {
      const content = await fs.readFile(configFile);
      subConfigs = JSON.parse(content);
    } else {
      subConfigs = await import(configFile);
      if (subConfigs?.default) {
        subConfigs = subConfigs.default;
      }
    }

    if (!Array.isArray(subConfigs)) {
      throw new Error(
        `Expected ${
          config.configFile
        } to be an array of configuration but got ${typeof subConfigs}`
      );
    }

    configs.push(...subConfigs);
  }

  if (source === "jsLint") {
    configs.push({
      rules: {
        // Disable `no-var` as this linter can also be run
        // on es5 code, if used with --fix, the result
        // would be broken code or false positives.
        "no-var": 0
      }
    });
  }

  deduplicatePlugins(configs);

  return configs;
}

module.exports = {
  toESLintConfig
};
