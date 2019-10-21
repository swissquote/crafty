For linting we use **Stylelint**; a CSS linter that works on top of PostCSS and supports plugins.

[TOC]

## Two available presets: Legacy and Recommended

Our linting rules come in two flavors, Legacy and Recommended.

- Legacy will check the formatting and common practices.
- Recommended is the full Swissquote CSS Guideline compliance set including the BEM naming conventions.

By default, we check in **Recommended** mode, you can change this parameter with the [`legacy_css` option in your `crafty.config.js`](03_User_Guides/crafty.config.js_Available_Options.md)

## Linting in development

Linting is important but while writing code, formatting is not the most important thing and failing the build for something as insignificant as a space is more annoying than helpful. That's why in Crafty, formatting rules are in warning mode during development (with `crafty watch`) so that you can focus on programming and not on formatting.

## Turning off linting for some parts of your code

For obvious reasons, you shouldn't disable linting on your files, but sometimes, it's necessary.

Some browser specific hacks or other tweaks may come as false positives in the linter or you want to ignore a folder containing external libraries.

### Disable linting for a line

The best is to use this way to silence stylelint, to disable the parts you know to be correct.

```css
/* stylelint-disable-next-line */
#id {
  color: pink !important; /* stylelint-disable-line declaration-no-important */
}
```

As you can see, adding the `/* stylelint-disable-next-line */` will ignore all errors on the following line.

The next line gives a more interesting example : `/* stylelint-disable-next-line declaration-no-important */` we disable the linting for a specific rule.

This is the recommended way as you won't risk silencing errors that would have been useful to you, you can even specify more than one rule, separated by a comma.

You can also use the alternative `/* stylelint-disable-line */` comment to disable the current line.

### Disable linting for a section

You can also disable linting for one or more blocks

```css
/* stylelint-disable selector-no-id, declaration-no-important  */
#id {
  color: pink !important;
}
/* stylelint-enable */
```

### Disable linting for one or more files

When running, **Stylelint** will look for a `.stylelintignore` file in it's working directory and apply all the patterns to ignore some files.

The patterns in your `.stylelintignore` file must match the [`.gitignore` syntax](https://git-scm.com/docs/gitignore).

For example:

```
vendor/**.css
```

> The `.stylelintignore` file's location changes wether you want to disable linting from **Crafty** or the Mercurial hooks.
>
> For the hooks, the file must be at the root of your repository (next to your `.hgignore`/`.gitignore`).
>
> For **Crafty**, the file must be in the Gulp working directory (generally `src/main/frontend`).

## Customizing the rules

The library we use for CSS linting (Stylelint) [contains a lot of rules](http://stylelint.io/user-guide/rules/).

We created a default set of rules following the Swissquote CSS Guideline, but if your project wants stricter rules, you can follow the example here.

Be aware that these rules will not be applied to the mercurial hooks.

```javascript
module.exports = {
  stylelint: {
    rules: {
      "selector-no-type": true
    }
  },
  stylelint_legacy: {
    rules: {
      "max-nesting-depth": [
        2,
        { ignore: ["at-rules-without-declaration-blocks"] }
      ]
    }
  }
};
```
