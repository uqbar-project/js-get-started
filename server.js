var http = require("http");

function init() {
  console.log("Loading server");

  http
    .createServer(function(request, response) {
      console.log("Request received");
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write("Hola Mundo");
      response.end();
    })
    .listen(8888);
}

exports.init = init;