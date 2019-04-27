var http = require("http");

function init(object) {
  console.log("Loading server");

  http
    .createServer(function(request, response) {
      console.log("Request received");
      response.writeHead(200, { "Content-Type": "application/json" });
      
      response.write(JSON.stringify(object));
      
      
      response.end();

    })
    .listen(8888);
}

exports.init = init;

