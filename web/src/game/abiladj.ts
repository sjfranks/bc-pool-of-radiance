// Generated from src/abiladj.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';

export const SCORE_MIN = 3;
export const SCORE_MAX = 25;

export function TranslatedStrength(creature: number) {
  let $r0: number = 0;
  switch (U8[creature + 16]) {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
    case 12: case 13: case 14: case 15: case 16: case 17: {
      $r0 = U8[creature + 16];
      break;
    }
    case 18: {
      const $c1 = U8[creature + 22];
      if ($c1 === 0) {
        $r0 = 18;
      } else if (($c1 >= 1 && $c1 <= 50)) {
        $r0 = 19;
      } else if (($c1 >= 51 && $c1 <= 75)) {
        $r0 = 20;
      } else if (($c1 >= 76 && $c1 <= 90)) {
        $r0 = 21;
      } else if (($c1 >= 91 && $c1 <= 99)) {
        $r0 = 22;
      } else {
        $r0 = 23;
      }
      break;
    }
    case 19: case 20: case 21: case 22: case 23: case 24: case 25: {
      $r0 = (U8[creature + 16] + 5) & 255;
      break;
    }
    default: {
      $r0 = 30;
    }
  }
  return $r0;
}

export function StrToHitAdjust(creature: number) {
  let ts: number = 0, $r0: number = 0;
  $r0 = 0;
  ts = TranslatedStrength(creature) & 255;
  if (U8[creature + 170] !== 0) {
    switch (ts) {
      case 1: case 2: case 3: {
        $r0 = -3;
        break;
      }
      case 4: case 5: {
        $r0 = -2;
        break;
      }
      case 6: case 7: {
        $r0 = -1;
        break;
      }
      case 17: case 18: case 19: {
        $r0 = 1;
        break;
      }
      case 20: case 21: case 22: {
        $r0 = 2;
        break;
      }
      case 23: case 24: case 25: {
        $r0 = 3;
        break;
      }
      case 26: case 27: {
        $r0 = 4;
        break;
      }
      case 28: case 29: case 30: {
        $r0 = (ts - 23) << 24 >> 24;
        break;
      }
    }
  }
  return $r0;
}

export function StrDamageAdjust(creature: number) {
  let ts: number = 0, $r0: number = 0;
  $r0 = 0;
  ts = TranslatedStrength(creature) & 255;
  if (U8[creature + 170] !== 0) {
    switch (ts) {
      case 1: case 2: {
        $r0 = -2;
        break;
      }
      case 3: case 4: case 5: {
        $r0 = -1;
        break;
      }
      case 16: {
        $r0 = 1;
        break;
      }
      case 17: case 18: case 19: {
        $r0 = (ts - 16) << 24 >> 24;
        break;
      }
      case 20: case 21: case 22: case 23: case 24: case 25: case 26: case 27: case 28: case 29: {
        $r0 = (ts - 17) << 24 >> 24;
        break;
      }
      case 30: {
        $r0 = 14;
        break;
      }
    }
  }
  return $r0;
}

