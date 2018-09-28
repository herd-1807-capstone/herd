import React, { Component } from 'react';
import firebase from './fire'

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const db = firebase.database();
export default class SignIn extends Component{
  constructor(props){
    super(props)
    this.state = {
      user:null
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount(){
    auth.onAuthStateChanged(async(user) => {
      if (user) {
        try {
          let snapshot = await db.ref(`/users/${user.uid}`).once('value');
          // console.log('USER EXISTS IN DB???', snapshot)
          if (!snapshot.exists()) {
            let newUser = {
              email: user.email,
              name: user.displayName,
              phone: user.phoneNumber
            }
            // console.log('CREATING USER THE FIRST TIME');
            await db.ref(`/users/${user.uid}`).set(newUser);
          }
          this.setState({ user });
        } catch (error) {
          console.error(error)
        }
      }
    });
  }
  async login(){
    let { user } = await auth.signInWithRedirect(provider);
    this.setState({
      user
    });
  }
  async logout(){
    await auth.signOut();
    this.setState({
      user: null
    });
  }
  render(){
    return(
    <div id = 'signin'>
        {this.state.user ?
            <button onClick={this.logout}>Logout</button>
          :
            <button onClick={this.login}>Log in with Google</button>
          }
    </div>
    )
  }
}

