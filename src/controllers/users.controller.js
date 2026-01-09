const db = require('../db/database');

// GET /api/users - Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await db.promisify.all(
      'SELECT id, firstname, lastname, email, created_at FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/users/:id - Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.promisify.get(
      'SELECT id, firstname, lastname, email, created_at FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/users - Create new user
const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if email already exists
    const existingUser = await db.promisify.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password (in production, this should be handled properly)
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.promisify.run(
      'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
      [firstname, lastname, email, hashedPassword]
    );

    const user = await db.promisify.get(
      'SELECT id, firstname, lastname, email, created_at FROM users WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/users/:id - Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;

    // Check if user exists
    const existingUser = await db.promisify.get(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it already exists
    if (email) {
      const emailUser = await db.promisify.get(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      if (emailUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (firstname !== undefined) {
      updates.push('firstname = ?');
      values.push(firstname);
    }
    if (lastname !== undefined) {
      updates.push('lastname = ?');
      values.push(lastname);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password !== undefined) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    await db.promisify.run(sql, values);

    const updatedUser = await db.promisify.get(
      'SELECT id, firstname, lastname, email, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/users/:id - Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await db.promisify.get(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.promisify.run('DELETE FROM users WHERE id = ?', [id]);

    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
