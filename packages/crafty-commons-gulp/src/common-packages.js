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
  gulpEslintNew,
  gulpSourcemaps,
  gulpNewer,
  pluginError
};
