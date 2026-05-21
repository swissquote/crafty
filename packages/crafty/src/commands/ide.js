const fs = require("node:fs");
const path = require("node:path");
const { applyEdits, modify, parse } = require("../../packages/jsonc-parser");
const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:ide"
);

function parseJsonObject(content) {
  const errors = [];
  const parsed = parse(content, errors, { allowTrailingComma: true });

  if (
    errors.length > 0 ||
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    throw new Error("Invalid JSON object");
  }

  return parsed;
}

function getJsonFormattingOptions(content) {
  const indentationMatch = content.match(/^[ \t]+(?=")/m);

  return {
    insertSpaces: !indentationMatch || !indentationMatch[0].includes("\t"),
    tabSize: indentationMatch ? indentationMatch[0].length : 2,
    eol: content.includes("\r\n") ? "\r\n" : "\n"
  };
}

function mergeJsonObjectContent(existingContent, nextContent) {
  parseJsonObject(existingContent);

  const nextObject = parseJsonObject(nextContent);
  const formattingOptions = getJsonFormattingOptions(existingContent);

  let mergedContent = existingContent;

  Object.entries(nextObject).forEach(([key, value]) => {
    mergedContent = applyEdits(
      mergedContent,
      modify(mergedContent, [key], value, { formattingOptions })
    );
  });

  if (!mergedContent.endsWith(formattingOptions.eol)) {
    mergedContent = `${mergedContent}${formattingOptions.eol}`;
  }

  return mergedContent;
}
function collectIdeFiles(crafty) {
  let files = {};

  crafty
    .getImplementations("ide")
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(preset => {
      debug(`${preset.presetName}.ide(crafty)`);
      files = Object.assign(files, preset.run("ide", crafty));
    });

  return files;
}

exports.description = "Create configuration files for IDE Integration";
exports.command = async function run(crafty, input, cli) {
  debug("Registering Runners");

  const files = collectIdeFiles(crafty);

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
    const { content, shouldIgnore, alternativeFiles, mergeStrategy } = options;
    const destination = path.join(cwd, file);
    let finalContent = content;

    if (alternativeFiles) {
      for (const alternativeFile of alternativeFiles) {
        const oldFile = path.join(cwd, alternativeFile);
        if (fs.existsSync(oldFile)) {
          console.log(`Removing old config ${file}`);
          fs.rmSync(oldFile);
        }
      }
    }

    if (mergeStrategy === "json") {
      try {
        finalContent = fs.existsSync(destination)
          ? mergeJsonObjectContent(
              fs.readFileSync(destination, { encoding: "utf-8" }),
              content
            )
          : content;
      } catch {
        throw new crafty.Information(
          `crafty ide: Cannot merge ${file} because it does not contain valid JSON.`
        );
      }
    }

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, finalContent);

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
