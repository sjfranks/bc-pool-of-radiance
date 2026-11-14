// Generated from src/cluebook.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';

export const CLUE_LEN = 30;
export const NO_MAP = 255;

export const $at = { marksMap: 252835, marks: 252836 };

export function Note(map: number, x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 258);
  let i: number = 0, k: number = 0, $r0: string = "";
  $r0 = "";
  i = 1;
  wS($f0, 255, Entry(map, i));
  while (rS($f0) !== "") {
    k = 1;
    while (EntrySquare(rS($f0), k, $f0 + 256, $f0 + 257)) {
      if ((I8[$f0 + 256] === x) && (I8[$f0 + 257] === y)) {
        $r0 = EntryText(rS($f0));
        { S.sp = $sp; return $r0; }
      }
      k = (k + 1) & 255;
    }
    i = (i + 1) & 255;
    wS($f0, 255, Entry(map, i));
  }
  S.sp = $sp;
  return $r0;
}

export function Marked(map: number, x: number, y: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 258);
  let i: number = 0, k: number = 0, $r0: boolean = false;
  if (map !== U8[252835]) {
    rt.fill(252836, 32, 0);
    U8[252835] = map;
    i = 1;
    wS($f0, 255, Entry(map, i));
    while (rS($f0) !== "") {
      k = 1;
      while (EntrySquare(rS($f0), k, $f0 + 256, $f0 + 257)) {
        w16(I8[$f0 + 257] * 2 + 252836, r16(I8[$f0 + 257] * 2 + 252836) | (1 << I8[$f0 + 256]));
        k = (k + 1) & 255;
      }
      i = (i + 1) & 255;
      wS($f0, 255, Entry(map, i));
    }
  }
  $r0 = Types.OnMap(x, y) && ((r16(y * 2 + 252836) & (1 << x)) !== 0);
  S.sp = $sp;
  return $r0;
}

