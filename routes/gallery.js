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
});

module.exports = router; 