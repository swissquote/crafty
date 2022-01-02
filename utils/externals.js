#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const currentPackage = path.join(process.cwd(), "package.json");

const isJS = /\.js$/;
const packageRegex = /^\/\/package:(.*)$/gm;
const packageRegexSingle = /^\/\/package:(.*)$/;

function getProvidedPackages(parents) {
  const pkgs = {};

  parents.forEach((pkg) => {
    const pkgPath = path.dirname(require.resolve(`${pkg}/package.json`));
    const pkgsPath = path.join(pkgPath, "packages");

    if (!fs.existsSync(pkgsPath)) {
      return;
    }

    fs.readdirSync(pkgsPath)
      .filter((file) => isJS.test(file))
      .forEach((file) => {
        const moduleName = file.substring(0, file.length - 3);
        const content = fs.readFileSync(path.join(pkgsPath, file), {
          encoding: "utf-8",
        });
        const matched = content.match(packageRegex);

        if (matched) {
          matched.forEach((match) => {
            const m = match.match(packageRegexSingle);
            pkgs[m[1].trim()] = `${pkg}/packages/${file}`;
          });
        } else {
          pkgs[moduleName] = `${pkg}/packages/${file}`;
        }
      });
  });

  return pkgs;
}

function getParents(pkg, set) {
  Object.keys({ ...(pkg.dependencies || {}), ...(pkg.peerDependencies || {}) })
    .filter((dependency) => dependency.indexOf("@swissquote/") === 0)
    .forEach((dependency) => {
      set.add(dependency);
      getParents(require(`${dependency}/package.json`), set);
    });

  return set;
}

module.exports = {
  getExternals() {
    const parents = getParents(require(currentPackage), new Set());
    return getProvidedPackages(parents);
  },
};
