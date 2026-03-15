import argparse
import json
import logging
import os
import queue
import subprocess
import sys
import threading
import urllib.error
import urllib.request
import webbrowser
from dataclasses import dataclass
from pathlib import Path
from tkinter import END, StringVar, Text, Tk, messagebox
from tkinter import ttk


PRODUCT_KEY = "DockerLabs"


@dataclass
class LauncherContext:
    workspace_root: Path
    app_root: Path
    manifest_path: Path
    manifest: dict
    settings_path: Path
    log_path: Path


def is_frozen() -> bool:
    return bool(getattr(sys, "frozen", False))


def current_app_root() -> Path:
    if is_frozen():
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def current_workspace_candidates(explicit_workspace_root: str | None = None) -> list[Path]:
    app_root = current_app_root()
    candidates: list[Path] = []

    if explicit_workspace_root:
        candidates.append(Path(explicit_workspace_root).resolve())

    candidates.append(app_root.parent)
    candidates.append(app_root)
    candidates.append(app_root / "workspace")
    candidates.append(app_root.parent / "workspace")

    ordered: list[Path] = []
    seen: set[str] = set()
    for candidate in candidates:
        key = str(candidate)
        if key not in seen:
            ordered.append(candidate)
            seen.add(key)
    return ordered


def discover_manifest(explicit_workspace_root: str | None = None, explicit_manifest: str | None = None) -> tuple[Path, Path]:
    if explicit_manifest:
        manifest_path = Path(explicit_manifest).resolve()
        if not manifest_path.exists():
            raise FileNotFoundError(f"Manifest not found: {manifest_path}")
        workspace_root = manifest_path.parent.parent.parent if manifest_path.parts[-3:] == ("packaging", "windows", "distribution-manifest.json") else manifest_path.parent
        return workspace_root, manifest_path

    for workspace_root in current_workspace_candidates(explicit_workspace_root):
        direct_manifest = workspace_root / "windows-distribution.manifest.json"
        packaged_manifest = workspace_root / "packaging" / "windows" / "distribution-manifest.json"
        staged_manifest = workspace_root / "workspace" / "packaging" / "windows" / "distribution-manifest.json"

        for candidate in (direct_manifest, packaged_manifest, staged_manifest):
            if candidate.exists():
                if candidate == direct_manifest and (workspace_root / "workspace").exists():
                    return workspace_root / "workspace", candidate
                if candidate == staged_manifest:
                    return workspace_root / "workspace", candidate
                return workspace_root, candidate

    raise FileNotFoundError("Unable to locate windows-distribution.manifest.json")


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def user_data_root() -> Path:
    if os.name == "nt":
        local_appdata = os.environ.get("LOCALAPPDATA")
        if local_appdata:
            return Path(local_appdata) / PRODUCT_KEY
    return Path.home() / f".{PRODUCT_KEY.lower()}"


def resolve_data_root(workspace_root: Path) -> Path:
    preferred = user_data_root()
    try:
        preferred.mkdir(parents=True, exist_ok=True)
        return preferred
    except PermissionError:
        fallback = workspace_root / ".launcher-data"
        fallback.mkdir(parents=True, exist_ok=True)
        return fallback


def load_context(explicit_workspace_root: str | None = None, explicit_manifest: str | None = None) -> LauncherContext:
    workspace_root, manifest_path = discover_manifest(explicit_workspace_root, explicit_manifest)
    manifest = load_json(manifest_path)
    data_root = resolve_data_root(workspace_root)
    log_path = data_root / manifest["runtime"]["logRelativePath"].replace("\\", os.sep)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    settings_path = data_root / manifest["runtime"]["settingsRelativePath"].replace("\\", os.sep)
    return LauncherContext(
        workspace_root=workspace_root.resolve(),
        app_root=current_app_root(),
        manifest_path=manifest_path.resolve(),
        manifest=manifest,
        settings_path=settings_path.resolve(),
        log_path=log_path.resolve(),
    )


def ensure_settings(context: LauncherContext) -> dict:
    defaults = {
        "preferredEntry": "controlCenter",
        "openBrowserAfterStart": True,
        "lastWorkspaceRoot": str(context.workspace_root),
    }
    if context.settings_path.exists():
        try:
            defaults.update(load_json(context.settings_path))
        except json.JSONDecodeError:
            pass

    context.settings_path.parent.mkdir(parents=True, exist_ok=True)
    context.settings_path.write_text(json.dumps(defaults, indent=2), encoding="utf-8")
    return defaults


def configure_logging(log_path: Path) -> None:
    logging.basicConfig(
        filename=str(log_path),
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )


def convert_windows_path_to_docker_desktop(path: str) -> str:
    normalized = path.replace("\\", "/")
    if len(normalized) >= 3 and normalized[1:3] == ":/":
        drive = normalized[0].lower()
        remainder = normalized[3:]
        return f"/run/desktop/mnt/host/{drive}/{remainder}"
    raise ValueError(f"Unsupported Windows path: {path}")


