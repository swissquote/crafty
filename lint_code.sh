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


echo "${GREEN}Linting babel-preset-swissquote$NC"
cd "$DIR/packages/babel-preset-swissquote"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty$NC"
cd "$DIR/packages/crafty"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-babel$NC"
cd "$DIR/packages/crafty-preset-babel"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js bin/**/*.js lib/**/*.js

echo "${GREEN}Linting crafty-preset-images$NC"
cd "$DIR/packages/crafty-preset-images"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-images-simple$NC"
cd "$DIR/packages/crafty-preset-images-simple"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-jest$NC"
cd "$DIR/packages/crafty-preset-jest"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-maven$NC"
cd "$DIR/packages/crafty-preset-maven"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-postcss$NC"
cd "$DIR/packages/crafty-preset-postcss"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-react$NC"
cd "$DIR/packages/crafty-preset-react"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-typescript$NC"
cd "$DIR/packages/crafty-preset-typescript"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-runner-gulp$NC"
cd "$DIR/packages/crafty-runner-gulp"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-runner-rollup$NC"
cd "$DIR/packages/crafty-runner-rollup"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-runner-webpack$NC"
cd "$DIR/packages/crafty-runner-webpack"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting eslint-plugin-swissquote$NC"
cd "$DIR/packages/eslint-plugin-swissquote"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js src/**/*.js

echo "${GREEN}Linting integration$NC"
cd "$DIR/packages/integration"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting postcss-swissquote-preset$NC"
cd "$DIR/packages/postcss-swissquote-preset"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js src/**/*.js

echo "${GREEN}Linting stylelint-config-swissquote$NC"
cd "$DIR/packages/stylelint-config-swissquote"
node ../crafty-preset-babel/bin/eslint.js --fix --preset recommended --preset node *.js src/**/*.js