const path = require("path");
const fs = require("fs");
const { getExternals } = require("../../utils/externals");

module.exports = [
  builder => builder("eslint-packages")
  .packages(pkgBuilder =>
    pkgBuilder
      .package("eslint-webpack-plugin", "eslintWebpackPlugin")
      .package("resolve-from", "resolveFrom")
  )
  .externals({
    // Provided by other Crafty packages
    ...getExternals(),

    // Provided by this package
    "eslint": "eslint",
    "schema-utils": "schema-utils"
  }),
  async () => {
    console.log("Patching dist/eslint-packages/bundled.js");
    const bundled = path.join(__dirname, "dist", "eslint-packages", "bundled.js");
    const content = await fs.promises.readFile(bundled, { encoding: "utf-8" });
    await fs.promises.writeFile(bundled, content.replace(/const eslintModule = __nccwpck_require__\(.*?\);/, "const eslintModule = require(eslintPath);"));
  }
];
