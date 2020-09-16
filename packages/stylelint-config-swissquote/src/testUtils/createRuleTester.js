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

module.exports.test = async function OK(rule, schema) {
  expect.assertions(1);

  const postcssResult = postcssProcess(
    rule,
    typeof schema === "string" ? { code: schema } : schema
  );

  const warnings = postcssResult.warnings();
  return warnings.map(({ line, column, text }) => ({ line, column, text }));
};
