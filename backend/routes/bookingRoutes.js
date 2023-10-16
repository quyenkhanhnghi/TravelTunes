const express = require('express');
const { protect, restricTo } = require('../controllers/authController');
const { getCheckout } = require('../controllers/bookingController');
const bookingController = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.use(protect);

bookingRouter.get('/checkout/:tourSlug', protect, getCheckout);
bookingRouter.use(restricTo('admin', 'lead-guide'));

bookingRouter
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

bookingRouter
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = bookingRouter;
