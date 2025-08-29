// server.js (root)
const path = require("path");
const express = require("express");
const jsonServer = require("json-server");

const app = express();
const PORT = process.env.PORT || 5000;

// 1) Serve the React build (client/build)
const buildPath = path.join(__dirname, "client", "build");
app.use(express.static(buildPath));

// 2) JSON Server mounted at /api
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use("/api", middlewares, jsonServer.bodyParser, router);

// 3) React router fallback (for any non-API route)
app.get("*", (req, res) => {
  // If someone hits a non-existent API path, return 404
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(buildPath, "index.html"));
});

// 4) Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   ▶ API   : http://localhost:${PORT}/api`);
  console.log(`   ▶ Front : http://localhost:${PORT}/`);
});
