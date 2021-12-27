module.exports = [
  {
    name: "gulp-packages",
    externals: {
      "ansi-colors": "@swissquote/crafty/packages/ansi-colors",
      "fancy-log": "@swissquote/crafty/packages/fancy-log",
      "plugin-error": "@swissquote/crafty-commons-gulp/packages/plugin-error",
      "object-keys": "@swissquote/crafty-commons/packages/object-keys",
      "object.assign": "@swissquote/crafty-commons/packages/object-assign",
      glob: "@swissquote/crafty-commons/packages/glob",
    
      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream",
      "readable-stream/readable": "../../src/Readable.js",
      "readable-stream/passthrough": "../../src/PassThrough.js",
    }
  }
];
