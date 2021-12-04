module.exports = [
  {
    name: "common-packages",
    externals: [
      // To make sure we get up-to-date data
      "caniuse-lite",
      "caniuse-lite/dist/unpacker/agents",
      "caniuse-lite/dist/unpacker/feature",
      "caniuse-lite/dist/unpacker/region"
    ]
  }
];
