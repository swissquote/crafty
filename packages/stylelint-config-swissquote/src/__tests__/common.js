const test = require("ava");

const stylelint = require("stylelint");

const config = require("../../common");

const validCss = `
.Form {
    position: relative;
    box-sizing: border-box;
}

.Form > fieldset {
    border: none;
    margin: 0;
    padding: 0;
}

.Form > fieldset > legend {
    box-sizing: border-box;
    color: va(--Form-text-color);
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
}

.Form__item__label {
    position: relative;
    display: inline-block;
    font-size: var(--Form__label-font-size);
    line-height: 1.5;
    margin: 0 0 0.25rem;
}

.Form__item__control {
    position: relative;
    vertical-align: middle;
}

.Form__item__control + .Form__item__control {
    margin-top: 1rem;
}

.Form__item__message {
    font-size: var(--Form__message-font-size);

    margin: 0;
    margin-top: 0.375rem;
}

.Form__item + .Form__item {
    margin-top: 1rem;
}
`;

test("flags no warnings with valid css", async (t) => {
  const result = await stylelint.lint({
    code: validCss.replace(/^\n/, ""),
    config
  });

  t.falsy(result.errored);
  t.is(result.results[0].warnings.length, 0);
});

const errors = [
  {
    code: "#some-id {\n}",
    line: 1,
    column: 10,
    message: "Unexpected empty block (block-no-empty)"
  },
  {
    code: "#some-id { color: blue;}",
    line: 1,
    column: 11,
    message:
      'Replace "·color:·blue;" with "⏎····color:·blue;⏎" (prettier/prettier)'
  },
  {
    code: "#some-id {color: blue; }",
    line: 1,
    column: 11,
    message:
      'Replace "color:·blue;·" with "⏎····color:·blue;⏎" (prettier/prettier)'
  },
  {
    code: "#some-id { color: blue; background: orange; }",
    line: 1,
    column: 11,
    message:
      'Replace "·color:·blue;·background:·orange;·" with "⏎····color:·blue;⏎····background:·orange;⏎" (prettier/prettier)'
  },
  {
    code: "#some-id {\n color: blue;\n}",
    line: 2,
    column: 2,
    message: 'Insert "···" (prettier/prettier)'
  }
];

errors.forEach(error => {
  test(`Error: ${error.message}`, async (t) => {
    const result = await stylelint.lint({ code: `${error.code}\n`, config });

    t.truthy(result.errored);
    //console.log(result.results[0].warnings);
    t.is(result.results[0].warnings.length, 1);
    t.is(result.results[0].warnings[0].text, error.message);
    t.is(result.results[0].warnings[0].severity, "error");
    t.is(result.results[0].warnings[0].line, error.line);
    t.is(result.results[0].warnings[0].column, error.column);
  });
});
