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
import LoadingState from './components/LoadingState'
import { changeLoadingState } from './reducers/user';
import { isatty } from 'tty';

const auth = firebase.auth();
const db = firebase.database();

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      isAuth: true,
    }
  }
  
  componentDidMount() {
    // this.props.changeLoadingState()
    auth.onAuthStateChanged(async user => {
      console.log("Component did mount in app")
      if (user) {
        this.setState({...this.state, isLoading: true, isAuth: true})
        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          // console.log(snapshot.val())
          console.log("user is exist!")
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
            console.log('Update information');
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
          
          console.log("end of the line, local loadingstate is ", this.state.isLoading)
        } catch (error) {
          console.error(error);
        }
      }
    });
    console.log("User does not exist")
    this.setState({...this.state, isAuth: false})
  }
  static getDerivedStateFromProps(props, state){
    console.log("receive new props of state")
    console.log(state)
    console.log(props)
    // console.log(props.currentUser !== null && props.currentUser.hasOwnProperty('uid'))
    if(!state.isAuth && state.isLoading){
      console.log("No user out there, stop loading")
      return ({...state, isLoading: false})
    } else if(state.isAuth && state.isLoading && props.currentUser !== null && props.currentUser.hasOwnProperty('uid')){
      console.log("Receive current user! Stop loading")
      return ({...state, isLoading: false})
    } else {
      return null
    }
  }
  ComponentDidUpdate(prevProps, prevState){
    console.log("Component did update")
    const { isAuth, isLoading } = this.state
    console.log("isAuth = ")
    console.log(isAuth)
    console.log("isLoading = ")
    console.log(isLoading)

    // if(!isAuth && isLoading){
    //   console.log("no user login, stop loading, should go to login page")
    //   this.setState({...this.state, isLoading: false})
    // } else if (isAuth && isLoading && this.props.currentUser !== null && this.props.currentUser.hasOwnProperty('uid')){
    //   console.log("Component did update, current user is ", this.props.currentUser)
    //   console.log("Got current user, stop loading")
    //   this.setState({...this.state, isLoading: false})
    // } 
  }

  render() {
    // if(this.props.currentUser === null || !this.props.currentUser.hasOwnProperty('email')){
    //   return (
    //     // <Redirect to='/' />
    //     <Route component={LoadingState} />
    //   )
    // }
    console.log(this.state.isLoading)
    console.log(this.props.currentUser)
    if(this.state.isLoading){
      console.log("Run loading state")
      return (
        <Route component={LoadingState} />
        // <LoadingState />
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
    setCurrentUser: (user) => dispatch(setCurrentUser(user)),
    changeLoadingState: () => dispatch(changeLoadingState())
  }
}

export default withRouter(connect(mapState, mapDispatch)(App));
