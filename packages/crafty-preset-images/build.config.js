import path from "path";
import fs from "fs";
import { getExternals } from "../../utils/externals.js";
import { copyRecursiveSync, rmrf } from "../../utils/functions.js";
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const externals = getExternals();

export function keepDuplicateModule(libPath) {
  if (libPath.module === "tinypool" || libPath.module === "@onigoetz/resquoosh") {
    return false;
  }

  return true;
}

export function keepDuplicateFile({ file }) {
  // These files can't be deduplicated or are false positives
  if (file.indexOf("tinypool/dist/esm/chunk-") > -1 || file.indexOf("@onigoetz/resquoosh/dist/mjs/impl.js") > -1) {
    return false;
  }

  return true;
}

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
    // Delete them before re-addind them
    rmrf(path.join(process.cwd(), "codecs"))

    copyRecursiveSync(
      path.join(
        require.resolve("@onigoetz/resquoosh/impl.js"),
        "../../../codecs"
      ),
      path.join(__dirname, "codecs")
    );
  }
];