export function Entry(map: number, i: number) {
  let $r0: string = "";
  $r0 = "";
  switch (map) {
    case 0: {
      switch (i) {
        case 1: {
          $r0 = "15,1:Boat";
          break;
        }
        case 2: {
          $r0 = "11,1:Passenger Dock";
          break;
        }
        case 3: {
          $r0 = "10,4 9,6:Temple of Tyr";
          break;
        }
        case 4: {
          $r0 = "10,5:Bishop Braccio's Office";
          break;
        }
        case 5: {
          $r0 = "8,1 8,2:Dueling & Hiring Hall";
          break;
        }
        case 6: {
          $r0 = "5,0:Clerical Training";
          break;
        }
        case 7: {
          $r0 = "7,0:Magic User Training";
          break;
        }
        case 8: {
          $r0 = "8,0:Fighter Training";
          break;
        }
        case 9: {
          $r0 = "9,0:Thieves Training";
          break;
        }
        case 10: {
          $r0 = "1,1:Temple of Sune";
          break;
        }
        case 11: {
          $r0 = "1,7:City Park";
          break;
        }
        case 12: {
          $r0 = "4,3:Entrance To The City Hall";
          break;
        }
        case 13: {
          $r0 = "5,5:Clerk of the City Council";
          break;
        }
        case 14: {
          $r0 = "6,5:Junior Councilman's Office";
          break;
        }
        case 15: {
          $r0 = "6,6:Senior Councilman's Office";
          break;
        }
        case 16: {
          $r0 = "5,7 6,7 5,8 6,8:Head Councilman's Office";
          break;
        }
        case 17: {
          $r0 = "5,9 6,9 5,10 6,10:City Council Chambers";
          break;
        }
        case 18: {
          $r0 = "1,13:Temple of Tempus";
          break;
        }
        case 19: {
          $r0 = "1,14 4,12 4,13 6,12 6,13:Inns";
          break;
        }
        case 20: {
          $r0 = "10,8 8,8 8,9 14,10 15,10 15,13:Taverns";
          break;
        }
        case 21: {
          $r0 = "13,8 8,11 11,12 8,13 9,13:Arms & Armor Shop";
          break;
        }
        case 22: {
          $r0 = "15,8 9,10 12,10 9,11 11,11:General Items Shop";
          break;
        }
        case 23: {
          $r0 = "11,10 10,13:Silver Shop";
          break;
        }
        case 24: {
          $r0 = "8,10:Jeweler";
          break;
        }
      }
      break;
    }
    case 1: {
      switch (i) {
        case 1: {
          $r0 = "7,0:Front Gate";
          break;
        }
        case 2: {
          $r0 = "8,10 9,10 8,11 9,11:Merchant's Camp Area";
          break;
        }
        case 3: {
          $r0 = "7,11 7,12:Captain's Guards";
          break;
        }
        case 4: {
          $r0 = "7,13 8,13:Captains Quarters";
          break;
        }
        case 5: {
          $r0 = "5,3 6,3 9,3 10,3 1,7 2,7 9,7 10,7 4,10 4,11 11,10 11,11:Buccaneer Barracks";
          break;
        }
        case 6: {
          $r0 = "6,0 9,0 2,3 13,3 0,10 15,10 4,14 11,14:Guard Towers";
          break;
        }
        case 7: {
          $r0 = "13,7:Animal Pen";
          break;
        }
        case 8: {
          $r0 = "6,7 7,7 6,8 7,8:Slave Pen";
          break;
        }
        case 9: {
          $r0 = "7,6:Slave Pen Guards";
          break;
        }
        case 10: {
          $r0 = "2,11:Huckster";
          break;
        }
      }
      break;
    }
    case 2: {
      switch (i) {
        case 1: {
          $r0 = "0,3:Dry Well";
          break;
        }
        case 2: {
          $r0 = "6,11:Way in from the Dry Well";
          break;
        }
        case 3: {
          $r0 = "6,8 6,9:Hobgoblin Barracks";
          break;
        }
        case 4: {
          $r0 = "2,11 3,11 2,12 3,12:High Priestess Grishnak";
          break;
        }
        case 5: {
          $r0 = "2,15:Skullcrusher chained up";
          break;
        }
        case 6: {
          $r0 = "6,14:'Skullcrusher Was Here'";
          break;
        }
        case 7: {
          $r0 = "5,15:Baby hobgoblins hiding";
          break;
        }
        case 8: {
          $r0 = "10,9:A hobgoblin body";
          break;
        }
        case 9: {
          $r0 = "11,14:Secret door to the east";
          break;
        }
        case 10: {
          $r0 = "12,15:Ogre leader and his troops";
          break;
        }
      }
      break;
    }
    case 3: {
      switch (i) {
        case 1: {
          $r0 = "1,13 1,14:Barracks";
          break;
        }
        case 2: {
          $r0 = "0,7 1,7:Barracks";
          break;
        }
        case 3: {
          $r0 = "3,7 3,8:Main Gate";
          break;
        }
        case 4: {
          $r0 = "0,5 1,5:Latrine";
          break;
        }
        case 5: {
          $r0 = "0,2 1,2 0,3 1,3:Officers Quarters";
          break;
        }
        case 6: {
          $r0 = "5,0 6,0 5,1 6,1:Guard Post";
          break;
        }
        case 7: {
          $r0 = "8,0 9,0 8,1 9,1:Mess Hall";
          break;
        }
        case 8: {
          $r0 = "12,11:Maze: Teleporters";
          break;
        }
        case 9: {
          $r0 = "4,7 4,8:Maze: Main Gate";
          break;
        }
        case 10: {
          $r0 = "4,5 5,5:Maze: Tower";
          break;
        }
      }
      break;
    }
    case 4: {
      switch (i) {
        case 1: {
          $r0 = "5,0 6,0 5,1 6,1:Guard Post";
          break;
        }
        case 2: {
          $r0 = "8,0 9,0 8,1 9,1:Barracks";
          break;
        }
        case 3: {
          $r0 = "14,2 15,2 14,3 15,3:Armory";
          break;
        }
        case 4: {
          $r0 = "14,6 15,6:Kitchen";
          break;
        }
        case 5: {
          $r0 = "14,9 15,9 14,10 15,10:Records Office";
          break;
        }
        case 6: {
          $r0 = "14,13 15,13 14,14 15,14:Scribe's Office";
          break;
        }
        case 7: {
          $r0 = "6,10:Maze: Teleporters";
          break;
        }
        case 8: {
          $r0 = "10,4 11,4 10,5 11,5:Maze: Tower";
          break;
        }
      }
      break;
    }
    case 5: {
      switch (i) {
        case 1: {
          $r0 = "14,1:Snake House";
          break;
        }
        case 2: {
          $r0 = "14,8 15,8:Barracks";
          break;
        }
        case 3: {
          $r0 = "12,7 12,8:Main Gate";
          break;
        }
        case 4: {
          $r0 = "14,10:Cell";
          break;
        }
        case 5: {
          $r0 = "15,10:Well";
          break;
        }
        case 6: {
          $r0 = "14,12 15,12 14,13 15,13:Giant's Guard Post";
          break;
        }
        case 7: {
          $r0 = "9,14 10,14 9,15 10,15:Old Building";
          break;
        }
        case 8: {
          $r0 = "7,14 7,15:Barracks";
          break;
        }
        case 9: {
          $r0 = "3,4:Maze: Teleporters";
          break;
        }
        case 10: {
          $r0 = "11,7 11,8:Maze: Main Gate";
          break;
        }
        case 11: {
          $r0 = "10,10 11,10:Maze: Giant Hideout";
          break;
        }
        case 12: {
          $r0 = "1,1 2,1 1,2 2,2:Tower: False Tyranthraxus";
          break;
        }
      }
      break;
    }
    case 6: {
      switch (i) {
        case 1: {
          $r0 = "13,14 14,14:Laundry Room";
          break;
        }
        case 2: {
          $r0 = "1,14 2,14 1,15 2,15:Smithy";
          break;
        }
        case 3: {
          $r0 = "0,5 1,5 0,6 1,6:A Smokehouse";
          break;
        }
        case 4: {
          $r0 = "0,1 1,1 0,2 1,2:A Bane Chapel";
          break;
        }
        case 5: {
          $r0 = "9,5:Maze: Teleporters";
          break;
        }
        case 6: {
          $r0 = "4,10 5,10 4,11 5,11:Maze: Giant Hideout";
          break;
        }
      }
      break;
    }
    case 7: {
      switch (i) {
        case 1: {
          $r0 = "5,4:Stairs to lower level";
          break;
        }
        case 2: {
          $r0 = "8,5:Trap Door Room";
          break;
        }
        case 3: {
          $r0 = "1,6 2,6 1,7 2,7:Waiting Room";
          break;
        }
        case 4: {
          $r0 = "2,4 2,5:Genheeris' Office";
          break;
        }
        case 5: {
          $r0 = "3,9:Tyranthraxus' Lair";
          break;
        }
        case 6: {
          $r0 = "2,10:The Pool of Radiance";
          break;
        }
      }
      break;
    }
    case 9: {
      switch (i) {
        case 1: {
          $r0 = "4,14 11,14:Merchant in Wagon";
          break;
        }
        case 2: {
          $r0 = "7,10 8,10 7,11 8,11:Bugbear Patrol Area";
          break;
        }
        case 3: {
          $r0 = "7,9 8,9:Southern Gate";
          break;
        }
        case 4: {
          $r0 = "7,7 8,7 7,8 8,8:Northern Gate";
          break;
        }
        case 5: {
          $r0 = "7,6 8,6:Ettin guards fight here";
          break;
        }
        case 6: {
          $r0 = "4,8:West Tower";
          break;
        }
        case 7: {
          $r0 = "11,8:East Tower";
          break;
        }
      }
      break;
    }
    case 10: {
      switch (i) {
        case 1: {
          $r0 = "6,4:Skeletal Hands";
          break;
        }
        case 2: {
          $r0 = "5,6:Skeletons guard mausoleum";
          break;
        }
        case 3: {
          $r0 = "7,6:Giant skeleton helps guard";
          break;
        }
        case 4: {
          $r0 = "5,9:Zombies guard this tower";
          break;
        }
        case 5: {
          $r0 = "4,10:Spectre creating zombies";
          break;
        }
        case 6: {
          $r0 = "1,12:Skeletons guard this tower";
          break;
        }
        case 7: {
          $r0 = "1,13:Room filled with poison gas";
          break;
        }
        case 8: {
          $r0 = "0,15:Spectre creating skeletons";
          break;
        }
        case 9: {
          $r0 = "10,15:Zombies outside mausoleum";
          break;
        }
        case 10: {
          $r0 = "9,15:Ju-ju zombie helps guard";
          break;
        }
        case 11: {
          $r0 = "9,11:Mummies inhabit this crypt";
          break;
        }
        case 12: {
          $r0 = "9,5:Wights guard this tower";
          break;
        }
        case 13: {
          $r0 = "9,7:Spectre creating wights";
          break;
        }
        case 14: {
          $r0 = "15,6:Wights guard mausoleum";
          break;
        }
        case 15: {
          $r0 = "15,8:A wraith helps guard";
          break;
        }
        case 16: {
          $r0 = "9,1:Spectres guard this crypt";
          break;
        }
        case 17: {
          $r0 = "8,2:A gallant knight's grave";
          break;
        }
        case 18: {
          $r0 = "12,4:The vampire's coffin";
          break;
        }
        case 19: {
          $r0 = "14,0:The vampire is here";
          break;
        }
        case 20: {
          $r0 = "8,7:An evil magic user";
          break;
        }
      }
      break;
    }
    case 13: {
      switch (i) {
        case 1: {
          $r0 = "6,13:A hidden water trap";
          break;
        }
        case 2: {
          $r0 = "6,11:A discarded map";
          break;
        }
        case 3: {
          $r0 = "9,12:You meet a kobold here";
          break;
        }
        case 4: {
          $r0 = "10,9:A net trap";
          break;
        }
        case 5: {
          $r0 = "11,9:A Spike Trap";
          break;
        }
        case 6: {
          $r0 = "12,9:A drunken kobold";
          break;
        }
        case 7: {
          $r0 = "14,8 14,9:You may meet the wyvern";
          break;
        }
        case 8: {
          $r0 = "14,6:The wyverns nest";
          break;
        }
        case 9: {
          $r0 = "15,3:A crippled kobold";
          break;
        }
        case 10: {
          $r0 = "1,2:Prison: Princess Fatima";
          break;
        }
        case 11: {
          $r0 = "5,3:The throne room";
          break;
        }
        case 12: {
          $r0 = "7,1 8,1:The king's guard";
          break;
        }
        case 13: {
          $r0 = "10,1:Fate of the kobold king";
          break;
        }
        case 14: {
          $r0 = "14,0:An efreeti bottle";
          break;
        }
        case 15: {
          $r0 = "13,1:Huge kobold treasure trove";
          break;
        }
        case 16: {
          $r0 = "3,3:A clue";
          break;
        }
      }
      break;
    }
    case 14: {
      switch (i) {
        case 1: {
          $r0 = "3,4:First Ambush";
          break;
        }
        case 2: {
          $r0 = "6,5:A Pair of Thieves";
          break;
        }
        case 3: {
          $r0 = "9,8:The thieves split up";
          break;
        }
        case 4: {
          $r0 = "13,5:Corner a single thief";
          break;
        }
        case 5: {
          $r0 = "8,13:Thieves waiting in ambush";
          break;
        }
        case 6: {
          $r0 = "14,9:Information collected";
          break;
        }
        case 7: {
          $r0 = "11,14:Boss' men beat old thief";
          break;
        }
        case 8: {
          $r0 = "14,14:Some of the thieves' loot";
          break;
        }
        case 9: {
          $r0 = "5,14:Information collected";
          break;
        }
        case 10: {
          $r0 = "7,6:A room with four caskets";
          break;
        }
        case 11: {
          $r0 = "4,13:A room with a cabinet";
          break;
        }
        case 12: {
          $r0 = "10,9:Pile of thieves' treasure";
          break;
        }
        case 13: {
          $r0 = "14,10:A clue";
          break;
        }
      }
      break;
    }
    case 15: {
      switch (i) {
        case 1: {
          $r0 = "11,4:History Section";
          break;
        }
        case 2: {
          $r0 = "5,4:Rhetoric Section";
          break;
        }
        case 3: {
          $r0 = "13,6:Philosophy Section";
          break;
        }
        case 4: {
          $r0 = "3,6:Mathematics Section";
          break;
        }
        case 5: {
          $r0 = "13,10:Storeroom";
          break;
        }
        case 6: {
          $r0 = "11,12:Madman in Corner";
          break;
        }
        case 7: {
          $r0 = "13,13:Master Scribe's Chamber";
          break;
        }
        case 8: {
          $r0 = "8,11:Librarian's Chamber";
          break;
        }
        case 9: {
          $r0 = "4,11:Garden";
          break;
        }
      }
      break;
    }
    case 16: {
      switch (i) {
        case 1: {
          $r0 = "10,4:Holes";
          break;
        }
        case 2: {
          $r0 = "3,7:Holes";
          break;
        }
        case 3: {
          $r0 = "5,12:Holes";
          break;
        }
        case 4: {
          $r0 = "6,6:Holes";
          break;
        }
        case 5: {
          $r0 = "7,9:Holes";
          break;
        }
        case 6: {
          $r0 = "9,6:Holes";
          break;
        }
        case 7: {
          $r0 = "9,8:Stairs";
          break;
        }
        case 8: {
          $r0 = "4,3:Lizard Men & Giant Lizards";
          break;
        }
        case 9: {
          $r0 = "4,6 4,7 2,9 2,10:Giant Lizards";
          break;
        }
      }
      break;
    }
    case 17: {
      switch (i) {
        case 1: {
          $r0 = "10,1 3,8 9,14:Trip wire";
          break;
        }
        case 2: {
          $r0 = "9,12:Your Hut";
          break;
        }
        case 3: {
          $r0 = "0,9:The Forest";
          break;
        }
      }
      break;
    }
    case 18: {
      switch (i) {
        case 1: {
          $r0 = "14,8:Minor Temple of Bane";
          break;
        }
        case 2: {
          $r0 = "3,9 4,9:The Pit";
          break;
        }
        case 3: {
          $r0 = "0,14 1,14:Secret Temple of Il-Mater";
          break;
        }
        case 4: {
          $r0 = "7,6 7,7 7,8:The Auction";
          break;
        }
      }
      break;
    }
    case 20: {
      switch (i) {
        case 1: {
          $r0 = "12,0 12,1:Orcs";
          break;
        }
        case 2: {
          $r0 = "9,0 10,0 9,1 10,1:Goblin Armsmaster";
          break;
        }
        case 3: {
          $r0 = "12,9 12,10:Magic User";
          break;
        }
        case 4: {
          $r0 = "5,2 6,2:Stable";
          break;
        }
        case 5: {
          $r0 = "7,0 8,0 7,1 8,1:Kobolds";
          break;
        }
        case 6: {
          $r0 = "0,0:Secret Treasure Room";
          break;
        }
        case 7: {
          $r0 = "0,2 0,3:Hobgoblins";
          break;
        }
        case 8: {
          $r0 = "3,5:Gypsy";
          break;
        }
        case 9: {
          $r0 = "2,3 3,3:Orcs";
          break;
        }
        case 10: {
          $r0 = "0,6 0,7:Monster Guards";
          break;
        }
        case 11: {
          $r0 = "1,5:Monster Leaders";
          break;
        }
        case 12: {
          $r0 = "3,10 3,11:Goblin Guards";
          break;
        }
        case 13: {
          $r0 = "4,10 5,10:Hidden Loot";
          break;
        }
        case 14: {
          $r0 = "6,11:Entrance to Old Rope Guild";
          break;
        }
        case 15: {
          $r0 = "15,12:Ohlo's Potion";
          break;
        }
        case 16: {
          $r0 = "0,13 0,14:Trolls and Ogres";
          break;
        }
      }
      break;
    }
    case 21: {
      switch (i) {
        case 1: {
          $r0 = "6,13:Dead Elf";
          break;
        }
        case 2: {
          $r0 = "7,11 8,11:Undead Patrol Area";
          break;
        }
        case 3: {
          $r0 = "1,10:Scorpions";
          break;
        }
        case 4: {
          $r0 = "2,8 3,8 2,9 3,9:Fungus";
          break;
        }
        case 5: {
          $r0 = "14,7:Poisonous Frogs";
          break;
        }
        case 6: {
          $r0 = "7,4 8,4:Hobgoblin and Orc Assault";
          break;
        }
        case 7: {
          $r0 = "5,3:Haunts";
          break;
        }
        case 8: {
          $r0 = "7,10 8,10:Ferran Martinez";
          break;
        }
        case 9: {
          $r0 = "13,3 14,3:The Armory";
          break;
        }
        case 10: {
          $r0 = "12,0 13,0 12,1 13,1:Secret Treasure Room";
          break;
        }
      }
      break;
    }
    case 22: {
      switch (i) {
        case 1: {
          $r0 = "13,4:Dead body and partial map";
          break;
        }
        case 2: {
          $r0 = "13,15:A crazy priest";
          break;
        }
        case 3: {
          $r0 = "14,7:A0. Forward A1+, reverse B1";
          break;
        }
        case 4: {
          $r0 = "15,7:A3-. From A2 in reverse";
          break;
        }
        case 5: {
          $r0 = "14,8:B0. Teleporter to B1";
          break;
        }
        case 6: {
          $r0 = "5,11:B1. From B0";
          break;
        }
        case 7: {
          $r0 = "14,9:B2. Teleporter to B3";
          break;
        }
        case 8: {
          $r0 = "0,0:B3. From B2";
          break;
        }
        case 9: {
          $r0 = "6,1:B4. Teleporter to B5";
          break;
        }
      }
      break;
    }
    case 23: {
      switch (i) {
        case 1: {
          $r0 = "14,10:Angered mutant lizards";
          break;
        }
        case 2: {
          $r0 = "2,14:Lizard men in a cell";
          break;
        }
        case 3: {
          $r0 = "4,15:A1+. From A0";
          break;
        }
        case 4: {
          $r0 = "15,12:A2. Forward A3+, reverse A3-";
          break;
        }
        case 5: {
          $r0 = "11,3:A3+. From A2";
          break;
        }
        case 6: {
          $r0 = "12,3:A4. Forward A5+, reverse A5-";
          break;
        }
        case 7: {
          $r0 = "14,12:A5-. From A4 in reverse";
          break;
        }
        case 8: {
          $r0 = "0,12:B5. From B4";
          break;
        }
        case 9: {
          $r0 = "15,8:B6. Teleporter to B7";
          break;
        }
        case 10: {
          $r0 = "3,13:B7. From B6";
          break;
        }
        case 11: {
          $r0 = "1,1:Password over the door";
          break;
        }
        case 12: {
          $r0 = "2,1 3,1:The machinery";
          break;
        }
        case 13: {
          $r0 = "5,5:Captured lizard men";
          break;
        }
        case 14: {
          $r0 = "5,1:Yarash's Office";
          break;
        }
        case 15: {
          $r0 = "0,4:A5+. From A4";
          break;
        }
        case 16: {
          $r0 = "0,2:A6. Forward A7+, reverse A7-";
          break;
        }
        case 17: {
          $r0 = "0,0:A7+. From A6";
          break;
        }
        case 18: {
          $r0 = "13,3:A7-. From A6 in reverse";
          break;
        }
        case 19: {
          $r0 = "6,0:C0. Teleporter dial";
          break;
        }
        case 20: {
          $r0 = "5,9:C1. Treasure room (Copper)";
          break;
        }
      }
      break;
    }
    case 24: {
      switch (i) {
        case 1: {
          $r0 = "2,7 2,8:Temple Entrance";
          break;
        }
        case 2: {
          $r0 = "5,5 12,9 9,12:Hidden Treasures";
          break;
        }
        case 3: {
          $r0 = "14,7 14,8:Altar";
          break;
        }
      }
      break;
    }
    case 28: {
      switch (i) {
        case 1: {
          $r0 = "7,0 8,0:The Front Gate";
          break;
        }
        case 2: {
          $r0 = "0,0 1,0 0,1 1,1 14,0 15,0 14,1 15,1 0,14 1,14 0,15 1,15 14,14 15,14 14,15 15,15 6,6 9,6:Guard Towers";
          break;
        }
        case 3: {
          $r0 = "6,9 7,9:Commandant's Quarters";
          break;
        }
        case 4: {
          $r0 = "5,0 6,0 5,1 6,1 9,0 10,0 9,1 10,1:The Party's Quarters";
          break;
        }
        case 5: {
          $r0 = "5,3 10,3 3,5 12,4 12,5 3,11 12,11 12,12 5,13 10,13:Barracks";
          break;
        }
        case 6: {
          $r0 = "12,8:Stables";
          break;
        }
      }
      break;
    }
    case 29: {
      switch (i) {
        case 1: {
          $r0 = "2,2 3,2 2,3 3,3 5,1 6,1 9,0 10,0 8,2 9,2:Sickly kobolds";
          break;
        }
        case 2: {
          $r0 = "7,4 11,5 11,7 2,8 9,10:Kobolds guard the well";
          break;
        }
        case 3: {
          $r0 = "7,7:Kuto's Well";
          break;
        }
        case 4: {
          $r0 = "7,13:Lizard man patrol";
          break;
        }
        case 5: {
          $r0 = "7,14:A hag on a rug";
          break;
        }
      }
      break;
    }
    case 30: {
      switch (i) {
        case 1: {
          $r0 = "13,1:Holes";
          break;
        }
        case 2: {
          $r0 = "1,7:Holes";
          break;
        }
        case 3: {
          $r0 = "4,15:Holes";
          break;
        }
        case 4: {
          $r0 = "4,5:Holes";
          break;
        }
        case 5: {
          $r0 = "7,10:Holes";
          break;
        }
        case 6: {
          $r0 = "10,4:Holes";
          break;
        }
        case 7: {
          $r0 = "10,8:Stairs";
          break;
        }
        case 8: {
          $r0 = "2,1 3,1 10,0 10,1 10,3 11,3 9,5 6,8 2,9 3,9 6,14 12,13 12,14 12,15 14,13:Pools";
          break;
        }
      }
      break;
    }
    case 31: {
      switch (i) {
        case 1: {
          $r0 = "11,6 14,5 10,9:Mansion Entrances";
          break;
        }
        case 2: {
          $r0 = "5,6 6,6 8,5 8,6 11,5 14,6:Hidden Treasures";
          break;
        }
        case 3: {
          $r0 = "14,8:Goblin Slaves";
          break;
        }
        case 4: {
          $r0 = "6,8:Mansion Guards";
          break;
        }
        case 5: {
          $r0 = "8,12:Manor Guards";
          break;
        }
        case 6: {
          $r0 = "9,14 10,14 9,15 10,15:Orc Bedroom";
          break;
        }
        case 7: {
          $r0 = "5,14 6,14 5,15 6,15:Orc Jail";
          break;
        }
      }
      break;
    }
    case 32: {
      switch (i) {
        case 1: {
          $r0 = "7,7:Lower part of Kuto's Well";
          break;
        }
        case 2: {
          $r0 = "7,8 2,10 4,13 4,14:Kobold archers";
          break;
        }
        case 3: {
          $r0 = "10,3 1,5 5,5:Norris The Gray & his horde";
          break;
        }
        case 4: {
          $r0 = "13,1:Norris The Gray's loot";
          break;
        }
      }
      break;
    }
  }
  return $r0;
}

