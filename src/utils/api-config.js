import firebase from 'firebase'

let backendHost;

if(process.env.NODE_ENV === 'development'){
  backendHost = 'http://localhost:8080';
}else{
  backendHost = 'https://herd-capstone.herokuapp.com';
}

  // Initialize Firebase
const config = {
    apiKey: "AIzaSyDSRqOg14rMt-PRggMXQcj_qzPdI6eOihk",
    authDomain: "herd-217719.firebaseapp.com",
    databaseURL: "https://herd-217719.firebaseio.com",
    projectId: "herd-217719",
    storageBucket: "herd-217719.appspot.com",
    messagingSenderId: "875053589347"
};
firebase.initializeApp(config);


export const API_ROOT = `${backendHost}/api`;
export default firebase;
