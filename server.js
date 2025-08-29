// server.js (root)
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({ static: "public" });

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("JSON Server running on port", port);
});
