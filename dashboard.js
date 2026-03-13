const state = {
  labs: [],
  filteredLabs: [],
  selectedLabId: null
};

const els = {
  total: document.getElementById("metric-total"),
  healthy: document.getElementById("metric-healthy"),
  running: document.getElementById("metric-running"),
  attention: document.getElementById("metric-attention"),
  generatedAt: document.getElementById("generated-at"),
  featuredGrid: document.getElementById("featured-grid"),
  labGrid: document.getElementById("lab-grid"),
  search: document.getElementById("search"),
  selectionTitle: document.getElementById("selection-title"),
  selectionMeta: document.getElementById("selection-meta"),
  selectionStatus: document.getElementById("selection-status"),
  selectionGoal: document.getElementById("selection-goal"),
  selectionGuidance: document.getElementById("selection-guidance"),
  selectionServices: document.getElementById("selection-services"),
  selectionLinks: document.getElementById("selection-links"),
  selectionActions: document.getElementById("selection-actions"),
  logsTitle: document.getElementById("logs-title"),
  logsOutput: document.getElementById("logs-output"),
  refresh: document.getElementById("refresh-all"),
  startAll: document.getElementById("start-all"),
  stopAll: document.getElementById("stop-all"),
  removeAll: document.getElementById("remove-all")
};

function formatTimestamp(value) {
  return value ? new Date(value).toLocaleString("es-CL") : "sin datos";
}

function statusLabel(status) {
  const labels = {
    healthy: "Saludable",
    running: "Corriendo",
    degraded: "Degradado",
    partial: "Parcial",
    stopped: "Detenido"
  };
  return labels[status] || status;
}

function categoryLabel(category) {
  const labels = {
    platform: "Plataforma",
    infra: "Infraestructura",
    starter: "Starter"
  };
  return labels[category] || "General";
}

function summarizeLab(lab) {
  return `${lab.summary.discoveredServices}/${lab.summary.expectedServices} contenedores detectados`;
}

function primaryUrl(lab) {
  return (lab.urls || [])[0] || null;
}

function statusExplanation(lab) {
  const map = {
    healthy: "El entorno esta arriba y los servicios con healthcheck reportan operacion correcta.",
    running: "El entorno esta corriendo, pero todavia no todos los servicios reportan salud.",
    degraded: "El lab levanto, pero al menos un servicio necesita revision.",
    partial: "Solo una parte del lab esta activa; el despliegue aun no esta completo.",
    stopped: "No hay contenedores activos para este lab."
  };
  return map[lab.summary.status] || "Estado sin clasificar.";
}

function renderMetrics(overview) {
  els.total.textContent = overview.totals.total;
  els.healthy.textContent = overview.totals.healthy;
  els.running.textContent = overview.totals.running;
  els.attention.textContent = overview.totals.needsAttention;
  els.generatedAt.textContent = `Ultima lectura: ${formatTimestamp(overview.generatedAt)}`;
}

function renderFeatured(labs) {
  const featured = labs.filter((lab) => lab.featured);
  if (!featured.length) {
    els.featuredGrid.innerHTML = `<div class="empty-card">Todavia no hay sistemas destacados configurados.</div>`;
    return;
  }

  els.featuredGrid.innerHTML = featured.map((lab) => `
    <article class="featured-card ${lab.summary.status}">
      <div class="featured-head">
        <div>
          <span class="tag">${lab.systemRole || categoryLabel(lab.category)}</span>
          <h3>${lab.name}</h3>
        </div>
        <span class="status-badge ${lab.summary.status}">
          <span class="status-dot"></span>
          <span>${statusLabel(lab.summary.status)}</span>
        </span>
      </div>
      <p class="lab-copy">${lab.goal || lab.description}</p>
      <div class="tag-row">
        <span class="tag">${lab.stack}</span>
        <span class="tag">${categoryLabel(lab.category)}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary" data-select="${lab.id}">Ver detalle</button>
        ${primaryUrl(lab) ? `<a class="btn btn-primary" href="${primaryUrl(lab).url}" target="_blank" rel="noreferrer">Abrir ${lab.primaryEntryLabel || primaryUrl(lab).label}</a>` : ""}
      </div>
    </article>
  `).join("");
}

