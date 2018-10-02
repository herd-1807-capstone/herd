const db = require('../db');
const firebase = require('firebase');
const router = require('express').Router();
module.exports = router;

// GET /users/chat/:userId
router.get('/chat/:userId', async (req, res, next) => {
  try {
    const userAuth = firebase.auth().currentUser;
    const fromUserId = req.params.userId;
    const toUserId = req.body.toUserId;
    if (fromUserId !== userAuth) res.status(403).send('forbidden');
  } catch (error) {
    next(err);
  }
});
