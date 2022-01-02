/* eslint-disable @swissquote/swissquote/sonarjs/cognitive-complexity */
/* eslint-disable @swissquote/swissquote/sonarjs/no-nested-template-literals */
/*
 ** Taken from https://github.com/rollup/rollup/blob/941b3a4a1aa5de049bbbb18e776bfc157ad0d4c5/bin/src/run/batchWarnings.js
 ** We might need to keep this up-to-date with new updates of Rollup
 */

const colors = require("@swissquote/crafty-commons/packages/ansi-colors");

const relativeId = require("./relativeId");

const stderr = console.error.bind(console);

function title(str) {
  stderr(colors.bold.yellow(`(!) ${str}`));
}

function info(url) {
  stderr(colors.grey(url));
}

function nest(array, prop) {
  const nested = [];
  const lookup = new Map();

  array.forEach(item => {
    const key = item[prop];
    if (!lookup.has(key)) {
      lookup.set(key, {
        key,
        items: []
      });

      nested.push(lookup.get(key));
    }

    lookup.get(key).items.push(item);
  });

  return nested;
}

function showTruncatedWarnings(warnings) {
  const nestedByModule = nest(warnings, "id");

  const sliced =
    nestedByModule.length > 5 ? nestedByModule.slice(0, 3) : nestedByModule;
  sliced.forEach(({ key: id, items }) => {
    stderr(colors.bold(relativeId(id)));
    stderr(colors.grey(items[0].frame));

    if (items.length > 1) {
      stderr(
        `...and ${items.length - 1} other ${
          items.length > 2 ? "occurrences" : "occurrence"
        }`
      );
    }
  });

  if (nestedByModule.length > sliced.length) {
    stderr(`\n...and ${nestedByModule.length - sliced.length} other files`);
  }
}

const immediateHandlers = {
  DEPRECATED_OPTIONS: warning => {
    title("Some options have been renamed");
    info(
      "https://gist.github.com/Rich-Harris/d472c50732dab03efeb37472b08a3f32"
    );
    warning.deprecations.forEach(option => {
      stderr(`${colors.bold(option.old)} is now ${option.new}`);
    });
  },

  MISSING_NODE_BUILTINS: warning => {
    title("Missing shims for Node.js built-ins");

    let detail = `'${warning.modules[0]}'`;

    if (warning.modules.length > 1) {
      detail = `${warning.modules
        .slice(0, -1)
        .map(name => `'${name}'`)
        .join(", ")} and '${warning.modules.slice(-1)}'`;
    }

    stderr(
      `Creating a browser bundle that depends on ${detail}. You might need to include https://www.npmjs.com/package/rollup-plugin-node-builtins`
    );
  },

  MIXED_EXPORTS: () => {
    title("Mixing named and default exports");
    stderr(
      "Consumers of your bundle will have to use bundle['default'] to access the default export, which may not be what you want. Use `exports: 'named'` to disable this warning"
    );
  },

  EMPTY_BUNDLE: () => {
    title("Generated an empty bundle");
  }
};

