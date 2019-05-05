# js-get-started
Proyecto para ir aprendiendo el desarrollo de aplicaciones con javascript. 

[Clase 1: Herramientas, Ambiente de desarrollo y Hello World](md/clase1-herramientas-ambiente-hello-world.md)
## Clase 2: Objetos, Clases y Testing

#### Objetos

Vamos a ir construyendo un servidor REST para manipula el CRUD de un entidad. 

En principio vamos a hacer que nuestro servidor devuelva [json](https://www.json.org/). Un json es una notación para describir un objeto javascript que ha tomado popularidad para ser usado también como standard para el intercambio de información, reemplazando lo que anteriormente era dominio de XML.

La estrategia será tener un objeto y renderizarlo a json. Hay muchas
maneras distintas de tener objetos, ya que los mismos se pueden crear dinámicamente, con clases o funciones.

app.js
```
server = require("./server")

var myObject = {
    "nombre": "alfajor", 
    "precio": 20
} 

server.init(myObject);
```

server.js
```
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
```
### Clases
También podemos construir el objeto a partir de una clase.
En este ejemplo se cambia solo la app.js para usar clases. El servidor
no se entera del cambio, le da igual.

app.js
```
server = require("./server")

class Producto {

    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}


var myObject = new Producto("alfajor", 20);

server.init(myObject);
```

Podemos sacar la clase a un archivo externo e importarlo como módulo de node. La preparación de un módulo que exporta un constructor es levemente distinta. Se debe usar `module.exports` y asignarle la Clase.
Además vamos a ir escribiendo nuestros clases dentro de una subcarpeta `src` para mantener el root un poco más prolijo:

src/producto.js
```
class Producto {

    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

module.exports = Producto;
```

app.js
```
server = require("./server")
Producto = require ("./producto")

var myObject = new Producto("alfajor", 20);

server.init(myObject);
```



###  Unit Testing

En nuestro afán por construir un servidor REST para resolver un CRUD, vamos a construir primer un objeto Home. En nuestra primera versión 
la persistencia de los objetos será en memoria. Para ayudarnos a crear 
los id vamos a usar un módulo externo `uuid`.

Como ya vamos a empezar a usar cosas externas a node, vamos generar también el `package.json` donde dice entre otras cosas cuales son los módulos externos que se requieren para ejecutar proyecto. 

```
npm init
```
La mayoría de las opciones ofrecidas por default son buenas. Como licencia podemos usar `GPL-3.0-or-later`. Todos los valores pueden ser luego modificados. En particular nos puede interesar modificar el valor del script `start` para que utilice nuestra app en lugar del server. Esto permitiría iniciar nuestra aplicaciones ejecutando `npm start`

Luego instalamos el módulo `uuid`. Usamos la opción `--save` así modifica el package.json para agregar la dependencia

Hay que tener en cuenta que todos los módulos que se bajen quedarán guardados en la carpeta `node_modules`. Esta carpeta se debe agregar al .gitignore

```
 npm install uuid --save
```

Y escribimos nuetra home:

src/memoryHome.js
```
uuid = require("uuid/v1")

class MemoryHome {

    constructor() {
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

Algunas consideraciones:
 1. La expresión ` (x)=>x[1] ` es una manera abreviada de escribir `function (x) {return x[1]} )`. Es una manera de escribir una función con una notación más parecida a las lambdas de otros lenguajes. Se usa bastante cuando se quiere programar con un estilo más parecido al funcional
2. Si bien existen los objetos "map" en javascript, la mayoría de la funcionalidad de un mapa puede ser resuelto simplemente con un objeto simple. Por eso guardamos en "elements" un objeto vacío.
3. La función Object.entries permite obtener un array con  todos los atributos de un objeto, Por ejemplo si tengo este objeto: 
`var choco = {"nombre": "chocolate", "precio": 20}` 
La llamada a `Object.entries(choco)` devuelve el siguiente array
`[["nombre", "chocolate"], ["precio", 20]]`
4. La home le agrega un atributo "id" a los objetos. Este atributo no está definido en la clase ni en ningún lado, no hace falta porque es un lenguaje
dinámico.
5. `undefined` es una referencia a un objeto que significa eso. 
Cuando a un objeto se le pide un atributo que no contiene devuelve `undefined`. `if(undefined)` devuelve false, así que se puede usar para saber si existe un elemento o no.


Esta clase ya comienza a tener comportamiento que nos gustaría testear de manera automática, 

Existen varias variantes para realizar testing automático. Dos frameworks muy utilizados en conjunto son [Mocha](https://mochajs.org/) para correr test y [Chai](https://www.chaijs.com/) para realizar aserciones. Sin embargo en este proyecto vamos a utilizar [Jest](https://jestjs.io/)


Luego instalamos jest, y usamos la opción --save-dev para que se incluya en el package.json como dependencia de desarrollo

```
npm install jest --save-dev
```
y modificamos el atributo test de script en el package.json para que use jest:

package.json
```
{
  "name": "js-get-started",
  "version": "1.0.0",
  "description": "js tutorial",
  "main": "app.js",
  "scripts": {
    "test": "jest",
    "start": "node app.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/uqbar-project/js-get-started.git"
  },
  "keywords": [
    "js",
    "tutorial",
    "node"
  ],
  "author": "lgassman",
  "license": "GPL-3.0-or-later",
  "bugs": {
    "url": "https://github.com/uqbar-project/js-get-started/issues"
  },
  "homepage": "https://github.com/uqbar-project/js-get-started#readme",
  "dependencies": {
    "uuid": "^3.3.2"
  },
  "devDependencies": {
    "jest": "^24.7.1"
  }
}

