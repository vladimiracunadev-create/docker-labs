// Docker Labs Launcher — Windows entry point
//
// Flujo:
//   1. Localiza el workspace instalado
//   2. Verifica Docker CLI y Docker daemon
//   3. Levanta la plataforma core en paralelo:
//        dashboard-control    (9090) Control Center
//        05-postgres-api      (8000) Inventory Core
//        09-multi-service-app (8083) Operations Portal
//        06-nginx-proxy       (8085) Platform Gateway
//   4. Espera que el Control Center este listo
//   5. Abre el browser en http://localhost:9090
//      Desde ahi el usuario puede levantar cualquier lab adicional
//      con un clic desde la interfaz del Control Center.
//
// Build:
//   go build -ldflags "-X main.launcherVersion=1.2.0" -o docker-labs-launcher.exe .
package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

var launcherVersion = "1.0.0"

const (
	controlPort    = 9090
	healthURL      = "http://localhost:9090/api/overview"
	dashboardURL   = "http://localhost:9090"
	startupTimeout = 90 * time.Second
	pollInterval   = 3 * time.Second
)

// corePlatform: servicios que forman la experiencia principal.
// Se levantan en paralelo. Si alguno falla, el usuario puede
// iniciarlo desde el Control Center con un clic.
var corePlatform = []platformService{
	{name: "Inventory Core",    composeDir: "05-postgres-api",      port: 8000},
	{name: "Operations Portal", composeDir: "09-multi-service-app", port: 8083},
	{name: "Platform Gateway",  composeDir: "06-nginx-proxy",       port: 8085},
}

type platformService struct {
	name       string
	composeDir string
	port       int
	err        error
}

func main() {
	printBanner()

	// 1 — Localizar workspace
	workspace, err := findWorkspace()
	if err != nil {
		failWith("No se pudo localizar el workspace de Docker Labs.", []string{
			"Asegurate de ejecutar el launcher desde la carpeta de instalacion.",
			"Ruta esperada: <install_dir>\\docker-labs-launcher.exe",
		})
	}
	info("Workspace: " + workspace)
	fmt.Println()

	// 2 — Verificar Docker
	step("1/3", "Verificando Docker Desktop...")
	if err := checkDockerCLI(); err != nil {
		failWith("Docker Desktop no encontrado en el PATH.", []string{
			"Instala Docker Desktop desde https://www.docker.com/products/docker-desktop/",
			"Reinicia y vuelve a ejecutar este launcher.",
		})
	}
	ok("Docker CLI disponible")
	if err := checkDockerRunning(); err != nil {
		failWith("Docker Desktop no esta corriendo.", []string{
			"Inicia Docker Desktop desde el menu de inicio.",
			"Espera el icono en la barra del sistema y vuelve a ejecutar.",
		})
	}
	ok("Docker daemon activo")
	fmt.Println()

	// 3 — Levantar plataforma en paralelo
	step("2/3", "Levantando la plataforma Docker Labs...")
	fmt.Println()

	dockerRepoRoot := computeDockerRepoRoot(workspace)
	ccErrCh := make(chan error, 1)

	// Control Center primero (su health determina cuando abrir el browser)
	go func() {
		fmt.Printf("    [inicio] Control Center      (:%d)\n", controlPort)
		cf := filepath.Join(workspace, "dashboard-control", "docker-compose.yml")
		ccErrCh <- startCompose(workspace, cf, dockerRepoRoot)
	}()

	// Servicios core en paralelo
	services := make([]platformService, len(corePlatform))
	copy(services, corePlatform)
	var wg sync.WaitGroup
	for i := range services {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			svc := &services[i]
			fmt.Printf("    [inicio] %-22s (:%d)\n", svc.name, svc.port)
			cf := filepath.Join(workspace, svc.composeDir, "docker-compose.yml")
			svc.err = startCompose(workspace, cf, "")
		}(i)
	}

	ccErr := <-ccErrCh
	wg.Wait()
	fmt.Println()

	if ccErr != nil {
		failWith("No se pudo iniciar el Control Center.", []string{
			"Verifica que Docker Desktop este corriendo y tenga recursos.",
			"Comando equivalente:",
			"  docker compose -f dashboard-control\\docker-compose.yml up -d --build",
		})
	}

	// Reportar estado de cada servicio
	anyFailed := false
	for _, svc := range services {
		if svc.err != nil {
			warn(svc.name + ": no inicio automaticamente")
			anyFailed = true
		} else {
			ok(svc.name + ": iniciando en segundo plano")
		}
	}
	if anyFailed {
		fmt.Println()
		info("Servicios que fallaron pueden iniciarse desde el Control Center.")
		info("Abre http://localhost:9090 y usa el boton Start de cada lab.")
	}
	fmt.Println()

	// 4 — Esperar Control Center
	step("3/3", "Esperando que el Control Center este listo...")
	fmt.Print("    ")
	ready := waitForReady(healthURL, startupTimeout)
	fmt.Println()
	if ready {
		ok("Control Center listo")
	} else {
		warn("El Control Center aun no responde. Recarga el browser si no carga.")
	}
	fmt.Println()

	// 5 — Abrir browser
	info("Abriendo " + dashboardURL)
	openBrowser(dashboardURL)
	fmt.Println()

	// Resumen final
	printLine()
	fmt.Println("  Docker Labs esta levantando la plataforma.")
	fmt.Println()
	fmt.Println("  El browser se abrio en el Control Center.")
	fmt.Println("  Desde ahi puedes:")
	fmt.Println("    - Ver el estado de cada servicio en tiempo real")
	fmt.Println("    - Iniciar servicios que no levantaron con un clic (Start)")
	fmt.Println("    - Ver logs, reiniciar o detener cualquier lab")
	fmt.Println()
	fmt.Println("  URLs principales cuando todos los servicios esten listos:")
	fmt.Printf("    %-24s http://localhost:%d\n", "Control Center", controlPort)
	for _, svc := range services {
		fmt.Printf("    %-24s http://localhost:%d\n", svc.name, svc.port)
	}
	fmt.Println()
	fmt.Println("  Puedes cerrar esta ventana.")
	printLine()
	fmt.Println()

	if isDoubleClicked() {
		fmt.Println("  Presiona ENTER para cerrar...")
		fmt.Scanln()
	}
}

