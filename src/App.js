import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from './SignIn';
import Map from './Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <SignIn />
        </header>
        <Map />
      </div>
    );
  }
}

export default App;