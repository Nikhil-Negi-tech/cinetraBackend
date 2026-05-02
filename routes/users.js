const express = require('express');
const router = express.Router();
const {
  addMovieLike,
  removeMovieLike,
  getUserLikes,
  getRecommendations,
  getTrendingRecommendations
} = require('../controllers/userController');
const protect = require('../middleware/auth');

// All routes are protected
router.use(protect);

// POST /api/users/likes
router.post('/likes', addMovieLike);

// DELETE /api/users/likes/:movieId
router.delete('/likes/:movieId', removeMovieLike);

// GET /api/users/likes
router.get('/likes', getUserLikes);

// GET /api/users/recommendations
router.get('/recommendations', getRecommendations);

// GET /api/users/recommendations/trending
router.get('/recommendations/trending', getTrendingRecommendations);

module.exports = router;
