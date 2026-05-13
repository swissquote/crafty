import Assets from "@swissquote/assets";
import { dirname } from "node:path";
import functions from "postcss-functions";
import { format } from "node:util";
import quote from "./quote.js";
import unescapeCss from "./unescape-css.js";
import unquote from "./unquote.js";
import generateFileUniqueId from "./__utils__/generateFileUniqueId.js";

const cachedDimensions = {};

function formatUrl(url) {
  return format("url(%s)", quote(url));
}

function formatSize(measurements) {
  return format("%dpx %dpx", measurements.width, measurements.height);
}

function formatWidth(measurements) {
  return format("%dpx", measurements.width);
}

function formatHeight(measurements) {
  return format("%dpx", measurements.height);
}

function measure(params, resolver, path, density) {
  let cached = null;
  let id = "";
  let getSizePromise = null;

  return resolver.path(path).then(resolvedPath => {
    if (params.cache) {
      cached = cachedDimensions[resolvedPath];
      id = generateFileUniqueId(resolvedPath);
    }

    if (cached && id && cached[id]) {
      getSizePromise = Promise.resolve(cached[id]);
    } else {
      getSizePromise = resolver.size(path).then(size => {
        if (params.cache && id) {
          cachedDimensions[resolvedPath] = {};
          cachedDimensions[resolvedPath][id] = size;
        }
        return size;
      });
    }

    return getSizePromise.then(size => {
      if (density !== undefined) {
        return {
          width: Number((size.width / density).toFixed(4)),
          height: Number((size.height / density).toFixed(4))
        };
      }
      return size;
    });
  });
}

const plugin = (params = {}) => {
  if (params.relative === undefined) {
    params.relative = false;
  }

  const resolver = new Assets(params);

  return {
    // Initialize functions plugin as if it was this plugin
    ...functions({
      functions: {
        resolve: function resolve(path) {
          const normalizedPath = unquote(unescapeCss(path));
          return resolver.url(normalizedPath).then(formatUrl);
        },
        inline: function inline(path) {
          const normalizedPath = unquote(unescapeCss(path));
          return resolver.data(normalizedPath).then(formatUrl);
        },
        size: function size(path, density) {
          const normalizedPath = unquote(unescapeCss(path));
          return measure(params, resolver, normalizedPath, density).then(
            formatSize
          );
        },
        width: function width(path, density) {
          const normalizedPath = unquote(unescapeCss(path));
          return measure(params, resolver, normalizedPath, density).then(
            formatWidth
          );
        },
        height: function height(path, density) {
          const normalizedPath = unquote(unescapeCss(path));
          return measure(params, resolver, normalizedPath, density).then(
            formatHeight
          );
        }
      }
    }),
    // Override with our own features and name
    postcssPlugin: "postcss-assets",
    Once(root) {
      let inputDir;
      if (root.source.input.file) {
        inputDir = dirname(root.source.input.file);

        resolver.options.loadPaths = resolver.options.loadPaths || [];
        resolver.options.loadPaths.unshift(inputDir);

        if (params.relative === true) {
          resolver.options.relativeTo = inputDir;
        }
      }

      if (typeof params.relative === "string") {
        resolver.options.relativeTo = params.relative;
      }
    }
  };
};
plugin.postcss = true;

export default plugin;
