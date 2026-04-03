const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const { execFile } = require("child_process");

const repoRoot = process.env.APP_REPO_ROOT
  ? path.resolve(process.env.APP_REPO_ROOT)
  : path.resolve(__dirname, "..");

// Logging estructurado — nivel controlado por LOG_LEVEL (info|debug|warn|error)
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

function log(level, message, extra = {}) {
  if (LOG_LEVELS[level] < LOG_LEVELS[LOG_LEVEL]) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...extra
  };
  const out = level === "error" || level === "warn" ? process.stderr : process.stdout;
  out.write(JSON.stringify(entry) + "\n");
}

const labs = require("./labs");
const port = Number(process.env.DASHBOARD_PORT || 9090);

// Rate limiting nativo — protege endpoints POST contra abuso
// Límite: 30 requests por IP en ventana de 60 segundos
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map(); // ip -> { count, resetAt }

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  if (record.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// Limpieza periódica para evitar crecimiento indefinido del Map
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) rateLimitMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS * 2);

// Autenticación por token de sesión — activa solo si DASHBOARD_TOKEN está definido
// En desarrollo local sin la variable el acceso es abierto (comportamiento previo).
// Para activar: export DASHBOARD_TOKEN=tu-token-secreto antes de levantar.
const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || null;

function isAuthenticated(request) {
  if (!DASHBOARD_TOKEN) return true; // Sin token configurado: acceso abierto (modo dev)
  const authHeader = request.headers["authorization"] || "";
  const cookieHeader = request.headers["cookie"] || "";
  const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const tokenFromCookie = (cookieHeader.match(/(?:^|;\s*)dashboard_token=([^;]+)/) || [])[1] || null;
  return tokenFromHeader === DASHBOARD_TOKEN || tokenFromCookie === DASHBOARD_TOKEN;
}

const staticFiles = new Map([
  ["/", { file: path.join(repoRoot, "index.html"), type: "text/html; charset=utf-8" }],
  ["/index.html", { file: path.join(repoRoot, "index.html"), type: "text/html; charset=utf-8" }],
  ["/learning-center.html", { file: path.join(repoRoot, "learning-center.html"), type: "text/html; charset=utf-8" }],
  ["/dashboard.css", { file: path.join(repoRoot, "dashboard.css"), type: "text/css; charset=utf-8" }],
  ["/dashboard.js", { file: path.join(repoRoot, "dashboard.js"), type: "application/javascript; charset=utf-8" }],
  ["/learning-center.css", { file: path.join(repoRoot, "learning-center.css"), type: "text/css; charset=utf-8" }],
  ["/docs/BEGINNERS_GUIDE.md", { file: path.join(repoRoot, "docs", "BEGINNERS_GUIDE.md"), type: "text/markdown; charset=utf-8" }],
  ["/docs/LABS_RUNTIME_REFERENCE.md", { file: path.join(repoRoot, "docs", "LABS_RUNTIME_REFERENCE.md"), type: "text/markdown; charset=utf-8" }],
  ["/docs/USER_MANUAL.md", { file: path.join(repoRoot, "docs", "USER_MANUAL.md"), type: "text/markdown; charset=utf-8" }],
  ["/docs/LABS_CATALOG.md", { file: path.join(repoRoot, "docs", "LABS_CATALOG.md"), type: "text/markdown; charset=utf-8" }],
  ["/CHANGELOG.md", { file: path.join(repoRoot, "CHANGELOG.md"), type: "text/markdown; charset=utf-8" }]
]);

// Timeouts por tipo de comando Docker — en milisegundos
const EXEC_TIMEOUTS = {
  default:  15_000,   // docker info, ps, inspect
  action:   120_000,  // up, down, restart (pueden tardar en pull de imágenes)
  logs:     10_000    // logs --tail
};

