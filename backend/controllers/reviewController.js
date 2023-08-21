const Review = require('../models/reviewModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

/**
 * Get all review from all tours
 */
const getAllReview = factory.getAll(Review);

/**
 * Get a review based on review id
 */
const getReview = factory.getOne(Review);

/**
 * Set current Tour and current User ids before creating a new review
 * @param {*} req
 * @param {*} next
 */
const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // Make sure the user cannot change their id
  req.body.user = req.user.id;
  next();
};

/**
 * Create a new review from a login user
 * login and restrict to current user at current tour
 */
const createReview = factory.createOne(Review);

/**
 * Update a review
 */
const updateReview = factory.updateOne(Review);
/**
 * Delete a review with current user or admin
 * Not use handleFactory because have to check same user
 */
const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (req.user.id !== review.user._id.toString()) {
    return next(
      new AppError('You do not have permission to do this action', 404)
    );
  }
  await Review.deleteOne(req.params._id);
  res.status(204).json({
    status: 'Sucessful delete',
    data: null,
  });
});

module.exports = {
  getAllReview,
  getReview,
  setTourUserIds,
  createReview,
  updateReview,
  deleteReview,
};
