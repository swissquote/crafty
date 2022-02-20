const { getExternals } = require("../../utils/externals");

module.exports = [
  builder => builder("gulp-packages").externals(getExternals())
];
