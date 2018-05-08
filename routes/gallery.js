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
    let { author, link, description } = req.body;
    author = author.trim();
    link = link.trim();
    return new Gallery({ author, link, description })
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
  })
  .put((req, res) => {
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
  .delete((req, res) => {
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

router.route('/:id/edit').get((req, res) => {
  return res.render('gallery/edit', {});
});

module.exports = router;
