import path from "node:path";
import fs from "node:fs";
import debugFn from "@swissquote/crafty-commons/packages/debug.js";

import { configs as oxlintConfigs } from "@swissquote/oxlint-config-swissquote";

const debug = debugFn("crafty:preset-oxlint");

/**
 * Merge several .oxlintrc.json-shaped objects into one.
 *
 * - `plugins` are unioned
 * - `categories`, `env`, `globals`, `settings` and `rules` are shallow-merged
 *   (later configs win)
 * - `overrides` are concatenated
 */
export function mergeConfigs(configs) {
  const result = {
    plugins: [],
    categories: {},
    env: {},
    globals: {},
    settings: {},
    rules: {},
    overrides: []
  };

  for (const config of configs) {
    if (!config) {
      continue;
    }

    if (Array.isArray(config.plugins)) {
      for (const plugin of config.plugins) {
        if (!result.plugins.includes(plugin)) {
          result.plugins.push(plugin);
        }
      }
    }

    Object.assign(result.categories, config.categories);
    Object.assign(result.env, config.env);
    Object.assign(result.globals, config.globals);
    Object.assign(result.settings, config.settings);
    Object.assign(result.rules, config.rules);

    if (Array.isArray(config.overrides)) {
      result.overrides.push(...config.overrides);
    }

    if (config.$schema && !result.$schema) {
      result.$schema = config.$schema;
    }

    if (Array.isArray(config.ignorePatterns)) {
      result.ignorePatterns = [
        ...(result.ignorePatterns || []),
        ...config.ignorePatterns
      ];
    }
  }

  // Drop the empty containers oxlint doesn't need, to keep the output tidy
  for (const key of ["env", "globals", "settings", "categories", "rules"]) {
    if (Object.keys(result[key]).length === 0) {
      delete result[key];
    }
  }
  if (result.overrides.length === 0) {
    delete result.overrides;
  }

  return result;
}

/**
 * Build the final oxlint configuration object from the selected Swissquote
 * flavors, the overrides contributed by other loaded presets (via an `oxlint`
 * hook) and an optional external config file.
 *
 * @param {Crafty} crafty
 * @param {{ presets?: string[], configFile?: string }} config
 * @returns {object} a `.oxlintrc.json`-shaped object
 */
export function toOxlintConfig(crafty, config = {}) {
  const presets =
    config.presets && config.presets.length > 0
      ? config.presets
      : ["recommended"];

  const selected = presets.map(preset => {
    if (!oxlintConfigs[preset]) {
      throw new Error(
        `Unknown Crafty oxlint preset "${preset}". Known presets are: ${Object.keys(
          oxlintConfigs
        ).join(", ")}`
      );
    }
    return oxlintConfigs[preset];
  });

  const merged = mergeConfigs(selected);

  // Let other presets tweak the configuration
  if (crafty) {
    crafty.loadedPresets
      .filter(preset => preset.implements("oxlint"))
      .forEach(preset => {
        debug(`${preset.presetName}.oxlint(config)`);
        const value = preset.get("oxlint");
        if (typeof value === "function") {
          value(merged);
        } else {
          Object.assign(merged.rules || (merged.rules = {}), value.rules);
        }
      });
  }

  // Load an external config file if one was provided
  if (config.configFile) {
    const configFile = path.isAbsolute(config.configFile)
      ? config.configFile
      : path.join(process.cwd(), config.configFile);

    const content = JSON.parse(fs.readFileSync(configFile, "utf8"));
    return mergeConfigs([merged, content]);
  }

  return merged;
}
