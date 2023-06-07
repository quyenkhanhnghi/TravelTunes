const Review = require('../models/reviewModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
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

const createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'sucess',
    data: {
      review: newReview,
    },
  });
});

module.exports = { getAllReview, getReview, createReview };
