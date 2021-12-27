function gulpPostcss() {
  return require("gulp-postcss");
}

function gulpRename() {
  return require("gulp-rename");
}

function gulpStylelint() {
  return require("@swissquote/gulp-stylelint");
}

function resolveFrom() {
  return require("resolve-from");
}


function stylelint() {
  return require("stylelint");
}

function stylelintBin() {
  return require("stylelint/bin/stylelint");
}

module.exports = {
  gulpPostcss,
  gulpRename,
  gulpStylelint,
  resolveFrom,
  stylelint,
  stylelintBin
};
