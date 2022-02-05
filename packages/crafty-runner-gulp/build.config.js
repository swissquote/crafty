const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "gulp-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals()
    }
  }
];
