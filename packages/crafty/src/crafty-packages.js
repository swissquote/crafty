function ansiColors() {
  return require("ansi-colors");
}

function anymatch() {
  return require("anymatch");
}

function asyncDone() {
  return require("async-done");
}

function browserslist() {
  return require("browserslist");
}

function camelcaseKeys() {
  return require("camelcase-keys");
}

function chokidar() {
  return require("chokidar");
}

function copyAnything() {
  return require("copy-anything");
}

function debug() {
  return require("debug");
}

function enhancedResolve() {
  return require("enhanced-resolve");
}

function fancyLog() {
  return require("fancy-log");
}

function findUp() {
  return require("find-up");
}

function isNegatedGlob() {
  return require("is-negated-glob");
}

function justDebounce() {
  return require("just-debounce");
}

function loudRejection() {
  return require("loud-rejection");
}

function mergeAnything() {
  return require("merge-anything");
}

function prettyHrTime() {
  return require("pretty-hrtime");
}

/**
 * We don't need it directly but many Crafty packages rely on it, providing it for convenience
 */
function tmp() {
  return require("tmp");
}

function undertaker() {
  return require("undertaker");
}

function yargsParser() {
  return require("yargs-parser");
}

module.exports = {
  ansiColors,
  anymatch,
  asyncDone,
  browserslist,
  camelcaseKeys,
  copyAnything,
  chokidar,
  debug,
  enhancedResolve,
  fancyLog,
  findUp,
  isNegatedGlob,
  justDebounce,
  loudRejection,
  mergeAnything,
  prettyHrTime,
  tmp,
  undertaker,
  yargsParser
};
