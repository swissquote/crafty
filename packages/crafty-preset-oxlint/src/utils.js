import path from "node:path";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * Resolve the oxlint binary launcher (a small `#!/usr/bin/env node` shim that
 * loads the platform-specific NAPI binding).
 *
 * oxlint's `exports` map does not expose `./bin/oxlint`, so we locate it from
 * the package directory and its `bin` field instead.
 */
export function resolveOxlintBin() {
  const pkgJsonPath = require.resolve("oxlint/package.json");
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const bin = typeof pkg.bin === "string" ? pkg.bin : pkg.bin.oxlint;
  return path.join(path.dirname(pkgJsonPath), bin);
}
