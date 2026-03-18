const express = require("express");
const { randomUUID } = require("crypto");

function createHttpInventoryClient(baseUrl) {
  async function fetchInventory(pathname) {
    const response = await fetch(`${baseUrl}${pathname}`);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Inventory API error (${response.status}): ${message}`);
    }
    return response.json();
  }

  return {
    summary: () => fetchInventory("/summary"),
    products: () => fetchInventory("/products?limit=12"),
    lowStockProducts: () => fetchInventory("/products?low_stock_only=true&limit=12"),
    orders: () => fetchInventory("/orders?limit=8"),
    insights: () => fetchInventory("/insights"),
    health: () => fetchInventory("/health"),
  };
}

function createInMemoryWatchlistStore(initialItems = []) {
  const items = [...initialItems].map((item) => ({ ...item }));

  return {
    async list(limit) {
      const sorted = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (!limit) {
        return sorted;
      }
      return sorted.slice(0, limit);
    },
    async create(payload) {
      const createdAt = new Date().toISOString();
      const created = {
        _id: randomUUID(),
        ...payload,
        createdAt,
        updatedAt: createdAt,
      };
      items.unshift(created);
      return created;
    },
    async delete(id) {
      const index = items.findIndex((item) => item._id === id);
      if (index >= 0) {
        items.splice(index, 1);
      }
    },
    async ping() {
      return "connected";
    },
  };
}

function summarizeWatchlist(items) {
  const summary = {
    total: items.length,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  };

  for (const item of items) {
    if (item.priority === "high") {
      summary.highPriority += 1;
    } else if (item.priority === "low") {
      summary.lowPriority += 1;
    } else {
      summary.mediumPriority += 1;
    }
  }

  return summary;
}

function getStatusCount(ordersByStatus, status) {
  return ordersByStatus.find((item) => item.status === status)?.orders || 0;
}

function buildAttentionBoard({ lowStockProducts, watchlistSummary, insights }) {
  const attention = [];

  for (const recommendation of insights.restock_recommendations.slice(0, 3)) {
    attention.push({
      type: "restock",
      severity: recommendation.urgency,
      title: `Reponer ${recommendation.sku}`,
      detail: `${recommendation.name} tiene stock ${recommendation.stock} y sugiere reponer ${recommendation.recommended_restock_units} unidades.`,
    });
  }

  const highPriorityNotes = watchlistSummary.highPriority;
  if (highPriorityNotes > 0) {
    attention.push({
      type: "watchlist",
      severity: "high",
      title: "Watchlist prioritaria activa",
      detail: `${highPriorityNotes} notas operativas marcadas como alta prioridad requieren seguimiento.`,
    });
  }

  const draftOrders = getStatusCount(insights.orders_by_status, "draft");
  if (draftOrders > 0) {
    attention.push({
      type: "orders",
      severity: "medium",
      title: "Pedidos en borrador",
      detail: `${draftOrders} pedidos aun no fueron confirmados y pueden impactar stock o revenue futuro.`,
    });
  }

  const cancelledOrders = getStatusCount(insights.orders_by_status, "cancelled");
  if (cancelledOrders > 0) {
    attention.push({
      type: "orders",
      severity: "medium",
      title: "Pedidos cancelados detectados",
      detail: `${cancelledOrders} pedidos cancelados deben revisarse para entender causas de friccion o demanda perdida.`,
    });
  }

  if (lowStockProducts.length > 0) {
    attention.push({
      type: "stock",
      severity: "medium",
      title: "Stock critico visible",
      detail: `${lowStockProducts.length} productos estan bajo el umbral de stock bajo del core transaccional.`,
    });
  }

  return attention.slice(0, 6);
}

function renderPrometheusMetrics(snapshot) {
  const lines = [
    "# HELP operations_portal_requests_total Total HTTP requests handled by the operations portal backend.",
    "# TYPE operations_portal_requests_total counter",
    `operations_portal_requests_total ${snapshot.requestMetrics.total}`,
    "# HELP operations_portal_requests_by_status_class Total HTTP requests grouped by status class.",
    "# TYPE operations_portal_requests_by_status_class counter",
  ];

  for (const [statusClass, count] of Object.entries(snapshot.requestMetrics.byStatusClass)) {
    lines.push(`operations_portal_requests_by_status_class{status_class="${statusClass}"} ${count}`);
  }

  lines.push(
    "# HELP operations_portal_inventory_reachable Inventory core reachability (1=reachable, 0=unreachable).",
    "# TYPE operations_portal_inventory_reachable gauge",
    `operations_portal_inventory_reachable ${snapshot.inventoryReachable ? 1 : 0}`,
    "# HELP operations_portal_watchlist_total Total watchlist items tracked by the portal.",
    "# TYPE operations_portal_watchlist_total gauge",
    `operations_portal_watchlist_total ${snapshot.watchlistSummary.total}`,
    "# HELP operations_portal_watchlist_priority_total Watchlist items grouped by priority.",
    "# TYPE operations_portal_watchlist_priority_total gauge",
    `operations_portal_watchlist_priority_total{priority="high"} ${snapshot.watchlistSummary.highPriority}`,
    `operations_portal_watchlist_priority_total{priority="medium"} ${snapshot.watchlistSummary.mediumPriority}`,
    `operations_portal_watchlist_priority_total{priority="low"} ${snapshot.watchlistSummary.lowPriority}`,
    "# HELP operations_portal_attention_items_total Active attention items built for operators.",
    "# TYPE operations_portal_attention_items_total gauge",
    `operations_portal_attention_items_total ${snapshot.attentionBoard.length}`
  );

  return `${lines.join("\n")}\n`;
}

async function buildOverview(inventoryClient, watchlistStore, clock) {
  const [summary, products, lowStockProducts, orders, insights, watchlist] = await Promise.all([
    inventoryClient.summary(),
    inventoryClient.products(),
    inventoryClient.lowStockProducts(),
    inventoryClient.orders(),
    inventoryClient.insights(),
    watchlistStore.list(8),
  ]);

  const watchlistSummary = summarizeWatchlist(watchlist);
  const attentionBoard = buildAttentionBoard({ lowStockProducts, watchlistSummary, insights });

  return {
    generatedAt: clock().toISOString(),
    summary,
    products: products.slice(0, 8),
    lowStockProducts,
    orders: orders.slice(0, 6),
    watchlist,
    watchlistSummary,
    insights,
    attentionBoard,
  };
}

function createApp({
  inventoryClient,
  watchlistStore,
  logger = console,
  clock = () => new Date(),
}) {
  const app = express();
  const requestMetrics = {
    total: 0,
    byStatusClass: {
      "2xx": 0,
      "4xx": 0,
      "5xx": 0,
    },
  };

  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use((req, res, next) => {
    const startedAt = process.hrtime.bigint();
    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const statusCode = res.statusCode || 500;
      const statusClass = `${Math.floor(statusCode / 100)}xx`;
      requestMetrics.total += 1;
      requestMetrics.byStatusClass[statusClass] = (requestMetrics.byStatusClass[statusClass] || 0) + 1;
      logger.info?.(`[operations-portal] ${req.method} ${req.originalUrl} -> ${statusCode} (${durationMs.toFixed(1)}ms)`);
    });
    next();
  });

  app.use((req, res, next) => {
    const startedAt = process.hrtime.bigint();
    const originalEnd = res.end;
    res.end = function patchedEnd(...args) {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      res.setHeader("X-Response-Time-Ms", durationMs.toFixed(2));
      return originalEnd.apply(this, args);
    };
    next();
  });

  app.get("/api/health", async (req, res) => {
    const [mongoState, inventoryHealth] = await Promise.all([
      watchlistStore.ping().catch(() => "disconnected"),
      inventoryClient.health().then(() => "reachable").catch(() => "unreachable"),
    ]);

    res.json({
      status: mongoState === "connected" && inventoryHealth === "reachable" ? "ok" : "degraded",
      service: "operations-portal",
      inventory: inventoryHealth,
      mongodb: mongoState,
      observedAt: clock().toISOString(),
    });
  });

  app.get("/api/overview", async (req, res) => {
    try {
      res.json(await buildOverview(inventoryClient, watchlistStore, clock));
    } catch (error) {
      res.status(502).json({
        error: "No fue posible construir el overview del portal.",
        details: error.message,
      });
    }
  });

  app.get("/api/alerts", async (req, res) => {
    try {
      const overview = await buildOverview(inventoryClient, watchlistStore, clock);
      res.json({
        generatedAt: overview.generatedAt,
        attentionBoard: overview.attentionBoard,
        watchlistSummary: overview.watchlistSummary,
      });
    } catch (error) {
      res.status(502).json({ error: error.message });
    }
  });

  app.get("/api/watchlist", async (req, res) => {
    res.json(await watchlistStore.list());
  });

  app.post("/api/watchlist", async (req, res) => {
    const { productId, sku, productName, note, priority } = req.body;

    if (!productId || !sku || !productName || !note) {
      res.status(400).json({ error: "productId, sku, productName y note son obligatorios." });
      return;
    }

    const created = await watchlistStore.create({
      productId,
      sku,
      productName,
      note,
      priority: priority || "medium",
    });

    res.status(201).json(created);
  });

  app.delete("/api/watchlist/:id", async (req, res) => {
    await watchlistStore.delete(req.params.id);
    res.status(204).end();
  });

  app.get("/api/inventory/summary", async (req, res) => {
    try {
      res.json(await inventoryClient.summary());
    } catch (error) {
      res.status(502).json({ error: error.message });
    }
  });

  app.get("/metrics", async (req, res) => {
    try {
      const overview = await buildOverview(inventoryClient, watchlistStore, clock);
      const inventoryReachable = await inventoryClient.health().then(() => true).catch(() => false);
      res.type("text/plain").send(
        renderPrometheusMetrics({
          requestMetrics,
          inventoryReachable,
          watchlistSummary: overview.watchlistSummary,
          attentionBoard: overview.attentionBoard,
        })
      );
    } catch (error) {
      res.status(500).type("text/plain").send(`# metrics_error ${JSON.stringify(error.message)}\n`);
    }
  });

  return app;
}

module.exports = {
  buildAttentionBoard,
  createApp,
  createHttpInventoryClient,
  createInMemoryWatchlistStore,
  summarizeWatchlist,
};
