const db = require('../db')
const firebase = require('firebase')
const router = require('express').Router()
module.exports = router;

// GET /users/:userId
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

// POST /users
router.post('/', async(req, res, next) => {
  try{
    const currUser = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!currUser){
      res.status(403).send('forbidden');
      return;
    }

    // email, lat, lng, name, status, tour, visible
    const {email, lat, lng, name, status, tour, visibie} = req.body;

    const user = {email, lat, lng, name};
    if(tour) user.tour = tour;
    if(visible === undefined){
      user.visible = true;
    }else{
      user.visible = visible;
    }
    if(!status) {
      user.status = "member";
    }else{
      user.status = status;
    }

    const userCreated = await db.ref('/users').push(user);

    res.json({
      key: userCreated.key
    });
  }catch(err){
    next(err);
  }
});

// PUT /users/:userId
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

// DELETE /users/:userId
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
