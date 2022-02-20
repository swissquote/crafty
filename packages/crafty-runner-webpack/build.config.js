const { getExternals } = require("../../utils/externals");

module.exports = [
  builder => builder("packages-webpack").externals(getExternals())
];