```

Luego escribimos algunos test. Para lo cual creamos un archivo separado:


Y finalmente vamos a escribir algunos test. Por prolijidad lo vamos a escrivir en una subcarpeta `test`. Jest requiere para encontrar los test que el archivo donde se escriben los mismos tengan extensión .test.js

/tests/memoryHomeTest.js

```
MemoryHome = require("../src/memoryHome")
Product = require ("../src/producto")

var home
var chocolate
var alfajor


function setup() {
    home = new MemoryHome()
    chocolate = new Product("chocolate", 30)
    alfajor = new Product("alfajor", 20)
    home.insert(alfajor)
    home.insert(chocolate)
}

function get() {
    expect(home.get(chocolate.id)).toBe(chocolate)
    expect(home.get(alfajor.id)).toBe(alfajor)
}

function getNotContained() {
    expect(home.get("pirulito")).toBe(undefined)
}

function deleteObject() {
    home.delete(chocolate.id);
    expect(home.get(chocolate.id)).toBe(undefined)
    expect(home.get(alfajor.id)).toBe(alfajor)
}

function update() {
    chocolate.precio = 45
    home.update(chocolate);
    expect(home.get(chocolate.id).precio).toBe(45);
}

function all() {
    var all = home.all();
    expect(all).toContain(chocolate);
    expect(all).toContain(alfajor);
}

//register functions

beforeEach(setup)
test(get.name, get)
test(getNotContained.name, getNotContained)
test(deleteObject.name, deleteObject)
test(update.name, update)
test(all.name, all)

```

Jest es un framework bastante grande, solo estamos usando una partecita aquí. Las funciones beforeEach permite registrar una función que se ejecuta antes de cada test. Y la función test permite registrar bajo un nombre una función que será lo que se ejecute para testear. Cada test usa
`expect` para realizar las validaciones. En [Jest](https://jestjs.io/) se puede encontrar la documentación de todas las maneras de realizar las aserciones.


Finalmente, solo para que nos quede el server/app sin funcionar, vamos a usar la nueva home para realizar un update de un objeto en cada pedido:

app.js
```
server = require("./server")
Home = require("./src/memoryHome")
Producto = require("./src/producto")


