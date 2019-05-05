## Clase 2: Objetos, Clases y Funciones

### Objetos

Vamos a ir construyendo un servidor REST para manipula el CRUD de un entidad. 

En principio vamos a hacer que nuestro servidor devuelva [json](https://www.json.org/). Un json es una notación para describir un objeto javascript que ha tomado popularidad para ser usado también como standard para el intercambio de información, reemplazando lo que anteriormente era dominio de XML.

La estrategia será tener un objeto y renderizarlo a json. Hay muchas
maneras distintas de tener objetos, ya que los mismos se pueden crear dinámicamente, con clases o funciones.

#### app.js
``` javascript
server = require("./server")

var myObject = {
    "nombre": "alfajor", 
    "precio": 20
} 

server.init(myObject);
```

#### server.js
``` javascript
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

#### app.js
``` javascript
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

Podemos sacar la clase a un archivo externo e importarlo como módulo de node. La preparación de un módulo que exporta un constructor es levemente distinta. Se debe usar `module.exports` y asignarle la clase.
Además vamos a ir escribiendo nuestras clases dentro de una subcarpeta `src` para mantener el root un poco más prolijo:

#### src/producto.js
``` javascript
class Producto {

    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

module.exports = Producto;
```

#### app.js
``` javascript
server = require("./server")
Producto = require ("./src/producto")

var myObject = new Producto("alfajor", 20);

server.init(myObject);
```

###  Construyendo una "Memory Home"

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

#### src/memoryHome.js
``` javascript
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
 1. La expresión ` (x)=>x[1] ` es una manera abreviada de escribir `function (x) {return x[1]} )`. Es una forma de escribir una función con una notación más parecida a las lambdas de otros lenguajes. Se usa bastante cuando se quiere programar con un estilo más parecido al funcional
2. Si bien existen los objetos "map" en javascript, la mayoría de la funcionalidad de un mapa puede ser resuelto simplemente con un objeto simple. Por eso guardamos en "elements" un objeto vacío.
3. La función `Object.entries` permite obtener un array con  todos los atributos de un objeto, Por ejemplo si tengo este objeto: 
`var choco = {"nombre": "chocolate", "precio": 20}` 
La llamada a `Object.entries(choco)` devuelve el siguiente array
`[["nombre", "chocolate"], ["precio", 20]]`
4. La home le agrega un atributo "id" a los objetos. Este atributo no está definido en la clase ni en ningún lado, no hace falta porque es un lenguaje
dinámico.
5. `undefined` es una referencia a un objeto que significa justamente eso: objeto no definido. 
Cuando a un objeto se le pide un atributo que no contiene devuelve `undefined`. `if(undefined)` resuelve `false`, así que se puede usar para saber si existe un elemento o no.


### Usando la MemoryHome

Finalmente, solo para que no nos quede el server/app sin funcionar, vamos a usar parcialmente la nueva home para realizar un update de un objeto en cada pedido:

#### app.js
``` javascript
server = require("./server")
Home = require("./src/memoryHome")
Producto = require("./src/producto")


var myHome = new Home()
var miProducto = new Producto("Papas Fritas", 30)
myHome.insert(miProducto)

server.init(myHome, miProducto.id)
```

#### server.js
``` javascript
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
