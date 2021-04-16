#!/usr/bin/env sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GREEN='\033[0;32m'
NC='\033[0m'

echo "${GREEN}Linting babel-preset-swissquote$NC"
cd "$DIR/packages/babel-preset-swissquote"
yarn lint --fix

echo "${GREEN}Linting crafty$NC"
cd "$DIR/packages/crafty"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-babel$NC"
cd "$DIR/packages/crafty-preset-babel"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-eslint$NC"
cd "$DIR/packages/crafty-preset-eslint"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-images$NC"
cd "$DIR/packages/crafty-preset-images"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-images-simple$NC"
cd "$DIR/packages/crafty-preset-images-simple"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-jest$NC"
cd "$DIR/packages/crafty-preset-jest"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-maven$NC"
cd "$DIR/packages/crafty-preset-maven"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-postcss$NC"
cd "$DIR/packages/crafty-preset-postcss"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-prettier$NC"
cd "$DIR/packages/crafty-preset-prettier"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-swc$NC"
cd "$DIR/packages/crafty-preset-swc"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-react$NC"
cd "$DIR/packages/crafty-preset-react"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-terser$NC"
cd "$DIR/packages/crafty-preset-terser"
yarn lint --fix

echo "${GREEN}Linting crafty-preset-typescript$NC"
cd "$DIR/packages/crafty-preset-typescript"
yarn lint --fix

echo "${GREEN}Linting crafty-runner-gulp$NC"
cd "$DIR/packages/crafty-runner-gulp"
yarn lint --fix

echo "${GREEN}Linting crafty-runner-rollup$NC"
cd "$DIR/packages/crafty-runner-rollup"
yarn lint --fix

echo "${GREEN}Linting crafty-runner-webpack$NC"
cd "$DIR/packages/crafty-runner-webpack"
yarn lint --fix

echo "${GREEN}Linting eslint-plugin-swissquote$NC"
cd "$DIR/packages/eslint-plugin-swissquote"
yarn lint --fix

echo "${GREEN}Linting integration$NC"
cd "$DIR/packages/integration"
yarn lint --fix

echo "${GREEN}Linting postcss-swissquote-preset$NC"
cd "$DIR/packages/postcss-swissquote-preset"
yarn lint --fix

echo "${GREEN}Linting rollup-plugin-eslint$NC"
cd "$DIR/packages/rollup-plugin-eslint"
yarn lint --fix

echo "${GREEN}Linting stylelint-config-swissquote$NC"
cd "$DIR/packages/stylelint-config-swissquote"
yarn lint --fix
