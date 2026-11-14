{ The web port's Dos: the part of Turbo Pascal's Dos unit the game uses, on the page's clock and its file store
  (web/src/host/x_dos.ts). }
unit Dos;

interface

uses Host;

const
  ReadOnly = $01;
  Hidden = $02;
  SysFile = $04;
  VolumeID = $08;
  Directory = $10;
  Archive = $20;
  AnyFile = $3F;
  FCarry = $0001;

type
  PathStr = string[255];
  DirStr = string[255];
  NameStr = string[255];
  ExtStr = string[255];
  ComStr = string[127];
  Registers = Host.Registers;
  SearchRec = record
    fill: array[1..21] of Byte;
    attr: Byte;
    time: LongInt;
    size: LongInt;
    name: string[255];
  end;
  DateTime = record
    year, month, day, hour, min, sec: Word;
  end;

var
  DosError: Integer;

{ Tells the page's side where DosError is. }
procedure Bind(var error: Integer); external;
procedure GetDate(var year, month, mday, wday: Word); external;
procedure GetTime(var hour, minute, second, sec100: Word); external;
procedure FindFirst(path: PathStr; attr: Word; var f: SearchRec); external;
procedure FindNext(var f: SearchRec); external;
procedure FindClose(var f: SearchRec); external;
procedure GetFTime(var f; var time: LongInt); external;
procedure GetFAttr(var f; var attr: Word); external;
procedure SetFAttr(var f; attr: Word); external;
procedure SetFTime(var f; time: LongInt); external;
procedure UnpackTime(p: LongInt; var t: DateTime);
procedure PackTime(var t: DateTime; var p: LongInt);
function FExpand(path: PathStr): PathStr; external;
function DiskFree(drive: Byte): LongInt;
function GetEnv(name: string): string;
function DosExitCode: Word;
procedure Intr(intNo: Byte; var regs: Registers);
procedure MsDos(var regs: Registers);
procedure SwapVectors;
procedure Exec(path, cmd: string);
procedure GetIntVec(intNo: Byte; var vec: Pointer);
procedure SetIntVec(intNo: Byte; vec: Pointer);
procedure FSplit(path: PathStr; var dir: DirStr; var name: NameStr; var ext: ExtStr);

implementation

procedure UnpackTime(p: LongInt; var t: DateTime);
begin
  t.sec := (p and 31) * 2;
  t.min := (p shr 5) and 63;
  t.hour := (p shr 11) and 31;
  t.day := (p shr 16) and 31;
  t.month := (p shr 21) and 15;
  t.year := ((p shr 25) and 127) + 1980;
end;

procedure PackTime(var t: DateTime; var p: LongInt);
begin
  p := (LongInt(t.year - 1980) shl 25) or (LongInt(t.month) shl 21) or (LongInt(t.day) shl 16) or
       (LongInt(t.hour) shl 11) or (t.min shl 5) or (t.sec div 2);
end;

function DiskFree(drive: Byte): LongInt;
begin
  DiskFree := 64 * 1024 * 1024;
end;

function GetEnv(name: string): string;
begin
  GetEnv := '';
end;

function DosExitCode: Word;
begin
  DosExitCode := 0;
end;

procedure Intr(intNo: Byte; var regs: Registers);
begin
  Host.Intr(intNo, regs);
end;

procedure MsDos(var regs: Registers);
begin
end;

procedure SwapVectors;
begin
end;

procedure Exec(path, cmd: string);
begin
  DosError := 2;
end;

procedure GetIntVec(intNo: Byte; var vec: Pointer);
begin
  vec := nil;
end;

procedure SetIntVec(intNo: Byte; vec: Pointer);
begin
end;

procedure FSplit(path: PathStr; var dir: DirStr; var name: NameStr; var ext: ExtStr);
var
  i, dot: Integer;
begin
  i := Length(path);
  while (i > 0) and not (path[i] in ['\', '/', ':']) do
    Dec(i);
  dir := Copy(path, 1, i);
  name := Copy(path, i + 1, 255);
  dot := 0;
  for i := 1 to Length(name) do
    if name[i] = '.' then
      dot := i;
  if dot > 0 then begin
    ext := Copy(name, dot, 255);
    name := Copy(name, 1, dot - 1);
  end else
    ext := '';
end;

begin
  Bind(DosError);
end.
