const fs = require("fs");
const path = require("path");
const debug = require("debug")("crafty:ide");

exports.description = "Create configuration files for IDE Integration";
exports.command = async function run(crafty, input, cli) {
  debug("Registering Runners");

  let files = {};

  crafty.getImplementations("ide").forEach((preset) => {
    debug(`${preset.presetName}.ide(crafty, input, cli)`);
    files = Object.assign(files, preset.ide(crafty, input, cli));
  });

  if (Object.keys(files).length === 0) {
    console.log("Nothing to generate");
    return 1;
  }

  const gitignore = path.join(process.cwd(), ".gitignore");

  let gitignoreModified = false;
  let ignoreFile = [];
  if (fs.existsSync(gitignore)) {
    ignoreFile = fs
      .readFileSync(gitignore, { encoding: "utf-8" })
      .split(/\r?\n/);
  }

  Object.keys(files).forEach((file) => {
    const {
      content,
      serializer = (obj) => JSON.stringify(obj, null, 4),
    } = files[file];
    const destination = path.join(process.cwd(), file);

    fs.writeFileSync(destination, serializer(content));

    if (ignoreFile.indexOf(`/${file}`) === -1) {
      gitignoreModified = true;
      ignoreFile.push(`/${file}`);
    }

    console.log(`Written ${file}`);
  });

  if (gitignoreModified) {
    fs.writeFileSync(gitignore, `${ignoreFile.join("\n")}\n`);
    console.log(`Written .gitignore`);
  }

  return 0;
};
