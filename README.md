# 🎬 Cinetra by NIKHIL

A modern, responsive movie discovery web application built with React and Node.js. Discover trending movies, explore popular films, and get detailed information about your favorite movies with a beautiful, cinematic user interface.

![Cinetra Banner](https://img.shields.io/badge/Cinetra-Movie%20Discovery-red?style=for-the-badge&logo=film&logoColor=white)

## ✨ Features

### 🎯 Core Features
- **Movie Discovery**: Browse trending, popular, and now playing movies
- **Detailed Movie Information**: Get comprehensive details about any movie
- **Search Functionality**: Find movies by title, genre, or keywords
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Beautiful themes for any viewing preference
- **Smooth Animations**: Cinematic animations powered by Framer Motion

### 📱 Mobile Optimizations
- **60% fewer animations** on mobile for better performance
- **Lazy loading** for movie cards and images
- **Touch-optimized** interface with proper button sizes
- **Hardware acceleration** for smooth scrolling
- **Adaptive animations** based on device capabilities
- **Performance monitoring** (development only)

### 🎨 Design Features
- **Glass morphism** UI elements
- **Gradient backgrounds** with animated overlays
- **Floating cinematic elements** (film reels, stars, etc.)
- **Modern typography** and spacing
- **Accessibility support** with reduced motion preferences

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API requests

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **TMDb API** - Movie data from The Movie Database

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Environment**: Production-ready with optimized builds

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- TMDb API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cinetra-by-nikhil.git
   cd cinetra-by-nikhil
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   echo "TMDB_API_KEY=your_api_key_here" > .env
   echo "TMDB_READ_ACCESS_TOKEN=your_read_access_token_here" >> .env
   echo "TMDB_BASE_URL=https://api.themoviedb.org/3" >> .env
   echo "PORT=5000" >> .env
   echo "NODE_ENV=development" >> .env
   echo "CLIENT_URL=http://localhost:5173" >> .env
   
   # Start server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000" > .env
   echo "VITE_DEBUG=true" >> .env
   
   # Start client
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
cinetra-by-nikhil/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── BackgroundElements.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieGrid.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Discover.jsx
│   │   │   └── MovieDetail.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── usePerformance.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx                  # Main App component
│   │   └── index.css                # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                          # Express backend
│   ├── controllers/                 # Route controllers
│   │   ├── movieController.js
│   │   ├── genreController.js
│   │   └── searchController.js
│   ├── routes/                      # API routes
│   │   ├── movies.js
│   │   ├── genres.js
│   │   └── search.js
│   ├── utils/                       # Utility functions
│   │   └── tmdb.js
│   ├── index.js                     # Server entry point
│   └── package.json
├── MOBILE_OPTIMIZATION_GUIDE.md     # Mobile optimization docs
└── README.md                        # This file
```

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_DEBUG=false
   ```
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables:
   ```
   TMDB_API_KEY=your_api_key
   TMDB_READ_ACCESS_TOKEN=your_token
   TMDB_BASE_URL=https://api.themoviedb.org/3
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
3. Deploy automatically on push to main branch

## 🎯 API Endpoints

### Movies
- `GET /api/movies/trending/:timeWindow` - Get trending movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/now-playing` - Get currently playing movies
- `GET /api/movies/:id` - Get movie details

### Search
- `GET /api/search/movies?query=searchTerm` - Search movies

### Genres
- `GET /api/genres` - Get all movie genres

### Health
- `GET /api/health` - Server health check

## 📱 Mobile Performance

This project includes comprehensive mobile optimizations:

- **Adaptive Animations**: Reduced complexity on mobile devices
- **Lazy Loading**: Components load only when visible
- **Hardware Acceleration**: Smooth animations with CSS transforms
- **Touch Optimization**: Proper touch targets and gestures
- **Performance Monitoring**: Real-time FPS and memory tracking (dev only)

See [MOBILE_OPTIMIZATION_GUIDE.md](./MOBILE_OPTIMIZATION_GUIDE.md) for detailed information.

## 🎨 Customization

### Themes
- Modify `src/index.css` for color schemes
- Update gradient backgrounds in CSS variables
- Customize glass morphism effects

### Components
- All components are modular and reusable
- Props-based configuration for flexibility
- Easy to extend with new features

### Performance
- Adjust animation durations in component variants
- Configure lazy loading thresholds
- Modify device breakpoints for responsive design

## 🛡️ Security

- **CORS**: Configured for production domains
- **Helmet**: Security headers for Express server
- **Environment Variables**: Sensitive data protection
- **Input Validation**: API request validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**NIKHIL NEGI**
- Email: [neginikhilsingh6@gmail.com](mailto:neginikhilsingh6@gmail.com)
- Portfolio: [Your Portfolio](https://nikhil-negi-portfolio.vercel.app)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/nikhil-negi-00566126a)

## 🐛 Issues & Support

If you encounter any issues or need support:

1. **Check the documentation** first (README.md and MOBILE_OPTIMIZATION_GUIDE.md)
2. **Search existing issues** in the GitHub repository
3. **Create a new issue** with detailed information
4. **Contact directly**: [neginikhilsingh6@gmail.com](mailto:neginikhilsingh6@gmail.com)

When reporting issues, please include:
- Operating system and browser version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or screen recordings (if applicable)
- Console error messages

## 🎉 Acknowledgments

- **TMDb API** for providing comprehensive movie data
- **React Team** for the amazing framework
- **Framer Motion** for beautiful animations
- **Tailwind CSS** for utility-first styling
- **Vercel & Render** for reliable hosting

---

**Made with ❤️ by NIKHIL NEGI**

*Discover amazing movies with Cinetra - Your gateway to cinematic excellence!*
