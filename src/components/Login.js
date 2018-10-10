import React, { Component } from 'react';
import firebase, {auth} from '../utils/api-config';
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
        // Forces account selection even when one account is available.
        prompt: 'select_account',
      },
      callbacks: {

      }
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

export default class Login extends Component {
  render() {
    return (
      <div>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={auth}
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



