const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Preventing duplicate reviews from 1 user on a tour
 */
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

/**
 * Populate the user information when query
 */
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Aggregration middleware for count Average Rating on a tour
reviewSchema.statics.calcAverageRating = async function (tourId) {
  const statics = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: null,
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  if (statics.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: statics[0].avgRating,
      ratingsQuantity: statics[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

// Use middeware to calculate average rating by function above
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.tour);
});

// Use middeware to calculate average rating by function if update or delete review
reviewSchema.post(/^findOneAnd/, async (docs) => {
  await docs.constructor.calcAverageRatings(docs.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
