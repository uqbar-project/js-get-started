var http = require("http");

function init(home, id_elemento) {
  console.log("Loading server");
  
  http
    .createServer(function(request, response) {
      console.log(`Request received, `);
      elemento = home.get(id_elemento)
      elemento.precio = elemento.precio + 10
      home.update(elemento)

      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(elemento));
      response.end();
    })
    .listen(8888);
}

exports.init = init;
