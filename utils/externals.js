#!/usr/bin/env node
const path = require("path");
const fs = require("fs");

const currentPackage = path.join(process.cwd(), "package.json");

const isJS = /\.js$/;
const packageRegex = /^\/\/package:(.*)$/gm;
const packageRegexSingle = /^\/\/package:(.*)$/;

function getProvidedPackages(parents, isRslib) {
  const pkgs = {};

  parents.forEach(pkg => {
    const pkgFile = require.resolve(`${pkg}/package.json`);
    const pkgPath = path.dirname(pkgFile);
    const pkgsPath = path.join(pkgPath, "packages");

    const packageConfig = JSON.parse(fs.readFileSync(pkgFile));
    const isModule = packageConfig.type === "module";

    if (!fs.existsSync(pkgsPath)) {
      return;
    }

    fs.readdirSync(pkgsPath)
      .filter(file => isJS.test(file))
      .forEach(file => {
        const moduleName = file.substring(0, file.length - 3);
        const content = fs.readFileSync(path.join(pkgsPath, file), {
          encoding: "utf-8"
        });

        const pathToModule = `${pkg}/packages/${file}`;
        let pathWithPrefix = pathToModule;
        if (isRslib) {
          if (isModule) {
            pathWithPrefix = `module ${pathToModule}`;
          } else {
            pathWithPrefix = `commonjs ${pathToModule}`;
          }
        }

        const matched = content.match(packageRegex);
        if (matched) {
          matched.forEach(match => {
            const m = match.match(packageRegexSingle);
            if (!isRslib && isModule) {
              console.log("Ignoring ESM external", m[1].trim());
              return;
            }
            pkgs[m[1].trim()] = pathWithPrefix;
          });
        } else {
          if (!isRslib && isModule) {
            console.log("Ignoring ESM external", moduleName);
            return;
          }
          pkgs[moduleName] = pathWithPrefix;
        }
      });
  });

  return pkgs;
}

function getParents(root, pkg, set) {
  Object.keys({ ...(pkg.dependencies || {}), ...(pkg.peerDependencies || {}) })
    .filter(dependency => dependency.indexOf("@swissquote/") === 0)
    .forEach(dependency => {
      if (root.name === dependency) {
        console.error(
          "Skipping loop.",
          pkg.name,
          "points back to",
          root.name,
          ", listed dependencies:",
          set
        );
        return;
      }

      if (set.has(dependency)) {
        //console.error("We already have", dependency, "in set", set);
        return;
      }

      set.add(dependency);
      getParents(root, require(`${dependency}/package.json`), set);
    });

  return set;
}

module.exports = {
  getExternals(isRslib) {
    const pkg = require(currentPackage);
    const parents = getParents(pkg, pkg, new Set());
    const externals = getProvidedPackages(parents, isRslib);

    return externals;
  }
};
