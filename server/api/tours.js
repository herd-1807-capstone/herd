const db = require('../db')
const firebase = require('firebase')
const router = require('express').Router()
module.exports = router;

// GET /tours/:tourId
router.get('/:tourId', async(req, res, next) => {
  try{
    const user = req.authUser;
    const tourId = req.params.tourId;

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
    const authUser = req.authUser;
    // make sure the current user is an admin
    if(authUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    const tour = {
      name,
      guideUId: authUser.uid
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
    const currUser = req.authUser;
    if(currUser.status !== 'admin'){
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

    const user = req.authUser;
    if(user.status !== 'admin'){
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

// add a new spot to a tour
router.post('/:tourId/spots', async(req, res, next) => {
  const tourId = req.params.tourId;
  try{
    const currUser = req.authUser;
    if(currUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    const {description, lat, lng, name} = req.body;
    const spot = {description, lat, lng, name};
    const spotAdded = await db.ref(`/tours/${tourId}/spots`).push(spot);

    res.json({key: spotAdded.key});
  }catch(err){
    next(err);
  }
});

// update spot details of a tour
router.put('/:tourId/spots/:spotId', async(req, res, next) => {
  const {tourId, spotId} = req.params;
  try{
    const currUser = req.authUser;
    if(currUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    const {description, lat, lng, name} = req.body;
    const spot = {description, lat, lng, name};
    const spotUpdated = await db.ref(`/tours/${tourId}/spots/${spotId}`).update(spot);

    res.json(201).send();
  }catch(err){
    next(err);
  }
});

// delete a spot from a tour
router.delete('/:tourId/spots/:spotId', async(req, res, next) => {
  const {tourId, spotId} = req.params;
  try{
    const currUser = req.authUser;
    if(currUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    await db.ref(`/tours/${tourId}/spots/${spotId}`).remove();
    res.status(201);
  }catch(err){
    next(err);
  }
});

// add a new member i.e., userId to a tour
router.post('/:tourId/users', async(req, res, next) => {
  try{
    const currUser = req.authUser;
    if(currUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    // First, get the list of userIds of a tour
    const {userId} = req.body;

    const tourSnapshot = await db.ref(`/tours/${tourId}`).once('value');
    const tour = tourSnapshot.val();
    const users = tour.users;
    // check if current user is either an admin of this tour or a member.
    if(users.indexOf(user.uid) < 0){
      res.status(403).send('forbidden');
      return;
    }
    users.push(userId);

    await db.ref(`/tours/${tourId}`).update({users});
    res.status(201);
  }catch(err){
    next(err);
  }
});

// delete a user id from a tour
router.delete('/:tourId/users/:userId', async(req, res, next) => {
  try{
    const currUser = req.authUser;
    if(currUser.status !== 'admin'){
      res.status(403).send('forbidden');
      return;
    }

    // First, get the list of userIds of a tour
    const {userId} = req.body;
    const tourSnapshot = await db.ref(`/tours/${tourId}`).once('value');
    const tour = tourSnapshot.val();
    let users = tour.users;
    // check if current user is either an admin of this tour or a member.
    if(users.indexOf(user.uid) < 0){
      res.status(403).send('forbidden');
      return;
    }

    // remove the userId from users
    users = users.filter(user => user !== userId);

    // update the tour with the new list of users.
    await db.ref(`/tours/${tourId}`).update({users});
    res.status(201);

  }catch(err){
    next(err);
  }
})

// PUT /tours/:tourId/users/:userId - updates user's location i.e., lat and lng of a User instance in db.
router.put('/:tourId/users/:userId', async (req, res, next) => {
  const {tourId, userId} = req.params;
  const {lat, lng} = req.body;
  try{
    const loggedInUser = req.authUser;

    const tourSnapshot = await db.ref(`/tours/${tourId}`).once('value');
    const tour = tourSnapshot.val();
    if(!tour){
      res.status(404).send('tour not found');
      return;
    }

    if(tour.users.indexOf(loggedInUser.uid) < 0){
      res.status(403).send('forbidden');
      return;
    }

    const userSnapshot = await db.ref(`/users/${userId}`).once('value');
    const user = userSnapshot.val();
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
