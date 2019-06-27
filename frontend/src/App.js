import React from 'react';
import logo from './logo.svg';
import EntityList from './components/EntityList'
import HomeComponent from './components/HomeComponent'
import Productos from './components/Productos'

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
          <li><NavLink to="/productosDetails">ProductosDetails</NavLink></li>
        </ul>
      </header>
      <main className="App-main">
          <Switch>
            <Route path="/" exact component={HomeComponent} />
            <Route path="/clientes"  component={ClientesComponent} />
            <Route path="/productos" component={ProductosComponent} />
            <Route path="/productosDetails" component={Productos} />
            <Redirect to="/" />
          </Switch>
      </main>
      </Router>
    </div>
  );
}

export default App;
