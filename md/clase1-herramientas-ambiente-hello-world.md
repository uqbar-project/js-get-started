## Clase 1: Herramientas, Ambiente de desarrollo y Hello World

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

### install visual estudio code

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

#### server.js
``` javascript
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

#### server.js
``` javascript
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

#### app.js
``` javascript
server = require("./server")
server.init();
```

Ahora nuestra aplicación node se ejecuta con `node app`
