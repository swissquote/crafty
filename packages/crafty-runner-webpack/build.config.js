const { getExternals } = require("../../utils/externals");

const externals = getExternals();

module.exports = [builder => builder("packages-webpack").externals(externals)];
