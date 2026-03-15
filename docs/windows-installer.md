# Windows Installer — Docker Labs

> **Version**: 1.0.0
> **Audience**: developers, maintainers, end users, technical reviewers
> **Distribution**: GitHub Releases (not committed to repository)

---

## Overview

Docker Labs ships a native Windows installer (`docker-labs-setup-{version}.exe`)
for users who prefer a one-click setup experience over cloning the repository
manually. The installer is built with Inno Setup, includes the Go-compiled
launcher, and installs the workspace to `%LOCALAPPDATA%\DockerLabs`.

The installer is a **release artifact** — it is never committed to the repository.
It is published as an asset on GitHub Releases and downloaded from there.

---

## Prerequisites (end user)

| Requirement | Version | Notes |
|-------------|---------|-------|
| Windows     | 10 or 11 (64-bit) | Required |
| Docker Desktop | Latest stable | Required — not bundled in installer |
| WSL 2 backend | (Docker Desktop default) | Strongly recommended |

Docker Desktop is not packaged in the installer by design. The launcher validates
its presence and guides the user if it is missing.

---

## Installation

1. Download `docker-labs-setup-{version}.exe` from [GitHub Releases](https://github.com/vladimiracunadev-create/docker-labs/releases)
2. Run the installer
3. If Windows SmartScreen warns — see [Code Signing section](#why-code-signing-is-not-used-in-this-phase)
4. Accept the installation directory (`%LOCALAPPDATA%\DockerLabs` by default)
5. Optionally check "Create desktop shortcut"
6. Click "Install" → "Launch Docker Labs"

---

## What the Installer Does

| Step | Action |
|------|--------|
| Shows unsigned binary notice | Transparent warning before proceeding |
| Copies workspace source files | Labs 01–12, dashboard-control, docs |
| Copies launcher executable | `docker-labs-launcher.exe` |
| Creates Start Menu entry | "Docker Labs — Control Center" |
| Creates optional desktop shortcut | Unchecked by default |
| Registers uninstaller | Clean removal via Settings → Apps |
| Offers to launch after install | Optional, via Run step |

---

## What the Installer Does NOT Do

- Does **not** install Docker Desktop
- Does **not** pull Docker images (images are pulled at runtime by Docker)
- Does **not** require administrator rights (installs to user space)
- Does **not** modify system PATH or registry beyond standard Inno Setup entries
- Does **not** contain a digital signature (see below)

---

## The Launcher (`docker-labs-launcher.exe`)

The launcher is a compiled Go binary (`launcher/main.go`) that serves as the
primary entry point for Windows users.

### What it does

1. Prints a startup banner with the version and unsigned binary notice
2. Locates the workspace root (relative to its own location)
3. Checks Docker CLI availability (`docker --version`)
4. Checks Docker daemon is running (`docker info`)
5. Computes `DOCKER_REPO_ROOT` dynamically for the current machine
6. Runs `docker compose -f dashboard-control\docker-compose.yml up -d --build`
7. Polls `http://localhost:9090/api/overview` until ready (60s timeout)
8. Opens `http://localhost:9090` in the default browser
9. Displays the list of primary URLs

If any step fails, the launcher shows a clear error message with corrective
instructions and keeps the console window open so the user can read the output.

### Source code

```
launcher/
  main.go    # Go source — pure stdlib, no external dependencies
  go.mod     # Go module definition
```

### Build locally

```powershell
cd launcher
go build -o docker-labs-launcher.exe .
```

Or via the convenience script:

```powershell
.\scripts\windows\build-launcher.ps1 -Version 1.0.0
```

---

## Building the Installer Locally

### Requirements (build machine)

| Tool | Version | Download |
|------|---------|----------|
| Go | 1.21+ | https://go.dev/dl/ |
| Inno Setup | 6.x | https://jrsoftware.org/isinfo.php |
| Git | any | For cloning |

### Steps

```powershell
# 1. Clone the repository
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs

# 2. Build launcher
.\scripts\windows\build-launcher.ps1 -Version 1.0.0

# 3. Build installer
.\scripts\windows\build-installer.ps1 -Version 1.0.0

# Output: dist\docker-labs-setup-1.0.0.exe
```

Or run the full pipeline in one command:

```powershell
.\scripts\windows\release.ps1 -Version 1.0.0
```

---

## What Goes Into the Installer

The Inno Setup script (`installer/docker-labs.iss`) includes:

| Item | Included | Notes |
|------|----------|-------|
| `docker-labs-launcher.exe` | Yes | Built from `launcher/main.go` |
| Lab directories (01–12) | Yes | Source + Dockerfiles + compose files |
| `dashboard-control/` | Yes | node_modules excluded |
| Root HTML/CSS/JS assets | Yes | `index.html`, `dashboard.js`, etc. |
| `docs/` | Yes | Full documentation |
| `scripts/` | Partial | `start-control-center.cmd` only |
| `.git/` | No | Not needed at runtime |
| `node_modules/` | No | Pulled at Docker build time |
| `dist/` | No | Build artifacts |
| Installer scripts | No | `installer/`, `scripts/windows/` |
| `.github/` | No | CI workflows not needed at runtime |

---

## Uninstallation

From Windows Settings → Apps → Docker Labs → Uninstall.

The uninstaller:
1. Stops the Control Center container (`docker compose down`)
2. Removes all installed files
3. Removes Start Menu and desktop shortcuts
4. Removes the uninstall registry entry

Docker images and volumes created by Docker are **not** removed automatically.
To clean those up, run from the workspace directory before uninstalling:

```cmd
docker compose -f dashboard-control\docker-compose.yml down --volumes --remove-orphans
```

---

## Why Code Signing Is Not Used in This Phase

### The decision

Docker Labs v1.x does **not** use digital code signing for the installer or
launcher binary. This is an **intentional, explicit product decision**, not an
oversight.

### Reasons

| Reason | Detail |
|--------|--------|
| **Cost** | EV certificates (required for full SmartScreen reputation) cost $300–700/year. For an open-source portfolio project, this cost is not justified in the initial phase. |
| **Validation phase** | The goal of v1.x is to validate the installation experience, launcher behavior, and distribution workflow. Signing adds complexity without adding functional value at this stage. |
| **Maintenance overhead** | Code signing certificates require renewal, secure key storage, and CI pipeline configuration. This complexity is not warranted before the distribution model is validated. |
| **Priority** | The technical value of the project lies in the Docker workspace, not the signing infrastructure. |

### Impact for end users

When running the unsigned installer on Windows 10/11, Microsoft SmartScreen
may display one of the following:

| Scenario | Message | Action |
|----------|---------|--------|
| New/unknown publisher | "Windows protected your PC" | Click "More info" → "Run anyway" |
| Low reputation score | Warning dialog | Same as above |
| Antivirus scan | May flag as unknown | Add to exclusions if needed |

This behavior is normal for new or infrequently-downloaded software. It does
**not** indicate that the software is malicious.

### Why GitHub Releases mitigates this risk

The installer is distributed exclusively through GitHub Releases:
- GitHub provides TLS-verified downloads
- The release is tagged to a specific commit
- The source code is publicly auditable
- SHA-256 checksums are provided in the release notes

Users can verify the installer matches the repository source by building it
locally with `scripts/windows/release.ps1`.

### Compensatory measures

In the absence of code signing, the following measures are applied:

1. **Source-only distribution via GitHub Releases** — no third-party mirrors
2. **SHA-256 checksum** included in each release's description
3. **Transparent unsigned binary notice** shown in the installer wizard and launcher banner
4. **Reproducible build** — the installer can be rebuilt from source by anyone

### Roadmap for code signing

Code signing will be considered when:

- The project reaches a broader user base (>1,000 downloads/month)
- A Microsoft Azure Code Signing certificate becomes feasible ($99/year)
- Or the project is adopted by an organization that can provide an EV cert

The Inno Setup script (`installer/docker-labs.iss`) already contains a
commented-out `SignTool` directive ready to be activated:

```iss
; SignTool=...  (uncomment and configure when signing is available)
```

---

## Troubleshooting

| Symptom | Cause | Solution |
|---------|-------|----------|
| SmartScreen warning | Unsigned binary | Click "More info" → "Run anyway" |
| "Docker not found" | Docker Desktop not installed | Install from docker.com/desktop |
| "Docker not running" | Docker Desktop not started | Start Docker Desktop, wait for tray icon |
| Browser does not open | Port 9090 in use by another app | Check `netstat -ano \| findstr 9090` |
| "dashboard-control not found" | Launcher outside install dir | Re-run installer or use install dir |
| Control Center starts but labs don't | Wrong `DOCKER_REPO_ROOT` | The launcher computes this automatically; if using manually, see RUNBOOK.md |

---

## Demo and Portfolio Presentation

This Windows distribution layer demonstrates:

- **Product thinking**: designing for end-user experience beyond the repository
- **Go proficiency**: cross-platform binary with zero runtime dependencies
- **Windows packaging**: Inno Setup for professional installation UX
- **CI/CD**: automated build pipeline via GitHub Actions
- **Distribution design**: GitHub Releases as the proper artifact channel
- **Security awareness**: explicit unsigned binary policy with mitigations

For a technical interview or demo, highlight:
1. The launcher validates prerequisites before starting anything
2. `DOCKER_REPO_ROOT` computation solves a real Docker-in-Docker path problem
3. The installer is built reproducibly from source — no black boxes
4. The decision NOT to sign in v1.x is intentional, documented, and defensible

---

## Related Documents

- [docs/github-releases-distribution.md](github-releases-distribution.md)
- [docs/technical-audit.md](technical-audit.md)
- [RUNBOOK.md](../RUNBOOK.md)
- [RELEASE.md](../RELEASE.md)
- [FILE_ARCHITECTURE.md](../FILE_ARCHITECTURE.md)
