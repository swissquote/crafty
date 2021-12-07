const ncc = require("@vercel/ncc");
const fs = require("fs");
const { existsSync } = require("fs");
const path = require("path");
const filesize = require("filesize");

const {
  dependencySizeTree,
  printDependencySizeTree,
} = require("webpack-bundle-size-analyzer");

function printStats(bundleStats) {
  const depTrees = dependencySizeTree(bundleStats);
  depTrees.forEach((tree) => printDependencySizeTree(tree, true));
}

module.exports = async function compile(input, output, bundle) {
  const { name, ...options } = bundle;
  await ncc(path.join(process.cwd(), input), {
    filename: path.basename(input),
    sourceMap: true,
    sourceMapRegister: true,
    ...options,
  }).then(async ({ code, assets, stats }) => {
    const dirname = path.dirname(output);

    if (!existsSync(dirname)) {
      await fs.promises.mkdir(dirname, { recursive: true });
    }

    console.log("Writing", output, filesize(code.length));
    await fs.promises.writeFile(output, code);

    if (assets) {
      const dirname = path.dirname(output);

      for (const [file, data] of Object.entries(assets)) {
        console.log(
          "Writing",
          `${dirname}/${file}`,
          filesize(data.source.length)
        );
        await fs.promises.writeFile(`${dirname}/${file}`, data.source);
      }
    }

    const bundleStats = stats.toJson();
    const bundleStatsString = JSON.stringify(bundleStats);

    console.log(
      "Writing",
      `${dirname}/${name}-stats.json`,
      filesize(bundleStatsString.length)
    );
    await fs.promises.writeFile(
      `${dirname}/${name}-stats.json`,
      bundleStatsString
    );

    console.log("\nBundle Stats\n------------");
    printStats(bundleStats);
    console.log("");
  });
};
