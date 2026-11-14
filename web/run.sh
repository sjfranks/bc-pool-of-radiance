#!/usr/bin/env bash
# Regenerate and run the headless harness: ./run.sh <steps...>; screenshots go to $SHOTS (default ./shots).
cd "$(dirname "$0")"
./gen.sh > /dev/null && node tools/headless.mjs --out "${SHOTS:-shots}" "$@"
