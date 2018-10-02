var admin = require("firebase-admin");
var serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://herd-217719.firebaseio.com"
});

module.exports = admin;
