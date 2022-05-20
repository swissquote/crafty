const { getExternals } = require("../../utils/externals");

module.exports = [
  builder =>
    builder("crafty-packages")
      .packages(pkgBuilder =>
        pkgBuilder
          .package("anymatch", "anymatch")
          .package("async-done", "asyncDone")
          .package("camelcase-keys", "camelcaseKeys")
          .package("chokidar", "chokidar")
          .package("copy-anything", "copyAnything")
          .package("enhanced-resolve", "enhancedResolve")
          .package("is-negated-glob", "isNegatedGlob")
          .package("just-debounce", "justDebounce")
          .package("loud-rejection", "loudRejection")
          .package("merge-anything", "mergeAnything")
          .package("pretty-hrtime", "prettyHrTime")
          .package("@swissquote/undertaker", "undertaker")
          .package("yargs-parser", "yargsParser")
      )
      .externals({
        // Provided by other Crafty packages
        ...getExternals(),

        // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends
        fsevents: "fsevents",

        // To make sure we get up-to-date data
        "caniuse-lite": "caniuse-lite",
        "/caniuse-lite(/.*)/": "caniuse-lite$1"
      })
];
