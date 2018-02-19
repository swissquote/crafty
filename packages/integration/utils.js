const childProcess = require("child_process");
const path = require("path");

function snapshotizeOutput(ret) {
  const escapedPath = path
    .join(__dirname, "..", "..")
    .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  return ret
    .replace(/ *$/gm, "") // Remove spaces at EOL
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g,
      ""
    ) // Remove ansi colors
    .replace(/^\[[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\]/gm, "[__:__:__]") // Remove timestamps
    .replace(/after ([0-9]*(?:\.[0-9]*)?) (h|min|[mnμ]?s)/g, "after ____ ms") // Remove durations
    .replace(/Δt ([0-9]*(?:\.[0-9]*)?)(h|min|[mnμ]?s)/g, "Δt ____ms") // Remove durations
    .replace(/(?: {4}at .*\n)* {4}at .*/gm, "    ...stacktrace...") // Remove stacktraces
    .replace(
      /result \[webpack\/bootstrap (.*?)\]/g,
      "result [webpack/bootstrap UNIQUE_ID]"
    ) // Remove hash from webpack results
    .replace(
      /Starting Crafty ([0-9]+\.[0-9]+\.[0-9]+)/g,
      "Starting Crafty __version__"
    ) // Remove version information in crafty output
    .replace(
      /Using typescript@([0-9]+\.[0-9]+\.[0-9]+)/g,
      "Using typescript@__version__"
    ) // Remove version information in typescript loader output
    .replace(
      /postcss-loader\/lib\?({.*})!/g,
      "postcss-loader?{__POSTCSS_OPTIONS__}!"
    ) // Remove very custom postcss options
    .replace(new RegExp(escapedPath, "gm"), "__PATH__") // Remove paths
    .replace(
      /Child extract-text-webpack-plugin (?:.*)\/(.*):/g,
      "Child extract-text-webpack-plugin __LONG_AND_WEIRD_PATH__!css/$1:"
    ); // Remove relative paths
}

function snapshotizeCSS(ret) {
  return ret.replace(/url\((?:'|")?(.*)\?(.*)\)/g, "url($1?CACHEBUST)"); // Cache busting
}

function run(args, commandOptions) {
  const options = Object.assign(
    {
      shell: true
    },
    commandOptions || {}
  );

  options.env = Object.assign(
    { TESTING_CRAFTY: "true" },
    process.env,
    options.env || {}
  );

  const ret = childProcess.spawnSync(
    `'${require.resolve("@swissquote/crafty/src/bin")}'`,
    args,
    options
  );

  return {
    stdout: ret.stdout
      ? `\n${snapshotizeOutput(ret.stdout.toString("utf8"))}`
      : "",
    stderr: ret.stderr ? snapshotizeOutput(ret.stderr.toString("utf8")) : "",
    status: ret.status
  };
}

module.exports = {
  run,
  snapshotizeCSS,
  snapshotizeOutput
};
