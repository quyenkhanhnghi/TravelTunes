const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/AppError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const cors = require('cors');

const app = express();

// Using pug templates
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static file
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(`${__dirname}/public`));

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too monay request. Please try again in an hour !',
});
app.use(limiter);

// Limit the body data size
app.use(express.json({ limit: '10kb' }));

// Data sanitizing against NoSQL query injection
app.use(mongoSanitize());

// Data sanitizing against XSS
app.use(xss());

// Preventing Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);

// 2 routes middleware
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 routes
// Body parses, reading body into req.body
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cannnot find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Cannnot find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  // create AppError class to handle for refactoring
  next(new AppError(`Cannnot find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// server
// index.js

module.exports = app;
