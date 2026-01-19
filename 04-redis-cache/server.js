const express = require('express');
const redis = require('redis');

const app = express();
const redisClient = redis.createClient({ host: 'redis', port: 6379 });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

app.use(express.json());

app.get('/', (req, res) => res.send('Redis Cache API OK ✅'));

app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.get('/data/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }
    // Simulate data fetch
    const data = { key, value: Math.random(), ts: new Date().toISOString() };
    await redisClient.setEx(key, 300, JSON.stringify(data)); // Cache for 5 min
    res.json({ source: 'fresh', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Redis Cache API running on 3000'));