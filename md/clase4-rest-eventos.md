## Clase 4: Rest y Eventos

###  Modificando el server para que sea restful: Express

La manera más sencilla de convertir nuestro servidor en un servidor Rest es utilizando una librería como [express](https://expressjs.com/es/)
que resuelve este tipo de problemática. 

Además de express vamos a necesitar un módulo adicional que antiguamente venía includo, que permite obtener facilmente el body de un request. El mismo se llama body-parser

```
    npm install express body-parser --save
```

y este es el código fuente del servidor:

#### server.js
``` javascript
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

```

Se puede ver como se van registrando los distintos handlers para cada tipo de pedido. Es importante entender como se puede recuperar información a partir del path, usando `:`.
Para probar el servidor se puede usar cualquier cliente REST, tanto Firefox como Chrome tienen plugins que se utilizan para eso. Es importante desde el cliente usar el content-type application/json como header del pedido http.

Nuestro servidor REST se comporta de la siguiente manera:

| Method | url | body | accion 
| -------|-----|------|--------
| GET | / | | devuelve todos los objetos de la home 
| GET | /uuid | | devuelve el objeto cuyo id coincide con la url 
| POST | / | un objeto json | agrega el objeto del body a la home 
| PUT | / | un objeto json | realiza un update para el objeto dado en el body, un objeto con el mismo id ya debe existir en la home 
| DELETE | /uuid | | borra de la home el objeto cuyo id coincide con la url 


### Eventos

Una manera de lograr que nuestro servidor soporte múltiples tipos de entidades es registrar de manera tradicional distintas homes en un mapa que mantiene el server y redirija los pedidos a la home correspondiente. Si bien es una solución aceptable, vamos a hacer algo parecido usando los eventos de node, de manera que el server en lugar de tener que guardar las homes lo hará es disparar eventos, luego vamos a bindear esos eventos a la home correspondiente.

En todo mecanismo de eventos siempre hay dos Partes: Uno que dispara el evento y otro que maneja el evento. (Hay variantes, por supuesto, combinando múltiples handlers/dispatchers).

Para vincular un handler y un dispatcher se utiliza un EventEmitter del módulo events.
El método `on` se utiliza para registrar un handler, mientras que el `emit` para disparar un evento.
Un envento tiene un nombre, y opcionalmente parámetros. El handler es simplemente una función.

Primero agregamos un nueva entidad `Cliente` para que tenga sentido tener más de una home:

#### /src/cliente.js
``` javascript
class Cliente {

    constructor(nombre, direccion) {
        this.nombre = nombre;
        this.direccion = direccion;
    }
}

module.exports = Cliente;
```

Y le vamos a agregar a la home un atributo que nos indique cual es el tipo de objetos que guarda. Eso nos va a permitir asociar una url a una home:

#### src/memoryHome.js
``` javascript
uuid = require("uuid/v1")

class MemoryHome {

    constructor(type) {
        this.type = type
        this.elements = {};
    }

    insert(element) {
        element.id = uuid();
        this.elements[element.id] = element;
    }

    delete(elementId) {
        delete this.elements[elementId]
    }

    get(elementId) {
        return this.elements[elementId]
    }

    update(element) {
        if(!this.elements[element.id]) {
            throw new Error(`element ${element.id} don't exist`);
        }
        this.elements[element.id] = element
    }

    all() {
        return Object.entries(this.elements).map( (x) =>  x[1] )
    }

}

module.exports = MemoryHome
```

Vamos a registrar las homes en el server de la siguiente manera, agregando algunos objetos iniciales.

#### app.js
``` javascript
server = require("./server")
Producto = require ("./src/producto")
Cliente = require ("./src/cliente")
Home = require("./src/memoryHome")

productoHome = new Home("productos")

productoHome.insert(new Producto("alfajor", 20))
productoHome.insert(new Producto("chocolate", 30))

clienteHome = new Home("clientes")

clienteHome.insert(new Cliente("pepito", "calle falsa 123"))
clienteHome.insert(new Cliente("fulanito", "calle san martín s/n"))

server.register(productoHome)
server.register(clienteHome)
server.init();
```

Y en el server ocurre la magia. Notar como se registran los handlers para cada evento en el método `register(home)` y como se disparan los eventos para cada pedido http. Como parte del nombre del evento se incluye el nombre de la entity, lo cual sirve para que solo la home que corresponde ejecute la acción.


#### server.js
``` javascript
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

```

Nuestro servidor REST ahora se comporta de la siguiente manera:

| Method | url | body | accion 
| -------|-----|------|--------
| GET | /entity | | devuelve todos los objetos de la home correspondiente a la entity de la url 
| GET | /entity/uuid | | devuelve el objeto cuyo id coincide con la url de la home correspondiente a la entity 
| POST | /entity | un objeto json | agrega el objeto del body a la home correspondiente a la entity
| PUT | /entity | un objeto json | realiza un update para el objeto dado en el body, un objeto con el mismo id ya debe existir en la home de la entity 
| DELETE | /entity/uuid | | borra de la home correspondiente a la entity el objeto cuyo id coincide con la url 

entity puede tomar dos valores: `productos` o `clientes`