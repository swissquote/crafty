[TOC]

### What is this?
In this guide we provide some simple examples for the usage of autofixing functionality.
Crafty comes with some default linter configuration including among other 

- ESLint (JavaScript)
- PostCSS (CSS)
- Prettier (JavaScript + CSS)


### When should you use it?

Occasionaly you will see in your building logs several linting errors ( eg. eslint mentioning XXX rule is violated).

Some of them need to be fixed manually but not all.
Before diving into fixing 100 lines of code try these commands they come in handy.

## Option 1 : Crafty jsLint, CssLint options

This command will lint all you files inside src folder.

`crafty jsLint src/** --fix --preset recommended `

This command will lint all your files for CSS rules inside src folder.


`crafty cssLint src/** --fix --preset recommended `


- More info for crafty ESLint options here: [crafty-preset-eslint](../05_Packages/05_crafty-preset-eslint/index.md)
- More info for crafty PostCSS options here: [crafty-preset-postcss](../05_Packages/05_crafty-preset-postcss/index.md)


## Option 2 : Prettier is used internally with crafty

Before running `yarn prettier` you should run 
	
	yarn crafty ide

More information [IDE-Integration](../IDE_Integration.md) 
This command will generate prettier configuration for your project.
Prettier is used internally with crafty and some times regex paths in eslint have issues: 
so some equivalent commands for ts, tsx, js files linting are: 

- `npx prettier --write "**/*.ts"`

- `npx prettier --write "**/*.tsx"`

- `npx prettier --write "**/*.js"`

Note the `--write ` option is used to save the modifications but it is optional.
Feel free to commit it in case you want just to preview.

 - Example for linting TypeScript files:
 	- `npx prettier --write "**/*.ts"`
￼
More options here: https://prettier.io/docs/en/cli.html
