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
      const tour = snapshot.val();

      const users = tour.users;
      // check if current user is either an admin of this tour or a member.
      if(users.indexOf(user.uid) < 0){
        res.status(403).send('forbidden');
        return;
      }

      res.json(tour);
    }).catch(err => {
      next(err);
    });

  }catch(err){
    next(err);
  }
})

// POST /tours - create a tour without any spots and users.
router.post('/', async(req, res, next) => {
  try{
    const {name} = req.body;

    const currUser = firebase.auth().currentUser;
    if(!currUser){
      res.status(403).send('forbidden');
      return;
    }

    // make sure the current user is an admin
    const currUserSnapshot = await db.ref(`/users/${user.uid}`).once('value');
    const loggedInUser = currUserSnapshot.val();
    if(!loggedInUser || loggedInUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    const tour = {
      name,
      guideUId: loggedInUser.uid
    };

    const tourCreated = await db.ref(`/tours/`).push(tour);

    res.json({
      ...tour,
      "key": tourCreated.key
    });
  }catch(err){
    next(err);
  }
})

// DELETE /tours/:tourId
router.delete('/:tourId', async(req, res, next) => {
  try{
    // first, check logged-in user's privilege i.e., the guide of this tour(tourId)
    const currUser = firebase.auth().currentUser;
    if(!currUser) {
      res.status(403).send('forbidden');
      return;
    }

    const userSnapshot = await db.ref(`/users/${currUser.uid}`).once('value');
    const user = userSnapshot.val();
    if(user.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    const tourSnapshot = await db.ref(`/tours/${tourId}`).once('value');
    const tour = tourSnapshot.val();
    if(!tour){
      res.status(404).send('not found');
      return;
    }

    if(tour.users.indexOf(user.uid) < 0){
      res.status(403).send('forbidden');
      return;
    }

    await db.ref(`/tours/${tourId}`).remove();
    res.status(201);
  }catch(err){
    next(err);
  }
})

// PUT /tours/:tourId
router.put('/:tourId', async(req, res, next) => {
  try{
    const {name} = req.body;

    const user = firebase.auth().currentUser;
    if(!user){
      res.status(403).send('forbidden');
      return;
    }

    const userSnapshot = await db.ref(`/users/${user.uid}`).once('value');
    const loggedInUser = userSnapshot.val();
    if(!loggedInUser || loggedInUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    // make sure there is a tour with the given tour id and the currentUser has permission to change the tour.
    const tourSnapshot = await db.ref(`/tours/${tourId}`).once('value');
    const tour = tourSnapshot.val();
    if(!tour){
      res.status(404).send('tour not found');
      return;
    }
    if(!tour.user || !tour.users.indexOf(user.uid)){
      res.status(403).send('forbidden');
      return;
    }

    await db.ref(`/tours/${tourId}`).update({name});

    res.status(201).send();
  }catch(err){
    next(err);
  }
})

// TODO: CRUD on /tours/spots

// TODO: CRUD on /tours/users

// PUT /tours/:tourId/users/:userId - updates user's location i.e., lat and lng of a User instance in db.
router.put('/:tourId/users/:userId', async (req, res, next) => {
  const {tourId, userId} = req.params;
  const {lat, lng} = req.body;
  try{
    // const loggedInUser = firebase.auth().currentUser;

    // if(!loggedInUser || loggedInUser.uid !== userId) {
    //   res.status(403).send('forbidden');
    //   return;
    // }

    // const snapshot = await db.ref(`/tours/${tourId}`).once('value');
    // const tour = snapshot.val();
    // if(!tour){
    //   res.status(404).send('tour not found');
    //   return;
    // }

    // if(tour.users.indexOf(loggedInUser.uid) < 0){
    //   res.status(403).send('forbidden');
    //   return;
    // }

    const user = await db.ref(`/users/${userId}`).once('value');
    if(!user){
      res.status(404).send('user not found');
      return;
    }

    // update the user with a new pair of lat and lng
    await db.ref(`/users/${userId}`).update({
      lat, lng
    });

    res.status(201).send('updated');
  }catch(err){
    next(err);
  }
});


 // let membersNotFound = [];
    // if(emails) {
    //   // get all uids of users(emails)
    //   let userIds = [];

    //   const snapshot = await db.ref('/users').orderByChild('email').once('value');
    //   const users = Object.values(snapshot.val());
    //   if(users){
    //     for(let email of emails){
    //       let found = false;

    //       finduser:
    //       for(let u of users){
    //         if(u.email === email){
    //           userIds.push(u.uid);
    //           found = true;
    //           break finduser;
    //         }
    //       }

    //       if(!found) membersNotFound.push(email);
    //     }
    //   }

    //   if(userIds.length > 0) tour.users = userIds;
    // }
