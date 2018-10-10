import React, { Component } from 'react';
import firebase from '../utils/api-config';
import { StyledFirebaseAuth } from 'react-firebaseui';

var uiConfig = {
  signInFlow: 'redirect',
  signInSuccessUrl: '/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ['https://www.googleapis.com/auth/plus.login'],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account',
      },
      callbacks: {

      }
    },
    // {
    //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   scopes: ['public_profile', 'email', 'user_likes', 'user_friends'],
    //   customParameters: {
    //     // Forces password re-entry.
    //     auth_type: 'reauthenticate',
    //   },
    // },
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  // tosUrl: '<your-tos-url>',
  // // Privacy policy url.
  // privacyPolicyUrl: '<your-privacy-policy-url>'
};

export default class Login extends Component {
  render() {
    return (
      <div>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
        <img alt=""
          src="http://herd.careers/wp-content/uploads/2016/04/Event-Ad-1.gif"
          width="400px"
          height="400px"
        />
      </div>
    );
  }
}



