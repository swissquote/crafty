import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

// Resolves package.json files the same way as before the ESM migration:
// from this directory, with the "require" condition
const require = createRequire(import.meta.url);

const currentPackage = path.join(process.cwd(), "package.json");

const isJS = /\.m?js$/;
const packageRegex = /^\/\/package:(.*)$/gm;
const packageRegexSingle = /^\/\/package:(.*)$/;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function getProvidedPackages(parents, isRslib) {
  const pkgs = {};

  parents.forEach(pkg => {
    const pkgFile = require.resolve(`${pkg}/package.json`);
    const pkgPath = path.dirname(pkgFile);
    const pkgsPath = path.join(pkgPath, "packages");

    const packageConfig = readJson(pkgFile);
    const isInsideModule = packageConfig.type === "module";

    if (!fs.existsSync(pkgsPath)) {
      return;
    }

    fs.readdirSync(pkgsPath)
      .filter(file => isJS.test(file))
      .forEach(file => {
        const moduleName = file.replace(isJS, "");
        const isModule = file.endsWith(".mjs");
        const content = fs.readFileSync(path.join(pkgsPath, file), {
          encoding: "utf-8"
        });

        // ncc consumers load this file with a plain require(), which returns
        // the ESM namespace unless the file exports "module.exports"
        if (
          !isRslib &&
          isInsideModule &&
          content.includes("export default") &&
          !content.includes('"module.exports"')
        ) {
          throw new Error(
            `${pkg}/packages/${file} must export its default as "module.exports" to be required by CommonJS bundles`
          );
        }

        const pathToModule = `${pkg}/packages/${file}`;
        let pathWithPrefix = pathToModule;
        if (isRslib) {
          if (isInsideModule || isModule) {
            pathWithPrefix = `module ${pathToModule}`;
          } else {
            pathWithPrefix = `commonjs ${pathToModule}`;
          }
        }

        const matched = content.match(packageRegex);
        if (matched) {
          matched.forEach(match => {
            const m = match.match(packageRegexSingle);
            pkgs[m[1].trim()] = pathWithPrefix;
          });
        } else {
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
      getParents(
        root,
        readJson(require.resolve(`${dependency}/package.json`)),
        set
      );
    });

  return set;
}

export function getExternals(isRslib) {
  const pkg = readJson(currentPackage);
  const parents = getParents(pkg, pkg, new Set());
  const externals = getProvidedPackages(parents, isRslib);

  return externals;
}
