const express = require("express");
const path = require("path");
const app = express();

const buildPath = path.join(__dirname, "client", "build");
app.use(express.static(buildPath));

app.get("/healthz", (_, res) => res.send("ok"));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Web server listening on ${port}`));
