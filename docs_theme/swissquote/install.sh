#!/usr/bin/env bash

test -d node_modules || mkdir node_modules
test -d node_modules/@swissquote || mkdir node_modules/@swissquote
test -e node_modules/@swissquote/crafty || ln -s ../../../../packages/crafty node_modules/@swissquote/crafty
test -e node_modules/@swissquote/crafty-runner-gulp || ln -s ../../../../packages/crafty-runner-gulp node_modules/@swissquote/crafty-runner-gulp
test -e node_modules/@swissquote/crafty-preset-postcss || ln -s ../../../../packages/crafty-preset-postcss node_modules/@swissquote/crafty-preset-postcss

test -d node_modules/.bin || mkdir node_modules/.bin
test -e node_modules/.bin/crafty || ln -s ../../../../packages/crafty/src/bin.js node_modules/.bin/crafty
