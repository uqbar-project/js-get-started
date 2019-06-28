import React from 'react';

class ProductoForm extends React.Component {

    constructor(props) {
        super(props);
    
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {producto:props.producto}
      }

      componentWillReceiveProps(props) {
          this.setState({producto: props.producto})
      }

      handleChange(event) {
        var newState = Object.assign({}, this.state);
        newState.producto[event.target.name] = event.target.value; 
        this.setState(newState);
      }

      handleSubmit(event) {

        fetch('http://localhost:8888/productos', {
            method: 'put',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.producto)
        }).then(res => console.log("OK"))
          .catch(res => console.log("ERROR") );

        event.preventDefault();
      }
    
      render() {

        return (
          <form onSubmit={this.handleSubmit}>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={this.state.producto.nombre} onChange={this.handleChange}/>
            <label>Precio:</label>
            <input type="text" name="precio" value={this.state.producto.precio} onChange={this.handleChange} />
            <input type="submit" value="Submit" />
          </form>
        );
      }
}

  export default ProductoForm