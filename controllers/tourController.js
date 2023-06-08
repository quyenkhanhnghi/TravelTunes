const Tour = require('../models/tourModel');
const Features = require('../utils/apiFeature');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new Features(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  const tours = await features.query;
  //  3. Send response
  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: tours,
  });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'Fail to get all tours',
  //     message: error.message,
  //   });
  // }
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // try {
  //   const newTour = await Tour.create(req.body);
  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       tour: newTour,
  //     },
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'Fail to create tour',
  //     message: error.message,
  //   });
  // }
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
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
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'Fail to get tour',
  //     message: error.message,
  //   });
  // }
});

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'Fail to update tour',
  //     message: error.message,
  //   });
  // }
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }
  res.status(204).json({
    status: 'Sucessful delete',
    data: null,
  });
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'error',
  //     message: `Cannot find tour with id: ${req.params.id}`,
  //   });
  // }
  // } catch (error) {
  //   res.status(500).json({
  //     status: 'Fail to delete tour',
  //     message: error.message,
  //   });
  // }
});

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
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
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
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
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
};
