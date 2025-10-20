const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  login, 
  getMe, 
  updateProfile 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['customer', 'delivery', 'admin']),
  handleValidationErrors
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  body('role').isIn(['customer', 'delivery', 'admin']),
  handleValidationErrors
], login);

router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;