function renderStatusSummary(lab) {
  const primary = primaryUrl(lab);
  return `
    <div class="summary-card">
      <div class="summary-row">
        <span class="summary-label">Estado Docker</span>
        <span class="status-badge ${lab.summary.status}">
          <span class="status-dot"></span>
          <span>${statusLabel(lab.summary.status)}</span>
        </span>
      </div>
      <p class="summary-copy">${statusExplanation(lab)}</p>
      <div class="summary-grid">
        <div>
          <span class="summary-label">Categoria</span>
          <strong>${categoryLabel(lab.category)}</strong>
        </div>
        <div>
          <span class="summary-label">Rol</span>
          <strong>${lab.systemRole || "No definido"}</strong>
        </div>
        <div>
          <span class="summary-label">Contenedores activos</span>
          <strong>${lab.summary.running}</strong>
        </div>
        <div>
          <span class="summary-label">Entrada principal</span>
          <strong>${primary ? primary.label : "Sin URL"}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderGoal(lab) {
  const blocks = [
    `<div class="guidance-item"><strong>Objetivo</strong><div>${lab.goal || lab.description}</div></div>`
  ];

  if ((lab.relatedLabs || []).length) {
    blocks.push(
      `<div class="guidance-item"><strong>Relacion con otros labs</strong><div>${lab.relatedLabs.join(" -> ")}</div></div>`
    );
  }

  return blocks.join("");
}

function renderGuidance(lab) {
  const items = (lab.recommendedActions || []).length
    ? lab.recommendedActions
    : [
        "Usa Levantar entorno cuando quieras iniciar este stack en Docker.",
        primaryUrl(lab)
          ? `Usa Abrir sistema para entrar directamente a ${primaryUrl(lab).label} y ver la aplicacion real.`
          : "Este lab no expone una URL principal, asi que debes operarlo desde logs o servicios internos.",
        "Usa Ver logs si algo no responde, queda parcial o parece caido."
      ];

  return items.map((item) => `<div class="guidance-item">${item}</div>`).join("");
}

function renderServices(services) {
  if (!services.length) {
    return `<div class="empty">Este lab no tiene contenedores activos. Primero debes levantar el entorno.</div>`;
  }

  return services.map((service) => `
    <div class="service-row">
      <div>
        <strong>${service.service}</strong>
        <div class="service-meta">${service.name} · ${service.status}</div>
      </div>
      <div class="service-pill ${service.health === "healthy" ? "healthy" : service.state}">
        <span class="status-dot"></span>
        <span>${service.health !== "none" ? service.health : service.state}</span>
      </div>
    </div>
  `).join("");
}

function renderLinks(urls) {
  if (!urls.length) {
    return `<div class="empty">Este lab no publica URLs directas.</div>`;
  }

  return urls.map((item, index) => `
    <a class="btn ${index === 0 ? "btn-primary" : "btn-secondary"}" href="${item.url}" target="_blank" rel="noreferrer">
      ${index === 0 ? `Abrir sistema · ${item.label}` : `Abrir ${item.label}`}
    </a>
  `).join("");
}

function renderActions(lab) {
  return `
    <button class="btn btn-primary" data-action="start" data-lab="${lab.id}">Levantar entorno</button>
    <button class="btn btn-secondary" data-action="restart" data-lab="${lab.id}">Reiniciar</button>
    <button class="btn btn-danger" data-action="stop" data-lab="${lab.id}">Detener</button>
    <button class="btn btn-ghost" data-action="logs" data-lab="${lab.id}">Ver logs</button>
    <button class="btn btn-secondary" data-action="rebuild" data-lab="${lab.id}">Reconstruir</button>
  `;
}

function selectLab(labId) {
  const lab = state.labs.find((item) => item.id === labId);
  if (!lab) {
    return;
  }

  state.selectedLabId = labId;
  els.selectionTitle.textContent = lab.name;
  els.selectionMeta.textContent = `${lab.stack} · ${statusLabel(lab.summary.status)} · ${summarizeLab(lab)}`;
  els.selectionStatus.innerHTML = renderStatusSummary(lab);
  els.selectionGoal.innerHTML = renderGoal(lab);
  els.selectionGuidance.innerHTML = renderGuidance(lab);
  els.selectionServices.innerHTML = renderServices(lab.containers);
  els.selectionLinks.innerHTML = renderLinks(lab.urls);
  els.selectionActions.innerHTML = renderActions(lab);
  els.logsTitle.textContent = `Salida operativa: ${lab.name}`;
}

function renderLabCards() {
  if (!state.filteredLabs.length) {
    els.labGrid.innerHTML = `<div class="panel"><div class="empty">No hay labs que coincidan con la busqueda actual.</div></div>`;
    return;
  }

  els.labGrid.innerHTML = state.filteredLabs.map((lab) => `
    <article class="lab-card">
      <div class="lab-head">
        <div>
          <div class="lab-id">${lab.id}</div>
          <h3 class="lab-title">${lab.name}</h3>
        </div>
        <div class="status-badge ${lab.summary.status}">
          <span class="status-dot"></span>
          <span>${statusLabel(lab.summary.status)}</span>
        </div>
      </div>
      <p class="lab-copy">${lab.description}</p>
      <div class="tag-row">
        <span class="tag">${lab.stack}</span>
        <span class="tag">${categoryLabel(lab.category)}</span>
      </div>
      <div class="mini-summary">
        <div><span>Docker</span><strong>${statusLabel(lab.summary.status)}</strong></div>
        <div><span>Saludables</span><strong>${lab.summary.healthy}</strong></div>
        <div><span>Activos</span><strong>${lab.summary.running}</strong></div>
      </div>
      <div class="tag-row">
        ${lab.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary" data-select="${lab.id}">Ver detalle</button>
        ${primaryUrl(lab) ? `<a class="btn btn-primary" href="${primaryUrl(lab).url}" target="_blank" rel="noreferrer">Abrir sistema</a>` : ""}
        <button class="btn btn-secondary" data-action="start" data-lab="${lab.id}">Levantar</button>
        <button class="btn btn-danger" data-action="stop" data-lab="${lab.id}">Detener</button>
      </div>
    </article>
  `).join("");
}

function applyFilter() {
  const query = els.search.value.trim().toLowerCase();
  state.filteredLabs = state.labs.filter((lab) => {
    const haystack = [
      lab.id,
      lab.name,
      lab.description,
      lab.stack,
      lab.goal || "",
      lab.systemRole || "",
      ...(lab.tags || [])
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
  renderLabCards();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.details || payload.error || "Request failed");
  }
  return payload;
}

async function loadOverview(preferredLabId = state.selectedLabId) {
  const overview = await fetchJson("/api/overview");
  state.labs = overview.labs;
  renderMetrics(overview);
  renderFeatured(state.labs);
  applyFilter();

  if (!state.selectedLabId && state.labs.length) {
    selectLab(state.labs.find((lab) => lab.featured)?.id || state.labs[0].id);
  } else if (preferredLabId) {
    selectLab(preferredLabId);
  }
}

async function runAction(labId, action) {
  els.logsOutput.textContent = "Ejecutando accion sobre Docker...";
  const body = action === "rebuild" ? { rebuild: true } : {};
  const actualAction = action === "rebuild" ? "start" : action;
  const payload = await fetchJson(`/api/labs/${labId}/${actualAction}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  els.logsOutput.textContent = payload.output || "Accion completada sin salida adicional.";
  await loadOverview(labId);
}

async function runWorkspaceAction(action, confirmationMessage = "") {
  if (confirmationMessage && !window.confirm(confirmationMessage)) {
    return;
  }

  els.logsOutput.textContent = "Ejecutando accion global sobre los entornos del repositorio...";
  const payload = await fetchJson(`/api/workspace/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  els.logsOutput.textContent = payload.output || "Accion global completada.";
  await loadOverview(state.selectedLabId);
}

async function loadLogs(labId) {
  const payload = await fetchJson(`/api/labs/${labId}/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tail: 160 })
  });
  els.logsOutput.textContent = payload.output || "No hay logs disponibles.";
}

