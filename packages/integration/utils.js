const childProcess = require("child_process");
const path = require("path");

function snapshotizeOutput(ret) {
  const escapedPath = path
    .join(__dirname, "..", "..")
    .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  return ret
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g, // eslint-disable-line no-control-regex
      ""
    ) // Remove ansi colors
    .replace(/^\[[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\]/gm, "[__:__:__]") // Remove timestamps
    .replace(/after ([0-9]*(?:\.[0-9]*)?) (h|min|[mnμ]?s)/g, "after ____ ms") // Remove durations
    .replace(/Δt ([0-9]*(?:\.[0-9]*)?)(h|min|[mnμ]?s)/g, "Δt ____ms") // Remove durations
    .replace(/｢atl｣: Time: ([0-9]*)ms/g, "｢atl｣: Time:  ____ms") // Remove durations
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
    .replace(/^(\s*)PASS(\s*)/gm, "PASS ") // Fix weird space in some case with nested jest runs (Jest)
    .replace(
      /^Time: {8}([0-9]*(?:\.[0-9]*)?)(h|min|[mnμ]?s)(, estimated ([0-9]*(?:\.[0-9]*)?)(h|min|[mnμ]?s))?/gm,
      "Time:        _____s"
    ) // Remove test durations (Jest)
    .replace(
      /(PASS|FAIL) (.*)\s\(([0-9]*(?:\.[0-9]*)?)(h|min|[mnμ]?s)\)/,
      "$1 $2"
    ) // Remove long test durations (Jest)
    .replace(
      /^ {2}( {2})?(✓|✕) (.*?) \(([0-9]*(?:\.[0-9]*)?)(h|min|[mnμ]?s)\)/gm,
      "  $1$2 $3 (__ms)"
    ) // Remove test result duration (Jest)
    .replace(
      /\/[-\w\/\.]*?\/npm-([a-z-]{1,213})([0-9\.]*)-([a-z0-9]{40})/gm,
      "__PATH__"
    ) // Remove paths
    .replace(new RegExp(escapedPath, "gm"), "__PATH__") // Remove paths
    .replace(/[\t\f\v ]+$/gm, "") // Remove spaces at EOL
    .replace(/\n\n\n+/g, "\n\n"); // Replace multi line breaks by single one
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
