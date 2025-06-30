const express = require('express');
const router = express.Router();
const {
  getTrending,
  getPopular,
  getNowPlaying,
  getUpcoming,
  getMovieDetails,
  discoverMovies
} = require('../controllers/movieController');

// GET /api/movies/trending
router.get('/trending', getTrending);

// GET /api/movies/popular
router.get('/popular', getPopular);

// GET /api/movies/now-playing
router.get('/now-playing', getNowPlaying);

// GET /api/movies/upcoming
router.get('/upcoming', getUpcoming);

// GET /api/movies/discover
router.get('/discover', discoverMovies);

// GET /api/movies/:id
router.get('/:id', getMovieDetails);

module.exports = router;