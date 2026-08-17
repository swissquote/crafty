const { test, beforeEach, afterEach } = require("node:test");
const { expect } = require("expect");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { prepareReportsDirectory } = require("../utils/reports");

let initialCwd;
let root;
let project;

beforeEach(() => {
  initialCwd = process.cwd();
  root = fs.realpathSync(
    fs.mkdtempSync(path.join(os.tmpdir(), "crafty-reports-"))
  );
  project = path.join(root, "project");
  fs.mkdirSync(project);
  process.chdir(project);
});

afterEach(() => {
  process.chdir(initialCwd);
  fs.rmSync(root, { recursive: true, force: true });
});

function readIgnoreFile(directory) {
  return fs.readFileSync(path.join(project, directory, ".gitignore"), "utf-8");
}

test("creates the directory and ignores its content", () => {
  expect(prepareReportsDirectory("reports/eslint")).toBe("reports/eslint");

  expect(fs.existsSync(path.join(project, "reports/eslint"))).toBe(true);
  expect(readIgnoreFile("reports/eslint").split(/\r?\n/)).toContain("*");
});

test("keeps an existing ignore file untouched", () => {
  fs.mkdirSync(path.join(project, "reports"), { recursive: true });
  fs.writeFileSync(path.join(project, "reports/.gitignore"), "*.xml\n");

  prepareReportsDirectory("reports");

  expect(readIgnoreFile("reports")).toBe("*.xml\n");
});

test("is idempotent", () => {
  prepareReportsDirectory("reports");
  const first = readIgnoreFile("reports");

  prepareReportsDirectory("reports");

  expect(readIgnoreFile("reports")).toBe(first);
  expect(fs.readdirSync(path.join(project, "reports"))).toEqual([".gitignore"]);
});

test("never ignores the whole project", () => {
  prepareReportsDirectory(".");

  expect(fs.existsSync(path.join(project, ".gitignore"))).toBe(false);
});

test("never ignores a directory outside of the project", () => {
  prepareReportsDirectory("../outside");

  expect(fs.existsSync(path.join(root, "outside"))).toBe(true);
  expect(fs.existsSync(path.join(root, "outside/.gitignore"))).toBe(false);
});
