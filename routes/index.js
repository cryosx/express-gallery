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

router.route('/register')
  .get((req, res) => {
    return res.redirect('register.html');
  })
  .post((req, res) => {
    console.log(req.body)
    return new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).save()
      .then((user) => {
        console.log(user);
        return res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
        return res.send('Stupid email');
      });
  });



router.route('/login').get((req, res) => {

}).post(passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/'
}));

router.get('/logout', (req, res) => {
  req.logout();
  return res.sendStatus(200);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { next(); }
  else { res.redirect('/'); }
};

router.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user id', req.user.id);
  console.log('req.username', req.user.username);
  res.send('you found the secret!');
});


router.use('/gallery', isAuthenticated, gallery);

module.exports = router;
