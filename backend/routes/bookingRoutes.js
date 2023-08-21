const express = require('express');
const { protect } = require('../controllers/authController');
const { getCheckout } = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.get('/checkout/:tourSlug', protect, getCheckout);

module.exports = bookingRouter;
