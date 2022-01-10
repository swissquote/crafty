const crypto = require("crypto");
const fs = require("fs");
const babel = require("@babel/core");

const THIS_FILE = fs.readFileSync(__filename);

const importExportRegex = /\b(import|export)\b/;

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
    if (babel.util && !babel.util.canCompile(filename)) {
      return src;
    }

    // Quick check with a regex,
    // Allows to eliminate most cases right away without a more expensive parsing.
    if (!importExportRegex.test(src)) {
      return src;
    }

    // We add Babel with a single transform
    // to convert ES modules to commonjs
    const options = {
      babelrc: false,
      compact: false,
      plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")]
    };

    const ast = babel.parseSync(src, options);

    // Imports and exports have to be at the first level on a file
    // This makes it easy for us to traverse the file, a simple filter does the trick
    // If we had to find `import()` statements that would be more complicated, but as
    // They would certainly have an import or export anyway, we're covered.
    const hasImportOrExport = ast.program.body.filter(
      item =>
        item.type === "ImportDeclaration" ||
        item.type === "ExportNamedDeclaration" ||
        item.type === "ExportDefaultDeclaration"
    );

    if (hasImportOrExport.length === 0) {
      return src;
    }

    return babel.transformFromAstSync(ast, src, options).code;
  }
};
