import { execaNode } from "execa";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function snapshotizeOutput(ret) {
  const escapedPath = path
    .join(__dirname, "..", "..")
    .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  return ret
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g, // eslint-disable-line no-control-regex
      ""
    ) // Remove ansi colors
    .replace(/^\[[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\]/gm, "[__:__:__]") // Remove timestamps
    .replace(/after ([0-9]*(?:\.[0-9]*)?) (h|min|[mnμ]?s)/g, "after ____ ms") // Remove durations
    .replace(/Δt ([0-9]*(?:\.[0-9]*)?)(h|min|[mnμ]?s)/g, "Δt ____ms") // Remove durations
    .replace(/\d+(?:\.\d+)? KiB/g, "___ KiB") // Remove sizes from webpack
    .replace(/\d+ bytes/g, "___ KiB") // Remove sizes from webpack
    .replace(/LOG .*\n(?:<[wie]>.*\n)+\+.*\n/gm, "") // Remove profiling logs from webpack
    .replace(/(?: {4}at .*\n)* {4}at .*/gm, "    ...stacktrace...") // Remove stacktraces
    .replace(/\(node:[0-9]*\)/gm, "(node:11111)")
    .replace(
      /\n\(node:11111\).*?DeprecationWarning: Buffer\(\).*?instead.$/gm,
      ""
    ) // Remove Buffer warnings as they come from compiled dependencies
    .replace(
      /\(node:11111\).*?ExperimentalWarning: VM Modules is an experimental feature.*/gm,
      "(node:11111) ExperimentalWarning: VM Modules is an experimental feature."
    ) // VM Modules warning changes between node versions
    .replace(
      /\n\(Use `node --trace-deprecation ...` to show where the warning was created\)/g,
      ""
    ) // This error doesn't appear on all node version, better to remove it
    .replace(
      /\n\(Use `node --trace-warnings ...` to show where the warning was created\)/g,
      ""
    ) // This error doesn't appear on all node version, better to remove it
    .replace(
      /\n\(node:11111\) ExperimentalWarning: stream\/web is an experimental feature. This feature could change at any time/g,
      ""
    ) // This error doesn't appear on all node version, better to remove it
    .replace(
      /\n\(node:11111\) \[DEP0148\] DeprecationWarning: Use of deprecated folder mapping "(?:.*)" in the "exports" field module resolution of the package at .*\nUpdate this package\.json to use a subpath pattern like .*/gm,
      ""
    ) // Remove Node exports warnings
    .replace(
      /\n\(node:11111\) \[DEP0040\] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead./g,
      ""
    )
    .replace(
      /Starting Crafty ([0-9]+\.[0-9]+\.[0-9]+)/g,
      "Starting Crafty __version__"
    ) // Remove version information in crafty output
    .replace(/^(\s*)PASS(\s*)/gm, "PASS ") // Fix weird space in some case with nested jest runs (Jest)
    .replace(/^(\s*)FAIL(\s*)/gm, "FAIL ") // Fix weird space in some case with nested jest runs (Jest)
    .replace(
      /^Time: {8}([0-9]*(?:\.[0-9]*)?)\s?(h|min|[mnμ]?s)(, estimated ([0-9]*(?:\.[0-9]*)?)\s(h|min|[mnμ]?s))?/gm,
      "Time:        _____s"
    ) // Remove test durations (Jest)
    .replace(
      /(PASS|FAIL) (.*)\s\(([0-9]*(?:\.[0-9]*)?)\s?(h|min|[mnμ]?s)\)/,
      "$1 $2"
    ) // Remove long test durations (Jest)
    .replace(
      /^ {2}( {2})?(✓|✕) (.*?) \(([0-9]*(?:\.[0-9]*)?)\s?(h|min|[mnμ]?s)\)/gm,
      "  $1$2 $3"
    ) // Remove test result duration (Jest)
    .replace(
      /\/[-\w\/\.]*?\/npm-([a-z-]{1,213})([0-9\.]*)-([a-z0-9]{40})/gm,
      "__PATH__"
    ) // Remove paths
    .replace(
      /"moduleDirectories": \[([\s\S]*?)\]/g,
      `"moduleDirectories": [ /* Ignored paths for diff */ ]`
    ) // Fix paths that tend to vary by environment
    .replace(/webpackJsonp_([a-z0-9]{8})/gm, "webpackJsonp_UNIQID") // make random webpackjsonp less random
    .replace(/\/.pnp\/externals\/pnp-[a-f0-9]{40}/, "") // Normalize Yarn PNP Paths
    .replace(/ {4}domain: \[object Object\]\n/gm, "") // domain was removed from node 11.0
    .replace(/Error \[GenericFailure\]:/, "Error:") // Node 10 specific errors
    .replace(new RegExp(escapedPath, "gm"), "__PATH__") // Remove paths
    .replace(
      /https:\/\/www\.npmjs\.com\/package\/gulp-eslint-new\/v\/(.*?)#autofix/gm,
      "https://www.npmjs.com/package/gulp-eslint-new/v/VERSION#autofix"
    )
    .replace(/[\t\f\v ]+$/gm, "") // Remove spaces at EOL
    .replace(/\.\/([A-Za-z\/\.]*)\n\n__PATH__/gm, `./$1\n__PATH__`) // Sometimes lint output has more line breaks for no known reason ...
    .replace(/\n\n\n+/g, "\n\n"); // Replace multi line breaks by single one
}

export function snapshotizeCSS(ret) {
  return ret.replace(/url\((?:'|")?(.*)\?(.*)\)/g, "url($1?CACHEBUST)"); // Cache busting
}

export async function run(args, cwd, commandOptions) {
  const options = {
    cwd,
    reject: false,
    all: true,
    ...commandOptions
  };

  options.env = { TESTING_CRAFTY: "true", ...options.env };

  const ret = await execaNode(
    require.resolve("@swissquote/crafty/src/bin.cjs"),
    args,
    options
  );

  return {
    status: ret.exitCode,
    stdall: ret.all ? `\n${snapshotizeOutput(ret.all.toString("utf8"))}\n` : ""
  };
}

export function readFile(cwd, file) {
  return fs.readFileSync(path.join(cwd, file)).toString("utf8");
}

export function exists(cwd, file) {
  return fs.existsSync(path.join(cwd, file));
}

export function readForSnapshot(cwd, file) {
  return snapshotizeOutput(readFile(cwd, file));
}

export async function getCleanFixtures(fixtures, clean = ["dist"]) {
  const dir = path.join(__dirname, "..", "integration-fixtures-cjs", "fixtures", fixtures);
  for (const dirToClean of clean) {
    // eslint-disable-next-line no-await-in-loop
    await fs.promises.rm(path.join(dir, dirToClean), {
      force: true,
      recursive: true
    });
  }

  return dir;
}
