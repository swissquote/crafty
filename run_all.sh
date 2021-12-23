#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GREEN='\033[0;32m'
NC='\033[0m'

set -e

PACKAGES=$(grep "\"$1\"" package*/*/package.json | awk '{ print $1 }' | sed -e 's/\/package.json://')

for PACKAGE in $PACKAGES; do
    echo -e "${GREEN}Running '$*' in $PACKAGE$NC"
    cd "$DIR/$PACKAGE"
    yarn "$@"
done
