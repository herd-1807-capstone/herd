const db = require('../db')
const firebase = require('firebase')
const router = require('express').Router()
module.exports = router;

// GET
router.get('/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  try{
    const user = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    db.ref(`/users/${userId}`).once('value')
    .then(snapshot => {
      if(user.status === 'admin' || user.uid === userId){
        res.json(snapshot);
      }else{
        res.status(403).send('forbidden');
      }
    })
    .catch(err => {
      next(err);
    })
  }catch(err){
    next(err);
  }
});

// POST
router.post('/', async(req, res, next) => {
  try{
    const user = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!user){
      res.status(403).send('forbidden');
      return;
    }



    res.status(201);
  }catch(err){
    next(err);
  }
});

// PUT
router.put('/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  try{
    const user = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    res.json("Need to implement");
  }catch(err){
    next(err);
  }
});

// DELETE
router.delete('/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  try{
    const user = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    res.json("Need to implement");
  }catch(err){
    next(err);
  }
});
