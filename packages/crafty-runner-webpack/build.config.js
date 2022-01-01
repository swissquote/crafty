module.exports = [
  {
    name: "packages-webpack",
    externals: {
      anymatch: "@swissquote/crafty/packages/anymatch",
      chokidar: "@swissquote/crafty/packages/chokidar",
      "enhanced-resolve": "@swissquote/crafty/packages/enhanced-resolve",

      browserslist: "@swissquote/crafty-commons/packages/browserslist",
      debug: "@swissquote/crafty/packages/debug",
      glob: "@swissquote/crafty-commons/packages/glob",

      micromatch: "@swissquote/crafty-commons/packages/micromatch",
      minimatch: "@swissquote/crafty-commons/packages/minimatch",
      "object-keys": "@swissquote/crafty-commons/packages/object-keys",
      picomatch: "@swissquote/crafty-commons/packages/picomatch"
    }
  }
];
