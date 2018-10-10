import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import firebase from '../utils/api-config';
import { connect } from 'react-redux';
import '../css/App.css';
import Login from './Login';
import Error from './Error';
import MenuBar from './MenuBar';
import PostLogin from './PostLogin';
import { setCurrentUser } from '../store/index';
import Admin from './Admin';
import CreateGroup from './CreateGroup';
import ManageGroup from './ManageGroup';
import LoadingState from './LoadingState'
import { changeLoadingState } from '../reducers/user';

const auth = firebase.auth();
const db = firebase.database();

class App extends Component {

  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        const connectedRef = db.ref('.info/connected');

        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          console.log("On Auth current user")
          console.log(auth.currentUser.emailVerified)
          console.log("user does exist!")
          console.log(user)
          console.log("what we have for the user")
          console.log(snapshot.val())
          const userRef = db.ref(`/users/${user.uid}`)
          if (!snapshot.exists()) {
            let newUser = {
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              uid: user.uid,
              status: 'member',
              visible: true,
              tour: null,
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
            console.log("Tour in app")
            console.log(snapshot.val().tour)
            user = theUser
          }
          this.props.setCurrentUser(user)
          userRef.onDisconnect().update({loggedIn: false});

          connectedRef.on('value', (snap)=>{
            if(snap.val() === true) userRef.update({loggedIn: true});
            else userRef.update({loggedIn: false});
          })

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
    const tour = this.props.currentUser.tour;
    console.log(tour)
    return (
      <div className="App">

        <Switch>
          <Route path="/signin" component={Login} />
          {this.props.currentUser.hasOwnProperty('email') && (
            <Switch>
              {
                tour ?
                <Route exact path="/" component={MenuBar} />
                :
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
