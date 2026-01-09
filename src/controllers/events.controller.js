const db = require('../db/database');

// GET /api/events - Get all events with pagination, search, and sorting
const getAllEvents = async (req, res) => {
  try {
    let { limit, offset, sort, order, query } = req.query;

    // Default values for pagination
    limit = limit ? parseInt(limit) : 10;
    offset = offset ? parseInt(offset) : 0;

    // Validate limit and offset are numeric
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ error: 'limit and offset must be numeric' });
    }

    // Validate sort column (SQL injection prevention)
    const allowedSortColumns = ['id', 'title', 'start_date', 'end_date', 'location', 'user_id'];
    if (sort && !allowedSortColumns.includes(sort)) {
      return res.status(400).json({ error: `Invalid sort column. Allowed: ${allowedSortColumns.join(', ')}` });
    }

    // Default sort
    sort = sort || 'start_date';
    order = (order && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';

    // Build query
    let sql = `
      SELECT e.*, u.firstname, u.lastname, u.email as user_email
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
    `;
    const params = [];

    // Add search filter if query parameter exists
    if (query && query.trim() !== '') {
      sql += ' WHERE (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)';
      const searchPattern = `%${query.trim()}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Add sorting
    sql += ` ORDER BY e.${sort} ${order}`;

    // Add pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const events = await db.promisify.all(sql, params);

    // Get total count for pagination info
    let countSql = 'SELECT COUNT(*) as total FROM events';
    const countParams = [];
    if (query && query.trim() !== '') {
      countSql += ' WHERE (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      const searchPattern = `%${query.trim()}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }
    const countResult = await db.promisify.get(countSql, countParams);

    res.json({
      events,
      pagination: {
        limit,
        offset,
        total: countResult.total
      }
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/events/search?query=...
const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'query parameter is required' });
    }

    const searchPattern = `%${query.trim()}%`;
    const events = await db.promisify.all(
      `SELECT e.*, u.firstname, u.lastname, u.email as user_email
       FROM events e
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?
       ORDER BY e.start_date ASC`,
      [searchPattern, searchPattern, searchPattern]
    );

    res.json({ events, count: events.length });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/events/:id - Get event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.promisify.get(
      `SELECT e.*, u.firstname, u.lastname, u.email as user_email
       FROM events e
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.id = ?`,
      [id]
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/events - Create new event
const createEvent = async (req, res) => {
  try {
    const { title, description, start_date, end_date, location, user_id } = req.body;

    // Verify user exists
    const user = await db.promisify.get('SELECT id FROM users WHERE id = ?', [user_id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await db.promisify.run(
      'INSERT INTO events (title, description, start_date, end_date, location, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || null, start_date, end_date, location, user_id]
    );

    const event = await db.promisify.get(
      `SELECT e.*, u.firstname, u.lastname, u.email as user_email
       FROM events e
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.id = ?`,
      [result.lastID]
    );

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/events/:id - Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, location, user_id } = req.body;

    // Check if event exists
    const existingEvent = await db.promisify.get('SELECT id FROM events WHERE id = ?', [id]);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // If user_id is being updated, verify it exists
    if (user_id) {
      const user = await db.promisify.get('SELECT id FROM users WHERE id = ?', [user_id]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(start_date);
    }
    if (end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(end_date);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      values.push(location);
    }
    if (user_id !== undefined) {
      updates.push('user_id = ?');
      values.push(user_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE events SET ${updates.join(', ')} WHERE id = ?`;

    await db.promisify.run(sql, values);

    const updatedEvent = await db.promisify.get(
      `SELECT e.*, u.firstname, u.lastname, u.email as user_email
       FROM events e
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.id = ?`,
      [id]
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/events/:id - Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const event = await db.promisify.get('SELECT id FROM events WHERE id = ?', [id]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await db.promisify.run('DELETE FROM events WHERE id = ?', [id]);

    res.status(204).send();
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents
};
