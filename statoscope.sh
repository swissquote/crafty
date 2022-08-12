#!/usr/bin/env bash

GREEN='\033[0;32m'
NC='\033[0m'

set -e

echo -e "${GREEN}Injecting Report${NC}"
echo -e "${GREEN}================${NC}"

SOME_STAT=packages/crafty-commons-gulp/dist/common-packages/common-packages-stats.json
SOME_STAT_OUT=packages/crafty-commons-gulp/dist/common-packages/common-packages-new-stats.json
if [ -f "$SOME_STAT" ]; then
    yarn run statoscope inject-report --input "$SOME_STAT" --report statoscope_report.json > "$SOME_STAT_OUT"
    rm -f "$SOME_STAT"
fi

echo -e "${GREEN}Generate Report${NC}"
echo -e "${GREEN}===============${NC}"

yarn run statoscope generate --input packages/*/dist/*/*-stats.json -t statoscope.html
