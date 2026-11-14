{ The web port's sound output, in the place of the native ports' SdlSound: the page asks for samples (Pull) as its
  audio output needs them, and SndChip renders them, running the sequencer's ticks at their sample positions. Until the
  page has an output (a browser gives none before the first touch), the sequencer keeps time by the clock. }
unit SdlSound;

interface

const
  CHUNK = 4096;

{ Render count samples (at most CHUNK), 16 bits each, and return where they are. }
function Pull(count: LongInt): Pointer;
{ The page's audio output is running: Pull keeps the sequencer's time from now on. }
procedure Open;
{ The output has stopped: the clock keeps the time again. }
procedure Close;

implementation

uses SndSeq, SndChip;

var
  buf: array[0..CHUNK - 1] of SmallInt;

function Pull(count: LongInt): Pointer;
begin
  if count > CHUNK then
    count := CHUNK;
  SndChip.Render(@buf[0], count);
  Pull := @buf;
end;

procedure Open;
begin
  SndSeq.Rendered := True;
end;

procedure Close;
begin
  SndSeq.Rendered := False;
end;

begin
  SndSeq.PortWrite := SndChip.Write;
end.
