const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "index",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),
    }
  },
];
