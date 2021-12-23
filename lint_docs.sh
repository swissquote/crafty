#!/usr/bin/env bash

GREEN='\033[0;32m'
NC='\033[0m'

set -e

echo -e "${GREEN}Autoformatting Docs${NC}"
echo -e "${GREEN}===================${NC}"
yarn prettier --write docs/*.md docs/**/*.md docs/**/**/*.md *.md

echo
echo -e "${GREEN}Write Good${NC}"
echo -e "${GREEN}==========${NC}"
yarn write-good --no-passive --no-illusion docs/*.md docs/**/*.md docs/**/**/*.md *.md

echo -e "${GREEN}All good${NC}"
