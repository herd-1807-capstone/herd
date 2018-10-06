import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import firebase from './fire';
import { connect } from 'react-redux';
import './App.css';
import Login from './Login';
import Error from './Error';
import MenuBar from './components/MenuBar';
import { setCurrentUser } from './store/index';
import Admin from './components/Admin';
import CreateGroup from './components/CreateGroup';
import ManageGroup from './components/ManageGroup';
import axios from 'axios';
import { API_ROOT } from './api-config';

const auth = firebase.auth();
const db = firebase.database();

class App extends Component {
  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          // console.log('USER EXISTS IN DB???', snapshot)

          const userRef = db.ref(`/users/${user.uid}`)


          if (!snapshot.exists()) {
            // console.log("Snapshot does not exists!!")
            // console.log(user)
            let newUser = {
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              uid: user.uid,
              status: 'member',
              visible: true,
              tour: 'null',
              loggedIn: true,
            };
            // console.log('CREATING USER THE FIRST TIME');
            await db.ref(`/users/${user.uid}`).set(newUser);
            newUser = await db.ref(`/users/${user.uid}`).once('value');
            user = newUser.val();
          } else {
            let theUser = {
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              imgUrl: user.photoURL,
              loggedIn: true
            }

            // console.log(snapshot.val().tour)

            await db.ref(`/users/${user.uid}`).update(theUser)
            // const {data} = await axios.put(`${API_ROOT}/users/${user.uid}?access_token=${idToken}`, theUser);

            theUser.uid = user.uid
            theUser.status = snapshot.val().status
            theUser.visible = snapshot.val().visible
            theUser.tour = snapshot.val().tour
            user = theUser
          //   return firebase.database().ref().update(updates);
          // }
          }
          // console.log("You are authed!!")
          // console.log(snapshot.val())
          // this.setState({ user, isLoading: false });
          // this.props.setCurrentUser(snapshot.val())
          this.props.setCurrentUser(user)
          userRef.onDisconnect().update({loggedIn: false});
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
              <Route exact path="/admin" component={Admin} />
              <Route exact path="/admin/group" component={ManageGroup} />
              <Route path="/admin/group/create" component={CreateGroup} />
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

export default withRouter(connect(mapState, mapDispatch)(App));
