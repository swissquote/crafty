"use strict";
const { mkdirSync } = require("fs");
const { mkdir } = require("fs/promises");
const path = require("path");

// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
const checkPath = (pth) => {
  if (process.platform === "win32") {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(
      pth.replace(path.parse(pth).root, "")
    );

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      error.code = "EINVAL";
      throw error;
    }
  }
};

const processOptions = (options) => {
  // https://github.com/sindresorhus/make-dir/issues/18
  const defaults = {
    mode: 0o777,
  };

  return {
    ...defaults,
    ...options,
  };
};

const makeDir = async (input, options) => {
  checkPath(input);
  options = processOptions(options);

  const pth = path.resolve(input);

  await mkdir(pth, {
    mode: options.mode,
    recursive: true,
  });

  return pth;
};

module.exports = makeDir;

module.exports.sync = (input, options) => {
  checkPath(input);
  options = processOptions(options);

  const pth = path.resolve(input);

  mkdirSync(pth, {
    mode: options.mode,
    recursive: true,
  });

  return pth;
};
