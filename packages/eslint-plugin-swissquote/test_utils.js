const { ESLint } = require("eslint");

function prepareESLint(...args) {
  const configuration = {
    useEslintrc: false,
    overrideConfig: {
      plugins: ["@swissquote/swissquote"],
      extends: args
        .filter(arg => typeof arg !== "object")
        .map(preset => `plugin:@swissquote/swissquote/${preset}`),
      rules: {},
      settings: {},
      ...(args.find(arg => typeof arg === "object") || {})
    },
    plugins: {
      "@swissquote/swissquote": require("./index")
    }
  };

  return new ESLint(configuration);
}

async function lint(cli, text, filename = "foo.js") {
  const results = await cli.lintText(text.replace(/^\n/, ""), {
    filePath: filename
  });
  return results[0];
}

module.exports = { prepareESLint, lint };
