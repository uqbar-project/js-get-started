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
  
