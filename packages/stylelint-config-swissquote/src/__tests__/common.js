/* global describe, it, beforeEach, expect */

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

describe("flags no warnings with valid css", () => {
  let result;

  beforeEach(() => {
    result = stylelint.lint({
      code: validCss,
      config
    });
  });

  it("did not error", () => {
    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it("flags no warnings", () => {
    return result.then(data => expect(data.results[0].warnings.length).toBe(0));
  });
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
    column: 23,
    message:
      'Expected single space before "}" of a single-line block (block-closing-brace-space-before)'
  },
  {
    code: "#some-id {color: blue; }",
    line: 1,
    column: 11,
    message:
      'Expected single space after "{" of a single-line block (block-opening-brace-space-after)'
  },
  {
    code: "#some-id { color: blue; background: orange; }",
    line: 1,
    column: 10,
    message:
      "Expected no more than 1 declaration (declaration-block-single-line-max-declarations)"
  },
  {
    code: "#some-id {\n color: blue;\n}",
    line: 2,
    column: 2,
    message: "Expected indentation of 4 spaces (indentation)"
  }
];

errors.forEach(error => {
  describe(`Error: ${error.message}`, () => {
    let result;

    beforeEach(() => {
      result = stylelint.lint({ code: `${error.code}\n`, config });
    });

    it("did error", () => {
      return result.then(data => expect(data.errored).toBeTruthy());
    });

    it("flags one warning", () => {
      //result.then(data => {
      //  console.log(data.results[0].warnings.map(warning => "=> " + warning.line + ":" + warning.column + " " + warning.text).join("\n"))
      //});
      return result.then(data =>
        expect(data.results[0].warnings.length).toBe(1)
      );
    });

    it("correct warning text", () => {
      return result.then(data =>
        expect(data.results[0].warnings[0].text).toBe(error.message)
      );
    });

    it("correct severity flagged", () => {
      return result.then(data =>
        expect(data.results[0].warnings[0].severity).toBe("error")
      );
    });

    it("correct line number", () => {
      return result.then(data =>
        expect(data.results[0].warnings[0].line).toBe(error.line)
      );
    });

    it("correct column number", () => {
      return result.then(data =>
        expect(data.results[0].warnings[0].column).toBe(error.column)
      );
    });
  });
});
