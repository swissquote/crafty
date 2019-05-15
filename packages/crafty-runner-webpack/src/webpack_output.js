const colors = require("ansi-colors");
const style = require("webpack-stylish/lib/style");
const parse = require("webpack-stylish/lib/parse");

const formatWebpackMessages = require("./utils/formatWebpackMessages");

/**
 * Sort the files order.
 * The main reason is that test snapshots need the order to stay the same.
 * For some reason this isn't the case sometimes.
 *
 * @param {*} files
 */
function sortFiles(files) {
  const modules = [];
  const assets = [];

  let isAssets = false;

  for (var i in files) {
    const row = files[i];
    if (row[0] == "size" && row[2] == "asset") {
      isAssets = true;
    }

    if (row[0] == "size" || row[0] == "") {
      continue;
    }

    if (isAssets) {
      assets.push(row);
    } else {
      modules.push(row);
    }
  }

  const final = [];

  if (modules.length) {
    final.push(["size", "name", "module", "status"]);
    final.push(...modules.sort((a, b) => a[1] - b[1]));
  }

  if (modules.length && assets.length) {
    final.push(["", "", "", ""]);
  }

  if (assets.length) {
    final.push(["size", "name", "asset", "status"]);
    final.push(
      ...assets.sort((a, b) => {
        if (a[2] < b[2]) return -1;
        if (a[2] > b[2]) return 1;
        return 0;
      })
    );
  }

  // Replacing the file sizes in output log
  // to have predictable snapshot output
  // when testing Crafty. As webpack seems
  // to create differences in various environments
  // without differences in the actual output's size
  if (process.env.TESTING_CRAFTY) {
    return final.map(item => {
      if (item[0] != "" && item[0] != "size") {
        item[0] = 1000;
      }

      return item;
    });
  }

  return final;
}

module.exports = function(stats, compiler) {
  const opts = {
    cached: false,
    cachedAssets: false,
    exclude: ["node_modules"]
  };

  const json = stats.toJson(opts, true);

  // List compiled files
  console.log(style.files(sortFiles(parse.files(json)), compiler.options));
  console.log("\n  " + style.hidden(parse.hidden(json)));

  // Disabled and replaced by our system
  //console.log(style.problems(parse.problems(json)));

  // Nicer Error/Warning Messages
  const messages = formatWebpackMessages(stats.toJson({}, true));
  // If errors exist, only show errors.
  if (messages.errors.length) {
    console.log("\n  " + colors.red("Failed to compile.") + "\n");
    messages.errors.forEach(message => {
      console.log(message + "\n");
    });
  } else if (messages.warnings.length) {
    console.log("\n  " + colors.yellow("Compiled with warnings.") + "\n");
    // Show warnings if no errors were found.
    messages.warnings.forEach(message => {
      console.log(message + "\n");
    });
  } else {
    console.log("\n  " + colors.green("Compiled successfully!"));
  }

  const time = `${colors.gray(`  Δ${colors.italic("t")}`)} ${style.time(
    json.time
  )}`;

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
