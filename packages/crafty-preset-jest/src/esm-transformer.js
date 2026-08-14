const crypto = require("node:crypto");
const fs = require("node:fs");
const babel = require("@babel/core");

const THIS_FILE = fs.readFileSync(__filename);

const importExportRegex = /\b(import|export)\b/;

// All the top level declarations that make a file an ES module.
// `ExportAllDeclaration` is `export * from "./other.js"`, a file containing
// only those would be left untransformed if it were missing from this list.
const ESM_DECLARATIONS = new Set([
  "ImportDeclaration",
  "ExportNamedDeclaration",
  "ExportDefaultDeclaration",
  "ExportAllDeclaration"
]);

module.exports = {
  getCacheKey(fileData, filename, instance) {
    return crypto
      .createHash("md5")
      .update(THIS_FILE)
      .update("\0", "utf8")
      .update(fileData)
      .update("\0", "utf8")
      .update(instance.configString)
      .update("\0", "utf8")
      .update(filename)
      .digest("hex");
  },
  process(code, filename) {
    if (babel.util && !babel.util.canCompile(filename)) {
      return { code };
    }

    // Quick check with a regex,
    // Allows to eliminate most cases right away without a more expensive parsing.
    if (!importExportRegex.test(code)) {
      return { code };
    }

    // We add Babel with a single transform
    // to convert ES modules to commonjs
    const options = {
      babelrc: false,
      compact: false,
      plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")]
    };

    const ast = babel.parseSync(code, options);

    // Imports and exports have to be at the first level on a file
    // This makes it easy for us to traverse the file, a simple check does the trick
    // If we had to find `import()` statements that would be more complicated, but as
    // They would certainly have an import or export anyway, we're covered.
    const hasImportOrExport = ast.program.body.some(item =>
      ESM_DECLARATIONS.has(item.type)
    );

    if (!hasImportOrExport) {
      return { code };
    }

    return { code: babel.transformFromAstSync(ast, code, options).code };
  }
};
