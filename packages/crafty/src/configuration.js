const path = require("path");
const fs = require("fs");
const merge = require("merge");
const resolve = require("enhanced-resolve");

const Crafty = require("./Crafty");
const defaultConfiguration = require("./defaultConfiguration");

const debug = require("debug")("configuration");

function resolveModule(module) {
  debug("resolveModule", module);
  try {
    // Try a first way
    return require(module);
  } catch (e) {
    // Try a more advanced way
    return require(resolve.sync(process.cwd() + "/node_modules", module));
  }
}

function isPresetLoaded(config, preset) {
  return config.loadedPresets.some(
    loadedPreset => loadedPreset.presetName === preset
  );
}

function hasUnloadedPresets(config) {
  return config.presets.some(preset => !isPresetLoaded(config, preset));
}

function loadPreset(config, preset) {
  if (isPresetLoaded(config, preset)) {
    return config;
  }
  const resolvedModule = resolveModule(preset);
  resolvedModule.presetName = preset;
  config.loadedPresets.push(resolvedModule);
  if (!resolvedModule.defaultConfig) {
    return config;
  }
  debug(resolvedModule.presetName + ".defaultConfig()");
  return merge.recursive(true, config, resolvedModule.defaultConfig());
}

function loadMissingPresets(config) {
  debug("loadMissingPresets", config.presets);
  while (hasUnloadedPresets(config)) {
    config.presets.forEach(preset => {
      config = loadPreset(config, preset);
    });
  }
  return config;
}

function getCrafty(presets, craftyConfig) {
  debug("getCrafty");

  let config = merge(true, defaultConfiguration, {
    destination: require("path").join(process.cwd(), "dist"),
    presets: presets.concat(craftyConfig.presets || []),
    loadedPresets: []
  });
  config = loadMissingPresets(config);
  config = merge.recursive(true, config, craftyConfig);

  // Use `crafty.config.js` like a preset
  // Add the preset as last item in order to be
  // able to override any behaviour from other presets
  craftyConfig.presetName = "crafty.config.js";
  config.loadedPresets.push(craftyConfig);

  // Apply overrides to clean up configuration
  config.loadedPresets.filter(preset => preset.config).forEach(preset => {
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
