; ─────────────────────────────────────────────────────────────────────────────
; Docker Labs — Inno Setup Installer Script
; Version: 1.0.0
;
; Prerequisites (build machine):
;   - Inno Setup 6.x  (https://jrsoftware.org/isinfo.php)
;   - docker-labs-launcher.exe compiled in launcher\
;   - Run from the repository root directory (or via scripts\windows\build-installer.ps1)
;
; Output:
;   dist\docker-labs-setup-{version}.exe
;
; Distribution:
;   Upload the generated installer to GitHub Releases as a release asset.
;   Do NOT commit the installer binary to the repository.
;
; Code signing note:
;   This installer is NOT digitally signed in v1.x.
;   See docs/windows-installer.md#why-code-signing-is-not-used-in-this-phase
; ─────────────────────────────────────────────────────────────────────────────

#define AppName     "Docker Labs"
#define AppVersion  "1.0.0"
#define AppPublisher "Vladimir Acuna Dev"
#define AppURL      "https://github.com/vladimiracunadev-create/docker-labs"
#define AppExeName  "docker-labs-launcher.exe"
#define InstallDir  "{localappdata}\DockerLabs"

[Setup]
AppId={{8E3F2A1B-4C7D-4E9F-A0B1-2C3D4E5F6A7B}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}/issues
AppUpdatesURL={#AppURL}/releases
DefaultDirName={#InstallDir}
DefaultGroupName={#AppName}
AllowNoIcons=yes
OutputDir=..\dist
OutputBaseFilename=docker-labs-setup-{#AppVersion}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
; No signing in v1.x — see docs/windows-installer.md
; SignTool=...
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayName={#AppName}
UninstallDisplayIcon={app}\{#AppExeName}
MinVersion=10.0

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Launcher executable (built separately — see scripts/windows/build-launcher.ps1)
Source: "..\launcher\docker-labs-launcher.exe"; DestDir: "{app}"; Flags: ignoreversion

; Root config and documentation files
Source: "..\README.md";           DestDir: "{app}"; Flags: ignoreversion
Source: "..\RUNBOOK.md";          DestDir: "{app}"; Flags: ignoreversion
Source: "..\CHANGELOG.md";        DestDir: "{app}"; Flags: ignoreversion
Source: "..\FILE_ARCHITECTURE.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\LICENSE";             DestDir: "{app}"; Flags: ignoreversion

; Dashboard static assets (served by Control Center on 9090)
Source: "..\index.html";            DestDir: "{app}"; Flags: ignoreversion
Source: "..\dashboard.css";         DestDir: "{app}"; Flags: ignoreversion
Source: "..\dashboard.js";          DestDir: "{app}"; Flags: ignoreversion
Source: "..\learning-center.html";  DestDir: "{app}"; Flags: ignoreversion
Source: "..\learning-center.css";   DestDir: "{app}"; Flags: ignoreversion

; Control Center service (Node.js backend, runs in Docker)
Source: "..\dashboard-control\*"; DestDir: "{app}\dashboard-control"; \
  Flags: ignoreversion recursesubdirs createallsubdirs; \
  Excludes: "node_modules\*"

; Startup scripts
Source: "..\scripts\start-control-center.cmd"; DestDir: "{app}\scripts"; Flags: ignoreversion
Source: "..\scripts\ci-compose-test.sh";       DestDir: "{app}\scripts"; Flags: ignoreversion

; Platform labs (source + compose, no node_modules)
Source: "..\01-node-api\*";   DestDir: "{app}\01-node-api";   Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules\*"
Source: "..\02-php-lamp\*";   DestDir: "{app}\02-php-lamp";   Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "vendor\*"
Source: "..\03-python-api\*"; DestDir: "{app}\03-python-api"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "__pycache__\*,*.pyc"
Source: "..\04-redis-cache\*"; DestDir: "{app}\04-redis-cache"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules\*"
Source: "..\05-postgres-api\*"; DestDir: "{app}\05-postgres-api"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "__pycache__\*,*.pyc"
Source: "..\06-nginx-proxy\*"; DestDir: "{app}\06-nginx-proxy"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\07-rabbitmq-messaging\*"; DestDir: "{app}\07-rabbitmq-messaging"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules\*"
Source: "..\08-prometheus-grafana\*"; DestDir: "{app}\08-prometheus-grafana"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\09-multi-service-app\*";  DestDir: "{app}\09-multi-service-app";  Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules\*,backend\node_modules\*"
Source: "..\10-go-api\*";   DestDir: "{app}\10-go-api";   Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\11-elasticsearch-search\*"; DestDir: "{app}\11-elasticsearch-search"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "__pycache__\*,*.pyc"
Source: "..\12-jenkins-ci\*"; DestDir: "{app}\12-jenkins-ci"; Flags: ignoreversion recursesubdirs createallsubdirs

; Documentation
Source: "..\docs\*"; DestDir: "{app}\docs"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; Start Menu
Name: "{group}\{#AppName} — Control Center"; \
  Filename: "{app}\{#AppExeName}"; \
  WorkingDir: "{app}"; \
  Comment: "Start Docker Labs Control Center"

Name: "{group}\{#AppName} — Uninstall"; \
  Filename: "{uninstallexe}"

; Desktop (optional, unchecked by default)
Name: "{autodesktop}\{#AppName}"; \
  Filename: "{app}\{#AppExeName}"; \
  WorkingDir: "{app}"; \
  Tasks: desktopicon

[Run]
; Offer to launch after install
Filename: "{app}\{#AppExeName}"; \
  Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; \
  Flags: nowait postinstall skipifsilent

[UninstallRun]
; Stop Control Center before uninstalling
Filename: "docker"; \
  Parameters: "compose -f ""{app}\dashboard-control\docker-compose.yml"" down"; \
  Flags: runhidden skipifdoesntexist

[Code]
// Show unsigned binary notice before installation proceeds
function InitializeSetup(): Boolean;
var
  Msg: String;
begin
  Msg :=
    'Docker Labs v{#AppVersion}' + #13#10 + #13#10 +
    'NOTICE — Unsigned Binary' + #13#10 +
    '─────────────────────────────────────────' + #13#10 +
    'This installer is not digitally signed in v1.x.' + #13#10 +
    'Windows SmartScreen may display a warning.' + #13#10 + #13#10 +
    'This is the official release from GitHub Releases:' + #13#10 +
    '{#AppURL}/releases' + #13#10 + #13#10 +
    'Select "More info" → "Run anyway" if prompted.' + #13#10 +
    'Code signing is planned for a future version.' + #13#10 + #13#10 +
    'Continue with installation?';
  Result := MsgBox(Msg, mbConfirmation, MB_YESNO) = IDYES;
end;
