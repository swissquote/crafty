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
  gulpSourcemaps,
  gulpNewer,
  pluginError
};
