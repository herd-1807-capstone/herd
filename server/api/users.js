const db = require('../db')
const firebase = require('firebase')
const router = require('express').Router()
module.exports = router;

// GET /users/:userId
router.get('/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  try{
    const currUser = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!currUser){
      res.status(403).send('forbidden');
      return;
    }

    db.ref(`/users/${userId}`).once('value')
    .then(snapshot => {
      if(currUser.status === 'admin' || currUser.uid === userId){
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

    // parse info from req.body - email, lat, lng, name, status, tour, visible
    const {email, lat, lng, name, status, tour, visibie} = req.body;

    const user = {email, lat, lng, name};
    if(tour) user.tour = tour;
    if(visible === undefined) visible = true;
    user.visible = visible;

    if(!status) status = "member";
    user.status = status;

    const userCreated = await db.ref('/users').push(user);

    // return the created user's key to the client
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
    const currUser = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!currUser){
      res.status(403).send('forbidden');
      return;
    }

    const {email, lat, lng, name, status, tour, visibie} = req.body;

    const user = {};
    if(email) user.email = email;
    if(lat) user.lat = lat;
    if(lng) user.lng = lng;
    if(name) user.name = name;
    if(status) user.status = status;
    if(tour) user.tour = tour;
    if(visible !== undefined) user.visible = visible;

    const update = await db.ref(`/users/${userId}`).update(user);

    res.status(201);
  }catch(err){
    next(err);
  }
});

// DELETE /users/:userId
router.delete('/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  try{
    const currUser = firebase.auth().currentUser;
    // a user must be logged-in to retrieve data.
    if(!currUser){
      res.status(403).send('forbidden');
      return;
    }

    const currUserSnapshot = await db.ref(`/users/${currUser.uid}`).once('value');
    const loggedInUser = currUserSnapshot.val();
    // make sure the logged-in user is an admin.
    if(loggedInUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    await db.ref(`/users/${userId}`).remove();
    res.status(201);
  }catch(err){
    next(err);
  }
});
