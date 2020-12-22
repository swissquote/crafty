#!/usr/bin/env sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GREEN='\033[0;32m'
NC='\033[0m'

set -e

echo "${GREEN}Testing crafty-runner-webpack$NC"
cd "$DIR/packages/crafty-runner-webpack"
yarn test:ci

echo "${GREEN}Testing eslint-plugin-swissquote$NC"
cd "$DIR/packages/eslint-plugin-swissquote"
yarn test:ci

echo "${GREEN}Testing rollup-plugin-eslint$NC"
cd "$DIR/packages/rollup-plugin-eslint"
yarn test:ci

echo "${GREEN}Testing stylelint-config-swissquote$NC"
cd "$DIR/packages/stylelint-config-swissquote"
yarn test:ci

echo "${GREEN}Testing crafty$NC"
cd "$DIR/packages/crafty"
yarn test:ci

echo "${GREEN}Testing integration$NC"
cd "$DIR/packages/integration"
yarn test:ci
