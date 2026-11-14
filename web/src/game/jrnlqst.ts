// Generated from src/jrnlqst.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_GBVM from './c_gbvm';
import * as C_JRNL from './c_jrnl';
import * as GameVars from './gamevars';
import * as JrnlList from './jrnllist';

export const NEVER = 255;

export function QuestLabel(n: number) {
  let item: number = 0, $r0: string = "";
  item = QuestItem(n) << 16 >> 16;
  if (item !== 0) {
    $r0 = JrnlList.EntryLabel(item) + ": " + Task(n);
  } else {
    $r0 = Task(n);
  }
  return $r0;
}

export function QuestItem(n: number) {
  let $r0: number = 0;
  if (Proclamation(n) === 0) {
    $r0 = 0;
  } else {
    $r0 = JrnlList.ProclamationItem(Proclamation(n)) << 16 >> 16;
  }
  return $r0;
}

export function IsDone(n: number) {
  let address: number = 0, $r0: boolean = false;
  switch (n) {
    case 1: {
      $r0 = Done(19131);
      break;
    }
    case 2: {
      $r0 = Done(19110);
      break;
    }
    case 3: {
      $r0 = Done(19175);
      break;
    }
    case 4: {
      $r0 = Done(19174);
      break;
    }
    case 5: {
      $r0 = (Cell(18993) & 96) === 96;
      break;
    }
    case 6: {
      $r0 = Done(19112);
      break;
    }
    case 7: {
      $r0 = Done(19111);
      break;
    }
    case 8: {
      $r0 = Done(19113) && (Cell(19083) !== 128);
      break;
    }
    case 9: {
      $r0 = true;
      for (let $i1 = 19114; $i1 <= 19118; $i1++) {
        address = $i1;
        if (!Done(address)) {
          $r0 = false;
        }
      }
      break;
    }
    case 10: {
      $r0 = Done(19123);
      break;
    }
    case 11: {
      $r0 = Done(19122);
      break;
    }
    case 12: {
      $r0 = Done(19121);
      break;
    }
    case 13: {
      $r0 = Done(19125);
      break;
    }
    case 14: {
      $r0 = Done(19126);
      break;
    }
    case 15: {
      $r0 = Done(19127);
      break;
    }
    case 16: {
      $r0 = Done(19120);
      break;
    }
    case 17: {
      $r0 = Done(19133);
      break;
    }
    case 18: {
      $r0 = Done(19124);
      break;
    }
    case 19: {
      $r0 = Done(19135);
      break;
    }
    case 20: {
      $r0 = Done(19129);
      break;
    }
    case 21: {
      $r0 = Done(19130);
      break;
    }
    default: {
      $r0 = false;
    }
  }
  return $r0;
}

export function IsGiven(n: number) {
  let $r0: boolean = false;
  if ((n < 1) || (n > 21)) {
    $r0 = false;
  } else {
    $r0 = (IsPosted(Proclamation(n)) || Recorded(n)) || IsDone(n);
  }
  return $r0;
}

export function IsPosted(number: number) {
  let rewards: number = 0, $r0: boolean = false;
  switch (number) {
    case 59: case 64: case 78: case 109: {
      rewards = 0;
      break;
    }
    case 101: {
      rewards = 1;
      break;
    }
    case 110: case 126: {
      rewards = 2;
      break;
    }
    case 134: {
      rewards = 3;
      break;
    }
    case 154: {
      rewards = 4;
      break;
    }
    case 114: {
      rewards = 5;
      break;
    }
    case 204: {
      rewards = 6;
      break;
    }
    case 129: {
      rewards = 7;
      break;
    }
    case 201: {
      rewards = 8;
      break;
    }
    case 214: {
      rewards = 9;
      break;
    }
    default: {
      rewards = 255;
    }
  }
  $r0 = (rewards !== 255) && (Cell(19137) >= rewards);
  return $r0;
}

