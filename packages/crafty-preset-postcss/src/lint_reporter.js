const _ = require("lodash");
const util = require("postcss-reporter/lib/util");
const postcss = require("postcss");
const formatter = require("stylelint/lib/formatters/stringFormatter");

function hasError(messages) {
  return messages.some(function(message) {
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
    let resultSource = result.root.source
      ? result.root.source.input.file || result.root.source.input.id
      : "";

    let messagesToLog = result.messages;
    const sourceGroupedMessages = _.groupBy(
      messagesToLog,
      message => util.getLocation(message).file || resultSource
    );

    const prepared = [];
    _.forOwn(sourceGroupedMessages, function(messages, source) {
      prepared.push({
        warnings: messages,
        source: source,
        deprecations: [],
        invalidOptionWarnings: [],
        errored: hasError(messages)
      });
    });

    if (options.clearReportedMessages) {
      result.messages = _.difference(result.messages, messagesToLog);
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
      console.log("\n" + completeReport.join("\n\n") + "\n");
    }

    return !shouldThrow;
  };

  return innerReporter;
}

module.exports = postcss.plugin("stylelint-reporter", reporter);
