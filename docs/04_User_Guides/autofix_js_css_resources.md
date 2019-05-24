
# How to apply autoformatting frontend resources



## Option 1 : Crafty jsLint, CssLint options
`crafty jsLint --fix --preset recommend `



will lint all your css  files and automatically fix the errors


`crafty cssLint --fix --preset recommend `



more info for crafty eslint options here:  https://swissquote.github.io/crafty/Packages/crafty-preset-eslint/index.html


## Option 2 :  integrate crafty linter in idea 

This option permits you to format using your IDE's built-int mechanism 
more info here : https://swissquote.github.io/crafty/Packages/crafty-preset-eslint/ESLint_IDE_Integration.html

`yarn crafty ide`

## Option 3 :  Prettier is used internally with crafty 

Prettier is used internally with crafty and some times regex paths in eslint have issues: 

so some equivalent commands for javascript linting is: 

Note the `--write ` option is used to save the modifications 
feel free to ommit it in case you want just to preview.

- For typescript
	- `yarn prettier --write "**/*.ts"`
 	- or `node_modules/.bin/prettier --write "**/*.ts"`

- For typescript + JSX files 
	- `yarn prettier --write "**/*.tsx"`
	- or `node_modules/.bin/prettier --write "**/*.tsx"`

- For typescript + JS

 	- `yarn prettier --write "**/*.js"`
	- or `node_modules/.bin/prettier --write "**/*.js"`

- For all the above

	- `yarn prettier --write "**/*.js"`

	- or `node_modules/.bin/prettier --write "**/*.js"`

More options here: https://prettier.io/docs/en/cli.html


