import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
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
import Admin from './components/Admin';
import CreateGroup from './components/CreateGroup';
import ManageGroup from './components/ManageGroup';
import LoadingState from './components/LoadingState'
import { changeLoadingState } from './reducers/user';

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
    // console.log("Change loading state")
    // this.props.changeLoadingState()
    auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          // console.log('USER EXISTS IN DB???', snapshot)
          
          if (!snapshot.exists()) {
            console.log("Snapshot does not exists!!")
            // console.log(user)
            let newUser = {
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              uid: user.uid,
              status: 'member',
              visible: true,
              tour: 'null',
            };
            await db.ref(`/users/${user.uid}`).set(newUser);
            user = newUser
          } else {
            console.log('CREATING USER THE FIRST TIME');
            let theUser = {
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              imgUrl: user.photoURL,
            }

            // console.log(snapshot.val().tour)

            await db.ref(`/users/${user.uid}`).update(theUser)
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
          // console.log("change loading state AGAIN!")
          // this.props.changeLoadingState();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  

  render() {
    if(this.props.currentUser === null || !this.props.currentUser.hasOwnProperty('email')){
      return (
        // <Redirect to='/' />
        <Route component={LoadingState} />
      )
    }
    // if(this.props.isLoading){
    //   return (
    //       <div className='loadingParent'>
    //           <LoadingState className='loadingState' />
    //       </div>
    //   )
  // }
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
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
    changeLoadingState: () => dispatch(changeLoadingState())
  }
}

export default withRouter(connect(mapState, mapDispatch)(App));
