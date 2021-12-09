module.exports = [
  {
    "name": "rollup-packages",
    externals: {
      glob: "@swissquote/crafty-commons/packages/glob",
      picomatch: "@swissquote/crafty-commons/packages/picomatch",
      fsevents: "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
    }
  }
];
