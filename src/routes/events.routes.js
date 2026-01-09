const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents
} = require('../controllers/events.controller');
const { validateEvent } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /api/events/search?query=...
router.get('/search', searchEvents);

// GET /api/events - Get all events (with pagination, search, sorting)
router.get('/', getAllEvents);

// GET /api/events/:id
router.get('/:id', getEventById);

// POST /api/events - Protected route
router.post('/', authenticateToken, validateEvent, createEvent);

// PUT /api/events/:id - Protected route
router.put('/:id', authenticateToken, validateEvent, updateEvent);

// DELETE /api/events/:id - Protected route
router.delete('/:id', authenticateToken, deleteEvent);

module.exports = router;
