import { setTimeout } from "node:timers/promises";
import fs from "node:fs";
import path from "node:path";
import ncc from "@vercel/ncc";
import { createRslib } from "@rslib/core";
import filesize from "filesize";

import checkStats from "./check-stats.js";

export { ncc };

function getStatsName(name) {
  return `${name.replace("@", "").replace("/", "-")}-stats.json`;
}

export async function handleNCCResult(name, output, { code, assets, stats }) {
  const dirname = path.dirname(output);

  if (!fs.existsSync(dirname)) {
    await fs.promises.mkdir(dirname, { recursive: true });
  }

  console.log("Writing", output, filesize(code.length));
  await fs.promises.writeFile(output, code);

  if (assets) {
    for (const [file, data] of Object.entries(assets)) {
      const dir = path.dirname(`${dirname}/${file}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      console.log(
        "Writing",
        `${dirname}/${file}`,
        filesize(data.source.length)
      );
      // eslint-disable-next-line no-await-in-loop
      await fs.promises.writeFile(`${dirname}/${file}`, data.source);
    }
  }

  const bundleStats = stats.toJson();
  const bundleStatsString = JSON.stringify(bundleStats);

  const fileName = `${dirname}/${getStatsName(name)}`;

  console.log("Writing", fileName);
  await fs.promises.writeFile(fileName, bundleStatsString);

  checkStats(bundleStats, fileName);
}

async function compileNcc(input, output, bundle) {
  const { name, ...options } = bundle;
  const out = await ncc(path.join(process.cwd(), input), {
    quiet: true,
    filename: path.basename(input),
    sourceMap: true,
    sourceMapRegister: true,
    ...options
  });

  await handleNCCResult(name, output, out);
}

async function compileRSLib(input, output, bundle) {
  const {
    name,
    esm,
    externals,
    filename,
    sourceMap,
    ...unhandledOptions
  } = bundle;

  if (Object.keys(unhandledOptions).length > 0) {
    console.error("Unhandled options", unhandledOptions);
  }

  const entry = path.basename(output, path.extname(output));

  const dirname = path.dirname(output);

  await fs.promises.mkdir(dirname, { recursive: true });

  const rslib = await createRslib({
    config: {
      lib: [
        {
          format: esm ? "esm" : "cjs",
          target: "node",
          syntax: ["node >= 20"],
          shims: {
            esm: {
              __filename: true,
              __dirname: true,
              require: true
            }
          },
          source: {
            entry: {
              [entry]:
                input === "_temp_ncc.cjs" || input === "_temp_ncc.mjs"
                  ? `./${input}`
                  : input
            }
          },
          autoExternal: false,
          output: {
            externals: externals || [],
            distPath: {
              root: dirname
            },
            ...(sourceMap
              ? {
                  sourceMap: {
                    js: "source-map"
                  }
                }
              : {})
          }
        }
      ],
      performance: {
        bundleAnalyze: {
          analyzerMode: "disabled",
          generateStatsFile: true,
          statsFilename: getStatsName(name)
        }
      }
    }
  });

  await rslib.build();

  const statsFile = `${dirname}/${getStatsName(name)}`;

  let stats = null;
  try {
    stats = JSON.parse(fs.readFileSync(statsFile));
  } catch {
    // The file might not be parseable yet,
    // so we try to wait a bit
    await setTimeout(1000);
    stats = JSON.parse(fs.readFileSync(statsFile));
  }

  checkStats(stats, statsFile);
}

export async function compile(input, output, bundle) {
  if (bundle.esm) {
    // it should be possible to compile "bundle.cjs" with rslib
    // but cjs default exports seem to not be supported
    await compileRSLib(input, output, bundle);
  } else {
    await compileNcc(input, output, bundle);
  }
}

export async function replaceContent(src, cb) {
  const content = await fs.promises.readFile(src, { encoding: "utf-8" });
  await fs.promises.writeFile(src, cb(content));
}

export async function patchESMForCJS(file, patterns) {
  console.log("Patching", file.replace(`${process.cwd()}/`, ""));

  const pkgs = patterns.join("|");
  const regex = new RegExp(
    `module\\.exports = (__WEBPACK_EXTERNAL_MODULE__(?:${pkgs})_[\\w]{5,20}__);`,
    "gm"
  );

  await replaceContent(file, content =>
    content.replace(regex, `module.exports = $1.default;`)
  );
}

export async function copyFile(src, dest) {
  const dirname = path.dirname(dest);

  if (!fs.existsSync(dirname)) {
    await fs.promises.mkdir(dirname, { recursive: true });
  }

  console.log("Copying", src, "to", dest);
  await fs.promises.copyFile(src, dest);
}