def control_center_environment(workspace_root: Path) -> dict:
    env = os.environ.copy()
    workspace = str(workspace_root.resolve())
    docker_target = convert_windows_path_to_docker_desktop(workspace) if os.name == "nt" else workspace
    env["CONTROL_CENTER_WORKSPACE_SOURCE"] = workspace
    env["CONTROL_CENTER_DOCKER_SOURCE"] = workspace
    env["CONTROL_CENTER_DOCKER_TARGET"] = docker_target
    return env


def run_command(args: list[str], cwd: Path | None = None, env: dict | None = None, timeout: int = 20) -> dict:
    try:
        completed = subprocess.run(
            args,
            cwd=str(cwd) if cwd else None,
            env=env,
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
        )
    except FileNotFoundError as error:
        return {"ok": False, "code": 127, "stdout": "", "stderr": str(error)}
    except subprocess.TimeoutExpired as error:
        return {"ok": False, "code": 124, "stdout": error.stdout or "", "stderr": "Command timed out."}

    return {
        "ok": completed.returncode == 0,
        "code": completed.returncode,
        "stdout": completed.stdout.strip(),
        "stderr": completed.stderr.strip(),
    }


def probe_url(url: str, timeout: int = 3) -> dict:
    try:
        with urllib.request.urlopen(url, timeout=timeout) as response:
            return {"ok": 200 <= response.status < 400, "status": response.status}
    except urllib.error.URLError as error:
        return {"ok": False, "status": None, "error": str(error.reason)}
    except Exception as error:
        return {"ok": False, "status": None, "error": str(error)}


def absolute_path(context: LauncherContext, relative_path: str) -> Path:
    return context.workspace_root / Path(relative_path.replace("\\", os.sep))


def open_path(path: Path) -> None:
    if os.name == "nt":
        os.startfile(str(path))  # type: ignore[attr-defined]
        return
    opener = "open" if sys.platform == "darwin" else "xdg-open"
    subprocess.Popen([opener, str(path)])


def open_url(url: str) -> None:
    webbrowser.open(url, new=2)


def launcher_status(context: LauncherContext) -> dict:
    urls = context.manifest["workspace"]["primaryUrls"]
    docker_cli = run_command(["docker", "--version"])
    docker_compose = run_command(["docker", "compose", "version"])
    docker_engine = run_command(["docker", "info", "--format", "{{json .}}"], timeout=30)
    control_center = probe_url(urls["controlCenter"])
    gateway = probe_url(urls["platformGateway"])

    return {
        "workspaceRoot": str(context.workspace_root),
        "manifestPath": str(context.manifest_path),
        "dockerCli": docker_cli,
        "dockerCompose": docker_compose,
        "dockerEngine": docker_engine,
        "controlCenter": control_center,
        "gateway": gateway,
        "unsignedNotice": context.manifest["product"]["unsignedNotice"],
    }


def compose_up(context: LauncherContext, relative_compose_path: str) -> dict:
    compose_path = absolute_path(context, relative_compose_path)
    env = control_center_environment(context.workspace_root) if relative_compose_path == "dashboard-control/docker-compose.yml" else os.environ.copy()
    return run_command(["docker", "compose", "-f", str(compose_path), "up", "-d", "--build"], cwd=context.workspace_root, env=env, timeout=180)


def compose_down(context: LauncherContext, relative_compose_path: str) -> dict:
    compose_path = absolute_path(context, relative_compose_path)
    env = control_center_environment(context.workspace_root) if relative_compose_path == "dashboard-control/docker-compose.yml" else os.environ.copy()
    return run_command(["docker", "compose", "-f", str(compose_path), "down"], cwd=context.workspace_root, env=env, timeout=120)


def start_control_center(context: LauncherContext) -> dict:
    return compose_up(context, "dashboard-control/docker-compose.yml")


def start_main_workspace(context: LauncherContext) -> list[dict]:
    return [{"composeFile": compose_file, "result": compose_up(context, compose_file)} for compose_file in context.manifest["workspace"]["mainComposeFiles"]]


def stop_main_workspace(context: LauncherContext) -> list[dict]:
    files = list(context.manifest["workspace"]["mainComposeFiles"])
    files.reverse()
    return [{"composeFile": compose_file, "result": compose_down(context, compose_file)} for compose_file in files]


def format_command_result(result: dict) -> str:
    output = result.get("stdout") or result.get("stderr") or ""
    return output if output else f"Command exited with code {result['code']}."


