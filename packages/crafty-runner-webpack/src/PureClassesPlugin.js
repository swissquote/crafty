const WebpackSources = require("webpack-sources");

const ReplaceSource = WebpackSources.ReplaceSource;

const regex = /\/\**\s*@class\s*\**\//g;
/**
 * Okay, take a seat, this is a long and funny one.
 *
 * When Compiled to ES5, ES6 classes become IIFEs.
 * Which is perfectly fine, but to UglifyJS an IIFE is considered
 * as code that has side effects (it's an executed function after all)
 * (https://github.com/mishoo/UglifyJS2/issues/1261)
 *
 * So to indicate to UglifyJS that it is a Class and thus can be safely
 * removed they introduced the `@__PURE__` Annotation.
 * (https://github.com/mishoo/UglifyJS2/compare/v2.8.0...v2.8.1)
 *
 * So any function/class/IIFE annotated with this will be understood by
 * UglifyJS as something that has no side effects and can be removed if unused in the rest of the code.
 *
 * BUT When Webpack had to implement the annotation, they decided to not use `@__PURE__` but to use `@class` instead.
 * (https://github.com/Microsoft/TypeScript/issues/13721)
 *
 * When requested to also support @class, UglifyJS guys ... refused and said we had to use a Text replacement plugin.
 * (https://github.com/mishoo/UglifyJS2/issues/2279)
 *
 * So this plugin is to change @class to @__PURE__ before uglifyJS compresses the source.
 */
class PureClassesPlugin {
  apply(compiler) {
    compiler.plugin("compilation", compilation => {
      compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
        chunks.forEach(function(chunk) {
          chunk.files.forEach(function(file) {
            const value = compilation.assets[file].source();

            const replacement = new ReplaceSource(
              compilation.assets[file],
              file
            );

            let hasReplacements = false;
            let m;
            while ((m = regex.exec(value)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (m.index === regex.lastIndex) {
                regex.lastIndex++;
              }

              replacement.replace(
                m.index,
                m.index + m[0].length - 1,
                "/*@__PURE__*/"
              );
              hasReplacements = true;
            }

            if (hasReplacements) {
              compilation.assets[file] = replacement;
            }
          });
        });
        callback();
      });
    });
  }
}

module.exports = PureClassesPlugin;
