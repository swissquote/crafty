module.exports = [
  {
    name: "index",
    externals: {
        "@swissquote/crafty-commons/packages/debug": "@swissquote/crafty-commons/packages/debug",
        "@swissquote/crafty/src/watch.js": "@swissquote/crafty/src/watch.js",
        glob: "@swissquote/crafty-commons/packages/glob"
    }
  },
];
