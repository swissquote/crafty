const { test } = require("node:test");
const { expect } = require("expect");

const esmTransformer = require("../esm-transformer");

// The transformer only applies to dependencies, which live in `node_modules`
const FILENAME = "/project/node_modules/some-package/index.js";

function transform(code) {
  return esmTransformer.process(code, FILENAME).code;
}

test("it converts a file re-exporting everything with `export *`", () => {
  const code = transform(`export * from "./number.js";`);

  expect(code).not.toContain("export *");
  expect(code).toContain("require(");
});

test("it converts a file with named exports", () => {
  const code = transform(`export { number } from "./number.js";`);

  expect(code).not.toContain("export {");
  expect(code).toContain("require(");
});

test("it converts a file with a default export", () => {
  const code = transform(`export default 2;`);

  expect(code).not.toContain("export default");
  expect(code).toContain("exports.default");
});

test("it converts a file with imports", () => {
  const code = transform(`import number from "./number.js";\nnumber();`);

  expect(code).not.toContain("import number");
  expect(code).toContain("require(");
});

test("it leaves a commonjs file untouched", () => {
  const code = `const number = require("./number.js");\nmodule.exports = number;`;

  expect(transform(code)).toBe(code);
});

test("it leaves a file without imports or exports untouched", () => {
  const code = `const number = 2;`;

  expect(transform(code)).toBe(code);
});
