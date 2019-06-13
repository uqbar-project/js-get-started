## Clase 8 : Router 

### React Router

El problema que tenemos ahora es el de poder navegar entre distintos componentes para tener una verdadera aplicación.
React router es un componente de react que permite asociar un componente con una ruta. A partir de esa ruta se puede seleccionar el componente activo.

Para instalarlo, dentro de la carpeta del frontend:

```
npm install --save react-router-dom
```

### Menu

Primero vamos a agregar un poco de html y css en App.js y App.css para disponer visualmente el menú. También movemos por prolijidad
cosas que estaban en el header al main.

#### App.js
``` javascript

import React from 'react';
import logo from './logo.svg';
import EntityList from './components/EntityList'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <ul>
          <li>Home</li>
          <li>Clientes</li>
          <li>Productos</li>
        </ul>
      </header>
      <main className="App-main">
        <p>
          <EntityList entity="clientes" />
        </p>

      </main>
    </div>
  );
}

export default App;

```

En App.css agregamos al final:


``` css
header:after {
  content: " ";
  display: table;
  clear: both;
}

header ul {
  list-style: none;
}

header ul li {
  float: left;
  margin-right: 20px;

}

a {
  color: white
}

```

Incorporamos el componente React Router para definir matchear rutas con componentes. Una vez definido el router ya se puede navegar escribiendo las rutas en el browser. Pero para utilizar los links hay que usar el componente NavLink. Agregamos además un Componente nuevo llamado HomeComponent para que oficie de página inicial. Luego como usamos dos instancias de EntityList parametrizados, usamos funciones intermedias para realizar esta configuración.

#### App.js
```javascript

import React from 'react';
import logo from './logo.svg';
import EntityList from './components/EntityList'
import HomeComponent from './components/HomeComponent'
import {BrowserRouter as Router, Route, Switch, Redirect, NavLink} from "react-router-dom"
import './App.css';

function ClientesComponent() {
  return (<EntityList entity="clientes"/>)
}

function ProductosComponent()  {
  return (<EntityList entity="productos"/>)
}


function App() {
  return (
    <div className="App">
    <Router>
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/clientes">Clientes</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
        </ul>
      </header>
      <main className="App-main">
          <Switch>
            <Route path="/" exact component={HomeComponent} />
            <Route path="/clientes"  component={ClientesComponent} />
            <Route path="/productos" component={ProductosComponent} />
            <Redirect to="/" />
          </Switch>
      </main>
      </Router>
    </div>
  );
}

export default App;


```

#### HomeComponent.js

``` javascript
import React from 'react';

class HomeComponent extends React.Component {

    render() {
      return (
        <div>
          <h1>
            Aplicación para manejar clientes y productos
          </h1>
        </div>
      );
    }
  }



  export default HomeComponent
  
```