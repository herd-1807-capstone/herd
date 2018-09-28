const router = require('express').Router()
const db = require('../db')
module.exports = router;

// GET
router.get('/:tourId', async(req, res, next) => {
  const tourId = req.params.tourId;
  try{
    await db.ref(`/tours/${tourId}`).once('value').then(snapshot => {
      res.json(snapshot);
    });
  }catch(err){
    console.log(err);
  }
})

// POST
router.post('/XXX', async(req, res, next) => {

})

// PUT
router.put('/XXX', async(req, res, next) => {

})

// DELETE
router.delete('/XXX', async(req, res, next) => {

})
