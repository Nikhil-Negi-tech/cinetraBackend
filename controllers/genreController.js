const { tmdbRequest } = require('../utils/tmdb');

// Get all movie genres
const getGenres = async (req, res) => {
  try {
    const { language = 'en-US' } = req.query;
    const data = await tmdbRequest('/genre/movie/list', { language });

    res.json({
      success: true,
      data: data.genres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getGenres
};