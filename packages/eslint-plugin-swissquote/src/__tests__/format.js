/* global describe, it, expect */

const { prepareESLint, lint } = require("../../test_utils");

const engine = prepareESLint("format");

describe("ES6 Formatting", () => {
  it("Gives no warning on correct code", async () => {
    const result = await lint(
      engine,
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
    expect(result.warningCount).toBe(0);
    expect(result.errorCount).toBe(0);
  });

  it("Fails on badly formatted code", async () => {
    const result = await lint(
      engine,
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
    expect(result.warningCount).toBe(0);
    expect(result.errorCount).toBe(4);
  });
});
