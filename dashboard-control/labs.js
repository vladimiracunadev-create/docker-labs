/**
 * labs.js — Configuracion de labs del workspace Docker Labs
 *
 * Este modulo carga la definicion de labs desde `labs.config.json` (raiz del repo),
 * que es la fuente unica de verdad para IDs, nombres, puertos y URLs.
 *
 * Aqui solo se agregan las rutas de runtime (composeFile, docsPath) que dependen
 * de las variables de entorno APP_REPO_ROOT y DOCKER_REPO_ROOT.
 */

const fs = require("fs");
const path = require("path");

const localRepoRoot = process.env.APP_REPO_ROOT
  ? path.resolve(process.env.APP_REPO_ROOT)
  : path.resolve(__dirname, "..");

const dockerRepoRoot = process.env.DOCKER_REPO_ROOT
  ? path.resolve(process.env.DOCKER_REPO_ROOT)
  : localRepoRoot;

function localRepoPath(...segments) {
  return path.join(localRepoRoot, ...segments);
}

function dockerRepoPath(...segments) {
  return path.join(dockerRepoRoot, ...segments);
}

// Carga labs.config.json desde la raiz del repo
function loadConfig() {
  const configPath = localRepoPath("labs.config.json");
  if (!fs.existsSync(configPath)) {
    process.stderr.write(`[labs.js] WARN: labs.config.json no encontrado en ${configPath}. Usando defaults vacios.\n`);
    return { labs: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (err) {
    process.stderr.write(`[labs.js] ERROR: No se pudo parsear labs.config.json: ${err.message}\n`);
    return { labs: [] };
  }
}

// Agrega rutas de runtime a cada entrada del JSON
function addRuntimePaths(labConfig) {
  return {
    ...labConfig,
    composeFile: dockerRepoPath(labConfig.id, "docker-compose.yml"),
    docsPath:    localRepoPath(labConfig.id, "README.md")
  };
}

// Fusiona con lab-manifest.json si existe en el directorio del lab
function loadManifest(labId) {
  const manifestPath = localRepoPath(labId, "lab-manifest.json");
  if (!fs.existsSync(manifestPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    return { manifestError: `No fue posible leer ${manifestPath}: ${err.message}` };
  }
}

function mergeLab(labWithPaths) {
  const manifest = loadManifest(labWithPaths.id);
  const merged = {
    ...labWithPaths,
    ...manifest,
    // Estas propiedades siempre vienen de labs.config.json, no del manifest
    composeFile:  labWithPaths.composeFile,
    docsPath:     labWithPaths.docsPath,
    manifestPath: localRepoPath(labWithPaths.id, "lab-manifest.json")
  };

  if (!Array.isArray(merged.urls))       merged.urls = labWithPaths.urls || [];
  if (!Array.isArray(merged.tags))       merged.tags = labWithPaths.tags || [];
  if (!Array.isArray(merged.relatedLabs)) merged.relatedLabs = [];

  return merged;
}

const config = loadConfig();

module.exports = config.labs
  .map(addRuntimePaths)
  .map(mergeLab);