export function EntrySquare(e: string, k: number, x: number, y: number) {
  let p: number = 0, n: number = 0, v: number = 0, coord: number = 0, $r0: boolean = false;
  $r0 = false;
  p = 1;
  n = 0;
  while ((p <= e.length) && (rt.chAt(e, p) !== 58)) {
    for (let $i2 = 1; $i2 <= 2; $i2++) {
      coord = $i2;
      v = 0;
      let $t3;
      if ((p > e.length) || !($t3 = rt.chAt(e, p), ($t3 >= 48 && $t3 <= 57))) {
        return $r0;
      }
      let $t5;
      while ((p <= e.length) && ($t5 = rt.chAt(e, p), ($t5 >= 48 && $t5 <= 57))) {
        v = (((v * 10) + rt.chAt(e, p)) - 48) << 16 >> 16;
        p = (p + 1) & 255;
      }
      if (v > 15) {
        return $r0;
      }
      if (coord === 1) {
        U8[x] = v;
        if ((p > e.length) || (rt.chAt(e, p) !== 44)) {
          return $r0;
        }
        p = (p + 1) & 255;
      } else {
        U8[y] = v;
      }
    }
    n = (n + 1) & 255;
    if (n === k) {
      $r0 = true;
      return $r0;
    }
    if ((p <= e.length) && (rt.chAt(e, p) === 32)) {
      p = (p + 1) & 255;
    }
  }
  return $r0;
}

export function EntryText(e: string) {
  let $r0: string = "";
  $r0 = rt.Copy(e, rt.Pos(":", e) + 1, 30);
  return $r0;
}
