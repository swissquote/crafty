const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "index",
    externals: {
        // Provided by other Crafty packages
        ...getExternals(),

        "fsevents" : "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends,
        "url": "../../src/url",

        // "readable-stream" is a drop-in replacement of "stream"
        // But its current version is big and outdated
        "readable-stream": "stream",
    }
  },
];
