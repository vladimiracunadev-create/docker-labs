# GitHub Releases Distribution Strategy

> **Version**: 1.0.0
> **Audience**: maintainers, contributors, technical reviewers

---

## Overview

Docker Labs uses **GitHub Releases** as the exclusive distribution channel for
pre-built installer artifacts. The repository contains only source code and
build scripts. No binaries are committed.

This document explains the rationale, the full release workflow, and how to
link the installer from the project website.

---

## Why GitHub Releases and Not the Repository

| Option | Why Not Used |
|--------|-------------|
| Commit binary to `main` | Pollutes history, increases repo size, mixes source and artifacts |
| Store in `gh-pages` branch | GitHub Pages is for static HTML sites, not binary distribution; no CDN for large files |
| Self-hosted file server | Operational overhead, uptime responsibility, no native CI integration |
| **GitHub Releases** | Official artifact channel, integrated with CI, TLS-secured, permanent URLs, SHA verification, free |

---

## Release Workflow

### Automated (recommended)

Push a version tag to trigger the GitHub Actions workflow:

```bash
# Tag the release
git tag v1.0.0
git push origin v1.0.0
```

The `build-windows.yml` workflow:
1. Builds the Go launcher (`docker-labs-launcher.exe`)
2. Builds the Inno Setup installer (`docker-labs-setup-1.0.0.exe`)
3. Attaches the installer to the GitHub Release automatically

The release is created at:
```
https://github.com/vladimiracunadev-create/docker-labs/releases/tag/v1.0.0
```

### Manual

```powershell
# 1. Build everything locally
.\scripts\windows\release.ps1 -Version 1.0.0

# 2. Create GitHub Release via gh CLI + upload
.\scripts\windows\release.ps1 -Version 1.0.0 -Upload
```

Or manually via the GitHub web UI:
1. Go to **Releases** → **Draft a new release**
2. Create tag `v1.0.0`
3. Add release notes (title, changelog summary, SHA-256 checksum)
4. Drag and drop `dist/docker-labs-setup-1.0.0.exe`
5. Publish release

---

## Release Checklist

Before publishing a release:

```
[ ] Version string updated in installer/docker-labs.iss
[ ] Version string passed to build scripts (-Version 1.0.0)
[ ] CHANGELOG.md updated with this release's changes
[ ] PROJECT_STATUS.md reflects current state
[ ] CI passes (both ci.yml and build-windows.yml)
[ ] Installer tested on a clean Windows machine
[ ] SHA-256 checksum generated for release notes
[ ] dist/ directory NOT committed to repository
```

Generate SHA-256 checksum:

```powershell
# Windows
Get-FileHash dist\docker-labs-setup-1.0.0.exe -Algorithm SHA256

# Linux/macOS
sha256sum dist/docker-labs-setup-1.0.0.exe
```

Include the checksum in the release notes:

```
## Checksums
SHA-256 docker-labs-setup-1.0.0.exe: <hash>
```

---

## Asset Download URL Pattern

GitHub Releases uses a stable, versioned URL format:

```
https://github.com/<owner>/<repo>/releases/download/<tag>/<asset-filename>
```

Example:
```
https://github.com/vladimiracunadev-create/docker-labs/releases/download/v1.0.0/docker-labs-setup-1.0.0.exe
```

This URL is permanent once the release is published and does not change.

---

## Linking from the Website / GitHub Pages

The project website (or GitHub Pages) should link to GitHub Releases for downloads.
**The binary is never stored in the `gh-pages` branch or in the repo.**

### Recommended HTML pattern

```html
<!-- Always-latest release page link -->
<a href="https://github.com/vladimiracunadev-create/docker-labs/releases/latest"
   class="btn-download">
  Download for Windows
</a>

<!-- Direct asset link for a specific version (update on each release) -->
<a href="https://github.com/vladimiracunadev-create/docker-labs/releases/download/v1.0.0/docker-labs-setup-1.0.0.exe"
   class="btn-download">
  Download v1.0.0 — Windows Installer (.exe)
</a>
```

**Use the `/releases/latest` URL pattern** when you want the button to always
point to the most recent published release without updating the HTML on each release.

```
https://github.com/vladimiracunadev-create/docker-labs/releases/latest
```

### GitHub Pages configuration note

If using GitHub Pages for the project website:
- The `gh-pages` branch (or `docs/` folder) contains only the website source
- It does **not** contain any installer binaries
- The download button points to GitHub Releases via an external link
- No `<base>` tag changes are needed — the releases URL is absolute

---

## Release Naming Convention

| Component | Convention | Example |
|-----------|-----------|---------|
| Git tag | `v{semver}` | `v1.0.0` |
| Installer filename | `docker-labs-setup-{semver}.exe` | `docker-labs-setup-1.0.0.exe` |
| Release title | `Docker Labs v{semver}` | `Docker Labs v1.0.0` |

---

## How to Justify This Strategy in an Interview

**Q: Why not just commit the binary to the repository?**

> Binaries in source control are an anti-pattern: they inflate history size,
> can't be diffed, and conflate source with artifacts. GitHub Releases is the
> correct artifact layer — it integrates with CI, provides versioned URLs,
> supports checksums, and is free. This mirrors the distribution model used
> by professional open-source projects like VS Code, Docker Desktop, and Go.

**Q: Why not GitHub Pages for downloads?**

> GitHub Pages is designed for static web content served via CDN. It has a
> 1 GB soft limit per site, no large-file optimization, and attaching binaries
> to a web branch mixes concerns. GitHub Releases has native support for binary
> assets with content-addressed storage. Using the right tool for each job is
> a design principle, not a workaround.

**Q: What happens if GitHub goes down?**

> The source code enables any user to rebuild the installer from scratch using
> `scripts/windows/release.ps1`. The release is not a single point of failure
> — it's a convenience layer over a fully open, reproducible build system.

---

## Related Documents

- [docs/windows-installer.md](windows-installer.md)
- [RELEASE.md](../RELEASE.md)
- [.github/workflows/build-windows.yml](../.github/workflows/build-windows.yml)