function execCommand(command, args, options = {}) {
  const timeout = options.timeout || EXEC_TIMEOUTS.default;
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      { cwd: repoRoot, maxBuffer: 1024 * 1024 * 4, timeout, ...options },
      (error, stdout, stderr) => {
        if (error) {
          reject({
            message: error.killed ? `Comando cancelado por timeout (${timeout}ms)` : error.message,
            stdout: stdout || "",
            stderr: stderr || "",
            code: error.code || 1
          });
          return;
        }

        resolve({
          stdout: stdout || "",
          stderr: stderr || ""
        });
      }
    );
  });
}

async function dockerCompose(composeFile, composeArgs, timeoutMs) {
  const isAction = composeArgs[0] === "up" || composeArgs[0] === "down" || composeArgs[0] === "restart";
  const isLogs = composeArgs[0] === "logs";
  const timeout = timeoutMs || (isAction ? EXEC_TIMEOUTS.action : isLogs ? EXEC_TIMEOUTS.logs : EXEC_TIMEOUTS.default);
  return execCommand("docker", ["compose", "-f", composeFile, ...composeArgs], { timeout });
}


// CORS restringido a localhost — el dashboard solo debe ser accesible localmente
const ALLOWED_ORIGINS = new Set([
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`
]);

function corsHeaders(request) {
  const origin = request.headers.origin || "";
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : `http://localhost:${port}`;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function sendJson(response, statusCode, payload, request = null) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...(request ? corsHeaders(request) : { "Access-Control-Allow-Origin": `http://localhost:${port}` })
  });
  response.end(JSON.stringify(payload));
}

function sendFile(response, file, type) {
  fs.readFile(file, (error, content) => {
    if (error) {
      sendJson(response, 404, { error: "File not found." });
      return;
    }

    response.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-store"
    });
    response.end(content);
  });
}

const MAX_BODY_BYTES = 10 * 1024; // 10 KB — suficiente para cualquier payload del dashboard

async function readRequestBody(request) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    totalBytes += chunk.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new Error("Request body demasiado grande.");
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  } catch {
    throw new Error("Request body no es JSON válido.");
  }
}

