const {
  CLIEngine,
  getCLIEngineInternalSlots
} = require("eslint/lib/cli-engine/cli-engine.js");
const merge = require("merge");

const definedRules = require("./rules");

module.exports = {
  prepareCLIEngine(...args) {
    const configuration = merge.recursive(...args);

    // For some reason, CLIEngine wants "envs"
    if (configuration.env) {
      const envs = [];
      Object.keys(configuration.env)
        .filter(env => configuration.env[env])
        .forEach(env => {
          envs.push(env);
        });
      configuration.envs = envs;
    }

    const engine = new CLIEngine(configuration);
    const linter = getCLIEngineInternalSlots(engine).linter;
    Object.keys(definedRules).forEach(rule => {
      linter.defineRule(`@swissquote/swissquote/${rule}`, definedRules[rule]);
    });

    return engine;
  },
  lint(cli, text) {
    // @see http://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles
    // @see http://eslint.org/docs/developer-guide/nodejs-api.html#executeontext
    const linter = cli.executeOnText(text.replace(/^\n/, ""));
    return linter.results[0];
  }
};
