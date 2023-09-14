const rimraf = require("rimraf");
const path = require("path");
const fs = require("fs");

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
}

function isModule(name) {
  return name.includes("/node_modules/") || name.includes("/package-forks/");
}

function isExternal(name) {
  return name.indexOf("external ") === 0;
}

function getModulePath(name) {
  const moduleNames = [];

  const moduleParts = name.split("/");

  let isNodeModule = false;
  let i = 0;
  let arrayLength = moduleParts.length;
  while (i < arrayLength) {
    const part = moduleParts[i];

    if (part == "node_modules" || part == "package-forks") {
      isNodeModule = true;
      i++;
      continue;
    }

    if (isNodeModule) {
      if (part[0] == "@") {
        moduleNames.push(`${part}/${moduleParts[i + 1]}`);
        i++;
      } else {
        moduleNames.push(part);
      }
      isNodeModule = false;
    }

    i++;
  }

  return moduleNames.join(" > ");
}

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

function rmrf(toDelete) {
 rimraf.sync(toDelete);
}



module.exports = {
  formatBytes,
  getModulePath,
  isModule,
  isExternal,
  copyRecursiveSync,
  rmrf
};
