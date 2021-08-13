const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const usersRouter = require('./routes/userRoute');
const toursRouter = require('./routes/tourRoute');
const reviewsRouter = require('./routes/reviewRoute');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// 1) Global middleware
// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Security HTTP headers
app.use(helmet());
// Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/', limiter);
// Body purser, reading data from bodu into req.body in this case bodies larger than 10kb  will now be accepted
app.use(express.json({ limit: '10kb' }));

// Date sanitization against NoSQL query injection
app.use(mongoSanitize());

// Date sanitization against xxs
app.use(xss());

// prevent parameter pollution exp: repeated parammeter but we can specify a whitelist
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// serving static files
app.use(express.static(`${__dirname}/public`));
// request time middle ware
app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/api/users', usersRouter);
app.use('/api/tours', toursRouter);
app.use('/reviews', reviewsRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
