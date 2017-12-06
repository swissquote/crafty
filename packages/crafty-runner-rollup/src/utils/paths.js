const path = require("path");

function isPathAbsolute(string) {
  return /^(?:\/|[a-z]+:\/\/)/.test(string);
}

function absolutePath(item) {
  if (isPathAbsolute(item)) {
    return item;
  }

  return path.join(process.cwd(), item);
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
  isPathAbsolute,
  absolutePath,
  absolutePaths,
  resolve
};
