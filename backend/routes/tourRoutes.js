const express = require('express');

const { protect } = require('../controllers/authController');
const {
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
} = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

const tourRouter = express.Router();

// nested review route
tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/top-5-cheap').get(aliasTopTour, getAllTours);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

// /tour-within/233/center/-10,45/unit/mi
tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances);
tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:slug').get(protect, getTour);

tourRouter.route('/:id').patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
