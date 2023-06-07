const express = require('express');

const { protect, restricTo } = require('../controllers/authController');
const {
  getAllReview,
  getReview,
  createReview,
} = require('../controllers/reviewController');

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(getAllReview)
  .post(protect, restricTo('user'), createReview);

module.exports = reviewRouter;
