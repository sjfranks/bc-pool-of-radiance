{ What the page's interface asks of the game's state, in the game's own terms: where the battlefield's view is and
  where the fighter whose turn it is stands, so that a tap on the battlefield can be turned into steps. }
unit WebPeek;

interface

{ The arena cell at the view's upper left; -1 when there is no arena. }
function ViewX: Integer;
function ViewY: Integer;
{ The arena cell of the creature whose turn it is; -1 when it is not on the map. }
function ActorX: Integer;
function ActorY: Integer;
{ What stands on an arena cell for the creature whose turn it is: 0 open ground, 1 ground that cannot be crossed,
  2 a creature of its own side, 3 a foe. }
function CellKind(x, y: Integer): Integer;

implementation

uses Types, GameDefs, GameVars, CbtMap, CharHlp;

function ViewX: Integer;
begin
  if GameVars.arenaPtr = nil then
    ViewX := -1
  else
    ViewX := GameVars.arenaPtr^.ox;
end;

function ViewY: Integer;
begin
  if GameVars.arenaPtr = nil then
    ViewY := -1
  else
    ViewY := GameVars.arenaPtr^.oy;
end;

function ActorX: Integer;
begin
  if (GameVars.curChar = nil) or (CbtMap.CombatSlot(GameVars.curChar) = 0) then
    ActorX := -1
  else
    ActorX := CbtMap.CombatCellX(GameVars.curChar);
end;

function ActorY: Integer;
begin
  if (GameVars.curChar = nil) or (CbtMap.CombatSlot(GameVars.curChar) = 0) then
    ActorY := -1
  else
    ActorY := CbtMap.CombatCellY(GameVars.curChar);
end;

function CellKind(x, y: Integer): Integer;
var
  crIdx: Byte;
  terrIdx: Byte;
begin
  CellKind := 1;
  if (GameVars.arenaPtr = nil) or (GameVars.curChar = nil) then
    Exit;
  if (x < 0) or (y < 0) or (x > Types.ARENA_LAST_X) or (y > Types.ARENA_LAST_Y) then
    Exit;
  CbtMap.GetArenaContents(x, y, crIdx, terrIdx);
  if (crIdx > 0) and (GameVars.creatureArr[crIdx] <> nil) then begin
    if GameVars.creatureArr[crIdx] = GameVars.curChar then
      CellKind := 0
    else if CharHlp.EnemyTeam(GameVars.creatureArr[crIdx]) = CharHlp.Team(GameVars.curChar) then
      CellKind := 3
    else
      CellKind := 2;
  end else if GameDefs.terrainInfo[terrIdx].cost = 255 then
    CellKind := 1
  else
    CellKind := 0;
end;

end.
