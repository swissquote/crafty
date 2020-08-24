const { ESLint } = require("eslint");

function prepareESLint(...args) {
  const configuration = {
    useEslintrc: false,
    overrideConfig: {
      plugins: ["@swissquote/swissquote"],
      extends: args.map((preset) => `plugin:@swissquote/swissquote/${preset}`),
      rules: {},
      settings: {},
    },
    plugins: {
      "@swissquote/swissquote": require("./index"),
    },
  };

  return new ESLint(configuration);
}

async function lint(cli, text, filename = "foo.js") {
  const results = await cli.lintText(text.replace(/^\n/, ""), {
    filePath: filename,
  });
  return results[0];
}

module.exports = { prepareESLint, lint };
