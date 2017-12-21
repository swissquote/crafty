#!/usr/bin/env sh

GREEN='\033[0;32m'
NC='\033[0m'

echo "${GREEN}Autoformatting Docs${NC}"
echo "${GREEN}================${NC}"
prettier --write docs/**/*.md docs/**/**/*.md docs/*.md || exit 1

echo
echo "${GREEN}Markdown Linting${NC}"
echo "${GREEN}================${NC}"
node_modules/.bin/markdownlint -c markdownlint.json docs 2>&1 || exit 1

echo
echo "${GREEN}Spell checking${NC}"
echo "${GREEN}==============${NC}"
node_modules/.bin/mdspell --en-us --ignore-numbers -r docs/**/*.md || exit 1

echo
echo "${GREEN}Write Good${NC}"
echo "${GREEN}==========${NC}"
node_modules/.bin/write-good --no-passive --no-illusion docs/**/*.md || exit 1

echo "${GREEN}All good${NC}"
