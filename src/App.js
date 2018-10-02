import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import firebase from './fire';
import { connect } from 'react-redux';

import logo from './logo.svg';
import './App.css';
import SignIn from './SignIn';
import Login from './Login';
import Map from './Map';
import Error from './Error';
import MenuBar from './components/MenuBar';
import { setCurrentUser } from './store/index';
// import Admin from './components/Admin';

const auth = firebase.auth();
const db = firebase.database();

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   user: null,
    //   isLoading: true,
    // };
  }


  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          // console.log('USER EXISTS IN DB???', snapshot)
          
          if (!snapshot.exists()) {
            // console.log("Snapshot!!")
            // console.log(user)
            let newUser = {
              email: user.email,
              name: user.displayName,
              phone: user.phoneNumber,
              uid: user.uid,
              status: 'member',
              visible: true,
              tour: 'null',
            };
            // console.log('CREATING USER THE FIRST TIME');
            await db.ref(`/users/${user.uid}`).set(newUser);
            user = newUser
          }
          // console.log("Outside of Snapshot!!")
          // console.log(snapshot.val())
          // this.setState({ user, isLoading: false });
          // this.props.setCurrentUser(snapshot.val())
          this.props.setCurrentUser(user)

        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  

  render() {
    if(this.props.currentUser === null){
      return (
        <Redirect to='/' />
      )
    }
    return (
      <div className="App">

        <Switch>
          <Route path="/signin" component={Login} />
          {this.props.currentUser.hasOwnProperty('email') && (
            <Switch>
              <Route exact path="/" component={MenuBar} />
              <Route path="/error/:id" component={Error} />
              {/* <Route exact path="/admin" component={Admin} /> */}
              {/* <Route exact path="/admin/group" component={Group} /> */}
              {/* <Route path="/admin/group/create" component={CreateGroup} /> */}
            </Switch>
          )}
          <Route component={Login} />
        </Switch>
      </div>
    );
  }
}

const mapState = state => {
  return {
    currentUser: state.user.currentUser,
    isLoading: state.user.isLoading,
  }
}

const mapDispatch = dispatch => {
  return {
    setCurrentUser: (user) => dispatch(setCurrentUser(user))
  }
}

export default connect(mapState, mapDispatch)(App);
