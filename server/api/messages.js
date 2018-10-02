const db = require('../db');
const firebase = require('firebase');
const router = require('express').Router();
module.exports = router;

// GET /api/chat/:userId
router.get('/:userId', async (req, res, next) => {
  try {
    // const userAuth = firebase.auth().currentUser;
    // const userId = req.params.userId;
    // if (userId === userAuth) {
    const snapshot = await db.ref(`/tours/disney_tour/messages/`).once('value');
    const messages = snapshot.val();

    if (messages) {
      res.json(messages);
    } else res.status(404).send('Not Found');
    // } else res.status(403).send('forbidden');
  } catch (error) {
    next(error);
  }
});

// POST /api/chat/:userId
router.post('/:userId', async (req, res, next) => {
  try {
    const userAuth = firebase.auth().currentUser;
    const fromId = req.params.userId;
    const { toId, text } = req.body;

    if (fromUserId === userAuth) {
      const newMessage = { fromId, text, toId };
      const newKey = await db
        .ref()
        .child(`messages`)
        .push().key;
      const messages = {};
      messages[`/messages/${newKey}`] = newMessage;

      res.status(201).json(messages);

      return db.ref().update(messages);
    } else res.status(403).send('forbidden');
  } catch (error) {
    next(err);
  }
});
