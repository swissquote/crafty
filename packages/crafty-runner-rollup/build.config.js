module.exports = [
  {
    "name": "rollup-packages",
    externals: [
      "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
    ]
  }
];
