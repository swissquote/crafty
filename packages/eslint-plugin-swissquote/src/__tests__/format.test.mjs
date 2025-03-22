import test from "node:test";
import { expect } from "expect";
import initSnapshot from "@onigoetz/ntr-expect-snapshot";

import { prepareESLint } from "../../test_utils.js";

initSnapshot(import.meta.url);

const lint = prepareESLint("format");

test("Gives no warning on correct code", async t => {
  const result = await lint(
    `
module.exports = function initJS(gulp, config, watchers) {
  const js = config.js,
    jsTasks = [];

  for (const name in js) {
    if (!js.hasOwnProperty(name)) {
      continue;
    }

    const taskName = \`js_\${name}\`;

    if (!compileWithWebpack(js[name])) {
      gulp.task(taskName, jsTaskES5(gulp, config, watchers, js[name]));
      watchers.add(js[name].watch || js[name].source, taskName);
    }

    jsTasks.push(taskName);
  }

  gulp.task("js", jsTasks);

  return ["js"];
};
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(0);
});

test("Fails on badly formatted code", async t => {
  const result = await lint(
    `
module.exports = function initJS(gulp, config, watchers) {
  const js = config.js,
     jsTasks = [];

  for (const name in js) {
    if (!js.hasOwnProperty(name)) {
      continue;
      }

    const taskName = \`js_\${name}\`;

    if (!compileWithWebpack(js[name])) {
      gulp.task(taskName, jsTaskES5(gulp, config, watchers, js[name]));
        watchers.add(js[name].watch || js[name].source, taskName);
    }

    jsTasks.push( taskName );
  }

  gulp.task("js", jsTasks);

  return ["js"];
};
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(4);
});
