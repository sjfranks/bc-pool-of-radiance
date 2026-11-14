{ The web port's Host: the PC services the game uses, as src/native/host.pas gives them to the native ports. The screen
  (mode 13h's memory), the DAC and the video BIOS's functions are here in Pascal, as there; the keyboard and the clock
  are the page's (web/src/host/x_host.ts). }
unit Host;

interface

const
  SCREEN_WIDTH = 320;
  SCREEN_HEIGHT = 200;
  TEXT_MODE = 3;
  VGA_MODE = $13;

type
  TScreen = array[0..SCREEN_WIDTH * SCREEN_HEIGHT - 1] of Byte;

  Registers = record
    case Integer of
      0: (ax, bx, cx, dx, bp, si, di, ds, es, flags: Word);
      1: (al, ah, bl, bh, cl, ch, dl, dh: Byte);
  end;

var
  screen: TScreen;
  dac: array[0..255, 0..2] of Byte;
  videoMode: Byte;

{ Give the page a turn: it draws the screen and takes its input. }
procedure Service; external 'async';
{ Wait until a key is in the buffer. }
procedure WaitKey; external 'async';
{ Called where the game polls and found nothing: waits a moment when the game is only polling. }
procedure Idle; external 'async';
{ Wait ms milliseconds. }
procedure Sleep(ms: LongInt); external 'async';

procedure PushKey(scan, ch: Byte); external;
function KeyWaiting: Boolean; external;
function PopKey: Word; external;
function BiosTicks: LongInt; external;

procedure Intr(intNo: Byte; var regs: Registers);

implementation

{$I BIOSFONT.INC}

var
  cursorRow: array[0..7] of Byte;
  cursorCol: array[0..7] of Byte;

procedure WriteBiosChars(col, row, ch, color: Byte; count: Word);
var
  n: Word;
  r: Byte;
  k: Byte;
  bits: Byte;
  ofs: LongInt;
begin
  n := 0;
  while (n < count) and (col + n < SCREEN_WIDTH div 8) and (row < SCREEN_HEIGHT div 8) do begin
    for r := 0 to 7 do begin
      if ch < 128 then
        bits := BIOS_FONT[ch, r]
      else
        bits := 0;
      ofs := (LongInt(row) * 8 + r) * SCREEN_WIDTH + (col + n) * 8;
      for k := 0 to 7 do
        if (bits and ($80 shr k)) = 0 then
          screen[ofs + k] := 0
        else if (color and $80) <> 0 then
          screen[ofs + k] := screen[ofs + k] xor (color and $7F)
        else
          screen[ofs + k] := color;
    end;
    Inc(n);
  end;
end;

procedure Intr(intNo: Byte; var regs: Registers);
begin
  if intNo <> $10 then
    Exit;
  case regs.ah of
    0: begin
         videoMode := regs.al and $7F;
         if videoMode = VGA_MODE then
           FillChar(screen, SizeOf(screen), 0);
       end;
    2: begin
         cursorRow[regs.bh and 7] := regs.dh;
         cursorCol[regs.bh and 7] := regs.dl;
       end;
    9: if videoMode = VGA_MODE then
         WriteBiosChars(cursorCol[regs.bh and 7], cursorRow[regs.bh and 7], regs.al, regs.bl, regs.cx);
    $F: regs.al := videoMode;
  end;
end;

begin
  videoMode := TEXT_MODE;
end.
