const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const { execFile } = require("child_process");

const labs = require("./labs");

const repoRoot = path.resolve(__dirname, "..");
const port = Number(process.env.DASHBOARD_PORT || 9090);

const staticFiles = new Map([
  ["/", { file: path.join(repoRoot, "index.html"), type: "text/html; charset=utf-8" }],
  ["/index.html", { file: path.join(repoRoot, "index.html"), type: "text/html; charset=utf-8" }],
  ["/dashboard.css", { file: path.join(repoRoot, "dashboard.css"), type: "text/css; charset=utf-8" }],
  ["/dashboard.js", { file: path.join(repoRoot, "dashboard.js"), type: "application/javascript; charset=utf-8" }]
]);

function execCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      { cwd: repoRoot, maxBuffer: 1024 * 1024 * 4, ...options },
      (error, stdout, stderr) => {
        if (error) {
          reject({
            message: error.message,
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

async function dockerCompose(composeFile, composeArgs) {
  return execCommand("docker", ["compose", "-f", composeFile, ...composeArgs]);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
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

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
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
    const tail = String(payload.tail || 120);
    return dockerCompose(lab.composeFile, ["logs", "--no-color", "--tail", tail]);
  }

  throw new Error(`Unsupported action: ${action}`);
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/overview" && request.method === "GET") {
    sendJson(response, 200, await getOverview());
    return;
  }

  if (pathname === "/api/labs" && request.method === "GET") {
    const overview = await getOverview();
    sendJson(response, 200, overview.labs);
    return;
  }

  if (pathname.startsWith("/api/labs/")) {
    const parts = pathname.split("/").filter(Boolean);
    const labId = parts[2];
    const action = parts[3] || null;
    const lab = findLab(labId);

    if (!lab) {
      sendJson(response, 404, { error: "Lab not found." });
      return;
    }

    if (!action && request.method === "GET") {
      sendJson(response, 200, await inspectLab(lab));
      return;
    }

    if (request.method === "POST" && ["start", "stop", "restart", "logs"].includes(action)) {
      const body = await readRequestBody(request);
      const result = await handleLabAction(lab, action, body);
      const detailed = action === "logs" ? null : await inspectLab(lab);

      sendJson(response, 200, {
        ok: true,
        labId,
        action,
        output: (result.stdout || result.stderr || "").trim(),
        lab: detailed
      });
      return;
    }
  }

  sendJson(response, 404, { error: "Route not found." });
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    response.end();
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = requestUrl.pathname;

  try {
    if (pathname.startsWith("/api/")) {
      await handleApi(request, response, pathname);
      return;
    }

    const asset = staticFiles.get(pathname);
    if (asset) {
      sendFile(response, asset.file, asset.type);
      return;
    }

    sendJson(response, 404, { error: "Not found." });
  } catch (error) {
    sendJson(response, 500, {
      error: "Dashboard request failed.",
      details: error.stderr || error.message || String(error),
      stdout: error.stdout || ""
    });
  }
});

server.listen(port, () => {
  process.stdout.write(`Docker Labs Control Center running on http://localhost:${port}\n`);
});
