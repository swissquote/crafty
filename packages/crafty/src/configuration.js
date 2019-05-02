const path = require("path");
const fs = require("fs");
const findUp = require("find-up");
const merge = require("merge");
const resolve = require("enhanced-resolve");

const Crafty = require("./Crafty");
const defaultConfiguration = require("./defaultConfiguration");

const debug = require("debug")("crafty:configuration");

const craftyPresetNames = "crafty-preset-names";

let LOADING = new Set();

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
    return [presetName, resolve.sync(process.cwd() + "/node_modules", module)];
  }
}

function isPresetLoadingOrLoaded(config, preset) {
  const isLoading = LOADING.has(preset);
  const isLoaded = config.loadedPresets.some(loadedPreset =>
    loadedPreset[craftyPresetNames].has(preset)
  );

  //debug("isPresetLoadingOrLoaded", preset, {isLoading, isLoaded})

  return isLoading || isLoaded;
}

function unloadedPresets(config, presets) {
  return presets.filter(preset => !isPresetLoadingOrLoaded(config, preset));
}

/**
 * Get the package's name or the filename if nothing is found
 * @param {*} file
 */
function getPresetName(file) {
  const packageJson = findUp.sync("package.json", { cwd: path.dirname(file) });

  if (packageJson) {
    return require(packageJson).name || file;
  }

  return file;
}

function loadPreset(config, preset) {
  debug("loadPreset: start", preset);

  const [presetName, resolvedModule] = resolveModule(preset);
  debug("loadPreset: resolved", preset, { presetName, resolvedModule });

  // Even if we check in loadMissingPreset for already loading or loaded,
  // presets, because of its recursive nature it might still come here with
  // Something that is loading or loaded
  if (isPresetLoadingOrLoaded(config, presetName)) {
    debug("loadPreset: loading or loaded", presetName);
    return config;
  }

  // We have a list of presets currently loading to prevent dependency loops
  LOADING.add(preset);
  LOADING.add(presetName);
  LOADING.add(resolvedModule);

  const loadedModule = require(resolvedModule);
  loadedModule.presetName = presetName;

  loadedModule[craftyPresetNames] = new Set([
    preset,
    presetName,
    resolvedModule
  ]);

  // If this preset has dependencies to other presets,
  // They need to be loaded now, so that they're added before the current one in the list of dependencies
  if (loadedModule.presets) {
    debug("loadPreset: Load nested", loadedModule.presets);
    config = loadMissingPresets(config, loadedModule.presets);
  }

  config.loadedPresets.push(loadedModule);
  if (!loadedModule.defaultConfig) {
    return config;
  }

  debug(loadedModule.presetName + ".defaultConfig()");
  return merge.recursive(true, config, loadedModule.defaultConfig());
}

function endCounter(start, preset) {
  const precision = 3; // 3 decimal places
  const elapsed = process.hrtime(start); // divide by a million to get nano to milli
  const ms = elapsed[0] * 1000 + elapsed[1] / 1000000;

  debug(`Loaded '${preset}' in ${ms.toFixed(precision)} ms`);
}

function loadMissingPresets(config, presets) {
  debug("loadMissingPresets", presets);

  let stillUnloadedPresets = unloadedPresets(config, presets);

  // Not sure a loop is needed here
  do {
    debug("loadMissingPresets: will load:", stillUnloadedPresets);
    stillUnloadedPresets.forEach(preset => {
      const start = process.hrtime();
      config = loadPreset(config, preset);
      endCounter(start, preset);
    });

    stillUnloadedPresets = unloadedPresets(config, presets);
  } while (stillUnloadedPresets.length > 0);

  return config;
}

function getCrafty(presets, craftyConfig) {
  debug("getCrafty");
  LOADING = new Set();

  let config = merge(true, defaultConfiguration, {
    destination: require("path").join(process.cwd(), "dist"),
    presets: presets.concat(craftyConfig.presets || []),
    loadedPresets: []
  });
  config = loadMissingPresets(config, config.presets);
  config = merge.recursive(true, config, craftyConfig);

  // Use `crafty.config.js` like a preset
  // Add the preset as last item in order to be
  // able to override any behaviour from other presets
  craftyConfig.presetName = "crafty.config.js";
  config.loadedPresets.push(craftyConfig);

  debug(
    "Finished loading\n" +
      config.loadedPresets
        .map(preset => ` - ${preset.presetName}`)
        .join("\n")
  );

  // Apply overrides to clean up configuration
  config.loadedPresets
    .filter(preset => preset.config)
    .forEach(preset => {
      debug(preset.presetName + ".config(config)");
      config = preset.config(config);
    });

  // Set default bundleType destinations if not found.
  Object.keys(config.bundleTypes).forEach(type => {
    if (!config["destination_" + type]) {
      config["destination_" + type] = path.join(
        config.destination,
        config.bundleTypes[type]
      );
    }
  });
  const crafty = new Crafty(config);

  crafty.getImplementations("init").forEach(preset => {
    debug(preset.presetName + ".init(Crafty)");
    preset.init(crafty);
    debug("init run");
  });

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
    while ((idx = argv.indexOf("--preset")) == 2) {
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
function getOverrides() {
  const configPath = path.join(process.cwd(), "crafty.config.js");

  if (fs.existsSync(configPath)) {
    return require(configPath);
  }

  console.log(`No crafty.config.js found in '${process.cwd()}', proceeding...`);
  return {};
}
exports.getOverrides = getOverrides;
