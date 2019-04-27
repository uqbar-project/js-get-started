# js-get-started
Proyecto para ir aprendiendo el desarrollo de aplicaciones con javascript. 

## Clase 1: Herramientas y Ambiente de desarrollo

Javascript es un lenguaje que tradicionalmente ejecuta en el browser. En su comienzos se utilizó para darle dinamismo a las páginas HTMLs del lado del cliente. Se utilizaba casi exclusivamente para realizar validaciones y acceder a los objetos del DOM para modificar algún atributo. El DOM es el modelo que mantiene el browser sobre el html que se está visualizando (y algunas cositas más). Si se modifica el dom, se modifica lo que se visualiza.
 
Hace unos años se comenzó a utilizar también para el servidor como parte de [Node](https://nodejs.org/es/) y también para reemplazar el HTML como lenguaje de generación de interfaz gráfica, siendo [Angular](https://angular.io/) uno de los primeras y más famoso frameworks para esto. Aunque en esta guía nos vamos a volcar por otra alternativa llamada [react](https://angular.io/).

El uso de Node + Angular fue potenciado por el gestor de paquetes [npm](https://www.npmjs.com/), una especie de Maven para JS que surgió como parte de Node. En lugar de declarar la estructura del proyecto en un pom.xml, npm utiliza un archivo llamado package.json. Npm presentó algunos problemas de performance y seguridad,  entonces Facebook desarrolló una alternativa llamada [yarn](https://yarnpkg.com) que utiliza las mismas definiciones en el package.json

Finalmente, para completar el conjunto de herramientas, este tipo de aplicaciones suele utilizar como medio persistnecia mongodb, siendo json el formato con el cual se guarda y comunican los datos. Json es muy utilizado en este tipo de arquitecturas porque básicamente un json es un objeto javascript, siendo muy sencillo su integración.

Existen otros frameworks que suelen complementarse con los descriptos anteriormente, nos ocuparemos de ellos en su momento.

Finalmente, con respecto al ide, existen muchas alternativas. Nosotros vamos a usar el [Visual Estudio Code] (https://code.visualstudio.com) con algunas plugins, aunque en este punto todo es opcional, bien se podría editar el código con cualquier editor, ya que javascript es interpretado.

### prerrequisitos
sudo apt-get install curl

### install node
```
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Si todo salió bien" 
``` 
node --version
```


### install yarn


```    
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

Si todo salió bien" 
``` 
yarn --version
```

#### install visual estudio code

```
sudo snap install --classic code
```

Para abrirlo:
```
code
```

Las extensiones se pueden agregar desde el item `extensiones` del menú cuyo icono es un engranaje.

Buscar e instalar:

- `Babel Javascript` para syntax highligthing
- `ESLint` checkeos de código
- `Git Blame` y `GitLens` integraciones con git
- `Prettier - Code Formatter` code formater
  
### Hello World con  node.js

Node es una herramienta que en realidad son al menos 2: por un lado permite ejecutar código en el servidor, y por otro funciona como una librería que tiene muchas cosas ya resueltas listas para usar.

A través del módulo `http` se puede implementar fácilmente un servidor web que sirva una página. Como siempre, nuestra primera página es un hola mundo.  PAra crearlo hay que hacer un archivo que arbitrariamente llamamos server.js (puede tener cualquier nombre con extensión js). Pondremos el siguiente contenido:

```
var http = require("http");

console.log("Loading server");

http.createServer(function(request, response) {
  console.log("Request received");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("Hola Mundo");
  response.end();
}).listen(8888);

```
Para levantar el servidor se escribe desde la consola 
```
    node server
```

Y desde el browser se invoca a [http://localhost:8888].

El código es realmente claro, la mayor magica se da en la primera línea. El `require` es la función que permite cargar un módulo/libreria.
módulo http es un módulo que viene con node, y al cargarse se puede invocar a través de un objeto al que se accede con la variable que arbitrariamente se llama http.

La variable console está disponible sin necesidad de cargar un módulo adicional. En este ejemplo es totalmente opcional incluir las líneas de logging a consola. Sirven para identificar que código se ejecuta al inicio y que en cada pedido.

Algunas cositas de javascript: Es un lenguaje interpreatdo de tipado dinámico e implícito.

* Intepretado: No pasa por un proceso de compilación antes de ser ejecutado
* Tipado dinámico: En tiempo de ejecución se da cuenta si entiende el mensaje o no   
* Tipado implícito: No se dice en tiempo de programación de que tipo es una variable

A que lenguaje que ya conoce se parece?

Para más info sobre [sistemas de tipos] (http://wiki.uqbar.org/wiki/articles/esquemas-de-tipado.html)

Otro detalle es que javascript tiene el concepto de función como de primer orden, eso significa que una función puede ser reificada fácilmente como un objeto. Otros lenguajes requieren construcciones especiales para construir lambdas/bloques que modelan una función. En este caso se obtiene el mismo comportamiento pero de manera más directa. El mensaje createServer está recibiendo por parámetro un objeto función que será invocada ante cada pedido el servidor. 

Esta carecterística le da a javascript la facilidad de trabajar con conceptos de programación funcional. 

Finalmente, presetemos atención a como el módulo http encadena mensajes para que sea más fácil sintácamente su uso: El mensaje createServer devulve un objeto que entiende el mensaje listen. Dicho mensaje deja el thread principal en espera, e internamente maneja distintos threads para manipular los distintos pedidos.

### stack trace
Es especialmente útil ejecutar el código desde la consola interna del visual studio code, ya que en caso de error se puede navegar por el stacktrace haciendo control + click en la línea deseada.
Hay varias maneras de abrir la consola, por ejemplo click derecho sobre el archivo que queremos ejecutar (server.js) y elegir la opcion `open in console`

### Modularización
En toda aplicación es importante el concepto de modularización que el código pueda ser mantenible.
Vamos a refactorizar nuestro server.js para que sea un módulo exportable desde otro archivo. Simplemente hay que construir funciones que querramos que sean públicas y luego registrarlas como un atributo del objeto 'exports'

```
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

```

y desde otro archivo, por ejemplo app.js, importarlo y usarlo:

```
server = require("./server")
server.init();
```

Ahora nuestra aplicación node se ejecuta con `node app`

## Clase 2: Objetos, Clases y Eventos

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
## Clase 3: Unit Testing

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


#### Eventos (TODO: acomodarlo a las clases previas)
Node utiliza eventos para poder comunicar distintos módulos y utilizar internamente un único thread.
En todo mecanismo de eventos siempre hay dos Partes: Uno que dispara el evento y otro que maneja el evento. (Hay variantes, por supuesto, combinando múltiples handlers/dispatchers).

En este ejemplo vamos a utilizar los eventos de node para separar más nuestro server/app. El server se encargará de estructurar una página html, 
y disparará un evento que la app escuchará para completar el body.

Para vincular un handler y un dispatcher se utiliza el un EventEmitter del módulo events.
El método `on` se utiliza para registrar un handler, mientras que el `emit` para disparar un evento.
Un envento tiene un nombre, y opcionalmente parámetros. 

En este ejemplo definimos un único evento llamado `request`. 
La app debe pasar por parámetro al init un objeto que entienda el mensaje `onRequest` y recibe por parámetro el response, para que pueda escribir el body. 

app.js
```
server = require("./server")

class MyHandler {
    onRequest(response) {
        response.write("Esto es magia");
    }
}

handler = new MyHandler();
server.init(handler);
```

server.js
```
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
```





