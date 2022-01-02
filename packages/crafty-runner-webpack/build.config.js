const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "packages-webpack",
    externals: {
      // Provided by other Crafty packages
      ...getExternals()
    }
  }
];
