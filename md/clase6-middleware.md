
## Clase 6 : Middleware

### Handler de 404

El servidor basado en eventos que desarrollamos anteriormente es pedagógicamente bueno para aprender el manejo de eventos. Pero tiene un problema que es que no puede manejar correctamente los errores 404, ya que no es posible detectar si un evento lanzado no fue respondido por ningún Event Handler.

Para resolver este problema modificaremos el servidor con una solución más artesanal, registrando las homes en un mapa e invocándolas en los handlers de express.

Luego, agregaremos una función de "middleware". Esto significa que es una función que se ejecutará antes de las llamadas a get/post/delete/update que manejan nuestros pedidos.

Funcionan como una "chain of responsability". Se pueden agregar muchas funciones, y cada una toma la decisión de continuar con la cadena o cortarla. Es muy similar a los filters de java. En nuestro caso vamos a agregar una función que detecte si la url corresponde a una home registrada, si existe continúa la cadena y si no la corta con un error 404.


#### server.js
``` javascript
express = require("express");
bodyParser = require("body-parser");

var homes = {}


function register(home) {
  console.log(` registering handlers for ${home.type}`)
  homes[home.type] = home 
}

function init() {
  var server = express();
  server.use(bodyParser.json());

  //Esta es la función middleware: usa el | para poder separar los dos tipos de url: las que tienen una / en el medio o no
  server.use("(/:type/*)|(/:type)", (req, res, next) => {
      if (!homes[req.params.type]) {
          console.log(` home de ${req.params.type} no existe`  )
          res.status(404).end()
      }
      else {
        console.log(` home de ${req.params.type} si existe `  )
        next()
      }
  })

  server.get("/:type", (req, res) => {
    home = homes[req.params.type]
    home.all((allObjects) => {
        res.json(allObjects) 
        res.end() })       
  })

  server.get("/:type/:id", (req, res) => {
    home = homes[req.params.type]
    home.get(req.params.id, (myObject) => { 
      res.json(myObject) 
      res.end() })  
  })

  server.put("/:type", (req, res) => {
    home = homes[req.params.type]
    home.update(req.body)
    res.status(204).end();  
  })

  server.post("/:type", (req, res) => {
    home = homes[req.params.type]
    home.insert(req.body)
    res.status(204).end();  
  })

  server.delete("/:type/:id", (req, res) => {
    home = homes[req.params.type]
    home.delete(req.params.id)
    res.status(204).end();  
  });

  server.listen(8888, () => {
    console.log("Server running on port 8888");
  });
}

exports.init = init;
exports.register = register;

```