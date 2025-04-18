import { test } from "node:test";
import { expect } from "expect";

import stylelint from "stylelint";

import config from "../../recommended.js";

const validCss = `/** @define Form */

:root {
    --Form-text-color: inherit;
    --Form__label-font-size: var(--font-size--small);
    --Form__message-font-size: var(--font-size--small);

    --Form__item--required__after-text-color: var(--color-error);
    --Form__item--error-border-color: var(--color-error);
    --Form__item--error-text-color: var(--color-error);
    --Form__item--hasIcon-padding: 2rem;

    --Form__addon-border-width: var(--border-width--default);
    --Form__addon-border-style: var(--border-style--default);
    --Form__addon-border-color: var(--border-color--default);
    --Form__addon-border-radius: var(--border-radius--default);
    --Form__addon-background-color: var(--background-color--secondary);

    --Form__icon-text-color: var(--text-color--default);
}

.Form {
    position: relative;
    box-sizing: border-box;
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

/* Required
   ========================================================================== */

.Form__item.is-required > .Form__item__label:after {
    position: absolute;
    margin-left: 0.125rem;
    color: var(--Form__item--required__after-text-color);

    content: "*";
}

[dir="rtl"] {
    .Form__item.is-required > .Form__item__label:after {
        margin-left: 0;
        margin-right: 0.125rem;
    }
}

/* Errors
   ========================================================================== */

/* stylelint-disable swissquote/no-type-outside-scope */
.Form__item.has-error .Input,
.Form__item.has-error .Select select,
.Form__item.has-error .Textarea {
    border-color: var(--Form__item--error-border-color);
}
/* stylelint-enable */

.Form__item.has-error .Form__item__message {
    color: var(--Form__item--error-text-color);
}

.Form__item.has-error > .Form__item__control > .Icon {
    color: var(--Form__item--error-text-color);
}

/* Addons
   ========================================================================== */

.Form__item__control.has-addon {
    display: inline-table;
    border-collapse: separate;
    width: 100%;
}

.Form__item__addon {
    display: table-cell;
    border-collapse: separate;
    padding: 0 0.5rem;
    white-space: nowrap;
    border: var(--Form__addon-border-width) var(--Form__addon-border-style)
        var(--Form__addon-border-color);
    width: 1%;
    text-align: center;
    vertical-align: middle;
    background: var(--Form__addon-background-color);
}

.Form__item__addon + .Input {
    width: 100%;
    border-radius: 0;
}

.Form__item__addon:first-child {
    border-top-left-radius: var(--Form__addon-border-radius);
    border-bottom-left-radius: var(--Form__addon-border-radius);
    border-right-width: 0;
}

.Form__item__addon + .Form__item__addon {
    border-right-width: 0;
}

.Form__item__control.has-addon .Input ~ .Form__item__addon {
    border-left-width: 0;
    border-right-width: var(--Form__addon-border-width);
}

.Form__item__control.has-addon .Input ~ .Form__item__addon:last-child {
    border-top-right-radius: var(--Form__addon-border-radius);
    border-bottom-right-radius: var(--Form__addon-border-radius);
}

[dir="ltr"] > .Form__item__addon:first-child {
    border-top-left-radius: var(--Form__addon-border-radius);
    border-bottom-left-radius: var(--Form__addon-border-radius);
    border-right-width: 0;
}

[dir="ltr"]
    > .Form__item__control.has-addon
    .Input
    ~ .Form__item__addon:last-child {
    border-top-right-radius: var(--Form__addon-border-radius);
    border-bottom-right-radius: var(--Form__addon-border-radius);
}

[dir="ltr"] > .Form__item__control.has-addon .Input ~ .Form__item__addon {
    border-left-width: 0;
    border-right-width: var(--Form__addon-border-width);
}

[dir="rtl"] {
    .Form__item__addon:first-child {
        border-radius: 0 var(--Form__addon-border-radius)
            var(--Form__addon-border-radius) 0;
        border-left-width: 0;
        border-right-width: var(--Form__addon-border-width);
    }

    .Form__item__addon + .Form__item__addon {
        border-left-width: 0;
        border-right-width: var(--Form__addon-border-width);
    }

    .Form__item__control.has-addon .Input ~ .Form__item__addon {
        border-right-width: 0;
        border-left-width: var(--Form__addon-border-width);
    }

    .Form__item__control.has-addon .Input ~ .Form__item__addon:last-child {
        border-radius: var(--Form__addon-border-radius) 0 0
            var(--Form__addon-border-radius);
    }
}

/* Icons
   ========================================================================== */

.Form__item__control > .Icon {
    position: absolute;
    z-index: 1;
    width: 1.5rem;
    height: 1.5rem;
    top: 0.2rem;
    color: var(--Form__icon-text-color);
    text-align: center;
    font-size: 1.3em;
}

.Form__item__control.has-icon {
    > .Icon:first-child {
        left: 0.25rem;
    }

    > .Icon + .Input {
        padding-left: var(--Form__item--hasIcon-padding);
    }

    > .Input:first-child {
        padding-right: var(--Form__item--hasIcon-padding);
    }

    > .Input + .Icon {
        right: 0.25rem;
    }
}

/* stylelint-disable-next-line swissquote/no-type-outside-scope */
.Form__item__control > .Icon > svg {
    width: 1.5rem;
    height: 1.5rem;

    fill: currentColor;
}

[dir="rtl"] {
    .Form__item__control.has-icon > .Icon:first-child {
        left: 0;
        right: 0.25rem;
    }

    .Form__item__control.has-icon > .Icon + .Input {
        padding-left: 0;
        padding-right: 2rem;
    }

    .Form__item__control.has-icon > .Input:first-child {
        padding-right: 0.5rem;
        padding-left: 2rem;
    }

    .Form__item__control.has-icon > .Input + .Icon {
        right: auto;
        left: 0.25rem;
    }
}

/* Horizontal
   ========================================================================== */

@media (min-width: 48em) {
    .Form--horizontal .Form__item {
        text-align: right;
    }

    .Form--horizontal .Form__item__label {
        display: inline-block;
        max-width: 33%;
        vertical-align: middle;
        position: relative;
        margin-right: 0.625rem;
    }

    .Form--horizontal .Checkbox > .Form__item__label {
        top: 0;
    }

    .Form--horizontal .Form__item__control {
        width: calc(66% - 0.625rem);
        display: inline-block;
        text-align: left;
    }

    .Form--horizontal .Form__item__control.has-addon {
        display: inline-table;
    }

    [dir="rtl"] {
        .Form--horizontal .Form__item {
            text-align: left;
        }

        .Form--horizontal .Form__item__label {
            max-width: 33%;
            margin-right: 0;
            margin-left: 0.625rem;
        }

        .Form--horizontal .Form__item__control {
            width: calc(66% - 0.625rem);
            text-align: right;
        }
    }
}

/* Horizontal for Search App
   ========================================================================== */

.search-Form--horizontal .search-Form__item__control {
    width: calc(66% - 0.625rem);
    display: inline-block;
    text-align: left;
}
`;

