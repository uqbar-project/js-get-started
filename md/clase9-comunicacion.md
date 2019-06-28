## Clase 8 : Comunicación entre componentes 

### Comunicación Padre/Hijo

Para sacarle el jugo a React, debemos pensar en componentes pequeños que se arman en una estructura de árbol.

En este ejemplo vamos a modificar una clase Productos (que es una simplificación de EntityList pero solo para productos) que contiene una tabla para que cada fila sea un componente hijo. 

Clase original:

####Productos.js
``` javascript
import React from 'react';

class Productos extends React.Component {
  constructor(props) {
    super(props);
    this.state= { productos: []}
  }

  componentWillMount() {
    fetch(`http://localhost:8888/productos`)
      .then( res => res.json())
      .then( prds => this.setState({productos: prds}));
  }

    render() {

      
      if( this.state.productos.length > 0 ) {
        return(
          <div className="productosCSS">
              <h2>{this.props.titulo}</h2>
          
          <table className="table">
            <thead>
              <tr>
                 <th>id</th>
                 <th>nombre</th>
                 <th>precio</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>)
      }
      else {
        return(
          <div className="productosCSS">
              <h2>{this.props.titulo}</h2>
              CARGANDO
          </div>);  
      }

    }

    renderRows() {
      return this.state.productos.map((unProducto, index) => {
        return (
          <tr key={unProducto._id}>
            <td>{unProducto._id}</td> 
              <td>{unProducto.nombre}</td>
              <td>{unProducto.precio}</td>
          </tr>
        );
      })
    }
  
  }
  export default Productos

```

Ahora extraeremos lo que se renderiza en cada fila a su propio componente

####Producto.js
``` javascript
import React from 'react';
import ProductoRow from './ProductoRow';
import ProductoForm from './ProductoForm';

class Productos extends React.Component {
  constructor(props) {
    super(props);
    this.state= { productos: []}
  }

  componentWillMount() {
    fetch(`http://localhost:8888/productos`)
      .then( res => res.json())
      .then( prds => this.setState({productos: prds, selected: ''}));
  }

    render() {
      
      if( this.state.productos.length > 0 ) {
        return(
          <div className="productosCSS">
              <h2>{this.props.titulo}</h2>
          
          <table className="table">
            <thead>
              <tr>
                 <th>id</th>
                 <th>nombre</th>
                 <th>precio</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>)
      }
      else {
        return(
          <div className="productosCSS">
              <h2>{this.props.titulo}</h2>
              CARGANDO
          </div>);  
      }

    }

    renderRows() {
      return this.state.productos.map((unProducto, index) => {
        return (
          <ProductoRow producto={unProducto} />
        );
      })
    }
  
  }

  export default Productos
```

####ProductoRow

``` javascript
import React from 'react';

class ProductoRow extends React.Component {

    render() {      
        return(
            <tr key={this.props.producto._id} >
            <td>{this.props.producto._id}</td> 
              <td>{this.props.producto.nombre}</td>
              <td>{this.props.producto.precio}</td>
          </tr>)
      
    }
}

  export default ProductoRow

```

Nuestro próximo paso sera seleccionar un componente al hacer un click en una columna. El componente padre (Productos) renderizará el id del Producto seleccionado.

Una de la manera más sencilla para realizar esto es pasándole una función que el componente hijo invocará cuando detecte el onclick. Esa función modifica el state del padre lo cual fuerza la re-renderización

El método bind llamado en el constructor es muy importante para poder usar una función como un eventHandler, ya que de no hacerlo no funcionará la referencia "this" como nosotros esperamos

####Productos.js
``` javascript
import React from 'react';
import ProductoRow from './ProductoRow';
import ProductoForm from './ProductoForm';

class Productos extends React.Component {
  constructor(props) {
    super(props);
    this.state= { productos: [], selected:''}
    this.select = this.select.bind(this);
  }

  componentWillMount() {
    fetch(`http://localhost:8888/productos`)
      .then( res => res.json())
      .then( prds => this.setState({productos: prds, selected: ''}));
  }

    render() {

      
      if( this.state.productos.length > 0 ) {
        return(
          <div className="productosCSS">
              <h2>{this.props.titulo}</h2>
          
          <table className="table">
            <thead>
              <tr>
                 <th>id</th>
                 <th>nombre</th>
                 <th>precio</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
          <p> Seleccionado: {this.state.selected._id} </p>
        </div>)
      }
      else {
        return(
          <div className="productosCSS">
              <h2>{this.props.titulo}</h2>
              CARGANDO
          </div>);  
      }

    }

    select(unProducto) {
      this.setState({productos: this.state.productos, selected:unProducto })
    }

    renderRows() {
      return this.state.productos.map((unProducto, index) => {
        return (
          <ProductoRow producto={unProducto} selector={this.select} />
        );
      })
    }
  
  }

  export default Productos
  ```
#### Producto Row

``` javascript 
import React from 'react';

class ProductoRow extends React.Component {

    constructor(props) {
        super(props);
        this.selectProducto = this.selectProducto.bind(this);
    }
    
    selectProducto() {
        this.props.selector(this.props.producto)
    }

    render() {      
        return(
            <tr key={this.props.producto._id} onClick={this.selectProducto}>
            <td>{this.props.producto._id}</td> 
              <td>{this.props.producto.nombre}</td>
              <td>{this.props.producto.precio}</td>
          </tr>)
      
    }
}

  export default ProductoRow
```

### Comunicación entre hermanos
A través del padre se pueden comunicar los componentes hermanos. 
Por ejemplo, podemos agregar un 


