import React from 'react';

class ProductoRow extends React.Component {
  
    constructor(props) {
        super(props)
        this.seleccionarProducto = this.seleccionarProducto.bind(this)
    }

    seleccionarProducto() {
        this.props.selector(this.props.producto);
    }

    render() {

      return (
      <tr key={this.props.producto._id} onClick={this.seleccionarProducto}>
        <td>{this.props.producto._id}</td> 
          <td>{this.props.producto.nombre}</td>
          <td>{this.props.producto.precio}</td>
      </tr>)
  
    }


}
  export default ProductoRow