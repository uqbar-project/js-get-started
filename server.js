var http = require("http");
var path = require("path")

function responderJson(response, elemento) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(JSON.stringify(elemento));
  response.end();
}

function init(home) {
  console.log("Loading server");
  
  http
    .createServer(function(request, response) {
      console.log(`Request received, `);

      const ruta = path.normalize(request.url);
      if (ruta  == "/") {
        responderJson(response, {mensaje: "¡Hola!"})
      } else if (ruta == "/productos") {
        responderJson(response, home.all());
      } else if (ruta.startsWith("/productos") ) {
        const id = ruta.split("/").pop()
        const producto = home.get(id);

        if (request.method == "POST") {
          producto.aumentarPrecio()
          home.update(producto)
        }
        
        responderJson(response, home.get(id))
      } else {
        response.writeHead(404, "Not found")
        response.end()
      }
    })
    .listen(8888);
}

exports.init = init;

