const test = require("ava");
const util = require("util");
const { lint } = require("stylelint");

function setupTestCases({ name, cases, schema, comparisons }) {
  if (cases && cases.length) {
    cases.forEach(testCase => {
      if (testCase) {
        // eslint-disable-next-line no-nested-ternary
        const spec = testCase.only
          ? test.only
          : testCase.skip
            ? test.skip
            : test;

        spec(
          `${name} ${util.inspect(schema.config)} ${util.inspect(
            testCase.code
          )} ${testCase.description || ""}`,
          comparisons(testCase)
        );
      }
    });
  }
}

module.exports = function testRule(schema) {
  const stylelintConfig = {
    plugins: schema.plugins,
    rules: {
      [schema.ruleName]: schema.config
    }
  };

  setupTestCases({
    name: "accept",
    cases: schema.accept,
    schema,
    comparisons: testCase => async t => {
      const stylelintOptions = {
        code: testCase.code,
        config: stylelintConfig,
        customSyntax: schema.customSyntax,
        codeFilename: schema.codeFilename
      };

      const output = await lint(stylelintOptions);
      t.deepEqual(output.results[0].warnings, []);
      t.deepEqual(output.results[0].parseErrors, []);
    }
  });

  setupTestCases({
    name: "reject",
    cases: schema.reject,
    schema,
    comparisons: testCase => async t => {
      const stylelintOptions = {
        code: testCase.code,
        config: stylelintConfig,
        customSyntax: schema.customSyntax,
        codeFilename: schema.codeFilename
      };

      const outputAfterLint = await lint(stylelintOptions);

      const actualWarnings = outputAfterLint.results[0].warnings;

      t.deepEqual(outputAfterLint.results[0].parseErrors, []);
      t.is(
        actualWarnings.length,
        testCase.warnings ? testCase.warnings.length : 1,
        "incorrect number of warnings found"
      );

      (testCase.warnings || [testCase]).forEach((expected, i) => {
        const warning = actualWarnings[i];

        t.true(
          "message" in testCase,
          'Expected "reject" test case to have a "message" property'
        );

        t.is(warning.text, expected.message);

        if (expected.line !== undefined) {
          t.is(warning.line, expected.line);
        }

        if (expected.column !== undefined) {
          t.is(warning.column, expected.column);
        }

        if (expected.endLine !== undefined) {
          t.is(warning.endLine, expected.endLine);
        }

        if (expected.endColumn !== undefined) {
          t.is(warning.endColumn, expected.endColumn);
        }
      });
    }
  });
};
