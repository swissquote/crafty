const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "crafty-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
      fsevents: "fsevents",

      // To make sure we get up-to-date data
      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1"
    }
  }
];
