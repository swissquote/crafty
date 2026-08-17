import crypto from "node:crypto";
import fs from "node:fs";
import { prepareReportsDirectory } from "@swissquote/crafty/src/utils/reports.js";
import stylelint from "@swissquote/stylelint-config-swissquote/packages/stylelint.js";
import sarif from "../dist/stylelint-sarif-formatter/index.js";

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

let stringFormatter = () => {
  throw new Error("Formatter not ready yet");
};
stylelint.formatters.string.then(fn => {
  stringFormatter = fn;
});

function getReportFilePath(fileName) {
  const dirName = prepareReportsDirectory("reports/stylelint");
  const file = `${dirName}/${fileName ||
    "stylelint"}_${getProcessHash()}.sarif.json`;

  return file;
}

function formatter(results, returnValue, file) {
  const sarifOutput = sarif(results, returnValue);
  fs.writeFileSync(file, sarifOutput);

  const stringOutput = stringFormatter(results, returnValue);

  return stringOutput;
}

export default function(results, returnValue) {
  const file = getReportFilePath("cli");
  return formatter(results, returnValue, file);
}

export function createFormatter(fileName) {
  const file = getReportFilePath(fileName);

  return (results, returnValue) => {
    return formatter(results, returnValue, file);
  };
}
