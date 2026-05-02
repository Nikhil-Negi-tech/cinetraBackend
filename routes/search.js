const express = require('express');
const router = express.Router();
const { searchMovies, searchMulti, searchSuggestions } = require('../controllers/searchController');

// GET /api/search/movies
router.get('/movies', searchMovies);

// GET /api/search/multi
router.get('/multi', searchMulti);

// GET /api/search/suggestions
router.get('/suggestions', searchSuggestions);

module.exports = router;