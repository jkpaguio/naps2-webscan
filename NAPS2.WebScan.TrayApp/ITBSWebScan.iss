; Inno Setup Script for ITBS WebScan Tray App
; Updated with ITBS branding

#define MyAppName "ITBS WebScan"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "ITBS Corp."
#define MyAppExeName "NAPS2.WebScan.TrayApp.exe"

[Setup]
AppId={{8A7B3C2D-1E4F-5A6B-9C8D-7E6F5A4B3C2D}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\installer
OutputBaseFilename=ITBSWebScan-Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest

[Tasks]
Name: "autostart"; Description: "Start {#MyAppName} automatically when Windows starts"; GroupDescription: "Additional options:"; Flags: checkedonce

[Files]
; Include all files from your build output
Source: "D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\bin\Release\net10.0-windows\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{autostartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: autostart

[Registry]
; Auto-start registry entry (only if user selected the option)
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "ITBSWebScan"; ValueData: """{app}\{#MyAppExeName}"""; Flags: uninsdeletevalue; Tasks: autostart

[Run]
; Offer to launch the app after installation
Filename: "{app}\{#MyAppExeName}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall skipifsilent

[UninstallRun]
; Stop the app before uninstalling
Filename: "taskkill"; Parameters: "/F /IM {#MyAppExeName}"; Flags: runhidden

[Code]
// Stop any running instances before installation
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  Exec('taskkill', '/F /IM NAPS2.WebScan.TrayApp.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Result := True;
end;
