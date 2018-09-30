import React, { Component } from 'react';
import firebase from './fire';
import firebaseui from 'firebaseui';


import {StyledFirebaseAuth} from 'react-firebaseui'



var ui = new firebaseui.auth.AuthUI(firebase.auth());

// ui.start('#firebaseui-auth-container', {
//   signInOptions: [
//     // List of OAuth providers supported.
//     {
//       provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//       scopes: [
//         'https://www.googleapis.com/auth/plus.login'
//       ],
//       customParameters: {
//         // Forces account selection even when one account
//         // is available.
//         prompt: 'select_account'
//       }
//     },
    // {
    //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   scopes: [
    //     'public_profile',
    //     'email',
    //     'user_likes',
    //     'user_friends'
    //   ],
    //   customParameters: {
    //     // Forces password re-entry.
    //     auth_type: 'reauthenticate'
    //   }
    // },
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID
//   ],
//   // Other config options...
// });


var uiConfig = {
  // callbacks: {
  //   signInSuccessWithAuthResult: function(authResult, redirectUrl) {
  //     // User successfully signed in.
  //     // Return type determines whether we continue the redirect automatically
  //     // or whether we leave that to developer to handle.
  //     console.log("********Auth Result********")
  //     console.log(authResult)
  //     return true;
  //   },
  //   uiShown: function() {
  //     // The widget is rendered.
  //     // Hide the loader.
  //     document.getElementById('loader').style.display = 'none';
  //   }
  // },

  // signInFlow: 'popup',
  signInFlow: 'redirect',
  signInSuccessUrl: '/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/plus.login'
      ],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account'
      }
    },
    // {
    //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   scopes: [
    //     'public_profile',
    //     'email',
    //     'user_likes',
    //     'user_friends'
    //   ],
    //   customParameters: {
    //     // Forces password re-entry.
    //     auth_type: 'reauthenticate'
    //   }
    // },
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};


export default class Login extends Component{


    componentDidMount(){
        // ui.start('#firebaseui-auth-container', uiConfig);
    }


    render(){
      return (
        <div>
           <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          {/* <div id="firebaseui-auth-container"></div> */}
          <div id="loader">Loading...</div>
        </div>
      )
    }
}