const deferredHandlers = {
  UNUSED_EXTERNAL_IMPORT: {
    priority: 1,
    fn: warnings => {
      title("Unused external imports");
      warnings.forEach(warning => {
        stderr(
          `${warning.names} imported from external module '${warning.source}' but never used`
        );
      });
    }
  },

  UNRESOLVED_IMPORT: {
    priority: 1,
    fn: warnings => {
      title("Unresolved dependencies");
      info(
        "https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency"
      );

      const dependencies = new Map();
      warnings.forEach(warning => {
        if (!dependencies.has(warning.source)) {
          dependencies.set(warning.source, []);
        }
        dependencies.get(warning.source).push(warning.importer);
      });

      Array.from(dependencies.keys()).forEach(dependency => {
        const importers = dependencies.get(dependency);
        stderr(
          `${colors.bold(dependency)} (imported by ${importers.join(", ")})`
        );
      });
    }
  },

  MISSING_EXPORT: {
    priority: 1,
    fn: warnings => {
      title("Missing exports");
      info(
        "https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module"
      );

      warnings.forEach(warning => {
        stderr(colors.bold(warning.importer));
        stderr(`${warning.missing} is not exported by ${warning.exporter}`);
        stderr(colors.grey(warning.frame));
      });
    }
  },

  THIS_IS_UNDEFINED: {
    priority: 1,
    fn: warnings => {
      title("`this` has been rewritten to `undefined`");
      info(
        "https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined"
      );
      showTruncatedWarnings(warnings);
    }
  },

  EVAL: {
    priority: 1,
    fn: warnings => {
      title("Use of eval is strongly discouraged");
      info(
        "https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval"
      );
      showTruncatedWarnings(warnings);
    }
  },

  NON_EXISTENT_EXPORT: {
    priority: 1,
    fn: warnings => {
      title(
        `Import of non-existent ${warnings.length > 1 ? "exports" : "export"}`
      );
      showTruncatedWarnings(warnings);
    }
  },

  NAMESPACE_CONFLICT: {
    priority: 1,
    fn: warnings => {
      title("Conflicting re-exports");
      warnings.forEach(warning => {
        stderr(
          `${colors.bold(relativeId(warning.reexporter))} re-exports '${
            warning.name
          }' from both ${relativeId(warning.sources[0])} and ${relativeId(
            warning.sources[1]
          )} (will be ignored)`
        );
      });
    }
  },

  MISSING_GLOBAL_NAME: {
    priority: 1,
    fn: warnings => {
      title(
        `Missing global variable ${warnings.length > 1 ? "names" : "name"}`
      );
      stderr(
        "Use options.globals to specify browser global variable names corresponding to external modules"
      );
      warnings.forEach(warning => {
        stderr(`${colors.bold(warning.source)} (guessing '${warning.guess}')`);
      });
    }
  },

  SOURCEMAP_BROKEN: {
    priority: 1,
    fn: warnings => {
      title("Broken sourcemap");
      info(
        "https://github.com/rollup/rollup/wiki/Troubleshooting#sourcemap-is-likely-to-be-incorrect"
      );

      const plugins = Array.from(
        new Set(warnings.map(w => w.plugin).filter(Boolean))
      );

      let detail = "";

      if (plugins.length > 1) {
        detail = ` (such as ${plugins
          .slice(0, -1)
          .map(p => `'${p}'`)
          .join(", ")} and '${plugins.slice(-1)}')`;
      } else if (plugins.length === 1) {
        detail = ` (such as '${plugins[0]}')`;
      }

      stderr(
        `Plugins that transform code${detail} should generate accompanying sourcemaps`
      );
    }
  },

  PLUGIN_WARNING: {
    priority: 1,
    fn: warnings => {
      const nestedByPlugin = nest(warnings, "plugin");

      nestedByPlugin.forEach(({ key: plugin, items }) => {
        const nestedByMessage = nest(items, "message");

        let lastUrl;

        nestedByMessage.forEach(({ key: message, items: innerItems }) => {
          title(`${plugin} plugin: ${message}`);
          innerItems.forEach(warning => {
            if (warning.url !== lastUrl) {
              lastUrl = warning.url;
              info(lastUrl);
            }

            let loc = relativeId(warning.id);
            if (warning.loc) {
              loc += `: (${warning.loc.line}:${warning.loc.column})`;
            }

            stderr(colors.bold(relativeId(loc)));
            if (warning.frame) {
              info(warning.frame);
            }
          });
        });
      });
    }
  }
};

module.exports = function batchWarnings(taskName) {
  let allWarnings = new Map();
  let count = 0;

  return {
    get count() {
      return count;
    },

    add: warning => {
      if (typeof warning === "string") {
        //eslint-disable-next-line no-param-reassign
        warning = { code: "UNKNOWN", message: warning };
      }

      if (warning.code in immediateHandlers) {
        immediateHandlers[warning.code](warning);
        return;
      }

      if (!allWarnings.has(warning.code)) {
        allWarnings.set(warning.code, []);
      }
      allWarnings.get(warning.code).push(warning);

      count += 1;
    },

    flush: () => {
      if (count === 0) {
        return;
      }

      const codes = Array.from(allWarnings.keys()).sort((a, b) => {
        if (deferredHandlers[a] && deferredHandlers[b]) {
          return deferredHandlers[a].priority - deferredHandlers[b].priority;
        }

        if (deferredHandlers[a]) {
          return -1;
        }
        if (deferredHandlers[b]) {
          return 1;
        }
        return allWarnings.get(b).length - allWarnings.get(a).length;
      });

      codes.forEach(code => {
        const handler = deferredHandlers[code];
        const warnings = allWarnings.get(code);

        if (handler) {
          handler.fn(warnings);
        } else {
          warnings.forEach(warning => {
            stderr(
              `[${taskName}] ${colors.bold.yellow(`(!) ${warning.message}`)}`
            );

            if (warning.url) {
              info(warning.url);
            }

            const id = (warning.loc && warning.loc.file) || warning.id;
            if (id) {
              let loc = relativeId(warning.id);
              if (warning.loc) {
                loc += `: (${warning.loc.line}:${warning.loc.column})`;
              }

              stderr(colors.bold(relativeId(loc)));
            }

            if (warning.frame) {
              info(warning.frame);
            }
          });
        }
      });

      allWarnings = new Map();
      count = 0;
    }
  };
};