document.addEventListener("click", async (event) => {
  const selectId = event.target.getAttribute("data-select");
  if (selectId) {
    selectLab(selectId);
    return;
  }

  const labId = event.target.getAttribute("data-lab");
  const action = event.target.getAttribute("data-action");
  if (!labId || !action) {
    return;
  }

  try {
    event.target.disabled = true;
    if (action === "logs") {
      await loadLogs(labId);
    } else {
      await runAction(labId, action);
    }
  } catch (error) {
    els.logsOutput.textContent = error.message;
  } finally {
    event.target.disabled = false;
  }
});

els.search.addEventListener("input", applyFilter);
els.refresh.addEventListener("click", () => loadOverview());
els.startAll.addEventListener("click", async () => {
  els.logsOutput.textContent = "Levantando los labs del repositorio uno por uno. Esto puede tardar varios minutos.";
  for (const lab of state.labs) {
    try {
      await runAction(lab.id, "start");
    } catch (error) {
      els.logsOutput.textContent = `Fallo al iniciar ${lab.id}: ${error.message}`;
      break;
    }
  }
});
els.stopAll.addEventListener("click", () => runWorkspaceAction("stop-all", "Esto bajara todos los entornos Docker de este repositorio. Deseas continuar?"));
els.removeAll.addEventListener("click", () => runWorkspaceAction("remove-all", "Esto eliminara contenedores, redes y volumenes de los entornos de este repositorio. Deseas continuar?"));

loadOverview().catch((error) => {
  els.logsOutput.textContent = error.message;
});
