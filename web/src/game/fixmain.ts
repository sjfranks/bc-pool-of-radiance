// Generated from src/fixmain.pas by web/tools/pas2ts. Do not edit: change the Pascal and run "npm run gen".
// @ts-nocheck
import { U8, I8, S, r16, ri16, r32, ri32, w16, w32, rF64, wF64, rF32, wF32, rS, wS, mv } from '../rt/mem';
import * as rt from '../rt/sys';
import * as Types from './types';
import * as Crt from './crt';
import * as Dos from './dos';
import * as GameDefs from './gamedefs';
import * as GameVars from './gamevars';
import * as SoundDrv from './sounddrv';
import * as GameIo from './gameio';
import * as DaxIo from './daxio';
import * as TextRend from './textrend';
import * as Blit from './blit';
import * as VidVga from './vidvga';
import * as GameBoot from './gameboot';
import * as Sym8x8 from './sym8x8';
import * as Border from './border';
import * as Debug from './debug';
import * as MapTiles from './maptiles';
import * as CbtMap from './cbtmap';
import * as Pathing from './pathing';
import * as View3D from './view3d';
import * as Portrait from './portrait';
import * as Wilds from './wilds';
import * as MapView from './mapview';
import * as MenuCore from './menucore';
import * as CharHlp from './charhlp';
import * as CharDisp from './chardisp';
import * as FxEngine from './fxengine';
import * as ClassCal from './classcal';
import * as Magic from './magic';
import * as Money from './money';
import * as MoneyCal from './moneycal';
import * as RandItem from './randitem';
import * as GameTime from './gametime';
import * as ViewChar from './viewchar';
import * as Ending from './ending';
import * as VidOps from './vidops';
import * as PicCga from './piccga';
import * as PicEga from './picega';
import * as PicTdy from './pictdy';
import * as PicVga from './picvga';
import * as UsualSpl from './usualspl';
import * as SaveLoad from './saveload';
import * as CharGen from './chargen';
import * as Camp from './camp';
import * as Journal1 from './journal1';
import * as Journal2 from './journal2';
import * as Journal3 from './journal3';
import * as Journal4 from './journal4';
import * as JrnlList from './jrnllist';
import * as JrnlQst from './jrnlqst';
import * as JrnlView from './jrnlview';
import * as Options from './options';
import * as CbtLog from './cbtlog';
import * as LogWrap from './logwrap';
import * as LogView from './logview';
import * as Explore from './explore';
import * as CbtActs from './cbtacts';
import * as EffHndlr from './effhndlr';
import * as GameInit from './gameinit';
import * as CombatSt from './combatst';
import * as CombatAi from './combatai';
import * as Combat from './combat';
import * as EclVars from './eclvars';
import * as EclMenu from './eclmenu';
import * as Shop from './shop';
import * as ShopBuy from './shopbuy';
import * as PostCbt from './postcbt';
import * as TownCore from './towncore';
import * as Temple from './temple';
import * as EclVm from './eclvm';
import * as BldShow from './bldshow';
import * as DataPat from './datapat';
import * as DataBld from './databld';
import * as Intro from './intro';
import * as HeapErr from './heaperr';
import * as SaveMenu from './savemenu';
import * as AreaName from './areaname';
import * as Vault from './vault';
import * as VaultMnu from './vaultmnu';
import * as EclTrace from './ecltrace';
import * as KeyHelp from './keyhelp';
import * as Advisory from './advisory';
import * as Demo from './demo';
import * as CbtMini from './cbtmini';
import * as WideView from './wideview';


export async function $init() {
  (await GameInit.GameInit2());
  (await DataBld.BuildDataFiles());
  if (!(U8[141208] !== 0)) {
    (await Intro.Introduction());
    while ((await Crt.KeyPressed())) {
      (await GameIo.DiscardPendingKeys());
    }
  }
  (await SoundDrv.StopMusic());
  Advisory.Measure();
  (await Advisory.Show());
  Vault.ForgetSessionVault();
  while (true) {
    (await CharGen.MainMenu(false, false));
    if ((U8[141212] !== 0)) {
      (await Demo.Run());
    } else {
      View3D.SetView3DColors(11, 0, 7, 6);
      (await EclVm.GameLoop());
      while ((U8[250681] !== 0) || (U8[141221] !== 0)) {
        if ((U8[250681] !== 0)) {
          U8[250681] = false ? 1 : 0;
          (await SaveLoad.QuickLoad());
        }
        (await EclVm.GameLoop());
      }
      SaveLoad.FreeParty();
      Vault.ForgetSessionVault();
      (await GameInit.ResetGameState());
    }
  }
}
