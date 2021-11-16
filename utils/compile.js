const ncc = require("@vercel/ncc");
const fs = require("fs");
const { existsSync } = require("fs");
const path = require("path");

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
    sourceMap: true,
    sourceMapRegister: true,
    ...options,
  }).then(async ({ code, map, assets, stats }) => {
    const dirname = path.dirname(output);

    if (!existsSync(dirname)) {
      await fs.promises.mkdir(dirname, { recursive: true });
    }

    console.log("Writing", output);
    await fs.promises.writeFile(output, code);

    if (assets) {
      const dirname = path.dirname(output);

      for (const [file, data] of Object.entries(assets)) {
        console.log("Writing", `${dirname}/${file}`);
        await fs.promises.writeFile(`${dirname}/${file}`, data.source);
      }
    }

    if (map) {
      console.log("Writing", `${output}.map`);
      await fs.promises.writeFile(`${output}.map`, map);
    }

    const bundleStats = stats.toJson();

    console.log("Writing", `${dirname}/${name}-stats.json`);
    await fs.promises.writeFile(
      `${dirname}/${name}-stats.json`,
      JSON.stringify(bundleStats)
    );

    console.log("\nBundle Stats\n============");
    printStats(bundleStats);
  });
};
