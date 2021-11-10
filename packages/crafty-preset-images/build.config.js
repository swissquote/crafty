module.exports = [
  {
    name: "index",
    externals: {
        "@swissquote/crafty/packages/ansi-colors" : "@swissquote/crafty/packages/ansi-colors",
        "fsevents" : "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends,
        "url": "../../src/url"
    }
  },
];
