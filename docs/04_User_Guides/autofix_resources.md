[TOC]

## Description, how to apply autoformatting frontend resources
### What is this?
In this guide we provide some simple examples for the usage of autofixing functionality.
Crafty comes with some default linter configuration including among other 

- eslint (js)
- post-css (css)
- prettier (js + css)


### When should you use it?

Occasionaly you will see in your building logs several linting errors ( eg. eslint mentioning XXX rule is violated).

Some of them need to be fixed manually but not all.
Before diving into fixing 100 lines of code try these commands they come in handy.

## Option 1 : Crafty jsLint, CssLint options

`crafty jsLint src/** --fix --preset recommended `

will lint all your files and list the errors


`crafty cssLint src/** --fix --preset recommended `

more info for crafty eslint options here:  https://swissquote.github.io/crafty/Packages/crafty-preset-eslint/index.html


## Option 2 : Prettier is used internally with crafty

Before running `yarn prettier` you should run 
	
	yarn crafty ide

This command will generate prettier configuration for your project.
Prettier is used internally with crafty and some times regex paths in eslint have issues: 
so some equivalent commands for ts, tsx, js files linting are: 

- `npx prettier --write "**/*.ts"`

- `npx prettier --write "**/*.tsx"`

- `npx prettier --write "**/*.js"`

Note the `--write ` option is used to save the modifications but it is optional.
Feel free to commit it in case you want just to preview.

 - Example for linting typescript files:
	- `yarn prettier --write "**/*.ts"`
 	- or `npx prettier --write "**/*.ts"`
￼
More options here: https://prettier.io/docs/en/cli.html
