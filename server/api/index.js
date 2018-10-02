const router = require('express').Router();
module.exports = router;

router.use('/tours', require('./tours'));
router.use('/users', require('./users'));
router.use('/spots', require('./spots'));
router.use('/chat', require('./messages'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
