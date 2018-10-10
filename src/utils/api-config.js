import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

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

// Decide the server-side host base url
let backendHost;
if(process.env.NODE_ENV === 'development'){
  backendHost = 'http://localhost:8080';
}else{
  backendHost = 'https://herd-capstone.herokuapp.com';
}

export const API_ROOT = `${backendHost}/api`;
export const auth = firebase.auth();
export const db = firebase.database();
export default firebase;
