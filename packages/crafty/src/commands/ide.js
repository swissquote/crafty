const fs = require("fs");
const path = require("path");
const debug = require("debug")("ide");

exports.description = "Create configuration files for IDE Integration";
exports.command = function run(crafty, input, cli) {
  debug("Registering Runners");

  return new Promise((resolve, reject) => {
    let files = {};

    crafty.getImplementations("ide").forEach(preset => {
      debug(`${preset.presetName}.ide(crafty, input, cli)`);
      files = Object.assign(files, preset.ide(crafty, input, cli));
    });

    if (Object.keys(files).length === 0) {
      console.log("Nothing to generate");
      reject(1);
      return;
    }

    Object.keys(files).forEach(file => {
      const {
        content,
        serializer = obj => JSON.stringify(obj, null, 4)
      } = files[file];
      const destination = path.join(process.cwd(), file);

      fs.writeFileSync(destination, serializer(content));

      console.log(`Written ${file}`);
    });

    // TODO :: write gitignore

    resolve();
  });
};
