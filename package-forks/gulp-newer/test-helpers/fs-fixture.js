const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

/**
 * Minimal replacement for the subset of mock-fs used by these tests.
 * mock-fs patches Node.js internals and breaks on Node.js 26.8+
 * (https://github.com/tschaub/mock-fs/issues/447), so this creates the
 * file tree in a real temporary directory and makes it the working directory.
 */

const FILE = Symbol("file");

let originalCwd = null;
let tmpDir = null;

function file({ content = "", mtime } = {}) {
  return { [FILE]: true, content, mtime };
}

function create(dir, tree) {
  for (const [name, entry] of Object.entries(tree)) {
    const target = path.join(dir, name);
    if (typeof entry === "string") {
      fs.writeFileSync(target, entry);
    } else if (entry[FILE]) {
      fs.writeFileSync(target, entry.content);
      if (entry.mtime) {
        fs.utimesSync(target, entry.mtime, entry.mtime);
      }
    } else {
      fs.mkdirSync(target);
      create(target, entry);
    }
  }
}

function restore() {
  if (originalCwd) {
    process.chdir(originalCwd);
    originalCwd = null;
  }
  if (tmpDir) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    tmpDir = null;
  }
}

function mock(tree) {
  restore();
  tmpDir = fs.realpathSync(
    fs.mkdtempSync(path.join(os.tmpdir(), "gulp-newer-"))
  );
  create(tmpDir, tree);
  originalCwd = process.cwd();
  process.chdir(tmpDir);
}

mock.file = file;
mock.restore = restore;

module.exports = mock;
