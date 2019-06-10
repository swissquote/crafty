#!/usr/bin/env sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GREEN='\033[0;32m'
NC='\033[0m'

echo "${GREEN}Linting babel-preset-swissquote$NC"
cd "$DIR/packages/babel-preset-swissquote"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty$NC"
cd "$DIR/packages/crafty"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-babel$NC"
cd "$DIR/packages/crafty-preset-babel"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-eslint$NC"
cd "$DIR/packages/crafty-preset-eslint"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-images$NC"
cd "$DIR/packages/crafty-preset-images"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-images-simple$NC"
cd "$DIR/packages/crafty-preset-images-simple"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-jest$NC"
cd "$DIR/packages/crafty-preset-jest"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-maven$NC"
cd "$DIR/packages/crafty-preset-maven"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-postcss$NC"
cd "$DIR/packages/crafty-preset-postcss"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-prettier$NC"
cd "$DIR/packages/crafty-preset-prettier"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-preset-react$NC"
cd "$DIR/packages/crafty-preset-react"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js

echo "${GREEN}Linting crafty-preset-typescript$NC"
cd "$DIR/packages/crafty-preset-typescript"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-runner-gulp$NC"
cd "$DIR/packages/crafty-runner-gulp"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-runner-rollup$NC"
cd "$DIR/packages/crafty-runner-rollup"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting crafty-runner-webpack$NC"
cd "$DIR/packages/crafty-runner-webpack"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node src/**/*.js

echo "${GREEN}Linting eslint-plugin-swissquote$NC"
cd "$DIR/packages/eslint-plugin-swissquote"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js src/**/*.js

echo "${GREEN}Linting integration$NC"
cd "$DIR/packages/integration"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js __tests__/*.js __mocks__/*.js

echo "${GREEN}Linting postcss-swissquote-preset$NC"
cd "$DIR/packages/postcss-swissquote-preset"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js src/**/*.js

echo "${GREEN}Linting stylelint-config-swissquote$NC"
cd "$DIR/packages/stylelint-config-swissquote"
yarn node ../crafty-preset-eslint/src/commands/jsLint.js --fix --preset recommended --preset node *.js src/**/*.js
