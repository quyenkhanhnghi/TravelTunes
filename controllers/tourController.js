const Tour = require('../models/tourModel');

const aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
const getAllTours = async (req, res) => {
  try {
    // 1. Get query parameters
    console.log(req.query);
    const queryObj = { ...req.query };
    const notGetquery = ['limit', 'page', 'sort', 'fields'];
    notGetquery.forEach((el) => delete queryObj[el]);

    // 1b. Advanced query parameters
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));
    // 1c. Sort query parameters
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    // 1d Field query parameters
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // 1e Pagination query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;

    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page is not exist');
      }
    }
    // 2. Execute query

    const tours = await query;
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
