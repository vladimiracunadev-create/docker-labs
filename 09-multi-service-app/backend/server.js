const mongoose = require("mongoose");

const {
  createApp,
  createHttpInventoryClient,
} = require("./app");

const port = Number(process.env.PORT || 3000);
const inventoryApiBaseUrl = process.env.INVENTORY_API_BASE_URL || "http://host.docker.internal:8000";
const mongoUrl = process.env.MONGODB_URL || "mongodb://db:27017/operations_portal";

const watchlistSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, index: true },
    sku: { type: String, required: true },
    productName: { type: String, required: true },
    note: { type: String, required: true, maxlength: 280 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  },
  { timestamps: true }
);

const WatchlistItem = mongoose.model("WatchlistItem", watchlistSchema);

function createMongoWatchlistStore(model) {
  return {
    async list(limit) {
      const query = model.find().sort({ createdAt: -1 }).lean();
      if (limit) {
        query.limit(limit);
      }
      return query.exec();
    },
    async create(payload) {
      const created = await model.create(payload);
      return created.toObject();
    },
    async delete(id) {
      await model.findByIdAndDelete(id);
    },
    async ping() {
      return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    },
  };
}

async function connectWithRetry(url, retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
      console.log("MongoDB connected");
      return;
    } catch (error) {
      if (attempt === retries) throw error;
      console.warn(`MongoDB connect attempt ${attempt}/${retries} failed: ${error.message}. Retry in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function start() {
  await connectWithRetry(mongoUrl);

  const app = createApp({
    inventoryClient: createHttpInventoryClient(inventoryApiBaseUrl),
    watchlistStore: createMongoWatchlistStore(WatchlistItem),
    logger: console,
    clock: () => new Date(),
  });

  app.listen(port, () => {
    console.log(`Operations portal backend on ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start operations portal backend", error);
  process.exit(1);
});
