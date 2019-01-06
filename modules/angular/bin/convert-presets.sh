#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )";
WORKING_DIR=$DIR/../libs/presets/src/lib

for file in $WORKING_DIR/*.yml; do
    name=$(basename "$file" .yml);
    node -e "const fs = require('fs'); const yml = require('js-yaml'); console.log(JSON.stringify(yml.safeLoad(fs.readFileSync('$file', 'utf-8')), null, 2));" > "$WORKING_DIR/$name.json"
done;
