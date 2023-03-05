const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} = require('../TravelTunes/controllers/tourController');

const tourRouter = express.Router();

tourRouter.param('id', checkId);

tourRouter.route('/').get(getAllTours).post(checkBody, createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
