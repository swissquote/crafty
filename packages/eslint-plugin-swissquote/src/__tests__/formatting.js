/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(require("../formatting"), {
  env: { browser: true }
});

describe("ES5 formatting", () => {
  it("Gives no warning on correct code", () => {
    const result = lint(
      engine,
      `
module.exports = function initJS(gulp, config, watchers) {
  var js = config.js,
    jsTasks = [];

  for (var name in js) {
    if (!js.hasOwnProperty(name)) {
      continue;
    }

    var taskName = "js_" + name;

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

  it("Warns on wrong format", () => {
    const result = lint(
      engine,
      `

function test() { "use strict"; fetch("This is spartaaa"); }

test()

`
    );

    expect(result.messages).toMatchSnapshot();
    expect(result.warningCount).toBe(0);
    expect(result.errorCount).toBe(2);
  });
});
