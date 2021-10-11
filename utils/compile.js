const ncc = require("@vercel/ncc");
const fs = require("fs");
const { existsSync } = require("fs");
const path = require("path");

module.exports = async function compile(input, output, options = {}) {
  await ncc(path.join(process.cwd(), input), {
    sourceMapRegister: false,
    ...options,
  }).then(async ({ code, map, assets }) => {
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
  });
};
