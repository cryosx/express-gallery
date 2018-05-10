const express = require('express');

const knex = require('../db/knex.js');
const Gallery = require('../db/models/Gallery.js');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    return res.json({ message: 'smoke test' });
  })
  .post(isAuthenticated, (req, res) => {
    const { user } = req
    let { author, link, description } = req.body;
    author = author.trim();
    link = link.trim();
    return new Gallery({ author, link, description, user_id: user.id })
      .save()
      .then(gallery => {
        return res.redirect('../');
      })
      .catch(err => {
        return res.status(500).json({ message: err.message });
      });
  });

router.route('/new')
  .get(isAuthenticated, (req, res) => {
    console.log('NEW');
    return res.render('gallery/new');
  });

router
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    return Gallery.query(function (qb) {
      qb.where('id', '>=', id).limit(4)
    }).fetchAll()
      .then(gallery => {
        if (gallery.length === 0) {
          return res.render('404', {});
          // throw new Error('Gallery photo not found');
        }
        gallery = gallery.models.map(val => {
          return val.attributes
        })
        return res.render('gallery-entry', { gallery })
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  })
  .put(isAuthorized, (req, res) => {
    const { id } = req.params;
    const { author, link, description } = req.body;

    return new Gallery()
      .where({ id })
      .save({ author, link, description }, { method: 'update' })
      .then(gallery => {
        return res.redirect(`/gallery/${id}`);
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  })
  .delete(isAuthorized, (req, res) => {
    console.log('\n\n\nDELETE\n\n\n');
    const { id } = req.params;

    return new Gallery({ id })
      .destroy()
      .then(gallery => {
        return res.redirect(`../`);
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  });
router.route('/:id/edit')
  .get(isAuthorized, (req, res) => {
    const { id } = req.params;
    return new Gallery({ id })
      .fetch()
      .then(gallery => {
        if (gallery === null) return res.render('404', {});

        return res.render('gallery/edit', {});

      }).catch(err => {
        console.log(err);
        return res.resdirect('');
      });


  });

function isAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) return res.redirect('/');
  return next();
};

function isAuthorized(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect('/');

  const { user } = req;
  const { id } = req.params;

  return new Gallery()
    .where({ id })
    .fetch()
    .then(gallery => {
      if (gallery === null) return res.status(404).render('404', {});
      gallery = gallery.toJSON();
      if (user.id !== gallery.user_id) return res.status(401).render('401', {});
      return next();
    })
    .catch(err => {
      console.log(err);
      return next();
    });
}

module.exports = router;
