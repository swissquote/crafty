/* global expect */

const assignDisabledRanges = require("stylelint/lib/assignDisabledRanges");
//const basicChecks = require("./basicChecks")
const normalizeRuleSettings = require("stylelint/lib/normalizeRuleSettings");
const postcss = require("postcss");
const scssSyntax = require("postcss-scss");

function postcssProcess(rule, schema) {
  const ruleOptions = normalizeRuleSettings(schema.config, rule.ruleName);
  const rulePrimaryOptions = ruleOptions[0];
  const ruleSecondaryOptions = ruleOptions[1];

  const postcssProcessOptions = { syntax: scssSyntax, from: undefined };

  const processor = postcss();
  processor.use(assignDisabledRanges);

  if (schema.preceedingPlugins) {
    schema.preceedingPlugins.forEach(plugin => processor.use(plugin));
  }

  return processor
    .use(rule(rulePrimaryOptions, ruleSecondaryOptions))
    .process(schema.code, postcssProcessOptions);
}

module.exports.test = function OK(rule, schema) {
  expect.assertions(1);

  return postcssProcess(
    rule,
    typeof schema === "string" ? { code: schema } : schema
  )
    .then(postcssResult => {
      const warnings = postcssResult.warnings();

      if (warnings.length) {
        return {
          line: warnings[0].line,
          column: warnings[0].column,
          text: warnings[0].text,
          warnings: warnings.length
        };
      }

      return { warnings: 0 };
    })
    .catch(err => console.log(err.stack)); // eslint-disable-line no-console
};
