const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const { send } = require("process");
const router = jsonServer.router(path.join(__dirname, "../db/db.json"));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (new Date(req.body.publishDate).getTime() < new Date().getTime()) {
      return res.status(422).send({
        error: {
          publishDate: "Khong duoc publish vao thoi diem trong qua khu!",
        },
      });
    }
    if(req.body.title === 'admin') {
      return res.status(500).send({ // ,send mà nó không báo lỗi lạ thật, nên khi toast rra là Reject không như mong đợi là Loi admin roi: chú ý nhé
        error: 'Loi admin roi!'
      })
    }
  }
  // Continue to JSON Server router
  setTimeout(() => {
    next();
  }, 2000);
});

// Use default router
server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running");
});
