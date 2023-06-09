const Review = require('../models/reviewModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

/**
 * Get all review from a tour / all tours
 */
const getAllReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    length: reviews.length,
    data: reviews,
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

/**
 * Create a new review from a login user
 * login and restrict to current user at current tour
 */
const createReview = catchAsync(async (req, res, next) => {
  req.body.tour ??= req.params.tourId;
  const { id: user } = req.user;
  // this user can change req.user
  // if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create({ ...req.body, user });
  res.status(201).json({
    status: 'sucess',
    data: {
      review: newReview,
    },
  });
});

/**
 * Delete a review with current user or admin
 */
const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (req.user.id !== review.user.id) {
    return next(
      new AppError('You do not have permission to do this action', 404)
    );
  }
});

module.exports = {
  getAllReview,
  getReview,
  createReview,
  deleteReview,
};
