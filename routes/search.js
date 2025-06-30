const express = require('express');
const router = express.Router();
const { searchMovies, searchMulti } = require('../controllers/searchController');

// GET /api/search/movies
router.get('/movies', searchMovies);

// GET /api/search/multi
router.get('/multi', searchMulti);

module.exports = router;