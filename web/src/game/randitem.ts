// Generated from src/randitem.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as C_ITEM from './c_item';
import * as Dice from './dice';

export const TEMPLATE_LAST = 19;

export const $at = { randomItemTemplates: 248714 };

export function GenerateRandomItem(kind: number, item: number) {
  let r: number = 0, n: number = 0, j: number = 0, template: number = 0, spell: number = 0;
  rt.fill(item, 64, 0);
  template = 0;
  {
    const $w1 = item;
    U8[$w1 + 53] = 6;
    U8[$w1 + 46] = kind;
    const $c2 = U8[$w1 + 46];
    if (($c2 >= 1 && $c2 <= 59) || $c2 === 73 || $c2 === 77 || $c2 === 93) {
      U8[$w1 + 50] = RandomBonus();
      switch (U8[$w1 + 46]) {
        case 21: {
          r = Dice.RollDice(1, 5) & 255;
          if (r === 5) {
            template = 14;
          }
          U8[$w1 + 49] = 21;
          U8[$w1 + 48] = I8[$w1 + 50] + 161;
          break;
        }
        case 28: {
          U8[$w1 + 49] = 28;
          U8[$w1 + 48] = I8[$w1 + 50] + 161;
          break;
        }
        case 50: case 51: {
          U8[$w1 + 49] = U8[$w1 + 46];
          U8[$w1 + 48] = 49;
          U8[$w1 + 47] = I8[$w1 + 50] + 161;
          U8[$w1 + 53] = 4;
          break;
        }
        case 52: {
          U8[$w1 + 49] = U8[$w1 + 46];
          U8[$w1 + 48] = 50;
          U8[$w1 + 47] = I8[$w1 + 50] + 161;
          U8[$w1 + 53] = 4;
          break;
        }
        case 53: case 54: case 55: case 56: case 57: case 58: {
          U8[$w1 + 49] = U8[$w1 + 46];
          U8[$w1 + 48] = 48;
          U8[$w1 + 47] = I8[$w1 + 50] + 161;
          U8[$w1 + 53] = 4;
          break;
        }
        case 73: {
          U8[$w1 + 49] = 61;
          U8[$w1 + 48] = I8[$w1 + 50] + 161;
          break;
        }
        case 77: {
          U8[$w1 + 49] = 79;
          U8[$w1 + 48] = 167;
          U8[$w1 + 50] = (I8[$w1 + 50] * 2) + 2;
          switch (I8[$w1 + 50]) {
            case 4: {
              U8[$w1 + 47] = 221;
              break;
            }
            case 6: {
              U8[$w1 + 47] = 222;
              break;
            }
            case 8: {
              U8[$w1 + 47] = 220;
              break;
            }
          }
          break;
        }
        case 93: {
          U8[$w1 + 49] = 66;
          U8[$w1 + 48] = 224;
          U8[$w1 + 47] = I8[$w1 + 50] + 161;
          break;
        }
        default: {
          U8[$w1 + 49] = U8[$w1 + 46];
          U8[$w1 + 48] = I8[$w1 + 50] + 161;
        }
      }
      U8[$w1 + 51] = 0;
      U8[$w1 + 57] = 0;
      switch (U8[$w1 + 46]) {
        case 1: case 13: case 14: case 35: {
          w16($w1 + 55, 75);
          break;
        }
        case 2: case 20: case 29: case 31: case 32: case 33: case 39: case 42: case 44: case 46: case 59: {
          w16($w1 + 55, 50);
          break;
        }
        case 3: case 24: case 40: {
          w16($w1 + 55, 125);
          break;
        }
        case 4: case 15: case 23: case 34: case 43: case 45: case 51: {
          w16($w1 + 55, 100);
          break;
        }
        case 5: case 12: case 17: case 19: case 50: {
          w16($w1 + 55, 150);
          break;
        }
        case 6: {
          w16($w1 + 55, 15);
          break;
        }
        case 7: {
          w16($w1 + 55, 30);
          break;
        }
        case 8: case 77: {
          w16($w1 + 55, 10);
          break;
        }
        case 9: {
          w16($w1 + 55, 5);
          U8[$w1 + 57] = 5;
          break;
        }
        case 28: {
          w16($w1 + 55, 3);
          U8[$w1 + 57] = 10;
          break;
        }
        case 73: {
          w16($w1 + 55, 4);
          U8[$w1 + 57] = 10;
          break;
        }
        case 10: case 26: case 36: {
          w16($w1 + 55, 60);
          break;
        }
        case 11: case 16: case 25: case 27: case 41: case 47: {
          w16($w1 + 55, 80);
          break;
        }
        case 18: {
          w16($w1 + 55, 175);
          break;
        }
        case 21: {
          w16($w1 + 55, 20);
          break;
        }
        case 22: case 30: {
          w16($w1 + 55, 40);
          break;
        }
        case 37: {
          w16($w1 + 55, 35);
          break;
        }
        case 38: case 53: {
          w16($w1 + 55, 250);
          break;
        }
        case 52: {
          w16($w1 + 55, 200);
          break;
        }
        case 54: case 56: {
          w16($w1 + 55, 400);
          break;
        }
        case 55: {
          w16($w1 + 55, 300);
          break;
        }
        case 57: {
          w16($w1 + 55, 350);
          break;
        }
        case 58: {
          w16($w1 + 55, 450);
          break;
        }
        case 93: {
          w16($w1 + 55, 1);
          break;
        }
        default: {
          w16($w1 + 55, 40);
          U8[$w1 + 57] = 10;
        }
      }
      switch (U8[$w1 + 46]) {
        case 59: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 2500));
          break;
        }
        case 9: case 28: case 73: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 150));
          break;
        }
        case 53: case 54: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 3000));
          break;
        }
        case 55: case 56: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 3500));
          break;
        }
        case 57: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 4000));
          break;
        }
        case 58: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 5000));
          break;
        }
        case 77: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 3000));
          break;
        }
        default: {
          w16($w1 + 58, rt.mul(I8[$w1 + 50] & 65535, 2000));
        }
      }
    } else if ($c2 === 61 || $c2 === 62) {
      n = Dice.RollDice(1, 3) & 255;
      if (U8[$w1 + 46] === 61) {
        U8[$w1 + 49] = 209;
      } else {
        U8[$w1 + 49] = 208;
      }
      U8[$w1 + 48] = n + 209;
      U8[$w1 + 47] = 0;
      U8[$w1 + 50] = 1;
      w16($w1 + 55, 25);
      U8[$w1 + 57] = 0;
      w16($w1 + 58, 0);
      for (let $i3 = 1, $e3 = n; $i3 <= $e3; $i3++) {
        j = $i3;
        r = Dice.RollDice(1, 3) & 255;
        if (U8[$w1 + 46] === 61) {
          switch (r) {
            case 1: {
              spell = (Dice.RollDice(1, 13) + 8) & 255;
              break;
            }
            case 2: {
              spell = (Dice.RollDice(1, 7) + 28) & 255;
              break;
            }
            case 3: {
              spell = (Dice.RollDice(1, 11) + 44) & 255;
              break;
            }
          }
        } else {
          switch (r) {
            case 1: {
              spell = Dice.RollDice(1, 8) & 255;
              break;
            }
            case 2: {
              spell = (Dice.RollDice(1, 7) + 21) & 255;
              break;
            }
            case 3: {
              spell = (Dice.RollDice(1, 9) + 35) & 255;
              break;
            }
          }
        }
        U8[$w1 + j + 59] = spell;
        w16($w1 + 58, (r * 300) + r16($w1 + 58));
      }
    } else if ($c2 === 63) {
      template = 10;
    } else if ($c2 === 67) {
      template = 19;
    } else if ($c2 === 69) {
      r = Dice.RollDice(1, 10) & 255;
      switch (r) {
        case 1: {
          template = 6;
          break;
        }
        case 2: case 3: case 4: case 5: case 6: {
          template = 16;
          break;
        }
        case 7: case 8: case 9: case 10: {
          template = 17;
          break;
        }
      }
    } else if ($c2 === 78) {
      r = Dice.RollDice(1, 3) & 255;
      switch (r) {
        case 1: {
          template = 7;
          break;
        }
        case 2: {
          template = 9;
          break;
        }
        case 3: {
          template = 15;
          break;
        }
      }
    } else if ($c2 === 79) {
      template = 8;
    } else if ($c2 === 84) {
      template = 2;
    } else if ($c2 === 92) {
      template = 13;
    } else if ($c2 === 71) {
      r = Dice.RollDice(1, 10) & 255;
      switch (r) {
        case 1: case 2: case 3: case 4: case 5: {
          template = 3;
          break;
        }
        case 6: case 7: case 8: {
          template = 1;
          break;
        }
        case 9: {
          template = 4;
          break;
        }
        case 10: {
          template = 11;
          break;
        }
      }
    } else if ($c2 === 70) {
      r = Dice.RollDice(1, 10) & 255;
      switch (r) {
        case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
          template = 12;
          break;
        }
        case 8: case 9: case 10: {
          template = 18;
          break;
        }
      }
    }
  }
  if (template !== 0) {
    ApplyTemplate(item, template);
  }
}

