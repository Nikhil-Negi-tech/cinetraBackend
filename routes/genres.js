const express = require('express');
const router = express.Router();
const { getGenres } = require('../controllers/genreController');

// GET /api/genres
router.get('/', getGenres);

module.exports = router;