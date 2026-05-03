const UserMovieLike = require('../models/UserMovieLike');
const { tmdbRequest } = require('../utils/tmdb');

// @route   POST /api/users/likes
// @desc    Add or update a movie like
// @access  Private
exports.addMovieLike = async (req, res) => {
  try {
    let { movieId, movieTitle, genres, rating, posterPath } = req.body;
    const userId = req.user.id;

    console.log('📝 Like request received:', { userId, movieId, movieTitle, genres, rating, posterPath });

    if (!movieId || !movieTitle) {
      return res.status(400).json({
        success: false,
        error: 'Movie ID and title are required'
      });
    }

    // If genres are empty, fetch movie details from TMDB to get genre_ids
    if (!genres || genres.length === 0) {
      try {
        console.log('🔄 Fetching movie details from TMDB for genre info...');
        const movieDetails = await tmdbRequest(`/movie/${movieId}`);
        
        // TMDB /movie/:id returns 'genres' as array of objects {id, name}
        if (movieDetails.genres && Array.isArray(movieDetails.genres)) {
          genres = movieDetails.genres.map(g => ({
            id: g.id,
            name: g.name
          }));
        } else {
          genres = [];
        }
        
        console.log('✅ Genres resolved from TMDB movie details:', genres);
      } catch (error) {
        console.error('⚠️ Could not fetch genres from TMDB:', error.message);
        genres = [];
      }
    }


    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID not found in token'
      });
    }

    let like = await UserMovieLike.findOne({ userId, movieId });

    if (like) {
      // Update existing like
      like.rating = rating || like.rating;
      like.liked = true;
      like.watchedAt = new Date();
      await like.save();
      console.log('✅ Like updated:', like._id);
    } else {
      // Create new like
      like = await UserMovieLike.create({
        userId,
        movieId,
        movieTitle,
        genres: genres || [],
        rating,
        posterPath,
        liked: true
      });
      console.log('✅ Like created:', like._id);
    }

    res.status(200).json({
      success: true,
      data: like
    });
  } catch (error) {
    console.error('❌ Add Like Error:', error);
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
    console.log('📚 Fetching likes for user:', userId);
    
    const likes = await UserMovieLike.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`✅ Found ${likes.length} likes for user`);
    res.status(200).json({
      success: true,
      data: likes
    });
  } catch (error) {
    console.error('❌ Get Likes Error:', error);
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

    console.log('🎯 Getting recommendations for user:', userId);

    // Get user's liked movies with genres
    let userLikes = await UserMovieLike.find({ userId });

    console.log(`📊 User has ${userLikes.length} likes`);

    if (userLikes.length === 0) {
      console.log('⚠️ No likes found, returning empty recommendations');
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No likes found. Like some movies first!'
      });
    }

    // Fetch genres for any likes that are missing them
    for (let like of userLikes) {
      if (!like.genres || like.genres.length === 0) {
        try {
          console.log(`🔄 Fetching genres for movie ${like.movieId}: ${like.movieTitle}`);
          const movieDetails = await tmdbRequest(`/movie/${like.movieId}`);
          
          // TMDB /movie/:id returns 'genres' as array of objects {id, name}
          if (movieDetails.genres && Array.isArray(movieDetails.genres)) {
            like.genres = movieDetails.genres.map(g => ({
              id: g.id,
              name: g.name
            }));
          } else {
            like.genres = [];
          }
          
          // Update in database
          await UserMovieLike.updateOne(
            { _id: like._id },
            { genres: like.genres }
          );
          
          console.log(`✅ Genres updated for ${like.movieTitle}:`, like.genres);
        } catch (error) {
          console.error(`⚠️ Could not fetch genres for movie ${like.movieId}:`, error.message);
        }
      }
    }

    // Extract genres from user's likes
    const genreMap = {};
    userLikes.forEach(like => {
      console.log(`📽️ Like: ${like.movieTitle}`, { genres: like.genres, count: like.genres?.length });
      
      if (like.genres && Array.isArray(like.genres) && like.genres.length > 0) {
        like.genres.forEach(genre => {
          // Handle both {id, name} objects and plain numbers
          const genreId = genre?.id || genre;
          if (genreId) {
            genreMap[genreId] = (genreMap[genreId] || 0) + 1;
          }
        });
      }
    });

    console.log('📊 Genre map:', genreMap);
    console.log('🎬 Genre IDs found:', Object.keys(genreMap));

    // Get top 5 genres (sorted by frequency) for better variety
    const allGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1]);
    
    const topGenres = allGenres.slice(0, 5).map(([genreId]) => parseInt(genreId));
    const secondaryGenres = allGenres.slice(5, 10).map(([genreId]) => parseInt(genreId));

    console.log('⭐ Top 5 genres by frequency:', topGenres);
    console.log('🎯 Secondary genres for diversity:', secondaryGenres);

    if (topGenres.length === 0) {
      console.log('⚠️ No genres extracted from likes');
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No genres found in your likes'
      });
    }

    // Calculate average rating from user's likes
    const avgRating = userLikes.reduce((sum, like) => sum + (like.rating || 0), 0) / userLikes.length || 0;
    console.log(`📊 User average rating: ${avgRating.toFixed(2)}`);

    // Fetch movies from top genres from TMDB with multiple sort methods
    const recommendations = [];
    const movieIds = new Set(userLikes.map(l => l.movieId));
    
    const genresToFetch = [...topGenres, ...secondaryGenres];
    const sortMethods = ['popularity.desc', 'rating.desc', 'revenue.desc'];
    let sortIndex = 0;

    console.log('🚀 Fetching recommendations with improved diversity logic');
    console.log('🔒 Excluding user-liked movies:', Array.from(movieIds).slice(0, 5), '...');

    // Fetch from multiple pages and sort methods for variety
    for (const genreId of genresToFetch) {
      for (let page = 1; page <= 2 && recommendations.length < limit; page++) {
        try {
          const sortBy = sortMethods[sortIndex % sortMethods.length];
          sortIndex++;
          
          console.log(`📡 Fetching genre ${genreId}, page ${page}, sort: ${sortBy}...`);
          const response = await tmdbRequest('/discover/movie', {
            with_genres: genreId,
            sort_by: sortBy,
            'vote_average.gte': avgRating > 0 ? avgRating - 1 : 4, // Similar rating range
            page: page
          });

          console.log(`✅ Got ${response.results?.length || 0} results`);

          // Filter out already liked movies and add diversity
          response.results.forEach(movie => {
            if (!movieIds.has(movie.id) && recommendations.length < limit) {
              // Bonus: slightly prefer movies with ratings close to user's average
              movie.relevanceScore = Math.abs(movie.vote_average - (avgRating + 6)) < 2 ? 1.5 : 1;
              recommendations.push(movie);
              movieIds.add(movie.id);
            }
          });

        } catch (error) {
          console.error(`⚠️ Error fetching movies for genre ${genreId}, page ${page}:`, error.message);
        }
      }
    }

    // Sort by relevance score and randomize slightly for variety
    recommendations.sort(() => Math.random() - 0.5);

    console.log(`🎬 Final recommendations count: ${recommendations.length}`);
    res.status(200).json({
      success: true,
      data: recommendations.slice(0, limit),
      genresUsed: topGenres,
      secondaryGenresUsed: secondaryGenres,
      avgUserRating: avgRating.toFixed(2),
      recommendationCount: Math.min(recommendations.length, limit)
    });
  } catch (error) {
    console.error('❌ Get Recommendations Error:', error);
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
    const userLikes = await UserMovieLike.find({ userId });

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
