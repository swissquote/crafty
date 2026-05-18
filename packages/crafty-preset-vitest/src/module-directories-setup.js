const { installModuleDirectoriesHook } = require("./module-directories-hook");

// Crafty serializes custom module resolution into the environment because the
// generated Vitest config must stay serializable.
//
// The Vite runtime plugin covers imports that go through Vite's module
// pipeline, but it does not intercept plain Node/CommonJS resolution once a
// setup file is already executing inside the Vitest worker.
//
// This setup file runs in the same process as the tests and installs a Node.js
// fallback for bare-import require()/require.resolve() calls performed by setup
// files or other CommonJS code that runs at test runtime.
const moduleResolution = process.env.CRAFTY_VITEST_MODULE_RESOLUTION;

if (moduleResolution) {
  installModuleDirectoriesHook(JSON.parse(moduleResolution));
}
