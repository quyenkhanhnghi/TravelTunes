const express = require('express');

const { protect, restricTo } = require('../controllers/authController');
const {
  getAllReview,
  getReview,
  setTourUserIds,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(getAllReview)
  .post(protect, restricTo('user', 'admin'), setTourUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(protect, restricTo('user', 'admin'), updateReview)
  .delete(protect, restricTo('user', 'admin'), deleteReview);
module.exports = reviewRouter;
