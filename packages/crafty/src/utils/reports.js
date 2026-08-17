const fs = require("node:fs");
const path = require("node:path");

const IGNORE_FILE_NAME = ".gitignore";

const IGNORE_FILE_CONTENT = `# Created by Crafty
# Reports are regenerated on every run, they are build artifacts
*
`;

/**
 * Tells if a directory is safe to hide from Git entirely.
 *
 * Report paths can be configured, we only want to write an ignore file in a
 * directory that is dedicated to reports, never in the project's root, and
 * never outside of it.
 *
 * @param {string} directory absolute path of the directory
 * @returns {boolean}
 */
function isDedicatedDirectory(directory) {
  const cwd = path.resolve(process.cwd());

  return directory !== cwd && directory.startsWith(cwd + path.sep);
}

/**
 * Create a directory that will hold generated reports, and make sure Git
 * ignores what Crafty writes in it.
 *
 * The ignore file is written inside the report directory itself instead of
 * appending to the project's `.gitignore`, this way Crafty never edits a file
 * that belongs to the project and it keeps working in monorepos, where each
 * package generates reports in its own directory.
 *
 * @param {string} directory path of the directory, relative to the current
 *                           working directory or absolute
 * @returns {string} the `directory` that was passed, for chaining
 */
function prepareReportsDirectory(directory) {
  const absoluteDirectory = path.resolve(directory);

  fs.mkdirSync(absoluteDirectory, { recursive: true });

  if (!isDedicatedDirectory(absoluteDirectory)) {
    return directory;
  }

  const ignoreFile = path.join(absoluteDirectory, IGNORE_FILE_NAME);
  if (!fs.existsSync(ignoreFile)) {
    fs.writeFileSync(ignoreFile, IGNORE_FILE_CONTENT);
  }

  return directory;
}

module.exports = {
  prepareReportsDirectory
};
