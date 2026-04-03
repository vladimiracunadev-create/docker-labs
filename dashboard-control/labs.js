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

// Validación de schema — campos requeridos y tipos básicos
const REQUIRED_LAB_FIELDS = ["id", "name", "description", "stack", "category", "ports", "urls"];

function validateLab(lab, index) {
  const errors = [];

  for (const field of REQUIRED_LAB_FIELDS) {
    if (lab[field] == null || lab[field] === "") {
      errors.push(`campo '${field}' faltante o vacío`);
    }
  }

  if (lab.id && !/^[\w-]+$/.test(lab.id)) {
    errors.push(`id '${lab.id}' contiene caracteres inválidos (solo [a-z0-9_-])`);
  }

  if (lab.urls && !Array.isArray(lab.urls)) {
    errors.push("urls debe ser un array");
  }

  if (lab.ports && !Array.isArray(lab.ports)) {
    errors.push("ports debe ser un array");
  }

  if (errors.length > 0) {
    process.stderr.write(
      `[labs.js] WARN: Lab[${index}] (id: ${lab.id || "desconocido"}) tiene problemas de schema:\n` +
      errors.map((e) => `  - ${e}`).join("\n") + "\n"
    );
  }

  return errors.length === 0;
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

// Validar y filtrar labs con schema inválido para no exponer datos corruptos
const validLabs = config.labs.filter((lab, i) => validateLab(lab, i));

if (validLabs.length < config.labs.length) {
  process.stderr.write(`[labs.js] WARN: ${config.labs.length - validLabs.length} lab(s) excluidos por schema inválido.\n`);
}

module.exports = validLabs
  .map(addRuntimePaths)
  .map(mergeLab);
