import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { createRequire } from "node:module"

import { copyRecursiveSync } from "../../utils/functions.js";
import { getExternals } from "../../utils/externals.js";

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url));
//const __filename = fileURLToPath(import.meta.url);

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),

  //"webpack": "webpack",
  "webpack-sources": "../../src/webpack-sources.js",
  "webpack/lib/ModuleFilenameHelpers": "../../src/ModuleFilenameHelpers.js",

  lightningcss: "lightningcss"
};

export default [
  builder =>
    builder("webpack-packages")
      .esm()
      .packages(pkgBuilder =>
        pkgBuilder
          .package("css-loader", "cssLoader")
          .package("style-loader", "styleLoader")
          .package("lightningcss-loader", "lightningcssLoader")
      )
      .externals(externals),
  async function() {

    console.log("Patching dist/webpack-packages/bundled.js");
    const bundled = path.join(__dirname, "dist", "webpack-packages", "bundled.js");
    const content = await fs.promises.readFile(bundled, { encoding: "utf-8" });
    await fs.promises.writeFile(bundled, content.replace("../package.json", "../../package.json"));

    console.log("Copying style-loader/webpack-packages/runtime to dist/webpack-packages/runtime");
    const styleLoaderFolder = path.dirname(
      require.resolve("style-loader/package.json")
    );

    copyRecursiveSync(
      path.join(styleLoaderFolder, "dist", "runtime"),
      path.join(__dirname, "dist", "webpack-packages", "runtime")
    );
  },
];
