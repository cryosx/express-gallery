const express = require('express');
const router = express.Router();
const Gallery = require('../db/models/Gallery.js');

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
        return res.redirect('gallery-list');
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })

router.route('/new').get((req, res) => {
  res.render('new-photo');
});

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

router.route('/:id/edit').get((req, res) => {
  return res.render('gallery/edit', {});
});

module.exports = router;
