import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import firebase from './fire';

import logo from './logo.svg';
import './App.css';
import SignIn from './SignIn';
import Login from './Login';
import Map from './Map';
import Error from './Error';

const auth = firebase.auth();
const db = firebase.database();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          // console.log('USER EXISTS IN DB???', snapshot)
          if (!snapshot.exists()) {
            let newUser = {
              email: user.email,
              name: user.displayName,
              phone: user.phoneNumber,
              uid: user.uid,
              status: 'member',
              visible: true,
            };
            // console.log('CREATING USER THE FIRST TIME');
            await db.ref(`/users/${user.uid}`).set(newUser);
          }
          console.log(user);
          this.setState({ user, isLoading: false });

          // snapshot = await db.ref('/tours')
          //                     .orderByChild('user')
          //                     .equalTo(user.displayName)
          // console.log(snapshot)
          // snapshot = await db.ref('/tours').once('value')
          // let tour = snapshot.map((tour)=>{
          //   let user = tour.users.map()
          // })
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid key="front" item />
            <Grid key="middle" item>
              <img src={logo} className="App-logo" alt="logo" />
            </Grid>
            <Grid key="end" item>
              <SignIn />
            </Grid>
          </Grid>
        </header>
        <Switch>
          <Route path="/signin" component={Login} />
          {this.state.user && (
            <Switch>
              <Route exact path="/" component={Map} />
              <Route path="/error/:id" component={Error} />
            </Switch>
          )}
          <Route component={Login} />
        </Switch>
      </div>
    );
  }
}

export default App;
