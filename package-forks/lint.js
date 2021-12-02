const { existsSync } = require("fs");
const { readdir, writeFile } = require("fs/promises");
const path = require("path");

const scripts = {
  lint:
    "node ../../packages/crafty-preset-eslint/src/commands/jsLint.js --preset recommended --preset node '*.js'",
  test: "jest",
  "test:watch": "jest --watch",
  "test:ci": "jest --coverage",
};

const jestConfig = `module.exports = {
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: ["node_modules", "coverage", "jest.config.js"]
};
`;

async function main() {
  const dirs = await readdir(__dirname);

  for (const dir of dirs) {
    if (dir == "lint.js") {
      continue;
    }

    const warnings = [];

      const file = path.join(__dirname, dir, "package.json");

      if (existsSync(file)) {
        const pkg = require(file);

        // version check
        if (pkg.version != "1.17.2") {
          warnings.push("Version must be set to 1.17.2");
          pkg.version = "1.17.2";
        }

        // name check
        if (pkg.name.indexOf("@swissquote/") === -1) {
          warnings.push("Name is missing @swissquote/");
          pkg.name = `@swissquote/${pkg.name}`;
        }

        // not private
        if (!pkg.hasOwnProperty("private") || pkg.private != true) {
          warnings.push("Package is not private");
          pkg.private = true;
        }

        // license
        if (!pkg.hasOwnProperty("license") && !pkg.hasOwnProperty("licenses")) {
          warnings.push("Missing a license");
        }

        // author
        if (!pkg.hasOwnProperty("author")) {
          warnings.push("Missing an author");
        }

        if (!pkg.hasOwnProperty("description")) {
          warnings.push("Missing an description");
        }

        pkg.scripts = scripts;
        /*if (!pkg.hasOwnProperty("scripts")) {
          warnings.push("Missing 'scripts'");
          pkg.scripts = scripts;
        } else {
          if (pkg.scripts.lint != scripts.lint) {
            pkg.scripts.lint = scripts.lint;
          }

          if (pkg.scripts.test != scripts.test) {
            pkg.scripts.test = scripts.test;
          }

          if (pkg.scripts["test:watch"] != scripts["test:watch"]) {
            pkg.scripts["test:watch"] = scripts["test:watch"];
          }

          if (pkg.scripts["test:ci"] != scripts["test:ci"]) {
            pkg.scripts["test:ci"] = scripts["test:ci"];
          }
        }*/

        pkg.engines = {
          node: ">=12",
        };

        pkg.devDependencies = {
          jest: "27.3.1",
          postcss: "8.3.11",
        };

        pkg.peerDependencies = {
          postcss: "^8.0.0",
        };

        if (warnings.length) {
          await writeFile(file, JSON.stringify(pkg, null, 2));
        }
      } else {
        warnings.push("Missing a package.json");
      }

      //await writeFile(path.join(__dirname, dir, "jest.config.js"), jestConfig)

      if (warnings.length) {
        console.log("=>", dir);
        warnings.forEach((warning) => {
          console.log("-", warning);
        });
        console.log("");
      }
  }
}

main().catch((e) => {
  console.error("Failed", e);
});
