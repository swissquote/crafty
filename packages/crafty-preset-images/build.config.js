import path from "path";
import fs from "fs";
import { getExternals } from "../../utils/externals.js";
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const externals = getExternals();

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

export default [
  (builder) =>
    builder("index").options({esm: true, sourceMap: false}).externals({
      // Provided by other Crafty packages
      ...externals,

      fsevents: "fsevents", // it's an optional dependency that can only be installed on macOS. Leave that to npm and friends,
    }),
    (builder) =>
    builder("tinypool worker")
    .options({esm: true, sourceMap: false})
      .source(
        path.relative(
          process.cwd(),
          require.resolve("tinypool/dist/esm/entry/worker.js")
        )
      )
      .destination("dist/compiled/entry/worker.js")
      .externals(externals),
  (builder) => {

    // Building the main file will detect the worker and write it with a weird name, but not compile it.
    // This will detect the name that was chosen and properly compile it
    const stats = JSON.parse(fs.readFileSync("./dist/compiled/index-stats.json"));
    const filename = stats.assets
      .find(asset => asset.info?.sourceFilename?.indexOf("resquoosh/dist/mjs/impl.js") > -1).name;

    return builder("resquoosh worker")
      .options({esm: true, sourceMap: false})
      .source(
        path.relative(
          process.cwd(),
          require.resolve("@onigoetz/resquoosh/impl.mjs")
        )
      )
      .destination(`dist/compiled/${filename}`)
      .externals(externals);
  },
    
  () => {
    copyRecursiveSync(
      path.join(
        require.resolve("@onigoetz/resquoosh/impl.js"),
        "../../../codecs"
      ),
      path.join(__dirname, "codecs")
    );
  }
];
