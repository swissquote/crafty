

# How to apply autoformatting frontend resources


# Option1 : Crafty jsLint, tsLint, CssLint options
`crafty jsLint --fix --preset recommend `

will lint all your files and list the errors
`npx crafty tsLint <path to files> --preset recommended `

will lint all your files and automatically fix the errors
`npx crafty tsLint <path to files> --preset recommended --fix `



will lint all your css  files and automatically fix the errors


`crafty cssLint --fix --preset recommend `



more info for crafty eslint options here:  https://swissquote.github.io/crafty/Packages/crafty-preset-eslint/index.html


# Option2 :  Prettier is used internally with crafty 

Prettier is used internally with crafty and some times regex paths in eslint have issues: 

so some equivalent commands for javascript linting is: 

- `node_modules/.bin/prettier --write "**/*.ts"`

- `node_modules/.bin/prettie --write "**/*.tsx"`

- `node_modules/.bin/prettie --write "**/*.js"`
