const { getExternals } = require("../../utils/externals");

const singlePackages = [
  "ansi-colors",
  "braces",
  "browserslist",
  "colorize-template",
  "debug",
  "end-of-stream",
  "fancy-log",
  "fill-range",
  "find-up",
  "glob",
  "micromatch",
  "minimatch", // TODO :: is it possible to replicate the class-style Minimatch with micromatch ?

  "once",
  "source-map-js",
  "tmp",
  "to-regex-range",
  "wrappy"
];

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),

  // Provided by this package
  ...Object.fromEntries(singlePackages.map(pkg => [pkg, `../${pkg}/index.js`])),

  picomatch: "../picomatch/index.js",
  "picomatch/lib/utils": "../picomatch/utils.js",

  // To make sure we get up-to-date data
  "caniuse-lite": "caniuse-lite",
  "/caniuse-lite(/.*)/": "caniuse-lite$1"
};

module.exports = [
  ...singlePackages.map(pkg => {
    const newExternals = { ...externals };
    delete newExternals[pkg];

    return builder =>
      builder(pkg)
        .package()
        .externals(newExternals);
  }),
  builder => {
    const newExternals = { ...externals };
    delete newExternals.picomatch;
    delete newExternals["picomatch/lib/utils"];

    return builder("picomatch")
      .packages(pkgBuilder =>
        pkgBuilder
          .package("picomatch", "main", `dist/picomatch/index.js`)
          .package("picomatch/lib/utils", "utils", `dist/picomatch/utils.js`)
      )
      .externals(newExternals)
      .options({
        sourceMap: false
      });
  },

  builder =>
    builder("semver")
      .packages(pkgBuilder =>
        pkgBuilder
          .package("semver", "main")
          .package("semver/functions/clean", "clean")
          .package("semver/functions/cmp", "cmp")
          .package("semver/functions/coerce", "coerce")
          .package("semver/functions/parse", "parse")
          .package("semver/functions/valid", "valid")
      )
      .externals(externals)
      .options({
        sourceMap: false
      })
];
