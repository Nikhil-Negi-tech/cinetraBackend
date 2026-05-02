const mongoose = require('mongoose');

const UserMovieLikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true // TMDB movie ID
  },
  movieTitle: {
    type: String,
    required: true
  },
  genres: [{
    id: Number,
    name: String
  }],
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  posterPath: String,
  liked: {
    type: Boolean,
    default: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster queries
UserMovieLikeSchema.index({ userId: 1, movieId: 1 }, { unique: true });
UserMovieLikeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('UserMovieLike', UserMovieLikeSchema);
