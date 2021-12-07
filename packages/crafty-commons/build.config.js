module.exports = [
  {
    name: "common-packages",
    externals: {
      // To make sure we get up-to-date data
      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1",
    }
  }
];
