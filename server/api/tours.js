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

      // check if current user is either an admin of this tour or a member.
      if(members.indexOf(user.uid) < 0){
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
    const {spots, users} = req.body;

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
  try{
    const tourName = req.params.tourName;
    const {spots, users} = req.body;

    const user = firebase.auth().currentUser;
    if(user.status.toLowerCase() !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    // make sure there is a tour with the given tour id and the currentUser has permission to change the tour.
    const tour = db.ref(`/tours/${tourId}`).once('value');
    if(!tour){
      res.status(404).send('tour not found');
      return;
    }
    if(!tour.val().users.indexOf(user.uid)){
      res.status(403).send('forbidden');
    }

    const tourVal = tour.val();
    await db.ref(`/tours/${tourId}`).set({
      ...tourVal,
      tourName,
      spots,
      users
    });
  }catch(err){
    next(err);
  }
})

// DELETE
router.delete('/:tourId', async(req, res, next) => {
  try{
    // first, check logged-in user's privilege i.e., the guide of this tour(tourId)
    const user = firebase.auth().currentUser;
    if(!user) {
      res.status(403).send('forbidden logged-out user');
      return;
    }

    if(user.status.toLowerCase() !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    const tour = db.ref(`/tours/${tourId}`).once('value');
    if(tour.val().users.indexOf(user.uid) < 0){
      res.status(403).send('forbidden');
      return;
    }

    await db.ref(`/tours/${tourId}`).remove();
  }catch(err){
    next(err);
  }
})

// PUT /tours/:tourId/users/:userId
router.put('/:tourId/users/:userId', async (req, res, next) => {
  const {tourId, userId} = req.params;
  const {lat, lng} = req.body;
  try{
    // const loggedInUser = firebase.auth().currentUser;
    // if(!loggedInUser || loggedInUser.uid !== userId) {
    //   res.status(403).send('forbidden');
    //   return;
    // }
    const tour = await db.ref(`/tours/${tourId}`).once('value');
    if(!tour){
      res.status(404).send('tour not found');
      return;
    }

    // if(tour.val().users.indexOf(loggedInUser.uid) < 0){
    //   res.status(403).send('forbidden');
    //   return;
    // }

    const user = await db.ref(`/users/${userId}`).once('value');
    if(!user){
      res.status(404).send('user not found');
      return;
    }

    // update the user with a new pair of lat and lng
    const userVal = user.val();
    await db.ref(`/users/${userId}`).set({
      ...userVal,
      lat,
      lng
    });

    res.status(201).send('updated');
  }catch(err){
    next(err);
  }
});
