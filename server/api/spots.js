const db = require('../db')
const firebase = require('firebase')
const router = require('express').Router()
module.exports = router;

// GET
router.get('/:spotId', async(req, res, next) => {
  const spotId = req.params.spotId;
  try{
    const user = firebase.auth().currentUser;
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    const snapshot = await db.ref(`/spots/${spotId}`).once('value');
    const spot = snapshot.val();
    if(!spot){
      res.status(404).send('Not Found');
      return;
    }

    res.json(spot);
  }catch(err){
    next(err);
  }
});

// POST
router.post('/', async(req, res, next) => {
  try{
    const {name, description, lat, lng} = req.body;

    const user = firebase.auth().currentUser;
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    const spot = {
      name, description, lat, lng
    }

    const spotPushed = await db.ref(`/spots/`).push(spot);
    res.json({
     ...spot,
     "key": spotPushed.key
    });

  }catch(err){
    next(err);
  }
});

// DELETE
router.delete('/:spotId', async(req, res, next) => {
  try{
    const user = firebase.auth().currentUser;
    if(!user) {
      res.status(403).send('forbidden');
      return;
    }

    if(user.status.toLowerCase() !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    await db.ref(`/spots/${spotId}`).remove();
    res.status(201);
  }catch(err){
    next(err);
  }
});

// UPDATE
router.update('/:spotId', async(req, res, next) => {
  try{

  }catch(err){
    next(err);
  }
});
