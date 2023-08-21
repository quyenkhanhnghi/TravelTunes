const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find({});
  // 2.Build template
  // 3. Render template using collected data
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
const getTour = (_req, res) => {
  res.status(200).render('tour', {
    title: 'Hi Duy Anh',
  });
};

module.exports = { getOverview, getTour };
