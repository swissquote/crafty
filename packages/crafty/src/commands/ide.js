const fs = require("fs");
const path = require("path");
const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:ide"
);

exports.description = "Create configuration files for IDE Integration";
exports.command = async function run(crafty, input, cli) {
  debug("Registering Runners");

  let files = {};

  // We sort implementations for predictable output in tests
  crafty
    .getImplementations("ide")
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(preset => {
      debug(`${preset.presetName}.ide(crafty)`);
      files = Object.assign(files, preset.run("ide", crafty));
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

  const cwd = process.cwd();

  for (const [file, options] of Object.entries(files)) {
    const { content, shouldIgnore, alternativeFiles } = options;
    const destination = path.join(cwd, file);

    if (alternativeFiles) {
      for (const alternativeFile of alternativeFiles) {
        const oldFile = path.join(cwd, alternativeFile);
        if (fs.existsSync(oldFile)) {
          console.log(`Removing old config ${file}`);
          fs.rmSync(oldFile);
        }
      }
    }

    fs.writeFileSync(destination, content);

    if (
      (shouldIgnore === undefined || shouldIgnore) &&
      ignoreFile.indexOf(`/${file}`) === -1
    ) {
      gitignoreModified = true;
      ignoreFile.push(`/${file}`);
    }

    console.log(`Written ${file}`);
  }

  if (gitignoreModified) {
    fs.writeFileSync(gitignore, `${ignoreFile.join("\n")}\n`);
    console.log(`Written .gitignore`);
  }

  return 0;
};
