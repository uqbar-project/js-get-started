express = require("express");
bodyParser = require("body-parser");

function init(home) {
  var server = express();
  server.use(bodyParser.json());

  server.get("/", (req, res) => {
    res.json(home.all());
  })

  server.get("/:id", (req, res) => {
    res.json(home.get(req.params.id));
  })

  server.put("/", (req, res) => {
    home.update(req.body);
    res.status(204).end();
  })

  server.post("/", (req, res) => {
    home.insert(req.body);
    res.status(204).end();
  })

  server.delete("/:id", (req, res) => {
    home.delete(req.params.id);
    res.status(204).end();
  });

  server.listen(8888, () => {
    console.log("Server running on port 8888");
  });
}

exports.init = init;
