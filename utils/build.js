#!/usr/bin/env node

const fs = require("fs");
const rimraf = require("rimraf");
const compileUtils = require("./compile.js");
const configuration = require(process.cwd() + "/build.config.js");

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

  package() {
    const pkg = this.values.name;

    const cleanPkg = pkg.replace("@", "").replace("/", "-");
    this.values.sourceFile = `module.exports = require("${pkg}");`;
    this.values.destination = `dist/${cleanPkg}/index.js`;

    this.values.options.sourceMap = false;
    this.values.options.sourceMapRegister = false;

    return this;
  }

  async build() {
    console.log(`${this.values.name}\n${"=".repeat(this.values.name.length)}`);

    const tmpSourceFile = `src/temp_vcc.js`;

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
  rimraf.sync(process.cwd() + "/dist");

  for (const bundle of configuration) {
    await bundle(builder, compileUtils);
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
