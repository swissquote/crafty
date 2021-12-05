function babelLoader() {
  return require("babel-loader");
}

function gulpBabel() {
  // Imports libraries still using `new Buffer()` which cause deprecation warnigns
  //return require("gulp-babel");
}

function gulpConcat() {
  return require("gulp-concat");
}

function gulpTypescript() {
  // Imports libraries still using `new Buffer()` which cause deprecation warnigns
  //return require("gulp-typescript");
}

function rollupPluginBabel() {
  return require("@rollup/plugin-babel");
}

function rollupPluginTypescript() {
  return require("rollup-plugin-typescript2");
}

function tsJest() {
  return require("ts-jest");
}

function tsLoader() {
  return require("ts-loader");
}

module.exports = {
  babelLoader,
  gulpBabel,
  gulpConcat,
  gulpTypescript,
  rollupPluginBabel,
  rollupPluginTypescript,
  tsJest,
  tsLoader
};
