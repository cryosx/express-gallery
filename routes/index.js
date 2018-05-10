const express = require('express');
const gallery = require('./gallery.js');
const Gallery = require('../db/models/Gallery.js');

const router = express.Router();


router.route('/').get((req, res) => {
  return Gallery.fetchAll({ withRelated: ['poster'] })
    .then(gallery => {
      console.log(gallery.toJSON());
      gallery = gallery.toJSON();
      // let galleries = gallery.models.map(val => {
      //   return val.attributes
      // })
      return res.render('index', { gallery })
    })
    .catch(err => {
      return res.json(err);
    });
});




router.use('/gallery', gallery);

module.exports = router;
