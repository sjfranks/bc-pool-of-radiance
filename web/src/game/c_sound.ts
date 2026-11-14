// Generated from src/includes/c_sound.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';

export const DOWNED = 1;
export const RANGED_START = 2;
export const IMPACT = 3;
export const LIGHTNING = 4;
export const MISS = 5;
export const STEP = 6;
export const ECL_CUE = 7;
export const FIREBALL = 7;
export const RANGED_END = 8;
export const CAST = 3;
export const MODE_TANDY = 0;
export const MODE_SPEAKER = 1;
export const MODE_DISABLED = 2;
export const MODE_ADLIB = 3;
export const MUSIC_TITLE = 21;
export const MUSIC_BATTLE = 22;
export const GROUP_FOOTSTEPS = 1;
export const GROUP_RANGED = 2;
export const GROUP_MELEE = 4;
export const GROUP_DEATH = 8;
export const GROUP_WALL = 16;
export const GROUP_SPELL = 32;
export const GROUPS_ALL = 63;
export const GROUP_TITLE_MUSIC = 1;
export const GROUP_BATTLE_MUSIC = 2;
export const MUSIC_GROUPS_ALL = 3;
export const PIT_HZ = 1193182;
export const TIMER_DIVISOR = 5041;
export const PORT_PIT2 = 66;
export const PORT_GATE = 97;
export const PORT_TANDY = 192;
export const SFX_LAST = 20;
export const SFX_PCM8 = 0;
export const SFX_ADPCM4 = 1;
