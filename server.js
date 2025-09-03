const path = require("path");
const express = require("express");
const cors = require("cors");
const jsonServer = require("json-server");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json());

app.get("/healthz", (_req, res) => res.status(200).send("ok"));

const router = jsonServer.router(path.join(__dirname, "db.json"));
const defaults = jsonServer.defaults({
  logger: true,
  readOnly: false,
});

app.use(defaults);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`JSON API listening on port ${PORT}`);
});
