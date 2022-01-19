function gulpConcat() {
  return require("gulp-concat");
}

function gulpEslintNew() {
  return require("gulp-eslint-new");
}

function gulpSourcemaps() {
  return require("gulp-sourcemaps");
}

function gulpNewer() {
  return require("@swissquote/gulp-newer");
}

function pluginError() {
  return require("plugin-error");
}

module.exports = {
  gulpConcat,
  gulpEslintNew,
  gulpSourcemaps,
  gulpNewer,
  pluginError
};
