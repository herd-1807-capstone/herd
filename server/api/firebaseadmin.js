let admin = require("firebase-admin");
let serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://herd-217719.firebaseio.com"
});

let db = admin.database();

module.exports = {admin, db};
