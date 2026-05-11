const { installModuleDirectoriesHook } = require("./module-directories-hook");

const moduleResolution = process.env.CRAFTY_VITEST_MODULE_RESOLUTION;

if (moduleResolution) {
  installModuleDirectoriesHook(JSON.parse(moduleResolution));
}
