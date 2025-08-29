// server.js (Render backend for json-server)
const path = require("path");
const express = require("express");
const cors = require("cors");
const jsonServer = require("json-server");

const app = express();
const PORT = process.env.PORT || 10000;

// 1) Basic middlewares
app.use(cors());                 // allow frontend on Netlify
app.use(express.json());

// 2) Health check for Render
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// 3) json-server router (MUST be mounted BEFORE any static/catch-all)
const router = jsonServer.router(path.join(__dirname, "db.json"));
const defaults = jsonServer.defaults({
  // No static here; Netlify serves the UI
  logger: true,
  readOnly: false,
});

app.use(defaults);

// Optional: tiny no-cache for dynamic JSON
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// All resources from db.json are now under / (/, /projects, /users, /reports, /donations, /interests, /password_resets, etc.)
app.use(router);

// 4) Start
app.listen(PORT, () => {
  console.log(`JSON API listening on port ${PORT}`);
});
