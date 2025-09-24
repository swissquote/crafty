const path = require("path");
const fs = require("fs");
const { getExternals } = require("../../utils/externals");

const craftyExternals = getExternals();

module.exports = [
  (builder) =>
    builder("eslint-packages")
      .packages((pkgBuilder) =>
        pkgBuilder
          .package("eslint-webpack-plugin", "eslintWebpackPlugin")
          .package("resolve-from", "resolveFrom")
      )
      .externals({
        // Provided by other Crafty packages
        ...craftyExternals,

        // Provided by this package
        eslint: "eslint",
        "schema-utils": "schema-utils",
      }),
  (builder) => builder("@microsoft/eslint-formatter-sarif").package().externals({
        // Provided by other Crafty packages
        ...craftyExternals,

        "lodash": "../../src/lodash-shim.js",

        // Those dependencies are required if we wish to embed the content of source files in the SARIF report
        // But we don't use that feature currently
        "jschardet": "../../src/shim.js",
        "utf8": "../../src/shim.js",
  }),
  async () => {
    console.log("Patching dist/eslint-packages/bundled.js");
    const bundled = path.join(
      __dirname,
      "dist",
      "eslint-packages",
      "bundled.js"
    );
    const content = await fs.promises.readFile(bundled, { encoding: "utf-8" });
    await fs.promises.writeFile(
      bundled,
      content.replace(
        /const eslintModule = __nccwpck_require__\(.*?\);/,
        "const eslintModule = require(eslintPath);"
      )
    );
  },
];
