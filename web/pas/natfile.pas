{ The web port's NatFile. The page's file store takes DOS names as they are (backslashes, any case), so a name's
  native form is the name. }
unit NatFile;

interface

function NativeName(name: string): string;
function SameName(a, b: string): Boolean;

implementation

function NativeName(name: string): string;
begin
  NativeName := name;
end;

function SameName(a, b: string): Boolean;
var
  i: Integer;
begin
  SameName := False;
  if Length(a) <> Length(b) then
    Exit;
  for i := 1 to Length(a) do
    if UpCase(a[i]) <> UpCase(b[i]) then
      Exit;
  SameName := True;
end;

end.