var myHome = new Home()
var miProducto = new Producto("Papas Fritas", 30)
myHome.insert(miProducto)

server.init(myHome, miProducto.id)
```


```
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
```

#### Clase 4: Modificando el server para que sea restful: Express

La manera más sencilla de convertir nuestro servidor en un servidor Rest es utilizando una librería como [express](https://expressjs.com/es/)
que resuelve este tipo de problemática. 

Además de express vamos a necesitar un módulo adicional que antiguamente venía includo, que permite obtener fácilmente el body de un request. El mismo se llama body-parser

```
    npm install express body-parser --save
```

y este es el código fuente del servidor:

server.js
```
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
Para probar el servidor se puede usar cualquier cliente REST, tanto Firefox como Chrome tienen plugins que se utilizan para eso.


#### Eventos

Una manera de lograr que nuestro servidor soporte múltiples tipos de entidades es registrar de manera tradicional distintas homes en un mapa que mantiene el server y redirija los pedidos a la home correspondiente. Si bien es una solución aceptable, vamos a hacer algo parecido usando los eventos de node, de manera que el server en lugar de tener que guardar las homes lo hará es disparar eventos, luego vamos a bindear esos eventos a la home correspondiente.

En todo mecanismo de eventos siempre hay dos Partes: Uno que dispara el evento y otro que maneja el evento. (Hay variantes, por supuesto, combinando múltiples handlers/dispatchers).

Para vincular un handler y un dispatcher se utiliza un EventEmitter del módulo events.
El método `on` se utiliza para registrar un handler, mientras que el `emit` para disparar un evento.
Un envento tiene un nombre, y opcionalmente parámetros. El handler es simplemente una función.

Primero agregamos un nueva entidad `Cliente` para que tenga sentido tener más de una home:

/src/cliente.js
```
class Cliente {

    constructor(nombre, direccion) {
        this.nombre = nombre;
        this.direccion = direccion;
    }
}

module.exports = Cliente;
```

Y le vamos a agregar a la home un atributo que nos indique cual es el tipo de objetos que guarda. Eso nos va a permitir asociar una url a una home:

src/memoryHome.js
```
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

Vamos a registrar las homes en el server de la siguiente manera:

app.js
```
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


server.js
```
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

### Clase 5 : Persistiendo en MongoDB
 
La instalación depende de la versión del sistema operativo: [install](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) 

Para iniciar el servicio
```
sudo service mongod start
```

Y se puede usar por línea de comandos usando `mongo` client. Sin embargo esta parte no será necesaria ya que el cliente será nuestra app.

Agregamos la dependencia a nuestro proyecto

```
npm install mongodb --save
```

Algunas cuestiones a tener en cuenta al usar mongo:

1. Mongo tiene una interfaz asincrónica basada en callbacks. Esto se debe a que una interfaz de este tipo puede ser aprovechada mejor en sistemas de Big Data y/o sistemas basado en colas en lugar del modelo request/response que estamos manejando en una arquitectura rest. En este punto tenemos dos opciones: Modificar nuestra arquitectura para que la home utilice una interfaz basada en callbacks o utilizar alguna técnica de programación concurrente para adapatar la llamada asincrónica de mongo a una interfaz sincrónica. Como lo segundo es un poco más complejo, primero resolveremos el problema con la primera alternativa.

2. Mongo agrega un campo "_id" a los objetos, ese valor no es exactamente un uuid tradicional, si no que utiliza una implementación interna por findes de performance (ObejctID). Cuando un objeto es obtenido de mongo y renderizado en un json el campo toma el tipo string, sin embargo cuando querramos pasar dicho valor a mongo para buscar por id o cualquier otra operación que reqiera un id vamos a tener que invocar explícitamente la conversión de string a ObjectID.

3. Vamos a mantener en un único objeto la conexión a mongo, las homes colaborarán con este objeto para obtener una referencia a la colección persistente que se utilizará para realizar las operaciones

app.js
```
server = require("./server")

