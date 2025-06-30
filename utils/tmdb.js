const axios = require('axios');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

// Create axios instance for TMDB API
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Make request to TMDB API
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await tmdbClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.status_message || 'Failed to fetch data from TMDB');
  }
};

// Get poster URL with size
const getPosterUrl = (posterPath, size = 'w500') => {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};

// Get backdrop URL with size
const getBackdropUrl = (backdropPath, size = 'w1280') => {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
};

// Get profile URL with size
const getProfileUrl = (profilePath, size = 'w185') => {
  if (!profilePath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`;
};

module.exports = {
  tmdbRequest,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL
};
