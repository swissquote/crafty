#!/usr/bin/env node

import fs from "fs";
import path from "path";

import {
  findFiles,
  scanFiles,
  printReport
} from "./duplicates.js";
import * as compileUtils from "./compile.mjs";

class PackagesBuilder {
  constructor(esm) {
    this.esm = esm;
    this.sourceFile = [];
    this.entryFiles = [];
  }

  package(pkg, name, entryFile) {
    if (this.esm) {
      if (Array.isArray(name)) {
        this.sourceFile.push(`export { ${name.join(", ")} } from "${pkg}";`);
      } else {
        this.sourceFile.push(`export  { default as ${name} } from "${pkg}";`);
      }
    } else {
      this.sourceFile.push(`module.exports["${name}"] = function() { return require("${pkg}"); };`);
    }

    if (entryFile) {
      this.entryFiles.push({ entryFile, name });
    }

    return this;
  }

  build() {
    return {
      sourceFile: this.sourceFile.join("\n"),
      entryFiles: this.entryFiles,
    };
  }
}

class Builder {
  constructor(name) {
    this.values = {
      name,
      source: `./src/${name}.js`,
      destination: `dist/compiled/${name}.js`,
      options: {},
    };
  }

  sourceFile(sourceFile) {
    this.values.sourceFile = sourceFile;

    return this;
  }

  source(source) {
    this.values.source = source;

    return this;
  }

  destination(destination) {
    this.values.destination = destination;

    if (destination.indexOf(".mjs") > -1) {
      this.values.options.esm = true
    }

    return this;
  }

  esm() {
    this.values.options.esm = true;

    return this;
  }

  options(options) {
    this.values.options = { ...this.values.options, ...options };

    return this;
  }

  externals(externals) {
    this.values.options.externals = externals;

    return this;
  }

  package({ isEsmModule }  = {}) {
    const pkg = this.values.name;

    const cleanPkg = pkg.replace("@", "").replace("/", "-");
    if (this.values.options.esm) {
      this.values.destination = `dist/${cleanPkg}/index.mjs`;
      if (isEsmModule) {
        this.values.sourceFile = `export * from "${pkg}";`;
      } else {
        this.values.sourceFile = `import lib from "${pkg}"; export default lib;`;
      }      
    } else {
      this.values.destination = `dist/${cleanPkg}/index.js`;
      this.values.sourceFile = `module.exports = require("${pkg}");`;
    }

    this.values.options.sourceMap = false;
    this.values.options.sourceMapRegister = false;

    return this;
  }

  packages(callback) {
    const pkg = this.values.name;
    const cleanPkg = pkg.replace("@", "").replace("/", "-");
    this.values.destination = `dist/${cleanPkg}/bundled.js`;

    const builder = new PackagesBuilder(this.values.options.esm);

    callback(builder);

    const { sourceFile, entryFiles } = builder.build();

    this.values.sourceFile = sourceFile;
    this.values.entryFiles = entryFiles;

    return this;
  }

  async build() {
    console.log(`${this.values.name}\n${"=".repeat(this.values.name.length)}`);

    const tmpSourceFile = `_temp_ncc.js`;

    try {
      if (this.values.sourceFile) {
        await fs.promises.writeFile(tmpSourceFile, this.values.sourceFile);
        this.values.options.filename =
          this.values.name.replace("@", "").replace("/", "-") + ".js";
        this.values.source = tmpSourceFile;
      }

      await compileUtils.compile(this.values.source, this.values.destination, {
        name: this.values.name,
        ...this.values.options,
      });

      if (this.values.entryFiles) {
        for (const entryFile of this.values.entryFiles) {
          let relativePath = path.relative(
            path.dirname(entryFile.entryFile),
            this.values.destination
          );

          if (relativePath[0] !== ".") {
            relativePath = `./${relativePath}`;
          }

          fs.mkdirSync(path.dirname(entryFile.entryFile), { recursive: true });

          let fileContent;
          if (this.values.options.esm) {
            if (Array.isArray(entryFile.name)) {
              fileContent = `export { ${entryFile.name.join(", ")} } from "${relativePath}";`;
            } else {
              fileContent = `export { ${entryFile.name} as default } from "${relativePath}";`;
            }
          } else {
            fileContent = `module.exports = require('${relativePath}')['${entryFile.name}']();`;
          }

          console.log("Writing", entryFile.entryFile);
          await fs.promises.writeFile(entryFile.entryFile, fileContent);
        }

        console.log("");
      }
    } finally {
      if (this.values.sourceFile) {
        await fs.promises.unlink(tmpSourceFile);
      }
    }
  }

  // Simulate a promise, make it awaitable as a shortcut
  then(...callbacks) {
    return this.build().then(...callbacks);
  }
}

function builder(name) {
  return new Builder(name);
}

async function main() {
  // Start with a cleanup
  fs.rmSync(process.cwd() + "/dist", { force: true, recursive: true });

  const toBuild = await import(process.cwd() + "/build.config.js")
  const configuration = toBuild.default;

  for (const bundle of configuration) {
    await bundle(builder, compileUtils);
  }

  const statFiles = findFiles();
  if (statFiles.length > 0) {
    const report = scanFiles(statFiles);

    const duplicateModules = report.duplicateModules.filter(toBuild.keepDuplicateFile || Boolean);
    const duplicateModulesByPackage = report.duplicateModulesByPackage.filter(toBuild.keepDuplicateModule || Boolean);

    if (duplicateModules.length > 0) {
      console.error("Found duplicate packages");
      printReport(duplicateModules, duplicateModulesByPackage);

      process.exit(1);
    }
  }
}

main().then(
  () => {
    console.log("Success");
  },
  (e) => {
    console.error("Failed", e);
    process.exit(1);
  }
);