export function Cell(address: number) {
  let $r0: number = 0;
  $r0 = r16(r32(227033) + address * 2 - 37376);
  return $r0;
}

export function Done(address: number) {
  let $r0: boolean = false;
  $r0 = Cell(address) >= 254;
  return $r0;
}

export function Proclamation(n: number) {
  let $r0: number = 0;
  switch (n) {
    case 1: case 2: case 3: case 4: case 5: case 6: {
      $r0 = 59;
      break;
    }
    case 7: {
      $r0 = 101;
      break;
    }
    case 8: {
      $r0 = 114;
      break;
    }
    case 9: {
      $r0 = 126;
      break;
    }
    case 10: {
      $r0 = 129;
      break;
    }
    case 11: {
      $r0 = 134;
      break;
    }
    case 12: {
      $r0 = 154;
      break;
    }
    case 13: {
      $r0 = 201;
      break;
    }
    case 14: {
      $r0 = 204;
      break;
    }
    case 15: {
      $r0 = 214;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function Task(n: number) {
  let $r0: string = "";
  switch (n) {
    case 1: {
      $r0 = "CLEAR THE SLUMS";
      break;
    }
    case 2: {
      $r0 = "CLEAR KUTO'S WELL";
      break;
    }
    case 3: {
      $r0 = "CLEAR PODOL PLAZA";
      break;
    }
    case 4: {
      $r0 = "CLEAR THE TEXTILE HOUSE";
      break;
    }
    case 5: {
      $r0 = "CLEAR MENDOR'S LIBRARY";
      break;
    }
    case 6: {
      $r0 = "CLEAR THE WEALTHY AREA";
      break;
    }
    case 7: {
      $r0 = "CLEAR SOKAL KEEP";
      break;
    }
    case 8: {
      $r0 = "RESCUE THE BIVANT HEIR";
      break;
    }
    case 9: {
      $r0 = "RETRIEVE THE FIVE TOMES";
      break;
    }
    case 10: {
      $r0 = "CLEANSE THE RIVER";
      break;
    }
    case 11: {
      $r0 = "CLEAR KOVEL MANSION";
      break;
    }
    case 12: {
      $r0 = "CLEANSE VALHINGEN";
      break;
    }
    case 13: {
      $r0 = "STOP THE LIZARD MEN";
      break;
    }
    case 14: {
      $r0 = "STOP THE KOBOLDS";
      break;
    }
    case 15: {
      $r0 = "STOP THE NOMADS";
      break;
    }
    case 16: {
      $r0 = "CLERK: PODOL PLAZA AUCTION";
      break;
    }
    case 17: {
      $r0 = "BRACCIO: CLEANSE BANE'S TEMPLE";
      break;
    }
    case 18: {
      $r0 = "CADORNA: ZHENTIL KEEP MESSAGE";
      break;
    }
    case 19: {
      $r0 = "COUNCIL: KILL TRAITOR CADORNA";
      break;
    }
    case 20: {
      $r0 = "URSLINGEN: TAKE STOJANOW GATE";
      break;
    }
    case 21: {
      $r0 = "COUNCIL: TAKE VALJEVO CASTLE";
      break;
    }
    default: {
      $r0 = "";
    }
  }
  return $r0;
}

export function Recorded(n: number) {
  let $r0: boolean = false;
  switch (n) {
    case 8: {
      $r0 = Cell(19084) === 255;
      break;
    }
    case 12: {
      $r0 = Cell(19094) === 255;
      break;
    }
    case 16: {
      $r0 = Cell(19120) !== 0;
      break;
    }
    case 17: {
      $r0 = Done(19099);
      break;
    }
    case 18: {
      $r0 = Done(19096);
      break;
    }
    case 19: {
      $r0 = Done(19134);
      break;
    }
    case 20: {
      $r0 = Done(19097);
      break;
    }
    case 21: {
      $r0 = Done(19098);
      break;
    }
    default: {
      $r0 = false;
    }
  }
  return $r0;
}
