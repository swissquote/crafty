module.exports = [
  {
    name: "crafty-packages",
    externals: {
      fsevents: "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends

      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1", // To make sure we get up-to-date data

      picomatch: "@swissquote/crafty-commons/packages/picomatch"
    }
  }
];