func findWorkspace() (string, error) {
	exe, _ := os.Executable()
	dir := filepath.Dir(exe)
	if _, err := os.Stat(filepath.Join(dir, "dashboard-control")); err == nil {
		return dir, nil
	}
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	if _, err := os.Stat(filepath.Join(cwd, "dashboard-control")); err == nil {
		return cwd, nil
	}
	return "", fmt.Errorf("dashboard-control/ no encontrado cerca de %s", dir)
}

func computeDockerRepoRoot(workspaceDir string) string {
	abs, err := filepath.Abs(workspaceDir)
	if err != nil {
		abs = workspaceDir
	}
	if runtime.GOOS == "windows" {
		drive := strings.ToLower(string(abs[0]))
		rest := filepath.ToSlash(abs[2:])
		return "/run/desktop/mnt/host/" + drive + rest
	}
	return abs
}

func checkDockerCLI() error { return exec.Command("docker", "--version").Run() }

func checkDockerRunning() error {
	cmd := exec.Command("docker", "info")
	cmd.Stdout, cmd.Stderr = nil, nil
	return cmd.Run()
}

func startCompose(workspace, composeFile, dockerRepoRoot string) error {
	cmd := exec.Command("docker", "compose", "-f", composeFile, "up", "-d", "--build")
	cmd.Dir = workspace
	env := os.Environ()
	if dockerRepoRoot != "" {
		env = append(env, "DOCKER_REPO_ROOT="+dockerRepoRoot)
	}
	cmd.Env = env
	cmd.Stdout, cmd.Stderr = nil, nil
	return cmd.Run()
}

func waitForReady(url string, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		resp, err := http.Get(url) //nolint:gosec
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
	return false
}

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

func printBanner() {
	fmt.Println()
	printLine()
	fmt.Println("  Docker Labs  v" + launcherVersion)
	fmt.Println("  Plataforma modular Docker para demos y aprendizaje")
	printLine()
	fmt.Println()
	fmt.Println("  AVISO: Este launcher no esta firmado digitalmente (v1.x).")
	fmt.Println("  Si Windows muestra advertencia, selecciona")
	fmt.Println("  'Mas informacion' > 'Ejecutar de todas formas'.")
	printLine()
	fmt.Println()
}

func printLine()       { fmt.Println("  " + strings.Repeat("-", 58)) }
func step(n, m string) { fmt.Printf("  [%s] %s\n", n, m) }
func ok(m string)      { fmt.Printf("    [OK] %s\n", m) }
func warn(m string)    { fmt.Printf("    [!]  %s\n", m) }
func info(m string)    { fmt.Printf("    [>]  %s\n", m) }

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

func isDoubleClicked() bool {
	if runtime.GOOS != "windows" {
		return false
	}
	fi, err := os.Stdout.Stat()
	if err != nil {
		return false
	}
	return (fi.Mode() & os.ModeCharDevice) == 0
}
