const ncc = require("@vercel/ncc");
const fs = require("fs");
const { existsSync } = require("fs");
const path = require("path");
const filesize = require("filesize");

async function handleNCCResult(name, output, { code, assets, stats }) {
  const dirname = path.dirname(output);

  if (!existsSync(dirname)) {
    await fs.promises.mkdir(dirname, { recursive: true });
  }

  console.log("Writing", output, filesize(code.length));
  await fs.promises.writeFile(output, code);

  if (assets) {
    const dirname = path.dirname(output);

    for (const [file, data] of Object.entries(assets)) {

      const dir = path.dirname(`${dirname}/${file}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
      }

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
    `${dirname}/${name.replace("@", "").replace("/", "-")}-stats.json`
  );
  await fs.promises.writeFile(
    `${dirname}/${name.replace("@", "").replace("/", "-")}-stats.json`,
    bundleStatsString
  );

  console.log(bundleStats.modules.length, "modules");
  console.log("");
}

async function compile(input, output, bundle) {
  const { name, ...options } = bundle;
  await ncc(path.join(process.cwd(), input), {
    quiet: true,
    filename: path.basename(input),
    sourceMap: true,
    sourceMapRegister: true,
    ...options,
  }).then((out) => handleNCCResult(name, output, out));
};

module.exports = {
  ncc,
  compile,
  handleNCCResult
}