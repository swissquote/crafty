function gulpConcat() {
  return require("gulp-concat");
}

function gulpEslintNew() {
  return require("gulp-eslint-new");
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
  gulpNewer,
  pluginError
};
