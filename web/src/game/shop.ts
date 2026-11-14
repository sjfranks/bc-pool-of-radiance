// Generated from src/shop.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as C_MSG from './c_msg';
import * as C_SPELL from './c_spell';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as EclMenu from './eclmenu';
import * as ViewChar from './viewchar';
import * as Money from './money';
import * as C_IFC from './c_ifc';
import * as CharHlp from './charhlp';
import * as MenuCore from './menucore';
import * as TextRend from './textrend';
import * as CharDisp from './chardisp';
import * as MoneyCal from './moneycal';
import * as Party from './party';
import * as Magic from './magic';
import * as ShopBuy from './shopbuy';


export async function ShopMainMenu() {
  (await CounterMenu(false, 20));
}

export async function CounterMenu(atTemple: boolean, command: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 50);
  let done: boolean = false, c: number = 0;
  U8[141176] = 1;
  (await CharDisp.DisplayNoncombatInterface());
  (await CharDisp.DisplayParty(r32(143749)));
  rt.fill(144862, 28, 0);
  done = false;
  if (atTemple) {
    wS($f0 + 41, 4, "Heal");
  } else {
    wS($f0 + 41, 4, "Buy");
    CharHlp.LabelItems(r32(144890));
  }
  do {
    Money.DetermineTreasure($f0 + 47, $f0 + 48);
    if ((U8[$f0 + 47] !== 0)) {
      wS($f0, 40, rS($f0 + 41) + " View Take Pool Share Appraise Exit");
    } else {
      wS($f0, 40, rS($f0 + 41) + " View Pool Appraise Exit");
    }
    c = (await MenuCore.MenuHorizontal("", rS($f0), 13, 10, 15, true, false, $f0 + 46)) & 255;
    if ((U8[$f0 + 46] !== 0)) {
      if ((await ViewChar.AltItems(c))) {
        (await CharDisp.DisplayNoncombatInterface());
      } else {
        Party.SelectPrevNextChar(c);
      }
    } else {
      switch (c) {
        case 66: {
          if (!atTemple) {
            (await rt.FT[command]());
          }
          break;
        }
        case 72: {
          if (atTemple) {
            (await rt.FT[command]());
          }
          break;
        }
        case 86: {
          (await ViewChar.ViewCharMenu($f0 + 46));
          break;
        }
        case 84: {
          if ((U8[$f0 + 47] !== 0)) {
            (await Money.TakeMoneyMenu());
          }
          break;
        }
        case 80: {
          Money.PoolMoney();
          break;
        }
        case 83: {
          if ((U8[$f0 + 47] !== 0)) {
            Money.ShareMoney();
          }
          break;
        }
        case 65: {
          (await Money.AppraiseMenu($f0 + 49));
          break;
        }
        case 69: {
          Money.DetermineTreasure($f0 + 47, $f0 + 48);
          if (atTemple) {
            done = !(U8[$f0 + 47] !== 0) || !(await Money.GoBackForIt("As you leave a priest says, \"Excuse me but you have left some money here\" ", "Do you want to go back and retrieve your money?"));
          } else {
            done = !(U8[$f0 + 47] !== 0) || !(await Money.GoBackForIt("As you Leave the Shopkeeper says, \"Excuse me but you have Left Some Money here.\"  ", "Do you want to go back and get your Money?"));
          }
          break;
        }
      }
      switch (c) {
        case 66: case 84: {
          (await CharDisp.DisplayNoncombatInterface());
          break;
        }
        case 65: {
          if ((U8[$f0 + 49] !== 0)) {
            (await CharDisp.DisplayNoncombatInterface());
          }
          break;
        }
      }
    }
    (await CharDisp.DisplayParty(r32(143749)));
  } while (!(done));
  S.sp = $sp;
}

export async function GiveItemCopyToCreature(item: number, failed: number) {
  if (ViewChar.CannotCarryItem(r32(143749), item)) {
    (await CharDisp.PrintBottomLine("OverLoaded"));
    U8[failed] = true ? 1 : 0;
  } else {
    U8[failed] = false ? 1 : 0;
    (await CharHlp.AddToInventory(r32(143749), item));
    CharHlp.RecalcStats(r32(143749));
  }
}

export async function BuyItem(item: number) {
  const $sp = S.sp, $f0 = (S.sp = $sp - 1);
  let price: number = 0, payer: number = 0;
  if ((await WantsItem(item))) {
    price = r16(item + 58);
    payer = MoneyCal.WhoPays(r32(143749), price) & 255;
    if (payer === 0) {
      (await CharDisp.PrintBottomLine("Not enough money."));
    } else {
      (await GiveItemCopyToCreature(item, $f0));
      if (!(U8[$f0] !== 0)) {
        Money.PayBy(r32(143749), payer, price);
      }
    }
  }
  S.sp = $sp;
}

export async function WantsItem(item: number) {
  let i: number = 0, id: number = 0, spells: number = 0, lines: number = 0, lastLevel: number = 0, headings: boolean = false, row: number = 0, $r0: boolean = false;
  $r0 = true;
  if (CharHlp.ItemReadable(item) && (U8[item + 53] === 0)) {
    spells = 0;
    lines = 0;
    lastLevel = 0;
    for (let $i1 = 1; $i1 <= 3; $i1++) {
      i = $i1;
      id = CharHlp.ScrollSpellAt(item, i) & 255;
      if (id !== 0) {
        spells = (spells + 1) & 255;
        lines = (lines + 1) & 255;
        if (I8[id * 16 + 136507] !== lastLevel) {
          lastLevel = I8[id * 16 + 136507];
          lines = (lines + 1) & 255;
        }
      }
    }
    if (spells > 0) {
      (await CharDisp.MessageText("The scroll holds:", 10, true));
      row = U8[143770];
      headings = (row + lines) <= 22;
      lastLevel = 0;
      for (let $i2 = 1; $i2 <= 3; $i2++) {
        i = $i2;
        id = CharHlp.ScrollSpellAt(item, i) & 255;
        if (id !== 0) {
          if (headings && (I8[id * 16 + 136507] !== lastLevel)) {
            lastLevel = I8[id * 16 + 136507];
            row = (row + 1) & 255;
            TextRend.DisplayString(1, row, 13, Magic.LevelHeading(lastLevel));
          }
          row = (row + 1) & 255;
          if (row <= 22) {
            TextRend.DisplayString(1, row, 15, Magic.SpellLine(r32(143749), id, 2));
          }
        }
      }
      $r0 = (await MenuCore.YesNoMenu("Buy it? ", 13, 10, 15)) === 89;
    }
  }
  return $r0;
}

export async function ShopBuyMenu() {
  (await ShopBuy.BuyScreen());
}
