const express = require('express');

const router = express.Router();


router.route('/')
.get((req, res) => {
  return res.json({ message: 'smoke test'});
})
.post((req, res) => {
  
})

router.route('/new')
.get((req, res) => {
  res.render('new-photo');


router.route('/:id').get((req, res) => {
  const { id } = req.params;
  return new Gallery()
    .where({ id })
    .fetch()
    .then(gallery => {
      if (!gallery) {
        throw new Error('Gallery photo not found');
      }
      return res.json(gallery);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

module.exports = router;
