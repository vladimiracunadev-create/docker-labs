const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = Number(process.env.PORT || 3000);
const inventoryApiBaseUrl = process.env.INVENTORY_API_BASE_URL || "http://host.docker.internal:8000";
const mongoUrl = process.env.MONGODB_URL || "mongodb://db:27017/operations_portal";

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

const watchlistSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, index: true },
    sku: { type: String, required: true },
    productName: { type: String, required: true },
    note: { type: String, required: true, maxlength: 280 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
  },
  { timestamps: true }
);

const WatchlistItem = mongoose.model("WatchlistItem", watchlistSchema);

async function fetchInventory(pathname) {
  const response = await fetch(`${inventoryApiBaseUrl}${pathname}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Inventory API error (${response.status}): ${message}`);
  }
  return response.json();
}

async function buildOverview() {
  const [summary, products, lowStockProducts, orders, watchlist] = await Promise.all([
    fetchInventory("/summary"),
    fetchInventory("/products"),
    fetchInventory("/products?low_stock_only=true"),
    fetchInventory("/orders"),
    WatchlistItem.find().sort({ createdAt: -1 }).limit(8).lean()
  ]);

  return {
    generatedAt: new Date().toISOString(),
    summary,
    products: products.slice(0, 8),
    lowStockProducts,
    orders: orders.slice(0, 6),
    watchlist
  };
}

app.get("/api/health", async (req, res) => {
  const mongoState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  let inventory = "unknown";

  try {
    await fetchInventory("/health");
    inventory = "reachable";
  } catch {
    inventory = "unreachable";
  }

  res.json({
    status: mongoState === "connected" && inventory === "reachable" ? "ok" : "degraded",
    service: "operations-portal",
    inventory,
    mongodb: mongoState
  });
});

app.get("/api/overview", async (req, res) => {
  try {
    res.json(await buildOverview());
  } catch (error) {
    res.status(502).json({
      error: "No fue posible construir el overview del portal.",
      details: error.message
    });
  }
});

app.get("/api/watchlist", async (req, res) => {
  res.json(await WatchlistItem.find().sort({ createdAt: -1 }).lean());
});

app.post("/api/watchlist", async (req, res) => {
  const { productId, sku, productName, note, priority } = req.body;

  if (!productId || !sku || !productName || !note) {
    res.status(400).json({ error: "productId, sku, productName y note son obligatorios." });
    return;
  }

  const created = await WatchlistItem.create({
    productId,
    sku,
    productName,
    note,
    priority: priority || "medium"
  });

  res.status(201).json(created);
});

app.delete("/api/watchlist/:id", async (req, res) => {
  await WatchlistItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get("/api/inventory/summary", async (req, res) => {
  try {
    res.json(await fetchInventory("/summary"));
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

async function start() {
  await mongoose.connect(mongoUrl);
  app.listen(port, () => {
    console.log(`Operations portal backend on ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start operations portal backend", error);
  process.exit(1);
});
