{ The web port's GameDirs. The page's file store is one DOS-style folder, C:\POOLRAD\, holding the game's data and
  everything the game writes; there is nothing to search for. }
unit GameDirs;

interface

type
  TOs = (OS_LINUX, OS_MAC, OS_WINDOWS);

const
  THIS_OS = OS_LINUX;
  GAME_FOLDER = 'C:\POOLRAD\';

var
  dataFolder: string;
  writeFolder: string;

{ The folder a file of the port's own (RAVFULL.DAX, SBSFX.DAT) is in. }
function OwnFolder(name: string): string;
{ The file name (POOL.CFG) as the game reads it. }
function ReadName(name: string): string;

implementation

function OwnFolder(name: string): string;
begin
  OwnFolder := dataFolder;
end;

function ReadName(name: string): string;
begin
  ReadName := writeFolder + name;
end;

begin
  dataFolder := GAME_FOLDER;
  writeFolder := GAME_FOLDER;
end.
