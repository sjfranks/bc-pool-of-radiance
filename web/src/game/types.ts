// Generated from src/types.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_GENDER from './c_gender';
import * as C_SAVE from './c_save';
import * as C_EQUIP from './c_equip';
import * as C_LEVEL from './c_level';
import * as C_STAT from './c_stat';
import * as C_MONEY from './c_money';
import * as C_GBVM from './c_gbvm';
import * as C_SPELL from './c_spell';

export const NAME_LEN = 15;
export const DRAIN_LOG_LEN = 8;
export const PTR_GROWTH = 0;
export const MAX_PARTY = 8;
export const ARENA_SLOTS = 72;
export const ARENA_LAST_X = 49;
export const ARENA_LAST_Y = 24;
export const DOWNED_SLOTS = 8;
export const LAST_DISK = 8;
export const MAP_LAST = 15;
export const SPELL_SLOT_LAST = 20;
export const MEMORIZED_LAST = 47;
export const RACE_CLASSES_LAST = 13;
export const CASTER_LEVEL_LAST = 5;
export const RECORD_SPELL_LEVELS = 3;
export const KNOWN_RECORD_LAST = 56;
export const KNOWN_EXT_BYTES = 6;
export const BASE_ITEM_LAST = 127;
export const BASE_ITEM_OVERFLOW = 128;
export const GB_STRING_LAST = 20;
export const AC_DEX = 0;
export const AC_SHIELD = 1;
export const AC_PLUSES = 2;
export const AC_RING = 3;
export const AC_ARMOR = 4;
export const ICON_LARGE = 128;
export const PIC_KEY = 255;
export const AimBlast = 0;
export const AimBolt = 1;
export const AimCloud = 2;

export function OnMap(x: number, y: number) {
  let $r0: boolean = false;
  $r0 = (((x >= 0) && (x <= 15)) && (y >= 0)) && (y <= 15);
  return $r0;
}
