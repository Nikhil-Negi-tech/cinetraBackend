const { tmdbRequest, getPosterUrl, getBackdropUrl } = require('../utils/tmdb');

// Search movies
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1, includeAdult = false, language = 'en-US', region, year } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const params = {
      query,
      page,
      include_adult: includeAdult,
      language
    };

    if (region) params.region = region;
    if (year) params.year = year;

    const data = await tmdbRequest('/search/movie', params);
    
    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      poster: getPosterUrl(movie.poster_path),
      backdrop: getBackdropUrl(movie.backdrop_path),
      genreIds: movie.genre_ids,
      popularity: movie.popularity,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      adult: movie.adult
    }));

    res.json({
      success: true,
      data: {
        movies,
        totalResults: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page,
        query: query
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Search multi (movies, TV shows, people)
const searchMulti = async (req, res) => {
  try {
    const { query, page = 1, includeAdult = false, language = 'en-US' } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const params = {
      query,
      page,
      include_adult: includeAdult,
      language
    };

    const data = await tmdbRequest('/search/multi', params);
    
    const results = data.results.map(item => {
      const baseItem = {
        id: item.id,
        mediaType: item.media_type,
        popularity: item.popularity,
        overview: item.overview,
        poster: getPosterUrl(item.poster_path),
        backdrop: getBackdropUrl(item.backdrop_path)
      };

      if (item.media_type === 'movie') {
        return {
          ...baseItem,
          title: item.title,
          releaseDate: item.release_date,
          rating: item.vote_average,
          voteCount: item.vote_count,
          genreIds: item.genre_ids,
          originalTitle: item.original_title,
          originalLanguage: item.original_language,
          adult: item.adult
        };
      } else if (item.media_type === 'tv') {
        return {
          ...baseItem,
          name: item.name,
          firstAirDate: item.first_air_date,
          rating: item.vote_average,
          voteCount: item.vote_count,
          genreIds: item.genre_ids,
          originalName: item.original_name,
          originalLanguage: item.original_language,
          originCountry: item.origin_country
        };
      } else if (item.media_type === 'person') {
        return {
          ...baseItem,
          name: item.name,
          profilePath: getPosterUrl(item.profile_path, 'w185'),
          knownFor: item.known_for,
          knownForDepartment: item.known_for_department,
          adult: item.adult
        };
      }

      return baseItem;
    });

    res.json({
      success: true,
      data: {
        results,
        totalResults: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page,
        query: query
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  searchMovies,
  searchMulti
};