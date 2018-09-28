const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyDSRqOg14rMt-PRggMXQcj_qzPdI6eOihk",
  authDomain: "herd-217719.firebaseapp.com",
  databaseURL: "https://herd-217719.firebaseio.com",
  projectId: "herd-217719",
  storageBucket: "herd-217719.appspot.com",
  messagingSenderId: "875053589347"
};
firebase.initializeApp(config);

let database = firebase.database();
module.exports = database;
