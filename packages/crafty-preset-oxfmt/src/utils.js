import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Flags that consume the following argument as their value.
// Used to tell positional paths apart from flag values.
const VALUE_FLAGS = new Set([
  "-c",
  "--config",
  "--ignore-path",
  "--stdin-filepath"
]);

/**
 * Resolve the oxfmt binary launcher (a small `#!/usr/bin/env node` shim that
 * loads the platform-specific NAPI binding).
 *
 * oxfmt's `exports` map does not expose `./bin/oxfmt`, so we locate it from the
 * package directory and its `bin` field instead.
 */
export function resolveOxfmtBin() {
  const pkgJsonPath = require.resolve("oxfmt/package.json");
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const bin = typeof pkg.bin === "string" ? pkg.bin : pkg.bin.oxfmt;
  return path.join(path.dirname(pkgJsonPath), bin);
}

/**
 * Whether the given argument list already contains a positional path
 * (i.e. something to format that is not a flag or a flag value).
 */
export function hasPositionalPath(args) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("-")) {
      continue;
    }
    const previous = args[i - 1];
    if (previous && VALUE_FLAGS.has(previous)) {
      continue;
    }
    return true;
  }
  return false;
}

/**
 * Reuse the existing `.prettierignore` so projects migrating from Prettier keep
 * their ignore rules without having to duplicate them, unless the caller
 * already provided an explicit `--ignore-path`.
 */
export function withDefaultIgnorePath(args) {
  if (args.includes("--ignore-path")) {
    return args;
  }

  const prettierIgnore = path.join(process.cwd(), ".prettierignore");
  if (existsSync(prettierIgnore)) {
    return [...args, "--ignore-path", ".prettierignore"];
  }

  return args;
}
