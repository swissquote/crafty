const test = require("ava");

const { prepareESLint, lint } = require("../../test_utils");

const engine = prepareESLint("format");

test("Gives no warning on correct code", async t => {
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

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 0);
});

test("Fails on badly formatted code", async t => {
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

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 4);
});
