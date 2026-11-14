#!/usr/bin/env bash
# Translate the game's Pascal (../src, with the web port's own host units in pas/) to TypeScript in src/game.
set -eu
cd "$(dirname "$0")"
mkdir -p ../obj
[ -f ../obj/BUILDID.INC ] || bash ../scripts/buildid.sh
[ -f ../obj/SNDIMAGE.INC ] || python3 -I ../scripts/snd2pas.py --src ../src --out ../obj/SNDIMAGE.INC
node tools/pas2ts/main.ts ../src/fixmain.pas src/game --dir pas --dir ../src --dir ../src/includes --dir ../src/native \
  --inc pas --inc ../src/includes --inc ../obj
