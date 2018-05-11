const express = require('express');
const gallery = require('./gallery.js');
const Gallery = require('../db/models/Gallery.js');

const router = express.Router();


router.route('/').get((req, res) => {
  return Gallery.fetchAll({ withRelated: ['poster'] })
    .then(gallery => {
      if (gallery === null) throw new Error('Something up');
      gallery = gallery.toJSON();
      return res.render('index', { gallery })
    })
    .catch(err => {
      return res.json(err);
    });
});




router.use('/gallery', gallery);

module.exports = router;
