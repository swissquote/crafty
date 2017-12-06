#!/usr/bin/env sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GREEN='\033[0;32m'
NC='\033[0m'

for PACKAGE in packages/*/
do
    echo "$GREEN-- $PACKAGE$NC"
    cd "$DIR/$PACKAGE"

    "$@"
done
