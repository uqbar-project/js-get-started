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
        //first = this.state.entities[0];

      return (
        <div className="EntityList">
<table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.entities.map((object, index) => {
              return (
                <tr key={object._id}>
                  <td>{object._id}</td>
                  <td>{object.nombre}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      );
    }
    else {
      return (<p> Cargando {this.props.entity} </p>);
    }
    }
  }

  export default EntityList
  
