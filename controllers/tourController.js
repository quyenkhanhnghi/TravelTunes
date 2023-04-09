const Tour = require('../models/tourModel');
const Features = require('../utils/apiFeature');

const aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'Fail to get all tours',
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail to create tour',
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // same:
    // Tour.findById({ _id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail to get tour',
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'Fail to update tour',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({
        status: 'error',
        message: `Cannot find tour with id: ${req.params.id}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Fail to delete tour',
      message: error.message,
    });
  }
};

module.exports = {
  aliasTopTour,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