mongoConnection = require("./src/mongo/mongoConnection")
Home = require("./src/mongo/mongoHome")
mongoConnection.connect( (db) => {
    productoHome = new Home("productos", db)
    clienteHome = new Home("clientes", db)    
    server.register(productoHome)
    server.register(clienteHome)
    server.init();
})
```
Aquí se ve con un callback como la registración de las homes y el inicio del server ocurre luego de que se produzca la conexión con mongo.

mongo/mongoConnection.js

```
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017'
var dbname = 'mydb'
var db


function connect(callback) {
    console.log("Tratando de conectar")
    MongoClient.connect(url, { useNewUrlParser: true } , function(err, _db) {
        if (err) throw err
        console.log("Mongo DB Connected")
        db=_db.db(dbname)
        callback(db)        
    })
}

function close() {
    db.close()
}

exports.connect = connect;
exports.close = close;
exports.dbname = dbname
exports.url = url
```
Esta interfaz permite configurar una url /dbname distinta antes de usar el método connect. Si no utiliza estos defaults.


mongo/mongoHome.js
```
var mongoDriver = require('mongodb');

class MongoDBHome {

    constructor(type, db) {
        this.type = type
        this.persistentCollection = db.collection(type)
    }

    insert(element) {
        this.persistentCollection.insertOne(element, (error, result)=>{
            if(error) throw error
            console.log(`Result of insert one: ${JSON.stringify(result)}`)
        })
    }

    delete(elementId) {
        var objectId = mongoDriver.ObjectID(elementId);
        this.persistentCollection.deleteOne({"_id" : objectId}, (error, result)=>{
            if(error) throw error
            console.log(`Result of delete one: ${JSON.stringify(result)}`)
        })    
    }

    get(elementId, callback) {
        var objectId = mongoDriver.ObjectID(elementId);
        return this.persistentCollection.findOne({"_id" : objectId}, (error, result)=>{
            if(error) throw error
            callback(result)
        })
    }

    update(element) {
        var objectId = mongoDriver.ObjectID(element._id);
        element._id = objectId;
        this.persistentCollection.replaceOne({"_id" : objectId}, element, (error, result)=>{
            if(error) throw error
            console.log(`Result of updateOne one: ${JSON.stringify(result)}`)
        })
    }

    all(callback) {
        this.persistentCollection.find({}).toArray( (error, result)=>{
            if(error) throw error
            callback(result)
        })
    }

}

module.exports = MongoDBHome
```

server.js
```
express = require("express");
bodyParser = require("body-parser");
var events = require("events");

var eventEmitter = new events.EventEmitter();


function register(home) {
  console.log(`registering handlers for ${home.type}`)
  
  eventEmitter.on(`find-${home.type}`, 
              (response)=>
                home.all( 
                  ( result) => {
                    response.json(result)
                    response.end()
                  }
              )    
  )

  eventEmitter.on(`get-${home.type}`, 
              (id, response)=> {
              console.log("respondiendo evento, llamando a la home")
                home.get(id, 
                  ( result ) => {
                    response.json(result)
                    response.end()
                  }
              )}
  )    

   
  eventEmitter.on(`update-${home.type}`, (object)=> home.update(object))
  eventEmitter.on(`insert-${home.type}`, (object)=> home.insert(object))
  eventEmitter.on(`delete-${home.type}`, (id)=> home.delete(id))
}

function init() {
  var server = express();
  server.use(bodyParser.json());

  server.get("/:type", (req, res) => {
    eventEmitter.emit(`find-${req.params.type}`, res);

  })

  server.get("/:type/:id", (req, res) => {
    eventEmitter.emit(`get-${req.params.type}`, req.params.id, res);
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



