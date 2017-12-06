#!/usr/bin/env bash

test -d node_modules || mkdir node_modules
test -d node_modules/@swissquote || mkdir node_modules/@swissquote
test -e node_modules/@swissquote/crafty || ln -s ../../../packages/crafty node_modules/@swissquote/crafty
test -e node_modules/@swissquote/crafty-runner-webpack || ln -s ../../../packages/crafty-runner-webpack node_modules/@swissquote/crafty-runner-webpack
test -e node_modules/@swissquote/crafty-runner-gulp || ln -s ../../../packages/crafty-runner-gulp node_modules/@swissquote/crafty-runner-gulp
test -e node_modules/@swissquote/crafty-preset-babel || ln -s ../../../packages/crafty-preset-babel node_modules/@swissquote/crafty-preset-babel
test -e node_modules/@swissquote/crafty-preset-typescript || ln -s ../../../packages/crafty-preset-typescript node_modules/@swissquote/crafty-preset-typescript
test -e node_modules/@swissquote/crafty-preset-postcss || ln -s ../../../packages/crafty-preset-postcss node_modules/@swissquote/crafty-preset-postcss
test -e node_modules/@swissquote/crafty-preset-react || ln -s ../../../packages/crafty-preset-react node_modules/@swissquote/crafty-preset-react
test -e node_modules/@swissquote/crafty-preset-jest || ln -s ../../../packages/crafty-preset-jest node_modules/@swissquote/crafty-preset-jest
test -e node_modules/@swissquote/crafty-runner-rollup || ln -s ../../../packages/crafty-runner-rollup node_modules/@swissquote/crafty-runner-rollup


#test -d node_modules/@swissquote || mkdir node_modules/@swissquote
#test -e node_modules/@swissquote/crafty-runner-rollup || ln -s ../../../packages/crafty-runner-rollup node_modules/@swissquote/crafty-runner-rollup

test -d node_modules/.bin || mkdir node_modules/.bin
test -e node_modules/.bin/crafty || ln -s ../../../packages/crafty/src/bin.js node_modules/.bin/crafty
