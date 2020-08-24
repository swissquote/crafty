const path = require("path");

function absolutePath(item) {
  return path.isAbsolute(item) ? item : path.join(process.cwd(), item);
}

function absolutePaths(arr) {
  if (typeof arr === "string") {
    return [absolutePath(arr)];
  }

  for (const i in arr) {
    if (arr.hasOwnProperty(i)) {
      arr[i] = absolutePath(arr[i]);
    }
  }

  return arr;
}

function resolve(relative) {
  return path.resolve(process.cwd(), relative);
}

module.exports = {
  absolutePath,
  absolutePaths,
  resolve,
};
