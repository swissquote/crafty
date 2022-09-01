const path = require("path");

const regexLikeIndexModule = /index\.module\.s?css$/;

function getExtractConfig(bundle) {
  let extractCSSConfig = bundle.extractCSS;
  if (extractCSSConfig === true) {
    extractCSSConfig = {
      filename: "[bundle]-[name].min.css"
    };
  } else if (typeof extractCSSConfig === "string") {
    extractCSSConfig = {
      filename: extractCSSConfig
    };
  }

  // Allow to template [bundle] with the bundle name
  if (typeof extractCSSConfig.filename === "string") {
    extractCSSConfig.filename = extractCSSConfig.filename.replace(
      "[bundle]",
      bundle.name
    );
  }

  return extractCSSConfig;
}

function getCssModuleLocalIdent(context, _, exportName, options) {
  const loaderUtils = require("loader-utils");

  const relativePath = path
    .relative(context.rootContext, context.resourcePath)
    .replace(/\\+/g, "/");

  // Generate a more meaningful name (parent folder) when the user names the
  // file `index.module.css`.
  const fileNameOrFolder = regexLikeIndexModule.test(relativePath)
    ? "[folder]"
    : "[name]";

  // Generate a hash to make the class name unique.
  const hash = loaderUtils.getHashDigest(
    Buffer.from(`filePath:${relativePath}#className:${exportName}`),
    "md5",
    "base64",
    5
  );

  // Have webpack interpolate the `[folder]` or `[name]` to its real value.
  return (
    loaderUtils
      .interpolateName(
        context,
        `${fileNameOrFolder}_${exportName}__${hash}`,
        options
      )
      .replace(
        // Webpack name interpolation returns `about.module_root__2oFM9` for
        // `.root {}` inside a file named `about.module.css`. Let's simplify
        // this.
        /\.module_/,
        "_"
      )
      // Replace invalid symbols with underscores instead of escaping
      // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      // "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
      // https://www.w3.org/TR/CSS21/syndata.html#characters
      .replace(/^(\d|--|-\d)/, "__$1")
  );
}

function createRule(crafty, bundle, styleRule, options) {
  const getProcessors = require("@swissquote/postcss-swissquote-preset/processors");

  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // The "style" loader enables hot editing of CSS.

  if (crafty.getEnvironment() === "production" && bundle.extractCSS) {
    // Initialize extraction plugin
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");

    // Create a list of loaders that also contains the extraction loader
    styleRule.use("style-loader").loader(MiniCssExtractPlugin.loader);

    chain
      .plugin("extractCSS")
      .use(MiniCssExtractPlugin, [getExtractConfig(bundle)]);
  } else {
    styleRule
      .use("style-loader")
      .loader(require.resolve("../packages/style-loader.js"));
  }

  styleRule
    .use("css-loader")
    .loader(require.resolve("../packages/css-loader.js"))
    .options({
      importLoaders: 1,
      sourceMap:
        crafty.getEnvironment() === "production" && !!bundle.extractCSS,
      ...(options.cssLoader || {})
    });

  styleRule
    .use("postcss-loader")
    .loader(require.resolve("../packages/postcss-loader.js"))
    .options({
      implementation: require("postcss"),
      postcssOptions: {
        parser: require("postcss-scss"),
        plugins: getProcessors(crafty.config, crafty, bundle)
      }
    });
}

function createGlobalRule(crafty, bundle, chain) {
  createRule(
    crafty,
    bundle,
    chain.module
      .rule("styles")
      .test(/(?<!\.module)\.s?css$/i)
      .sideEffects(true), {
    cssLoader: {
      modules: false
    }
  });
}

function createModuleRule(crafty, bundle, chain) {
  createRule(
    crafty,
    bundle,
    chain.module
      .rule("styles-modules")
      .test(/\.module\.s?css$/i)
      .sideEffects(false),
    {
      cssLoader: {
        modules: {
          exportLocalsConvention: "asIs",
          mode: "pure",
          getLocalIdent: getCssModuleLocalIdent
        }
      }
    }
  );
}

module.exports = {
  getCssModuleLocalIdent,
  createGlobalRule,
  createModuleRule
};
