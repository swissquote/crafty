const { installModuleDirectoriesHook } = require("./module-directories-hook");

// Crafty serializes custom module resolution into the environment so this
// setup file can install the Node.js resolution hook inside the Vitest process.
const moduleResolution = process.env.CRAFTY_VITEST_MODULE_RESOLUTION;

if (moduleResolution) {
  installModuleDirectoriesHook(JSON.parse(moduleResolution));
}
