
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
          Aca van a mostrarse los {this.props.name}
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <EntityList name="clientes" />
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




