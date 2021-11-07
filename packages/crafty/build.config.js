module.exports = [
  {
    name: "crafty-packages",
    externals: [
      "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
      "caniuse-lite" // To make sure we get up-to-date data
    ]
  }
];
