const router = require('express').Router()
const db = require('../db')
const firebase = require('firebase')
module.exports = router;

// GET
router.get('/:tourId', async(req, res, next) => {
  const tourId = req.params.tourId;
  try{
    const user = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!user){
      res.status(403).send('forbidden');
      return;
    }
    db.ref(`/tours/${tourId}`).once('value').then (snapshot => {
      const members = snapshot.val().users;

      const memberIds = Object.keys(members);
      // check if current user is either an admin of this tour or a member.
      if(memberIds.indexOf(user.id) < 0){
        res.status(403).send('forbidden');
        return;
      }

      res.json(snapshot);
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

    const user = firebase.auth().currentUser;
    if(!user || user.status.toLowerCase() !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    await db.ref(`/tours/`).push({
      tourName,
      spots,
      users
    });

    res.status(201).send();
  }catch(err){
    next(err);
  }
})

// PUT
router.put('/:tourId', async(req, res, next) => {
  const tourName = req.params.tourName;
  const spots = req.body.spots;
  const users = req.body.users;

  const user = firebase.auth().currentUser;
  if(user.status.toLowerCase() !== 'admin'){
    res.status(403).send('forbidden');
    return;
  }


})

// DELETE
router.delete('/:tourId', async(req, res, next) => {

})
