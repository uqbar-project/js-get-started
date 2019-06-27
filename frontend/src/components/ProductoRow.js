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