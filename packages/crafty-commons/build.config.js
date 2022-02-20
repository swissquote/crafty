const { getExternals } = require("../../utils/externals");

module.exports = [
  builder =>
    builder("common-packages").externals({
      // Provided by other Crafty packages
      ...getExternals(),

      // To make sure we get up-to-date data
      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1"
    })
];
