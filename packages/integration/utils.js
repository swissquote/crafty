import { execaNode } from "execa";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const craftyBin = require.resolve("@swissquote/crafty/src/bin.cjs");
const requireModule = createRequire(import.meta.url);
const vitestCli = path.join(
  path.dirname(requireModule.resolve("vitest/package.json")),
  "vitest.mjs"
);

function getCraftyOptions(cwd, commandOptions) {
  const options = {
    cwd,
    reject: false,
    all: true,
    ...commandOptions
  };

  options.env = { TESTING_CRAFTY: "true", ...options.env };

  return options;
}

function getWatchOutput(chunks) {
  return chunks.length === 0 ? "" : Buffer.concat(chunks).toString("utf8");
}

function appendStreamChunks(chunks, stream) {
  if (!stream) {
    return;
  }

  stream.on("data", chunk => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  });
}

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
    .replace(/Rsdoctor v[0-9.]+/gm, "Rsdoctor vx.x.x")
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
    ) // Warning in Node 24
    .replace(
      /\n\(node:11111\) \[DEP0169\] DeprecationWarning: `url.parse\(\)` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse\(\)` vulnerabilities./g,
      ""
    )
    .replace(
      /Starting Crafty ([0-9]+\.[0-9]+\.[0-9]+)/g,
      "Starting Crafty __version__"
    ) // Remove version information in crafty output
    .replace(/(https?:\/\/localhost:)\d+/gm, "$1__PORT__") // Watch mode picks the first free port in a range
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

function normalizeOutput(output) {
  return output ? `\n${snapshotizeOutput(output)}\n` : "";
}

function createWatchHandle(child, chunks, exitPromise) {
  return {
    child,
    getStdall() {
      return normalizeOutput(getWatchOutput(chunks));
    },
    async stop(signal = "SIGTERM") {
      if (child.exitCode === null && !child.killed) {
        child.kill(signal);
      }

      const result = await exitPromise;

      return {
        status: result.exitCode ?? null,
        // Prefer execa's final aggregated output once the process exits; the
        // live chunks are only a fallback for interrupted watch sessions.
        stdall: result.all
          ? normalizeOutput(result.all.toString("utf8"))
          : this.getStdall(),
        timedOut: Boolean(result.timedOut),
        isCanceled: Boolean(result.isCanceled)
      };
    }
  };
}

export function snapshotizeCSS(ret) {
  return ret.replace(/url\((?:'|")?(.*)\?(.*)\)/g, "url($1?CACHEBUST)"); // Cache busting
}

export async function run(args, cwd, commandOptions) {
  const options = getCraftyOptions(cwd, commandOptions);

  const ret = await execaNode(craftyBin, args, options);

  return {
    status: ret.exitCode,
    stdall: ret.all ? normalizeOutput(ret.all.toString("utf8")) : ""
  };
}

export async function runVitest(args, cwd, commandOptions) {
  const options = getCraftyOptions(cwd, commandOptions);

  const ret = await execaNode(vitestCli, args, options);

  return {
    status: ret.exitCode,
    stdall: ret.all ? normalizeOutput(ret.all.toString("utf8")) : ""
  };
}

export async function getIsolatedFixtures(fixtures, clean = ["dist"]) {
  const sourceDir = path.join(
    __dirname,
    "..",
    "integration-fixtures-cjs",
    "fixtures",
    fixtures
  );
  // Keep the temp copy next to the original fixture so relative layout
  // assumptions made by watch-mode builds still match the tracked fixture.
  const tmpDir = await fs.promises.mkdtemp(
    path.join(path.dirname(sourceDir), "tmp-")
  );

  await fs.promises.cp(sourceDir, tmpDir, { recursive: true });

  for (const dirToClean of clean) {
    // eslint-disable-next-line no-await-in-loop
    await fs.promises.rm(path.join(tmpDir, dirToClean), {
      force: true,
      recursive: true
    });
  }

  return {
    cwd: tmpDir,
    async cleanup() {
      await fs.promises.rm(tmpDir, {
        force: true,
        recursive: true
      });
    }
  };
}

export function startWatch(args, cwd, commandOptions) {
  const options = getCraftyOptions(cwd, commandOptions);
  const child = execaNode(craftyBin, args, options);
  const chunks = [];

  // Execa's final `all` output is easiest to consume after exit, so keep a
  // live fallback while the long-running watch process is still active.
  appendStreamChunks(chunks, child.stdout);
  appendStreamChunks(chunks, child.stderr);

  const exitPromise = child.catch(error => {
    if (error.isCanceled || error.timedOut) {
      return error;
    }

    throw error;
  });

  return createWatchHandle(child, chunks, exitPromise);
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

export async function waitFor(check, description, timeout = 30000) {
  const endTime = Date.now() + timeout;

  // Watch-mode assertions are driven by emitted files changing over time, not
  // by the process exiting, so a small polling helper keeps those tests simple.
  while (Date.now() < endTime) {
    // eslint-disable-next-line no-await-in-loop
    const result = await check();

    if (result) {
      return result;
    }

    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
  }

  throw new Error(`Timed out waiting for ${description}`);
}

export async function getCleanFixtures(fixtures, clean = ["dist"]) {
  const dir = path.join(
    __dirname,
    "..",
    "integration-fixtures-cjs",
    "fixtures",
    fixtures
  );
  for (const dirToClean of clean) {
    // eslint-disable-next-line no-await-in-loop
    await fs.promises.rm(path.join(dir, dirToClean), {
      force: true,
      recursive: true
    });
  }

  return dir;
}