function safeParseComposePs(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function safeParseJsonLines(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function bytesToGb(value) {
  return Number((value / (1024 ** 3)).toFixed(1));
}

function parsePercent(value) {
  return Number(String(value || "0").replace("%", "").trim()) || 0;
}

function parseMemoryUsage(value) {
  const match = String(value || "").match(/^([\d.]+)([KMG]iB)\s*\/\s*([\d.]+)([KMG]iB)$/i);
  if (!match) {
    return { usedMiB: 0, limitGiB: 0 };
  }

  const used = Number(match[1]);
  const usedUnit = match[2].toLowerCase();
  const limit = Number(match[3]);
  const limitUnit = match[4].toLowerCase();

  const unitToMiB = {
    kib: 1 / 1024,
    mib: 1,
    gib: 1024
  };

  const unitToGiB = {
    kib: 1 / (1024 ** 2),
    mib: 1 / 1024,
    gib: 1
  };

  return {
    usedMiB: Number((used * (unitToMiB[usedUnit] || 0)).toFixed(1)),
    limitGiB: Number((limit * (unitToGiB[limitUnit] || 0)).toFixed(1))
  };
}

function buildRecommendation(labs, dockerMemGb) {
  const featured = labs.filter((lab) => lab.featured);
  const featuredNeedGb = featured.reduce((acc, lab) => acc + Number(lab.recommendedRamGb || 0), 0);

  let mode = "case-by-case";
  let summary = "Trabaja con un lab a la vez y usa el panel para no sobrecargar Docker.";
  let recommendedLabs = ["01-node-api", "03-python-api", "06-nginx-proxy"];
  let cautionLabs = ["08-prometheus-grafana", "11-elasticsearch-search", "12-jenkins-ci"];

  if (dockerMemGb >= 16) {
    mode = "platform";
    summary = "Tu asignacion Docker permite trabajar con la plataforma principal y sumar un servicio complementario con cuidado.";
    recommendedLabs = ["05-postgres-api", "06-nginx-proxy", "09-multi-service-app", "07-rabbitmq-messaging"];
  } else if (dockerMemGb >= 8) {
    mode = "balanced";
    summary = "Puedes trabajar con la plataforma principal, pero evita mezclar varios labs pesados al mismo tiempo.";
    recommendedLabs = ["05-postgres-api", "06-nginx-proxy", "09-multi-service-app"];
  }

  if (dockerMemGb < featuredNeedGb) {
    summary = `Docker tiene ${dockerMemGb} GB asignados y la plataforma principal sugiere ~${featuredNeedGb} GB. Conviene usar modo caso a caso o subir la memoria de Docker Desktop.`;
  }

  return {
    mode,
    summary,
    dockerMemGb,
    featuredNeedGb: Number(featuredNeedGb.toFixed(1)),
    recommendedLabs,
    cautionLabs
  };
}

async function getDiagnostics() {
  const [dockerInfoResult, dockerStatsResult, dockerDfResult, overview] = await Promise.all([
    execCommand("docker", ["info", "--format", "{{json .}}"]),
    execCommand("docker", ["stats", "--no-stream", "--format", "{{json .}}"]),
    execCommand("docker", ["system", "df"]),
    getOverview()
  ]);

  const dockerInfo = JSON.parse(dockerInfoResult.stdout.trim() || "{}");
  const dockerStats = safeParseJsonLines(dockerStatsResult.stdout);
  const dockerMemGb = bytesToGb(Number(dockerInfo.MemTotal || 0));
  const cpuCount = Number(dockerInfo.NCPU || 0);

  const activeContainers = dockerStats.map((item) => {
    const memory = parseMemoryUsage(item.MemUsage);
    return {
      name: item.Name,
      cpuPercent: parsePercent(item.CPUPerc),
      memoryPercent: parsePercent(item.MemPerc),
      memoryUsedMiB: memory.usedMiB,
      memoryLimitGiB: memory.limitGiB
    };
  });

  const usage = activeContainers.reduce(
    (acc, item) => {
      acc.cpuPercent += item.cpuPercent;
      acc.memoryUsedMiB += item.memoryUsedMiB;
      return acc;
    },
    { cpuPercent: 0, memoryUsedMiB: 0 }
  );

  const runningLabs = overview.labs.filter((lab) => lab.summary.running > 0);
  const recommendedRunningRamGb = Number(
    runningLabs.reduce((acc, lab) => acc + Number(lab.recommendedRamGb || 0), 0).toFixed(1)
  );

  return {
    generatedAt: new Date().toISOString(),
    browserNote: "El navegador aporta una estimacion del equipo anfitrion. Docker aporta la capacidad realmente asignada al runtime.",
    docker: {
      serverVersion: dockerInfo.ServerVersion || "unknown",
      operatingSystem: dockerInfo.OperatingSystem || "unknown",
      cpus: cpuCount,
      memoryTotalGb: dockerMemGb,
      images: Number(dockerInfo.Images || 0),
      containersRunning: Number(dockerInfo.ContainersRunning || 0),
      diskUsage: dockerDfResult.stdout.trim(),
      usage: {
        cpuPercentApprox: Number(usage.cpuPercent.toFixed(1)),
        cpuPercentNormalized: cpuCount > 0 ? Number((usage.cpuPercent / cpuCount).toFixed(1)) : Number(usage.cpuPercent.toFixed(1)),
        memoryUsedMiB: Number(usage.memoryUsedMiB.toFixed(1)),
        memoryUsedGb: Number((usage.memoryUsedMiB / 1024).toFixed(2)),
        memoryLoadPercent: dockerMemGb > 0 ? Number(((usage.memoryUsedMiB / 1024) / dockerMemGb * 100).toFixed(1)) : 0
      },
      activeContainers
    },
    recommendation: {
      ...buildRecommendation(overview.labs, dockerMemGb),
      runningLabs: runningLabs.map((lab) => ({
        id: lab.id,
        name: lab.name,
        recommendedRamGb: Number(lab.recommendedRamGb || 0),
        status: lab.summary.status
      })),
      runningNeedGb: recommendedRunningRamGb
    }
  };
}

function summarizeProject(containers, services) {
  const running = containers.filter((item) => item.State === "running").length;
  const healthy = containers.filter((item) => item.Health === "healthy").length;
  const unhealthy = containers.filter((item) => item.Health && item.Health !== "healthy").length;

  let status = "stopped";
  if (containers.length === 0) {
    status = "stopped";
  } else if (unhealthy > 0) {
    status = "degraded";
  } else if (running === containers.length) {
    status = healthy > 0 || services.length === 1 ? "healthy" : "running";
  } else {
    status = "partial";
  }

  return {
    status,
    running,
    healthy,
    unhealthy,
    expectedServices: services.length,
    discoveredServices: containers.length
  };
}

async function inspectLab(lab) {
  const [servicesResult, containersResult] = await Promise.allSettled([
    dockerCompose(lab.composeFile, ["config", "--services"]),
    dockerCompose(lab.composeFile, ["ps", "--format", "json"])
  ]);

  const services = servicesResult.status === "fulfilled"
    ? servicesResult.value.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : [];

  const containers = containersResult.status === "fulfilled"
    ? safeParseComposePs(containersResult.value.stdout)
    : [];

  return {
    ...lab,
    services,
    containers: containers.map((container) => ({
      name: container.Name,
      service: container.Service,
      state: container.State,
      health: container.Health || "none",
      status: container.Status,
      ports: container.Publishers || []
    })),
    summary: summarizeProject(containers, services),
    errors: {
      services: servicesResult.status === "rejected" ? servicesResult.reason.stderr || servicesResult.reason.message : "",
      ps: containersResult.status === "rejected" ? containersResult.reason.stderr || containersResult.reason.message : ""
    }
  };
}

async function getOverview() {
  const projectResults = await Promise.all(labs.map((lab) => inspectLab(lab)));
  const totals = projectResults.reduce(
    (acc, lab) => {
      acc.total += 1;
      if (lab.summary.status === "healthy") {
        acc.healthy += 1;
      }
      if (lab.summary.status === "running" || lab.summary.status === "healthy") {
        acc.running += 1;
      }
      if (lab.summary.status === "degraded" || lab.summary.status === "partial") {
        acc.needsAttention += 1;
      }
      if (lab.summary.status === "stopped") {
        acc.stopped += 1;
      }
      return acc;
    },
    { total: 0, healthy: 0, running: 0, needsAttention: 0, stopped: 0 }
  );

  return {
    generatedAt: new Date().toISOString(),
    totals,
    labs: projectResults
  };
}

function findLab(id) {
  return labs.find((lab) => lab.id === id);
}

async function handleLabAction(lab, action, payload = {}) {
  if (action === "start") {
    const args = payload.rebuild ? ["up", "-d", "--build"] : ["up", "-d"];
    return dockerCompose(lab.composeFile, args);
  }

  if (action === "stop") {
    return dockerCompose(lab.composeFile, ["down"]);
  }

  if (action === "restart") {
    return dockerCompose(lab.composeFile, ["restart"]);
  }

  if (action === "logs") {
    const tailRaw = Number(payload.tail);
    const tail = String(Number.isFinite(tailRaw) && tailRaw > 0 && tailRaw <= 500 ? tailRaw : 120);
    return dockerCompose(lab.composeFile, ["logs", "--no-color", "--tail", tail]);
  }

  throw new Error(`Unsupported action: ${action}`);
}

async function handleWorkspaceAction(action) {
  const outputs = [];
  const targets = [...labs].reverse();

  for (const lab of targets) {
    try {
      if (action === "stop-all") {
        const result = await dockerCompose(lab.composeFile, ["down"]);
        if ((result.stdout || result.stderr || "").trim()) {
          outputs.push(`## ${lab.id}\n${(result.stdout || result.stderr).trim()}`);
        }
      } else if (action === "remove-all") {
        const result = await dockerCompose(lab.composeFile, ["down", "--volumes", "--remove-orphans"]);
        if ((result.stdout || result.stderr || "").trim()) {
          outputs.push(`## ${lab.id}\n${(result.stdout || result.stderr).trim()}`);
        }
      } else {
        throw new Error(`Unsupported workspace action: ${action}`);
      }
    } catch (error) {
      outputs.push(`## ${lab.id}\n${error.stderr || error.message || String(error)}`);
    }
  }

  return {
    ok: true,
    action,
    output: outputs.join("\n\n").trim()
  };
}

// Contadores de métricas internas — expuestos en /metrics para Prometheus
const metrics = {
  requestsTotal: 0,
  requestErrors: 0,
  labActionsTotal: 0,
  labActionErrors: 0,
  startedAt: Date.now()
};

function renderPrometheusMetrics() {
  const uptimeSeconds = Math.floor((Date.now() - metrics.startedAt) / 1000);
  return [
    "# HELP docker_labs_requests_total Total de requests recibidos",
    "# TYPE docker_labs_requests_total counter",
    `docker_labs_requests_total ${metrics.requestsTotal}`,
    "",
    "# HELP docker_labs_request_errors_total Total de errores en requests",
    "# TYPE docker_labs_request_errors_total counter",
    `docker_labs_request_errors_total ${metrics.requestErrors}`,
    "",
    "# HELP docker_labs_lab_actions_total Total de acciones ejecutadas sobre labs",
    "# TYPE docker_labs_lab_actions_total counter",
    `docker_labs_lab_actions_total ${metrics.labActionsTotal}`,
    "",
    "# HELP docker_labs_lab_action_errors_total Errores en acciones sobre labs",
    "# TYPE docker_labs_lab_action_errors_total counter",
    `docker_labs_lab_action_errors_total ${metrics.labActionErrors}`,
    "",
    "# HELP docker_labs_uptime_seconds Tiempo de actividad del servidor en segundos",
    "# TYPE docker_labs_uptime_seconds gauge",
    `docker_labs_uptime_seconds ${uptimeSeconds}`,
    "",
    "# HELP docker_labs_known_labs Total de labs configurados",
    "# TYPE docker_labs_known_labs gauge",
    `docker_labs_known_labs ${labs.length}`,
    ""
  ].join("\n");
}

// Acciones permitidas — allowlist explícita para evitar acciones arbitrarias
const ALLOWED_LAB_ACTIONS = new Set(["start", "stop", "restart", "logs"]);

async function handleApi(request, response, pathname) {
  metrics.requestsTotal += 1;

  // Endpoint /metrics en formato Prometheus text — no requiere auth (estándar scraping)
  if (pathname === "/metrics" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/plain; version=0.0.4; charset=utf-8" });
    response.end(renderPrometheusMetrics());
    return;
  }

  if (pathname === "/api/overview" && request.method === "GET") {
    sendJson(response, 200, await getOverview(), request);
    return;
  }

  if (pathname === "/api/diagnostics" && request.method === "GET") {
    sendJson(response, 200, await getDiagnostics(), request);
    return;
  }

  if (pathname === "/api/workspace/stop-all" && request.method === "POST") {
    const result = await handleWorkspaceAction("stop-all");
    sendJson(response, 200, {
      ...result,
      overview: await getOverview()
    }, request);
    return;
  }

  if (pathname === "/api/workspace/remove-all" && request.method === "POST") {
    const result = await handleWorkspaceAction("remove-all");
    sendJson(response, 200, {
      ...result,
      overview: await getOverview()
    }, request);
    return;
  }

  if (pathname === "/api/labs" && request.method === "GET") {
    const overview = await getOverview();
    sendJson(response, 200, overview.labs, request);
    return;
  }

  if (pathname.startsWith("/api/labs/")) {
    const parts = pathname.split("/").filter(Boolean);
    const labId = parts[2];
    const action = parts[3] || null;

    // Validar labId contra lista conocida — previene path traversal e inyección
    if (!labId || !/^[\w-]+$/.test(labId)) {
      sendJson(response, 400, { error: "Lab ID inválido." }, request);
      return;
    }

    const lab = findLab(labId);

    if (!lab) {
      sendJson(response, 404, { error: "Lab not found." }, request);
      return;
    }

    if (!action && request.method === "GET") {
      sendJson(response, 200, await inspectLab(lab), request);
      return;
    }

    if (action === "health" && request.method === "GET") {
      const result = await inspectLab(lab);
      sendJson(response, 200, {
        labId,
        status:     result.summary.status,
        healthy:    result.summary.healthy,
        unhealthy:  result.summary.unhealthy,
        total:      result.summary.expectedServices,
        discovered: result.summary.discoveredServices,
        containers: result.containers.map((c) => ({
          name:    c.name,
          service: c.service,
          state:   c.state,
          health:  c.health
        })),
        checkedAt: new Date().toISOString()
      }, request);
      return;
    }

    if (request.method === "POST" && ALLOWED_LAB_ACTIONS.has(action)) {
      metrics.labActionsTotal += 1;
      const body = await readRequestBody(request);
      let result;
      try {
        result = await handleLabAction(lab, action, body);
      } catch (err) {
        metrics.labActionErrors += 1;
        throw err;
      }
      const detailed = action === "logs" ? null : await inspectLab(lab);

      sendJson(response, 200, {
        ok: true,
        labId,
        action,
        output: (result.stdout || result.stderr || "").trim(),
        lab: detailed
      }, request);
      return;
    }
  }

  sendJson(response, 404, { error: "Route not found." }, request);
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      ...corsHeaders(request),
      "Content-Length": "0"
    });
    response.end();
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = requestUrl.pathname;
  const startMs = Date.now();
  const clientIp = request.socket.remoteAddress || "unknown";

  try {
    if (pathname.startsWith("/api/")) {
      if (!isAuthenticated(request)) {
        log("warn", "Unauthorized request", { method: request.method, pathname, ip: clientIp });
        sendJson(response, 401, { error: "No autorizado. Incluye el token en Authorization: Bearer <token> o cookie dashboard_token." }, request);
        return;
      }

      // Rate limiting solo en endpoints de acción (POST)
      if (request.method === "POST" && isRateLimited(clientIp)) {
        log("warn", "Rate limit exceeded", { ip: clientIp, pathname });
        sendJson(response, 429, { error: "Demasiadas solicitudes. Espera un momento antes de reintentar." }, request);
        return;
      }
      log("debug", "API request", { method: request.method, pathname });
      await handleApi(request, response, pathname);
      log("debug", "API response", { method: request.method, pathname, ms: Date.now() - startMs });
      return;
    }

    const asset = staticFiles.get(pathname);
    if (asset) {
      sendFile(response, asset.file, asset.type);
      return;
    }

    sendJson(response, 404, { error: "Not found." });
  } catch (error) {
    metrics.requestErrors += 1;
    log("error", "Request failed", {
      method: request.method,
      url: request.url,
      message: error.message || String(error),
      stderr: error.stderr || undefined
    });

    const isDockerError = Boolean(error.stderr);
    sendJson(response, 500, {
      error: isDockerError
        ? "Docker command failed. Revisa que Docker esté activo y el lab exista."
        : "Error interno del servidor.",
      output: isDockerError ? (error.stdout || error.stderr || "").trim() : ""
    }, request);
  }
});

server.listen(port, () => {
  log("info", "Docker Labs Control Center started", { port, repoRoot, auth: Boolean(DASHBOARD_TOKEN) });
});
