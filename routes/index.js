const express = require('express');
const gallery = require('./gallery.js');

const router = express.Router();

router.use('/gallery', gallery);

module.exports = router;
