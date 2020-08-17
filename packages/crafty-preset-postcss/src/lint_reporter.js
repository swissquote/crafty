const util = require("postcss-reporter/lib/util");
const postcss = require("postcss");
const formatter = require("stylelint/lib/formatters/stringFormatter");

function hasError(messages) {
  return messages.some(message => {
    if (message.rule) {
      // stylelint
      return message.severity === "error";
    } else {
      return message.type === "warning" || message.type === "error";
    }
  });
}

function shouldThrowError(sources) {
  return sources.length && sources.some(entry => entry.errored);
}

function reporter(opts) {
  const options = opts || {};

  let shouldThrow = false;
  const completeReport = [];

  function innerReporter(css, result) {
    const resultSource = result.root.source
      ? result.root.source.input.file || result.root.source.input.id
      : "";

    const messagesToLog = result.messages;
    const sourceGroupedMessages = messagesToLog.reduce(
      (innerResult, message) => {
        const key = util.getLocation(message).file || resultSource;
        if (!message.severity) {
          message.severity = message.type || "warning";
        }

        if (hasOwnProperty.call(innerResult, key)) {
          innerResult[key].push(message);
        } else {
          innerResult[key] = [message];
        }
        return innerResult;
      },
      {}
    );

    const prepared = [];
    Object.keys(sourceGroupedMessages).forEach(source => {
      const messages = sourceGroupedMessages[source];
      prepared.push({
        warnings: messages,
        source,
        deprecations: [],
        invalidOptionWarnings: [],
        errored: hasError(messages)
      });
    });

    if (options.clearReportedMessages) {
      result.messages = [];
    }

    const report = formatter(prepared).trim();
    if (report !== "") {
      completeReport.push(report);
    }

    if (options.throwError && shouldThrowError(prepared)) {
      shouldThrow = true;
    }
  }

  innerReporter.report = function() {
    if (completeReport.length) {
      console.log(`\n${completeReport.join("\n\n")}\n`);
    }

    return !shouldThrow;
  };

  return innerReporter;
}

module.exports = postcss.plugin("stylelint-reporter", reporter);
