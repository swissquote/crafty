module.exports = [
  {
    name: "common-packages",
    externals: {
      glob: "@swissquote/crafty-commons/packages/glob",
      debug: "@swissquote/crafty-commons/packages/debug",
      "object-assign": "@swissquote/crafty-commons/packages/object-assign",

      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream"
    }
  }
];
