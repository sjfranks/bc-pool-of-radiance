{ The web port's Crt: the colour constants, and the keyboard and timing routines on Host, as src/native/crt.pas. }
unit Crt;

interface

const
  Black = 0;
  Blue = 1;
  Green = 2;
  Cyan = 3;
  Red = 4;
  Magenta = 5;
  Brown = 6;
  LightGray = 7;
  DarkGray = 8;
  LightBlue = 9;
  LightGreen = 10;
  LightCyan = 11;
  LightRed = 12;
  LightMagenta = 13;
  Yellow = 14;
  White = 15;
  Blink = 128;

var
  CheckBreak: Boolean;

function ReadKey: Char;
function KeyPressed: Boolean;
procedure Delay(ms: Word);
procedure Sound(hz: Word);
procedure NoSound;

implementation

uses Host;

var
  pendingScan: Byte;

function ReadKey: Char;
var
  key: Word;
begin
  if pendingScan <> 0 then begin
    ReadKey := Chr(pendingScan);
    pendingScan := 0;
    Exit;
  end;
  if not Host.KeyWaiting then
    Host.WaitKey;
  key := Host.PopKey;
  if Lo(key) = 0 then
    pendingScan := Hi(key);
  ReadKey := Chr(Lo(key));
end;

function KeyPressed: Boolean;
begin
  if (pendingScan = 0) and not Host.KeyWaiting then begin
    Host.Idle;
    KeyPressed := Host.KeyWaiting;
  end else
    KeyPressed := True;
end;

procedure Delay(ms: Word);
begin
  Host.Sleep(ms);
end;

procedure Sound(hz: Word);
begin
end;

procedure NoSound;
begin
end;

begin
  CheckBreak := True;
end.
