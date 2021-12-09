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

function getLocation(message) {
  const messageNode = message.node;

  const location = {
    line: message.line,
    column: message.column
  };

  const messageInput =
    messageNode && messageNode.source && messageNode.source.input;

  if (!messageInput) {
    return location;
  }

  const originLocation =
    messageInput.origin && messageInput.origin(message.line, message.column);
  if (originLocation) {
    return originLocation;
  }

  location.file = messageInput.file || messageInput.id;
  return location;
}

function shouldThrowError(sources) {
  return sources.length && sources.some(entry => entry.errored);
}

module.exports = opts => {
  const options = opts || {};

  let shouldThrow = false;
  const completeReport = [];

  return {
    postcssPlugin: "stylelint-reporter",
    OnceExit(root, { result }) {
      const messagesToLog = result.messages;

      const resultSource = result.root.source
        ? result.root.source.input.file || result.root.source.input.id
        : "";

      const sourceGroupedMessages = messagesToLog.reduce(
        (innerResult, message) => {
          const key = getLocation(message).file || resultSource;
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
    },
    report() {
      if (completeReport.length) {
        console.log(`\n${completeReport.join("\n\n")}\n`);
      }

      return !shouldThrow;
    }
  };
};
module.exports.postcss = true;
