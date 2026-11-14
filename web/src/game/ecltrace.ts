// Generated from src/ecltrace.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_ECL from './c_ecl';


export function OpName(op: number) {
  let $r0: string = "";
  switch (op) {
    case 0: {
      $r0 = "EXIT";
      break;
    }
    case 1: {
      $r0 = "GOTO";
      break;
    }
    case 2: {
      $r0 = "GOSUB";
      break;
    }
    case 3: {
      $r0 = "COMPARE";
      break;
    }
    case 4: {
      $r0 = "ADD";
      break;
    }
    case 5: {
      $r0 = "SUBTRAT";
      break;
    }
    case 6: {
      $r0 = "DIVIDE";
      break;
    }
    case 7: {
      $r0 = "MULTIPLY";
      break;
    }
    case 8: {
      $r0 = "RANDOM";
      break;
    }
    case 9: {
      $r0 = "SAVE";
      break;
    }
    case 10: {
      $r0 = "LOAD CHARACTER";
      break;
    }
    case 11: {
      $r0 = "LOAD MONSTER";
      break;
    }
    case 12: {
      $r0 = "SETUP MONSTER";
      break;
    }
    case 13: {
      $r0 = "APPROACH";
      break;
    }
    case 14: {
      $r0 = "PICTURE";
      break;
    }
    case 15: {
      $r0 = "INPUT NUMBER";
      break;
    }
    case 16: {
      $r0 = "INPUT STRING";
      break;
    }
    case 17: {
      $r0 = "PRINT";
      break;
    }
    case 18: {
      $r0 = "PRINTCLEAR";
      break;
    }
    case 19: {
      $r0 = "RETURN";
      break;
    }
    case 20: {
      $r0 = "COMPARE AND";
      break;
    }
    case 21: {
      $r0 = "VERTICAL MENU";
      break;
    }
    case 22: {
      $r0 = "IF = ";
      break;
    }
    case 23: {
      $r0 = "IF <>";
      break;
    }
    case 24: {
      $r0 = "IF <";
      break;
    }
    case 25: {
      $r0 = "IF >";
      break;
    }
    case 26: {
      $r0 = "IF <=";
      break;
    }
    case 27: {
      $r0 = "IF >=";
      break;
    }
    case 28: {
      $r0 = "CLEARMONSTERS";
      break;
    }
    case 29: {
      $r0 = "PARTYSTRENGTH";
      break;
    }
    case 30: {
      $r0 = "CHECKPARTY";
      break;
    }
    case 32: {
      $r0 = "NEWECL";
      break;
    }
    case 33: {
      $r0 = "LOAD FILES";
      break;
    }
    case 55: {
      $r0 = "LOAD PIECES";
      break;
    }
    case 34: {
      $r0 = "PARTY SURPRISE";
      break;
    }
    case 35: {
      $r0 = "SURPRISE";
      break;
    }
    case 36: {
      $r0 = "COMBAT";
      break;
    }
    case 37: {
      $r0 = "ON GOTO";
      break;
    }
    case 38: {
      $r0 = "ON GOSUB";
      break;
    }
    case 39: {
      $r0 = "TREASURE";
      break;
    }
    case 40: {
      $r0 = "ROB";
      break;
    }
    case 41: {
      $r0 = "ENCOUNTER MENU";
      break;
    }
    case 42: {
      $r0 = "GETTABLE";
      break;
    }
    case 43: {
      $r0 = "HORIZONTAL MENU";
      break;
    }
    case 44: {
      $r0 = "PARLAY";
      break;
    }
    case 45: {
      $r0 = "CALL";
      break;
    }
    case 46: {
      $r0 = "DAMAGE";
      break;
    }
    case 47: {
      $r0 = "AND";
      break;
    }
    case 48: {
      $r0 = "OR";
      break;
    }
    case 49: {
      $r0 = "SPRITE OFF";
      break;
    }
    case 50: {
      $r0 = "FIND ITEM";
      break;
    }
    case 51: {
      $r0 = "PRINT RETURN";
      break;
    }
    case 52: {
      $r0 = "ECL CLOCK";
      break;
    }
    case 53: {
      $r0 = "SAVE TABLE";
      break;
    }
    case 54: {
      $r0 = "ADD NPC";
      break;
    }
    case 56: {
      $r0 = "PROGRAM";
      break;
    }
    case 57: {
      $r0 = "WHO";
      break;
    }
    case 58: {
      $r0 = "DELAY";
      break;
    }
    case 59: {
      $r0 = "SPELL";
      break;
    }
    case 60: {
      $r0 = "PROTECTION";
      break;
    }
    case 61: {
      $r0 = "CLEAR BOX";
      break;
    }
    case 128: {
      $r0 = "USE UP ITEM";
      break;
    }
    default: {
      $r0 = "?";
    }
  }
  return $r0;
}