class DockerLabsLauncher:
    def __init__(self, context: LauncherContext, settings: dict):
        self.context = context
        self.settings = settings
        self.root = Tk()
        self.root.title("Docker Labs Launcher")
        self.root.geometry("980x720")
        self.root.minsize(900, 640)
        self.queue: queue.Queue[tuple[str, object]] = queue.Queue()
        self.status_vars = {
            "workspace": StringVar(value=str(self.context.workspace_root)),
            "dockerCli": StringVar(value="Checking..."),
            "dockerCompose": StringVar(value="Checking..."),
            "dockerEngine": StringVar(value="Checking..."),
            "controlCenter": StringVar(value="Checking..."),
            "gateway": StringVar(value="Checking..."),
        }
        self._build_ui()
        self.root.after(150, self._process_queue)
        self.refresh_status()

    def _build_ui(self) -> None:
        style = ttk.Style()
        current_theme = style.theme_use()
        style.theme_use("vista" if os.name == "nt" and "vista" in style.theme_names() else current_theme)
        style.configure("Title.TLabel", font=("Segoe UI", 18, "bold"))
        style.configure("Subtitle.TLabel", font=("Segoe UI", 10))
        style.configure("Danger.TLabel", background="#fff2cc", foreground="#7f6000")

        shell = ttk.Frame(self.root, padding=18)
        shell.pack(fill="both", expand=True)

        header = ttk.Frame(shell)
        header.pack(fill="x")
        ttk.Label(header, text="Docker Labs Launcher", style="Title.TLabel").pack(anchor="w")
        ttk.Label(
            header,
            text="Windows launcher for the Docker Labs workspace. It validates prerequisites, starts the supported stacks and opens the main experience.",
            style="Subtitle.TLabel",
            wraplength=900,
            justify="left",
        ).pack(anchor="w", pady=(6, 0))

        ttk.Label(
            shell,
            text=self.context.manifest["product"]["unsignedNotice"],
            style="Danger.TLabel",
            wraplength=920,
            justify="left",
            padding=10,
        ).pack(fill="x", pady=(14, 14))

        info = ttk.LabelFrame(shell, text="Workspace status", padding=14)
        info.pack(fill="x")
        self._status_row(info, "Workspace root", self.status_vars["workspace"])
        self._status_row(info, "Docker CLI", self.status_vars["dockerCli"])
        self._status_row(info, "Docker Compose", self.status_vars["dockerCompose"])
        self._status_row(info, "Docker Engine", self.status_vars["dockerEngine"])
        self._status_row(info, "Control Center", self.status_vars["controlCenter"])
        self._status_row(info, "Platform Gateway", self.status_vars["gateway"])

        actions = ttk.LabelFrame(shell, text="Actions", padding=14)
        actions.pack(fill="x", pady=(14, 14))

        buttons = [
            ("Validate prerequisites", self.refresh_status),
            ("Start Control Center", lambda: self._run_action("Start Control Center", self._start_control_center)),
            ("Start main workspace", lambda: self._run_action("Start main workspace", self._start_main_workspace)),
            ("Stop main workspace", lambda: self._run_action("Stop main workspace", self._stop_main_workspace)),
            ("Open Control Center", lambda: open_url(self.context.manifest["workspace"]["primaryUrls"]["controlCenter"])),
            ("Open Platform Gateway", lambda: open_url(self.context.manifest["workspace"]["primaryUrls"]["platformGateway"])),
            ("Open workspace folder", lambda: open_path(self.context.workspace_root)),
            ("Open launcher logs", lambda: open_path(self.context.log_path.parent)),
            ("Open Windows guide", lambda: open_path(absolute_path(self.context, self.context.manifest["runtime"]["docs"]["windowsGuide"]))),
            ("Open GitHub Releases", lambda: open_url(self.context.manifest["product"]["officialReleasePage"])),
        ]

        for index, (label, callback) in enumerate(buttons):
            ttk.Button(actions, text=label, command=callback).grid(row=index // 2, column=index % 2, padx=6, pady=6, sticky="ew")

        actions.columnconfigure(0, weight=1)
        actions.columnconfigure(1, weight=1)

        output_frame = ttk.LabelFrame(shell, text="Operational log", padding=14)
        output_frame.pack(fill="both", expand=True)
        self.output = Text(output_frame, height=18, wrap="word")
        self.output.pack(fill="both", expand=True)
        self.output.insert(END, "Launcher ready. Use 'Validate prerequisites' to inspect Docker and the workspace.\n")
        self.output.configure(state="disabled")

    def _status_row(self, parent: ttk.LabelFrame, label: str, value: StringVar) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=3)
        ttk.Label(row, text=label, width=18).pack(side="left")
        ttk.Label(row, textvariable=value).pack(side="left", fill="x", expand=True)

    def _append_output(self, message: str) -> None:
        logging.info(message)
        self.output.configure(state="normal")
        self.output.insert(END, f"{message}\n")
        self.output.see(END)
        self.output.configure(state="disabled")

    def _process_queue(self) -> None:
        while True:
            try:
                message_type, payload = self.queue.get_nowait()
            except queue.Empty:
                break

            if message_type == "status":
                status = payload
                self.status_vars["dockerCli"].set(self._status_line(status["dockerCli"], "docker --version"))
                self.status_vars["dockerCompose"].set(self._status_line(status["dockerCompose"], "docker compose version"))
                self.status_vars["dockerEngine"].set(self._status_line(status["dockerEngine"], "docker info"))
                self.status_vars["controlCenter"].set(self._url_status_line(status["controlCenter"], self.context.manifest["workspace"]["primaryUrls"]["controlCenter"]))
                self.status_vars["gateway"].set(self._url_status_line(status["gateway"], self.context.manifest["workspace"]["primaryUrls"]["platformGateway"]))
                self._append_output("Prerequisite validation finished.")
            elif message_type == "log":
                self._append_output(str(payload))
            elif message_type == "error":
                self._append_output(str(payload))
                messagebox.showerror("Docker Labs Launcher", str(payload))

        self.root.after(150, self._process_queue)

    @staticmethod
    def _status_line(result: dict, fallback: str) -> str:
        if result["ok"]:
            return result["stdout"] or fallback
        return f"Not ready: {result.get('stderr') or fallback}"

    @staticmethod
    def _url_status_line(result: dict, url: str) -> str:
        if result["ok"]:
            return f"Reachable: {url}"
        return f"Not reachable: {result.get('error') or 'No response.'}"

    def refresh_status(self) -> None:
        self._append_output("Validating Docker prerequisites and current URLs...")

        def task() -> None:
            self.queue.put(("status", launcher_status(self.context)))

        threading.Thread(target=task, daemon=True).start()

    def _run_action(self, label: str, action) -> None:
        self._append_output(f"{label}...")

        def task() -> None:
            try:
                action()
            except Exception as error:
                self.queue.put(("error", str(error)))

        threading.Thread(target=task, daemon=True).start()

    def _start_control_center(self) -> None:
        result = start_control_center(self.context)
        self.queue.put(("log", format_command_result(result)))
        if not result["ok"]:
            raise RuntimeError("Control Center could not be started. Review the operational log for details.")
        if self.settings.get("openBrowserAfterStart", True):
            open_url(self.context.manifest["workspace"]["primaryUrls"]["controlCenter"])
        self.queue.put(("log", "Control Center started successfully."))
        self.queue.put(("status", launcher_status(self.context)))

    def _start_main_workspace(self) -> None:
        results = start_main_workspace(self.context)
        failed = False
        for item in results:
            self.queue.put(("log", f"[{item['composeFile']}] {format_command_result(item['result'])}"))
            if not item["result"]["ok"]:
                failed = True
        if failed:
            raise RuntimeError("At least one compose stack failed during startup.")
        if self.settings.get("openBrowserAfterStart", True):
            open_url(self.context.manifest["workspace"]["primaryUrls"]["platformGateway"])
        self.queue.put(("log", "Main workspace started successfully."))
        self.queue.put(("status", launcher_status(self.context)))

    def _stop_main_workspace(self) -> None:
        results = stop_main_workspace(self.context)
        failed = False
        for item in results:
            self.queue.put(("log", f"[{item['composeFile']}] {format_command_result(item['result'])}"))
            if not item["result"]["ok"]:
                failed = True
        if failed:
            raise RuntimeError("At least one compose stack failed during shutdown.")
        self.queue.put(("log", "Main workspace stopped successfully."))
        self.queue.put(("status", launcher_status(self.context)))

    def run(self) -> None:
        self.root.mainloop()


def cli_self_check(context: LauncherContext) -> int:
    print(json.dumps(launcher_status(context), indent=2))
    return 0


def cli_start_control_center(context: LauncherContext) -> int:
    result = start_control_center(context)
    print(json.dumps(result, indent=2))
    return 0 if result["ok"] else result["code"]


def cli_start_main_workspace(context: LauncherContext) -> int:
    results = start_main_workspace(context)
    print(json.dumps(results, indent=2))
    return 0 if all(item["result"]["ok"] for item in results) else 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Docker Labs Windows launcher")
    parser.add_argument("--workspace-root", dest="workspace_root")
    parser.add_argument("--manifest", dest="manifest")
    parser.add_argument("--self-check", action="store_true")
    parser.add_argument("--start-control-center", action="store_true")
    parser.add_argument("--start-main-workspace", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    context = load_context(args.workspace_root, args.manifest)
    configure_logging(context.log_path)
    settings = ensure_settings(context)

    if args.self_check:
        return cli_self_check(context)
    if args.start_control_center:
        return cli_start_control_center(context)
    if args.start_main_workspace:
        return cli_start_main_workspace(context)

    app = DockerLabsLauncher(context, settings)
    app.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
