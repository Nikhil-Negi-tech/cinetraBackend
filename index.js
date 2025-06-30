const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Load environment variables from server/.env
const envPath = path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });

// Ensure environment variables are set (fallback if dotenv fails)
if (!process.env.TMDB_READ_ACCESS_TOKEN) {
  process.env.TMDB_API_KEY = '885acc9549720e0efb41593a191b192e';
  process.env.TMDB_READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODVhY2M5NTQ5NzIwZTBlZmI0MTU5M2ExOTFiMTkyZSIsIm5iZiI6MTc1MTE2NTg3NC40NjgsInN1YiI6IjY4NjBhYmIyZDI3NmZkZmYzZDRkMWFhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rX1r-eX9L_H_2FJxEaeXD57otRZC_RY3CtNvIRy6KVY';
  process.env.TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  process.env.PORT = '5000';
  process.env.NODE_ENV = 'development';
  process.env.CLIENT_URL = 'http://localhost:5173';
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/movies', require('./routes/movies'));
app.use('/api/genres', require('./routes/genres'));
app.use('/api/search', require('./routes/search'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cinetra API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🎬 Cinetra server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 TMDb API configured: ${process.env.TMDB_READ_ACCESS_TOKEN ? 'Yes' : 'No'}`);
});