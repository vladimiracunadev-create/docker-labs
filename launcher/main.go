// Docker Labs Launcher — Windows entry point
//
// Checks prerequisites, starts the Control Center via docker compose,
// waits for the server to be ready, and opens the browser automatically.
//
// Build:
//   go build -o docker-labs-launcher.exe .
//
// Distribution note:
//   This binary is NOT digitally signed in v1.x. Windows SmartScreen may
//   show a warning on first run. See docs/windows-installer.md for details.
package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// launcherVersion puede ser sobreescrito en tiempo de build via:
//   go build -ldflags "-X main.launcherVersion=1.2.0" .
// Debe ser var (no const) para que -X funcione.
var launcherVersion = "1.0.0"

const (
	controlPort    = 9090
	healthURL      = "http://localhost:9090/api/overview"
	dashboardURL   = "http://localhost:9090"
	startupTimeout = 60 * time.Second
	pollInterval   = 3 * time.Second
)

func main() {
	printBanner()

	// 1 — Locate workspace root
	workspace, err := findWorkspace()
	if err != nil {
		failWith("No se pudo localizar el workspace de Docker Labs.", []string{
			"Asegurate de que el launcher este dentro de la carpeta de instalacion.",
			"Ruta esperada: <install_dir>\\docker-labs-launcher.exe",
		})
	}
	info("Workspace: " + workspace)
	fmt.Println()

	// 2 — Check Docker CLI
	step("1/3", "Verificando prerequisitos...")
	if err := checkDockerCLI(); err != nil {
		failWith("Docker Desktop no encontrado en el PATH.", []string{
			"Instala Docker Desktop desde https://www.docker.com/products/docker-desktop/",
			"Luego reinicia y vuelve a ejecutar este launcher.",
		})
	}
	ok("Docker CLI: encontrado")

	// 3 — Check Docker daemon
	if err := checkDockerRunning(); err != nil {
		failWith("Docker Desktop esta instalado pero no esta corriendo.", []string{
			"Inicia Docker Desktop desde el menu de inicio o la barra del sistema.",
			"Espera a que Docker Desktop termine de iniciar (icono en barra del sistema).",
			"Luego vuelve a ejecutar este launcher.",
		})
	}
	ok("Docker daemon: activo")
	fmt.Println()

	// 4 — Start Control Center
	step("2/3", "Iniciando Control Center...")
	composeFile := filepath.Join(workspace, "dashboard-control", "docker-compose.yml")
	dockerRepoRoot := computeDockerRepoRoot(workspace)
	if err := startControlCenter(workspace, composeFile, dockerRepoRoot); err != nil {
		failWith("No se pudo iniciar el Control Center.", []string{
			"Verifica que Docker Desktop este corriendo.",
			"Intenta ejecutar manualmente:",
			"  docker compose -f dashboard-control\\docker-compose.yml up -d --build",
		})
	}
	ok("Control Center: iniciado")
	fmt.Println()

	// 5 — Wait for ready
	step("3/3", "Esperando que el Control Center este listo...")
	ready := waitForReady(healthURL, startupTimeout)
	if ready {
		ok("Control Center: listo en " + dashboardURL)
	} else {
		warn("El servidor aun no responde, pero puede estar iniciando.")
		info("Abriendo browser de todas formas. Recarga la pagina si no carga de inmediato.")
	}
	fmt.Println()

	// 6 — Open browser
	info("Abriendo: " + dashboardURL)
	openBrowser(dashboardURL)

	fmt.Println()
	printLine()
	fmt.Println("  Docker Labs esta corriendo.")
	fmt.Println("  Puedes cerrar esta ventana.")
	fmt.Println()
	fmt.Println("  Entradas principales:")
	fmt.Println("    Control Center : " + dashboardURL)
	fmt.Println("    Learning Center: http://localhost:9090/learning-center.html")
	fmt.Println("    Inventory Core : http://localhost:8000  (si esta activo)")
	fmt.Println("    Ops Portal     : http://localhost:8083  (si esta activo)")
	fmt.Println("    Platform Gw    : http://localhost:8085  (si esta activo)")
	printLine()
	fmt.Println()

	// Keep window open if launched by double-click (no parent console)
	if isDoubleClicked() {
		fmt.Println("Presiona ENTER para cerrar...")
		fmt.Scanln()
	}
}

// ─── Workspace ───────────────────────────────────────────────────────────────

