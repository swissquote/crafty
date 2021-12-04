module.exports = [
  {
    "name": "rollup-packages",
    externals: {
      glob: "@swissquote/crafty-commons/packages/glob",
      fsevents: "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
    }
  }
];
