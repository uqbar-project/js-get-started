import React from 'react';
import ProductoRow from './ProductoRow';
import ProductoForm from './ProductoForm';

class Productos extends React.Component {
  constructor(props) {
    super(props);
    this.state = { productos: [], selected:{}}
    this.select = this.select.bind(this);
  }

  componentWillMount() {
    fetch(`http://localhost:8888/productos`)
      .then( res => res.json())
      .then( prds => this.setState({productos: prds, selected: {}}));
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
          <ProductoForm producto={this.state.selected} />
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
      console.log(`selecting ${JSON.stringify(unProducto)}`)
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