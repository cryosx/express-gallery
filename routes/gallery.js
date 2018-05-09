const express = require('express');

const knex = require('../db/knex.js');
const Gallery = require('../db/models/Gallery.js');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    return res.json({ message: 'smoke test' });
  })
  .post((req, res) => {
    const { user } = req.session.passport
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

router.route('/new').get((req, res) => {
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
  .put((req, res) => {
    const { user } = req.session.passport
    const { id } = req.params;

    if (!isAuthorized(user, id)) return res.status(401).redirect('/');

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
  .delete((req, res) => {
    const { user } = req.session.passport
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
  .get((req, res) => {
    const { id } = req.params;
    return new Gallery({ id })
      .fetch()
      .then(gallery => {
        if (gallery === null) return res.render('404', {});

        const { user } = req.session.passport
        if (!isAuthorized(user, id)) return res.status(401).render('401', {});

        return res.render('gallery/edit', {});

      }).catch(err => {
        console.log(err);
        return res.resdirect('');
      });


  });

function isAuthorized(sessionUser, galleryID) {
  return new Gallery()
    .where({ id: galleryID })
    .fetch()
    .then(gallery => {
      if (gallery === null) return false;
      return sessionUser.id === gallery.user_id;
    })
    .catch(err => {
      console.log(err);
      return false;
    });

}

module.exports = router;
