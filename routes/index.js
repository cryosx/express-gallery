const express = require('express');
const gallery = require('./gallery.js');
const Gallery = require('../db/models/Gallery.js');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../db/models/User.js')

const router = express.Router();


router.route('/').get((req, res) => {
  return Gallery.fetchAll()
    .then(gallery => {
      let galleries = gallery.models.map(val => {
        return val.attributes
      })
      return res.render('index', { gallery: galleries })
      // return res.json(gallery);
    })
    .catch(err => {
      return res.json(err);
    });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else { res.redirect('/'); }
};


router.use('/gallery', isAuthenticated, gallery);

module.exports = router;
