import React from 'react';

class ProductoForm extends React.Component {
  
    constructor(props) {
      super(props)
      this.state={producto: props.producto}
      this.changeHandler = this.changeHandler.bind(this)
      this.sendHandler = this.sendHandler.bind(this)
    }

    componentWillReceiveProps(props) {
      this.setState({producto: props.producto})
    }

    changeHandler(event) {
        var nuevoProducto = Object.assign({}, this.state.producto)
        nuevoProducto[event.target.name] = event.target.value
        this.setState({producto: nuevoProducto})
    }

    sendHandler(event) {
      fetch('http://localhost:8888/productos', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.producto)
        }).then(res => this.props.productoChanged(this.state.producto) )
          .catch(res => console.log("ERROR") );

        event.preventDefault();
    }



    render() {

      return (
        <form onSubmit={this.sendHandler}>
          <label>Nombre</label> 
          <input type="text" name='nombre' value={this.state.producto.nombre} onChange={this.changeHandler} /><br />
          <label>Precio</label> 
          <input type="text" name='precio' value={this.state.producto.precio} onChange={this.changeHandler}/><br />
          <br />
          <input type="submit" value="Enviar"/> 
        </form>
    )
  
    }


}
  export default ProductoForm