const fs = require('fs');
const Tour = require('../models/tourModel');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkId = (req, res, next, value) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid tour ID',
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Tour name or tour price is required',
    });
  }
  next();
};
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    length: tours.length,
    data: tours,
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated',
    },
  });
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const newTour = tours.filter((tour) => tour.id !== id);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newTour),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
};
