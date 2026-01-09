const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');
const { validateUser } = require('../middleware/validation.middleware');

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

// POST /api/users
router.post('/', validateUser, createUser);

// PUT /api/users/:id
router.put('/:id', validateUser, updateUser);

// DELETE /api/users/:id
router.delete('/:id', deleteUser);

module.exports = router;
