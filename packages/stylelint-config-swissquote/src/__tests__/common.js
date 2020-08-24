/* global jest, describe, it, beforeEach, expect */

const stylelint = require("stylelint");

const config = require("../../common");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

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

it("flags no warnings with valid css", async () => {
  const result = await stylelint.lint({
    code: validCss.replace(/^\n/, ""),
    config,
  });

  expect(result.errored).toBeFalsy();
  expect(result.results[0].warnings.length).toBe(0);
});

const errors = [
  {
    code: "#some-id {\n}",
    line: 1,
    column: 10,
    message: "Unexpected empty block (block-no-empty)",
  },
  {
    code: "#some-id { color: blue;}",
    line: 1,
    column: 11,
    message:
      'Replace "·color:·blue;" with "⏎····color:·blue;⏎" (prettier/prettier)',
  },
  {
    code: "#some-id {color: blue; }",
    line: 1,
    column: 11,
    message:
      'Replace "color:·blue;·" with "⏎····color:·blue;⏎" (prettier/prettier)',
  },
  {
    code: "#some-id { color: blue; background: orange; }",
    line: 1,
    column: 11,
    message:
      'Replace "·color:·blue;·background:·orange;·" with "⏎····color:·blue;⏎····background:·orange;⏎" (prettier/prettier)',
  },
  {
    code: "#some-id {\n color: blue;\n}",
    line: 2,
    column: 2,
    message: 'Insert "···" (prettier/prettier)',
  },
];

errors.forEach((error) => {
  it(`Error: ${error.message}`, async () => {
    const result = await stylelint.lint({ code: `${error.code}\n`, config });

    expect(result.errored).toBeTruthy();
    //console.log(result.results[0].warnings);
    expect(result.results[0].warnings.length).toBe(1);
    expect(result.results[0].warnings[0].text).toBe(error.message);
    expect(result.results[0].warnings[0].severity).toBe("error");
    expect(result.results[0].warnings[0].line).toBe(error.line);
    expect(result.results[0].warnings[0].column).toBe(error.column);
  });
});
