const db = require('../db')
const firebase = require('firebase');
const admin = require('./firebaseadmin');
const router = require('express').Router();
module.exports = router;

// a middleware authenticating a logged-in user and adding that user instance to the request.
router.use(async (req, res, next) => {
  try{
    const {idToken} = req.body;
    if(!idToken){
      res.status(403).send('forbidden');
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if(!decodedToken){
      res.status(403).send('forbidden');
      return;
    }

    const authUserSnapshot = await db.ref(`/users/${decodedToken.uid}`).once('value');
    const authUser = authUserSnapshot.val();
    // a user must be logged-in to retrieve data.
    if(!authUser){
      res.status(403).send('forbidden');
      return;
    }

    req.authUser = authUser;
  }catch(err){
    next(err);
  }
});

router.use('/tours', require('./tours'));
router.use('/users', require('./users'));
router.use('/chat', require('./messages'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
