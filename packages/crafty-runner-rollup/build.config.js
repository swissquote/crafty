const { getExternals } = require("../../utils/externals");

module.exports = [
  builder =>
    builder("rollup-packages").externals({
      // Provided by other Crafty packages
      ...getExternals(),

      // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
      fsevents: "fsevents"
    })
];
