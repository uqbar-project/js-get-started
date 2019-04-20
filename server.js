var http = require("http");
var events = require("events");
var eventEmitter = new events.EventEmitter();

function init(restHandler) {
  console.log("Loading server");

  eventEmitter.on("request", restHandler.onRequest);   

  http
    .createServer(function(request, response) {
      console.log("Request received");
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write("<html><head><title>js example </title></head><body><h1>Response</h1><p>\n");
      eventEmitter.emit('request', response);
      response.write("</p></body></html>") ;
      response.end();

    })
    .listen(8888);
}

exports.init = init;

