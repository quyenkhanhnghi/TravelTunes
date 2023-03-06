const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const tourRouter = express.Router();

// eslint-disable-next-line prettier/prettier
tourRouter.route('/').get(getAllTours).post(createTour);

// eslint-disable-next-line prettier/prettier
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
