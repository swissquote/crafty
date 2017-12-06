#!/usr/bin/env sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GREEN='\033[0;32m'
NC='\033[0m'

echo "$GREEN-- Auto Formatting$NC"
echo
prettier --write "packages/crafty/src/**/*.js"
prettier --write "packages/crafty-preset-maven/index.js"
prettier --write "packages/crafty-preset-images/index.js"
prettier --write "packages/crafty-preset-images-simple/index.js"
prettier --write "packages/crafty-preset-babel/src/**/*.js" "packages/crafty-preset-babel/lib/**/*.js"
prettier --write "packages/crafty-preset-jest/src/**/*.js"
prettier --write "packages/crafty-preset-polyfills/src/**/*.js"
prettier --write "packages/crafty-preset-postcss/src/**/*.js"
prettier --write "packages/crafty-preset-typescript/src/**/*.js"
prettier --write "packages/crafty-runner-gulp/src/**/*.js"
prettier --write "packages/crafty-runner-webpack/src/**/*.js"
prettier --write "packages/crafty-runner-rollup/src/**/*.js"

prettier --write "packages/babel-preset-swissquote/index.js"
prettier --write "packages/eslint-plugin-swissquote/src/**/*.js" "packages/eslint-plugin-swissquote/*.js"
prettier --write "packages/integration/*.js" "packages/integration/__tests__/**/*.js" "packages/integration/__mocks__/**/*.js"
prettier --write "packages/postcss-swissquote-preset/*.js"
prettier --write "packages/stylelint-config-swissquote/src/**/*.js" "packages/stylelint-config-swissquote/*.js"

echo ""
echo "$GREEN-- ESLint$NC"
echo ""

for PACKAGE in packages/*/
do
    echo "${GREEN}Linting $PACKAGE$NC"
    cd "$DIR/$PACKAGE"

    node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js src/**/*.js bin/**/*.js lib/**/*.js
done
