# Swissquote Stylelint configuration

## Features

* Lint style sheets following the Swissquote CSS Guideline (on form and
  function).
* Uses standard Stylelint rules and includes 4 custom rules.
* Provides a simpler standard for legacy code.

## Presets

* `recommended`: Contains all BEM specific rules.
* `legacy`: Contains rules specific to legacy code.
* `common`: Enforces the styleguide of the CSS. (included in both `recommended`
  and `legacy`)

## Rules

* `no-hack-reassignment`: Hacks (`._*`) must be applied directly on the
  concerned element.
* `no-state-without-component`: States (`.is-*|.has-*`) must appear next to a
  component.
* `no-type-outside-scope`: Types (`a`, `div` ...) must appear inside a scope
  (`.s-*`).
* `no-utility-reassignment`: Utilities (`.u-*`) must be applied directly on the
  concerned element.

## Usage within Crafty

Crafty includes those rules and presets by default, you don't need to do any
specific action to use them.

## Usage outside Crafty

Outside Crafty, you have to use it as you would for any Stylelint plugin or
preset.

1. You install it:

   ```bash
   npm install @swissquote/stylelint-config-swissquote --save
   ```

1. You import the plugin and extend from it:
   ```json
   {
     "plugins": ["@swissquote/stylelint-config-swissquote"],
     "extends": ["@swissquote/stylelint-config-swissquote/recommended"],
     "rules": {
       // your custom rules here
     }
   }
   ```
