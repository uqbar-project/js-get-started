import React from 'react';
import ProductoRow from './ProductoRow'
import ProductoForm from './ProductoForm'

class Productos extends React.Component {
  constructor(props) {
    super(props);
    this.state= { productos: [], seleccionado: {}}
    this.selectProducto = this.selectProducto.bind(this)
    this.productoChangeHandler = this.productoChangeHandler.bind(this)
  }

  selectProducto(unProducto) {

    this.setState({seleccionado: unProducto})
  }

  productoChangeHandler(unProducto) {
    var nuevaLista = this.state.productos.map( (item) =>  (item._id != unProducto._id) ?  item : unProducto   )
    this.setState({productos: nuevaLista, seleccionado: unProducto})
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
          <ProductoForm producto={this.state.seleccionado} productoChanged={this.productoChangeHandler}/>
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
          <ProductoRow producto={unProducto} selector={this.selectProducto}/>
        );
      })
    }
  
  }



  export default Productos