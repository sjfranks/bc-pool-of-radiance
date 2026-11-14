// Generated from src/vaultmnu.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as GameVars from './gamevars';
import * as C_IFC from './c_ifc';
import * as C_KEYS from './c_keys';
import * as CharDisp from './chardisp';
import * as CharHlp from './charhlp';
import * as MenuCore from './menucore';
import * as Money from './money';
import * as Party from './party';
import * as PostCbt from './postcbt';
import * as TextRend from './textrend';
import * as Vault from './vault';
import * as ViewChar from './viewchar';
import * as TpRand from './tprand';


export async function VaultMenu() {
  const $sp = S.sp, $f0 = (S.sp = $sp - 44);
  let c: number = 0, done: boolean = false;
  U8[227062] = 8;
  (await CharDisp.DisplayNoncombatInterface());
  CharDisp.DisplayParty(r32(229635));
  Vault.ReadVault();
  if (Vault.WasVisited() && (TpRand.Random(20) === 0)) {
    (await TextRend.ShowMessage(10, true, "OH, YOU'RE ALIVE... I MEAN  WELCOME BACK!"));
  } else {
    (await TextRend.ShowMessage(10, true, "WELCOME TO THE HOARDER'S RESPITE. LET ME LIGHTEN YOUR LOAD."));
  }
  done = false;
  do {
    Money.DetermineTreasure($f0 + 42, $f0 + 43);
    wS($f0, 40, "View");
    if ((U8[$f0 + 42] !== 0) || (U8[$f0 + 43] !== 0)) {
      wS($f0, 40, rS($f0) + " Take");
    }
    wS($f0, 40, rS($f0) + " Pool");
    if ((U8[$f0 + 42] !== 0)) {
      wS($f0, 40, rS($f0) + " Share");
    }
    wS($f0, 40, rS($f0) + " Exit");
    c = (await MenuCore.MenuHorizontal("", rS($f0), 13, 10, 15, true, false, $f0 + 41)) & 255;
    if ((U8[$f0 + 41] !== 0)) {
      if ((await ViewChar.AltItems(c))) {
        (await CharDisp.DisplayNoncombatInterface());
      } else {
        Party.SelectPrevNextChar(c);
      }
    } else {
      switch (c) {
        case 86: {
          (await ViewChar.ViewCharMenu($f0 + 41));
          break;
        }
        case 84: {
          if ((U8[$f0 + 42] !== 0) || (U8[$f0 + 43] !== 0)) {
            (await PostCbt.LootTakeMenu($f0 + 42, $f0 + 43));
            (await CharDisp.DisplayNoncombatInterface());
          }
          break;
        }
        case 80: {
          Money.PoolMoney();
          break;
        }
        case 83: {
          if ((U8[$f0 + 42] !== 0)) {
            Money.ShareMoney();
          }
          break;
        }
        case 69: case 0: {
          done = (await Vault.WriteVault()) || ((await MenuCore.YesNoMenu("Leave anyway? ", 14, 10, 15)) === 89);
          break;
        }
      }
    }
    CharDisp.DisplayParty(r32(229635));
  } while (!(done));
  CharHlp.ClearTreasure();
  S.sp = $sp;
}
