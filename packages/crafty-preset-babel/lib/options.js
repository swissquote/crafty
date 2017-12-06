// This emulates ESlint for IntelliJ
const fs = require("fs");

const tmp = require("tmp");
const eslintOptions = require("eslint/lib/options");

const configurationBuilder = require("../src/eslintConfigurator");

const originalParse = eslintOptions.parse;
eslintOptions.parse = function(input, arg$) {
  const array = input.split(" ");
  const configuration = configurationBuilder(array);

  const tmpfile = tmp.fileSync({ postfix: ".json" }).name;
  fs.writeFileSync(tmpfile, JSON.stringify(configuration.configuration));

  configuration.args.push("--config");
  configuration.args.push(tmpfile);

  //eslint-disable-next-line no-param-reassign
  input = configuration.args.join(" ");

  return originalParse(input, arg$);
};

module.exports = eslintOptions;
