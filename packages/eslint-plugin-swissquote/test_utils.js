const {
  CLIEngine,
  getCLIEngineInternalSlots
} = require("eslint/lib/cli-engine/cli-engine.js");
const fs = require("fs");
const tmp = require("tmp");

const definedRules = require("./rules");

function prepareCLIEngine(...args) {
  const config = {
    plugins: ["@swissquote/swissquote"],
    extends: args.map(preset => `plugin:@swissquote/swissquote/${preset}`),
    rules: {},
    settings: {}
  };

  const tmpfile = tmp.fileSync({ postfix: ".json" }).name;
  fs.writeFileSync(tmpfile, JSON.stringify(config));

  const configuration = {
    useEslintrc: false,
    configFile: tmpfile
  };

  const engine = new CLIEngine(configuration);
  const linter = getCLIEngineInternalSlots(engine).linter;
  Object.keys(definedRules).forEach(rule => {
    linter.defineRule(`@swissquote/swissquote/${rule}`, definedRules[rule]);
  });

  return engine;
}

function lint(cli, text, filename = "foo.js") {
  // @see http://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles
  // @see http://eslint.org/docs/developer-guide/nodejs-api.html#executeontext
  const linter = cli.executeOnText(text.replace(/^\n/, ""), filename);
  return linter.results[0];
}

module.exports = { prepareCLIEngine, lint };
