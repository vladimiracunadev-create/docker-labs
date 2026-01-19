const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Node OK ✅"));
app.get("/health", (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(3000, () => console.log("Node API running on 3000"));
