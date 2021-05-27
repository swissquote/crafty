const crypto = require("crypto");
const fs = require("fs");
const babel = require("@babel/core");
const cherow = require("cherow");

const THIS_FILE = fs.readFileSync(__filename);

const importExportRegex = /\b(import|export)\b/;

function shouldCompile(code) {
  try {
    // Quick check with a regex,
    // Allows to eliminate most cases right away without a more expensive parsing.
    if (!code.match(importExportRegex)) {
      return false;
    }

    const tree = cherow.parse(code, { module: true, next: true });

    // Imports and exports have to be at the first level on a file
    // This makes it easy for us to traverse the file, a simple filter does the trick
    // If we had to find `import()` statements that would be more complicated, but as
    // They would certainly have an export anyway, we're covered.
    const hasImportOrExport = tree.body.filter(
      item =>
        item.type === "ImportDeclaration" ||
        item.type === "ExportNamedDeclaration" ||
        item.type === "ExportDefaultDeclaration"
    );

    return hasImportOrExport.length;
  } catch (e) {
    // If we can't parse it, we might have missed something and it's an ESM module
    // Otherwise, Babel can give a nice output of the parsing error, which is always appreciated.
    return true;
  }
}

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
  process(src, filename) {
    if (
      (babel.util && !babel.util.canCompile(filename)) ||
      !shouldCompile(src)
    ) {
      return src;
    }

    // We add Babel with a single transform
    // to convert ES modules to commonjs
    const options = {
      babelrc: false,
      compact: false,
      plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")]
    };

    return babel.transform(src, options).code;
  }
};
