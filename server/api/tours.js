const db = require('../db')
const firebase = require('firebase')
const router = require('express').Router()
module.exports = router;

// GET /tours/:tourId
router.get('/:tourId', async(req, res, next) => {
  const tourId = req.params.tourId;
  try{
    const user = firebase.auth().currentUser;

    // a user must be logged-in to retrieve data.
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    db.ref(`/tours/${tourId}`).once('value').then(snapshot => {
      const users = snapshot.val().users;

      // check if current user is either an admin of this tour or a member.
      if(users.indexOf(user.uid) < 0){
        res.status(403).send('forbidden');
        return;
      }

      res.json(snapshot);
    }).catch(err => {
      next(err);
    });

  }catch(err){
    next(err);
  }
})

// POST /tours
router.post('/', async(req, res, next) => {
  try{
    const {name, spots, emails} = req.body;

    const user = firebase.auth().currentUser;
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    // make sure the current user is an admin
    const tempUser = await db.ref(`/users/${user.uid}`).once('value');
    if(!tempUser || tempUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    const tour = {name};
    if(spots) tour.spots = spots;
    let membersNotFound = [];
    if(emails) {
      // get all uids of users(emails)
      let userIds = [];

      const users = await db.ref('/users').orderByChild('email').once('value');
      for(let email of emails){
        let found = false;

        finduser:
        for(let u of users){
          if(u.email === email){
            userIds.push(u.uid);
            found = true;
            break finduser;
          }
        }

        if(!found) membersNotFound.push(email);
      }

      if(userIds.length > 0) tour.users = userIds;
    }

    const tourCreated = await db.ref(`/tours/`).push(tour);

    res.status(201).send();
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
      res.status(403).send('forbidden');
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
    res.status(201);
  }catch(err){
    next(err);
  }
})

// PUT
router.put('/:tourId', async(req, res, next) => {
  try{
    const {name, spots, emails} = req.body;

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
      return;
    }

    const tourVal = tour.val();
    if(name) tourVal.name = name;
    if(spots) tourVal.spots = spots;

    let membersNotFound = [];
    if(emails) {
      // get all uids of users(emails)
      let userIds = [];
      const users = await db.ref('/users').orderByChild('email').once('value');
      for(let email of emails){
        let found = false;
        finduser:
        for(let u of users){
          if(u.email === email){
            userIds.push(u.uid);
            found = true;
            break finduser;
          }
        }
        if(!found) membersNotFound.push(email);
      }

      if(userIds.length > 0) tour.users = userIds;
    }

    await db.ref(`/tours/${tourId}`).set(tourVal);

    if(membersNotFound.length > 0){
      res.status(201).send(membersNotFound.join(', ') + 'need to sign up first!');
    }else{
      res.status(201).send();
    }

  }catch(err){
    next(err);
  }
})

// PUT /tours/:tourId/users/:userId - updates user's location i.e., lat and lng of a User instance in db.
router.get('/:tourId/users/:userId', async (req, res, next) => {
  const {tourId, userId} = req.params;
  const {lat, lng} = req.body;
  try{
    // const loggedInUser = firebase.auth().currentUser;
    // if(!loggedInUser || loggedInUser.uid !== userId) {
    //   res.status(403).send('forbidden');
    //   return;
    // }

    // const tour = await db.ref(`/tours/${tourId}`).once('value');
    // if(!tour){
    //   res.status(404).send('tour not found');
    //   return;
    // }

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
    if(lat && lng){
      // update lat AND lng
      userVal.lat = lat;
      userVal.lng = lng;
    }

    await db.ref(`/users/${userId}`).set(userVal);

    res.status(201).send('updated');
  }catch(err){
    next(err);
  }
});
