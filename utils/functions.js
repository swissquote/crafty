function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
}

function getModulePath(name) {
  const indexOf = name.indexOf("node_modules/");

  const moduleNames = [];

  const moduleParts = name.slice(indexOf).split("/");

  let isNodeModule = false;
  let i = 0;
  let arrayLength = moduleParts.length;
  while (i < arrayLength) {
    const part = moduleParts[i];

    if (part == "node_modules") {
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

module.exports = {
  formatBytes,
  getModulePath
};
