const router = require('express').Router()
const db = require('../db')
const firebase = require('firebase')
module.exports = router;

// GET
router.get('/:tourId', async(req, res, next) => {
  const tourId = req.params.tourId;
  try{
    console.log(firebase.auth().currentUser)

    await db.ref(`/tours/${tourId}`).once('value').then(snapshot => {
      if(!snapshot){
        res.status(404);
      }else{
        res.json(snapshot);
      }
    });
  }catch(err){
    next(err);
  }
})

// POST
router.post('/:tourName', async(req, res, next) => {
  try{
    const tourName = req.params.tourName;
    const spots = req.body.spots;
    const users = req.body.users;

    console.log(firebase.auth().currentUser)

    await db.ref(`/tours/`).push({
      tourName,
      spots,
      users
    });
  }catch(err){
    next(err);
  }
})

// PUT
router.put('/XXX', async(req, res, next) => {

})

// DELETE
router.delete('/XXX', async(req, res, next) => {

})
