const path = require("path");
const fs = require("fs");
const { findUpSync } = require("@swissquote/crafty-commons/packages/find-up");
const { copy } = require("../packages/copy-anything");
const { merge } = require("../packages/merge-anything");
const resolve = require("../packages/enhanced-resolve");

const Crafty = require("./Crafty.js");
const CraftyPreset = require("./CraftyPreset.js");
const defaultConfiguration = require("./defaultConfiguration");

const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:configuration"
);

/**
 * Get the package's name or the filename if nothing is found
 * @param {*} file
 */
function getPresetName(file) {
  const packageJson = findUpSync("package.json", { cwd: path.dirname(file) });

  if (packageJson) {
    return require(packageJson).name || file;
  }

  return file;
}

/**
 * A module can be a a full path or just a module name
 * From that we'll try to find the name of the preset and the file that contains it.
 * @param {String} module
 */
function resolveModule(module) {
  debug("resolveModule", module);

  const presetName = module;

  if (path.isAbsolute(presetName)) {
    return [getPresetName(module), module];
  }

  try {
    // Try the naive way
    return [presetName, require.resolve(module)];
  } catch (e) {
    // Try a more advanced way
    return [presetName, resolve.sync(`${process.cwd()}/node_modules`, module)];
  }
}

class CraftyLoader {
  constructor() {
    this.loading = new Set();
    this.loaded = new Set();
  }

  needsLoading(preset) {
    const isLoading = this.loading.has(preset);
    const isLoaded = this.loaded.has(preset);

    return !isLoading && !isLoaded;
  }

  findPresetsToLoad(presets) {
    return presets.filter(preset => this.needsLoading(preset));
  }

  async loadPreset(initialConfig, preset) {
    let config = initialConfig;
    debug("loadPreset: start", preset);

    const [presetName, resolvedModule] = resolveModule(preset);
    debug("loadPreset: resolved", preset, { presetName, resolvedModule });

    // Even if we check in loadMissingPreset for already loading or loaded,
    // presets, because of its recursive nature it might still come here with
    // Something that is loading or loaded
    if (!this.needsLoading(presetName)) {
      debug("loadPreset: loading or loaded", presetName);
      return config;
    }

    // We have a list of presets currently loading to prevent dependency loops
    this.loading.add(preset);
    this.loading.add(presetName);
    this.loading.add(resolvedModule);

    const loadedModule = await import(resolvedModule);
    const craftyPreset = new CraftyPreset(loadedModule, presetName);
    config.loadedPresets.push(craftyPreset);

    this.loaded.add(preset);
    this.loaded.add(presetName);
    this.loaded.add(resolvedModule);

    // If this preset has dependencies to other presets,
    // They need to be loaded now, so that they're added before the current one in the list of dependencies
    if (craftyPreset.implements("presets")) {
      debug("loadPreset: Load nested", craftyPreset.get("presets"));
      // eslint-disable-next-line no-await-in-loop
      config = await this.loadMissingPresets(
        config,
        craftyPreset.get("presets")
      );
    }

    if (craftyPreset.implements("defaultConfig")) {
      debug(`${presetName}.defaultConfig()`);
      config = copy(merge(config, craftyPreset.run("defaultConfig")));
    }

    return config;
  }

  endCounter(start, preset) {
    const precision = 3; // 3 decimal places
    const elapsed = process.hrtime(start); // divide by a million to get nano to milli
    const ms = elapsed[0] * 1000 + elapsed[1] / 1000000;

    debug(`Loaded '${preset}' in ${ms.toFixed(precision)} ms`);
  }

  async loadMissingPresets(initialConfig, presets) {
    let config = initialConfig;
    debug("loadMissingPresets", presets);

    let stillUnloadedPresets = this.findPresetsToLoad(presets);

    // Not sure a loop is needed here
    do {
      debug("loadMissingPresets: will load:", stillUnloadedPresets);
      for (const preset of stillUnloadedPresets) {
        const start = process.hrtime();
        // eslint-disable-next-line no-await-in-loop
        config = await this.loadPreset(config, preset);
        this.endCounter(start, preset);
      }

      stillUnloadedPresets = this.findPresetsToLoad(presets);
    } while (stillUnloadedPresets.length > 0);

    return config;
  }

  async loadPresets(presets, craftyConfig) {
    let config = copy(
      merge(copy(defaultConfiguration), {
        destination: path.join(process.cwd(), "dist"),
        presets: presets.concat(craftyConfig.presets || []),
        loadedPresets: []
      })
    );
    config = await this.loadMissingPresets(config, config.presets);
    config = copy(merge(config, craftyConfig));

    // Use `crafty.config.js` like a preset
    // Add the preset as last item in order to be
    // able to override any behaviour from other presets
    config.loadedPresets.push(
      new CraftyPreset(craftyConfig, "crafty.config.js")
    );

    const loadedPresets = config.loadedPresets
      .map(preset => ` - ${preset.presetName}`)
      .join("\n");

    debug(`Finished loading\n${loadedPresets}`);

    return config;
  }
}

async function getCrafty(presets, craftyConfigPromise) {
  debug("getCrafty");

  const craftyConfig = await craftyConfigPromise;

  const craftyLoader = new CraftyLoader();
  let config = await craftyLoader.loadPresets(presets, craftyConfig);

  // Apply overrides to clean up configuration
  config.loadedPresets
    .filter(preset => preset.implements("config"))
    .forEach(preset => {
      debug(`${preset.presetName}.config(config)`);
      config = preset.run("config", config);
    });

  // Set default bundleType destinations if not found.
  Object.keys(config.bundleTypes).forEach(type => {
    if (!config[`destination_${type}`]) {
      config[`destination_${type}`] = path.join(
        config.destination,
        config.bundleTypes[type]
      );
    }
  });
  const crafty = new Crafty(config);

  crafty.runAllSync("init", crafty);

  // Make sure everything sees the current environment
  crafty.originalEnvironment = process.env.NODE_ENV;
  process.env.NODE_ENV = crafty.getEnvironment();
  return crafty;
}
exports.getCrafty = getCrafty;

function extractPresets(argv) {
  debug("extracting presets");
  const presets = global.presets || [];

  if (argv.indexOf("--preset") > -1) {
    let idx,
      prevIdx = 0;
    while ((idx = argv.indexOf("--preset")) === 2) {
      if (prevIdx && idx - prevIdx > 1) {
        break;
      }
      presets.push(argv[idx + 1]);
      argv.splice(idx, 2);
      prevIdx = idx;
    }
  }
  return presets;
}
exports.extractPresets = extractPresets;

/**
 * Get the user's configuration
 * @return {*} A configuration object
 */
async function getOverrides() {
  const configPath = path.join(process.cwd(), "crafty.config.js");

  if (fs.existsSync(configPath)) {
    const config = await import(configPath);

    return config.default ? config.default : config;
  }

  console.log(`No crafty.config.js found in '${process.cwd()}', proceeding...`);
  return {};
}
exports.getOverrides = getOverrides;
