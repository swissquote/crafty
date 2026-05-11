const fs = require("node:fs");
const path = require("node:path");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatError(errors) {
  if (!errors || errors.length === 0) {
    return "Error";
  }

  return errors
    .map(error => error.stack || error.message || error.name || String(error))
    .join("\n\n");
}

function getFilePath(testModule) {
  return (
    testModule.relativeModuleId ||
    path.relative(process.cwd(), testModule.moduleId)
  )
    .split(path.sep)
    .join("/");
}

class SonarReporter {
  constructor(options = {}) {
    this.options = options;
  }

  async onTestRunEnd(testModules) {
    const outputFile = path.resolve(
      process.cwd(),
      this.options.outputFile || "./reports/sonar-report.xml"
    );
    const lines = ['<testExecutions version="1">'];

    testModules.forEach(testModule => {
      const tests = [...testModule.children.allTests()];

      if (tests.length === 0) {
        return;
      }

      lines.push(`  <file path="${escapeXml(getFilePath(testModule))}">`);

      tests.forEach(test => {
        const result = test.result();
        const diagnostic = test.diagnostic();
        const duration = diagnostic ? diagnostic.duration : 0;
        const name = escapeXml(test.fullName);

        if (result.state === "passed") {
          lines.push(`    <testCase name="${name}" duration="${duration}" />`);
          return;
        }

        lines.push(`    <testCase name="${name}" duration="${duration}">`);

        if (result.state === "failed") {
          lines.push(
            `      <failure message="Error">${escapeXml(
              formatError(result.errors)
            )}</failure>`
          );
        } else {
          lines.push(
            `      <skipped message="${escapeXml(result.note || test.name)}" />`
          );
        }

        lines.push("    </testCase>");
      });

      lines.push("  </file>");
    });

    lines.push("</testExecutions>");

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, `${lines.join("\n")}\n`);
  }
}

module.exports = SonarReporter;
