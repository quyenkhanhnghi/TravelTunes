const express = require('express');

const { protect, restricTo } = require('../controllers/authController');
const {
  getAllReview,
  getReview,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(getAllReview)
  .post(protect, restricTo('user'), createReview);

reviewRouter
  .route('/:id')
  .delete(protect, restricTo('user', 'admin'), deleteReview);
module.exports = reviewRouter;
