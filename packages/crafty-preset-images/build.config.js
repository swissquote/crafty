const { getExternals } = require("../../utils/externals");

module.exports = [
  (builder) =>
    builder("index").externals({
      // Provided by other Crafty packages
      ...getExternals(),

      fsevents: "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends,
      url: "../../src/url",
    }),
];
