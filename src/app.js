const express = require('express');
const path = require('path');
require('dotenv').config();

// Initialize database connection
const db = require('./db/database');

// Import routes
const usersRoutes = require('./routes/users.routes');
const eventsRoutes = require('./routes/events.routes');
const authRoutes = require('./routes/auth.routes');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'REST API - Node.js & Express',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      events: '/api/events',
      auth: '/api/auth'
    },
    documentation: '/'
  });
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log(`Documentation available at http://localhost:${PORT}/`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other process or use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
