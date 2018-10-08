import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import firebase from './fire';
import { connect } from 'react-redux';
import './App.css';
import Login from './Login';
import Error from './Error';
import MenuBar from './components/MenuBar';
import PostLogin from './components/PostLogin';
import { setCurrentUser } from './store/index';
import Admin from './components/Admin';
import CreateGroup from './components/CreateGroup';
import ManageGroup from './components/ManageGroup';
import LoadingState from './components/LoadingState'
import { changeLoadingState } from './reducers/user';

const auth = firebase.auth();
const db = firebase.database();

class App extends Component {

  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          console.log("user does exist!")
          const userRef = db.ref(`/users/${user.uid}`)
          if (!snapshot.exists()) {
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
            await db.ref(`/users/${user.uid}`).update(theUser)

            theUser.uid = user.uid
            theUser.status = snapshot.val().status
            theUser.visible = snapshot.val().visible
            theUser.tour = snapshot.val().tour
            user = theUser
          }
          this.props.setCurrentUser(user)
          userRef.onDisconnect().update({loggedIn: false});
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("User does not exist")
        this.props.history.push('/signin')
      }
    });
  }


  render() {
    return (
      <div className="App">

        <Switch>
          <Route path="/signin" component={Login} />
          {this.props.currentUser.hasOwnProperty('email') && (
            <Switch>
              {
                this.props.currentUser.tour ?
                <Route exact path="/" component={MenuBar} />:
                <Route exact path="/" component={PostLogin} />
              }
              <Route path="/error/:id" component={Error} />
              <Route exact path="/admin" component={Admin} />
              <Route exact path="/admin/group" component={ManageGroup} />
              <Route path="/admin/group/create" component={CreateGroup} />
            </Switch>
          )}
          {<Route component={LoadingState} />}
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
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
    changeLoadingState: () => dispatch(changeLoadingState())
  }
}

export default withRouter(connect(mapState, mapDispatch)(App));