export function WeightAllowance(creature: number) {
  let ts: number = 0, $r0: number = 0;
  ts = TranslatedStrength(creature) & 255;
  switch (ts) {
    case 1: case 2: case 3: {
      $r0 = -350;
      break;
    }
    case 4: case 5: {
      $r0 = -250;
      break;
    }
    case 6: case 7: {
      $r0 = -150;
      break;
    }
    case 12: case 13: {
      $r0 = 100;
      break;
    }
    case 14: case 15: {
      $r0 = 200;
      break;
    }
    case 16: {
      $r0 = 350;
      break;
    }
    case 17: case 18: case 19: case 20: case 21: {
      $r0 = (((ts - 17) * 250) + 500) << 16 >> 16;
      break;
    }
    case 22: case 23: case 25: case 26: {
      $r0 = (((ts - 22) * 1000) + 2000) << 16 >> 16;
      break;
    }
    case 24: {
      $r0 = 4500;
      break;
    }
    case 27: {
      $r0 = 7500;
      break;
    }
    case 28: case 29: case 30: {
      $r0 = (((ts - 28) * 3000) + 9000) << 16 >> 16;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function DexMissileAdjust(creature: number) {
  let d: number = 0, $r0: number = 0;
  d = U8[creature + 19];
  switch (d) {
    case 0: case 1: case 2: {
      $r0 = -4;
      break;
    }
    case 3: case 4: case 5: {
      $r0 = (d - 6) << 24 >> 24;
      break;
    }
    case 16: case 17: case 18: {
      $r0 = (d - 15) << 24 >> 24;
      break;
    }
    case 19: case 20: {
      $r0 = 3;
      break;
    }
    case 21: case 22: case 23: {
      $r0 = 4;
      break;
    }
    case 24: case 25: {
      $r0 = 5;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function DexterityArmorAdjustment(creature: number) {
  let d: number = 0, $r0: number = 0;
  d = U8[creature + 19];
  switch (d) {
    case 0: case 1: case 2: case 3: {
      $r0 = -4;
      break;
    }
    case 4: case 5: case 6: {
      $r0 = (d - 7) << 24 >> 24;
      break;
    }
    case 15: case 16: case 17: case 18: {
      $r0 = (d - 14) << 24 >> 24;
      break;
    }
    case 19: case 20: {
      $r0 = 4;
      break;
    }
    case 21: case 22: case 23: {
      $r0 = 5;
      break;
    }
    case 24: case 25: {
      $r0 = 6;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function ConSaveBonus(con: number) {
  let $r0: number = 0;
  $r0 = Math.trunc((con * 2) / 7) & 255;
  return $r0;
}

export function ClampScore(score: number) {
  let $r0: number = 0;
  if (score < 3) {
    $r0 = 3;
  } else if (score > 25) {
    $r0 = 25;
  } else {
    $r0 = score & 255;
  }
  return $r0;
}

export function ConResurrectionSurvival(con: number) {
  let $r0: number = 0;
  if (con <= 3) {
    $r0 = 40;
  } else if (con <= 12) {
    $r0 = (40 + ((con - 3) * 5)) & 255;
  } else if (con < 18) {
    $r0 = (90 + ((con - 13) * 2)) & 255;
  } else {
    $r0 = 100;
  }
  return $r0;
}

export function ConSystemShock(con: number) {
  let $r0: number = 0;
  switch (con) {
    case 0: case 1: case 2: case 3: {
      $r0 = 35;
      break;
    }
    case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12: case 13: {
      $r0 = (35 + ((con - 3) * 5)) & 255;
      break;
    }
    case 14: {
      $r0 = 88;
      break;
    }
    case 15: {
      $r0 = 91;
      break;
    }
    case 16: {
      $r0 = 95;
      break;
    }
    case 17: {
      $r0 = 97;
      break;
    }
    case 18: case 19: case 20: case 21: case 22: case 23: case 24: {
      $r0 = 99;
      break;
    }
    default: {
      $r0 = 100;
    }
  }
  return $r0;
}

export function SurvivesSystemShock(con: number, roll: number) {
  let $r0: boolean = false;
  $r0 = roll <= ConSystemShock(con);
  return $r0;
}

export function ConPoisonSave(con: number) {
  let $r0: number = 0;
  const $c1 = con;
  if ($c1 === 19 || $c1 === 20) {
    $r0 = 1;
  } else if ($c1 === 21 || $c1 === 22) {
    $r0 = 2;
  } else if ($c1 === 23 || $c1 === 24) {
    $r0 = 3;
  } else if (($c1 >= 25 && $c1 <= 255)) {
    $r0 = 4;
  } else {
    $r0 = 0;
  }
  return $r0;
}

export function ConRegenMinutes(con: number) {
  let $r0: number = 0;
  if (con < 20) {
    $r0 = 0;
  } else if (con > 25) {
    $r0 = 10;
  } else {
    $r0 = ((26 - con) * 10) & 65535;
  }
  return $r0;
}

export function IntKnowSpellChance(intel: number) {
  let $r0: number = 0;
  switch (intel) {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: {
      $r0 = 35;
      break;
    }
    case 10: case 11: case 12: {
      $r0 = 45;
      break;
    }
    case 13: case 14: {
      $r0 = 55;
      break;
    }
    case 15: case 16: {
      $r0 = 65;
      break;
    }
    case 17: {
      $r0 = 75;
      break;
    }
    case 18: {
      $r0 = 85;
      break;
    }
    case 19: {
      $r0 = 95;
      break;
    }
    case 20: case 21: case 22: case 23: {
      $r0 = (76 + intel) & 255;
      break;
    }
    default: {
      $r0 = 100;
    }
  }
  return $r0;
}

export function WisSpellFailure(wis: number) {
  let $r0: number = 0;
  switch (wis) {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: {
      $r0 = 20;
      break;
    }
    case 10: case 11: case 12: {
      $r0 = ((13 - wis) * 5) & 255;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function StrengthModifier(baseStr: number, excStr: number) {
  let $r0: number = 0;
  $r0 = (baseStr + 100) & 255;
  if (baseStr === 18) {
    $r0 = (excStr + 1) & 255;
  }
  return $r0;
}

export function StrengthEffectToStrength(effect: number, baseStr: number, excStr: number) {
  U8[excStr] = 0;
  U8[baseStr] = U8[effect + 3] & 127;
  if (U8[baseStr] <= 101) {
    U8[excStr] = U8[baseStr] - 1;
    U8[baseStr] = 18;
  } else {
    U8[baseStr] = U8[baseStr] - 100;
  }
}

export function ChaLoyaltyBase(cha: number) {
  let $r0: number = 0;
  switch (cha) {
    case 0: case 1: case 2: case 3: {
      $r0 = 0;
      break;
    }
    case 4: case 5: case 6: case 7: {
      $r0 = ((cha - 3) * 5) & 255;
      break;
    }
    case 8: case 9: case 10: case 11: case 12: {
      $r0 = 25;
      break;
    }
    case 13: case 14: case 15: {
      $r0 = ((cha - 7) * 5) & 255;
      break;
    }
    case 16: case 17: {
      $r0 = ((cha - 6) * 5) & 255;
      break;
    }
    default: {
      $r0 = 60;
    }
  }
  return $r0;
}
