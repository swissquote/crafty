// This file is a copy of https://github.com/jaydenseric/babel-plugin-transform-runtime-file-extensions
// With a small difference as the babel runtime is specified with a full path, you can't use a `.startsWith` but use an `.indexOf` instead

/**
 * Ensures a require or import string literal specifier has a file extension if
 * it’s for the Babel runtime.
 * @param {{value: string}} specifier Require or import string literal specifier.
 */
function fixBabelRuntimeSpecifier(specifier) {
  if (
    (specifier.value.startsWith('./') ||specifier.value.startsWith('../'))&&
    !specifier.value.endsWith('.js')
  )
    specifier.value = `${specifier.value}.js`;
}

/**
 * A Babel plugin that adds file extensions to Babel runtime import specifiers
 * and require paths for Node.js ESM compatibility.
 * @returns {object} Babel plugin object.
 * @see [babel/babel#8462](https://github.com/babel/babel/issues/8462).
 */
module.exports = function babelPluginTransformRuntimeFileExtensions() {
  return {
    name: 'transform-runtime-file-extensions-inside',
    visitor: {
      // Example ImportDeclaration:
      //   import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
      // Example ExportNamedDeclaration (unlikely to occur):
      //   export { default as _objectWithoutPropertiesLoose } from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
      'ImportDeclaration|ExportNamedDeclaration'(path) {
        if (path.node.source) fixBabelRuntimeSpecifier(path.node.source);
      },

      // Example CallExpression:
      // require("@babel/runtime/helpers/objectWithoutPropertiesLoose");
      CallExpression(path) {
        if (path.node.callee.name === 'require') {
          const [specifier] = path.node.arguments;
          if (specifier && specifier.type === 'StringLiteral')
            fixBabelRuntimeSpecifier(specifier);
        }
      },
    },
  };
};
