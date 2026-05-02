const UserMovieLike = require('../models/UserMovieLike');
const { tmdbRequest } = require('../utils/tmdb');

// @route   POST /api/users/likes
// @desc    Add or update a movie like
// @access  Private
exports.addMovieLike = async (req, res) => {
  try {
    const { movieId, movieTitle, genres, rating, posterPath } = req.body;
    const userId = req.user.id;

    if (!movieId || !movieTitle) {
      return res.status(400).json({
        success: false,
        error: 'Movie ID and title are required'
      });
    }

    let like = await UserMovieLike.findOne({ userId, movieId });

    if (like) {
      // Update existing like
      like.rating = rating || like.rating;
      like.liked = true;
      await like.save();
    } else {
      // Create new like
      like = await UserMovieLike.create({
        userId,
        movieId,
        movieTitle,
        genres: genres || [],
        rating,
        posterPath
      });
    }

    res.status(200).json({
      success: true,
      data: like
    });
  } catch (error) {
    console.error('Add Like Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @route   DELETE /api/users/likes/:movieId
// @desc    Remove a movie like
// @access  Private
exports.removeMovieLike = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    await UserMovieLike.findOneAndDelete({ userId, movieId });

    res.status(200).json({
      success: true,
      message: 'Movie removed from likes'
    });
  } catch (error) {
    console.error('Remove Like Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @route   GET /api/users/likes
// @desc    Get user's liked movies
// @access  Private
exports.getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const likes = await UserMovieLike.find({ userId, liked: true })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: likes
    });
  } catch (error) {
    console.error('Get Likes Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @route   GET /api/users/recommendations
// @desc    Get personalized movie recommendations using collaborative filtering
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;

    // Get user's liked movies with genres
    const userLikes = await UserMovieLike.find({ userId, liked: true });

    if (userLikes.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No likes found. Showing random popular movies.'
      });
    }

    // Extract genres from user's likes
    const genreMap = {};
    userLikes.forEach(like => {
      if (like.genres && Array.isArray(like.genres)) {
        like.genres.forEach(genre => {
          genreMap[genre.id] = (genreMap[genre.id] || 0) + 1;
        });
      }
    });

    // Get top genres (sorted by frequency)
    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genreId]) => parseInt(genreId));

    if (topGenres.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No genres found'
      });
    }

    // Fetch movies from top genres from TMDB
    const recommendations = [];
    const movieIds = new Set(userLikes.map(l => l.movieId));

    for (const genreId of topGenres) {
      try {
        const response = await tmdbRequest('/discover/movie', {
          with_genres: genreId,
          sort_by: 'popularity.desc',
          page: 1
        });

        // Filter out already liked movies
        response.results.forEach(movie => {
          if (!movieIds.has(movie.id) && recommendations.length < limit) {
            recommendations.push(movie);
            movieIds.add(movie.id);
          }
        });

        if (recommendations.length >= limit) break;
      } catch (error) {
        console.error(`Error fetching movies for genre ${genreId}:`, error);
      }
    }

    res.status(200).json({
      success: true,
      data: recommendations,
      genresUsed: topGenres
    });
  } catch (error) {
    console.error('Get Recommendations Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @route   GET /api/users/recommendations/trending
// @desc    Get trending movies in user's preferred genres
// @access  Private
exports.getTrendingRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get user's liked movies with genres
    const userLikes = await UserMovieLike.find({ userId, liked: true });

    if (userLikes.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No likes found'
      });
    }

    // Extract top genre
    const genreMap = {};
    userLikes.forEach(like => {
      if (like.genres && Array.isArray(like.genres)) {
        like.genres.forEach(genre => {
          genreMap[genre.id] = (genreMap[genre.id] || 0) + 1;
        });
      }
    });

    const topGenre = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])[0];

    if (!topGenre) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No genres found'
      });
    }

    // Fetch trending movies in top genre
    const response = await tmdbRequest('/discover/movie', {
      with_genres: topGenre[0],
      sort_by: 'popularity.desc',
      page: 1
    });

    const movieIds = new Set(userLikes.map(l => l.movieId));
    const trending = response.results
      .filter(movie => !movieIds.has(movie.id))
      .slice(0, limit);

    res.status(200).json({
      success: true,
      data: trending,
      genre: topGenre[0]
    });
  } catch (error) {
    console.error('Get Trending Recommendations Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};
