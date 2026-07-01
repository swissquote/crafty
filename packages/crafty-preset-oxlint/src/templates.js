import fs from "node:fs";
import { createRequire } from "node:module";

import { toOxlintConfig } from "./oxlintConfigurator.js";

const require = createRequire(import.meta.url);
const tmp = require("@swissquote/crafty-commons/packages/tmp");

/**
 * Serialize the oxlint configuration to a temporary `.oxlintrc.json` file and
 * return its path. Used by the `oxlint` command and the build-time plugin.
 */
export function toTempConfigFile(crafty, config = {}) {
  const tmpfile = tmp.fileSync({ postfix: ".json" }).name;
  fs.writeFileSync(
    tmpfile,
    `${JSON.stringify(toOxlintConfig(crafty, config), null, 2)}\n`
  );
  return tmpfile;
}

/**
 * Generate the content of the `.oxlintrc.json` file written by `crafty ide`.
 * Uses the default (recommended) flavor plus any preset overrides.
 */
export function ideConfiguration(crafty) {
  return `${JSON.stringify(toOxlintConfig(crafty, {}), null, 2)}\n`;
}
