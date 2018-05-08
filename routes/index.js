const express = require('express');
const gallery = require('./gallery.js');
const Gallery = require('../db/models/Gallery.js');
const router = express.Router();

router.route('/').get((req, res) => {
  return Gallery.fetchAll()
    .then(gallery => {
      console.log(gallery);
      
      return res.json(gallery);
    })
    .catch(err => {
      return res.json(err);
    });
});

router.use('/gallery', gallery);

module.exports = router;
