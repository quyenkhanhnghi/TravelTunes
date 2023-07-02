const Tour = require('../models/tourModel');
const Features = require('../utils/apiFeature');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

const aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/**
 * Get all tours
 * Authorization : Admin
 */
const getAllTours = factory.getAll(Tour);
// const getAllTours = catchAsync(async (req, res, next) => {
//   // Execute query
//   const features = new Features(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .fields()
//     .paginate();
//   const tours = await features.query;
//   //  3. Send response
//   res.status(200).json({
//     status: 'success',
//     length: tours.length,
//     data: tours,
//   });
// });

/**
 * Create a new tour
 * Authorization: Admin
 */

const createTour = factory.createOne(Tour);

/**
 * Get a tour based on the slug name
 * Parse the populate object into factory function / consider again
 */
// const getTour = factory.getOne(Tour, { path: 'reviews' });
const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    'reviews'
  );
  // same:
  // Tour.findById({ _id: req.params.id })
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

/**
 * Update a tour based on the id of the parameter
 * Authorization: Admin
 */
const updateTour = factory.updateOne(Tour);

/**
 * Delete a tour based on id from parameters
 * Authorization: Admin
 */
const deleteTour = factory.deleteOne(Tour);

/**
 * Get a tour statistics based on dividing group about difficulty
 */
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // sort not easy id
    // {
    //   $match: { _id: { $ne: 'easy' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numberTour: { $sum: 1 },
        nameTour: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numberTour: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
/**
 * Get Tour within the radius of the center
 */
// /tour-within/233/center/-10,45/unit/mi
const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(AppError('Please provide latitude and longitude'), 400);
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: tours,
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(AppError('Please provide latitude and longitude'), 400);
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

module.exports = {
  aliasTopTour,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
};
