const colors = require("@swissquote/crafty-commons/packages/ansi-colors");
const symbols = require("../packages/log-symbols.js");

const formatWebpackMessages = require("./utils/formatWebpackMessages");

function styleTime(ms) {
  const out = `${ms.toString()}ms`;
  const ubound = 1600;
  const lbound = 200;

  if (ms > ubound) {
    return colors.bgRed(out);
  } else if (ms <= lbound) {
    return colors.green.bold(out);
  }

  const styles = [colors.red.bold, colors.red, colors.yellow, colors.green];
  const values = [ubound, ubound / 2, lbound * 2, lbound];
  const closest = Math.max.apply(
    null,
    values.filter(v => v <= ms)
  );
  const style = styles[values.indexOf(closest)];

  return style(out);
}

function plur(word, count) {
  return `${word}${count === 1 ? "" : "s"}`;
}

function footer(counts) {
  const problems = counts.errors + counts.warnings;
  const result = [];

  if (problems > 0) {
    const symbol = counts.errors > 0 ? symbols.error : symbols.warning;
    const style = {
      errors: counts.errors > 0 ? "red" : "dim",
      problems: problems > 0 ? "bold" : "dim",
      warnings: counts.warnings > 0 ? "yellow" : "dim"
    };
    const labels = {
      errors: plur("error", counts.errors),
      problems: colors[style.problems](
        `${problems} ${plur("problem", problems)}`
      ),
      warnings: plur("warning", counts.warnings)
    };
    const errors = colors[style.errors](`${counts.errors} ${labels.errors}`);
    const warnings = colors[style.warnings](
      `${counts.warnings} ${labels.warnings}`
    );

    if (counts.errors > 0) {
      labels.problems = colors[style.errors](labels.problems);
    } else if (counts.warnings) {
      labels.problems = ` ${colors[style.warnings](labels.problems)}`;
    }

    result.push(`${symbol} ${labels.problems} (${errors}, ${warnings})`);
  }

  return result.join("\n");
}

module.exports = function(stats) {
  // Write stats
  console.log(
    stats.toString({
      version: false, // This is just noise
      errors: false, // Errors are printed separately
      errorsCount: false,
      warnings: false, // Warnings are printed separately
      warnignsCount: false,
      timings: false, // Displayed separately
      relatedAssets: true,
      entrypoints: true,
      chunkGroups: true,
      chunks: true
    })
  );

  const jsonOpts = {
    all: false,
    timings: true,
    warnings: true,
    errors: true,
    errorDetails: true
  };
  const json = stats.toJson(jsonOpts, true);

  // Nicer Error/Warning Messages
  const messages = formatWebpackMessages(json);
  // If errors exist, only show errors.
  if (messages.errors.length) {
    console.log(`\n  ${colors.red("Failed to compile.")}\n`);
    messages.errors.forEach(message => {
      console.log(`${message}\n`);
    });
  } else if (messages.warnings.length) {
    console.log(`\n  ${colors.yellow("Compiled with warnings.")}\n`);
    // Show warnings if no errors were found.
    messages.warnings.forEach(message => {
      console.log(`${message}\n`);
    });
  } else {
    console.log(`\n  ${colors.green("Compiled successfully!")}`);
  }

  const timeTitle = colors.gray(`  Δ${colors.italic("t")}`);
  const time = `${timeTitle} ${styleTime(json.time)}`;

  if (messages.warnings.length || messages.errors.length) {
    console.log(
      time,
      footer({
        errors: messages.errors.length,
        warnings: messages.warnings.length
      })
    );
  } else {
    console.log(time);
  }

  console.log();
};
