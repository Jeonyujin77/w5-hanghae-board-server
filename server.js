const { createProxyMiddleware } = require("http-proxy-middleware");
const jsonServer = require("json-server");
const path = require("path");
const url = require("url");
const cors = require("cors");
const {
  filteredPasswordObjs,
  filteredPasswordObj,
  getDomain,
  validPassword,
  sortedBy,
} = require("./utils");

const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname + "/db.json"));
const middlewares = jsonServer.defaults({
  static: path.resolve(__dirname + "/../build/"),
});

server.use(middlewares);

const port = process.env.PORT || 3001;

server.get("/posts", (req, res) => {
  const { _sort, _order } = url.parse(req.url, true).query;
  return res.jsonp(
    sortedBy(filteredPasswordObjs(router.db.__wrapped__.posts), _sort, _order)
  );
});

server.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  return res.jsonp(
    filteredPasswordObj(
      router.db.__wrapped__.posts.find((post) => post.id.toString() === id)
    )
  );
});

server.get("/comments", (req, res) => {
  const { _sort, _order } = url.parse(req.url, true).query;
  const { postId } = url.parse(req.url, true).query;
  return res.jsonp(
    sortedBy(
      filteredPasswordObjs(
        router.db.__wrapped__.comments.filter(
          (comment) => comment.postId === postId
        )
      ),
      _sort,
      _order
    )
  );
});

server.use((req, res, next) => {
  if (req.method.toString() === "PATCH" || req.method.toString() === "DELETE") {
    if (!req?.body) {
      return res.status(400).send({ message: "입력이 올바르지 않습니다." });
    }
    const { id, password } = req.body;
    if (
      !password ||
      !validPassword(
        router.db.__wrapped__[getDomain(req.originalUrl)],
        id,
        password
      )
    ) {
      return res.status(400).send({ message: "비밀번호를 확인하세요" });
    }
  }
  next();
});

server.use(jsonServer.bodyParser);

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

server.use(cors());

server.use(router);

server.listen(port, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
