const { test } = require("node:test");
const util = require("util");
const { expect } = require("expect");
const { lint } = require("stylelint");

function setupTestCases({ name, cases, schema, comparisons }) {
  if (cases && cases.length) {
    cases.forEach(testCase => {
      if (testCase) {
        // eslint-disable-next-line no-nested-ternary
        const testFn = testCase.only
          ? test.only
          : testCase.skip
          ? test.skip
          : test;

        testFn(
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
    comparisons: testCase => async () => {
      const stylelintOptions = {
        code: testCase.code,
        config: stylelintConfig,
        customSyntax: schema.customSyntax,
        codeFilename: schema.codeFilename
      };

      const output = await lint(stylelintOptions);
      expect(output.results[0].warnings).toEqual([]);
      expect(output.results[0].parseErrors).toEqual([]);
    }
  });

  setupTestCases({
    name: "reject",
    cases: schema.reject,
    schema,
    comparisons: testCase => async () => {
      const stylelintOptions = {
        code: testCase.code,
        config: stylelintConfig,
        customSyntax: schema.customSyntax,
        codeFilename: schema.codeFilename
      };

      const outputAfterLint = await lint(stylelintOptions);

      const actualWarnings = outputAfterLint.results[0].warnings;

      expect(outputAfterLint.results[0].parseErrors).toEqual([]);
      expect(actualWarnings.length).toBe(
        testCase.warnings ? testCase.warnings.length : 1,
        "incorrect number of warnings found"
      );

      (testCase.warnings || [testCase]).forEach((expected, i) => {
        const warning = actualWarnings[i];

        expect("message" in testCase).toBe(
          true,
          'Expected "reject" test case to have a "message" property'
        );

        expect(warning.text).toBe(expected.message);

        if (expected.line !== undefined) {
          expect(warning.line).toBe(expected.line);
        }

        if (expected.column !== undefined) {
          expect(warning.column).toBe(expected.column);
        }

        if (expected.endLine !== undefined) {
          expect(warning.endLine).toBe(expected.endLine);
        }

        if (expected.endColumn !== undefined) {
          expect(warning.endColumn).toBe(expected.endColumn);
        }
      });
    }
  });
};
