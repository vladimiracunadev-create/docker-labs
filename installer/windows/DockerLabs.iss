#define AppName "Docker Labs"
#define AppPublisher "Vladimir Acuna Dev"
#ifndef AppVersion
  #define AppVersion "0.0.0-local"
#endif
#ifndef SourceDir
  #error SourceDir define is required.
#endif
#ifndef OutputDir
  #error OutputDir define is required.
#endif
#ifndef VersionedInstallerName
  #define VersionedInstallerName "docker-labs-setup-" + AppVersion + "-win-x64"
#endif

[Setup]
AppId={{0B0C34AA-7D7D-4E9B-9F0F-1C4E5A1810D2}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={localappdata}\Programs\DockerLabs
DefaultGroupName={#AppName}
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
DisableDirPage=no
DisableProgramGroupPage=yes
OutputDir={#OutputDir}
OutputBaseFilename={#VersionedInstallerName}
UninstallDisplayIcon={app}\DockerLabsLauncher.exe
InfoBeforeFile={#SourcePath}\installer-prerequisites.txt

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; Flags: unchecked

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\Docker Labs Launcher"; Filename: "{app}\DockerLabsLauncher.exe"
Name: "{autoprograms}\Docker Labs Workspace"; Filename: "{app}\workspace"
Name: "{autodesktop}\Docker Labs"; Filename: "{app}\DockerLabsLauncher.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\DockerLabsLauncher.exe"; Description: "Launch Docker Labs"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{localappdata}\DockerLabs"

[Code]
function CheckCommand(const Command: string): Boolean;
var
  ResultCode: Integer;
begin
  Result := Exec(
    ExpandConstant('{cmd}'),
    '/C ' + Command,
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  ) and (ResultCode = 0);
end;

procedure InitializeWizard();
begin
  if not CheckCommand('where docker') then
    SuppressibleMsgBox(
      'Docker Desktop was not detected on the current PATH. The installer can continue, but the launcher will require Docker Desktop and docker compose before the workspace can start.',
      mbInformation,
      MB_OK,
      IDOK
    );

  if not CheckCommand('docker compose version') then
    SuppressibleMsgBox(
      'docker compose is not available on the current PATH. Install or repair Docker Desktop before using the launcher.',
      mbInformation,
      MB_OK,
      IDOK
    );

  SuppressibleMsgBox(
    'This installer is intentionally unsigned in the current phase. Use only the official GitHub Releases channel and verify SHA256SUMS.txt when distributing the asset.',
    mbInformation,
    MB_OK,
    IDOK
  );
end;