export function ApplyTemplate(item: number, template: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 16);
  let j: number = 0;
  mv($f0, template * 16 + 248698, 16);
  {
    const $w1 = item;
    for (let $i2 = 1; $i2 <= 3; $i2++) {
      j = $i2;
      U8[$w1 + j + 46] = r16($f0 + j * 2 - 2) & 255;
    }
    U8[$w1 + 50] = 1;
    U8[$w1 + 51] = 1;
    if (template === 13) {
      U8[$w1 + 50] = 2;
      U8[$w1 + 51] = 2;
    }
    w16($w1 + 55, r16($f0 + 6));
    U8[$w1 + 57] = 0;
    w16($w1 + 58, r16($f0 + 8));
    for (let $i3 = 1; $i3 <= 3; $i3++) {
      j = $i3;
      U8[$w1 + j + 59] = r16($f0 + j * 2 + 8) & 255;
    }
  }
  S.sp = $sp;
}

export function RandomBonus() {
  let r: number = 0, $r0: number = 0;
  r = Dice.RollDice(1, 20) & 255;
  switch (r) {
    case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12:
    case 13: case 14: {
      $r0 = 1;
      break;
    }
    case 15: case 16: case 17: case 18: case 19: {
      $r0 = 2;
      break;
    }
    default: {
      $r0 = 3;
    }
  }
  return $r0;
}
