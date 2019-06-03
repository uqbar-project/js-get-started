
## Clase 8 : FrontEnd (React)

### Frontend y backend

Hasta la clase anterior desarrollamos una aplicación que expone servicios REST. Esta aplicación juega el papel de "backend" en el sentido que es la parte de nuestro sistema que se encarga de la persistencia de los datos. En esta clase vamos a empezar a desarrollar la aplicación "frontend" que se encargará de la interfaz de usuario y navegación. El frontend consumirá los servicios del backend. Ambas aplicaciones son independientes en el sentido en que cada una estará escuchando en un puerto distinto.

Dentro de nuestro proyecto vamos a generar una carpeta `backend` y moveremos allí adentro todos los archivos para que quede esta estructura

```
   js-get-started
       - backend
         - src
         - tests
         - node_modules
         - package.json
         - package-lock.json
         - app.js
         - server.js
       - md
       - LICENSE
       - READEME.md
       - .git
       - .gitignore

```
Usando la consola, ubicados en el root del proyecto (js-get-started), usaremos la herramiento `npx` para ejecutar la herramienta `create-react-app`. El mismo efecto se puede lograr escribiendo los archivos a mano y ejecutando los `npm install` correspondientes.

```
npx create-react-app frontend
```

Probamos que haya funcionado:
```
cd frontend
npm start
```
y desde el browser solicitamos `http://localhost:3000`

En este punto tenemos las dos aplicaciones totalmente desconectadas.

### Modificando el ejemplo

cuando react recibe un pedido, busca el archivo index.html. Ese archivo es utilizado como un template. En el archivo index.js se ve como reemplaza el div con id root por el html que renderiza la clase `App.js`.

Para customizar nuestra app podemos modificar el archivo App.js como querramos. Lo primero que vamos a hacer es reemplazar el string de bienvenida por otro que es producto de un componente que vamos a construir

creamos el directorio `components` y dentro de `src`. En dicho directorio creamos el archivo `EntityList.js` (El nombre se debe a que en los próximos pasos renderizará una lista de entidades)

``` javascript
import React from 'react';

class EntityList extends React.Component {
    render() {
      return (
        <div className="EntityList">
          Aca van a mostrarse los {this.props.entity}
        </div>
      );
    }
  }

  export default EntityList

```
De esta clase se puede notar como cosas importantes:
1. Las clases del frontend se ejecutan en el server, la manera de importar es distinto con respecto a las clases del Backend.
2. Se debe importar React y hacer una clase que herede de ReactCompoment
3. El método render es el que escribe el html que se quiere renderizar. En realidad no es exáctamente html, si no que es JXS, porque se puede hacer referencia a otros componentes de react, los cuales también se ejecutará el render cuando corresponda.
4. Es muy importante no olvidar el export final
5. Para poner una clase de css se usa `classname`
6. Las propiedades que se acceden desde el objeto `this.props` pueden ser seteadas desde el componente padre.


Por otro lado, modificamos App.js para que incluya nuestro componente. La clase App.js también es un componente que se renderiza, pero en lugar de hacerlo como instancia de una clase directamente exporta la función. Se puede utilizar ambas técnicas. 

``` javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';
import EntityList from './components/EntityList'
s
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <EntityList entity="clientes" />
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

### Invocando al backend: CORS

Para poder invocar al backend correspondiente es importante entender el concepto de CORS (Cross Origin Resource Sharing). Por defecto un browser impide a una página web cargar datos desde un dominio distinto al cual pertence. El dominio es la unión de la url y el puerto. Con estas reglas, nuestro frontend no podría solicitar recursos al backaned. CORS es la tecnología que permite esta comunicación, consiste en ciertos encabezados en los pedidos http. La manera más sencilla de activarlo es usando el módulo `cors` en el backend. Este módulo se integra muy fácilmente en el middleware de express.

#### server.js (cambios)
``` javascript

