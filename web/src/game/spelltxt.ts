// Generated from src/spelltxt.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as C_SPELL from './c_spell';

export const CHUNK_LINES = 6;

export function LineCount(spell: number) {
  let $r0: number = 0;
  switch (spell) {
    case 1: {
      $r0 = 5;
      break;
    }
    case 2: {
      $r0 = 4;
      break;
    }
    case 3: {
      $r0 = 3;
      break;
    }
    case 4: {
      $r0 = 3;
      break;
    }
    case 5: {
      $r0 = 4;
      break;
    }
    case 6: {
      $r0 = 4;
      break;
    }
    case 7: {
      $r0 = 4;
      break;
    }
    case 8: {
      $r0 = 3;
      break;
    }
    case 9: {
      $r0 = 4;
      break;
    }
    case 10: {
      $r0 = 6;
      break;
    }
    case 11: {
      $r0 = 4;
      break;
    }
    case 12: {
      $r0 = 5;
      break;
    }
    case 13: {
      $r0 = 2;
      break;
    }
    case 14: {
      $r0 = 2;
      break;
    }
    case 15: {
      $r0 = 5;
      break;
    }
    case 16: {
      $r0 = 4;
      break;
    }
    case 17: {
      $r0 = 4;
      break;
    }
    case 18: {
      $r0 = 3;
      break;
    }
    case 19: {
      $r0 = 4;
      break;
    }
    case 20: {
      $r0 = 4;
      break;
    }
    case 21: {
      $r0 = 9;
      break;
    }
    case 22: {
      $r0 = 2;
      break;
    }
    case 23: {
      $r0 = 5;
      break;
    }
    case 24: {
      $r0 = 3;
      break;
    }
    case 25: {
      $r0 = 4;
      break;
    }
    case 26: {
      $r0 = 5;
      break;
    }
    case 27: {
      $r0 = 4;
      break;
    }
    case 28: {
      $r0 = 5;
      break;
    }
    case 29: {
      $r0 = 2;
      break;
    }
    case 30: {
      $r0 = 5;
      break;
    }
    case 31: {
      $r0 = 4;
      break;
    }
    case 32: {
      $r0 = 6;
      break;
    }
    case 33: {
      $r0 = 3;
      break;
    }
    case 34: {
      $r0 = 7;
      break;
    }
    case 35: {
      $r0 = 7;
      break;
    }
    case 36: {
      $r0 = 4;
      break;
    }
    case 37: {
      $r0 = 1;
      break;
    }
    case 38: {
      $r0 = 6;
      break;
    }
    case 39: {
      $r0 = 3;
      break;
    }
    case 40: {
      $r0 = 6;
      break;
    }
    case 41: {
      $r0 = 8;
      break;
    }
    case 42: {
      $r0 = 4;
      break;
    }
    case 43: {
      $r0 = 4;
      break;
    }
    case 44: {
      $r0 = 4;
      break;
    }
    case 45: {
      $r0 = 3;
      break;
    }
    case 46: {
      $r0 = 8;
      break;
    }
    case 47: {
      $r0 = 6;
      break;
    }
    case 48: {
      $r0 = 4;
      break;
    }
    case 49: {
      $r0 = 5;
      break;
    }
    case 50: {
      $r0 = 6;
      break;
    }
    case 51: {
      $r0 = 6;
      break;
    }
    case 52: {
      $r0 = 3;
      break;
    }
    case 53: {
      $r0 = 3;
      break;
    }
    case 54: {
      $r0 = 4;
      break;
    }
    case 55: {
      $r0 = 4;
      break;
    }
    case 56: {
      $r0 = 3;
      break;
    }
    case 57: {
      $r0 = 4;
      break;
    }
    case 59: {
      $r0 = 3;
      break;
    }
    case 60: {
      $r0 = 7;
      break;
    }
    case 61: {
      $r0 = 4;
      break;
    }
    case 62: {
      $r0 = 3;
      break;
    }
    case 63: {
      $r0 = 8;
      break;
    }
    case 64: {
      $r0 = 6;
      break;
    }
    case 65: {
      $r0 = 3;
      break;
    }
    case 58: {
      $r0 = 3;
      break;
    }
    case 66: {
      $r0 = 3;
      break;
    }
    case 67: {
      $r0 = 7;
      break;
    }
    case 68: {
      $r0 = 4;
      break;
    }
    case 69: {
      $r0 = 4;
      break;
    }
    case 70: {
      $r0 = 7;
      break;
    }
    case 71: {
      $r0 = 3;
      break;
    }
    case 72: {
      $r0 = 3;
      break;
    }
    case 73: {
      $r0 = 8;
      break;
    }
    case 74: {
      $r0 = 3;
      break;
    }
    case 75: {
      $r0 = 7;
      break;
    }
    case 76: {
      $r0 = 5;
      break;
    }
    case 77: {
      $r0 = 3;
      break;
    }
    case 78: {
      $r0 = 7;
      break;
    }
    case 79: {
      $r0 = 8;
      break;
    }
    case 80: {
      $r0 = 5;
      break;
    }
    case 81: {
      $r0 = 8;
      break;
    }
    case 82: {
      $r0 = 6;
      break;
    }
    case 83: {
      $r0 = 3;
      break;
    }
    case 84: {
      $r0 = 5;
      break;
    }
    case 85: {
      $r0 = 8;
      break;
    }
    case 86: {
      $r0 = 6;
      break;
    }
    case 87: {
      $r0 = 3;
      break;
    }
    case 88: {
      $r0 = 6;
      break;
    }
    case 89: {
      $r0 = 4;
      break;
    }
    case 90: {
      $r0 = 6;
      break;
    }
    case 91: {
      $r0 = 8;
      break;
    }
    case 92: {
      $r0 = 5;
      break;
    }
    case 93: {
      $r0 = 5;
      break;
    }
    case 94: {
      $r0 = 6;
      break;
    }
    case 100: {
      $r0 = 5;
      break;
    }
    case 127: {
      $r0 = 5;
      break;
    }
    case 128: {
      $r0 = 7;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function TextChunk(spell: number, chunk: number) {
  let $r0: string = "";
  $r0 = "";
  switch (spell) {
    case 1: {
      if (chunk === 0) {
        $r0 = "ALLIES IN THE AREA NOT YET ENGAGED\x0dIN MELEE GAIN +1 TO ATTACK ROLLS AND\x0dMORALE; FOES ARE UNAFFECTED. WHEN\x0dCAST IN CAMP, THE BLESSING EXTENDS\x0dTO THE ENTIRE PARTY.";
      }
      break;
    }
    case 2: {
      if (chunk === 0) {
        $r0 = "FOES IN THE AREA SUFFER -1 TO\x0dATTACK ROLLS AND MORALE, WHETHER\x0dENGAGED IN MELEE OR NOT. ALLIES\x0dARE UNAFFECTED.";
      }
      break;
    }
    case 3: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT REGAINS 1D8 HIT\x0dPOINTS. WOUNDS CAUSED BY MUMMY ROT\x0dCANNOT BE SO CURED.";
      }
      break;
    }
    case 4: {
      if (chunk === 0) {
        $r0 = "BY LAYING A HAND UPON AN OPPONENT,\x0dTHE CASTER INFLICTS 1D8 DAMAGE; A\x0dSUCCESSFUL ATTACK ROLL IS REQUIRED.";
      }
      break;
    }
    case 5: {
      if (chunk === 0) {
        $r0 = "FOR THE SPELL'S DURATION, ITEMS\x0dWITH A MAGICAL BONUS OR CURSE ARE\x0dMARKED WITH A * IN THE PARTY'S\x0dITEM LISTS.";
      }
      break;
    }
    case 6: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT GAINS +2 ON SAVING\x0dTHROWS; EVIL OPPONENTS ATTACK AT -2.\x0dTHESE BONUSES ARE NOT CUMULATIVE\x0dWITH OTHER PROTECTION SPELLS.";
      }
      break;
    }
    case 7: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT GAINS +2 ON SAVING\x0dTHROWS; GOOD OPPONENTS ATTACK AT -2.\x0dTHESE BONUSES ARE NOT CUMULATIVE\x0dWITH OTHER PROTECTION SPELLS.";
      }
      break;
    }
    case 8: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT SUFFERS HALF DAMAGE\x0dFROM COLD AND GAINS +3 ON SAVING\x0dTHROWS AGAINST COLD ATTACKS.";
      }
      break;
    }
    case 9: {
      if (chunk === 0) {
        $r0 = "FLAMES SPRING FROM THE CASTER'S\x0dHANDS, INFLICTING 1 POINT OF DAMAGE\x0dPER CASTER LEVEL UPON ONE ADJACENT\x0dOPPONENT. NO ATTACK ROLL IS NEEDED.";
      }
      break;
    }
    case 10: {
      if (chunk === 0) {
        $r0 = "THIS SPELL AFFECTS ONE HUMAN,\x0dDEMIHUMAN, OR HUMANOID, SUCH AS AN\x0dORC OR GNOLL. IF ITS SAVING THROW\x0dFAILS, THE CREATURE SERVES THE\x0dCASTER UNDER COMPUTER CONTROL UNTIL\x0dTHE ENCHANTMENT IS DISPELLED.";
      }
      break;
    }
    case 11: {
      if (chunk === 0) {
        $r0 = "FOR THE SPELL'S DURATION, ITEMS\x0dWITH A MAGICAL BONUS OR CURSE ARE\x0dMARKED WITH A * IN THE PARTY'S\x0dITEM LISTS.";
      }
      break;
    }
    case 12: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT GAINS 18 STRENGTH AT\x0dCASTER LEVEL 1. THIS RISES TO 18/01,\x0d18/51, 18/76, 18/91, AND 18/00 AT\x0dLEVEL 6 AND ABOVE. REDUCE NEGATES\x0dTHE ENCHANTMENT.";
      }
      break;
    }
    case 13: {
      if (chunk === 0) {
        $r0 = "THIS SPELL NEGATES ENLARGE IF THE\x0dRECIPIENT FAILS A SAVING THROW.";
      }
      break;
    }
    case 14: {
      if (chunk === 0) {
        $r0 = "THE CASTER GAINS 2D4 CHARISMA, TO A\x0dMAXIMUM OF 25, FOR THE DURATION.";
      }
      break;
    }
    case 15: {
      if (chunk === 0) {
        $r0 = "THE CASTER CREATES ONE MISSILE AT\x0dLEVEL 1, AND ONE ADDITIONAL MISSILE\x0dFOR EVERY TWO LEVELS THEREAFTER.\x0dEACH UNERRING MISSILE INFLICTS\x0d1D4+1 DAMAGE. SHIELD NEGATES THEM.";
      }
      break;
    }
    case 16: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT GAINS +2 ON SAVING\x0dTHROWS; EVIL OPPONENTS ATTACK AT -2.\x0dTHESE BONUSES ARE NOT CUMULATIVE\x0dWITH OTHER PROTECTION SPELLS.";
      }
      break;
    }
    case 17: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT GAINS +2 ON SAVING\x0dTHROWS; GOOD OPPONENTS ATTACK AT -2.\x0dTHESE BONUSES ARE NOT CUMULATIVE\x0dWITH OTHER PROTECTION SPELLS.";
      }
      break;
    }
    case 18: {
      if (chunk === 0) {
        $r0 = "FOR THE DURATION, THE CASTER MAY\x0dREAD MAGIC-USER SCROLLS, ALLOWING\x0dTHEIR SPELLS TO BE CAST OR SCRIBED.";
      }
      break;
    }
    case 19: {
      if (chunk === 0) {
        $r0 = "THE CASTER'S ARMOR CLASS BECOMES 3\x0dUNLESS ALREADY BETTER. THE CASTER\x0dALSO GAINS +1 ON SAVING THROWS AND\x0dIS IMMUNE TO MAGIC MISSILES.";
      }
      break;
    }
    case 20: {
      if (chunk === 0) {
        $r0 = "THE CASTER DELIVERS AN ELECTRICAL\x0dCHARGE BY TOUCH. A SUCCESSFUL\x0dATTACK ROLL INFLICTS 1D8 DAMAGE,\x0dPLUS 1 PER CASTER LEVEL.";
      }
      break;
    }
    case 21: {
      switch (chunk) {
        case 0: {
          $r0 = "THIS SPELL SENDS CREATURES INTO A\x0dHELPLESS SLUMBER, BEGINNING WITH A\x0dPOOL OF 4D4 POINTS. A CREATURE COSTS\x0d1 POINT AT LEVEL 1, 2 AT LEVEL 2,\x0d4 AT LEVEL 3, 6 AT LEVEL 4, OR 10\x0dAT LEVEL 5 IF A MONSTER; ANY OTHER";
          break;
        }
        case 1: {
          $r0 = "IS UNAFFECTED, AS ARE THOSE THE POOL\x0dCANNOT PAY FOR, ANIMATED DEAD, AND\x0dSLEEPERS. SOME ARE IMMUNE.";
          break;
        }
      }
      break;
    }
    case 22: {
      if (chunk === 0) {
        $r0 = "FOR THE DURATION, THE CASTER\x0dPERCEIVES ANY CONCEALED TRAPS AHEAD.";
      }
      break;
    }
    case 23: {
      if (chunk === 0) {
        $r0 = "ONE OR MORE PERSONS WHO FAIL THEIR\x0dSAVING THROWS ARE HELD MOTIONLESS\x0dAND HELPLESS. ONE TARGET SAVES AT\x0d-2; TWO TARGETS SAVE AT -1 EACH.\x0dNON-PERSONS ARE UNAFFECTED.";
      }
      break;
    }
    case 24: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT SUFFERS HALF DAMAGE\x0dFROM FIRE AND GAINS +3 ON SAVING\x0dTHROWS AGAINST FIRE ATTACKS.";
      }
      break;
    }
    case 25: {
      if (chunk === 0) {
        $r0 = "UNLESS A SAVING THROW IS MADE, THE\x0dTARGET IS SURROUNDED BY SILENCE.\x0dNO CREATURE WITHIN 1 SQUARE MAY\x0dCAST SPELLS OR EMPLOY ITEMS.";
      }
      break;
    }
    case 26: {
      if (chunk === 0) {
        $r0 = "THE POISONED RECIPIENT REVIVES WITH\x0dAT LEAST 1 HIT POINT, THEN LOSES 1\x0dHIT POINT PER TURN FOR THE DURATION.\x0dIF STILL POISONED WHEN THE SPELL\x0dEXPIRES, THE RECIPIENT DIES.";
      }
      break;
    }
    case 27: {
      if (chunk === 0) {
        $r0 = "THIS SPELL RENDERS GIANT SNAKES\x0dHELPLESS FOR THE REST OF THE BATTLE.\x0dIT AFFECTS AS MANY AS HAVE TOTAL HIT\x0dPOINTS NO GREATER THAN THE CASTER'S.";
      }
      break;
    }
    case 28: {
      if (chunk === 0) {
        $r0 = "THIS SPELL CREATES A +1 MAGICAL\x0dHAMMER AMONG THE CASTER'S ITEMS.\x0dIT CAN STRIKE CREATURES HARMED ONLY\x0dBY MAGICAL WEAPONS, AND VANISHES\x0dWHEN THE SPELL EXPIRES.";
      }
      break;
    }
    case 29: {
      if (chunk === 0) {
        $r0 = "FOR THE DURATION, THE CASTER CAN\x0dSEE AND TARGET INVISIBLE CREATURES.";
      }
      break;
    }
    case 30: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT CANNOT BE TARGETED BY\x0dFOES UNABLE TO SEE INVISIBLE\x0dCREATURES; OTHERS ATTACK AT -4.\x0dTHE SPELL ENDS WHEN THE RECIPIENT\x0dATTACKS OR CASTS A SPELL.";
      }
      break;
    }
    case 31: {
      if (chunk === 0) {
        $r0 = "THIS SPELL OPENS A LOCKED DOOR. IT\x0dCANNOT BE CAST FROM THIS LIST; THE\x0dGAME OFFERS IT UPON ENCOUNTERING\x0dSUCH A DOOR.";
      }
      break;
    }
    case 32: {
      if (chunk === 0) {
        $r0 = "THIS SPELL CREATES 1D4 ILLUSORY\x0dDUPLICATES OF THE CASTER. WHILE N\x0dIMAGES REMAIN, AN ATTACK OR SPELL\x0dAIMED SOLELY AT THE CASTER HAS AN\x0dN-IN-(N+1) CHANCE TO STRIKE ONE.\x0dAN IMAGE SO STRUCK VANISHES.";
      }
      break;
    }
    case 33: {
      if (chunk === 0) {
        $r0 = "UNLESS THE CREATURE SAVES, THIS RAY\x0dREDUCES ITS DAMAGE BY ONE-QUARTER\x0dFOR THE DURATION.";
      }
      break;
    }
    case 34: {
      switch (chunk) {
        case 0: {
          $r0 = "A CLOUD FILLS FOUR SQUARES. A\x0dCREATURE THAT FAILS ITS SAVE IS\x0dHELPLESS WITH COUGHING FOR 2-5\x0dROUNDS. ONE THAT SAVES CANNOT USE\x0dITEMS OR CAST SPELLS, AND IS MORE\x0dEASILY HIT, FOR 1 ROUND. CREATURES";
          break;
        }
        case 1: {
          $r0 = "IMMUNE TO POISON ARE UNAFFECTED.";
          break;
        }
      }
      break;
    }
    case 35: {
      switch (chunk) {
        case 0: {
          $r0 = "A MAGIC-USER GAINS 1D4 STRENGTH; A\x0dCLERIC OR THIEF GAINS 1D6; A\x0dFIGHTER, PALADIN, OR RANGER GAINS\x0d1D8. FOR A WARRIOR, EACH POINT ABOVE\x0d18 BECOMES 10 POINTS OF EXCEPTIONAL\x0dSTRENGTH. ALL OTHERS ARE LIMITED TO";
          break;
        }
        case 1: {
          $r0 = "18.";
          break;
        }
      }
      break;
    }
    case 36: {
      if (chunk === 0) {
        $r0 = "THIS SPELL ANIMATES UP TO ONE DEAD\x0dHUMAN PER CASTER LEVEL AS A ZOMBIE.\x0dEACH FIGHTS FOR THE CASTER UNDER\x0dCOMPUTER CONTROL UNTIL DESTROYED.";
      }
      break;
    }
    case 37: {
      if (chunk === 0) {
        $r0 = "THIS SPELL REMOVES BLINDNESS.";
      }
      break;
    }
    case 38: {
      if (chunk === 0) {
        $r0 = "THE CASTER MUST TOUCH AN OPPONENT.\x0dIF THE ATTACK HITS AND THE VICTIM\x0dFAILS A SAVING THROW, IT IS BLINDED\x0dUNTIL CURED, SUFFERING -4 TO ATTACK\x0dROLLS AND SAVING THROWS, AND A\x0d4-POINT ARMOR CLASS PENALTY.";
      }
      break;
    }
    case 39: {
      if (chunk === 0) {
        $r0 = "THIS SPELL CURES DISEASE, INCLUDING\x0dMUMMY ROT AND THE EFFECTS OF CAUSE\x0dDISEASE.";
      }
      break;
    }
    case 40: {
      if (chunk === 0) {
        $r0 = "A SUCCESSFUL TOUCH ATTACK INFECTS AN\x0dOPPONENT THAT FAILS A SAVING THROW.\x0dTHE DISEASE BEGINS AFTER THE TIME\x0dSHOWN, THEN DRAINS 1 STRENGTH EACH\x0dHOUR AND 1 HIT POINT EACH TURN UNTIL\x0dCURED. PALADINS ARE IMMUNE.";
      }
      break;
    }
    case 41: {
      switch (chunk) {
        case 0: {
          $r0 = "THIS SPELL ATTEMPTS TO NEGATE EACH\x0dSPELL AFFECTING CREATURES IN THE\x0dAREA. THE BASE CHANCE IS 50%, PLUS\x0d5% PER CASTER LEVEL ABOVE THE\x0dOPPOSING CASTER, OR MINUS 2% PER\x0dLEVEL BELOW. IT DOES NOT CURE";
          break;
        }
        case 1: {
          $r0 = "DISEASE. IN CAMP, IT AFFECTS ONE\x0dCHARACTER.";
          break;
        }
      }
      break;
    }
    case 42: {
      if (chunk === 0) {
        $r0 = "ALLIES WITHIN 6 SQUARES GAIN +1 ON\x0dATTACK ROLLS AND SAVING THROWS;\x0dFOES WITHIN THAT AREA SUFFER -1 ON\x0dBOTH.";
      }
      break;
    }
    case 43: {
      if (chunk === 0) {
        $r0 = "THIS SPELL NEGATES BESTOW CURSE ON\x0dTHE RECIPIENT. OTHERWISE, IT ALLOWS\x0dONE CURSED ITEM CARRIED TO BE\x0dREMOVED.";
      }
      break;
    }
    case 44: {
      if (chunk === 0) {
        $r0 = "THE CASTER MUST TOUCH AN OPPONENT.\x0dIF THE ATTACK HITS AND THE VICTIM\x0dFAILS A SAVING THROW, IT SUFFERS -4\x0dON ATTACK ROLLS AND SAVING THROWS.";
      }
      break;
    }
    case 45: {
      if (chunk === 0) {
        $r0 = "UNTIL THE CASTER ACTS EACH ROUND,\x0dFOES CANNOT TARGET THE CASTER, AND\x0dALL THEIR ATTACKS MISS.";
      }
      break;
    }
    case 46: {
      switch (chunk) {
        case 0: {
          $r0 = "THIS SPELL ATTEMPTS TO NEGATE EACH\x0dSPELL AFFECTING CREATURES IN THE\x0dAREA. THE BASE CHANCE IS 50%, PLUS\x0d5% PER CASTER LEVEL ABOVE THE\x0dOPPOSING CASTER, OR MINUS 2% PER\x0dLEVEL BELOW. IT DOES NOT CURE";
          break;
        }
        case 1: {
          $r0 = "DISEASE. IN CAMP, IT AFFECTS ONE\x0dCHARACTER.";
          break;
        }
      }
      break;
    }
    case 47: {
      if (chunk === 0) {
        $r0 = "A FIERY EXPLOSION INFLICTS 1D6\x0dDAMAGE PER CASTER LEVEL UPON ALL\x0dCREATURES IN THE AREA, FRIEND OR\x0dFOE. A SUCCESSFUL SAVE HALVES THE\x0dDAMAGE. ITS RADIUS IS 3 SQUARES\x0dINDOORS AND 2 SQUARES OUTDOORS.";
      }
      break;
    }
    case 48: {
      if (chunk === 0) {
        $r0 = "UP TO ONE ALLY PER CASTER LEVEL IN\x0dTHE AREA MOVES AND ATTACKS AT TWICE\x0dTHE NORMAL RATE, BUT AGES ONE YEAR.\x0dA SLOWED ALLY INSTEAD LOSES SLOW.";
      }
      break;
    }
    case 49: {
      if (chunk === 0) {
        $r0 = "ONE OR MORE PERSONS WHO FAIL THEIR\x0dSAVING THROWS ARE HELD MOTIONLESS\x0dAND HELPLESS. ONE TARGET SAVES AT\x0d-3; TWO TARGETS SAVE AT -1 EACH.\x0dNON-PERSONS ARE UNAFFECTED.";
      }
      break;
    }
    case 50: {
      if (chunk === 0) {
        $r0 = "ALL CREATURES WITHIN 1 SQUARE OF\x0dTHE TARGET, INCLUDING FOES, BECOME\x0dINVISIBLE. FOES UNABLE TO SEE THEM\x0dCANNOT TARGET THEM; OTHERS ATTACK\x0dAT -4. THE SPELL ENDS FOR ANY\x0dRECIPIENT WHO ATTACKS OR CASTS.";
      }
      break;
    }
    case 51: {
      if (chunk === 0) {
        $r0 = "A LIGHTNING BOLT EXTENDS 8 SQUARES\x0dFROM THE TARGETED SQUARE, AWAY FROM\x0dTHE CASTER, REBOUNDING FROM WALLS.\x0dIT INFLICTS 1D6 DAMAGE PER CASTER\x0dLEVEL ON ALL IN ITS PATH, FRIEND OR\x0dFOE; A SAVE HALVES THE DAMAGE.";
      }
      break;
    }
    case 52: {
      if (chunk === 0) {
        $r0 = "THIS SPELL FUNCTIONS AS PROTECTION\x0dFROM EVIL, BUT EXTENDS TO THE\x0dRECIPIENT'S ALLIES WITHIN 1 SQUARE.";
      }
      break;
    }
    case 53: {
      if (chunk === 0) {
        $r0 = "THIS SPELL FUNCTIONS AS PROTECTION\x0dFROM GOOD, BUT EXTENDS TO THE\x0dRECIPIENT'S ALLIES WITHIN 1 SQUARE.";
      }
      break;
    }
    case 54: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT IS IMMUNE TO MISSILES\x0dWITHOUT MAGICAL BONUSES. MISSILES\x0dBEARING SUCH BONUSES INFLICT 1 LESS\x0dDIE.";
      }
      break;
    }
    case 55: {
      if (chunk === 0) {
        $r0 = "UP TO ONE FOE PER CASTER LEVEL IN\x0dTHE AREA MOVES AND ATTACKS AT HALF\x0dTHE NORMAL RATE. A HASTED FOE\x0dINSTEAD LOSES HASTE.";
      }
      break;
    }
    case 56: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT REGAINS ONE LEVEL\x0dLOST TO LEVEL DRAIN, TOGETHER WITH\x0dTHE LEVEL'S HIT POINTS.";
      }
      break;
    }
    case 57: {
      if (chunk === 0) {
        $r0 = "THE DRINKER MOVES AND ATTACKS AT\x0dTWICE THE NORMAL RATE, BUT AGES ONE\x0dYEAR. A SLOWED DRINKER INSTEAD LOSES\x0dSLOW.";
      }
      break;
    }
    case 127: {
      if (chunk === 0) {
        $r0 = "THE OINTMENT CURES THE RECIPIENT'S\x0dPOISON; FAILING THAT, ITS DISEASE;\x0dFAILING BOTH, IT RESTORES 1D4+8 HIT\x0dPOINTS. A RECIPIENT SLAIN BY POISON\x0dREVIVES WITH AT LEAST 1 HIT POINT.";
      }
      break;
    }
    case 59: {
      if (chunk === 0) {
        $r0 = "THE DRINKER'S STRENGTH BECOMES 21\x0dFOR THE DURATION. A DRINKER ALREADY\x0dSTRONGER GAINS NOTHING.";
      }
      break;
    }
    case 60: {
      switch (chunk) {
        case 0: {
          $r0 = "LIGHTNING STRIKES THE TARGETED\x0dCREATURE FOR 1D6+20 DAMAGE, THEN A\x0dBOLT EXTENDS 3 SQUARES BEYOND IT,\x0dAWAY FROM THE USER, REBOUNDING FROM\x0dWALLS, AND INFLICTS 20 DAMAGE ON ALL\x0dIN ITS PATH, FRIEND OR FOE. A SAVE";
          break;
        }
        case 1: {
          $r0 = "HALVES EACH.";
          break;
        }
      }
      break;
    }
    case 61: {
      if (chunk === 0) {
        $r0 = "A CREATURE THAT FAILS ITS SAVING\x0dTHROW IS PARALYZED, MOTIONLESS AND\x0dHELPLESS. SOME CREATURES ARE\x0dIMMUNE.";
      }
      break;
    }
    case 62: {
      if (chunk === 0) {
        $r0 = "THE DRINKER REGAINS 2D4+2 HIT\x0dPOINTS. WOUNDS CAUSED BY MUMMY ROT\x0dCANNOT BE SO CURED.";
      }
      break;
    }
    case 63: {
      switch (chunk) {
        case 0: {
          $r0 = "IN COMBAT, UP TO 4 CREATURES THE\x0dUSER TOUCHES BECOME INVISIBLE; IN\x0dCAMP, THE ENTIRE PARTY DOES. NO FOE\x0dCAN TARGET THEM, EVEN ONE ABLE TO\x0dSEE INVISIBLE CREATURES; ATTACKS ON\x0dTHEM ARE AT -4. ATTACKING DOES NOT";
          break;
        }
        case 1: {
          $r0 = "END IT. IT LASTS 2D10 TURNS IN\x0dCOMBAT, 1D10+10 IN CAMP.";
          break;
        }
      }
      break;
    }
    case 64: {
      if (chunk === 0) {
        $r0 = "A FIERY EXPLOSION INFLICTS 3D6, 5D6,\x0dOR 7D6 DAMAGE, EACH EQUALLY LIKELY,\x0dUPON ALL CREATURES IN THE AREA,\x0dFRIEND OR FOE. A SUCCESSFUL SAVE\x0dHALVES THE DAMAGE. ITS RADIUS IS 3\x0dSQUARES INDOORS AND 2 OUTDOORS.";
      }
      break;
    }
    case 65: {
      if (chunk === 0) {
        $r0 = "AN UNERRING MISSILE INFLICTS 2D4+2\x0dDAMAGE UPON THE TARGETED CREATURE.\x0dSHIELD NEGATES IT.";
      }
      break;
    }
    case 58: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT REGAINS 2D8+1 HIT\x0dPOINTS. WOUNDS CAUSED BY MUMMY ROT\x0dCANNOT BE SO CURED.";
      }
      break;
    }
    case 66: {
      if (chunk === 0) {
        $r0 = "A SUCCESSFUL TOUCH ATTACK INFLICTS\x0d2D8+1 DAMAGE. THE VICTIM RECEIVES NO\x0dSAVING THROW.";
      }
      break;
    }
    case 67: {
      switch (chunk) {
        case 0: {
          $r0 = "CAST IN CAMP, THIS SPELL REMOVES\x0dPOISON AND ENDS SLOW POISON. A\x0dVICTIM THE POISON KILLED REVIVES\x0dWITH 1 HIT POINT. A STONED,\x0dDISINTEGRATED OR ANIMATED CREATURE,\x0dOR ONE A WOUND KILLED UNDER SLOW";
          break;
        }
        case 1: {
          $r0 = "POISON, IS NOT REVIVED.";
          break;
        }
      }
      break;
    }
    case 68: {
      if (chunk === 0) {
        $r0 = "THE CASTER MUST TOUCH AN OPPONENT.\x0dIF THE ATTACK HITS, THE VICTIM MUST\x0dSAVE VERSUS POISON OR BE POISONED\x0dAND KILLED AT ONCE.";
      }
      break;
    }
    case 69: {
      if (chunk === 0) {
        $r0 = "THIS FUNCTIONS AS PROTECTION FROM\x0dEVIL, BUT THE RECIPIENT ALSO WARDS\x0dALLIES WITHIN 1 SQUARE. OVERLAPPING\x0dPROTECTION BONUSES DO NOT STACK.";
      }
      break;
    }
    case 70: {
      switch (chunk) {
        case 0: {
          $r0 = "A TARGET BELOW LEVEL 6 MUST SPEND\x0dITS ATTACKS FIGHTING SNAKES AND CAN\x0dDO NOTHING ELSE. EACH ROUND USES UP\x0dAS MANY SNAKES AS THE TARGET HAS\x0dATTACKS, FROM A POOL EQUAL TO THE\x0dCASTER'S LEVEL. STRONGER FOES SMASH";
          break;
        }
        case 1: {
          $r0 = "THEM FLAT.";
          break;
        }
      }
      break;
    }
    case 71: {
      if (chunk === 0) {
        $r0 = "THE RECIPIENT REGAINS 3D8+3 HIT\x0dPOINTS. WOUNDS CAUSED BY MUMMY ROT\x0dCANNOT BE SO CURED.";
      }
      break;
    }
    case 72: {
      if (chunk === 0) {
        $r0 = "A SUCCESSFUL TOUCH ATTACK INFLICTS\x0d3D8+3 DAMAGE. THE VICTIM RECEIVES NO\x0dSAVING THROW.";
      }
      break;
    }
    case 73: {
      switch (chunk) {
        case 0: {
          $r0 = "EVIL UNDEAD AND OTHERWORLDLY\x0dCREATURES ATTACK THE CASTER AT -7.\x0dON THE CASTER'S NEXT HIT AGAINST\x0dSUCH A FOE, IT MUST SAVE VERSUS\x0dSPELLS OR BE DISPELLED, ENDING THE\x0dSPELL; A SAVE OR A HIT ON ANOTHER";
          break;
        }
        case 1: {
          $r0 = "CREATURE DOES NOT. IT LASTS 1 ROUND\x0dPER CASTER LEVEL.";
          break;
        }
      }
      break;
    }
    case 74: {
      if (chunk === 0) {
        $r0 = "A COLUMN OF FIRE INFLICTS 6D8 FIRE\x0dDAMAGE ON ONE TARGET. A SUCCESSFUL\x0dSAVING THROW HALVES THE DAMAGE.";
      }
      break;
    }
    case 75: {
      switch (chunk) {
        case 0: {
          $r0 = "CAST IN CAMP, A DEAD OR ANIMATED\x0dNON-ELF IS RESTORED TO LIFE WITH 1\x0dHIT POINT IF IT PASSES A SURVIVAL\x0dROLL BASED ON CONSTITUTION, AND\x0dLOSES 1 CONSTITUTION. ONE THAT FAILS\x0dIS GONE FOREVER. A POISONED CORPSE";
          break;
        }
        case 1: {
          $r0 = "IS NOT RAISED.";
          break;
        }
      }
      break;
    }
    case 76: {
      if (chunk === 0) {
        $r0 = "THE TARGET MUST SAVE VERSUS DEATH\x0dMAGIC OR DIE. A SUCCESSFUL SAVE\x0dSTILL INFLICTS 2D8+1 DAMAGE. THE\x0dUNDEAD, AND CREATURES THAT RESIST\x0dMAGIC, MAY BE UNAFFECTED.";
      }
      break;
    }
    case 77: {
      if (chunk === 0) {
        $r0 = "FOR THE SPELL'S DURATION, ITEMS WITH\x0dA MAGICAL BONUS OR CURSE ARE MARKED\x0dWITH A * IN THE PARTY'S ITEM LISTS.";
      }
      break;
    }
    case 78: {
      switch (chunk) {
        case 0: {
          $r0 = "OUTDOORS, PLANTS FILL THE AREA. A\x0dFAILED SAVE HOLDS A CREATURE WITH NO\x0dMOVEMENT; A SUCCESSFUL SAVE HALVES\x0dITS MOVEMENT. IT LASTS 10 ROUNDS. A\x0dCREATURE ALREADY ENTANGLED IS NOT\x0dAFFECTED AGAIN. INDOORS THE SPELL IS";
          break;
        }
        case 1: {
          $r0 = "LOST.";
          break;
        }
      }
      break;
    }
    case 79: {
      switch (chunk) {
        case 0: {
          $r0 = "A POOL EQUAL TO THE CASTER'S LEVEL\x0dOUTLINES TARGETS IN LIGHT. A MAN-\x0dSIZED TARGET COSTS 1 POINT, A LARGE\x0dONE 2, AND A HUGE ONE 4. EACH\x0dSUFFERS A 2-POINT ARMOR CLASS\x0dPENALTY. THE FIRST TARGET IS ALWAYS";
          break;
        }
        case 1: {
          $r0 = "AFFECTED. THERE IS NO SAVING THROW.\x0dIT LASTS 4 ROUNDS PER CASTER LEVEL.";
          break;
        }
      }
      break;
    }
    case 80: {
      if (chunk === 0) {
        $r0 = "ANIMALS AND REPTILES UNABLE TO SEE\x0dINVISIBLE CREATURES CANNOT TARGET\x0dTHE RECIPIENT AND ATTACK IT AT -4.\x0dOTHER CREATURES ARE UNAFFECTED. IT\x0dLASTS 10 + CASTER LEVEL ROUNDS.";
      }
      break;
    }
    case 81: {
      switch (chunk) {
        case 0: {
          $r0 = "A POOL OF 2D4 POINTS BUYS TARGETS. A\x0dLEVEL-1 TARGET COSTS 1, LEVEL 2\x0dCOSTS 2, LEVEL 3 COSTS 4, AND A\x0dHIGHER LEVEL 8. THE FIRST TARGET IS\x0dALWAYS INCLUDED. THOSE OF ANY SIZE\x0dOR KIND THAT FAIL THEIR SAVES JOIN";
          break;
        }
        case 1: {
          $r0 = "THE CASTER'S SIDE UNDER COMPUTER\x0dCONTROL UNTIL DISPELLED.";
          break;
        }
      }
      break;
    }
    case 82: {
      if (chunk === 0) {
        $r0 = "UP TO 2D8 TARGETS IN THE AREA THAT\x0dFAIL THEIR SAVES ARE CONFUSED. EACH\x0dROUND A VICTIM MAY FLEE, DO NOTHING,\x0dGO BERSERK, OR ACT ENRAGED, THEN\x0dSAVES AGAIN AT -2; SUCCESS ENDS IT.\x0dIT LASTS 2 + CASTER LEVEL ROUNDS.";
      }
      break;
    }
    case 83: {
      if (chunk === 0) {
        $r0 = "THE CASTER TELEPORTS TO A CHOSEN\x0dOPEN SQUARE WITHIN RANGE, BREAKING\x0dFREE OF ANY CREATURE HOLDING IT.";
      }
      break;
    }
    case 84: {
      if (chunk === 0) {
        $r0 = "A THREE-RAY CONE EXTENDS 6 SQUARES\x0dFROM THE CASTER. CREATURES IN IT\x0dTHAT FAIL THEIR SAVES FLEE UNDER\x0dCOMPUTER CONTROL FOR 1 ROUND PER\x0dCASTER LEVEL.";
      }
      break;
    }
    case 85: {
      switch (chunk) {
        case 0: {
          $r0 = "THE CASTER CHOOSES A HOT OR COLD\x0dSHIELD. A MELEE ATTACKER TAKES TWICE\x0dTHE DAMAGE IT DEALT. A HOT SHIELD\x0dGRANTS +2 ON SAVES AGAINST COLD AND\x0dHALVES ITS DAMAGE, NONE ON A SAVE,\x0dBUT DOUBLES UNSAVED FIRE DAMAGE; A";
          break;
        }
        case 1: {
          $r0 = "COLD SHIELD DOES THE REVERSE. IT\x0dLASTS 2 + CASTER LEVEL ROUNDS.";
          break;
        }
      }
      break;
    }
    case 86: {
      if (chunk === 0) {
        $r0 = "A TARGET THAT FAILS ITS SAVING THROW\x0dBECOMES CLUMSY AND CAN DO NOTHING. A\x0dTARGET THAT SAVES IS SLOWED INSTEAD,\x0dMOVING AND ATTACKING AT HALF THE\x0dNORMAL RATE. EITHER EFFECT LASTS 1\x0dROUND PER CASTER LEVEL.";
      }
      break;
    }
    case 87: {
      if (chunk === 0) {
        $r0 = "HAIL INFLICTS 3D10 COLD DAMAGE ON\x0dALL CREATURES IN THE AREA, FRIEND OR\x0dFOE. NO SAVING THROW IS ALLOWED.";
      }
      break;
    }
    case 88: {
      if (chunk === 0) {
        $r0 = "SPELLS OF LEVEL 1, 2 OR 3 DO NOTHING\x0dTO THE CASTER, ITS ALLIES' AS WELL\x0dAS ITS FOES'. SPELLS OF LEVEL 4 OR\x0dHIGHER AND OTHER ATTACKS PASS\x0dTHROUGH THE GLOBE. IT LASTS 1 ROUND\x0dPER CASTER LEVEL.";
      }
      break;
    }
    case 89: {
      if (chunk === 0) {
        $r0 = "THIS SPELL REMOVES BESTOW CURSE.\x0dOTHERWISE, IT LIFTS THE CURSE FROM\x0dONE CURSED ITEM THE RECIPIENT\x0dCARRIES.";
      }
      break;
    }
    case 90: {
      if (chunk === 0) {
        $r0 = "UP TO ONE HUMAN CORPSE PER CASTER\x0dLEVEL RISES AT FULL HIT POINTS AS A\x0dZOMBIE. EACH FIGHTS FOR THE CASTER\x0dUNDER COMPUTER CONTROL. IT LOSES ITS\x0dSPELLS AND COLLAPSES IF THIS\x0dENCHANTMENT IS DISPELLED.";
      }
      break;
    }
    case 91: {
      switch (chunk) {
        case 0: {
          $r0 = "A POISONOUS CLOUD FILLS NINE\x0dSQUARES FOR 1 ROUND PER LEVEL. EACH\x0dROUND IT KILLS A CREATURE OF UP TO\x0dLEVEL 4. ONE OF LEVEL 5 SAVES AT -4,\x0dONE OF LEVEL 6 SAVES, OR DIES. ONE\x0dOF HIGHER LEVEL TAKES 1D10 DAMAGE.";
          break;
        }
        case 1: {
          $r0 = "CREATURES IMMUNE TO POISON AND THE\x0dANIMATED DEAD ARE UNAFFECTED.";
          break;
        }
      }
      break;
    }
    case 92: {
      if (chunk === 0) {
        $r0 = "A TWO-RAY CONE REACHES 1 SQUARE PER\x0dTWO CASTER LEVELS, ROUNDING UP. IT\x0dINFLICTS 1D4+1 COLD DAMAGE PER\x0dCASTER LEVEL ON ALL IN ITS PATH. A\x0dSUCCESSFUL SAVE HALVES THE DAMAGE.";
      }
      break;
    }
    case 93: {
      if (chunk === 0) {
        $r0 = "A VICTIM THAT FAILS ITS SAVE CAN\x0dCAST NO SPELLS. MAGIC-USERS SAVE AT\x0d-4, CLERICS AT +1, AND ALL OTHERS AT\x0d-2. ONLY A TEMPLE'S HEAL SERVICE\x0dENDS IT.";
      }
      break;
    }
    case 94: {
      if (chunk === 0) {
        $r0 = "UP TO FOUR CREATURES OF ANY KIND\x0dTHAT FAIL THEIR SAVES ARE MOTIONLESS\x0dAND HELPLESS. ONE TARGET SAVES AT\x0d-3; TWO SAVE AT -1 EACH; THREE OR\x0dFOUR SAVE NORMALLY. IT LASTS 1 ROUND\x0dPER CASTER LEVEL.";
      }
      break;
    }
    case 100: {
      if (chunk === 0) {
        $r0 = "A SUCCESSFUL TOUCH ATTACK CURSES A\x0dVICTIM THAT FAILS ITS SAVING THROW.\x0dTHE VICTIM SUFFERS -4 ON ATTACK\x0dROLLS AND SAVING THROWS. THE CURSE\x0dLASTS 1 TURN PER CASTER LEVEL.";
      }
      break;
    }
    case 128: {
      switch (chunk) {
        case 0: {
          $r0 = "THE READER STUDIES THE MANUAL FOR A\x0dDAY, THEN TRAINS FOR 30 DAYS, AND\x0dGAINS 1 POINT OF CONSTITUTION, TO A\x0dMAXIMUM OF 25, WITH THE HIT POINTS\x0dIT BRINGS. AT 20 OR MORE, THE READER\x0dREGENERATES. FALLING TO 0 HIT POINTS";
          break;
        }
        case 1: {
          $r0 = "ENDS THE TRAINING.";
          break;
        }
      }
      break;
    }
  }
  return $r0;
}
