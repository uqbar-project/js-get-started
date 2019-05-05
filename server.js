express = require("express");
bodyParser = require("body-parser");
var events = require("events");

var eventEmitter = new events.EventEmitter();


function register(home) {
  console.log(`registering handlers for ${home.type}`)
  eventEmitter.on(`find-${home.type}`, (response)=>response.json(home.all()))
  eventEmitter.on(`get-${home.type}`, (response,id)=> response.json(home.get(id)))
  eventEmitter.on(`update-${home.type}`, (object)=> home.update(object))
  eventEmitter.on(`insert-${home.type}`, (object)=> home.insert(object))
  eventEmitter.on(`delete-${home.type}`, (id)=> home.delete(id))
}

function init() {
  var server = express();
  server.use(bodyParser.json());

  server.get("/:type", (req, res) => {
    eventEmitter.emit(`find-${req.params.type}`, res);
    res.end()
  })

  server.get("/:type/:id", (req, res) => {
    eventEmitter.emit(`get-${req.params.type}`, res, req.params.id);
    res.end()
  })

  server.put("/:type", (req, res) => {
    eventEmitter.emit(`update-${req.params.type}`, req.body);
    res.status(204).end();  
  })

  server.post("/:type", (req, res) => {
    eventEmitter.emit(`insert-${req.params.type}`, req.body);
    res.status(204).end();  
  })

  server.delete("/:type/:id", (req, res) => {
    eventEmitter.emit(`delete-${req.params.type}`, req.params.id);
    res.status(204).end();  
  });

  server.listen(8888, () => {
    console.log("Server running on port 8888");
  });
}

exports.init = init;
exports.register = register;
