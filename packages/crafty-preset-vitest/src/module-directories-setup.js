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
//
// Upstream context:
// - https://vitest.dev/config/alias
// - https://github.com/vitest-dev/vitest/issues/4842
// - https://github.com/vitest-dev/vitest/discussions/3134
//
// Vitest only applies Vite-based resolution to import/import() from files it
// processes. Bare CommonJS require()/require.resolve() calls are not
// intercepted, so Crafty's custom moduleDirectories/moduleFileExtensions would
// otherwise be ignored in setup files and other runtime CommonJS code. If
// Vitest ever routes these require() calls through its resolver, this fallback
// can likely be removed.
const moduleResolution = process.env.CRAFTY_VITEST_MODULE_RESOLUTION;

if (moduleResolution) {
  installModuleDirectoriesHook(JSON.parse(moduleResolution));
}
