#!/usr/bin/env node

const fs = require("fs");
const rimraf = require("rimraf");
const compileUtils = require("./compile.js");
const configuration = require(process.cwd() + "/build.config.js");

async function main() {
  // Start with a cleanup
  rimraf.sync(process.cwd() + "/dist/compiled");

  for (const bundle of configuration) {
    if (bundle.name) {
      const name = bundle.name;
      console.log(`${name}\n${'='.repeat(name.length)}`);
      await compileUtils.compile(
        `./src/${name}.js`,
        `dist/compiled/${name}.js`,
        bundle
      );
      continue;
    }

    if (bundle.package) {
      const pkg = bundle.package;
      console.log(`${pkg}\n${'='.repeat(pkg.length)}`);

      const cleanPkg = pkg.replace('@', "").replace("/", "-");
      const filename = `export_package_${cleanPkg}.js`;

      bundle.sourceMap = false;
      bundle.sourceMapRegister = false;

      try {
        await fs.promises.writeFile(`src/${filename}`, `module.exports = require("${pkg}");`)

        await compileUtils.compile(
          `./src/${filename}`,
          `dist/${cleanPkg}/index.js`,
          bundle
        );
      } finally {
        await fs.promises.rm(`src/${filename}`);
      }

      continue;
    }

    await bundle(compileUtils);
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
