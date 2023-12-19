const { Linter } = require("eslint");

function prepareESLint(...args) {
  const configuration = {
    configType: "flat"
  };

  const configs = args
    .filter(arg => typeof arg !== "object")
    .map(
      preset => require(`@swissquote/eslint-plugin-swissquote`).configs[preset]
    )
    .flat();

  const overrides = args.find(arg => typeof arg === "object") || null;
  if (overrides) {
    configs.push(overrides);
  }

  const linter = new Linter(configuration);

  return function lint(text, filename = "foo.js") {
    const messages = linter.verify(text.replace(/^\n/, ""), configs, filename);

    return {
      messages,
      warningCount: messages.filter(m => m.severity === 1).length,
      errorCount: messages.filter(m => m.severity === 2).length
    };
  };
}

module.exports = { prepareESLint };
