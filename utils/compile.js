const ncc = require("@vercel/ncc");
const fs = require("fs");
const { existsSync } = require("fs");
const path = require("path");

function getBundleInfos(sources) {
  const externals = [];
  const packages = {};

  sources
    .map((source) => source.replace(/^.*webpack:\/\//, ""))
    .map(path.normalize)
    .forEach((source) => {
      const segments = source.split(/\//g);

      let reconstructed = [];
      let isNodeModule = false;
      const length = segments.length;
      for (let i = 0; i < length; i++) {
        const segment = segments[i];

        if (segment == "node_modules") {
          isNodeModule = true;
          continue;
        }

        // If the first item hasn't been recognized as "node_modules", we might already be in a node module name
        if (i == 0) {
          isNodeModule = true;
        }

        if (isNodeModule) {
          // If it's a scoped package, we can already get the next segment and skip it
          if (segment[0] == "@") {
            reconstructed.push(`${segment}/${segments[i + 1]}`);
            i++;
          } else {
            reconstructed.push(segment);
          }

          isNodeModule = false;
          continue;
        }

        const rest = segments.slice(i).join("/");
        const key = reconstructed.join(" -> ");

        if (/external "/.test(rest)) {
          externals.push(rest);
          break;
        }

        if (reconstructed.length == 0) {
          console.log("Don't know what to do with", {
            source,
            reconstructed,
            rest,
          });
          break;
        }

        if (!packages.hasOwnProperty(key)) {
          packages[key] = [];
        }
        packages[key].push(rest);
      }
    });

  return {
    packages,
    externals,
  };
}

module.exports = async function compile(input, output, options = {}) {
  await ncc(path.join(process.cwd(), input), {
    sourceMap: true,
    sourceMapRegister: true,
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

      const sources = JSON.parse(map).sources;

      const { externals, packages } = getBundleInfos(sources);

      console.log("Externals:");
      externals.forEach((external) => {
        console.log("-", external);
      });

      console.log("");

      console.log("Package contents:");
      Object.keys(packages)
        .sort()
        .forEach((key) => {
          console.log("-", key, "(", packages[key].join(", "), ")");
        });
    }
  });
};
