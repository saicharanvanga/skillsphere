const express = require('express');
const router = express.Router();
const {
  getMyPortfolio,
  getPublicPortfolio,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// Logged-in student's complete portfolio
router.get('/me', protect, getMyPortfolio);

// Public shareable portfolio
router.get('/public/:userId', getPublicPortfolio);

module.exports = router;