...
var cors = require('cors');
....
function init() {
  var server = express();
...
   server.use(cors())
...

```

#### server.js (completo)
``` javascript
express = require("express");
bodyParser = require("body-parser");
var cors = require('cors');

var homes = {}


function register(home) {
  console.log(`registering handlers for ${home.type}`)
  homes[home.type] = home 
}

function init() {
  var server = express();
  server.use(bodyParser.json());

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

  server.use(cors())

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

### Invocando al backend: Fetch

Nuestra aplicación será `single-page`. En este tipo de aplicaciones la página principal se carga una sola vez y todos los datos y pedidos al servidor se realizan de manerá asincrónica (es una evolución del concepto de ajax). En las versiones más nuevas de javascript esto se realiza utilizando `fetch`, que es una función que se pasa una url (opcionalmente se le puede indicar el method, si no es GET por default) y devuelve una `Promise`. Una promise es, como su nombre lo indica, una promesa de que algo en el futuro va a pasar. se pueden encadenar llamadas con la función `then` para ejecutar algo cuando la promesa se cumple.

En nuestro caso la llamada sería algo así:

``` javascript
 fetch(`http://localhost:8888/${this.props.entity}`)
        .then( res => res.json())
        .then( entities => this.setState({entities: entities}));
```

El fetch devuelve una promesa de que va a devolver una respuesta. El primer then se ejecuta cuando la respuesta está disponible y llama al método `json` que a su vez también devuelve una promesa de que va a devolver un json, por eso el sengundo then se ejecuta cuando el json está realmente disponible.
Luego lo que hace es modificar el atributo state del componente por otro en el cual tiene el atributo `entities` con todos los objetos que devolvió el servidor. El concepto de state es parte de la arquitectura de React. Si bien un módulo podría guardar datos en otros atributos, la arquitectura sugiere que todos los datos que tienen que ver con el estado conversacional de la aplicación estén dentro de estos states. Eso facilita la cosa porque se puede reemplazar un state por otro, facilitando una programación del estilo funcional. 

Está llamada al fetch la realizamos desde un método llamado `componentWillMount` que también es parte de la arquitectura de componentes React. Esta funcion se invoca cuando el componente se aloja en el DOM. Se puede utilizar como una especie de inicializador.
Con esta arquitectura el método render se va a ejecutar dos veces: la primera al inicializarse (no vamos a tener entidades para renderizar) y luego cuando se reemplaza el state con el que sí tiene las entidades. Por eso el render tienen que tener esto en cuenta.

Así es como quedará finalmente nuestro componente. Tener en cuenta que Es un componente que sirve para cualquier entidad, por eso combina llamadas a funciones javascript con JSX para poder obtener los nombres de los atributos y sus valores.

#### /components/EntityList.js
``` javascript

import React from 'react';

class EntityList extends React.Component {

    constructor(props) {
      super(props);
      this.state= { entities: []}
    }

    componentWillMount() {
      fetch(`http://localhost:8888/${this.props.entity}`)
        .then( res => res.json())
        .then( entities => this.setState({entities: entities}));
    }

    render() {
      if(this.state.entities.length > 0) {
        //uso el primero para conocer los atributos
      var columns = Object.entries(this.state.entities[0]).map(entry => entry[0])
      return (
        <div className="EntityList">
          <table className="table">
            <thead>
              <tr>
                {this.renderHeaders(columns)}
              </tr>
            </thead>
            <tbody>
              {this.renderRows(columns)}
            </tbody>
          </table>
        </div>
      );
    }
    else {
      return (<p> Cargando {this.props.entity} </p>);
    }
    }

    renderHeaders(columns) {
      return columns.map((col, index) => {
        return (
            <th>{col}</th>
        );
      })      
    }

    renderRows(columns) {
      return this.state.entities.map((object, index) => {
        return (
          <tr key={object._id}>
            {this.renderRow(object, columns)}
          </tr>
        );
      })
    }

    renderRow(object, columns,) {
      return columns.map((attName, index) => {
          return (<td>{object[attName]}</td>);
      });
    }
  }

  export default EntityList
  
```





