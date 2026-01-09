const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { validateUser } = require('../middleware/validation.middleware');

// POST /api/auth/register
router.post('/register', validateUser, register);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
