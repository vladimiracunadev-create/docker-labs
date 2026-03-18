const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createApp,
  createInMemoryWatchlistStore,
} = require("../app");

function createFakeInventoryClient() {
  return {
    async summary() {
      return {
        customers: 3,
        products: 5,
        orders: 4,
        active_products: 5,
        low_stock_products: 2,
        revenue: "2905.90",
      };
    },
    async products() {
      return [
        { id: 1, sku: "LAP-14-PRO", name: "Laptop Pro 14", price: "1499.90", stock: 7 },
        { id: 2, sku: "KEY-MECH-01", name: "Teclado mecanico", price: "129.00", stock: 3 },
      ];
    },
    async lowStockProducts() {
      return [
        { id: 2, sku: "KEY-MECH-01", name: "Teclado mecanico", price: "129.00", stock: 3 },
      ];
    },
    async orders() {
      return [
        { id: 11, customer_id: 1, status: "confirmed", total_amount: "1878.90" },
        { id: 12, customer_id: 3, status: "draft", total_amount: "498.00" },
      ];
    },
    async insights() {
      return {
        generated_at: "2026-03-18T00:00:00Z",
        stock_value: "18124.30",
        revenue_confirmed: "2905.90",
        revenue_cancelled: "189.50",
        orders_by_status: [
          { status: "cancelled", orders: 1, revenue: "189.50" },
          { status: "confirmed", orders: 2, revenue: "2905.90" },
          { status: "draft", orders: 1, revenue: "498.00" },
        ],
        top_products: [
          { product_id: 1, sku: "LAP-14-PRO", name: "Laptop Pro 14", units_sold: 1, confirmed_revenue: "1499.90" },
        ],
        top_customers: [
          { customer_id: 1, name: "Acme Retail", orders: 1, confirmed_revenue: "1878.90", last_order_at: "2026-03-18T00:00:00Z" },
        ],
        recent_orders: [
          { id: 11, customer_id: 1, customer_name: "Acme Retail", status: "confirmed", item_count: 3, total_amount: "1878.90", created_at: "2026-03-18T00:00:00Z" },
        ],
        restock_recommendations: [
          { product_id: 2, sku: "KEY-MECH-01", name: "Teclado mecanico", stock: 3, units_sold: 1, recommended_restock_units: 5, urgency: "medium" },
        ],
      };
    },
    async health() {
      return { status: "ok" };
    },
  };
}

async function createServer(initialWatchlist = []) {
  const app = createApp({
    inventoryClient: createFakeInventoryClient(),
    watchlistStore: createInMemoryWatchlistStore(initialWatchlist),
    logger: { info() {} },
    clock: () => new Date("2026-03-18T12:00:00.000Z"),
  });

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  return {
    server,
    baseUrl: `http://127.0.0.1:${server.address().port}`,
  };
}

test("overview exposes richer portal scenario data", async (t) => {
  const { server, baseUrl } = await createServer([
    {
      _id: "w-1",
      productId: 2,
      sku: "KEY-MECH-01",
      productName: "Teclado mecanico",
      note: "Validar proveedor",
      priority: "high",
      createdAt: "2026-03-18T10:00:00.000Z",
      updatedAt: "2026-03-18T10:00:00.000Z",
    },
  ]);
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/overview`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.watchlistSummary.highPriority, 1);
  assert.equal(body.insights.restock_recommendations[0].sku, "KEY-MECH-01");
  assert.ok(Array.isArray(body.attentionBoard));
  assert.ok(body.attentionBoard.some((item) => item.title.includes("Reponer")));
});

test("watchlist CRUD keeps portal state coherent", async (t) => {
  const { server, baseUrl } = await createServer();
  t.after(() => server.close());

  const createResponse = await fetch(`${baseUrl}/api/watchlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: 1,
      sku: "LAP-14-PRO",
      productName: "Laptop Pro 14",
      note: "Revisar demanda de preventa",
      priority: "medium",
    }),
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();

  const listResponse = await fetch(`${baseUrl}/api/watchlist`);
  const listed = await listResponse.json();
  assert.equal(listed.length, 1);
  assert.equal(listed[0]._id, created._id);

  const deleteResponse = await fetch(`${baseUrl}/api/watchlist/${created._id}`, { method: "DELETE" });
  assert.equal(deleteResponse.status, 204);

  const emptyResponse = await fetch(`${baseUrl}/api/watchlist`);
  const emptyList = await emptyResponse.json();
  assert.equal(emptyList.length, 0);
});

test("metrics endpoint exports operational signals", async (t) => {
  const { server, baseUrl } = await createServer([
    {
      _id: "w-2",
      productId: 2,
      sku: "KEY-MECH-01",
      productName: "Teclado mecanico",
      note: "Seguir stock",
      priority: "high",
      createdAt: "2026-03-18T10:00:00.000Z",
      updatedAt: "2026-03-18T10:00:00.000Z",
    },
  ]);
  t.after(() => server.close());

  await fetch(`${baseUrl}/api/overview`);
  const response = await fetch(`${baseUrl}/metrics`);
  assert.equal(response.status, 200);
  const body = await response.text();

  assert.match(body, /operations_portal_requests_total/);
  assert.match(body, /operations_portal_watchlist_total 1/);
  assert.match(body, /operations_portal_inventory_reachable 1/);
});
