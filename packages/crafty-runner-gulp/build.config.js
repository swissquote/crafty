const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "gulp-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),
    
      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream",
      "readable-stream/readable": "../../src/Readable.js",
      "readable-stream/passthrough": "../../src/PassThrough.js",
    }
  }
];
