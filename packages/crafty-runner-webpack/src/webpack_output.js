const chalk = require("chalk");
const style = require("webpack-stylish/lib/style");
const parse = require("webpack-stylish/lib/parse");

const formatWebpackMessages = require("./utils/formatWebpackMessages");

const findLoader = /(?:.*\/)(.*-loader.*)(?:\?.*)/;

function shortenLoaders(row) {
  if (row[2].indexOf("!") !== -1) {
    row[2] = row[2]
      .split("!")
      .map(str => {
        const matches = findLoader.exec(str);
        return matches ? matches[1] : str;
      })
      .join("!");
  }

  return row;
}

module.exports = function(stats, compiler) {
  const opts = {
    cached: false,
    cachedAssets: false,
    exclude: ["node_modules"]
  };

  const json = stats.toJson(opts, true);

  // List compiled files
  const files = parse.files(json).map(shortenLoaders);
  console.log(style.files(files, compiler.options));
  console.log("\n  " + style.hidden(parse.hidden(json)));

  // Disabled and replaced by our system
  //console.log(style.problems(parse.problems(json)));

  // Nicer Error/Warning Messages
  const messages = formatWebpackMessages(stats.toJson({}, true));
  // If errors exist, only show errors.
  if (messages.errors.length) {
    console.log("\n  " + chalk.red("Failed to compile.") + "\n");
    messages.errors.forEach(message => {
      console.log(message + "\n");
    });
  } else if (messages.warnings.length) {
    console.log("\n  " + chalk.yellow("Compiled with warnings.") + "\n");
    // Show warnings if no errors were found.
    messages.warnings.forEach(message => {
      console.log(message + "\n");
    });
  } else {
    console.log("\n  " + chalk.green("Compiled successfully!"));
  }

  const time = chalk`  {gray Δ{italic t}} ${style.time(json.time)}`;

  if (messages.warnings.length || messages.errors.length) {
    console.log(
      time,
      style.footer({
        errors: messages.errors.length,
        warnings: messages.warnings.length
      })
    );
  } else {
    console.log(time);
  }

  console.log();
};