func findWorkspace() (string, error) {
	// When installed, the launcher lives at the workspace root
	exe, err := os.Executable()
	if err != nil {
		return "", err
	}
	dir := filepath.Dir(exe)
	// Verify it looks like the workspace (must contain dashboard-control/)
	if _, err := os.Stat(filepath.Join(dir, "dashboard-control")); err == nil {
		return dir, nil
	}
	// Fallback: current working directory
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	if _, err := os.Stat(filepath.Join(cwd, "dashboard-control")); err == nil {
		return cwd, nil
	}
	return "", fmt.Errorf("dashboard-control/ not found near %s", dir)
}

// computeDockerRepoRoot converts the workspace path to the format expected
// by the Docker daemon when running docker compose from inside a container.
//
// On Windows + Docker Desktop:
//   C:\docker-labs → /run/desktop/mnt/host/c/docker-labs
//
// On Linux/macOS (native Docker):
//   /home/user/docker-labs → /home/user/docker-labs  (unchanged)
func computeDockerRepoRoot(workspaceDir string) string {
	abs, err := filepath.Abs(workspaceDir)
	if err != nil {
		abs = workspaceDir
	}
	if runtime.GOOS == "windows" {
		// Convert C:\path\to\workspace → /run/desktop/mnt/host/c/path/to/workspace
		drive := strings.ToLower(string(abs[0]))
		rest := filepath.ToSlash(abs[2:]) // drop "C:" and convert backslashes
		return "/run/desktop/mnt/host/" + drive + rest
	}
	return abs
}

// ─── Docker checks ───────────────────────────────────────────────────────────

func checkDockerCLI() error {
	cmd := exec.Command("docker", "--version")
	return cmd.Run()
}

func checkDockerRunning() error {
	cmd := exec.Command("docker", "info")
	cmd.Stdout = nil
	cmd.Stderr = nil
	return cmd.Run()
}

// ─── Start ───────────────────────────────────────────────────────────────────

func startControlCenter(workspace, composeFile, dockerRepoRoot string) error {
	cmd := exec.Command("docker", "compose", "-f", composeFile, "up", "-d", "--build")
	cmd.Dir = workspace
	cmd.Env = append(os.Environ(), "DOCKER_REPO_ROOT="+dockerRepoRoot)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// ─── Health check ────────────────────────────────────────────────────────────

func waitForReady(url string, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		resp, err := http.Get(url) //nolint:gosec // internal health check URL
		if err == nil && resp.StatusCode == 200 {
			resp.Body.Close()
			return true
		}
		if resp != nil {
			resp.Body.Close()
		}
		fmt.Print(".")
		time.Sleep(pollInterval)
	}
	fmt.Println()
	return false
}

// ─── Browser ─────────────────────────────────────────────────────────────────

func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	_ = cmd.Start()
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

const lineChar = "─"

func printBanner() {
	fmt.Println()
	printLine()
	fmt.Println("  Docker Labs  v" + launcherVersion)
	fmt.Println("  Workspace modular para aprendizaje y demos Docker")
	printLine()
	fmt.Println()
	fmt.Println("  AVISO: Este launcher no esta firmado digitalmente (v1.x).")
	fmt.Println("  Si Windows SmartScreen muestra una advertencia, selecciona")
	fmt.Println("  'Mas informacion' → 'Ejecutar de todas formas'.")
	fmt.Println("  El binario se distribuye via GitHub Releases (fuente oficial).")
	printLine()
	fmt.Println()
}

func printLine() {
	fmt.Println("  " + strings.Repeat(lineChar, 58))
}

func step(num, msg string) {
	fmt.Printf("  [%s] %s\n", num, msg)
}

func ok(msg string) {
	fmt.Printf("    ✓ %s\n", msg)
}

func warn(msg string) {
	fmt.Printf("    ! %s\n", msg)
}

func info(msg string) {
	fmt.Printf("    > %s\n", msg)
}

func failWith(reason string, hints []string) {
	fmt.Println()
	fmt.Println("  ERROR: " + reason)
	if len(hints) > 0 {
		fmt.Println()
		fmt.Println("  Como resolver:")
		for _, h := range hints {
			fmt.Println("    " + h)
		}
	}
	fmt.Println()
	if isDoubleClicked() {
		fmt.Println("  Presiona ENTER para cerrar...")
		fmt.Scanln()
	}
	os.Exit(1)
}

// isDoubleClicked returns true when the process was launched by Explorer
// (no inherited console), indicating the user double-clicked the .exe.
// In that case we keep the window open so they can read the output.
func isDoubleClicked() bool {
	if runtime.GOOS != "windows" {
		return false
	}
	// If stdout is a pipe or redirect, we're inside a terminal/script.
	fi, err := os.Stdout.Stat()
	if err != nil {
		return false
	}
	return (fi.Mode() & os.ModeCharDevice) == 0
}