test("flags no warnings nor errors with valid css", async () => {
  const result = await stylelint.lint({ code: validCss, config });
  expect(result.errored).toBeFalsy();
  expect(result.results[0].warnings.length).toBe(0);
});

test("Autofixes CSS", async () => {
  const data = await stylelint.lint({
    code: `.Foo { display: block; }`,
    config: { ...config, fix: true }
  });

  expect(data.code).toBe(".Foo {\n    display: block;\n}\n");
  expect(data.errored).toBeFalsy();
  expect(data.results[0].warnings.length).toBe(0);
});

test("Works with namespaces", async () => {
  const result = await stylelint.lint({
    code:
      ".Component {\n    top: 10px;\n}\n\n" +
      ".ns-Component {\n    top: 10px;\n}\n\n" +
      ".namespace-Component {\n    top: 10px;\n}\n\n" +
      ".myNamespace-Component {\n    top: 10px;\n}\n",
    config
  });

  expect(result.results[0].warnings.length).toBe(0);
});

test("Flags errors when using unknown at rules, with 'scss/at-rule-no-unknown'", async () => {
  const result = await stylelint.lint({
    code: `@while ($i == 1) {
    .Button {
        top: 10px;
    }
}

@unknown {
    .Button {
        top: 10px;
    }
}
`,
    config
  });

  expect(result.errored).toBeTruthy();
  expect(result.results[0].warnings).toEqual([
    {
      line: 7,
      endColumn: 9,
      endLine: 7,
      column: 1,
      rule: "scss/at-rule-no-unknown",
      severity: "error",
      text: 'Unexpected unknown at-rule "@unknown" (scss/at-rule-no-unknown)'
    }
  ]);
});

test("flags warnings when using ids raised one 'selector-max-id' error", async () => {
  const result = await stylelint.lint({
    code: "#ids-not-allowed {\n    top: 10px;\n}\n",
    config
  });

  expect(result.errored).toBeTruthy();
  expect(result.results[0].warnings).toEqual([
    {
      line: 1,
      column: 1,
      endColumn: 17,
      endLine: 1,
      rule: "selector-max-id",
      severity: "error",
      text:
        'Expected "#ids-not-allowed" to have no more than 0 ID selectors (selector-max-id)'
    }
  ]);
});

test("Works with CSS Modules", async () => {
  const result = await stylelint.lint({
    code: `/** @define App */

:global .t-global {
    :local .app {
        color: red;
    }
}

:global(.t-global) .app2 {
    color: green;
}
`,
    codeFilename: "app.module.css",
    config
  });

  expect(result.errored).toBeFalsy();
  expect(result.results[0].warnings.length).toBe(0);
});
