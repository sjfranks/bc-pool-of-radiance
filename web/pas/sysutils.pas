{ The web port's SysUtils: the few routines the game's units take from Free Pascal's (web/src/host/x_sysutils.ts). }
unit SysUtils;

interface

function GetTickCount64: Int64; external;
function DirectoryExists(name: string): Boolean; external;
function FileExists(name: string): Boolean; external;

implementation

end.
