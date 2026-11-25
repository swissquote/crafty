import path from "node:path";
import fs from "node:fs";

export function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${
    sizes[i]
  }`;
}

export function isModule(name) {
  return name.includes("/node_modules/") || name.includes("/package-forks/");
}

export function isExternal(name) {
  return name.indexOf("external ") === 0;
}

export function getModulePath(name) {
  const moduleNames = [];

  const moduleParts = name.split("/");

  let isNodeModule = false;
  let i = 0;
  const arrayLength = moduleParts.length;
  while (i < arrayLength) {
    const part = moduleParts[i];

    if (part === "node_modules" || part === "package-forks") {
      isNodeModule = true;
      i++;
      continue;
    }

    if (isNodeModule) {
      if (part[0] === "@") {
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
export function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

export function rmrf(toDelete) {
  fs.rmSync(toDelete, { recursive: true, force: true });
}
