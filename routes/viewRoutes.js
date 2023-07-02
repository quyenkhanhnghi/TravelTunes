const express = require('express');
const { getOverview, getTour } = require('../controllers/viewController');

const viewRouter = express.Router();

viewRouter.get('/', getOverview);
viewRouter.get('/tour', getTour);

module.exports = viewRouter;
