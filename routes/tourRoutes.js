const express = require('express');

const {
  aliasTopTour,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const tourRouter = express.Router();

tourRouter.route('/top-5-cheap').get(aliasTopTour, getAllTours);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
