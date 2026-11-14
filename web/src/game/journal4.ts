// Generated from src/journal4.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';


export function LineCount(index: number) {
  let $r0: number = 0;
  switch (index) {
    case 68: {
      $r0 = 42;
      break;
    }
    case 69: {
      $r0 = 35;
      break;
    }
    case 70: {
      $r0 = 22;
      break;
    }
    case 71: {
      $r0 = 10;
      break;
    }
    case 72: {
      $r0 = 35;
      break;
    }
    case 73: {
      $r0 = 21;
      break;
    }
    case 74: {
      $r0 = 10;
      break;
    }
    case 75: {
      $r0 = 30;
      break;
    }
    case 76: {
      $r0 = 4;
      break;
    }
    case 77: {
      $r0 = 5;
      break;
    }
    case 78: {
      $r0 = 5;
      break;
    }
    case 79: {
      $r0 = 4;
      break;
    }
    case 80: {
      $r0 = 5;
      break;
    }
    case 81: {
      $r0 = 4;
      break;
    }
    case 82: {
      $r0 = 5;
      break;
    }
    case 83: {
      $r0 = 4;
      break;
    }
    case 84: {
      $r0 = 3;
      break;
    }
    case 85: {
      $r0 = 7;
      break;
    }
    case 86: {
      $r0 = 5;
      break;
    }
    case 87: {
      $r0 = 5;
      break;
    }
    case 88: {
      $r0 = 6;
      break;
    }
    case 89: {
      $r0 = 5;
      break;
    }
    case 90: {
      $r0 = 5;
      break;
    }
    case 91: {
      $r0 = 6;
      break;
    }
    case 92: {
      $r0 = 3;
      break;
    }
    case 93: {
      $r0 = 6;
      break;
    }
    case 94: {
      $r0 = 7;
      break;
    }
    case 95: {
      $r0 = 6;
      break;
    }
    case 96: {
      $r0 = 7;
      break;
    }
    case 97: {
      $r0 = 6;
      break;
    }
    case 98: {
      $r0 = 6;
      break;
    }
    case 99: {
      $r0 = 6;
      break;
    }
    default: {
      $r0 = 0;
    }
  }
  return $r0;
}

