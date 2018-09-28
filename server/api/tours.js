const router = require('express').Router()
const db = require('../db')
const firebase = require('firebase')
module.exports = router;

// GET
router.get('/:tourId', async(req, res, next) => {
  const tourId = req.params.tourId;
  try{
    await db.ref(`/tours/${tourId}`).once('value').then(snapshot => {
      res.json(snapshot);
      console.log(firebase.auth().currentUser)
    });
  }catch(err){
    console.log(err);
  }
})

// POST
router.post('/:tourName', async(req, res, next) => {
  const tourName = req.params.tourName;
  db.ref(`/tours/`).push({
    tourName: tourName,
    spots: {},
    users: {"4GDfXiHKt1Pf5VbKGuqsR2bU9pl2" : {
      "email" : "anpoon430@gmail.com",
      "name" : "andy poon"
    }
  },
  })
})

// PUT
router.put('/XXX', async(req, res, next) => {

})

// DELETE
router.delete('/XXX', async(req, res, next) => {

})
