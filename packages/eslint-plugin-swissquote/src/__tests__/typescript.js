const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(
  require("../formatting"),
  require("../typescript"),
  { parser: require.resolve("@typescript-eslint/parser") }
);

it("Fails on badly formatted TypeScript code", () => {
  const result = lint(
    engine,
    `
module.exports = function initJS  (gulp, config: {}, watchers): string[] {
  const js = config.js,
     jsTasks: string[] = [];

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
  expect(result.errorCount).toBe(5);
});