export function TextChunk(index: number, chunk: number) {
  let $r0: string = "";
  $r0 = "";
  switch (index) {
    case 68: {
      switch (chunk) {
        case 0: {
          $r0 = "AN OFFICIAL LOOKING NOTICE\x0d" + "\x0d" + "\"ASSEMBLE A GROUP OF AT\x0d" + "LEAST 30 OF YOUR FOLLOWERS.\x0d" + "MEET UP WITH A HOBGOBLIN\x0d" + "ASSAULT FORCE AT THE SMALL\x0d" + "DOCKS TO THE WEST OF TOWN.\x0d" + "YOU AND YOUR GROUP WILL BE\x0d" + "UNDER THE COMMAND OF THE";
          break;
        }
        case 1: {
          $r0 = "HOBGOBLIN LEADER. FOLLOW\x0dHIS ORDERS. UPON COMPLETION\x0dOF THE MISSION YOU WILL BE\x0dREWARDED WITH FOOD,\x0dTREASURE, AND MANY SLAVES.\"\x0d" + "\x0d" + "SIGNED,\x0d" + "THE BOSS\x0d" + "";
          break;
        }
        case 2: {
          $r0 = "SCRIBBLED ON THE BACK OF\x0dTHESE ORDERS IS NORRIS THE\x0dGRAY'S UNSENT REPLY TO THE\x0dBOSS\x0d" + "\x0d" + "\"I WILL NEVER FOLLOW THE\x0d" + "ORDERS OF A HOBGOBLIN. I\x0d" + "DON'T GO ON MISSIONS UNTIL\x0d" + "I KNOW EXACTLY WHAT WE'RE";
          break;
        }
        case 3: {
          $r0 = "SUPPOSED TO DO. AND I DON'T\x0dGO ON MISSIONS FOR AN\x0dUNKNOWN AMOUNT OF \"FOOD,\x0dTREASURE, AND SLAVES\". I DO\x0dGO ON MISSIONS WHERE I AM\x0dIN COMMAND; WHERE I KNOW\x0dEXACTLY WHAT THE TARGET IS;\x0dAND WHERE I KNOW EXACTLY\x0dHOW MUCH I'LL GET PAID.";
          break;
        }
        case 4: {
          $r0 = "DON'T SEND ME ANOTHER ORDER\x0dUNTIL YOU CAN MEET MY\x0dTERMS.\"\x0d" + "\x0d" + "SIGNED,\x0d" + "NORRIS THE GRAY";
          break;
        }
      }
      break;
    }
    case 69: {
      switch (chunk) {
        case 0: {
          $r0 = "SEVERAL PIECES OF PAPER\x0dWITH HIGHLY ORGANIZED\x0dWRITING.\x0d" + "\x0d" + "FACT: BISHOP BRACCIO IS THE\x0d" + "HIGHEST RANKING RELIGIOUS\x0d" + "LEADER IN PHLAN. RUNS SMALL\x0d" + "TEMPLE IN CIVILIZED SECTION\x0d" + "OF CITY.";
          break;
        }
        case 1: {
          $r0 = "\x0d" + "VAGUE RUMOR: BRACCIO IS\x0d" + "ACTUALLY A FRONT-MAN FOR A\x0d" + "POWERFUL HIGH PRIEST WHO\x0d" + "NEVER LEAVES THE SMALL\x0d" + "TEMPLE.\x0d" + "\x0d" + "STRONG RUMOR: BRACCIO IS\x0d" + "UNDER FIRE TO \"DO";
          break;
        }
        case 2: {
          $r0 = "SOMETHING\" ABOUT THE UNDEAD\x0dPROBLEM. SO LONG AS THE\x0dUNDEAD WERE CAUSING THE\x0dMONSTERS MORE TROUBLE THEN\x0dTHE SETTLERS, HE HAD OTHER,\x0dMORE PRESSING, PROBLEMS.\x0d" + "\x0d" + "RUMOR: BRACCIO IS OPPOSED\x0d" + "TO THE TEMPLE TENDENCY TO";
          break;
        }
        case 3: {
          $r0 = "SELL CLERICAL \"MIRACLES\";\x0dBUT HE UNDERSTANDS THAT THE\x0dTEMPLE NEEDS FUNDS. BRACCIO\x0dWOULD RATHER PERFORM SUCH\x0d\"MIRACLES\" IN EXCHANGE FOR\x0dGOOD WORKS DONE IN THE NAME\x0dOF THE CHURCH, NOT JUST FOR\x0dMONEY OR ITEMS OF POWER.";
          break;
        }
      }
      break;
    }
    case 70: {
      switch (chunk) {
        case 0: {
          $r0 = "DELIVERED IN CHILLINGLY\x0dCLEAR TONES.\x0d" + "\x0d" + "\"HEAR US IN OUR HOUR OF\x0d" + "NEED!\" THE NOMAD\x0d" + "WITCHDOCTOR CRIES, \"THIS\x0d" + "NIGHT WE FIGHT A GREAT\x0d" + "BATTLE. BY THE BREAKING OF\x0d" + "DAWN EITHER OUR ENEMIES";
          break;
        }
        case 1: {
          $r0 = "WILL BE DEAD OR WE WILL\x0dHAVE BEEN DESTROYED.\x0d" + "\x0d" + "\"ACCEPT THE SACRIFICE OF\x0d" + "THESE OUTSIDERS AND GIVE US\x0d" + "THE STRENGTH TO DEFEAT THE\x0d" + "HORDES OF OUR ENEMIES. FILL\x0d" + "OUR LIMBS WITH YOUR FIRE,\x0d" + "AND FILL OUR MINDS WITH";
          break;
        }
        case 2: {
          $r0 = "YOUR FURY. LET US VANQUISH\x0dOUR ENEMIES JUST AS WE\x0dVANQUISH THESE INVADERS WHO\x0dHAVE COME AMONG US.\"";
          break;
        }
      }
      break;
    }
    case 71: {
      switch (chunk) {
        case 0: {
          $r0 = "A CRUMPLED DISCARDED PIECE\x0dOF PAPER, FULL OF RUB OUTS\x0dAND SCRATCH OVERS.\x0d" + "\x0d" + "PRIESTS: 1\x0d" + "ACOLYTES: 4\x0d" + "OGRES: 1\x0d" + "HOBGOBLINS: 40\x0d" + "ORCS: 90";
          break;
        }
        case 1: {
          $r0 = "GOBLIN SLAVES: 20";
          break;
        }
      }
      break;
    }
    case 72: {
      switch (chunk) {
        case 0: {
          $r0 = "A PAGE FROM AN UNKNOWN\x0dDIARY.\x0d" + "\x0d" + "\"THEY STOLE MY MAP TO THE\x0d" + "POOL. SOMEHOW THEY KNEW\x0d" + "WHEN I WAS COMING AND\x0d" + "EXACTLY WHAT TO LOOK FOR.\x0d" + "THEY DIDN'T EVEN BOTHER TO\x0d" + "KILL ME; THEY SAID I WASN'T";
          break;
        }
        case 1: {
          $r0 = "WORTH KILLING. THEY JUST\x0dCRIPPLED MY LEGS, TOOK THE\x0dMAP, AND RODE AWAY\x0dLAUGHING.\x0d" + "\x0d" + "\"AFTER THE ATTACK AND THE\x0d" + "RIGORS OF MY TREK ALL I\x0d" + "REMEMBER IS THAT THE POOL\x0d" + "IS IN THE DRAGONSPINE,";
          break;
        }
        case 2: {
          $r0 = "NORTH AND WEST OF\x0dSORCERER'S ISLAND. IT\x0dSHINES JUST LIKE THEY SAID\x0dIT WOULD. YOU CAN FEEL THE\x0dPOWER FLOWING OUT OF IT.\x0dKINGS AND GENERALS HAVE\x0dSEARCHED FOR THE POOL, AND\x0dI HAD A MAP THAT LED RIGHT\x0dTO IT.";
          break;
        }
        case 3: {
          $r0 = "\x0d" + "\"IF I EVER GET BACK THE USE\x0d" + "OF MY LEGS I'LL GO AFTER\x0d" + "THEM. I'LL GET BACK MY MAP.\x0d" + "I'LL GET TO THE POOL. AND\x0d" + "THIS TIME I'LL BATHE IN ITS\x0d" + "POWER. THEN I'LL TEACH\x0d" + "THEM. I'LL TEACH THEM ALL.\"";
          break;
        }
      }
      break;
    }
    case 73: {
      switch (chunk) {
        case 0: {
          $r0 = "DELIVERED AS YOU SIT AROUND\x0dTHE CAMP FIRE.\x0d" + "\x0d" + "\"YOU MUST BEWARE OF THE\x0d" + "MANY DANGERS IN THIS\x0d" + "REGION. SEVERAL DAYS WALK\x0d" + "TO THE WEST THERE IS THE\x0d" + "PYRAMID OF EVIL. IT HAS\x0d" + "BEEN LONG AVOIDED BY ALL";
          break;
        }
        case 1: {
          $r0 = "SENSIBLE MEN. TO THE\x0dSOUTHEAST IS A LAIR OF MANY\x0dFEROCIOUS HOBGOBLINS. THE\x0dAREAS TO THE SOUTHWEST, ARE\x0dINHABITED BY EVIL MEN --\x0dBUCCANEERS, MARAUDERS, AND\x0dSOLDIERS OF AN EVIL EMPIRE\x0dFAR TO THE WEST. AND ALL\x0dGOOD FOLKS AVOID THE SWAMPS";
          break;
        }
        case 2: {
          $r0 = "TO THE EAST. NOTHING BUT\x0dDANGER GROWS IN THE\x0dSWAMPS.\"";
          break;
        }
      }
      break;
    }
    case 74: {
      switch (chunk) {
        case 0: {
          $r0 = "AN UNSENT NOTE WRITTEN ON\x0dSTURDY PARCHMENT.\x0d" + "\x0d" + "\"AN ACTIVE DRAGON HAS MADE\x0d" + "ITS HOME IN THE DRAGONSPINE\x0d" + "MOUNTAINS TO THE NORTHWEST.\x0d" + "KEEP SEARCH PARTIES AWAY\x0d" + "FROM THE AREA SO AS NOT TO\x0d" + "CATCH THE DRAGON'S";
          break;
        }
        case 1: {
          $r0 = "ATTENTION.\"";
          break;
        }
      }
      break;
    }
    case 75: {
      switch (chunk) {
        case 0: {
          $r0 = "A RATTY PIECE OF PARCHMENT\x0dWITH LARGE WRITING ON ONE\x0dSIDE.\x0d" + "\x0d" + "\"OUR SPIES IN THE CITY\x0d" + "INFORM US THAT A PARTY OF\x0d" + "INVADERS WILL TRAVEL TO\x0d" + "SOKAL KEEP TO FREE IT. TO\x0d" + "COMBAT THESE INVADERS,";
          break;
        }
        case 1: {
          $r0 = "ASSEMBLE A FORCE OF NO LESS\x0dTHAN THREE SQUADS. TRAVEL\x0dBY BOAT FROM THE SMALL\x0dDOCKS AT THE WEST OF TOWN\x0dTO THORN ISLAND. MOVE\x0dUNDETECTED TO SOKAL KEEP.\x0dFIND THE ADVENTURERS IN OR\x0dAROUND SOKAL KEEP. KILL\x0dTHEM BEFORE THEY CAN RETURN";
          break;
        }
        case 2: {
          $r0 = "TO THE CITY COUNCIL WITH\x0dINFORMATION ABOUT THE TRUE\x0dSITUATION AT THE KEEP.\x0dRETURN WITH THE INVADER'S\x0dHEADS AS PROOF OF\x0dCOMPLETION OF YOUR MISSION.\x0dUPON COMPLETION YOU WILL BE\x0dREWARDED WITH FOOD,\x0dTREASURE, AND MANY SLAVES.\"";
          break;
        }
        case 3: {
          $r0 = "\x0d" + "SIGNED,\x0d" + "THE BOSS";
          break;
        }
      }
      break;
    }
    case 76: {
      switch (chunk) {
        case 0: {
          $r0 = "A TATTERED PIECE OF\x0dPARCHMENT\x0d" + "\x0d" + "(PICTURE)";
          break;
        }
      }
      break;
    }
    case 77: {
      switch (chunk) {
        case 0: {
          $r0 = "FAR TO THE NORTHEAST, IN\x0dTHE MIDST OF A VAST SWAMP,\x0dLIE THE UNINHABITED RUINS\x0dOF A POWERFUL WIZARD'S\x0dCASTLE.";
          break;
        }
      }
      break;
    }
    case 78: {
      switch (chunk) {
        case 0: {
          $r0 = "A DRUNK BARD SITS IN A\x0dCORNER OF THE TAVERN\x0dSPINNING A SEEMINGLY\x0dENDLESS TALE, BUT NO ONE IS\x0dLISTENING.";
          break;
        }
      }
      break;
    }
    case 79: {
      switch (chunk) {
        case 0: {
          $r0 = "WELLS THROUGHOUT THE CITY\x0dOFTEN PROVIDE ACCESS TO\x0dHIDDEN DENS AND UNDERGROUND\x0dPASSAGES.";
          break;
        }
      }
      break;
    }
    case 80: {
      switch (chunk) {
        case 0: {
          $r0 = "AN ANGLISH LORD COMMANDEERS\x0dONE CORNER OF THE BAR TO\x0dLECTURE ON THE ULTIMATE\x0dRANGE OF HIS ADVENTURES.\x0dTHE CROWD IGNORES HIM.";
          break;
        }
      }
      break;
    }
    case 81: {
      switch (chunk) {
        case 0: {
          $r0 = "TO THE EAST OF PHLAN LIES A\x0dGLEAMING CASTLE OF GOLD\x0dTHAT SHIFTS ITS LOCATION\x0dFROM TIME TO TIME.";
          break;
        }
      }
      break;
    }
    case 82: {
      switch (chunk) {
        case 0: {
          $r0 = "A WEIRD LOOKING WIZARD,\x0dDRESSED ALL IN BLACK, SITS\x0dALONE AND MUMBLES INTO HIS\x0dBEER, \"I'LL RETURN NEXT\x0dTIME AND SHOW THEM ALL!\"";
          break;
        }
      }
      break;
    }
    case 83: {
      switch (chunk) {
        case 0: {
          $r0 = "GREAT TREASURES ARE TO BE\x0dFOUND ON THE BANKS OF THE\x0dBARREN RIVER AS ONE\x0dVENTURES NORTHWARD.";
          break;
        }
      }
      break;
    }
    case 84: {
      switch (chunk) {
        case 0: {
          $r0 = "THE GRAVEYARD IS CONTROLLED\x0dBY A VERY POWERFUL AND\x0dCLEVER UNDEAD CREATURE.";
          break;
        }
      }
      break;
    }
    case 85: {
      switch (chunk) {
        case 0: {
          $r0 = "A PUZZLED PATRON WITH A\x0dLIMITED VOCABULARY\x0dQUESTIONS EVERYONE HE COMES\x0dACROSS ABOUT HOW TO\x0dCOMPLETE A MANUSCRIPT DATED\x0d1977 GUE. UNFORTUNATELY, NO\x0dONE CAN HELP HIM.";
          break;
        }
      }
      break;
    }
    case 86: {
      switch (chunk) {
        case 0: {
          $r0 = "TO THE WEST LIVES A TRIBE\x0dOF INSECT-MEN WHO WORSHIP\x0dNORMAL MEN AND GIVE\x0dVALUABLE GIFTS TO ALL WHO\x0dVISIT THEM.";
          break;
        }
      }
      break;
    }
    case 87: {
      switch (chunk) {
        case 0: {
          $r0 = "THE DRAGONSPINE MOUNTAINS\x0dARE INHABITED BY A RACE OF\x0dEVIL DRAGONS WHO LURE\x0dTRAVELERS TO THEIR LAIRS\x0dAND SLAY THEM.";
          break;
        }
      }
      break;
    }
    case 88: {
      switch (chunk) {
        case 0: {
          $r0 = "A BEDRAGGLED ADVENTURER\x0dDECRIES, \"THERE WAS A MAN\x0dCALLED TURTLE, WALLS THAT\x0dAREN'T THERE, LIVING\x0dDAGGERS; I NEVER DID FIGURE\x0dOUT WHAT WAS GOING ON!\"";
          break;
        }
      }
      break;
    }
    case 89: {
      switch (chunk) {
        case 0: {
          $r0 = "A MASTER THIEF HAS SET UP A\x0dHIDDEN TRAINING GROUND DEEP\x0dIN THE OLD CITY, RIGHT\x0dUNDER THE NOSES OF\x0dMONSTERS.";
          break;
        }
      }
      break;
    }
    case 90: {
      switch (chunk) {
        case 0: {
          $r0 = "OGRES WHO LIVE TO THE EAST\x0dOF PHLAN ARE HOLDING\x0dCAPTIVE A PRINCESS FOR WHOM\x0dA HUGE REWARD HAS BEEN\x0dOFFERED.";
          break;
        }
      }
      break;
    }
    case 91: {
      switch (chunk) {
        case 0: {
          $r0 = "THE MERCHANTS OF ZHENTIL\x0dKEEP ARE SETTING UP A\x0dTRADING BASE FAR TO THE\x0dWEST OF PHLAN. THEY'RE\x0dHIRING CARAVAN GUARDS FOR\x0dGOOD WAGES.";
          break;
        }
      }
      break;
    }
    case 92: {
      switch (chunk) {
        case 0: {
          $r0 = "BUCCANEERS OPERATE A SLAVE\x0dAUCTION OUT OF A HIDDEN\x0dCAMP NEAR STORMY BAY.";
          break;
        }
      }
      break;
    }
    case 93: {
      switch (chunk) {
        case 0: {
          $r0 = "AN OLD SAGE SITS IN A\x0dCORNER WITH A DARK WIZARD.\x0d\"YOU'RE RIGHT,\" LAUGHS THE\x0dSAGE, \"THEY'LL DO ANYTHING\x0dI TELL THEM TO, NO MATTER\x0dHOW SILLY OR PHANTASTIC.\"";
          break;
        }
      }
      break;
    }
    case 94: {
      switch (chunk) {
        case 0: {
          $r0 = "OFF TO THE EAST OF PHLAN\x0dROAMS A TRIBE OF MARAUDING\x0dNOMADS. THEY HAVE BEEN\x0dPILLAGING VILLAGES IN THE\x0dPLAINS WITH THE HELP OF A\x0dPOWERFUL ARTIFACT THEY HAVE\x0dDISCOVERED.";
          break;
        }
      }
      break;
    }
    case 95: {
      switch (chunk) {
        case 0: {
          $r0 = "MIGHTY TRIBES OF WILD\x0dDWARVES, THOUSANDS OF THEM,\x0dROAM THE DRAGONSPINE\x0dMOUNTAINS, DESTROYING\x0dVILLAGERS AND KILLING\x0dTRAVELERS.";
          break;
        }
      }
      break;
    }
    case 96: {
      switch (chunk) {
        case 0: {
          $r0 = "\"I WAS TOTALLY CONFUSED; IT\x0dWAS LIKE BEING LOST IN THE\x0dDARKNESS,\" SIGHED THE\x0dOVERWROUGHT ADVENTURER.\x0d\"RABBITS, HATS, BOWLING\x0dBALLS? WHERE IN THE REALMS\x0dWAS I?\"";
          break;
        }
      }
      break;
    }
    case 97: {
      switch (chunk) {
        case 0: {
          $r0 = "THE MONSTERS IN PHLAN ARE\x0dLED BY ONE OF THE GENERALS\x0dWHO SACKED THE CITY A\x0dGENERATION AGO. THE GENERAL\x0dHAS USED GREAT MAGIC TO\x0dMAKE HIMSELF IMMORTAL.";
          break;
        }
      }
      break;
    }
    case 98: {
      switch (chunk) {
        case 0: {
          $r0 = "A VAST FORTRESS OF KOBOLDS\x0dDOMINATES THE WESTERN TIP\x0dOF THE GREAT SWAMP. THESE\x0dNORMALLY WEAK CREATURES\x0dGROW TO GREAT SIZE AND HAVE\x0dEXTRAORDINARY POWERS HERE.";
          break;
        }
      }
      break;
    }
    case 99: {
      switch (chunk) {
        case 0: {
          $r0 = "AN ANCIENT SILVER DRAGON\x0dSTILL LIVES UP IN THE\x0dDRAGONSPINE MOUNTAINS. THE\x0dDRAGON IS NOT EVIL AND WILL\x0dHELP TRAVELERS WHO BATTLE\x0dEVIL.";
          break;
        }
      }
      break;
    }
  }
  return $r0;
}
