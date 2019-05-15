Since Crafty 1.7.0, We use ESLint to lint TypeScript.

This means that the tooling we used for JavaScript is now the same for TypeScript, which means that the documentation for [JavaScript Linting](./JavaScript_Linting.md) applies for TypeScript as well.

## Differences

TypeScript, with its type system can apply more advanced checks to the code.
But ESLint doesn't understand types in its default rule set, that's why we include the `@typescript-eslint/eslint-plugin` plugin to add more advanced rules.

The `format` and `recommended` presets we have in our own ESLint plugin already include rules for TypeScript out of the box.

## Customize the rules

ESLint [contains a lot of rules](http://eslint.org/docs/rules/).

We created a default set of rules following the Swissquote JavaScript Guideline, but if your project wants stricter rules, you can enable them like that :

```javascript
module.exports = {
  eslint: {
    overrides: {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "arrow-parens": ["error", "always"]
      }
    }
  }
};
```
