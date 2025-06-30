const { tmdbRequest, getPosterUrl, getBackdropUrl } = require('../utils/tmdb');

// Get trending movies
const getTrending = async (req, res) => {
  try {
    const { timeWindow = 'week' } = req.query;
    const data = await tmdbRequest(`/trending/movie/${timeWindow}`);
    
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
      popularity: movie.popularity
    }));

    res.json({
      success: true,
      data: {
        movies,
        totalResults: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get popular movies
const getPopular = async (req, res) => {
  try {
    const { page = 1, region } = req.query;
    const params = { page };
    if (region) params.region = region;

    const data = await tmdbRequest('/movie/popular', params);
    
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
      popularity: movie.popularity
    }));

    res.json({
      success: true,
      data: {
        movies,
        totalResults: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get now playing movies
const getNowPlaying = async (req, res) => {
  try {
    const { page = 1, region } = req.query;
    const params = { page };
    if (region) params.region = region;

    const data = await tmdbRequest('/movie/now_playing', params);
    
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
      popularity: movie.popularity
    }));

    res.json({
      success: true,
      data: {
        movies,
        totalResults: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get upcoming movies
const getUpcoming = async (req, res) => {
  try {
    const { page = 1, region } = req.query;
    const params = { page };
    if (region) params.region = region;

    const data = await tmdbRequest('/movie/upcoming', params);
    
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
      popularity: movie.popularity
    }));

    res.json({
      success: true,
      data: {
        movies,
        totalResults: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get movie details
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbRequest(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,watch/providers'
    });

    const movie = {
      id: data.id,
      title: data.title,
      overview: data.overview,
      releaseDate: data.release_date,
      runtime: data.runtime,
      rating: data.vote_average,
      voteCount: data.vote_count,
      poster: getPosterUrl(data.poster_path),
      backdrop: getBackdropUrl(data.backdrop_path),
      genres: data.genres,
      cast: data.credits?.cast?.slice(0, 10).map(person => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profilePath: getPosterUrl(person.profile_path, 'w185')
      })) || [],
      director: data.credits?.crew?.find(person => person.job === 'Director'),
      videos: data.videos?.results?.filter(video => 
        video.site === 'YouTube' && video.type === 'Trailer'
      ) || [],
      similar: data.similar?.results?.slice(0, 12).map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: getPosterUrl(movie.poster_path),
        rating: movie.vote_average,
        releaseDate: movie.release_date
      })) || [],
      watchProviders: data['watch/providers']?.results || {},
      budget: data.budget,
      revenue: data.revenue,
      status: data.status,
      tagline: data.tagline,
      homepage: data.homepage,
      imdbId: data.imdb_id,
      originalLanguage: data.original_language,
      originalTitle: data.original_title,
      popularity: data.popularity,
      productionCompanies: data.production_companies,
      productionCountries: data.production_countries,
      spokenLanguages: data.spoken_languages
    };

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Discover movies with filters
const discoverMovies = async (req, res) => {
  try {
    const {
      page = 1,
      genre,
      year,
      minRating,
      maxRating,
      sortBy = 'popularity.desc',
      language,
      region,
      withWatchProviders,
      watchRegion
    } = req.query;

    const params = {
      page,
      sort_by: sortBy
    };

    if (genre) params.with_genres = genre;
    if (year) params.year = year;
    if (minRating) params['vote_average.gte'] = minRating;
    if (maxRating) params['vote_average.lte'] = maxRating;
    if (language) params.with_original_language = language;
    if (region) params.region = region;
    if (withWatchProviders) params.with_watch_providers = withWatchProviders;
    if (watchRegion) params.watch_region = watchRegion;

    const data = await tmdbRequest('/discover/movie', params);
    
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
      popularity: movie.popularity
    }));

    res.json({
      success: true,
      data: {
        movies,
        totalResults: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page
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
  getTrending,
  getPopular,
  getNowPlaying,
  getUpcoming,
  getMovieDetails,
  discoverMovies
};