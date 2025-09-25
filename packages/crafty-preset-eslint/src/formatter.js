const crypto = require("node:crypto");
const fs = require("node:fs");
const sarif = require("../dist/microsoft-eslint-formatter-sarif/index.js");

let processHash = null;
function getProcessHash() {
  if (!processHash) {
    // Exclude --config argument from hash to avoid different hashes as the config is automatically generated
    const configIndex = process.argv.findIndex(arg => arg === "--config");
    const argsWithoutConfig = process.argv.filter(
      (arg, index) => index !== configIndex && index !== configIndex + 1
    );

    processHash = crypto
      .createHash("md5")
      .update(argsWithoutConfig.join("|"))
      .digest("hex")
      .substring(0, 8);
  }
  return processHash;
}

function getReportFilePath(fileName) {
  const dirName = "reports/eslint";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  const file = `${dirName}/${fileName ||
    "eslint"}_${getProcessHash()}.sarif.json`;

  return file;
}

// Get ESLint console formatter
let formatter = {
  format() {
    // This race condition should not happen
    // could happen if ESLint fails to load the formatter
    throw new Error("Formatter not ready yet");
  }
};
const eslint = require("eslint");

const esl = new eslint.ESLint();
esl.loadFormatter("stylish").then(f => {
  formatter = f;
});

function runFormat(results, context, file) {
  const sarifOutput = sarif(results, context);
  fs.writeFileSync(file, sarifOutput);

  return formatter.format(results, context);
}

function createFormatter(fileName) {
  const file = getReportFilePath(fileName);

  return (results, context) => {
    return runFormat(results, context, file);
  };
}

// This export is used by the ESLint CLI
module.exports = function(results, context) {
  const file = getReportFilePath("cli");
  return runFormat(results, context, file);
};

// This export is used when called programmatically
module.exports.createFormatter = createFormatter;
